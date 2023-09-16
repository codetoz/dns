import { getServers as getDnsServers } from 'dns'
import { get_interfaces_list as getNetworkInterfacesList } from 'network'
import { commandOptions } from './options'
import { PlatformEnum } from './platform.enum'
import { ICommandHandler } from './handler.interface'
import { IDnsProvider, dnsProviders } from '../data'
import {
  execute,
  getPlatform,
  isAdmin,
  isNetsh,
  message,
  packageVersion,
} from '../helpers'

export class CommandHandler implements ICommandHandler {
  isMac: boolean
  isLinux: boolean
  isWindows: boolean

  constructor() {}

  async init() {
    const osType = await getPlatform()
    this.isMac = osType.includes(PlatformEnum.MACOS)
    this.isLinux = osType.includes(PlatformEnum.LINUX)
    this.isWindows = osType.includes(PlatformEnum.WINDOWS)
  }

  private async set(ips: string[]) {
    if (this.isMac) {
      const ipString = ips.reduce((prev, current) => `${prev}${current} `, '')

      await execute(`networksetup -setdnsservers Wi-Fi ${ipString}`)
      return true
    }

    if (this.isLinux) {
      const ipString = ips.reduce(
        (prev, current) => `${prev}\nnameserver ${current}`,
        ''
      )

      await execute(`echo "${ipString}" > /etc/resolv.conf`)
      return true
    }

    if (this.isWindows) {
      const isAdministrator = isAdmin()
      if (!isAdministrator) {
        message('Administrator privilege are required to change DNS settings')
        return false
      }

      return new Promise((resolve, reject) => {
        getNetworkInterfacesList(async function (err, obj: { name: string }[]) {
          if (err) reject(err)
          try {
            const interfaces = obj
            // set DNS servers per ethernet interface
            for (const inf in interfaces) {
              if (isNetsh() /*|| windowsPreferNetsh === true*/) {
                await execute(
                  `netsh interface ipv4 set dns name="${interfaces[inf].name}" static "${ips[0]}" primary`
                )
                await execute(
                  `netsh interface ipv4 add dns name="${interfaces[inf].name}" "${ips[1]}" index=2`
                )
              } else {
                await execute(
                  `powershell Set-DnsClientServerAddress -InterfaceAlias '${interfaces[inf].name}' -ServerAddresses '${ips[0]},${ips[1]}'`
                )
              }
            }
            await execute('ipconfig /flushdns')
            resolve(true)
          } catch (e) {
            resolve(false)
          }
        })
      })
    }
  }

  private async get(): Promise<string> {
    if (this.isWindows) {
      const isAdministrator = isAdmin()
      if (!isAdministrator) {
        message('Administrator privilege are required to change DNS settings')
        return null
      }
    }

    const ips = getDnsServers()
    if (ips !== null && ips.length >= 1) {
      const name = dnsProviders.find((opt) =>
        opt.ips.find((optionIp) => optionIp === ips[0])
      )?.name
      return name ?? ''
    }

    return ''
  }

  async setDns(args: string[]) {
    if (args.length < 2) {
      message('Provide a DNS name from list of options\n')
      this.list()
      return
    }

    const option = dnsProviders.find((opt) => opt.name === args[1])

    if (!option) {
      message('Provide a valid DNS name\n')
      this.list()
      return
    }

    const successful = await this.set(option.ips)

    successful && message(`DNS Set [${option.name}]`)
  }

  async changeDns(): Promise<void> {
    const currentDnsName = await this.get()
    this.printCurrentDnsName(currentDnsName)
    const option = this.getRandomOption(dnsProviders, [
      currentDnsName,
      'google',
    ])
    const successful = await this.set(option.ips)
    successful && message(`DNS Set [${option.name}]`)
  }

  async removeDns(): Promise<void> {
    if (this.isMac) {
      await execute('networksetup -setdnsservers Wi-Fi "empty"')
      message('DNS Removed')
    }

    if (this.isLinux || this.isWindows) {
      const googleDns = dnsProviders.find((dns) => dns.name === 'google')

      if (googleDns) {
        const successful = await this.set(googleDns.ips)
        successful && message('DNS Removed')
      }
    }
  }

  async showCurrentDns(): Promise<void> {
    const dnsName = await this.get()
    this.printCurrentDnsName(dnsName)
  }

  version(): void {
    message(`Package Version: ${packageVersion}`)
  }

  async help(): Promise<void> {
    await this.showCurrentDns()
    message('Commands:')
    console.table(commandOptions)
  }

  list(): void {
    console.table(dnsProviders)
  }

  private printCurrentDnsName(dnsName: string): void {
    if (dnsName) message(`Current DNS: [${dnsName}]`)
    else if (dnsName === '') message('Current DNS: No DNS')
    else return
  }

  private getRandomOption(list: IDnsProvider[], excludeNames: string[]) {
    const filtered = list.filter(
      (option) => !excludeNames.includes(option.name)
    )
    return filtered[Math.floor(Math.random() * filtered.length)]
  }
}

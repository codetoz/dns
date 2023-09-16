import { getServers as getDnsServers } from 'dns'
import { get_interfaces_list as getNetworkInterfacesList } from 'network'
import { ICommandHandler } from './handler.interface'
import {
  execute,
  getPlatform,
  isAdmin,
  isNetsh,
  message,
  packageVersion,
} from '../helpers'
import { commandOptions } from './options'
import { IDnsProvider, dnsProviders } from '../data'
import { PlatformEnum } from './platform.enum'

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
      const isAdministrator = await isAdmin()
      if (!isAdministrator) {
        message('Administrator privilege are required to change DNS settings')
        return false
      }

      getNetworkInterfacesList(async function (err, obj: { name: string }[]) {
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
        return true
      })
    }
  }

  private async get(): Promise<string> {
    // let currentDns = "";
    let currentDnsName = ''

    // if (isMac) currentDns = await execute("networksetup -getdnsservers Wi-Fi");

    // if (isLinux) currentDns = await execute("cat /etc/resolv.conf");

    // const ipPattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;

    // let ips = ipPattern.exec(currentDns);
    // if (ips !== null && ips.length > 1) {
    //   currentDnsName = dnsOptions.find((opt) =>
    //     opt.ips.find((optionIp) => optionIp === ips[0])
    //   )?.name;
    // }

    // return currentDnsName;

    if (this.isWindows) {
      const isAdministrator = await isAdmin()
      if (!isAdministrator) {
        message('Administrator privilege are required to change DNS settings')
        return null
      }
    }

    const ips = getDnsServers()
    if (ips !== null && ips.length >= 1) {
      currentDnsName = dnsProviders.find((opt) =>
        opt.ips.find((optionIp) => optionIp === ips[0])
      )?.name
    }
    return currentDnsName
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
    if (this.isMac) await execute('networksetup -setdnsservers Wi-Fi "empty"')

    if (this.isLinux) {
      const ipString = 'nameserver 8.8.8.8\nnameserver 8.8.4.4'

      await execute(`echo "${ipString}" > /etc/resolv.conf`)
    }

    message('DNS Removed')
  }

  async showCurrentDns(): Promise<void> {
    const dnsName = await this.get()
    this.printCurrentDnsName(dnsName)
  }

  version(): void {
    message(`Package Version: ${packageVersion}`)
  }

  help(): void {
    message('Commands:')
    console.table(commandOptions)
  }

  list(): void {
    console.table(dnsProviders)
  }

  private async printCurrentDnsName(dnsName: string) {
    if (dnsName) message(`Current DNS: [${dnsName}]`)
    else message('Current DNS: No DNS')
  }

  private getRandomOption(list: IDnsProvider[], excludeNames: string[]) {
    const filtered = list.filter(
      (option) => !excludeNames.includes(option.name)
    )
    return filtered[Math.floor(Math.random() * filtered.length)]
  }
}

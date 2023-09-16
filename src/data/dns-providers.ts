import { IDnsProvider } from './dns-provider.interface'

export const dnsProviders: IDnsProvider[] = [
  {
    name: 'shecan',
    ips: ['178.22.122.100', '185.51.200.2'],
    address: 'https://shecan.ir/',
  },
  {
    name: '403',
    ips: ['10.202.10.202', '10.202.10.102'],
    address: 'https://403.online/',
  },
  {
    name: 'server',
    ips: ['194.104.158.48', '194.104.158.78'],
    address: 'https://server.ir',
  },
  {
    name: 'hostiran',
    ips: ['172.29.0.100', '172.29.2.100'],
    address: 'https://hostiran.net/landing/proxy',
  },
  {
    name: 'begzar',
    ips: ['185.55.226.26', '185.55.225.25'],
    address: 'https://begzar.ir/',
  },
  {
    name: 'electro',
    ips: ['78.157.42.100', '78.157.42.101'],
    address: 'https://electrotm.org/',
  },
  {
    name: 'radar',
    ips: ['10.202.10.10', '10.202.10.11'],
    address: 'https://radar.game/#/dns',
  },
  {
    name: 'asiatech',
    ips: ['194.36.174.161', '178.22.122.100'],
    address: 'https://asiatech.cloud/',
  },
  {
    name: 'asrenovin',
    ips: ['46.224.1.42', '178.22.122.100'],
    address: '',
  },
  {
    name: 'tums',
    ips: ['194.225.62.80', '178.22.122.100'],
    address: '',
  },
  {
    name: 'pishgaman',
    ips: ['5.202.100.101', '178.22.122.100'],
    address: '',
  },
  {
    name: 'parsonline',
    ips: ['91.99.101.12', '178.22.122.100'],
    address: '',
  },
  {
    name: 'cloud',
    ips: ['1.1.1.1', '1.0.0.1'],
    address: 'https://www.cloudflare.com/',
  },
  {
    name: 'google',
    ips: ['8.8.8.8', '8.8.4.4'],
    address: 'https://google.com',
  },
]

import { ICommandOption } from './option.interface'

export const commandOptions: ICommandOption[] = [
  { name: 'dns [-s|set] <dns-name>', desc: 'Set Chosen DNS' },
  { name: 'dns [-alt|alter|change]', desc: 'Set Random Dns' },
  { name: 'dns [-r|rm|remove|clear]', desc: 'Remove DNS' },
  { name: 'dns [-c|crt|current]', desc: 'Show Current DNS' },
  { name: 'dns [-l|ls|list]', desc: 'List DNS Options' },
  { name: 'dns [-v|--version|version]', desc: 'Package Version' },
  { name: 'dns [-h|help]', desc: 'List Commands' },
]

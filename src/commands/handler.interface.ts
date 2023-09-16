export interface ICommandHandler {
  help: () => Promise<void>
  list: () => void
  setDns: (args: string[]) => Promise<void>
  removeDns: () => Promise<void>
  showCurrentDns: () => Promise<void>
  changeDns: () => Promise<void>
  version: () => void
}

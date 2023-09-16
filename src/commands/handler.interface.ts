export interface ICommandHandler {
  help: () => void
  list: () => void
  setDns: (args: string[]) => Promise<void>
  removeDns: () => Promise<void>
  showCurrentDns: () => Promise<void>
  changeDns: () => Promise<void>
  version: () => void
}

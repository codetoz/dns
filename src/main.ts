import { CommandHandler } from './commands'

async function bootstrap(): Promise<void> {
  const args = process.argv.slice(2)

  const commandsHandler = new CommandHandler()
  await commandsHandler.init()

  if (/(-s)|(set)/.test(args[0])) {
    await commandsHandler.setDns(args)
    return
  }

  if (/(-a)|(alter)|(change)/.test(args[0])) {
    await commandsHandler.changeDns()
    return
  }

  if (/(-r)|(rm)|(remove)|(clear)/.test(args[0])) {
    await commandsHandler.removeDns()
    return
  }

  if (/(-c)|(crt)|(current)/.test(args[0])) {
    await commandsHandler.showCurrentDns()
    return
  }

  if (/(-l)|(ls)|(list)/.test(args[0])) {
    commandsHandler.list()
    return
  }

  if (/(-v)|(--version)|(version)/.test(args[0])) {
    commandsHandler.version()
    return
  }

  if (/()|(-h)|(help)/.test(args[0])) {
    commandsHandler.help()
    return
  }
}

bootstrap()

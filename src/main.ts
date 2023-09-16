import { CommandHandler, commandPatterns } from './commands'

async function bootstrap(): Promise<void> {
  const args = process.argv.slice(2)

  const commandsHandler = new CommandHandler()
  await commandsHandler.init()

  if (commandPatterns.SET.test(args[0])) {
    await commandsHandler.setDns(args)
    return
  }

  if (commandPatterns.ALT.test(args[0])) {
    await commandsHandler.changeDns()
    return
  }

  if (commandPatterns.RM.test(args[0])) {
    await commandsHandler.removeDns()
    return
  }

  if (commandPatterns.CRT.test(args[0])) {
    await commandsHandler.showCurrentDns()
    return
  }

  if (commandPatterns.LS.test(args[0])) {
    commandsHandler.list()
    return
  }

  if (commandPatterns.VERSION.test(args[0])) {
    commandsHandler.version()
    return
  }

  if (commandPatterns.HELP.test(args[0])) {
    commandsHandler.help()
    return
  }
}

bootstrap()

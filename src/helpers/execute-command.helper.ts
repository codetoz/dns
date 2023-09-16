import { exec } from 'child_process'
import { message } from './message.helper'

export const execute = async (command: string): Promise<string> => {
  return new Promise(function (resolve) {
    exec(command, (err, stdout) => {
      resolve(stdout)
      if (err) {
        message(`exec error: ${err}\n`, 'command: ', command)
      }
    })
  })
}

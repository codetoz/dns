import { platform } from 'os'
import { env } from 'node:process'
import { exec } from 'child_process'

const testFltmc = async () => {
  try {
    exec('fltmc')
    return true
  } catch {
    return false
  }
}

export const isAdmin = async () => {
  if (platform() !== 'win32') {
    return false
  }

  try {
    exec(`fsutil dirty query ${env.systemdrive}`)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return testFltmc()
    }

    return false
  }
}

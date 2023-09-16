import { platform } from 'os'

export const getPlatform = async (): Promise<string> => {
  return platform()
}

import { release } from 'os'

export const isNetsh = (): boolean => {
  // if version is Windows 7 or below use netsh
  var releaseVer = release().split('.')

  return (
    (parseInt(releaseVer[0]) <= 6 && parseInt(releaseVer[1]) <= 1) ||
    parseInt(releaseVer[0]) == 5
  )
}

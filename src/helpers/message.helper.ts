export const message = (...message: string[]): void => {
  const prefix = '🥷'

  console.log(prefix, ...message)
}

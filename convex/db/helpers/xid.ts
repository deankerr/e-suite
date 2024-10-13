const entityCode = {
  thread: 't',
  message: 'm',
  image: 'i',
  run: 'r',
  pattern: 'p',
}

const epoch = new Date('2022-04-18').getTime()

export function xid(entityType: keyof typeof entityCode): string {
  const timestamp = (Date.now() - epoch).toString(36)
  const randomPart = Math.random().toString(36).substring(2, 5)

  return `${timestamp}${entityCode[entityType]}${randomPart}`
}

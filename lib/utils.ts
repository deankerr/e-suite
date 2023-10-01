export function raise(message: string): never {
  throw new Error(message)
}

export function env(key: string) {
  return process.env[key] ?? raise(`${key} not provided`)
}

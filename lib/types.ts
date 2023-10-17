export type ExcludeNullProps<T> = {
  [P in keyof T]: Exclude<T[P], null>
}

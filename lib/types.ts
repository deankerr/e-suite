export type ExcludeNullProps<T> = {
  [P in keyof T]: Exclude<T[P], null>
}

export type ExtractPropsOfType<Target, ExtractType> = {
  [P in keyof Target as Target[P] extends ExtractType ? P : never]: Target[P]
}

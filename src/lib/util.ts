export const now   = () => Math.floor(Date.now() / 1000)
export const sleep = (ms : number = 1000) => new Promise(res => setTimeout(res, ms))

export function create_timeout <T> (
  promise  : Promise<T>,
  timeout  : number
) : Promise<T> {
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => reject('timeout'), timeout)
    const res   = await promise
    clearTimeout(timer)
    resolve(res)
  })
}

export function sort_obj <
  T extends Record<keyof T, any>
> (obj : T) : T {
  if (obj instanceof Map || Array.isArray(obj) || typeof obj !== 'object') {
    return obj
  } else {
    return Object.keys(obj)
      .sort()
      .filter(([ _, value ]) => value !== undefined)
      .reduce<Record<string, any>>((sorted, key) => {
        sorted[key] = obj[key as keyof T]
        return sorted
      }, {}) as T
  }
}

export function parse_error (err : unknown) : string {
  if (err instanceof Error)    return err.message
  if (typeof err === 'string') return err
  return String(err)
}

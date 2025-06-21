const DEFAULT_TIMEOUT = 300_000 // 5 minutes

export class Mutex {
  private _mutex   : Promise<void> = Promise.resolve()
  private _timeout : number

  constructor(timeout = DEFAULT_TIMEOUT) {
    this._timeout = timeout
  }

  get timeout () : number {
    return this._timeout
  }

  async lock () : Promise<() => void> {
    let resolve: () => void = () => {}
    const newMutex = new Promise<void>((res) => {
      resolve = res
    })

    const promise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('mutex timeout')), this._timeout)
    })

    const oldMutex = this._mutex
    this._mutex = Promise.race([ newMutex, promise ])

    await oldMutex
    return resolve
  }

  async acquire <T> (fn: () => Promise<T>) : Promise<T> {
    const release = await this.lock()
    try {
      return await fn()
    } finally {
      release()
    }
  }
} 
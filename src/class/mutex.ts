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

  /**
   * Acquire the mutex.
   * @returns A function to release the mutex.
   */
  async lock () : Promise<() => void> {
    // Define a variable to resolve the mutex.
    let resolve: () => void = () => {}
    // Create a new promise to resolve the mutex.
    const next_mutex = new Promise<void>((res) => {
      resolve = res
    })
    // Define a promise to reject the mutex if it times out.
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('mutex timeout')), this._timeout)
    })
    // Define a variable to store the previous mutex.
    const prev_mutex = this._mutex
    // Update the mutex to the new promise.
    this._mutex = next_mutex
    // Wait for the mutex to be released.
    await Promise.race([ prev_mutex, timeout ])
    // Return the release function.
    return resolve
  }

  /**
   * Acquire the mutex and execute a function.
   * @param fn - The function to execute.
   * @returns The result of the function.
   */
  async acquire <T> (fn: () => Promise<T>) : Promise<T> {
    // Acquire the mutex.
    const release = await this.lock()
    // Try to execute the function.
    try {
      // Execute the function.
      return await fn()
    } finally {
      // Release the mutex.
      release()
    }
  }
} 
export type QueueMethod<T> = (
  resolve : (value: T | PromiseLike<T>) => void,
  reject  : (reason?: any) => void
) => Promise<T>

export type QueueEntry<T> = {
  fn      : QueueMethod<T>
  resolve : (value: T | PromiseLike<T>) => void
  reject  : (reason?: any) => void
}

export interface QueueConfig {
  batch_size : number
  batch_ival : number
}

export class Queue <T = unknown>{

  private readonly _config : QueueConfig

  private _queue : QueueEntry<T>[]
  private _timer : NodeJS.Timeout | null

  constructor (config : QueueConfig) {
    this._config = config

    this._queue  = []
    this._timer  = null
  }

  get config () {
    return this._config
  }

  get queue () {
    return this._queue
  }

  get length () {
    return this._queue.length
  }

  get timer () {
    return this._timer
  }

  private _schedule () {
    if (this._timer === null) {
      this._timer = setTimeout(() => this._process(), this.config.batch_ival)
    }
  }

  private _process () {
    // Clear the timer.
    this._timer = null
    // If the queue is empty, return.
    if (this._queue.length === 0) return
    // Create an array of promises.
    const proms : Promise<T>[] = []
    // If the queue is less than the batch size,
    if (this._queue.length <= this.config.batch_size) {
      // Add all the requests to the promises array.
      proms.push(...this._queue.map(e => e.fn(e.resolve, e.reject)))
      // Clear the queue.
      this._queue = []
    } else {
      // Get the index of the batch size.
      const index = Math.min(this._queue.length, this.config.batch_size)
      // Get up to the batch size.
      const batch = this._queue.slice(0, index)
      // Add all the requests to the promises array.
      proms.push(...batch.map(e => e.fn(e.resolve, e.reject)))
      // Remove the batch from the queue.
      this._queue = this._queue.slice(index)
      // Schedule the next batch.
      this._schedule()
    }
    // Return a promise to resolve all the promises.
    return Promise.all(proms)
  }

  public async push (fn : QueueMethod<T>) : Promise<T> {
    return new Promise((resolve, reject) => {
      // Add the request to the queue
      this._queue.push({ fn, resolve, reject })
      // Schedule batch processing if not already scheduled.
      this._schedule()
    })
  }
}

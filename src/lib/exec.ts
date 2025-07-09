export type ExecResult<T = any> = OkResult<T> | ErrResult

export interface OkResult<T = any> {
  ok     : true
  data   : T
  error? : any
}

export interface ErrResult {
  ok    : false
  data? : any
  error : string
}

export namespace Execute {
  export type Type<T> = ExecResult<T>
  export const fn     = wrap_function
  export const prom   = wrap_promise
}

export namespace Result {
  export type Type<T> = ExecResult<T>
  export const ok     = result_ok
  export const err    = result_err
}

function result_ok <T = any> (data : T) : OkResult<T> {
  return { ok : true, data, error : null }
}

function result_err (err : unknown) : ErrResult {
  const msg = (err instanceof Error) ? err.message : String(err)
  return { ok : false, data : null, error : msg }
}

function wrap_function <T = any> (fn : () => T) : ExecResult<T> {
  try {
    return result_ok(fn())
  } catch (err) {
    return result_err(err)
  }
}

async function wrap_promise <T = any> (
  promise  : Promise<T>,
  timeout? : number
) : Promise<ExecResult<T>> {
  // Create a timer for the promise.
  let timer : NodeJS.Timeout
  // Return a new promise.
  return new Promise<ExecResult<T>>((resolve) => {
    if (timeout) {
      // Handle timeout.
      timer = setTimeout(() => {
        resolve(result_err('timeout'))
      }, timeout)
    }
    // Handle original promise.
    promise
      .then(data => {
        clearTimeout(timer)
        resolve(result_ok(data))
      })
      .catch(err => {
        clearTimeout(timer)
        resolve(result_err(err))
      })
  })
}

export type Result<T = any> = DataResult<T> | ErrorResult

export interface DataResult<T = any> {
  ok    : true
  data  : T
  error : null
}

export interface ErrorResult {
  ok    : false
  data  : null
  error : string
}

export namespace Return {
  export type Type<T = any> = Result<T>
  export type Data<T = any> = DataResult<T>
  export type Error         = ErrorResult

  export function data <T = any> (data : T) : DataResult<T> {
    return { ok : true, data, error : null }
  }

  export function error (err : string) : ErrorResult {
    return { ok : false, data : null, error : err }
  }

  export function wrap <T = any> (fn : () => T) : Result<T> {
    try {
      return data(fn())
    } catch (err) {
      return error(parse_error(err))
    }
  }
}

function parse_error (err : unknown) : string {
  if (err instanceof Error) {
    return err.message
  }
  return String(err)
}
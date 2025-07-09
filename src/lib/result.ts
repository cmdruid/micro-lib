export type ReturnResult<T = any> = OkResult<T> | ErrResult

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

export namespace Result {
  export const ok   = result_ok
  export const err  = result_err
  export const wrap = wrap_fn
}

function result_ok <T = any> (data : T) : OkResult<T> {
  return { ok : true, data, error : null }
}

function result_err (err : unknown) : ErrResult {
  const msg = (err instanceof Error) ? err.message : String(err)
  return { ok : false, data : null, error : msg }
}

function wrap_fn <T = any> (fn : () => T) : ReturnResult<T> {
  try {
    return result_ok(fn())
  } catch (err) {
    return result_err(err)
  }
}

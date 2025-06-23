import { z } from 'zod'

import { sort_obj, parse_error } from './util.js'

export type ApiResponse<T> = DataResponse<T> | ErrorResponse

export interface DataResponse<T> {
  ok     : true
  data   : T
  status : number
}

export interface ErrorResponse {
  ok     : false
  error  : string
  status : number
}

export namespace Fetch {

  export async function json <T> (
    input : URL | RequestInfo,
    init ?: RequestInit,
    fetcher = fetch
  ) {
    // Fetch response using fetcher.
    const res = await fetcher(input, init)
    // Resolve response as json.
    return resolve_json<T>(res)
  }

  export async function text (
    input : URL | RequestInfo,
    init ?: RequestInit,
    fetcher = fetch
  ) {
    // Fetch response using fetcher.
    const res = await fetcher(input, init) 
    // Resolve response as text.
    return resolve_text(res)
  }

  /**
   * Helper method for resolving json from HTTP responses.
   */
  async function resolve_json <T = Record<string, any>> (
    res : Response
  ) : Promise<ApiResponse<T>> {
    // Try to resolve the data:
    if (!res.ok) {
      return resolve_error(res)
    } else {
      const data = await res.json() as T
      return { status: res.status, ok: true, data }
    }
  }

  /**
   * Helper method for resolving text from HTTP responses.
   */
  async function resolve_text (
    res : Response
  ) : Promise<ApiResponse<string>> {
    // Unpack response object.
    // Try to resolve the data:
    if (!res.ok) {
      return resolve_error(res)
    } else {
      const data = await res.text()
      return { status: res.status, ok: true, data }
    }
  }

  /**
   * Helper method for resolving text from HTTP responses.
   */
  async function resolve_error (
    res : Response
  ) : Promise<ErrorResponse> {
    // Unpack response object.
    const { status, statusText } = res
    // Try to resolve the data:
    let error : string
    try {
      error = await res.text()
    } catch {
      error = statusText
    }
    return { error, status, ok: false }
  }
}

export namespace Resolve {

  export function data <T> (
    data   : T,
    status : number = 200
  ) : DataResponse<T> {
    data = (data !== null && data !== undefined)
      ? sort_obj(data)
      : data
    return { ok: true, status, data }
  }

  export function schema <S extends z.ZodTypeAny> (
    data   : unknown,
    schema : S,
    err_code = 600
  ) : ApiResponse<z.infer<S>> {
    const parsed = schema.safeParse(data)
    return parsed.success
      ? { ok: true,  status: 200, data: parsed.data }
      : { ok: false, status: err_code, error: parsed.error.toString() }
  }

  export function error (
    error  : unknown,
    status : number = 600
  ) : ErrorResponse {
    const msg = parse_error(error)
    return { ok: false, status, error: msg }
  }

  export function reject (
    reason : string,
    status : number = 600
  ) : ErrorResponse {
    return { ok: false, status, error: reason }
  }
}

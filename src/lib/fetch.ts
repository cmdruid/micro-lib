import { sort_obj, parse_error } from './util.js'

import type { JsonData } from '../types.js'

export type ApiResponse<T> = ApiDataResponse<T> | ApiErrorResponse

export interface ApiDataResponse<T> {
  ok     : true
  data   : T
  status : number
}

export interface ApiErrorResponse {
  ok     : false
  error  : string
  status : number
}

export namespace Fetch {

  export async function json (
    input : URL | RequestInfo,
    init ?: RequestInit,
    fetcher = fetch
  ) {
    // Fetch response using fetcher.
    const res = await fetcher(input, init)
    // Resolve response as json.
    return resolve_json(res)
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
  async function resolve_json (
    res : Response
  ) : Promise<ApiResponse<JsonData>> {
    // Try to resolve the data:
    if (!res.ok) {
      return resolve_error(res)
    } else {
      const data = await res.json()
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
  ) : Promise<ApiErrorResponse> {
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
  ) : ApiDataResponse<T> {
    data = (data !== null && data !== undefined)
      ? sort_obj(data)
      : data
    return { ok: true, status, data }
  }

  export function error (
    error  : unknown,
    status : number = 600
  ) : ApiErrorResponse {
    const msg = parse_error(error)
    return { ok: false, status, error: msg }
  }

  export function reject (
    reason : string,
    status : number = 600
  ) : ApiErrorResponse {
    return { ok: false, status, error: reason }
  }
}

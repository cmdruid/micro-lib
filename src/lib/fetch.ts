import { sort_obj } from './util.js'

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
  export type Type<T> = ApiResponse<T>
  export const json = fetch_json
  export const text = fetch_text
}

export namespace Respond {
  export type Type<T> = ApiResponse<T>
  export const json  = json_response
  export const text  = text_response
  export const error = error_response
}

export async function fetch_json (
  input : URL | RequestInfo,
  init ?: RequestInit,
  fetcher = fetch
) {
  // Fetch response using fetcher.
  const res = await fetcher(input, init)
  // Resolve response as json.
  if (!res.ok) {
    return resolve_error(res)
  } else {
    const data = await res.json()
    return { status: res.status, ok: true, data }
  }
}

export async function fetch_text (
  input : URL | RequestInfo,
  init ?: RequestInit,
  fetcher = fetch
) {
  // Fetch response using fetcher.
  const res = await fetcher(input, init) 
  // Resolve response as text.
  if (!res.ok) {
    return resolve_error(res)
  } else {
    const data = await res.text()
    return { status: res.status, ok: true, data }
  }
}

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

function json_response (
  data   : JsonData,
  status : number = 200
) : ApiDataResponse<JsonData> {
  data = (data !== null && data !== undefined)
    ? sort_obj(data)
    : data
  return { ok: true, status, data }
}

function text_response (
  data   : string,
  status : number = 200
) : ApiDataResponse<string> {
  return { ok: true, status, data }
}

function error_response (
  error  : unknown,
  status : number = 600
) : ApiErrorResponse {
  const msg = (error instanceof Error) ? error.message : String(error)
  return { ok: false, status, error: msg }
}
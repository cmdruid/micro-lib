import { sha256 } from '@noble/hashes/sha2'

import {
  createBase58check,
  base64,
  base64urlnopad,
  bech32,
  bech32m
} from '@scure/base'

export namespace B58chk {
  export const assert   = assert_base58

  export const encode   = (data : Uint8Array) => {
    assert_uint(data)
    return createBase58check(sha256).encode(data)
  }

  export const decode   = (data : string) => {
    assert_base58(data)
    return createBase58check(sha256).decode(data)
  }

  export const is_valid = is_base58
}

export namespace Base64 {
  export const assert   = assert_base64

  export const encode   = (data : Uint8Array) => {
    assert_uint(data)
    return base64.encode(data)
  }

  export const decode   = (data : string) => {
    assert_base64(data)
    return base64.decode(data)
  }

  export const is_valid = is_base64
}

export namespace B64url {
  export const assert   = assert_b64url

  export const encode   = (data : Uint8Array) => {
    assert_uint(data)
    return base64urlnopad.encode(data)
  }

  export const decode   = (data : string) => {
    assert_b64url(data)
    return base64urlnopad.decode(data)
  }

  export const is_valid = is_b64url
}

export namespace Bech32 {
  export const assert   = assert_bech32
  export const to_words = bech32.toWords
  export const to_bytes = bech32.fromWords

  export const encode = (
    prefix : string,
    words  : number[],
    limit  : number | false = false
  ) => {
    assert_prefix(prefix)
    assert_words(words)
    return bech32.encode(prefix, words, limit)
  }

  export const decode = (
    data  : string,
    limit : number | false = false
  ) => {
    assert_bech32(data)
    const { prefix, words } = bech32.decode(data, limit)
    return { prefix, words }
  }

  export const is_valid = is_bech32
}

export namespace Bech32m {
  export const assert   = assert_bech32
  export const to_words = bech32m.toWords
  export const to_bytes = bech32m.fromWords

  export const encode = (
    prefix : string,
    words  : number[],
    limit  : number | false = false
  ) => {
    assert_prefix(prefix)
    assert_words(words)
    return bech32m.encode(prefix, words, limit)
  }

  export const decode = (
    data  : `${string}1${string}`,
    limit : number | false = false
  ) => {
    assert_bech32(data)
    const { prefix, words } = bech32m.decode(data, limit)
    return { prefix, words }
  }

  export const is_valid = is_bech32
}


function is_base58 (value : unknown) : value is string {
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(value as string)
}

function assert_base58 (value : unknown) : asserts value is string {
  if (!is_base58(value)) {
    throw new Error('invalid base58 string')
  }
}
function is_base64 (value : unknown) : value is string {
  return /^[a-zA-Z0-9+/]+={0,2}$/.test(value as string)
}

export function assert_base64 (value : unknown) : asserts value is string {
  if (!is_base64(value)) {
    throw new Error('invalid base64 string')
  }
}

function is_b64url (value : unknown) : value is string {
  return /^[a-zA-Z0-9\-_]+={0,2}$/.test(value as string)
}

function assert_b64url (value : unknown) : asserts value is string {
  if (!is_b64url(value)) {
    throw new Error('invalid base64url string')
  }
}

function is_bech32 (value : unknown) : value is `${string}1${string}` {
  return /^[a-z]+1[023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ]+$/.test(value as string)
}

function assert_bech32 (value : unknown) : asserts value is `${string}1${string}` {
  if (!is_bech32(value)) {
    throw new Error('invalid bech32 string')
  }
}

function assert_prefix (value : unknown) : asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`invalid prefix: ${String(value)}`)
  }
}

function assert_uint (value : unknown) : asserts value is Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw new Error(`invalid uint array: ${String(value)}`)
  }
}

function assert_words (value : unknown) : asserts value is number[] {
  if (!(
    Array.isArray(value) &&
    value.every(word => typeof word === 'number')
  )) {
    throw new Error(`invalid words: ${String(value)}`)
  }
}

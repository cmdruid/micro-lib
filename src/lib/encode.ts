import { sha256 } from '@noble/hashes/sha2'
import { Assert } from './assert.js'

import {
  createBase58check,
  base64,
  base64urlnopad,
  bech32,
  bech32m
} from '@scure/base'

export namespace B58chk {
  export const encode = (data : Uint8Array) => {
    Assert.is_u8a(data)
    return createBase58check(sha256).encode(data)
  }

  export const decode = (data : string) => {
    Assert.is_base58(data)
    return createBase58check(sha256).decode(data)
  }
}

export namespace Base64 {
  export const encode   = (data : Uint8Array) => {
    Assert.is_u8a(data)
    return base64.encode(data)
  }

  export const decode   = (data : string) => {
    Assert.is_base64(data)
    return base64.decode(data)
  }
}

export namespace B64url {
  export const encode   = (data : Uint8Array) => {
    Assert.is_u8a(data)
    return base64urlnopad.encode(data)
  }

  export const decode   = (data : string) => {
    Assert.is_b64url(data)
    return base64urlnopad.decode(data)
  }
}

export namespace Bech32 {
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
    Assert.is_bech32(data)
    return bech32.decode(data, limit)
  }
}

export namespace Bech32m {
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
    data  : string,
    limit : number | false = false
  ) => {
    Assert.is_bech32(data)
    return bech32m.decode(data, limit)
  }
}

function assert_prefix (value : unknown) : asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`invalid prefix: ${String(value)}`)
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

import { sha256 } from '@noble/hashes/sha2'

import {
  createBase58check,
  base64,
  base64urlnopad,
  bech32,
  bech32m
} from '@scure/base'

export namespace B58chk {
  export const encode = (data : Uint8Array) => createBase58check(sha256).encode(data)
  export const decode = (data : string)     => createBase58check(sha256).decode(data)
}

export namespace Base64 {
  export const encode = (data : Uint8Array) => base64.encode(data)
  export const decode = (data : string)     => base64.decode(data)
}

export namespace B64url {
  export const encode = (data : Uint8Array) => base64urlnopad.encode(data)
  export const decode = (data : string)     => base64urlnopad.decode(data)
}

export namespace Bech32 {
  export const to_words = bech32.toWords
  export const to_bytes = bech32.fromWords

  export const encode = (
    prefix : string,
    words  : number[],
    limit  : number | false = false
  ) => {
    return bech32.encode(prefix, words, limit)
  }

  export const decode = (
    data  : `${string}1${string}`,
    limit : number | false = false
  ) => {
    const { prefix, words } = bech32.decode(data, limit)
    return { prefix, words }
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
    return bech32m.encode(prefix, words, limit)
  }

  export const decode = (
    data  : `${string}1${string}`,
    limit : number | false = false
  ) => {
    const { prefix, words } = bech32m.decode(data, limit)
    return { prefix, words }
  }
}

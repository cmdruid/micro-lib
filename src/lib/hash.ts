import { Buff, Buffable } from '@vbyte/buff'

import { hmac as noble_hmac }      from '@noble/hashes/hmac'
import { pbkdf2 as noble_pbkdf2 }  from '@noble/hashes/pbkdf2'
import { ripemd160 as noble_r160 } from '@noble/hashes/legacy'

import {
  sha256 as noble_s256,
  sha512 as noble_s512
} from '@noble/hashes/sha2'

export function hash160 (
  ...input : Buffable[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = noble_r160(noble_s256(buffer))
  return new Buff(digest)
}

export function sha256 (
  ...input : Buffable[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = noble_s256(buffer)
  return new Buff(digest)
}

export function hash256 (
  ...input : Buffable[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = noble_s256(noble_s256(buffer))
  return new Buff(digest)
}

export function hashtag (tag : string) : Buff {
  const hash = sha256(Buff.str(tag))
  return Buff.join([ hash, hash ])
}

export function hash340 (
  tag      : string,
  ...input : Buffable[]
) : Buff {
  const htag = hashtag(tag)
  const data = input.map(e => new Buff(e))
  const pimg = Buff.join([ htag, ...data ])
  return sha256(pimg)
}

export function hmac256 (
  key      : Buffable,
  ...input : Buffable[]
) : Buff {
  const mask   = new Buff(key)
  const buffer = Buff.join(input)
  const digest = noble_hmac(noble_s256, mask, buffer)
  return new Buff(digest)
}

export function hmac512 (
  key      : Buffable,
  ...input : Buffable[]
) : Buff {
  const mask   = new Buff(key)
  const buffer = Buff.join(input)
  const digest = noble_hmac(noble_s512, mask, buffer)
  return new Buff(digest)
}

export function pkdf256 (
  secret   : Buffable,
  salt     : Buffable,
  options? : Partial<{ c: number, dk_len: number }>
) : Buff {
  const { c = 1, dk_len = 32 } = options ?? {}
  const sec_u8  = new Buff(secret)
  const salt_u8 = new Buff(salt)
  const digest  = noble_pbkdf2(noble_s256, sec_u8, salt_u8, { c, dkLen: dk_len })
  return new Buff(digest)
}

export function pkdf512 (
  secret   : Buffable,
  salt     : Buffable,
  options? : Partial<{ c: number, dk_len: number }>
) : Buff {
  const { c = 1, dk_len = 32 } = options ?? {}
  const sec_u8  = new Buff(secret)
  const salt_u8 = new Buff(salt)
  const digest  = noble_pbkdf2(noble_s512, sec_u8, salt_u8, { c, dkLen: dk_len })
  return new Buff(digest)
}

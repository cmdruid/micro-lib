import { Buff } from '@vbyte/buffy'

import { ripemd160 as r160 } from '@noble/hashes/legacy'
import { sha256 as s256 }    from '@noble/hashes/sha2'

export function hash160 (
  ...input : (string | Uint8Array)[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = r160(s256(buffer))
  return new Buff(digest)
}

export function sha256 (
  ...input : (string | Uint8Array)[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = s256(buffer)
  return new Buff(digest)
}

export function hash256 (
  ...input : (string | Uint8Array)[]
) : Buff {
  const buffer = Buff.join(input)
  const digest = s256(s256(buffer))
  return new Buff(digest)
}

export function hashtag (tag : string) : Buff {
  const hash = sha256(Buff.str(tag))
  return Buff.join([ hash, hash ])
}

export function hash340 (
  tag      : string,
  ...input : (string | Uint8Array)[]
) : Buff {
  const htag = hashtag(tag)
  const data = input.map(e => Buff.bytes(e))
  const pimg = Buff.join([ htag, ...data ])
  return sha256(pimg)
}

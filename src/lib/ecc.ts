import { Buff }   from '@vbyte/buff'
import { Assert } from './validate.js'

import { secp256k1, schnorr }  from '@noble/curves/secp256k1'
import { Field }               from '@noble/curves/abstract/modular'

type ECCPoint = ReturnType<typeof secp256k1.Point.fromHex>

const _0n = BigInt(0)
const _2n = BigInt(2)

const _N  = secp256k1.CURVE.n
const FD  = Field(_N, 32, true)
const GP  = secp256k1.Point.BASE

export namespace ECC {
  export const get_format       = ecc_get_pubkey_format
  export const get_seckey       = ecc_get_seckey
  export const get_pubkey       = ecc_get_pubkey
  export const lift_point       = ecc_lift_point
  export const serialize_pubkey = ecc_serialize_pubkey
  export const sign_ecdsa       = ecc_sign_ecdsa
  export const sign_bip340      = ecc_sign_bip340
  export const tweak_seckey     = ecc_tweak_seckey
  export const tweak_pubkey     = ecc_tweak_pubkey
  export const verify_seckey    = ecc_verify_seckey
  export const verify_pubkey    = ecc_verify_pubkey
  export const verify_sig       = ecc_verify_signature
}

/**
 * Get the secret key from the given secret.
 * 
 * @param secret - The secret to get the secret key from.
 * @param even_y - Whether the y-coordinate should be even.
 * @returns The secret key.
 */
function ecc_get_seckey (
  secret : string | Uint8Array,
  even_y : boolean = false
) : Buff {
  // Convert the secret to a bigint, modulo the curve order.
  let sk = ecc_serialize_bytes(secret).big % _N
  // If the format is bip340:
  if (even_y) {
    // Multiply the generator point by the secret.
    const pt = GP.multiply(sk)
    // Return the secret.
    return (pt.y % _2n === _0n)
      // If the y-coordinate is even, return the secret.
      ? Buff.big(sk)
      // If the y-coordinate is odd, return the complement.
      : Buff.big(_N - sk)
  } else {
    // If the format is ecdsa, return the secret.
    return Buff.big(sk)
  }
}

/**
 * Get the public key from the given secret key.
 * 
 * @param seckey - The secret key to get the public key from.
 * @param format - The format of the public key.
 * @returns The public key.
 */
function ecc_get_pubkey (
  seckey : string | Uint8Array,
  format : 'bip340' | 'ecdsa'
) : Buff {
  // Convert the secret to a bigint.
  const sk = ecc_serialize_bytes(seckey).big
  // Multiply the generator point by the secret.
  const pt = GP.multiply(sk)
  // Return the public key.
  const pk = pt.toHex(true)
  // Normalize the public key.
  return ecc_serialize_pubkey(pk, format)
}

/**
 * Tweak the given secret key with the given tweak.
 * 
 * @param seckey - The secret key to tweak.
 * @param tweak  - The tweak to apply to the secret key.
 * @param even_y - Whether the y-coordinate should be even.
 * @returns The tweaked secret key.
 */
function ecc_tweak_seckey (
  seckey : string | Uint8Array,
  tweak  : string | Uint8Array,
  even_y : boolean = false
) : Buff {
  // Convert the secret key to bigint.
  const sk  = ecc_serialize_bytes(seckey).big
  // Convert the tweak to bigint.
  const twk = ecc_serialize_bytes(tweak).big
  // Add the key and tweak, modulo the curve order.
  const tweaked_sk = FD.add(sk, twk)
  // Convert the tweaked key to bytes.
  const new_secret = Buff.big(tweaked_sk)
  // Return the tweaked secret key.
  return ecc_get_seckey(new_secret, even_y)
}

/**
 * Tweak the given public key with the given tweak.
 * 
 * @param pubkey - The public key to tweak.
 * @param tweak  - The tweak to apply to the public key.
 * @param even_y - Whether the y-coordinate should be even.
 * @returns The tweaked public key.
 */
function ecc_tweak_pubkey (
  pubkey : string | Uint8Array,
  tweak  : string | Uint8Array,
  format : 'bip340' | 'ecdsa',
  even_y : boolean = false
) : Buff {
  // Convert the tweak to a bigint.
  const twk_big  = ecc_serialize_bytes(tweak).big
  // Convert the public key to a projective point.
  const pub_pt   = ecc_lift_point(pubkey)
  // Lift the tweak to a projective point.
  const tweak_pt = GP.multiply(twk_big)
  // Add the tweak to the public key.
  let tweaked_pt = pub_pt.add(tweak_pt)
  // If the format is bip340 and the y-coordinate is odd,
  if (even_y && !tweaked_pt.hasEvenY()) {
    // Negate the point.
    tweaked_pt = tweaked_pt.negate()
  }
  // Convert the tweaked point to a hex string.
  const pk = tweaked_pt.toHex(true)
  // Return the normalized public key.
  return ecc_serialize_pubkey(pk, format)
}

/**
 * Verify the given secret key.
 * 
 * @param seckey - The secret key to verify.
 */
function ecc_verify_seckey (
  seckey : string | Uint8Array
) : asserts seckey is string {
  // Convert the secret key to bytes.
  const sk = ecc_serialize_bytes(seckey)
  // Assert the secret key is valid.
  Assert.size(sk, 32,    'ecdsa secret keys must be 32 bytes long')
  Assert.ok(sk.big < _N, 'ecdsa secret keys must be less than the curve order')
  Assert.ok(sk.big > 0,  'ecdsa secret keys must be greater than zero')
}

/**
 * Verify the given public key.
 * 
 * @param pubkey - The public key to verify.
 * @param format - The format of the public key.
 */
function ecc_verify_pubkey (
  pubkey : string | Uint8Array,
  format : 'bip340' | 'ecdsa'
) {
  // Convert the public key to bytes.
  const pk = ecc_serialize_bytes(pubkey)
  // Assert the public key format is valid.
  if (format === 'bip340') {
    Assert.size(pk, 32, 'bip340 public keys must be 32 bytes long')
  } else if (format === 'ecdsa') {
    Assert.size(pk, 33, 'ecdsa public keys must be 33 bytes long')
  } else {
    throw new Error('invalid format: ' + format)
  }
  // Verify the point.
  ecc_verify_point(pk)
}

/**
 * Sign the given message with the given secret key.
 * 
 * @param seckey  - The secret key to sign the message with.
 * @param message - The message to sign.
 * @returns The signature.
 */
function ecc_sign_ecdsa (
  seckey  : string | Uint8Array,
  message : string | Uint8Array
) : Buff {
  const msg = ecc_serialize_bytes(message)
  const sig = secp256k1.sign(msg, seckey).toDERRawBytes()
  return Buff.bytes(sig)
}

/**
 * Sign the given message with the given secret key.
 * 
 * @param seckey  - The secret key to sign the message with.
 * @param message - The message to sign.
 * @returns The signature.
 */
function ecc_sign_bip340 (
  seckey  : string | Uint8Array,
  message : string | Uint8Array
) : Buff {
  const msg = ecc_serialize_bytes(message)
  const sig = schnorr.sign(msg, seckey)
  return ecc_serialize_bytes(sig)
}

/**
 * Verify the given signature.
 * 
 * @param signature - The signature to verify.
 * @param message   - The message to verify the signature against.
 * @param pubkey    - The public key to verify the signature against.
 * @param format    - The format of the public key.
 */
function ecc_verify_signature (
  signature : string | Uint8Array,
  message   : string | Uint8Array,
  pubkey    : string | Uint8Array,
  format    : 'bip340' | 'ecdsa'
) : boolean {
  const sig = ecc_serialize_bytes(signature)
  const msg = ecc_serialize_bytes(message)
  const pk  = ecc_serialize_pubkey(pubkey, format)
  return (format === 'bip340')
    ? schnorr.verify(sig, msg, pk)
    : secp256k1.verify(sig, msg, pk)
}

/**
 * Verify the given pubkey is a valid point
 * on the secp256k1 curve.
 * 
 * @param pubkey - The pubkey to verify.
 */
function ecc_verify_point (
  pubkey : string | Uint8Array
) : asserts pubkey is string {
  try {
    const pt = ecc_lift_point(pubkey)
    pt.assertValidity()
  } catch (err) {
    throw new Error('invalid secp256k1 point: ' + pubkey)
  }
}

/**
 * Lift the given public key to an ECC point.
 * 
 * @param pubkey - The public key to lift.
 * @returns The lifted public key.
 */
function ecc_lift_point (
  pubkey : string | Uint8Array
) : ECCPoint {
  try {
    const pk = ecc_serialize_pubkey(pubkey, 'ecdsa')
    return secp256k1.ProjectivePoint.fromHex(pk)
  } catch (err) {
    throw new Error('invalid pubkey: ' + pubkey)
  }
}

/**
 * Serialize the given public key.
 * 
 * @param pubkey - The public key to serialize.
 * @param format - The format of the public key.
 * @returns The serialized public key.
 */
function ecc_serialize_pubkey (
  pubkey : string | Uint8Array,
  format : 'bip340' | 'ecdsa'
) : Buff {
  try {
    const pk = ecc_serialize_bytes(pubkey)
    if (pk.length === 33 && format === 'bip340') {
      return pk.slice(1)
    } else if (pk.length === 32 && format === 'ecdsa') {
      const prefix = Buff.num(0x02, 1)
      return Buff.join([ prefix, pk ])
    } else {
      return pk
    }
  } catch (err) {
    throw new Error('invalid pubkey: ' + String(pubkey))
  }
}

/**
 * Get the format of the given public key.
 * 
 * @param pubkey - The public key to get the format of.
 * @returns The format of the public key.
 */
function ecc_get_pubkey_format (
  pubkey : string | Uint8Array
) : 'bip340' | 'ecdsa' {
  const pk = ecc_serialize_bytes(pubkey)
  if (pk.length === 33) return 'ecdsa'
  if (pk.length === 32) return 'bip340'
  throw new Error('invalid pubkey: ' + String(pubkey))
}

/**
 * Serialize the given bytes into a buffer object.
 * 
 * @param bytes - The bytes to serialize.
 * @returns The serialized bytes as a buffer object.
 */
function ecc_serialize_bytes (bytes : string | Uint8Array) : Buff {
  try {
    return Buff.bytes(bytes)
  } catch (err) {
    throw new Error('invalid bytes: ' + String(bytes))
  }
}

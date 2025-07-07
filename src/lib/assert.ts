import { Buff, Bytes } from '@vbyte/buff'
import { Test }       from './test.js'

export namespace Assert {
  export function ok (
    value    : unknown,
    message ?: string
  ) : asserts value {
    if (value === false) {
      throw new Error(message ?? 'Assertion failed!')
    }
  }

  export function exists <T> (
    value : T | null,
    msg  ?: string
    ) : asserts value is NonNullable<T> {
    if (!Test.exists(value)) {
      throw new Error(msg ?? 'Value is null or undefined!')
    }
  }

  export function is_empty (value : unknown, msg ?: string) : asserts value is null | undefined {
    if (value !== null && value !== undefined) {
      throw new Error(msg ?? 'value is not null or undefined!')
    }
  }

  export function is_instance <T> (value : unknown, type : new () => T, msg ?: string) : asserts value is T {
    if (!(value instanceof type)) {
      throw new Error(msg ?? `value is not an instance of ${type.name}`)
    }
  }

  export function is_equal (a : unknown, b : unknown, msg ?: string) : asserts a is typeof b {
    if (!Test.is_equal(a, b)) {
      throw new Error(msg ?? `values are not equal: ${String(a)} !== ${String(b)}`)
    }
  }

  export function is_object (value : unknown, msg ?: string) : asserts value is Record<string, any> {
    if (!Test.is_object(value)) {
      throw new Error(msg ?? `value is not an object: ${String(value)}`)
    }
  }

  export function is_deep_equal (a : unknown, b : unknown, msg ?: string) : asserts a is typeof b {
    if (!Test.is_deep_equal(a, b)) {
      throw new Error(msg ?? `values are not deep equal: ${String(a)} !== ${String(b)}`)
    }
  }

  export function is_number (value : unknown) : asserts value is number {
    if (!Test.is_number(value)) {
      throw new TypeError(`invalid number: ${String(value)}`)
    }
  }

  export function is_bigint (value : unknown) : asserts value is bigint {
    if (!Test.is_bigint(value)) {
      throw new TypeError(`invalid bigint: ${String(value)}`)
    }
  }

  export function is_hex (value : unknown) : asserts value is string {
    if (!Test.is_hex(value)) {
      throw new TypeError(`invalid hex: ${String(value)}`)
    }
  }

  export function is_uchar (value : unknown) : asserts value is number {
    if (!Test.is_uchar(value)) {
      throw new TypeError(`invalid unsignedchar: ${String(value)}`)
    }
  }

  export function is_ushort (value : unknown) : asserts value is number {
    if (!Test.is_ushort(value)) {
      throw new TypeError(`invalid unsigned short: ${String(value)}`)
    }
  }

  export function is_uint (value : unknown) : asserts value is Uint8Array {
    if (!Test.is_uint(value)) {
      throw new TypeError(`invalid unsigned int: ${String(value)}`)
    }
  }

  export function is_u8a (value : unknown) : asserts value is Uint8Array {
    if (!Test.is_u8a(value)) {
      throw new TypeError(`invalid Uint8Array: ${String(value)}`)
    }
  }

  export function is_hash (value : unknown, msg ?: string) : asserts value is string {
    if (!Test.is_hash(value)) {
      throw new TypeError(msg ?? `invalid hash: ${String(value)}`)
    }
  }

  export function is_bytes (value : unknown, msg ?: string) : asserts value is Bytes {
    if (!Test.is_bytes(value)) {
      throw new TypeError(msg ?? `invalid bytes: ${String(value)}`)
    }
  }

  export function size (input : Bytes, size : number, msg ?: string) : void {
    const bytes = Buff.bytes(input)
    if (bytes.length !== size) {
      throw new Error(msg ?? `invalid input size: ${bytes.length} !== ${size}`)
    }
  }

  export function has_items (array : unknown, err_msg? : string) : asserts array is any[] {
    if (!Test.has_items(array)) {
      throw new Error(err_msg ?? 'array does not contain any items')
    }
  }

  export function is_base58 (value : unknown) : asserts value is string {
    if (!Test.is_base58(value)) {
      throw new Error('invalid base58 string')
    }
  }
  
  export function is_base64 (value : unknown) : asserts value is string {
    if (!Test.is_base64(value)) {
      throw new Error('invalid base64 string')
    }
  }
  
  export function is_b64url (value : unknown) : asserts value is string {
    if (!Test.is_b64url(value)) {
      throw new Error('invalid base64url string')
    }
  }

  export function is_bech32 (value : unknown) : asserts value is `${string}1${string}` {
    if (!Test.is_bech32(value)) {
      throw new Error('invalid bech32 string')
    }
  }
}
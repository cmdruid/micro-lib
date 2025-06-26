import { Buff, Bytes } from '@vbyte/buff'
import { sort_obj }    from './util.js'

export namespace Test {

  export function exists <T> (
    value ?: T | null
  ) : value is NonNullable<T> {
    if (typeof value === 'undefined' || value === null) {
      return false
    }
    return true
  }

  export function is_equal (a : unknown, b : unknown) : boolean {
    return a === b
  }

  export function is_object (value : unknown) : value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  export function is_deep_equal (a : unknown, b : unknown) : boolean {
    if (is_object(a)) a = sort_obj(a)
    if (is_object(b)) b = sort_obj(b)
    return String(a) === String(b)
  }

  export function has_items (array : unknown) : array is any[] {
    return Array.isArray(array) && array.length > 0
  }

  export function is_string (value : unknown) : value is string {
    return typeof value === 'string'
  }

  export function is_number (value : unknown) : value is number {
    return Number.isInteger(value) && !Number.isNaN(value)
  }

  export function is_bigint (value : unknown) : value is bigint {
    return typeof value === 'bigint'
  }

  export function is_uchar (value : unknown) : value is number {
    return is_number(value) && value >= 0 && value <= 0xFF
  }

  export function is_ushort (value : unknown) : value is number {
    return is_number(value) && value >= 0 && value <= 0xFFFF
  }

  export function is_uint (value : unknown) : value is number {
    return is_number(value) && value >= 0 && value <= 0xFFFFFFFF
  }

  export function is_u8array (value : unknown) : value is Uint8Array {
    return value instanceof Uint8Array
  }

  export function is_bytes (value : unknown) : value is Bytes {
    return Buff.is_bytes(value)
  }

  export function is_base58 (value : unknown) : boolean {
    if (typeof value !== 'string') return false
    return /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(value)
  }
  
  export function is_base64 (value : unknown) : boolean {
    if (typeof value !== 'string') return false
    return /^[a-zA-Z0-9+/]+={0,2}$/.test(value)
  }

  export function is_b64url (value : unknown) : boolean {
    if (typeof value !== 'string') return false
    return /^[a-zA-Z0-9\-_]+={0,2}$/.test(value)
  }
  
  export function is_bech32 (value : unknown) : boolean {
    if (typeof value !== 'string') return false
    return /^[a-z]+1[023456789acdefghjklmnpqrstuvwxyz]+$/.test(value)
  }

  export function is_hex (value : unknown) : boolean {
    if (!is_string(value)) return false
    return (value.match(/[^a-fA-F0-9]/) === null && value.length % 2 === 0)
  }

  export function is_hash (value : unknown) : boolean {
    return (is_string(value) && is_hex(value) && value.length === 64)
  }
}
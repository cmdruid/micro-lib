# CHANGELOG

## [1.1.1]

- Updated dependencies.

## [1.1.0]

- Updated packages.
- Made changes to `ECC` interface.

## [1.0.18]

- Fixed type bug with `fetch` library.

## [1.0.17]

- Further refinements to `fetch` library.

## [1.0.16]

- Further refined `exec` (formerly `result`) and `fetch` libraries.

## [1.0.15]

- Refactored interface for `Logger`. Now is a namespace with multiple options, and better option initialization.

- Refactored `wrap` into `result`.

- Made some changes to `fetch` library to better type JSON and remove zod dependency.

- Added JSON types to the library.

- Updates `EventEmitter` class to better handle multiple arguments natively.

## [1.0.14]

- Fixed bug with encoder checking for `uint` instead of `u8a` (u8 Array).

## [1.0.13]

- Fixed bug with secret key tweaking.
- Split `verify_signature` into specifc methods for ECDSA and BIP340.

## [1.0.12]

- Added new assertions.
- Updated packages.

## [1.0.11]

### Changes

- Added new hash methods (hmac, pkdf).

## [1.0.10]

- Initial release.
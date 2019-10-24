# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.1](https://github.com/simbachain/libsimba-js/compare/v0.5.0...v0.5.1) (2019-10-24)


### Bug Fixes

* **simba:** set axios adapter for nodejs ([a5a76ea](https://github.com/simbachain/libsimba-js/commit/a5a76eae86369872220a85c3b87a5380a07b5e81))

## [0.5.0](https://github.com/simbachain/libsimba-js/compare/v0.4.2...v0.5.0) (2019-10-24)


### ⚠ BREAKING CHANGES

* **requests:** All requests moved from fetch to axios

* **requests:** moved to Axios for cross env https requests ([9b70da4](https://github.com/simbachain/libsimba-js/commit/9b70da4f2b204c64e1bba38ccf8067f4a61c998b))

### [0.4.2](https://github.com/simbachain/libsimba-js/compare/v0.4.1...v0.4.2) (2019-10-24)


### Bug Fixes

* **library:** add fetch polyfill for nodejs ([9fd246c](https://github.com/simbachain/libsimba-js/commit/9fd246c))

### [0.4.1](https://github.com/simbachain/libsimba-js/compare/v0.4.0...v0.4.1) (2019-10-24)

## [0.4.0](https://github.com/simbachain/libsimba-js/compare/v0.3.21...v0.4.0) (2019-10-23)


### ⚠ BREAKING CHANGES

* **library:** May cause some issues in browsers

### Bug Fixes

* **library:** build code such that it works in both browser and nodejs ([6b04f35](https://github.com/simbachain/libsimba-js/commit/6b04f35))

### [0.3.21](https://github.com/simbachain/libsimba-js/compare/v0.3.20...v0.3.21) (2019-10-23)


### Bug Fixes

* **wallet:** localwallet detect if running in browser or not ([0354c90](https://github.com/simbachain/libsimba-js/commit/0354c90))


### Features

* **pkwallet:** properly export pkwallet ([1abab24](https://github.com/simbachain/libsimba-js/commit/1abab24))

### [0.3.20](https://github.com/simbachain/libsimba-js/compare/v0.3.19...v0.3.20) (2019-10-23)


### Features

* **wallet:** add new PK Wallet ([bc7cb9b](https://github.com/simbachain/libsimba-js/commit/bc7cb9b))

### [0.3.19](https://github.com/simbachain/libsimba-js/compare/v0.3.18...v0.3.19) (2019-10-18)

### [0.3.18](https://github.com/simbachain/libsimba-js/compare/v0.3.17...v0.3.18) (2019-10-16)


### Bug Fixes

* **simba:** Fix nonce error catching ([dda6d89](https://github.com/simbachain/libsimba-js/commit/dda6d89))

### [0.3.17](https://github.com/simbachain/libsimba-js/compare/v0.3.15...v0.3.17) (2019-10-14)

### [0.3.16](https://github.com/simbachain/libsimba-js/compare/v0.3.15...v0.3.16) (2019-10-14)

### [0.3.15](https://github.com/simbachain/libsimba-js/compare/v0.3.14...v0.3.15) (2019-09-23)


### Bug Fixes

* **simbabase:** fix file validation code ([b2621a3](https://github.com/simbachain/libsimba-js/commit/b2621a3))

### [0.3.14](https://github.com/simbachain/libsimba-js/compare/v0.3.13...v0.3.14) (2019-09-20)


### Features

* **simba:** add support for getFileFromBundleByNameForTransaction ([30b6423](https://github.com/simbachain/libsimba-js/commit/30b6423))

### [0.3.13](https://github.com/simbachain/libsimba-js/compare/v0.3.12...v0.3.13) (2019-09-20)


### Bug Fixes

* **bundles:** fix bundle manifest call returning b64 encoded files ([644895d](https://github.com/simbachain/libsimba-js/commit/644895d))

### [0.3.12](https://github.com/simbachain/libsimba-js/compare/v0.3.11...v0.3.12) (2019-09-19)


### Features

* **simba:** add bundle operations ([dbe0911](https://github.com/simbachain/libsimba-js/commit/dbe0911))

### [0.3.11](https://github.com/simbachain/libsimba-js/compare/v0.3.10...v0.3.11) (2019-09-18)


### Bug Fixes

* **documentation:** fix missing defs on documentation strings ([89b796d](https://github.com/simbachain/libsimba-js/commit/89b796d))

### [0.3.10](https://github.com/simbachain/libsimba-js/compare/v0.3.9...v0.3.10) (2019-09-18)


### Bug Fixes

* various build pipeline fixes ([d0e90f3](https://github.com/simbachain/libsimba-js/commit/d0e90f3))

### [0.3.9](https://github.com/simbachain/libsimba-js/compare/v0.3.8...v0.3.9) (2019-09-18)

### [0.3.8](https://github.com/simbachain/libsimba-js/compare/v0.3.7...v0.3.8) (2019-09-18)

### [0.3.8](https://github.com/simbachain/libsimba-js/compare/v0.3.7...v0.3.8) (2019-09-18)

### [0.3.7](https://github.com/simbachain/libsimba-js/compare/v0.3.6...v0.3.7) (2019-09-18)

### [0.3.6](https://github.com/simbachain/libsimba-js/compare/v0.3.5...v0.3.6) (2019-09-18)

### [0.3.5](https://github.com/simbachain/libsimba-js/compare/v0.3.4...v0.3.5) (2019-09-18)

### [0.3.4](https://github.com/simbachain/libsimba-js/compare/v0.3.3...v0.3.4) (2019-09-18)


### Bug Fixes

* **libsimba.js:** add babel transform-async-to-generator to fix library usage ([3191579](https://github.com/simbachain/libsimba-js/commit/3191579))

### [0.3.3](https://github.com/simbachain/libsimba-js/compare/v0.3.2...v0.3.3) (2019-09-18)

### [0.3.2](https://github.com/simbachain/libsimba-js/compare/v0.3.1...v0.3.2) (2019-09-18)


### Bug Fixes

* **build:** fix project build ([080794e](https://github.com/simbachain/libsimba-js/commit/080794e))

### [0.3.1](https://github.com/simbachain/libsimba-js/compare/v0.2.0...v0.3.1) (2019-09-18)


### Bug Fixes

* **pagedresponse:** fix bad url handling for next/prev page ([f54a6b1](https://github.com/simbachain/libsimba-js/commit/f54a6b1))


### Features

* **simba:** add new getTransaction and getTransactions calls ([44a11ae](https://github.com/simbachain/libsimba-js/commit/44a11ae))

### [0.2.1](https://github.com/simbachain/libsimba-js/compare/v0.1.2...v0.2.1) (2019-09-18)


### Features

* **simba:** add getMethodTransactions ([5ddd187](https://github.com/simbachain/libsimba-js/commit/5ddd187))
* **simba:** added validation for method calls ([9a379d6](https://github.com/simbachain/libsimba-js/commit/9a379d6))
* **simba:** implement callMethodWithFile ([d1ed35a](https://github.com/simbachain/libsimba-js/commit/d1ed35a))

### [0.1.3](https://github.com/simbachain/libsimba-js/compare/v0.1.0...v0.1.3) (2019-09-18)


### Bug Fixes

* **simbabase:** drop duplicated not implemented check ([ee93ed0](https://github.com/simbachain/libsimba-js/commit/ee93ed0))

### 0.1.1 (2019-09-17)


### Features

* commit the initial codebase ([5ceab1b](https://github.com/simbachain/libsimba-js/commit/5ceab1b))

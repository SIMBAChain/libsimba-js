<h1 align="center">Welcome to libsimba-js</h1>
<p>
  <a href="https://www.npmjs.com/package/@simbachain/libsimba-js">
    <img alt="npm" src="https://img.shields.io/npm/dw/@simbachain/libsimba-js?style=flat">  
  </a>
  <a href="https://libsimbajs.simbachain.com/">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg?style=flat" target="_blank" />
  </a>
  <a href="https://github.com/SIMBAChain/libsimba-js/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat" target="_blank" />
  </a>
  <img alt="azure" src="https://dev.azure.com/SimbaChain/libSimba/_apis/build/status/SIMBAChain.libsimba-js-develop?branchName=develop">
</p>

> libsimba-js is a library simplifying the use of SIMBAChain APIs. We aim to abstract away the various blockchain concepts, reducing the necessary time needed to get to working code.

### [🏠 Homepage](https://github.com/simbachain/libsimba-js#readme)
### [📝 Documentation](https://libsimbajs.simbachain.com/)

## Install

```sh
npm install @simbachain/libsimba-js
```

## Usage

- ES2105 module import
```javascript
import * as libsimba from '@simbachain/libsimba-js';
libsimba.getSimbaInstance(...);
```
- CommonJS module require
```javascript
const libsimba  = require('@simbachain/libsimba-js');
libsimba.getSimbaInstance(...);
```
- AMD module require
```javascript
require(['@simbachain/libsimba-js'], function (libsimba) {
    libsimba.getSimbaInstance(...);
});
```
- `<script>` tag import
```html
<!doctype html>
<html>
  ...
  <script src="./dist/libsimba.js"></script>
  <script>
    // ...
    // Global variable
    libsimba.getSimbaInstance(...);
    // Property in the window object
    window.libsimba.getSimbaInstance(...);
    // ...
  </script>
</html>
```

## Examples

See [here](https://libsimbajs.simbachain.com/example.html)

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/simbachain/libsimba-js/issues).

## License

Copyright © 2019 [SIMBAChain Inc](https://simbachain.com/).<br />
This project is [MIT](https://github.com/SIMBAChain/libsimba-js/blob/master/LICENSE) licensed.

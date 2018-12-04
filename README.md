# DashPay DAP
=====================

[![NPM Package](https://img.shields.io/npm/v/@dashevo/dashpay-dap.svg?style=flat-square)](https://www.npmjs.org/package/@dashevo/dashpay-dap)
[![Build Status](https://img.shields.io/travis/dashevo/dashpay-dap.svg?branch=master&style=flat-square)](https://travis-ci.org/dashevo/dashpay-dap)
[![Coverage Status](https://img.shields.io/coveralls/dashevo/dashpay-dap.svg?style=flat-square)](https://coveralls.io/github/dashevo/dashpay-dap?branch=master)

A Plugin for Wallet-Lib providing DashPay DAP features.

Relies on :
- [Wallet-Lib](https://github.com/dashevo/wallet-lib)

## Principles

Dash is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Dash network allows for highly resilient Dash infrastructure, and the developer community needs reliable, open-source tools to implement Dash apps and services.

## Usage

In your current node project, just type `npm install @dashevo/dashpay-dap --save-exact` to install.

In your initialization of your wallet object, just add `DashPayDAP` in the plugins array parameter.

```
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDAP = require('@dashevo/dashpay-dap');


const wallet = new Wallet({
  plugins: [DashPayDAP],
  allowSensitiveOperations: true
});
```

The `allowSensitiveOperations` has to be set at true. As we require an access to
the keychain in order to sign a RegTx.

Any plugin requiring this boolean to be true, should have extra look and be installed and fixed to a specific version.
Futures updates should then be manual and go through a whole check again.

## Features

- [X] Register DashPayDAP Schema
- [X] Register a blockchain username
- [X] Broadcast transition
- [X] Search/Get BU.
- [ ] Top Up account
- [ ] Pay To Username
- [ ] Contact logic
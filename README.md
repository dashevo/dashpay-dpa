# DashPay DPA
=====================

[![NPM Package](https://img.shields.io/npm/v/@dashevo/dashpay-dpa.svg?style=flat-square)](https://www.npmjs.org/package/@dashevo/dashpay-dpa)
[![Build Status](https://github.com/dashevo/dashpay-dpa/actions/workflows/test_and_release.yml/badge.svg)](https://github.com/dashevo/dashpay-dpa/actions/workflows/test_and_release.yml)
[![Coverage Status](https://img.shields.io/coveralls/dashevo/dashpay-dpa.svg?style=flat-square)](https://coveralls.io/github/dashevo/dashpay-dpa?branch=master)

A wallet-lib plugin for DashPay DPA features

Relies on :
- [Wallet-Lib](https://github.com/dashevo/wallet-lib)

## Table of Contents

- [State](#state)
- [Principles](#principles)
- [Install](#install)
- [Usage](#usage)
- [Getting Started](#getting-started)
- [Features](#features)
- [API](#api)
- [Examples](#examples)
  - [BUser walkthrough](/examples/BUserWalkthrough/)
  - [Profile walkthrough](/examples/ProfileWalkthrough/)
- [Credits](#credits)
- [License](#license)

## State

Under active development. 

## Principles

Dash is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Dash network allows for highly resilient Dash infrastructure, and the developer community needs reliable, open-source tools to implement Dash apps and services.

## Install

```sh
npm install @dashevo/dashpay-dpa --save-exact
```

Usage the `save-exact` flag is encouraged as well as a manual verification of the modifications before bumping to a newer version.

## Usage

In your initialization of your wallet object, add `DashPayDPA` in the plugins array parameter.

```
const { Wallet } = require('@dashevo/wallet-lib');
const DashPayDPA = require('@dashevo/dashpay-dpa');


const wallet = new Wallet({
  plugins: [DashPayDPA],
  allowSensitiveOperations: true
});
```

The `allowSensitiveOperations` has to be set at true. As we require an access to
the keychain in order to sign a RegTx.

Any plugin requiring this boolean to be true, should have extra look and be installed and fixed to a specific version using the `--save-exact` npm flag.
Futures updates should then be manual and go through a whole check again.

## Getting started

In order to be able to access to method of DashPay DPA. You first need to get the instance from wallet-lib : 

`const dpd = account.getDPA('dashpaydpa');`

## Features

- [X] Register DashPayDPA Schema
- [X] Register a blockchain username
- [X] Broadcast transition
- [X] Search/Get BU.
- [ ] Top Up account
- [ ] Pay To Username
- [ ] Contact logic

## API

- [DashPayDPA](/docs/DashPayDPA.md)
- [BUser](/docs/BUser.md)
- [Contact](/docs/Contact.md)
- [ContactRequest](/docs/ContactRequest.md)
- [Profile](/docs/Profile.md)

## Examples

You can see here, some [Examples](/docs/examples.md).

## Credits

Wallet-Lib is maintained by the Dash Core Developers.
We want to thanks all member of the community that have submited suggestions, issues and pull requests.

## License

[MIT](LICENSE) &copy; Dash Core Group, Inc.

/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
let Schema = module.exports;

/**
 * System Schema
 * TODO: move to an upstream repo
 */
Schema.System = require('../dash-system-schema/index');

/**
 * Consensus code
 */
Schema.validate = require('./consensus/validate');
Schema.hash = require('./consensus/hash');
Schema.object = require('./consensus/object');
Schema.state = require('./consensus/state');
Schema.create = require('./consensus/create');
Schema.definition = require('./consensus/definition');
Schema.params = require('./consensus/params');
Schema.def = require('./consensus/definition');
Schema.compile = require('./consensus/compile');
Schema.result = require('./consensus/result');
Schema.rules = require('./consensus/rules');
Schema.fees = require('./consensus/fees');
Schema.serialize = require('./consensus/serialize');

/**
 * Utility code
 */
Schema.util = {};
Schema.util.hash = require('./util/hash');
Schema.util.object = require('./util/object');
Schema.util.jsonschema = require('./util/jsonschema');
Schema.util.cbor = require('./util/cbor');

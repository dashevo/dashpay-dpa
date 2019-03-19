/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview Consensus Parameters
 * @module Schema.params
 */
//let Schema = require('../index.js');

// TODO: Move these into the System Schema
module.exports = {
    dapSchemaIdURI: 'http://dash.org/schemas/dapschema',
    sysSchemaMetaURI: 'http://json-schema.org/draft-07/schema#',
    sysSchemaId: 'http://dash.org/schemas/sys',
    reservedKeywords: ['dash'],
    dapObjectBaseRef: 'http://dash.org/schemas/sys#/definitions/dapobjectbase',
    dapSchemaMaxSize: 10000,
    dashSchemaKeywords: ['_key', '_isrole', '_owningroles', '_objtype', '_relation', '_multiplicity', '_scope']
};

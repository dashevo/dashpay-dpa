/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
let Schema = require('../index.js');

/**
 * @fileOverview Consensus serialization code
 * @module Schema.serialize
 */

/**
 * @param object {object}
 * @param [toHexString] {boolean} - return hex string instead of buffer
 * @returns {Buffer|string}
 */
function encode(object, /*dapSchema, toHexString*/) {

    let binaryData = Schema.util.cbor.serialize(object);

    /*
    if (toHexString) {
        return binaryData.toString('hex');
    }
    */
    return binaryData;
}

/**
 * Converts binary packet to JSON
 * @param {Buffer} buffer
 * @return {object}
 */
function decode(buffer) {
    return Schema.util.cbor.toJSON(buffer);
}

module.exports = {
    encode,
    decode
};

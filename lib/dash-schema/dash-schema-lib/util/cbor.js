/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
const cbor = require('cbor');
/**
 * @fileOverview CROR serialization util code
 * @module Schema.util.cbor
 */

/**
 * @param object {object}
 * @param [toHexString] {boolean} - return hex string instead of buffer
 * @returns {Buffer|string}
 */
function serialize(object, toHexString) {
    let binaryData = cbor.encodeCanonical(object);
    if (toHexString) {
        return binaryData.toString('hex');
    }
    return binaryData;
}

/**
 * Converts binary packet to JSON
 * @param {Buffer} buffer
 * @return {object}
 */
function toJSON(buffer) {
    return cbor.decode(buffer);
}

module.exports = {
    serialize: serialize,
    toJSON: toJSON
};

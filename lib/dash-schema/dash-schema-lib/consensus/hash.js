/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview Consensus code for Schema hashing
 * @module Schema.hash
 */
let Schema = require('../index.js');

/**
 * Hash a SubTX instance
 * @param obj {object} Subscription Transaction instance
 * @returns {*|string}
 */
function hashSubTx(obj) {
    let data = Schema.object.toJSON(obj);

    return Schema.util.hash.toHash(data);
}

/**
 * Hash a State Transition Header instance
 * @param obj {object} State Transition Header instance
 * @returns {*|string}
 */
function hashSTHeader(obj) {
    let data = Schema.object.toJSON(obj);

    return Schema.util.hash.toHash(data);
}

/**
 * Hash a State Transition Packet instance
 * @param obj {object} State Transition Packet instance
 * @param dapSchema {object} DapSchema instance
 * @returns {*}
 */
function hashSTPacket(obj, dapSchema) {
    let data = Schema.object.toJSON(obj);
    let packetHash = Schema.util.hash.toHash(data);

    let allObjJson = '';

    if (obj.stpacket.dapobjects) {

        if (!dapSchema) {
            throw new Error('dap schema is required to obtain hash of dap data packet');
        }

        // get hash of DAP objects
        for (let i = 0; i < obj.stpacket.dapobjects.length; i++) {
            // hash only schema properties
            let objJson = Schema.object.toJSON(obj.stpacket.dapobjects[i], dapSchema);
            allObjJson += objJson;
        }
    }

    let finalHash = Schema.util.hash.toHash(packetHash + allObjJson);

    return finalHash;
}

/**
 * Hash a DapContract instance
 * @param obj {object} DapContract instance
 * @returns {*|string}
 */
function hashDapContract(obj) {
    let data = Schema.object.toJSON(obj);

    return Schema.util.hash.toHash(data);
}

/**
 * Hash a DapSchema instance
 * @param obj {object} DapSchema instance
 * @returns {*|string}
 */
function hashDapSchema(obj) {
    let data = Schema.object.toJSON(obj);

    return Schema.util.hash.toHash(data);
}

/**
 * Hash a DapObject instance
 * @param obj {object} DapObject instance
 * @param dapSchema
 * @returns {*|string}
 */
function hashDapObject(obj, dapSchema) {
    let data = Schema.object.toJSON(obj, dapSchema);

    return Schema.util.hash.toHash(data);
}

module.exports = {
    subtx: hashSubTx,
    stheader: hashSTHeader,
    stpacket: hashSTPacket,
    dapcontract: hashDapContract,
    dapschema: hashDapSchema,
    dapobject: hashDapObject
};

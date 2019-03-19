/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */
'use strict';
/**
 * @fileOverview Consensus code for Schema instance creation
 * @module Schema.create
 */
let Schema = require('../index.js');

function createBaseInstance(keyword) {

    let subSchema = {};

    subSchema[keyword] = {
        pver: Schema.System.pver
    };

    return subSchema;
}

/**
 * Create a State Transition Header instance
 * @param stp {object} ST Packet schema instance
 * @param buid {string} Blockchain User id
 * @param prevstid {string} Previous State Transition id
 */
function createSTHeaderInstance(stp, buid, prevstid) {

    let stheader = createBaseInstance('stheader');

    let obj = stheader.stheader;

    obj.feeperbyte = 0; // blockchainuser fee set for this ts
    obj.buid = buid; // blockchainuser id, taken from the tx hash of the blockchainuser's first subtx
    obj.prevstid = prevstid ? prevstid : ''; // hash of the previous transition for this blockchainuser (chained)
    obj.packetid = stp.stpacket.meta.id; // hash of the associated data packet for this transition
    obj.stsig = ''; // sig of the blockchainuser & the dapi quorum that validated the transition data
    obj.nver = 1;
    obj.packetsize = Schema.serialize.encode(stp).length;

    // hash the transition
    Schema.object.setID(stheader);

    return stheader;
}

/**
 * Create an empty State Transition Packet instance
 */
function createSTPacketInstance() {

    let stpacket = createBaseInstance('stpacket');

    return stpacket;
}

/**
 * Create a new DapContract instance from a DapSchema instance
 * @param dapSchema {object} DapSchema
 */
function createDapContract(dapSchema) {

    let dap = createBaseInstance('dapcontract');

    // dapid is the dapcontract id
    let obj = dap.dapcontract;
    obj.idx = 0;
    //obj.upgradedapid = ''; // specify when revising an existing dap (orig dapcontract id)
    obj.dapname = dapSchema.title;
    obj.dapschema = dapSchema;
    obj.dapver = 1;

    Schema.object.setID(dap);

    return dap;
}

/**
 * Create a new DapObject instance
 * @param typeName {string} Schema Keyword
 */
function createDapObject(typeName) {

    let obj = {};
    obj.objtype = typeName;
    obj.idx = 0;
    obj.rev = 0;
    obj.act = 1;

    return obj;
}

/**
 * Create a new Blockchain User instance from a subtx
 * @param obj {object} Subscription Transaction
 * @returns {{blockchainuser: {pver: number, uname: string, buid: *|string, pubkey: string, credits: number}}}
 */
function createBlockchainUser(obj) {

    let bu = {
        blockchainuser: {
            pver: obj.subtx.pver,
            uname: obj.subtx.uname,
            buid: Schema.hash.subtx(obj),
            pubkey: obj.subtx.pubkey,
            credits: 100000
        }
    };

    return bu;
}

module.exports = {
    stheader: createSTHeaderInstance,
    stpacket: createSTPacketInstance,
    dapcontract: createDapContract,
    dapobject: createDapObject,
    blockchainuser: createBlockchainUser
};

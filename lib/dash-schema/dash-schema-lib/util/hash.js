/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview hash util code
 * @module Schema.util.hash
 */
let BufferUtil = require('@dashevo/dashcore-lib').util.buffer;
let BufferWriter = require('@dashevo/dashcore-lib').encoding.BufferWriter;
let Hash = require('@dashevo/dashcore-lib').crypto.Hash;

/**
 * Return a double SHA256 hash of a Schema object instance
 * @param obj {object} Schema object instance
 * @returns {*|string}
 */
function toHash(obj) {
    let tree = [];

    // create array of buffers, each holding one key within Data
    for (let key in obj) tree.push(BufferUtil.reverse(toBuffer({key: obj[key]}))); // reverse on the way in

    // build merkle tree
    let j = 0;
    for (let size = tree.length; size > 1; size = Math.floor((size + 1) / 2)) {
        for (let i = 0; i < size; i += 2) {
            let i2 = Math.min(i + 1, size - 1);
            let buf = Buffer.concat([tree[j + i], tree[j + i2]]);
            tree.push(Hash.sha256sha256(buf));
        }
        j += size;
    }

    // return DataHash
    return BufferUtil.bufferToHex(BufferUtil.reverse(tree[tree.length - 1])); // reverse on the way out
}

/***
 * Returns a buffer representation of an object
 * @param inpdata {object} input object
 * @returns {*}
 * @private
 */
function toBuffer(inpdata) {

    let toBufferWriter = function (writer, inpdata2) {
        writer.write(new Buffer(JSON.stringify(inpdata2)));
        return writer;
    };

    let writer = new BufferWriter();
    return toBufferWriter(writer, inpdata).toBuffer();
}

module.exports = {
    toHash: toHash,
    toBuffer: toBuffer
};

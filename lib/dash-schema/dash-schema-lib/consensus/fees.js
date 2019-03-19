/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */
'use strict';
/**
 * @fileOverview Consensus code for Credit Fees
 * @module Schema.fees
 */
function calcSTFees(feePerByte, packetSize) {

    const stHeaderSizeBytes = 220;
    const curveParam = 8.8;
    const curveThreshold = 1;
    const curveMag = 5;

    const core = Math.pow(packetSize, 3) / Math.pow((curveParam * Math.pow(10, curveMag)), 2);
    const multi = Math.ceil(Math.max(curveThreshold, core));
    const headerFee = feePerByte * stHeaderSizeBytes;
    const packetFee = (multi * headerFee) - headerFee;

    return {
        headerFee: headerFee,
        packetFee: packetFee
    };
}

module.exports = {
    calcSTFees: calcSTFees
};

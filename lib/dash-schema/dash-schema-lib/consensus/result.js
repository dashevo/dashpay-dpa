/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview Consensus code for Schema instance validation
 * @module Schema.validate
 */
let Schema = require('../index.js');

module.exports = function result(errorCode, objTypeName, propName, schemaTitle) {

    // no input...
    if (errorCode === undefined || errorCode === null) {
        // validation succeeded
        return {
            valid: true
        };
    }

    if (Number.isInteger(errorCode) === false) {

        // malformed error
        //throw new Error('unknown error in validate result');
    }

    let errorMsg = Schema.rules.codes[errorCode];
    // validation failed

    const res = {
        valid: false,
        errCode: errorCode,
        errMsg: errorMsg,
        objType: objTypeName,
        propName: propName,
        schemaName: schemaTitle,
        //schemaId: schema.$id,
        date: Date.now()
    };

    return res;
};

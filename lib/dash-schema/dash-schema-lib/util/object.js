/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview JS-object util code
 * @module Schema.util.object
 */

/**
 * Returns a deep clone of an object's properties (not methods) into a new object reference
 * @param inpobj {object} input object
 * @returns {any}
 * @private
 */
function objectToClone(inpobj) {
    let obj = JSON.parse(JSON.stringify(inpobj)) || {};

    let copyObj = {};
    if (obj.properties) {
        obj = obj.properties;
        copyObj = JSON.parse(JSON.stringify(obj));

        Object.keys(obj).forEach(function (k) {
            if (obj[k].type !== 'object') {
                if (obj[k].default !== undefined) {
                    copyObj[k] = obj[k].default;
                } else {
                    copyObj[k] = undefined;
                }
            } else {
                copyObj[k] = objectToClone(obj[k]);
            }
        });
    } else {
        copyObj = JSON.parse(JSON.stringify(obj));
    }

    return copyObj;
}


/**
 * Returns a JSON representation of a JavaScript object
 * @param obj {object} object
 * @returns {string}
 */
function objectToJSON(obj) {

    return JSON.stringify(obj);
}

module.exports = {
    toJSON: objectToJSON,
    toClone: objectToClone
};

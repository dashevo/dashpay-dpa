/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview State validation
 * @module Schema.state
 */
let Schema = require('../index.js');

/**
 * Fully validate a State Transition against a DapSpace instance
 * @param ts {object} State Transition instance
 * @param tsp {object} State Transition Packet instance
 * @param dapSpace {object} DapSpace instance
 * @param dapSchema {object} DapSchema instance
 * @returns {*}
 */
function validateTransitionData(ts, tsp, dapSpace, dapSchema) {

    // TODO: validate foreign relational data

    // is this a dapobject packet
    if (tsp.stpacket.dapobjects) {

        if (!dapSchema) {
            throw new Error('dapSchema not provided during validation');
        }

        // Check if the packet is valid to merge into the user's active state for this DAP
        let tspValid = Schema.validate.stpacketobjects(tsp.stpacket.dapobjects, dapSchema);
        if (tspValid.valid !== true) {
            return tspValid;
        }

        if (dapSpace) {
            let stateValid = _validateDapSpace(dapSpace, dapSchema);
            if (stateValid.valid !== true) {
                return stateValid;
            }
        }

        let indexesValid = _validateIndexes(ts, tsp, dapSpace);
        if (indexesValid.valid !== true) {
            return indexesValid;
        }

        let relationsValid = _validateRelations(ts, tsp, dapSpace, dapSchema);
        if (relationsValid.valid !== true) {
            return relationsValid;
        }

    } else {
        // TODO: verify dapcontract
    }
    return Schema.result();
}

/**
 * Validate indexes in a DapSpace instance
 * @param ts {object} State Transition instance
 * @param tsp {object} State Transition Packet instance
 * @param dapSpace {object} DapSpace instance
 * @returns {ValidationResult}
 */
function _validateIndexes(ts, tsp, dapSpace) {

    // TODO: recursively check updated state as packet objects are applied

    let maxIdx = dapSpace ? dapSpace.maxidx : 0;

    // for each packet object
    for (let i = 0; i < tsp.stpacket.dapobjects.length; i++) {

        let pakObj = tsp.stpacket.dapobjects[i];

        // checks against current state
        if (dapSpace) {

            // if adding new...
            if (pakObj.act === 1) {

                if (pakObj.idx !== (maxIdx + 1)) {
                    return Schema.result('incorrect index on new object');
                }
                maxIdx++;
            }
        }
    }
    return Schema.result();
}

/**
 * Find duplicate object
 *
 * @param {object} object
 * @param {object} dapSpace
 * @param {object} dapSchema
 * @return {boolean}
 * @private
 */
function _hasDuplicateObjectInDapSpace(object, dapSpace, dapSchema) {
    const {act, objtype} = object;
    if (act === 1 && _getIsRole(object, dapSchema)) {
        return Boolean(dapSpace.objects.find((obj) => {
            return objtype === obj.objtype &&
                _getIsRole(obj, dapSchema);
        }));
    }
}

/**
 * Find 1-to-1 relation duplicate object
 *
 * @param {object} dapObject
 * @param {array} relations
 * @param {object}dapSpace
 * @return {boolean}
 * @private
 */
function _hasRelationDuplication(object, relations, dapSpace) {
    for (let j = 0; j < relations.length; j++) {
        const relationName = relations[j];

        if (!object[relationName] || object[relationName].type !== 0) {
            continue;
        }

        // find existing object of the same type if 1-to-1 relation
        for (let x = 0; x < dapSpace.objects.length; x++) {
            let stateObj = dapSpace.objects[x];

            // if new object with the same type
            if (object.objtype !== stateObj.objtype) {
                continue;
            }

            // same-type same-relation
            if (object[relationName].userId === stateObj[relationName].userId &&
                object[relationName].type === stateObj[relationName].type &&
                object[relationName].index === stateObj[relationName].index
            ) {
                // if this obj matches an existing relation
                return true;
            }
        }
    }
}

/**
 * Validate relations in a DapSpace
 * @param ts {object} State Transition instance
 * @param tsp {object} State Transition Packet instance
 * @param dapSpace {object} DapSpace instance
 * @param dapSchema {object} DapSchema instance
 * @returns {ValidationResult}
 */
function _validateRelations(ts, tsp, dapSpace, dapSchema) {

    // for each packet object
    for (let i = 0; i < tsp.stpacket.dapobjects.length; i++) {

        let object = tsp.stpacket.dapobjects[i];

        const relations = Schema.definition.getSubSchemaRelations(dapSchema, object.objtype);

        // Prevent objects related to self
        for (let j = 0; j < relations.length; j++) {
            const relationName = relations[j];

            if (object[relationName] && object[relationName].userId === ts.stheader.buid) {
                return Schema.result('object cannot relate to self');
            }
        }

        if (!dapSpace || !dapSpace.objects) {
            continue;
        }

        // don't allow 2 objects of same type if not relations
        // (note this is limiting and should be expanded with custom rules defined in schema)
        if (relations.length === 0) {
            if (_hasDuplicateObjectInDapSpace(tsp.stpacket.dapobjects[i], dapSpace, dapSchema)) {
                return Schema.result('duplicate profile object');
            }

            continue;
        }

        // Prevent 1-to-1 relations duplication
        if (tsp.stpacket.dapobjects[i].act === 1) {
            if (_hasRelationDuplication(tsp.stpacket.dapobjects[i], relations, dapSpace)) {
                return Schema.result('duplicate related object');
            }
        }
    }

    return Schema.result();
}

/**
 * Return if a DapObject is a Profile object... profile objects are
 * always the first slot of a DapSpace, and a DapSpace can only contain one
 * profile object
 * @param obj {object} Schema object instance
 * @param dapSchema {object} DapSchema instance
 * @returns {boolean}
 */
function _getIsRole(obj, dapSchema) {

    if (!obj || !dapSchema) {
        throw new Error('obj or dapschema missing');
    }
    let key = obj.objtype;

    if (dapSchema[key]) {
        if (dapSchema[key]._isrole === true) {
            return true;
        }
    }
    return false;
}

/**
 * Validate a DapSpace data
 * @param obj {object[]} Array of Schema object instance
 * @param dapSchema {object} DapSchema instance
 * @returns {*}
 */
function _validateDapSpace(objs, dapSchema) {

    let objsValid = Schema.validate.stpacketobjects(objs, dapSchema);
    if (!objsValid.valid) {
        return objsValid;
    }

    for (let i = 0; i < objs.length; i++) {

        for (let j = 0; j < objs.length; j++) {
            if (i !== j) {

                // duplicate index
                if (objs[i] === objs[j]) {
                    return Schema.result('duplicate object index in DapSpace');
                }
            }
        }
    }
    return Schema.result();
}

module.exports = {
    validateTransitionData: validateTransitionData
};

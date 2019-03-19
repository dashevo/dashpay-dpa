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

/**
 * Internal function for validating both System and Dap objects
 * @param obj {object} Schema object instance
 * @param dapSchema {object} Dap Schema definition (optional)
 * @returns {*}
 * @private
 */
function _validateCore(obj, dapSchema) {

    if (!obj) {
        return {valid: false};
    }

    // pre-validate the object by returning a deep extract a schema object from the object
    let clonedObj = Schema.object.fromObject(obj, dapSchema);

    let res = Schema.util.jsonschema.validate(clonedObj, dapSchema);

    return res;
}

/**
 * Internal function to validate a System Schema object instance
 * @param sysObj {object} System Schema object instance
 * @param subschemaname {string} Subschema keyword
 * @returns {*}
 * @private
 */
function _validateSysObject(sysObj, subschemaname) {

    // TODO: prevent name collisions between DAP object names with the System schema object names

    // TODO: return validation-error object instead of throws


    // validate subschema type
    if (subschemaname) {
        // incorrect subschema
        if (!sysObj[subschemaname]) {

            //todo
            let res = Schema.result(Schema.rules.sysobject.missing_subschema, subschemaname);
            return res;
        }
    }

    return _validateCore(sysObj);
}

/**
 * Validate a Subscription Transaction
 * @param obj {object} Schema object instance
 * @returns {ValidationResult}
 */
function validateSubTx(obj) {
    return _validateSysObject(obj, 'subtx');
}

/**
 * Validate a Blockchain User
 * @param obj {object} Schema object instance
 * @returns {ValidationResult}
 */
function validateBlockchainUser(obj) {
    return _validateSysObject(obj, 'blockchainuser');
}

/**
 * Validate a State Transition Header
 * @param obj {object} Schema object instance
 * @returns {ValidationResult}
 */
function validateSTHeader(obj) {
    return _validateSysObject(obj, 'stheader');
}

/**
 * Validate a State Transition Packet.  When the packets contain dapobjects,
 * the DapSchema parameter is required
 * @param obj {object} Schema object instance
 * @param dapSchema {object} DapSchema (optional)
 * @returns {ValidationResult}
 */
function validateSTPacket(obj, dapSchema) {

    // deep extract a schema object from the object
    let outerObj = Schema.object.fromObject(obj);

    // if this is a dapobjects packet...
    if (obj.stpacket.dapobjects) {

        // require dapSchema
        if ((dapSchema === undefined) || dapSchema === null) {
            return Schema.result('missing dapschema');
        }

        // temporarily remove the inner dapobjects,
        // so we can validate the containing packet using the System Schema, and the
        // contained Dap objects using the dapSchema.
        outerObj.stpacket.dapobjects = [{}];

        // validate the empty packet as a sys object...
        let outerValid = _validateSysObject(outerObj, 'stpacket');

        if (!outerValid.valid) {
            return outerValid;
        }

        // ...the validate the contents as dabobjects
        return validateSTPacketObjects(obj.stpacket.dapobjects, dapSchema);
    }

    // not a dapobjects packet so validate as a sysobject
    return _validateSysObject(obj, 'stpacket');
}

/**
 * Validate the objects from a Transition packet
 * against a DapSchema and additional packet consensus rules
 * @param obj {object} Schema object instance
 * @param dapSchema {object} DapSchema
 * @returns {*}
 */
function validateSTPacketObjects(objs, dapSchema) {

    // first validate each dap object individually
    for (let i = 0; i < objs.length; i++) {
        let objValid = Schema.validate.dapobject(objs[i], dapSchema);
        if (objValid.valid === false) {
            return objValid;
        }
    }
    return Schema.result();
}

/**
 * Validate a DapContract instance
 * @param obj {object} Schema object instance
 * @param dapSchema {object} DapSchema
 * @returns {ValidationResult}
 */
function validateDapContract(obj) {

    return _validateSysObject(obj, 'dapcontract');
}


/**
 * Validate a DapObject instance
 * @param obj {object} Schema object instance
 * @param dapSchema {object} DapSchema
 * @returns {*}
 */
function validateDapObject(obj, dapSchema) {

    if (!dapSchema) {
        throw new Error('validateDapObject: dapSchema is undefined');
    }

    // objtype not a string
    if (!(typeof obj.objtype === 'string' || obj.objtype instanceof String)) {
        return Schema.result(Schema.rules.types.dapobject_missing_objtype, 'objtype', dapSchema);
    }

    let subSchema = Schema.def.getDapSubSchema(obj, dapSchema);

    // objtype not a valid subschema
    if (!subSchema) {
        return Schema.result(Schema.rules.types.dapobject_unknown_objtype, 'objtype', dapSchema);
    }

    return _validateCore(obj, dapSchema, obj.objtype);
}

/**
 * Validate a username using DIP 011 rules
 * @param uname {string} Blockchain Username
 */
function validateBlockhainUsername(uname) {

    if (!uname) {
        return false;
    }

    if (!(typeof uname === 'string' || uname instanceof String)) {
        return false;
    }

    if (!(uname.length > 2 && uname.length < 25)) {
        return false;
    }

    let invalid = /[^a-z0-9._]/.test(uname);

    return !invalid;
}

module.exports = {
    subtx: validateSubTx,
    blockchainuser: validateBlockchainUser,
    username: validateBlockhainUsername,
    stheader: validateSTHeader,
    stpacket: validateSTPacket,
    stpacketobjects: validateSTPacketObjects,
    dapcontract: validateDapContract,
    dapobject: validateDapObject
};

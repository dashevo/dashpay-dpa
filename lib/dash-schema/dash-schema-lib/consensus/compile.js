/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */

'use strict';
/**
 * @fileOverview Compiling Schema Definitions
 * @module Schema.validate
 */
let Schema = require('../index.js');

function compileSysSchema() {

    // JSON Schema validation
    let res = Schema.util.jsonschema.validateSchemaDef(Schema.System);

    if (res) {
        return res;
    }

    return Schema.result();
}

/**
 * Validate a DapSchema definition
 * @param dapSchema {object} DapSchema
 * @returns {*}
 */
function compileDapSchema(dapSchema) {

    // valid id tag
    if (dapSchema.$id !== Schema.params.dapSchemaIdURI) {
        return Schema.result(Schema.rules.types.invalid_id, 'DAPSchema', '$id');
    }

    // has title
    if ((typeof dapSchema.title !== 'string' && !(dapSchema.title instanceof String))
        || !(dapSchema.title.length > 2 && dapSchema.title.length < 25)) {
        return Schema.result(Schema.rules.types.invalid_schema_title, 'DAPSchema', 'title');
    }

    // subschema count
    const count = Object.keys(dapSchema).length;

    if (count < 3 || count > 1002) {
        return Schema.result(Schema.rules.types.invalid_dap_subschema_count, 'DAP Subschema', 'title');
    }

    // validate the DAP Schema using JSON Schema
    let valid = Schema.util.jsonschema.validateDapSchemaDef(dapSchema);
    if (valid) {
        return valid;
    }

    // check subschemas
    for (let i = 0; i < count; i++) {

        let res = _compileDAPSubschema(dapSchema, i);

        if (res) {
            return res;
        }
    }

    return Schema.result();
}

function _compileDAPSubschema(dapSchema, i) {

    const keyword = Object.keys(dapSchema)[i];

    if ((keyword === '$schema') || (keyword === '$id') || (keyword === 'title')) {
        return undefined;
    }

    // invalid length
    if (!(keyword.length > 2 && keyword.length < 25)) {
        return Schema.result(Schema.rules.types.invalid_dap_subschema_name, 'invalid name length', keyword);
    }

    // invalid chars
    let invalid = /[^a-z0-9_$]/.test(keyword);
    if (invalid) {
        return Schema.result(Schema.rules.types.invalid_dap_subschema_name, 'disallowed name characters', keyword);
    }

    // subschema reserved keyword from params
    for (let j = 0; j < Schema.params.reservedKeywords.length; j++) {

        if (keyword === Schema.params.reservedKeywords[j]) {
            return Schema.result(Schema.rules.types.reserved_dap_subschema_name, 'reserved param keyword', keyword);
        }
    }

    // subschema reserved keyword from sys schema properties
    for (let j = 0; j < Object.keys(Schema.System.properties).length; j++) {

        if (keyword === Object.keys(Schema.System.properties)[j]) {
            return Schema.result(Schema.rules.types.reserved_dap_subschema_name, 'reserved sysobject keyword', keyword);
        }
    }

    // subschema reserved keyword from sys schema definitions
    for (let j = 0; j < Object.keys(Schema.System.definitions).length; j++) {

        if (keyword === Object.keys(Schema.System.definitions)[j]) {
            return Schema.result(Schema.rules.types.reserved_dap_subschema_name, 'reserved syschema definition keyword', keyword);
        }
    }

    let subschema = dapSchema[keyword];

    // schema inheritance
    if (!subschema.allOf) {
        return Schema.result(Schema.rules.types.dap_subschema_inheritance, 'dap subschema inheritance missing', keyword);
    }

    if (subschema.allOf.constructor !== Array) {

        return Schema.result(Schema.rules.types.dap_subschema_inheritance, 'dap subschema inheritance invalid', keyword);
    } else if (subschema.allOf[0].$ref !== Schema.params.dapObjectBaseRef) {

        return Schema.result(Schema.rules.types.dap_subschema_inheritance, 'dap subschema inheritance invalid', keyword);
    }

    // JSON Schema validation on the DAP subschema
    let res = Schema.util.jsonschema.validateDapSubschemaDef(subschema);

    return res;
}

module.exports = {
    dapschema: compileDapSchema,
    sysschema: compileSysSchema
};

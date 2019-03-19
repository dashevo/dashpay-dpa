/**
 * Copyright (c) 2017-present, Dash Core Team
 *
 * This source code is licensed under the MIT license found in the
 * COPYING file in the root directory of this source tree.
 */
'use strict';

/**
 * @fileOverview Consensus rule codes and types
 * @module Schema.util.error
 */

let ruleTypes = {
    json_schema: 100,
    dapobject_missing_objtype: 200,
    dapobject_unknown_objtype: 201,
    invalid_id: 500,
    invalid_schema_title: 501,
    invalid_dap_subschema_count: 510,
    invalid_dap_subschema_name: 511,
    reserved_dap_subschema_name: 512,
    dap_subschema_inheritance: 530,
    missing_title: 600
};

let ruleCodes = {
    100: 'JSON Schema Error',
    200: 'Missing objtype property',
    201: 'Missing objtype keyword in dap object instance',
    300: 'Missing subcschema',
    400: 'Missing property',
    401: 'Invalid type',
    500: 'DAP Schema must have a valid $id property',
    501: 'Schema must have a valid title',
    510: 'Invalid DAP Subschema count',
    511: 'Invalid DAP Subschema name',
    512: 'Reserved DAP Subschema name',
    600: 'Missing DAp Schema title'
};

module.exports = {
    types: ruleTypes,
    codes: ruleCodes
};

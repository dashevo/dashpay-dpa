'use strict';

function getDapSubSchema(obj, dapSchema) {
    return dapSchema[obj.objtype];
}

/**
 * Get schema relations
 *
 * @param {object} dapSchema
 * @return {object}
 */
function getSchemaRelations(dapSchema) {

    const subSchemasKeys = Object.keys(dapSchema);

    const relations = {};
    subSchemasKeys.forEach((subSchemaKey) => {
        const subSchemaRelations = getSubSchemaRelations(dapSchema, subSchemaKey);
        if (subSchemaRelations && subSchemaRelations.length && subSchemaRelations.length > 0) {
            relations[subSchemaKey] = subSchemaRelations;
        }
    });
    return relations;
}

/**
 * Get sub schema relations
 *
 * @param {object} dapSchema
 * @param {string} subSchemaKey
 * @return {string[]}
 */
function getSubSchemaRelations(dapSchema, subSchemaKey) {
    const subSchema = dapSchema[subSchemaKey];
    const subSchemaProperties = subSchema.properties;

    if (!subSchemaProperties) {
        return null;
    }

    return Object.keys(subSchemaProperties).filter(name => {
        const propertyDefinition = subSchemaProperties[name];

        return propertyDefinition.$ref &&
            propertyDefinition.$ref === 'http://dash.org/schemas/sys#/definitions/relation';
    });
}

module.exports = {
    getDapSubSchema,
    getSchemaRelations,
    getSubSchemaRelations,
};

const { each } = require('lodash');
const setters = require('./_setters');

module.exports = function fromJSON(object) {
  /**
   * This helper will check for a setter of the property, if found, will execute it with value
   * @param prop
   * @param value
   */
  const handleProperty = (prop, value) => {
    const fnName = `set${prop[0].toUpperCase()}${prop.slice(1)}`;
    if (setters[fnName]) {
      setters[fnName].call(this, value);
    } else {
      this[prop] = value;
    }
  };
  each(object, (val, propName) => {
    handleProperty(propName, val);
  });
};

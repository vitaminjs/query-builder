
/**
 * @class Table
 */
export default class {
  
  /**
   * 
   * @param {String} name
   * @param {String} alias
   * @param {String} schema
   * @constructor
   */
  constructor(name, alias = '', schema = '') {
    if ( !alias && name.toLowerCase().indexOf(' as ') > 0 )
      [name, alias] = name.split(' as ').map(str => str.trim())
    
    if ( !schema && name.indexOf('.') > 0 )
      [schema, name] = name.split('.').map(str => str.trim())
    
    this._alias = alias
    this._schema = schema
    this._name = name
  }
  
  /**
   * 
   * @type {String}
   */
  get schema() {
    return this._schema
  }
  
  /**
   * 
   * @type {String}
   */
  get name() {
    return this._name
  }
  
  /**
   * 
   * @type {String}
   */
  get alias() {
    return this._alias
  }
  
  /**
   * 
   * @type {String}
   */
  toString() {
    return this.alias || this.name
  }
  
}
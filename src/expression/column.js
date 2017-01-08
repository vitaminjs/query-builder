
/**
 * @class Column
 */
export default class {
  
  /**
   * 
   * @param {String} name
   * @param {String} table
   * @param {String} alias
   * @constructor
   */
  constructor(name, table = '', alias = '') {
    if ( !alias && name.toLowerCase().indexOf(' as ') > -1 )
      [name, alias] = name.split(' as ').map(str => str.trim())
    
    if ( !table && name.indexOf('.') > -1 )
      [table, name] = name.split('.').map(str => str.trim())
    
    this._alias = alias
    this._table = table
    this._name = name
  }
  
  /**
   * 
   * @type {String}
   */
  get table() {
    return this._table
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
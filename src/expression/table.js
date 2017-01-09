
import Expression from './base'

/**
 * @class Table
 */
export default class Table extends Expression {
  
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
    
    this.alias = alias
    this.schema = schema
    this.name = name
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var schema = isEmpty(this.schema) ? '' : compiler.escapeIdentifier(this.schema)
    var table = compiler.escapeIdentifier(this.name)
    
    return compiler.alias(schema + table, this.alias)
  }
  
}

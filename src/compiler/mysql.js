
import Compiler from './base'

/**
 * @class MysqlCompiler
 */
export default class extends Compiler {
  
  /**
   * Quotes a string so it can be safely used as a table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  quote(value) {
    return (value === '*') ? value : '`' + value.trim().replace(/`/g, '``') + '`'
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileTables(query) {
    if (! query.hasTables() ) return 'from dual'
    
    return super.compileTables(query)
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    if ( query.hasOffset() && !query.hasLimit() )
      return 'limit 18446744073709551615'
    
    return super.compileLimit(query)
  }

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertDefaultValues(query) {
    return `insert into ${this.escape(query.getTable())} () values ()`
  }
  
}
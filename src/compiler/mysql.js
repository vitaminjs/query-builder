
import Expression from '../expression'
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
  
  /**
   * Compile the function name and its arguments
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
      case 'concat':
        return this.compileConcatFunction(args)
      
      case 'utc':
        return super.compileFunction('utc_timestamp', args)
      
      case 'strpos':
        return super.compileFunction('instr', args)
      
      default:
        return super.compileFunction(name, args)
    }
  }
  
  /**
   * 
   * @param {Array} args
   * @returns {String}
   */
  compileConcatFunction(args) {
    args = args.map(value => {
      if ( value instanceof Expression )
        return `coalesce(${value.compile(this)}, '')`
      
      return this.escape(value)
    })
    
    return `concat(${args.join(', ')})`
  }
  
}
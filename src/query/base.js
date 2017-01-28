
import Compiler, { createCompiler } from '../compiler'
import { isString } from 'lodash'

/**
 * @class BaseQuery
 */
export default class Query {
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return ''
  }

  /**
   * 
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   */
  toSQL(dialect, options = {}) {
    if ( isString(dialect) )
      dialect = createCompiler(dialect, options)
    
    if ( dialect instanceof Compiler ) {
      let sql = this.compile(dialect)
      let params = dialect.getBindings()

      return { sql, params }
    }
    
    throw new TypeError("Invalid query compiler")
  }
  
}

import Compiler from './base'

/**
 * @class MysqlCompiler
 */
export default class extends Compiler {
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : '`' + value.trim() + '`'
  }
  
}
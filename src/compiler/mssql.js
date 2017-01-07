
import Compiler from './base'

/**
 * @class MssqlCompiler
 */
export default class extends Compiler {
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @return  string
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : `[${value.trim()}]`
  }
  
}

import Compiler from './base'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  
  /**
   * BaseCompiler constructor
   * 
   * @constructor
   */
  constructor() {
    super()

    this.bindings = []
    this.paramCount = 1
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get parameter() {
    return '$' + this.paramCount++
  }
  
}
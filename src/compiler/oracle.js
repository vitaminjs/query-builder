
import Compiler from './base'

/**
 * @class OracleCompiler
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
    return ':' + this.paramCount++
  }
  
  /**
   * Join two identifiers by `AS` clause
   * 
   * @param {String} first
   * @param {String} second
   * @returns {String}
   */
  alias(first, second = null) {
    return super.alias(first, second).replace(' as ', ' ')
  }
  
}
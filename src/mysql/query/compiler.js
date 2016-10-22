
import Compiler from '../../compiler'

/**
 * @class MysqlCompiler
 */
export default class extends Compiler {
  
  /**
   * MysqlCompiler constructor
   * 
   * @param {Client} client
   * @constructor
   */
  constructor(client) {
    super()
    
    this.client = client
  }
  
}

import Statement from './base'

export default class Select extends Statement {
  constructor () {
    super()

    this.isDistinct = false
  }

  /**
   * @param {Boolean} flag
   * @returns {Select}
   */
  distinct (flag = true) {
    this.isDistinct = flag
    return this
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileSelectQuery(this)
  }
}

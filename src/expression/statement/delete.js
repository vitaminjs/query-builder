
import Statement from '../statement'

/**
 * @class DeleteStatement
 */
export default class Delete extends Statement {
  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileDeleteQuery(this)
  }

  /**
   * @param {String|Expression} value
   * @returns {Delete}
   */
  from (value) {
    return this.setTable(value)
  }
}

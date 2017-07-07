
import Statement from '../statement'
import Identifier from '../identifier'

/**
 * @class SelectStatement
 */
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

  /**
   * @param {Any} columns
   * @returns {Select}
   */
  select (...columns) {
    columns.forEach((value) => this.addColumn(value))
    return this
  }

  /**
   * @param {Any} value
   * @return {Select}
   */
  addColumn (value) {
    this.getColumns().push(Identifier.from(value))
    return this
  }
}

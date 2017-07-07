
import Statement from '../statement'
import Identifier from '../identifier'

/**
 * @class SelectStatement
 */
export default class Select extends Statement {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.isDistinct = false
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

  /**
   * @param {Boolean} flag
   * @returns {Select}
   */
  distinct (flag = true) {
    this.isDistinct = flag
    return this
  }

  /**
   * @param {Any} tables
   * @returns {Select}
   */
  from (...tables) {
    tables.forEach((value) => this.addTable(value))
    return this
  }

  /**
   * @param {Any} value
   * @returns {Select}
   */
  addTable (value) {
    this.getTables().push(Identifier.from(value))
    return this
  }

  /**
   * @param {Any} columns
   * @returns {Select}
   */
  groupBy (...columns) {
    columns.forEach((value) => this.addGroup(value))
    return this
  }

  /**
   * @param {Any} value
   * @returns {Select}
   */
  addGroup (value) {
    this.getGroups().push(Identifier.from(value))
    return this
  }
}

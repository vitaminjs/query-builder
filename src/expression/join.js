
import Literal from './literal'
import Criteria from './criteria'
import Expression from '../expression'

/**
 * @class JoinExpression
 */
export default class Join extends Expression {
  /**
   * @param {Any} table
   * @param {String} type
   * @constructor
   */
  constructor (table, type = 'inner') {
    super()

    this.type = type
    this.wheres = []
    this.columns = []
    this.table = table
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Expression}
   */
  static from (table, type = 'inner') {
    if (table instanceof Join) return table

    if (table instanceof Literal) return table

    return new Join(Literal.from(table), type)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileJoin(this)
  }

  /**
   * @returns {Join}
   * @override
   */
  clone () {
    return new Join(this.table, this.type)
      .setColumns(this.columns.slice())
      .setConditions(this.wheres.slice())
  }

  /**
   * @returns {Array}
   */
  getColumns () {
    return this.columns
  }

  /**
   * @returns {Boolean}
   */
  hasColumns () {
    return this.columns.length > 0
  }

  /**
   * @returns {Join}
   */
  resetColumns () {
    return this.setColumns([])
  }

  /**
   * @param {Array} value
   * @returns {Join}
   */
  setColumns (value) {
    this.columns = value
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Join}
   */
  where (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments))
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Join}
   */
  orWhere (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Join}
   */
  whereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).not())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Join}
   */
  orWhereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or().not())
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasConditions () {
    return this.wheres.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Join}
   */
  setConditions (value) {
    this.wheres = value
    return this
  }

  /**
   * @returns {Join}
   */
  resetConditions () {
    return this.setConditions([])
  }

  /**
   * @returns {Array}
   */
  getConditions () {
    return this.wheres
  }
}

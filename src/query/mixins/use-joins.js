
import { Literal, Join } from '../../expression'
import { Criteria } from '../../criterion'
import { last } from 'lodash'

/**
 * @param {Class} parent
 * @returns {Class}
 */
export default (parent) => class extends parent {
  /**
   * @returns {Boolean}
   */
  hasJoins () {
    return this._joins && this._joins.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Query}
   */
  setJoins (value) {
    this._joins = value
    return this
  }

  /**
   * @returns {Array}
   */
  getJoins () {
    if (null == this._joins) this.resetJoins()

    return this._joins
  }

  /**
   * @returns {Query}
   */
  resetJoins () {
    return this.setJoins([])
  }

  /**
   * @param {Any} table
   * @returns {Query}
   */
  join (table) {
    return this.addJoin(table, 'inner')
  }

  /**
   * @param {Any} table
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Query}
   */
  rightJoin (table) {
    return this.addJoin(table, 'right')
  }

  /**
   * @param {Any} table
   * @returns {Query}
   */
  leftJoin (table) {
    return this.addJoin(table, 'left')
  }

  /**
   * @param {Any} table
   * @returns {Query}
   */
  crossJoin (table) {
    return this.addJoin(table, 'cross')
  }

  /**
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Query}
   * @throws {Error}
   */
  on (key, value) {
    let lastJoin = last(this.getJoins())

    if (!(lastJoin instanceof Join)) {
      throw new Error("Trying to add conditions to an undefined join expression")
    }

    lastJoin.setConditions(new Criteria().where(key, value))

    return this
  }

  /**
   * @param {Array} columns
   * @returns {Query}
   * @throws {Error}
   */
  using (...columns) {
    let lastJoin = last(this.getJoins())

    if (!(lastJoin instanceof Join)) {
      throw new Error("Trying to add using columns to an undefined join expression")
    }

    lastJoin.setColumns(columns)

    return this
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Query}
   * @throws {Error}
   */
  addJoin (table, type) {
    if (!(table instanceof Join || table instanceof Literal)) {
      table = new Join(table, type)
    }

    this.getJoins().push(table)

    return this
  }
}

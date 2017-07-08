
import mixin from './use-many'
import { Join } from '../../expression'
import { last, upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'joins') {
  /**
   * @param {Class} parent
   * @return {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {Any} table
     * @returns {Expression}
     */
    join (table) {
      return this.addJoin(table, 'inner')
    }

    /**
     * @param {Any} table
     * @returns {Expression}
     * @alias `join()`
     */
    innerJoin (table) {
      return this.join(table)
    }

    /**
     * @param {Any} table
     * @returns {Expression}
     */
    rightJoin (table) {
      return this.addJoin(table, 'right')
    }

    /**
     * @param {Any} table
     * @param {Any} key criterion operand
     * @param {Any} value criterion value
     * @returns {Expression}
     */
    leftJoin (table) {
      return this.addJoin(table, 'left')
    }

    /**
     * @param {Any} table
     * @returns {Expression}
     */
    crossJoin (table) {
      return this.addJoin(table, 'cross')
    }

    /**
     * @param {Any} key criterion operand
     * @param {Any} value criterion value
     * @returns {Expression}
     * @throws {TypeError}
     */
    on (key, value) {
      let expr = last(this[`get${upperFirst(field)}`]())

      if (expr instanceof Join) {
        expr.where(key, value)
        return this
      }

      throw new TypeError('Trying to add conditions to an undefined join expression')
    }

    /**
     * @param {Any} key criterion operand
     * @param {Any} value criterion value
     * @returns {Expression}
     * @throws {TypeError}
     */
    orOn (key, value) {
      let expr = last(this[`get${upperFirst(field)}`]())

      if (expr instanceof Join) {
        expr.orWhere(key, value)
        return this
      }

      throw new TypeError('Trying to add conditions to an undefined join expression')
    }

    /**
     * @param {Array} columns
     * @returns {Expression}
     * @throws {TypeError}
     */
    using (...columns) {
      let expr = last(this[`get${upperFirst(field)}`]())

      if (expr instanceof Join) {
        expr.setColumns(columns)
        return this
      }

      throw new TypeError('Trying to add `using` to an undefined join expression')
    }

    /**
     * @param {Any} table
     * @param {String} type
     * @returns {Expression}
     */
    addJoin (table, type) {
      this[`get${upperFirst(field)}`]().push(Join.from(table, type))
      return this
    }
  }
}

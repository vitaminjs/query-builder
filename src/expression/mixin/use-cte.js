
import mixin from './use-many'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'commonTables') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * Add common table expressions
     *
     * @param {Expression} cte
     * @returns {Expression}
     */
    withCTE (...cte) {
      cte.forEach((value) => this[`get${upperFirst(field)}`]().push(value))
      return this
    }
  }
}


import mixin from './use-many'
import Literal from '../literal'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'orders') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {Any} columns
     * @returns {Expression}
     */
    orderBy (...columns) {
      columns.forEach((value) => this.addOrder(value))
      return this
    }

    /**
     * @param {Any} value
     * @returns {Expression}
     */
    addOrder (value) {
      this[`get${upperFirst(field)}`]().push(Literal.from(value))
      return this
    }
  }
}

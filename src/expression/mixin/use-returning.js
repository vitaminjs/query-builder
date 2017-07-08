
import mixin from './use-many'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'output') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * Add returning columns
     *
     * @param {String[]} columns
     * @returns {Expression}
     */
    returning (...columns) {
      columns.forEach((value) => this[`get${upperFirst(field)}`]().push(value))
      return this
    }
  }
}

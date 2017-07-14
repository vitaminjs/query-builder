
import mixin from './use-many'
import Literal from '../literal'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'groups') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {Any} columns
     * @returns {Select}
     */
    groupBy (...columns) {
      columns.forEach((value) => {
        this[`get${upperFirst(field)}`]().push(Literal.from(value))
      })

      return this
    }
  }
}

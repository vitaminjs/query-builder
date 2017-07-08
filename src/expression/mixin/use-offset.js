
import mixin from './use-one'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'offset') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {Integer} value
     * @returns {Expression}
     */
    skip (value) {
      return this[`set${upperFirst(field)}`](value)
    }
  }
}

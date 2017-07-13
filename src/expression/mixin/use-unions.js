
import Union from '../union'
import mixin from './use-many'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field = 'unions') {
  /**
   * @param {Class} parent
   * @returns {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {String[]} columns
     * @returns {Expression}
     */
    union (query, filter = 'distinct') {
      this[`get${upperFirst(field)}`]().push(new Union(query, filter))
      return this
    }

    /**
     * @param {Expression} query
     * @returns {Expression}
     */
    unionAll (query) {
      return this.union(query, 'all')
    }
  }
}

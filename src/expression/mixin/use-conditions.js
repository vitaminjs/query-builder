
import mixin from './use-many'
import Criteria from '../criteria'
import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @param {String} method
 * @returns {Function}
 */
export default function (field = 'conditions', method = 'where') {
  let capField = upperFirst(field)

  /**
   * @param {Class} parent
   * @return {Class}
   */
  return (parent) => class extends mixin(field)(parent) {
    /**
     * @param {String} expr
     * @param {Array} args
     * @returns {Expression}
     */
    [method] (expr, ...args) {
      this[`get${capField}`]().push(Criteria.from(...arguments))
      return this
    }

    /**
     * @param {String} expr
     * @param {Array} args
     * @returns {Expression}
     */
    [`or${upperFirst(method)}`] (expr, ...args) {
      this[`get${capField}`]().push(Criteria.from(...arguments).or())
      return this
    }

    /**
     * @param {String} expr
     * @param {Array} args
     * @returns {Expression}
     */
    [`${method}Not`] (expr, ...args) {
      this[`get${capField}`]().push(Criteria.from(...arguments).not())
      return this
    }

    /**
     * @param {String} expr
     * @param {Array} args
     * @returns {Expression}
     */
    [`or${upperFirst(method)}Not`] (expr, ...args) {
      this[`get${capField}`]().push(Criteria.from(...arguments).or().not())
      return this
    }
  }
}

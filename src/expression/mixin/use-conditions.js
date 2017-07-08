
import mixin from './use-many'
import { upperFirst } from 'lodash'
import Criterion, { Criteria } from '../../criterion'

function condition (key, value, bool = 'and', not = false) {
  if (key instanceof Criterion) return key

  return new Criteria().where(key, value, bool, not)
}

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
     *
     * @param {Any} key
     * @param {Any} value
     * @returns {Expression}
     * @see `Criteria.where()`
     */
    [method] (key, value) {
      this[`get${capField}`]().push(condition(key, value))
      return this
    }

    /**
     *
     * @param {Any} key
     * @param {Any} value
     * @returns {Expression}
     * @see `Criteria.orWhere()`
     */
    [`or${upperFirst(method)}`] (key, value) {
      this[`get${capField}`]().push(condition(key, value, 'or'))
      return this
    }

    /**
     *
     * @param {Any} key
     * @param {Any} value
     * @returns {Expression}
     * @see `Criteria.whereNot()`
     */
    [`${method}Not`] (key, value) {
      this[`get${capField}`]().push(condition(key, value, 'and', true))
      return this
    }

    /**
     *
     * @param {Any} key
     * @param {Any} value
     * @returns {Expression}
     * @see `Criteria.orWhereNot()`
     */
    [`or${upperFirst(method)}Not`] (key, value) {
      this[`get${capField}`]().push(condition(key, value, 'or', true))
      return this
    }
  }
}


import { upperFirst } from 'lodash'

/**
 * @param {String} field
 * @returns {Function}
 */
export default function (field) {
  let capField = upperFirst(field)

  /**
   * @param {Class} parent
   * @return {Class}
   */
  return (parent) => class extends parent {
    /**
     *
     * @returns {Boolean}
     */
    [`has${capField}`] () {
      return this[field] != null
    }

    /**
     * @param {Any} value
     * @returns {Expression}
     */
    [`set${capField}`] (value) {
      this[field] = value
      return this
    }

    /**
     * @returns {Expression}
     */
    [`reset${capField}`] () {
      return this[`set${capField}`](null)
    }

    /**
     * @returns {Any}
     */
    [`get${capField}`] () {
      return this[field]
    }

    /**
     * @return {Expression}
     * @override
     */
    clone () {
      let query = super.clone()

      if (this[`has${capField}`]()) {
        query[`set${capField}`](this[`get${capField}`]())
      }

      return query
    }
  }
}

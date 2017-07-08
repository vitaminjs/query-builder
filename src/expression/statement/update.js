
import { extend, isString, castArray } from 'lodash'
import Statement from '../statement'

/**
 * @class UpdateQuery
 */
export default class Update extends Statement {
  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileUpdateQuery(this)
  }

  /**
   * @param {String|Object} key
   * @param {Any} value
   * @returns {Update}
   */
  set (key, value = undefined) {
    let data = isString(key) ? { [key]: value } : key

    this.getValues().push(data)

    return this
  }

  /**
   * @returns {Object}
   */
  getObjectValues () {
    return this.getValues().reduce(extend, {})
  }

  /**
   * @param {Object} data
   * @returns {Update}
   * @override
   */
  setValues (data) {
    return super.setValues(castArray(data))
  }
}

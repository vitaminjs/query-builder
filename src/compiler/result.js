
import { isBoolean } from 'lodash'

export default class {
  /**
   * @param {Stirng} sql
   * @param {Array} params
   * @constructor
   */
  constructor (sql, params) {
    this.sql = sql
    this.params = params
  }

  /**
   * @returns {String}
   */
  toString () {
    let i = 0

    return this.sql.replace(/\?|\$(\d*)/g, (_, p) => {
      return this.escape(this.params[p ? p - 1 : i++])
    })
  }

  /**
   * @param {Any} value
   * @returns {String}
   * @private
   */
  escape (value) {
    if (isBoolean(value)) return String(Number(value))

    return String(value).replace(/'/g, "''")
  }
}

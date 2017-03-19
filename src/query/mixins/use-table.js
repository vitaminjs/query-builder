
/**
 * @param {Class} parent
 * @returns {Class}
 */
export default (parent) => class extends parent {

  /**
   * 
   * @constructor
   */
  constructor() {
    super()

    this._table = null
  }

  /**
   * 
   * @returns {String|Expression}
   */
  getTable() {
    return this._table
  }

  /**
   * 
   * @param {String|Expression} value
   * @returns {Query}
   */
  setTable(value) {
    this._table = this.ensureExpression(value)
    return this
  }

  /**
   * 
   * @returns {Query}
   */
  resetTable() {
    this._table = null
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasTable() {
    return this._table != null
  }

}

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

    this._returning = []
  }

  /**
   * Add returning columns
   * 
   * @param {String[]} columns
   * @returns {Query}
   */
  returning(...columns) {
    for ( let value of columns )
      this._returning.push(this.ensureExpression(value))
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasReturning() {
    return this._returning.length > 0
  }

  /**
   * 
   * @returns {Array}
   */
  getReturning() {
    return this._returning
  }

  /**
   * 
   * @param {Array} columns
   * @returns {Query}
   */
  setReturning(columns) {
    this._returning = columns.map(this.ensureExpression)
    return this
  }

  /**
   * 
   * @returns {Query}
   */
  resetReturning() {
    return this.setReturning([])
  }

}

const RETURNING = 'returning'

/**
 * @param {Class} parent
 * @returns {Class}
 */
export default (parent) => class extends parent {

  /**
   * Add returning columns
   * 
   * @param {String[]} columns
   * @returns {Query}
   */
  returning(...columns) {
    for ( let value of columns )
      this.getReturning().push(this.ensureExpression(value))
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasReturning() {
    return this.hasOption(RETURNING) && this.getReturning().length > 0
  }

  /**
   * 
   * @returns {Array}
   */
  getReturning() {
    if (! this.hasOption(RETURNING) )
      this.resetReturning()
    
    return this.option(RETURNING)
  }

  /**
   * 
   * @param {Array} columns
   * @returns {Query}
   */
  setReturning(columns) {
    return this.option(RETURNING, columns.map(this.ensureExpression))
  }

  /**
   * 
   * @returns {Query}
   */
  resetReturning() {
    return this.setReturning([])
  }

}
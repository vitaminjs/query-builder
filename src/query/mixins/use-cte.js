
const WITH = 'with'

/**
 * @param {Class} parent
 * @returns {Class}
 */
export default (parent) => class extends parent {

  /**
   * Add common table expressions
   * 
   * @param {Expression} cte
   * @returns {Query}
   */
  with(...cte) {
    for ( let value of cte )
      this.getCommonTables().push(value)
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasCommonTables() {
    return this.hasOption(WITH) && this.getCommonTables().length > 0
  }

  /**
   * 
   * @returns {Array}
   */
  getCommonTables() {
    if (! this.hasOption(WITH) )
      this.resetCommonTables()
    
    return this.option(WITH)
  }

  /**
   * 
   * @param {Array} expressions
   * @returns {Query}
   */
  setCommonTables(expressions) {
    return this.option(WITH, expressions)
  }

  /**
   * 
   * @returns {Query}
   */
  resetCommonTables() {
    return this.setCommonTables([])
  }

}
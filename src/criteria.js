
/**
 * @class Criteria
 */
export default class {
  
  constructor(column, operator = 'eq', value = null) {
    this.operator = operator
    this.column   = column
    this.value    = value
    this.prefix   = 'and'
    this.negate   = false
    
    this.type     = 'basic'
  }
  
  and() {
    this.prefix = 'and'
    return this
  }
  
  or() {
    this.prefix = 'or'
    return this
  }
  
  not() {
    this.negate = true
    return this
  }
  
  static basic(column, operator = 'eq', value = null) {
    return new this(...arguments)
  }
  
  /**
   * 
   * @param {Object} object
   * @return criteria
   */
  static group(object) {
    var cr = new this(null)
    
    cr.type = 'group'
    cr.column = Object.keys(object).map(key => {
      return this.basic(key, 'eq', object[key])
    })
    
    return cr
  }
  
}
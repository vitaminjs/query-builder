
import { Criteria } from '../../criterion'

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

    this._conditions = null
  }
  
  /**
   * 
   * @param {Any} condition
   * @returns {Query}
   * @see `Criteria.where()`
   */
  where(...condition) {
    this.getConditions().where(...condition)
    return this
  }
  
  /**
   * 
   * @param {Any} condition
   * @returns {Query}
   * @see `Criteria.orWhere()`
   */
  orWhere(...condition) {
    this.getConditions().orWhere(...condition)
    return this
  }
  
  /**
   * 
   * @param {Any} condition
   * @returns {Query}
   * @see `Criteria.whereNot()`
   */
  whereNot(expr, value, bool = 'and') {
    this.getConditions().whereNot(...condition)
    return this
  }
  
  /**
   * 
   * @param {Any} condition
   * @returns {Query}
   * @see `Criteria.orWhereNot()`
   */
  orWhereNot(...condition) {
    this.getConditions().orWhereNot(...condition)
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasConditions() {
    return !( this._conditions == null || this._conditions.isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Query}
   */
  setConditions(value) {
    this._conditions = value
    return this
  }

  /**
   * 
   * @returns {Query}
   */
  resetConditions() {
    return this.setConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getConditions() {
    if ( this._conditions == null )
      this.resetConditions()

    return this._conditions
  }

}
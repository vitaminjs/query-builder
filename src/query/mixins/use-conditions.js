
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
   * @param {Any} expr
   * @param {Any} args
   * @returns {Query}
   */
  where(expr, ...args) {
    this.getConditions().where(...arguments)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {Any} args
   * @returns {Query}
   */
  orWhere(expr, ...args) {
    this.where(...arguments)

    // TODO add or boolean to the last criterion
    // last(this.getConditions()).setBoolean('or')

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
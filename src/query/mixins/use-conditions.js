
import { Criteria } from '../../criterion'

/**
 * Capitalize only the first character
 * 
 * @param {String} value
 * @returns {String}
 */
function capitalize(value) {
  return value.substr(0, 1).toUpperCase() + value.slice(1)
}

/**
 * @param {Class} parent
 * @param {String} field
 * @param {String} method
 * @returns {Class}
 */
export default (parent, field = 'conditions', method = 'where') => class extends parent {

  /**
   * 
   * @constructor
   */
  constructor() {
    super()

    this['_' + field] = null
  }
  
  /**
   * 
   * @param {Any} key
   * @param {Any} value
   * @returns {Query}
   * @see `Criteria.where()`
   */
  [method](key, value) {
    this['get' + capitalize(field)]().where(key, value)
    return this
  }
  
  /**
   * 
   * @param {Any} key
   * @param {Any} value
   * @returns {Query}
   * @see `Criteria.orWhere()`
   */
  ['or' + capitalize(method)](key, value) {
    this['get' + capitalize(field)]().orWhere(key, value)
    return this
  }
  
  /**
   * 
   * @param {Any} key
   * @param {Any} value
   * @returns {Query}
   * @see `Criteria.whereNot()`
   */
  [method + 'Not'](key, value) {
    this['get' + capitalize(field)]().whereNot(key, value)
    return this
  }
  
  /**
   * 
   * @param {Any} key
   * @param {Any} value
   * @returns {Query}
   * @see `Criteria.orWhereNot()`
   */
  [`or${capitalize(method)}Not`](key, value) {
    this['get' + capitalize(field)]().orWhereNot(key, value)
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  ['has' + capitalize(field)]() {
    return !( this['_' + field] == null || this['_' + field].isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Query}
   */
  ['set' + capitalize(field)](value) {
    this['_' + field] = value
    return this
  }

  /**
   * 
   * @returns {Query}
   */
  ['reset' + capitalize(field)]() {
    return this['set' + capitalize(field)](new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  ['get' + capitalize(field)]() {
    if ( this['_' + field] == null )
      this['reset' + capitalize(field)]()

    return this['_' + field]
  }

}
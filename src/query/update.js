
import Expression, { Literal } from '../expression'
import { isString } from 'lodash'
import Query from './base'

/**
 * @class UpdateQuery
 */
export default class Update extends Query {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._conditions  = null
    this._table       = null
    this._data        = {}
  }

  /**
   * 
   * @returns {Expression}
   */
  getTable() {
    return this._table
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasTable() {
    return this._table != null
  }

  /**
   * 
   * @param {String|Expression} value
   * @returns {Update}
   */
  setTable(value) {
    if ( isString(value) )
      value = new Literal(value)
    
    // ensure the table expression
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid update expression")

    this._table = value
    return this
  }
  
  /**
   * 
   * @param {String|Object} key
   * @param {Any} value
   * @returns {Update}
   */
  set(key, value = undefined) {
    // TODO
    return this
  }

  /**
   * 
   * @returns {Delete}
   */
  where() {
    // TODO
    return this
  }

  /**
   * 
   * @returns {Delete}
   */
  orWhere() {
    // TODO
    return this
  }

  /**
   * 
   * @param {String} output
   * @returns {Update}
   */
  returning(...output) {
    return this.option('returning', output)
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if ( this._table == null ) return ''

    return compiler.compileUpdateQuery(this)
  }
  
}
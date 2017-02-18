
import Expression, { Literal } from '../expression'
import { isString } from 'lodash'
import Query from './base'

/**
 * @class DeleteQuery
 */
export default class Delete extends Query {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._conditions  = null
    this._table       = null
  }

  /**
   * 
   * @param {String|Expression} value
   * @returns {Delete}
   */
  from(value) {
    return this.setTable(value)
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
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if ( this._table == null ) return ''

    return compiler.compileDeleteQuery(this)
  }
  
}
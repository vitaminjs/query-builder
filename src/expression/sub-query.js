
import { isString, isEmpty } from 'lodash'
import Expression from './base'

/**
 * @class SubQueryExpression
 */
export default class SubQuery extends Expression {
  
  /**
   * 
   * @param {Query|Literal} query
   * @constructor
   */
  constructor(query) {
    super()
    
    this.columns = []
    this.query = query
    this._isCTE = false
  }

  /**
   * 
   * @param {String} table
   * @param {Array} columns
   */
  as(table, ...columns) {
    this.columns = columns

    return super.as(table)
  }

  /**
   * 
   * @param {Boolean} flag
   * @returns {SubQuery}
   */
  isCTE(flag = true) {
    this._isCTE = flag
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    let table = compiler.quote(this.alias)
    let query = `(${this.query.compile(compiler)})`

    if (! isEmpty(this.columns) ) {
      let columns = this.columns.map(value => compiler.quote(value))

      table += `(${columns.join(', ')})`
    }

    return this._isCTE ? `${table} as ${query}` : `${query} as ${table}`
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return expr === this.alias

    return super.isEqual() || (
      expr instanceof SubQuery && expr.alias === this.alias
    )
  }
  
}
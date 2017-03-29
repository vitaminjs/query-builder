
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
   * @param {String} name
   * @param {Array} columns
   */
  as(name, ...columns) {
    this.columns = columns

    return super.as(name)
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
    let query = `(${this.query.compile(compiler)})`

    if (! this.alias ) return query

    let name = compiler.quote(this.alias)
    
    if (! isEmpty(this.columns) ) {
      let columns = this.columns.map(value => compiler.quote(value))

      name += `(${columns.join(', ')})`
    }

    return this._isCTE ? `${name} as ${query}` : `${query} as ${name}`
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
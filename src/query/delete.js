
import Expression, { Literal } from '../expression'
import { isString, isEmpty } from 'lodash'
import { Criteria } from '../criterion'
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
    
    this._returning   = []
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
      throw new TypeError("Invalid delete expression")

    this._table = value
    return this
  }

  /**
   * 
   * @returns {Delete}
   */
  resetTable() {
    this._table = null
    return this
  }

  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Delete}
   */
  where(expr, operator, value, bool = 'and', not = false) {
    this.getConditions().where(expr, operator, value, bool, not)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {Boolean} not
   * @returns {Delete}
   */
  orWhere(expr, operator, value) {
    return this.where(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Delete}
   */
  whereNot(expr, operator, value, bool = 'and') {
    this.getConditions().whereNot(expr, operator, value, bool)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Delete}
   */
  orWhereNot(expr, operator, value) {
    return this.whereNot(expr, operator, value, 'or')
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
   * @returns {Delete}
   */
  setConditions(value) {
    this._conditions = value
    return this
  }

  /**
   * 
   * @returns {Delete}
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

  /**
   * 
   * @param {String[]} columns
   * @returns {Delete}
   */
  returning(...columns) {
    return this.setReturning(columns)
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasReturning() {
    return !isEmpty(this._returning)
  }

  /**
   * 
   * @returns {Array}
   */
  getReturning() {
    return this._returning
  }

  /**
   * 
   * @param {Array} columns
   * @returns {Delete}
   */
  setReturning(columns) {
    var mapper = value => isString(value) ? Literal.from(value) : value
    
    this._returning = columns.map(mapper)

    return this
  }

  /**
   * 
   * @returns {Delete}
   */
  resetReturning() {
    return this.setReturning([])
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if (! this.hasTable() ) return ''

    return compiler.compileDeleteQuery(this)
  }

  /**
   * 
   * @return {Delete}
   */
  clone() {
    var query = new Delete()

    this.hasTable() && query.getTable()
    this.hasReturning() && query.setReturning(this.getReturning().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())

    return query.setOptions(this.getOptions())
  }
  
}
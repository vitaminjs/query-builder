
import { extend, fromPairs, isString, isEmpty } from 'lodash'
import Expression, { Literal } from '../expression'
import { Criteria } from '../criterion'
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
    
    this._returning   = []
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
   * @returns {Update}
   */
  resetTable() {
    this._table = null
    return this
  }
  
  /**
   * 
   * @param {String|Object} one
   * @param {Any} two
   * @returns {Update}
   */
  set(one, two = undefined) {
    extend(this._data, isString(one) ? fromPairs([[one, two]]) : one)
    return this
  }

  /**
   * 
   * @returns {Object}
   */
  getValues() {
    return this._data
  }

  /**
   * 
   * @param {Object} data
   * @returns {Update}
   */
  setValues(data) {
    this._data = extend({}, data)
    return this
  }

  /**
   * 
   * @returns {Update}
   */
  resetValues() {
    this._data = {}
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasValues() {
    return !isEmpty(this._data)
  }

  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Update}
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
   * @returns {Update}
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
   * @returns {Update}
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
   * @returns {Update}
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
   * @returns {Update}
   */
  setConditions(value) {
    this._conditions = value
    return this
  }

  /**
   * 
   * @returns {Update}
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
   * @returns {Update}
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
   * @returns {Update}
   */
  setReturning(columns) {
    var mapper = value => isString(value) ? Literal.from(value) : value
    
    this._returning = columns.map(mapper)

    return this
  }

  /**
   * 
   * @returns {Update}
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
    if (! (this.hasTable() && this.hasValues()) ) return ''

    return compiler.compileUpdateQuery(this)
  }

  /**
   * 
   * @return {Update}
   */
  clone() {
    var query = new Update()

    this.hasTable() && query.getTable()
    this.hasValues() && query.setValues(this.getValues())
    this.hasReturning() && query.setReturning(this.getReturning().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())

    return query.setOptions(this.getOptions())
  }
  
}
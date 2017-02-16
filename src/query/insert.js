
import Expression, { Literal } from '../expression'
import { isString, isEmpty } from 'lodash'
import Query from './base'

/**
 * @class InsertQuery
 */
export default class Insert extends Query {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._data = null
    this._table = null
    this._columns = []
  }

  /**
   * 
   * @param {Any} data
   * @returns {Insert}
   */
  values(data) {
    this._data = data
    return this
  }

  /**
   * 
   * @returns {Any}
   */
  getValues() {
    return this._data
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
   * @returns {Insert}
   */
  defaultValues() {
    return this.option('default values', true)
  }

  /**
   * 
   * @param {String|Expression} table
   * @param {String|Expression} columns
   * @returns {Insert}
   */
  into(table, ...columns) {
    if ( isString(table) )
      table = new Literal(table)
    
    // ensure the table expression
    if (! (table instanceof Expression) )
      throw new TypeError("Invalid insert expression")
    
    // map the column names
    columns.forEach(value => isString(value) ? new Literal(value) : value)

    this._columns = columns
    this._table = table
    return this
  }

  /**
   * 
   * @returns {String|Expression}
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
   * @returns {Array}
   */
  getColumns() {
    return this._columns
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasColumns() {
    return !isEmpty(this._columns)
  }

  /**
   * 
   * @param {String[]} output
   * @returns {Insert}
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
    if (! this._table ) return ''

    return compiler.compileInsertQuery(this)
  }
  
}

import { isString, isEmpty, isArray, chain, keys } from 'lodash'
import Expression, { Literal } from '../expression'
import Select from './select'
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
    
    this._data    = []
    this._table   = null
    this._select  = null
    this._columns = []

    // a flag to determine who added to query columns
    this._userDefinedColumns = false
  }

  /**
   * 
   * @param {Any} data
   * @returns {Insert}
   */
  values(data) {
    return this.setValues(data)
  }

  /**
   * 
   * @returns {Array}
   */
  getValues() {
    return this._data
  }

  /**
   * 
   * @param {Object|Array} data
   * @returns {Insert}
   */
  setValues(data) {
    if (! isArray(data) ) data = [data]

    if (! this._userDefinedColumns )
      this.setColumns(chain(data).map(keys).flatten().uniq().value())

    this._data = data
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
   * @returns {Insert}
   */
  defaultValues() {
    return this.option('default values', true)
  }

  /**
   * 
   * @param {Select|Expression}
   * @returns {Insert}
   */
  select(query) {
    return this.setSelect(query)
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasSelect() {
    return this._select != null
  }

  /**
   * 
   * @returns {Expression}
   */
  getSelect() {
    return this._select
  }

  /**
   * 
   * @param {Select|Expression}
   * @returns {Insert}
   */
  setSelect(query) {
    if ( query instanceof Select )
      query = query.toExpression()

    this._select = query
    return this
  }

  /**
   * 
   * @param {String|Expression} table
   * @param {String|Expression} columns
   * @returns {Insert}
   */
  into(table, ...columns) {
    if (! isEmpty(columns) )
      this._userDefinedColumns = true
    
    return this.setTable(table).setColumns(columns)
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
   * @param {String|Expression} value
   * @returns {Insert}
   */
  setTable(value) {
    if ( isString(value) )
      value = new Literal(value)
    
    // ensure the table expression
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid insert expression")
    
    this._table = value
    return this
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
   * @param {Array} columns
   * @returns {Insert}
   */
  setColumns(columns) {
    let mapper = value => isString(value) ? new Literal(value) : value
    
    this._columns = columns.map(mapper)
    return this
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
   * @returns {Insert}
   */
  onConflictIgnore($) {
    // TODO
    return this
  }

  /**
   * 
   * @returns {Insert}
   */
  onConflictUpdate($) {
    // TODO
    return this
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
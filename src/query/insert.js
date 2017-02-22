
import { isString, isEmpty, isFunction, isArray, chain, keys } from 'lodash'
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
    
    this._data      = []
    this._table     = null
    this._select    = null
    this._columns   = []
    this._returning = []
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

    if (! this.hasColumns() )
      this.setColumns(chain(data).map(keys).flatten().uniq().value())

    this._data = data
    return this
  }

  /**
   * 
   * @returns {Insert}
   */
  resetValues() {
    return this.setValues([])
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
   * @param {Select|Function}
   * @returns {Insert}
   */
  select(query) {
    if ( isFunction(query) ) {
      let fn = query

      fn(query = new Select())
    }

    return this.setSelect(query)
  }

  /**
   * 
   * @returns {Insert}
   */
  resetSelect() {
    return this.setSelect(null)
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
   * @returns {Select}
   */
  getSelect() {
    return this._select
  }

  /**
   * 
   * @param {Select}
   * @returns {Insert}
   */
  setSelect(query) {
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
    if (! isEmpty(columns) ) {
      this._columnsAlreadyDefined = true
      this.setColumns(columns)
    }
    
    return this.setTable(table)
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
      value = Literal.from(value)
    
    // ensure the table expression
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid insert expression")
    
    this._table = value
    return this
  }

  /**
   * 
   * @returns {Insert}
   */
  resetTable() {
    this._table = null
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
    var mapper = value => isString(value) ? Literal.from(value) : value
    
    this._columns = columns.map(mapper)
    return this
  }

  /**
   * 
   * @returns {Insert}
   */
  resetColumns() {
    return this.setColumns([])
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
   * @param {String[]} columns
   * @returns {Insert}
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
   * @returns {Insert}
   */
  setReturning(columns) {
    var mapper = value => isString(value) ? Literal.from(value) : value
    
    this._returning = columns.map(mapper)

    return this
  }

  /**
   * 
   * @returns {Insert}
   */
  resetReturning() {
    return this.setReturning([])
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
    if (! this.hasTable() ) return ''

    return compiler.compileInsertQuery(this)
  }

  /**
   * 
   * @return {Insert}
   */
  clone() {
    var query = new Insert()

    this.hasTable() && query.getTable()
    this.hasSelect() && query.setSelect(this.getSelect())
    this.hasValues() && query.setValues(this.getValues().slice())
    this.hasColumns() && query.setColumns(this.getColumns().slice())
    this.hasReturning() && query.setReturning(this.getReturning().slice())

    return query.setOptions(this.getOptions())
  }
  
}

import { isEmpty, isFunction, isArray, isString, chain, keys, clone } from 'lodash'
import { UseCTE, UseTable, UseReturning } from './mixins'
import Expression, { Literal } from '../expression'
import Select from './select'
import Query from './base'

/**
 * @class InsertQuery
 */
export default class Insert extends UseTable(UseReturning(UseCTE(Query))) {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._values  = []
    this._columns = []
    this._select  = null
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
    return this._values
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

    this._values = data
    
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
    return !isEmpty(this._values)
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
   * @param {Any} query
   * @returns {Insert}
   */
  select(query) {
    if ( isString(query) )
      query = Literal.from(query)
    
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
    if (! isEmpty(columns) )
      this.setColumns(columns)
    
    return this.setTable(table)
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
    this._columns = columns.map(this.ensureExpression)
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
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return this.hasTable() ? compiler.compileInsertQuery(this) : ''
  }

  /**
   * 
   * @return {Insert}
   */
  clone() {
    var query = new Insert()

    this.hasTable() && query.getTable()
    query.setOptions(clone(this.getOptions()))
    this.hasSelect() && query.setSelect(this.getSelect())
    this.hasValues() && query.setValues(this.getValues().slice())
    this.hasColumns() && query.setColumns(this.getColumns().slice())
    this.hasReturning() && query.setReturning(this.getReturning().slice())
    this.hasCommonTables() && query.setCommonTables(this.getCommonTable().slice())

    return query
  }
  
}
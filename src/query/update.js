
import { extend, clone, fromPairs, isString, isEmpty } from 'lodash'
import { UseTable, UseReturning, UseConditions, UseCTE } from './mixins'
import Query from './base'

/**
 * @class UpdateQuery
 */
export default class Update extends UseTable(UseReturning(UseConditions(UseCTE(Query)))) {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._data = {}
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
    this._data = data
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
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return this.hasTable() && this.hasValues() ? compiler.compileUpdateQuery(this) : ''
  }

  /**
   * 
   * @return {Update}
   */
  clone() {
    var query = new Update()

    this.hasTable() && query.getTable()
    query.setOptions(clone(this.getOptions()))
    this.hasValues() && query.setValues(this.getValues())
    this.hasReturning() && query.setReturning(this.getReturning().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())
    this.hasCommonTables() && query.setCommonTables(this.getCommonTable().slice())

    return query
  }
  
}
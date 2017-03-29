
import { has, extend, isString, isPlainObject } from 'lodash'
import Expression, { Literal, SubQuery } from '../expression'
import Compiler, { createCompiler } from '../compiler'

/**
 * @class BaseQuery
 */
export default class Query {

  /**
   * 
   * @constructor
   */
  constructor() {
    this._options = {}
  }

  /**
   * Set/Get a query option
   * 
   * @param {String} name
   * @param {Any} value
   * @returns {Query}
   */
  option(name, value = undefined) {
    if ( isPlainObject(name) ) {
      extend(this._options, name)
      return this
    }

    if ( undefined !== value ) {
      this._options[name] = value
      return this
    }

    return this._options[name]
  }

  /**
   * 
   * @param {String} name
   * @returns {Boolean}
   */
  hasOption(name) {
    return has(this._options, name)
  }

  /**
   * 
   * @returns {Object}
   */
  getOptions() {
    return this._options
  }

  /**
   * 
   * @param {Object} value
   * @returns {Query}
   */
  setOptions(value) {
    this._options = value
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return ''
  }

  /**
   * 
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   */
  build(dialect, options = {}) {
    if ( isString(dialect) )
      dialect = createCompiler(dialect, options)
    
    if ( dialect instanceof Compiler ) {
      let sql = this.compile(dialect)
      let params = dialect.getBindings()

      return { sql, params }
    }
    
    throw new TypeError("Invalid query compiler")
  }

  /**
   * 
   * @returns {SubQuery}
   */
  toExpression() {
    return new SubQuery(this)
  }

  /**
   * 
   * @returns {SubQuery}
   */
  toCTE() {
    return this.toExpression().isCTE()
  }

  /**
   * 
   * @param {String} name
   * @param {Array} columns
   * @returns {SubQuery}
   */
  as(name, ...columns) {
    return this.toExpression().as(name, ...columns)
  }
  
  /**
   * 
   * @returns {Object}
   * @deprecated use `build()` instead
   */
  toSQL() {
    return this.build(...arguments)
  }

  /**
   * 
   * @param {Any} expr
   * @return {Expression}
   * @private
   */
  ensureExpression(value) {
    return value instanceof Expression ? value : Literal.from(value)
  }
  
}

import Join from './join'
import Alias from './alias'
import { last } from 'lodash'
import Expression from './base'
import { Select, Delete, Update, Insert } from './statement'

/**
 * @class TableExpression
 */
export default class Table extends Expression {
  /**
   * @param {Expression} name
   * @constructor
   */
  constructor (name) {
    super()

    this.joins = []
    this.name = name
  }

  /**
   * @param {String} name
   * @returns {Alias}
   */
  as (name) {
    return new Alias(this, name)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileTable(this)
  }

  /**
   * @returns {Table}
   * @override
   */
  clone () {
    return new Table(this.name).setJoins(this.joins.slice())
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Builder}
   */
  join (table, type = 'inner') {
    this.getJoins().push(Join.from(table, type))
    return this
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   * @alias `join()`
   */
  innerJoin (table) {
    return this.join(table)
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  rightJoin (table) {
    return this.join(table, 'right')
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  leftJoin (table) {
    return this.join(table, 'left')
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  crossJoin (table) {
    return this.join(table, 'cross')
  }

  /**
   * @param {Any} condition
   * @param {Array} args
   * @returns {Builder}
   * @throws {TypeError}
   */
  on (condition, ...args) {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.where(condition, ...args)
      return this
    }

    throw new TypeError('Trying to add conditions to an undefined join expression')
  }

  /**
   * @param {Any} condition
   * @param {Array} args
   * @returns {Builder}
   * @throws {TypeError}
   */
  orOn (condition, ...args) {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.orWhere(condition, ...args)
      return this
    }

    throw new TypeError('Trying to add conditions to an undefined join expression')
  }

  /**
   * @param {Array} columns
   * @returns {Builder}
   * @throws {TypeError}
   */
  using (...columns) {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.setColumns(columns)
      return this
    }

    throw new TypeError('Trying to add `using` to an undefined join expression')
  }

  /**
   * @returns {Boolean}
   */
  hasJoins () {
    return this.joins.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setJoins (value) {
    this.joins = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetJoins () {
    return this.setJoins([])
  }

  /**
   * @returns {Array}
   */
  getJoins () {
    return this.joins
  }

  /**
   * @param {Array} fields
   * @returns {Select}
   */
  select (...fields) {
    return new Select(this).setFields(fields)
  }
}

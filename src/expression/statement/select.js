
import Join from '../join'
import Union from '../union'
import { last } from 'lodash'
import Literal from '../literal'
import Criteria from '../criteria'
import Statement from '../statement'

/**
 * @class SelectStatement
 */
export default class Select extends Statement {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.joins = []
    this.unions = []
    this.groups = []
    this.fields = []
    this.wheres = []
    this.orders = []
    this.havings = []
    this.limit = null
    this.offset = null
    this.isDistinct = false
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    if (this.table || this.hasFields() || this.hasCTE()) {
      return compiler.compileSelectQuery(this)
    }

    return ''
  }

  /**
   * @returns {Select}
   * @override
   */
  clone () {
    return new Select(this.table)
      .setLimit(this.limit)
      .setOffset(this.offset)
      .distinct(this.isDistinct)
      .setJoins(this.joins.slice())
      .setUnions(this.unions.slice())
      .setGroups(this.groups.slice())
      .setFields(this.fields.slice())
      .setOrders(this.orders.slice())
      .setConditions(this.wheres.slice())
      .setHavingConditions(this.havings.slice())
  }

  /**
   * @param {Array} fields
   * @returns {Select}
   */
  select (...fields) {
    fields.forEach((value) => {
      if (value === '*') return

      if (value instanceof Select) {
        value = value.toSubQuery()
      }

      this.getFields().push(Literal.from(value))
    })

    return this
  }

  /**
   * @returns {Array}
   */
  getFields () {
    return this.fields
  }

  /**
   * @returns {Boolean}
   */
  hasFields () {
    return this.fields.length > 0
  }

  /**
   * @returns {Select}
   */
  resetFields () {
    return this.setFields([])
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setFields (value) {
    this.fields = value
    return this
  }

  /**
   * @param {Boolean} flag
   * @returns {Select}
   */
  distinct (flag = true) {
    this.isDistinct = flag
    return this
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Select}
   */
  join (table, type = 'inner') {
    if (table instanceof Select) {
      table = new Join(table.toSubQuery(), type)
    }

    this.getJoins().push(Join.from(table, type))
    return this
  }

  /**
   * @param {Any} table
   * @returns {Select}
   * @alias `join()`
   */
  innerJoin (table) {
    return this.join(table)
  }

  /**
   * @param {Any} table
   * @returns {Select}
   */
  rightJoin (table) {
    return this.join(table, 'right')
  }

  /**
   * @param {Any} table
   * @returns {Select}
   */
  leftJoin (table) {
    return this.join(table, 'left')
  }

  /**
   * @param {Any} table
   * @returns {Select}
   */
  crossJoin (table) {
    return this.join(table, 'cross')
  }

  /**
   * @param {Any} condition
   * @param {Array} args
   * @returns {Select}
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
   * @returns {Select}
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
   * @returns {Select}
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
   * @returns {Select}
   */
  setJoins (value) {
    this.joins = value
    return this
  }

  /**
   * @returns {Select}
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
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  where (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments))
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  orWhere (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  whereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).not())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  orWhereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or().not())
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasConditions () {
    return this.wheres.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setConditions (value) {
    this.wheres = value
    return this
  }

  /**
   * @returns {Select}
   */
  resetConditions () {
    return this.setConditions([])
  }

  /**
   * @returns {Array}
   */
  getConditions () {
    return this.wheres
  }

  /**
   * @param {Any} columns
   * @returns {Select}
   */
  groupBy (...columns) {
    columns.forEach((value) => this.getGroups().push(Literal.from(value)))
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasGroups () {
    return this.groups.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setGroups (value) {
    this.groups = value
    return this
  }

  /**
   * @returns {Select}
   */
  resetGroups () {
    return this.setGroups([])
  }

  /**
   * @returns {Array}
   */
  getGroups () {
    return this.groups
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  having (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments))
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  orHaving (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).or())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  havingNot (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).not())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Select}
   */
  orHavingNot (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).or().not())
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasHavingConditions () {
    return this.havings.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setHavingConditions (value) {
    this.havings = value
    return this
  }

  /**
   * @returns {Select}
   */
  resetHavingConditions () {
    return this.setHavingConditions([])
  }

  /**
   * @returns {Array}
   */
  getHavingConditions () {
    return this.havings
  }

  /**
   * @param {Any} query
   * @param {String} filter
   * @returns {Select}
   */
  union (query, filter = 'distinct') {
    this.getUnions().push(Union.from(query, filter))
    return this
  }

  /**
   * @param {Any} query
   * @returns {Select}
   */
  unionAll (query) {
    return this.union(query, 'all')
  }

  /**
   * @returns {Array}
   */
  getUnions () {
    return this.unions
  }

  /**
   * @returns {Boolean}
   */
  hasUnions () {
    return this.unions.length > 0
  }

  /**
   * @returns {Select}
   */
  resetUnions () {
    return this.setUnions([])
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setUnions (value) {
    this.unions = value
    return this
  }

  /**
   * @param {Any} columns
   * @returns {Select}
   */
  orderBy (...columns) {
    columns.forEach((value) => this.getOrders().push(Literal.from(value)))
    return this
  }

  /**
   * @returns {Array}
   */
  getOrders () {
    return this.orders
  }

  /**
   * @returns {Boolean}
   */
  hasOrders () {
    return this.orders.length > 0
  }

  /**
   * @returns {Select}
   */
  resetOrders () {
    return this.setOrders([])
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setOrders (value) {
    this.orders = value
    return this
  }

  /**
   * @alias `setLimit`
   */
  take (value) {
    return this.setLimit(value)
  }

  /**
   * @returns {Boolean}
   */
  hasLimit () {
    return this.limit != null
  }

  /**
   * @param {Any} value
   * @returns {Select}
   */
  setLimit (value) {
    this.limit = value
    return this
  }

  /**
   * @returns {Select}
   */
  resetLimit () {
    return this.setLimit(null)
  }

  /**
   * @returns {Any}
   */
  getLimit () {
    return this.limit
  }

  /**
   * @alias `setOffset`
   */
  skip (value) {
    return this.setOffset(value)
  }

  /**
   * @returns {Boolean}
   */
  hasOffset () {
    return this.offset != null
  }

  /**
   * @param {Any} value
   * @returns {Select}
   */
  setOffset (value) {
    this.offset = value
    return this
  }

  /**
   * @returns {Select}
   */
  resetOffset () {
    return this.setOffset(null)
  }

  /**
   * @returns {Any}
   */
  getOffset () {
    return this.offset
  }
}

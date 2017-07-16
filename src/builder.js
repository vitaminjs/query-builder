
import Compiler, { createCompiler } from './compiler'
import { last, assign, isString, isEmpty } from 'lodash'
import { Join, Alias, Union, Literal, Criteria, CommonTable } from './expression'

export default class Builder {
  /**
   * @param {Object} query
   * @constructor
   */
  constructor (query) {
    this.type = 'select'
    this.query = assign({}, query)
  }

  /**
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Result}
   * @throws {TypeError}
   */
  build (dialect, options = {}) {
    if (isString(dialect)) dialect = createCompiler(dialect, options)

    if (dialect instanceof Compiler) return dialect.build(this)

    throw new TypeError('Invalid query compiler')
  }

  /**
   * @param {Compiler}
   * @returns {String}
   * @throws {TypeError}
   */
  compile (compiler) {
    switch (this.type) {
      case 'select': return compiler.compileSelectQuery(this.query)
      case 'insert': return compiler.compileInsertQuery(this.query)
      case 'update': return compiler.compileUpdateQuery(this.query)
      case 'delete': return compiler.compileDeleteQuery(this.query)
    }

    throw new TypeError('Unknown query type')
  }

  /**
   * @returns {Builder}
   */
  clone () {
    return new Builder(this.query)
  }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    return new Alias(new Literal('(?)', [this]), name, columns)
  }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {CommonTable}
   */
  asCTE (name, ...columns) {
    return new CommonTable(this, name, ...columns)
  }

  /**
   * @param {Any} cte
   * @returns {Builder}
   */
  with (...cte) {
    cte.forEach((value) => {
      this.getCommonTables().push(Literal.from(value))
    })

    return this
  }

  /**
   * @returns {Array}
   */
  getCommonTables () {
    if (!this.hasCommonTables()) this.resetCommonTables()

    return this.query.cte
  }

  /**
   * @returns {Boolean}
   */
  hasCommonTables () {
    return !isEmpty(this.query.cte)
  }

  /**
   * @returns {Builder}
   */
  resetCommonTables () {
    return this.setCommonTables([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setCommonTables (value) {
    this.query.cte = value
    return this
  }

  /**
   * @param {Array} columns
   * @returns {Builder}
   */
  select (...columns) {
    columns.forEach((value) => {
      if (value !== '*') {
        this.getResults().push(Literal.from(value))
      }
    })

    return this
  }

  /**
   * @returns {Array}
   */
  getResults () {
    if (!this.hasResults()) this.resetResults()

    return this.query.select
  }

  /**
   * @returns {Boolean}
   */
  hasResults () {
    return !isEmpty(this.query.select)
  }

  /**
   * @returns {Builder}
   */
  resetResults () {
    return this.setResults([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setResults (value) {
    this.query.select = value
    return this
  }

  /**
   * @param {Boolean} flag
   * @returns {Builder}
   */
  distinct (flag = true) {
    this.query.distinct = flag
    return this
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  from (table) {
    return this.setTable(table)
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  into (table) {
    return this.setTable(table)
  }

  /**
   * @returns {Expression}
   */
  getTable () {
    return this.query.table
  }

  /**
   * @returns {Boolean}
   */
  hasTable () {
    return this.query.table != null
  }

  /**
   * @returns {Builder}
   */
  resetTable () {
    return this.setTable(null)
  }

  /**
   * @param {Any} value
   * @returns {Builder}
   */
  setTable (value) {
    this.query.table = Literal.from(value)
    return this
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
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Builder}
   * @throws {TypeError}
   */
  on (key, value) {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.where(key, value)
      return this
    }

    throw new TypeError('Trying to add conditions to an undefined join expression')
  }

  /**
   * @param {Any} key criterion operand
   * @param {Any} value criterion value
   * @returns {Builder}
   * @throws {TypeError}
   */
  orOn (key, value) {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.orWhere(key, value)
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
    return !isEmpty(this.query.join)
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setJoins (value) {
    this.query.join = value
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
    if (!this.hasJoins()) this.resetJoins()

    return this.query.join
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  where (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments))
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  orWhere (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  whereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).not())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  orWhereNot (expr, ...args) {
    this.getConditions().push(Criteria.from(...arguments).or().not())
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasConditions () {
    return !isEmpty(this.query.where)
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setConditions (value) {
    this.query.where = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetConditions () {
    return this.setConditions([])
  }

  /**
   * @returns {Array}
   */
  getConditions () {
    if (!this.hasConditions()) this.resetConditions()

    return this.query.where
  }

  /**
   * @param {Any} columns
   * @returns {Builder}
   */
  groupBy (...columns) {
    columns.forEach((value) => this.getGroups().push(Literal.from(value)))
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasGroups () {
    return !isEmpty(this.query.group)
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setGroups (value) {
    this.query.group = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetGroups () {
    return this.setGroups([])
  }

  /**
   * @returns {Array}
   */
  getGroups () {
    if (!this.hasGroups()) this.resetGroups()

    return this.query.group
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  having (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments))
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  orHaving (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).or())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  havingNot (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).not())
    return this
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Builder}
   */
  orHavingNot (expr, ...args) {
    this.getHavingConditions().push(Criteria.from(...arguments).or().not())
    return this
  }

  /**
   * @returns {Boolean}
   */
  hasHavingConditions () {
    return !isEmpty(this.query.having)
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setHavingConditions (value) {
    this.query.having = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetHavingConditions () {
    return this.setHavingConditions([])
  }

  /**
   * @returns {Array}
   */
  getHavingConditions () {
    if (!this.hasHavingConditions()) this.resetHavingConditions()

    return this.query.having
  }

  /**
   * @param {Any} query
   * @param {String} filter
   * @returns {Builder}
   */
  union (query, filter = 'distinct') {
    this.getUnions().push(Union.from(...arguments))
    return this
  }

  /**
   * @param {Any} query
   * @returns {Builder}
   */
  unionAll (query) {
    return this.union(query, 'all')
  }

  /**
   * @returns {Array}
   */
  getUnions () {
    if (!this.hasUnions()) this.resetUnions()

    return this.query.union
  }

  /**
   * @returns {Boolean}
   */
  hasUnions () {
    return !isEmpty(this.query.union)
  }

  /**
   * @returns {Builder}
   */
  resetUnions () {
    return this.setUnions([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setUnions (value) {
    this.query.union = value
    return this
  }

  /**
   * @param {Any} columns
   * @returns {Builder}
   */
  orderBy (...columns) {
    columns.forEach((value) => this.getOrders().push(Literal.from(value)))
    return this
  }

  /**
   * @returns {Array}
   */
  getOrders () {
    if (!this.hasOrders()) this.resetOrders()

    return this.query.order
  }

  /**
   * @returns {Boolean}
   */
  hasOrders () {
    return !isEmpty(this.query.order)
  }

  /**
   * @returns {Builder}
   */
  resetOrders () {
    return this.setOrders([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setOrders (value) {
    this.query.order = value
    return this
  }

  /**
   * @param {Integer} value
   * @returns {Builder}
   */
  limit (value) {
    return this.setLimit(value)
  }

  /**
   * @returns {Boolean}
   */
  hasLimit () {
    return this.query.limit != null
  }

  /**
   * @param {Any} value
   * @returns {Builder}
   */
  setLimit (value) {
    this.query.limit = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetLimit () {
    return this.setLimit(null)
  }

  /**
   * @returns {Any}
   */
  getLimit () {
    return this.query.limit
  }

  /**
   * @param {Integer} value
   * @returns {Builder}
   */
  offset (value) {
    return this.setOffset(value)
  }

  /**
   * @returns {Boolean}
   */
  hasOffset () {
    return this.query.offset != null
  }

  /**
   * @param {Any} value
   * @returns {Builder}
   */
  setOffset (value) {
    this.query.offset = value
    return this
  }

  /**
   * @returns {Builder}
   */
  resetOffset () {
    return this.setOffset(null)
  }

  /**
   * @returns {Any}
   */
  getOffset () {
    return this.query.offset
  }

  /**
   * @param {String[]} columns
   * @returns {Expression}
   */
  returning (...columns) {
    columns.forEach((value) => this.getOutput().push(value))
    return this
  }

  /**
   * @returns {Array}
   */
  getOutput () {
    if (!this.hasOutput()) this.resetOutput()

    return this.query.output
  }

  /**
   * @returns {Boolean}
   */
  hasOutput () {
    return !isEmpty(this.query.output)
  }

  /**
   * @returns {Builder}
   */
  resetOutput () {
    return this.setOutput([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setOutput (value) {
    this.query.output = value
    return this
  }
}

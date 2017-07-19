
import Compiler, { createCompiler } from './compiler'
import { last, assign, chain, keys, castArray, isString, isEmpty } from 'lodash'
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
   * @param {String} value
   * @returns {Builder}
   */
  setType (value) {
    this.type = value
    return this
  }

  /**
   * @returns {String}
   */
  getType () {
    return this.type
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
      case 'select': {
        if (this.hasTable() || this.hasResults() || this.hasCommonTables()) {
          return compiler.compileSelectQuery(this.query)
        }

        return ''
      }

      case 'insert': {
        if (this.hasTable() && this.hasValues()) {
          return compiler.compileInsertQuery(this.query)
        }

        return ''
      }

      case 'update': {
        if (this.hasTable() && this.hasValues()) {
          return compiler.compileUpdateQuery(this.query)
        }

        return ''
      }

      case 'delete': {
        if (!this.hasTable()) return ''

        return compiler.compileDeleteQuery(this.query)
      }
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
   * @returns {Literal}
   */
  toExpression () {
    return new Literal('(?)', [this])
  }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  as (name, ...columns) {
    return new Alias(this.toExpression(), name, columns)
  }

  /**
   * @param {Any} expr
   * @param {String} name
   * @param {Array} columns
   * @returns {Builder}
   */
  with (expr, name, ...columns) {
    this.getCommonTables().push(CommonTable.from(expr, name, columns))
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
      if (value === '*') return

      if (value instanceof Builder) {
        value = value.toExpression()
      }

      this.getResults().push(Literal.from(value))
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
    if (value instanceof Builder) {
      value = value.toExpression()
    }

    this.query.table = Literal.from(value)
    return this
  }

  /**
   * @param {Any} table
   * @param {String} type
   * @returns {Builder}
   */
  join (table, type = 'inner') {
    if (table instanceof Builder) {
      table = new Join(table.toExpression(), type)
    }

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
    this.getUnions().push(Union.from(query, filter))
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

  /**
   * @returns {Array|Builder}
   */
  getValues () {
    if (!this.hasValues()) this.resetValues()

    return this.query.values
  }

  /**
   * @returns {Boolean}
   */
  hasValues () {
    return !isEmpty(this.query.values)
  }

  /**
   * @returns {Builder}
   */
  resetValues () {
    return this.setValues([])
  }

  /**
   * @param {Array|Builder} value
   * @returns {Builder}
   */
  setValues (value) {
    this.query.values = value
    return this
  }

  /**
   * @returns {Array}
   */
  getColumns () {
    if (!this.hasColumns()) this.resetColumns()

    return this.query.columns
  }

  /**
   * @returns {Boolean}
   */
  hasColumns () {
    return !isEmpty(this.query.columns)
  }

  /**
   * @returns {Builder}
   */
  resetColumns () {
    return this.setColumns([])
  }

  /**
   * @param {Array} value
   * @returns {Builder}
   */
  setColumns (value) {
    this.query.columns = value
    return this
  }

  /**
   * @param {Any} data
   * @returns {Builder}
   */
  insert (data) {
    return this.setType('insert').setValues(data)
  }

  /**
   * @param {Any} table
   * @param {Array} columns
   * @returns {Builder}
   */
  into (table, ...columns) {
    if (!isEmpty(columns)) this.setColumns(columns)

    return this.setTable(table)
  }

  /**
   * @param {Any} table
   * @param {Array} columns
   * @returns {Builder}
   */
  insertInto (table, ...columns) {
    return this.setType('insert').into(table, ...columns)
  }

  /**
   * @param {Any} data
   * @returns {Builder}
   */
  values (data) {
    if (data instanceof Builder) return this.setValues(data)

    data = castArray(data)

    if (!this.hasColumns()) {
      this.setColumns(chain(data).map(keys).flatten().uniq().value())
    }

    return this.setValues(data)
  }

  /**
   * @returns {Builder}
   */
  defaultValues () {
    return this.resetValues()
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  update (table) {
    if (table) this.setTable(table)

    return this.setType('update')
  }

  /**
   * @param {String|Object} key
   * @param {Any} value
   * @returns {Builder}
   */
  set (key, value) {
    let data = isString(key) ? { [key]: value } : key

    this.getValues().push(data)

    return this.setType('update')
  }

  /**
   * @param {Any} table
   * @returns {Builder}
   */
  delete (table) {
    if (table) this.setTable(table)

    return this.setType('delete')
  }
}

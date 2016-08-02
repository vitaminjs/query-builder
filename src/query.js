
import _ from 'underscore'

/**
 * Base Query Class
 */
class Query {
  
  /**
   * Query constructor
   * 
   * @param {Object} qb knex query builder
   * @constructor
   */
  constructor(qb) {
    this.builder = qb
    this.columns = []
    this.table = null
    this.alias = null
  }
  
  /**
   * Get the base query builder
   * 
   * @return knex query builder
   */
  toBase() {
    return this.builder
  }
  
  /**
   * Get the selected columns prefixed by the table name
   * 
   * @return array
   */
  getQualifiedColumns() {
  	if ( _.isEmpty(this.columns) ) this.columns = ['*']
  	
    return this.columns.map(name => {
      var ok = (_.isString(name) && name.indexOf('.') === -1)
      
      return ok ? this.getQualifiedColumn(name) : name
    })
  }
  
  /**
   * Get the column name prefixed by the table name
   * 
   * @param {String} name
   * @return string
   */
  getQualifiedColumn(name) {
    return (this.alias || this.table) + '.' + name
  }
  
  /**
   * Set the table name for this query
   * 
   * @param {String} table
   * @param {String} alias
   * @return this query
   */
  from(table, alias) {
    this.table = String(table)
    
    if ( alias ) {
      table += ' as ' + alias
      this.alias = alias
    }
    
    this.builder.from(table)
    return this
  }
  
  /**
   * Set the columns of the query
   * 
   * @param {Array} columns
   * @return this query
   */
  select(columns) {
  	columns = _.flatten(arguments)
  	
  	if ( columns.length > 0 ) this.columns.push(...columns)
  	
    return this
  }
  
  /**
   * Fetch many records from th database
   * 
   * @param {Array} columns
   * @return promise
   */
  fetch(columns) {
    this.select(...arguments)
    return this.builder.select(this.getQualifiedColumns())
  }
  
  /**
   * Fetch the first record from the database
   * 
   * @param {Array} columns
   * @return promise
   */
  first(columns) {
    this.select(...arguments)
    return this.builder.first(this.getQualifiedColumns())
  }
  
  /**
   * Delete a record from the database
   * 
   * @return promise
   */
  destroy() {
    return this.builder.del()
  }
  
  /**
   * Get the `count` result of the query
   * 
   * @param {String} column
   * @return promise
   */
  count(column = '*') {
    return this.aggregate('count', column)
  }
  
  /**
   * Get the `sum` of the values of a given column
   * 
   * @param {String} column
   * @return promise
   */
  sum(column) {
    return this.aggregate('sum', column)
  }
  
  /**
   * Get the minimum value of a given column
   * 
   * @param {String} column
   * @return promise
   */
  min(column) {
    return this.aggregate('min', column)
  }
  
  /**
   * Get the maximum value of a given column
   * 
   * @param {String} column
   * @return promise
   */
  max(column) {
    return this.aggregate('max', column)
  }
  
  /**
   * Get the average of the values of a given column
   * 
   * @param {String} column
   * @return promise
   */
  avg(column) {
    return this.aggregate('avg', column)
  }
  
  /**
   * Execute an aggregate function on the database
   * 
   * @param {String} method
   * @param {String} column
   * @return promise
   */
  aggregate(method, column) {
    column += ' as aggregate'
    return this.builder[method](column).then(res => _.first(res)['aggregate'])
  }
  
  /**
   * Get a single column's value from the first result of a query
   * 
   * @param {String} column
   * @return promise
   */
  value(column) {
    return this.builder.first(column).then(res => res[column])
  }
  
  /**
   * Simple pagination of the given query
   * 
   * @param {Integer} page
   * @param {Integer} pageSize
   * @param {Array} columns
   * @return promise
   */
  paginate(page = 1, pageSize = 15, columns = ['*']) {
    return this.offset((page - 1) * pageSize).limit(pageSize).fetch(columns)
  }
  
}

// query builder methods
[
  'where', 'orWhere', 'whereRaw', 'whereNot',
  'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
  'whereNull', 'orWhereNull', 'whereNotNull', 'orWhereNotNull',
  'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
  'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
  'offset', 'limit', 'groupBy', 'groupByRaw', 'having', 'orderBy', 'orderByRaw',
  'join', 'innerJoin', 'leftJoin', 'rightJoin', 'outerJoin', 'crossJoin', 'joinRaw',
  'insert', 'update', 'distinct', 'union', 'unionAll', 'pluck', 'increment', 'decrement',
]
.forEach(name => {
	
	Object.defineProperty(Query.prototype, name, {
		writable: true,
		configurable: true,
		value: function () {
	    this.builder[name](...arguments)
	    return this
		}
	})
  
})

// exports
export default Query


import Expression from './sub-query'

/**
 * @class CommonTableExpression
 */
export default class CommonTable extends Expression {
  
  /**
   * 
   * @param {Query} query
   * @constructor
   */
  constructor(query) {
    super(query)
    
    this.columns = []
  }

  /**
   * 
   * @param {String} table
   * @param {Array} columns
   */
  as(table, ...columns) {
    this.columns = columns

    return super.as(table)
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    let table = compiler.quote(this.alias)

    if (! isEmpty(this.columns) ) {
      let columns = this.columns.map(value => compiler.quote(value))

      table += `(${columns.join(', ')})`
    }

    return table + ' as ' + this.query.compile(compiler)
  }

}

import Query from './base'

/**
 * @class SelectQuery
 */
export default class extends Query {
  
  /**
   * 
   * @param {Builder} builder
   * @constructor
   */
  constructor(builder) {
    super(builder)
    
    var qb = this.builder
    
    this.components = {
      limit: qb.getLimit(),
      offset: qb.getOffset(),
      distinct: qb.isDistinct(),
      unionLimit: qb.getUnionLimit(),
      unionOffset: qb.getUnionOffset(),
      unions: qb.hasUnions() ? qb.getUnions() : [],
      joins: qb.hasJoins() ? qb.getJoins().toArray() : [],
      groups: qb.hasGroups() ? qb.getGroups().toArray() : [],
      tables: qb.hasTables() ? qb.getTables().toArray() : [],
      orders: qb.hasOrders() ? qb.getOrders().toArray() : [],
      columns: qb.hasColumns() ? qb.getColumns().toArray() : [],
      conditions: qb.hasConditions() ? qb.getConditions() : null,
      unionOrders: qb.hasUnionOrders() ? qb.getUnionOrders().toArray() : [],
      havingConditions: qb.hasHavingConditions() ? qb.getHavingConditions() : null,
    }
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if (! (this.builder.hasColumns() || this.builder.hasTables()) ) return ''
    
    return compiler.compileSelectQuery(this.components)
  }

}
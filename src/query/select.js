
import { isEmpty } from 'lodash'
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
      joins: qb.hasJoins() ? qb.getJoins().toArray() : [],
      limit: this.builder.getLimit(),
      tables: qb.hasTables() ? qb.getTables().toArray() : [],
      unions: qb.hasUnions() ? qb.getUnions() : [],
      orders: this.builder.getOrders(),
      offset: this.builder.getOffset(),
      groups: this.builder.getGroups(),
      columns: qb.hasColumns() ? qb.getColumns().toArray() : [],
      distinct: this.builder.isDistinct(),
      conditions: this.builder.getConditions(),
      unionLimit: this.builder.getUnionLimit(),
      unionOffset: this.builder.getUnionOffset(),
      unionOrders: this.builder.getUnionOrders(),
      havingConditions: this.builder.getHavingConditions(),
    }
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if (! (this.builder.hasColumns() || this.builder.hasTables()) ) return ''
    
    var sql = compiler.compileSelectComponents(this.components)
    
    if (! this.builder.hasUnions() ) return sql
    
    return `(${sql}) ` + compiler.compileUnionComponents(this.components)
  }

}
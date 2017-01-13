
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
    
    this.components = {
      joins: this.builder.getJoins(),
      limit: this.builder.getLimit(),
      tables: this.builder.getTables(),
      unions: this.builder.getUnions(),
      orders: this.builder.getOrders(),
      offset: this.builder.getOffset(),
      groups: this.builder.getGroups(),
      columns: this.builder.getColumns(),
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
    if ( isEmpty(this.components.columns) && isEmpty(this.components.tables) ) return ''
    
    var sql = 'select ' + compiler.compileSelectComponents(this.components)
    
    if ( isEmpty(this.components.unions) ) return sql
    
    return `(${sql}) ` + compiler.compileUnionComponents(this.components)
  }

}

import { UseTable, UseReturning, UseConditions } from './mixins'
import { clone } from 'lodash'
import Query from './base'

/**
 * @class DeleteQuery
 */
export default class Delete extends UseTable(UseReturning(UseConditions(Query))) {
  
  /**
   * 
   * @param {String|Expression} value
   * @returns {Delete}
   */
  from(value) {
    return this.setTable(value)
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return this.hasTable() ? compiler.compileDeleteQuery(this) : ''
  }

  /**
   * 
   * @return {Delete}
   */
  clone() {
    var query = new Delete()

    this.hasTable() && query.getTable()
    query.setOptions(clone(this.getOptions()))
    this.hasReturning() && query.setReturning(this.getReturning().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())

    return query
  }
  
}
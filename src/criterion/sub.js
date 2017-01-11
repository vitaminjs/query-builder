
import { Column, SubQuery as SQ } from '../expression'
import { isString } from 'lodash'
import Criterion from './base'

/**
 * @class SubQueryCriterion
 */
export default class SubQuery extends Criterion {
  
  /**
   * 
   * @param {String|Column} column
   * @param {String} operator
   * @param {SubQuery} query
   * @param {String} bool
   * @constructor
   */
  constructor(column, operator, query, bool = 'and') {
    super(bool)
    
    if ( isString(column) ) column = new Column(column)
    
    if (! (column instanceof Column && query instanceof SQ) )
      throw new TypeError("Invalid sub query condition")
    
    this.column = column
    this.query = query
    this.op = operator
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var bool = super.compile(compiler)
    var operator = compiler.operator(this.op)
    var column = this.column.compile(compiler)
    var query = compiler.parametrize(this.query)
    
    return bool + column + operator + ` (${query})`
  }
  
}
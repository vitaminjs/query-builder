
import { isArray, isEmpty } from 'lodash'
import Expression from '../expression'
import Criterion from './base'

/**
 * @class BasicCriterion
 */
export default class Basic extends Criterion {

  /**
   * @type {Object}
   */
  get operators() {
    return {
      '=': '!=',
      '<>': '=',
      '!=': '=',
      '<': '>=',
      '>=': '<',
      '<=': '>',
      '>': '<=',
      'in': 'not in',
      'not in': 'in',
      'is': 'is not',
      'is not': 'is',
      'like': 'not like',
      'not like': 'like',
    }
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {String} operator
   * @param {Any} value
   * @constructor
   */
  constructor(expr, operator, value) {
    super()
    
    this.value = value
    this.op = operator

    if ( expr ) this.setOperand(expr)

    // change the operator for array values
    if ( isArray(value) && this.op === '=' ) this.op = 'in'

    // change the operator for null values
    if ( value === null && this.op === '=' ) this.op = 'is'
  }

  /**
   * 
   * @param {Expression} value
   * @returns {Operator}
   * @throws {TypeError}
   */
  setOperand(value) {
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid condition operand")
    
    this.operand = value
    return this
  }

  /**
   * 
   * @returns {Basic}
   */
  negate() {
    this.op = this.operators[this.op]
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if ( isArray(this.value) && isEmpty(this.value) )
      return '1 = ' + (this.op === 'in' ? 0 : 1)
    
    var operator = compiler.operator(this.op)
    var operand = this.operand.compile(compiler)

    if ( this.value === null )
      return `${this.bool} ${operand} ${this.op} null`
    
    return `${this.bool} ${operand} ${operator} ${compiler.parameterize(this.value)}`
  }
  
}
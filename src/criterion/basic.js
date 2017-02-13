
import Expression from '../expression'
import Criterion from './base'

/**
 * @class BasicCriterion
 */
export default class Basic extends Criterion {
  
  /**
   * 
   * @param {Expression} expr
   * @param {String} operator
   * @param {Any} value
   * @constructor
   */
  constructor(expr, operator, value) {
    super()
    
    if (! (expr instanceof Expression) )
      throw new TypeError("Invalid condition operand")
    
    this.operand = expr
    this.value = value
    this.op = operator
  }

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
      'like': 'not like',
      'not like': 'like',
    }
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
    var operator = compiler.operator(this.op)
    var operand = this.operand.compile(compiler)
    var value = compiler.parameterize(this.value)

    return `${this.bool} ${operand} ${operator} ${value}`
  }
  
}

import Alias from './alias'
import Literal from './literal'
import Expression from './base'

/**
 * @class ValuesExpression
 */
export default class Values extends Expression {
  /**
   * @param {Array} data
   * @constructor
   */
  constructor (data) {
    super()

    this.values = data
  }

  /**
   * @param {String} name
   * @param {Array} columns
   */
  as (name, ...columns) {
    return new Alias(new Literal('(?)', [this]), name, columns)
  }

  /**
   * @param {String} name
   * @param {Array} columns
   * @returns {Alias}
   */
  asCTE (name, ...columns) {
    return this.as(name, ...columns).forCTE()
  }

  /**
   * @param {Compiler}
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileValues(this)
  }

  /**
   * @returns {Expression}
   * @override
   */
  clone () {
    return new Values(this.data)
  }
}

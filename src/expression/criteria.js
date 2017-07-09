
import Expression from './base'
import Literal from './literal'
import { isPlainObject } from 'lodash'

export default class Criteria extends Expression {
  /**
   * @param {Literal} expr
   * @param {String} prefix
   * @param {Boolean} negate
   * @constructor
   */
  constructor (expr, prefix = 'and', negate = false) {
    super()

    this.expr = expr
    this.negate = negate
    this.prefix = prefix
  }

  /**
   * @param {String} expr
   * @param {Array} args
   * @returns {Criteria}
   */
  static from (expr, ...args) {
    if (expr instanceof Criteria) return expr

    if (isPlainObject(expr)) {
      let obj = expr

      expr = Object.keys(obj).map((field) => {
        args.push(obj[field])

        return `${field} = ?`
      }).join(' and ')
    }

    return new Criteria(Literal.from(expr, ...args))
  }

  /**
   * @returns {Criterion}
   */
  not (flag = true) {
    this.negate = flag
    return this
  }

  /**
   * @param {String} value
   * @returns {Criterion}
   */
  and (value) {
    this.prefix = 'and'
    return this
  }

  /**
   * @param {String} value
   * @returns {Criterion}
   */
  or (value) {
    this.prefix = 'or'
    return this
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile (compiler) {
    return compiler.compileCriteria(this)
  }

  /**
   * @returns {Criteria}
   */
  clone () {
    return new Criteria(this.expr.clone(), this.prefix, this.negate)
  }
}


import Expression from './base'
import Literal from './literal'
import { isPlainObject, isArray, isNull } from 'lodash'

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

    if (isPlainObject(expr)) return this.fromObject(expr)

    return new Criteria(Literal.from(expr, ...args))
  }

  /**
   * @param {Object} obj
   * @returns {Criteria}
   */
  static fromObject (obj) {
    let args = []
    let expr = Object.keys(obj).map((key) => {
      let value = obj[key]

      if (isNull(value)) return `${key} is null`

      args.push(value)

      return isArray(value) ? `${key} in (?)` : `${key} = ?`
    })

    return new Criteria(Literal.from(expr.join(' and '), ...args))
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
   * @override
   */
  clone () {
    return new Criteria(this.expr.clone(), this.prefix, this.negate)
  }
}

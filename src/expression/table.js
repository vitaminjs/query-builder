
import Alias from './alias'
import Expression from './base'
import mixin from './mixin/use-joins'

/**
 * @class TableExpression
 */
export default class Table extends mixin()(Expression) {
  /**
   * @param {Expression} name
   * @constructor
   */
  constructor (name) {
    super()

    this.name = name
  }

  /**
   * @param {String} name
   * @returns {Alias}
   */
  as (name) {
    return new Alias(this, name)
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileTable(this)
  }

  /**
   * @returns {Table}
   * @override
   */
  clone () {
    return new Table(this.name).setJoins(this.getJoins())
  }
}

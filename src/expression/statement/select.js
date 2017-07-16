
import Statement from './base'
import Literal from '../literal'

import {
  useCTE,
  compose,
  useMany,
  useJoins,
  useLimit,
  useOffset,
  useOrders,
  useUnions,
  useGroups,
  useConditions
} from '../mixin'

const mixin = compose(
  useCTE(),
  useJoins(),
  useLimit(),
  useOffset(),
  useOrders(),
  useUnions(),
  useGroups(),
  useConditions(),
  useMany('tables'),
  useMany('columns'),
  useConditions('havingConditions', 'having')
)

/**
 * @class SelectStatement
 */
export default class Select extends mixin(Statement) {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.isDistinct = false
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    if (!(this.hasColumns() || this.hasTables())) return ''

    return compiler.compileSelectQuery(this)
  }

  /**
   * @param {Any} columns
   * @returns {Select}
   */
  select (...columns) {
    columns.forEach((value) => this.getColumns().push(Literal.from(value)))
    return this
  }

  /**
   * @param {Boolean} flag
   * @returns {Select}
   */
  distinct (flag = true) {
    this.isDistinct = flag
    return this
  }

  /**
   * @param {Any} tables
   * @returns {Select}
   */
  from (...tables) {
    tables.forEach((value) => this.getTables().push(Literal.from(value)))
    return this
  }
}

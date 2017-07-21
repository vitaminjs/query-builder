
import Statement from './base'
import { compose, useReturning, useConditions, useCTE, useOne } from '../mixin'

const mixin = compose(
  useCTE(),
  useReturning(),
  useOne('table'),
  useConditions()
)

/**
 * @class DeleteStatement
 */
export default class Delete extends mixin(Statement) {
  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileDeleteQuery(this)
  }
}

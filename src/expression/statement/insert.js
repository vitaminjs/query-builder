
import Select from './select'
import Statement from '../statement'
import { isArray, chain, keys } from 'lodash'
import { compose, useCTE, useOne, useMany, useReturning } from '../mixin'

const mixin = compose(
  useCTE(),
  useReturning(),
  useOne('table'),
  useOne('select'),
  useMany('values'),
  useMany('columns')
)

/**
 * @class SelectStatement
 */
export default class Insert extends mixin(Statement) {
  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileInsertQuery(this)
  }

  /**
   * @param {Object|Array} data
   * @returns {Insert}
   */
  values (data) {
    return this.setValues(data)
  }

  /**
   * @param {Object|Array} data
   * @returns {Insert}
   * @override
   */
  setValues (data) {
    if (!isArray(data)) data = [data]

    if (!this.hasColumns()) {
      this.setColumns(chain(data).map(keys).flatten().uniq().value())
    }

    return super.setValues(data)
  }

  /**
   * @returns {Insert}
   */
  defaultValues () {
    return this.resetValues()
  }

  /**
   * @param {Select} query
   * @returns {Insert}
   */
  select (query) {
    return this.setSelect(query)
  }

  /**
   * @param {String} table
   * @param {Array<String>} columns
   * @return {Insert}
   */
  from (table, ...columns) {
    return this.select(new Select().from(table).setColumns(columns))
  }
}

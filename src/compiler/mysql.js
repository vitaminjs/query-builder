
import Compiler from './base'
import { isEmpty } from 'lodash'
import Expression from '../expression'

/**
 * @class MysqlCompiler
 */
export default class extends Compiler {
  /**
   * @param {String} value
   * @returns {String}
   * @override
   */
  quote (value) {
    return (value === '*') ? value : '`' + value.trim().replace(/`/g, '``') + '`'
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileFromClause ({ tables, joins }) {
    if (isEmpty(tables)) return 'from dual'

    return super.compileFromClause({ tables, joins })
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileLimitClause ({ limit, offset }) {
    if (offset && !limit) {
      return 'limit 18446744073709551615 offset ' + this.parameter(offset)
    }

    return super.compileLimitClause({ offset, limit })
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertTable (query) {
    // compile default columns
    if (query.option('default values') === true) { return `${this.escape(query.getTable())} ()` }

    return super.compileInsertTable(query)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertValues (query) {
    // compile default values
    if (query.option('default values') === true) { return 'values ()' }

    return super.compileInsertValues(query)
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [], isDistinct = false }) {
    switch (name) {
      case 'concat':
        return this.compileConcatFunction(args)

      case 'utc':
        return super.compileFunction('utc_timestamp', args)

      case 'strpos':
        return super.compileFunction('instr', args)

      default:
        return super.compileFunction({ name, args, isDistinct })
    }
  }

  /**
   * @param {Array} args
   * @returns {String}
   * @private
   */
  compileConcatFunction (args) {
    args = args.map(value => {
      if (value instanceof Expression) { return `coalesce(${value.compile(this)}, '')` }

      return this.escape(value)
    })

    return `concat(${args.join(', ')})`
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileWithClause (query) {
    return ''
  }
}

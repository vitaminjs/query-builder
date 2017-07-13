
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
  compileInsertClause ({ table, columns, values }) {
    // compile default columns
    if (isEmpty(values)) return `insert into ${this.escape(table)} ()`

    return super.compileInsertClause({ table, columns })
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertValues ({ select, values, columns }) {
    // compile default values
    if (isEmpty(values)) return 'values ()'

    return super.compileInsertValues({ select, values, columns })
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileFunction ({ name, args = [] }) {
    switch (name) {
      case 'concat':
        return this.compileConcatFunction(args)

      case 'utc':
        return super.compileFunction({ name: 'utc_timestamp', args })

      case 'strpos':
        return super.compileFunction({ name: 'instr', args })

      default:
        return super.compileFunction(arguments[0])
    }
  }

  /**
   * @param {Array} args
   * @returns {String}
   * @private
   */
  compileConcatFunction (args) {
    args = args.map((value) => {
      if (value instanceof Expression) {
        return `coalesce(${this.escape(value)}, '')`
      }

      return this.parameter(value)
    })

    return `concat(${args.join(', ')})`
  }

  /**
   * @param {Object} query
   * @returns {String}
   * @override
   * @private
   */
  compileWithClause (query) {
    // TODO print a notice
    return ''
  }
}

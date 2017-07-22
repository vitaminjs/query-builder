
import { isEmpty } from 'lodash'
import Compiler from '../compiler'
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
  compileFromClause ({ table }) {
    if (!table) return 'from dual'

    return super.compileFromClause(arguments[0])
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

    return super.compileLimitClause(arguments[0])
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertClause ({ table, values }) {
    // compile default columns
    if (isEmpty(values)) return `insert into ${this.escape(table)} ()`

    return super.compileInsertClause(arguments[0])
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   * @private
   */
  compileInsertValues ({ values }) {
    // compile default values
    if (isEmpty(values)) return 'values ()'

    return super.compileInsertValues(arguments[0])
  }

  /**
   * @param {Object}
   * @returns {String}
   * @override
   */
  compileUnion ({ query, filter }) {
    // if (!query.limit && !query.offset && isEmpty(query.order)) {
    if (!query.hasLimit() && !query.hasOffset() && !query.hasOrders()) {
      return super.compileUnion(arguments[0])
    }

    // wrap the query with parentheses
    return `union ${filter === 'all' ? 'all ' : ''}(${this.escape(query)})`
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


import {
  Table,
  Alias,
  Column,
  Literal,
  Identifier,
  Function as Func
} from '../expression'

/**
 * @param {String} expr
 * @param {Array} args
 * @returns {Literal}
 */
export function raw (expr, ...args) {
  return new Literal(expr, args)
}

/**
 * @param {Any} value
 * @returns {Expression}
 */
export function id (value) {
  return Identifier.from(value)
}

/**
 * @param {Any} expr
 * @param {String} name
 * @param {Array} columns
 * @returns {Alias}
 */
export function alias (expr, name, ...columns) {
  return new Alias(expr, name, columns)
}

/**
 * @param {String} name
 * @param {Array} args
 * @returns {Function}
 */
export function func (name, ...args) {
  return new Func(name, args)
}

/**
 * @param {String} value
 * @returns {Column}
 */
export function column (value) {
  return new Column(value)
}

/**
 * @param {String} value
 * @returns {Table}
 */
export function table (value) {
  return new Table(value)
}

/**
 * @param {Any} value
 * @param {String} type
 * @returns {Literal}
 */
export function cast (value, type) {
  return raw(`cast(? as ${type})`, value)
}

/**
 * @param {String} value
 * @returns {Literal}
 */
export function esc (value) {
  return raw(`'${value.replace("'", "''")}'`)
}

/**
 * @param {String} value
 * @returns {Literal}
 */
export function val (value) {
  return raw('?', value)
}

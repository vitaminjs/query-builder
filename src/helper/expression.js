
import {
  Table,
  Alias,
  Order,
  Column,
  Literal,
  Identifier,
  Function as $Function
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
  return new Alias(raw(expr), name, columns)
}

/**
 * @param {String} name
 * @param {Array} args
 * @returns {Function}
 */
export function func (name, ...args) {
  return new $Function(name, args)
}

/**
 * @param {String} value
 * @returns {Order}
 */
export function asc (value) {
  return new Order(id(value)).asc()
}

/**
 * @param {String} value
 * @returns {Order}
 */
export function desc (value) {
  return new Order(id(value)).desc()
}

/**
 * @param {String} value
 * @returns {Table}
 */
export function table (value) {
  return new Table(id(value))
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
  return raw(`'${String(value).replace(/'/g, "''")}'`)
}

/**
 * @param {String} value
 * @returns {Literal}
 */
export function val (value) {
  return raw('?', value)
}

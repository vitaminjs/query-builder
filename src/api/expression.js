
import { Identifier, Literal, Alias, Function } from '../expression'

/**
 * @param {String} expr
 * @param {Array<Any>} values
 * @returns {Literal}
 */
export function raw (expr, ...values) {
  return new Literal(expr, values)
}

/**
 * @param {String} expr
 * @returns {Identifier}
 */
export function id (expr) {
  return new Identifier(expr)
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
 * @param {String} name
 * @param {Array<Any>} args
 * @returns {Expression}
 */
export function func (name, ...args) {
  return new Function(name, args)
  // return raw(`${name}(${args.map(() => '?').join(', ')})`, args)
}

/**
 * @param {Any} value
 * @param {String} name
 * @param {Array<Any>} columns
 * @returns {Alias}
 */
export function alias (value, name, ...columns) {
  return new Alias(value, name, columns)
}

/**
 * @param {Any} value
 * @returns {Literal}
 */
export function param (value) {
  return raw('?', value)
}

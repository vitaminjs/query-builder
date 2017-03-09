
import { Func } from '../expression'

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function ABS(expr) {
  return createFunction('abs', expr)
}

/**
 * 
 * @param {Any} x
 * @param {Integer} y
 * @returns {Func}
 */
export function ROUND(x, y) {
  return createFunction('round', x, y)
}

/**
 * A random float number between 0 and 1
 * 
 * @returns {Func}
 */
export function RAND() {
  return createFunction('rand')
}

/**
 * 
 * @see `RAND`
 */
export function RANDOM() {
  return RAND(...arguments)
}

/**
 * 
 * @param {String} name
 * @param {Array} args
 * @returns {Func}
 * @private
 */
function createFunction(name, ...args) {
  return new Func(name, ...args)
}
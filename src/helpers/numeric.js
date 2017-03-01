
import { Func } from '../expression'

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function ABS(expr) {
  return new Func('abs', expr)
}

/**
 * 
 * @param {Any} x
 * @param {Integer} y
 * @returns {Func}
 */
export function ROUND(x, y) {
  return new Func('round', x, y)
}

/**
 * A random float number between 0 and 1
 * 
 * @returns {Func}
 */
export function RAND() {
  return new Func('rand')
}

/**
 * 
 * @see `RAND`
 */
export function RANDOM() {
  return RAND(...arguments)
}
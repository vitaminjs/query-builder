
import { Func } from '../expression'

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function NOW() {
  return Func('now')
}

/**
 * 
 * @see `NOW`
 */
export function DATETIME() {
  return NOW()
}

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function UTC() {
  return Func('utc')
}

/**
 * 
 * @see `UTC`
 */
export function UTC_DATETIME() {
  return UTC()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function DATE(expr) {
  return Func('date', expr)
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 * 
 * @returns {Func}
 */
export function TODAY() {
  return Func('current_date')
}

/**
 * 
 * @see `TODAY`
 */
export function CURRENT_DATE() {
  return TODAY()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function TIME(expr) {
  return Func('time', expr)
}

/**
 * 
 * @returns {Func}
 */
export function CLOCK() {
  return Func('current_time')
}

/**
 * 
 * @returns {Func}
 */
export function CURRENT_TIME() {
  return CLOCK()
}



import { isArray, isString, toArray } from 'lodash'
import Expression, { Column, Count, Aggregate } from '../expression'

/**
 * 
 * @param {Array} columns
 * @return {Count}
 */
export function COUNT(columns) {
  if (! isArray(columns) ) columns = toArray(arguments)

  if ( isEmpty(columns) ) return new Count()
  
  return new Count(columns.map(ensureExpression))
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function SUM(expr) {
  return new Aggregate('sum', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function AVG(expr) {
  return new Aggregate('avg', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function MIN(expr) {
  return new Aggregate('min', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function MAX(expr) {
  return new Aggregate('max', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Expression}
 * @throws {TypeError}
 */
function ensureExpression(expr) {
  if ( isString(expr) )
    expr = new Column(expr)
  
  if ( expr instanceof Expression )
    return expr
  
  throw new TypeError("Invalid aggregation expression")
}

import Expression, { Literal, Aggregate } from '../expression'
import { isString, isEmpty } from 'lodash'

/**
 * 
 * @param {String|Expression} expr
 * @return {Count}
 */
export function count(...expr) {
  if ( isEmpty(expr) ) expr = ['*']

  return createAggregate('count', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function sum(...expr) {
  return createAggregate('sum', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function avg(...expr) {
  return createAggregate('avg', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function min(...expr) {
  return createAggregate('min', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function max(...expr) {
  return createAggregate('max', expr)
}

/**
 * 
 * @param {String} name
 * @param {Array} columns
 * @return {Aggregate}
 * @throws {TypeError}
 */
function createAggregate(name, columns) {
  columns = columns.map(name => {
    if ( isString(name) )
      name = new Literal(name)
    
    if ( name instanceof Expression )
      return name
    
    throw new TypeError("Invalid aggregation expression")
  })

  return new Aggregate(name, columns)
}
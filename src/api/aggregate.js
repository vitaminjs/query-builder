
import Expression, { Literal, Aggregate } from '../expression'
import { isString, isEmpty } from 'lodash'

/**
 * 
 * @param {String|Expression} expr
 * @return {Count}
 */
export function COUNT(...expr) {
  if ( isEmpty(expr) ) expr = ['*']

  return createAggregate('count', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function SUM(...expr) {
  return createAggregate('sum', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function AVG(...expr) {
  return createAggregate('avg', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function MIN(...expr) {
  return createAggregate('min', expr)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Aggregate}
 */
export function MAX(...expr) {
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
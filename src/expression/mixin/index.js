
import { reduceRight } from 'lodash'

export { default as useCTE } from './use-cte'
export { default as useOne } from './use-one'
export { default as useMany } from './use-many'
export { default as useJoins } from './use-joins'
export { default as useLimit } from './use-limit'
export { default as useUnions } from './use-unions'
export { default as useOffset } from './use-offset'
export { default as useOrders } from './use-orders'
export { default as useReturning } from './use-returning'
export { default as useConditions } from './use-conditions'

/**
 *
 * @param {Array<Function>} mixins
 * @returns {Function}
 */
export function compose (...mixins) {
  return (Class) => reduceRight(mixins, (result, fn) => fn(result), Class)
}

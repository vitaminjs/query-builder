
import { Raw } from '../expression'

/**
 * A handler function for template strings
 * 
 * @param {Array} parts
 * @param {Array} args
 * @return {Raw}
 */
export default function makeRaw(parts = [], ...args) {
  // TODO check for undefined values
  return new Raw(parts.join('?'), args)
}
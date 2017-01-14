
import { Raw } from '../expression'
import { isString } from 'lodash'

/**
 * A handler function for template strings
 * 
 * @param {Array} parts
 * @param {Array} args
 * @return {Raw}
 */
export default function makeRaw(parts = [], ...args) {
  if ( isString(parts) ) parts = parts.splice('?')

  // TODO check for undefined values
  return new Raw(parts.join('?'), args)
}

import Builder from './builder'
import { isString } from 'lodash'
import Identifier from './expression/identifier'

/**
 * @param {String|Object} arg
 * @returns {Builder}
 */
export default function factory (arg) {
  if (isString(arg)) {
    arg = { 'table': Identifier.from(arg) }
  }

  return new Builder(arg)
}

// export functions
export * from './helper/function'

// export expressions
export * from './helper/expression'


import { Raw as Expression, SubQuery } from '../expression'
import { isString, isFunction } from 'lodash'
import Builder from '../query/builder'
import { Select } from '../query'

/**
 * A handler function for template strings
 * 
 * @param {Array} parts
 * @param {Array} args
 * @return {Raw}
 */
export function RAW(parts = [], ...args) {
  if ( isString(parts) ) parts = parts.split('?')

  // TODO check for undefined values
  
  return new Expression(parts.join('?'), args)
}

/**
 * 
 * @param {Any} query
 * @return {SubQuery} expression
 * @throws {TypeError}
 */
export function SQ(query) {
  // accept a function as a parameter
  if ( isFunction(query) ) {
    let fn = query
    
    fn(query = new Builder())
  }
  
  // accept a builder instance
  if ( query instanceof Builder )
    query = query.build()
  
  // accept a Select query instance
  if ( query instanceof Select )
    query = new SubQuery(query)
  
  // and finally an instance of SubQuery expression
  if ( query instanceof SubQuery ) return query
  
  // throws an error for invalid argument
  throw new TypeError("Invalid sub query expression")
}
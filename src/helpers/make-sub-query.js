
import { Select, Builder } from '../query'
import { SubQuery } from '../expression'

/**
 * 
 * @param {Any} query
 * @return {SubQuery} expression
 * @throws {TypeError}
 */
export default function makeSubQuery(query) {
  // var Builder = require('../query/builder')

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
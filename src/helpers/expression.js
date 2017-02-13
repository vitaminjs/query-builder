
import Expression, { Literal, SubQuery, Column, Table } from '../expression'
import { isFunction, isArray, isString, trim } from 'lodash'
import { Select } from '../query'

/**
 * A handler function for template strings
 * 
 * @param {String|Array} expr
 * @param {Array} args
 * @returns {Literal}
 */
export function RAW(expr, ...args) {
  // handle template strings
  if ( isArray(expr) ) {
    let parts = expr
    
    // use the first fragment as base
    expr = parts[0]
    
    // join it with the other fragments
    for ( let i = 1; i < parts.length; i++ ) {
      let isExpr = (args[i - 1] instanceof Expression)
      
      expr += (isExpr ? '??' : '?') + parts[i]
    }
  }

  // TODO check for undefined values
  
  return new Literal(expr, args)
}

/**
 * 
 * @param {Any} query
 * @returns {Expression}
 * @throws {TypeError}
 */
export function SQ(query) {
  // accept a raw query string
  if ( isString(query) )
    return RAW(query).wrap()
  
  // accept a function as a parameter
  if ( isFunction(query) ) {
    let fn = query
    
    fn(query = new Select())
  }
  
  // accept a Select query instance
  if ( query instanceof Select )
    query = new SubQuery(query)
  
  // and finally an instance of SubQuery expression
  if ( query instanceof SubQuery ) return query
  
  // throws an error for invalid argument
  throw new TypeError("Invalid sub query expression")
}

/**
 * 
 * @param {String} value
 * @returns {Column}
 */
export function C(value) {
  var alias = ''
  
  if ( value.indexOf(' as ') > 0 ) {
    [value, alias] = value.split(' as ').map(trim)
  }
  
  return new Column(value).as(alias)
}

/**
 * 
 * @param {String} value
 * @returns {Table}
 */
export function T(value) {
  var alias = ''

  if ( value.indexOf(' as ') > 0 ) {
    [value, alias] = value.split(' as ').map(trim)
  }
  
  return new Table(value).as(alias)
}
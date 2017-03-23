
import { isFunction, isArray, isString, isPlainObject, trim } from 'lodash'
import { Literal, SubQuery, Column, Table, Escaped } from '../expression'
import { Select } from '../query'

/**
 * A handler function for template strings
 * 
 * @param {String|Array} expr
 * @param {Array} args
 * @returns {Literal}
 */
export function raw(expr, ...args) {
  // handle template strings
  if ( isArray(expr) )
    expr = expr.join('?')
  
  // parse named parameters
  if ( isPlainObject(args[0]) ) {
    let obj = args[0]
    args = []

    expr = expr.replace(/[:@](\w+)/gi, (match, attr) => {
      // we return the match string in case the attribute is undefined
      if ( isUndefined(obj[attr]) ) return match
      
      // append the value of the attribute
      args.push(obj[attr])

      // return the basic placeholder
      return '?'
    })
  }

  return new Literal(expr, args)
}

/**
 * 
 * @param {Any} query
 * @returns {Expression}
 * @throws {TypeError}
 */
export function sq(query) {
  // accept a raw query string
  if ( isString(query) )
    return Literal.from(query).wrap()
  
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
export function column(value) {
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
export function table(value) {
  var alias = ''

  if ( value.indexOf(' as ') > 0 ) {
    [value, alias] = value.split(' as ').map(trim)
  }
  
  return new Table(value).as(alias)
}

/**
 * 
 * @param {Any} value
 * @returns {Escaped}
 */
export function esc(value) {
  return new Escaped(value)
}

/**
 * 
 * @param {Any} value
 * @param {String} type
 * @returns {Expression}
 */
export function cast(value, type) {
  return raw(`cast(? as ${type})`, value)
}
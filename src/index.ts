
import Order from './expression/order'
import Alias from './expression/alias'
import Table from './expression/table'
import Values from './expression/values'
import Literal from './expression/literal'
import Function from './expression/function'
import Identifier from './expression/identifier'
import Select from './expression/statement/select'
import Insert from './expression/statement/insert'

export function raw (expr: string, ...args): ILiteral {
  return new Literal(expr, args)
}

export function id (value): IExpression {
  return Identifier.from(value)
}

export function alias (expr, name: string, ...columns: string[]): IAlias {
  return new Alias(raw(expr), name, columns)
}

export function func (name: string, ...args): IFunction {
  return new Function(name, args)
}

export function asc (value): IOrder {
  return new Order(id(value)).asc()
}

export function desc (value): IOrder {
  return new Order(id(value)).desc()
}

export function table (name): ITable {
  return new Table(id(name))
}

export function esc (value: string): ILiteral {
  return raw(`'${String(value).replace(/'/g, "''")}'`)
}

export function val (value): ILiteral {
  return raw('?', value)
}

export function values (data: any[][]): IValues {
  return new Values(data)
}

export function select (...fields): ISelect {
  return new Select().select(...fields)
}

export function abs (expr): IFunction {
  return func('abs', expr)
}

export function round (x, y: number): IFunction {
  return func('round', x, y)
}

/**
 * A random float number between 0 and 1
 */
export function rand (): IFunction {
  return func('rand')
}

export let random = rand

export function upper (expr): IFunction {
  return func('upper', expr)
}

export let ucase = upper

export function lower (expr): IFunction {
  return func('lower', expr)
}

export let lcase = lower

export function concat (...args): IFunction {
  return func('concat', ...args)
}

export function length (expr): IFunction {
  return func('length', expr)
}

export let len = length

export function replace (expr, pattern, replacement): IFunction {
  return func('replace', expr, pattern, replacement)
}

export function substr (expr, start, length?): IFunction {
  if (length == null)
    return func('substr', expr, start)
  
  return func('substr', expr, start, length)
}

export let substring = substr

export function left (expr, length): IFunction {
  return func('left', expr, length)
}

export function right (expr, length): IFunction {
  return func('right', expr, length)
}

export function trim (expr): IFunction {
  return func('trim', expr)
}

export function ltrim (expr): IFunction {
  return func('ltrim', expr)
}

export function rtrim (expr): IFunction {
  return func('rtrim', expr)
}

export function strpos (str, substr): IFunction {
  return func('strpos', str, substr)
}

export let position = strpos

export function repeat (expr, count): IFunction {
  return func('repeat', expr, count)
}

export function space (length): IFunction {
  return func('space', length)
}

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 */
export function now (): IFunction {
  return func('now')
}

export let datetime = now

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 */
export function utc (): IFunction {
  return func('utc')
}

export function date (expr): IFunction {
  return func('date', expr)
}

export function time (expr): IFunction {
  return func('time', expr)
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 */
export function today (): IFunction {
  return func('current_date')
}

export let curdate = today

export function clock (): IFunction {
  return func('current_time')
}

export let curtime = clock

export function day (expr): IFunction {
  return func('day', expr)
}

export function month (expr): IFunction {
  return func('month', expr)
}

export function year (expr): IFunction {
  return func('year', expr)
}

export function hour (expr): IFunction {
  return func('hour', expr)
}

export function minute (expr): IFunction {
  return func('minute', expr)
}

export function second (expr): IFunction {
  return func('second', expr)
}

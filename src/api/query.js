
import { Select, Insert, Delete, Update } from '../query'

/**
 * 
 * @returns {Select}
 */
export function select() {
  return new Select().select(...arguments)
}

/**
 * 
 * @param {Any} table
 * @return {Select}
 */
export function selectFrom(table) {
  return this.select().from(...arguments)
}

/**
 * 
 * @param {Object|Array} data
 * @returns {Insert}
 */
export function insert(data) {
  return new Insert().values(data)
}

/**
 * 
 * @param {String|Expression} table
 * @param {String|Expression} columns
 * @returns {Insert}
 */
export function insertInto(table, ...columns) {
  return new Insert().into(table, ...columns)
}

/**
 * 
 * @param {String|Expression} table
 * @returns {Update}
 */
export function update(table) {
  return new Update().setTable(table)
}

/**
 * 
 * @param {String|Expression} table
 * @returns {Delete}
 */
export function deleteFrom(table) {
  return new Delete().setTable(table)
}

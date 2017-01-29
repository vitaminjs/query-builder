
import { Select } from './query'

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
 * @returns {Select}
 */
export function selectFrom(table) {
  return select().from(table)
}
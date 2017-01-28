
import { Select } from './query'

/**
 * 
 * @returns {Select}
 */
export function select() {
  return new Select().select(...arguments)
}
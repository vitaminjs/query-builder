
import { Select } from './query'

const builder = {

  /**
   * 
   * @returns {Select}
   */
  select() {
    return new Select().select(...arguments)
  },

  /**
   * 
   * @param {Any} table
   * @return {Select}
   */
  selectFrom(table) {
    return this.select().from(table)
  }

}

// export helpers
export * from './helpers'

export default builder
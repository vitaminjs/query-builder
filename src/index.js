
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
   * @return {Select}
   */
  selectFrom() {
    return this.select().from(...arguments)
  }

}

// export helpers
export * from './helpers'

export default builder
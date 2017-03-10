
import { Select, Insert, Delete, Update } from './query'

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
    return this.select().from(...arguments)
  },

  /**
   * 
   * @param {Object|Array} data
   * @returns {Insert}
   */
  insert(data) {
    return new Insert().values(data)
  },

  /**
   * 
   * @param {String|Expression} table
   * @param {String|Expression} columns
   * @returns {Insert}
   */
  insertInto(table, ...columns) {
    return new Insert().into(table, ...columns)
  },

  /**
   * 
   * @param {String|Expression} table
   * @returns {Update}
   */
  update(table) {
    return new Update().setTable(table)
  },

  /**
   * 
   * @param {String|Expression} table
   * @returns {Delete}
   */
  deleteFrom(table) {
    return new Delete().setTable(table)
  },

  /**
   * 
   * @see deleteFrom()
   */
  delete(table) {
    return this.deleteFrom(table)
  }

}

// export helpers
export * from './helpers'

export default builder
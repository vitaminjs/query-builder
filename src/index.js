
import { Select, Insert, Delete, Update } from './query'

const builder = {

  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  select(...value) {
    return new Select().setColumns(value)
  },

  /**
   * 
   * @param {Any} value
   * @return {Select}
   */
  selectFrom(...value) {
    return this.select().setTables(value)
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
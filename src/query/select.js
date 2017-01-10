
import Query from './base'

/**
 * @class SelectQuery
 */
export default class extends Query {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    super()
    
    this._columns = null
    this._tables = null
    this._unions = null
    this._joins = null
    this._where = null
    this._groups = null
    this._having = null
    this._orders = null
    this._limit = null
    this._offset = null
    this._unionLimit = null
    this._unionOffset = null
    this._unionOrders = null
  }
  
  setColumns(value) {
    this._columns = value
    return this
  }
  
  setTables(value) {
    this._tables = value
    return this
  }
  
}
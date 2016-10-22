
import QueryBuilder from './query/builder'
import Compiler from './query/compiler'
import { extend } from 'lodash'
import Promise from 'bluebird'

/**
 * @class MysqlClient
 */
export default class {
  
  /**
   * MysqlClient constructor
   * 
   * @param {String|Object} config
   * @constructor
   */
  constructor(config = {}) {
    this.pool = this.driver.createPool(this.config = config)
  }
  
  /**
   * Get the client driver
   * 
   * @var {Object}
   */
  get driver() {
    return require('mysql')
  }
  
  /**
   * Get the database name
   * 
   * @var {String}
   */
  get database() {
    return this.pool.config.database
  }
  
  /**
   * Perform a SQL query
   * 
   * @param {String|Object} sql
   * @param {Object} bindings
   * @param {Object} options
   * @return promise
   */
  query(sql, bindings = [], options = {}) {
    var obj = extend({ sql }, options)
    
    // debug(sql)
    
    return new Promise((resolve, reject) => {
      this.pool.query(obj, bindings, (err, rows) => {
        if ( err ) reject(err)
        else resolve(rows)
      })
    })
  }
  
  newQuery() {
    return new QueryBuilder(this)
  }
  
  compiler() {
    return new Compiler(this)
  }
  
}

import QueryBuilder from '../../builder'

/**
 * @class MysqlQueryBuilder
 */
export default class extends QueryBuilder {
  
  /**
   * MysqlQueryBuilder constructor
   * 
   * @param {Client} client
   * @constructor
   */
  constructor(client) {
    super()
    
    this.client = client
  }
  
  compiler() {
    return this.client.compiler()
  }
  
  newQuery() {
    return this.client.newQuery()
  }
  
}
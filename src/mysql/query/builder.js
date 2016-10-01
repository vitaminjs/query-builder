
import QueryBuilder from '../../query/builder'

/**
 * @class MysqlQuery
 */
export default class extends QueryBuilder {
  
  constructor(client) {
    super(client.compiler)
    
    this.client = client
  }
  
  /**
   * to override
   */
  get compiler() {
    return null
  }
  
  newQuery() {
    return this.client.newQuery()
  }
  
}
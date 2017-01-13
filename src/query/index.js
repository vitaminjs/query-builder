
import Query from './base'
import Select from './select'
import Insert from './insert'
import Update from './update'
import Delete from './delete'

// export base query class
export default Query

// export query classes
export { Select, Insert, Update, Delete }

/**
 * Query factory by type
 * 
 * @param {String} type
 * @returns {Query}
 * @throws {TypeError}
 */
export function createQuery(type, builder) {
  
  if ( type === 'select' ) return new Select(builder)
  
  if ( type === 'insert' ) return new Insert(builder)
  
  if ( type === 'update' ) return new Update(builder)
  
  if ( type === 'delete' ) return new Delete(builder)
  
  throw new TypeError("Invalid query type")
  
}
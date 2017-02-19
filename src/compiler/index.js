
import Base from './base'
import Mysql from './mysql'
import Mssql from './mssql'
import Sqlite from './sqlite'
import Postgre from './postgre'

// export the base compiler as default 
export default Base

/**
 * Create a compiler for the given dialect
 * 
 * @param {String} dialect
 * @param {Object} options
 * @returns {Compiler}
 * @throws {TypeError}
 */
export function createCompiler(dialect, options = {}) {
  switch ( dialect.toLowerCase() ) {
    case 'mysql': return new Mysql(options)
    
    case 'mssql': return new Mssql(options)
    
    case 'sqlite': return new Sqlite(options)
    
    case 'pg':
    case 'postgre': 
    case 'postgresql': return new Postgre(options)
  }
  
  throw new TypeError("Unknown compiler dialect")
}
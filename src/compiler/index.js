
import Base from './base'
import Mysql from './mysql'
import Mssql from './mssql'
import Oracle from './oracle'
import Sqlite from './sqlite'
import Postgre from './postgre'

// export the base compiler as default 
export default Base

// export the database related compilers
export { Mysql, Mssql, Oracle, Sqlite, Postgre }

/**
 * Create a compiler for the given dialect
 * 
 * @param {String} dialect
 * @returns {Query}
 * @throws {TypeError}
 */
export function createCompiler(dialect) {
  dialect = dialect.toLowerCase()
  
  switch (dialect) {
    case 'mysql': return new Mysql
    
    case 'mssql': return new Mssql
    
    case 'oracle': return new Oracle
    
    case 'sqlite': return new Sqlite
    
    case 'pg':
    case 'postgre': 
    case 'postgresql': return new Postgre
  }
  
  throw new TypeError("Unknown database dialect")
}

import Base from './base'
import Mysql from './mysql'
import Mssql from './mssql'
import Oracle from './oracle'
import Sqlite from './sqlite'
import Postgre from './postgre'

/**
 * Create a compiler for the given dialect
 * 
 * @param {String} dialect
 * @return query compiler
 */
export function createCompiler(dialect) {
  dialect = dialect.toLowerCase()
  
  if ( dialect === 'mysql' ) return new Mysql
  
  if ( dialect === 'mssql' ) return new Mssql
  
  if ( dialect === 'oracle' ) return new Oracle
  
  if ( dialect === 'sqlite' ) return new Sqlite
  
  if ( dialect === 'postgre' ) return new Postgre
  
  throw new TypeError("Unknown database dialect")
}

// export the base compiler as default 
export default Base

// export the database related compilers
export { Mysql, Mssql, Oracle, Sqlite, Postgre }
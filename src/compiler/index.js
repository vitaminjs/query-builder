
import MysqlCompiler from './mysql'
import MssqlCompiler from './mssql'
import OracleCompiler from './oracle'
import SqliteCompiler from './sqlite'
import PostgreCompiler from './postgre'

/**
 * Create a compiler for the given dialect
 * 
 * @param {String} dialect
 * @return query compiler
 */
export function createCompiler(dialect) {
  dialect = dialect.toLowerCase()
  
  if ( dialect === 'mysql' ) return new MysqlCompiler
  
  if ( dialect === 'mssql' ) return new MssqlCompiler
  
  if ( dialect === 'oracle' ) return new OracleCompiler
  
  if ( dialect === 'sqlite' ) return new SqliteCompiler
  
  if ( dialect === 'postgre' ) return new PostgreCompiler
  
  throw new TypeError("Unknown database dialect")
}
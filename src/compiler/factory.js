
import { isString } from 'lodash'
import BaseCompiler from './base'
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
function createCompiler(dialect = 'base') {
  dialect = dialect.toLowerCase()
  
  if ( dialect === 'base' ) return new BaseCompiler
  
  if ( dialect === 'mysql' ) return new MysqlCompiler
  
  if ( dialect === 'mssql' ) return new MssqlCompiler
  
  if ( dialect === 'oracle' ) return new OracleCompiler
  
  if ( dialect === 'sqlite' ) return new SqliteCompiler
  
  if ( dialect === 'postgre' ) return new PostgreCompiler
  
  throw new TypeError("Unknown database dialect")
}

export { createCompiler }
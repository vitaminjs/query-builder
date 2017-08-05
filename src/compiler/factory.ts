
import MySQL from './mysql'
import MSSQL from './mssql'
import SQLite from './sqlite'
import PostgreSQL from './postgre'

export default (dialect: string, options?: ICompilerOptions): ICompiler => {
  switch (dialect.toLowerCase()) {
    case 'mysql': return new MySQL(options)
    
    case 'mssql': return new MSSQL(options)
    
    case 'sqlite':
    case 'sqlite3': return new SQLite(options)
    
    case 'pg':
    case 'postgre':
    case 'postgresql': return new PostgreSQL(options)
  }
    
  throw new TypeError('Unknown compiler dialect')
}

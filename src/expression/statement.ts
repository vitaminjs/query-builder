
import Alias from './alias'
import { isString } from 'lodash'
import Compiler from '../compiler'
import Expression from '../expression'
import createCompiler from '../compiler/factory'

export default abstract class Statement extends Expression implements IStatement {
  public table: IExpression
  
  public cte: IExpression[]
  
  public constructor (table?: IExpression, cte = []) {
    super()
    
    this.cte = cte
    this.table = table
  }
  
  public toQuery (dialect: string, options: ICompilerOptions): IQuery
  public toQuery (dialect: ICompiler): IQuery
  public toQuery (dialect, options = {}) {
    if (isString(dialect)) dialect = createCompiler(dialect, options)
    
    if (dialect instanceof Compiler) return dialect.toQuery(this)
    
    throw new TypeError('Invalid statement compiler')
  }
  
  public as (name: string, ...columns: string[]): Alias {
    return new Alias(this, name, columns)
  }
  
  public hasTable (): boolean {
    return this.table != null
  }
  
  public hasCTE (): boolean {
    return this.cte.length > 0
  }
}


import Alias from './alias'
import Expression from '../expression'

export default abstract class Statement extends Expression implements IStatement {
  public table: IExpression
  
  public cte: IExpression[]
  
  public constructor (table?, cte = []) {
    super()
    
    this.cte = cte
    this.table = table
  }
  
  public as (name, ...columns): Alias {
    return new Alias(this, name, columns)
  }
  
  public hasTable (): boolean {
    return this.table != null
  }
  
  public hasCTE (): boolean {
    return this.cte.length > 0
  }
}


import Literal from './literal'
import Criteria from './criteria'
import Expression from '../expression'

export default class Join extends Expression {
  public table: IExpression
  
  public type: string
  
  public conditions: Criteria[]
  
  public columns: string[]
  
  public constructor (table: IExpression, type = 'inner', conditions = [], columns = []) {
    super()
    
    this.type = type
    this.table = table
    this.columns = columns
    this.conditions = conditions
  }
  
  public static from (table, type = 'inner'): IExpression {
    if (table instanceof Join) return table
    
    if (table instanceof Literal) return table
    
    return new Join(Literal.from(table), type)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileJoin(this)
  }
  
  public clone (): Join {
    return new Join(this.table, this.type, this.conditions.slice(), this.columns.slice())
  }
  
  public where (expr, ...args): Join {
    this.conditions.push(Criteria.from(expr, args))
    return this
  }
  
  public orWhere (expr, ...args): Join {
    this.conditions.push(Criteria.from(expr, args).or())
    return this
  }
  
  public whereNot (expr, ...args): Join {
    this.conditions.push(Criteria.from(expr, args).not())
    return this
  }
  
  public orWhereNot (expr, ...args): Join {
    this.conditions.push(Criteria.from(expr, args).or().not())
    return this
  }
  
  public hasConditions (): boolean {
    return this.conditions.length > 0
  }
  
  public hasColumns (): boolean {
    return this.columns.length > 0
  }
}

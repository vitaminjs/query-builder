
import Literal from './literal'
import Criteria from './criteria'
import Identifier from './identifier'
import Expression from '../expression'

export default class Join extends Expression implements IJoin {
  public table: IExpression
  
  public type: string
  
  public conditions: Criteria[]
  
  public columns: string[]
  
  public constructor (table: IExpression, type = 'inner') {
    super()
    
    this.type = type
    this.columns = []
    this.table = table
    this.conditions = []
  }
  
  public static from (table: string | IExpression, type = 'inner'): IExpression {
    if (table instanceof Join) return table
    
    if (table instanceof Literal) return table
    
    return new Join(Identifier.from(table), type)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileJoin(this)
  }
  
  public clone (): Join {
    return new Join(this.table, this.type)
      .setConditions(this.conditions.slice())
      .setColumns(this.columns.slice())
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

  public setConditions (value: Criteria[]): Join {
    this.conditions = value
    return this
  }
  
  public hasColumns (): boolean {
    return this.columns.length > 0
  }

  public setColumns (value: string[]): Join {
    this.columns = value
    return this
  }
}

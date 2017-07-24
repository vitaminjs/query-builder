
import Criteria from '../criteria'
import Statement from '../statement'

export default class Delete extends Statement {
  public conditions: Criteria[]
  
  public results: string[]
  
  public constructor (table, cte = []) {
    super(table, cte)
    
    this.results = []
    this.conditions = []
  }
  
  public compile (compiler: ICompiler): string {
    return this.hasTable() ? compiler.compileDeleteStatement(this) : ''
  }
  
  public clone (): Delete {
    return new Delete(this.table, this.cte.slice())
      .setConditions(this.conditions.slice())
      .setResults(this.results.slice())
  }
  
  public where (expr, ...args): Delete {
    this.conditions.push(Criteria.from(expr, args))
    return this
  }
  
  public orWhere (expr, ...args): Delete {
    this.conditions.push(Criteria.from(expr, args).or())
    return this
  }
  
  public whereNot (expr, ...args): Delete {
    this.conditions.push(Criteria.from(expr, args).not())
    return this
  }
  
  public orWhereNot (expr, ...args): Delete {
    this.conditions.push(Criteria.from(expr, args).or().not())
    return this
  }
  
  public hasConditions (): boolean {
    return this.conditions.length > 0
  }
  
  public setConditions (value): Delete {
    this.conditions = value
    return this
  }
  
  public returning (...columns): Delete {
    this.results.push(...columns)
    return this
  }
  
  public hasResults (): boolean {
    return this.results.length > 0
  }
  
  public setResults (value): Delete {
    this.results = value
    return this
  }
}


import Criteria from '../criteria'
import Statement from '../statement'
import { castArray, isString } from 'lodash'

export default class Update extends Statement {
  public conditions: Criteria[]
  
  public results: string[]
  
  public values: {}[]
  
  public constructor (table: IExpression, cte = []) {
    super(table, cte)
    
    this.values = []
    this.results = []
    this.conditions = []
  }
  
  public compile (compiler: ICompiler): string {
    if (this.hasTable() && this.hasValues()) {
      return compiler.compileUpdateStatement(this)
    }
    
    return ''
  }
  
  public clone (): Update {
    return new Update(this.table, this.cte.slice())
      .setConditions(this.conditions.slice())
      .setResults(this.results.slice())
      .setValues(this.values.slice())
  }
  
  public where (expr, ...args): Update {
    this.conditions.push(Criteria.from(expr, args))
    return this
  }
  
  public orWhere (expr, ...args): Update {
    this.conditions.push(Criteria.from(expr, args).or())
    return this
  }
  
  public whereNot (expr, ...args): Update {
    this.conditions.push(Criteria.from(expr, args).not())
    return this
  }
  
  public orWhereNot (expr, ...args): Update {
    this.conditions.push(Criteria.from(expr, args).or().not())
    return this
  }
  
  public hasConditions (): boolean {
    return this.conditions.length > 0
  }
  
  public setConditions (value: Criteria[]): Update {
    this.conditions = value
    return this
  }
  
  public returning (...columns: string[]): Update {
    this.results.push(...columns)
    return this
  }
  
  public hasResults (): boolean {
    return this.results.length > 0
  }
  
  public setResults (value: string[]): Update {
    this.results = value
    return this
  }
  
  public set (key: string, value): Update
  public set (obj: {}): Update
  public set (key, value?) {
    this.values.push(isString(key) ? { [key]: value } : key)
    return this
  }
  
  public hasValues (): boolean {
    return this.values.length > 0
  }
  
  public setValues (value: {}): Update {
    this.values = castArray(value)
    return this
  }
}

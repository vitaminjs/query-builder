
import Values from '../values'
import Statement from '../statement'

export default class Insert extends Statement implements IInsert {
  public values: IExpression
  
  public results: string[]
  
  public columns: string[]
  
  public constructor (table: IExpression, cte = []) {
    super(table, cte)
    
    this.results = []
    this.columns = []
  }
  
  public compile (compiler: ICompiler): string {
    if (this.hasTable() && this.hasValues()) {
      return compiler.compileInsertStatement(this)
    }
    
    return ''
  }
  
  public clone (): Insert {
    return new Insert(this.table, this.cte)
      .setColumns(this.columns.slice())
      .setResults(this.results.slice())
      .setValues(this.values)
  }
  
  public hasValues (): boolean {
    return this.values != null
  }
  
  public setValues (value: IExpression): Insert {
    this.values = value
    
    if (!this.hasColumns() && value instanceof Values) {
      this.setColumns(value.columns.slice())
    }
    
    return this
  }
  
  public defaultValues (): Insert {
    this.values = null
    return this
  }
  
  public using (...columns: string[]): Insert {
    this.columns.push(...columns)
    return this
  }
  
  public hasColumns (): boolean {
    return this.columns.length > 0
  }
  
  public setColumns (value: string[]): Insert {
    this.columns = value
    return this
  }
  
  public returning (...columns: string[]): Insert {
    this.results.push(...columns)
    return this
  }
  
  public hasResults (): boolean {
    return this.results.length > 0
  }
  
  public setResults (value: string[]): Insert {
    this.results = value
    return this
  }
}

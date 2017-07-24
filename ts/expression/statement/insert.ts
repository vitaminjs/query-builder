
import { chain, keys } from 'lodash'
import Statement from '../statement'

export default class Insert extends Statement {
  public values: {}[]
  
  public select: IStatement
  
  public results: string[]
  
  public columns: string[]
  
  public constructor (table, cte = []) {
    super(table, cte)
    
    this.values = []
    this.results = []
    this.columns = []
  }
  
  public compile (compiler: ICompiler): string {
    if (this.hasTable && (this.hasValues() || this.hasSelect())) {
      return compiler.compileInsertStatement(this)
    }
    
    return ''
  }
  
  public clone (): Insert {
    return new Insert(this.table, this.cte)
      .setColumns(this.columns.slice())
      .setResults(this.results.slice())
      .setValues(this.values.slice())
      .setSelect(this.select)
  }
  
  public hasValues (): boolean {
    return this.values.length > 0
  }
  
  public setValues (value: {}[]): Insert {
    this.values = value
    
    if (!this.hasColumns()) {
      let columns = chain(value).map(keys).flatten().uniq().value()
      
      this.setColumns(columns)
    }
    
    return this
  }
  
  public defaultValues (): Insert {
    this.select = null
    this.values = []
    return this
  }
  
  public setSelect (query: IStatement): Insert {
    this.select = query
    return this
  }
  
  public hasSelect (): boolean {
    return this.select != null
  }
  
  public using (...columns: string[]): Insert {
    this.columns.push(...columns)
    return this
  }
  
  public hasColumns (): boolean {
    return this.columns.length > 0
  }
  
  public setColumns (value): Insert {
    this.columns = value
    return this
  }
  
  public returning (...columns): Insert {
    this.results.push(...columns)
    return this
  }
  
  public hasResults (): boolean {
    return this.results.length > 0
  }
  
  public setResults (value): Insert {
    this.results = value
    return this
  }
}

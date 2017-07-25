
import Expression from '../expression'

export default class Union extends Expression {
  public query: IExpression
  
  public filter: string
  
  public constructor (query: IExpression, filter = 'distinct') {
    super()
    
    this.query = query
    this.filter = filter
  }
  
  public static from (query: IExpression, filter: string): Union
  public static from (query: IExpression): Union
  public static from (query, filter = 'distinct') {
    if (query instanceof Union) return query
    
    return new Union(query, filter)
  }
  
  public all (): Union {
    this.filter = 'all'
    return this
  }
  
  public distinct (): Union {
    this.filter = 'distinct'
    return this
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileUnion(this)
  }
  
  public clone (): Union {
    return new Union(this.query, this.filter)
  }
}


import Union from '../union'
import Literal from '../literal'
import Statement from '../statement'

export default class Compound extends Statement {
  public source: IStatement
  
  public unions: Union[]
  
  public orders: IExpression[]
  
  public offset: any
  
  public limit: any
  
  public  constructor (source: IStatement) {
    super(null)
    
    this.unions = []
    this.orders = []
    this.source = source
  }
  
  public compile(compiler: ICompiler): string {
    if (this.source && this.hasUnions()) {
      return compiler.compileCompoundStatement(this)
    }
    
    return ''
  }
  
  public clone(): Compound {
    return new Compound(this.source)
      .setUnions(this.unions.slice())
      .setOrders(this.orders.slice())
      .skip(this.offset)
      .take(this.limit)
  }
  
  public union (query, filter = 'distinct'): Compound {
    this.unions.push(Union.from(query, filter))
    return this
  }
  
  public unionAll (query): Compound {
    return this.union(query, 'all')
  }
  
  public hasUnions (): boolean {
    return this.unions.length > 0
  }
  
  public setUnions (value): Compound {
    this.unions = value
    return this
  }
  
  public orderBy (...fields): Compound {
    fields.forEach((value) => this.orders.push(Literal.from(value)))
    return this
  }
  
  public hasOrders (): boolean {
    return this.orders.length > 0
  }
  
  public setOrders (value): Compound {
    this.orders = value
    return this
  }
  
  public take (value): Compound {
    this.limit = value
    return this
  }
  
  public hasLimit (): boolean {
    return this.limit != null
  }
  
  public skip (value): Compound {
    this.offset = value
    return this
  }
  
  public hasOffset (): boolean {
    return this.offset != null
  }
}

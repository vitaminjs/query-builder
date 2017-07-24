
import Insert from './insert'
import Literal from '../literal'
import Compound from './compound'
import Criteria from '../criteria'
import Statement from '../statement'
import Identifier from '../identifier'

export default class Select extends Statement implements ISelect {
  public fields: IExpression[]
  
  public conditions: Criteria[]
  
  public joins: IExpression[]
  
  public groups: IExpression[]
  
  public havings: IExpression[]
  
  public orders: IExpression[]
  
  public isDistinct: boolean
  
  public offset: any
  
  public limit: any
  
  public constructor (table?, fields = [], cte = []) {
    super(table, cte)
    
    this.joins = []
    this.orders = []
    this.groups = []
    this.havings = []
    this.fields = fields
    this.conditions = []
    this.isDistinct = false
  }
  
  public compile (compiler: ICompiler): string {
    if (this.hasTable() || this.hasFields() || this.hasCTE()) {
      // return compiler.compileSelectStatement(this)
    }
    
    return ''
  }
  
  public clone (): Select {
    return new Select(this.table, this.fields.slice(), this.cte.slice())
      .setOrders(this.orders.slice())
      .distinct(this.isDistinct)
      .skip(this.offset)
      .take(this.limit)
  }
  
  public into (table, ...columns: string[]): Insert {
    return new Insert(Identifier.from(table)).setColumns(columns).setValues(this)
  }
  
  public hasFields (): boolean {
    return this.fields.length > 0
  }
  
  public setFields (value): Select {
    this.fields = value
    return this
  }
  
  public distinct (flag = true): Select {
    this.isDistinct = flag
    return this
  }
  
  public take (value): Select {
    this.limit = value
    return this
  }
  
  public hasLimit (): boolean {
    return this.limit != null
  }
  
  public skip (value): Select {
    this.offset = value
    return this
  }
  
  public hasOffset (): boolean {
    return this.offset != null
  }
  
  public union (query, filter = 'distinct') {
    return new Compound(this).union(query, filter)
  }
  
  public unionAll (query): Compound {
    return this.union(query, 'all')
  }
  
  public orderBy (...fields): Select {
    fields.forEach((value) => this.orders.push(Literal.from(value)))
    return this
  }
  
  public hasOrders (): boolean {
    return this.orders.length > 0
  }
  
  public setOrders (value): Select {
    this.orders = value
    return this
  }
}

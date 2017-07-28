
import Join from '../join'
import { last } from 'lodash'
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
  
  public havings: Criteria[]
  
  public orders: IExpression[]
  
  public isDistinct: boolean
  
  public offset: any
  
  public limit: any
  
  public constructor (table?: IExpression, cte = []) {
    super(table, cte)
    
    this.joins = []
    this.orders = []
    this.groups = []
    this.fields = []
    this.havings = []
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
    return new Select(this.table, this.cte.slice())
      .setConditions(this.conditions.slice())
      .setHavings(this.havings.slice())
      .setFields(this.fields.slice())
      .setOrders(this.orders.slice())
      .setGroups(this.groups.slice())
      .setJoins(this.joins.slice())
      .distinct(this.isDistinct)
      .skip(this.offset)
      .take(this.limit)
  }
  
  public into (table: IExpression, ...columns: string[]): Insert
  public into (table: string, ...columns: string[]): Insert
  public into (table, ...columns) {
    return new Insert(Identifier.from(table)).setColumns(columns).setValues(this)
  }

  public select (...fields): Select {
    fields.forEach((value) => this.fields.push(Literal.from(value)))
    return this
  }
  
  public hasFields (): boolean {
    return this.fields.length > 0
  }
  
  public setFields (value: IExpression[]): Select {
    this.fields = value
    return this
  }
  
  public from (table): Select {
    this.table = Literal.from(table)
    return this
  }
  
  public distinct (flag = true): Select {
    this.isDistinct = flag
    return this
  }
  
  public join (table: string, type: string): Select
  public join (table: IExpression): Select
  public join (table, type = 'inner') {
    this.joins.push(Join.from(table, type))
    return this
  }

  public innerJoin (table: IExpression): Select
  public innerJoin (table: string): Select
  public innerJoin (table) {
    return this.join(table)
  }
  
  public rightJoin (table: IExpression): Select
  public rightJoin (table: string): Select
  public rightJoin (table) {
    return this.join(table, 'right')
  }
  
  public leftJoin (table: IExpression): Select
  public leftJoin (table: string): Select
  public leftJoin (table) {
    return this.join(table, 'left')
  }
  
  public crossJoin (table: IExpression): Select
  public crossJoin (table: string): Select
  public crossJoin (table) {
    return this.join(table, 'cross')
  }
  
  public on (expr: string, args: any[]): Select
  public on (expr: IExpression): Select
  public on (obj: {}): Select
  public on (condition, ...args) {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.where(condition, ...args)
      return this
    }
    
    throw new TypeError('Trying to add conditions to an undefined join expression')
  }
  
  public orOn (expr: string, args: any[]): Select
  public orOn (expr: IExpression): Select
  public orOn (obj: {}): Select
  public orOn (condition, ...args) {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.orWhere(condition, ...args)
      return this
    }
    
    throw new TypeError('Trying to add conditions to an undefined join expression')
  }
  
  public using (...columns: string[]): Select {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.columns.push(...columns)
      return this
    }
    
    throw new TypeError('Trying to add `using` to an undefined join expression')
  }
  
  public hasJoins (): boolean {
    return this.joins.length > 0
  }

  public setJoins (value: IExpression[]): Select {
    this.joins = value
    return this
  }
  
  public where (expr, ...args): Select {
    this.conditions.push(Criteria.from(expr, args))
    return this
  }
  
  public orWhere (expr, ...args): Select {
    this.conditions.push(Criteria.from(expr, args).or())
    return this
  }
  
  public whereNot (expr, ...args): Select {
    this.conditions.push(Criteria.from(expr, args).not())
    return this
  }
  
  public orWhereNot (expr, ...args): Select {
    this.conditions.push(Criteria.from(expr, args).or().not())
    return this
  }
  
  public hasConditions (): boolean {
    return this.conditions.length > 0
  }
  
  public setConditions (value: Criteria[]): Select {
    this.conditions = value
    return this
  }
  
  public groupBy (...fields): Select {
    fields.forEach((value) => this.groups.push(Literal.from(value)))
    return this
  }
  
  public hasGroups (): boolean {
    return this.groups.length > 0
  }
  
  public setGroups (value: IExpression[]): Select {
    this.groups = value
    return this
  }
  
  public having (expr, ...args): Select {
    this.havings.push(Criteria.from(expr, args))
    return this
  }
  
  public orHaving (expr, ...args): Select {
    this.havings.push(Criteria.from(expr, args).or())
    return this
  }
  
  public havingNot (expr, ...args): Select {
    this.havings.push(Criteria.from(expr, args).not())
    return this
  }
  
  public orHavingNot (expr, ...args): Select {
    this.havings.push(Criteria.from(expr, args).or().not())
    return this
  }
  
  public hasHavings (): boolean {
    return this.havings.length > 0
  }
  
  public setHavings (value: Criteria[]): Select {
    this.havings = value
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
  
  public orderBy (...fields): Select {
    fields.forEach((value) => this.orders.push(Literal.from(value)))
    return this
  }
  
  public hasOrders (): boolean {
    return this.orders.length > 0
  }
  
  public setOrders (value: IExpression[]): Select {
    this.orders = value
    return this
  }
  
  public union (query: IExpression, filter: string): Compound
  public union (query: IExpression): Compound
  public union (query, filter = 'distinct') {
    return new Compound(this).union(query, filter)
  }
  
  public unionAll (query: IExpression): Compound {
    return this.union(query, 'all')
  }
}

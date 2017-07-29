
import Join from './join'
import Alias from './alias'
import Values from './values'
import Expression from '../expression'
import Select from './statement/select'
import Delete from './statement/delete'
import Update from './statement/update'
import Insert from './statement/insert'
import { last, castArray, isEmpty } from 'lodash'

export default class Table extends Expression implements ITable {
  public name: IExpression
  
  public joins: IExpression[]
  
  public constructor (name: IExpression, joins = []) {
    super()
    
    this.name = name
    this.joins = joins
  }
  
  public as (name: string): Alias {
    return new Alias(this, name)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileTable(this)
  }
  
  public clone (): Table {
    return new Table(this.name).setJoins(this.joins.slice())
  }
  
  public join (table: string, type: string): Table
  public join (table: IExpression): Table
  public join (table, type = 'inner') {
    this.joins.push(Join.from(table, type))
    return this
  }
  
  public innerJoin (table: IExpression): Table
  public innerJoin (table: string): Table
  public innerJoin (table) {
    return this.join(table)
  }
  
  public rightJoin (table: IExpression): Table
  public rightJoin (table: string): Table
  public rightJoin (table) {
    return this.join(table, 'right')
  }
  
  public leftJoin (table: IExpression): Table
  public leftJoin (table: string): Table
  public leftJoin (table) {
    return this.join(table, 'left')
  }
  
  public crossJoin (table: IExpression): Table
  public crossJoin (table: string): Table
  public crossJoin (table) {
    return this.join(table, 'cross')
  }
  
  public on (expr: string, args: any[]): Table
  public on (expr: IExpression): Table
  public on (obj: {}): Table
  public on (condition, ...args) {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.where(condition, ...args)
      return this
    }
    
    throw new TypeError('Trying to add conditions to an undefined join expression')
  }
  
  public orOn (expr: string, args: any[]): Table
  public orOn (expr: IExpression): Table
  public orOn (obj: {}): Table
  public orOn (condition, ...args) {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.orWhere(condition, ...args)
      return this
    }
    
    throw new TypeError('Trying to add conditions to an undefined join expression')
  }
  
  public using (...columns: string[]): Table {
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

  public setJoins (value: IExpression[]): Table {
    this.joins = value
    return this
  }
  
  public select (...fields): Select {
    return new Select(this).select(...fields)
  }
  
  public delete (): Delete {
    return new Delete(this)
  }
  
  public update (key: string, value): Update
  public update (obj: {}): Update
  public update (one, two?) {
    if (!one) return new Update(this)
    
    return new Update(this).set(one, two)
  }
  
  public insert (...data: {}[]): Insert {
    let ins = new Insert(this)
    
    if (!isEmpty(data))
      ins.setValues(Values.from(data))
    
    return ins
  }
}

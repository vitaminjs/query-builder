
import Join from './join'
import Alias from './alias'
import Expression from '../expression'
import Select from './statement/select'
import Delete from './statement/delete'
import Update from './statement/update'
import Insert from './statement/insert'
import { last, castArray } from 'lodash'

export default class Table extends Expression {
  public name: IExpression
  
  public joins: IExpression[]
  
  public constructor (name, joins = []) {
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
    return new Table(this.name, this.joins.slice())
  }
  
  public join (table, type = 'inner'): Table {
    this.joins.push(Join.from(table, type))
    return this
  }
  
  public innerJoin (table): Table {
    return this.join(table)
  }
  
  public rightJoin (table): Table {
    return this.join(table, 'right')
  }
  
  public leftJoin (table): Table {
    return this.join(table, 'left')
  }
  
  public crossJoin (table): Table {
    return this.join(table, 'cross')
  }
  
  public on (condition, ...args): Table {
    let expr = last(this.joins)
    
    if (expr instanceof Join) {
      expr.where(condition, ...args)
      return this
    }
    
    throw new TypeError('Trying to add conditions to an undefined join expression')
  }
  
  public orOn (condition, ...args): Table {
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
  
  public select (...fields): Select {
    return new Select(this, fields)
  }
  
  public delete (): Delete {
    return new Delete(this)
  }
  
  public update (key: string | {}, value?): Update {
    return new Update(this).set(key, value)
  }
  
  public insert (values?: {}[]): Insert {
    return new Insert(this).setValues(values || [])
  }
}

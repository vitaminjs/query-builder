
import Compiler from './compiler'
import Join from './expression/join'
import Union from './expression/union'
import Alias from './expression/alias'
import Values from './expression/values'
import Literal from './expression/literal'
import Criteria from './expression/criteria'
import Statement from './expression/statement'
import createCompiler from './compiler/factory'
import Identifier from './expression/identifier'
import { assign, last, isString, isEmpty } from 'lodash'

export default class Builder implements IBuilder {
  protected statement: IStatement

  public constructor (base = {}) {
    this.statement = new Statement(base)
  }

  public clone (): Builder {
    return new Builder(this.statement)
  }

  public as (name: string, ...columns: string[]): Alias {
    return new Alias(this.statement, name, columns)
  }
  
  public toExpression (): IExpression {
    return this.statement
  }

  public toQuery (compiler: ICompiler): IQuery
  public toQuery (dialect: string, options?: ICompilerOptions): IQuery
  public toQuery (dialect, options = <ICompilerOptions>{}) {
    if (isString(dialect)) dialect = createCompiler(dialect, options)

    if (dialect instanceof Compiler) return dialect.toQuery(this.statement)

    throw new TypeError('Invalid statement compiler')
  }
  
  public hasCTE (): boolean {
    return !isEmpty(this.statement.cte)
  }
  
  public setCTE (value: IExpression[]): Builder {
    this.statement.cte = value
    return this
  }
  
  public getCTE (): IExpression[] {
    if (!this.hasCTE()) this.resetCTE()

    return this.statement.cte
  }
  
  public resetCTE (): Builder {
    return this.setCTE([])
  }

  public hasTable (): boolean {
    return this.statement.source != null
  }

  public setTable (value: IExpression): Builder {
    if (this.statement.isCompound()) return this
    
    this.statement.source = value
    return this
  }

  public getTable (): IExpression {
    return this.statement.source
  }

  public resetTable (): Builder {
    return this.setTable(null)
  }

  public hasValues (): boolean {
    return this.statement.values != null
  }

  public setValues (value: IExpression | { [key: string]: any }): Builder {
    this.statement.values = value
    return this
  }

  public getValues () {
    return this.statement.values
  }

  public resetValues (): Builder {
    return this.setValues(null)
  }

  public hasColumns (): boolean {
    return !isEmpty(this.statement.columns)
  }

  public setColumns (value: string[]): Builder {
    this.statement.columns = value
    return this
  }

  public getColumns (): string[] {
    if (!this.hasColumns()) this.resetColumns()

    return this.statement.columns
  }

  public resetColumns (): Builder {
    return this.setColumns([])
  }

  public hasResults (): boolean {
    return !isEmpty(this.statement.results)
  }

  public setResults (value: IExpression[]): Builder {
    this.statement.results = value
    return this
  }

  public getResults (): IExpression[] {
    if (!this.hasResults()) this.resetResults()
  
    return this.statement.results
  }

  public resetResults (): Builder {
    return this.setResults([])
  }

  public hasJoins (): boolean {
    return !isEmpty(this.statement.joins)
  }

  public setJoins (value: IExpression[]): Builder {
    this.statement.joins = value
    return this
  }

  public getJoins (): IExpression[] {
    if (!this.hasJoins()) this.resetJoins()
  
    return this.statement.joins
  }

  public resetJoins (): Builder {
    return this.setJoins([])
  }

  public hasConditions (): boolean {
    return !isEmpty(this.statement.conditions)
  }

  public setConditions (value: ICriteria[]): Builder {
    this.statement.conditions = value
    return this
  }

  public getConditions (): ICriteria[] {
    if (!this.hasConditions()) this.resetConditions()
  
    return this.statement.conditions
  }

  public resetConditions (): Builder {
    return this.setConditions([])
  }
  
  public hasGroups (): boolean {
    return !isEmpty(this.statement.groups)
  }
  
  public setGroups (value: IExpression[]): Builder {
    this.statement.groups = value
    return this
  }

  public getGroups (): IExpression[] {
    if (!this.hasGroups()) this.resetGroups()
      
    return this.statement.groups
  }

  public resetGroups (): Builder {
    return this.setGroups([])
  }
  
  public hasHavings (): boolean {
    return !isEmpty(this.statement.havings)
  }
  
  public setHavings (value: ICriteria[]): Builder {
    this.statement.havings = value
    return this
  }

  public getHavings (): ICriteria[] {
    if (!this.hasHavings()) this.resetHavings()
      
    return this.statement.havings
  }

  public resetHavings (): Builder {
    return this.setHavings([])
  }

  public hasUnions (): boolean {
    return !isEmpty(this.statement.unions)
  }
  
  public setUnions (value: IUnion[]): Builder {
    this.statement.unions = value
    return this
  }

  public getUnions (): IUnion[] {
    if (!this.hasUnions()) this.resetUnions()

    return this.statement.unions
  }

  public resetUnions (): Builder {
    return this.setUnions([])
  }

  public hasOrders (): boolean {
    return !isEmpty(this.statement.orders)
  }
  
  public setOrders (value: IExpression[]): Builder {
    this.statement.orders = value
    return this
  }

  public getOrders (): IExpression[] {
    if (!this.hasOrders()) this.resetOrders()

    return this.statement.orders
  }

  public resetOrders (): Builder {
    return this.setOrders([])
  }

  public hasLimit (): boolean {
    return this.statement.limit != null
  }

  public setLimit (value: number | IExpression): Builder {
    this.statement.limit = value
    return this
  }

  public getLimit (): number | IExpression {
    return this.statement.limit
  }

  public resetLimit (): Builder {
    return this.setLimit(null)
  }

  public hasOffset (): boolean {
    return this.statement.offset != null
  }

  public setOffset (value: number | IExpression): Builder {
    this.statement.offset = value
    return this
  }

  public getOffset (): number | IExpression {
    return this.statement.offset
  }

  public resetOffset (): Builder {
    return this.setOffset(null)
  }
  
  public with (...cte: IExpression[]): Builder {
    cte.forEach((value) => this.getCTE().push(value))
    return this
  }

  public select (...fields: any[]): Builder {
    this.convertCompoundToSelect()

    fields.forEach((value) => {
      if (value instanceof Builder) value = value.toExpression()

      this.getResults().push(Literal.from(value))
    })

    return this
  }

  public distinct (flag = true): Builder {
    this.convertCompoundToSelect()

    this.statement.distinct = flag
    return this
  }

  public from (table: string | Builder | IExpression): Builder {
    if (table instanceof Builder) table = table.toExpression()
    
    return this.setTable(Identifier.from(table))
  }

  public join (table: string | Builder | IExpression, type = 'inner'): Builder {
    this.convertCompoundToSelect()
    
    if (table instanceof Builder) table = table.toExpression()

    this.getJoins().push(Join.from(table, type))
    return this
  }

  public innerJoin(table: string | IExpression): Builder {
    return this.join(table)
  }

  public leftJoin(table: string | IExpression): Builder {
    return this.join(table, 'left')
  }

  public rightJoin(table: string | IExpression): Builder {
    return this.join(table, 'right')
  }

  public crossJoin(table: string | IExpression): Builder {
    return this.join(table, 'cross')
  }

  public on (condition, ...args): Builder {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.where(condition, ...args)
      return this
    }

    throw new TypeError('Trying to add conditions to an undefined join expression')
  }

  public orOn (condition, ...args): Builder {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.orWhere(condition, ...args)
      return this
    }

    throw new TypeError('Trying to add conditions to an undefined join expression')
  }

  public using (...columns: string[]): Builder {
    let expr = last(this.getJoins())

    if (expr instanceof Join) {
      expr.columns.push(...columns)
      return this
    }

    throw new TypeError('Trying to add `using` to an undefined join expression')
  }
  
  public where (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getConditions().push(Criteria.from(expr, args))
    return this
  }
  
  public orWhere (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getConditions().push(Criteria.from(expr, args).or())
    return this
  }
  
  public whereNot (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getConditions().push(Criteria.from(expr, args).not())
    return this
  }
  
  public orWhereNot (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getConditions().push(Criteria.from(expr, args).or().not())
    return this
  }

  public groupBy (...fields: any[]): Builder {
    this.convertCompoundToSelect()

    fields.forEach((value) => {
      this.getGroups().push(Literal.from(value))
    })

    return this
  }

  public having (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getHavings().push(Criteria.from(expr, args))
    return this
  }

  public orHaving (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getHavings().push(Criteria.from(expr, args).or())
    return this
  }

  public havingNot (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getHavings().push(Criteria.from(expr, args).not())
    return this
  }

  public orHavingNot (expr, ...args): Builder {
    this.convertCompoundToSelect()

    this.getHavings().push(Criteria.from(expr, args).or().not())
    return this
  }

  public orderBy (...fields: any[]): Builder {
    fields.forEach((value) => {
      this.getOrders().push(Literal.from(value))
    })

    return this
  }

  public limit (value: number | IExpression): Builder {
    return this.setLimit(value)
  }

  public offset (value: number | IExpression): Builder {
    return this.setOffset(value)
  }

  public delete (): Builder {
    this.statement.type = 'delete'
    return this
  }

  public insert (...data: {}[]): Builder {
    this.statement.type = 'insert'
    
    if (isEmpty(data)) return this

    let values = <IValues>Values.from(data)

    this.statement.columns = values.columns
    this.statement.values = values
    return this
  }

  public defaultValues (): Builder {
    return this.resetValues()
  }

  public into (table: string | IExpression, ...columns: string[]): Builder {
    if (this.statement.isSelect() || this.statement.isCompound()) {
      this.statement = new Statement({
        values: this.statement,
        type: 'insert'
      })
    }

    this.statement.source = Identifier.from(table)
    this.statement.columns = columns
    return this
  }

  public update (values: { [key: string]: any }): Builder {
    this.statement.values = values
    this.statement.type = 'update'
    return this
  }

  public returning (...fields: any[]): Builder {
    if (this.statement.isSelect()) return this

    fields.forEach((value) => {
      this.getResults().push(Literal.from(value))
    })

    return this
  }

  public union (query: IExpression | Builder, filter = 'distinct'): Builder {
    if (query instanceof Builder) query = query.toExpression()

    if (this.statement.isSelect()) {
      this.statement = new Statement({
        source: this.statement,
        type: 'compound'
      })
    }

    this.getUnions().push(Union.from(query, filter))
    return this
  }

  public unionAll (query: IExpression): Builder {
    return this.union(query, 'all')
  }

  protected convertCompoundToSelect (): void {
    if (this.statement.isCompound()) {
      this.statement = new Statement({
        source: this.statement,
        type: 'select'
      })
    }
  }
}

export function factory (table?): Builder {
  if (isString(table))
    table = { source: Identifier.from(table) }

  return new Builder(table)
}

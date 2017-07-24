
import Expression from './expression'
import Alias from './expression/alias'
import Statement from './expression/statement'
import {
  assign, extend, each, compact, isBoolean, isString, isArray, isEmpty, isUndefined
} from 'lodash'

export default abstract class Compiler implements ICompiler {
  protected options: {
    autoQuoteIdentifiers: false
  }
  
  protected get placeholder (): string {
    return '?'
  }
  
  protected bindings = []
  
  public constructor (options = {}) {
    assign(this.options, options)
  }
  
  public abstract build (expr: IStatement): IResult
  
  public compileInsertStatement(q: { table: IExpression; cte: IExpression[]; results: string[]; values: IExpression; columns: string[] }): string {
    let components = [
      this.compileWithClause(q),
      this.compileInsertClause(q),
      this.compileInsertValues(q)
    ]
    
    return compact(components).join(' ')
  }
  
  public compileUpdateStatement(q: { table: IExpression; cte: IExpression[]; conditions: IExpression[]; results: string[]; values: {}[]; }): string {
    let components = [
      this.compileWithClause(q),
      this.compileUpdateClause(q),
      this.compileSetClause(q),
      this.compileWhereClause(q)
    ]

    return compact(components).join(' ')
  }
  
  public compileDeleteStatement(s: { table: IExpression; cte: IExpression[]; conditions: IExpression[]; results: string[]; }): string {
    let components = [
      this.compileWithClause(s),
      this.compileDeleteClause(s),
      this.compileWhereClause(s)
    ]
    
    return compact(components).join(' ')
  }
  
  public compileCompoundStatement({ source, unions }: { source: ISelect; unions: IExpression[]; orders: IExpression[]; limit: any; offset: any; }): string {
    let components = [
      `${this.escape(source)} ${this.join(unions, ' ')}`,
      this.compileOrderByClause(arguments[0]),
      this.compileLimitClause(arguments[0])
    ]
    
    return compact(components).join(' ')
  }
  
  public compileJoin({ table, type, conditions, columns }: { table: IExpression; type: string; conditions: IExpression[]; columns: string[]; }): string {
    let out = `${type} join ${this.escape(table)}`
    
    if (!isEmpty(conditions)) {
      out += ` on (${this.compileConditions(conditions)})`
    }
    
    if (!isEmpty(columns) && isEmpty(conditions)) {
      out += ` using (${this.columnize(columns)})`
    }
    
    return out
  }
  
  public compileTable({ name, joins }: { name: IExpression; joins: IExpression[]; }): string {
    if (isEmpty(joins)) return this.escape(name)
    
    return `(${this.escape(name)} ${this.join(joins, ' ')})`
  }
  
  public compileUnion({ query, filter }: { query: IExpression; filter: string; }): string {
    return 'union ' + (filter === 'all' ? 'all ' : '') + this.escape(query)
  }
  
  public compileOrder({ value, direction, nulls }: { value: IExpression; direction: string; nulls?: string }): string {
    let out = `${this.escape(value)} ${direction === 'desc' ? 'desc' : 'asc'}`
    
    if (!nulls) return out
    
    return `${this.escape(value)} is ${nulls === 'last' ? 'not ' : ''}null, ${out}`
  }
  
  public compileValues({ values }: { values: any[][] }): string {
    return 'values ' + values.map((value) => `(${this.parameterize(value, true)})`).join(', ')
  }
  
  public compileCriteria({ value, prefix, negate }: { value: IExpression; prefix: string; negate: boolean; }): string {
    return `${prefix} ${negate ? `not (${this.escape(value)})` : this.escape(value)}`
  }
  
  public compileFunction({ name, args }: { name: string; args: any[] }): string {
    return `${name}(${this.parameterize(args)})`
  }
  
  public compileIdentifier ({ name }: { name: string }): string {
    if (this.options.autoQuoteIdentifiers === false) return name
    
    return name.split('.').map((part) => this.quote(part)).join('.')
  }
  
  public compileAlias({ value, name, columns }: { value: any; name: string; columns: string[] }): string {
    let alias = this.compileIdentifier({ name })
    
    if (!isEmpty(columns)) {
      alias += ` (${this.columnize(columns)})`
    }
    
    return `${this.escape(value)} as ${alias}`
  }
  
  public compileLiteral({ value, args }: { value: string; args: any[] }): string {
    let i = 0
    
    return value.replace(/\?(\d*)/g, (_, p) => {
      return this.parameterize(args[p ? p - 1 : i++])
    })
  }
  
  protected compileInsertClause ({ table, columns }: { table: IExpression; columns: string[] }): string {
    if (isEmpty(columns)) return 'insert into ' + this.escape(table)
    
    return `insert into ${this.escape(table)} (${this.columnize(columns)})`
  }
  
  protected compileInsertValues ({ values }: { values: IExpression }): string {
    return values ? this.escape(values) : 'default values'

    // return 'values ' + values.map((value) => {
    //   return `(${columns.map((name) => this.parameter(value[name], true)).join(', ')})`
    // }).join(', ')
  }
  
  protected compileUpdateClause ({ table }: { table: IExpression }): string {
    return 'update ' + this.escape(table)
  }
  
  protected compileSetClause ({ values }: { values: {}[] }): string {
    let expr = []
    
    each(values.reduce(extend, {}), (value, name: string) => {
      expr.push(`${this.compileIdentifier({ name })} = ${this.parameter(value, true)}`)
    })

    return 'set ' + expr.join(', ')
  }
  
  protected compileLimitClause ({ limit, offset }: { limit: any, offset: any }): string {
    let out = ''

    if (limit) out += 'limit ' + this.parameter(limit)

    if (offset) out += ' offset ' + this.parameter(offset)

    return out.trim()
  }
  
  protected compileOrderByClause ({ orders }: { orders: IExpression[] }): string {
    return isEmpty(orders) ? '' : 'order by ' + this.join(orders)
  }
  
  protected compileDeleteClause ({ table }: { table: IExpression }): string {
    return 'delete from ' + this.escape(table)
  }
  
  protected compileWhereClause ({ conditions }: { conditions: IExpression[] }): string {
    if (isEmpty(conditions)) return ''
    
    return 'where ' + this.compileConditions(conditions)
  }
  
  protected compileWithClause ({ cte }: { cte: IExpression[] }): string {
    if (isEmpty(cte)) return ''
    
    return 'with ' + cte.map((value) => {
      if (value instanceof Alias) {
        return this.compileCommonTable(value)
      }
      
      return this.escape(value)
    }).join(', ')
  }
  
  protected compileCommonTable ({ value, name, columns }: { value: IExpression; name: string; columns: string[] }): string {
    if (isEmpty(columns)) {
      return `${this.compileIdentifier({ name })} as ${this.escape(value)}`
    }
    
    return `${this.compileIdentifier({ name })} (${this.columnize(columns)}) as ${this.escape(value)}`
  }
  
  protected compileConditions (value): string {
    return this.join(value, ' ').substr(3).trim()
  }
  
  protected join (parts: any[], glue = ', '): string {
    return parts.map((value) => this.escape(value)).join(glue)
  }
  
  protected quote (value: string): string {
    return (value === '*') ? value : `"${value.replace(/"/g, '""')}"`
  }
  
  protected columnize (columns: string[]): string {
    return columns.map((name) => this.compileIdentifier({ name })).join(', ')
  }
  
  protected parameterize (value: any, setDefault = false): string {
    if (!isArray(value)) return this.parameter(value, setDefault)
    
    return value.map((item) => this.parameter(item, setDefault)).join(', ')
  }
  
  protected parameter (value: any, setDefault = false): string {
    // escape expressions
    if (value instanceof Expression) return this.escape(value)
    
    // replace undefined values with `default` placeholder
    if (setDefault === true && isUndefined(value)) return 'default'
    
    if (isUndefined(value)) {
      throw new TypeError('Invalid parameter value')
    }
    
    // add binding parameter
    this.bindings.push(value)
    
    return this.placeholder
  }
  
  protected escape (value: any): string {
    if (value === '*') return value
    
    // wrap statements
    if (value instanceof Statement) return `(${value.compile(this)})`
    
    // compile expressions
    if (value instanceof Expression) return value.compile(this)
    
    if (isBoolean(value)) value = Number(value)
    
    return String(value).replace(/'/g, "''")
  }
}

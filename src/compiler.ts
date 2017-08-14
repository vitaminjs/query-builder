
import Query from './query'
import Expression from './expression'
import Alias from './expression/alias'
import Statement from './expression/statement'
import {
  assign, extend, each, compact, isFunction,
  isBoolean, isString, isArray, isEmpty, isUndefined
} from 'lodash'

export default abstract class Compiler implements ICompiler {
  protected options = <ICompilerOptions>{
    autoQuoteIdentifiers: false
  }
  
  protected get placeholder (): string {
    return '?'
  }
  
  protected bindings = []
  
  public constructor (options = {} as ICompilerOptions) {
    assign(this.options, options)
  }
  
  public toQuery (expr: IStatement): IQuery {
    return new Query(expr.compile(this), this.bindings)
  }
  
  public compileSelectStatement({ source, results, cte }: IStatement): string {
    if (!source && isEmpty(cte) && isEmpty(results)) return ''
    
    var components = [
      this.compileWithClause(arguments[0]),
      this.compileSelectClause(arguments[0]),
      this.compileFromClause(arguments[0]),
      this.compileWhereClause(arguments[0]),
      this.compileGroupByClause(arguments[0]),
      this.compileOrderByClause(arguments[0]),
      this.compileLimitClause(arguments[0])
    ]

    return compact(components).join(' ')
  }
  
  public compileInsertStatement({ source }: IStatement): string {
    if (!source) return ''
    
    let components = [
      this.compileWithClause(arguments[0]),
      this.compileInsertClause(arguments[0]),
      this.compileInsertValues(arguments[0])
    ]
    
    return compact(components).join(' ')
  }
  
  public compileUpdateStatement({ source, values }: IStatement): string {
    if (!source || isEmpty(values)) return ''
    
    let components = [
      this.compileWithClause(arguments[0]),
      this.compileUpdateClause(arguments[0]),
      this.compileSetClause(arguments[0]),
      this.compileWhereClause(arguments[0])
    ]

    return compact(components).join(' ')
  }
  
  public compileDeleteStatement({ source }: IStatement): string {
    if (!source) return ''
    
    let components = [
      this.compileWithClause(arguments[0]),
      this.compileDeleteClause(arguments[0]),
      this.compileWhereClause(arguments[0])
    ]
    
    return compact(components).join(' ')
  }
  
  public compileCompoundStatement({ source, unions }: IStatement): string {
    if (!source && isEmpty(unions)) return ''
    
    let components = [
      this.escape(source, false),
      this.join(unions, ' '),
      this.compileOrderByClause(arguments[0]),
      this.compileLimitClause(arguments[0])
    ]
    
    return compact(components).join(' ')
  }
  
  public compileJoin({ table, type, conditions, columns }: IJoin): string {
    let out = `${type} join ${this.escape(table)}`
    
    if (!isEmpty(conditions)) {
      out += ` on (${this.compileConditions(conditions)})`
    }
    
    if (!isEmpty(columns) && isEmpty(conditions)) {
      out += ` using (${this.columnize(columns)})`
    }
    
    return out
  }
  
  public compileTable({ name, joins }: ITable): string {
    if (isEmpty(joins)) return this.escape(name)
    
    return `(${this.escape(name)} ${this.join(joins, ' ')})`
  }
  
  public compileUnion({ query, filter }: IUnion): string {
    return 'union ' + (filter === 'all' ? 'all ' : '') + this.escape(query, false)
  }
  
  public compileOrder({ value, direction, nulls }: IOrder): string {
    let out = `${this.escape(value)} ${direction === 'desc' ? 'desc' : 'asc'}`
    
    if (!nulls) return out
    
    return `${this.escape(value)} is ${nulls === 'last' ? 'not ' : ''}null, ${out}`
  }
  
  public compileValues({ values }: IValues): string {
    return 'values ' + values.map((value) => `(${this.parameterize(value, true)})`).join(', ')
  }
  
  public compileCriteria({ value, prefix, negate }: ICriteria): string {
    return `${prefix} ${negate ? `not (${this.escape(value)})` : this.escape(value)}`
  }
  
  public compileFunction({ name, args }: IFunction): string {
    return `${name}(${this.parameterize(args)})`
  }
  
  public compileIdentifier ({ name }: IIdentifier): string {
    if (!this.options.autoQuoteIdentifiers) return name
    
    return name.split('.').map((part) => this.quote(part)).join('.')
  }
  
  public compileAlias({ value, name, columns }: IAlias): string {
    let alias = this.compileIdentifier(<IIdentifier>{ name })
    
    if (!isEmpty(columns)) {
      alias += ` (${this.columnize(columns)})`
    }
    
    return `${this.escape(value)} as ${alias}`
  }
  
  public compileLiteral({ value, args }: ILiteral): string {
    let i = 0
    
    return value.replace(/\?(\d*)/g, (_, p) => {
      return this.parameterize(args[p ? p - 1 : i++])
    })
  }
  
  protected compileSelectClause ({ distinct, results }: IStatement): string {
    return `select ${distinct ? 'distinct ' : ''}${isEmpty(results) ? '*' : this.join(results)}`
  }
  
  protected compileFromClause ({ source, joins }: IStatement): string {
    if (!source) return ''
    
    if (isEmpty(joins)) {
      return `from ${this.escape(source)}`
    }
    
    return `from ${this.escape(source)} ${this.join(joins, ' ')}`
  }
  
  protected compileGroupByClause ({ groups, havings }: IStatement): string {
    if (isEmpty(groups)) return ''
    
    if (isEmpty(havings)) {
      return `group by ${this.join(groups)}`
    }
    
    return `group by ${this.join(groups)} having ${this.compileConditions(havings)}`
  }
  
  protected compileInsertClause ({ source, columns }: IStatement): string {
    if (isEmpty(columns)) return 'insert into ' + this.escape(source)
    
    return `insert into ${this.escape(source)} (${this.columnize(columns)})`
  }
  
  protected compileInsertValues ({ values }: IStatement): string {
    return isEmpty(values) ? 'default values' : this.escape(values, false)
  }
  
  protected compileUpdateClause ({ source }: IStatement): string {
    return 'update ' + this.escape(source)
  }
  
  protected compileSetClause ({ values }: IStatement): string {
    let expr = []
    
    each(values, (value, name: string) => {
      expr.push(`${this.compileIdentifier(<IIdentifier>{ name })} = ${this.parameter(value, true)}`)
    })

    return 'set ' + expr.join(', ')
  }
  
  protected compileLimitClause ({ limit, offset }: ILimitable): string {
    let out = ''

    if (limit) out += 'limit ' + this.parameter(limit)

    if (offset) out += ' offset ' + this.parameter(offset)

    return out.trim()
  }
  
  protected compileOrderByClause ({ orders }: IOrderable): string {
    return isEmpty(orders) ? '' : 'order by ' + this.join(orders)
  }
  
  protected compileDeleteClause ({ source }: IStatement): string {
    return 'delete from ' + this.escape(source)
  }
  
  protected compileWhereClause ({ conditions }: IConditional): string {
    if (isEmpty(conditions)) return ''
    
    return 'where ' + this.compileConditions(conditions)
  }
  
  protected compileWithClause ({ cte }: IStatement): string {
    if (isEmpty(cte)) return ''
    
    return 'with ' + cte.map((value) => {
      if (value instanceof Alias) {
        return this.compileCommonTable(value)
      }
      
      return this.escape(value)
    }).join(', ')
  }
  
  protected compileCommonTable ({ value, name, columns }: ICommonTable): string {
    let alias = this.compileIdentifier(<IIdentifier>{ name })
    
    if (isEmpty(columns)) return `${alias} as ${this.escape(value)}`
    
    return `${alias} (${this.columnize(columns)}) as ${this.escape(value)}`
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
    return columns.map((name) => this.compileIdentifier(<IIdentifier>{ name })).join(', ')
  }
  
  protected parameterize (value, setDefault = false): string {
    if (!isArray(value)) return this.parameter(value, setDefault)
    
    return value.map((item) => this.parameter(item, setDefault)).join(', ')
  }
  
  protected parameter (value, setDefault = false): string {
    // escape query builders
    if (value && isFunction(value.toExpression))
      value = (<IBuilder>value).toExpression()
    
    // escape expressions
    if (value instanceof Expression) return this.escape(value)
    
    // replace undefined values with `default` placeholder
    if (setDefault && isUndefined(value)) return 'default'
    
    if (isUndefined(value)) {
      throw new TypeError('Invalid parameter value')
    }
    
    // add binding parameter
    this.bindings.push(value)
    
    return this.placeholder
  }
  
  protected escape (value, wrapStatement = true): string {
    if (value === '*') return value
    
    // escape query builders
    if (value && isFunction(value.toExpression))
      value = (<IBuilder>value).toExpression()
    
    // wrap statements
    if (wrapStatement && value instanceof Statement)
      return `(${value.compile(this)})`
    
    // compile expressions
    if (value instanceof Expression)return value.compile(this)
    
    if (isBoolean(value)) return Number(value).toString()
    
    return `'${String(value).replace(/'/g, "''")}'`
  }
}

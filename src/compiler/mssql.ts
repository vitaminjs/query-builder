
import Compiler from '../compiler'
import { isEmpty, first } from 'lodash'

export default class extends Compiler {
  public compileFunction ({ name, args = [] }) {
    switch (name) {
      case 'trim':
        return `rtrim(ltrim(${this.parameter(first(args))}))`

      case 'substr':
        let [ expr, start, length ] = args
        
        return this.compileSubstringFunction(expr, start, length)

      case 'current_date':
        return 'cast(getdate() as date)'

      case 'current_time':
        return 'cast(getdate() as time(0))'

      case 'now':
        return 'cast(getdate() as datetime2(0))'

      case 'utc':
        return `cast(getutcdate() as datetime2(0))`

      case 'date':
        return `cast(${this.parameter(first(args))} as date)`

      case 'time':
        return `cast(${this.parameter(first(args))} as time(0))`

      case 'hour':
      case 'minute':
      case 'second':
        return this.compileDatepartFunction(name, first(args))

      case 'length':
        return super.compileFunction(<IFunction>{ name: 'len', args })

      case 'repeat':
        return super.compileFunction(<IFunction>{ name: 'replicate', args })
      
      case 'strpos':
        return super.compileFunction(<IFunction>{ name: 'charindex', args: args.slice().reverse() })

      default:
        return super.compileFunction(arguments[0])
    }
  }
  
  protected compileSubstringFunction (expr, start: number, length?: number): string {
    if (length == null) {
      let len = super.compileFunction(<IFunction>{ name: 'len', args: [expr] })

      return `substring(${this.parameter(expr)}, ${this.parameter(start)}, ${len})`
    }
    
    return super.compileFunction(<IFunction>{ name: 'substring', args: [expr, start, length] })
  }
  
  protected compileDatepartFunction (part: string, value): string {
    return `datepart(${part}, ${this.parameter(value)})`
  }
  
  protected compileSelectClause ({ isDistinct, fields, limit, offset }: ISelect): string {
    if (limit && !offset) {
      let parts = [
        'select' + (isDistinct ? ' distinct' : ''),
        `top (${this.parameter(limit)})`,
        this.join(isEmpty(fields) ? ['*'] : fields)
      ]

      return parts.join(' ')
    }

    return super.compileSelectClause(arguments[0])
  }
  
  protected compileOrderByClause ({ offset, limit, unions }: ICompound): string {
    let hasUnions = !isEmpty(unions)
    let hasLimitAndUnions = limit && hasUnions
    let out = super.compileOrderByClause(arguments[0])
    
    if (!out && (offset || hasLimitAndUnions)) {
      // a dummy order to use with offset
      out = 'order by (select 0)'
    }
    
    if (offset) {
      out += ` offset ${this.parameter(offset)} rows`
    } else if (hasLimitAndUnions) {
      // we add a fake offset to construct the query
      out += ` offset 0 rows`
      offset = true
    }

    if (limit && (offset || hasUnions)) {
      out += ` fetch next ${this.parameter(limit)} rows only`
    }

    return out
  }
  
  protected compileLimitClause (query: ILimitable): string {
    return ''
  }
  
  protected compileInsertClause ({ results }: IInsert): string {
    return this.appendOutputClause(super.compileInsertClause(arguments[0]), results)
  }
  
  protected compileSetClause ({ results }: IUpdate): string {
    return this.appendOutputClause(super.compileSetClause(arguments[0]), results)
  }
  
  protected compileDeleteClause ({ results }: IDelete) {
    return this.appendOutputClause(super.compileDeleteClause(arguments[0]), results, 'deleted')
  }
  
  protected appendOutputClause (sql: string, columns: string[], prefix = 'inserted'): string {
    if (isEmpty(columns)) return sql

    // add the inserted or deleted prefix for each column
    columns = columns.map((name) => {
      return /^inserted|deleted/i.test(name) ? name : `${prefix}.${name}`
    })

    return `${sql} output ${this.columnize(columns)}`
  }
  
  protected quote (value): string {
    if (/\*|inserted|deleted/i.test(value)) return value

    return `[${value.trim().replace(/\]/g, ']]')}]`
  }
}

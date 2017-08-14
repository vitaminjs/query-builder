
import Compiler from '../compiler'
import { isEmpty, first } from 'lodash'

export default class extends Compiler {
  protected get placeholder () {
    return '$' + this.bindings.length
  }
  
  public compileInsertStatement ({ results }: IStatement): string {
    return this.appendReturningClause(super.compileInsertStatement(arguments[0]), results)
  }
  
  public compileUpdateStatement ({ results }: IStatement): string {
    return this.appendReturningClause(super.compileUpdateStatement(arguments[0]), results)
  }
  
  public compileDeleteStatement ({ results }: IStatement): string {
    return this.appendReturningClause(super.compileDeleteStatement(arguments[0]), results)
  }
  
  public compileFunction ({ name, args }: IFunction): string {
    switch (name) {
      case 'now':
        return 'localtimestamp(0)'

      case 'current_date':
        return 'current_date'

      case 'current_time':
        return `current_time(0)`

      case 'utc':
        return "current_timestamp(0) at time zone 'UTC'"

      case 'space':
        return `repeat(' ', ${this.parameter(first(args))})`

      case 'date':
        return `${this.parameter(first(args))}::date`

      case 'time':
        return `${this.parameter(first(args))}::time(0)`

      case 'day':
      case 'hour':
      case 'year':
      case 'month':
      case 'minute':
      case 'second':
        return this.compileExtractFunction(name, first(args))

      default:
        return super.compileFunction(arguments[0])
    }
  }
  
  public compileOrder ({ value, direction, nulls }: IOrder): string {
    let expr = `${this.escape(value)} ${direction === 'desc' ? 'desc' : 'asc'}`
    
    return nulls ? `${expr} nulls ${nulls === 'last' ? 'last' : 'first'}` : expr
  }
  
  protected appendReturningClause (sql: string, columns: IExpression[]): string {
    return isEmpty(columns) ? sql : `${sql} returning ${this.join(columns)}`
  }
  
  protected compileExtractFunction (part: string, expr): string {
    return `extract(${part} from ${this.parameter(expr)})`
  }
}


import { isEmpty } from 'lodash'
import Compiler from '../compiler'

export default class extends Compiler {
  public compileUnion ({ query, filter }: IUnion): string {
    if (
      !(<IStatement>query).limit && 
      !(<IStatement>query).offset && 
      isEmpty((<IStatement>query).orders)
    ) {
      return super.compileUnion(arguments[0])
    }
    
    // wrap the query with parentheses
    return `union ${filter === 'all' ? 'all ' : ''}${this.escape(query)}`
  }
  
  public compileFunction ({ name, args }: IFunction): string {
    switch (name) {
      case 'utc':
        return super.compileFunction(<IFunction>{ name: 'utc_timestamp', args })

      case 'strpos':
        return super.compileFunction(<IFunction>{ name: 'instr', args })

      default:
        return super.compileFunction(arguments[0])
    }
  }
  
  protected compileWithClause (query): string {
    // TODO print a notice
    return ''
  }
  
  protected quote (value): string {
    return (value === '*') ? value : '`' + String(value).replace(/`/g, '``') + '`'
  }
  
  protected compileFromClause ({ source }: IStatement): string {
    return source ? super.compileFromClause(arguments[0]) : 'from dual'
  }
  
  protected compileLimitClause ({ limit, offset }: ILimitable): string {
    if (offset && !limit) {
      return 'limit 18446744073709551615 offset ' + this.parameter(offset)
    }
    
    return super.compileLimitClause(arguments[0])
  }
  
  protected compileInsertClause ({ source, values }: IStatement): string {
    // compile default columns
    if (isEmpty(values)) return `insert into ${this.escape(source)} ()`
    
    return super.compileInsertClause(arguments[0])
  }
  
  protected compileInsertValues ({ values }: IStatement): string {
    return isEmpty(values) ? 'values ()' : super.compileInsertValues(arguments[0])
  }
}

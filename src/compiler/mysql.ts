
import { isEmpty } from 'lodash'
import Compiler from '../compiler'

export default class extends Compiler {
  public compileUnion ({ query, filter }: IUnion): string {
    if (
      !(<ISelect>query).limit && 
      !(<ISelect>query).offset && 
      isEmpty((<ISelect>query).orders)
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
  
  protected compileWithClause (query: IStatement): string {
    // TODO print a notice
    return ''
  }
  
  protected quote (value): string {
    return (value === '*') ? value : '`' + String(value).replace(/`/g, '``') + '`'
  }
  
  protected compileFromClause ({ table }: ISelect): string {
    return table ? super.compileFromClause(arguments[0]) : 'from dual'
  }
  
  protected compileLimitClause ({ limit, offset }: ILimitable): string {
    if (offset && !limit) {
      return 'limit 18446744073709551615 offset ' + this.parameter(offset)
    }
    
    return super.compileLimitClause(arguments[0])
  }
  
  protected compileInsertClause ({ table, values }: IInsert): string {
    // compile default columns
    if (!values) return `insert into ${this.escape(table)} ()`
    
    return super.compileInsertClause(arguments[0])
  }
  
  protected compileInsertValues ({ values }: IInsert): string {
    return values ? super.compileInsertValues(arguments[0]) : 'values ()'
  }
}

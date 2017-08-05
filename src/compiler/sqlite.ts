
import Compiler from '../compiler'
import { first, isUndefined } from 'lodash'

export default class extends Compiler {
  public compileFunction ({ name, args }: IFunction) {
    switch (name) {
      case 'concat':
        return this.compileConcatFunction(args)
      
      case 'now':
        return "datetime('now', 'localtime')"
      
      case 'utc':
        return "datetime('now', 'utc')"
      
      case 'current_date':
        return "date('now', 'localtime')"
      
      case 'current_time':
        return "time('now', 'localtime')"
      
      case 'day':
        return this.compileExtractFunction('%d', first(args))
      
      case 'hour':
        return this.compileExtractFunction('%H', first(args))
      
      case 'year':
        return this.compileExtractFunction('%Y', first(args))
      
      case 'month':
        return this.compileExtractFunction('%m', first(args))
      
      case 'minute':
        return this.compileExtractFunction('%M', first(args))
      
      case 'second':
        return this.compileExtractFunction('%S', first(args))
      
      case 'left':
        return this.compileLeftFunction(args[0], args[1])
      
      case 'right':
        return this.compileRightFunction(args[0], args[1])
      
      case 'repeat':
        return this.compileRepeatFunction(args[0], args[1])
      
      case 'space':
        return this.compileRepeatFunction(' ', first(args))
      
      case 'rand':
        return '(random() / 18446744073709551616 + .5)'
      
      case 'strpos':
        return super.compileFunction(<IFunction>{ name: 'instr', args })
      
      default:
        return super.compileFunction(arguments[0])
    }
  }
  
  protected compileLimitClause ({ limit, offset }: ILimitable): string {
    if (offset && !limit) {
      return 'limit -1 offset ' + this.parameter(offset)
    }
    
    return super.compileLimitClause(arguments[0])
  }
  
  protected parameter (value, setDefault = false): string {
    // sqlite does not support the `default` keyword,
    // so we replace undefined values with `null` instead
    if (setDefault && isUndefined(value)) return 'null'
    
    return super.parameter(value)
  }
  
  protected compileExtractFunction (part: string, expr): string {
    return `cast(strftime('${part}', ${this.parameter(expr)}) as integer)`
  }
  
  protected compileRepeatFunction (expr, count: number): string {
    // we use an numbered placeholder instead the simple "?".
    // will not be appended in case of expressions.
    let p = this.parameter(count) + (isNaN(count) ? '' : this.bindings.length)
    
    // escape spaces to support the missing function `space(n)`
    let s = (expr === ' ') ? this.escape(expr) : this.parameter(expr)
    
    return `replace(substr(quote(zeroblob((? + 1) / 2)), 3, ${p}), '0', ${s})`
  }
  
  protected compileLeftFunction (expr, length: number): string {
    return `substr(${this.parameter(expr)}, 1, ${this.parameter(length)})`
  }
  
  protected compileRightFunction (expr, length: number): string {
    return `substr(${this.parameter(expr)}, -${this.parameter(length)})`
  }
  
  protected compileConcatFunction (args) {
    return args.map(value => this.parameter(value)).join(' || ')
  }
}

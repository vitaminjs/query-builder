
import Alias from './alias'
import Expression from '../expression'

export default class Identifier extends Expression {
  public name: string
  
  public constructor (name: string) {
    super()
    
    this.name = name
  }
  
  public static from (value): IExpression {
    if (value instanceof Expression) return value
    
    let [expr, alias] = String(value).split(' as ')
    
    return alias ? new Identifier(expr).as(alias) : new Identifier(expr)
  }
  
  public as (name: string): Alias {
    return new Alias(this, name)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileIdentifier(this)
  }
  
  public clone (): Identifier {
    return new Identifier(this.name)
  }
}

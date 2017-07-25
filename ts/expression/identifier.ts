
import Alias from './alias'
import Expression from '../expression'

export default class Identifier extends Expression {
  public name: string
  
  public constructor (name: string) {
    super()
    
    this.name = name
  }
  
  public static from (value: IExpression): IExpression
  public static from (value: string): IExpression
  public static from (value) {
    if (value instanceof Expression) return value
    
    let [name, alias] = String(value).split(' as ')
    
    return alias ? new Identifier(name).as(alias) : new Identifier(name)
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

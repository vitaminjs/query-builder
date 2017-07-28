
import Alias from './alias'
import Expression from '../expression'

export default class Function extends Expression implements IFunction {
  public name: string
  
  public args: any[]
  
  public constructor (name: string, args = []) {
    super()
    
    this.name = name
    this.args = args
  }
  
  public as (name: string): Alias {
    return new Alias(this, name)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileFunction(this)
  }
  
  public clone (): Function {
    return new Function(this.name, this.args.slice())
  }
}


import Expression from '../expression'

export default class Alias extends Expression implements IAlias {
  public value: IExpression
  
  public name: string
  
  public columns: string[]
  
  public constructor (value: IExpression, name: string, columns = []) {
    super()
    
    this.name = name
    this.value = value
    this.columns = columns
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileAlias(this)
  }
  
  public clone (): Alias {
    return new Alias(this.value, this.name, this.columns.slice())
  }
}

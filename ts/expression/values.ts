
import Alias from './alias'
import Literal from './literal'
import Expression from '../expression'

export default class Values extends Expression {
  public data: any[]
  
  public constructor (data: any[]) {
    super()
    
    this.data = data
  }
  
  public as (name: string, ...columns): Alias {
    return new Alias(new Literal('(?)', [this]), name, columns)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileValues(this)
  }
  
  public clone (): Values {
    return new Values(this.data.slice())
  }
}

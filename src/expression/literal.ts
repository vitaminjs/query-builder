
import Expression from '../expression'

export default class Literal extends Expression implements ILiteral {
  public value: string
  
  public args: any[]
  
  public constructor (value: string, args = []) {
    super()
    
    this.value = value
    this.args = args
  }
  
  public static from (expr: string, args: any[]): IExpression
  public static from (expr: IExpression): IExpression
  public static from (value, args = []) {
    if (value instanceof Expression) return value
    
    return new Literal(String(value), args)
  }
  
  public clone (): Literal {
    return new Literal(this.value, this.args.slice())
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileLiteral(this)
  }
}

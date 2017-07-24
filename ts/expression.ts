
export default abstract class Expression implements IExpression {
  public abstract compile(compiler: ICompiler): string
  
  public abstract clone(): IExpression
  
  public isEqual (expr: any): boolean {
    return expr === this
  }
}

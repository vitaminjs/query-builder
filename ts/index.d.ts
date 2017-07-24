
interface IClonable {
  clone (): IClonable
}

interface IComparable {
  isEqual (expr: any): boolean
}

interface ICompilable {
  compile (compiler: ICompiler): string
}

interface IExpression extends IComparable, IClonable, ICompilable {}

interface IStatement extends IExpression {}

interface ISelect extends IStatement {}

interface ICompiler {
  compileUpdateStatement (e: { table: IExpression; cte: IExpression[]; results: string[]; values: {}[]; conditions: IExpression[] }): string
  
  compileInsertStatement (e: { table: IExpression; cte: IExpression[]; results: string[]; values: IExpression; columns: string[] }): string
  
  compileDeleteStatement (e: { table: IExpression; cte: IExpression[]; results: string[]; conditions: IExpression[] }): string
  
  compileCompoundStatement (e: { source: ISelect; unions: IExpression[], orders: IExpression[]; limit, offset }): string
  
  compileJoin (e: { table: IExpression; type: string; conditions: IExpression[]; columns: string[] }): string
  
  compileCriteria (e: { value: IExpression; prefix: string; negate: boolean }): string
  
  compileOrder (e: { value: IExpression; direction: string; nulls?: string }): string
  
  compileAlias (e: { value: any; name: string; columns: string[] }): string
  
  compileTable (e: { name: IExpression; joins: IExpression[] }): string
  
  compileUnion (e: { query: IExpression; filter: string }): string
  
  compileLiteral (e: { value: string; args: any[] }): string
  
  compileFunction (e: { name: string; args: any[] }): string
  
  compileIdentifier (e: { name: string }): string
  
  compileValues (e: { values: any[][] }): string

  build (e: IStatement): IResult
}

interface IResult {
  sql: string
  params: Array<any>

  toString(): string
}

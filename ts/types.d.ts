
interface IClonable {
  clone (): IClonable
}

interface IComparable {
  isEqual (expr): boolean
}

interface ICompilable {
  compile (compiler: ICompiler): string
}

interface IExpression extends IComparable, IClonable, ICompilable {}

interface IStatement extends IExpression {}

interface ISelect extends IStatement {
  fields: IExpression[]
  
  conditions: IExpression[]
  
  joins: IExpression[]
  
  groups: IExpression[]
  
  havings: IExpression[]
  
  orders: IExpression[]
  
  isDistinct: boolean
  
  offset: any
  
  limit: any
}

interface ICompiler {
  compileSelectStatement(expr: ISelect): string

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

  build (e: IStatement): IQuery
}

interface ICompilerOptions {
  autoQuoteIdentifiers?: boolean
}

interface IQuery {
  sql: string
  params: any[]
  toString(): string
}

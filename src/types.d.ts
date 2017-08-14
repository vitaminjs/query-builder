
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

interface IConditional {
  conditions: ICriteria[]
}

interface IOrderable {
  orders: IExpression[]
}

interface ILimitable {
  offset: number | IExpression
  limit: number | IExpression
}

interface ILiteral extends IExpression {
  value: string
  args: any[]
}

interface ICriteria extends IExpression {
  value: IExpression
  negate: boolean
  prefix: string
}

interface IJoin extends IExpression, IConditional {
  table: IExpression
  columns: string[]
  type: string
}

interface IOrder extends IExpression {
  value: IExpression
  direction: string
  nulls?: string
}

interface IUnion extends IExpression {
  query: IExpression
  filter: string
}

interface ITable extends IExpression {
  joins: IExpression[]
  name: IExpression
}

interface IValues extends IExpression {
  columns: string[]
  values: any[][]
}

interface IFunction extends IExpression {
  name: string
  args: any[]
}

interface IIdentifier extends IExpression {
  name: string
}

interface IAlias extends IExpression {
  columns: string[]
  name: string
  value: any
}

interface ICommonTable extends IExpression {
  columns: string[]
  name: string
  value: any
}

interface IBuilder extends IClonable {
  toExpression (): IExpression
  toQuery: (dialect: string | ICompiler, options?: ICompilerOptions) => IQuery
}

interface IStatement extends IExpression, IConditional, IOrderable, ILimitable {
  type: "select" | "insert" | "update" | "delete" | "compound"
  values: { [key: string]: any } | IExpression
  results: IExpression[]
  groups: IExpression[]
  havings: ICriteria[]
  joins: IExpression[]
  source: IExpression
  cte: IExpression[]
  distinct: boolean
  columns: string[]
  unions: IUnion[]
  
  isSelect(): boolean
  isInsert(): boolean
  isDelete(): boolean
  isUpdate(): boolean
  isCompound(): boolean
}

interface ICompiler {
  compileCompoundStatement (e: IStatement): string
  compileUpdateStatement (e: IStatement): string
  compileInsertStatement (e: IStatement): string
  compileDeleteStatement (e: IStatement): string
  compileSelectStatement(e: IStatement): string
  compileIdentifier (e: IIdentifier): string
  compileCriteria (e: ICriteria): string
  compileFunction (e: IFunction): string
  compileLiteral (e: ILiteral): string
  compileValues (e: IValues): string
  compileOrder (e: IOrder): string
  compileAlias (e: IAlias): string
  compileTable (e: ITable): string
  compileUnion (e: IUnion): string
  compileJoin (e: IJoin): string
  toQuery (e: IStatement): IQuery
}

interface ICompilerOptions {
  autoQuoteIdentifiers: boolean
}

interface IQuery {
  toString(): string
  params: any[]
  sql: string
}

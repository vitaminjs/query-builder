
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
  offset: any
  limit: any
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
  values: any[][]
}

interface IFunction extends IExpression {
  name: string
  args: any[]
}

interface IIdentifier extends IStatement {
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

interface IStatement extends IExpression {
  table?: IExpression
  cte?: IExpression[]
}

interface ISelect extends IStatement, IConditional, IOrderable, ILimitable {
  havings: IExpression[]
  groups: IExpression[]
  fields: IExpression[]
  joins: IExpression[]
  isDistinct: boolean
}

interface IUpdate extends IStatement, IConditional {
  results: string[]
  values: {}[]
}

interface IInsert extends IStatement {
  values: IExpression
  results: string[]
  columns: string[]
}

interface IDelete extends IStatement, IConditional {
  results: string[]
}

interface ICompound extends IStatement, IOrderable, ILimitable {
  unions: IExpression[]
  source: ISelect
}

interface ICompiler {
  compileCompoundStatement (e: ICompound): string
  compileUpdateStatement (e: IUpdate): string
  compileInsertStatement (e: IInsert): string
  compileDeleteStatement (e: IDelete): string
  compileSelectStatement(e: ISelect): string
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
  build (e: IStatement): IQuery
}

interface ICompilerOptions {
  autoQuoteIdentifiers?: boolean
}

interface IQuery {
  toString(): string
  params: any[]
  sql: string
}

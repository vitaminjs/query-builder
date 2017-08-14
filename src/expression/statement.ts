
import Expression from '../expression'
import { assign, upperFirst } from 'lodash'

export default class Statement extends Expression implements IStatement {
  public unions: IUnion[]
  public distinct:boolean
  public columns: string[]
  public cte: IExpression[]
  public source: IExpression
  public havings: ICriteria[]
  public joins: IExpression[]
  public groups: IExpression[]
  public orders: IExpression[]
  public results: IExpression[]
  public conditions: ICriteria[]
  public limit: number | IExpression
  public offset: number | IExpression
  public values: { [key: string]: any } | IExpression
  public type: "select" | "insert" | "update" | "delete" | "compound"

  public constructor (base?: {}) {
    super()

    this.distinct = false
    this.type = 'select'
    assign(this, base)
  }

  public clone (): Statement {
    return new Statement(this)
  }

  public compile (compiler: ICompiler): string {
    return compiler[`compile${upperFirst(this.type)}Statement`](this)
  }

  public isSelect (): boolean {
    return this.type === 'select'
  }

  public isInsert (): boolean {
    return this.type === 'insert'
  }

  public isUpdate (): boolean {
    return this.type === 'update'
  }

  public isDelete (): boolean {
    return this.type === 'delete'
  }

  public isCompound (): boolean {
    return this.type === 'compound'
  }
}

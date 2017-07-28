
import Alias from './alias'
import Literal from './literal'
import Expression from '../expression'
import { castArray, chain, keys, isEmpty } from 'lodash'

export default class Values extends Expression implements IValues {
  public values: any[][]

  public columns: string[]
  
  public constructor (values: any[][]) {
    super()
    
    this.values = values
  }

  public static from (values: ISelect): IExpression
  public static from (values: {}[]): IExpression
  public static from (values: {}): IExpression
  public static from (values) {
    if (values instanceof Expression) return values

    values = castArray(values) as {}[]

    let columns = <string[]>chain(values).map(keys).flatten().uniq().value()
    
    return new Values(values.map((obj) => columns.map((key) => obj[key]))).setColumns(columns)
  }
  
  public as (name: string, ...columns: string[]): Alias {
    if (isEmpty(columns)) columns = this.columns.slice()
    
    return new Alias(new Literal('(?)', [this]), name, columns)
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileValues(this)
  }
  
  public clone (): Values {
    return new Values(this.values.slice()).setColumns(this.columns.slice())
  }

  public hasColumns (): boolean {
    return this.columns.length > 0
  }

  public setColumns(value): Values {
    this.columns = value
    return this
  }
}


import { isBoolean } from 'lodash'

export default class Query implements IQuery {
  public constructor (public sql: string, public params: any[]) {}
  
  public toString(): string {
    let i = 0
    
    return this.sql.replace(/\?|\$(\d*)/g, (_, p) => {
      return this.escape(this.params[p ? p - 1 : i++])
    })
  }
  
  protected escape (value): string {
    if (isBoolean(value)) return String(Number(value))
    
    return String(value).replace(/'/g, "''")
  }
}

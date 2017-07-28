
import Expression from '../expression'

export default class Order extends Expression implements IOrder {
  public value: IExpression
  
  public direction: string
  
  public nulls: string
  
  public constructor (value: IExpression, direction = 'asc', nulls?) {
    super()
    
    this.value = value
    this.nulls = nulls
    this.direction = direction
  }
  
  public asc (): Order {
    this.direction = 'asc'
    return this
  }
  
  public desc (): Order {
    this.direction = 'desc'
    return this
  }
  
  public nullsFirst (): Order {
    this.nulls = 'first'
    return this
  }
  
  public nullsLast (): Order {
    this.nulls = 'last'
    return this
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileOrder(this)
  }
  
  public clone (): Order {
    return new Order(this.value, this.direction, this.nulls)
  }
}

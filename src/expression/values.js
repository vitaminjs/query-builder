
import { isArray, isEmpty } from 'lodash'
import Expression from './base'

/**
 * @class ValuesExpression
 */
export default class Values extends Expression {

  /**
   * 
   * @param {Array} values
   * @constructor
   */
  constructor(values) {
    super()

    this.columns = []
    this.values = values
  }

  /**
   * 
   * @param {String} name
   * @param {Array} columns
   */
  as(name, ...columns) {
    this.columns = columns

    return super.as(name)
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    let expr = `values ${compiler.parameterize(this.values)}`

    if (! this.alias ) return expr

    let name = compiler.quote(this.alias)
    
    // compile the table name columns
    if (! isEmpty(this.columns) ) {
      let columns = this.columns.map(value => compiler.quote(value))

      name += ` (${columns.join(', ')})`
    }

    return `(${expr}) as ${name}`
  }

  /**
   * 
   */
  compileValues() {
    var columns = query.getColumns().map(value => String(value))

    return 'values ' + query.getValues().map(value => {

      return `(${columns.map(key => this.parameter(value[key], true)).join(', ')})`

    }).join(', ')
  }

}
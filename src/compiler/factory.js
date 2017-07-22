
/**
 * Create a compiler for the given dialect
 *
 * @param {String} dialect
 * @param {Object} options
 * @returns {Compiler}
 * @throws {TypeError}
 */
export default (dialect, options = {}) => {
  let Compiler = null

  switch (dialect.toLowerCase()) {
    case 'mysql':
      Compiler = require('./mysql').default
      break

    case 'mssql':
      Compiler = require('./mssql').default
      break

    case 'sqlite':
    case 'sqlite3':
      Compiler = require('./sqlite').default
      break

    case 'pg':
    case 'postgre':
    case 'postgresql':
      Compiler = require('./postgre').default
      break
  }

  if (Compiler) return new Compiler(options)

  throw new TypeError('Unknown compiler dialect')
}

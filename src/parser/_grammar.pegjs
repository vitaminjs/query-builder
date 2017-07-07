
{
  console.log(this) // debug

  import { raw, id, alias, cast } from '../helper'

  // a shallow copy of the values array
  let values = options.values || []

  function concat (...parts) {
    return parts.reduce((out, part) => out + (part || ''), '')
  }

  function param(value) {
    return '?' + values.push(value)
  }
}

/**
 * Expressions
 */

function_call "Function call"
  = id_function _ sym_popen d:( DISTINCT )? _ a:( expression_list ) _ sym_pclose

literal_value
  = literal_null
  / literal_number
  / literal_date
  / literal_string

literal_null = n:( NULL ) _ { return text() }

literal_date "Date literal"
  = d:( CURRENT_DATE / CURRENT_TIMESTAMP / CURRENT_TIME ) _
  { return text() }

/**
 * @note
 *   1) [ENFORCED] SQL uses single quotes for string literals.
 *   2) [NOT IMPLEMENTED] Value is an identier or a string literal based on context.
 *   3) [IMPLEMENTED] SQLite allows a negative default value on an added text column.
 */
literal_string "String literal"
  = n:( number_sign )? s:( sym_sglquote s:( "''" / [^\'] )* sym_sglquote ) _
  { return text() }

literal_number "Number literal"
  = s:( number_sign )? n:( literal_number_hex / literal_number_decimal ) _
  { return text() }

literal_number_hex = f:( "0x"i ) b:( hex_digit )+ { return text() }

literal_number_decimal = d:( number_decimal_node ) e:( number_decimal_exponent )? { return text() }

number_decimal_node "Decimal literal"
  = number_decimal_full
  / number_decimal_fraction

number_decimal_fraction = s:( sym_dot ) d:( digit )* { return text() }

number_decimal_full = d:( digit )+ f:( number_decimal_fraction )? { return text() }

number_decimal_exponent = e:( "E"i ) s:( [\+\-] )? d:( digit )+ { return text() }

bind_parameter "Bind Parameter" = sym_quest n:( [1-9] digit* )?

expression
  = f:( expression ) rest:( _ operator_logic _ expression )*
  { return text() }

expression_root

expression_recur
  = expression_wrapped
  / expression_exists
  / expression_cast
  / expression_case
  / expression_raise
  / expression_root
  / bind_parameter
  / function_call
  / literal_value
  / id_column

expression_list = l:( ( sym_comma? e:( expression ) _ ) )* { return text() }

expression_case "CASE Expression"
  = CASE _ e:( expression_case_descr )? _ w:( expression_case_when )+ _ s:( expression_case_else )? _ END
  { 
    let expr = case(e)

    w.forEach((value) => expr.when(...value))

    if ( s ) expr.else(s)

    return expr
  }

expression_case_descr = !WHEN e:( expression ) { return e }

expression_case_when "WHEN Clause"
  = WHEN _ w:( expression ) _ THEN _ t:( expression ) _
  { return [w, t] }

expression_case_else "ELSE Clause" = ELSE _ e:( expression ) _ { return e }

expression_cast "CAST Expression"
  = CAST _ sym_popen e:( expression ) AS _ t:( name _ ( sym_popen _ digit+ _ sym_pclose )? ) _ sym_pclose

expression_exists "EXISTS Expression" = NOT? _ EXISTS _ expression_wrapped

expression_wrapped = sym_popen _ ( bind_parameter / expression ) _ sym_pclose

/**
 * Select results
 */

select_result = select_result_star / select_result_aliased

select_result_star = star_qualified { return param(id(text())) }

select_result_aliased = e:( expression ) _ a:( alias )?

select_result_list
  = l:( ( sym_comma? r:( select_result ) _ ) { return r } )+
  { return raw(r.join(', '), values) }

/**
 * Symbols
 */

sym_plus "Plus" = s:( "+" ) _ { return s }

sym_dot "Period" = s:( "." ) _ { return s }

sym_minus "Minus" = s:( "-" ) _ { return s }

sym_comma "Comma" = s: ( "," ) _ { return s }

sym_star "Asterisk" = s:( "*" ) _ { return s }

sym_quest "Question Mark" = s:( "?" ) _ { return s; }

sym_sglquote "Single Quote" = s:( "'" ) _ { return s; }

sym_dblquote "Double Quote" = s:( '"' ) _ { return s; }

sym_popen "Open Parenthesis" = s:( "(" ) _ { return s }

sym_pclose "Close Parenthesis" = s:( ")" ) _ { return s }


/**
 * Keywords
 */

AS = "AS"i !char

OR = "OR"i !char

AND = "AND"i !char

END = "END"i !char

CASE = "CASE"i !char

WHEN = "WHEN"i !char

ELSE = "ELSE"i !char

NULL = "NULL"i !char

CAST = "CAST"i !char

EXISTS = "EXISTS"i !char

DISTINCT = "DISTINCT"i !char

CURRENT_DATE = "CURRENT_DATE"i !char

CURRENT_TIME = "CURRENT_TIME"i !char

CURRENT_TIMESTAMP = "CURRENT_TIMESTAMP"i !char


/**
 * Common rules
 */

digit = [0-9]

char = [a-z0-9_$]i

hex_digit = [0-9a-f]i

name = !digit char+

name_qualified = n:( name ) s:( sym_dot )

id_table "Table identifier" = q:( name_qualified )? n:( name )

id_table_qualified = n:( id_table ) s:( sym_dot )

star_qualified =  = q:( id_table )? sym_star

id_column "Column identifier" = q:( id_table_qualified )? n:( name ) { 
  return param(id(text()))
}

id_function "Function identifier" = q:( id_table_qualified )? n:( name )

alias = AS? _ n:( name ) _ { return 'as ' + param(id(n)) }

number_sign = sym_plus / sym_minus

operator_logic "Logical operators" = AND / OR

_ "Whitespace" = [ \t\r\n]*

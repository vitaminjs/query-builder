
{
  console.log(this) // debug

  import { raw, id } from '../helper'

  // a shallow copy of the values array
  let values = options.values || []

  function param(value) {
    return '?' + values.push(value)
  }

  function concat (...parts) {
    return parts.reduce((out, part) => out + (part || ''), '')
  }
}

/* START: Unary and Binary Expression */

expression_wrapped = sym_popen _ expression _ sym_pclose

expression_exists "EXISTS Expression" = expression_is_not? EXISTS _ expression

expression_cast "CAST Expression"
  = CAST _ sym_popen expression _ AS _ datatype _ sym_pclose

expression_case "CASE Expression"
  = CASE ( _ !WHEN expression )? expression_case_when ( _ ELSE _ expression )? _ END
expression_case_when "WHEN Clause"
  = ( _ WHEN _ expression _ THEN _ expression )+
  { return text() }

bind_parameter "Bind Parameter" = sym_quest n:( [1-9] digit* )?

function_call "Function call"
  = id_function _ sym_popen DISTINCT? _ expression_list _ sym_pclose

literal_value
  = literal_null
  / literal_number
  / literal_date
  / literal_string

literal_null = NULL _

literal_number "Number literal"
  = number_sign? ( literal_number_hex / literal_number_decimal ) _
literal_number_hex = f:( "0x"i ) b:( hex_digit )+
literal_number_decimal = number_decimal_node number_decimal_exponent?
number_decimal_node "Decimal literal"
  = number_decimal_full
  / number_decimal_fraction
number_decimal_fraction = sym_dot digit*
number_decimal_full = digit+ number_decimal_fraction?
number_decimal_exponent = "E"i [\+\-]? digit+

literal_date "Date literal" = ( CURRENT_DATE / CURRENT_TIMESTAMP / CURRENT_TIME ) _

/**
 * @note
 *   1) [ENFORCED] SQL uses single quotes for string literals.
 *   2) [NOT IMPLEMENTED] Value is an identier or a string literal based on context.
 *   3) [IMPLEMENTED] SQLite allows a negative default value on an added text column.
 */
literal_string "String literal"
  = number_sign? sym_sglquote ( "''" / [^\'] )* sym_sglquote

identifier
  = q:( id_table_qualified )? n:( sym_star / name )
  { return param( id( concat(q, n) ) ) }

expression_root
  = bind_parameter
  / function_call
  / literal_value
  / identifier

expression_recur
  = expression_wrapped
  / expression_exists
  / expression_cast
  / expression_case
  / expression_root

/**
 * @note
 *   Bind to expression_root before expression to bind the unary
 *   operator to the closest expression first.
 */
expression_unary = ( expression_unary_op _ expression ) / expression_recur
expression_unary_op
  = sym_tilde
  / sym_minus
  / sym_plus
  / $( expression_is_not !EXISTS )

expression = expression_unary ( _ expression_binary_op _ expression )*
expression_binary_op
  = ( AND / OR )
  / binary_concat
  / binary_multiply
  / binary_divide
  / binary_mod
  / binary_plus
  / binary_minus
  / binary_left
  / binary_right
  / binary_and
  / $(binary_or !binary_or)
  / binary_lte
  / binary_gte
  / $(binary_lt !expression_shift_op)
  / $(binary_gt !expression_shift_op)
  / IS expression_is_not?
  / binary_lang
  / binary_notequal_a
  / binary_notequal_b
  / binary_equal
  / expression_is_not? ( IN / BETWEEN / LIKE / REGEXP / ESCAPE )

expression_is_not = NOT _

expression_list = ( _ sym_comma? _ e:expression )* { return text() }

expression_list
	= l:( _ sym_comma? _ e:expression { return e } )*
    { return l.join(', ') }

/* END: Unary and Binary Expression */

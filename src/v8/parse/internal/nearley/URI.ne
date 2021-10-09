# Based on https://www.w3.org/Addressing/URL/5_URI_BNF.html

URI
  Scheme ":" Path:? ("?" Search):?
Scheme
  Alpha Xalpha:*
Path
  (Xalpha | "+"):+ ("/" Path:?):?
Search
  Xalpha:+ ("+" Search):?
Xalpha
  Alpha | Digit | Safe | Extra | Escape
Escape
  "%" HexDigit HexDigit
Alpha
  [a-zA-Z]
Digit
  [0-9]
HexDigit
  [0-9a-fA-F]
Safe
  "$" | "-" | "_" | "@" | "." | "&"
Extra
  "!" | "*" | "\"" | "'" | "(" | ")" | ","

# https://perishablepress.com/stop-using-unsafe-characters-in-urls/

# Reserved characters must be encoded when not used for their intended purpose
Reserved
  ":" | "/" | "?" | "#" | "[" | "]" | "@" | "!" | "$" | "&" | "'" | "(" | ")" | "*" | "+" | "," | ";" | "="

# Unsafe characters must always be encoded
Unsafe
  "<" | ">" | "%" | "{" | "}" | "|" | "\\" | "^" | "`"

Reserved
  GenDelims | SubDelims

GenDelims
  ":" | "/" | "?" | "#" | "[" | "]" | "@"

SubDelims
  "!" | "$" | "&" | "'" | "(" | ")" | "*" | "+" | "," | ";" | "="

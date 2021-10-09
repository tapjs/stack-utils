@{%
const { stringFrom, get } = require('./util.js');
const { lexer, buildFrame, buildCallSite, buildCall } = require('./frame-shared.js');
%}

@lexer lexer

# Strict frame grammar. See FunctionName production for details

# at foo (file.js:1:23)
Frame ->
  _ "at" __ (
    # evalOrigin (eval at evalmethod (file.js:1:23), <anonymous>:1:5)
    FunctionName _ "(" _ "eval" __ "at" __ CallSite _ ( "," _ Site ):? _ ")"
      {% (d) => buildFrame(d[0], get(d, 10, 2), d[8]) %}
    | CallSite {% id %}
  ) _ {% (d) => d[3] %}

# file.js:1:23
# call (file.js:1:23)
CallSite ->
  Call __ "(" _ Site _ ")"
  {% (d) => buildCallSite(d[0], d[4]) %}
  | Call __ "(" _ "index" __ Number _ ")"
  {% (d) => buildCallSite(d[0], { type: "index", index: d[6] }) %}
  | Site
  {% (d) => buildCallSite(null, d[0]) %}

# foo
# async foo
# new Foo
# fnName [as methodName]
Call ->
  (Modifier __):? FunctionName (__ AsMethod):?
  {% (d) => buildCall(get(d, 0, 0), d[1], get(d, 2, 1)) %}


Modifier ->
  ("new" | "async") {% (d) => d[0][0].text %}

# file.js:1:23
Site ->
  Path _ ":" _ Number _ ":" _ Number
  {% (d) => ({ ...d[0], line: d[4], column: d[8] }) %}
  # Allow ourselves to require position when path is not anonymous
  | "<" "anonymous" ">"
  {% () => ({ type: "anonymous" }) %}
  | "native"
  {% () => ({ type: "native" }) %}

# [as methodName]
AsMethod -> "[" "as" __ FunctionName "]" {% (d) => d[3] %}

Path ->
  PathFragment SpacePathFragment:* {% (d) => ({ type: "file", file: d[0] + stringFrom(d[1])}) %}
  | "<" "anonymous" ">" {% () => ({ type: "anonymous" }) %}

# Ensure that path never begins or ends with spaces.
SpacePathFragment -> SP:? PathFragment {% (d) => (d[0] || '') + d[1] %}

PathFragment -> (%Number | %Fragment) {% (d) => d[0][0].text %}

# This is the main difference in the strict parser
# We do not allow text to contain characters that would be ambiguous

FunctionName -> FunctionNameFragment:* {% (d) => stringFrom(d[0]) %}

FunctionNameFragment -> (%Number | %Fragment | %LB | %RB | %LA | %RA) {% (d) => d[0][0].text %}

Number -> %Number {% (d) => d[0].value %}

SP -> %SP {% (d) => d[0].text %}

_ -> __:? {% id %}

__ -> %SP {% (d) => d[0].text %}

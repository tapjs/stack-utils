@{%
const { stringFrom, get } = require('./util.js');
const { lexer, buildFrame, buildCallSite, buildCall } = require('./frame-shared.js');
%}

@lexer lexer

## TODO
# URI in addition to path
# Text must not be allowed to begin or end with space

# Ambiguous frame grammar. Slow. Fall back to this if the unambiguous frame grammar fails!

# at foo (file.js:1:23)
Frame ->
  _ "at" __ (
    # evalOrigin (eval at evalmethod (file.js:1:23), <anonymous>:1:5)
    Text _ "(" _ "eval" __ "at" __ CallSite _ ("," _ Site):? _ ")"
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
  (Modifier __):? Text (__ AsMethod):?
  {% (d) => buildCall(get(d, 0, 0), d[1], get(d, 2, 1)) %}

Modifier ->
  ("new" | "async") {% (d) => d[0][0].text %}

# file.js:1:23
Site ->
  Path _ ":" _ Number _ ":" _ Number
  {% (d) => ({ ...d[0], line: d[4], column: d[8] }) %}
  # Omit position when function is anonymous
  | "<" "anonymous" ">"
  {% () => ({ type: "anonymous" }) %}
  | "native"
  {% () => ({ type: "native" }) %}

Path ->
  Text {% (d) => ({ type: "file", file: d[0] }) %}
  | "<" "anonymous" ">" {% () => ({ type: "anonymous" }) %}

# [as methodName]
AsMethod -> "[" "as" __ Text "]" {% (d) => d[3] %}

Text -> Fragment SpaceFragment:* {% (d) => d[0] + stringFrom(d[1]) %}

# Ensure that text never begins or ends with spaces.
SpaceFragment -> SP:? Fragment {% (d) => (d[0] || '') + d[1] %}

Fragment -> (%CN | %LB | %RB | %LP | %RP | %LA | %RA | %Number | %Fragment) {% (d) => d[0][0].text %}

SP -> %SP {% (d) => d[0].text %}

Number -> %Number {% (d) => d[0].value %}

_ -> __:? {% id %}

__ -> %SP {% (d) => d[0].text %}

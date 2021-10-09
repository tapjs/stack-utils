@{%

const moo = require('moo');
const { stringFrom } = require('./util.js');

const lexer = moo.compile({
  // Don't even try to lex frames here
  Frame: /^[ \t]*at .*$/,
  SP: /[ \t]+/,
  NL: { match: '\n', lineBreaks: true },
  CN: ':',
  Fragment: /[^: \t\n]+/,
});

%}

@lexer lexer

ErrorStack ->
  Error (NL ErrorWithPrefix):*
  {% (d) => [d[0], ...d[1].map((d => d[1]))] %}
  | Message
  {% (d) => [({ message: d[0] })] %}

# Caused by: FubarError: message
#     at frame
ErrorWithPrefix -> Prefix:? Error
{% (d) => {
  const error = d[1];
  if (d[0]) error.prefix = d[0];
  return error;
} %}

# FubarError: message
#     at frame
Error -> Message NL Stack
{% (d) => ({ message: d[0], stack: d[2] }) %}

# FubarError: There was extreme and terrible errorness
# Maybe you should try not writing code that has these problems
Message -> Text (NL Text):* {% (d) => d[0] + stringFrom(d[1].flat())  %}

# Caused by:
Prefix -> Text _ ":" _

Stack -> Frame (NL Frame):* {% (d) => [d[0], ...(d[1] ? d[1].map(d => d[1]) : [])] %}

Frame -> %Frame {% (d) => d[0].text %}

Text -> Fragment:+ {% (d) => stringFrom(d[0]) %}

Fragment -> %SP | %CN | %Fragment {% (d) => d[0].text %}

NL -> %NL {% (d) => d[0].text %}

_ -> __:? {% id %}

__ -> %SP {% (d) => d[0].text  %}

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const { stringFrom, get } = require('./util.js');
const { lexer, buildFrame, buildCallSite, buildCall } = require('./frame-shared.js');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Frame$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "Site"]},
    {"name": "Frame$subexpression$1$ebnf$1", "symbols": ["Frame$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Frame$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Frame$subexpression$1", "symbols": ["FunctionName", "_", {"literal":"("}, "_", {"literal":"eval"}, "__", {"literal":"at"}, "__", "CallSite", "_", "Frame$subexpression$1$ebnf$1", "_", {"literal":")"}], "postprocess": (d) => buildFrame(d[0], get(d, 10, 2), d[8])},
    {"name": "Frame$subexpression$1", "symbols": ["CallSite"], "postprocess": id},
    {"name": "Frame", "symbols": ["_", {"literal":"at"}, "__", "Frame$subexpression$1", "_"], "postprocess": (d) => d[3]},
    {"name": "CallSite", "symbols": ["Call", "__", {"literal":"("}, "_", "Site", "_", {"literal":")"}], "postprocess": (d) => buildCallSite(d[0], d[4])},
    {"name": "CallSite", "symbols": ["Call", "__", {"literal":"("}, "_", {"literal":"index"}, "__", "Number", "_", {"literal":")"}], "postprocess": (d) => buildCallSite(d[0], { type: "index", index: d[6] })},
    {"name": "CallSite", "symbols": ["Site"], "postprocess": (d) => buildCallSite(null, d[0])},
    {"name": "Call$ebnf$1$subexpression$1", "symbols": ["Modifier", "__"]},
    {"name": "Call$ebnf$1", "symbols": ["Call$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Call$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Call$ebnf$2$subexpression$1", "symbols": ["__", "AsMethod"]},
    {"name": "Call$ebnf$2", "symbols": ["Call$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "Call$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Call", "symbols": ["Call$ebnf$1", "FunctionName", "Call$ebnf$2"], "postprocess": (d) => buildCall(get(d, 0, 0), d[1], get(d, 2, 1))},
    {"name": "Modifier$subexpression$1", "symbols": [{"literal":"new"}]},
    {"name": "Modifier$subexpression$1", "symbols": [{"literal":"async"}]},
    {"name": "Modifier", "symbols": ["Modifier$subexpression$1"], "postprocess": (d) => d[0][0].text},
    {"name": "Site", "symbols": ["Path", "_", {"literal":":"}, "_", "Number", "_", {"literal":":"}, "_", "Number"], "postprocess": (d) => ({ ...d[0], line: d[4], column: d[8] })},
    {"name": "Site", "symbols": [{"literal":"<"}, {"literal":"anonymous"}, {"literal":">"}], "postprocess": () => ({ type: "anonymous" })},
    {"name": "Site", "symbols": [{"literal":"native"}], "postprocess": () => ({ type: "native" })},
    {"name": "AsMethod", "symbols": [{"literal":"["}, {"literal":"as"}, "__", "FunctionName", {"literal":"]"}], "postprocess": (d) => d[3]},
    {"name": "Path$ebnf$1", "symbols": []},
    {"name": "Path$ebnf$1", "symbols": ["Path$ebnf$1", "SpacePathFragment"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Path", "symbols": ["PathFragment", "Path$ebnf$1"], "postprocess": (d) => ({ type: "file", file: d[0] + stringFrom(d[1])})},
    {"name": "Path", "symbols": [{"literal":"<"}, {"literal":"anonymous"}, {"literal":">"}], "postprocess": () => ({ type: "anonymous" })},
    {"name": "SpacePathFragment$ebnf$1", "symbols": ["SP"], "postprocess": id},
    {"name": "SpacePathFragment$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SpacePathFragment", "symbols": ["SpacePathFragment$ebnf$1", "PathFragment"], "postprocess": (d) => (d[0] || '') + d[1]},
    {"name": "PathFragment$subexpression$1", "symbols": [(lexer.has("Number") ? {type: "Number"} : Number)]},
    {"name": "PathFragment$subexpression$1", "symbols": [(lexer.has("Fragment") ? {type: "Fragment"} : Fragment)]},
    {"name": "PathFragment", "symbols": ["PathFragment$subexpression$1"], "postprocess": (d) => d[0][0].text},
    {"name": "FunctionName$ebnf$1", "symbols": []},
    {"name": "FunctionName$ebnf$1", "symbols": ["FunctionName$ebnf$1", "FunctionNameFragment"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FunctionName", "symbols": ["FunctionName$ebnf$1"], "postprocess": (d) => stringFrom(d[0])},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("Number") ? {type: "Number"} : Number)]},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("Fragment") ? {type: "Fragment"} : Fragment)]},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("LB") ? {type: "LB"} : LB)]},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("RB") ? {type: "RB"} : RB)]},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("LA") ? {type: "LA"} : LA)]},
    {"name": "FunctionNameFragment$subexpression$1", "symbols": [(lexer.has("RA") ? {type: "RA"} : RA)]},
    {"name": "FunctionNameFragment", "symbols": ["FunctionNameFragment$subexpression$1"], "postprocess": (d) => d[0][0].text},
    {"name": "Number", "symbols": [(lexer.has("Number") ? {type: "Number"} : Number)], "postprocess": (d) => d[0].value},
    {"name": "SP", "symbols": [(lexer.has("SP") ? {type: "SP"} : SP)], "postprocess": (d) => d[0].text},
    {"name": "_$ebnf$1", "symbols": ["__"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": id},
    {"name": "__", "symbols": [(lexer.has("SP") ? {type: "SP"} : SP)], "postprocess": (d) => d[0].text}
]
  , ParserStart: "Frame"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

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
    {"name": "Frame$subexpression$1", "symbols": ["Text", "_", {"literal":"("}, "_", {"literal":"eval"}, "__", {"literal":"at"}, "__", "CallSite", "_", "Frame$subexpression$1$ebnf$1", "_", {"literal":")"}], "postprocess": (d) => buildFrame(d[0], get(d, 10, 2), d[8])},
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
    {"name": "Call", "symbols": ["Call$ebnf$1", "Text", "Call$ebnf$2"], "postprocess": (d) => buildCall(get(d, 0, 0), d[1], get(d, 2, 1))},
    {"name": "Modifier$subexpression$1", "symbols": [{"literal":"new"}]},
    {"name": "Modifier$subexpression$1", "symbols": [{"literal":"async"}]},
    {"name": "Modifier", "symbols": ["Modifier$subexpression$1"], "postprocess": (d) => d[0][0].text},
    {"name": "Site", "symbols": ["Path", "_", {"literal":":"}, "_", "Number", "_", {"literal":":"}, "_", "Number"], "postprocess": (d) => ({ ...d[0], line: d[4], column: d[8] })},
    {"name": "Site", "symbols": [{"literal":"<"}, {"literal":"anonymous"}, {"literal":">"}], "postprocess": () => ({ type: "anonymous" })},
    {"name": "Site", "symbols": [{"literal":"native"}], "postprocess": () => ({ type: "native" })},
    {"name": "Path", "symbols": ["Text"], "postprocess": (d) => ({ type: "file", file: d[0] })},
    {"name": "Path", "symbols": [{"literal":"<"}, {"literal":"anonymous"}, {"literal":">"}], "postprocess": () => ({ type: "anonymous" })},
    {"name": "AsMethod", "symbols": [{"literal":"["}, {"literal":"as"}, "__", "Text", {"literal":"]"}], "postprocess": (d) => d[3]},
    {"name": "Text$ebnf$1", "symbols": []},
    {"name": "Text$ebnf$1", "symbols": ["Text$ebnf$1", "SpaceFragment"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Text", "symbols": ["Fragment", "Text$ebnf$1"], "postprocess": (d) => d[0] + stringFrom(d[1])},
    {"name": "SpaceFragment$ebnf$1", "symbols": ["SP"], "postprocess": id},
    {"name": "SpaceFragment$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SpaceFragment", "symbols": ["SpaceFragment$ebnf$1", "Fragment"], "postprocess": (d) => (d[0] || '') + d[1]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("CN") ? {type: "CN"} : CN)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("LB") ? {type: "LB"} : LB)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("RB") ? {type: "RB"} : RB)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("LP") ? {type: "LP"} : LP)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("RP") ? {type: "RP"} : RP)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("LA") ? {type: "LA"} : LA)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("RA") ? {type: "RA"} : RA)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("Number") ? {type: "Number"} : Number)]},
    {"name": "Fragment$subexpression$1", "symbols": [(lexer.has("Fragment") ? {type: "Fragment"} : Fragment)]},
    {"name": "Fragment", "symbols": ["Fragment$subexpression$1"], "postprocess": (d) => d[0][0].text},
    {"name": "SP", "symbols": [(lexer.has("SP") ? {type: "SP"} : SP)], "postprocess": (d) => d[0].text},
    {"name": "Number", "symbols": [(lexer.has("Number") ? {type: "Number"} : Number)], "postprocess": (d) => d[0].value},
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

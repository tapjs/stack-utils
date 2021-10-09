const moo = require("moo");

export const lexer = moo.compile({
  SP: /[ \t]+/,
  CN: ":",
  LB: "[", // Braces
  RB: "]",
  LP: "(", // Parens
  RP: ")",
  LA: "<", // Angle brackets
  RA: ">",
  Number: { match: /\d+/, value: (str) => parseInt(str, 10) },
  Fragment: /[^()<>\[\]: \d\t\n]+/,
});

export const buildFrame = (evalOrigin, site, eval_) => {
  return {
    call: {
      constructor: false,
      async: false,
      function: evalOrigin,
      method: evalOrigin,
    },
    site,
    eval: eval_,
  };
};

export const buildCallSite = (call, site) => ({ call, site });

export const buildCall = (kw, fn, method = fn) => {
  return {
    constructor: kw === "new",
    async: kw === "async",
    function: fn,
    method,
  };
};

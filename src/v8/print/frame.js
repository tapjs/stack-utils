function printCall(call) {
  const parts = [];

  if (call.async) parts.push('async');
  if (call.constructor) parts.push('new');
  parts.push(call.function);
  if (call.method !== call.function) parts.push(`[as ${call.method}]`);

  return parts.join(' ');
}

function printSite(site) {
  let str = '';
  switch (site.type) {
    case 'anonymous':
      str += '<anonymous>';
      break;
    case 'native':
      str += 'native';
      break;
    case 'file':
      str += site.file;
      break;
    case 'uri':
      str += site.uri;
      break;
    case 'index':
      str += `index ${site.index}`;
      break;
  }

  switch (site.type) {
    case 'anonymous':
    case 'file':
    case 'uri':
      if (site.line) str += `:${site.line}`;
      if (site.column) str += `:${site.column}`;
      break;
  }
  return str;
}

function printCallSite(callSite) {
  const { call, site } = callSite;
  const parts = [];

  if (call) parts.push(printCall(call));
  if (site) parts.push(call ? `(${printSite(site)})` : printSite(site));

  return parts.join(' ');
}

function printEval(callSite, evalCallSite) {
  let str = '';

  str += callSite.call.function;

  str += ' (';

  str += `eval at ${printCallSite(evalCallSite)}`;

  if (callSite.site) str += `, ${printSite(callSite.site)}`;

  str += ')';

  return str;
}

function printFrame(frame) {
  return `    at ${frame.eval ? printEval(frame, frame.eval) : printCallSite(frame)}`;
}

module.exports = printFrame;

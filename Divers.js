exports.assert = void 0;
exports.breakpoint = breakpoint;
require("DeclarationExtensionsObjetNatif");
const assert = (aIgnorer, aMessage) => {};
exports.assert = assert;
global.assert = assert;
function breakpoint() {}

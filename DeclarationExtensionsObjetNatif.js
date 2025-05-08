require("Object.js");
require("String");
require("Math");
require("Promise.js");
if (!global.ResizeObserver) {
	global.ResizeObserver = require("ResizeObserver_polyfill.js");
}
require("IntersectionObserver_polyfill.js");

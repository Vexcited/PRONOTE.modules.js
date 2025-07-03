require("Object");
require("String");
require("Math");
require("Promise");
if (!global.ResizeObserver) {
	global.ResizeObserver = require("ResizeObserver_polyfill.js");
}
require("IntersectionObserver_polyfill");

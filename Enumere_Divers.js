exports.EOrientation =
	exports.EAlignementVertical =
	exports.EAlignementHorizontal =
		void 0;
var EAlignementHorizontal;
(function (EAlignementHorizontal) {
	EAlignementHorizontal[(EAlignementHorizontal["gauche"] = 0)] = "gauche";
	EAlignementHorizontal[(EAlignementHorizontal["droit"] = 1)] = "droit";
	EAlignementHorizontal[(EAlignementHorizontal["centre"] = 2)] = "centre";
})(
	EAlignementHorizontal ||
		(exports.EAlignementHorizontal = EAlignementHorizontal = {}),
);
var EAlignementVertical;
(function (EAlignementVertical) {
	EAlignementVertical[(EAlignementVertical["haut"] = 0)] = "haut";
	EAlignementVertical[(EAlignementVertical["bas"] = 1)] = "bas";
})(
	EAlignementVertical ||
		(exports.EAlignementVertical = EAlignementVertical = {}),
);
var EOrientation;
(function (EOrientation) {
	EOrientation[(EOrientation["horizontal"] = 0)] = "horizontal";
	EOrientation[(EOrientation["vertical"] = 1)] = "vertical";
})(EOrientation || (exports.EOrientation = EOrientation = {}));

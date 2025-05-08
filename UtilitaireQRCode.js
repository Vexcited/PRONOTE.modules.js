exports.UtilitaireQRCode = void 0;
const UtilitaireQRCode = {
	genererImage(aStrValue, aParametres) {
		var _a;
		const lElementQRCode = UtilitaireQRCode.genererImageDOM(
			aStrValue,
			aParametres,
		);
		if (lElementQRCode && aParametres && aParametres.alt) {
			lElementQRCode.setAttribute("alt", aParametres.alt);
		}
		return (_a =
			lElementQRCode === null || lElementQRCode === void 0
				? void 0
				: lElementQRCode.outerHTML) !== null && _a !== void 0
			? _a
			: "";
	},
	genererImageDOM(aStrValue, aParametres) {
		return kjua({
			render: "image",
			size:
				(aParametres === null || aParametres === void 0
					? void 0
					: aParametres.taille) || 175,
			text: aStrValue,
		});
	},
};
exports.UtilitaireQRCode = UtilitaireQRCode;

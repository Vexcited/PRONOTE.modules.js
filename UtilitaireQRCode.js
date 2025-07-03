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
		const lParams = Object.assign({ masquerCurseur: true }, aParametres);
		let lEltQrCode = kjua({
			render: "image",
			size:
				(lParams === null || lParams === void 0 ? void 0 : lParams.taille) ||
				175,
			text: aStrValue,
		});
		if (lParams && lParams.alt) {
			lEltQrCode.setAttribute("alt", lParams.alt);
		}
		if (lEltQrCode && lParams.masquerCurseur) {
			lEltQrCode.classList.add("cursor-none");
		}
		return lEltQrCode;
	},
};
exports.UtilitaireQRCode = UtilitaireQRCode;

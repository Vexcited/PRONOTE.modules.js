exports.TLienPolitiqueMotDePasse = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
exports.TLienPolitiqueMotDePasse = {
	getLien: function () {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"a",
				{
					href: ObjetTraduction_1.GTraductions.getValeur(
						"LienPolitiqueMotDePasse.UrlFAQMotDePasse",
					),
					target: "_blank",
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"LienPolitiqueMotDePasse.ConsulterNotrePolitiqueSecuriteMDP",
				),
			),
		);
	},
};

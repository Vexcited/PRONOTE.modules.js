exports.ObjetRequeteSaisieURLPartenaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteSaisieURLPartenaire extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			avecControleModeExclusif: false,
			messageDetail: ObjetTraduction_1.GTraductions.getValeur(
				"requete.VeuillezPatienter",
			),
		});
	}
}
exports.ObjetRequeteSaisieURLPartenaire = ObjetRequeteSaisieURLPartenaire;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieURLPartenaire",
	ObjetRequeteSaisieURLPartenaire,
);

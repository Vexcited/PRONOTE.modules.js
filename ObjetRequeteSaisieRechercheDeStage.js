exports.ObjetRequeteSaisieRechercheDeStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieRechercheDeStage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
		this.JSON = {
			action:
				(_a = aParams.action) === null || _a === void 0
					? void 0
					: _a.toJSONAll(),
			evenement:
				(_b = aParams.evenement) === null || _b === void 0
					? void 0
					: _b.toJSONAll(),
			recherche:
				(_c = aParams.recherche) === null || _c === void 0
					? void 0
					: _c.toJSONAll(),
			entreprise:
				(_d = aParams.entreprise) === null || _d === void 0
					? void 0
					: _d.toJSONAll(),
			eleve:
				(_e = aParams.eleve) === null || _e === void 0 ? void 0 : _e.toJSON(),
			session: aParams.session.toJSON(),
		};
		if (
			(_f = aParams.recherche) === null || _f === void 0
				? void 0
				: _f.entreprise
		) {
			this.JSON.recherche.entreprise =
				(_g = aParams.recherche) === null || _g === void 0
					? void 0
					: _g.entreprise.toJSONAll();
		}
		if ((_h = aParams.action) === null || _h === void 0 ? void 0 : _h.listePJ) {
			this.JSON.action.listePJ = aParams.action.listePJ.setSerialisateurJSON({
				methodeSerialisation: this.serialiserDocument.bind(this),
			});
		}
		if (
			(_j = aParams.evenement) === null || _j === void 0 ? void 0 : _j.listePJ
		) {
			this.JSON.evenement.listePJ =
				aParams.evenement.listePJ.setSerialisateurJSON({
					methodeSerialisation: this.serialiserDocument.bind(this),
				});
		}
		if (
			(_k = aParams.recherche) === null || _k === void 0 ? void 0 : _k.listePJ
		) {
			this.JSON.recherche.listePJ =
				aParams.recherche.listePJ.setSerialisateurJSON({
					methodeSerialisation: this.serialiserDocument.bind(this),
				});
		}
		return this.appelAsynchrone();
	}
	serialiserDocument(aElement, aJSON) {
		aJSON.idFichier = aElement.idFichier;
	}
}
exports.ObjetRequeteSaisieRechercheDeStage = ObjetRequeteSaisieRechercheDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRechercheDeStage",
	ObjetRequeteSaisieRechercheDeStage,
);

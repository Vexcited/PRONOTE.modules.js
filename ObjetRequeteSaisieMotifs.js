exports.ObjetRequeteSaisieMotifs = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequeteSaisieMotifs extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.param = {};
		Object.assign(this.param, aParam);
		this.JSON.avecAucunMotif = aParam.avecAucunMotif;
		aParam.motifs.setSerialisateurJSON({
			methodeSerialisation: _serialiser_Motifs.bind(this),
		});
		this.JSON.motifs = aParam.motifs;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeMotifsCree =
			this.JSONRapportSaisie && this.JSONRapportSaisie.motifsCree
				? this.JSONRapportSaisie.motifsCree
				: new ObjetListeElements_1.ObjetListeElements();
		const lListeMotifs =
			this.JSONReponse && this.JSONReponse.motifs
				? this.JSONReponse.motifs
				: new ObjetListeElements_1.ObjetListeElements();
		lListeMotifs.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.ssMotif;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListeMotifs.trier();
		const lListeMotifsSelect = lListeMotifs.getListeElements((aElement) => {
			let lResult = false;
			const lElmCree = lListeMotifsCree.getElementParNumero(
				aElement.getNumero(),
			);
			if (
				(!!lElmCree &&
					!!this.param.selection.getElementParNumero(lElmCree.nrOrigin)) ||
				(!lElmCree &&
					!!this.param.selection.getElementParNumero(aElement.getNumero()))
			) {
				lResult = true;
			}
			return lResult;
		});
		this.callbackReussite.appel(lListeMotifsSelect, lListeMotifs);
	}
}
exports.ObjetRequeteSaisieMotifs = ObjetRequeteSaisieMotifs;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieMotifs",
	ObjetRequeteSaisieMotifs,
);
function _serialiser_Motifs(aMotif, aJSON) {
	if (aMotif.sousCategorieDossier) {
		aJSON.sousCategorieDossier = aMotif.sousCategorieDossier.toJSON();
	}
}

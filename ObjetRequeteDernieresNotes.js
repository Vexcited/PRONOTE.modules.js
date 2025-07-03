exports.ObjetRequeteDernieresNotes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequeteDernieresNotes extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON.Periode = aParams.periode;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (!!this.JSONReponse.listeDevoirs) {
			this.JSONReponse.listeDevoirs.setTri([
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]);
			this.JSONReponse.listeDevoirs.trier();
			if (!!this.JSONReponse.listeServices) {
				const lListeServices = this.JSONReponse.listeServices;
				this.JSONReponse.listeDevoirs.parcourir((D) => {
					if (!!D.service) {
						D.service = lListeServices.getElementParNumero(
							D.service.getNumero(),
						);
					}
				});
			}
		}
		const lJSONResult = { listeDevoirs: this.JSONReponse.listeDevoirs };
		if (
			!!this.JSONReponse.moyGenerale &&
			!this.JSONReponse.moyGenerale.estVide() &&
			!!this.JSONReponse.moyGeneraleClasse &&
			!this.JSONReponse.moyGeneraleClasse.estVide()
		) {
			lJSONResult.moyenneGenerale = {
				note: this.JSONReponse.moyGenerale,
				noteClasse: this.JSONReponse.moyGeneraleClasse,
				bareme: this.JSONReponse.baremeMoyGenerale,
				baremeParDefaut: this.JSONReponse.baremeMoyGeneraleParDefaut,
			};
		}
		lJSONResult.avecDetailDevoir = this.JSONReponse.avecDetailDevoir;
		lJSONResult.avecDetailService = this.JSONReponse.avecDetailService;
		this.callbackReussite.appel(lJSONResult);
	}
}
exports.ObjetRequeteDernieresNotes = ObjetRequeteDernieresNotes;
CollectionRequetes_1.Requetes.inscrire(
	"DernieresNotes",
	ObjetRequeteDernieresNotes,
);

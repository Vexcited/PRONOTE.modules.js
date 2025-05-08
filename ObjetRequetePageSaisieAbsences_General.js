const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
const { GCache } = require("Cache.js");
class ObjetRequetePageSaisieAbsences_General extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete() {
		if (
			GApplication.droits.get(
				TypeDroits.fonctionnalites.appelSaisirMotifJustifDAbsence,
			)
		) {
			if (!GCache.listeMotifsAbsenceEleve) {
				this.JSON.avecListeMotifsAbsence = true;
			}
		}
		if (GApplication.droits.get(TypeDroits.absences.avecSaisieMotifRetard)) {
			if (!GCache.listeMotifsRetards) {
				this.JSON.avecListeMotifsRetard = true;
			}
		}
		if (!GCache.listeMotifsExclusion) {
			this.JSON.avecListeMotifsExclusion = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeMotifsAbsenceEleve) {
			GCache.listeMotifsAbsenceEleve = this.JSONReponse.listeMotifsAbsenceEleve;
		}
		if (this.JSONReponse.listeMotifsRetards) {
			GCache.listeMotifsRetards = this.JSONReponse.listeMotifsRetards;
		}
		if (this.JSONReponse.listeMotifsExclusion) {
			const lListeMotifs = this.JSONReponse.listeMotifsExclusion;
			lListeMotifs.setTri([
				ObjetTri.init((D) => {
					return !D.ssMotif;
				}),
				ObjetTri.init("Libelle"),
			]);
			lListeMotifs.trier();
			GCache.listeMotifsExclusion = lListeMotifs;
		}
		this.callbackReussite.appel({
			listeMotifs: GCache.listeMotifsExclusion,
			listeNaturePunition: this.JSONReponse.listeNaturePunition,
			listeNatureExclusion: this.JSONReponse.listeNatureExclusion,
		});
	}
}
Requetes.inscrire(
	"PageSaisieAbsences_General",
	ObjetRequetePageSaisieAbsences_General,
);
module.exports = { ObjetRequetePageSaisieAbsences_General };

exports.ObjetRequetePageSaisieAbsences_General = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
const Cache_1 = require("Cache");
const AccessApp_1 = require("AccessApp");
class ObjetRequetePageSaisieAbsences_General extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.application = (0, AccessApp_1.getApp)();
	}
	lancerRequete() {
		if (
			this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites
					.appelSaisirMotifJustifDAbsence,
			)
		) {
			if (!Cache_1.GCache.listeMotifsAbsenceEleve) {
				this.JSON.avecListeMotifsAbsence = true;
			}
		}
		if (
			this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
			)
		) {
			if (!Cache_1.GCache.listeMotifsRetards) {
				this.JSON.avecListeMotifsRetard = true;
			}
		}
		if (!Cache_1.GCache.listeMotifsExclusion) {
			this.JSON.avecListeMotifsExclusion = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeMotifsAbsenceEleve) {
			Cache_1.GCache.listeMotifsAbsenceEleve =
				this.JSONReponse.listeMotifsAbsenceEleve;
		}
		if (this.JSONReponse.listeMotifsRetards) {
			Cache_1.GCache.listeMotifsRetards = this.JSONReponse.listeMotifsRetards;
		}
		if (this.JSONReponse.listeMotifsExclusion) {
			const lListeMotifs = this.JSONReponse.listeMotifsExclusion;
			lListeMotifs.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.ssMotif;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeMotifs.trier();
			Cache_1.GCache.listeMotifsExclusion = lListeMotifs;
		}
		this.callbackReussite.appel({
			listeMotifs: Cache_1.GCache.listeMotifsExclusion,
			listeNaturePunition: this.JSONReponse.listeNaturePunition,
			listeNatureExclusion: this.JSONReponse.listeNatureExclusion,
			avecCommentaireAutorise: this.JSONReponse.avecCommentaireAutorise,
		});
	}
}
exports.ObjetRequetePageSaisieAbsences_General =
	ObjetRequetePageSaisieAbsences_General;
CollectionRequetes_1.Requetes.inscrire(
	"PageSaisieAbsences_General",
	ObjetRequetePageSaisieAbsences_General,
);

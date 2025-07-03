exports.ObjetRequeteSaisieOrientations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Type3Etats_1 = require("Type3Etats");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieOrientations extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		if (!!aParams.listeVoeux) {
			aParams.listeVoeux.setSerialisateurJSON({
				methodeSerialisation: this._serialisation.bind(this),
			});
			this.JSON = { Voeux: aParams.listeVoeux };
		}
		if (!!aParams.donneesAR) {
			this.JSON.donneesAR = aParams.donneesAR.toJSON();
			if (aParams.donneesAR.estAccuse !== Type3Etats_1.Type3Etats.TE_Inconnu) {
				this.JSON.donneesAR.estAccuse =
					aParams.donneesAR.estAccuse === Type3Etats_1.Type3Etats.TE_Oui;
			}
			if (
				aParams.donneesAR.reponseStagePasserelle !==
				Type3Etats_1.Type3Etats.TE_Inconnu
			) {
				this.JSON.donneesAR.reponseStagePasserelle =
					aParams.donneesAR.reponseStagePasserelle ===
					Type3Etats_1.Type3Etats.TE_Oui;
			}
			if (!!aParams.donneesAR.decisionRetenue) {
				this.JSON.donneesAR.decisionRetenue = aParams.donneesAR.decisionRetenue;
			}
		}
		if (!!aParams.eleve) {
			this.JSON.eleve = aParams.eleve;
		}
		if (!!aParams.rubriqueLV) {
			if (aParams.rubriqueLV.LVAutres) {
				aParams.rubriqueLV.LVAutres.setSerialisateurJSON({
					ignorerEtatsElements: true,
				});
			}
			this.JSON.rubriqueLV = {
				LV1: aParams.rubriqueLV.LV1,
				LV2: aParams.rubriqueLV.LV2,
				LVAutres: aParams.rubriqueLV.LVAutres,
			};
		}
		return this.appelAsynchrone();
	}
	_serialisation(aElement, aJSON) {
		if (aElement.orientation && aElement.orientation.existeNumero()) {
			aJSON.Orientation = aElement.orientation;
			if (aElement.orientation.avecStageFamille) {
				aJSON.avecStage = aElement.orientation.avecStageFamille;
			}
		}
		if (aElement.specialites) {
			aElement.specialites.setSerialisateurJSON({ ignorerEtatsElements: true });
			aJSON.Specialites = aElement.specialites;
		}
		if (aElement.options) {
			aElement.options.setSerialisateurJSON({ ignorerEtatsElements: true });
			aJSON.Options = aElement.options;
		}
		if (!!aElement.commentaire) {
			aJSON.Commentaire = aElement.commentaire;
		}
	}
}
exports.ObjetRequeteSaisieOrientations = ObjetRequeteSaisieOrientations;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieOrientations",
	ObjetRequeteSaisieOrientations,
);

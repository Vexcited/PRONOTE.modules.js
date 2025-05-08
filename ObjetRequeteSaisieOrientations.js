const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Type3Etats } = require("Type3Etats.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieOrientations extends ObjetRequeteSaisie {
	lancerRequete(aParams) {
		if (!!aParams.listeOrientations) {
			aParams.listeOrientations.setSerialisateurJSON({
				methodeSerialisation: this._serialisation.bind(this),
			});
			this.JSON = { Voeux: aParams.listeOrientations };
		}
		if (!!aParams.donneesAR) {
			this.JSON.donneesAR = aParams.donneesAR.toJSON();
			if (aParams.donneesAR.estAccuse !== Type3Etats.TE_Inconnu) {
				this.JSON.donneesAR.estAccuse =
					aParams.donneesAR.estAccuse === Type3Etats.TE_Oui;
			}
			if (aParams.donneesAR.reponseStagePasserelle !== Type3Etats.TE_Inconnu) {
				this.JSON.donneesAR.reponseStagePasserelle =
					aParams.donneesAR.reponseStagePasserelle === Type3Etats.TE_Oui;
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
Requetes.inscrire("SaisieOrientations", ObjetRequeteSaisieOrientations);
module.exports = { ObjetRequeteSaisieOrientations };

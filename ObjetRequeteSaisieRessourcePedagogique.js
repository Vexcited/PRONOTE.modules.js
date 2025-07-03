exports.ObjetRequeteSaisieRessourcePedagogique = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteSaisieRessourcePedagogique extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		$.extend(this.JSON, aParams);
		if (this.JSON.depot) {
			this.JSON.depot.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					if (aElement.estUnDeploiement) {
						return false;
					}
					aJSON.ressource = aElement.ressource;
					aJSON.url = aElement.url;
					aJSON.commentaire = aElement.commentaire;
					aJSON.matiere = aElement.matiere;
					if (aElement.ListeThemes) {
						aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
							ignorerEtatsElements: true,
						});
					}
					aJSON.listePublics = aElement.listePublics;
					aJSON.listeNiveaux = aElement.listeNiveaux;
					aJSON.estModifiableParAutrui = aElement.estModifiableParAutrui;
					if (aElement.fichier) {
						aJSON.fichier = aElement.fichier.toJSON();
						aJSON.fichier.idFichier = aElement.fichier.idFichier;
					}
				},
			});
		}
		return this.appelAsynchrone();
	}
	traiterReponseSaisieMessage(aMessagesErreurRapportSaisie, aReponse, aTitre) {
		if (this.JSONReponse.import) {
			let lDetails = "";
			if (aMessagesErreurRapportSaisie && aMessagesErreurRapportSaisie.join) {
				lDetails = aMessagesErreurRapportSaisie.join("\n");
			}
			GApplication.getMessage().afficher({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.LectureImpossible",
				),
				message: lDetails,
			});
		} else {
			return super.traiterReponseSaisieMessage(
				aMessagesErreurRapportSaisie,
				aReponse,
				aTitre,
			);
		}
	}
}
exports.ObjetRequeteSaisieRessourcePedagogique =
	ObjetRequeteSaisieRessourcePedagogique;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRessourcePedagogique",
	ObjetRequeteSaisieRessourcePedagogique,
);

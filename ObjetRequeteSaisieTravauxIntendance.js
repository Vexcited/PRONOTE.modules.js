const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const {
	TypeOrigineCreationAvanceeTravaux,
} = require("TypeOrigineCreationAvanceeTravaux.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetRequeteSaisieTravauxIntendance extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		aParam.listeTvx.setSerialisateurJSON({
			methodeSerialisation: _serialisation.bind(this),
		});
		if (aParam.ListeFichiers) {
			aParam.ListeFichiers.setSerialisateurJSON({
				methodeSerialisation: _serialisationFichier.bind(this),
			});
		}
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
Requetes.inscrire(
	"SaisieTravauxIntendance",
	ObjetRequeteSaisieTravauxIntendance,
);
function _serialisation(aElement, aJSON) {
	if (
		aElement.etat.getGenre() ===
			TypeOrigineCreationAvanceeTravaux.OCAT_Realise &&
		!aElement.nouveauGenreTravaux
	) {
		if (
			aElement.dateRealisation !== null &&
			aElement.dateRealisation !== undefined
		) {
			aJSON.dateRealisation = aElement.dateRealisation;
		}
		aJSON.commentaire = aElement.commentaire;
		aJSON.remarque = aElement.remarque;
		if ("duree" in aElement) {
			aJSON.duree = aElement.duree;
		}
		if (aElement.listePourSaisie) {
			aJSON.listeExecutants = aElement.listePourSaisie.toJSON();
		}
	} else {
		if (aElement.dateCreation) {
			aJSON.dateCreation = aElement.dateCreation;
		}
		if (aElement.detail) {
			aJSON.detail = aElement.detail;
		}
		if (aElement.demandeur) {
			aJSON.demandeur = aElement.demandeur.toJSON();
		}
		if (aElement.listeLieux) {
			aJSON.listeLieux = aElement.listeLieux.toJSON();
		}
		if (aElement.nature) {
			aJSON.nature = aElement.nature.toJSON();
		}
		if (MethodesObjet.isNumeric(aElement.niveauDUrgence)) {
			aJSON.niveauDUrgence = aElement.niveauDUrgence;
		}
		if (aElement.destination !== undefined) {
			aJSON.destination = aElement.destination;
		}
		if (aElement.etat) {
			aJSON.etat = aElement.etat.toJSON();
		}
		if (aElement.dateEcheance !== null && aElement.dateEcheance !== undefined) {
			aJSON.dateEcheance = aElement.dateEcheance;
		}
		if (aElement.listePJ) {
			aJSON.listePJ = aElement.listePJ.toJSON();
		}
		if (aElement.nouveauGenreTravaux) {
			aJSON.nouveauGenreTravaux = aElement.nouveauGenreTravaux;
		}
		if (aElement.commentaire) {
			aJSON.commentaire = aElement.commentaire;
		}
		if (aElement.remarque) {
			aJSON.remarque = aElement.remarque;
		}
		if (aElement.listePourSaisie) {
			aJSON.listeExecutants = aElement.listePourSaisie.toJSON();
		}
		if (aElement.dateRealisation) {
			aJSON.dateRealisation = aElement.dateRealisation;
		}
		if ("duree" in aElement) {
			aJSON.duree = aElement.duree;
		}
	}
}
function _serialisationFichier(aElement, aJSON) {
	const lIdFichier =
		aElement.idFichier !== undefined
			? aElement.idFichier
			: aElement.Fichier !== undefined
				? aElement.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = "" + lIdFichier;
	}
}
module.exports = ObjetRequeteSaisieTravauxIntendance;

exports.ObjetRequeteSaisieTravauxIntendance = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeOrigineCreationAvanceeTravaux_1 = require("TypeOrigineCreationAvanceeTravaux");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetRequeteSaisieTravauxIntendance extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		aParam.listeTvx.setSerialisateurJSON({
			methodeSerialisation: _serialiserDemandeTravaux.bind(this),
		});
		if (aParam.ListeFichiers) {
			aParam.ListeFichiers.setSerialisateurJSON({
				methodeSerialisation: _serialisationFichier.bind(this),
			});
		}
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieTravauxIntendance =
	ObjetRequeteSaisieTravauxIntendance;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieTravauxIntendance",
	ObjetRequeteSaisieTravauxIntendance,
);
function _serialiserDemandeTravaux(aElement, aJSON) {
	if (
		aElement.etat.getGenre() ===
			TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
				.OCAT_Realise &&
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
		if (MethodesObjet_1.MethodesObjet.isNumeric(aElement.niveauDUrgence)) {
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

exports.TUtilitaireDispenses = void 0;
const AccessApp_1 = require("AccessApp");
const DonneesListe_Dispenses_1 = require("DonneesListe_Dispenses");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MethodesObjet_1 = require("MethodesObjet");
class TUtilitaireDispenses {
	constructor() {}
	static serialisationDonnees(aElement, aJSON) {
		_serialisation(aElement, aJSON);
	}
	static saisieDocument(
		aInstance,
		aDonnees,
		aConfirmation,
		aConfirmation_continue,
		aListeFichiersUpload,
	) {
		_saisieDocument(
			aInstance,
			aDonnees,
			aConfirmation,
			aConfirmation_continue,
			aListeFichiersUpload,
		);
	}
}
exports.TUtilitaireDispenses = TUtilitaireDispenses;
function _serialisation(aElement, aJSON) {
	aJSON.eleve = aElement.eleve;
	aJSON.classe = aElement.classe;
	aJSON.matiere = aElement.matiere;
	aJSON.placeDebut = aElement.placeDebut;
	aJSON.placeFin = aElement.placeFin;
	aJSON.dateDebut = aElement.dateDebut;
	aJSON.dateFin = aElement.dateFin;
	aJSON.commentaire = aElement.commentaire;
	aJSON.presenceOblig = aElement.presenceOblig;
	aJSON.publierPJFeuilleDAppel = aElement.publierPJFeuilleDAppel;
	aElement.documents.setSerialisateurJSON({
		methodeSerialisation: _serialisationDoc,
	});
	aJSON.documents = aElement.documents;
}
function _serialisationDoc(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
	aJSON.nomOriginal = aElement.nomOriginal;
}
function _saisieDocument(
	aInstance,
	aDonnees,
	aConfirmation,
	aConfirmation_continue,
	aListeFichiersUpload,
) {
	const lParametres = $.extend(
		{
			genreSaisie: null,
			eleve: (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve),
		},
		aDonnees,
	);
	if (aConfirmation) {
		lParametres.confirmation = aConfirmation;
	}
	lParametres.confirmation_continue = aConfirmation_continue;
	aInstance.listeFichiersUpload = aListeFichiersUpload;
	let lDoc;
	switch (lParametres.genreSaisie) {
		case DonneesListe_Dispenses_1.DonneesListe_Dispenses.genreAction
			.AjouterDocument: {
			const lIdx = aInstance.listeFichiersUpload.getIndiceElementParFiltre(
				(aElement) => {
					return aElement.idFichier === lParametres.idFichier;
				},
			);
			lDoc = aInstance.listeFichiersUpload.get(lIdx);
			lParametres.article.documents.addElement(lDoc);
			lParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aInstance.setEtatSaisie(true);
			break;
		}
		case DonneesListe_Dispenses_1.DonneesListe_Dispenses.genreAction
			.SupprimerDocument:
			if (!!lParametres.document) {
				lDoc = lParametres.article.documents.getElementParNumero(
					lParametres.document.getNumero(),
				);
				if (!!lDoc) {
					lDoc.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					lParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
				}
			}
			break;
		default:
			break;
	}
	if (aInstance.actionApresSaisieDocument) {
		aInstance.actionApresSaisieDocument();
	}
}

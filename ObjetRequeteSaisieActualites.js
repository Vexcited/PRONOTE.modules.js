const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
const { TypeChaineBrute } = require("TypeChaineBrute.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteSaisieActualites extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.validationDirecte = aParam.validationDirecte || false;
		this.saisieActualite = aParam.saisieActualite;
		this.genresAffDestinataire = aParam.genresAffDestinataire;
		aParam.listeActualite.setSerialisateurJSON({
			methodeSerialisation: _serialiser_Actualite.bind(this),
			ignorerEtatsElements: this.validationDirecte,
		});
		this.JSON.listeActualites = aParam.listeActualite;
		this.JSON.saisieActualite = this.saisieActualite;
		if (aParam.listeDocuments) {
			aParam.listeDocuments.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Document.bind(this),
			});
			this.JSON.listeDocuments = aParam.listeDocuments;
		}
		if (aParam.punition) {
			this.JSON.punition = aParam.punition;
		}
		if (aParam.incident) {
			this.JSON.incident = aParam.incident;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete(aGenreReponse) {
		this.callbackReussite.appel(aGenreReponse, this.JSONRapportSaisie);
	}
}
Requetes.inscrire("SaisieActualites", ObjetRequeteSaisieActualites);
function _serialiser_Actualite(aActualite, aJSON) {
	if (
		!!aActualite.estUneDiffusionDeResultatsSondage &&
		aActualite.getEtat() === EGenreEtat.Creation
	) {
		if (!!aActualite.listeQuestions) {
			aActualite.listeQuestions.parcourir((aQuestion) => {
				if (!!aQuestion && aQuestion.listePiecesJointes) {
					aQuestion.listePiecesJointes.parcourir((aPJ) => {
						aPJ.setEtat(EGenreEtat.Creation);
					});
				}
			});
		}
	}
	aJSON.validationDirecte = this.validationDirecte;
	if (aActualite.estADupliquer === true) {
		aJSON.estADupliquer = true;
		aJSON.dupliquerPublic = aActualite.dupliquerPublic === true;
		return;
	}
	if (aActualite.estAModeliser === true) {
		aJSON.estAModeliser = true;
		return;
	}
	aJSON.estModelePartage = aActualite.estModelePartage;
	if (!!aActualite.changePartageModeleSeulement) {
		aJSON.changePartageModeleSeulement = true;
		return;
	}
	aJSON.genrePublic = aActualite.genrePublic;
	aJSON.public = aActualite.public;
	aJSON.lue = aActualite.lue;
	aJSON.supprimee = !!aActualite.supprimee;
	aJSON.marqueLueSeulement = aActualite.marqueLueSeulement
		? aActualite.marqueLueSeulement
		: false;
	aJSON.saisieActualite = this.saisieActualite;
	aActualite.listeQuestions.setSerialisateurJSON({
		methodeSerialisation: _serialiser_ListeQuestions.bind(this),
		ignorerEtatsElements: this.saisieActualite,
	});
	aJSON.listeQuestions = aActualite.listeQuestions;
	if (this.saisieActualite) {
		aJSON.publie = aActualite.publie;
		aJSON.estModele = aActualite.estModele === true;
		aJSON.categorie = aActualite.categorie;
		aJSON.dateDebut = aActualite.dateDebut;
		aJSON.dateFin = aActualite.dateFin;
		aJSON.genreReponse = aActualite.genreReponse;
		aJSON.tailleReponse = aActualite.tailleReponse;
		aJSON.reponseAnonyme = aActualite.reponseAnonyme;
		aJSON.publicationPageEtablissement =
			aActualite.publicationPageEtablissement;
		if (!!aActualite.listeIndividusPartage) {
			aActualite.listeIndividusPartage.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			aJSON.listeIndividusPartage = aActualite.listeIndividusPartage;
		}
		if (aActualite.avecModificationPublic) {
			aJSON.avecModificationPublic = true;
			aJSON.avecElevesRattaches = aActualite.avecElevesRattaches;
			if (
				this.genresAffDestinataire &&
				this.genresAffDestinataire.includes(EGenreRessource.Eleve)
			) {
				aJSON.avecEleve = aActualite.avecEleve;
				aJSON.avecResp1 = aActualite.avecResp1;
				aJSON.avecResp2 = aActualite.avecResp2;
				aJSON.avecProfsPrincipaux = aActualite.avecProfsPrincipaux;
				aJSON.avecTuteurs = aActualite.avecTuteurs;
			}
			aJSON.genresPublicEntite = aActualite.genresPublicEntite;
			aJSON.avecDirecteur = aActualite.avecDirecteur;
			aActualite.listePublicEntite.setSerialisateurJSON({
				methodeSerialisation: null,
				ignorerEtatsElements: true,
			});
			aJSON.listePublicEntite = aActualite.listePublicEntite;
			aActualite.listePublicIndividu.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Individu.bind(this),
				ignorerEtatsElements: true,
			});
			aJSON.listePublicIndividu = aActualite.listePublicIndividu;
		}
	}
}
function _serialiser_ListeQuestions(aQuestion, aJSON) {
	if (this.saisieActualite) {
		$.extend(aJSON, aQuestion.copieToJSON());
		aJSON.texte = new TypeChaineBrute(aQuestion.texte);
		aQuestion.listeChoix.setSerialisateurJSON({
			methodeSerialisation: _serialiser_Choix.bind(this),
			ignorerEtatsElements: false,
			nePasTrierPourValidation: true,
		});
		aJSON.listeChoix = aQuestion.listeChoix;
		aQuestion.listePiecesJointes.setSerialisateurJSON({
			methodeSerialisation: _serialiser_Document.bind(this),
			ignorerEtatsElements: false,
		});
		aJSON.listePiecesJointes = aQuestion.listePiecesJointes;
	} else {
		aJSON.genreReponse = aQuestion.genreReponse;
		aJSON.reponse = aQuestion.reponse.toJSON();
		$.extend(aJSON.reponse, aQuestion.reponse.copieToJSON());
	}
}
function _serialiser_Document(aDocument, aJSON) {
	const lIdFichier =
		aDocument.idFichier !== undefined
			? aDocument.idFichier
			: aDocument.Fichier !== undefined
				? aDocument.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = GChaine.cardinalToStr(lIdFichier);
	}
	aJSON.nomFichier = aDocument.nomFichier;
	aJSON.url = aDocument.url;
}
function _serialiser_Individu(aIndividu, aJSON) {
	aJSON.N = aIndividu.getNumero();
	aJSON.G = aIndividu.getGenre();
	aJSON.E = undefined;
	aJSON.L = undefined;
}
function _serialiser_Choix(aChoix, aJSON) {
	aJSON.rang = aChoix.rang;
	if (aChoix.estReponseLibre) {
		aJSON.estReponseLibre = true;
	}
}
module.exports = { ObjetRequeteSaisieActualites };

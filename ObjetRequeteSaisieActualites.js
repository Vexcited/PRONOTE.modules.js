exports.ObjetRequeteSaisieActualites = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeChaineBrute_1 = require("TypeChaineBrute");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenrePublicPartageModeleActualite_1 = require("TypeGenrePublicPartageModeleActualite");
class ObjetRequeteSaisieActualites extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.validationDirecte = aParam.validationDirecte || false;
		this.saisieActualite = aParam.saisieActualite;
		this.genresAffDestinataire = aParam.genresAffDestinataire;
		aParam.listeActualite.setSerialisateurJSON({
			methodeSerialisation: this._serialiserActualite.bind(this),
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
	_serialiserActualite(aActualite, aJSON) {
		if (
			!!aActualite.estUneDiffusionDeResultatsSondage &&
			aActualite.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			if (!!aActualite.listeQuestions) {
				aActualite.listeQuestions.parcourir((aQuestion) => {
					if (!!aQuestion && aQuestion.listePiecesJointes) {
						aQuestion.listePiecesJointes.parcourir((aPJ) => {
							aPJ.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
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
		if (!!aActualite.changePartageModeleSeulement) {
			aJSON.changePartageModeleSeulement = true;
			aActualite.listeModalitesParPublic.setSerialisateurJSON({
				methodeSerialisation: _serialiserListeModalitesParPublic.bind(this),
				ignorerEtatsElements: true,
			});
			aJSON.listeModalitesParPublic = aActualite.listeModalitesParPublic;
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
			methodeSerialisation: this._serialiserListeQuestions.bind(this),
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
					this.genresAffDestinataire.includes(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					)
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
	_serialiserListeQuestions(aQuestion, aJSON) {
		if (this.saisieActualite) {
			$.extend(aJSON, aQuestion.copieToJSON());
			aJSON.texte = new TypeChaineBrute_1.TypeChaineBrute(aQuestion.texte);
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
}
exports.ObjetRequeteSaisieActualites = ObjetRequeteSaisieActualites;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieActualites",
	ObjetRequeteSaisieActualites,
);
function _serialiser_Document(aDocument, aJSON) {
	const lIdFichier =
		aDocument.idFichier !== undefined
			? aDocument.idFichier
			: aDocument.Fichier !== undefined
				? aDocument.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = ObjetChaine_1.GChaine.cardinalToStr(lIdFichier);
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
function _serialiserListeModalitesParPublic(aModalite, aJSON) {
	if (
		aModalite.typeModalite ===
			TypeGenrePublicPartageModeleActualite_1.TypeModalitePartageModeleActualite
				.tmpma_Personnalise &&
		aModalite.listeIndividuPersonnalises
	) {
		aModalite.listeIndividuPersonnalises.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aJSON.listeIndividuPersonnalises = aModalite.listeIndividuPersonnalises;
	}
	aJSON.typeModalite = aModalite.typeModalite;
}

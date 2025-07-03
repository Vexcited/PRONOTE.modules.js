exports.ObjetRequeteSaisieReleveDEvaluations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieReleveDEvaluations extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{
				ressource: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
				appreciationClasse: null,
			},
			aParams,
		);
		if (!!aParams.appreciationClasse) {
			this.JSON.appreciationClasse = {
				L: aParams.appreciationClasse.appreciation,
				rang: aParams.appreciationClasse.rang,
			};
		}
		if (!!aParams.listeColonnesRESIAffichables) {
			this.JSON.listeColonnesRESIAffichables.setSerialisateurJSON({
				methodeSerialisation: this._serialiseColonneAffichable,
			});
		}
		if (!!this.JSON.listeEleves) {
			this.JSON.listeEleves.setSerialisateurJSON({
				methodeSerialisation: this._serialiseEleve.bind(this),
			});
		}
		if (!!this.JSON.listeTypeAppreciations) {
			this.JSON.listeTypeAppreciations.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: this._serialiseTypeAppreciation.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
	_serialiseColonneAffichable(aColonne, aJSON) {
		aJSON.estAffiche = !!aColonne.estAffiche;
	}
	_serialiseEleve(aEleve, aJSON) {
		if (
			aEleve.posLSUNiveau &&
			aEleve.posLSUNiveau.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
		) {
			aJSON.posLSUNiveau = aEleve.posLSUNiveau;
		}
		if (aEleve.posLSUNote) {
			aJSON.posLSUNote = aEleve.posLSUNote;
		}
		if (!!aEleve.listeAppreciations) {
			aEleve.listeAppreciations.setSerialisateurJSON({
				methodeSerialisation: this._serialiseAppreciationEleve,
			});
			aJSON.listeAppreciations = aEleve.listeAppreciations;
		}
		if (
			aEleve.nivAcquiPilier &&
			aEleve.nivAcquiPilier.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
		) {
			aJSON.nivAcquiDomaine = aEleve.nivAcquiPilier;
		}
		if (aEleve.listeNiveauxDAcquisitions) {
			aEleve.listeNiveauxDAcquisitions.setSerialisateurJSON({
				methodeSerialisation: this._serialiseNiveauDAcquisition,
			});
			aJSON.listeNiveauxDAcquisitions = aEleve.listeNiveauxDAcquisitions;
		}
		if (aEleve.listeValeursColonnesLSL) {
			aEleve.listeValeursColonnesLSL.setSerialisateurJSON({
				methodeSerialisation: this._serialiseColonneLSL,
			});
			aJSON.listeValeursColonnesLSL = aEleve.listeValeursColonnesLSL;
		}
	}
	_serialiseAppreciationEleve(aAppreciation, aJSON) {
		aJSON.valeur = aAppreciation.valeur;
		aJSON.rang = aAppreciation.getGenre();
	}
	_serialiseNiveauDAcquisition(aNiveauDAcquisition, aJSON) {
		aJSON.observation = aNiveauDAcquisition.observation;
		aJSON.observationPubliee = aNiveauDAcquisition.observationPubliee;
		aJSON.relation = new ObjetElement_1.ObjetElement(
			"",
			aNiveauDAcquisition.numeroRESI,
		);
	}
	_serialiseColonneLSL(aColonneLSL, aJSON) {
		aJSON.niveau = aColonneLSL.niveau;
	}
	_serialiseTypeAppreciation(aTypeAppreciation, aJSON) {
		if (!!aTypeAppreciation.listeCategories) {
			aTypeAppreciation.listeCategories.setSerialisateurJSON({
				methodeSerialisation: this._serialiseCategorieAppreciation,
			});
			aJSON.listeCategories = aTypeAppreciation.listeCategories;
		}
	}
	_serialiseCategorieAppreciation(aCategorie, aJSON) {
		if (!!aCategorie.listeAppreciations) {
			aJSON.listeAppreciations = aCategorie.listeAppreciations;
		}
	}
}
exports.ObjetRequeteSaisieReleveDEvaluations =
	ObjetRequeteSaisieReleveDEvaluations;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieReleveDEvaluations",
	ObjetRequeteSaisieReleveDEvaluations,
);

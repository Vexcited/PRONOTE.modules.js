const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteSaisieReleveDEvaluations extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{
				ressource: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Classe,
				),
				periode: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Periode,
				),
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
				methodeSerialisation: _serialiseColonneAffichable,
			});
		}
		if (!!this.JSON.listeEleves) {
			this.JSON.listeEleves.setSerialisateurJSON({
				methodeSerialisation: _serialiseEleve,
			});
		}
		if (!!this.JSON.listeTypeAppreciations) {
			this.JSON.listeTypeAppreciations.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiseTypeAppreciation,
			});
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"SaisieReleveDEvaluations",
	ObjetRequeteSaisieReleveDEvaluations,
);
function _serialiseColonneAffichable(aColonne, aJSON) {
	aJSON.estAffiche = !!aColonne.estAffiche;
}
function _serialiseEleve(aEleve, aJSON) {
	if (
		aEleve.posLSUNiveau &&
		aEleve.posLSUNiveau.getEtat() !== EGenreEtat.Aucun
	) {
		aJSON.posLSUNiveau = aEleve.posLSUNiveau;
	}
	if (aEleve.posLSUNote) {
		aJSON.posLSUNote = aEleve.posLSUNote;
	}
	if (!!aEleve.listeAppreciations) {
		aEleve.listeAppreciations.setSerialisateurJSON({
			methodeSerialisation: _serialiseAppreciationEleve,
		});
		aJSON.listeAppreciations = aEleve.listeAppreciations;
	}
	if (
		aEleve.nivAcquiPilier &&
		aEleve.nivAcquiPilier.getEtat() !== EGenreEtat.Aucun
	) {
		aJSON.nivAcquiDomaine = aEleve.nivAcquiPilier;
	}
	if (aEleve.listeNiveauxDAcquisitions) {
		aEleve.listeNiveauxDAcquisitions.setSerialisateurJSON({
			methodeSerialisation: _serialiseNiveauDAcquisition,
		});
		aJSON.listeNiveauxDAcquisitions = aEleve.listeNiveauxDAcquisitions;
	}
	if (aEleve.listeValeursColonnesLSL) {
		aEleve.listeValeursColonnesLSL.setSerialisateurJSON({
			methodeSerialisation: _serialiseColonneLSL,
		});
		aJSON.listeValeursColonnesLSL = aEleve.listeValeursColonnesLSL;
	}
}
function _serialiseAppreciationEleve(aAppreciation, aJSON) {
	aJSON.valeur = aAppreciation.valeur;
	aJSON.rang = aAppreciation.getGenre();
}
function _serialiseNiveauDAcquisition(aNiveauDAcquisition, aJSON) {
	aJSON.observation = aNiveauDAcquisition.observation;
	aJSON.observationPubliee = aNiveauDAcquisition.observationPubliee;
	aJSON.relation = new ObjetElement("", aNiveauDAcquisition.numeroRESI);
}
function _serialiseColonneLSL(aColonneLSL, aJSON) {
	aJSON.niveau = aColonneLSL.niveau;
}
function _serialiseTypeAppreciation(aTypeAppreciation, aJSON) {
	if (!!aTypeAppreciation.listeCategories) {
		aTypeAppreciation.listeCategories.setSerialisateurJSON({
			methodeSerialisation: _serialiseCategorieAppreciation,
		});
		aJSON.listeCategories = aTypeAppreciation.listeCategories;
	}
}
function _serialiseCategorieAppreciation(aCategorie, aJSON) {
	if (!!aCategorie.listeAppreciations) {
		aJSON.listeAppreciations = aCategorie.listeAppreciations;
	}
}
module.exports = ObjetRequeteSaisieReleveDEvaluations;

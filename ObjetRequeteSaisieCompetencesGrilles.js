exports.CommandeSaisieCompetencesGrilles =
	exports.ObjetRequeteSaisieCompetencesGrilles = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieCompetencesGrilles extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{
				palier: !!aParams.palier
					? aParams.palier
					: this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Palier,
						),
				commande: "",
				genreReferentiel: "",
			},
			aParams,
		);
		if (aParams.referentiel) {
			this.JSON.referentiel = aParams.referentiel.toJSON();
			this.JSON.referentiel.estLVE = aParams.referentiel.estLVE;
		}
		if (aParams.listeClasses) {
			this.JSON.listeClasses = aParams.listeClasses.getListeElements((D) => {
				return D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression;
			});
			this.JSON.listeClasses.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (aParams.referentiels) {
			this.JSON.referentiels.setSerialisateurJSON({
				methodeSerialisation: function (aReferentiel, aJSON) {
					if (aReferentiel.estLVE !== undefined) {
						aJSON.estLVE = aReferentiel.estLVE;
					}
				},
				ignorerEtatsElements: true,
			});
		}
		if (aParams.elementsCompetence) {
			this.JSON.elementsCompetence.setSerialisateurJSON({
				methodeSerialisation: function (aElementCompetence, aJSON) {
					if (aElementCompetence.evaluableEditable) {
						aJSON.evaluable = aElementCompetence.evaluable;
					}
					if (aElementCompetence.estPartageEditable) {
						aJSON.estPartage = aElementCompetence.estPartage;
					}
					if (
						aElementCompetence.coefficient &&
						aElementCompetence.coefficientEditable
					) {
						aJSON.coefficient = aElementCompetence.coefficient;
					}
					if (aElementCompetence.libelleBulletin) {
						aJSON.libelleBulletin = aElementCompetence.libelleBulletin;
					}
					if (aElementCompetence.pere) {
						aJSON.pere = aElementCompetence.pere;
					}
					if (aElementCompetence.listeRestrictionsNiveaux) {
						aJSON.listeRestrictionsNiveaux =
							aElementCompetence.listeRestrictionsNiveaux;
					}
				},
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete(aGenreReponse) {
		this.callbackReussite.appel(
			this.JSONRapportSaisie,
			this.JSONReponse,
			aGenreReponse,
		);
	}
}
exports.ObjetRequeteSaisieCompetencesGrilles =
	ObjetRequeteSaisieCompetencesGrilles;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCompetencesGrilles",
	ObjetRequeteSaisieCompetencesGrilles,
);
var CommandeSaisieCompetencesGrilles;
(function (CommandeSaisieCompetencesGrilles) {
	CommandeSaisieCompetencesGrilles["saisieClasses"] = "saisieClasses";
	CommandeSaisieCompetencesGrilles["saisieReferentiel"] = "saisieReferentiel";
	CommandeSaisieCompetencesGrilles["suppressionReferentiel"] =
		"suppressionReferentiel";
	CommandeSaisieCompetencesGrilles["creationRelationReferentiel"] =
		"creationRelationReferentiel";
	CommandeSaisieCompetencesGrilles["suppressionRelationReferentiel"] =
		"suppressionRelationReferentiel";
	CommandeSaisieCompetencesGrilles["creationElementsCompetence"] =
		"creationElementsCompetence";
	CommandeSaisieCompetencesGrilles["editionElementsCompetenceLibelle"] =
		"editionElementsCompetenceLibelle";
	CommandeSaisieCompetencesGrilles["editionElementsCompetenceNivEquivalence"] =
		"editionElementsCompetenceNivEquivalence";
	CommandeSaisieCompetencesGrilles["editionElementsCompetenceLibelleBulletin"] =
		"editionElementsCompetenceLibelleBulletin";
	CommandeSaisieCompetencesGrilles["editionElementsCompetenceCoefficient"] =
		"editionElementsCompetenceCoefficient";
	CommandeSaisieCompetencesGrilles["editionElementsCompetenceEvaluable"] =
		"editionElementsCompetenceEvaluable";
	CommandeSaisieCompetencesGrilles["editionElementsCompetencePartage"] =
		"editionElementsCompetencePartage";
	CommandeSaisieCompetencesGrilles["suppressionElementsCompetence"] =
		"suppressionElementsCompetence";
	CommandeSaisieCompetencesGrilles["saisieDomainesDuSocleAssocie"] =
		"saisieDomainesDuSocleAssocie";
	CommandeSaisieCompetencesGrilles["saisieElementSignifiant"] =
		"saisieElementSignifiant";
	CommandeSaisieCompetencesGrilles["saisieRestrictionsNiveaux"] =
		"saisieRestrictionsNiveaux";
	CommandeSaisieCompetencesGrilles["echOrdreReferentiels"] =
		"echangerOrdreReferentiels";
	CommandeSaisieCompetencesGrilles["echOrdreElementsCompetence"] =
		"echangerOrdreElementsCompetence";
	CommandeSaisieCompetencesGrilles["collerElementsCompetence"] =
		"collerElementsCompetence";
	CommandeSaisieCompetencesGrilles["collerGrille"] = "collerGrille";
	CommandeSaisieCompetencesGrilles["saisieParametrageGrille"] =
		"saisieParametrageGrille";
	CommandeSaisieCompetencesGrilles["saisieElementCompetenceApprentissage"] =
		"saisieElementCompetenceApprentissage";
})(
	CommandeSaisieCompetencesGrilles ||
		(exports.CommandeSaisieCompetencesGrilles =
			CommandeSaisieCompetencesGrilles =
				{}),
);

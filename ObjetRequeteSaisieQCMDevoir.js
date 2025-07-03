exports.ObjetRequeteSaisieQCMDevoir = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
class ObjetRequeteSaisieQCMDevoir extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		const lDevoir = aParametres.devoir.toJSON();
		lDevoir.service = aParametres.devoir.service.toJSON();
		lDevoir.estDevoirEditable = aParametres.devoir.estDevoirEditable;
		lDevoir.date = aParametres.devoir.date;
		lDevoir.coefficient = aParametres.devoir.coefficient;
		lDevoir.bareme = aParametres.devoir.bareme;
		lDevoir.commentaire = aParametres.devoir.commentaire;
		lDevoir.datePublication = aParametres.devoir.datePublication;
		for (let i = 0; i < aParametres.devoir.listeClasses.count(); i++) {
			const lClasse = aParametres.devoir.listeClasses.get(i);
			lClasse.listePeriodes = lClasse.listePeriodes
				.setSerialisateurJSON({
					ignorerEtatsElements: true,
					nePasTrierPourValidation: true,
				})
				.toJSON();
		}
		lDevoir.listeClasses = aParametres.devoir.listeClasses.setSerialisateurJSON(
			{
				ignorerEtatsElements: true,
				methodeSerialisation: serialiserClasse,
				nePasTrierPourValidation: true,
			},
		);
		lDevoir.listeEleves = aParametres.devoir.listeEleves;
		lDevoir.ramenerSur20 = aParametres.devoir.ramenerSur20;
		lDevoir.commeUnBonus = aParametres.devoir.commeUnBonus;
		lDevoir.commeUneNote = aParametres.devoir.commeUneNote;
		lDevoir.verrouille = aParametres.devoir.verrouille;
		let lListeCompetences;
		if (
			aParametres.devoir.executionQCM &&
			aParametres.devoir.executionQCM.estLieAEvaluation &&
			aParametres.devoir.executionQCM.listeCompetences
		) {
			lListeCompetences = aParametres.devoir.executionQCM.listeCompetences;
			lDevoir.avecCompetencesDeQCM = true;
		} else if (
			aParametres.devoir.evaluation &&
			aParametres.devoir.evaluation.listeCompetences
		) {
			lListeCompetences = aParametres.devoir.evaluation.listeCompetences;
		}
		if (lListeCompetences && lListeCompetences.count() > 0) {
			lDevoir.avecCreationEvaluation = true;
			lListeCompetences.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: serialiserCompetences,
				nePasTrierPourValidation: true,
			});
			lDevoir.listeCompetences = lListeCompetences;
		}
		lDevoir.executionQCM = aParametres.devoir.executionQCM.toJSON();
		new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
			aParametres.devoir.executionQCM,
			lDevoir.executionQCM,
		);
		this.JSON = { devoir: lDevoir };
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieQCMDevoir = ObjetRequeteSaisieQCMDevoir;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMDevoir",
	ObjetRequeteSaisieQCMDevoir,
);
function serialiserCompetences(aElement, aJSON) {
	aJSON.coefficient = aElement.coefficient;
}
function serialiserClasse(aElement, aJSON) {
	aJSON.listePeriodes = aElement.listePeriodes;
	aJSON.service = aElement.service.toJSON();
}

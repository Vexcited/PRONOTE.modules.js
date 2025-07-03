exports.ObjetRequeteSaisieNotes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_RessourceArrondi_1 = require("Enumere_RessourceArrondi");
const ObjetSerialiser_1 = require("ObjetSerialiser");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
class ObjetRequeteSaisieNotes extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON = { periode: aParam.periode, service: aParam.service.toJSON() };
		if (!!aParam.service) {
			if (!aParam.service.estUnService) {
				this.JSON.service.coefficient = aParam.service.periode.coefficient;
			} else if (aParam.service.coefficientGeneral) {
				this.JSON.service.coefficientGeneral =
					aParam.service.coefficientGeneral;
			}
			this.JSON.service.facultatif = aParam.service.facultatif;
			this.JSON.service.moyenneParSousMatiere =
				aParam.service.periode.moyenneParSousMatiere;
			this.JSON.service.moyenneBulletinSurClasse =
				aParam.service.periode.moyenneBulletinSurClasse;
			this.JSON.service.avecDevoirSupMoy =
				aParam.service.periode.avecDevoirSupMoy;
			this.JSON.service.avecBonusMalus = aParam.service.periode.avecBonusMalus;
			this.JSON.service.ponderationNotePlusHaute =
				aParam.service.periode.ponderationNotePlusHaute;
			this.JSON.service.ponderationNotePlusBasse =
				aParam.service.periode.ponderationNotePlusBasse;
			this.JSON.service.arrondiEleve =
				aParam.service.periode.arrondis[
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant
				];
			this.JSON.service.arrondiClasse =
				aParam.service.periode.arrondis[
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion
				];
		}
		if (!!aParam.listeEleves) {
			aParam.listeEleves.setSerialisateurJSON({
				methodeSerialisation: _serialiseEleve.bind(this, aParam.periode),
			});
			this.JSON.listeEleves = aParam.listeEleves;
		}
		if (!!aParam.listeDevoirs) {
			aParam.listeDevoirs.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiseDevoir.bind(this, aParam.service),
			});
			this.JSON.listeDevoirs = aParam.listeDevoirs;
		}
		if (!!aParam.listeSujetsEtCorriges) {
			aParam.listeSujetsEtCorriges.setSerialisateurJSON({
				methodeSerialisation: _serialisationListeSujetsEtCorriges,
			});
			this.JSON.listeFichiers = aParam.listeSujetsEtCorriges;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
exports.ObjetRequeteSaisieNotes = ObjetRequeteSaisieNotes;
CollectionRequetes_1.Requetes.inscrire("SaisieNotes", ObjetRequeteSaisieNotes);
function _serialiseEleve(aPeriode, aElement, AJSON) {
	let lPeriodeEleve = null;
	if (!!aPeriode && !!aElement.listePeriodes) {
		lPeriodeEleve = aElement.listePeriodes.getElementParNumero(
			aPeriode.getNumero(),
		);
	}
	if (!!lPeriodeEleve) {
		AJSON.bonusMalus = lPeriodeEleve.bonusMalus;
	}
}
function _serialiseDevoir(aService, aElement, AJSON) {
	AJSON.date = aElement.date;
	AJSON.coefficient = aElement.coefficient;
	AJSON.verrouille = aElement.verrouille;
	AJSON.commeUnBonus = aElement.commeUnBonus;
	AJSON.commeUneNote = aElement.commeUneNote;
	AJSON.commentaire = aElement.commentaire;
	AJSON.bareme = aElement.bareme;
	AJSON.ramenerSur20 = aElement.ramenerSur20;
	AJSON.datePublication = aElement.datePublication;
	AJSON.categorie = aElement.categorie;
	AJSON.avecCommentaireSurNoteEleve = aElement.avecCommentaireSurNoteEleve;
	if (aElement.ListeThemes) {
		AJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
	}
	if (
		!aService ||
		(!!aElement.service &&
			aService.getNumero() !== aElement.service.getNumero())
	) {
		AJSON.service = aElement.service;
	}
	if (!!aElement.executionQCM && aElement.executionQCM.pourValidation()) {
		AJSON.executionQCM = aElement.executionQCM.toJSON();
		new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
			aElement.executionQCM,
			AJSON.executionQCM,
		);
		if (
			aElement.executionQCM.estLieAEvaluation &&
			aElement.executionQCM.listeCompetences &&
			aElement.executionQCM.listeCompetences.count() > 0
		) {
			AJSON.executionQCM.estLieAEvaluation = true;
			aElement.executionQCM.listeCompetences.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: serialiserCompetenceDeQCM,
				nePasTrierPourValidation: true,
			});
			AJSON.executionQCM.listeCompetences =
				aElement.executionQCM.listeCompetences;
		}
	}
	if (!!aElement.execKiosque && aElement.execKiosque.pourValidation()) {
		AJSON.execKiosque = aElement.execKiosque.toJSON();
		new ObjetSerialiser_1.ObjetSerialiser().executionKiosque(
			aElement.execKiosque,
			AJSON.execKiosque,
		);
	}
	if (!!aElement.listeSujets) {
		AJSON.listeSujets = aElement.listeSujets;
	}
	if (!!aElement.listeCorriges) {
		AJSON.listeCorriges = aElement.listeCorriges;
	}
	if (!!aElement.listeClasses) {
		aElement.listeClasses.setSerialisateurJSON({
			ignorerEtatsElements: true,
			methodeSerialisation: _serialiseClasseDeDevoir,
		});
		AJSON.listeClasses = aElement.listeClasses;
	}
	if (!!aElement.listeEleves) {
		aElement.listeEleves.setSerialisateurJSON({
			methodeSerialisation: _serialiseEleveDeDevoir,
		});
		AJSON.listeEleves = aElement.listeEleves.toJSON();
	}
	AJSON.evaluation = aElement.evaluation;
	if (aElement.evaluation) {
		let lValeurCreationCompetence = false;
		if (!!aElement.evaluation.listeCompetences) {
			aElement.evaluation.listeCompetences.parcourir((D) => {
				if (D.pourValidation()) {
					lValeurCreationCompetence = true;
					return false;
				}
			});
			if (lValeurCreationCompetence) {
				aElement.evaluation.listeCompetences.setSerialisateurJSON({
					methodeSerialisation: _serialiseCompetenceDEvaluation,
				});
				AJSON.listeCompetences = aElement.evaluation.listeCompetences;
			}
		}
	}
	return aElement.pourValidation() || AJSON.listeEleves.length > 0;
}
function serialiserCompetenceDeQCM(aCompetenceQCM, aJSON) {
	aJSON.coefficient = aCompetenceQCM.coefficient;
	aJSON.listeQuestions = aCompetenceQCM.listeQuestions.setSerialisateurJSON({
		ignorerEtatsElements: true,
		nePasTrierPourValidation: true,
	});
}
function _serialiseCompetenceDEvaluation(aCompetence, aJSON) {
	aJSON.coefficient = aCompetence.coefficient;
	aJSON.relationESI = aCompetence.relationESI;
	aJSON.ordre = aCompetence.Position;
}
function _serialiseClasseDeDevoir(aElement, AJSON) {
	AJSON.service = aElement.service;
	if (!!aElement.listePeriodes) {
		if (aElement.listePeriodes.count() > 0) {
			AJSON.periodePrincipale = aElement.listePeriodes.get(0);
		}
		if (aElement.listePeriodes.count() > 1) {
			AJSON.periodeSecondaire = aElement.listePeriodes.get(1);
		}
	}
}
function _serialiseEleveDeDevoir(aElement, AJSON) {
	if (!!aElement.Note) {
		AJSON.note = aElement.Note;
	}
}
function _serialisationListeSujetsEtCorriges(aElement, aJSON) {
	const lIdFichier =
		aElement.idFichier !== undefined
			? aElement.idFichier
			: aElement.Fichier !== undefined
				? aElement.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = "" + lIdFichier;
	}
	if (aElement.url) {
		aJSON.url = aElement.url;
	}
}

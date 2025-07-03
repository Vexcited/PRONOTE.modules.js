exports.ObjetUtilitaireEvaluation = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetUtilitaireDevoirEvaluation_1 = require("ObjetUtilitaireDevoirEvaluation");
class ObjetUtilitaireEvaluation {
	constructor() {}
	static getDatePublicationEvaluationParDefaut(aDateEvaluation) {
		return ObjetDate_1.GDate.getDateBornee(
			ObjetUtilitaireDevoirEvaluation_1.ObjetUtilitaireDevoirEvaluation.getProchaineDateOuvreePourPublication(
				aDateEvaluation,
			),
		);
	}
	static creerNouvelleEvaluationQCM(aQCM, aService, aPeriodeParDefaut) {
		const lEvaluationVide = new ObjetElement_1.ObjetElement(aQCM.getLibelle());
		lEvaluationVide.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		UtilitaireQCM_1.UtilitaireQCM.surSelectionQCM(lEvaluationVide, aQCM, {
			genreAucune: Enumere_Ressource_1.EGenreRessource.Aucune,
			genreExecQCM: Enumere_Ressource_1.EGenreRessource.ExecutionQCM,
		});
		lEvaluationVide.service = aService;
		lEvaluationVide.dateValidation = ObjetDate_1.GDate.getDateCourante();
		lEvaluationVide.datePublication =
			ObjetUtilitaireEvaluation.getDatePublicationEvaluationParDefaut(
				lEvaluationVide.dateValidation,
			);
		lEvaluationVide.periode = aPeriodeParDefaut;
		lEvaluationVide.periodeSecondaire = null;
		lEvaluationVide.coefficient = 1;
		lEvaluationVide.priseEnCompteDansBilan = true;
		lEvaluationVide.avecDevoir = false;
		const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
		const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
			GParametres.PlacesParJour - 1,
			true,
		);
		lEvaluationVide.executionQCM.dateDebutPublication = new Date(
			lEvaluationVide.dateValidation.setHours(
				lPremiereHeure.getHours(),
				lPremiereHeure.getMinutes(),
			),
		);
		lEvaluationVide.executionQCM.dateFinPublication = new Date(
			lEvaluationVide.dateValidation.setHours(
				lDerniereHeure.getHours(),
				lDerniereHeure.getMinutes(),
			),
		);
		UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(
			lEvaluationVide.executionQCM,
		);
		return lEvaluationVide;
	}
	static initEvaluation(aEvaluation, aListeEleves) {
		function _initCompetence(aCompetence, aEleve) {
			aCompetence.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
			if (
				MethodesObjet_1.MethodesObjet.isUndefined(
					aCompetence.niveauDAcquisition,
				)
			) {
				aCompetence.niveauDAcquisition = new ObjetElement_1.ObjetElement();
				aCompetence.observation = "";
			}
			let lTrouve = false;
			aEleve.listePiliers.parcourir((aPilier) => {
				if (
					aPilier.getNumero() === aCompetence.pilier.getNumero() &&
					(!aPilier.palier ||
						!aCompetence.palier ||
						aPilier.palier.getNumero() === aCompetence.palier.getNumero())
				) {
					lTrouve = true;
					return false;
				}
			});
			if (!lTrouve) {
				aCompetence.competenceNonAffecteeClasseEleve = true;
			}
			let lCompetenceEstEditableSelonNiveauClasseEleve = true;
			if (
				aCompetence.listeNiveauxRestrictions &&
				aCompetence.listeNiveauxRestrictions.count() > 0 &&
				aEleve.classe &&
				aEleve.classe.niveau
			) {
				lCompetenceEstEditableSelonNiveauClasseEleve =
					!!aCompetence.listeNiveauxRestrictions.getElementParNumero(
						aEleve.classe.niveau.getNumero(),
					);
			}
			aCompetence.estEditableSelonNiveauClasseEleve =
				lCompetenceEstEditableSelonNiveauClasseEleve;
		}
		function _estDansLaClasse(aListeEleves, aEleve, aDate) {
			if (
				aEvaluation.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
			) {
				return true;
			}
			if (aListeEleves) {
				const lEleve = aListeEleves.getElementParElement(aEleve);
				for (let J = 0; J < lEleve.dateDebut.length; J++) {
					if (
						ObjetDate_1.GDate.dateEntreLesDates(
							aDate,
							lEleve.dateDebut[J],
							lEleve.dateFin[J],
						)
					) {
						return true;
					}
				}
			}
			return false;
		}
		aEvaluation.enCache = true;
		if (!aEvaluation.listeEleves) {
			aEvaluation.listeEleves = new ObjetListeElements_1.ObjetListeElements();
			const lPeriodeCache = _recherchePeriodeDansCache(
				aEvaluation.periode.getNumero(),
			);
			if (aListeEleves) {
				aListeEleves.parcourir((aEleve) => {
					if (
						!lPeriodeCache ||
						_elevePresentEntreLesDates(
							aEleve,
							lPeriodeCache.dateDebut,
							lPeriodeCache.dateFin,
						)
					) {
						aEvaluation.listeEleves.addElement(
							MethodesObjet_1.MethodesObjet.dupliquer(aEleve),
						);
					}
				});
			}
		}
		for (let i = 0, lNb = aEvaluation.listeEleves.count(); i < lNb; i++) {
			let lEleve = aEvaluation.listeEleves.get(i);
			lEleve.estSortiDeLaClasse = !_estDansLaClasse(
				aListeEleves,
				lEleve,
				aEvaluation.dateValidation,
			);
			lEleve.Actif =
				aEvaluation.getGenre() !==
					Enumere_Ressource_1.EGenreRessource.EvaluationHistorique &&
				!lEleve.estSortiDeLaClasse;
			if (!lEleve.listeCompetences) {
				lEleve.listeCompetences = new ObjetListeElements_1.ObjetListeElements();
				for (
					let j = 0, lNb2 = aEvaluation.listeCompetences.count();
					j < lNb2;
					j++
				) {
					lEleve.listeCompetences.addElement(
						MethodesObjet_1.MethodesObjet.dupliquer(
							aEvaluation.listeCompetences.get(j),
							true,
						),
					);
				}
				for (let j = 0, lNb2 = lEleve.listeCompetences.count(); j < lNb2; j++) {
					_initCompetence(lEleve.listeCompetences.get(j), lEleve);
				}
			} else {
				const lListeCompetences = new ObjetListeElements_1.ObjetListeElements();
				for (let j = 0; j < aEvaluation.listeCompetences.count(); j++) {
					let lCompetence = aEvaluation.listeCompetences.get(j);
					if (lCompetence.existe()) {
						let lElementDEleve = this.getElementCompetenceParNumeroRelationESI(
							lEleve.listeCompetences,
							lCompetence,
						);
						if (!lElementDEleve) {
							lElementDEleve =
								MethodesObjet_1.MethodesObjet.dupliquer(lCompetence);
							_initCompetence(lElementDEleve, lEleve);
						}
						lListeCompetences.addElement(lElementDEleve);
					}
				}
				lEleve.listeCompetences = lListeCompetences;
			}
		}
	}
	static getElementCompetenceParNumeroRelationESI(
		aListeCompetences,
		aCompetenceRecherchee,
	) {
		let lResult = null;
		if (
			aListeCompetences &&
			aCompetenceRecherchee &&
			aCompetenceRecherchee.relationESI
		) {
			const lNumeroRelationESI = aCompetenceRecherchee.relationESI.getNumero();
			aListeCompetences.parcourir((aElement) => {
				if (
					aElement &&
					aElement.relationESI &&
					aElement.relationESI.getNumero() === lNumeroRelationESI
				) {
					lResult = aElement;
					return false;
				}
			});
		}
		return lResult;
	}
	static calculerAvecEvaluation(aEvaluation) {
		if (aEvaluation) {
			aEvaluation.avecEvaluation = false;
			if (!!aEvaluation.listeCompetences) {
				aEvaluation.listeCompetences.parcourir((D) => {
					D.avecEvaluation = false;
				});
			}
			for (let I = 0; I < aEvaluation.listeEleves.count(); I++) {
				let lEleve = aEvaluation.listeEleves.get(I);
				for (let J = 0; J < lEleve.listeCompetences.count(); J++) {
					let lCompetenceEleve = lEleve.listeCompetences.get(J);
					if (lCompetenceEleve.niveauDAcquisition.getNumero()) {
						aEvaluation.avecEvaluation = true;
						let lCompetenceEvaluation =
							this.getElementCompetenceParNumeroRelationESI(
								aEvaluation.listeCompetences,
								lCompetenceEleve,
							);
						if (lCompetenceEvaluation) {
							lCompetenceEvaluation.avecEvaluation = true;
						}
					}
				}
			}
		}
	}
	static estSurPeriodeClotureePourSaisieCompetences(aEvaluation) {
		let lEstSurPeriodeCloturee = false;
		if (!!aEvaluation) {
			lEstSurPeriodeCloturee =
				!!aEvaluation.periodeCloturee ||
				!!aEvaluation.periodeSecondaireCloturee;
		}
		return lEstSurPeriodeCloturee;
	}
	static estSurPeriodeClotureePourSaisieNotes(aEvaluation) {
		let lEstSurPeriodeCloturee = false;
		if (!!aEvaluation && !!aEvaluation.listePeriodes) {
			aEvaluation.listePeriodes.parcourir((D) => {
				if (
					(!!aEvaluation.periode &&
						aEvaluation.periode.getNumero() === D.getNumero()) ||
					(!!aEvaluation.periodeSecondaire &&
						aEvaluation.periodeSecondaire.getNumero() === D.getNumero())
				) {
					lEstSurPeriodeCloturee = D.estNotationCloturee;
					if (lEstSurPeriodeCloturee) {
						return false;
					}
				}
			});
		}
		return lEstSurPeriodeCloturee;
	}
}
exports.ObjetUtilitaireEvaluation = ObjetUtilitaireEvaluation;
function _recherchePeriodeDansCache(aNumeroPeriode) {
	const lParametresSco = GParametres;
	if (!lParametresSco.listeComboPeriodes) {
		return null;
	}
	let lResult = null;
	lParametresSco.listeComboPeriodes.parcourir((aPeriode) => {
		if (
			aPeriode.periodeNotation &&
			aPeriode.periodeNotation.getNumero() === aNumeroPeriode
		) {
			lResult = aPeriode;
			return false;
		}
	});
	return lResult;
}
function _elevePresentEntreLesDates(aEleve, aDateDebut, aDateFin) {
	for (let J = 0; J < aEleve.dateDebut.length; J++) {
		if (
			(!aDateFin || aEleve.dateDebut[J] < aDateFin) &&
			(!aDateDebut || aEleve.dateFin[J] > aDateDebut)
		) {
			return true;
		}
	}
	return false;
}

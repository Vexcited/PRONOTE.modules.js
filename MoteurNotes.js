exports.MoteurNotes = void 0;
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const TypeNote_1 = require("TypeNote");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EleveDansDevoir_1 = require("Enumere_EleveDansDevoir");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_PeriodeDeNotation_1 = require("Enumere_PeriodeDeNotation");
const ObjetUtilitaireDevoir_1 = require("ObjetUtilitaireDevoir");
const AccessApp_1 = require("AccessApp");
class MoteurNotes {
	constructor(aParam) {
		this.estMoteurHP = false;
		this.setContexte(aParam);
		this.estMoteurPN = true;
	}
	setContexte(aParam) {
		this.periode =
			aParam !== null && aParam !== undefined ? aParam.periodeParDefaut : null;
	}
	eleveDansDevoir(aEleve, aDevoir) {
		let lDansClasse = aEleve.classe.datesDebut.length === 0;
		for (let i = 0, lNbr = aEleve.classe.datesDebut.length; i < lNbr; i++) {
			if (
				aDevoir.date >= aEleve.classe.datesDebut[i] &&
				aDevoir.date <= aEleve.classe.datesFin[i]
			) {
				lDansClasse = true;
			}
		}
		let lDansGroupe = aEleve.groupe.datesDebut.length === 0;
		for (let i = 0, lNbr = aEleve.groupe.datesDebut.length; i < lNbr; i++) {
			if (
				aDevoir.date >= aEleve.groupe.datesDebut[i] &&
				aDevoir.date <= aEleve.groupe.datesFin[i]
			) {
				lDansGroupe = true;
			}
		}
		return lDansClasse && lDansGroupe
			? Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Oui
			: Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non;
	}
	devoirDansPeriode(aDevoir, aEleve, aNumeroPeriode) {
		try {
			return aDevoir.dansPeriode[
				aEleve === null || aEleve === undefined ? 0 : aEleve.classe.getNumero()
			][
				aNumeroPeriode === null || aNumeroPeriode === undefined
					? this.periode.getNumero()
					: aNumeroPeriode
			];
		} catch (e) {
			return true;
		}
	}
	controlerElevesClotures(aParam) {
		if (aParam.listeDevoirs === null || aParam.listeDevoirs === undefined) {
			return;
		}
		aParam.listeDevoirs.parcourir((aDevoir) => {
			const lListeElevesDevoir = aDevoir.listeEleves;
			if (lListeElevesDevoir === null || lListeElevesDevoir === undefined) {
				return;
			}
			lListeElevesDevoir.parcourir((aEleveDevoir) => {
				const lEleve = aParam.listeEleves.getElementParNumero(
					aEleveDevoir.getNumero(),
				);
				if (lEleve && lEleve.classe) {
					const lClasseDevoir = aDevoir.listeClasses.getElementParNumero(
						lEleve.classe.getNumero(),
					);
					if (lClasseDevoir) {
						aEleveDevoir.Actif = true;
						lClasseDevoir.listePeriodes.parcourir((aPeriode) => {
							if (
								this.laPeriodeEstClotureePourNotation({
									periode: aPeriode,
									listeClasses:
										new ObjetListeElements_1.ObjetListeElements().addElement(
											lClasseDevoir,
										),
								})
							) {
								aEleveDevoir.Actif = false;
							}
						});
					} else {
						aEleveDevoir.Actif = false;
					}
				}
			});
		});
	}
	avecCreationDevoir(aParam) {
		return (
			aParam.service.getActif() &&
			aParam.periode.existeNumero() &&
			!aParam.clotureGlobal
		);
	}
	laPeriodeEstClotureePourNotation(aParam) {
		if (!aParam.periode.existeNumero()) {
			return false;
		}
		let lEstCloture = false;
		aParam.listeClasses.parcourir((aClasse) => {
			const lPeriode = aClasse.listePeriodes.getElementParNumero(
				aParam.periode.getNumero(),
			);
			if (lPeriode && !lPeriode.getActif()) {
				lEstCloture = true;
				return false;
			}
		});
		return lEstCloture;
	}
	leDevoirEstCloturePourNotation(aDevoir) {
		let lCloture = false;
		aDevoir.listeClasses.parcourir((aClasse) => {
			aClasse.listePeriodes.parcourir((aPeriode) => {
				if (
					this.laPeriodeEstClotureePourNotation({
						periode: aPeriode,
						listeClasses:
							new ObjetListeElements_1.ObjetListeElements().addElement(aClasse),
					})
				) {
					lCloture = true;
					return false;
				}
			});
			if (lCloture === true) {
				return false;
			}
		});
		return lCloture;
	}
	creerDevoirParDefaut(aParam) {
		const lDevoir = new ObjetElement_1.ObjetElement();
		const lDateCourante = ObjetDate_1.GDate.getDateCourante(true);
		lDevoir.service = aParam.service;
		lDevoir.estDevoirEditable = lDevoir.service.getActif();
		lDevoir.matiere = MethodesObjet_1.MethodesObjet.dupliquer(aParam.matiere);
		lDevoir.date = lDateCourante;
		lDevoir.coefficient = new TypeNote_1.TypeNote(1.0);
		lDevoir.bareme = new TypeNote_1.TypeNote(
			aParam.baremeParDefaut.getValeur(),
		);
		lDevoir.commentaire = "";
		lDevoir.datePublication =
			ObjetUtilitaireDevoir_1.ObjetUtilitaireDevoir.getDatePublicationDevoirParDefaut(
				lDevoir.date,
			);
		lDevoir.listeClasses = creerDevoirParDefautListeClasses.call(this, {
			listeClasses: aParam.listeClasses,
			periode: aParam.periode,
		});
		lDevoir.listeEleves = this.creerDevoirParDefautListeEleves({
			listeEleves: aParam.listeEleves,
		});
		lDevoir.verrouille = false;
		lDevoir.commeUneNote = false;
		lDevoir.commeUnBonus = false;
		lDevoir.ramenerSur20 = false;
		lDevoir.listeSujet = "";
		lDevoir.libelleCorrige = "";
		lDevoir.listeSujets = new ObjetListeElements_1.ObjetListeElements();
		lDevoir.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
		lDevoir.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
			"Theme.libelleCB.devoir",
		);
		lDevoir.avecCommentaireSurNoteEleve = false;
		lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lDevoir;
	}
	creerDevoirParDefautListeEleves(aParam) {
		const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		aParam.listeEleves.parcourir((aEleve) => {
			const lEleveDevoir = new ObjetElement_1.ObjetElement(
				"",
				aEleve.getNumero(),
			);
			lEleveDevoir.Note = new TypeNote_1.TypeNote("");
			lListeEleves.addElement(lEleveDevoir);
		});
		return lListeEleves;
	}
	getEleve(aParams, aCtx) {
		const lCtx = _getContexteAffichage.call(this, aParams);
		let lListeEleves = aCtx.listeEleves.getListeElementsParNumero(
			lCtx.numeroEleve,
		);
		let lNbrEltTrouve = lListeEleves.count();
		if (lNbrEltTrouve === 1) {
			return lListeEleves.get(0);
		}
		if (lNbrEltTrouve > 1) {
			let lAvecCtxClasse =
				lCtx.numeroClasse !== null && lCtx.numeroClasse !== undefined;
			if (!lAvecCtxClasse) {
				return lListeEleves.get(0);
			}
			let lListeElevesDeClasse = lListeEleves.getListeElements((D) => {
				return D.classe && D.classe.getNumero() === lCtx.numeroClasse;
			});
			if (lListeElevesDeClasse.count() > 0) {
				return lListeElevesDeClasse.get(0);
			} else {
				return lListeEleves.get(0);
			}
		}
	}
	getDevoir(aParams, aCtx) {
		const lCtx = _getContexteAffichage.call(this, aParams);
		return this.getDevoirParNumero({
			listeDevoirs: aCtx.listeDevoirs,
			numeroDevoir: lCtx.numeroDevoir,
		});
	}
	getEleveDevoir(aParams, aCtx) {
		const lCtx = _getContexteAffichage.call(this, aParams);
		return this.getEleveDevoirParNumero({
			listeDevoirs: aCtx.listeDevoirs,
			numeroDevoir: lCtx.numeroDevoir,
			numeroEleve: lCtx.numeroEleve,
		});
	}
	getNoteEleveAuDevoir(aParams, aCtx) {
		const lCtx = _getContexteAffichage.call(this, aParams);
		return this.getNoteEleveAuDevoirParNumero({
			listeDevoirs: aCtx.listeDevoirs,
			numeroDevoir: lCtx.numeroDevoir,
			numeroEleve: lCtx.numeroEleve,
		});
	}
	getDevoirParNumero(aParam) {
		return aParam.listeDevoirs.getElementParNumero(aParam.numeroDevoir);
	}
	getEleveDevoirParNumero(aParam) {
		const lDevoir = this.getDevoirParNumero(aParam);
		return lDevoir
			? lDevoir.listeEleves.getElementParNumero(aParam.numeroEleve)
			: null;
	}
	getNoteEleveAuDevoirParNumero(aParam) {
		const lEleveDevoir = this.getEleveDevoirParNumero(aParam);
		return lEleveDevoir ? lEleveDevoir.Note : null;
	}
	getTailleMaxCommentaire() {
		return (0, AccessApp_1.getApp)().getObjetParametres()
			.tailleCommentaireDevoir;
	}
	getTailleMaxPieceJointe() {
		return (0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
		);
	}
	getEGenreSujet() {
		return TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet;
	}
	getEGenreCorrige() {
		return TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige;
	}
	synchroniserSujetEtCorrige(aParam) {
		const lDevoir = aParam.devoir;
		const lNuneroDevoir = lDevoir.getNumero();
		const lSujet = lDevoir.listeSujets.get(0);
		if (lSujet) {
			lSujet.setNumero(lNuneroDevoir);
			aParam.listeSujets.addElement(
				lSujet,
				aParam.listeSujets.getIndiceParNumeroEtGenre(lNuneroDevoir),
			);
		}
		const lCorrige = lDevoir.listeCorriges.get(0);
		if (lCorrige) {
			lCorrige.setNumero(lNuneroDevoir);
			aParam.listeCorriges.addElement(
				lCorrige,
				aParam.listeCorriges.getIndiceParNumeroEtGenre(lNuneroDevoir),
			);
		}
	}
	majNotesElevesSelonBaremeDuDevoir(aParam) {
		const lDevoir = aParam.devoir;
		const lBareme = lDevoir.bareme.getValeur();
		for (let i = 0, lNbr = lDevoir.listeEleves.count(); i < lNbr; i++) {
			const lEleve = lDevoir.listeEleves.get(i);
			if (lEleve.Note.getValeur() > lBareme) {
				lEleve.Note = new TypeNote_1.TypeNote(lBareme);
				lEleve.setEtat(lDevoir.Modification);
			}
		}
	}
	leDevoirEstSurUnePeriodeClotureePourEvaluation(aDevoir) {
		if (!!aDevoir && !!aDevoir.listeClasses) {
			let lClasse, lPeriode;
			for (let i = 0; i < aDevoir.listeClasses.count(); i++) {
				lClasse = aDevoir.listeClasses.get(i);
				for (let j = 0; j < lClasse.listePeriodes.count(); j++) {
					lPeriode = lClasse.listePeriodes.get(j);
					if (!!lPeriode && lPeriode.estEvaluationCloturee) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	}
	leDevoirAUneEvaluationAvecPeriodeCloturee(aDevoir) {
		return (
			!!aDevoir.evaluation &&
			this.leDevoirEstSurUnePeriodeClotureePourEvaluation(aDevoir)
		);
	}
	getTitrePeriodes(aParam) {
		const lObjetParam = (0, AccessApp_1.getApp)().getObjetParametres();
		const lTitrePeriode = [];
		if (aParam.avecTrimestre) {
			lTitrePeriode.push(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("PageNotes.MoyenneT1"),
					lObjetParam
						.getPeriodeDeNotationParGenre(
							Enumere_PeriodeDeNotation_1.EGenrePeriodeDeNotation.Trimestre1,
						)
						.getNumero(),
					2,
				),
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("PageNotes.MoyenneT2"),
					lObjetParam
						.getPeriodeDeNotationParGenre(
							Enumere_PeriodeDeNotation_1.EGenrePeriodeDeNotation.Trimestre2,
						)
						.getNumero(),
					2,
				),
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("PageNotes.MoyenneT3"),
					lObjetParam
						.getPeriodeDeNotationParGenre(
							Enumere_PeriodeDeNotation_1.EGenrePeriodeDeNotation.Trimestre3,
						)
						.getNumero(),
					2,
				),
			);
		}
		if (aParam.avecSemestre) {
			lTitrePeriode.push(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("PageNotes.MoyenneS1"),
					lObjetParam
						.getPeriodeDeNotationParGenre(
							Enumere_PeriodeDeNotation_1.EGenrePeriodeDeNotation.Semestre1,
						)
						.getNumero(),
					2,
				),
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("PageNotes.MoyenneS2"),
					lObjetParam
						.getPeriodeDeNotationParGenre(
							Enumere_PeriodeDeNotation_1.EGenrePeriodeDeNotation.Semestre2,
						)
						.getNumero(),
					2,
				),
			);
		}
		return lTitrePeriode;
	}
	getInfosPeriodes(aParam) {
		const lTitres = this.getTitrePeriodes(aParam);
		const lAvecPeriodes =
			(!aParam.selection.existeNumero() && aParam.selection.getGenre() === 1) ||
			aParam.selection.listePeriodesNotation !== undefined;
		return {
			avecPeriodes: lAvecPeriodes,
			nbPeriodes:
				(aParam.avecTrimestre ? 3 : 0) + (aParam.avecSemestre ? 2 : 0),
			getTitrePeriodes: lTitres,
			nbrPeriodesAffichage: lAvecPeriodes ? lTitres.length : 0,
		};
	}
	getInfosServicesDefaut(aParam) {
		const lResult = {
			avecSelectionService: null,
			listeService: null,
			serviceDefaut: null,
		};
		if (
			aParam.service.estUnService &&
			aParam.service.listeServices.count() > 0
		) {
			lResult.avecSelectionService = true;
			const lListeService = aParam.service.listeServices;
			let lElement;
			for (let i = 0, lNbr = lListeService.count(); i < lNbr; i++) {
				lElement = lListeService.get(i);
				lElement.libelleHtml =
					(lElement.pere.existeNumero()
						? lElement.pere.matiere.getLibelle() + " - "
						: "") +
					(lElement.pere.estCoEnseignement
						? lElement.professeur.getLibelle() + " - "
						: "") +
					lElement.getLibelle() +
					(lElement.estCoEnseignement
						? " - " + lElement.professeur.getLibelle()
						: "") +
					" - " +
					(lElement.groupe.existeNumero()
						? lElement.groupe.getLibelle()
						: lElement.classe.getLibelle());
				lElement.libelleHtmlTitre = lElement.libelleHtml;
			}
			lResult.listeService = lListeService;
			if (aParam.service.estCoEnseignement) {
				const lListeServiceFiltre = lResult.listeService.getListeElements(
					(aEle) => {
						return aParam.professeur
							? aEle.professeur.getNumero() === aParam.professeur.getNumero()
							: aEle.professeur.getNumero() ===
									GEtatUtilisateur.getUtilisateur().getNumero();
					},
				);
				lResult.serviceDefaut = lListeServiceFiltre.get(0);
			}
			if (!lResult.serviceDefaut) {
				lResult.serviceDefaut = lResult.listeService.get(0);
			}
		} else {
			lResult.avecSelectionService = false;
			lResult.serviceDefaut = aParam.service;
		}
		return lResult;
	}
	avecUtilisationAnnotationFelicitation() {
		return false;
	}
	createChaineAnnotationFelicitation() {
		return null;
	}
	estPeriodeActuelleToutes() {
		return false;
	}
	getGenreRattrapage(aGenreRattrapage) {
		return "";
	}
}
exports.MoteurNotes = MoteurNotes;
function creerDevoirParDefautListeClasses(aParam) {
	const llisteClasses = new ObjetListeElements_1.ObjetListeElements();
	aParam.listeClasses.parcourir((aClasse) => {
		const lClasseDevoir = MethodesObjet_1.MethodesObjet.dupliquer(aClasse);
		lClasseDevoir.service = MethodesObjet_1.MethodesObjet.dupliquer(
			aClasse.service,
		);
		let lPeriode = aClasse.listePeriodes.getElementParNumero(
			aParam.periode.getNumero(),
		);
		if (!lPeriode) {
			lPeriode = aClasse.periodeParDefaut;
		}
		const lPremierePeriodeDevoir = new ObjetElement_1.ObjetElement(
			lPeriode.getLibelle(),
			lPeriode.getNumero(),
			null,
			null,
			true,
		);
		lPremierePeriodeDevoir.estEvaluationCloturee =
			lPeriode.estEvaluationCloturee;
		lClasseDevoir.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		lClasseDevoir.listePeriodes.addElement(lPremierePeriodeDevoir);
		lClasseDevoir.listePeriodes.addElement(
			new ObjetElement_1.ObjetElement("", 0, null, null, true),
		);
		llisteClasses.addElement(lClasseDevoir);
	});
	return llisteClasses;
}
function _getContexteAffichage(aParams) {
	const D = aParams.article;
	const lNumeroDevoir =
		aParams.numeroDevoir || aParams.declarationColonne.indice;
	const lData = { numeroEleve: D.getNumero(), numeroDevoir: lNumeroDevoir };
	if (D.classe !== null && D.classe !== undefined) {
		$.extend(lData, { numeroClasse: D.classe.getNumero() });
	}
	return lData;
}

const {
	ObjetAffichagePageEmploiDuTemps_Journalier,
} = require("InterfacePageEmploiDuTemps_Journalier.js");
const { ObjetVisuCdT } = require("ObjetVisuCdT.js");
const {
	ObjetRequetePageSaisieCahierDeTextes,
} = require("ObjetRequetePageSaisieCahierDeTextes.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const { EGenreEvntCdT } = require("ObjetMoteurCahierDeTextes.js");
const { ObjetRequeteFicheCDT } = require("ObjetRequeteFicheCDT.js");
const {
	ObjetRequetePageSaisieCahierDeTextes_General,
} = require("ObjetRequetePageSaisieCahierDeTextes_General.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetElement } = require("ObjetElement.js");
const { tag } = require("tag.js");
class ObjetAffichagePageSaisieCahierDeTextes extends ObjetAffichagePageEmploiDuTemps_Journalier {
	constructor(...aParams) {
		super(...aParams);
		this.forcerClickCours = true;
		this.AvecTrouEDT = false;
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				ObjetAffichagePageSaisieCahierDeTextes.genreEcran.EDT,
				ObjetAffichagePageSaisieCahierDeTextes.genreEcran.CDT,
			],
			date: null,
			cours: null,
			dataCdt: null,
		});
		this.cahierDeTextesCopie = null;
		this.moteurSelectionContexte = new MoteurSelectionContexte();
		this.moteurCDT = new ObjetMoteurCDT();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnRetourEcranPrec: {
				event: function () {
					this.revenirSurEcranPrecedent();
				}.bind(aInstance),
			},
			comboCours: {
				init(aCombo) {
					_initComboCours.call(aInstance, aCombo);
				},
			},
		});
	}
	construireInstances() {
		super.construireInstances();
		this.identVisuCdT = this.add(ObjetVisuCdT, _evntVisuCdT.bind(this));
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<section id="', this.getIdDeNiveau({ niveauEcran: 0 }), '">');
		H.push(
			'<div class="edtJournalier" id="',
			this.getInstance(this.identPageListe).getNom(),
			'"></div>',
		);
		H.push("</section>");
		H.push('<aside id="', this.getIdDeNiveau({ niveauEcran: 1 }), '">');
		H.push(
			'<div id="',
			this.getInstance(this.identVisuCdT).getNom(),
			'"></div>',
		);
		H.push("</aside>");
		return H.join("");
	}
	recupererDonnees() {
		super.recupererDonnees();
		return new ObjetRequetePageSaisieCahierDeTextes_General(this)
			.lancerRequete(false)
			.then((aParams) => {
				this.contexte.dataCdT_general =
					this.moteurCDT.formatterDataCdtGeneral(aParams);
			});
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.EDT:
				return _afficherEcranEDT.call(this, this.contexte);
			case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.CDT:
				return _afficherEcranCDT.call(this, this.contexte);
			default:
		}
	}
	construireBandeauEcranCDT() {
		const H = [];
		H.push(
			tag("ie-combo", {
				class: "saisie-cdt-selection",
				"ie-model": "comboCours",
			}),
		);
		return this.construireBandeauEcran(H.join(""), { bgWhite: true });
	}
	evenementFicheCours(aCours) {
		if (!aCours.utilisable) {
			GApplication.getMessage().afficher({
				message: GChaine.replaceRCToHTML(
					GTraductions.getValeur(
						"CahierDeTexte.CoursNonUtilisableDansPNParCDT",
					),
				),
			});
		} else {
			this.contexte.date = this.getDateCourante();
			this.contexte.cours = aCours;
			const lEcranSrc = {
				niveauEcran: 0,
				genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			};
			const lEcranDest = {
				niveauEcran: 1,
				genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
			};
			this.basculerEcran(lEcranSrc, lEcranDest);
		}
	}
	_getParamsRequeteEDT() {
		return Object.assign(super._getParamsRequeteEDT(), {
			estEDTAnnuel: false,
			avecConseilDeClasse: false,
			avecCoursSortiePeda: false,
			avecRetenuesEleve: false,
		});
	}
}
ObjetAffichagePageSaisieCahierDeTextes.genreEcran = { EDT: "EDT", CDT: "CDT" };
function _afficherEcranEDT(aContexte) {
	return _reinitialiserAffichage.call(this, aContexte.date);
}
function _reinitialiserAffichage(aDate) {
	return new Promise((aResolve) => {
		this.contexte = $.extend(this.contexte, {
			date: null,
			cours: null,
			dataCdt: null,
		});
		this.NumeroSemaine = null;
		GEtatUtilisateur.setDerniereDate(aDate);
		this.initialiser();
		aResolve();
	});
}
function _initComboCours(aCombo) {
	const lCours = this.contexte.cours;
	const lListeCoursTemp = new ObjetListeElements();
	lListeCoursTemp.addElement(lCours);
	const lListeCours = this.moteurSelectionContexte.formatterListeCours({
		listeCours: lListeCoursTemp,
		genreTri: EGenreTriElement.Croissant,
	});
	const lLibelleHtmlCours = _composeHtmlCours.call(this, lCours);
	if (this.contexte.dataCdt.CoursPrecedent) {
		const lArticle = new ObjetElement(
			GTraductions.getValeur("CahierDeTexte.CoursPrecedent"),
		);
		lArticle.estCoursPrecedent = true;
		lArticle.callbackSelection = () => {
			_changerCoursCourant.call(this, this.contexte.dataCdt.CoursPrecedent);
		};
		lListeCours.insererElement(lArticle, 0);
	}
	if (this.contexte.dataCdt.CoursSuivant) {
		const lArticle = new ObjetElement(
			GTraductions.getValeur("CahierDeTexte.CoursSuivant"),
		);
		lArticle.estCoursSuivant = true;
		lArticle.callbackSelection = () => {
			_changerCoursCourant.call(this, this.contexte.dataCdt.CoursSuivant);
		};
		lListeCours.add(lArticle);
	}
	aCombo.setDonneesObjetSaisie({
		liste: lListeCours,
		options: {
			avecBoutonsPrecSuiv: true,
			labelWAICellule: GTraductions.getValeur(
				"CahierDeTexte.SelectionnerUnCoursPourSaisirCDT",
			),
			getContenuCellule: () => {
				return { libelleHtml: lLibelleHtmlCours };
			},
			getContenuElement(aParams) {
				const lElement = aParams.element;
				const H = [];
				H.push(
					'<div class="truncate" style="white-space: nowrap;position:relative;">',
					lElement.libelleHtml
						? lElement.libelleHtml
						: GChaine.insecable(lElement.getLibelle()),
					"</div>",
					lElement.sousTitre
						? '<div style="margin-left:18px;" class="Texte12 Gris truncate">' +
								lElement.sousTitre +
								"</div>"
						: "",
				);
				return H.join("");
			},
		},
	});
	aCombo.initSelection(lListeCours.getIndiceParElement(lCours));
}
function _afficherEcranCDT(aContexte) {
	return new ObjetRequetePageSaisieCahierDeTextes(this)
		.lancerRequete({
			cours: aContexte.cours,
			numeroSemaine: aContexte.cours.numeroSemaine,
			avecJoursPresence: false,
			avecCDT: true,
		})
		.then((aParams) => {
			aContexte.dataCdt = aParams;
			return new ObjetRequeteFicheCDT(this)
				.lancerRequete({
					pourTAF: true,
					cours: aContexte.cours,
					numeroSemaine: aContexte.cours.numeroSemaine,
				})
				.then((aArrayParams) => {
					return new Promise((aResolve) => {
						aContexte.ficheTAFDuCours = aArrayParams[1];
						switch (
							this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })
						) {
							case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.EDT:
							case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.CDT:
								this.setHtmlStructureAffichageBandeau(
									this.construireBandeauEcranCDT(),
								);
								break;
						}
						_afficherCDT.call(this);
						aResolve();
					});
				});
		});
}
function _composeHtmlCours(aCours) {
	const H = [];
	H.push(
		'<div class="cdt-libelle-contain">',
		"   <div ie-ellipsis>",
		aCours.getLibelle(),
		"</div>",
		'   <div ie-ellipsis class="liste-classes">' + aCours.sousTitre + "</div>",
		"</div>",
	);
	return H.join("");
}
function _afficherCDT() {
	this.getInstance(this.identVisuCdT).setDonnees({
		cdt: this.contexte.dataCdt,
		tafs: this.contexte.ficheTAFDuCours.ListeTravailAFaire,
		general: this.contexte.dataCdT_general,
		cours: this.contexte.cours,
		cahierDeTextesCopie: this.cahierDeTextesCopie,
	});
}
function _changerCoursCourant(aCours) {
	return this.lancerRequeteEdtPourCdT({
		dateDebut: aCours.date,
		avecInfosPrefsGrille: false,
	}).then((aParams) => {
		this.contexte.dataEDT = aParams;
		this.contexte.date = aCours.date;
		this.contexte.cours = aParams.listeCours.getElementParNumero(
			aCours.getNumero(),
		);
		const lEcranSrc = {
			niveauEcran: 1,
			genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
		};
		const lEcranDest = {
			niveauEcran: 1,
			genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
		};
		this.basculerEcran(lEcranSrc, lEcranDest);
	});
}
function _evntVisuCdT(aParam) {
	if (aParam.evnt === EGenreEvntCdT.collerCdT) {
		this.moteurCDT.majDataSurCollerCdT({
			cible: aParam.data,
			source: this.cahierDeTextesCopie,
			avecCopieEltPgm: this.contexte.dataCdt.avecElementsProgramme,
			dateTAF:
				this.contexte.dataCdt.dateCoursSuivantTAF ||
				this.contexte.dataCdt.DateTravailAFaire,
		});
	}
	switch (aParam.evnt) {
		case EGenreEvntCdT.publierDate:
			this.moteurCDT.saisieCdT({
				cours: this.contexte.cours,
				numeroSemaine: this.contexte.cours.numeroSemaine,
				cdt: this.contexte.dataCdt.CahierDeTextes,
				listeCategories: undefined,
				listeFichiersUpload:
					aParam.ctx && aParam.ctx.element
						? aParam.ctx.element.listeFichiersFenetrePJ
						: undefined,
				listeDocumentsJoints: this.contexte.dataCdt.ListeDocumentsJoints,
				listeModeles: undefined,
				clbck: function () {}.bind(this, aParam.evnt),
			});
			break;
		case EGenreEvntCdT.publierCdT:
		case EGenreEvntCdT.createContenu:
		case EGenreEvntCdT.editContenu:
		case EGenreEvntCdT.deleteContenu:
		case EGenreEvntCdT.createTAF:
		case EGenreEvntCdT.editTAF:
		case EGenreEvntCdT.deleteTAF:
		case EGenreEvntCdT.collerCdT:
		case EGenreEvntCdT.deleteCdT:
		case EGenreEvntCdT.editNoteProchaineSeance:
		case EGenreEvntCdT.editCommentairePrive:
			this.moteurCDT.saisieCdT({
				cours: this.contexte.cours,
				numeroSemaine: this.contexte.cours.numeroSemaine,
				cdt: this.contexte.dataCdt.CahierDeTextes,
				listeCategories: undefined,
				listeFichiersUpload:
					aParam.ctx && aParam.ctx.element
						? aParam.ctx.element.listeFichiersFenetrePJ
						: undefined,
				listeDocumentsJoints: this.contexte.dataCdt.ListeDocumentsJoints,
				listeModeles: undefined,
				clbck: function (aEvnt, aParam) {
					_actualiserSurRetourSaisie.call(this, {
						evnt: aEvnt,
						contenu: aParam.contenu,
						taf: aParam.taf,
					});
				}.bind(this, aParam.evnt),
			});
			break;
		case EGenreEvntCdT.copierCdT:
			this.cahierDeTextesCopie = aParam.data;
			break;
		case EGenreEvntCdT.actualiserFicheTAFDuCours:
			_actualiserFicheTAFDuCours.call(this);
			break;
	}
}
function _actualiserFicheTAFDuCours() {
	return new ObjetRequeteFicheCDT(this)
		.lancerRequete({
			pourTAF: true,
			cours: this.contexte.cours,
			numeroSemaine: this.contexte.cours.numeroSemaine,
		})
		.then((aArrayParams) => {
			this.contexte.ficheTAFDuCours = aArrayParams[1];
			this.getInstance(this.identVisuCdT).actualiserFicheTAFDuCours({
				tafs: this.contexte.ficheTAFDuCours.ListeTravailAFaire,
			});
		});
}
function _actualiserSurRetourSaisie(aParam) {
	this.lancerRequeteEdtPourCdT({
		dateDebut: this.contexte.cours.DateDuCours,
		avecInfosPrefsGrille: false,
	})
		.then((aParams) => {
			this.contexte.dataEDT = aParams;
			this.contexte.date = this.contexte.cours.DateDuCours;
			this.contexte.cours = aParams.listeCours.getElementParNumero(
				this.contexte.cours.getNumero(),
			);
		})
		.then(() => {
			return new ObjetRequetePageSaisieCahierDeTextes(this)
				.lancerRequete({
					cours: this.contexte.cours,
					numeroSemaine: this.contexte.cours.numeroSemaine,
					avecJoursPresence: false,
					avecCDT: true,
				})
				.then((aParams) => {
					this.contexte.dataCdt = aParams;
					this.getInstance(this.identVisuCdT).actualiserDataCdT({
						cdt: this.contexte.dataCdt,
						evnt: aParam.evnt,
						cours: this.contexte.cours,
					});
				});
		});
}
module.exports = ObjetAffichagePageSaisieCahierDeTextes;

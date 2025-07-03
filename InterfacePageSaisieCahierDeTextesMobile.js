exports.ObjetAffichagePageSaisieCahierDeTextes = void 0;
const InterfacePageEmploiDuTemps_Journalier_1 = require("InterfacePageEmploiDuTemps_Journalier");
const ObjetVisuCdT_1 = require("ObjetVisuCdT");
const ObjetRequetePageSaisieCahierDeTextes_1 = require("ObjetRequetePageSaisieCahierDeTextes");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const ObjetMoteurCahierDeTextes_1 = require("ObjetMoteurCahierDeTextes");
const ObjetMoteurCahierDeTextes_2 = require("ObjetMoteurCahierDeTextes");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetRequetePageSaisieCahierDeTextes_General_1 = require("ObjetRequetePageSaisieCahierDeTextes_General");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetElement_1 = require("ObjetElement");
const AccessApp_1 = require("AccessApp");
class ObjetAffichagePageSaisieCahierDeTextes extends InterfacePageEmploiDuTemps_Journalier_1.ObjetAffichagePageEmploiDuTemps_Journalier {
	constructor(...aParams) {
		super(...aParams);
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
		this.moteurCDT = new ObjetMoteurCahierDeTextes_1.ObjetMoteurCDT();
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
	}
	construireInstances() {
		super.construireInstances();
		this.identVisuCdT = this.add(
			ObjetVisuCdT_1.ObjetVisuCdT,
			this._evntVisuCdT.bind(this),
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<section id="', this.getIdDeNiveau({ niveauEcran: 0 }), '">');
		H.push(
			'<div class="edtJournalier" id="',
			this.getNomInstance(this.identPageListe),
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
		return new ObjetRequetePageSaisieCahierDeTextes_General_1.ObjetRequetePageSaisieCahierDeTextes_General(
			this,
		)
			.lancerRequete(false)
			.then((aParams) => {
				this.contexte.dataCdT_general =
					this.moteurCDT.formatterDataCdtGeneral(aParams);
			});
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.EDT:
				return this._afficherEcranEDT(this.contexte);
			case ObjetAffichagePageSaisieCahierDeTextes.genreEcran.CDT:
				return this._afficherEcranCDT(this.contexte);
			default:
		}
	}
	construireBandeauEcranCDT() {
		const lJSXModel = () => {
			return {
				init: (aCombo) => {
					this._initComboCours(aCombo);
				},
			};
		};
		return this.construireBandeauEcran(
			IE.jsx.str("ie-combo", {
				class: "saisie-cdt-selection",
				"ie-model": lJSXModel,
			}),
			{ bgWhite: true },
		);
	}
	evenementFicheCours(aCours) {
		if (!aCours.utilisable) {
			GApplication.getMessage().afficher({
				message: ObjetChaine_1.GChaine.replaceRCToHTML(
					ObjetTraduction_1.GTraductions.getValeur(
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
	_afficherEcranEDT(aContexte) {
		return this._reinitialiserAffichage(aContexte.date);
	}
	_reinitialiserAffichage(aDate) {
		return new Promise((aResolve) => {
			this.contexte = $.extend(this.contexte, {
				date: null,
				cours: null,
				dataCdt: null,
			});
			this.NumeroSemaine = null;
			(0, AccessApp_1.getApp)().getEtatUtilisateur().setDerniereDate(aDate);
			this.initialiser();
			aResolve();
		});
	}
	_initComboCours(aCombo) {
		const lCours = this.contexte.cours;
		const lListeCoursTemp = new ObjetListeElements_1.ObjetListeElements();
		lListeCoursTemp.addElement(lCours);
		const lListeCours = this.moteurSelectionContexte.formatterListeCours({
			listeCours: lListeCoursTemp,
			genreTri: Enumere_TriElement_1.EGenreTriElement.Croissant,
		});
		const lLibelleHtmlCours = this._composeHtmlCours(lCours);
		if (this.contexte.dataCdt.CoursPrecedent) {
			const lArticle = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.CoursPrecedent",
				),
			);
			lArticle.estCoursPrecedent = true;
			lArticle.callbackSelection = () => {
				this._changerCoursCourant(this.contexte.dataCdt.CoursPrecedent);
			};
			lListeCours.insererElement(lArticle, 0);
		}
		if (this.contexte.dataCdt.CoursSuivant) {
			const lArticle = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CoursSuivant"),
			);
			lArticle.estCoursSuivant = true;
			lArticle.callbackSelection = () => {
				this._changerCoursCourant(this.contexte.dataCdt.CoursSuivant);
			};
			lListeCours.add(lArticle);
		}
		aCombo.setDonneesObjetSaisie({
			liste: lListeCours,
			options: {
				avecBoutonsPrecSuiv: true,
				labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
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
							: ObjetChaine_1.GChaine.insecable(lElement.getLibelle()),
						"</div>",
						lElement.sousTitre
							? '<div style="margin-left:18px;" class="Texte12 color-neutre-foncee truncate">' +
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
	_afficherEcranCDT(aContexte) {
		return new ObjetRequetePageSaisieCahierDeTextes_1.ObjetRequetePageSaisieCahierDeTextes(
			this,
		)
			.lancerRequete({
				cours: aContexte.cours,
				numeroSemaine: aContexte.cours.numeroSemaine,
				avecJoursPresence: false,
				avecCDT: true,
			})
			.then((aParams) => {
				aContexte.dataCdt = aParams;
				return new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(this)
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
							this._afficherCDT();
							aResolve();
						});
					});
			});
	}
	_composeHtmlCours(aCours) {
		const H = [];
		H.push(
			'<div class="cdt-libelle-contain">',
			"   <div ie-ellipsis>",
			aCours.getLibelle(),
			"</div>",
			'   <div ie-ellipsis class="liste-classes">' +
				aCours.sousTitre +
				"</div>",
			"</div>",
		);
		return H.join("");
	}
	_afficherCDT() {
		this.getInstance(this.identVisuCdT).setDonnees({
			cdt: this.contexte.dataCdt,
			tafs: this.contexte.ficheTAFDuCours.ListeTravailAFaire,
			general: this.contexte.dataCdT_general,
			cours: this.contexte.cours,
			cahierDeTextesCopie: this.cahierDeTextesCopie,
		});
	}
	_changerCoursCourant(aCours) {
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
	_evntVisuCdT(aParam) {
		if (aParam.evnt === ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.collerCdT) {
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
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.publierDate:
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
					clbck: () => {},
				});
				break;
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.publierCdT:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.createContenu:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.editContenu:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.deleteContenu:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.createTAF:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.editTAF:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.deleteTAF:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.collerCdT:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.deleteCdT:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.editNoteProchaineSeance:
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.editCommentairePrive:
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
					clbck: (aParamCallback) => {
						this._actualiserSurRetourSaisie({
							evnt: aParam.evnt,
							contenu: aParamCallback.contenu,
							taf: aParamCallback.taf,
						});
					},
				});
				break;
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.copierCdT:
				this.cahierDeTextesCopie = aParam.data;
				break;
			case ObjetMoteurCahierDeTextes_2.EGenreEvntCdT.actualiserFicheTAFDuCours:
				this._actualiserFicheTAFDuCours();
				break;
		}
	}
	_actualiserFicheTAFDuCours() {
		return new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(this)
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
	_actualiserSurRetourSaisie(aParam) {
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
				return new ObjetRequetePageSaisieCahierDeTextes_1.ObjetRequetePageSaisieCahierDeTextes(
					this,
				)
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
}
exports.ObjetAffichagePageSaisieCahierDeTextes =
	ObjetAffichagePageSaisieCahierDeTextes;
(function (ObjetAffichagePageSaisieCahierDeTextes) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["EDT"] = "EDT";
		genreEcran["CDT"] = "CDT";
	})(
		(genreEcran =
			ObjetAffichagePageSaisieCahierDeTextes.genreEcran ||
			(ObjetAffichagePageSaisieCahierDeTextes.genreEcran = {})),
	);
})(
	ObjetAffichagePageSaisieCahierDeTextes ||
		(exports.ObjetAffichagePageSaisieCahierDeTextes =
			ObjetAffichagePageSaisieCahierDeTextes =
				{}),
);

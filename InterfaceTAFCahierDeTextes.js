exports.InterfaceTAFCahierDeTextes = void 0;
const TinyInit_1 = require("TinyInit");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const _InterfaceContenuEtTAFCahierDeTextes_1 = require("_InterfaceContenuEtTAFCahierDeTextes");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ChargeTAF_1 = require("ObjetFenetre_ChargeTAF");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const GUID_1 = require("GUID");
class InterfaceTAFCahierDeTextes extends _InterfaceContenuEtTAFCahierDeTextes_1._InterfaceContenuEtTAFCahierDeTextes {
	constructor(...aParams) {
		super(...aParams);
		this.genre = Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire;
		this.pleinEcran = false;
		this.paramsAffichage = {
			avecElevesConcernes: true,
			avecBoutonEditeurHtml: false,
			autoresize: false,
			height: [350],
			position: [undefined],
			min_height: [50],
			max_height: [350],
		};
		this.avecDocumentJoint = false;
		this.avecThemes = this.applicationSco.parametresUtilisateur.get(
			"avecGestionDesThemes",
		);
		this.parametres = {
			listeNiveaux:
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.toListe(false),
			listeRendus: TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.toListe([
				TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque,
			]),
			dureeTAFDefaut: 15,
			largeurCombo: 150,
		};
	}
	construireInstances() {
		super.construireInstances();
		this.identSelectDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSelectDate,
			(aInstance) => {
				aInstance.setOptionsObjetCelluleDate({
					ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.pourLe",
					),
				});
			},
		);
		if (this.avecThemes) {
			this.identMultiSelectionTheme = this.add(
				ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
				this._evtCellMultiSelectionTheme.bind(this),
			);
		}
	}
	setParametresAffichage(aParametresAffichage) {
		super.setParametresAffichage(aParametresAffichage);
		if (
			aParametresAffichage.avecElevesConcernes !== null &&
			aParametresAffichage.avecElevesConcernes !== undefined
		) {
			this.paramsAffichage.avecElevesConcernes =
				aParametresAffichage.avecElevesConcernes;
		}
	}
	jsxModeleRadioDureeEstimee(aEstAucune) {
		return {
			getValue: () => {
				return (!this.taf || this.taf.duree === 0) === aEstAucune;
			},
			setValue: (aValue) => {
				this.taf.duree = aEstAucune ? 0 : this.parametres.dureeTAFDefaut;
				this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.Pere.setEtatSaisie(true);
			},
			getDisabled: () => {
				return !this._saisieAffichageAutorise();
			},
			getName: () => {
				return `${this.Nom}_DureeEstimee`;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getHtmlEleves: function () {
				var _a, _b, _c, _d, _e, _f;
				const lAvecMessageTous =
					(((_b =
						(_a = aInstance.params) === null || _a === void 0
							? void 0
							: _a.listeTousEleves) === null || _b === void 0
						? void 0
						: _b.count()) ===
						((_d =
							(_c =
								aInstance === null || aInstance === void 0
									? void 0
									: aInstance.taf) === null || _c === void 0
								? void 0
								: _c.listeEleves) === null || _d === void 0
							? void 0
							: _d.count()) ||
						((_f =
							(_e =
								aInstance === null || aInstance === void 0
									? void 0
									: aInstance.taf) === null || _e === void 0
								? void 0
								: _e.listeEleves) === null || _f === void 0
							? void 0
							: _f.count()) === 0) &&
					aInstance.taf.estPourTous;
				if (!aInstance.taf || !aInstance.taf.listeEleves || lAvecMessageTous) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.tousLesEleves",
					);
				}
				const lNombresDElevesDeTAF = aInstance.taf.listeEleves.count();
				return ObjetChaine_1.GChaine.format(
					lNombresDElevesDeTAF === 1
						? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.eleve")
						: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.eleves"),
					[lNombresDElevesDeTAF, aInstance.params.listeTousEleves.count()],
				);
			},
			getHtmDisponibilites: function () {
				if (aInstance.taf && aInstance.taf.executionQCM) {
					const lStrDatePubli = ObjetDate_1.GDate.formatDate(
						aInstance.taf.executionQCM.dateDebutPublication,
						"%JJ/%MM - %hh%sh%mm",
					);
					let lStr = ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.taf.DisponibleAPartirDuNet",
						[lStrDatePubli],
					);
					if (
						!aInstance.params ||
						!aInstance.params.cours ||
						!aInstance.params.cours.publie
					) {
						lStr +=
							" (" +
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.taf.SousReserveQueCDTSoitPublie",
							) +
							")";
					}
					return lStr;
				}
				return "";
			},
			btnEleves: {
				event: function () {
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirElevesTAF({
						instance: aInstance,
						element: aInstance.taf,
						listeTousEleves: aInstance.params.listeTousEleves,
						callback: function () {
							aInstance.Pere.setEtatSaisie(true);
						},
					});
				},
				getDisabled: function () {
					return !aInstance._saisieAffichageAutorise();
				},
			},
			btnChargeTAF: {
				event: function () {
					const lFenetreChargeTAF =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChargeTAF_1.ObjetFenetre_ChargeTAF,
							{ pere: aInstance },
						);
					lFenetreChargeTAF.setDonnees(
						aInstance.params.cours,
						aInstance.params.saisieCDT.listeClasses,
						null,
						aInstance.params.cours.numeroSemaine,
					);
				},
				getDisplay: function () {
					return aInstance.params.saisieCDT.voirTousLeCDTetCharge;
				},
			},
			inputDuree: {
				getValue: function () {
					return !aInstance.taf || aInstance.taf.duree === 0
						? aInstance.parametres.dureeTAFDefaut
						: aInstance.taf.duree;
				},
				setValue: function (aValue) {
					aInstance.taf.duree = parseInt(aValue);
					aInstance.parametres.dureeTAFDefaut = aInstance.taf.duree;
					aInstance.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.Pere.setEtatSaisie(true);
				},
				getDisabled: function () {
					return (
						!aInstance._saisieAffichageAutorise() || aInstance.taf.duree === 0
					);
				},
			},
			comboDifficulte: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 75,
						texteEdit: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.NiveauDifficulte",
						),
						classTexteEdit: "",
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.parametres.listeNiveaux;
					}
				},
				getIndiceSelection: function () {
					let lIndice =
						aInstance.parametres.listeNiveaux.getIndiceParNumeroEtGenre(
							null,
							aInstance.taf.niveauDifficulte,
						);
					if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
						lIndice = 0;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstance.taf &&
						aInstance.taf.niveauDifficulte !== aParametres.element.getGenre()
					) {
						aInstance.taf.niveauDifficulte = aParametres.element.getGenre();
						aInstance.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.Pere.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return !aInstance._saisieAffichageAutorise();
				},
			},
			comboRendu: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: aInstance.parametres.largeurCombo,
						texteEdit: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.taf.Rendu",
						),
						classTexteEdit: "",
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.parametres.listeRendus;
					}
				},
				getIndiceSelection: function () {
					let lIndice =
						aInstance.parametres.listeRendus.getIndiceParNumeroEtGenre(
							null,
							aInstance.taf.genreRendu,
						);
					if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
						lIndice = 0;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstance.taf &&
						aInstance.taf.genreRendu !== aParametres.element.getGenre()
					) {
						aInstance.taf.genreRendu = aParametres.element.getGenre();
						aInstance.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.Pere.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return !aInstance._saisieAffichageAutorise();
				},
			},
			btnQCM: {
				event: function () {
					const lNode = this.node;
					aInstance.ouvrirFenetreParamExecutionQCM(
						aInstance,
						function (aNumeroBouton, aExecutionQCM) {
							aInstance.taf.executionQCM = aExecutionQCM;
							if (aNumeroBouton > 0) {
								aInstance.taf.executionQCM.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aInstance.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								aInstance.Pere.setEtatSaisie(true);
							}
							ObjetHtml_1.GHtml.setFocus(lNode, true);
						},
						{
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.ParametresExeQCMTAF",
							),
						},
						{
							afficherModeQuestionnaire: false,
							afficherRessentiEleve: false,
							autoriserSansCorrige: false,
							autoriserCorrigerALaDate: false,
							executionQCM: aInstance.taf.executionQCM,
							avecConsigne: true,
							avecPersonnalisationProjetAccompagnement: true,
							avecModeCorrigeALaDate: true,
							avecMultipleExecutions: true,
						},
					);
				},
			},
		});
	}
	ouvrirFenetreParamExecutionQCM(aPere, aEvenement, aOptionsFenetre, aDonnees) {
		const lOptionsFenetre = $.extend(
			{
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
			aOptionsFenetre,
		);
		if (!IE.estMobile) {
			lOptionsFenetre.largeur = 540;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
			{ pere: aPere, evenement: aEvenement },
			lOptionsFenetre,
		);
		lFenetre.setDonnees(
			$.extend(aDonnees, { afficherEnModeForm: IE.estMobile }),
		);
	}
	getTAFContenu() {
		return this.taf;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain cols full-width flex-gap-l" },
			this._construireEntete(),
			this.taf.executionQCM
				? IE.jsx.str(
						"div",
						{ class: "fluid-bloc" },
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"span",
								{ class: "semi-bold m-right-s" },
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ExosQCM",
								),
								" : ",
							),
							" ",
							this.taf.descriptif,
						),
						IE.jsx.str(
							"p",
							{ class: "m-left-big m-y p-left-l" },
							UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(
								this.taf.executionQCM,
							),
						),
						IE.jsx.str("p", {
							class: "m-left-big m-y p-left-l",
							"ie-html": "getHtmDisponibilites",
						}),
					)
				: IE.jsx.str(
						"div",
						{ class: "fluid-bloc flex-contain flex-gap flex-start" },
						IE.jsx.str(
							"div",
							{ class: "fix-bloc" },
							this.construireBoutonsLiens(),
						),
						IE.jsx.str(
							"div",
							{ class: "fluid-bloc" },
							this.construireEditeur(),
						),
					),
			IE.jsx.str("div", {
				class: "fix-bloc flex-contain m-left-xxl p-left",
				id: this.idDocsJoints,
			}),
		);
	}
	_setDescriptif(aHtml) {
		if (
			this.taf &&
			!ObjetChaine_1.GChaine.estChaineHTMLEgal(aHtml, this.taf.descriptif)
		) {
			if (this.taf.Numero === null || this.taf.Numero === undefined) {
				this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			const lDescriptif = aHtml;
			if (ObjetNavigateur_1.Navigateur.withContentEditable) {
				this.taf.descriptif = TinyInit_1.TinyInit.estContenuVide(lDescriptif)
					? ""
					: lDescriptif;
			} else {
				this.taf.descriptif = lDescriptif;
			}
			this.taf.estVide =
				this.taf.descriptif === "" &&
				this.taf.ListePieceJointe.getNbrElementsExistes() === 0;
			this.Pere.setEtatSaisie(true);
		}
	}
	setParams(aParams) {
		this.params = Object.assign(
			{
				contenu: null,
				verrouille: true,
				date: null,
				avecDocumentJoint: null,
				saisieCDT: {},
			},
			aParams,
		);
		this.taf = this.params.contenu;
		this.cahierDeTexteVerrouille = this.params.verrouille;
	}
	actualiserTAF() {
		ObjetHtml_1.GHtml.setHtml(this.idDescriptif, this.taf.descriptif);
		if (!this.taf.executionQCM) {
			if (ObjetNavigateur_1.Navigateur.withContentEditable) {
				const lEditor = TinyInit_1.TinyInit.get(this.idDescriptif);
				if (lEditor) {
					this._affecterContenuTiny(lEditor, this.taf.descriptif);
				}
			} else {
				ObjetHtml_1.GHtml.setValue(this.idDescriptif, this.taf.descriptif);
			}
			this.avecDocumentJoint = this.params.avecDocumentJoint;
			this._actualiserDocumentsJoints();
		}
		const lSelecDate = this.getInstance(this.identSelectDate);
		lSelecDate.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			null,
			this.params.saisieCDT.JoursPresenceCours,
		);
		lSelecDate.setPremiereDateSaisissable(this.params.date, true);
		lSelecDate.setDonnees(this.taf.PourLe);
		lSelecDate.setActif(!this.cahierDeTexteVerrouille);
		if (this.avecThemes) {
			this.getInstance(this.identMultiSelectionTheme).setDonnees(
				this.taf.ListeThemes || new ObjetListeElements_1.ObjetListeElements(),
				this.taf.Matiere,
				this.taf.libelleCBTheme,
			);
		}
	}
	focusSurPremierObjet() {
		if (ObjetNavigateur_1.Navigateur.withContentEditable) {
			const lEditor = TinyInit_1.TinyInit.get(this.idDescriptif);
			if (lEditor && lEditor.initialized) {
				try {
					lEditor.focus();
				} catch (e) {
					IE.log.addLog("mceFocus> " + e, null, IE.log.genre.Erreur);
				}
			} else {
				ObjetHtml_1.GHtml.setFocus(this.idPremierObjet);
			}
		} else {
			ObjetHtml_1.GHtml.setFocus(this.idPremierObjet);
		}
	}
	_saisieAffichageAutorise() {
		return !this.cahierDeTexteVerrouille;
	}
	_construireEntete() {
		const lIdNbEleve = GUID_1.GUID.getId();
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center flex-gap justify-between" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center flex-gap fix-bloc" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe"),
					),
					IE.jsx.str("div", { id: this.getNomInstance(this.identSelectDate) }),
					!this.taf.executionQCM &&
						!TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
							this.taf.genreRendu,
						)
						? IE.jsx.str(
								"div",
								null,
								IE.jsx.str("ie-combo", { "ie-model": "comboRendu" }),
							)
						: "",
					this.taf.executionQCM
						? [
								IE.jsx.str("ie-btnicon", {
									"ie-model": "btnQCM",
									class: "icon_cog",
									title: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.ParametresExeQCMTAF",
									),
								}),
							].join("")
						: "",
					IE.jsx.str("label", {
						class: "Insecable",
						"ie-html": "getHtmlEleves",
						id: lIdNbEleve,
					}),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnEleves",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.titreFenetreTAFEleves",
							),
							"aria-describedby": lIdNbEleve,
						},
						"...",
					),
				),
				IE.jsx.str(
					"ie-bouton",
					{
						class: "m-left-l small-bt themeBoutonNeutre",
						"ie-model": "btnChargeTAF",
						"ie-display": "btnChargeTAF.getDisplay",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.VoirLaChargeTAF",
					),
				),
			),
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center flex-gap" },
				!this.taf.executionQCM
					? [
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"label",
									{ for: "idDuree" },
									ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.DureeEstimee",
									),
								),
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModeleRadioDureeEstimee.bind(
											this,
											true,
										),
									},
									" ",
									ObjetTraduction_1.GTraductions.getValeur("Aucune"),
								),
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModeleRadioDureeEstimee.bind(
											this,
											false,
										),
										class: "m-right-xl",
									},
									IE.jsx.str("input", {
										id: "idDuree",
										"ie-model": "inputDuree",
										"ie-mask": "/[^0-9]/i",
										maxlength: "10",
										class: "m-x CelluleTexte",
										style: ObjetStyle_1.GStyle.composeWidth(40),
									}),
									ObjetTraduction_1.GTraductions.getValeur("date.separateurMn"),
								),
							),
						].join("")
					: "",
				IE.jsx.str("ie-combo", { "ie-model": "comboDifficulte" }),
			),
			this.avecThemes
				? IE.jsx.str(
						"div",
						{ class: "m-bottom-l" },
						IE.jsx.str(
							"label",
							{ class: "m-bottom-s" },
							ObjetTraduction_1.GTraductions.getValeur("Themes"),
						),
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identMultiSelectionTheme),
						}),
					)
				: "",
		);
	}
	_evenementSelectDate(aDate) {
		this.taf.PourLe = aDate;
		if (this.taf.Numero === null || this.taf.Numero === undefined) {
			this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		} else {
			this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		if (this.taf.executionQCM) {
			const lDateFinPub = new Date(
				this.taf.PourLe.getFullYear(),
				this.taf.PourLe.getMonth(),
				aDate.getDate(),
				this.taf.executionQCM.dateFinPublication.getHours(),
				this.taf.executionQCM.dateFinPublication.getMinutes(),
			);
			this.taf.executionQCM.dateFinPublication = lDateFinPub;
			this.taf.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		ObjetHtml_1.GHtml.setFocus(
			this.getInstance(this.identSelectDate).getPremierElement(),
		);
		this.Pere.setEtatSaisie(true);
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.taf.ListeThemes = aListeSelections;
			this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.callback.appel(
				EGenreEvenementContenuCahierDeTextes_1
					.EGenreEvenementContenuCahierDeTextes.editionTheme,
				this.taf,
			);
		}
	}
}
exports.InterfaceTAFCahierDeTextes = InterfaceTAFCahierDeTextes;

exports.ObjetFenetre_EvaluationQCM = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDisponibilite_1 = require("ObjetDisponibilite");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeNote_1 = require("TypeNote");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetListe_1 = require("ObjetListe");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetRequeteListeCompetencesQCM_1 = require("ObjetRequeteListeCompetencesQCM");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const DonneesListe_EvaluationsQCM_1 = require("DonneesListe_EvaluationsQCM");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_EvaluationQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.setOptionsFenetre({
			avecTailleSelonContenu: true,
			largeur: 650,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = {
			evaluation: null,
			listePeriodesService: new ObjetListeElements_1.ObjetListeElements(),
			avecChoixQCM: false,
			avecChoixService: false,
			sansDoublon: true,
			avecCreationDevoirPossible: false,
		};
		this.avecSelectionPeriodeSecondaire =
			!this.etatUtilisateurSco.pourPrimaire();
	}
	construireInstances() {
		this.identComboServices = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._surEvenementComboServices.bind(this),
			this._initialiserComboServices,
		);
		this.identDisponibiliteQCM = this.add(
			ObjetDisponibilite_1.ObjetDisponibilite,
			this._surEvntSurDisponibiliteQCM.bind(this),
			this._initialiserDisponibiliteQCM,
		);
		this.identSelecteurDateEvaluation = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._surEvenementDateEvaluation.bind(this),
			this._initialiserSelecteurDate,
		);
		this.identSelecteurDatePublication = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._surEvenementDatePublication.bind(this),
			this._initialiserSelecteurDate,
		);
		this.identComboPeriode = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._surEvenementPeriodeEvaluation.bind(this),
			this._initialiserCombosPeriode,
		);
		this.identComboPeriodeSecondaire = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._surEvenementPeriodeSecondaireEvaluation.bind(this),
			this._initialiserCombosPeriode,
		);
		this.identListeCompetencesQCM = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeCompetencesQCM,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			qcm: {
				labelAssociation: function () {
					let lCleTradAssociationQCM;
					if (!!aInstance.donnees.avecChoixQCM) {
						lCleTradAssociationQCM =
							"evaluations.FenetreEvaluationQCM.AssocierUnQCM";
					} else {
						lCleTradAssociationQCM =
							"evaluations.FenetreEvaluationQCM.QCMAssocie";
					}
					return ObjetTraduction_1.GTraductions.getValeur(
						lCleTradAssociationQCM,
					);
				},
				btnAssocier: {
					event: function () {
						aInstance.ouvrirFenetreAssociationQCM();
					},
					estVisible: function () {
						return !!aInstance.donnees.avecChoixQCM;
					},
				},
				libelleQCM: function () {
					const lQCM = aInstance.getQCM();
					return !!lQCM ? lQCM.getLibelle() : "";
				},
				estChoixServiceVisible: function () {
					return !!aInstance.donnees.avecChoixService;
				},
				btnOptionsExecution: {
					event: function () {
						aInstance.ouvrirFenetreParametrageExecutionQCM();
					},
				},
				reglagesVisible: function () {
					const lExecutionQCM = aInstance.getExecutionQCM();
					return lExecutionQCM && !lExecutionQCM.estUnTAF;
				},
			},
			detailEvaluation: {
				getHtmlInfoPublicationDecaleeParents() {
					let lMessageDateDecaleeAuxParents = "";
					const lEvaluation = aInstance.donnees.evaluation;
					if (
						!!lEvaluation &&
						aInstance.parametresSco
							.avecAffichageDecalagePublicationEvalsAuxParents &&
						!!aInstance.parametresSco.nbJDecalagePublicationAuxParents
					) {
						let lDatePublicationDecalee = ObjetDate_1.GDate.formatDate(
							ObjetDate_1.GDate.getJourSuivant(
								lEvaluation.datePublication,
								aInstance.parametresSco.nbJDecalagePublicationAuxParents,
							),
							" %JJ/%MM",
						);
						if (
							aInstance.parametresSco.nbJDecalagePublicationAuxParents === 1
						) {
							lMessageDateDecaleeAuxParents =
								ObjetTraduction_1.GTraductions.getValeur(
									"evaluations.FenetreSaisieEvaluation.DecalageUnJourPublicationParentsSoitLe",
									[lDatePublicationDecalee],
								);
						} else {
							lMessageDateDecaleeAuxParents =
								ObjetTraduction_1.GTraductions.getValeur(
									"evaluations.FenetreSaisieEvaluation.DecalageXJoursPublicationParentsSoitLe",
									[
										aInstance.parametresSco.nbJDecalagePublicationAuxParents,
										lDatePublicationDecalee,
									],
								);
						}
					}
					return lMessageDateDecaleeAuxParents;
				},
				inputLibelle: {
					getValue: function () {
						const lEvaluation = aInstance.donnees.evaluation;
						return !!lEvaluation ? lEvaluation.getLibelle() : "";
					},
					setValue: function (aValue) {
						const lEvaluation = aInstance.donnees.evaluation;
						if (!!lEvaluation) {
							lEvaluation.setLibelle(aValue);
						}
					},
				},
				inputCoefficient: {
					getNote: function () {
						const lEvaluation = aInstance.donnees.evaluation;
						return !!lEvaluation
							? new TypeNote_1.TypeNote(lEvaluation.coefficient)
							: new TypeNote_1.TypeNote(1);
					},
					setNote: function (aNoteCoefficient) {
						const lEvaluation = aInstance.donnees.evaluation;
						if (!!lEvaluation && !aNoteCoefficient.estUneNoteVide()) {
							lEvaluation.coefficient = aNoteCoefficient.getValeur();
						}
					},
					getOptionsNote: function () {
						return {
							avecVirgule: false,
							sansNotePossible: false,
							avecAnnotation: false,
							min: 0,
							max: aInstance._getValeurMaxCoefficientEvaluation(),
							hintSurErreur: true,
						};
					},
				},
				btnMrFicheCoeff: {
					event() {
						GApplication.getMessage().afficher({
							idRessource: "FenetreEvaluation.MFicheCoefficientSurEvaluation",
						});
					},
					getTitle() {
						return ObjetTraduction_1.GTraductions.getTitreMFiche(
							"FenetreEvaluation.MFicheCoefficientSurEvaluation",
						);
					},
				},
				cbAvecCorrige: {
					getValue: function () {
						const lExecutionQCM = aInstance.getExecutionQCM();
						if (lExecutionQCM && lExecutionQCM.publierCorrige === undefined) {
							lExecutionQCM.publierCorrige =
								lExecutionQCM.modeDiffusionCorrige !==
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans;
						}
						return !!lExecutionQCM ? !!lExecutionQCM.publierCorrige : false;
					},
					setValue: function (aValue) {
						const lExecutionQCM = aInstance.getExecutionQCM();
						if (!!lExecutionQCM) {
							lExecutionQCM.publierCorrige = aValue;
						}
					},
				},
				cbPrendreEnCompteEvalDansBilan: {
					getValue() {
						const lEvaluation = aInstance.donnees.evaluation;
						return !!lEvaluation ? lEvaluation.priseEnCompteDansBilan : false;
					},
					setValue(aChecked) {
						const lEvaluation = aInstance.donnees.evaluation;
						if (!!lEvaluation) {
							lEvaluation.priseEnCompteDansBilan = aChecked;
						}
					},
				},
				cbSansCompetenceDoublon: {
					getDisabled: function () {
						return aInstance.estExecutionQCMVerrouille();
					},
					getValue: function () {
						return aInstance.donnees.sansDoublon;
					},
					setValue: function (aValue) {
						aInstance.donnees.sansDoublon = aValue;
						new ObjetRequeteListeCompetencesQCM_1.ObjetRequeteListeCompetencesQCM(
							aInstance,
							aInstance._surRequeteListeCompetencesQCM.bind(aInstance, false),
						).lancerRequete({
							qcm: aInstance.getQCM(),
							service: aInstance.donnees.evaluation.service,
							sansDoublon: aInstance.donnees.sansDoublon,
						});
					},
				},
			},
			optionsEvaluation: {
				avecCreationDevoir: {
					getDisabled: function () {
						return !aInstance.donnees.avecCreationDevoirPossible;
					},
					getValue: function () {
						const lEvaluation = aInstance.donnees.evaluation;
						return !!lEvaluation ? lEvaluation.avecDevoir : false;
					},
					setValue: function (aValue) {
						const lEvaluation = aInstance.donnees.evaluation;
						if (!!lEvaluation) {
							lEvaluation.avecDevoir = aValue;
						}
					},
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="flex-contain cols">');
		T.push(this.composeZoneQCM());
		T.push(this.composeZoneDetailEvaluation());
		if (!this.etatUtilisateurSco.pourPrimaire()) {
			T.push(this.composeZoneOptionsEvaluation());
		}
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aParams) {
		this.donnees.evaluation = aParams.evaluation;
		this.donnees.avecChoixQCM = !!aParams.avecChoixQCM;
		this.donnees.avecChoixService = !!aParams.avecChoixService;
		this.donnees.sansDoublon = true;
		if (this.donnees.evaluation) {
			this.donnees.sansDoublon = !!this.donnees.evaluation.estSansDoublon;
		}
		if (!!this.donnees.evaluation) {
			const lExecutionQCM = this.getExecutionQCM();
			if (!!lExecutionQCM) {
				this._miseAJourObjetDisponibilite();
			}
			let lListeServices;
			let lIndexServiceSelectionne;
			if (this.donnees.avecChoixService) {
				const lQCM = this.getQCM();
				lListeServices = !!lQCM
					? lQCM.listeServicesCompatiblesAvecCompetencesDuQCM
					: new ObjetListeElements_1.ObjetListeElements();
				lIndexServiceSelectionne = lListeServices.getIndiceParElement(
					this.donnees.evaluation.service,
				);
			} else {
				lListeServices = new ObjetListeElements_1.ObjetListeElements();
				lListeServices.addElement(this.donnees.evaluation.service);
				lIndexServiceSelectionne = 0;
			}
			this.getInstance(this.identComboServices).setDonnees(
				lListeServices,
				lIndexServiceSelectionne,
			);
			this.getInstance(this.identSelecteurDateEvaluation).setDonnees(
				this.donnees.evaluation.dateValidation,
			);
			this.getInstance(
				this.identSelecteurDatePublication,
			).setPremiereDateSaisissable(this.donnees.evaluation.dateValidation);
			this.getInstance(this.identSelecteurDatePublication).setDonnees(
				this.donnees.evaluation.datePublication,
			);
			this.getInstance(this.identComboPeriodeSecondaire).setActif(
				this.avecSelectionPeriodeSecondaire,
			);
		}
		this.afficher();
	}
	surValidation(aGenreBouton) {
		this.callback.appel(aGenreBouton, this.donnees.evaluation);
		this.fermer();
	}
	getQCM() {
		return this.donnees.evaluation
			? this.donnees.evaluation.executionQCM
				? this.donnees.evaluation.executionQCM.QCM
				: null
			: null;
	}
	getExecutionQCM() {
		return this.donnees.evaluation
			? this.donnees.evaluation.executionQCM
			: null;
	}
	estExecutionQCMVerrouille() {
		const lExecutionQCM = this.getExecutionQCM();
		return !!lExecutionQCM && !!lExecutionQCM.estVerrouille;
	}
	composeZoneQCM() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("label", { "ie-html": "qcm.labelAssociation" }),
				IE.jsx.str(
					"ie-bouton",
					{
						class: "has-dots",
						"ie-model": "qcm.btnAssocier",
						"ie-display": "qcm.btnAssocier.estVisible",
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.SelectionnerUnQCM",
						),
					},
					"...",
				),
				IE.jsx.str("span", { "ie-html": "qcm.libelleQCM", class: "m-left" }),
			),
		);
		H.push(
			`<div class="field-contain" ie-display="qcm.estChoixServiceVisible">\n              <label> ${ObjetTraduction_1.GTraductions.getValeur("evaluations.FenetreEvaluationQCM.QCMPourLeService")}</label>\n              <div id="${this.getInstance(this.identComboServices).getNom()}"></div>\n            </div>`,
		);
		H.push(
			`<div class="field-contain" ie-display="qcm.reglagesVisible">\n              <label>${ObjetTraduction_1.GTraductions.getValeur("evaluations.FenetreEvaluationQCM.ReponsesEleveEntre")}</label>\n              <ie-btnicon ie-model="qcm.btnOptionsExecution" class="icon_cog bt-activable"></ie-btnicon>\n            </div>`,
		);
		H.push(
			`<div class="field-contain" ie-display="qcm.reglagesVisible">\n             <div id="${this.getInstance(this.identDisponibiliteQCM).getNom()}"></div>\n            </div>`,
		);
		return H.join("");
	}
	composeZoneDetailEvaluation() {
		const H = [];
		const lWidthLabel = "6.5rem";
		const lWidthCorrigeEtDansBilan = "9.3rem";
		H.push(
			`<div class="field-contain m-top-l">\n                <label style="width: 8.5rem;">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.EvaluationDu")}</label>\n                <div id="${this.getInstance(this.identSelecteurDateEvaluation).getNom()}"></div>\n            </div>`,
		);
		H.push(`<div class="flex-contain flex-center">`);
		H.push(
			`<div class="field-contain m-right-l fix-bloc">\n                <label style="width: 8.5rem;">${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.publieeLe")}</label>\n                <div id="${this.getInstance(this.identSelecteurDatePublication).getNom()}"></div>\n              </div>`,
		);
		H.push(
			`<div class="field-contain">\n                  <p class="message" ie-html="getHtmlInfoPublicationDecaleeParents"></p>\n              </div>`,
		);
		H.push(`</div>`);
		H.push(
			'<div class="field-contain" style="margin-left: ',
			lWidthCorrigeEtDansBilan,
			';">',
			'<ie-checkbox ie-model="detailEvaluation.cbAvecCorrige">',
			ObjetTraduction_1.GTraductions.getValeur("evaluations.avecLeCorrige"),
			"</ie-checkbox>",
			"</div>",
		);
		H.push(
			'<div class="field-contain" style="margin-left: ',
			lWidthCorrigeEtDansBilan,
			';">',
			'<ie-checkbox ie-model="detailEvaluation.cbPrendreEnCompteEvalDansBilan">',
			ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.FenetreSaisieEvaluation.PrendreEnCompteEvalDansBilan",
			),
			"</ie-checkbox>",
			"</div>",
		);
		H.push(`<div class="flex-contain cols top-line">`);
		H.push(
			`  <div class="field-contain">\n                <div class="flex-contain flex-center m-right-l">\n                  <label  style="min-width: ${lWidthLabel};">${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.periode1")} : </label>\n                  <div id="${this.getInstance(this.identComboPeriode).getNom()}"></div>\n                </div>\n\n                <div class="flex-contain flex-center m-right-l">\n                  <label>${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.periode2")} : </label>\n                  <div id="${this.getInstance(this.identComboPeriodeSecondaire).getNom()}"></div>\n                </div>\n\n                <div class="flex-contain flex-center">\n                  <label>${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>\n                  <div class="input-iconised"><ie-inputnote ie-model="detailEvaluation.inputCoefficient" class="m-right-l" style="width:5rem"></ie-inputnote>\n                   ${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFicheCoeff")}\n                </div>\n                </div>\n              </div>`,
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ style: "min-width: " + lWidthLabel + ";" },
					ObjetTraduction_1.GTraductions.getValeur("competences.intitule"),
				),
				IE.jsx.str("input", {
					class: "full-width",
					type: "text",
					"ie-model": "detailEvaluation.inputLibelle",
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain m-top-l" },
				IE.jsx.str("div", {
					id: this.getInstance(this.identListeCompetencesQCM).getNom(),
					class: "full-width ",
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain m-top-l" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "detailEvaluation.cbSansCompetenceDoublon" },
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreEvaluationQCM.NeComptabiliserQuUnNiveauPourCompetencesIdentiques",
					),
				),
			),
		);
		H.push(`</div>`);
		return H.join("");
	}
	composeZoneOptionsEvaluation() {
		const H = [];
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
			)
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain m-top-l" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "optionsEvaluation.avecCreationDevoir" },
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreEvaluationQCM.GenererDevoirALEvaluation",
						),
					),
				),
			);
		}
		return H.join("");
	}
	_getValeurMaxCoefficientEvaluation() {
		let lMaxCoefficientEvaluation = 99;
		if (
			!!this.donnees.evaluation &&
			!!this.donnees.evaluation.listeCompetences
		) {
			this.donnees.evaluation.listeCompetences.parcourir((D) => {
				if (!!D.coefficient && D.coefficient > 1) {
					lMaxCoefficientEvaluation = 1;
					return false;
				}
			});
		}
		return lMaxCoefficientEvaluation;
	}
	_getValeurMaxCoefficientCompetence() {
		let lMaxCoefficientCompetence = 100;
		if (
			!!this.donnees.evaluation &&
			this.donnees.evaluation.coefficient !== undefined &&
				this.donnees.evaluation.coefficient !== null &&
			this.donnees.evaluation.coefficient > 1
		) {
			lMaxCoefficientCompetence = 1;
		}
		return lMaxCoefficientCompetence;
	}
	_initialiserComboServices(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 200 });
	}
	_surEvenementComboServices(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (!!this.donnees.evaluation) {
				this.donnees.evaluation.service = aParams.element;
			}
			this._lancerRequeteListeCompetencesQCM(aParams.element);
		}
	}
	_lancerRequeteListeCompetencesQCM(aService) {
		new ObjetRequeteListeCompetencesQCM_1.ObjetRequeteListeCompetencesQCM(
			this,
			this._surRequeteListeCompetencesQCM.bind(this, true),
		).lancerRequete({
			qcm: this.getQCM(),
			service: aService,
			sansDoublon: this.donnees.sansDoublon,
		});
	}
	_surRequeteListeCompetencesQCM(aAvecActualisationPeriode, aJSON) {
		if (aAvecActualisationPeriode) {
			this.donnees.listePeriodesService = aJSON.listePeriodes;
			if (
				!this.donnees.evaluation.periode &&
				!!aJSON.listePeriodes &&
				aJSON.listePeriodes.count() > 0
			) {
				let lIndexPeriodeEvaluation =
					aJSON.listePeriodes.getIndiceElementParFiltre((D) => {
						return D.estParDefaut;
					});
				if (lIndexPeriodeEvaluation === -1) {
					lIndexPeriodeEvaluation = 0;
				}
				this.donnees.evaluation.periode = aJSON.listePeriodes.get(
					lIndexPeriodeEvaluation,
				);
			}
			this._actualiserComboPeriode();
		}
		this.donnees.avecCreationDevoirPossible =
			aJSON.avecCreationDevoirPossible && !this.estExecutionQCMVerrouille();
		if (!this.donnees.avecCreationDevoirPossible) {
			this.donnees.evaluation.avecDevoir = false;
		}
		this._actualiserListeCompetencesQCM(aJSON);
	}
	_actualiserListeCompetencesQCM(aJSON) {
		if (aJSON.listeCompetencesQCM) {
			const lEvaluation = this.donnees.evaluation;
			if (
				!!lEvaluation.listeCompetences &&
				lEvaluation.listeCompetences.count() > 0
			) {
				aJSON.listeCompetencesQCM.parcourir((aJSONCompetence) => {
					const lCompetenceDEvaluation =
						lEvaluation.listeCompetences.getElementParElement(aJSONCompetence);
					if (!!lCompetenceDEvaluation) {
						aJSONCompetence.coefficient = lCompetenceDEvaluation.coefficient;
					}
				});
			}
			lEvaluation.listeCompetences = aJSON.listeCompetencesQCM;
			if (lEvaluation.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
				lEvaluation.listeCompetences.parcourir((D) => {
					D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				});
			}
			const lDonneesListeCompetencesQCM =
				new DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM(
					lEvaluation.listeCompetences,
					{
						getValeurMaxCoefficientCompetence:
							this._getValeurMaxCoefficientCompetence(),
					},
				);
			lDonneesListeCompetencesQCM.setOptions({
				avecEdition: false,
				avecSuppression: false,
			});
			this.getInstance(this.identListeCompetencesQCM).setDonnees(
				lDonneesListeCompetencesQCM,
			);
		}
	}
	ouvrirFenetreAssociationQCM() {
		const lEvaluation = this.donnees.evaluation;
		new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(
			this,
			(aListeQCM) => {
				const lFenetreChoixQCMAvecCompetences =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
						{
							pere: this,
							evenement: function (aNumeroBouton, aQCM) {
								if (aNumeroBouton === 1) {
									UtilitaireQCM_1.UtilitaireQCM.surSelectionQCM(
										lEvaluation,
										aQCM,
										{
											genreAucune: Enumere_Ressource_1.EGenreRessource.Aucune,
											genreExecQCM:
												Enumere_Ressource_1.EGenreRessource.ExecutionQCM,
										},
									);
									this._lancerRequeteListeCompetencesQCM(lEvaluation.service);
								}
							},
							initialiser: (aInstance) => {
								UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(
									aInstance,
								);
								aInstance.setGenreRessources({
									genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
									genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
									genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
									genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
								});
							},
						},
					);
				lFenetreChoixQCMAvecCompetences.setDonnees(aListeQCM);
			},
		).lancerRequete({ service: lEvaluation.service });
	}
	ouvrirFenetreParametrageExecutionQCM() {
		const lEvaluation = this.donnees.evaluation;
		const lFenetreParametrageExecQCM =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							modale: true,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.ParametresExeQCMDevoir",
							),
							largeur: 540,
							hauteur: null,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
					},
					evenement: function (aNumeroBouton, aExecutionQCM) {
						if (aNumeroBouton === 1) {
							lEvaluation.executionQCM = aExecutionQCM;
						}
					},
				},
			);
		const lExecutionQCM = this.getExecutionQCM();
		if (
			lEvaluation.service &&
			!!lExecutionQCM &&
			lExecutionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			lExecutionQCM.estLieAEvaluation = true;
			lExecutionQCM.service = lEvaluation.service;
		}
		lFenetreParametrageExecQCM.setDonnees({
			afficherModeQuestionnaire: false,
			afficherRessentiEleve: true,
			autoriserSansCorrige: true,
			autoriserCorrigerALaDate: true,
			executionQCM: lExecutionQCM,
			avecConsigne: true,
			avecPersonnalisationProjetAccompagnement: true,
			avecModeCorrigeALaDate: true,
			avecMultipleExecutions: true,
			ObjetFenetre_DetailsPIEleve:
				ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
		});
	}
	_initialiserDisponibiliteQCM(aInstance) {
		aInstance.setOptionsAffichage({
			afficherSurUneSeuleLigne: true,
			chaines: [
				ObjetTraduction_1.GTraductions.getValeur("Le"),
				ObjetTraduction_1.GTraductions.getValeur("EtLe"),
			],
			avecHeureDebut: true,
			avecHeureFin: true,
		});
	}
	_surEvntSurDisponibiliteQCM(aDonnees) {
		const lExecutionQCM = this.getExecutionQCM();
		$.extend(lExecutionQCM, aDonnees);
		if (!!lExecutionQCM) {
			lExecutionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._miseAJourObjetDisponibilite();
		}
	}
	_miseAJourObjetDisponibilite() {
		const lExecutionQCM = this.getExecutionQCM();
		if (!!lExecutionQCM) {
			this.getInstance(this.identDisponibiliteQCM).setDonnees({
				dateDebutPublication: lExecutionQCM.dateDebutPublication,
				dateFinPublication: lExecutionQCM.dateFinPublication,
				actif: true,
				actifFin: !lExecutionQCM.estUnTAF,
			});
		}
	}
	_initialiserSelecteurDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ largeurComposant: 110 });
	}
	_surEvenementDateEvaluation(aDate) {
		if (!!this.donnees.evaluation) {
			this.donnees.evaluation.dateValidation = aDate;
			this.donnees.evaluation.datePublication = aDate;
			this.getInstance(
				this.identSelecteurDatePublication,
			).setPremiereDateSaisissable(aDate);
			this.getInstance(this.identSelecteurDatePublication).setDonnees(aDate);
			const lExecutionQCM = this.getExecutionQCM();
			if (lExecutionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
				const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
				const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
					GParametres.PlacesParJour - 1,
					true,
				);
				lExecutionQCM.dateDebutPublication = new Date(
					aDate.setHours(
						lPremiereHeure.getHours(),
						lPremiereHeure.getMinutes(),
					),
				);
				lExecutionQCM.dateFinPublication = new Date(
					aDate.setHours(
						lDerniereHeure.getHours(),
						lDerniereHeure.getMinutes(),
					),
				);
				UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(lExecutionQCM);
				this._miseAJourObjetDisponibilite();
			}
		}
	}
	_surEvenementDatePublication(aDate) {
		if (!!this.donnees.evaluation) {
			this.donnees.evaluation.datePublication = aDate;
		}
	}
	_initialiserCombosPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 110 });
	}
	_surEvenementPeriodeEvaluation(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.donnees.evaluation.periode = aParams.element;
			if (!this.avecSelectionPeriodeSecondaire) {
				const lThis = this;
				if (!lThis.donnees.evaluation.periode.genresPeriodesOfficielles) {
					lThis.donnees.evaluation.periodeSecondaire =
						new ObjetElement_1.ObjetElement("");
				}
				this.donnees.listePeriodesService.parcourir((aPeriode) => {
					if (
						lThis.donnees.evaluation.periode.genresPeriodesOfficielles &&
						lThis.donnees.evaluation.periode.genresPeriodesOfficielles.contains(
							aPeriode.genrePeriodeOfficielle,
						)
					) {
						lThis.donnees.evaluation.periodeSecondaire = aPeriode;
					}
				});
			}
			this._actualiserComboPeriodeSecondaire();
		}
	}
	_surEvenementPeriodeSecondaireEvaluation(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.donnees.evaluation.periodeSecondaire = aParams.element;
		}
	}
	_actualiserComboPeriode() {
		let lIndexPeriodeEvaluation = 0;
		const lListePeriodesEvaluation =
			new ObjetListeElements_1.ObjetListeElements();
		if (!!this.donnees.listePeriodesService) {
			lListePeriodesEvaluation.add(this.donnees.listePeriodesService);
			if (!!this.donnees.evaluation.periode) {
				const lNumeroPeriodeEvaluation =
					this.donnees.evaluation.periode.getNumero();
				lIndexPeriodeEvaluation =
					lListePeriodesEvaluation.getIndiceElementParFiltre((D) => {
						return D.getNumero() === lNumeroPeriodeEvaluation;
					});
			}
		}
		if (!lIndexPeriodeEvaluation || lIndexPeriodeEvaluation === -1) {
			lIndexPeriodeEvaluation = 0;
		}
		this.getInstance(this.identComboPeriode).setDonnees(
			lListePeriodesEvaluation,
			lIndexPeriodeEvaluation,
		);
	}
	_actualiserComboPeriodeSecondaire() {
		const lListePeriodesSecondaires =
			new ObjetListeElements_1.ObjetListeElements();
		lListePeriodesSecondaires.addElement(new ObjetElement_1.ObjetElement(""));
		if (!!this.donnees.listePeriodesService) {
			const lPeriodeEvaluation = !!this.donnees.evaluation
				? this.donnees.evaluation.periode
				: null;
			this.donnees.listePeriodesService.parcourir((D) => {
				if (
					!lPeriodeEvaluation ||
					D.getNumero() !== lPeriodeEvaluation.getNumero()
				) {
					lListePeriodesSecondaires.addElement(D);
				}
			});
		}
		const lIndiceSelection =
			!!lListePeriodesSecondaires &&
			!!this.donnees.evaluation &&
			!!this.donnees.evaluation.periodeSecondaire
				? lListePeriodesSecondaires.getIndiceParNumeroEtGenre(
						this.donnees.evaluation.periodeSecondaire.getNumero(),
					)
				: 0;
		this.getInstance(this.identComboPeriodeSecondaire).setDonnees(
			lListePeriodesSecondaires,
			lIndiceSelection,
		);
		this.getInstance(this.identComboPeriodeSecondaire).setActif(
			this.avecSelectionPeriodeSecondaire,
		);
	}
	_initialiserListeCompetencesQCM(aInstance) {
		aInstance.setOptionsListe(
			DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM.getOptionsListe(
				false,
			),
		);
	}
}
exports.ObjetFenetre_EvaluationQCM = ObjetFenetre_EvaluationQCM;

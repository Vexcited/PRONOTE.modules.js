const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetDisponibilite } = require("ObjetDisponibilite.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeNote } = require("TypeNote.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const {
	ObjetRequeteListeCompetencesQCM,
} = require("ObjetRequeteListeCompetencesQCM.js");
const {
	ObjetFenetre_ParamExecutionQCM,
} = require("ObjetFenetre_ParamExecutionQCM.js");
const {
	DonneesListe_EvaluationsQCM,
} = require("DonneesListe_EvaluationsQCM.js");
const { ObjetRequeteListeQCMCumuls } = require("ObjetRequeteListeQCMCumuls.js");
const { ObjetFenetre_SelectionQCM } = require("ObjetFenetre_SelectionQCM.js");
const { TypeModeCorrectionQCM } = require("TypeModeCorrectionQCM.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetFenetre_DetailsPIEleve,
} = require("ObjetFenetre_DetailsPIEleve.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
class ObjetFenetre_EvaluationQCM extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			avecTailleSelonContenu: true,
			largeur: 650,
			hauteur: 500,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = {
			evaluation: null,
			listePeriodesService: new ObjetListeElements(),
			avecChoixQCM: false,
			avecChoixService: false,
			sansDoublon: true,
			avecCreationDevoirPossible: false,
		};
		this.avecSelectionPeriodeSecondaire = !GEtatUtilisateur.pourPrimaire();
	}
	construireInstances() {
		this.identComboServices = this.add(
			ObjetSaisie,
			_surEvenementComboServices.bind(this),
			_initialiserComboServices,
		);
		this.identDisponibiliteQCM = this.add(
			ObjetDisponibilite,
			_surEvntSurDisponibiliteQCM.bind(this),
			_initialiserDisponibiliteQCM,
		);
		this.identSelecteurDateEvaluation = this.add(
			ObjetCelluleDate,
			_surEvenementDateEvaluation.bind(this),
			_initialiserSelecteurDate,
		);
		this.identSelecteurDatePublication = this.add(
			ObjetCelluleDate,
			_surEvenementDatePublication.bind(this),
			_initialiserSelecteurDate,
		);
		this.identComboPeriode = this.add(
			ObjetSaisie,
			_surEvenementPeriodeEvaluation.bind(this),
			_initialiserCombosPeriode,
		);
		this.identComboPeriodeSecondaire = this.add(
			ObjetSaisie,
			_surEvenementPeriodeSecondaireEvaluation.bind(this),
			_initialiserCombosPeriode,
		);
		this.identListeCompetencesQCM = this.add(
			ObjetListe,
			null,
			_initialiserListeCompetencesQCM,
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
					return GTraductions.getValeur(lCleTradAssociationQCM);
				},
				btnAssocier: {
					event: function () {
						ouvrirFenetreAssociationQCM.call(aInstance);
					},
					estVisible: function () {
						return !!aInstance.donnees.avecChoixQCM;
					},
				},
				libelleQCM: function () {
					const lQCM = getQCM.call(aInstance);
					return !!lQCM ? lQCM.getLibelle() : "";
				},
				estChoixServiceVisible: function () {
					return !!aInstance.donnees.avecChoixService;
				},
				btnOptionsExecution: {
					event: function () {
						ouvrirFenetreParametrageExecutionQCM.call(aInstance);
					},
				},
				reglagesVisible: function () {
					const lExecutionQCM = getExecutionQCM.call(aInstance);
					return lExecutionQCM && !lExecutionQCM.estUnTAF;
				},
			},
			detailEvaluation: {
				getHtmlInfoPublicationDecaleeParents() {
					let lMessageDateDecaleeAuxParents = "";
					const lEvaluation = aInstance.donnees.evaluation;
					if (
						!!lEvaluation &&
						GParametres.avecAffichageDecalagePublicationEvalsAuxParents &&
						!!GParametres.nbJDecalagePublicationAuxParents
					) {
						let lDatePublicationDecalee = GDate.formatDate(
							GDate.getJourSuivant(
								lEvaluation.datePublication,
								GParametres.nbJDecalagePublicationAuxParents,
							),
							" %JJ/%MM",
						);
						if (GParametres.nbJDecalagePublicationAuxParents === 1) {
							lMessageDateDecaleeAuxParents = GTraductions.getValeur(
								"evaluations.FenetreSaisieEvaluation.DecalageUnJourPublicationParentsSoitLe",
								[lDatePublicationDecalee],
							);
						} else {
							lMessageDateDecaleeAuxParents = GTraductions.getValeur(
								"evaluations.FenetreSaisieEvaluation.DecalageXJoursPublicationParentsSoitLe",
								[
									GParametres.nbJDecalagePublicationAuxParents,
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
							? new TypeNote(lEvaluation.coefficient)
							: new TypeNote(1);
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
							max: _getValeurMaxCoefficientEvaluation.bind(aInstance),
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
						return GTraductions.getTitreMFiche(
							"FenetreEvaluation.MFicheCoefficientSurEvaluation",
						);
					},
				},
				cbAvecCorrige: {
					getValue: function () {
						const lExecutionQCM = getExecutionQCM.call(aInstance);
						if (lExecutionQCM && lExecutionQCM.publierCorrige === undefined) {
							lExecutionQCM.publierCorrige =
								lExecutionQCM.modeDiffusionCorrige !==
								TypeModeCorrectionQCM.FBQ_CorrigeSans;
						}
						return !!lExecutionQCM ? !!lExecutionQCM.publierCorrige : false;
					},
					setValue: function (aValue) {
						const lExecutionQCM = getExecutionQCM.call(aInstance);
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
						return estExecutionQCMVerrouille.call(aInstance);
					},
					getValue: function () {
						return aInstance.donnees.sansDoublon;
					},
					setValue: function (aValue) {
						aInstance.donnees.sansDoublon = aValue;
						new ObjetRequeteListeCompetencesQCM(
							aInstance,
							_surRequeteListeCompetencesQCM.bind(aInstance, false),
						).lancerRequete({
							qcm: getQCM.call(aInstance),
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
		T.push(composeZoneQCM.call(this));
		T.push(composeZoneDetailEvaluation.call(this));
		if (!GEtatUtilisateur.pourPrimaire()) {
			T.push(composeZoneOptionsEvaluation.call(this));
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
			const lExecutionQCM = getExecutionQCM.call(this);
			if (!!lExecutionQCM) {
				_miseAJourObjetDisponibilite.call(this);
			}
			let lListeServices;
			let lIndexServiceSelectionne;
			if (this.donnees.avecChoixService) {
				const lQCM = getQCM.call(this);
				lListeServices = !!lQCM
					? lQCM.listeServicesCompatiblesAvecCompetencesDuQCM
					: new ObjetListeElements();
				lIndexServiceSelectionne = lListeServices.getIndiceParElement(
					this.donnees.evaluation.service,
				);
			} else {
				lListeServices = new ObjetListeElements();
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
}
function getQCM() {
	return this.donnees.evaluation
		? this.donnees.evaluation.executionQCM
			? this.donnees.evaluation.executionQCM.QCM
			: null
		: null;
}
function getExecutionQCM() {
	return this.donnees.evaluation ? this.donnees.evaluation.executionQCM : null;
}
function estExecutionQCMVerrouille() {
	const lExecutionQCM = getExecutionQCM.call(this);
	return !!lExecutionQCM && !!lExecutionQCM.estVerrouille;
}
function composeZoneQCM() {
	const H = [];
	H.push(
		`<div class="field-contain">\n            <label ie-html="qcm.labelAssociation"></label>\n            <ie-bouton  class="has-dots" ie-model="qcm.btnAssocier" ie-display="qcm.btnAssocier.estVisible">...</ie-bouton>\n            <span ie-html="qcm.libelleQCM" class="m-left"></span>\n          </div>`,
	);
	H.push(
		`<div class="field-contain" ie-display="qcm.estChoixServiceVisible">\n            <label> ${GTraductions.getValeur("evaluations.FenetreEvaluationQCM.QCMPourLeService")}</label>\n            <div id="${this.getInstance(this.identComboServices).getNom()}"></div>\n          </div>`,
	);
	H.push(
		`<div class="field-contain" ie-display="qcm.reglagesVisible">\n            <label>${GTraductions.getValeur("evaluations.FenetreEvaluationQCM.ReponsesEleveEntre")}</label>\n            <ie-btnicon ie-model="qcm.btnOptionsExecution" class="icon_cog bt-activable"></ie-btnicon>\n          </div>`,
	);
	H.push(
		`<div class="field-contain" ie-display="qcm.reglagesVisible">\n           <div id="${this.getInstance(this.identDisponibiliteQCM).getNom()}"></div>\n          </div>`,
	);
	return H.join("");
}
function composeZoneDetailEvaluation() {
	const H = [];
	const lWidthLabel = "6.5rem";
	const lWidthCorrigeEtDansBilan = "9.3rem";
	H.push(
		`<div class="field-contain m-top-l">\n              <label style="width: 8.5rem;">${GTraductions.getValeur("FenetreDevoir.EvaluationDu")}</label>\n              <div id="${this.getInstance(this.identSelecteurDateEvaluation).getNom()}"></div>\n          </div>`,
	);
	H.push(`<div class="flex-contain flex-center">`);
	H.push(
		`<div class="field-contain m-right-l fix-bloc">\n              <label style="width: 8.5rem;">${GTraductions.getValeur("evaluations.colonne.publieeLe")}</label>\n              <div id="${this.getInstance(this.identSelecteurDatePublication).getNom()}"></div>\n            </div>`,
	);
	H.push(
		`<div class="field-contain">\n                <p class="message" ie-html="getHtmlInfoPublicationDecaleeParents"></p>\n            </div>`,
	);
	H.push(`</div>`);
	H.push(
		'<div class="field-contain" style="margin-left: ',
		lWidthCorrigeEtDansBilan,
		';">',
		'<ie-checkbox ie-model="detailEvaluation.cbAvecCorrige">',
		GTraductions.getValeur("evaluations.avecLeCorrige"),
		"</ie-checkbox>",
		"</div>",
	);
	H.push(
		'<div class="field-contain" style="margin-left: ',
		lWidthCorrigeEtDansBilan,
		';">',
		'<ie-checkbox ie-model="detailEvaluation.cbPrendreEnCompteEvalDansBilan">',
		GTraductions.getValeur(
			"evaluations.FenetreSaisieEvaluation.PrendreEnCompteEvalDansBilan",
		),
		"</ie-checkbox>",
		"</div>",
	);
	H.push(`<div class="flex-contain cols top-line">`);
	H.push(
		`  <div class="field-contain">\n              <div class="flex-contain flex-center m-right-l">\n                <label  style="min-width: ${lWidthLabel};">${GTraductions.getValeur("evaluations.colonne.periode1")} : </label>\n                <div id="${this.getInstance(this.identComboPeriode).getNom()}"></div>\n              </div>\n\n              <div class="flex-contain flex-center m-right-l">\n                <label>${GTraductions.getValeur("evaluations.colonne.periode2")} : </label>\n                <div id="${this.getInstance(this.identComboPeriodeSecondaire).getNom()}"></div>\n              </div>\n\n              <div class="flex-contain flex-center">\n                <label>${GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>\n                <div class="input-iconised"><ie-inputnote ie-model="detailEvaluation.inputCoefficient" class="round-style m-right-l" style="width:5rem"></ie-inputnote>\n                 ${UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFicheCoeff")}\n              </div>\n              </div>\n            </div>`,
	);
	H.push(
		`  <div class="field-contain">\n              <label style="min-width: ${lWidthLabel};">${GTraductions.getValeur("competences.intitule")}</label>\n              <input class="round-style full-width" type="text" ie-model="detailEvaluation.inputLibelle"/>\n            </div>`,
	);
	H.push(
		`  <div class="field-contain m-top-l">\n              <div id="${this.getInstance(this.identListeCompetencesQCM).getNom()}" class="full-width "></div>\n            </div>`,
	);
	H.push(
		`  <div class="field-contain m-top-l">\n                <ie-checkbox ie-model="detailEvaluation.cbSansCompetenceDoublon">${GTraductions.getValeur("evaluations.FenetreEvaluationQCM.NeComptabiliserQuUnNiveauPourCompetencesIdentiques")}</ie-checkbox>\n            </div>`,
	);
	H.push(`</div>`);
	return H.join("");
}
function composeZoneOptionsEvaluation() {
	const H = [];
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionNotation)) {
		H.push(
			`  <div class="field-contain m-top-l">\n                  <ie-checkbox ie-model="optionsEvaluation.avecCreationDevoir">${GTraductions.getValeur("evaluations.FenetreEvaluationQCM.GenererDevoirALEvaluation")}</ie-checkbox>\n              </div>`,
		);
	}
	return H.join("");
}
function _getValeurMaxCoefficientEvaluation() {
	let lMaxCoefficientEvaluation = 99;
	if (!!this.donnees.evaluation && !!this.donnees.evaluation.listeCompetences) {
		this.donnees.evaluation.listeCompetences.parcourir((D) => {
			if (!!D.coefficient && D.coefficient > 1) {
				lMaxCoefficientEvaluation = 1;
				return false;
			}
		});
	}
	return lMaxCoefficientEvaluation;
}
function _getValeurMaxCoefficientCompetence() {
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
function _initialiserComboServices(aInstance) {
	aInstance.setOptionsObjetSaisie({ longueur: 200 });
}
function _surEvenementComboServices(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		if (!!this.donnees.evaluation) {
			this.donnees.evaluation.service = aParams.element;
		}
		_lancerRequeteListeCompetencesQCM.call(this, aParams.element);
	}
}
function _lancerRequeteListeCompetencesQCM(aService) {
	new ObjetRequeteListeCompetencesQCM(
		this,
		_surRequeteListeCompetencesQCM.bind(this, true),
	).lancerRequete({
		qcm: getQCM.call(this),
		service: aService,
		sansDoublon: this.donnees.sansDoublon,
	});
}
function _surRequeteListeCompetencesQCM(aAvecActualisationPeriode, aJSON) {
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
		_actualiserComboPeriode.call(this);
	}
	this.donnees.avecCreationDevoirPossible =
		aJSON.avecCreationDevoirPossible && !estExecutionQCMVerrouille.call(this);
	if (!this.donnees.avecCreationDevoirPossible) {
		this.donnees.evaluation.avecDevoir = false;
	}
	_actualiserListeCompetencesQCM.call(this, aJSON);
}
function _actualiserListeCompetencesQCM(aJSON) {
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
		if (lEvaluation.getEtat() === EGenreEtat.Creation) {
			lEvaluation.listeCompetences.parcourir((D) => {
				D.setEtat(EGenreEtat.Creation);
			});
		}
		const lDonneesListeCompetencesQCM = new DonneesListe_EvaluationsQCM(
			lEvaluation.listeCompetences,
			{
				getValeurMaxCoefficientCompetence:
					_getValeurMaxCoefficientCompetence.bind(this),
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
function ouvrirFenetreAssociationQCM() {
	const lThis = this;
	const lEvaluation = this.donnees.evaluation;
	new ObjetRequeteListeQCMCumuls(this, (aListeQCM) => {
		const lFenetreChoixQCMAvecCompetences = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionQCM,
			{
				pere: lThis,
				evenement: function (aNumeroBouton, aQCM) {
					if (aNumeroBouton === 1) {
						UtilitaireQCM.surSelectionQCM(lEvaluation, aQCM, {
							genreAucune: EGenreRessource.Aucune,
							genreExecQCM: EGenreRessource.ExecutionQCM,
						});
						_lancerRequeteListeCompetencesQCM.call(lThis, lEvaluation.service);
					}
				},
				initialiser: function (aInstance) {
					UtilitaireQCM.initFenetreSelectionQCM(aInstance);
					aInstance.setGenreRessources({
						genreQCM: EGenreRessource.QCM,
						genreNiveau: EGenreRessource.Niveau,
						genreMatiere: EGenreRessource.Matiere,
						genreAucun: EGenreRessource.Aucune,
					});
				},
			},
		);
		lFenetreChoixQCMAvecCompetences.setDonnees(aListeQCM);
	}).lancerRequete({ service: lEvaluation.service });
}
function ouvrirFenetreParametrageExecutionQCM() {
	const lEvaluation = this.donnees.evaluation;
	const lFenetreParametrageExecQCM = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_ParamExecutionQCM,
		{
			pere: this,
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					modale: true,
					titre: GTraductions.getValeur("FenetreDevoir.ParametresExeQCMDevoir"),
					largeur: 540,
					hauteur: null,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
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
	const lExecutionQCM = getExecutionQCM.call(this);
	if (
		lEvaluation.service &&
		!!lExecutionQCM &&
		lExecutionQCM.getEtat() === EGenreEtat.Creation
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
		ObjetFenetre_DetailsPIEleve: ObjetFenetre_DetailsPIEleve,
	});
}
function _initialiserDisponibiliteQCM(aInstance) {
	aInstance.setOptionsAffichage({
		afficherSurUneSeuleLigne: true,
		chaines: [GTraductions.getValeur("Le"), GTraductions.getValeur("EtLe")],
		avecHeureDebut: true,
		avecHeureFin: true,
	});
}
function _surEvntSurDisponibiliteQCM(aDonnees) {
	const lExecutionQCM = getExecutionQCM.call(this);
	$.extend(lExecutionQCM, aDonnees);
	if (!!lExecutionQCM) {
		lExecutionQCM.setEtat(EGenreEtat.Modification);
		_miseAJourObjetDisponibilite.call(this);
	}
}
function _miseAJourObjetDisponibilite() {
	const lExecutionQCM = getExecutionQCM.call(this);
	if (!!lExecutionQCM) {
		this.getInstance(this.identDisponibiliteQCM).setDonnees({
			dateDebutPublication: lExecutionQCM.dateDebutPublication,
			dateFinPublication: lExecutionQCM.dateFinPublication,
			actif: true,
			actifFin: !lExecutionQCM.estUnTAF,
		});
	}
}
function _initialiserSelecteurDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ largeurComposant: 110 });
}
function _surEvenementDateEvaluation(aDate) {
	if (!!this.donnees.evaluation) {
		this.donnees.evaluation.dateValidation = aDate;
		this.donnees.evaluation.datePublication = aDate;
		this.getInstance(
			this.identSelecteurDatePublication,
		).setPremiereDateSaisissable(aDate);
		this.getInstance(this.identSelecteurDatePublication).setDonnees(aDate);
		const lExecutionQCM = getExecutionQCM.call(this);
		if (lExecutionQCM.getEtat() === EGenreEtat.Creation) {
			const lPremiereHeure = GDate.placeEnDateHeure(0);
			const lDerniereHeure = GDate.placeEnDateHeure(
				GParametres.PlacesParJour - 1,
				true,
			);
			lExecutionQCM.dateDebutPublication = new Date(
				aDate.setHours(lPremiereHeure.getHours(), lPremiereHeure.getMinutes()),
			);
			lExecutionQCM.dateFinPublication = new Date(
				aDate.setHours(lDerniereHeure.getHours(), lDerniereHeure.getMinutes()),
			);
			UtilitaireQCM.verifierDateCorrection(lExecutionQCM);
			_miseAJourObjetDisponibilite.call(this);
		}
	}
}
function _surEvenementDatePublication(aDate) {
	if (!!this.donnees.evaluation) {
		this.donnees.evaluation.datePublication = aDate;
	}
}
function _initialiserCombosPeriode(aInstance) {
	aInstance.setOptionsObjetSaisie({ longueur: 110 });
}
function _surEvenementPeriodeEvaluation(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.donnees.evaluation.periode = aParams.element;
		if (!this.avecSelectionPeriodeSecondaire) {
			const lThis = this;
			if (!lThis.donnees.evaluation.periode.genresPeriodesOfficielles) {
				lThis.donnees.evaluation.periodeSecondaire = new ObjetElement("");
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
		_actualiserComboPeriodeSecondaire.call(this);
	}
}
function _surEvenementPeriodeSecondaireEvaluation(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.donnees.evaluation.periodeSecondaire = aParams.element;
	}
}
function _actualiserComboPeriode() {
	let lIndexPeriodeEvaluation = 0;
	const lListePeriodesEvaluation = new ObjetListeElements();
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
function _actualiserComboPeriodeSecondaire() {
	const lListePeriodesSecondaires = new ObjetListeElements();
	lListePeriodesSecondaires.addElement(new ObjetElement(""));
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
function _initialiserListeCompetencesQCM(aInstance) {
	aInstance.setOptionsListe(DonneesListe_EvaluationsQCM.getOptionsListe(false));
}
module.exports = { ObjetFenetre_EvaluationQCM };

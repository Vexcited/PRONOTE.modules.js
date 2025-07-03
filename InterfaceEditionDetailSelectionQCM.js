exports.InterfaceEditionDetailSelectionQCM = void 0;
const ObjetSaisieQCM_1 = require("ObjetSaisieQCM");
const ObjetFenetre_EditionQuestionQCM_1 = require("ObjetFenetre_EditionQuestionQCM");
const ObjetRequeteQCMQuestions_1 = require("ObjetRequeteQCMQuestions");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetre_BaremeQCM_1 = require("ObjetFenetre_BaremeQCM");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetParamExecutionQCM_1 = require("ObjetParamExecutionQCM");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const TypeNumerotation_1 = require("TypeNumerotation");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const AccessApp_1 = require("AccessApp");
var GenreOngletDetailSelection;
(function (GenreOngletDetailSelection) {
	GenreOngletDetailSelection[
		(GenreOngletDetailSelection["ListeQuestions"] = 0)
	] = "ListeQuestions";
	GenreOngletDetailSelection[(GenreOngletDetailSelection["Modalites"] = 1)] =
		"Modalites";
})(GenreOngletDetailSelection || (GenreOngletDetailSelection = {}));
class InterfaceEditionDetailSelectionQCM extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecResultats: true,
			avecModalitesExec: true,
			estModeCollab: false,
			avecAffNotation: false,
			avecOptionPDFCopie: false,
			avecGestionBaremeSurQuestion: true,
			avecConsigne: true,
			avecPersonnalisationProjetAccompagnement: false,
			afficherAssouplissement: true,
			avecRectificationNotePossible: false,
			avecModeCorrigeALaDate: false,
			avecMultipleExecutions: false,
		};
		this.idContenu = this.Nom + "_Contenu";
		this.idMsgSelect = this.Nom + "_MsgSelect";
		this.idOnglets = this.Nom + "_Onglets";
		this.idBandeauQcm = this.Nom + "_BandeauQcm";
		this.idContenuModaliteScroll = this.idContenu + "_Modalite_Scroll";
		this.idContenuModalite = this.idContenu + "_Modalite";
		this.idMessageQCMSansResultat = this.idContenu + "_MessageQCMSansResultat";
		this.numeroElementEnEchec = null;
		this.compteurEchec = 0;
		this.ongletSelectionne = GenreOngletDetailSelection.ListeQuestions;
		this.questionsEnCopies = new ObjetListeElements_1.ObjetListeElements();
		this.avecValidationAuto = true;
		this.ObjetFenetre_DetailsPIEleve = null;
	}
	construireInstancesOnglets() {
		this.identOnglets = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this.evntSurOnglets,
			this.initOnglets,
		);
	}
	construireInstancesSaisieQCM() {
		this.idSaisieQCM = this.add(
			ObjetSaisieQCM_1.ObjetSaisieQCM,
			this.evntSurSaisieQCM,
			function (aInstance) {
				aInstance.setOptions({
					avecGestionBareme: this.options.avecGestionBaremeSurQuestion,
				});
			},
		);
	}
	construireInstancesEditionQuestionQCM() {
		this.identFenetreEditionQuestionQCM = this.addFenetre(
			ObjetFenetre_EditionQuestionQCM_1.ObjetFenetre_EditionQuestionQCM,
			this.evntSurEditionQuestionQCM,
			this.initEditionQuestionQCM,
		);
	}
	construireInstancesParamExecQCM() {
		this.identParamExecQCM = this.add(
			ObjetParamExecutionQCM_1.ObjetParamExecutionQCM,
			this.evntSurParamExecQCM,
			null,
		);
	}
	construireInstancesEditionBaremeQCM() {
		this.identFenetreEditionBaremeQCM = this.addFenetre(
			ObjetFenetre_BaremeQCM_1.ObjetFenetre_BaremeQCM,
			this.evenementFenetreEditionBaremeQCM,
			this._initialiserFenetreEditionBaremeQCM,
		);
	}
	construireInstances() {
		this.construireInstancesOnglets();
		this.construireInstancesSaisieQCM();
		this.construireInstancesParamExecQCM();
		this.construireInstancesEditionQuestionQCM();
		this.construireInstancesEditionBaremeQCM();
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
	}
	detruireInstances() {
		clearTimeout(this.timerQCM);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	avecComboNumerotationQuestions() {
		return true;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecAffichageBandeau: function () {
				return !!aInstance.element;
			},
			getTitreBandeauQCM: function () {
				let lTitre = "";
				const lExecOuQCM = aInstance.element;
				if (!!lExecOuQCM) {
					const lQCM = aInstance._getQCM(lExecOuQCM, aInstance.listeQCM);
					if (!!lQCM) {
						if (aInstance.options.avecGestionBaremeSurQuestion) {
							if (lExecOuQCM.nombreQuestionsSoumises) {
								lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.TitreQCMQSoumises",
									[
										lQCM.getLibelle(),
										lExecOuQCM.nombreQuestionsSoumises,
										lQCM.nbQuestionsTotal,
										lExecOuQCM.nombreDePoints,
									],
								);
							} else {
								lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.TitreQCM",
									[
										lQCM.getLibelle(),
										lQCM.nbQuestionsTotal,
										lExecOuQCM.nombreDePoints,
									],
								);
							}
						} else {
							if (lExecOuQCM.nombreQuestionsSoumises) {
								lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.TitreQCMQSoumisesSansPoint",
									[
										lQCM.getLibelle(),
										lExecOuQCM.nombreQuestionsSoumises,
										lQCM.nbQuestionsTotal,
									],
								);
							} else {
								lTitre = ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.TitreQCMSansPoint",
									[lQCM.getLibelle(), lQCM.nbQuestionsTotal],
								);
							}
						}
					}
				}
				return lTitre;
			},
			avecComboNumerotation: function () {
				return aInstance.avecComboNumerotationQuestions();
			},
			comboNumerotationQuestions: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						estLargeurAuto: true,
						getTailleElementlargeurAuto: function (aElement, aEstGras) {
							return Math.ceil(
								ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
									aElement.getLibelle(),
									15,
									aEstGras,
								),
							);
						},
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Numerotation.TypeNumerotationQuestions",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						const lListeTypeNum = new ObjetListeElements_1.ObjetListeElements();
						lListeTypeNum.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"Numerotation.NumerotationArabe",
								),
								null,
								TypeNumerotation_1.TypeNumerotation.n123,
							),
						);
						lListeTypeNum.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"Numerotation.NumerotationABC",
								),
								null,
								TypeNumerotation_1.TypeNumerotation.nABC,
							),
						);
						lListeTypeNum.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"Numerotation.NumerotationRomaine",
								),
								null,
								TypeNumerotation_1.TypeNumerotation.NRoman,
							),
						);
						return lListeTypeNum;
					}
				},
				getIndiceSelection: function (aCombo) {
					let lIndiceSelection = -1;
					const lQCM = aInstance.qcm;
					if (!!lQCM && !!aCombo.getListeElements()) {
						aCombo.getListeElements().parcourir((aTypeNumerotation, aIndex) => {
							if (aTypeNumerotation.getGenre() === lQCM.typeNumerotation) {
								lIndiceSelection = aIndex;
								return false;
							}
						});
					}
					return Math.max(lIndiceSelection, 0);
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						if (
							aInstance.qcm.typeNumerotation !== aParametres.element.getGenre()
						) {
							aInstance.qcm.typeNumerotation = aParametres.element.getGenre();
							aInstance.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aInstance.setEtatSaisie(true);
							aInstance
								.getInstance(aInstance.idSaisieQCM)
								.actualiserAffichage();
						}
					}
				},
				getDisabled: function () {
					let lEstActif = true;
					if (aInstance.options.estModeCollab) {
						lEstActif = !!aInstance.qcm && !aInstance.qcm.avecVerrouCollab;
					}
					return !lEstActif;
				},
			},
			btnResultats: {
				event: function () {
					aInstance.callback.appel({
						genreEvnt:
							InterfaceEditionDetailSelectionQCM.GenreCallback
								.afficherResultats,
					});
				},
				getDisabled: function () {
					if (!aInstance.element) {
						return true;
					} else if (aInstance.element.getGenre() === aInstance.genreQCM) {
						let lAUneExec = false;
						aInstance.listeQCM.parcourir((aElement) => {
							if (
								aElement.getGenre() === aInstance.genreExecQCM &&
								aElement.QCM &&
								aInstance.element.egalParNumeroEtGenre(aElement.QCM.getNumero())
							) {
								lAUneExec = true;
								return false;
							}
						});
						return !lAUneExec;
					}
					return false;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push('<div class="interface_affV">');
		T.push(
			'<div ie-display="avecAffichageBandeau" class="bandeau-qcm" id="',
			this.idBandeauQcm,
			'">',
			'<span ie-html="getTitreBandeauQCM"></span>',
			'<ie-combo ie-if="avecComboNumerotation" ie-model="comboNumerotationQuestions"></ie-combo>',
			"</div>",
		);
		T.push(
			`<div id="${this.idOnglets}" class="interface_affV_client" style="width:100%;max-width:calc(100% - 4px);">`,
			`<div id="${this.idMsgSelect}" class="flex-contain cols flex-center justify-center" style="height:100%;">`,
			'<div class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SelectionnerUnQCM"),
			"</div>",
			"</div>",
			'<div class="flex-contain">',
			`<div id="${this.getInstance(this.identOnglets).getNom()}" class="conteneur-tabs"></div>`,
			`<ie-bouton class="themeBoutonPrimaire m-left-l" ie-icon="icon_notes_etoile" ie-model="btnResultats">${ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SaisieResultats")}</ie-bouton>`,
			"</div>",
			`<div id="${this.idContenu}" class="tabs-contenu">`,
			`<div class="full-height" id="${this.getInstance(this.idSaisieQCM).getNom()}">`,
			ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SaisieQuestions"),
			"</div>",
			`<div id="${this.idContenuModaliteScroll}" style="display:none;overflow:auto;">`,
			'<div id="',
			this.idContenuModalite,
			'"></div>',
			"</div>",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
		return this;
	}
	setDonnees(aParam) {
		this.listeQCM = aParam.listeQCM;
		this.genreQCM = aParam.genreQCM;
		this.genreExecQCM = aParam.genreExecQCM;
	}
	_getQCM(aElementQCM, aListeQCM) {
		let lQCM = null;
		if (!!aElementQCM) {
			if (aElementQCM.pere && aElementQCM.pere.existeNumero()) {
				lQCM = aListeQCM.getElementParNumero(aElementQCM.pere.getNumero());
			} else {
				lQCM = aElementQCM;
			}
		}
		return lQCM;
	}
	_estUneExecutionQCM(aElt) {
		return aElt && aElt.getGenre() === this.genreExecQCM;
	}
	recupererDonnees() {
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this._surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurFinResize,
			this._surFinResize,
		);
		this._initialiser({ initOngletSelectionne: true });
		if (
			this.ongletSelectionne !== undefined &&
			this.getInstance(this.identOnglets)
		) {
			this.getInstance(this.identOnglets).selectOnglet(
				this.ongletSelectionne,
				true,
			);
		}
	}
	_initialiser(aParam) {
		if (aParam.initOngletSelectionne === true) {
			$("#" + this.getInstance(this.idSaisieQCM).getNom().escapeJQ())
				.show()
				.siblings()
				.hide();
		} else {
			$("#" + this.idContenu.escapeJQ())
				.children("div")
				.eq(this.ongletSelectionne)
				.show()
				.siblings()
				.hide();
		}
		this.element = null;
		$("#" + this.idMsgSelect.escapeJQ())
			.children("div")
			.text(
				ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SelectionnerUnQCM"),
			)
			.end()
			.show()
			.siblings()
			.hide();
	}
	setSelection(aParam) {
		this.element = aParam.selection;
		if (this.element) {
			const lQCM = this._getQCM(this.element, this.listeQCM);
			if (!!lQCM) {
				if (!lQCM.contenuQCM) {
					new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
						this,
						this.actionSurQCMQuestions.bind(this, {}),
					).lancerRequete({ element: this.element });
				} else {
					if (this.options.estModeCollab) {
						new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
							this,
							this.actionSurQCMQuestions.bind(this, {
								QCM: lQCM.contenuQCM,
								changementQCM: aParam.chgmtQcm,
								verrouUniquement: true,
							}),
						).lancerRequete({ element: this.element, verrouUniquement: true });
					} else {
						this.actionSurQCMQuestions(
							{ verrouUniquement: false },
							{ QCM: lQCM.contenuQCM, changementQCM: aParam.chgmtQcm },
						);
					}
				}
			}
		}
	}
	reloadQCM() {
		if (
			this.compteurEchec < 30 &&
			this.numeroElementEnEchec === this.element.getNumero()
		) {
			new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
				this,
				this.actionSurQCMQuestions.bind(this, {}),
			).lancerRequete({ element: this.element });
		} else {
			this.compteurEchec = 0;
			this.numeroElementEnEchec = null;
			this.element.enEtatActualisation = false;
			this.$refreshSelf();
		}
	}
	actionSurQCMQuestions(aCtx, aParam) {
		if (aParam.message) {
			$("#" + this.getInstance(this.idSaisieQCM).getNom().escapeJQ())
				.show()
				.siblings()
				.hide();
			$("#" + this.idMsgSelect.escapeJQ())
				.children("div")
				.text(aParam.message)
				.end()
				.show()
				.siblings()
				.hide();
			this.callback.appel({
				genreEvnt:
					InterfaceEditionDetailSelectionQCM.GenreCallback.affichageQuestions,
				avecMsg: true,
			});
			this.numeroElementEnEchec = this.element.getNumero();
			this.compteurEchec++;
			clearTimeout(this.timerQCM);
			this.element.enEtatActualisation = true;
			this.timerQCM = setTimeout(this.reloadQCM.bind(this), 2000);
			return;
		} else {
			this.element.enEtatActualisation = false;
		}
		this.compteurEchec = 0;
		this.numeroElementEnEchec = null;
		let lElementContenuQCM = null;
		let lEstExecution = false;
		if (this.element.pere && this.element.pere.existeNumero()) {
			lElementContenuQCM = this.listeQCM.getElementParNumero(
				this.element.pere.getNumero(),
			);
			lEstExecution = true;
		} else {
			lElementContenuQCM = this.element;
		}
		const lUniquementVerrou = aCtx.verrouUniquement === true;
		lElementContenuQCM.contenuQCM = lUniquementVerrou ? aCtx.QCM : aParam.QCM;
		if (lEstExecution) {
			if (this.element.QCM) {
				this.element.QCM.contenuQCM = lElementContenuQCM.contenuQCM;
			}
		} else {
			this.element.contenuQCM = lElementContenuQCM.contenuQCM;
		}
		const lEstQCMContenu =
			this._estUneExecutionQCM(this.element) &&
			!this.element.estLieADevoir &&
			!this.element.estLieAEvaluation &&
			!this.element.estUnTAF;
		this.setDonneesModalitesExec({
			estUneExecution: this._estUneExecutionQCM(this.element),
			afficherDatesPublication: !lEstQCMContenu,
			afficherModeQuestionnaire:
				this.options.avecAffNotation && !lEstQCMContenu,
			afficherRessentiEleve: !lEstQCMContenu,
			afficherAssouplissement: this.options.afficherAssouplissement,
			autoriserSansCorrige: !lEstQCMContenu,
			autoriserCorrigerALaDate: !lEstQCMContenu,
			executionQCM: this.element,
			avecConsigne: this.options.avecConsigne,
			avecPersonnalisationProjetAccompagnement:
				this.options.avecPersonnalisationProjetAccompagnement,
			avecModeCorrigeALaDate: this.options.avecModeCorrigeALaDate,
			avecMultipleExecutions: this.options.avecMultipleExecutions,
			ObjetFenetre_DetailsPIEleve: this.ObjetFenetre_DetailsPIEleve,
		});
		this.qcm = lElementContenuQCM.contenuQCM;
		if (lElementContenuQCM.matiere) {
			this.qcm.matiere = lElementContenuQCM.matiere;
		}
		if (lElementContenuQCM.niveau) {
			this.qcm.niveau = lElementContenuQCM.niveau;
		}
		if (lUniquementVerrou === true) {
			this.qcm.avecVerrouCollab = aParam.QCM.avecVerrouCollab;
			this.qcm.possesseurVerrou = aParam.QCM.possesseurVerrou;
		}
		let lInfosCollab = null;
		if (this.options.estModeCollab) {
			lInfosCollab = {
				avecVerrouCollab: this.qcm.avecVerrouCollab,
				possesseurVerrou: this.qcm.possesseurVerrou,
			};
		}
		const lJqMsgSelec = $("#" + this.idMsgSelect.escapeJQ());
		if (lJqMsgSelec.is(":visible")) {
			lJqMsgSelec.hide().siblings().show();
		}
		this.callback.appel({
			genreEvnt:
				InterfaceEditionDetailSelectionQCM.GenreCallback.affichageQuestions,
			avecMsg: false,
			estExecution: lEstExecution,
			typeNumerotation: this.qcm.typeNumerotation,
			infosCollab: lInfosCollab,
		});
		this.actualiserListeQuestions();
		this.callback.appel({
			genreEvnt:
				InterfaceEditionDetailSelectionQCM.GenreCallback.modificationDetail,
		});
	}
	validationAuto() {
		if (this.avecValidationAuto) {
			this.callback.appel({
				genreEvnt:
					InterfaceEditionDetailSelectionQCM.GenreCallback.validationAuto,
				numero: this.qcm.getNumero(),
			});
		}
	}
	construireMessage(aMessage) {
		const H = [];
		H.push(' <div class="Texte10 AlignementMilieu GrandEspaceHaut Gras">');
		H.push(aMessage);
		H.push(" </div>");
		return H.join("");
	}
	initOnglets(aInstance) {
		const lListeOnglets = new ObjetListeElements_1.ObjetListeElements();
		lListeOnglets.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SaisieQuestions"),
				null,
				GenreOngletDetailSelection.ListeQuestions,
			),
		);
		if (this.options.avecModalitesExec) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.SaisieModaliteExe",
					),
					null,
					GenreOngletDetailSelection.Modalites,
				),
			);
		}
		aInstance.setListeOnglets(lListeOnglets);
	}
	evntSurOnglets(aElement) {
		this.ongletSelectionne = aElement.getGenre();
		switch (aElement.getGenre()) {
			case GenreOngletDetailSelection.ListeQuestions:
				$("#" + this.getInstance(this.idSaisieQCM).getNom().escapeJQ())
					.show()
					.siblings()
					.hide();
				this.getInstance(this.idSaisieQCM).afficherListe();
				break;
			case GenreOngletDetailSelection.Modalites:
				$("#" + this.idContenuModaliteScroll.escapeJQ())
					.show()
					.siblings()
					.hide();
				break;
		}
	}
	evntSurSaisieQCM(aParam) {
		switch (aParam.action) {
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.OuvrirEdition: {
				const lParamIndice = aParam.indice;
				const lQuestionQCM = this.qcm.listeQuestions.get(lParamIndice);
				this.questionsEnCopies.vider();
				this.questionsEnCopies.add(lQuestionQCM);
				this.getInstance(this.identFenetreEditionQuestionQCM).setDonnees({
					eltQuestion: lQuestionQCM,
					avecEditionBareme: this.element.nombreQuestionsSoumises === 0,
					nbPointAutresQuestions: this.calculNbPointAutresQuestions(),
					qcm: this.qcm,
					listePaliersDesReferentielsUniques:
						this.element.listePaliersDesReferentielsUniques,
				});
				break;
			}
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.AjouterQuestion: {
				const lNewQuest = new ObjetElement_1.ObjetElement(
					"",
					null,
					aParam.genre,
					this.qcm.listeQuestions.count(),
				);
				$.extend(lNewQuest, {
					note:
						this.element.nombreQuestionsSoumises === 0
							? 1
							: this.qcm.listeQuestions.get(0).note,
					enonce: "",
					image: "",
					casesensitive: true,
					questionNonValidee: true,
					nouvellePosition: this.qcm.listeQuestions.count(),
					listeEvaluations: new ObjetListeElements_1.ObjetListeElements(),
				});
				if (
					aParam.genre !==
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeField &&
					aParam.genre !==
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeFixed &&
					aParam.genre !==
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeVariable
				) {
					$.extend(lNewQuest, {
						listeReponses: new ObjetListeElements_1.ObjetListeElements(),
					});
				}
				this.questionsEnCopies.vider();
				if (
					this.calculNbPointAutresQuestions() < GParametres.maxNombrePointsQCM
				) {
					this.getInstance(this.identFenetreEditionQuestionQCM).setDonnees({
						eltQuestion: lNewQuest,
						avecEditionBareme: this.element.nombreQuestionsSoumises === 0,
						nbPointAutresQuestions: this.calculNbPointAutresQuestions(),
						qcm: this.qcm,
						listePaliersDesReferentielsUniques:
							this.element.listePaliersDesReferentielsUniques,
					});
				} else if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.BaremeQCMMax",
								[GParametres.maxNombrePointsQCM],
							),
						});
				}
				break;
			}
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.SupprimerQuestion:
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.ConfirmDeleteQuestion",
						),
						callback: this.surSuppressionQuestion.bind(this),
					});
				break;
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.DupliquerQuestion: {
				const lNbPointFutur =
					this.element.nombreDePoints +
					(this.element.nombreDePoints - this.calculNbPointAutresQuestions());
				if (lNbPointFutur < GParametres.maxNombrePointsQCM) {
					this.surDupliquerQuestion();
				} else {
					if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.BaremeQCMMax",
									[GParametres.maxNombrePointsQCM],
								),
							});
					}
				}
				break;
			}
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.ModifierPonderation:
				this.getInstance(this.identFenetreEditionBaremeQCM).setDonnees();
				break;
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.DeplacerQuestion:
				if (this.qcm.listeQuestions.existeElementPourValidation()) {
					this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
					const lIndice = this.qcm.listeQuestions.getIndiceElementParFiltre(
						(aElement) => {
							return (
								aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Creation ||
								aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression
							);
						},
					);
					if (lIndice === -1) {
						this.validationAuto();
					}
				}
				break;
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.Selection:
				this.questionsEnCopies.vider();
				if (!!aParam.listeQuestions && aParam.listeQuestions.count() > 0) {
					this.questionsEnCopies.add(aParam.listeQuestions);
				}
				break;
			default:
				break;
		}
		this.callback.appel({
			genreEvnt:
				InterfaceEditionDetailSelectionQCM.GenreCallback.modificationDetail,
		});
	}
	surDupliquerQuestion() {
		const lThis = this;
		this.questionsEnCopies.parcourir((aQuestionEnCopie) => {
			const lEltCopie =
				MethodesObjet_1.MethodesObjet.dupliquer(aQuestionEnCopie);
			lEltCopie.setLibelle(
				ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.CopieDe"),
					[lEltCopie.getLibelle()],
				),
			);
			lEltCopie.Numero = null;
			lEltCopie.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			lEltCopie.Position = lThis.qcm.listeQuestions.count();
			lEltCopie.nouvellePosition = lEltCopie.Position;
			if (lEltCopie.listeReponses) {
				for (let i = 0; i < lEltCopie.listeReponses.count(); i++) {
					const lRep = lEltCopie.listeReponses.get(i);
					lRep.Numero = null;
					lRep.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					if (lRep.associationA) {
						lRep.associationA.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					}
					if (lRep.associationB) {
						lRep.associationB.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					}
				}
			}
			if (lEltCopie.listeEvaluations) {
				for (let j = 0; j < lEltCopie.listeEvaluations.count(); j++) {
					const lEval = lEltCopie.listeEvaluations.get(j);
					lEval.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			}
			lThis.evtSurListeQuestions(lEltCopie);
		});
		this.validationAuto();
	}
	evtSurListeQuestions(aEltQuestion) {
		this.qcm.listeQuestions.addElement(
			aEltQuestion,
			aEltQuestion.getPosition(),
		);
		if (this.questionsEnCopies.count() === 1) {
			if (aEltQuestion.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
				aEltQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aEltQuestion.Etat = Enumere_Etat_1.EGenreEtat.Modification;
			}
		} else {
			aEltQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		}
		this.element.enEtatActualisation = true;
		this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.actualiserListeQuestions();
	}
	surSuppressionQuestion(aBouton) {
		if (aBouton === Enumere_Action_1.EGenreAction.Valider) {
			const lThis = this;
			this.questionsEnCopies.parcourir((aQuestionEnCopie) => {
				const lQuestion = lThis.qcm.listeQuestions.getElementParNumero(
					aQuestionEnCopie.getNumero(),
				);
				if (lQuestion.questionNonValidee) {
					lThis.qcm.listeQuestions.removeFilter((aQuestion) => {
						return aQuestion.getNumero() === lQuestion.getNumero();
					});
				} else {
					lQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				}
			});
			this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.actualiserListeQuestions();
			this.validationAuto();
		}
	}
	evntSurParamExecQCM() {
		this.setEtatSaisie(true);
		this.callback.appel({
			genreEvnt:
				InterfaceEditionDetailSelectionQCM.GenreCallback.modificationDetail,
			avecValidationAuto: this.avecValidationAuto,
			selection: this.element,
		});
	}
	setDonneesModalitesExec(aDonnees) {
		this.getInstance(this.identParamExecQCM).setDonnees(aDonnees);
		ObjetHtml_1.GHtml.setHtml(
			this.idContenuModalite,
			this.getInstance(this.identParamExecQCM).composeContenu(),
			{ controleur: this.getInstance(this.identParamExecQCM).controleur },
		);
		this.getInstance(this.identParamExecQCM).actualiser();
	}
	initEditionQuestionQCM(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			largeur: 750,
			hauteur: null,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecRetaillage: true,
		});
	}
	evntSurEditionQuestionQCM(aNumeroBouton, aEltQuestion) {
		if (aNumeroBouton === 1) {
			this.evtSurListeQuestions(aEltQuestion);
			this.validationAuto();
		} else if (aNumeroBouton === 100) {
			const lElementPourVisuQuestion = $.extend(
				MethodesObjet_1.MethodesObjet.dupliquer(this.element),
				{ modeVisuQuestion: true, questionEnVisu: aEltQuestion.getPosition() },
			);
			lElementPourVisuQuestion.QCM = MethodesObjet_1.MethodesObjet.dupliquer(
				lElementPourVisuQuestion.contenuQCM,
			);
			const lEltQuestion =
				MethodesObjet_1.MethodesObjet.dupliquer(aEltQuestion);
			if (lEltQuestion.listeReponses) {
				lEltQuestion.listeReponses =
					lEltQuestion.listeReponses.getListeElements((aElement) => {
						return aElement.existe();
					});
			}
			if (
				[
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeFixed,
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeField,
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeVariable,
				].includes(lEltQuestion.getGenre())
			) {
				lEltQuestion.enonceOriginel = lEltQuestion.enonce;
				lEltQuestion.listeReponses =
					new ObjetListeElements_1.ObjetListeElements();
				lEltQuestion.enonce = lEltQuestion.enonce.replace(
					/{[0-9]*:(ShortAnswer|MultiChoice):(~*(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)+}/gi,
					(ele) => {
						const lEltReponse = new ObjetElement_1.ObjetElement();
						lEltReponse.listeChoix = [];
						if (ele.search(/:multichoice:/gi) > -1) {
							const lResponses = ele.match(
								/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
							);
							for (const x in lResponses) {
								if (!x || (typeof x === "number" && isNaN(x))) {
									continue;
								}
								lResponses[x] = lResponses[x].replace(
									/^(multichoice:|shortanswer:)/i,
									"",
								);
								lResponses[x] = lResponses[x].replace(/^(:|~)?=/, "%100%");
								lResponses[x] = lResponses[x].replace(
									/^(:|~)?([^~%#{}])/,
									"%0%$2",
								);
								const lResponse = lResponses[x].split("%");
								lResponse.splice(
									2,
									1,
									lResponse[2].split("#")[0],
									lResponse[2].split("#")[1],
								);
								lEltReponse.listeChoix.push(lResponse[2]);
							}
						}
						lEltQuestion.listeReponses.addElement(lEltReponse);
						return "{#}";
					},
				);
			} else if (
				lEltQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_Matching
			) {
				const lListeHashesConnus = [];
				lEltQuestion.listeReponses.parcourir((aReponse) => {
					let lHashContenu = "";
					const lStrContenu =
						UtilitaireQCM_1.UtilitaireQCM.getValeurContenuReponseMatching(
							aReponse.associationB,
						);
					if (!!lStrContenu) {
						const lIndex = lListeHashesConnus.indexOf(lStrContenu);
						if (lIndex === -1) {
							lListeHashesConnus.push(lStrContenu);
							lHashContenu = (lListeHashesConnus.length - 1).toString();
						} else {
							lHashContenu = lIndex.toString();
						}
					}
					aReponse.associationB.hashContenu = lHashContenu;
					aReponse.bonneReponse.hashContenu = lHashContenu;
				});
			} else if (
				lEltQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SpellAnswer
			) {
				let lBonneReponse = "";
				if (
					lEltQuestion.listeReponses &&
					lEltQuestion.listeReponses.count() > 0
				) {
					lBonneReponse = lEltQuestion.listeReponses.get(0).getLibelle() || "";
				}
				lEltQuestion.longueurReponseEpellation = lBonneReponse.length;
			}
			lElementPourVisuQuestion.QCM.listeQuestions.addElement(
				lEltQuestion,
				lEltQuestion.getPosition(),
			);
			lElementPourVisuQuestion.QCM.nbQuestion =
				lElementPourVisuQuestion.QCM.listeQuestions.count();
			lElementPourVisuQuestion.modeDiffusionCorrige =
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion;
			this.getInstance(this.identFenetreVisuQCM).setEtatFicheVisu({
				numExecQCM: this.element.getNumero(),
				modeProf: true,
				eleve: null,
				donnees: lElementPourVisuQuestion,
			});
		}
	}
	actualiserListeQuestions() {
		if (this.qcm.listeQuestions.count()) {
			const lNoteRef = this.qcm.listeQuestions.get(0).note;
			this.element.avecQuestionsSoumises =
				this.qcm.listeQuestions
					.getListeElements((aEle) => {
						return aEle.existe() && aEle.note === lNoteRef;
					})
					.count() === this.qcm.listeQuestions.getNbrElementsExistes();
		}
		this.majNbPoint(this.element);
		let lAvecEdition = !this.element.pere && !this.element.estVerrouille;
		if (lAvecEdition && this.options.estModeCollab) {
			lAvecEdition = !this.qcm.avecVerrouCollab;
		}
		this.getInstance(this.idSaisieQCM).setDonnees({
			contenuQCM: this.qcm,
			avecEdition: lAvecEdition,
			nombreQuestionsSoumises: this.element.nombreQuestionsSoumises,
		});
		this.callback.appel({
			genreEvnt:
				InterfaceEditionDetailSelectionQCM.GenreCallback.actualisationQuestions,
		});
	}
	majNbPoint(aElement) {
		const lQCM = this._estUneExecutionQCM(aElement) ? aElement.QCM : aElement;
		if (lQCM.contenuQCM && lQCM.contenuQCM.listeQuestions) {
			if (aElement.nombreQuestionsSoumises) {
				aElement.nombreDePoints =
					aElement.nombreQuestionsSoumises *
					lQCM.contenuQCM.listeQuestions.get(0).note;
			} else {
				let lNbPoint = 0;
				for (
					let i = 0;
					i < lQCM.contenuQCM.listeQuestions.getNbrElementsExistes();
					i++
				) {
					lNbPoint += lQCM.contenuQCM.listeQuestions.get(i).note;
				}
				aElement.nombreDePoints = lNbPoint;
			}
			aElement.nbQuestionsTotal =
				lQCM.contenuQCM.listeQuestions.getNbrElementsExistes();
		}
	}
	calculNbPointAutresQuestions() {
		const lThis = this;
		let lNote = 0;
		this.qcm.listeQuestions.parcourir((D) => {
			if (
				!!D &&
				D.existe() &&
				(!lThis.questionsEnCopies ||
					!lThis.questionsEnCopies.getElementParNumero(D.getNumero()))
			) {
				lNote += D.note;
			}
		});
		return lNote;
	}
	_initialiserFenetreEditionBaremeQCM(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.UpdateBareme",
			),
			largeur: 250,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementFenetreEditionBaremeQCM(aNumeroBouton, aEltBareme) {
		if (aNumeroBouton === 1) {
			const lNbQuestionsEnCopie = this.questionsEnCopies.count();
			const lValeur = aEltBareme.getPosition();
			if (
				lValeur * lNbQuestionsEnCopie + this.calculNbPointAutresQuestions() >
				GParametres.maxNombrePointsQCM
			) {
				if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.BaremeQCMMax",
								[GParametres.maxNombrePointsQCM],
							),
						});
				}
			} else {
				if (
					this.element.nombreQuestionsSoumises &&
					lNbQuestionsEnCopie !==
						this.qcm.listeQuestions.getNbrElementsExistes()
				) {
					let lPremierPasEnCopie = 0;
					const lNbQuestionsExiste =
						this.qcm.listeQuestions.getNbrElementsExistes();
					for (
						lPremierPasEnCopie = 0;
						lPremierPasEnCopie < this.qcm.listeQuestions.count();
						lPremierPasEnCopie++
					) {
						if (lPremierPasEnCopie >= lNbQuestionsExiste) {
							break;
						}
						const lQuestion = this.qcm.listeQuestions.get(lPremierPasEnCopie);
						if (!lQuestion) {
							break;
						} else if (lQuestion.existe()) {
							const lEstPresentDansQuestionEnCopie =
								!!this.questionsEnCopies &&
								!!this.questionsEnCopies.getElementParNumero(
									lQuestion.getNumero(),
								);
							if (!lEstPresentDansQuestionEnCopie) {
								break;
							}
						}
					}
					if (
						lPremierPasEnCopie ===
						this.qcm.listeQuestions.getNbrElementsExistes()
					) {
						return;
					}
					if (
						aEltBareme.getPosition() !==
						this.qcm.listeQuestions.get(lPremierPasEnCopie).note
					) {
						if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"FenetreParamExecutionQCM.msgBareme",
									),
								});
						}
					}
				}
				const lThis = this;
				this.questionsEnCopies.parcourir((aQuestionCopie) => {
					const lEltQuestion = lThis.qcm.listeQuestions.getElementParNumero(
						aQuestionCopie.getNumero(),
					);
					if (!!lEltQuestion) {
						lEltQuestion.note = lValeur;
						if (lEltQuestion.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
							lEltQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lEltQuestion.Etat = Enumere_Etat_1.EGenreEtat.Modification;
							lThis.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				});
				this.actualiserListeQuestions();
				this.validationAuto();
			}
		}
	}
	_surPreResize() {
		let lJqSaisieScroll;
		if ($("#" + this.idContenuModaliteScroll.escapeJQ()).is(":visible")) {
			lJqSaisieScroll = $("#" + this.idContenuModaliteScroll.escapeJQ());
			lJqSaisieScroll.height(1);
		}
	}
	_surFinResize() {
		let lJqSaisieScroll;
		if ($("#" + this.idContenuModaliteScroll.escapeJQ()).is(":visible")) {
			lJqSaisieScroll = $("#" + this.idContenuModaliteScroll.escapeJQ());
			lJqSaisieScroll.height(
				Math.round(
					$("#" + this.idOnglets.escapeJQ()).height() -
						$(
							"#" + this.getInstance(this.identOnglets).getNom().escapeJQ(),
						).height() -
						2,
				),
			);
		}
	}
}
exports.InterfaceEditionDetailSelectionQCM = InterfaceEditionDetailSelectionQCM;
(function (InterfaceEditionDetailSelectionQCM) {
	let GenreCallback;
	(function (GenreCallback) {
		GenreCallback[(GenreCallback["affichageQuestions"] = 1)] =
			"affichageQuestions";
		GenreCallback[(GenreCallback["modificationDetail"] = 2)] =
			"modificationDetail";
		GenreCallback[(GenreCallback["actualisationQuestions"] = 3)] =
			"actualisationQuestions";
		GenreCallback[(GenreCallback["validationAuto"] = 4)] = "validationAuto";
		GenreCallback[(GenreCallback["afficherResultats"] = 5)] =
			"afficherResultats";
	})(
		(GenreCallback =
			InterfaceEditionDetailSelectionQCM.GenreCallback ||
			(InterfaceEditionDetailSelectionQCM.GenreCallback = {})),
	);
})(
	InterfaceEditionDetailSelectionQCM ||
		(exports.InterfaceEditionDetailSelectionQCM =
			InterfaceEditionDetailSelectionQCM =
				{}),
);

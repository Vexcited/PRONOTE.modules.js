exports.InterfaceEditionListeQCM = void 0;
const ObjetRequeteExportQCM_1 = require("ObjetRequeteExportQCM");
const ObjetRequeteSaisieCopieQCM_1 = require("ObjetRequeteSaisieCopieQCM");
const ObjetRequeteSaisieSuppressionQCM_1 = require("ObjetRequeteSaisieSuppressionQCM");
const DonneesListe_QCM_1 = require("DonneesListe_QCM");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetTri_1 = require("ObjetTri");
const ObjetFenetre_Devoir_1 = require("ObjetFenetre_Devoir");
const ObjetFenetre_SelectionQCMQuestion_1 = require("ObjetFenetre_SelectionQCMQuestion");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const TypeNumerotation_1 = require("TypeNumerotation");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const ObjetFenetre_Periode_1 = require("ObjetFenetre_Periode");
const DonneesListe_ResultatsQCM_1 = require("DonneesListe_ResultatsQCM");
const AccessApp_1 = require("AccessApp");
const C_TailleMaxImportXmlQCM = 52428800;
var GenreMenuContextuel;
(function (GenreMenuContextuel) {
	GenreMenuContextuel[(GenreMenuContextuel["gmc_importFichier"] = 1)] =
		"gmc_importFichier";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_importBibliotheque"] = 2)] =
		"gmc_importBibliotheque";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_assocEvaluation"] = 3)] =
		"gmc_assocEvaluation";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_assocDevoir"] = 4)] =
		"gmc_assocDevoir";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_assocCDT"] = 5)] =
		"gmc_assocCDT";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_assocActivite"] = 6)] =
		"gmc_assocActivite";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_assocTAFPrim"] = 7)] =
		"gmc_assocTAFPrim";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_ajoutQuestions"] = 8)] =
		"gmc_ajoutQuestions";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_modifier"] = 9)] =
		"gmc_modifier";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_dupliquer"] = 10)] =
		"gmc_dupliquer";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_supprimer"] = 11)] =
		"gmc_supprimer";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_supprimerCollab"] = 12)] =
		"gmc_supprimerCollab";
	GenreMenuContextuel[(GenreMenuContextuel["gmc_supprimerExec"] = 13)] =
		"gmc_supprimerExec";
})(GenreMenuContextuel || (GenreMenuContextuel = {}));
class InterfaceEditionListeQCM extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.avecValidationAuto = true;
		this.options = {
			avecCategorie: false,
			avecNiveau: false,
			avecCompetences: false,
			avecImportBiblio: true,
			avecCollaboratif: true,
			avecImportFichier: false,
			avecProprietaire: false,
			estProprietaireEditable: true,
			maxSize: C_TailleMaxImportXmlQCM,
			avecAssocDevoirs: true,
			avecAssocEvaluations: false,
			avecAssocTAF: false,
			avecTafToDevoir: false,
			avecVisuEleves: true,
			estModeCollab: false,
			avecContributeurs: false,
			verrouilleEditionMatiereAvecCompetences: false,
			avecBoutonPartageQCM: false,
			avecValidationAuto: true,
			avecMenuContexteListe: true,
			avecSelectionClasseObligatoire: false,
			avecAssocActivite: false,
			avecAssocTAFPrim: false,
			avecThemes: false,
			avecRegrouperPeriodes: false,
			avecCopie: false,
			avecPersonnalisationProjetAccompagnement: false,
		};
	}
	estUneExecutionQCM(aElt) {
		return aElt && aElt.getGenre() === this.genreExecQCM;
	}
	actionSurResultatsQCM(aParam) {
		let lQCM;
		if (this.estUneExecutionQCM(this.element)) {
			lQCM = this.element.QCM;
		} else {
			lQCM = this.element;
		}
		const lEstUneExecution = this.estUneExecutionQCM(this.element);
		if (!!this.qcm) {
			lQCM.contenuQCM = this.qcm;
		}
		this.donneesQCM = aParam.message
			? { message: aParam.message }
			: {
					modeSansNote: this.getModeSansNoteDeSelection(),
					elementRacine: this.element,
					QCM: lQCM,
					estUneExecutionQCM: lEstUneExecution,
					listeEleves: aParam.listeEleves,
					listeQuestions: aParam.listeQuestions,
					moyennes: aParam.moyennes,
					avecAffichage: aParam.avecAffichage,
					valeurs: aParam.valeurs,
				};
		this.getInstance(this.identFenetreResultatsQCM).setDonnees(this.donneesQCM);
	}
	getModeSansNoteDeSelection() {
		const fnLExecutionEstSansNote = function (aExecutionQCM) {
			return !(
				aExecutionQCM.estLieADevoir ||
				(aExecutionQCM.estUnTAF && aExecutionQCM.afficherResultatNote)
			);
		};
		if (this.estUneExecutionQCM(this.element)) {
			return fnLExecutionEstSansNote(this.element);
		}
		for (const lElt of this.listeQCM) {
			if (this.estUneExecutionQCM(lElt)) {
				const lPere = lElt.pere;
				if (lPere && lPere.getNumero() === this.element.getNumero()) {
					return fnLExecutionEstSansNote(lElt);
				}
			}
		}
		return false;
	}
	setInfosCollab(aInfosCollab) {}
	construireInstances() {
		this.identListeQCM = this.add(
			ObjetListe_1.ObjetListe,
			this.evntSurListeQCM,
			this.initListeQCM,
		);
		this.construireInstancesSelectionProprietaires();
		this.construireInstancesSelectionContributeurs();
		this.construireInstancesImportQCM();
		this.construireInstancesAssociationDevoir();
		this.construireInstancesAssociationCdT();
		this.construireInstancesVisuEleves();
		this.construireInstanceObjetFenetreEditionQCM();
		this.construireInstanceFenetreResultatsQCM();
		if (this.options.avecAssocDevoirs) {
			this.idFenetrePeriode = this.addFenetre(
				ObjetFenetre_Periode_1.ObjetFenetre_Periode,
				this.evntSurFenetrePeriode,
				this.initFenetrePeriode,
			);
		}
	}
	construireInstancesSelectionProprietaires() {
		if (this.options.avecProprietaire && this.options.estProprietaireEditable) {
			this.identFenetreSelectionProprietaires = this.addFenetre(
				ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
				this.evntSurSelectionProprio,
				this.initSelectionProprio,
			);
		}
	}
	construireInstancesSelectionContributeurs() {
		if (this.options.avecContributeurs) {
			this.identFenetreSelectionContributeurs = this.addFenetre(
				ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
				this.evntSurSelectionContributeurs,
				this.initSelectionContributeurs,
			);
		}
	}
	construireInstancesImportQCM() {
		if (this.options.avecImportBiblio) {
			this.identFenetreSelectionQCM = this.addFenetre(
				ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
				this.evenementSurSelectionQCM,
				this.initialiserFenetreSelectionQCM,
			);
		}
		this.identFenetreSelectionQCMQuestion = this.addFenetre(
			ObjetFenetre_SelectionQCMQuestion_1.ObjetFenetre_SelectionQCMQuestion,
			this.evntSurSelectionQCMQuestion,
			this.initFenetreSelectionQCMQuestion,
		);
	}
	construireInstancesAssociationCdT() {}
	construireInstancesVisuEleves() {
		if (this.options.avecVisuEleves) {
			this.identFenetreVisuQCM = this.addFenetre(
				ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			);
			this.idBtnVisu = this.Nom + "_btnVisu";
		}
	}
	evntSurResultatsQCM(aParametres) {
		switch (aParametres.action) {
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.consulterCopieVisibleEleve:
				this.ouvrirVisuResultatsQCM(aParametres.eleve, false);
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.consulterCopieCacheeEleve:
				this.ouvrirVisuResultatsQCM(aParametres.eleve, true);
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.supprimerReponse:
				this.callback.appel({
					genreEvnt: InterfaceEditionListeQCM.GenreEvenement.fenetreResultats,
					action: aParametres.action,
					donneesJSON: aParametres.JSON,
				});
				this.lancerRequeteResultatsQCM();
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.recommencerTaf:
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.recommencerDevoir:
				this.callback.appel({
					genreEvnt: InterfaceEditionListeQCM.GenreEvenement.fenetreResultats,
					action: aParametres.action,
					donneesJSON: aParametres.JSON,
				});
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.genererPDF: {
				const lEleve = aParametres.eleves.get(0);
				this.callback.appel({
					genreEvnt: InterfaceEditionListeQCM.GenreEvenement.fenetreResultats,
					action: aParametres.action,
					element: aParametres.element,
					eleve: lEleve,
				});
				break;
			}
		}
	}
	ouvrirVisuResultatsQCM(aEleve, aAfficherCopieCachee) {
		if (this.identFenetreVisuQCM) {
			const lExecutionQCM = aAfficherCopieCachee
				? aEleve.executionCachee
				: aEleve.execution;
			if (!!aEleve && !!lExecutionQCM) {
				if (
					lExecutionQCM.etatCloture !==
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
					lExecutionQCM.etatCloture !== undefined
				) {
					lExecutionQCM.publierCorrige = true;
					this.getInstance(this.identFenetreVisuQCM).setEtatFicheVisu({
						numExecQCM: lExecutionQCM.getNumero(),
						modeProf: true,
						eleve: aEleve,
						donnees: lExecutionQCM,
						afficherCopieCachee: aAfficherCopieCachee,
					});
				} else {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.QCMnonTermine",
							),
						});
				}
			}
		}
	}
	evntSurBtnVisu(aElement) {
		const lElement =
			aElement !== null && aElement !== undefined ? aElement : this.element;
		this.getInstance(this.identFenetreVisuQCM).setEtatFicheVisu({
			numExecQCM: lElement.getNumero(),
			modeProf: true,
			eleve: null,
			donnees: lElement,
		});
	}
	setEtatBtnVisu() {
		this.$refreshSelf();
		if (
			this.element &&
			this.element.nbQuestionsTotal > 0 &&
			this.element.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
		) {
			ObjetHtml_1.GHtml.setTitle(this.idBtnVisu, "");
		} else if (this.getEtatSaisie()) {
			ObjetHtml_1.GHtml.setTitle(
				this.idBtnVisu,
				ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.ValiderPourVisu"),
			);
		}
	}
	evntMenuContextListeQCM(aCommande, aElement, aParam) {
		const lInstanceFenetre = this.getInstance(
			this.identFenetreSelectionQCMQuestion,
		);
		switch (aCommande) {
			case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.VisuEleve: {
				this.evntSurBtnVisu(aElement);
				break;
			}
			case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.ExportQCM: {
				new ObjetRequeteExportQCM_1.ObjetRequeteExportQCM(
					this,
					this.actionExportQCM,
				).lancerRequete(aElement);
				break;
			}
			case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
				.AjoutQuestionsPerso: {
				lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
					this.contructeurRequeteListeQCMCumuls,
				);
				lInstanceFenetre.setDonnees({
					typeBibilioQCM:
						ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM.Personnel,
				});
				break;
			}
			case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
				.AjoutQuestionsCollab: {
				lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
					this.contructeurRequeteListeQCMCumuls,
				);
				lInstanceFenetre.setDonnees({
					typeBibilioQCM:
						ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM
							.Collaboratif,
				});
				break;
			}
			case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
				.AjoutQuestionsEtab: {
				lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
					this.contructeurRequeteListeQCMCumuls,
				);
				lInstanceFenetre.setDonnees({
					typeBibilioQCM:
						ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM
							.Etablissement,
				});
				break;
			}
			default: {
				const lDonneesRetourNav = {
					instance: this.identListeQCM,
					action: aCommande,
					element: null,
					donnees: null,
				};
				switch (aCommande) {
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CopierQCM: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.CopierQCMVers: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.ImportQCMBiblio: {
						lDonneesRetourNav.donnees = { qcmEtab: true };
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.ImportQCMFichier: {
						lDonneesRetourNav.donnees = { qcmFichier: true, file: aParam };
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerDevoir: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.CreerEvaluation: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.AjouterExerciceCDT: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.CreerActivite: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerTAF: {
						lDonneesRetourNav.element = aElement;
						break;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
						.SuppressionServeur: {
						lDonneesRetourNav.element = aElement;
						lDonneesRetourNav.element.estUneExecution =
							aElement.QCM !== undefined;
						if (
							!!aElement &&
							aElement.estSupprimable === false &&
							!!aElement.msgSuppression
						) {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									message: aElement.msgSuppression,
								});
						} else {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: lDonneesRetourNav.element.estUneExecution
										? ObjetTraduction_1.GTraductions.getValeur(
												"SaisieQCM.ConfirmDeleteExeQCM",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"SaisieQCM.ConfirmDeleteQCM",
											),
									callback: this.suppressionExecutionQCM.bind(
										this,
										lDonneesRetourNav,
									),
								});
						}
						return;
					}
					case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.TafToDevoir: {
						lDonneesRetourNav.element = aElement;
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.ConfirmTafToDevoir",
								),
								callback: this.convertirExecQCMTafToDevoir.bind(
									this,
									lDonneesRetourNav,
								),
							});
						return;
					}
				}
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
					this._retourSurNavigation(lDonneesRetourNav);
				});
			}
		}
	}
	suppressionExecutionQCM(aDonneesRetourNav, aBouton) {
		if (aBouton === 0) {
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				this.element = null;
				this._retourSurNavigation(aDonneesRetourNav);
			});
		}
	}
	convertirExecQCMTafToDevoir(aDonneesRetourNav, aBouton) {
		if (aBouton === 0) {
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				this._retourSurNavigation(aDonneesRetourNav);
			});
		}
	}
	_reponseSaisieSuppressionQCM(aJSON) {
		this.callback.appel({
			genreEvnt: InterfaceEditionListeQCM.GenreEvenement.suppressionServeur,
			donneesJSON: aJSON,
		});
	}
	actionExportQCM(aParam) {
		window.open(aParam.url);
	}
	executeCommandeCopierVers(aElementQCM) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.addElement(aElementQCM);
		new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
			this,
			this.actionCopieQCM,
		).lancerRequete({
			QCM: lListe,
			estPourCollab: !this.options.estModeCollab,
		});
	}
	creerActivite(aQCM, aRessource) {}
	creerTAF(aQCM, aRessource) {}
	afficherExerciceCDT(aElt) {}
	associerDevoir(aElt) {
		this.getInstance(this.idFenetreDevoir).setOptionsFenetre({
			listeBoutons: [
				"",
				"",
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				"",
				ObjetTraduction_1.GTraductions.getValeur("liste.creer"),
			],
		});
		this.ouvrirFenetreDevoir(aElt);
	}
	associerNouvelleEvaluation(aQcmSelectionne) {}
	actionSurImport(aJSONRapport) {
		if ((0, AccessApp_1.getApp)().getDemo()) {
			alert(ObjetTraduction_1.GTraductions.getValeur("Demo.Message"));
		} else {
			let lMsg;
			const lNbAjoute = aJSONRapport.nbImportes;
			if (!lNbAjoute) {
				lMsg = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.copieqcm.ko",
				);
			} else {
				lMsg = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.copieqcm.ok",
				);
			}
			const lThis = this;
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lMsg,
					callback: function () {
						lThis.callback.appel({
							genreEvnt: InterfaceEditionListeQCM.GenreEvenement.copieQCM,
						});
					},
				});
		}
	}
	actionCopieQCM() {
		if ((0, AccessApp_1.getApp)().getDemo()) {
			alert(ObjetTraduction_1.GTraductions.getValeur("Demo.Message"));
		} else {
			const lThis = this;
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.copieqcm.ok",
					),
					callback: function () {
						lThis.callback.appel({
							genreEvnt: InterfaceEditionListeQCM.GenreEvenement.copieQCM,
						});
					},
				});
		}
	}
	actionSurListeQCMCumuls(aListeQCM, aMessage) {
		this.getInstance(this.identFenetreSelectionQCM).setDonnees(
			aListeQCM,
			aMessage,
			{ multiSelection: true, avecNiveaux: this.options.avecNiveau },
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnVisu: {
				event: function () {
					aInstance.evntSurBtnVisu();
				},
				getDisabled: function () {
					return (
						!(
							aInstance.element &&
							aInstance.element.nbQuestionsTotal > 0 &&
							aInstance.element.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
						) ||
						(aInstance.element && aInstance.element.enEtatActualisation)
					);
				},
			},
			btnResultats: {
				event: function () {
					aInstance.lancerRequeteResultatsQCM();
				},
				getDisabled: function () {
					if (!aInstance.element) {
						return true;
					} else if (aInstance.element.getGenre() === aInstance.genreQCM) {
						let lAUneExec = false;
						aInstance.listeQCM.parcourir((aElement) => {
							if (
								aInstance.estUneExecutionQCM(aElement) &&
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
			btnCopierQCMVers: {
				event: function () {
					aInstance.executeCommandeCopierVers(aInstance.element);
				},
				getDisabled: function () {
					return (
						!aInstance.element ||
						aInstance.element.getGenre() !== aInstance.genreQCM
					);
				},
			},
			btnPartageQCM: {
				event: function () {
					aInstance.evntSurBtnPartageQCM();
				},
			},
			btnUploadQCM: {
				event: function () {
					new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
						aInstance,
						aInstance.actionCopieQCM,
					).lancerRequete({ uploadCloud: true });
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.uploadCloudArrierePlan",
							),
						});
				},
			},
			btnNouveau: {
				event: function () {
					aInstance.element = aInstance.creationNouveauQCM();
					aInstance.ouvrirFenetreEditionQCM(true);
				},
				getDisabled: function () {
					return (
						aInstance.options.avecSelectionClasseObligatoire &&
						!aInstance.classePrimSelectionne
					);
				},
			},
			btnImport: {
				event: function () {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						initCommandes: function (aInstanceMenu) {
							if (aInstance.options.avecImportFichier) {
								aInstance._addCommandeMenuContextuel(
									aInstanceMenu,
									GenreMenuContextuel.gmc_importFichier,
								);
							}
							if (aInstance.options.avecImportBiblio) {
								aInstance._addCommandeMenuContextuel(
									aInstanceMenu,
									GenreMenuContextuel.gmc_importBibliotheque,
								);
							}
						},
					});
				},
				getDisabled: function () {
					return (
						(aInstance.options.avecSelectionClasseObligatoire &&
							!aInstance.classePrimSelectionne) ||
						!(
							aInstance.options.avecImportFichier ||
							aInstance.options.avecImportBiblio
						)
					);
				},
			},
			btnImportFile: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.options.maxSize,
						avecTransformationFlux: false,
					};
				},
				addFiles: function (aParametresInput) {
					(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(function () {
						const lDonneesRetourNav = {
							instance: aInstance.identListeQCM,
							action:
								DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
									.ImportQCMFichier,
							donnees: { qcmFichier: true, file: aParametresInput },
						};
						aInstance._retourSurNavigation(lDonneesRetourNav);
					});
				},
			},
			btnExport: {
				event: function () {
					new ObjetRequeteExportQCM_1.ObjetRequeteExportQCM(
						aInstance,
						aInstance.actionExportQCM,
					).lancerRequete(aInstance.element);
				},
				getDisabled: function () {
					return !(
						aInstance.element &&
						aInstance.element.getGenre() === aInstance.genreQCM &&
						aInstance.element.nbQuestionsTotal > 0 &&
						aInstance.element.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
					);
				},
			},
			btnAssocier: {
				event: function () {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						initCommandes: function (aInstanceMenu) {
							if (aInstance.element) {
								if (aInstance.options.avecAssocDevoirs) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_assocDevoir,
									);
								}
								if (
									aInstance.options.avecAssocEvaluations &&
									aInstance.element.nbCompetencesTotal > 0
								) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_assocEvaluation,
									);
								}
								if (aInstance.options.avecAssocTAF) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_assocCDT,
									);
								}
								if (aInstance.options.avecAssocActivite) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_assocActivite,
									);
								}
								if (aInstance.options.avecAssocTAFPrim) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_assocTAFPrim,
									);
								}
							}
						},
					});
				},
				getDisabled: function () {
					return !(
						aInstance.element &&
						aInstance.element.getGenre() === aInstance.genreQCM &&
						aInstance.element.nbQuestionsTotal > 0 &&
						aInstance.element.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
					);
				},
			},
			btnAutres: {
				event: function () {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						initCommandes: function (aInstanceMenu) {
							aInstance._addCommandeMenuContextuel(
								aInstanceMenu,
								GenreMenuContextuel.gmc_ajoutQuestions,
							);
							aInstance._addCommandeMenuContextuel(
								aInstanceMenu,
								GenreMenuContextuel.gmc_modifier,
							);
							aInstance._addCommandeMenuContextuel(
								aInstanceMenu,
								GenreMenuContextuel.gmc_dupliquer,
							);
							if (aInstance.options.estModeCollab) {
								aInstance._addCommandeMenuContextuel(
									aInstanceMenu,
									GenreMenuContextuel.gmc_supprimerCollab,
								);
							} else {
								if (
									aInstance.element &&
									aInstance.element.getGenre() === aInstance.genreQCM &&
									!aInstance.element.estVerrouille
								) {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_supprimer,
									);
								} else {
									aInstance._addCommandeMenuContextuel(
										aInstanceMenu,
										GenreMenuContextuel.gmc_supprimerExec,
									);
								}
							}
						},
					});
				},
				getDisabled: function () {
					return !aInstance.element;
				},
			},
		});
	}
	estCloudIndexActif() {
		return false;
	}
	avecCloudIndex() {
		return false;
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push('<div class="interface_affV">');
		T.push(this.construireBoutons());
		T.push(
			'<div id="',
			this.getInstance(this.identListeQCM).getNom(),
			'" class="interface_affV_client"></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	construireBoutons() {
		const lFnCreerSeparateurVertical = function () {
			return '<div class="MargeDroit" style="height:67px; width: 1px; background-color: #C5C5C5;"></div>';
		};
		const T = [];
		T.push('<div class="flex-contain m-bottom">');
		T.push(
			this._createIEBoutonImage({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.Bouton.Nouveau",
				),
				ieModel: "btnNouveau",
				ieIcon: "icon_nouveau_qcm",
				haspopup: "dialog",
			}),
		);
		if (!this.options.estModeCollab) {
			T.push(
				this._createIEBoutonImage({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Bouton.Importer",
					),
					ieModel: this.options.avecImportBiblio
						? "btnImport"
						: "btnImportFile",
					ieIcon: "icon_download_alt",
					ieSelecFile: !this.options.avecImportBiblio,
					haspopup: "menu",
				}),
			);
		}
		if (!this.options.estModeCollab) {
			T.push(
				this._createIEBoutonImage({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Bouton.Associer",
					),
					ieModel: "btnAssocier",
					ieIcon: "icon_qcm_associer",
					haspopup: "menu",
				}),
			);
		}
		if (this.options.avecVisuEleves) {
			T.push(
				this._createIEBoutonImage({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.VisuEleve",
					),
					ieModel: "btnVisu",
					ieIcon: "icon_eye_open",
					haspopup: "dialog",
				}),
			);
		}
		if (this.options.avecCollaboratif) {
			const lStrCopierVers = this.options.estModeCollab
				? ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.CopierQCM")
				: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.CopierDansQCMCollab",
					);
			T.push(
				this._createIEBoutonImage({
					libelle: lStrCopierVers,
					ieModel: "btnCopierQCMVers",
					ieIcon: "icon_copier_liste",
				}),
			);
		}
		T.push(
			this._createIEBoutonImage({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.Bouton.AutresActions",
				),
				ieModel: "btnAutres",
				ieIcon: "icon_ellipsis_horizontal",
				haspopup: "menu",
			}),
		);
		if (this.options.avecVisuEleves && this.options.avecBoutonPartageQCM) {
			T.push(lFnCreerSeparateurVertical());
			T.push(
				this._createIEBoutonImage({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Commande.PartageQCM",
					),
					ieModel: "btnPartageQCM",
					ieIcon: "icon_fiche_cours_partage",
					haspopup: "dialog",
				}),
			);
		}
		if (this.estCloudIndexActif() && this.avecCloudIndex()) {
			T.push(lFnCreerSeparateurVertical());
			T.push(
				this._createIEBoutonImage({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.uploadCloud",
					),
					ieModel: "btnUploadQCM",
					ieIcon: "icon_cloud",
					haspopup: "dialog",
				}),
			);
		}
		T.push(
			this._createIEBoutonImage({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.SaisieResultats",
				),
				ieModel: "btnResultats",
				ieIcon: "icon_notes_etoile",
				haspopup: "dialog",
			}),
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aParam) {
		this.listeQCM = aParam.listeQCM;
		this.listeServices = aParam.listeServices;
		this.avecServicesEvaluation = !!aParam.avecServicesEvaluation;
		this.listeClasses = aParam.listeClasses;
		this.listeMatieres = aParam.listeMatieres;
		this.listeMatieresPrim =
			aParam.listeMatieresPrim || new ObjetListeElements_1.ObjetListeElements();
		this.classePrimSelectionne = aParam.classePrimSelectionne || null;
		this.niveau = aParam.niveau || null;
		this.listeProfs = aParam.listeProfs;
		this.genreProprios = aParam.genreProprios;
		this.estGenreRessourceDUtilisateurConnecte =
			aParam.estGenreRessourceDUtilisateurConnecte;
		this.listeCategoriesQCM = aParam.listeCategoriesQCM;
		this.genreContributeurs = aParam.genreContributeurs;
		this.element = aParam.selection;
		this.genreQCM = aParam.genreQCM;
		this.genreExecQCM = aParam.genreExecQCM;
		const lParam = {
			donnees: this.listeQCM,
			evenement: this.evntMenuContextListeQCM.bind(this),
			avecServices: this.listeServices.count() > 0,
			avecServicesEvaluation: this.avecServicesEvaluation,
			genreQCM: aParam.genreQCM,
			genreExecQCM: aParam.genreExecQCM,
		};
		const lDroits = {
			avecSaisieCahierDeTexte: aParam.avecSaisieCahierDeTexte,
			avecSaisieDevoirs: aParam.avecSaisieDevoirs,
			avecSaisieEvaluations: aParam.avecSaisieEvaluations,
			avecGestionNotation:
				aParam.avecGestionNotation !== undefined
					? aParam.avecGestionNotation
					: true,
		};
		this.droits = lDroits;
		this.getInstance(this.identListeQCM).setDonnees(
			new DonneesListe_QCM_1.DonneesListe_QCM(lParam, this.options, lDroits),
		);
		if (this.element && this.element.existeNumero()) {
			const lElementASelectionner = this.listeQCM.getElementParNumero(
				this.element.getNumero(),
			);
			if (!!lElementASelectionner) {
				this.getInstance(this.identListeQCM).setListeElementsSelection(
					new ObjetListeElements_1.ObjetListeElements().addElement(
						lElementASelectionner,
					),
					{ avecEvenement: true, avecScroll: true },
				);
			}
		}
		if (this.options.avecVisuEleves) {
			this.setEtatBtnVisu();
		}
	}
	creationNouveauQCM() {
		const lElement = new ObjetElement_1.ObjetElement("", null, this.genreQCM);
		lElement.Editable = true;
		lElement.Supprimable = true;
		lElement.matiere = new ObjetElement_1.ObjetElement("", 0);
		lElement.niveau = this.niveau
			? this.niveau
			: new ObjetElement_1.ObjetElement("", 0);
		lElement.proprietaire = GEtatUtilisateur.getUtilisateur();
		lElement.nbQuestionsTotal = 0;
		lElement.nombreDePoints = 0;
		lElement.statutPrive = true;
		lElement.estUnDeploiement = true;
		lElement.estDeploye = true;
		lElement.pere = null;
		if (this.options.avecThemes) {
			lElement.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
				"Theme.libelleCB.qcm",
			);
		}
		lElement.listeProprietaires = new ObjetListeElements_1.ObjetListeElements();
		lElement.listeProprietaires.addElement(GEtatUtilisateur.getUtilisateur());
		lElement.listeContributeurs = new ObjetListeElements_1.ObjetListeElements();
		lElement.autoriserLaNavigation = false;
		lElement.modeDiffusionCorrige =
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin;
		lElement.nombreQuestionsSoumises = 0;
		lElement.homogeneiserNbQuestParNiveau = false;
		lElement.jeuQuestionFixe = false;
		lElement.melangerLesQuestionsGlobalement = false;
		lElement.melangerLesQuestionsParNiveau = false;
		lElement.melangerLesReponses = false;
		lElement.dureeMaxQCM = 0;
		lElement.nbMaxTentative = 0;
		lElement.ressentiRepondant = false;
		lElement.tolererFausses = false;
		lElement.acceptIncomplet = false;
		lElement.contenuQCM = new ObjetElement_1.ObjetElement();
		lElement.contenuQCM.listeQuestions =
			new ObjetListeElements_1.ObjetListeElements();
		lElement.contenuQCM.typeNumerotation =
			TypeNumerotation_1.TypeNumerotation.n123;
		return lElement;
	}
	initListeQCM(aInstance) {
		const lColonnes = [];
		if (!!this.options.avecCategorie) {
			lColonnes.push({
				id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.categorie,
				taille: 80,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.Categorie",
					),
					avecFusionColonne: true,
				},
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.HintCategorie",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.QCM,
			taille: ObjetListe_1.ObjetListe.initColonne(100, 150),
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Libelle"),
				avecFusionColonne: true,
			},
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintLibelle"),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.matiere,
			taille: this.options.avecNiveau ? 150 : 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintMatiere"),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.themes,
			taille: 80,
			titre: this.getTitreTheme(),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.niveau,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Niveau"),
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintNiveau"),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.nbElementsCompetences,
			taille: 24,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.NbCompetencesCourt",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintNbCompetences",
			),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.proprietaire,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Proprios"),
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Proprios"),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.contributeurs,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.Contributeurs",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Contributeurs"),
		});
		lColonnes.push({
			id: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.statutPrive,
			taille: 20,
			titre: {
				libelleHtml: IE.jsx.str("i", {
					class: "icon_sondage_bibliotheque",
					role: "presentation",
					style: "font-size:1.4rem;",
				}),
			},
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintBibliotheque",
			),
		});
		const lColonnesCachees = [];
		if (!this.options.avecNiveau) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.niveau,
			);
		}
		if (!this.options.avecCompetences) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.nbElementsCompetences,
			);
		}
		if (!this.options.avecProprietaire) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.proprietaire,
			);
		}
		if (!this.options.avecContributeurs) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.contributeurs,
			);
		}
		if (!this.options.avecImportBiblio) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.statutPrive,
			);
		}
		if (!this.options.avecThemes) {
			lColonnesCachees.push(
				DonneesListe_QCM_1.DonneesListe_QCM.colonnes.themes,
			);
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: lColonnesCachees,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: DonneesListe_QCM_1.DonneesListe_QCM.colonnes.QCM,
		});
	}
	ouvrirFenetreEditionQCM(aPourCreationQCM = false) {
		let lTitreFenetre = "";
		if (aPourCreationQCM) {
			lTitreFenetre = !!this.options.estModeCollab
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.LigneNouveauQCMCollab",
					)
				: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.LigneNouveauQCM");
		} else {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.ModifierQCM",
			);
		}
		const lFenetreSaisieQCM = this.getInstance(this.identFenetreEditionQCM);
		lFenetreSaisieQCM.setOptionsFenetre({ titre: lTitreFenetre });
		lFenetreSaisieQCM.setContexteAffichage(!!this.options.estModeCollab);
		const lMatieres =
			!!this.listeMatieresPrim && this.listeMatieresPrim.count() > 0
				? this.listeMatieresPrim
				: this.listeMatieres;
		const lQCM = this.element;
		lFenetreSaisieQCM.setDonnees(lQCM, lMatieres, this.listeCategoriesQCM);
	}
	evenementFenetreEditionQCM(aNumeroBouton, aParams) {
		if (aNumeroBouton === 1) {
			if (this.element) {
				if (!this.element.existeNumero()) {
					this.listeQCM.addElement(this.element);
				}
				if (!!aParams && !!aParams.QCM) {
					this.element.setLibelle(aParams.QCM.getLibelle());
					this.element.matiere = aParams.QCM.matiere;
					this.element.niveau = aParams.QCM.niveau;
					this.element.categories = aParams.QCM.categories;
					this.element.statutPrive = aParams.QCM.statutPrive;
					this.element.ListeThemes = aParams.QCM.ListeThemes;
					this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
					this.callback.appel({
						genreEvnt: InterfaceEditionListeQCM.GenreEvenement.creationAutoQCM,
						selection: this.element,
					});
				}
			}
		} else if (aParams.avecModificationEtiquettes) {
			this.callback.appel({
				genreEvnt: InterfaceEditionListeQCM.GenreEvenement.recupererDonnees,
			});
		} else {
			if (this.element && !this.element.existeNumero()) {
				this.element = null;
			}
		}
	}
	evntSurListeQCM(aParametres) {
		let lChangementDeQCM = true;
		const lElementSelectionne = aParametres.article;
		lChangementDeQCM =
			!lElementSelectionne ||
			this.element === null ||
			this.element.getNumero() !== lElementSelectionne.getNumero();
		this.element = lElementSelectionne || null;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				if (
					this.getInstance(this.identListeQCM)
						.getListeElementsSelection()
						.count() === 0
				) {
					this.callback.appel({
						genreEvnt: InterfaceEditionListeQCM.GenreEvenement.deselectionQCM,
					});
				} else {
					this.callback.appel({
						validationAutoSurSelection: this.avecValidationAuto,
						genreEvnt: InterfaceEditionListeQCM.GenreEvenement.selectionQCM,
						selection: this.element,
						chgmtQcm: lChangementDeQCM,
					});
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.element = this.creationNouveauQCM();
				this.ouvrirFenetreEditionQCM(true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.validationAuto();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.categorie:
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.QCM:
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.matiere:
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.themes:
						this.ouvrirFenetreEditionQCM();
						break;
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.niveau:
						if (this.options.avecNiveau) {
							this.ouvrirFenetreEditionQCM();
						}
						break;
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.statutPrive:
						if (this.options.avecImportBiblio) {
							this.element.statutPrive = !this.element.statutPrive;
							this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							this.setEtatSaisie(true);
							this.getInstance(this.identListeQCM).actualiser(true);
							this.validationAuto();
						}
						break;
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.proprietaire:
						if (
							this.options.avecProprietaire &&
							this.options.estProprietaireEditable
						) {
							this.getInstance(
								this.identFenetreSelectionProprietaires,
							).setDonnees({
								listeRessources: this.listeProfs,
								listeRessourcesSelectionnees: this.element.listeProprietaires,
								genreRessource: this.genreProprios,
								titre: "",
								estGenreRessourceDUtilisateurConnecte:
									this.estGenreRessourceDUtilisateurConnecte,
							});
						}
						break;
					case DonneesListe_QCM_1.DonneesListe_QCM.colonnes.contributeurs:
						if (this.options.avecContributeurs) {
							const lListeProfs = this.listeProfs.getListeElements(
								(aElement) => {
									const lIndex =
										this.element.listeProprietaires.getIndiceElementParFiltre(
											(D) => {
												return D.getNumero() === aElement.getNumero();
											},
										);
									return lIndex === -1;
								},
							);
							this.getInstance(
								this.identFenetreSelectionContributeurs,
							).setDonnees({
								listeRessources: lListeProfs,
								listeRessourcesSelectionnees: this.element.listeContributeurs,
								genreRessource: this.genreContributeurs,
								titre: "",
								estGenreRessourceDUtilisateurConnecte: true,
							});
						}
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.callback.appel({
					genreEvnt: InterfaceEditionListeQCM.GenreEvenement.suppressionQCM,
					selection: this.element,
				});
				this.element = null;
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.callback.appel({
					genreEvnt:
						InterfaceEditionListeQCM.GenreEvenement.eventApresSuppressionQCM,
				});
				this.element = null;
				break;
		}
	}
	validationAuto() {
		if (this.avecValidationAuto) {
			this.callback.appel({
				genreEvnt: InterfaceEditionListeQCM.GenreEvenement.actualiserQCM,
				selection: this.element,
			});
		}
	}
	actualiserListe() {
		this.getInstance(this.identListeQCM).actualiser(true);
	}
	initSelectionProprio(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Proprios"),
			largeur: 300,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	initSelectionContributeurs(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.Contributeurs",
			),
			largeur: 300,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evntSurSelectionProprio(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.element.listeProprietaires = aListeRessourcesSelectionnees;
			this.setEtatSaisie(true);
			this.getInstance(this.identListeQCM).actualiser(true);
			this.validationAuto();
		}
	}
	evntSurSelectionContributeurs(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.element.listeContributeurs = aListeRessourcesSelectionnees;
			this.setEtatSaisie(true);
			this.getInstance(this.identListeQCM).actualiser(true);
		}
	}
	initFenetreDevoir(aInstance) {
		aInstance.avecSelectionService = true;
		aInstance.avecModifQCM = false;
		aInstance.regrouperPeriodes = this.options.avecRegrouperPeriodes;
	}
	evntSurFenetreDevoirGetClassePourSelectPeriode(aParam) {
		return aParam && aParam.devoir && aParam.devoir.service
			? aParam.devoir.service.classe &&
				aParam.devoir.service.classe.existeNumero() &&
				aParam.devoir.service.classe.getNumero() === aParam.classe.getNumero()
				? aParam.devoir.service.classe
				: aParam.devoir.service.groupe &&
						aParam.devoir.service.groupe.existeNumero() &&
						aParam.devoir.service.groupe.listeClasses
					? aParam.devoir.service.groupe.listeClasses.getElementParNumero(
							aParam.classe.getNumero(),
						)
					: null
			: null;
	}
	evntSurFenetreDevoir(aGenreEvenement, aParam) {
		switch (aGenreEvenement) {
			case ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.periode: {
				this.selection_ClasseDevoir = aParam.classe;
				this.selection_PeriodeDevoir = aParam.periode;
				const lClasse =
					this.evntSurFenetreDevoirGetClassePourSelectPeriode(aParam);
				if (lClasse) {
					if (this.options.avecRegrouperPeriodes) {
						let lPeriode;
						for (
							let i = 0, lNbr = lClasse.listePeriodes.count();
							i < lNbr;
							i++
						) {
							lPeriode = lClasse.listePeriodes.get(i);
							if (
								this.selection_PeriodeDevoir.getElementParNumero(
									lPeriode.getNumero(),
								)
							) {
								lPeriode.enSelection = true;
							} else {
								lPeriode.enSelection = false;
							}
						}
						this.getInstance(this.idFenetrePeriode).setDonnees(
							lClasse.listePeriodes,
							aParam.avecSansPeriode,
							true,
							true,
						);
					} else {
						this.getInstance(this.idFenetrePeriode).setDonnees(
							lClasse.listePeriodes,
							aParam.avecSansPeriode,
						);
					}
				}
				break;
			}
			case ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.validation:
				switch (aParam.bouton) {
					case this.getInstance(this.idFenetreDevoir).genreBouton.annuler: {
						return;
					}
					case this.getInstance(this.idFenetreDevoir).genreBouton.creer: {
						aParam.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						break;
					}
				}
				if (aParam.bouton && aParam.bouton > 0) {
					const lExecQCM = aParam.devoir.executionQCM;
					const lCtxDepuisExecTAF =
						lExecQCM !== null &&
						lExecQCM !== undefined &&
						lExecQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Modification &&
						lExecQCM.estUnTAF === true;
					const lAvecQuestionAffecterNotes =
						lCtxDepuisExecTAF === true && lExecQCM.nbRepondu > 0;
					if (lAvecQuestionAffecterNotes === false) {
						this.envoyerRequeteSaisieQCMDevoir(aParam);
					} else {
						const lThis = this;
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.msgQuestionAttribuerNotes",
								),
								callback: function (aAccepte) {
									lThis.evntApresConfirmAttribuerNotes(aParam, aAccepte);
								},
							});
					}
				}
				break;
			case ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.service: {
				const lExecutionQCMOuQCM =
					aParam.execQCM !== null &&
					aParam.execQCM !== undefined &&
					aParam.execQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
						? aParam.execQCM
						: aParam.qcm;
				this.ouvrirFenetreDevoir(lExecutionQCMOuQCM, aParam.service);
				break;
			}
			default:
				break;
		}
	}
	envoyerRequeteSaisieQCMDevoir(aParams) {
		this.setEtatSaisie(true);
		this.lancerRequeteSaisieQCMDevoir(aParams, this._reponseSaisieQCMDevoir);
	}
	_reponseSaisieQCMDevoir() {
		this.callback.appel({
			genreEvnt: InterfaceEditionListeQCM.GenreEvenement.associeDevoir,
		});
	}
	creerDevoirParDefautListeEleves() {
		return new ObjetListeElements_1.ObjetListeElements();
	}
	initFenetrePeriode(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Notes.SelectionnerPeriode",
			),
		});
	}
	evntSurFenetrePeriode(aNumeroBouton, aPeriodeDevoir) {
		let lPeriode;
		switch (aNumeroBouton) {
			case 0: {
				break;
			}
			case 1: {
				if (
					this.options.avecRegrouperPeriodes &&
					aPeriodeDevoir instanceof ObjetListeElements_1.ObjetListeElements
				) {
					const lListePeriodesDejaActive = [];
					for (let i = 0; i < this.selection_PeriodeDevoir.count(); i++) {
						lPeriode = this.selection_PeriodeDevoir.get(i);
						if (!aPeriodeDevoir.getElementParNumero(lPeriode.getNumero())) {
							lPeriode.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						} else {
							if (!lPeriode.existe()) {
								lPeriode.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							} else {
								lListePeriodesDejaActive.push(lPeriode.getNumero());
							}
						}
					}
					for (let i = 0; i < aPeriodeDevoir.count(); i++) {
						lPeriode = aPeriodeDevoir.get(i);
						if (
							!lListePeriodesDejaActive.includes(lPeriode.getNumero()) &&
							!this.selection_PeriodeDevoir.getElementParNumero(
								lPeriode.getNumero(),
							)
						) {
							const lElementPeriode = new ObjetElement_1.ObjetElement(
								lPeriode.existeNumero() ? lPeriode.getLibelle() : "",
								lPeriode.getNumero(),
								null,
								null,
								true,
							);
							lElementPeriode.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							this.selection_PeriodeDevoir.addElement(lElementPeriode);
						}
					}
				} else if (aPeriodeDevoir instanceof ObjetElement_1.ObjetElement) {
					if (
						this.selection_PeriodeDevoir.getNumero() !==
						aPeriodeDevoir.getNumero()
					) {
						if (
							!this.selection_ClasseDevoir.listePeriodes.getElementParNumero(
								aPeriodeDevoir.getNumero(),
							)
						) {
							this.selection_PeriodeDevoir.setNumero(
								aPeriodeDevoir.getNumero(),
							);
							this.selection_PeriodeDevoir.setLibelle(
								aPeriodeDevoir.existeNumero()
									? aPeriodeDevoir.getLibelle()
									: "",
							);
							this.selection_PeriodeDevoir.setActif(true);
							this.selection_PeriodeDevoir.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						} else {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"Notes.PeriodeDejaAffectee",
									),
								});
						}
					}
				}
				this.getInstance(this.idFenetreDevoir).actualiser();
				break;
			}
		}
	}
	setSelectionListe(aListeSelection) {}
	getTitreTheme() {
		return "";
	}
	_retourSurNavigation(aParam) {
		let lListe;
		if (aParam.instance === this.identListeQCM) {
			switch (aParam.action) {
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CopierQCM: {
					lListe = new ObjetListeElements_1.ObjetListeElements();
					lListe.addElement(aParam.element);
					new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
						this,
						this.actionCopieQCM,
					).lancerRequete({
						QCM: lListe,
						estPourCollab: this.options.estModeCollab,
						avecParametresExecution: !this.options.estModeCollab,
					});
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CopierQCMVers:
					this.executeCommandeCopierVers(aParam.element);
					break;
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.AjoutQuestionsPerso:
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.AjoutQuestionsCollab:
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.AjoutQuestionsEtab: {
					const lInstanceFenetre = this.getInstance(
						this.identFenetreSelectionQCMQuestion,
					);
					lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
						this.contructeurRequeteListeQCMCumuls,
					);
					lInstanceFenetre.setDonnees(aParam.donnees);
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.ImportQCMBiblio: {
					new this.contructeurRequeteListeQCMCumuls(
						this,
						this.actionSurListeQCMCumuls,
					).lancerRequete(aParam.donnees);
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.ImportQCMFichier: {
					const lParam = { importXml: true, classe: null };
					if (this.classePrimSelectionne) {
						lParam.classe = this.classePrimSelectionne;
					}
					new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
						this,
						this.actionSurImport,
					)
						.addUpload({
							listeFichiers: aParam.donnees.file.listeFichiers,
							annulerSurErreurUpload: true,
						})
						.lancerRequete(lParam);
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerDevoir: {
					this.associerDevoir(aParam.element);
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerEvaluation:
					this.associerNouvelleEvaluation(aParam.element);
					break;
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerActivite:
					this.creerActivite(aParam.element, this.classePrimSelectionne);
					break;
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerTAF:
					this.creerTAF(aParam.element, this.classePrimSelectionne);
					break;
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.AjouterExerciceCDT: {
					this.afficherExerciceCDT(aParam.element);
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
					.SuppressionServeur: {
					new ObjetRequeteSaisieSuppressionQCM_1.ObjetRequeteSaisieSuppressionQCM(
						this,
						this._reponseSaisieSuppressionQCM,
					).lancerRequete({ qcm: aParam.element });
					break;
				}
				case DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.TafToDevoir: {
					const lExecQCM = aParam.element;
					if (lExecQCM.dateFinPublication >= new Date()) {
						const lMsg = ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.TafNonCloture",
						);
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: lMsg,
							});
					} else {
						this.associerDevoir(lExecQCM);
					}
					break;
				}
			}
		}
	}
	_addCommandeMenuContextuel(aMenu, aGenre) {
		switch (aGenre) {
			case GenreMenuContextuel.gmc_importFichier:
				aMenu.addSelecFile(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.MnuImportQCMFichier",
					),
					{
						getOptionsSelecFile: () => {
							return {
								maxSize: this.options.maxSize,
								avecTransformationFlux: false,
							};
						},
						addFiles: (aParametresInput) => {
							(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
								const lDonneesRetourNav = {
									instance: this.identListeQCM,
									action:
										DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
											.ImportQCMFichier,
									donnees: { qcmFichier: true, file: aParametresInput },
								};
								this._retourSurNavigation(lDonneesRetourNav);
							});
						},
					},
				);
				break;
			case GenreMenuContextuel.gmc_importBibliotheque:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.MnuImportQCMBiblioEtablissement",
					),
					this.options.avecImportBiblio,
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
										.ImportQCMBiblio,
								donnees: { qcmEtab: true },
							};
							this._retourSurNavigation(lDonneesRetourNav);
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_assocDevoir:
				if (this.droits.avecGestionNotation) {
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.CreerDevoir"),
						!(0, AccessApp_1.getApp)().getModeExclusif() &&
							this.listeServices.count() > 0 &&
							this.droits.avecSaisieDevoirs,
						function () {
							(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
								const lDonneesRetourNav = {
									instance: this.identListeQCM,
									action:
										DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
											.CreerDevoir,
									element: this.element,
								};
								this._retourSurNavigation(lDonneesRetourNav);
							});
						},
					);
				}
				break;
			case GenreMenuContextuel.gmc_assocEvaluation:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.CreerEvaluation"),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.avecServicesEvaluation &&
						this.droits.avecSaisieEvaluations,
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
										.CreerEvaluation,
								element: this.element,
							};
							this._retourSurNavigation(lDonneesRetourNav);
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_assocCDT:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.CDTPourLeQCM"),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.droits.avecSaisieCahierDeTexte,
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
										.AjouterExerciceCDT,
								element: this.element,
							};
							this._retourSurNavigation(lDonneesRetourNav);
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_assocActivite:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Menu.AssocierActivite",
					),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.droits.avecSaisieCahierDeTexte,
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
										.CreerActivite,
								element: this.element,
							};
							this._retourSurNavigation(lDonneesRetourNav);
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_assocTAFPrim:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Menu.AssocierTAF",
					),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.droits.avecSaisieCahierDeTexte,
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande.CreerTAF,
								element: this.element,
							};
							this._retourSurNavigation(lDonneesRetourNav);
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_ajoutQuestions:
				aMenu.addSousMenu(
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.AjouterDesQuestions",
					),
					(aInstanceItemMenu) => {
						let lLibelleCommande = "";
						lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.MnuAjoutQuestionsPerso",
						);
						aInstanceItemMenu.add(
							lLibelleCommande,
							!(0, AccessApp_1.getApp)().getModeExclusif() &&
								!this.element.estVerrouille,
							() => {
								const lInstanceFenetre = this.getInstance(
									this.identFenetreSelectionQCMQuestion,
								);
								lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
									this.contructeurRequeteListeQCMCumuls,
								);
								lInstanceFenetre.setDonnees({
									typeBibilioQCM:
										ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM
											.Personnel,
								});
							},
						);
						if (this.options.avecCollaboratif) {
							lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.MnuAjoutQuestionsCollab",
							);
							aInstanceItemMenu.add(
								lLibelleCommande,
								!(0, AccessApp_1.getApp)().getModeExclusif() &&
									!this.element.estVerrouille,
								() => {
									const lInstanceFenetre = this.getInstance(
										this.identFenetreSelectionQCMQuestion,
									);
									lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
										this.contructeurRequeteListeQCMCumuls,
									);
									lInstanceFenetre.setDonnees({
										typeBibilioQCM:
											ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM
												.Collaboratif,
									});
								},
							);
						}
						if (this.options.avecImportBiblio) {
							lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.MnuImportQCMBiblioEtablissement",
							);
							aInstanceItemMenu.add(
								lLibelleCommande,
								!(0, AccessApp_1.getApp)().getModeExclusif() &&
									!this.element.estVerrouille,
								() => {
									const lInstanceFenetre = this.getInstance(
										this.identFenetreSelectionQCMQuestion,
									);
									lInstanceFenetre.setConstructeurRequeteListeQCMCumuls(
										this.contructeurRequeteListeQCMCumuls,
									);
									lInstanceFenetre.setDonnees({
										typeBibilioQCM:
											ObjetFenetre_SelectionQCMQuestion_1.TypeBibliothequeQCM
												.Etablissement,
									});
								},
							);
						}
					},
				);
				break;
			case GenreMenuContextuel.gmc_modifier:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.element.getGenre() === this.genreQCM,
					function () {
						this.ouvrirFenetreEditionQCM();
					},
				);
				break;
			case GenreMenuContextuel.gmc_dupliquer:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.DupliquerQCM"),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						this.element.getGenre() === this.genreQCM,
					function () {
						const lListe = new ObjetListeElements_1.ObjetListeElements();
						lListe.addElement(this.element);
						new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
							this,
							this.actionCopieQCM,
						).lancerRequete({
							QCM: lListe,
							estPourCollab: this.options.estModeCollab,
							avecParametresExecution: !this.options.estModeCollab,
						});
					},
				);
				break;
			case GenreMenuContextuel.gmc_supprimerCollab:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					!(0, AccessApp_1.getApp)().getModeExclusif() &&
						!this.element.avecVerrouCollab,
					() => {
						this.getInstance(this.identListeQCM).surSuppression();
					},
				);
				break;
			case GenreMenuContextuel.gmc_supprimer:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					!(0, AccessApp_1.getApp)().getModeExclusif(),
					() => {
						this.getInstance(this.identListeQCM).surSuppression();
					},
				);
				break;
			case GenreMenuContextuel.gmc_supprimerExec:
				aMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					!(0, AccessApp_1.getApp)().getModeExclusif(),
					function () {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lDonneesRetourNav = {
								instance: this.identListeQCM,
								action:
									DonneesListe_QCM_1.DonneesListe_QCM.GenreCommande
										.SuppressionServeur,
								element: this.element,
							};
							lDonneesRetourNav.element.estUneExecution =
								this.element !== undefined;
							if (
								!!this.element &&
								this.element.estSupprimable === false &&
								!!this.element.msgSuppression
							) {
								(0, AccessApp_1.getApp)()
									.getMessage()
									.afficher({
										type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
										message: this.element.msgSuppression,
									});
							} else {
								(0, AccessApp_1.getApp)()
									.getMessage()
									.afficher({
										type: Enumere_BoiteMessage_1.EGenreBoiteMessage
											.Confirmation,
										message: lDonneesRetourNav.element.estUneExecution
											? ObjetTraduction_1.GTraductions.getValeur(
													"SaisieQCM.ConfirmDeleteExeQCM",
												)
											: ObjetTraduction_1.GTraductions.getValeur(
													"SaisieQCM.ConfirmDeleteQCM",
												),
										callback: this.suppressionExecutionQCM.bind(
											this,
											lDonneesRetourNav,
										),
									});
							}
						});
					},
				);
				break;
			default:
				break;
		}
	}
	_createIEBoutonImage(aParam) {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-bouton",
					{
						class: "MargeDroit AlignementMilieuVertical bouton-carre",
						"ie-model": aParam.ieModel,
						"ie-icon": aParam.ieIcon,
						"ie-iconsize": "2.4rem",
						"ie-selecfile": !!aParam.ieSelecFile,
						"aria-haspopup": aParam.haspopup,
					},
					aParam.libelle,
				),
			),
		);
		return H.join("");
	}
	ouvrirFenetreDevoir(aEltQcm, aEltServiceDefaut) {
		let lListeServices;
		const lEstCtxExecQCMTAF =
			this.estUneExecutionQCM(aEltQcm) && aEltQcm.estUnTAF === true;
		if (lEstCtxExecQCMTAF) {
			lListeServices = this.listeServices.getListeElements((aElement) => {
				const lElt = aEltQcm.listeServices.getElementParNumero(
					aElement.getNumero(),
				);
				return !!lElt;
			});
		} else {
			lListeServices = this.listeServices;
		}
		if (!!lListeServices && lListeServices.count() > 0) {
			lListeServices.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.classe && D.classe.existeNumero()
						? D.classe.getLibelle()
						: D.groupe && D.groupe.existeNumero()
							? D.groupe.getLibelle()
							: "";
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeServices.trier();
			const lService = !!aEltServiceDefaut
				? lListeServices.getElementParNumeroEtGenre(
						aEltServiceDefaut.getNumero(),
					)
				: lListeServices.get(0);
			const lBaremeParDefautNotation =
				!!lService && !!lService.baremeParDefautService
					? lService.baremeParDefautService
					: GParametres.baremeNotation;
			this.getInstance(this.idFenetreDevoir).setDonnees(
				this.creerDevoirParDefaut(lService),
				true,
				lListeServices,
				lBaremeParDefautNotation,
				!lEstCtxExecQCMTAF,
			);
			const lElementExecOuQCM = this.element;
			this.getInstance(this.idFenetreDevoir).evntSurSelectionQCM(
				1,
				lElementExecOuQCM,
			);
		} else {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.msgAucunServicePourDevoir",
					),
				});
		}
	}
	evntApresConfirmAttribuerNotes(aParam, aGenreAction) {
		const lParam = aParam;
		if (
			lParam.devoir.executionQCM !== null &&
			lParam.devoir.executionQCM !== undefined
		) {
			lParam.devoir.executionQCM.attribuerNotes =
				aGenreAction === Enumere_Action_1.EGenreAction.Valider;
		}
		this.envoyerRequeteSaisieQCMDevoir(lParam);
	}
}
exports.InterfaceEditionListeQCM = InterfaceEditionListeQCM;
(function (InterfaceEditionListeQCM) {
	let GenreEvenement;
	(function (GenreEvenement) {
		GenreEvenement[(GenreEvenement["selectionQCM"] = 1)] = "selectionQCM";
		GenreEvenement[(GenreEvenement["suppressionQCM"] = 2)] = "suppressionQCM";
		GenreEvenement[(GenreEvenement["copieQCM"] = 3)] = "copieQCM";
		GenreEvenement[(GenreEvenement["associeCdT"] = 4)] = "associeCdT";
		GenreEvenement[(GenreEvenement["associeDevoir"] = 5)] = "associeDevoir";
		GenreEvenement[(GenreEvenement["associeEvaluation"] = 6)] =
			"associeEvaluation";
		GenreEvenement[(GenreEvenement["deselectionQCM"] = 7)] = "deselectionQCM";
		GenreEvenement[(GenreEvenement["AjoutQuestions"] = 8)] = "AjoutQuestions";
		GenreEvenement[(GenreEvenement["suppressionServeur"] = 9)] =
			"suppressionServeur";
		GenreEvenement[(GenreEvenement["eventApresSuppressionQCM"] = 10)] =
			"eventApresSuppressionQCM";
		GenreEvenement[(GenreEvenement["creationAutoQCM"] = 11)] =
			"creationAutoQCM";
		GenreEvenement[(GenreEvenement["associeActivitePrim"] = 12)] =
			"associeActivitePrim";
		GenreEvenement[(GenreEvenement["associeTAFPrim"] = 13)] = "associeTAFPrim";
		GenreEvenement[(GenreEvenement["actualiserQCM"] = 14)] = "actualiserQCM";
		GenreEvenement[(GenreEvenement["recupererDonnees"] = 15)] =
			"recupererDonnees";
		GenreEvenement[(GenreEvenement["fenetreResultats"] = 16)] =
			"fenetreResultats";
	})(
		(GenreEvenement =
			InterfaceEditionListeQCM.GenreEvenement ||
			(InterfaceEditionListeQCM.GenreEvenement = {})),
	);
})(
	InterfaceEditionListeQCM ||
		(exports.InterfaceEditionListeQCM = InterfaceEditionListeQCM = {}),
);

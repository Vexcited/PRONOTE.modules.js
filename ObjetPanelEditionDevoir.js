exports.ObjetPanelEditionDevoir = exports.CommandePanelEditionDevoir = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const GUID_1 = require("GUID");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetHtml_1 = require("ObjetHtml");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTri_1 = require("ObjetTri");
const IEHtml = require("IEHtml");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetMoteurFormSaisieMobile_1 = require("ObjetMoteurFormSaisieMobile");
require("IEHtml.InputNote_Mobile.js");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetRequeteCategorieEvaluation_1 = require("ObjetRequeteCategorieEvaluation");
const ObjetFenetre_CategorieEvaluation_1 = require("ObjetFenetre_CategorieEvaluation");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const AccessApp_1 = require("AccessApp");
var TypeDevoirFacultatif;
(function (TypeDevoirFacultatif) {
	TypeDevoirFacultatif[(TypeDevoirFacultatif["Aucun"] = 0)] = "Aucun";
	TypeDevoirFacultatif[(TypeDevoirFacultatif["CommeUnBonus"] = 1)] =
		"CommeUnBonus";
	TypeDevoirFacultatif[(TypeDevoirFacultatif["CommeUneNote"] = 2)] =
		"CommeUneNote";
})(TypeDevoirFacultatif || (TypeDevoirFacultatif = {}));
var CommandePanelEditionDevoir;
(function (CommandePanelEditionDevoir) {
	CommandePanelEditionDevoir[(CommandePanelEditionDevoir["Annuler"] = 0)] =
		"Annuler";
	CommandePanelEditionDevoir[(CommandePanelEditionDevoir["Valider"] = 1)] =
		"Valider";
	CommandePanelEditionDevoir[(CommandePanelEditionDevoir["Supprimer"] = 2)] =
		"Supprimer";
})(
	CommandePanelEditionDevoir ||
		(exports.CommandePanelEditionDevoir = CommandePanelEditionDevoir = {}),
);
class ObjetPanelEditionDevoir extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
		this.moteurFormSaisie =
			new ObjetMoteurFormSaisieMobile_1.ObjetMoteurFormSaisieMobile();
		this.ids = {
			panel: "PanelEditionDevoir",
			commentaire: GUID_1.GUID.getId(),
			bareme: GUID_1.GUID.getId(),
			coefficient: GUID_1.GUID.getId(),
			ramenerSur20: GUID_1.GUID.getId(),
			verrouille: GUID_1.GUID.getId(),
			titreFacultatif: GUID_1.GUID.getId(),
			zoneFacultatif: GUID_1.GUID.getId(),
			cbfacultatif: GUID_1.GUID.getId(),
			selectSujet: GUID_1.GUID.getId(),
			selectCorrige: GUID_1.GUID.getId(),
			fileSujet: GUID_1.GUID.getId(),
			fileCorrige: GUID_1.GUID.getId(),
			periode: GUID_1.GUID.getId(),
		};
		this.dimensions = {
			largeurSelecFile: 80,
			largeurMaxUrlSelecFile: 200,
			largeurPeriodes: 100,
			carreDevoirFac: 15,
			hauteurCB: 50,
			hauteurPied: 50,
			hauteurSelectFile: 50,
			hauteurRameneSur20: 60,
		};
		this.maxCommentaire = this.moteurNotes.getTailleMaxCommentaire();
		this.paramCalendrier = {
			avecBoutonsPrecedentSuivant: false,
			avecSelectionJoursNonOuvres: true,
			avecSelectionJoursFeries: true,
		};
		this.instanceSelectDateDevoir = this._instancierCalendrier(
			this._evntSelectDateDevoir.bind(this),
		);
		this.instanceSelectDatePublication = this._instancierCalendrier(
			this._evntSelectDatePublication.bind(this),
		);
		this.instanceSelecteurCategorie =
			this.moteurFormSaisie.instancierSelecteurCategorie(
				this,
				this._evntCategorie.bind(this),
			);
		this._instancierMultiSelectTheme();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAnnuler: {
				event: function () {
					aInstance._annulerEditionDevoir();
				},
				getDisabled: function () {
					return false;
				},
			},
			btnValider: {
				event: function () {
					aInstance.callback.appel(CommandePanelEditionDevoir.Valider, {
						devoir: aInstance.devoir,
						estCreation: aInstance.donnees.estCreation,
					});
				},
				getDisabled: function () {
					return false;
				},
			},
			nodePoubelle: {
				event: function () {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.ConfirmerSuppression",
						),
						callback: function (aGenreBouton) {
							if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
								const lDevoir = aInstance.devoir;
								lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								aInstance.callback.appel(CommandePanelEditionDevoir.Supprimer, {
									devoir: lDevoir,
								});
							}
						},
					});
				},
				getDisabled: function () {
					return (
						aInstance.donnees.estCreation ||
						aInstance.devoir.verrouille ||
						aInstance.donnees.clotureGlobal
					);
				},
			},
			getStyleLabel: function () {
				return { color: GCouleur.themeNeutre.foncee };
			},
			getStyle: function () {
				return {
					"font-weight": 400,
					"font-size": 14,
					"margin-top": 20,
					"margin-bottom": 20,
				};
			},
			commentaire: {
				getValue: function () {
					return aInstance.devoir.commentaire;
				},
				setValue: function (aValue) {
					if (aValue.length <= aInstance.maxCommentaire) {
						aInstance.devoir.commentaire = aValue;
						aInstance.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getClasseLabel: function () {
					const lDevoir = aInstance.devoir;
					return !!lDevoir &&
						!!lDevoir.commentaire &&
						lDevoir.commentaire.length > 0
						? "active"
						: "";
				},
				node: function () {
					$(this.node).on("focus", function () {
						$(this).select();
						return false;
					});
				},
				getDisabled: function () {
					return (
						aInstance._estChampInactif() ||
						aInstance.devoir.commentaireVerrouille
					);
				},
				getStyleValeur: function () {
					return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
				},
			},
			bareme: {
				getNote: function () {
					return aInstance.devoir.bareme;
				},
				setNote: function (aNote) {
					if (aNote === null) {
						return;
					}
					aInstance.moteurNotesCP.surEditionBareme(
						aNote.getChaine(),
						aInstance.devoir,
						aInstance.donnees.estCreation,
						(aNote) => {
							aInstance.devoir.bareme = aNote;
							aInstance.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						},
					);
				},
				getOptionsNote: function () {
					return {
						avecVirgule: true,
						sansNotePossible: false,
						avecAnnotation: false,
						min: 1.0,
						max: aInstance.moteurNotesCP.getBaremeDevoirMaximal(),
						avecSigneMoins: false,
						hintSurErreur: false,
						htmlContexte:
							'<div class="Gras">' +
							ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Bareme") +
							"</div>",
					};
				},
				getDisabled: function () {
					if (
						aInstance.donnees.avecQCM &&
						aInstance.devoir.executionQCM &&
						aInstance.devoir.executionQCM.existeNumero()
					) {
						return true;
					} else {
						return (
							aInstance._estChampInactif() || aInstance.devoir.baremeVerrouille
						);
					}
				},
			},
			coeff: {
				getNote: function () {
					return aInstance.devoir.coefficient;
				},
				setNote: function (aNote) {
					if (aNote === null) {
						return;
					}
					const lNote = aInstance.moteurNotesCP.controlerNote(
						aNote.getChaine(),
						0.0,
						99.0,
					);
					if (!lNote.estValide) {
						GApplication.getMessage().afficher({
							message: lNote.msgInfoNoteInvalide,
						});
					} else {
						aInstance.devoir.coefficient = lNote.note;
						aInstance.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getOptionsNote: function () {
					return {
						avecVirgule: true,
						sansNotePossible: false,
						avecAnnotation: false,
						min: 0.0,
						max: 99.0,
						avecSigneMoins: false,
						hintSurErreur: false,
						htmlContexte:
							'<div class="Gras">' +
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.Coefficient",
							) +
							"</div>",
					};
				},
				getDisabled: function () {
					return (
						aInstance._estChampInactif() || !!aInstance.devoir.coeffVerrouille
					);
				},
			},
			date: {
				getClasseLabel: function () {
					return "active";
				},
			},
			checkSur20: {
				getValue: function () {
					return aInstance.devoir.ramenerSur20;
				},
				setValue: function (aValue) {
					aInstance.devoir.ramenerSur20 = aValue;
					aInstance.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
				getDisabled: function () {
					const lDevoir = aInstance.devoir;
					return (
						aInstance._estChampInactif() ||
						!lDevoir ||
						aInstance._getBaremeParDefaut() === lDevoir.bareme.getValeur()
					);
				},
			},
			verrouille: {
				getValue: function () {
					return aInstance.devoir.verrouille;
				},
				setValue: function (aValue) {
					aInstance.devoir.verrouille = aValue;
					aInstance.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.actualiserFichierSujet(aInstance.devoir);
					aInstance.actualiserFichierCorrige(aInstance.devoir);
					aInstance.updateDates();
				},
				getDisabled: function () {
					return aInstance.donnees.cloture || !aInstance.donnees.actif;
				},
			},
			facultatif: {
				getValue: function () {
					return (
						aInstance.devoir.commeUnBonus === true ||
						aInstance.devoir.commeUneNote === true
					);
				},
				setValue: function () {
					aInstance.afficherModaleDevoirFac();
				},
				getDisabled: function () {
					return aInstance._estChampInactif();
				},
				getStyleValeur: function () {
					return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
				},
				getStyleLabel: function () {
					return { fontWeight: 400, color: GCouleur.themeNeutre.foncee };
				},
			},
			gestionDocument: {
				getDisabled: function (aGenre) {
					const lAvecFile =
						aGenre ===
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
							? aInstance.moteurNotesCP._avecSujetDevoir({
									devoir: aInstance.devoir,
								})
							: aInstance.moteurNotesCP._avecCorrigeDevoir({
									devoir: aInstance.devoir,
								});
					return aInstance._estDocumentNonEditable() || lAvecFile;
				},
				getIcone() {
					return "icon_piece_jointe";
				},
			},
			selecFile: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.moteurNotes.getTailleMaxPieceJointe(),
						interrompreClick: true,
					};
				},
				addFiles: function (aGenre, aParams) {
					const lPJ = aInstance._getPJ({
						devoir: aInstance.devoir,
						typeFichierExterne: aGenre,
					});
					if (lPJ) {
						const lLibelleFile = lPJ.getLibelle();
						const lMsg =
							aGenre ===
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
								? ObjetChaine_1.GChaine.format(
										ObjetTraduction_1.GTraductions.getValeur(
											"FenetreDevoir.MsgConfirmModifSujet",
										),
										[lLibelleFile],
									)
								: ObjetChaine_1.GChaine.format(
										ObjetTraduction_1.GTraductions.getValeur(
											"FenetreDevoir.MsgConfirmModifCorrige",
										),
										[lLibelleFile],
									);
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: lMsg,
							callback: function (aGenreBouton) {
								if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
									aInstance._surModifFile({
										typeFichierExterne: aGenre,
										devoir: aInstance.devoir,
										eltFichier: aParams.eltFichier,
									});
								}
							},
						});
					} else {
						aInstance._surModifFile({
							typeFichierExterne: aGenre,
							devoir: aInstance.devoir,
							eltFichier: aParams.eltFichier,
						});
					}
				},
				getDisabled: function (aGenre) {
					const lAvecFile =
						aGenre ===
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
							? aInstance.moteurNotesCP._avecSujetDevoir({
									devoir: aInstance.devoir,
								})
							: aInstance.moteurNotesCP._avecCorrigeDevoir({
									devoir: aInstance.devoir,
								});
					return aInstance._estDocumentNonEditable() || lAvecFile;
				},
				getStyleLabel: function () {
					return {
						fontWeight: 400,
						color: GCouleur.themeNeutre.foncee,
						fontSize: 14,
					};
				},
				getIcone() {
					return "icon_piece_jointe";
				},
			},
			chipsSujetCorrige: {
				eventBtn: function (aIndice, aGenre) {
					const lMsg =
						aGenre ===
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
							? ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.MsgConfirmSupprSujet",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.MsgConfirmSupprCorrige",
								);
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMsg,
						callback: function (aGenreBouton) {
							if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
								aInstance._surSuppressionFile({
									typeFichierExterne: aGenre,
									devoir: aInstance.devoir,
								});
							}
						},
					});
				},
			},
			getHtmlInfoPublicationDecaleeParents() {
				let lMessageDateDecaleeAuxParents = "";
				if (
					aInstance.devoir &&
					aInstance.parametresSco
						.avecAffichageDecalagePublicationNotesAuxParents &&
					!!aInstance.parametresSco.nbJDecalagePublicationAuxParents
				) {
					let lDatePublicationDecalee = ObjetDate_1.GDate.formatDate(
						ObjetDate_1.GDate.getJourSuivant(
							aInstance.devoir.datePublication,
							aInstance.parametresSco.nbJDecalagePublicationAuxParents,
						),
						" %JJ/%MM",
					);
					if (aInstance.parametresSco.nbJDecalagePublicationAuxParents === 1) {
						lMessageDateDecaleeAuxParents =
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.DecalageUnJourPublicationParentsSoitLe",
								[lDatePublicationDecalee],
							);
					} else {
						lMessageDateDecaleeAuxParents =
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.DecalageXJoursPublicationParentsSoitLe",
								[
									aInstance.parametresSco.nbJDecalagePublicationAuxParents,
									lDatePublicationDecalee,
								],
							);
					}
				}
				return lMessageDateDecaleeAuxParents;
			},
			avecInfoPublicationDecaleeParents() {
				return (
					aInstance.devoir &&
					aInstance.parametresSco
						.avecAffichageDecalagePublicationNotesAuxParents &&
					!!aInstance.parametresSco.nbJDecalagePublicationAuxParents
				);
			},
			CBRemarque: {
				getValue() {
					return (
						aInstance.devoir && aInstance.devoir.avecCommentaireSurNoteEleve
					);
				},
				async setValue(aValue) {
					if (aInstance.devoir) {
						if (
							!aValue &&
							aInstance._avecUnCommentaireSurNote(aInstance.devoir)
						) {
							const lRes = await GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Notes.confirmationSupressionCommentaireSurNote",
								),
							});
							if (lRes === Enumere_Action_1.EGenreAction.Valider) {
								aInstance.devoir.avecCommentaireSurNoteEleve =
									!aInstance.devoir.avecCommentaireSurNoteEleve;
							}
							return;
						}
						aInstance.devoir.avecCommentaireSurNoteEleve =
							!aInstance.devoir.avecCommentaireSurNoteEleve;
					}
				},
			},
		});
	}
	avecDepotCloud() {
		return GEtatUtilisateur.listeCloud.count() > 0;
	}
	ouvrirPJCloud(aParams) {
		const lParamsDonnees = Object.assign(
			{
				instance: this,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
			},
			aParams,
		);
		let lParams = {
			callbaskEvenement: (aLigne) => {
				if (aLigne >= 0) {
					lParamsDonnees.service = GEtatUtilisateur.listeCloud.get(aLigne);
					this.choisirFichierCloud(lParamsDonnees);
				}
			},
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.Cloud,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	ouvrirPJCloudENEJ(aParams) {
		const lParamsDonnees = Object.assign(
			{
				instance: this,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
				service: GEtatUtilisateur.getCloudENEJ(),
			},
			aParams,
		);
		this.choisirFichierCloud(lParamsDonnees);
	}
	surModifCloud(aParam) {
		this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		switch (aParam.genre) {
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet:
				this.actualiserFichierSujet(this.devoir);
				break;
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige:
				this.actualiserFichierCorrige(this.devoir);
				break;
		}
	}
	choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			const lFenetreFichierCloud =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
					{
						pere: lParams.instance,
						evenement: function (aParam) {
							if (
								aParam.listeNouveauxDocs &&
								aParam.listeNouveauxDocs.count() === 1
							) {
								const lElement = aParam.listeNouveauxDocs.get(0);
								lParams.listeElements.addElement(lElement, 0);
								if (lParams.callback) {
									lParams.callback.call(lParams.instance, lParams);
								}
								aResolve(true);
							}
						},
						initialiser(aFenetre) {
							aFenetre.setOptionsFenetre({
								callbackApresFermer() {
									aResolve();
								},
							});
						},
					},
				);
			lFenetreFichierCloud.setDonnees({ service: lParams.service.Genre });
		});
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.devoirOriginel = this.donnees.devoir;
		this.devoir = MethodesObjet_1.MethodesObjet.dupliquer(this.donnees.devoir);
		if (this._avecSelectionService()) {
			this.instanceSelecteurService = ObjetIdentite_1.Identite.creerInstance(
				ObjetSelection_1.ObjetSelection,
				{
					pere: this,
					evenement: (aParam) => {
						this._surSelectionService({
							devoir: this.devoir,
							selection: aParam,
						});
					},
				},
			);
			this._initSelecteurService(this.instanceSelecteurService);
		}
	}
	getHtmlPanel() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "FormSaisie ofm-design", id: this.ids.panel },
				this._composePanelEditionDevoir(),
			),
		);
		return H.join("");
	}
	getTitrePanel() {
		return this.donnees.estCreation
			? ObjetTraduction_1.GTraductions.getValeur("Notes.CreerDevoir")
			: ObjetTraduction_1.GTraductions.getValeur("Notes.ModifierDevoir");
	}
	updateDates() {
		const leDevoirAUneEvaluationAvecPeriodeCloturee =
			this.moteurNotes.leDevoirAUneEvaluationAvecPeriodeCloturee(this.devoir);
		const lDateDevoirActive = !(
			this._estChampInactif() || leDevoirAUneEvaluationAvecPeriodeCloturee
		);
		this._updateDate(
			this.instanceSelectDateDevoir,
			this.devoir.date,
			lDateDevoirActive,
		);
		const lDatePublicationActive =
			this.donnees.actif &&
			!this.devoir.verrouille &&
			!leDevoirAUneEvaluationAvecPeriodeCloturee;
		this.instanceSelectDatePublication.setOptionsObjetCelluleDate({
			premiereDate: this.devoir.date,
		});
		this._updateDate(
			this.instanceSelectDatePublication,
			this.devoir.datePublication,
			lDatePublicationActive,
		);
	}
	updateContent() {
		this.updateDates();
		this._updateMultiSelectTheme();
		this._actualiserCategorieEvaluation();
		if (this._avecSelectionService()) {
			if (
				this.donnees.infosServices &&
				this.donnees.infosServices.listeService
			) {
				const lIndiceParDefaut =
					this.donnees.infosServices.listeService.getIndiceElementParFiltre(
						(aElt) => {
							return (
								aElt.getNumero() ===
								this.donnees.infosServices.serviceDefaut.getNumero()
							);
						},
					);
				this.instanceSelecteurService.setDonnees(
					this.donnees.infosServices.listeService,
					lIndiceParDefaut,
					false,
				);
			}
		}
	}
	afficherModaleDevoirFac() {
		const lFenetreModaleDevoirFacultatif =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_1.ObjetFenetre,
				{ pere: this },
				{
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					fermerFenetreSurClicHorsFenetre: true,
					avecCroixFermeture: false,
				},
			);
		lFenetreModaleDevoirFacultatif.afficher(
			this._composeContenuModaleChoixFacultatif(lFenetreModaleDevoirFacultatif),
		);
	}
	_estDocumentNonEditable() {
		return !this.donnees.actif || !this.devoir || this.devoir.verrouille;
	}
	_getPJ(aParam) {
		let lPJ;
		const lDevoir = aParam.devoir;
		switch (aParam.typeFichierExterne) {
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet:
				if (this.moteurNotesCP._avecSujetDevoir({ devoir: lDevoir })) {
					lPJ = lDevoir.listeSujets.get(0);
				}
				break;
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige:
				if (this.moteurNotesCP._avecCorrigeDevoir({ devoir: lDevoir })) {
					lPJ = lDevoir.listeCorriges.get(0);
				}
		}
		return lPJ;
	}
	_surModifFile(aParam) {
		aParam.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		switch (aParam.typeFichierExterne) {
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet:
				aParam.devoir.listeSujets.addElement(aParam.eltFichier, 0);
				this.actualiserFichierSujet(aParam.devoir);
				break;
			case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige:
				aParam.devoir.listeCorriges.addElement(aParam.eltFichier, 0);
				this.actualiserFichierCorrige(aParam.devoir);
				break;
		}
	}
	_surSuppressionFile(aParam) {
		const lGenreFichier = aParam.typeFichierExterne;
		const lDevoir = aParam.devoir;
		const lPJ = this._getPJ(aParam);
		if (lPJ) {
			lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			switch (lGenreFichier) {
				case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet:
					this.actualiserFichierSujet(lDevoir);
					break;
				case TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
					.DevoirCorrige:
					this.actualiserFichierCorrige(lDevoir);
					break;
			}
			IEHtml.refresh(true);
		}
	}
	_estChampInactif() {
		return (
			this.donnees.cloture || !this.donnees.actif || this.devoir.verrouille
		);
	}
	_annulerEditionDevoir() {
		this.callback.appel(CommandePanelEditionDevoir.Annuler, {
			devoir: this.devoirOriginel,
		});
	}
	_composeDate(aInstanceSelectDate, aTitre) {
		return this.moteurFormSaisie.composeDate({
			id: aInstanceSelectDate.getNom(),
			label: aTitre,
			classLabel: "date.getClasseLabel",
		});
	}
	_composeDateDevoir() {
		return this._composeDate(
			this.instanceSelectDateDevoir,
			ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.DateDevoir"),
		);
	}
	_composeDatePublication() {
		const H = [];
		H.push(
			this._composeDate(
				this.instanceSelectDatePublication,
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.DateDePublication",
				),
			),
		);
		H.push(
			'<div class="field-contain" ie-html="getHtmlInfoPublicationDecaleeParents" ie-if="avecInfoPublicationDecaleeParents"></div>',
		);
		return H.join("");
	}
	_composeCommentaire() {
		return this.moteurFormSaisie.composeFormTextArea({
			id: this.ids.commentaire,
			model: "commentaire",
			label: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.Commentaire",
			),
			maxLength: this.maxCommentaire,
			classLabel: "commentaire.getClasseLabel",
			placeholder: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.RedigezVotreCommentaire",
			),
		});
	}
	_composeInputNote(aParam) {
		return this.moteurFormSaisie.composeFormInputNote({
			id: aParam.id,
			model: aParam.model,
			label: aParam.label,
			maxLength: aParam.maxLength,
		});
	}
	_composeBareme() {
		const H = [];
		H.push(
			this._composeInputNote({
				model: "bareme",
				id: this.ids.bareme,
				label: ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Bareme"),
				maxLength: this.moteurNotesCP.getMaxLengthBareme(true),
			}),
		);
		return H.join("");
	}
	_composeCoefficient() {
		const H = [];
		H.push(
			this._composeInputNote({
				model: "coeff",
				id: this.ids.coefficient,
				label: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.Coefficient",
				),
				maxLength: 7,
			}),
		);
		return H.join("");
	}
	_composeOptionRamenerSur20() {
		const H = [];
		const lIdCBSur20 = this.ids.ramenerSur20;
		H.push(
			'<div class="field-contain devoirs-contain tightened">',
			'<ie-checkbox id="',
			lIdCBSur20,
			'" ie-model="checkSur20">',
			ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Ramenersur20"),
				[this._getBaremeParDefaut()],
			),
			"</ie-checkbox>",
			"</div>",
		);
		return H.join("");
	}
	_getBaremeParDefaut() {
		return this.donnees.baremeParDefaut !== null &&
			this.donnees.baremeParDefaut !== undefined
			? this.donnees.baremeParDefaut.getValeur()
			: 20;
	}
	_composeDevoirVerrouille(aEstCtxEdition) {
		const H = [];
		if (aEstCtxEdition) {
			const lIdVerrouille = this.ids.verrouille;
			H.push(
				'<div class="field-contain lock-contain">',
				'<i class="icon_lock i-as-deco" role="presentation"></i>',
				'<ie-checkbox id="',
				lIdVerrouille,
				'" ie-model="verrouille">',
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Verrouille"),
				"</ie-checkbox>",
				"</div>",
			);
		}
		return H.join("");
	}
	_avecSelectionService() {
		return (
			this.donnees.estCreation &&
			this.donnees.infosServices !== null &&
			this.donnees.infosServices !== undefined &&
			this.donnees.infosServices.avecSelectionService === true
		);
	}
	_composeSelectionService() {
		const H = [];
		if (this._avecSelectionService()) {
			H.push('<div class="field-contain">');
			H.push(
				'<label for="',
				this.instanceSelecteurService.getNom(),
				'" class="active" ie-style="getStyleLabel">',
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Service"),
				"</label>",
			);
			H.push('<div id="', this.instanceSelecteurService.getNom(), '"></div>');
			H.push("</div>");
		}
		return H.join("");
	}
	_surSelectionService(aParam) {
		const lDevoir = aParam.devoir;
		lDevoir.service = aParam.selection.element;
		lDevoir.estDevoirEditable = lDevoir.service.getActif();
	}
	_initSelecteurService(aInstance) {
		aInstance.setParametres({
			avecBoutonsPrecedentSuivant: false,
			icone: null,
		});
	}
	_avecUnCommentaireSurNote(aDevoir) {
		let lResult = false;
		if (!aDevoir || !aDevoir.listeEleves) {
			return lResult;
		}
		aDevoir.listeEleves.parcourir((aEleve) => {
			if (aEleve.commentaire && aEleve.commentaire.length > 0) {
				lResult = true;
				return false;
			}
		});
		return lResult;
	}
	_composeDevoir(aParam) {
		const lEstContexteEdition = aParam.modeCreation === false;
		const H = [];
		if (aParam.devoir) {
			H.push(`<div class="Fenetre_Contenu">`);
			H.push(this._composeSelectionService());
			H.push(this._composeDateDevoir());
			H.push(this._composeDatePublication());
			H.push('<div class="pj-global-conteneur tightened">');
			H.push(this._composeSujet(aParam.devoir));
			H.push("</div>");
			H.push('<div class="pj-global-conteneur tightened">');
			H.push(this._composeCorrige(aParam.devoir));
			H.push("</div>");
			H.push(this._composeRemarque());
			H.push(this._composePeriode(aParam.devoir));
			H.push(this._composeBareme());
			H.push(this._composeCoefficient());
			H.push(this._composeOptionRamenerSur20());
			H.push(this._composeDevoirFacultatif(aParam.devoir));
			H.push(this._composeCategorie());
			H.push(this._composeCommentaire());
			if (
				this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")
			) {
				H.push(this._composeTheme());
			}
			H.push(this._composeDevoirVerrouille(lEstContexteEdition));
			H.push(`</div>`);
		}
		return H.join("");
	}
	_composePiedPanel() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "compose-bas" },
				IE.jsx.str("ie-btnicon", {
					class: "icon_trash avecFond i-medium",
					"ie-model": "nodePoubelle",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "repeat-bouton" },
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": "btnAnnuler",
						class: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					},
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "repeat-bouton" },
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": "btnValider",
						class: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					},
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				),
			),
		);
		return H.join("");
	}
	_composePanelEditionDevoir() {
		const H = [];
		H.push(
			'<div class="content">',
			this._composeDevoir({
				modeCreation: this.donnees.estCreation,
				devoir: this.devoir,
			}),
			"</div>",
		);
		H.push("<footer>", this._composePiedPanel(), "</footer>");
		return H.join("");
	}
	_instancierCalendrier(aEvnt) {
		return this.moteurFormSaisie.instancierCalendrier(aEvnt, this, {
			avecBoutonsPrecedentSuivant: false,
		});
	}
	_evntSelectDateDevoir(aDate) {
		if (!ObjetDate_1.GDate.estJourEgal(aDate, this.devoir.date)) {
			this.devoir.date = aDate;
			this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.devoir.datePublication = this.devoir.date;
			this.instanceSelectDatePublication.setOptionsObjetCelluleDate({
				premiereDate: this.devoir.date,
			});
			this.instanceSelectDatePublication.setDonnees(
				this.devoir.datePublication,
			);
		}
	}
	_evntSelectDatePublication(aDate) {
		this.devoir.datePublication = aDate;
		this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_updateDate(aInstance, aDate, aActif) {
		aInstance.initialiser();
		aInstance.setDonnees(aDate, true);
		if (aActif !== null && aActif !== undefined) {
			aInstance.setActif(aActif);
		}
	}
	_composeTheme() {
		return this.moteurFormSaisie.composeMultiSelecteurTheme({
			id: this.instanceMultiSelectTheme.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur("Themes"),
		});
	}
	_instancierMultiSelectTheme() {
		this.instanceMultiSelectTheme =
			this.moteurFormSaisie.instancierMultiSelecteurTheme(
				this._evtCellMultiSelectionTheme.bind(this),
				this,
			);
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.devoir.ListeThemes = aListeSelections;
			this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_updateMultiSelectTheme() {
		this.instanceMultiSelectTheme.initialiser();
		this.moteurFormSaisie.updateMultiSelectTheme({
			instanceSelect: this.instanceMultiSelectTheme,
			liste:
				this.devoir.ListeThemes ||
				new ObjetListeElements_1.ObjetListeElements(),
			matiere: this.devoir.service.estUnService
				? this.devoir.service.matiere
				: this.devoir.service.pere.matiere,
			libelleCB: this.devoir.libelleCBTheme,
		});
	}
	_composeCategorie() {
		return this.moteurFormSaisie.composeCategorie({
			id: this.instanceSelecteurCategorie.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.Categorie",
			),
		});
	}
	_evntCategorie(aGenreEvent) {
		if (
			aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			const lFenetreCategorieEvaluation =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_CategorieEvaluation_1.ObjetFenetre_CategorieEvaluation,
					{
						pere: this,
						evenement(aParams) {
							if (
								!!aParams.categorieSelectionnee &&
								aParams.categorieSelectionnee.existe()
							) {
								this.devoir.categorie = aParams.categorieSelectionnee;
							}
							this._actualiserCategorieEvaluation();
						},
						initialiser() {},
					},
				);
			lFenetreCategorieEvaluation.setDonnees({
				listeCategories: this.listeCategories,
				avecMultiSelection: false,
				avecCreation: true,
				tailleMax: this.tailleMaxCategorie,
			});
		}
	}
	_actualiserCategorieEvaluation() {
		new ObjetRequeteCategorieEvaluation_1.ObjetRequeteCategorieEvaluation(
			this,
			this._actionSurRequeteCategorie.bind(this),
		).lancerRequete();
	}
	_actionSurRequeteCategorie(aParam) {
		this.listeCategories = aParam.listeCategories;
		this.tailleMaxCategorie = aParam.tailleMax;
		this.devoir.categorie =
			!!this.devoir.categorie && this.devoir.categorie.existe()
				? this.listeCategories.getElementParLibelle(
						this.devoir.categorie.getLibelle(),
					)
				: undefined;
		this.instanceSelecteurCategorie.initialiser();
		this.instanceSelecteurCategorie.setLibelle(
			this.devoir && this.devoir.categorie
				? this.devoir.categorie.getLibelle()
				: "",
		);
	}
	jsxNodeSelectDocument(aTypeFichierExterne, aNode) {
		$(aNode).eventValidation((aEvent) => {
			const lAvecFile =
				aTypeFichierExterne ===
				TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
					? this.moteurNotesCP._avecSujetDevoir({ devoir: this.devoir })
					: this.moteurNotesCP._avecCorrigeDevoir({ devoir: this.devoir });
			const lActif = !this._estDocumentNonEditable() && !lAvecFile;
			const lListe =
				aTypeFichierExterne ===
				TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet
					? this.devoir.listeSujets
					: this.devoir.listeCorriges;
			if (lActif) {
				const lTabActions = [];
				lTabActions.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"fenetre_ActionContextuelle.depuisMesDocuments",
					),
					icon: "icon_folder_open",
					selecFile: true,
					optionsSelecFile: {
						maxSize: this.moteurNotes.getTailleMaxPieceJointe(),
					},
					event: (aParamsInput) => {
						if (aParamsInput) {
							const lPJ = this._getPJ({
								devoir: this.devoir,
								typeFichierExterne: aTypeFichierExterne,
							});
							if (lPJ) {
								const lLibelleFile = lPJ.getLibelle();
								const lMsg =
									aTypeFichierExterne ===
									TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
										.DevoirSujet
										? ObjetChaine_1.GChaine.format(
												ObjetTraduction_1.GTraductions.getValeur(
													"FenetreDevoir.MsgConfirmModifSujet",
												),
												[lLibelleFile],
											)
										: ObjetChaine_1.GChaine.format(
												ObjetTraduction_1.GTraductions.getValeur(
													"FenetreDevoir.MsgConfirmModifCorrige",
												),
												[lLibelleFile],
											);
								GApplication.getMessage().afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: lMsg,
									callback: (aGenreBouton) => {
										if (
											aGenreBouton === Enumere_Action_1.EGenreAction.Valider
										) {
											this._surModifFile({
												typeFichierExterne: aTypeFichierExterne,
												devoir: this.devoir,
												eltFichier: aParamsInput.eltFichier,
											});
										}
									},
								});
							} else {
								this._surModifFile({
									typeFichierExterne: aTypeFichierExterne,
									devoir: this.devoir,
									eltFichier: aParamsInput.eltFichier,
								});
							}
						}
					},
					class: "bg-orange-claire",
				});
				if (this.avecDepotCloud()) {
					const lParams = {
						genre: aTypeFichierExterne,
						listeElements: lListe,
						callback: this.surModifCloud.bind(this),
					};
					lTabActions.push({
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"fenetre_ActionContextuelle.depuisMonCloud",
						),
						icon: "icon_cloud",
						event: () => {
							this.ouvrirPJCloud(lParams);
						},
						class: "bg-orange-claire",
					});
					if (GEtatUtilisateur.avecCloudENEJDisponible()) {
						const lActionENEJ =
							ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
								() => this.ouvrirPJCloudENEJ(lParams),
							);
						if (lActionENEJ) {
							lTabActions.push(lActionENEJ);
						}
					}
				}
				ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
					lTabActions,
					{ pere: this },
				);
				aEvent.stopImmediatePropagation();
				aEvent.preventDefault();
			}
		});
	}
	_composeSelecteurFichier(aParam) {
		const lAttributesBtnSelecteur = {};
		if (this.avecDepotCloud()) {
			lAttributesBtnSelecteur["ie-node"] = this.jsxNodeSelectDocument.bind(
				this,
				aParam.typeFichierExterne,
			);
			lAttributesBtnSelecteur["ie-model"] =
				"gestionDocument('" + aParam.typeFichierExterne + "')";
		} else {
			lAttributesBtnSelecteur["ie-model"] =
				"selecFile('" + aParam.typeFichierExterne + "')";
			lAttributesBtnSelecteur["ie-selecfile"] = true;
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"ie-btnselecteur",
				Object.assign(
					{ class: "pj", id: aParam.idSelectFile },
					lAttributesBtnSelecteur,
					{ role: "button" },
				),
				aParam.strLabel,
			),
		);
		return H.join("");
	}
	_composeFichierCourant(aParam) {
		const H = [];
		H.push(
			UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(aParam.listeFichiers, {
				genreRessource: aParam.typeFichierExterne,
				IEModelChips: aParam.estEditable === true ? "chipsSujetCorrige" : null,
				argsIEModelChips: [aParam.typeFichierExterne],
				maxWidth: aParam.width,
			}),
		);
		return H.join("");
	}
	_composeZoneFichier(aParam) {
		const H = [];
		const lWidthSelecteur = aParam.width;
		H.push(
			this._composeSelecteurFichier({
				strLabel: aParam.strLabel,
				idSelectFile: aParam.idSelectFile,
				width: lWidthSelecteur,
				typeFichierExterne: aParam.typeFichierExterne,
			}),
		);
		H.push('<div id="', aParam.idZoneFile, '" class="docs-joints">');
		const lAvecSujet = aParam.avecFichier;
		if (lAvecSujet) {
			H.push(
				this._composeFichierCourant({
					listeFichiers: aParam.listeFichiers,
					typeFichierExterne: aParam.typeFichierExterne,
					estEditable: aParam.estEditable,
					width: this.dimensions.largeurMaxUrlSelecFile,
				}),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	actualiserFichier(aParam) {
		ObjetHtml_1.GHtml.setHtml(
			aParam.idFile,
			this._composeFichierCourant({
				listeFichiers: aParam.listeFichiers,
				typeFichierExterne: aParam.typeFichierExterne,
				estEditable: aParam.estEditable,
				width: this.dimensions.largeurMaxUrlSelecFile,
			}),
			{ instance: this },
		);
	}
	_composeSujet(aDevoir) {
		if (
			this.moteurNotesCP._autoriseSujetEtCorrigeDevoir({
				avecQCM: this.donnees.avecQCM,
				devoir: aDevoir,
			})
		) {
			return this._composeZoneFichier({
				strLabel: ObjetTraduction_1.GTraductions.getValeur("Notes.AjoutSujet"),
				idSelectFile: this.ids.selectSujet,
				idZoneFile: this.ids.fileSujet,
				avecFichier: this.moteurNotesCP._avecSujetDevoir({ devoir: aDevoir }),
				listeFichiers: aDevoir.listeSujets,
				typeFichierExterne: this.moteurNotes.getEGenreSujet(),
				width: this.dimensions.largeurSelecFile,
				estEditable: !this._estDocumentNonEditable(),
			});
		}
		return "";
	}
	actualiserFichierSujet(aDevoir) {
		if (aDevoir) {
			this.actualiserFichier({
				idFile: this.ids.fileSujet,
				listeFichiers: aDevoir.listeSujets,
				typeFichierExterne: this.moteurNotes.getEGenreSujet(),
				estEditable: !this._estDocumentNonEditable(),
			});
		}
	}
	_composeCorrige(aDevoir) {
		if (
			this.moteurNotesCP._autoriseSujetEtCorrigeDevoir({
				avecQCM: this.donnees.avecQCM,
				devoir: aDevoir,
			})
		) {
			return this._composeZoneFichier({
				strLabel:
					ObjetTraduction_1.GTraductions.getValeur("Notes.AjoutCorrige"),
				idSelectFile: this.ids.selectCorrige,
				idZoneFile: this.ids.fileCorrige,
				avecFichier: this.moteurNotesCP._avecCorrigeDevoir({ devoir: aDevoir }),
				listeFichiers: aDevoir.listeCorriges,
				typeFichierExterne: this.moteurNotes.getEGenreCorrige(),
				width: this.dimensions.largeurSelecFile,
				estEditable: !this._estDocumentNonEditable(),
			});
		}
		return "";
	}
	actualiserFichierCorrige(aDevoir) {
		this.actualiserFichier({
			idFile: this.ids.fileCorrige,
			listeFichiers: aDevoir.listeCorriges,
			typeFichierExterne: this.moteurNotes.getEGenreCorrige(),
			estEditable: !this._estDocumentNonEditable(),
		});
	}
	_getStrDevoirFacultatif(aDevoir) {
		if (aDevoir) {
			if (aDevoir.commeUnBonus) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.CommeUnBonus",
				);
			} else {
				if (aDevoir.commeUneNote) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.CommeUneNote",
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.DevoirFacultatif",
					);
				}
			}
		}
		return "";
	}
	_getStrTitreFacultatif(aDevoir) {
		if (aDevoir) {
			if (aDevoir.commeUnBonus || aDevoir.commeUneNote) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.DevoirFacultatif",
				);
			}
		}
		return "";
	}
	actualiserDevoirFacultatif(aDevoir) {
		ObjetHtml_1.GHtml.setHtml(
			this.ids.zoneFacultatif,
			this._composeZoneFacultatif(aDevoir),
			{ instance: this },
		);
		ObjetHtml_1.GHtml.setHtml(
			this.ids.titreFacultatif,
			this._getStrTitreFacultatif(aDevoir),
			{ instance: this },
		);
	}
	_composeContenuModaleChoixFacultatif(aInstanceFenetre) {
		const lJsxChoixFacultatif = (aGenreFacultatif) => {
			return {
				getValue: () => {
					const lDevoir = this.devoir;
					if (lDevoir) {
						switch (aGenreFacultatif) {
							case TypeDevoirFacultatif.Aucun:
								return !lDevoir.commeUneNote && !lDevoir.commeUnBonus;
							case TypeDevoirFacultatif.CommeUnBonus:
								return lDevoir.commeUnBonus;
							case TypeDevoirFacultatif.CommeUneNote:
								return lDevoir.commeUneNote;
						}
					}
					return false;
				},
				setValue: () => {
					const lDevoir = this.devoir;
					if (lDevoir) {
						switch (aGenreFacultatif) {
							case TypeDevoirFacultatif.Aucun:
								lDevoir.commeUnBonus = false;
								lDevoir.commeUneNote = false;
								lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								break;
							case TypeDevoirFacultatif.CommeUnBonus:
								lDevoir.commeUnBonus = true;
								lDevoir.commeUneNote = false;
								lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								break;
							case TypeDevoirFacultatif.CommeUneNote:
								lDevoir.commeUnBonus = false;
								lDevoir.commeUneNote = true;
								lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								break;
						}
						this.actualiserDevoirFacultatif(lDevoir);
						aInstanceFenetre.fermer();
					}
				},
				getName: () => {
					return `${this.Nom}_ChoixFacultatif`;
				},
				getDisabled: () => {
					return this._estChampInactif();
				},
			};
		};
		const H = [];
		H.push('<div class="Espace">');
		const lTab = [
			{
				type: TypeDevoirFacultatif.Aucun,
				label: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.FacultatifAucun",
				),
			},
			{
				type: TypeDevoirFacultatif.CommeUnBonus,
				label: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.FacultatifBonus",
				),
			},
			{
				type: TypeDevoirFacultatif.CommeUneNote,
				label: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.FacultatifNote",
				),
			},
		];
		for (let i = 0; i < lTab.length; i++) {
			const lElt = lTab[i];
			const lCouleur = this.moteurNotesCP.getBgColorDevoirFacultatif({
				commeUnBonus: lElt.type === TypeDevoirFacultatif.CommeUnBonus,
				commeUneNote: lElt.type === TypeDevoirFacultatif.CommeUneNote,
			});
			const lStylesWrapper = [];
			if (i < lTab.length - 1) {
				lStylesWrapper.push(
					"border-bottom: solid 1px " + GCouleur.themeNeutre.claire + ";",
				);
			}
			lStylesWrapper.push("height:" + this.dimensions.hauteurCB + "px;");
			lStylesWrapper.push("width:100%;");
			const lStylesCarreCouleur = [];
			lStylesCarreCouleur.push(
				"height:" + this.dimensions.carreDevoirFac + "px;",
			);
			lStylesCarreCouleur.push(
				"width:" + this.dimensions.carreDevoirFac + "px;",
			);
			lStylesCarreCouleur.push("background-color: " + lCouleur + ";");
			H.push(
				IE.jsx.str(
					"div",
					{ style: lStylesWrapper.join(""), class: "NoWrap" },
					IE.jsx.str(
						"div",
						{
							class: "AlignementMilieuVertical InlineBlock EspaceDroit",
							style: lStylesCarreCouleur.join(""),
						},
						"\u00A0",
					),
					IE.jsx.str(
						"div",
						{
							class: "AlignementMilieuVertical InlineBlock EspaceGauche",
							style:
								"width:calc(100% - " + this.dimensions.carreDevoirFac + "px);",
						},
						IE.jsx.str(
							"ie-radio",
							{
								class: "Espace",
								"ie-model": lJsxChoixFacultatif.bind(this, lElt.type),
							},
							lElt.label,
						),
					),
					IE.jsx.str(
						"div",
						{
							class: "AlignementMilieuVertical InlineBlock",
							style: "height:100%; width:0px;",
						},
						"\u00A0",
					),
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeDevoirFacultatif(aDevoir) {
		const H = [];
		H.push(
			'<div class="field-contain facultatif-contain tightened">',
			'<label class="active" id="',
			this.ids.titreFacultatif,
			'" for="',
			this.ids.zoneFacultatif,
			'">',
			this._getStrTitreFacultatif(aDevoir),
			"</label>",
			'<div id="',
			this.ids.zoneFacultatif,
			'" class="zone-facultatif">',
			this._composeZoneFacultatif(aDevoir),
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	_composeZoneFacultatif(aDevoir) {
		const H = [];
		const lLabel = this._getStrDevoirFacultatif(aDevoir);
		const lId = this.ids.cbfacultatif;
		const lAvecCouleur = aDevoir.commeUnBonus || aDevoir.commeUneNote;
		const lCouleur = aDevoir.commeUnBonus
			? GCouleur.devoir.commeUnBonus
			: aDevoir.commeUneNote
				? GCouleur.devoir.commeUneNote
				: "transparent";
		const lbgCouleur = lAvecCouleur ? "background-color : " + lCouleur : "";
		H.push(
			'<div class="facultatif-carre" style="',
			lbgCouleur,
			'" ></div>',
			'<ie-checkbox id="',
			lId,
			'" ie-model="facultatif">',
			lLabel,
			"</ie-checkbox>",
		);
		return H.join("");
	}
	_composeRemarque() {
		const H = [];
		H.push('<div class="field-contain ">');
		H.push(
			`<ie-checkbox class="long-text" ie-model="CBRemarque">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.activerCommentaireSurNotes")}</ie-checkbox>`,
		);
		H.push("</div>");
		return H.join("");
	}
	_getStrPeriodes(aListePeriodes) {
		const H = [];
		if (aListePeriodes !== null && aListePeriodes !== undefined) {
			aListePeriodes.parcourir((aPeriode) => {
				const lLibelle = aPeriode.getLibelle();
				if (lLibelle !== "") {
					H.push(lLibelle);
				}
			});
		}
		return H.join(", ");
	}
	jsxNodePeriode(aNode) {
		$(aNode).eventValidation(() => {
			this._afficherModalePeriodes(this.devoir);
		});
	}
	_composePeriode(aDevoir) {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.ids.periode,
					"ie-node": this.jsxNodePeriode.bind(this),
					class: "field-contain",
				},
				this._composePeriodes(aDevoir),
			),
		);
		return H.join("");
	}
	_composePeriodes(aDevoir) {
		const H = [];
		H.push(
			'<label class="active">',
			ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Periodes"),
			"</label>",
		);
		if (aDevoir && aDevoir.listeClasses) {
			aDevoir.listeClasses.parcourir((aClasse) => {
				H.push('<div class="periode-conteneur">');
				H.push(
					'    <span class="classe-libelle">',
					aClasse.getLibelle(),
					"</span>",
				);
				const lStrPeriodes = this._getStrPeriodes(aClasse.listePeriodes);
				H.push('      <span class="periodes">', lStrPeriodes, "</span>");
				H.push("</div>");
			});
		}
		return H.join("");
	}
	actualiserPeriodes(aIdPeriodes, aDevoir) {
		ObjetHtml_1.GHtml.setHtml(aIdPeriodes, this._composePeriodes(aDevoir), {
			instance: this,
		});
	}
	_afficherModalePeriodes(aDevoir) {
		const lFenetreModalePeriodes =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_1.ObjetFenetre,
				{
					pere: this,
					initialiser(aFenetre) {
						aFenetre.controleur.combo = {
							event: (aIndexClasse, aIndexPeriode, aParams) => {
								if (!aParams.estSelectionManuelle) {
									return;
								}
								const lClasse = aDevoir.listeClasses.get(aIndexClasse);
								const lSelectionPrec = lClasse.listePeriodes.get(aIndexPeriode);
								const lNewSelection = aParams.element;
								if (lSelectionPrec.getNumero() !== lNewSelection.getNumero()) {
									const lPeriodeDevoir =
										lClasse.listePeriodes.getElementParNumero(
											lNewSelection.getNumero(),
										);
									if (lPeriodeDevoir === null || lPeriodeDevoir === undefined) {
										aDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
										lSelectionPrec.setNumero(lNewSelection.getNumero());
										lSelectionPrec.setLibelle(
											lNewSelection.existeNumero()
												? lNewSelection.getLibelle()
												: "",
										);
										lSelectionPrec.setActif(true);
										lSelectionPrec.setEtat(
											Enumere_Etat_1.EGenreEtat.Modification,
										);
										lSelectionPrec.estEvaluationCloturee =
											lNewSelection.estEvaluationCloturee;
									} else {
										GApplication.getMessage().afficher({
											type: Enumere_BoiteMessage_1.EGenreBoiteMessage
												.Information,
											message: ObjetTraduction_1.GTraductions.getValeur(
												"Notes.PeriodeDejaAffectee",
											),
										});
									}
								}
							},
							getDisabled: (aIndexClasse, aIndexPeriode) => {
								const lClasse = aDevoir.listeClasses.get(aIndexClasse);
								const lPeriode = lClasse.listePeriodes.get(aIndexPeriode);
								return (
									(lPeriode.getNumero() && !lPeriode.getActif()) ||
									aDevoir.verrouille
								);
							},
						};
					},
				},
				{
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.PeriodesDevoir",
					),
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					fermerFenetreSurClicHorsFenetre: true,
				},
			);
		lFenetreModalePeriodes
			.afficher(this._composePeriodesDuDevoir(aDevoir))
			.then(() => {
				this.actualiserPeriodes(this.ids.periode, this.devoir);
			});
	}
	_composePeriodesDuDevoir(aDevoir) {
		const H = [];
		if (aDevoir && aDevoir.listeClasses) {
			aDevoir.listeClasses.parcourir((aClasse, aIndexClasse) => {
				const lClasse = this.donnees.listeClasses.getElementParNumero(
					aClasse.getNumero(),
				);
				const lListePeriodes = lClasse.listePeriodes;
				lListePeriodes
					.setTri([
						ObjetTri_1.ObjetTri.init("Genre"),
						ObjetTri_1.ObjetTri.init("Libelle"),
					])
					.trier();
				H.push('<div class="full-width p-all-l">');
				H.push(IE.jsx.str("div", { class: "ie-titre" }, aClasse.getLibelle()));
				aClasse.listePeriodes.parcourir((aPeriodeClasse, aIndexPeriode) => {
					const lIdLabel = GUID_1.GUID.getId();
					H.push('<div class="field-contain">');
					H.push(
						IE.jsx.str(
							"label",
							{ id: lIdLabel, class: "active" },
							ObjetTraduction_1.GTraductions.getTabValeurs(
								"FenetreDevoir.PeriodeNotation",
							)[aIndexPeriode],
						),
					);
					H.push(
						'<ie-combo aria-labelledby="',
						lIdLabel,
						'" ie-model="combo(',
						aIndexClasse,
						",",
						aIndexPeriode,
						')">',
					);
					lListePeriodes.parcourir((aPeriode) => {
						if (aIndexPeriode > 0 || aPeriode.existeNumero()) {
							const lEstSelected = false;
							H.push(
								'<option value="',
								aPeriode.getNumero(),
								'" selected="',
								lEstSelected ? "selected" : false,
								'">',
								aPeriode.getLibelle(),
								"</option>",
							);
						}
					});
					H.push();
					H.push("</ie-combo>");
					H.push("</div>");
				});
				H.push("</div>");
			});
		}
		return H.join("");
	}
}
exports.ObjetPanelEditionDevoir = ObjetPanelEditionDevoir;

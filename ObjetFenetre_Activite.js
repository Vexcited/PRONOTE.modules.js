exports.ObjetFenetre_Activite = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_1 = require("ObjetIdentite");
const ModuleEditeurHtml_1 = require("ModuleEditeurHtml");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetFenetre_PanierRessourceKiosque_1 = require("ObjetFenetre_PanierRessourceKiosque");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitaireActiviteTAFPP_1 = require("UtilitaireActiviteTAFPP");
const ObjetFenetre_ManuelsNumeriques_1 = require("ObjetFenetre_ManuelsNumeriques");
const Enumere_Activites_Tvx_1 = require("Enumere_Activites_Tvx");
const tag_1 = require("tag");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const ObjetRequeteListeElevesPourLesRessourcesALaDate_1 = require("ObjetRequeteListeElevesPourLesRessourcesALaDate");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_Activite extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.optionsActivite = {
			genre: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Act_Consigne,
			date: ObjetDate_1.GDate.aujourdhui,
			nonModifiable: false,
		};
	}
	setOptionsActivite(aOptions) {
		$.extend(this.optionsActivite, aOptions);
	}
	construireInstances() {
		this.editeur = ObjetIdentite_1.Identite.creerInstance(
			ModuleEditeurHtml_1.ModuleEditeurHtml,
			{ pere: this },
		);
		this.editeur.setParametres({
			surChange: (aValeur) => {
				if (
					this.donnees &&
					this.donnees.activite &&
					!ObjetChaine_1.GChaine.estChaineHTMLEgal(
						aValeur,
						this.donnees.activite.consigne,
					)
				) {
					this.donnees.activite.consigne = aValeur;
					this.donnees.activite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				this.$refreshSelf();
			},
		});
		this.selecDate = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: function (aDate) {
					if (
						this.donnees &&
						this.donnees.activite &&
						!ObjetDate_1.GDate.estDateEgale(
							this.donnees.activite.DateDebut,
							aDate,
						)
					) {
						if (
							this.donnees.activite.getGenre() ===
								TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail &&
							ObjetDate_1.GDate.estJourCourant(aDate)
						) {
							this.appSco
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.msgInformationImpossibleSaisirTAFsurAujourdhui",
									),
								})
								.then(() => {
									this.selecDate.setDonnees(this.donnees.activite.DateDebut);
								});
						} else {
							this.donnees.activite.DateDebut = aDate;
							if (
								this.donnees.activite.getGenre() ===
								TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
							) {
								const lRessource = this.donnees.activite.classeMN
									? this.donnees.activite.classeMN
									: this.donnees.activite.classes &&
											this.donnees.activite.classes.count()
										? this.donnees.activite.classes.get(0)
										: null;
								if (lRessource) {
									new ObjetRequeteListeElevesPourLesRessourcesALaDate_1.ObjetRequeteListeElevesPourLesRessourcesALaDate(
										this,
									)
										.lancerRequete({ ressource: lRessource, date: aDate })
										.then((aJSON) => {
											UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.miseAJourInfosEleves(
												this.donnees.activite,
												aJSON.eleves,
											);
											this.listeEleves =
												UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.getListeElevePourSelection(
													this.donnees.activite,
												);
										});
								}
							}
							if (!!this.donnees.activite.executionQCM) {
								const lObjInitDateQCM =
									UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.initHeureDebutEtFin(
										this.donnees.activite,
									);
								this.donnees.activite.executionQCM.dateFinPublication =
									lObjInitDateQCM.dateFin;
								this.donnees.activite.executionQCM.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								if (
									this.donnees.activite.executionQCM.dateDebutPublication >
									this.donnees.activite.executionQCM.dateFinPublication
								) {
									this.donnees.activite.executionQCM.dateDebutPublication =
										lObjInitDateQCM.dateDebut;
								}
							}
							this.donnees.activite.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					}
				},
			},
		);
		this.selecDate.setOptionsObjetCelluleDate({
			largeurComposant: 140,
			formatDate: "%JJJ %JJ/%MM/%AAAA",
		});
	}
	estVisuConsigne() {
		return Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUneConsigne(
			this.optionsActivite.genre,
		);
	}
	estVisuQCM() {
		return Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
			this.optionsActivite.genre,
		);
	}
	estVisuExerciceInteractif() {
		return Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
			this.optionsActivite.genre,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboMatiere: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie(
						Object.assign(
							{ longueur: "100%" },
							aInstance._getOptionsComboMatiere(),
						),
					);
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.donnees ? aInstance.donnees.listeMatieres : null;
					}
				},
				getIndiceSelection: function () {
					if (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						!aInstance.donnees.activite.matiere
					) {
						return -1;
					}
					let lIndice =
						aInstance.donnees.listeMatieres.getIndiceParNumeroEtGenre(
							aInstance.donnees.activite.matiere.getNumero(),
						);
					if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstance.donnees.activite &&
						(!aInstance.donnees.activite.matiere ||
							aInstance.donnees.activite.matiere.getNumero() !==
								aParametres.element.getNumero())
					) {
						aInstance.donnees.activite.matiere = aParametres.element;
						aInstance.donnees.activite.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return aInstance.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			btnAjouterDocuments: {
				event() {
					UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.ouvrirFenetreChoixRessourcePeda(
						{
							instance: aInstance,
							activite: aInstance.donnees.activite,
							nodeFocus: this.node,
							listePJTot: aInstance.donnees.listePJTot,
							listeFichiersCrees: aInstance.donnees.listeFichiersCrees,
							tailleMaxPJ: aInstance.appSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
							),
							callbackAjoutLienKiosque: aInstance.appSco.getEtatUtilisateur()
								.avecRessourcesGranulaire
								? () => {
										aInstance._ouvrirPJKiosque();
									}
								: null,
						},
					);
				},
				getDisabled() {
					const lActivite = aInstance.donnees
						? aInstance.donnees.activite
						: null;
					return !lActivite || !!lActivite.executionQCM;
				},
			},
			getNodeEditeur: function () {
				const lConsigne =
					aInstance.donnees && aInstance.donnees.activite
						? aInstance.donnees.activite.consigne
						: "";
				aInstance.editeur.setParametres({
					strLabel: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.Consigne",
					),
					classLabel: "Texte12",
					heightEdition: 100,
					minHeightEdition: 50,
				});
				aInstance.editeur.initialiser();
				aInstance.editeur.setDonnees(lConsigne);
			},
			editeurEstVisible: function () {
				return aInstance.estVisuConsigne();
			},
			qcmEstVisible: function () {
				return aInstance.estVisuQCM();
			},
			exerciceEstVisible: function () {
				return aInstance.estVisuExerciceInteractif();
			},
			getNodeSelecDate: function () {
				const lDate =
					aInstance.donnees && aInstance.donnees.activite
						? aInstance.donnees.activite.DateDebut
						: ObjetDate_1.GDate.demain;
				aInstance.selecDate.initialiser();
				aInstance.selecDate.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				const lPremierDate =
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.getGenre() ===
						TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite
						? ObjetDate_1.GDate.aujourdhui
						: ObjetDate_1.GDate.demain;
				aInstance.selecDate.setPremiereDateSaisissable(lPremierDate, true);
				aInstance.selecDate.setDonnees(lDate);
			},
			getInfoQCM: function () {
				const H = [];
				if (
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.executionQCM
				) {
					H.push('<div class="FAct_QCMInfo">');
					if (aInstance.donnees.activite.executionQCM) {
						H.push(
							'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
						);
						H.push(
							'<div class="InlineBlock AlignementMilieuVertical">',
							aInstance.donnees.activite.executionQCM.QCM.getLibelle(),
							"</div>",
						);
					}
					H.push("</div>");
				}
				return H.join("");
			},
			getExerciceNumerique: function () {
				const H = [];
				if (
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.titreKiosque
				) {
					H.push('<div class="FAct_QCMInfo">');
					if (aInstance.donnees.activite.titreKiosque) {
						H.push(
							'<div class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical MargeGauche"></div>',
						);
						H.push(
							'<div class="FAct_QCMLibelle InlineBlock AlignementMilieuVertical">',
							aInstance.donnees.activite.titreKiosque,
							"</div>",
						);
					}
					H.push("</div>");
				}
				return H.join("");
			},
			selectExerciceNumerique: function () {
				$(this.node).on({
					click: aInstance._eventAjouterExerciceNum.bind(aInstance),
				});
			},
			getClassExerciceNumerique: function () {
				return aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.titreKiosque &&
					aInstance.optionsActivite.nonModifiable
					? "FAct_Inactif"
					: "";
			},
			selectQCM: function () {
				$(this.node).on({ click: aInstance._eventAjouterQCM.bind(aInstance) });
			},
			btnSelectQCM: {
				event: aInstance._eventAjouterQCM.bind(aInstance),
				getLibelle: function () {
					const H = [];
					if (
						aInstance.donnees &&
						aInstance.donnees.activite &&
						aInstance.donnees.activite.executionQCM
					) {
						H.push(
							(0, tag_1.tag)(
								"span",
								{ class: [] },
								aInstance.donnees.activite.executionQCM.QCM.getLibelle(),
							),
						);
					}
					return H.join("");
				},
				getIcone() {
					return "icon_qcm";
				},
				getDisabled: function () {
					return (
						aInstance.donnees &&
						aInstance.donnees.activite &&
						aInstance.donnees.activite.executionQCM &&
						(aInstance.donnees.activite.executionQCM.estVerrouille ||
							!aInstance.donnees.estCreation)
					);
				},
			},
			getClassQCM: function () {
				return aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.executionQCM &&
					(aInstance.donnees.activite.executionQCM.estVerrouille ||
						aInstance.optionsActivite.nonModifiable)
					? "FAct_Inactif"
					: "";
			},
			modalitesExec: function () {
				$(this.node).on({
					click: aInstance._eventParametresExecutionQCM.bind(aInstance),
				});
			},
			getClassModalites: function () {
				return aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.executionQCM
					? "Lien"
					: "FAct_ModalitesInactif";
			},
			chipsDocumentActivite: {
				eventBtn: function (aIndicePJ) {
					const lActivite = !!aInstance.donnees
						? aInstance.donnees.activite
						: null;
					if (
						!!lActivite &&
						!!lActivite.documents &&
						lActivite.documents.getNbrElementsExistes() > 0
					) {
						const lDoc = lActivite.documents.get(aIndicePJ);
						if (lDoc) {
							lDoc.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							aInstance.donnees.activite.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					}
				},
			},
			boutonsVisible: function () {
				return (
					aInstance.donnees &&
					aInstance.donnees.activite &&
					!aInstance.donnees.estCreation &&
					aInstance.donnees.activite.existeNumero()
				);
			},
			btnSupprimer: {
				event: function () {
					if (aInstance.donnees && aInstance.donnees.activite) {
						UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.surCmdSupprimerActivite(
							{
								activite: aInstance.donnees.activite,
								clbck: function () {
									aInstance.surValidation(
										ObjetFenetre_Activite.genreAction.supprimer,
									);
								},
							},
						);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						!(
							!aInstance.donnees.estCreation &&
							aInstance.donnees.activite.existeNumero()
						)
					);
				},
			},
			getHtmlPJ: function () {
				if (
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.documents &&
					aInstance.donnees.activite.documents.getNbrElementsExistes() > 0
				) {
					return [
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							aInstance.donnees.activite.documents,
							{ IEModelChips: "chipsDocumentActivite" },
						),
					].join("");
				} else {
					return "";
				}
			},
			getDetailFait: function () {
				const H = [];
				if (aInstance.donnees) {
					const lActivite = aInstance.donnees.activite;
					if (!!lActivite && !!lActivite.eleves) {
						const lNombreTotal = lActivite.eleves.count();
						const lElevesRendu = lActivite.eleves.getListeElements((aEleve) => {
							return aEleve.existe() && (aEleve.estRendu || aEleve.TAFFait);
						});
						const lNombreRendus = lElevesRendu.count();
						const lStrTAFRendus = ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF.xyEleves",
							[lNombreRendus, lNombreTotal],
						);
						const lStrTAFRendusAvecLien =
							'<a class="LienAccueil" ie-node="nodeDetailFait">' +
							lStrTAFRendus +
							"</a>";
						H.push(
							'<div class="EspaceHaut10">',
							"<span>",
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF.FaitPar",
							),
							" </span>",
							!!aInstance.donnees.estCreation
								? lStrTAFRendus
								: lStrTAFRendusAvecLien,
							"</div>",
						);
					}
				}
				return H.join("");
			},
			nodeDetailFait: function () {
				$(this.node).on({
					click: aInstance._ouvrirFenetreDetailFait.bind(aInstance),
				});
			},
			getClassesMN: function () {
				return aInstance._composeInfoClasses();
			},
			existeClasseMN: function () {
				return !!(
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.classeMN
				);
			},
			selectClasses: function () {
				$(this.node).on({
					click: aInstance._ouvrirFenetreSelectionClasseGroupe.bind(aInstance),
				});
			},
			chipsClasse: {
				eventBtn: function (aNumeroClasse, aEvent) {
					aEvent.stopPropagation();
					aInstance._supprimerClasseMN(aNumeroClasse);
				},
			},
			getEleves: function () {
				return aInstance._composeInfoEleves();
			},
			existeEleves: function () {
				return !!(aInstance.donnees && aInstance.donnees.activite);
			},
			selectEleves: function () {
				$(this.node).on({
					click: aInstance._ouvrirFenetreSelectionEleves.bind(aInstance),
				});
			},
			chipsEleve: {
				eventBtn: function (aNumero, aGenre, aEvent) {
					aEvent.stopPropagation();
					aInstance._supprimerEleves(aNumero, aGenre);
				},
			},
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (
						aInstance.donnees &&
						aInstance.donnees.activite &&
						aBoutonRepeat.element.action ===
							ObjetFenetre_Activite.genreAction.valider
					) {
						return !aInstance._verifierActiviteValide(
							aInstance.donnees.activite,
						);
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
			comboRendu: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie(Object.assign({ longueur: "100%" }));
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						if (!aInstance.listeRendu) {
							aInstance.listeRendu =
								TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.toListe([
									TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPapier,
									TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque,
								]);
						}
						return aInstance.donnees ? aInstance.listeRendu : null;
					}
				},
				getIndiceSelection: function () {
					if (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						!aInstance.listeRendu
					) {
						return -1;
					}
					let lIndice = aInstance.listeRendu.getIndiceParNumeroEtGenre(
						undefined,
						aInstance.donnees.activite.genreRendu,
					);
					if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstance.donnees.activite &&
						aInstance.donnees.activite.genreRendu !==
							aParametres.element.getGenre()
					) {
						aInstance.donnees.activite.genreRendu =
							aParametres.element.getGenre();
						aInstance.donnees.activite.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
							aInstance.optionsActivite.genre,
						) ||
						Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
							aInstance.optionsActivite.genre,
						)
					);
				},
			},
			chbRendreEnLigne: {
				getValue: function () {
					let lResult = false;
					if (aInstance.donnees && aInstance.donnees.activite) {
						lResult =
							Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
								aInstance.optionsActivite.genre,
							) ||
							Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
								aInstance.optionsActivite.genre,
							);
						if (!lResult) {
							lResult =
								aInstance.donnees.activite.genreRendu ===
								TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPronote;
						}
					}
					return lResult;
				},
				setValue: function (aValue) {
					if (aInstance.donnees && aInstance.donnees.activite) {
						aInstance.donnees.activite.genreRendu = aValue
							? TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPronote
							: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu;
						aInstance.donnees.activite.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						if (aValue) {
							aInstance.verifierElevesConcernes(aInstance.donnees.activite);
						}
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
							aInstance.optionsActivite.genre,
						) ||
						Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
							aInstance.optionsActivite.genre,
						)
					);
				},
			},
		});
	}
	verifierElevesConcernes(aActivite, aArrayClasses) {
		UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.verifierElevesConcernes(
			aActivite,
			aArrayClasses,
			this.donnees.estCreation,
		);
	}
	composeContenu() {
		return Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUneActivite(
			this.optionsActivite.genre,
		)
			? this.composeContenuActivite()
			: Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnTAF(
						this.optionsActivite.genre,
					)
				? this.composeContenuTravail()
				: "";
	}
	composeContenuActiviteTvx(aGenreTravailAFaire) {
		const lHTML = [];
		lHTML.push('<div class="FenetreActivite">');
		lHTML.push(this._composeDate(aGenreTravailAFaire));
		lHTML.push(this._composeMatiere());
		lHTML.push(this._composeQCM());
		lHTML.push(this._composeExerciceNumerique());
		lHTML.push(this._composeConsigne());
		lHTML.push(this._composeDocuments());
		lHTML.push(
			aGenreTravailAFaire ===
				TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite
				? this._composeClasseMN()
				: this._composeElevesConcernees(),
		);
		lHTML.push(this._composeARendreEnLigne());
		lHTML.push("</div>");
		return lHTML.join("");
	}
	composeContenuActivite() {
		return this.composeContenuActiviteTvx(
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite,
		);
	}
	composeContenuTravail() {
		return this.composeContenuActiviteTvx(
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail,
		);
	}
	composeBas() {
		const lHTML = [];
		lHTML.push('<div class="fact_boutons_bas" ie-display="boutonsVisible">');
		lHTML.push(
			'<ie-bouton ie-icon="icon_trash" ie-model="btnSupprimer" class="btn-flat-minimal ',
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			'"></ie-bouton>',
		);
		lHTML.push("</div>");
		return lHTML.join("");
	}
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		$.extend(lParametres, {
			activite: this.donnees.activite,
			estCreation: this.donnees.estCreation,
			listeFichiersCrees: this.donnees.listeFichiersCrees,
			listeDocuments: this.donnees.listePJTot,
		});
		return lParametres;
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.donnees.listeFichiersCrees =
			new ObjetListeElements_1.ObjetListeElements();
		this.donnees.listePJTot = aDonnees.listeDocumentsJoints;
		const lConsigne =
			this.donnees && this.donnees.activite
				? this.donnees.activite.consigne
				: "";
		this.editeur.setDonnees(lConsigne);
		if (this.donnees.activite && this.donnees.activite.DateDebut) {
			this.selecDate.setDonnees(this.donnees.activite.DateDebut);
		}
		if (!this.listeEleves) {
			this.listeEleves =
				UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.getListeElevePourSelection(
					this.donnees.activite,
				);
		}
		let lPremierDate =
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.getGenre() ===
				TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite
				? ObjetDate_1.GDate.aujourdhui
				: ObjetDate_1.GDate.demain;
		if (
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.DateDebut &&
			ObjetDate_1.GDate.estAvantJourCourant(this.donnees.activite.DateDebut)
		) {
			lPremierDate = this.donnees.activite.DateDebut;
		}
		this.selecDate.setPremiereDateSaisissable(lPremierDate, true);
		if (
			aDonnees.estCreation &&
			!this.optionsActivite.nonModifiable &&
			Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
				this.optionsActivite.genre,
			)
		) {
			this._ajouterQCM();
		} else if (
			aDonnees.estCreation &&
			!this.optionsActivite.nonModifiable &&
			Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
				this.optionsActivite.genre,
			)
		) {
			this._ajouterExerciceNum();
		}
		this.afficher();
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Activite,
			{
				pere: aParams.instance,
				evenement: aParams.callback,
				initialiser: function (aInstance) {
					aInstance.setOptionsActivite({
						genre: aParams.genre,
						nonModifiable: !!aParams.nonModifiable,
					});
				},
			},
			{
				modale: true,
				titre: aParams.titre,
				listeBoutons: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						action: ObjetFenetre_Activite.genreAction.annuler,
					},
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
						valider: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
						action: ObjetFenetre_Activite.genreAction.valider,
					},
				],
				largeur: 520,
				avecTailleSelonContenu: true,
			},
		);
		lFenetre.setDonnees({
			activite: aParams.article,
			listeMatieres: aParams.listeMatieres,
			listeDocumentsJoints:
				aParams.listeDocumentsJoints ||
				new ObjetListeElements_1.ObjetListeElements(),
			ressource: aParams.ressource,
			estCreation: !!aParams.estCreation,
		});
	}
	_eventParametresExecutionQCM(aNode) {
		if (
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.executionQCM
		) {
			this._parametresExecutionQCM(aNode);
		}
	}
	_parametresExecutionQCM(aNode) {
		UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.ouvrirModalitesExecQCMDActivite(
			{
				activite: this.donnees.activite,
				clbck: function () {
					ObjetHtml_1.GHtml.setFocus(aNode, true);
				},
			},
		);
	}
	_supprimerClasseMN(aNumeroClasse) {
		if (this.donnees && this.donnees.activite) {
			const lNbrClasses = this.donnees.activite.classes.count();
			if (lNbrClasses > 1) {
				const lClasses = this.donnees.activite.classes.getListeElements(
					(aElement) => {
						return !aElement.egalParNumeroEtGenre(
							aNumeroClasse,
							Enumere_Ressource_1.EGenreRessource.Classe,
						);
					},
				);
				this.donnees.activite.classes = lClasses;
				this.donnees.activite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.verifierElevesConcernes(this.donnees.activite);
			} else {
				this._ouvrirFenetreSelectionClasseGroupe();
			}
		}
	}
	_ouvrirFenetreDetailFait() {
		if (this.donnees) {
			this.callback.appel(ObjetFenetre_Activite.genreAction.detailFait, {
				article: this.donnees.activite,
			});
		}
	}
	_ouvrirFenetreSelectionClasseGroupe() {
		if (
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.classeMN
		) {
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.ouvrirFenetreSelectionClasseGpe(
				{
					activite: this.donnees.activite,
					clbck: this.verifierElevesConcernes.bind(this),
				},
			);
		}
	}
	_composeInfoClasses() {
		const H = [];
		if (this.donnees && this.donnees.activite) {
			const lNbrClasses = this.donnees.activite.classes.count();
			for (let iClasse = 0; iClasse < lNbrClasses; iClasse++) {
				const lClasse = this.donnees.activite.classes.get(iClasse);
				if (lClasse.existe()) {
					let lModel = "";
					if (lNbrClasses > 1) {
						lModel = ObjetHtml_1.GHtml.composeAttr("ie-model", "chipsClasse", [
							lClasse.getNumero(),
						]);
					}
					H.push(
						'<ie-chips class="avec-event" ',
						lModel,
						">",
						lClasse.getLibelle(),
						"</ie-chips>",
					);
				}
			}
		}
		return H.join("");
	}
	_composeInfoEleves() {
		const H = [];
		if (this.donnees && this.donnees.activite) {
			H.push(
				this.composeDetailsElevesSelectionnes(
					this.donnees.activite,
					this.listeEleves,
				),
			);
		}
		return H.join("");
	}
	composeDetailsElevesSelectionnes(aActivite, aListeEleves) {
		const lResult = [];
		const lListeElementAAfficher =
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.recupererElementsElevesSelectionnesPourChips(
				aActivite,
				aListeEleves,
			);
		const lNbrAAfficher = lListeElementAAfficher.count();
		for (let i = 0; i < lListeElementAAfficher.count(); i++) {
			const lElmChip = lListeElementAAfficher.get(i);
			let lModel = "";
			if (lNbrAAfficher > 1 && !lElmChip.sansSuppression) {
				lModel = ObjetHtml_1.GHtml.composeAttr("ie-model", "chipsEleve", [
					lElmChip.getNumero(),
					lElmChip.getGenre(),
				]);
			}
			lResult.push(
				'<ie-chips class="avec-event" ',
				lElmChip.title ? ' title="' + lElmChip.title + '" ' : "",
				lModel,
				">",
				lElmChip.getLibelle(),
				"</ie-chips>",
			);
		}
		return lResult.join("");
	}
	_supprimerEleves(aNumero, aGenre) {
		let lUniquement1ChipVisible = false;
		const lNbrClasses = this.donnees.activite.classes.count();
		if (
			(this.donnees.activite.pourTous && lNbrClasses === 1) ||
			this.donnees.activite.eleves.count() === 1
		) {
			lUniquement1ChipVisible = true;
		}
		if (lUniquement1ChipVisible) {
			this._ouvrirFenetreSelectionEleves();
		} else {
			const lElement = this.listeEleves.getElementParNumeroEtGenre(
				aNumero,
				aGenre,
			);
			if (!!lElement) {
				lElement.cmsActif = false;
				if (lElement.estUnDeploiement) {
					this.listeEleves.parcourir((aFils) => {
						if (aFils.pere === lElement) {
							aFils.cmsActif = false;
							aFils.pourTous = false;
						}
					});
				} else {
					let lAuMoinsUnFilsSelectionne = false;
					let lTousLesFilsSelectionne = true;
					let lPere;
					lElement.estConcerne = false;
					this.listeEleves.parcourir((aFils) => {
						if (lElement.pere === aFils) {
							lPere = aFils;
						}
						if (
							aFils.pere &&
							aFils.pere === lPere &&
							!lAuMoinsUnFilsSelectionne
						) {
							lAuMoinsUnFilsSelectionne = aFils.cmsActif;
						}
						if (aFils.pere && aFils.pere === lPere && lTousLesFilsSelectionne) {
							lTousLesFilsSelectionne = aFils.cmsActif;
						}
					});
					lPere.cmsActif = lAuMoinsUnFilsSelectionne;
					lPere.pourTous = lTousLesFilsSelectionne;
				}
				this._miseAJourEleveDActivite();
			} else {
			}
		}
	}
	_miseAJourEleveDActivite() {
		let lElevesPotentielDesClasses =
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.miseAJourClassesConcerneesDepuisListeEleves(
				{
					article: this.donnees.activite,
					ressourceMN: this.donnees.activite.classeMN,
					listeEleves: this.listeEleves,
					tenirComptePourTous: false,
				},
			);
		UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.miseAJourElevesConcernes({
			listeEleves: this.listeEleves,
			article: this.donnees.activite,
			elevesPotentielDesClasses: lElevesPotentielDesClasses,
		});
	}
	_ouvrirFenetreSelectionEleves() {
		if (
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.elevesPotentiel
		) {
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.ouvrirFenetreSelectionEleves(
				{
					listeEleves: this.listeEleves,
					clbckSurValider: this._miseAJourEleveDActivite.bind(this),
					clbckSurAnnuler: () => {
						this.listeEleves =
							UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.getListeElevePourSelection(
								this.donnees.activite,
							);
					},
				},
			);
		}
	}
	_eventAjouterQCM() {
		if (
			this.donnees &&
			this.donnees.activite &&
			(!this.donnees.activite.executionQCM ||
				!this.donnees.activite.executionQCM.estVerrouille) &&
			!this.optionsActivite.nonModifiable
		) {
			this._ajouterQCM();
		}
	}
	_ajouterQCM() {
		new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(this)
			.lancerRequete(null)
			.then((aTabParams) => {
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
					{
						pere: this,
						evenement: function (aNumeroBouton, aEltQCM) {
							if (aNumeroBouton === 1 && aEltQCM.existeNumero()) {
								if (
									!this.donnees.activite.executionQCM ||
									this.donnees.activite.executionQCM.QCM.getNumero() !==
										aEltQCM.getNumero()
								) {
									if (
										aEltQCM.getGenre() ===
										Enumere_Ressource_1.EGenreRessource.QCM
									) {
										UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.associerQCMAActivite(
											{ activite: this.donnees.activite, eltQCM: aEltQCM },
										);
										this.editeur.setDonnees("");
										this.editeur.setActif(false);
									}
									this.donnees.activite.ressourceDataLien = undefined;
									this.donnees.activite.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
									this.verifierElevesConcernes(this.donnees.activite);
								}
							}
						},
						initialiser: function (aInstance) {
							UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.initFenetreSelectionQCM(
								aInstance,
							);
						},
					},
				).setDonnees(aTabParams[0], aTabParams[1], aTabParams[2]);
			});
	}
	_eventAjouterExerciceNum() {
		if (
			this.donnees &&
			this.donnees.activite &&
			!this.optionsActivite.nonModifiable
		) {
			this._ajouterExerciceNum();
		}
	}
	_ajouterExerciceNum() {
		const lGenresApi = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lGenresApi.add(TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF);
		if (!this.modeAncien) {
			ObjetFenetre_ManuelsNumeriques_1.ObjetFenetre_ManuelsNumeriques.ouvrir({
				instance: this,
				callback: this._evenementSurFenetreRessourceKiosqueLiens.bind(
					this,
					true,
					this.donnees.activite,
				),
				genresApiKiosque: lGenresApi,
			});
		} else {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
				{
					pere: this,
					evenement: this._evenementSurFenetreRessourceKiosqueLiensTAF.bind(
						this,
						this.donnees.activite,
					),
				},
			);
			lFenetre.afficherFenetre(lGenresApi);
		}
	}
	_ouvrirPJKiosque() {
		const lGenresApi = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lGenresApi.add(TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier);
		if (!this.modeAncien) {
			ObjetFenetre_ManuelsNumeriques_1.ObjetFenetre_ManuelsNumeriques.ouvrir({
				instance: this,
				callback: this._evenementSurFenetreRessourceKiosqueLiens.bind(
					this,
					false,
					this.donnees.activite,
				),
				genresApiKiosque: lGenresApi,
			});
		} else {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
				{
					pere: this,
					evenement:
						this._evenementSurFenetreRessourceKiosqueLiensDocumentJoint.bind(
							this,
							this.donnees.activite,
						),
				},
			);
			lFenetre.setOptions({ avecMultiSelection: true });
			lGenresApi.add(TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF);
			lFenetre.afficherFenetre();
		}
	}
	_evenementSurFenetreRessourceKiosqueLiens(aEstExercice, aActivite, aParams) {
		if (aParams.genreBouton === 1) {
			if (
				aEstExercice &&
				aParams.selection.count() === 1 &&
				this.donnees.estCreation
			) {
				const lElement = aParams.selection.getPremierElement();
				if (
					this.estVisuExerciceInteractif() &&
					!lElement.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
					)
				) {
					this.appSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.messageExerciceVersConsigne",
							),
						})
						.then((aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this.optionsActivite.genre =
									Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.getConsigneDeGenreTravailAFaire(
										aActivite.getGenre(),
									);
								this.setOptionsFenetre({
									titre: this._getTitreFenetreActivite(
										this.optionsActivite.genre,
										this.donnees.estCreation,
									),
								});
								this._evenementRessourceKiosqueLiensApresMessage(
									false,
									aActivite,
									aParams,
								);
							}
						});
				} else {
					this._evenementRessourceKiosqueLiensApresMessage(
						true,
						aActivite,
						aParams,
					);
				}
			} else if (
				!aEstExercice &&
				aParams.selection.count() === 1 &&
				this.donnees.estCreation
			) {
				const lElement = aParams.selection.getPremierElement();
				if (
					this.estVisuConsigne() &&
					lElement.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
					)
				) {
					this.appSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.messageConsigneVersExercice",
							),
						})
						.then((aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this.optionsActivite.genre =
									Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.getExerciceDeGenreTravailAFaire(
										aActivite.getGenre(),
									);
								aActivite.documents.parcourir((aElement) => {
									aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								});
								this.setOptionsFenetre({
									titre: this._getTitreFenetreActivite(
										this.optionsActivite.genre,
										this.donnees.estCreation,
									),
								});
								this._evenementRessourceKiosqueLiensApresMessage(
									true,
									aActivite,
									aParams,
								);
							}
						});
				} else {
					this._evenementRessourceKiosqueLiensApresMessage(
						false,
						aActivite,
						aParams,
					);
				}
			} else {
				this._evenementRessourceKiosqueLiensApresMessage(
					aEstExercice,
					aActivite,
					aParams,
				);
			}
		} else {
			this._evenementRessourceKiosqueLiensApresMessage(
				aEstExercice,
				aActivite,
				aParams,
			);
		}
	}
	_evenementRessourceKiosqueLiensApresMessage(
		aEstExercice,
		aActivite,
		aParams,
	) {
		if (aEstExercice) {
			this._evenementSurFenetreRessourceKiosqueLiensTAF(aActivite, aParams);
		} else {
			this._evenementSurFenetreRessourceKiosqueLiensDocumentJoint(
				aActivite,
				aParams,
			);
		}
	}
	_evenementSurFenetreRessourceKiosqueLiensDocumentJoint(aActivite, aParams) {
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() > 0
		) {
			for (let i = 0; i < aParams.selection.count(); i++) {
				const lElement = aParams.selection.get(i);
				if (!!lElement) {
					const lRessource = lElement.ressource ? lElement.ressource : lElement;
					const lLienKiosque = new ObjetElement_1.ObjetElement(
						lRessource.getLibelle(),
						null,
						Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque,
					);
					lLienKiosque.ressource = lRessource;
					lLienKiosque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					if (
						!UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ(
							lLienKiosque,
							aActivite.documents,
						)
					) {
						this.donnees.listePJTot.addElement(lLienKiosque);
						aActivite.documents.addElement(lLienKiosque);
						aActivite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				}
			}
		}
	}
	_evenementSurFenetreRessourceKiosqueLiensTAF(aActivite, aParams) {
		this.listeRessourceKiosque = aParams.liste;
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() === 1
		) {
			const lElement = aParams.selection.getPremierElement();
			const lRessource = lElement.ressource ? lElement.ressource : lElement;
			aActivite.ressourceDataLien = lRessource;
			aActivite.ressourceDataLien.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			aActivite.executionQCM = undefined;
			aActivite.genreRendu =
				TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque;
			aActivite.titreKiosque = lRessource.getLibelle();
			this.editeur.setDonnees("");
			this.editeur.setActif(false);
			aActivite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.verifierElevesConcernes(aActivite);
		}
	}
	_getOptionsComboMatiere() {
		return {
			getContenuElement: function (aParams) {
				const T = [
					'<div style="display:flex; align-items:center; height:20px; padding:1px 0;">',
				];
				if (aParams.element.couleur) {
					T.push(
						'<div style="height:',
						aParams.element.cumul > 1 ? "6px;" : "100%;",
						"min-width:6px; margin-right: 3px; " +
							ObjetStyle_1.GStyle.composeCouleurFond(aParams.element.couleur),
						aParams.element.cumul > 1
							? "border-radius:6px;"
							: "border-radius:6px 0 0 6px;",
						'"></div>',
						"<div ie-ellipsis-fixe>",
						aParams.element.getLibelle(),
						"</div>",
					);
				} else {
					T.push(aParams.element.getLibelle());
				}
				T.push("</div>");
				return T.join("");
			},
			getClassElement: function (aParams) {
				return aParams.element && aParams.element.cumul > 0
					? "element-indentation"
					: "";
			},
			getEstElementNonSelectionnable: function (aElement) {
				return !!aElement.autreMatiere;
			},
		};
	}
	_verifierActiviteValide(aActivite) {
		return UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.verifierActiviteValide(
			aActivite,
		);
	}
	_composeDate(aGenre) {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone">',
			'<div class="InlineBlock AlignementMilieuVertical Texte12">',
			aGenre === TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
				? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.PourLe")
				: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ActiviteDu"),
			"&nbsp;</div>",
			'<div class="InlineBlock AlignementMilieuVertical" id="',
			this.selecDate.getNom(),
			'" ie-node="getNodeSelecDate"></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	_composeMatiere() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone">',
			'<div class="Texte12">',
			ObjetTraduction_1.GTraductions.getValeur("Matiere"),
			"</div>",
			'<div><ie-combo ie-model="comboMatiere" aria-label = "',
			ObjetTraduction_1.GTraductions.getValeur("Matiere"),
			'"></ie-combo></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	_composeExerciceNumerique() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone FAct_QCM" ie-display="exerciceEstVisible">',
			'<div class="FAct_QCMTitre Texte12">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ExerciceNumerique",
			),
			"</div>",
			'<div class="FAct_QCMConteneur like-input" ie-class="getClassExerciceNumerique"><div class="FAct_QCMContenu" ie-html="getExerciceNumerique" ie-node="selectExerciceNumerique"></div></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	_composeQCM() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone FAct_QCM" ie-display="qcmEstVisible">',
			'<div class="FAct_QCMTitre Texte12"><div>',
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.QCM"),
			'</div><div class="FAct_QCMModalites Texte10" ie-node="modalitesExec" ie-class="getClassModalites">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ModalitesExecutionQCM",
			),
			"</div></div>",
			(0, tag_1.tag)("ie-btnselecteur", {
				"ie-model": "btnSelectQCM",
				class: ["bs-icone-left"],
				placeholder: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.enligne.choisirQcm",
				),
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.enligne.choisirQcm",
				),
			}),
			"</div>",
		);
		return lHTML.join("");
	}
	_composeConsigne() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone FAct_Editeur" id="',
			this.editeur.getNom(),
			'" ie-node="getNodeEditeur" ie-display="editeurEstVisible"></div>',
		);
		return lHTML.join("");
	}
	_composeDocuments() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone FAct_Documents" ie-display="editeurEstVisible">',
			'<div class="FAct_DocTitre">',
			'<div class="FAct_DocBouton"><ie-bouton ie-icon="icon_piece_jointe" id="',
			GUID_1.GUID.getId(),
			'" ie-model="btnAjouterDocuments" class="btn-flat-minimal ',
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.RessourcesPedagogiques",
			),
			"</ie-bouton></div>",
			"</div>",
			'<div class="FAct_DocContent" ie-html="getHtmlPJ"></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	_composeClasseMN() {
		const lHTML = [];
		lHTML.push(
			'<div class="FAct_Zone FAct_Classes" ie-if="existeClasseMN">',
			'<div class="InlineBlock AlignementMilieuVertical Texte12">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.Rattachement.ClasseGroupe",
			),
			"&nbsp;</div>",
			'<div class="FAct_ClassesConteneur like-input avec-chips"><div class="FAct_ClassesContenu" ie-html="getClassesMN" ie-node="selectClasses"></div></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	_composeElevesConcernees() {
		const lHTML = [];
		lHTML.push(
			IE.jsx.str(
				"div",
				{ class: "FAct_Zone FAct_Classes", "ie-if": "existeEleves" },
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical Texte12" },
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.TAF.Eleves"),
					"\u00A0",
				),
				IE.jsx.str(
					"div",
					{ class: "FAct_ClassesConteneur like-input avec-chips" },
					IE.jsx.str("div", {
						class: "FAct_ClassesContenu",
						"ie-html": "getEleves",
						"ie-node": "selectEleves",
					}),
				),
			),
		);
		return lHTML.join("");
	}
	_composeARendreEnLigne() {
		const lHTML = [];
		if (
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estGenreValable(
				TypeGenreRenduTAF_1.TypeGenreRenduTAF
					.GRTAF_RenduPronoteEnregistrementAudio,
			)
		) {
			lHTML.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "FAct_Zone" },
						IE.jsx.str(
							"div",
							{ class: "AlignementMilieuVertical Texte12" },
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.ModeRendu",
							),
						),
						IE.jsx.str("ie-combo", {
							"ie-model": "comboRendu",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.ModeRendu",
							),
						}),
					),
					IE.jsx.str("div", { "ie-html": "getDetailFait" }),
				),
			);
		} else {
			lHTML.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "FAct_Zone" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "chbRendreEnLigne" },
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.RenduNumerique",
							),
						),
					),
					IE.jsx.str("div", { "ie-html": "getDetailFait" }),
				),
			);
		}
		return lHTML.join("");
	}
	_getTitreFenetreActivite(aGenreActivite, aEstCreation) {
		return UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.getTitreFenetreActivite(
			aGenreActivite,
			aEstCreation,
		);
	}
}
exports.ObjetFenetre_Activite = ObjetFenetre_Activite;
(function (ObjetFenetre_Activite) {
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["annuler"] = 0)] = "annuler";
		genreAction[(genreAction["valider"] = 1)] = "valider";
		genreAction[(genreAction["supprimer"] = 2)] = "supprimer";
		genreAction[(genreAction["detailFait"] = 3)] = "detailFait";
	})(
		(genreAction =
			ObjetFenetre_Activite.genreAction ||
			(ObjetFenetre_Activite.genreAction = {})),
	);
})(
	ObjetFenetre_Activite ||
		(exports.ObjetFenetre_Activite = ObjetFenetre_Activite = {}),
);

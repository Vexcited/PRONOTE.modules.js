const { TypeDroits } = require("ObjetDroitsPN.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Identite } = require("ObjetIdentite.js");
const { Requetes } = require("CollectionRequetes.js");
const { ModuleEditeurHtml } = require("ModuleEditeurHtml.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { TypeGenreTravailAFaire } = require("TypeGenreTravailAFaire.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	ObjetFenetre_PanierRessourceKiosque,
} = require("ObjetFenetre_PanierRessourceKiosque.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { ObjetRequeteListeQCMCumuls } = require("ObjetRequeteListeQCMCumuls.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const {
	TypeGenreRenduTAF,
	TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { UtilitaireActiviteTAFPP } = require("UtilitaireActiviteTAFPP.js");
const {
	ObjetFenetre_ManuelsNumeriques,
} = require("ObjetFenetre_ManuelsNumeriques.js");
const {
	EGenreActivite_Tvx,
	EGenreActivite_Tvx_Util,
} = require("Enumere_Activites_Tvx.js");
const { tag } = require("tag.js");
const { ObjetFenetre_SelectionQCM } = require("ObjetFenetre_SelectionQCM.js");
class ObjetFenetre_Activite extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.optionsActivite = {
			genre: EGenreActivite_Tvx.ga_Act_Consigne,
			date: GDate.aujourdhui,
			nonModifiable: false,
		};
	}
	setOptionsActivite(aOptions) {
		$.extend(this.optionsActivite, aOptions);
	}
	construireInstances() {
		this.editeur = Identite.creerInstance(ModuleEditeurHtml, { pere: this });
		this.editeur.setParametres({
			surChange: function (aValeur) {
				if (
					this.donnees &&
					this.donnees.activite &&
					!GChaine.estChaineHTMLEgal(aValeur, this.donnees.activite.consigne)
				) {
					this.donnees.activite.consigne = aValeur;
					this.donnees.activite.setEtat(EGenreEtat.Modification);
				}
				this.$refreshSelf();
			}.bind(this),
		});
		this.selecDate = Identite.creerInstance(ObjetCelluleDate, {
			pere: this,
			evenement: function (aDate) {
				if (
					this.donnees &&
					this.donnees.activite &&
					!GDate.estDateEgale(this.donnees.activite.DateDebut, aDate)
				) {
					if (
						this.donnees.activite.getGenre() ===
							TypeGenreTravailAFaire.tGTAF_Travail &&
						GDate.estJourCourant(aDate)
					) {
						GApplication.getMessage()
							.afficher({
								type: EGenreBoiteMessage.Information,
								message: GTraductions.getValeur(
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
							TypeGenreTravailAFaire.tGTAF_Travail
						) {
							const lRessource = this.donnees.activite.classeMN
								? this.donnees.activite.classeMN
								: this.donnees.activite.classes &&
										this.donnees.activite.classes.count()
									? this.donnees.activite.classes.get(0)
									: null;
							if (lRessource) {
								Requetes("ListeElevesPourLesRessourcesALaDate", this)
									.lancerRequete({ ressource: lRessource, date: aDate })
									.then((aJSON) => {
										UtilitaireActiviteTAFPP.miseAJourInfosEleves(
											this.donnees.activite,
											aJSON.eleves,
										);
										this.listeEleves =
											UtilitaireActiviteTAFPP.getListeElevePourSelection(
												this.donnees.activite,
											);
									});
							}
						}
						if (!!this.donnees.activite.executionQCM) {
							const lObjInitDateQCM =
								UtilitaireActiviteTAFPP.initHeureDebutEtFin(
									this.donnees.activite,
								);
							this.donnees.activite.executionQCM.dateFinPublication =
								lObjInitDateQCM.dateFin;
							this.donnees.activite.executionQCM.setEtat(
								EGenreEtat.Modification,
							);
							if (
								this.donnees.activite.executionQCM.dateDebutPublication >
								this.donnees.activite.executionQCM.dateFinPublication
							) {
								this.donnees.activite.executionQCM.dateDebutPublication =
									lObjInitDateQCM.dateDebut;
							}
						}
						this.donnees.activite.setEtat(EGenreEtat.Modification);
					}
				}
			},
		});
		this.selecDate.setOptionsObjetCelluleDate({
			largeurComposant: 140,
			formatDate: "%JJJ %JJ/%MM/%AAAA",
		});
	}
	estVisuConsigne() {
		return EGenreActivite_Tvx_Util.estUneConsigne(this.optionsActivite.genre);
	}
	estVisuQCM() {
		return EGenreActivite_Tvx_Util.estUnQCM(this.optionsActivite.genre);
	}
	estVisuExerciceInteractif() {
		return EGenreActivite_Tvx_Util.estUnExerciceNumerique(
			this.optionsActivite.genre,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboMatiere: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie(
						Object.assign(
							{ longueur: "100%" },
							_getOptionsComboMatiere.call(aInstance),
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
					if (lIndice < 0 || !MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element &&
						aInstance.donnees.activite &&
						(!aInstance.donnees.activite.matiere ||
							aInstance.donnees.activite.matiere.getNumero() !==
								aParametres.element.getNumero())
					) {
						aInstance.donnees.activite.matiere = aParametres.element;
						aInstance.donnees.activite.setEtat(EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return GApplication.droits.get(TypeDroits.estEnConsultation);
				},
			},
			btnAjouterDocuments: {
				event() {
					UtilitaireActiviteTAFPP.ouvrirFenetreChoixRessourcePeda({
						instance: aInstance,
						activite: aInstance.donnees.activite,
						nodeFocus: this.node,
						listePJTot: aInstance.donnees.listePJTot,
						listeFichiersCrees: aInstance.donnees.listeFichiersCrees,
						tailleMaxPJ: GApplication.droits.get(
							TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
						),
						callbackAjoutLienKiosque: GEtatUtilisateur.avecRessourcesGranulaire
							? () => {
									_ouvrirPJKiosque.call(aInstance);
								}
							: null,
					});
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
					strLabel: GTraductions.getValeur("CahierDeTexte.Consigne"),
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
						: GDate.demain;
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
						TypeGenreTravailAFaire.tGTAF_Activite
						? GDate.aujourdhui
						: GDate.demain;
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
							'<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
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
				$(this.node).on({ click: _eventAjouterExerciceNum.bind(aInstance) });
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
				$(this.node).on({ click: _eventAjouterQCM.bind(aInstance) });
			},
			btnSelectQCM: {
				event: _eventAjouterQCM.bind(aInstance),
				getLibelle: function () {
					const H = [];
					if (
						this.donnees &&
						this.donnees.activite &&
						this.donnees.activite.executionQCM
					) {
						H.push(
							tag(
								"span",
								{ class: [] },
								this.donnees.activite.executionQCM.QCM.getLibelle(),
							),
						);
					}
					return H.join("");
				}.bind(aInstance),
				getIcone() {
					return tag("i", { class: "icon_qcm" });
				},
				getDisabled: function () {
					return (
						this.donnees &&
						this.donnees.activite &&
						this.donnees.activite.executionQCM &&
						(this.donnees.activite.executionQCM.estVerrouille ||
							!this.donnees.estCreation)
					);
				}.bind(aInstance),
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
					click: _eventParametresExecutionQCM.bind(aInstance),
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
							lDoc.setEtat(EGenreEtat.Suppression);
							aInstance.donnees.activite.setEtat(EGenreEtat.Modification);
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
						UtilitaireActiviteTAFPP.surCmdSupprimerActivite({
							activite: aInstance.donnees.activite,
							clbck: function () {
								this.surValidation(ObjetFenetre_Activite.genreAction.supprimer);
							}.bind(aInstance),
						});
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
						UtilitaireUrl.construireListeUrls(
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
						const lStrTAFRendus = GTraductions.getValeur(
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
							GTraductions.getValeur("CahierDeTexte.TAF.FaitPar"),
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
				$(this.node).on({ click: _ouvrirFenetreDetailFait.bind(aInstance) });
			},
			getClassesMN: function () {
				return _composeInfoClasses.call(aInstance);
			},
			existeClasseMN: function () {
				return (
					aInstance.donnees &&
					aInstance.donnees.activite &&
					aInstance.donnees.activite.classeMN
				);
			},
			selectClasses: function () {
				$(this.node).on({
					click: _ouvrirFenetreSelectionClasseGroupe.bind(aInstance),
				});
			},
			chipsClasse: {
				eventBtn: function (aNumeroClasse, aEvent) {
					aEvent.stopPropagation();
					_supprimerClasseMN.call(aInstance, aNumeroClasse);
				},
			},
			getEleves: function () {
				return _composeInfoEleves.call(aInstance);
			},
			existeEleves: function () {
				return aInstance.donnees && aInstance.donnees.activite;
			},
			selectEleves: function () {
				$(this.node).on({
					click: _ouvrirFenetreSelectionEleves.bind(aInstance),
				});
			},
			chipsEleve: {
				eventBtn: function (aNumero, aGenre, aEvent) {
					aEvent.stopPropagation();
					_supprimerEleves.call(aInstance, aNumero, aGenre);
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
						return !_verifierActiviteValide.call(
							aInstance,
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
					aInstance.setOptionsObjetSaisie(
						Object.assign(
							{ longueur: "100%" },
							_getOptionsComboRendu.call(aInstance),
						),
					);
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						if (!aInstance.listeRendu) {
							aInstance.listeRendu = TypeGenreRenduTAFUtil.toListe([
								TypeGenreRenduTAF.GRTAF_RenduPapier,
								TypeGenreRenduTAF.GRTAF_RenduKiosque,
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
					if (lIndice < 0 || !MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element &&
						aInstance.donnees.activite &&
						aInstance.donnees.activite.genreRendu !==
							aParametres.element.getGenre()
					) {
						aInstance.donnees.activite.genreRendu =
							aParametres.element.getGenre();
						aInstance.donnees.activite.setEtat(EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						EGenreActivite_Tvx_Util.estUnQCM(aInstance.optionsActivite.genre) ||
						EGenreActivite_Tvx_Util.estUnExerciceNumerique(
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
							EGenreActivite_Tvx_Util.estUnQCM(
								aInstance.optionsActivite.genre,
							) ||
							EGenreActivite_Tvx_Util.estUnExerciceNumerique(
								aInstance.optionsActivite.genre,
							);
						if (!lResult) {
							lResult =
								aInstance.donnees.activite.genreRendu ===
								TypeGenreRenduTAF.GRTAF_RenduPronote;
						}
					}
					return lResult;
				},
				setValue: function (aValue) {
					if (aInstance.donnees && aInstance.donnees.activite) {
						aInstance.donnees.activite.genreRendu = aValue
							? TypeGenreRenduTAF.GRTAF_RenduPronote
							: TypeGenreRenduTAF.GRTAF_AucunRendu;
						aInstance.donnees.activite.setEtat(EGenreEtat.Modification);
						if (aValue) {
							aInstance.verifierElevesConcernes(aInstance.donnees.activite);
						}
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees ||
						!aInstance.donnees.activite ||
						EGenreActivite_Tvx_Util.estUnQCM(aInstance.optionsActivite.genre) ||
						EGenreActivite_Tvx_Util.estUnExerciceNumerique(
							aInstance.optionsActivite.genre,
						)
					);
				},
			},
		});
	}
	verifierElevesConcernes(aActivite, aArrayClasses) {
		UtilitaireActiviteTAFPP.verifierElevesConcernes(
			aActivite,
			aArrayClasses,
			this.donnees.estCreation,
		);
	}
	composeContenu() {
		return EGenreActivite_Tvx_Util.estUneActivite(this.optionsActivite.genre)
			? this.composeContenuActivite()
			: EGenreActivite_Tvx_Util.estUnTAF(this.optionsActivite.genre)
				? this.composeContenuTravail()
				: "";
	}
	composeContenuActiviteTvx(aGenreTravailAFaire) {
		const lHTML = [];
		lHTML.push('<div class="FenetreActivite">');
		lHTML.push(_composeDate.call(this, aGenreTravailAFaire));
		lHTML.push(_composeMatiere.call(this));
		lHTML.push(_composeQCM.call(this));
		lHTML.push(_composeExerciceNumerique.call(this));
		lHTML.push(_composeConsigne.call(this));
		lHTML.push(_composeDocuments.call(this));
		lHTML.push(
			aGenreTravailAFaire === TypeGenreTravailAFaire.tGTAF_Activite
				? _composeClasseMN.call(this)
				: _composeElevesConcernees.call(this),
		);
		lHTML.push(_composeARendreEnLigne.call(this));
		lHTML.push("</div>");
		return lHTML.join("");
	}
	composeContenuActivite() {
		return this.composeContenuActiviteTvx(
			TypeGenreTravailAFaire.tGTAF_Activite,
		);
	}
	composeContenuTravail() {
		return this.composeContenuActiviteTvx(TypeGenreTravailAFaire.tGTAF_Travail);
	}
	composeBas() {
		const lHTML = [];
		lHTML.push('<div class="fact_boutons_bas" ie-display="boutonsVisible">');
		lHTML.push(
			'<ie-bouton ie-icon="icon_trash" ie-model="btnSupprimer" class="btn-flat-minimal ',
			TypeThemeBouton.secondaire,
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
		this.donnees.listeFichiersCrees = new ObjetListeElements();
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
			this.listeEleves = UtilitaireActiviteTAFPP.getListeElevePourSelection(
				this.donnees.activite,
			);
		}
		let lPremierDate =
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.getGenre() === TypeGenreTravailAFaire.tGTAF_Activite
				? GDate.aujourdhui
				: GDate.demain;
		if (
			this.donnees &&
			this.donnees.activite &&
			this.donnees.activite.DateDebut &&
			GDate.estAvantJourCourant(this.donnees.activite.DateDebut)
		) {
			lPremierDate = this.donnees.activite.DateDebut;
		}
		this.selecDate.setPremiereDateSaisissable(lPremierDate, true);
		if (
			aDonnees.estCreation &&
			!this.optionsActivite.nonModifiable &&
			EGenreActivite_Tvx_Util.estUnQCM(this.optionsActivite.genre)
		) {
			_ajouterQCM.call(this);
		} else if (
			aDonnees.estCreation &&
			!this.optionsActivite.nonModifiable &&
			EGenreActivite_Tvx_Util.estUnExerciceNumerique(this.optionsActivite.genre)
		) {
			_ajouterExerciceNum.call(this);
		}
		this.afficher();
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
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
				titre:
					aParams.titre ||
					_getTitreFenetreActivite(aParams.genre, aParams.estCreation),
				listeBoutons: [
					{
						libelle: GTraductions.getValeur("Annuler"),
						theme: TypeThemeBouton.secondaire,
						action: ObjetFenetre_Activite.genreAction.annuler,
					},
					{
						libelle: GTraductions.getValeur("Valider"),
						valider: true,
						theme: TypeThemeBouton.primaire,
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
				aParams.listeDocumentsJoints || new ObjetListeElements(),
			ressource: aParams.ressource,
			estCreation: !!aParams.estCreation,
		});
	}
}
ObjetFenetre_Activite.genreAction = {
	annuler: 0,
	valider: 1,
	supprimer: 2,
	detailFait: 3,
};
function _getOptionsComboRendu() {
	return {};
}
function _eventParametresExecutionQCM(aNode) {
	if (
		this.donnees &&
		this.donnees.activite &&
		this.donnees.activite.executionQCM
	) {
		_parametresExecutionQCM.call(this, aNode);
	}
}
function _parametresExecutionQCM(aNode) {
	UtilitaireActiviteTAFPP.ouvrirModalitesExecQCMDActivite({
		activite: this.donnees.activite,
		clbck: function () {
			GHtml.setFocus(aNode, true);
		},
	});
}
function _supprimerClasseMN(aNumeroClasse) {
	if (this.donnees && this.donnees.activite) {
		const lNbrClasses = this.donnees.activite.classes.count();
		if (lNbrClasses > 1) {
			const lClasses = this.donnees.activite.classes.getListeElements(
				(aElement) => {
					return !aElement.egalParNumeroEtGenre(
						aNumeroClasse,
						EGenreRessource.Classe,
					);
				},
			);
			this.donnees.activite.classes = lClasses;
			this.donnees.activite.setEtat(EGenreEtat.Modification);
			this.verifierElevesConcernes(this.donnees.activite);
		} else {
			_ouvrirFenetreSelectionClasseGroupe.call(this);
		}
	}
}
function _ouvrirFenetreDetailFait() {
	if (this.donnees) {
		this.callback.appel(ObjetFenetre_Activite.genreAction.detailFait, {
			article: this.donnees.activite,
		});
	}
}
function _ouvrirFenetreSelectionClasseGroupe() {
	if (this.donnees && this.donnees.activite && this.donnees.activite.classeMN) {
		UtilitaireActiviteTAFPP.ouvrirFenetreSelectionClasseGpe({
			activite: this.donnees.activite,
			clbck: this.verifierElevesConcernes.bind(this),
		});
	}
}
function _composeInfoClasses() {
	const H = [];
	if (this.donnees && this.donnees.activite) {
		const lNbrClasses = this.donnees.activite.classes.count();
		for (let iClasse = 0; iClasse < lNbrClasses; iClasse++) {
			const lClasse = this.donnees.activite.classes.get(iClasse);
			if (lClasse.existe()) {
				let lModel = "";
				if (lNbrClasses > 1) {
					lModel = GHtml.composeAttr("ie-model", "chipsClasse", [
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
function _composeInfoEleves() {
	const H = [];
	if (this.donnees && this.donnees.activite) {
		H.push(
			composeDetailsElevesSelectionnes.call(
				this,
				this.donnees.activite,
				this.listeEleves,
			),
		);
	}
	return H.join("");
}
function composeDetailsElevesSelectionnes(aActivite, aListeEleves) {
	const lResult = [];
	const lListeElementAAfficher =
		UtilitaireActiviteTAFPP.recupererElementsElevesSelectionnesPourChips(
			aActivite,
			aListeEleves,
		);
	const lNbrAAfficher = lListeElementAAfficher.count();
	for (let i = 0; i < lListeElementAAfficher.count(); i++) {
		const lElmChip = lListeElementAAfficher.get(i);
		let lModel = "";
		if (lNbrAAfficher > 1 && !lElmChip.sansSuppression) {
			lModel = GHtml.composeAttr("ie-model", "chipsEleve", [
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
function _supprimerEleves(aNumero, aGenre) {
	let lUniquement1ChipVisible = false;
	const lNbrClasses = this.donnees.activite.classes.count();
	if (
		(this.donnees.activite.pourTous && lNbrClasses === 1) ||
		this.donnees.activite.eleves.count() === 1
	) {
		lUniquement1ChipVisible = true;
	}
	if (lUniquement1ChipVisible) {
		_ouvrirFenetreSelectionEleves.call(this);
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
			_miseAJourEleveDActivite.call(this);
		} else {
		}
	}
}
function _miseAJourEleveDActivite() {
	let lElevesPotentielDesClasses =
		UtilitaireActiviteTAFPP.miseAJourClassesConcerneesDepuisListeEleves({
			article: this.donnees.activite,
			ressourceMN: this.donnees.activite.classeMN,
			listeEleves: this.listeEleves,
			tenirComptePourTous: false,
		});
	UtilitaireActiviteTAFPP.miseAJourElevesConcernes({
		listeEleves: this.listeEleves,
		article: this.donnees.activite,
		elevesPotentielDesClasses: lElevesPotentielDesClasses,
	});
}
function _ouvrirFenetreSelectionEleves() {
	if (
		this.donnees &&
		this.donnees.activite &&
		this.donnees.activite.elevesPotentiel
	) {
		UtilitaireActiviteTAFPP.ouvrirFenetreSelectionEleves({
			listeEleves: this.listeEleves,
			clbckSurValider: _miseAJourEleveDActivite.bind(this),
			clbckSurAnnuler: function () {
				this.listeEleves = UtilitaireActiviteTAFPP.getListeElevePourSelection(
					this.donnees.activite,
				);
			}.bind(this),
		});
	}
}
function _eventAjouterQCM() {
	if (
		this.donnees &&
		this.donnees.activite &&
		(!this.donnees.activite.executionQCM ||
			!this.donnees.activite.executionQCM.estVerrouille) &&
		!this.optionsActivite.nonModifiable
	) {
		_ajouterQCM.call(this);
	}
}
function _ajouterQCM() {
	new ObjetRequeteListeQCMCumuls(this)
		.lancerRequete(null)
		.then((aTabParams) => {
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SelectionQCM, {
				pere: this,
				evenement: function (aNumeroBouton, aEltQCM) {
					if (aNumeroBouton === 1 && aEltQCM.existeNumero()) {
						if (
							!this.donnees.activite.executionQCM ||
							this.donnees.activite.executionQCM.QCM.getNumero() !==
								aEltQCM.getNumero()
						) {
							if (aEltQCM.getGenre() === EGenreRessource.QCM) {
								UtilitaireActiviteTAFPP.associerQCMAActivite({
									activite: this.donnees.activite,
									eltQCM: aEltQCM,
								});
								this.editeur.setDonnees("");
								this.editeur.setActif(false);
							}
							this.donnees.activite.ressourceDataLien = undefined;
							this.donnees.activite.setEtat(EGenreEtat.Modification);
							this.verifierElevesConcernes(this.donnees.activite);
						}
					}
				},
				initialiser: function (aInstance) {
					UtilitaireActiviteTAFPP.initFenetreSelectionQCM(aInstance);
				},
			}).setDonnees(aTabParams[0], aTabParams[1], aTabParams[2]);
		});
}
function _eventAjouterExerciceNum() {
	if (
		this.donnees &&
		this.donnees.activite &&
		!this.optionsActivite.nonModifiable
	) {
		_ajouterExerciceNum.call(this);
	}
}
function _ajouterExerciceNum() {
	const lGenresApi = new TypeEnsembleNombre();
	lGenresApi.add(TypeGenreApiKiosque.Api_RenduPJTAF);
	if (!this.modeAncien) {
		ObjetFenetre_ManuelsNumeriques.ouvrir({
			instance: this,
			callback: _evenementSurFenetreRessourceKiosqueLiens.bind(
				this,
				true,
				this.donnees.activite,
			),
			genresApiKiosque: lGenresApi,
		});
	} else {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PanierRessourceKiosque,
			{
				pere: this,
				evenement: _evenementSurFenetreRessourceKiosqueLiensTAF.bind(
					this,
					this.donnees.activite,
				),
			},
		);
		lFenetre.afficherFenetre(lGenresApi);
	}
}
function _ouvrirPJKiosque() {
	const lGenresApi = new TypeEnsembleNombre();
	lGenresApi.add(TypeGenreApiKiosque.Api_AjoutPanier);
	if (!this.modeAncien) {
		ObjetFenetre_ManuelsNumeriques.ouvrir({
			instance: this,
			callback: _evenementSurFenetreRessourceKiosqueLiens.bind(
				this,
				false,
				this.donnees.activite,
			),
			genresApiKiosque: lGenresApi,
		});
	} else {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PanierRessourceKiosque,
			{
				pere: this,
				evenement: _evenementSurFenetreRessourceKiosqueLiensDocumentJoint.bind(
					this,
					this.donnees.activite,
				),
			},
		);
		lFenetre.setOptions({ avecMultiSelection: true });
		lGenresApi.add(TypeGenreApiKiosque.Api_RenduPJTAF);
		lFenetre.afficherFenetre();
	}
}
function _evenementSurFenetreRessourceKiosqueLiens(
	aEstExercice,
	aActivite,
	aParams,
) {
	if (aParams.genreBouton === 1) {
		if (
			aEstExercice &&
			aParams.selection.count() === 1 &&
			this.donnees.estCreation
		) {
			const lElement = aParams.selection.getPremierElement();
			if (
				this.estVisuExerciceInteractif() &&
				!lElement.apiSupport.contains(TypeGenreApiKiosque.Api_RenduPJTAF)
			) {
				GApplication.getMessage()
					.afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: GTraductions.getValeur(
							"CahierDeTexte.messageExerciceVersConsigne",
						),
					})
					.then((aGenreAction) => {
						if (aGenreAction === EGenreAction.Valider) {
							this.optionsActivite.genre =
								EGenreActivite_Tvx_Util.getConsigneDeGenreTravailAFaire(
									aActivite.getGenre(),
								);
							this.setOptionsFenetre({
								titre: _getTitreFenetreActivite(
									this.optionsActivite.genre,
									this.donnees.estCreation,
								),
							});
							_evenementRessourceKiosqueLiensApresMessage.call(
								this,
								false,
								aActivite,
								aParams,
							);
						}
					});
			} else {
				_evenementRessourceKiosqueLiensApresMessage.call(
					this,
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
				lElement.apiSupport.contains(TypeGenreApiKiosque.Api_RenduPJTAF)
			) {
				GApplication.getMessage()
					.afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: GTraductions.getValeur(
							"CahierDeTexte.messageConsigneVersExercice",
						),
					})
					.then((aGenreAction) => {
						if (aGenreAction === EGenreAction.Valider) {
							this.optionsActivite.genre =
								EGenreActivite_Tvx_Util.getExerciceDeGenreTravailAFaire(
									aActivite.getGenre(),
								);
							aActivite.documents.parcourir((aElement) => {
								aElement.setEtat(EGenreEtat.Suppression);
							});
							this.setOptionsFenetre({
								titre: _getTitreFenetreActivite(
									this.optionsActivite.genre,
									this.donnees.estCreation,
								),
							});
							_evenementRessourceKiosqueLiensApresMessage.call(
								this,
								true,
								aActivite,
								aParams,
							);
						}
					});
			} else {
				_evenementRessourceKiosqueLiensApresMessage.call(
					this,
					false,
					aActivite,
					aParams,
				);
			}
		} else {
			_evenementRessourceKiosqueLiensApresMessage.call(
				this,
				aEstExercice,
				aActivite,
				aParams,
			);
		}
	} else {
		_evenementRessourceKiosqueLiensApresMessage.call(
			this,
			aEstExercice,
			aActivite,
			aParams,
		);
	}
}
function _evenementRessourceKiosqueLiensApresMessage(
	aEstExercice,
	aActivite,
	aParams,
) {
	if (aEstExercice) {
		_evenementSurFenetreRessourceKiosqueLiensTAF.call(this, aActivite, aParams);
	} else {
		_evenementSurFenetreRessourceKiosqueLiensDocumentJoint.call(
			this,
			aActivite,
			aParams,
		);
	}
}
function _evenementSurFenetreRessourceKiosqueLiensDocumentJoint(
	aActivite,
	aParams,
) {
	if (
		aParams.genreBouton === 1 &&
		!!aParams.selection &&
		aParams.selection.count() > 0
	) {
		for (let i = 0; i < aParams.selection.count(); i++) {
			const lElement = aParams.selection.get(i);
			if (!!lElement) {
				const lRessource = lElement.ressource ? lElement.ressource : lElement;
				const lLienKiosque = new ObjetElement(
					lRessource.getLibelle(),
					null,
					EGenreDocumentJoint.LienKiosque,
				);
				lLienKiosque.ressource = lRessource;
				lLienKiosque.setEtat(EGenreEtat.Creation);
				if (
					!UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ(
						lLienKiosque,
						aActivite.documents,
					)
				) {
					this.donnees.listePJTot.addElement(lLienKiosque);
					aActivite.documents.addElement(lLienKiosque);
					aActivite.setEtat(EGenreEtat.Modification);
				}
			}
		}
	}
}
function _evenementSurFenetreRessourceKiosqueLiensTAF(aActivite, aParams) {
	this.listeRessourceKiosque = aParams.liste;
	if (
		aParams.genreBouton === 1 &&
		!!aParams.selection &&
		aParams.selection.count() === 1
	) {
		const lElement = aParams.selection.getPremierElement();
		const lRessource = lElement.ressource ? lElement.ressource : lElement;
		aActivite.ressourceDataLien = lRessource;
		aActivite.ressourceDataLien.setEtat(EGenreEtat.Modification);
		aActivite.executionQCM = undefined;
		aActivite.genreRendu = TypeGenreRenduTAF.GRTAF_RenduKiosque;
		aActivite.titreKiosque = lRessource.getLibelle();
		this.editeur.setDonnees("");
		this.editeur.setActif(false);
		aActivite.setEtat(EGenreEtat.Modification);
		this.verifierElevesConcernes(aActivite);
	}
}
function _getOptionsComboMatiere() {
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
						GStyle.composeCouleurFond(aParams.element.couleur),
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
function _verifierActiviteValide(aActivite) {
	return UtilitaireActiviteTAFPP.verifierActiviteValide(aActivite);
}
function _composeDate(aGenre) {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone">',
		'<div class="InlineBlock AlignementMilieuVertical Texte12">',
		aGenre === TypeGenreTravailAFaire.tGTAF_Travail
			? GTraductions.getValeur("CahierDeTexte.PourLe")
			: GTraductions.getValeur("CahierDeTexte.ActiviteDu"),
		"&nbsp;</div>",
		'<div class="InlineBlock AlignementMilieuVertical" id="',
		this.selecDate.getNom(),
		'" ie-node="getNodeSelecDate"></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeMatiere() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone">',
		'<div class="Texte12">',
		GTraductions.getValeur("Matiere"),
		"</div>",
		'<div><ie-combo ie-model="comboMatiere"></ie-combo></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeExerciceNumerique() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_QCM" ie-display="exerciceEstVisible">',
		'<div class="FAct_QCMTitre Texte12">',
		GTraductions.getValeur("CahierDeTexte.ExerciceNumerique"),
		"</div>",
		'<div class="FAct_QCMConteneur like-input" ie-class="getClassExerciceNumerique"><div class="FAct_QCMContenu" ie-html="getExerciceNumerique" ie-node="selectExerciceNumerique"></div></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeQCM() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_QCM" ie-display="qcmEstVisible">',
		'<div class="FAct_QCMTitre Texte12"><div>',
		GTraductions.getValeur("CahierDeTexte.QCM"),
		'</div><div class="FAct_QCMModalites Texte10" ie-node="modalitesExec" ie-class="getClassModalites">',
		GTraductions.getValeur("CahierDeTexte.ModalitesExecutionQCM"),
		"</div></div>",
		tag("ie-btnselecteur", {
			"ie-model": "btnSelectQCM",
			class: ["bs-icone-left"],
			placeholder: GTraductions.getValeur("CahierDeTexte.enligne.choisirQcm"),
		}),
		"</div>",
	);
	return lHTML.join("");
}
function _composeConsigne() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_Editeur" id="',
		this.editeur.getNom(),
		'" ie-node="getNodeEditeur" ie-display="editeurEstVisible"></div>',
	);
	return lHTML.join("");
}
function _composeDocuments() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_Documents" ie-display="editeurEstVisible">',
		'<div class="FAct_DocTitre">',
		'<div class="FAct_DocBouton"><ie-bouton ie-icon="icon_piece_jointe" id="',
		GUID.getId(),
		'" ie-model="btnAjouterDocuments" class="btn-flat-minimal ',
		TypeThemeBouton.secondaire,
		'">',
		GTraductions.getValeur("CahierDeTexte.RessourcesPedagogiques"),
		"</ie-bouton></div>",
		"</div>",
		'<div class="FAct_DocContent" ie-html="getHtmlPJ"></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeClasseMN() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_Classes" ie-if="existeClasseMN">',
		'<div class="InlineBlock AlignementMilieuVertical Texte12">',
		GTraductions.getValeur("CahierDeTexte.Rattachement.ClasseGroupe"),
		"&nbsp;</div>",
		'<div class="FAct_ClassesConteneur like-input avec-chips"><div class="FAct_ClassesContenu" ie-html="getClassesMN" ie-node="selectClasses"></div></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeElevesConcernees() {
	const lHTML = [];
	lHTML.push(
		'<div class="FAct_Zone FAct_Classes" ie-if="existeEleves">',
		'<div class="InlineBlock AlignementMilieuVertical Texte12">',
		GTraductions.getValeur("CahierDeTexte.TAF.Eleves"),
		"&nbsp;</div>",
		'<div class="FAct_ClassesConteneur like-input avec-chips"><div class="FAct_ClassesContenu" ie-html="getEleves" ie-node="selectEleves"></div></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeARendreEnLigne() {
	const lHTML = [];
	if (
		TypeGenreRenduTAFUtil.estGenreValable(
			TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio,
		)
	) {
		lHTML.push(
			'<div class="FAct_Zone">',
			'<div class="AlignementMilieuVertical Texte12">',
			GTraductions.getValeur("CahierDeTexte.ModeRendu"),
			"</div>",
			'<ie-combo ie-model="comboRendu"></ie-combo></div>',
			'<div ie-html="getDetailFait"></div>',
		);
	} else {
		lHTML.push(
			'<div class="FAct_Zone"><ie-checkbox ie-model="chbRendreEnLigne">',
			GTraductions.getValeur("CahierDeTexte.TAFARendre.Eleve.RenduNumerique"),
			"</ie-checkbox></div>",
			'<div ie-html="getDetailFait"></div>',
		);
	}
	return lHTML.join("");
}
function _getTitreFenetreActivite(aGenreActivite, aEstCreation) {
	return UtilitaireActiviteTAFPP.getTitreFenetreActivite(
		aGenreActivite,
		aEstCreation,
	);
}
module.exports = { ObjetFenetre_Activite };

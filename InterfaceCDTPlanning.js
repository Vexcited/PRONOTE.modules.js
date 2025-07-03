exports.InterfaceCDTPlanning = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePage_1 = require("InterfacePage");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetListe_1 = require("ObjetListe");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const DonneesListe_CDTPlanning_1 = require("DonneesListe_CDTPlanning");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteSaisieCahierDeTextes_1 = require("ObjetRequeteSaisieCahierDeTextes");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequetePageSaisieCahierDeTextes_1 = require("ObjetRequetePageSaisieCahierDeTextes");
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDT_2 = require("GestionnaireBlocCDT");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_ListeTAFFaits_2 = require("ObjetFenetre_ListeTAFFaits");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetFenetre_PostIt_1 = require("ObjetFenetre_PostIt");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetFenetre_ChoixDossierCopieCDT_1 = require("ObjetFenetre_ChoixDossierCopieCDT");
const ObjetFenetre_Saisie_CDTPlanning_1 = require("ObjetFenetre_Saisie_CDTPlanning");
const ObjetFenetre_ElementsProgramme_1 = require("ObjetFenetre_ElementsProgramme");
const ObjetFenetre_DevoirSurTable_1 = require("ObjetFenetre_DevoirSurTable");
const Enumere_Message_1 = require("Enumere_Message");
class ObjetRequeteListeMatieresPublicsCDTPlanning extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"ListeMatieresPublicsCDTPlanning",
	ObjetRequeteListeMatieresPublicsCDTPlanning,
);
class ObjetRequeteCDTPlanning extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire("CDTPlanning", ObjetRequeteCDTPlanning);
class InterfaceCDTPlanning extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
		this.avecGestionNotation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.donnees = {
			listeMatieres: new ObjetListeElements_1.ObjetListeElements(),
			listeRessources: new ObjetListeElements_1.ObjetListeElements(),
			listeCategories: null,
			palierElementTravailleSelectionne: null,
			element_copie: null,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboMatiere: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 400,
						largeurListe: 600,
						labelWAICellule:
							ObjetTraduction_1.GTraductions.getTabValeurs("Message")[
								Enumere_Message_1.EGenreMessage.SelectionMatiere
							],
						getContenuElement: function (aParams) {
							return IE.jsx.str(
								"div",
								{ style: "display:flex; align-items:center;" },
								IE.jsx.str(
									"div",
									{
										style: "width:20rem;flex:none; padding-right:2rem;",
										"ie-ellipsis": true,
									},
									aParams.element.getLibelle(),
								),
								IE.jsx.str(
									"div",
									{
										style: "width:20rem; flex:none; padding-right:2rem;",
										"ie-ellipsis": true,
									},
									aParams.element.strPublic,
								),
								IE.jsx.str(
									"div",
									{ style: " padding-right:2rem;", "ie-ellipsis-fixe": true },
									aParams.element.strProfs,
								),
							);
						},
						getClassElement: function (aParams) {
							return aParams.element.estUneMatiereDuProf
								? "element-distinct"
								: "";
						},
						getContenuCellule: (aElement) => {
							const lLibelle =
								aElement.getLibelle() +
								" - " +
								aElement.strPublic +
								" - " +
								aElement.strProfs;
							return lLibelle;
						},
					});
				},
				getDonnees: function () {
					return aInstance.donnees.listeMatieres;
				},
				getIndiceSelection: function (aCombo) {
					let lIndice = 0;
					const lElementSelectionne =
						aInstance.etatUtilisateur.Navigation.selectionCDTPlanning;
					aCombo.getListeElements().parcourir((aElement, aIndice) => {
						if (!lElementSelectionne && aElement.estUneMatiereDuProf) {
							lIndice = aIndice;
							return false;
						}
						if (
							lElementSelectionne &&
							aElement.getNumero() === lElementSelectionne.getNumero() &&
							aElement.strProfs === lElementSelectionne.strProfs
						) {
							lIndice = aIndice;
							return false;
						}
					});
					return lIndice;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance.donnees.listeRessources = aParametres.element
							? aParametres.element.listeRessources
							: new ObjetListeElements_1.ObjetListeElements();
						aInstance._selectionMatiere(aParametres.element);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees.listeMatieres ||
						aInstance.donnees.listeMatieres.count() === 0
					);
				},
			},
		});
	}
	evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM:
				this.surExecutionQCMContenu(aParam.event, aElement, aParam);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFARendre },
					aElement,
				);
				break;
			default:
				break;
		}
	}
	_evenementFenetreTAFARendre(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_2.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(this.paramFicheCDT);
		}
	}
	_actionSurRequeteFicheCDT(aGenreAffichageCDT, aCahierDeTextes) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageCDT,
				gestionnaire: GestionnaireBlocCDT_2.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this.evenementSurBlocCDT.bind(this) },
		);
	}
	surExecutionQCMContenu(aEvent, aElement, aParam) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		const lExecQCM =
			aParam && !!aParam.estQCM ? aElement : aElement.executionQCM;
		this.evenementFicheCdt({ executionQCM: lExecQCM });
	}
	evenementFicheCdt(aParam) {
		if (aParam) {
			UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
				this.getInstance(this.identFenetreVisuQCM),
				aParam.executionQCM,
			);
			if (aParam.surModifTAFARendre) {
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete(this.paramFicheCDT);
			}
		}
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			function _evenementSurDernierMenuDeroulant() {
				ObjetHtml_1.GHtml.setDisplay(
					this.getNomInstance(this.identCalendrier),
					false,
				);
				new ObjetRequeteListeMatieresPublicsCDTPlanning(this)
					.lancerRequete({
						ressource: this.etatUtilisateur.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
					})
					.then((aJSON) => {
						this.afficherBandeau(true);
						if (aJSON.listeMatieres) {
							this.donnees.listeMatieres = aJSON.listeMatieres;
						}
						this.$refreshSelf();
						if (
							!this.donnees.listeMatieres ||
							this.donnees.listeMatieres.count() === 0
						) {
							this._selectionMatiere(null);
						}
					});
			},
			(aInstance) => {
				aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Classe]);
			},
		);
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			function (ASelection, aDomaine) {
				this.etatUtilisateur.setDomaineSelectionne(aDomaine);
				this._requeteCDTPlanning();
			},
			(AInstance) => {
				UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(AInstance, {
					avecMultiSelection: true,
					avecMultiSemainesContinues: true,
				});
				AInstance.setFrequences(GParametres.frequences, true);
			},
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe,
			this._initListe,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
		this.IdPremierElement = this.getInstance(
			this.identTripleCombo,
		).getPremierElement();
	}
	setParametresGeneraux() {
		this.AddSurZone = [
			this.identTripleCombo,
			{
				html: IE.jsx.str(
					"div",
					null,
					IE.jsx.str("ie-combo", { "ie-model": "comboMatiere" }),
				),
			},
		];
		this.IdentZoneAlClient = this.identListe;
	}
	recupererDonnees() {
		ObjetHtml_1.GHtml.setDisplay(
			this.getNomInstance(this.identCalendrier),
			false,
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="InterfaceCDTPlanning">',
			'<div id="',
			this.getNomInstance(this.identCalendrier),
			'"></div>',
			'<div id="',
			this.getNomInstance(this.identListe),
			'" class="cdtplanning_liste"></div>',
			"</div>",
		);
		return H.join("");
	}
	_collerCDT(aArticle) {
		this._getDetailsSaisieCDTPromise(aArticle).then(() => {
			const lDate =
				aArticle.saisieCDT.dateCoursSuivantTAF ||
				aArticle.saisieCDT.DateTravailAFaire;
			if (this.donnees.element_copie.estCDT) {
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.collerCDT(
					aArticle.cdt,
					this.donnees.element_copie.element,
					true,
					lDate,
				);
			} else if (this.donnees.element_copie.estContenu) {
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.collerContenu(
					aArticle.cdt,
					this.donnees.element_copie.element,
					aArticle.contenu,
				);
			} else if (this.donnees.element_copie.estPgm) {
				aArticle.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aArticle.cdt.listeElementsProgrammeCDT =
					this.donnees.element_copie.element;
				aArticle.cdt.listeElementsProgrammeCDT.avecSaisie = true;
				aArticle.cdt.listeElementsProgrammeCDT.setSerialisateurJSON({
					ignorerEtatsElements: true,
				});
			} else if (this.donnees.element_copie.estTAF) {
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.collerTAF(
					aArticle.cdt,
					this.donnees.element_copie.element,
					lDate,
					aArticle.taf,
				);
			} else {
				return;
			}
			this._requeteSaisieCDT(aArticle);
		});
	}
	_suppressionElement(aParams) {
		let lMessage;
		let lFuncSupp;
		switch (aParams.idColonne) {
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
				.categories:
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.contenu:
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.themes:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.msgConfirmationSupprimerContenu",
				);
				lFuncSupp = function () {
					aParams.article.contenu.setEtat(
						Enumere_Etat_1.EGenreEtat.Suppression,
					);
				};
				break;
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.eltProg:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ConfirmerSuppressionEltPgm",
				);
				lFuncSupp = function () {
					aParams.article.cdt.listeElementsProgrammeCDT.avecSaisie = true;
				};
				break;
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.taf:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.msgConfirmationSupprimerTAF",
				);
				lFuncSupp = function () {
					aParams.article.taf.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				};
				break;
			default:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.msgConfirmationSupprimerCDT",
				);
				lFuncSupp = function () {
					aParams.article.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				};
		}
		return this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: lMessage,
			})
			.then((aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					aParams.article.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					if (lFuncSupp) {
						lFuncSupp();
					}
					this._requeteSaisieCDT(aParams.article);
				}
			});
	}
	_getOptionsDonneesListe() {
		return {
			donnees: this.donnees,
			dsEval: (aParams) => {
				this._commandeCreerDevoirOuEval(
					aParams.article,
					aParams.estDS
						? Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
						: Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation,
					aParams.contenu,
				);
			},
			affectationProg: (aParams) => {
				this._getDetailsSaisieCDTPromise(aParams.article).then(() => {
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.affecterProgressionAuCdT({
						instance: this,
						avecTAFVisible: true,
						paramsAutorisationCreationTAF: {
							ajoutNouveauTAFInterdit:
								aParams.article.saisieCDT.ajoutNouveauTAFInterdit,
							messageSurNouveauTAF:
								aParams.article.saisieCDT.messageSurNouveauTAF,
						},
						cours: aParams.article.cours,
						numeroSemaine: aParams.article.cours.numeroSemaine,
						cdt: aParams.article.cdt,
						JoursPresenceCours: aParams.article.saisieCDT.JoursPresenceCours,
						dateTAFMin: aParams.article.saisieCDT.DateCoursDeb,
						dateTAF: new Date(
							(
								aParams.article.saisieCDT.dateCoursSuivantTAF ||
								aParams.article.saisieCDT.DateTravailAFaire
							).getTime(),
						),
						listeCategories: this.donnees.listeCategories,
						strPublics: aParams.article.cours.strPublic,
						strMatiere: aParams.article.cours.strMatiere,
						callbackAffectation: (aParamsAffectation) => {
							aParamsAffectation.listeNewContenus.parcourir((aContenu) => {
								aParams.article.cdt.listeContenus.addElement(aContenu);
							});
							aParamsAffectation.listeNewTAFs.parcourir((aTAF) => {
								aParams.article.cdt.ListeTravailAFaire.addElement(aTAF);
							});
							aParams.article.cdt.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							this._requeteSaisieCDT(aParams.article);
						},
					});
				});
			},
			ajoutQCMTaf: async (aParams) => {
				this._getDetailsSaisieCDTPromise(aParams.article).then(async () => {
					const lAutoriserAjoutTAF =
						await UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.autoriserCreationTAF(
							aParams.article.saisieCDT,
						);
					if (lAutoriserAjoutTAF) {
						UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirQCM({
							instance: this,
						}).then((aParamQCM) => {
							if (aParamQCM.eltQCM) {
								const lTAF =
									UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.creerTAFAvecQCM({
										qcm: aParamQCM.eltQCM,
										dateCreationTAF:
											aParams.article.saisieCDT.dateCoursSuivantTAF ||
											aParams.article.saisieCDT.DateTravailAFaire,
										dateFinCours: aParams.article.saisieCDT.DateCoursFin,
										listeTousEleves:
											UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.getListeToutLesEleves(
												aParams.article.saisieCDT.listeClassesEleves,
											),
									});
								aParams.article.cdt.ListeTravailAFaire.addElement(lTAF);
								aParams.article.cdt.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								this._requeteSaisieCDT(aParams.article);
							}
						});
					}
				});
			},
			suppression: this._suppressionElement.bind(this),
			modificationContenu: (aParams, aSurAjout) => {
				if (
					aParams.idColonne ===
					DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.eltProg
				) {
					this._ouvrirFenetreElementsProgramme(aParams.article);
				} else {
					this._surEditionContenu(
						aParams.article,
						aParams.idColonne ===
							DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.taf,
						aSurAjout,
					);
				}
			},
			coller: (aParams) => {
				if (
					(this.donnees.element_copie.estCDT &&
						!aParams.article.cdt.estCDTVide) ||
					(this.donnees.element_copie.estContenu &&
						!aParams.article.contenu.estVide) ||
					(this.donnees.element_copie.estPgm &&
						aParams.article.cdt.listeElementsProgrammeCDT &&
						aParams.article.cdt.listeElementsProgrammeCDT.count() > 0) ||
					(this.donnees.element_copie.estTAF &&
						aParams.article.taf &&
						!aParams.article.taf.estVide)
				) {
					this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: this.donnees.element_copie.estCDT
								? ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.ConfirmerCollerCahierSurExistant",
									)
								: this.donnees.element_copie.estContenu
									? ObjetTraduction_1.GTraductions.getValeur(
											"InterfaceCDTPlanning.ConfirmerRemplacerContenuExistant",
										)
									: this.donnees.element_copie.estPgm
										? ObjetTraduction_1.GTraductions.getValeur(
												"InterfaceCDTPlanning.ConfirmerRemplacerEltPgmExistant",
											)
										: this.donnees.element_copie.estTAF
											? ObjetTraduction_1.GTraductions.getValeur(
													"InterfaceCDTPlanning.ConfirmerRemplacerAFaireExistant",
												)
											: "",
						})
						.then((aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this._collerCDT(aParams.article);
							}
						});
				} else {
					this._collerCDT(aParams.article);
				}
			},
			ajouterElementsCDT: (aParams) => {
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_ChoixDossierCopieCDT_1.ObjetFenetre_ChoixDossierCopieCDT,
					{ pere: this },
				).afficherChoixDossierCopieCDT(
					aParams.article.cours,
					aParams.article.cdt,
				);
			},
			continuerProgression: (aParams) => {
				this._getDetailsSaisieCDTPromise(aParams.article).then(() => {
					if (!aParams.article.saisieCDT.contenuProgressionSuivant) {
						return;
					}
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.poursuivreProgression({
						instance: this,
						cdt: aParams.article.cdt,
						elementAvecProgression:
							aParams.article.saisieCDT.contenuProgressionSuivant,
						dateTAF: new Date(
							(
								aParams.article.saisieCDT.dateCoursSuivantTAF ||
								aParams.article.saisieCDT.DateTravailAFaire
							).getTime(),
						),
						listeCategories: this.donnees.listeCategories,
						callbackAffectation: (aParamsAffectation) => {
							if (aParamsAffectation.listeNewContenus.count() > 0) {
								aParamsAffectation.listeNewContenus.parcourir((aContenu) => {
									aParams.article.cdt.listeContenus.addElement(aContenu);
								});
								aParams.article.cdt.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								this._requeteSaisieCDT(aParams.article);
							}
						},
					});
				});
			},
			ficheCDT: (aArticle) => {
				this.paramFicheCDT = {
					pourCDT: false,
					pourTAF: true,
					cours: aArticle.cours,
					numeroSemaine: aArticle.cours.numeroSemaine,
				};
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					(aGenreAffichageCDT, aCahierDeTextes) => {
						UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
							this,
							{
								cahiersDeTextes: aCahierDeTextes,
								genreAffichage: aGenreAffichageCDT,
								gestionnaire: GestionnaireBlocCDT_2.GestionnaireBlocCDT,
							},
							{ evenementSurBlocCDT: this.evenementSurBlocCDT.bind(this) },
						);
					},
				).lancerRequete(this.paramFicheCDT);
			},
			publier: (aParams, aPublier) => {
				if (aPublier) {
					this._ouvrirFenetreDatePublicationCDT(aParams.article);
				} else {
					this._publierCDT(aParams.article, null);
				}
			},
		};
	}
	_selectionMatiere(aMatiere) {
		this.etatUtilisateur.Navigation.selectionCDTPlanning = aMatiere;
		const lCalendrier = this.getInstance(this.identCalendrier);
		ObjetHtml_1.GHtml.setDisplay(lCalendrier.getNom(), true);
		lCalendrier.setDomaine(this.etatUtilisateur.getDomaineSelectionne());
	}
	async _requeteCDTPlanning() {
		let lResponse = {
			listeCours: new ObjetListeElements_1.ObjetListeElements(),
		};
		if (
			this.donnees.listeRessources &&
			this.donnees.listeRessources.count() > 0
		) {
			lResponse = await new ObjetRequeteCDTPlanning(this).lancerRequete({
				ressource: this.etatUtilisateur.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
				listeRessources: this.donnees.listeRessources.setSerialisateurJSON({
					ignorerEtatsElements: true,
				}),
				domaine: this.etatUtilisateur.getDomaineSelectionne(),
				avecCategories: !this.donnees.listeCategories,
			});
		}
		this.afficherBandeau(true);
		if (lResponse.ListeCategories) {
			this.donnees.listeCategories =
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.getlisteCategoriesPourCombo(
					lResponse.ListeCategories,
				);
		}
		lResponse.listeCours.parcourir((aCours) => {
			aCours.estAnnule = !!aCours.annulation;
			if (aCours.cdt) {
				new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
					aCours.cdt,
				);
			} else {
				aCours.cdt =
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initCahierDeTextes();
				aCours.cdt.estCDTVide = true;
			}
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning(
				lResponse.listeCours,
				{ avecGestionNotation: this.avecGestionNotation },
			).setOptions(this._getOptionsDonneesListe()),
		);
	}
	_initListe(aInstance) {
		const lThis = this;
		const lColonnes = [
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.cours,
				taille: 200,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ColPlanningCours",
				),
				nonDeplacable: true,
				nonSupprimable: true,
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.absences,
				taille: 30,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningAbsences",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningAbsencesLong",
					),
					libelleParametrageColonne: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningAbsencesLong",
					),
				},
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.categories,
				taille: 120,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ColPlanningCategorie",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.themes,
				taille: 80,
				titre: ObjetTraduction_1.GTraductions.getValeur("Themes"),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.contenu,
				taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 500),
				titre: {
					libelleHtml: IE.jsx.str(
						IE.jsx.fragment,
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"InterfaceCDTPlanning.ColPlanningContenuDeLaSeance",
						),
						IE.jsx.str(
							"div",
							{ class: "cdtplanning_dl_cdt_titreContenu" },
							IE.jsx.str("ie-btnimage", {
								"ie-model": "btnTitreContenu",
								class: [
									"cdtplanning_dl_cdt_imageTitreContenu",
									ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri,
								],
								style: "width:18px;",
							}),
						),
					),
					controleur: {
						btnTitreContenu: {
							event: function () {
								lThis.applicationSco.parametresUtilisateur.set(
									"CDT.Planning.UniqTitre",
									!lThis.applicationSco.parametresUtilisateur.get(
										"CDT.Planning.UniqTitre",
									),
								);
								aInstance.actualiser(true);
							},
							getSelection: function () {
								return lThis.applicationSco.parametresUtilisateur.get(
									"CDT.Planning.UniqTitre",
								);
							},
							getTitle: function () {
								return lThis.applicationSco.parametresUtilisateur.get(
									"CDT.Planning.UniqTitre",
								)
									? ObjetTraduction_1.GTraductions.getValeur(
											"InterfaceCDTPlanning.IntegraliteContenus",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"InterfaceCDTPlanning.UniquementTitre",
										);
							},
						},
					},
					libelleParametrageColonne: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningContenuDeLaSeance",
					),
				},
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.commentaire,
				taille: ObjetListe_1.ObjetListe.initColonne(100, 150, 200),
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.postIt.commentairePrive.titre",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.eltProg,
				taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 500),
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ColPlanningEltsDuPgm",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.parcours,
				taille: 120,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ColPlanningParcoursEducatif",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.taf,
				taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 500),
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"InterfaceCDTPlanning.ColPlanningAFaireAutreSeance",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.noteProchaineSeance,
				taille: ObjetListe_1.ObjetListe.initColonne(100, 150, 200),
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.postIt.seanceSuivante.titre",
				),
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.visaI,
				taille: 30,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"InterfaceCDTPlanning.ColPlanningVisa",
						),
						avecFusionColonne: true,
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningVisaI",
					),
				],
				hint: [
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningHintVisaI",
					),
				],
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.visaC,
				taille: 30,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"InterfaceCDTPlanning.ColPlanningVisa",
						),
						avecFusionColonne: true,
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningVisaC",
					),
				],
				hint: [
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningHintVisaC",
					),
				],
			},
			{
				id: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.publie,
				taille: 30,
				titre: {
					getLibelleHtml: () => {
						return IE.jsx.str("i", {
							class: "icon_info_sondage_publier mix-icon_ok i-green",
							role: "presentation",
						});
					},
					libelleParametrageColonne: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningpublie",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceCDTPlanning.ColPlanningpublie",
					),
				},
			},
		];
		const lColonneCachees = [];
		if (
			!this.applicationSco.parametresUtilisateur.get(
				"CDT.ParcoursEducatifs.ActiverSaisie",
			)
		) {
			lColonneCachees.push(
				DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.parcours,
			);
		}
		if (
			!this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")
		) {
			lColonneCachees.push(
				DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.themes,
			);
		}
		if (
			!this.applicationSco.parametresUtilisateur.get(
				"CDT.Commentaire.ActiverSaisie",
			)
		) {
			lColonneCachees.push(
				DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.commentaire,
			);
			lColonneCachees.push(
				DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
					.noteProchaineSeance,
			);
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			gestionModificationColonnes: {
				getColonnes: () => {
					return this.applicationSco.parametresUtilisateur.get(
						"CDT.Planning.Cols",
					);
				},
				setColonnes: (aColonnes) => {
					this.applicationSco.parametresUtilisateur.set(
						"CDT.Planning.Cols",
						aColonnes,
					);
				},
			},
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.parametrer },
			],
			colonnesCachees: lColonneCachees,
		});
		this.etatUtilisateur.setTriListe({
			liste: aInstance,
			tri: DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.cours,
		});
	}
	_publierCDT(aArticle, aDatePublication) {
		aArticle.cdt.publie = !!aDatePublication;
		aArticle.cdt.datePublication = aDatePublication;
		aArticle.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		return this._requeteSaisieCDT(aArticle);
	}
	_ouvrirFenetreDatePublicationCDT(aArticle) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aGenreBouton, aDate) {
					if (aGenreBouton >= 0) {
						this._publierCDT(aArticle, aGenreBouton ? aDate : undefined);
					}
				},
			},
		);
		lFenetre.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			aArticle.cours.date,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			true,
		);
		lFenetre.setDonnees(aArticle.cdt.datePublication);
	}
	_evenementListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (this.fenetreCDT) {
					this.fenetreCDT.fermer();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParams.idColonne) {
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.categories:
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.parcours:
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.contenu:
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes.taf:
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.themes:
						this._surEditionContenu(
							aParams.article,
							aParams.idColonne ===
								DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
									.taf,
							false,
						);
						break;
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.publie:
						this._ouvrirFenetreDatePublicationCDT(aParams.article);
						break;
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.eltProg:
						this._ouvrirFenetreElementsProgramme(aParams.article);
						break;
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.commentaire:
					case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
						.noteProchaineSeance:
						this._ouvrirFenetreCommentaire(aParams);
						break;
					default:
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this._suppressionElement(aParams).then(() => {
					aParams.instance.focusSurPremierElement();
				});
				return true;
		}
	}
	_getDetailsSaisieCDTPromise(aArticle) {
		if (aArticle.saisieCDT) {
			return Promise.resolve(aArticle.saisieCDT);
		}
		return new ObjetRequetePageSaisieCahierDeTextes_1.ObjetRequetePageSaisieCahierDeTextes(
			this,
		)
			.lancerRequete({
				cours: aArticle.cours,
				numeroSemaine: aArticle.cours.numeroSemaine,
				avecCategories: false,
				avecCDT: false,
			})
			.then((aParams) => {
				aArticle.saisieCDT = aParams;
				return aParams;
			});
	}
	_surEditionContenu(aArticle, aPourTAF, aAjout) {
		return this._getDetailsSaisieCDTPromise(aArticle)
			.then(async () => {
				let lAutoriserEdition = true;
				if (aPourTAF) {
					if (aAjout || !aArticle.taf) {
						lAutoriserEdition =
							await UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.autoriserCreationTAF(
								aArticle.saisieCDT,
							);
					}
				}
				return lAutoriserEdition;
			})
			.then((aAutoriserEdition) => {
				if (!aAutoriserEdition) {
					return;
				}
				let lElement = null;
				if (!aAjout) {
					lElement = aPourTAF ? aArticle.taf : aArticle.contenu;
				}
				const lFenetreSaisieCDTPlanning =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_Saisie_CDTPlanning_1.ObjetFenetre_Saisie_CDTPlanning,
						{
							pere: this,
							evenement: (aNumeroBouton, aParams) => {
								if (aParams.avecSaisie) {
									aArticle.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
									this.donnees.listeCategories = aParams.listeCategories;
									this._requeteSaisieCDT(
										aArticle,
										aParams.element.listeFichiersFenetrePJ,
									);
								}
							},
						},
						{
							titre: ObjetChaine_1.GChaine.format("%s %s %s - %s", [
								ObjetDate_1.GDate.formatDate(
									aArticle.cours.date,
									"%JJJ %JJ/%MM",
								),
								ObjetTraduction_1.GTraductions.getValeur("A"),
								ObjetDate_1.GDate.formatDate(aArticle.cours.date, "%hh%sh%mm"),
								aArticle.cours.strPublic,
							]),
						},
					);
				lFenetreSaisieCDTPlanning.setDonnees({
					contenu: lElement,
					pourTAF: aPourTAF,
					cdt: aArticle.cdt,
					cours: aArticle.cours,
					ListeDocumentsJoints: aArticle.saisieCDT.ListeDocumentsJoints,
					listeCategories: this.donnees.listeCategories,
					verrouille: false,
					saisieCDT: aArticle.saisieCDT,
				});
			});
	}
	_ouvrirFenetreElementsProgramme(aArticle) {
		const lFenetreElementsProgramme =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ElementsProgramme_1.ObjetFenetre_ElementsProgramme,
				{
					pere: this,
					evenement: (aValider, aDonnees) => {
						aArticle.cours.cdt.listeElementsProgrammeCDT =
							aDonnees.listeElementsProgramme;
						this.donnees.palierElementTravailleSelectionne =
							aDonnees.palierActif;
						if (aValider) {
							aArticle.cours.cdt.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							this._requeteSaisieCDT(aArticle);
						}
					},
				},
			);
		lFenetreElementsProgramme.setDonnees({
			cours: aArticle.cours,
			numeroSemaine: aArticle.cours.numeroSemaine,
			listeElementsProgramme: aArticle.cours.cdt.listeElementsProgrammeCDT,
			palier: this.donnees.palierElementTravailleSelectionne,
		});
	}
	_restaurerSelectionListe(
		aTableauSelection,
		aContenuASelectionner,
		aTAfASelectionner,
	) {
		if (!aTableauSelection) {
			return;
		}
		this.getInstance(this.identListe).setTableauCellulesSelection(
			aTableauSelection,
			{
				avecScroll: true,
				funcRecherche: function (aArticle, aArticleRecherche) {
					let lResult =
						!!aArticle.cours &&
						!!aArticleRecherche.cours &&
						aArticle.cours.getNumero() ===
							aArticleRecherche.cours.getNumero() &&
						aArticle.cours.date.getTime() ===
							aArticleRecherche.cours.date.getTime();
					if (lResult) {
						if (aContenuASelectionner) {
							lResult =
								!!aArticle.contenu &&
								aContenuASelectionner.getNumero() ===
									aArticle.contenu.getNumero();
						} else if (aTAfASelectionner) {
							lResult =
								!!aArticle.taf &&
								aTAfASelectionner.getNumero() === aArticle.taf.getNumero();
						}
					}
					return lResult;
				},
			},
		);
	}
	async _requeteSaisieCDT(aArticle, aListeFichiersUpload) {
		if (!aArticle || !aArticle.cdt) {
			return;
		}
		this.donnees.element_copie = null;
		if (aArticle.cdt.listeContenus) {
			aArticle.cdt.listeContenus.parcourir((aContenu) => {
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.verifierContenu(aContenu);
			});
		}
		const lListeDocumentsJoints =
			(aArticle.saisieCDT ? aArticle.saisieCDT.ListeDocumentsJoints : null) ||
			new ObjetListeElements_1.ObjetListeElements();
		let lSelection = null;
		let lJSONRapportSaisie = null;
		const lReponse =
			await new ObjetRequeteSaisieCahierDeTextes_1.ObjetRequeteSaisieCahierDeTextes(
				this,
			)
				.addUpload({
					listeFichiers:
						aListeFichiersUpload ||
						new ObjetListeElements_1.ObjetListeElements(),
					listeDJCloud: lListeDocumentsJoints,
				})
				.lancerRequete(
					aArticle.cours.getNumero(),
					aArticle.cours.numeroSemaine,
					this.donnees.listeCategories,
					lListeDocumentsJoints,
					null,
					new ObjetListeElements_1.ObjetListeElements().addElement(
						aArticle.cdt,
					),
				);
		if (lReponse && lReponse.JSONRapportSaisie) {
			lJSONRapportSaisie = lReponse.JSONRapportSaisie;
		}
		lSelection = this.getInstance(
			this.identListe,
		).getTableauCellulesSelection();
		this.donnees.listeCategories = null;
		await this._requeteCDTPlanning();
		if (lSelection) {
			this._restaurerSelectionListe(
				lSelection,
				lJSONRapportSaisie ? lJSONRapportSaisie.contenu : null,
				lJSONRapportSaisie ? lJSONRapportSaisie.taf : null,
			);
		}
	}
	_rechercheArticleDansListe(aFiltre) {
		const lFiltre = Object.assign(
			{ cours: null, numeroSemaine: null, contenu: null },
			aFiltre,
		);
		const lListe = this.getInstance(this.identListe).getListeArticles();
		const lResult = { article: null, ligne: -1 };
		lListe.parcourir((aArticle, aIndice) => {
			if (
				lFiltre.cours.getNumero() === aArticle.cours.getNumero() &&
				lFiltre.numeroSemaine === aArticle.cours.numeroSemaine
			) {
				if (lFiltre.contenu) {
					if (
						aArticle.contenu &&
						lFiltre.contenu.getNumero() === aArticle.contenu.getNumero()
					) {
						lResult.article = aArticle;
						lResult.ligne = aIndice;
						return false;
					}
					if (
						lFiltre.contenu.estVide &&
						(!aArticle.contenu || aArticle.contenu.estVide)
					) {
						lResult.article = aArticle;
						lResult.ligne = aIndice;
						return false;
					}
				}
			}
		});
		return lResult;
	}
	_commandeCreerDevoirOuEval(aArticle, aGenreLienDS, aContenu) {
		const lContenu = aContenu
			? aContenu
			: UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.createContenu();
		const lFenetreDevoirSurTable =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_DevoirSurTable_1.ObjetFenetre_DevoirSurTable,
				{
					pere: this,
					evenement: (aValider, aParametres, aAvecLien) => {
						if (!aValider) {
							return;
						}
						if (lContenu.estVide) {
							let lCategorie = null;
							this.donnees.listeCategories.parcourir((D) => {
								if (aParametres.genreLienDS === D.genreLienDS) {
									lCategorie = D;
									return false;
								}
							});
							const lNewContenu =
								UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.createContenu();
							lNewContenu.Libelle = aParametres.contenu.getLibelle();
							lNewContenu.descriptif = aParametres.contenu.descriptif;
							lNewContenu.estVide = false;
							lNewContenu.categorie =
								MethodesObjet_1.MethodesObjet.dupliquer(lCategorie);
							lNewContenu.genreLienDS = aParametres.genreLienDS;
							if (aAvecLien) {
								lNewContenu.infosDS = $.extend({}, aParametres);
							}
							aArticle.cdt.listeContenus.addElement(lNewContenu);
							aArticle.cdt.publie = true;
							aArticle.cdt.datePublication =
								ObjetDate_1.GDate.getDateCourante();
							aArticle.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						} else {
							lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lContenu.Libelle = aParametres.contenu.getLibelle();
							lContenu.descriptif = aParametres.contenu.descriptif;
							lContenu.genreLienDS = aParametres.genreLienDS;
							if (aParametres.surModification_suppression) {
								lContenu.suppressionLien = true;
							} else if (aAvecLien) {
								lContenu.infosDS = $.extend({}, aParametres);
							}
							aArticle.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						this._requeteSaisieCDT(aArticle);
					},
				},
			);
		lFenetreDevoirSurTable.setDonnees({
			cours: aArticle.cours,
			numeroCycle: aArticle.cours.numeroSemaine,
			contenu: lContenu,
			genreLienDS: aGenreLienDS,
			callbackSaisieSalle: (aCours) => {
				const lSelection = this.getInstance(
					this.identListe,
				).getTableauCellulesSelection();
				this._requeteCDTPlanning().then(() => {
					lFenetreDevoirSurTable.fermer();
					const lResultRecherche = this._rechercheArticleDansListe({
						cours: aCours,
						numeroSemaine: aArticle.cours.numeroSemaine,
						contenu: aArticle.contenu,
					});
					if (lResultRecherche.article) {
						this._commandeCreerDevoirOuEval(
							lResultRecherche.article,
							aGenreLienDS,
							lResultRecherche.contenu,
						);
					}
					this._restaurerSelectionListe(lSelection, aArticle.contenu);
				});
			},
			paramsFenetreOrigine: null,
		});
	}
	_ouvrirFenetreCommentaire(aParams) {
		let lTitre = "";
		let lTexte = "";
		let lLabel = "";
		switch (aParams.idColonne) {
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
				.commentaire:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.postIt.commentairePrive.titre",
				);
				lTexte = aParams.article.cdt.commentairePrive;
				lLabel =
					ObjetTraduction_1.GTraductions.getValeur("Commentaire") +
					" (" +
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.postIt.commentairePrive.infoTitre",
					) +
					")";
				break;
			case DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
				.noteProchaineSeance:
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.postIt.seanceSuivante.titre",
				);
				lTexte = aParams.article.cdt.noteProchaineSeance;
				lLabel = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.postIt.seanceSuivante.label",
				);
				break;
		}
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PostIt_1.ObjetFenetre_PostIt,
			{
				pere: this,
				initialiser: (aInstanceFenetre) => {
					aInstanceFenetre.setOptionsFenetre({
						titre: lTitre,
						largeur: 600,
						hauteur: 400,
					});
				},
				evenement: (aTexte) => {
					if (
						aParams.idColonne ===
						DonneesListe_CDTPlanning_1.DonneesListe_CDTPlanning.colonnes
							.commentaire
					) {
						aParams.article.cdt.commentairePrive = aTexte;
					} else {
						aParams.article.cdt.noteProchaineSeance = aTexte;
					}
					aParams.article.cdt.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this._requeteSaisieCDT(aParams.article);
				},
			},
		).setDonnees({
			texte: lTexte,
			label: lLabel,
			taillePostIt: aParams.article.cours.taillePostIt,
		});
	}
}
exports.InterfaceCDTPlanning = InterfaceCDTPlanning;

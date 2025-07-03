exports.InterfaceBilanCompetencesParMatiere = void 0;
const InterfacePage_1 = require("InterfacePage");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListe_1 = require("ObjetListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetRequeteBilanCompetencesParMatiere_1 = require("ObjetRequeteBilanCompetencesParMatiere");
const DonneesListe_BilanCompetencesParMatiere_1 = require("DonneesListe_BilanCompetencesParMatiere");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieBilanCompetencesParMatiere_1 = require("ObjetRequeteSaisieBilanCompetencesParMatiere");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
class InterfaceBilanCompetencesParMatiere extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.ids = {
			pageMessage: GUID_1.GUID.getId(),
			pageDonnees: GUID_1.GUID.getId(),
		};
		this.donnees = {
			listePaliersEtMM: null,
			palierSelectionne: null,
			metaMatiereSelectionnee: null,
		};
		this.optionsAffichageListe = { afficheJaugeChronologique: false };
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementTripleCombo.bind(this),
			this._initialiserTripleCombo,
		);
		this.identListeCompetences = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this),
			this._initialiserListe,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({
			html: IE.jsx.str("ie-combo", {
				"ie-model": this.jsxComboModelPaliers.bind(this),
			}),
		});
		this.AddSurZone.push({
			html: IE.jsx.str("ie-combo", {
				"ie-model": this.jsxComboModelMetaMatieres.bind(this),
			}),
		});
	}
	jsxComboModelPaliers() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.listeSelectionPalier",
					),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					return this.donnees.listePaliersEtMM;
				}
			},
			getIndiceSelection: () => {
				let lIndicePalierSelectionne = 0;
				if (this.donnees.listePaliersEtMM && this.donnees.palierSelectionne) {
					lIndicePalierSelectionne =
						this.donnees.listePaliersEtMM.getIndiceParElement(
							this.donnees.palierSelectionne,
						);
				}
				return Math.max(lIndicePalierSelectionne, 0);
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle && aParams.element) {
					this.donnees.palierSelectionne = aParams.element;
					if (
						this.donnees.palierSelectionne.listeMM &&
						this.donnees.palierSelectionne.listeMM.count() > 0
					) {
						this.donnees.metaMatiereSelectionnee =
							this.donnees.palierSelectionne.listeMM.get(0);
					}
					this.lancerRequeteRecuperationDonnees();
				}
			},
		};
	}
	jsxComboModelMetaMatieres() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.ListeSelectionMatiere",
					),
				});
			},
			getDonnees: (aListe) => {
				if (this.donnees.palierSelectionne) {
					return this.donnees.palierSelectionne.listeMM;
				}
				return new ObjetListeElements_1.ObjetListeElements();
			},
			getIndiceSelection: () => {
				let lIndiceMMSelectionnee = 0;
				if (
					this.donnees.palierSelectionne &&
					this.donnees.palierSelectionne.listeMM &&
					this.donnees.metaMatiereSelectionnee
				) {
					lIndiceMMSelectionnee =
						this.donnees.palierSelectionne.listeMM.getIndiceParElement(
							this.donnees.metaMatiereSelectionnee,
						);
				}
				return Math.max(lIndiceMMSelectionnee, 0);
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle && aParams.element) {
					this.donnees.metaMatiereSelectionnee = aParams.element;
					this.lancerRequeteRecuperationDonnees();
				}
			},
		};
	}
	getClasseConcernee() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
	}
	getPeriodeConcernee() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
	}
	getEleveConcerne() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getPalierConcerne() {
		return this.donnees.palierSelectionne;
	}
	getMetaMatiereConcernee() {
		return this.donnees.metaMatiereSelectionnee;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "BilanCompetencesParMatiere interface_affV" },
				IE.jsx.str("div", { id: this.ids.pageMessage }),
				IE.jsx.str(
					"div",
					{
						id: this.ids.pageDonnees,
						class: "PageDonnees interface_affV_client p-all",
						style: "display:none;",
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeCompetences),
					}),
				),
			),
		);
		return H.join("");
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.lancerRequeteRecuperationDonnees();
	}
	lancerRequeteRecuperationDonnees() {
		const lParamsRecuperationDonnees = {
			classe: this.getClasseConcernee(),
			periode: this.getPeriodeConcernee(),
			eleve: this.getEleveConcerne(),
			palier: this.getPalierConcerne(),
			metaMatiere: this.getMetaMatiereConcernee(),
			avecRecuperationListePaliersMM: !this.donnees.listePaliersEtMM,
		};
		new ObjetRequeteBilanCompetencesParMatiere_1.ObjetRequeteBilanCompetencesParMatiere(
			this,
			this._actionSurRequeteBilanCompetences,
		).lancerRequete(lParamsRecuperationDonnees);
	}
	_actionSurRequeteBilanCompetences(aJSON) {
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageMessage, false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageDonnees, false);
		if (aJSON.listeCompetences) {
			this.afficherBandeau(true);
			ObjetHtml_1.GHtml.setDisplay(this.ids.pageDonnees, true);
			this._formatterDonneesListeCompetences(aJSON.listeCompetences);
			const lInstanceListe = this.getInstance(this.identListeCompetences);
			lInstanceListe.setOptionsListe({
				colonnes: this.getListeColonnes(aJSON.listeColonnesServices),
			});
			const lDonneesListe =
				new DonneesListe_BilanCompetencesParMatiere_1.DonneesListe_BilanCompetencesParMatiere(
					aJSON.listeCompetences,
				);
			lDonneesListe.setOptionsAffichage(this.optionsAffichageListe);
			lInstanceListe.setDonnees(lDonneesListe);
			if (!this.donnees.listePaliersEtMM) {
				this.donnees.listePaliersEtMM = aJSON.listePaliersEtMM;
				if (aJSON.listePaliersEtMM) {
					if (aJSON.palierSelectionne) {
						this.donnees.palierSelectionne =
							aJSON.listePaliersEtMM.getElementParNumero(
								aJSON.palierSelectionne.getNumero(),
							);
					}
					if (
						aJSON.metaMatiereSelectionnee &&
						this.donnees.palierSelectionne.listeMM
					) {
						this.donnees.metaMatiereSelectionnee =
							this.donnees.palierSelectionne.listeMM.getElementParNumero(
								aJSON.metaMatiereSelectionnee.getNumero(),
							);
					}
				}
			}
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
					this,
					this._getParametresPDF.bind(this),
				);
			}
		} else if (aJSON.message) {
			this.evenementAfficherMessage(aJSON.message);
		}
	}
	evenementAfficherMessage(aGenreMessage) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		this.afficherBandeau(false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageDonnees, false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageMessage, true);
		const lStrMessage =
			typeof aGenreMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage]
				: aGenreMessage;
		ObjetHtml_1.GHtml.setHtml(
			this.ids.pageMessage,
			this.composeMessage(lStrMessage),
		);
	}
	valider() {
		const lDonneesSaisies = {
			classe: this.getClasseConcernee(),
			periode: this.getPeriodeConcernee(),
			eleve: this.getEleveConcerne(),
			listeElementsCompetences: this.getInstance(
				this.identListeCompetences,
			).getListeArticles(),
		};
		new ObjetRequeteSaisieBilanCompetencesParMatiere_1.ObjetRequeteSaisieBilanCompetencesParMatiere(
			this,
			this.actionSurValidation,
		).lancerRequete(lDonneesSaisies);
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	_evenementTripleCombo() {
		this.donnees.listePaliersEtMM = null;
		this.afficherPage();
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			hauteurAdapteContenu: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	getListeColonnes(aListeServices) {
		const lGetLibelleHtmlTitreJauge = () => {
			const lJsxModeleBoutonBasculeJauge = () => {
				return {
					event: () => {
						this.optionsAffichageListe.afficheJaugeChronologique =
							!this.optionsAffichageListe.afficheJaugeChronologique;
						const lInstanceListe = this.getInstance(this.identListeCompetences);
						lInstanceListe
							.getDonneesListe()
							.setOptionsAffichage(this.optionsAffichageListe);
						lInstanceListe.actualiser(true);
					},
					getTitle: () => {
						return this.optionsAffichageListe.afficheJaugeChronologique
							? ObjetTraduction_1.GTraductions.getValeur(
									"BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"BulletinEtReleve.hintBtnAfficherJaugeChronologique",
								);
					},
				};
			};
			const lJsxGetClasseBoutonBasculeJauge = () => {
				if (this.optionsAffichageListe.afficheJaugeChronologique) {
					return UtilitaireCompetences_1.TUtilitaireCompetences
						.ClasseIconeJaugeChronologique;
				}
				return UtilitaireCompetences_1.TUtilitaireCompetences
					.ClasseIconeJaugeParNiveau;
			};
			const lTitreColonneJauge = [];
			lTitreColonneJauge.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": lJsxModeleBoutonBasculeJauge,
						"ie-class": lJsxGetClasseBoutonBasculeJauge,
						style: "width: 18px;",
					}),
					IE.jsx.str(
						"span",
						{ class: "fluid-bloc" },
						ObjetTraduction_1.GTraductions.getValeur(
							"BilanCompetencesParMM.colonnes.Jauge",
						),
					),
				),
			);
			return lTitreColonneJauge.join("");
		};
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_BilanCompetencesParMatiere_1
				.DonneesListe_BilanCompetencesParMatiere.colonnes.libelle,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BilanCompetencesParMM.colonnes.Items",
			),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_BilanCompetencesParMatiere_1
				.DonneesListe_BilanCompetencesParMatiere.colonnes.jauge,
			titre: {
				getLibelleHtml: () => {
					return lGetLibelleHtmlTitreJauge();
				},
			},
			taille: 300,
		});
		if (aListeServices) {
			aListeServices.parcourir((aService) => {
				const lSuperColonneService = {
					libelle: aService.getLibelle(),
					title: aService.hint || aService.getLibelle(),
				};
				lColonnes.push({
					id:
						DonneesListe_BilanCompetencesParMatiere_1
							.DonneesListe_BilanCompetencesParMatiere.colonnes
							.prefixe_jauge_service + aService.getNumero(),
					titre: [
						lSuperColonneService,
						{
							getLibelleHtml: () => {
								return lGetLibelleHtmlTitreJauge();
							},
						},
					],
					taille: 300,
					serviceConcerne: aService,
				});
				lColonnes.push({
					id:
						DonneesListe_BilanCompetencesParMatiere_1
							.DonneesListe_BilanCompetencesParMatiere.colonnes
							.prefixe_niveau_service + aService.getNumero(),
					titre: [
						{
							libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
						},
						{
							getLibelleHtml: () => {
								const lStrBtnCalculAuto = [];
								if (aService.avecCalculAuto) {
									const lJsxModeleBoutonCalculAuto = (aServiceConcerne) => {
										return {
											event: () => {
												this._surCalculAutoNiveauService(aServiceConcerne);
											},
											getTitle: () => {
												return ObjetTraduction_1.GTraductions.getValeur(
													"BilanCompetencesParMM.CalculAutoColonneService.hint",
												);
											},
										};
									};
									lStrBtnCalculAuto.push(
										IE.jsx.str("ie-btnicon", {
											"ie-model": lJsxModeleBoutonCalculAuto.bind(
												this,
												aService,
											),
											class: "icon_sigma color-neutre",
										}),
									);
								}
								const lLibelleColonneNiveau = [];
								lLibelleColonneNiveau.push(
									IE.jsx.str(
										"div",
										{ class: "flex-contain flex-center" },
										lStrBtnCalculAuto.join(""),
										IE.jsx.str(
											"span",
											{ style: "flex: 1 1 auto;" },
											ObjetTraduction_1.GTraductions.getValeur(
												"BilanCompetencesParMM.colonnes.Niveau",
											),
										),
									),
								);
								return lLibelleColonneNiveau.join("");
							},
						},
					],
					taille: 60,
					serviceConcerne: aService,
				});
			});
		}
		return lColonnes;
	}
	_evenementListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				if (
					aParametres.instance
						.getDonneesListe()
						.estUneColonneNiveauDeService(aParametres.idColonne)
				) {
					this._ouvrirMenuContextuelChoixNiveauDAcquisition(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
						this._modifierNiveauDeColonneService.bind(
							this,
							aParametres.declarationColonne.serviceConcerne,
						),
						false,
						true,
					);
				} else {
					let lElementLignePourJauge;
					if (
						aParametres.idColonne ===
						DonneesListe_BilanCompetencesParMatiere_1
							.DonneesListe_BilanCompetencesParMatiere.colonnes.jauge
					) {
						lElementLignePourJauge = aParametres.article;
					} else if (
						aParametres.instance
							.getDonneesListe()
							.estUneColonneJaugeDeService(aParametres.idColonne)
					) {
						lElementLignePourJauge =
							DonneesListe_BilanCompetencesParMatiere_1.DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
								aParametres.article,
								aParametres.declarationColonne.serviceConcerne.getNumero(),
							);
					}
					if (lElementLignePourJauge) {
						this.surClicJaugeEvaluations(lElementLignePourJauge);
					}
				}
				break;
			}
		}
	}
	_formatterDonneesListeCompetences(aListeCompetences) {
		if (aListeCompetences) {
			const lDerniersPeres = [];
			aListeCompetences.parcourir((D) => {
				let lNivDepl = D.niveauDeploiement;
				if (lNivDepl > 1) {
					const lPereNiveauPrecedent = lDerniersPeres[lNivDepl - 2];
					if (lPereNiveauPrecedent) {
						D.pere = lPereNiveauPrecedent;
						lPereNiveauPrecedent.estUnDeploiement = true;
						lPereNiveauPrecedent.estDeploye = true;
					}
				}
				lDerniersPeres[lNivDepl - 1] = D;
			});
		}
	}
	surClicJaugeEvaluations(aLigne) {
		if (aLigne.relationsESI && aLigne.relationsESI.length) {
			new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
				this,
				this._reponseRequeteDetailEvaluations.bind(this, aLigne),
			).lancerRequete({
				eleve: this.getEleveConcerne(),
				pilier: null,
				periode: this.getPeriodeConcernee(),
				numRelESI: aLigne.relationsESI,
			});
		}
	}
	_reponseRequeteDetailEvaluations(aLigne, aJSON) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			{
				pere: this,
				initialiser(aInstanceFenetre) {
					aInstanceFenetre.setOptionsFenetre({
						titre: "",
						largeur: 700,
						hauteur: 500,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
			},
		);
		lFenetre.setDonnees(aLigne, aJSON, {
			titreFenetre: this.getEleveConcerne().getLibelle(),
			libelleComplementaire: aLigne.getLibelle(),
		});
	}
	_ouvrirMenuContextuelChoixNiveauDAcquisition(
		aTypeGenreValidationCompetence,
		aMethodeModification,
		aAvecRaccourci,
		aAvecDispense,
		aTypePositionnement,
	) {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aInstance) => {
				UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
					{
						instance: this,
						menuContextuel: aInstance,
						avecLibelleRaccourci: aAvecRaccourci,
						avecDispense: aAvecDispense,
						genreChoixValidationCompetence: aTypeGenreValidationCompetence,
						genrePositionnement: aTypePositionnement,
						callbackNiveau: function (aNiveau) {
							aMethodeModification(aNiveau);
						},
					},
				);
			},
		});
	}
	_modifierNiveauDeColonneService(aServiceConcerne, aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListeCompetences);
		const lSelections = lListe.getTableauCellulesSelection();
		if (lSelections.length === 0) {
			return;
		}
		let lAvecModif = false;
		lSelections.forEach((aSelection) => {
			const lValeurColonneService =
				DonneesListe_BilanCompetencesParMatiere_1.DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
					aSelection.article,
					aServiceConcerne.getNumero(),
				);
			if (lValeurColonneService) {
				lValeurColonneService.niveauAcqui = aNiveau;
				lValeurColonneService.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aSelection.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecModif = true;
			}
		});
		if (lAvecModif) {
			this.setEtatSaisie(true);
			const lElementScroll = $(".BilanCompetencesParMatiere").parents();
			const lPremierParent = lElementScroll.get(0);
			const lValeurScrollTopActuel = $(lPremierParent).scrollTop();
			lListe.actualiser(true);
			$(lPremierParent).scrollTop(lValeurScrollTopActuel);
		}
	}
	_surCalculAutoNiveauService(aServiceConcerne) {
		let lAvecRemplacementValeurs = false;
		const lListe = this.getInstance(this.identListeCompetences);
		const lListeLigneCompetences = lListe.getListeArticles();
		const lFunctionExecutionCalculAuto = () => {
			let lAvecChangement = false;
			lListeLigneCompetences.parcourir((D) => {
				const lValeurColonneService =
					DonneesListe_BilanCompetencesParMatiere_1.DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
						D,
						aServiceConcerne.getNumero(),
					);
				if (
					lValeurColonneService &&
					lValeurColonneService.niveauAcquiEstEditable &&
					lValeurColonneService.niveauAcquiMoyenne
				) {
					if (
						lAvecRemplacementValeurs ||
						!lValeurColonneService.niveauAcqui ||
						lValeurColonneService.niveauAcqui.getGenre() <
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
					) {
						lValeurColonneService.niveauAcqui =
							lValeurColonneService.niveauAcquiMoyenne;
						lValeurColonneService.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lAvecChangement = true;
					}
				}
			});
			if (lAvecChangement) {
				this.setEtatSaisie(true);
				lListe.actualiser(true);
			}
		};
		const lJsxModeleCheckboxRemplacerExistants = () => {
			return {
				getValue: () => {
					return lAvecRemplacementValeurs;
				},
				setValue: (aValue) => {
					lAvecRemplacementValeurs = aValue;
				},
			};
		};
		const lMessage = [];
		lMessage.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				ObjetTraduction_1.GTraductions.getValeur(
					"BilanCompetencesParMM.CalculAutoColonneService.message",
				),
				IE.jsx.str("br", null),
				IE.jsx.str("br", null),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lJsxModeleCheckboxRemplacerExistants },
					ObjetTraduction_1.GTraductions.getValeur(
						"BilanCompetencesParMM.CalculAutoColonneService.remplacerExistants",
					),
				),
			),
		);
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BilanCompetencesParMM.CalculAutoColonneService.titre",
			),
			message: lMessage.join(""),
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					lFunctionExecutionCalculAuto.call(this);
				}
			},
		});
	}
	_getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.BilanCompetencesParMatiere,
			classe: this.getClasseConcernee(),
			periode: this.getPeriodeConcernee(),
			eleve: this.getEleveConcerne(),
			palier: this.getPalierConcerne(),
			metaMatiere: this.getMetaMatiereConcernee(),
			avecJaugeChronologique:
				!!this.optionsAffichageListe.afficheJaugeChronologique,
			avecCodeCompetences: this.etatUtilisateurSco.estAvecCodeCompetences(),
		};
	}
}
exports.InterfaceBilanCompetencesParMatiere =
	InterfaceBilanCompetencesParMatiere;

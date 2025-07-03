exports._InterfaceBilanParDomaine = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_BilanParDomaine_1 = require("DonneesListe_BilanParDomaine");
const DonneesListe_BilanParDomaineLVE_1 = require("DonneesListe_BilanParDomaineLVE");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetRequeteBilanParDomaine_1 = require("ObjetRequeteBilanParDomaine");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const GlossaireCompetences_1 = require("GlossaireCompetences");
class _InterfaceBilanParDomaine extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.donnees = {
			relationElevePilier: {
				libellePilierPalier: "",
				niveauDAcquisition: null,
				dateAcquisition: null,
				observations: "",
			},
			estDansLEtablissement: true,
			droitSaisie: false,
			listeCompetences: null,
			listeServicesLVE: null,
			estPalierDeNiveauEcole: false,
			estPalierDeNiveauCollege: false,
			legende: {
				contientAuMoinsUnElemGrilleMM: false,
				couleurGrilleMM: "blue",
			},
		};
		this.filtresListe = {
			listeEnsembleEvaluations: null,
			ensembleEvaluationsSelectionne: null,
			uniquementElementsEvalues: false,
		};
		this.ids = {
			pageMessage: this.Nom + "_message",
			pageListe: this.Nom + "_liste",
			entete: this.Nom + "_entete",
		};
		this.parametres = { heightPied: 80 };
	}
	construireInstances() {
		this.identListeBilanDomaine = this.add(
			ObjetListe_1.ObjetListe,
			this._surEvenementListeBilanDomaine,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			null,
			this._initFenetreDetailEvaluations,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListeBilanDomaine;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	jsxComboModelFiltreEnsembleEvaluations() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 170,
					hauteur: 16,
					hauteurLigneDefault: 16,
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.listeSelectionEvaluation",
					),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					return this.filtresListe.listeEnsembleEvaluations;
				}
			},
			getIndiceSelection: () => {
				let lIndice = 0;
				if (
					!!this.filtresListe.ensembleEvaluationsSelectionne &&
					!!this.filtresListe.listeEnsembleEvaluations &&
					this.filtresListe.listeEnsembleEvaluations.count() > 0
				) {
					lIndice =
						this.filtresListe.listeEnsembleEvaluations.getIndiceElementParFiltre(
							(D) => {
								return (
									D.valeurFiltre ===
									this.filtresListe.ensembleEvaluationsSelectionne.valeurFiltre
								);
							},
						);
				}
				return Math.max(lIndice, 0);
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					!!aParams.element &&
					!!this.filtresListe.ensembleEvaluationsSelectionne &&
					this.filtresListe.ensembleEvaluationsSelectionne.valeurFiltre !==
						aParams.element.valeurFiltre
				) {
					this.filtresListe.ensembleEvaluationsSelectionne = aParams.element;
					if (this.getEtatSaisie() === true) {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
							this.afficherPage.bind(this),
						);
					} else {
						this.afficherPage();
					}
				}
			},
		};
	}
	jsxModeleCheckboxFiltreElementsEvalues() {
		return {
			getValue: () => {
				return this.filtresListe.uniquementElementsEvalues;
			},
			setValue: (aValue) => {
				this.filtresListe.uniquementElementsEvalues =
					!this.filtresListe.uniquementElementsEvalues;
				if (this.getEtatSaisie() === true) {
					(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
						this.afficherPage.bind(this),
					);
				} else {
					this.afficherPage();
				}
			},
		};
	}
	jsxDisplayLegendeListe() {
		return this._avecAffichageLegendeListe();
	}
	jsxGetHtmlLegendeListe() {
		const H = [];
		H.push(
			UtilitaireCompetences_1.TUtilitaireCompetences.construitInfoActiviteLangagiere(
				{ avecLibelle: true },
			),
		);
		if (!!this.donnees.legende.contientAuMoinsUnElemGrilleMM) {
			H.push(" - ");
			H.push(
				'<i style="color: ',
				this.donnees.legende.couleurGrilleMM,
				';" class="icon_star" role="presentation"></i>',
			);
			H.push(
				'<span class="m-left">',
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.LegendeCompetenceGrilleMM",
				),
				"</span>",
			);
		}
		return H.join("");
	}
	jsxGetHtmlPied() {
		return this._composePiedNonEditable();
	}
	estPilierLVESelectionne() {
		const lPilierConcerne = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Pilier,
		);
		return !!lPilierConcerne && !!lPilierConcerne.estPilierLVE;
	}
	estAffichageListeLVE() {
		return (
			this.parametresSco.general.AvecGestionNiveauxCECRL &&
			this.estPilierLVESelectionne()
		);
	}
	getMrFichePourCalculAuto(aService) {
		let lMrFiche = null;
		if (this.donnees.estPalierDeNiveauCollege) {
			if (!aService || !aService.existeNumero()) {
				lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.MFicheAttributionNiveauCECRLDomaine1_2",
				);
			} else {
				lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.MFicheAttributionNiveauCERCLCycle4",
				);
			}
		} else if (this.donnees.estPalierDeNiveauEcole) {
			lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
				"competences.fenetreValidationAuto.MFicheAttributionNiveauCERCLCycle3",
			);
		} else {
		}
		return lMrFiche;
	}
	afficherPage() {
		const lListeEleves = this.getListeEleves();
		if (!lListeEleves || lListeEleves.count() === 0) {
			return;
		}
		const lParamsCommun = {
			palier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Palier,
			),
			pilier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Pilier,
			),
			service: this.getServiceConcerne(),
			listeEleves: lListeEleves,
			filtreEvaluation: this.filtresListe.ensembleEvaluationsSelectionne,
			filtreElementsSansEvaluation: this.filtresListe.uniquementElementsEvalues,
		};
		const lParamsSelonContexte =
			this.getParamsSupplementairesRequeteSelonContexte();
		const lParamsRequete = Object.assign(lParamsCommun, lParamsSelonContexte);
		new ObjetRequeteBilanParDomaine_1.ObjetRequeteBilanParDomaine(
			this,
			this._reponseRequeteBilanParDomaine,
		).lancerRequete(lParamsRequete);
	}
	getParamsSupplementairesRequeteSelonContexte() {
		return {};
	}
	_avecAffichageCoefficient() {
		return false;
	}
	_avecAffichageDateValidation() {
		return !this.etatUtilisateurSco.pourPrimaire();
	}
	_surEvenementListeBilanDomaineStandard(aParametres) {}
	_getMethodeInitialisationMenuContextuelListeStandard() {
		return null;
	}
	_getMethodeInitialisationMenuContextuelListeLVE() {
		return null;
	}
	_avecAffichageLegendeListe() {
		return false;
	}
	jsxDisplayFiltresDeListe() {
		const lListeEleves = this.getListeEleves();
		return (
			!this.estAffichageListeLVE() &&
			!!lListeEleves &&
			lListeEleves.count() === 1
		);
	}
	_construitAddSurZoneCommun() {
		return [
			{
				html: IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelFiltreEnsembleEvaluations.bind(this),
					"ie-display": this.jsxDisplayFiltresDeListe.bind(this),
				}),
			},
			{
				html: IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": this.jsxModeleCheckboxFiltreElementsEvalues.bind(this),
						"ie-display": this.jsxDisplayFiltresDeListe.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.FiltrerElementsGrilleEvalues",
					),
				),
			},
		];
	}
	_evenementAfficherMessage(AGenreMessage) {
		this.afficherBandeau(false);
		this._afficherListe(false);
		const LMessage =
			typeof AGenreMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[AGenreMessage]
				: AGenreMessage;
		ObjetHtml_1.GHtml.setHtml(
			this.ids.pageMessage,
			this.composeMessage(LMessage),
		);
	}
	_composePiedNonEditable() {
		const H = [];
		if (!!this.donnees.relationElevePilier.observations) {
			H.push(
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"span",
						{ class: "Gras" },
						ObjetChaine_1.GChaine.insecable(
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.bilanpardomaine.Observations",
							),
						),
						" : ",
					),
					IE.jsx.str(
						"span",
						null,
						this.donnees.relationElevePilier.observations,
					),
				),
			);
		}
		return H.join("");
	}
	getLibelleEntete() {
		return this.donnees.relationElevePilier.libellePilierPalier || "";
	}
	_afficherValidationDomaine() {
		return true;
	}
	_composerEntete() {
		const H = [];
		if (
			!!this.donnees.relationElevePilier.niveauDAcquisition &&
			this.donnees.relationElevePilier.niveauDAcquisition.existeNumero()
		) {
			let lValidation = "";
			const lNiveauDAcquisition =
				this.parametresSco.listeNiveauxDAcquisitions.getElementParNumero(
					this.donnees.relationElevePilier.niveauDAcquisition.getNumero(),
				);
			if (lNiveauDAcquisition) {
				lValidation =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
						lNiveauDAcquisition,
					);
				if (
					UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
						lNiveauDAcquisition,
					) &&
					!!this.donnees.relationElevePilier.dateAcquisition
				) {
					lValidation +=
						" " +
						ObjetTraduction_1.GTraductions.getValeur("Le") +
						" " +
						ObjetDate_1.GDate.formatDate(
							this.donnees.relationElevePilier.dateAcquisition,
							"%JJ/%MM/%AAAA",
						);
				}
			}
			if (lValidation && this._afficherValidationDomaine()) {
				const lLibelleEntete = this.getLibelleEntete();
				H.push(
					IE.jsx.str(
						"div",
						{ class: "EspaceBas" },
						IE.jsx.str(
							"span",
							{ class: "Gras" },
							ObjetChaine_1.GChaine.insecable(lLibelleEntete + " : "),
						),
						IE.jsx.str("span", null, lValidation),
					),
				);
			}
		}
		return H.join("");
	}
	_construireEntete() {
		ObjetHtml_1.GHtml.setHtml(this.ids.entete, this._composerEntete(), {
			instance: this,
		});
	}
	_surEvenementListeBilanDomaine(aParametres) {
		if (this.estAffichageListeLVE()) {
			this._surEvenementListeBilanDomaineLVE(aParametres);
		} else {
			this._surEvenementListeBilanDomaineStandard(aParametres);
		}
	}
	_surEvenementListeBilanDomaineLVE(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				const lListeEleves = this.getListeEleves();
				if (!!lListeEleves && lListeEleves.count() === 1) {
					const lInfoService = aParametres.instance
						.getDonneesListe()
						.getInfosService(
							aParametres.declarationColonne,
							aParametres.article,
						);
					if (
						!!lInfoService &&
						!!lInfoService.relationsESI &&
						lInfoService.relationsESI.length > 0
					) {
						const lPilierConcerne =
							this.etatUtilisateurSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Pilier,
							);
						const lEleveConcerne = lListeEleves.getPremierElement();
						new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
							this,
							this._reponseRequeteDetailEvaluations.bind(
								this,
								lPilierConcerne,
								lEleveConcerne,
								aParametres.article,
							),
						).lancerRequete({
							eleve: lEleveConcerne,
							pilier: lPilierConcerne,
							periode: null,
							numRelESI: lInfoService.relationsESI,
						});
					} else {
						this.getInstance(this.identFenetreDetailEvaluations).fermer();
					}
				} else {
					this.getInstance(this.identFenetreDetailEvaluations).fermer();
				}
				break;
			}
		}
	}
	_reponseRequeteBilanParDomaine(aDonnees) {
		this.setEtatSaisie(false);
		this.donnees.relationElevePilier = {
			libellePilierPalier: aDonnees.strLibelleEnTete,
			niveauDAcquisition: aDonnees.niveauDAcquisition,
			dateAcquisition: aDonnees.date,
			observations: aDonnees.observations,
		};
		this.donnees.droitSaisie = aDonnees.droitSaisie;
		this.donnees.estDansLEtablissement = aDonnees.estDansLEtablissement;
		this.donnees.listeCompetences = aDonnees.listeCompetences;
		this.donnees.listeServicesLVE = null;
		this._afficherListe(true);
		this._construireEntete();
		$("#" + this.getNomInstance(this.identListeBilanDomaine).escapeJQ()).css(
			"height",
			"calc(100% - " +
				(this.parametres.heightPied +
					ObjetPosition_1.GPosition.getHeight(this.ids.entete)) +
				"px)",
		);
		if (this.estAffichageListeLVE()) {
			this._traiterDonneesAffichageLVEAvecGestionCECRL(aDonnees);
		} else {
			this._traiterDonneesAffichageStandard(aDonnees);
		}
	}
	_traiterDonneesAffichageLVEAvecGestionCECRL(aDonnees) {
		this.donnees.listeServicesLVE = aDonnees.listeServicesLVE;
		this.donnees.estPalierDeNiveauEcole = !!aDonnees.estPalierDeNiveauEcole;
		this.donnees.estPalierDeNiveauCollege = !!aDonnees.estPalierDeNiveauCollege;
		this.donnees.legende.contientAuMoinsUnElemGrilleMM =
			!!aDonnees.auMoinsUnElmGrilleMMVisible;
		if (!!aDonnees.couleurGrilleMM) {
			this.donnees.legende.couleurGrilleMM = aDonnees.couleurGrilleMM;
		}
		const lListeEleves = this.getListeEleves();
		const lAvecColonnesEvaluations =
			!!lListeEleves && lListeEleves.count() === 1;
		const lInstanceListe = this.getInstance(this.identListeBilanDomaine);
		this._initialiserListeBilanDomaineLVE(
			lInstanceListe,
			this.donnees.listeServicesLVE,
			lAvecColonnesEvaluations,
		);
		const lDonneesListe =
			new DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE(
				this.donnees.listeCompetences,
				{
					callbackInitMenuContextuel:
						this._getMethodeInitialisationMenuContextuelListeLVE(),
					avecMarqueursSurCptProvenantGrilleMM:
						this._avecAffichageLegendeListe(),
					couleurs: { grilleMM: this.donnees.legende.couleurGrilleMM },
				},
			);
		lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
		lInstanceListe.setDonnees(lDonneesListe);
	}
	_traiterDonneesAffichageStandard(aDonnees) {
		this.filtresListe.listeEnsembleEvaluations =
			aDonnees.listeFiltreEvaluations;
		if (
			!this.filtresListe.ensembleEvaluationsSelectionne &&
			!!this.filtresListe.listeEnsembleEvaluations &&
			this.filtresListe.listeEnsembleEvaluations.count() > 0
		) {
			this.filtresListe.ensembleEvaluationsSelectionne =
				this.filtresListe.listeEnsembleEvaluations.get(0);
		}
		this._initialiserListeBilanDomaine(
			this.getInstance(this.identListeBilanDomaine),
		);
		const lDonneesListe =
			new DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine(
				this.donnees.listeCompetences,
				{
					callbackInitMenuContextuel:
						this._getMethodeInitialisationMenuContextuelListeStandard(),
				},
			);
		lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
		this.getInstance(this.identListeBilanDomaine).setDonnees(lDonneesListe);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", { id: this.ids.pageMessage, class: "full-height" }),
				IE.jsx.str(
					"div",
					{
						id: this.ids.pageListe,
						class: "full-height p-all",
						style: "display:none;",
					},
					IE.jsx.str("div", { class: "p-bottom", id: this.ids.entete }),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeBilanDomaine),
						style: "height:calc(100% - " + this.parametres.heightPied + "px);",
					}),
					IE.jsx.str(
						"div",
						{ style: "height:" + this.parametres.heightPied + "px;" },
						IE.jsx.str("div", {
							class: "EspaceHaut",
							"ie-display": this.jsxDisplayLegendeListe.bind(this),
							"ie-html": this.jsxGetHtmlLegendeListe.bind(this),
						}),
						IE.jsx.str("div", {
							"ie-html": this.jsxGetHtmlPied.bind(this),
							class: "EspaceHaut",
						}),
					),
				),
			),
		);
		return H.join("");
	}
	_afficherListe(aAfficher) {
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageMessage, !aAfficher);
		ObjetHtml_1.GHtml.setDisplay(this.ids.pageListe, !!aAfficher);
		if (!aAfficher) {
			this.getInstance(this.identListeBilanDomaine).effacer("");
		}
	}
	_getOptionListe(aColonnes, aOptionsSupplementaires) {
		const lOptionsParDefaut = {
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
			avecLigneTotal: false,
			scrollHorizontal: false,
		};
		const lOptionsListe = Object.assign(lOptionsParDefaut, {
			colonnes: aColonnes,
		});
		if (!!aOptionsSupplementaires) {
			for (const lOptSupp in aOptionsSupplementaires) {
				if (lOptionsParDefaut[lOptSupp] === undefined) {
				}
			}
			Object.assign(lOptionsListe, aOptionsSupplementaires);
		}
		return lOptionsListe;
	}
	_initialiserListeBilanDomaine(aInstance) {
		const lListeEleves = this.getListeEleves();
		const lAvecBoutonValidationAuto =
			this.donnees.droitSaisie && !!lListeEleves && lListeEleves.count() === 1;
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine.colonnes
				.items,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.bilanpardomaine.colonnes.Items",
			),
		});
		if (this._avecAffichageCoefficient()) {
			lColonnes.push({
				id: DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine.colonnes
					.coefficient,
				taille: 70,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competences.bilanpardomaine.colonnes.Coefficient",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"competences.bilanpardomaine.colonnes.hintCoefficient",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine.colonnes
				.niveau,
			taille: 70,
			titre: {
				getLibelleHtml: () => {
					const H = [];
					if (lAvecBoutonValidationAuto) {
						const lJsxModeleBoutonValidationAuto = () => {
							return {
								event: () => {
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
										{
											instance: this,
											listeEleves: lListeEleves,
											avecChoixCalcul: true,
										},
									);
								},
								getTitle: () => {
									return GlossaireCompetences_1.TradGlossaireCompetences
										.validationAuto.hintBouton;
								},
							};
						};
						H.push(
							IE.jsx.str("ie-btnicon", {
								"ie-model": lJsxModeleBoutonValidationAuto.bind(this),
								class: "icon_sigma color-neutre MargeDroit",
							}),
						);
					}
					H.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.bilanpardomaine.colonnes.Niveau",
						),
					);
					return H.join("");
				},
			},
		});
		if (this._avecAffichageDateValidation()) {
			lColonnes.push({
				id: DonneesListe_BilanParDomaine_1.DonneesListe_BilanParDomaine.colonnes
					.valider,
				taille: 80,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competences.bilanpardomaine.colonnes.ValideLe",
				),
			});
		}
		aInstance.setOptionsListe(this._getOptionListe(lColonnes));
	}
	_initialiserListeBilanDomaineLVE(
		aInstance,
		aListeServicesLVE,
		aAvecColonnesEvaluation,
	) {
		let lIdPremiereColonneScrollH = null;
		const lNbServicesLVE = !!aListeServicesLVE ? aListeServicesLVE.count() : 0;
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE
				.colonnes.libelle,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.bilanpardomaine.colonnes.Items",
			),
			taille: lNbServicesLVE > 2 && aAvecColonnesEvaluation ? 500 : "100%",
		});
		if (lNbServicesLVE > 0) {
			const lAvecBoutonValidationAuto = this.donnees.droitSaisie;
			aListeServicesLVE.parcourir((aServiceLVE) => {
				const lSuperColonneService = {
					libelle: aServiceLVE.getLibelle(),
					title: aServiceLVE.hint || aServiceLVE.getLibelle(),
				};
				if (aAvecColonnesEvaluation) {
					lColonnes.push({
						id:
							DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE
								.colonnes.prefixeJauge + aServiceLVE.getNumero(),
						titre: [
							lSuperColonneService,
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"competences.bilanpardomaine.colonnes.Evaluations",
								),
							},
						],
						taille: 200,
						serviceLVE: aServiceLVE,
					});
					if (!lIdPremiereColonneScrollH) {
						lIdPremiereColonneScrollH =
							DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE
								.colonnes.prefixeJauge + aServiceLVE.getNumero();
					}
				}
				lColonnes.push({
					id:
						DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE
							.colonnes.prefixeNiveau + aServiceLVE.getNumero(),
					titre: [
						!aAvecColonnesEvaluation
							? lSuperColonneService
							: {
									libelle:
										TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
								},
						{
							getLibelleHtml: () => {
								const H = [];
								if (lAvecBoutonValidationAuto) {
									const lJsxAvecBoutonValidationAuto = (aServiceLVE) => {
										return (
											!!aServiceLVE &&
											!!aServiceLVE.calculAutoNiveauAcquiPossible
										);
									};
									const lJsxModelBoutonValidationAuto = (aServiceLVE) => {
										return {
											event: () => {
												const lListeEleves = this.getListeEleves();
												const lParamsValidationAuto = {
													estValidationCECRLLV: true,
													instance: this,
													listeEleves: lListeEleves,
													service: aServiceLVE,
													mrFiche: this.getMrFichePourCalculAuto(aServiceLVE),
												};
												UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
													lParamsValidationAuto,
												);
											},
											getTitle: () => {
												return GlossaireCompetences_1.TradGlossaireCompetences
													.validationAuto.hintBouton;
											},
										};
									};
									H.push(
										IE.jsx.str("ie-btnicon", {
											"ie-if": lJsxAvecBoutonValidationAuto.bind(
												this,
												aServiceLVE,
											),
											"ie-model": lJsxModelBoutonValidationAuto.bind(
												this,
												aServiceLVE,
											),
											class: "icon_sigma color-neutre MargeDroit",
										}),
									);
								}
								H.push(
									ObjetTraduction_1.GTraductions.getValeur(
										"competences.bilanpardomaine.colonnes.Niveau",
									),
								);
								return H.join("");
							},
						},
					],
					taille: 70,
					serviceLVE: aServiceLVE,
				});
				if (!lIdPremiereColonneScrollH) {
					lIdPremiereColonneScrollH =
						DonneesListe_BilanParDomaineLVE_1.DonneesListe_BilanParDomaineLVE
							.colonnes.prefixeNiveau + aServiceLVE.getNumero();
				}
			});
		}
		const lServiceConcerne = this.getServiceConcerne();
		aInstance.setOptionsListe(
			this._getOptionListe(lColonnes, {
				scrollHorizontal: lIdPremiereColonneScrollH || false,
				avecLigneTotal: !lServiceConcerne || !lServiceConcerne.existeNumero(),
			}),
		);
	}
	_reponseRequeteDetailEvaluations(aPilier, aEleve, aElementCompetence, aJSON) {
		const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(aEleve, aPilier);
		lFenetre.setDonnees(aPilier, aJSON, {
			titreFenetre: lTitreParDefaut,
			libelleComplementaire: !!aElementCompetence
				? aElementCompetence.getLibelle()
				: "",
		});
	}
	_initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			largeur: 700,
			hauteur: 500,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
}
exports._InterfaceBilanParDomaine = _InterfaceBilanParDomaine;

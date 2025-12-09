exports.InterfaceSuiviResultatsCompetencesProfesseur = void 0;
const _InterfaceSuiviResultatsCompetences_1 = require("_InterfaceSuiviResultatsCompetences");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const GlossaireSuiviResultatsCompetences_1 = require("GlossaireSuiviResultatsCompetences");
class InterfaceSuiviResultatsCompetencesProfesseur extends _InterfaceSuiviResultatsCompetences_1._InterfaceSuiviResultatsCompetences {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementTripleCombo.bind(this),
			this._initialiserTripleCombo,
		);
	}
	jsxModeleBoutonOptionsAffichage() {
		let lInstanceFenetre = null;
		return {
			event: () => {
				const lFenetre = (lInstanceFenetre =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_OptionsAffichageSuiviResultatsCpt,
						{
							pere: this,
							evenement: (aNumeroBouton, aDonnees) => {
								if (aNumeroBouton === 1) {
									this.optionsAffichage.seuilEchecs =
										aDonnees.valeurSeuilEchecs;
									this.optionsAffichage.seuilSucces =
										aDonnees.valeurSeuilSucces;
									this.optionsAffichage.niveauReference =
										aDonnees.valeurNiveauReference;
									this.lancerRequeteRecuperationDonnees();
								}
							},
						},
					));
				lFenetre.setDonneesOptionsAffichage({
					valeurSeuilEchecs: this.optionsAffichage.seuilEchecs,
					valeurSeuilSucces: this.optionsAffichage.seuilSucces,
					valeurNiveauReference: this.optionsAffichage.niveauReference,
				});
				lFenetre.afficher();
			},
			getTitle: () => {
				return GlossaireSuiviResultatsCompetences_1
					.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff.Titre;
			},
			getSelection: () => {
				return lInstanceFenetre && lInstanceFenetre.estAffiche();
			},
			getDisabled: () => {
				return !this.getEleveConcerne();
			},
		};
	}
	getElementsAddSurZoneSelection() {
		return [this.identTripleCombo];
	}
	getElementsAddSurZoneParametrage() {
		return [
			{
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
					this.jsxModeleBoutonOptionsAffichage.bind(this),
				),
			},
		];
	}
	getClasseConcernee() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
	}
	getEleveConcerne() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getPeriodeConcernee() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
	}
	estJaugeCliquable() {
		return true;
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
	lancerRequeteRecuperationDonnees() {
		super.lancerRequeteRecuperationDonnees();
	}
	evenementSurListeClasse(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					aParametres.article,
				);
				this.getInstance(this.identTripleCombo).recupererDonnees();
				break;
		}
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	_evenementTripleCombo() {
		this.afficherPage();
	}
}
exports.InterfaceSuiviResultatsCompetencesProfesseur =
	InterfaceSuiviResultatsCompetencesProfesseur;
class ObjetFenetre_OptionsAffichageSuiviResultatsCpt extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre:
				GlossaireSuiviResultatsCompetences_1
					.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff.Titre,
			largeur: 550,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = {
			valeurSeuilEchecs: 0,
			valeurSeuilSucces: 0,
			valeurNiveauReference: null,
		};
	}
	jsxComboModelSeuilEchecSucces(aEstPourEchecs) {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 40,
					labelWAICellule:
						GlossaireSuiviResultatsCompetences_1.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff.wai.SelectionPourcentage.format(
							aEstPourEchecs
								? getStrListeNiveauxNonAcquis()
								: getStrListeNiveauxAcquis(),
						),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					const lListe = new ObjetListeElements_1.ObjetListeElements();
					for (let i = 5; i < 101; i += 5) {
						lListe.add(new ObjetElement_1.ObjetElement("" + i, 0, i));
					}
					return lListe;
				}
				return aListe;
			},
			getIndiceSelection: (aInstanceCombo) => {
				let lValeurSeuil;
				if (aEstPourEchecs) {
					lValeurSeuil = this.donnees.valeurSeuilEchecs;
				} else {
					lValeurSeuil = this.donnees.valeurSeuilSucces;
				}
				let lIndiceASelectionner = -1;
				const lListeElems = aInstanceCombo.getListeElements();
				if (lListeElems) {
					lIndiceASelectionner = lListeElems.getIndiceParNumeroEtGenre(
						0,
						lValeurSeuil,
					);
				}
				return Math.max(lIndiceASelectionner, 0);
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle && aParams.element) {
					const lValeurSeuil = aParams.element.getGenre();
					if (aEstPourEchecs) {
						this.donnees.valeurSeuilEchecs = lValeurSeuil;
					} else {
						this.donnees.valeurSeuilSucces = lValeurSeuil;
					}
				}
			},
		};
	}
	jsxModeleRadioNiveauReference(aNiveauReference) {
		return {
			getValue: () => {
				return this.donnees.valeurNiveauReference === aNiveauReference;
			},
			setValue: (aValue) => {
				this.donnees.valeurNiveauReference = aNiveauReference;
			},
			getName: () => {
				return `${this.Nom}_NiveauReference`;
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{
					id: InterfaceSuiviResultatsCompetences_css_1
						.StylesInterfaceSuiviResultatsCompetences
						.FenetreOptionsAffichageSuiviResultatsCpt,
				},
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceSuiviResultatsCompetences_css_1
								.StylesInterfaceSuiviResultatsCompetences.ContainerOption,
					},
					IE.jsx.str(
						"div",
						{
							class:
								InterfaceSuiviResultatsCompetences_css_1
									.StylesInterfaceSuiviResultatsCompetences.TitreOption,
						},
						GlossaireSuiviResultatsCompetences_1
							.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
							.CompetencesNonMaitrisees,
					),
					IE.jsx.str(
						"div",
						null,
						GlossaireSuiviResultatsCompetences_1
							.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
							.EchecCompetenceSi,
					),
					IE.jsx.str(
						"div",
						{ class: "m-left-xl" },
						IE.jsx.str(
							"span",
							null,
							GlossaireSuiviResultatsCompetences_1
								.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
								.AuMoins,
						),
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelSeuilEchecSucces.bind(this, true),
							class: "m-left m-right InlineBlock",
						}),
						IE.jsx.str(
							"span",
							null,
							GlossaireSuiviResultatsCompetences_1.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff.PourcentageEvalsCompEvaluees.format(
								getStrListeNiveauxNonAcquis(),
							),
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceSuiviResultatsCompetences_css_1
								.StylesInterfaceSuiviResultatsCompetences.ContainerOption,
					},
					IE.jsx.str(
						"div",
						{
							class:
								InterfaceSuiviResultatsCompetences_css_1
									.StylesInterfaceSuiviResultatsCompetences.TitreOption,
						},
						GlossaireSuiviResultatsCompetences_1
							.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
							.CompetencesMaitrisees,
					),
					IE.jsx.str(
						"div",
						null,
						GlossaireSuiviResultatsCompetences_1
							.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
							.SuccesCompetenceSi,
					),
					IE.jsx.str(
						"div",
						{ class: "m-left-xl" },
						IE.jsx.str(
							"span",
							null,
							GlossaireSuiviResultatsCompetences_1
								.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
								.AuMoins,
						),
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelSeuilEchecSucces.bind(this, false),
							class: "m-left m-right InlineBlock",
						}),
						IE.jsx.str(
							"span",
							null,
							GlossaireSuiviResultatsCompetences_1.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff.PourcentageEvalsCompEvaluees.format(
								getStrListeNiveauxAcquis(),
							),
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceSuiviResultatsCompetences_css_1
								.StylesInterfaceSuiviResultatsCompetences.ContainerOption,
					},
					IE.jsx.str(
						"div",
						{
							class:
								InterfaceSuiviResultatsCompetences_css_1
									.StylesInterfaceSuiviResultatsCompetences.TitreOption,
						},
						GlossaireSuiviResultatsCompetences_1
							.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
							.ElementsUtilisesDansCalcul,
					),
					IE.jsx.str(
						"div",
						{ class: "m-left-xl" },
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioNiveauReference.bind(
										this,
										Enumere_Ressource_1.EGenreRessource.ElementPilier,
									),
								},
								GlossaireSuiviResultatsCompetences_1
									.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
									.CalculParElementsSignifiants,
							),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioNiveauReference.bind(
										this,
										Enumere_Ressource_1.EGenreRessource.Competence,
									),
								},
								GlossaireSuiviResultatsCompetences_1
									.TradGlossaireSuiviResultatsCompetences.FenetreOptionsAff
									.CalculParCompetences,
							),
						),
					),
				),
			),
		);
		return T.join("");
	}
	setDonneesOptionsAffichage(aDonnees) {
		this.donnees.valeurSeuilEchecs = aDonnees.valeurSeuilEchecs;
		this.donnees.valeurSeuilSucces = aDonnees.valeurSeuilSucces;
		this.donnees.valeurNiveauReference = aDonnees.valeurNiveauReference;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			valeurSeuilEchecs: this.donnees.valeurSeuilEchecs,
			valeurSeuilSucces: this.donnees.valeurSeuilSucces,
			valeurNiveauReference: this.donnees.valeurNiveauReference,
		});
	}
}
function getStrListeNiveauxNonAcquis() {
	const lListeNiveauxNonAcquis =
		UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxNonAcquis();
	return lListeNiveauxNonAcquis
		? lListeNiveauxNonAcquis.getTableauLibelles().join(", ")
		: "";
}
function getStrListeNiveauxAcquis() {
	const lListeNiveauxNonAcquis =
		UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxAcquis();
	return lListeNiveauxNonAcquis
		? lListeNiveauxNonAcquis.getTableauLibelles().join(", ")
		: "";
}

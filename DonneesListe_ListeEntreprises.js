exports.DonneesListe_ListeEntreprises = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_FiltrePeriodeOffresStages_1 = require("ObjetFenetre_FiltrePeriodeOffresStages");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const GUID_1 = require("GUID");
class DonneesListe_ListeEntreprises extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	getClassCelluleConteneur() {
		return "AvecMain";
	}
	getIconeGaucheContenuFormate(aParams) {
		const lEntreprise = aParams.article;
		return lEntreprise.estSiegeSocial ? "icon_building" : "icon_entreprise";
	}
	getTitreZonePrincipale(aParams) {
		if (!aParams.article) {
			return "";
		}
		const H = [];
		H.push(aParams.article.getLibelle());
		if (!!aParams.article.nomCommercial) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"span",
						{ style: "font-weight:400;" },
						" / ",
						aParams.article.nomCommercial,
					),
				),
			);
		}
		return H.join("");
	}
	getInfosSuppZonePrincipale(aParams) {
		const lEntreprise = aParams.article;
		const H = [];
		if (!!lEntreprise) {
			if (!!lEntreprise.codePostal || !!lEntreprise.ville) {
				const lStrCPVille =
					(lEntreprise.codePostal || "") + " " + (lEntreprise.ville || "");
				H.push(IE.jsx.str("div", null, lStrCPVille));
			}
			if (!!lEntreprise.activite) {
				H.push(IE.jsx.str("div", null, lEntreprise.activite.getLibelle()));
			}
			if (!!lEntreprise.siret) {
				H.push(
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.NumeroSiret",
						),
						" : ",
						lEntreprise.siret,
					),
				);
			}
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (!this.enConstruction_cacheRechercheTexte) {
			const lEntreprise = aParams.article;
			if (!!lEntreprise) {
				const lNbOffres = lEntreprise.listeOffresStages
					? lEntreprise.listeOffresStages.count()
					: 0;
				if (lNbOffres > 0) {
					const lStrOffres =
						lNbOffres +
						` ${lNbOffres > 1 ? ObjetTraduction_1.GTraductions.getValeur("OffreStage.offres") : ObjetTraduction_1.GTraductions.getValeur("OffreStage.offre")}`;
					H.push(IE.jsx.str("div", { class: "offre-pourvu" }, lStrOffres));
				}
				if (lEntreprise.estPublie === false) {
					const lStrEntrepriseNonPubliee = IE.estMobile
						? ObjetTraduction_1.GTraductions.getValeur("OffreStage.nonPubliee")
						: ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.nonPublieeSurEspaceParentsEleves",
							);
					H.push(IE.jsx.str("div", null, lStrEntrepriseNonPubliee));
				}
			}
		}
		return H.join("");
	}
	getVisible(aArticle) {
		return !aArticle || aArticle.visible;
	}
	jsxModeleRechercheSujet() {
		return {
			getValue: () => {
				return this.options.filtre.sujet;
			},
			setValue: (aValue) => {
				this.options.filtre.sujet = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxRechercheParNombreSemaines() {
		return {
			getValue: () => {
				return this.options.filtre.nbrSemaines || "";
			},
			setValue: (aValue) => {
				this.options.filtre.nbrSemaines = parseInt(aValue);
				if (
					!MethodesObjet_1.MethodesObjet.isNumber(
						this.options.filtre.nbrSemaines,
					)
				) {
					this.options.filtre.nbrSemaines = 0;
				}
				this._actualiserFiltres();
			},
		};
	}
	jsxModeleCheckboxRecherchesEntreprisesAvecOffresStages() {
		return {
			getValue: () => {
				return this.options.filtre.seulementAvecOffres;
			},
			setValue: (aValue) => {
				this.options.filtre.seulementAvecOffres = aValue;
				this._actualiserFiltres();
			},
		};
	}
	jsxAvecAffichageRecherchePeriodes() {
		return (
			this.options.optionsInterface.avecPeriode &&
			this.options.optionsInterface.avecFiltrePeriode
		);
	}
	jsxModelBtnSelecteurRecherchePeriodes() {
		return {
			event: () => {
				if (
					this.options.optionsInterface.avecPeriode &&
					this.options.optionsInterface.avecFiltrePeriode
				) {
					this._evntOuvertureFenetrePeriode();
				}
			},
			getLibelle: () => {
				return this.options.filtre.periode &&
					this.options.filtre.periode.getLibelle()
					? this.options.filtre.periode.getLibelle().ucfirst()
					: " ";
			},
			getIcone: () => {
				return "icon_calendar_empty";
			},
		};
	}
	jsxComboModelRechercheActivites() {
		return {
			init: (aCombo) => {
				this.comboFiltreActivite = aCombo;
				aCombo.setOptionsObjetSaisie({
					mode: Enumere_Saisie_1.EGenreSaisie.Combo,
					multiSelection: true,
					longueur: 220,
					libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.titre.Activite",
					),
					avecDesignMobile: true,
					getInfosElementCB: function (aElement) {
						const lEstCumul = aElement.getNumero() === -1;
						return {
							estCumul: lEstCumul,
							estFilsCumul: function (aFils) {
								return (
									aElement.getGenre() === -1 &&
									aElement.getGenre() !== aFils.getGenre()
								);
							},
							setModifierSelection: function (aParametresModifie) {
								if (
									aParametresModifie.elementSourceSelectionne &&
									aElement.getGenre() === -1 &&
									aElement.getGenre() !==
										aParametresModifie.elementSource.getGenre()
								) {
									return true;
								}
							},
						};
					},
				});
				aCombo.setDonnees(
					this.options.listeActivites,
					this.options.filtre.activite,
				);
				aCombo.setContenu(this.options.filtre.activite);
			},
			event: (aParams) => {
				if (
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
						.selection === aParams.genreEvenement &&
					aParams.listeSelections
				) {
					this.options.filtre.activite = aParams.listeSelections;
					this._actualiserFiltres();
				}
			},
			destroy: () => {
				this.comboFiltreActivite = null;
			},
		};
	}
	construireFiltres() {
		if (!this.options.filtre) {
			return "";
		}
		const lIdDuree = GUID_1.GUID.getId();
		const lIdPeriode = GUID_1.GUID.getId();
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "filtre-conteneur-mobile" },
				IE.jsx.str(
					"div",
					{ class: "champs-filtre" },
					IE.jsx.str("input", {
						type: "text",
						"ie-model": this.jsxModeleRechercheSujet.bind(this),
						class: "full-width sujet",
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.Sujet",
						),
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.Sujet",
						),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "champs-filtre" },
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelRechercheActivites.bind(this),
						class: "combo-mobile flex-wrap full-width on-mobile",
					}),
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": this.jsxAvecAffichageRecherchePeriodes.bind(this),
						class: "champs-filtre",
					},
					IE.jsx.str(
						"label",
						{ id: lIdPeriode },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.Periode",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"aria-labelledby": lIdPeriode,
						"ie-model": this.jsxModelBtnSelecteurRecherchePeriodes.bind(this),
						style: "background-color:transparent",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "champs-filtre" },
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center duree-stage" },
						IE.jsx.str(
							"label",
							{ for: lIdDuree },
							ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.dureeMinimale",
							),
						),
						IE.jsx.str("input", {
							id: lIdDuree,
							type: "text",
							"ie-model": this.jsxRechercheParNombreSemaines.bind(this),
							"ie-mask": "/[^0-9]/i",
							style: { width: "4.3rem" },
							maxlength: "2",
							class: "semaine",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "fields-wrapper champs-filtre" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model":
								this.jsxModeleCheckboxRecherchesEntreprisesAvecOffresStages.bind(
									this,
								),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.FiltreSeulementAvecOffre",
						),
					),
				),
			),
		);
		return H.join("");
	}
	reinitFiltres() {
		Object.assign(
			this.options.filtre,
			DonneesListe_ListeEntreprises.getFiltresParDefaut(),
		);
		if (this.comboFiltreActivite) {
			this.comboFiltreActivite.setListeSelections(this.options.filtre.activite);
		}
		this._actualiserFiltres();
	}
	estFiltresParDefaut() {
		if (!this.options.filtre) {
			return true;
		}
		return !(
			this.options.filtre.nbrSemaines > 0 ||
			this.options.filtre.seulementAvecOffres ||
			this.options.filtre.sujet !== "" ||
			(this.options.filtre.activite.count() > 0 &&
				this.options.filtre.activite.count() <
					this.options.listeActivites.count() - 1) ||
			this.options.filtre.periode.Actif
		);
	}
	static getFiltresParDefaut() {
		const lPeriodeParDefaut = new ObjetElement_1.ObjetElement();
		lPeriodeParDefaut.setActif(false);
		lPeriodeParDefaut.dateDebut = ObjetDate_1.GDate.aujourdhui;
		lPeriodeParDefaut.dateFin = ObjetDate_1.GDate.aujourdhui;
		return {
			periode: lPeriodeParDefaut,
			sujet: "",
			seulementAvecOffres: false,
			nbrSemaines: 0,
			activite: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	_actualiserFiltres() {
		this.options.evnFiltre();
		this.paramsListe.actualiserListe();
	}
	_evntOuvertureFenetrePeriode() {
		const lFiltre = this.options.filtre;
		if (!lFiltre.periode) {
			lFiltre.periode = new ObjetElement_1.ObjetElement("");
			lFiltre.periode.dateDebut = null;
			lFiltre.periode.dateFin = null;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FiltrePeriodeOffresStages_1.ObjetFenetre_FiltrePeriodeOffresStages,
			{
				pere: this,
				evenement(aNumeroBouton, aEstModif) {
					let lLibelle = "";
					if (aEstModif) {
						if (!!lFiltre.periode.dateDebut) {
							if (
								ObjetDate_1.GDate.estDateEgale(
									lFiltre.periode.dateDebut,
									lFiltre.periode.dateFin,
								)
							) {
								lLibelle =
									ObjetTraduction_1.GTraductions.getValeur("Le") +
									" " +
									ObjetDate_1.GDate.formatDate(
										lFiltre.periode.dateDebut,
										"%JJ/%MM/%AA",
									);
							} else {
								lLibelle =
									ObjetTraduction_1.GTraductions.getValeur("Du") +
									" " +
									ObjetDate_1.GDate.formatDate(
										lFiltre.periode.dateDebut,
										"%JJ/%MM/%AA",
									);
								lLibelle +=
									" " +
									ObjetTraduction_1.GTraductions.getValeur("Au") +
									" " +
									ObjetDate_1.GDate.formatDate(
										lFiltre.periode.dateFin,
										"%JJ/%MM/%AA",
									);
							}
						}
						lFiltre.periode.setLibelle(lLibelle);
						this._actualiserFiltres();
					}
				},
			},
		);
		lFenetre.setDonnees(lFiltre.periode);
		lFenetre.afficher();
	}
}
exports.DonneesListe_ListeEntreprises = DonneesListe_ListeEntreprises;

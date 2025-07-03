exports.ObjetFenetre_ProgressionAffectationAuCours = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementTreeView_1 = require("Enumere_EvenementTreeView");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTreeView_1 = require("ObjetTreeView");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDonneesTreeViewProgression_1 = require("ObjetDonneesTreeViewProgression");
const ObjetDonneesTreeViewProgression_2 = require("ObjetDonneesTreeViewProgression");
class ObjetFenetre_ProgressionAffectationAuCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idLegende = this.Nom + "_L";
		this.indexBtnValider = 1;
		this.parametres = {
			listeProgressions: null,
			strPublics: "",
			strMatiere: "",
			JoursPresenceCours: null,
			dateTAFMin: null,
			dateTAF: null,
			avecTAFVisible: false,
			avecElementsAssoc: false,
			avecContenu: true,
			avecTAF: true,
		};
	}
	construireInstances() {
		this.identTreeView = this.add(
			ObjetTreeView_1.ObjetTreeView,
			this._evenementSurTreeView,
			this._initialiserTreeView,
		);
		this.identDateTAF = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			(aDate) => {
				this.parametres.dateTAF = aDate;
			},
		);
	}
	_initialiserTreeView(aInstance) {
		aInstance.setParametres();
	}
	jsxModelRadioCompositionTitre(aTypeComposition) {
		return {
			getValue: () => {
				return (
					ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression ===
					aTypeComposition
				);
			},
			setValue: (aValue) => {
				ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression =
					aTypeComposition;
			},
			getName: () => {
				return `${this.Nom}_CompositionTitre`;
			},
		};
	}
	jsxModelCheckboxAffichage(aNomChamp) {
		return {
			getValue: () => {
				return this.parametres[aNomChamp];
			},
			setValue: (aValue) => {
				this.parametres[aNomChamp] = aValue;
				this._evenementSurCheckBox();
			},
		};
	}
	jsxDisplayInfosAvecTAF() {
		return this.parametres.avecTAFVisible;
	}
	jsxGetStyleFieldContenu() {
		return { width: this.parametres.avecTAFVisible ? 250 : 500 };
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-gap-l m-bottom-l" },
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"fieldset",
						{ "ie-style": this.jsxGetStyleFieldContenu.bind(this) },
						IE.jsx.str(
							"legend",
							null,
							ObjetTraduction_1.GTraductions.getValeur("progression.Contenu"),
							" - ",
							ObjetTraduction_1.GTraductions.getValeur(
								"progression.MsgOptionsTitreElement",
							),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"div",
								{ class: "EspaceBas" },
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModelRadioCompositionTitre.bind(
											this,
											ObjetDonneesTreeViewProgression_1
												._ObjetDonneesTreeViewProgression.genreTitreContenu
												.Titre,
										),
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"progression.OptionTitre",
									),
								),
							),
							IE.jsx.str(
								"div",
								{ class: "EspaceBas" },
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModelRadioCompositionTitre.bind(
											this,
											ObjetDonneesTreeViewProgression_1
												._ObjetDonneesTreeViewProgression.genreTitreContenu
												.SsDossierTitre,
										),
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"progression.OptionSousDossierTitre",
									),
								),
							),
							IE.jsx.str(
								"div",
								null,
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModelRadioCompositionTitre.bind(
											this,
											ObjetDonneesTreeViewProgression_1
												._ObjetDonneesTreeViewProgression.genreTitreContenu
												.DossierSsDossierTitre,
										),
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"progression.OptionDossierSousDossierTitre",
									),
								),
							),
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "flex-contain",
						"ie-display": this.jsxDisplayInfosAvecTAF.bind(this),
					},
					IE.jsx.str(
						"fieldset",
						{ class: "p-all-xl", style: "width:250px;" },
						IE.jsx.str(
							"legend",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TravailAFaire",
							),
							" :",
						),
						IE.jsx.str(
							"div",
							{ class: "flex-contain flex-center flex-gap" },
							IE.jsx.str(
								"div",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.PourLe",
								),
							),
							IE.jsx.str("div", { id: this.getNomInstance(this.identDateTAF) }),
						),
					),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "p-y" },
				IE.jsx.str(
					"div",
					{ class: "PetitEspaceBas" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxAffichage.bind(
								this,
								"avecElementsAssoc",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"progression.ElementsNonAssocies",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "PetitEspaceBas",
						"ie-display": this.jsxDisplayInfosAvecTAF.bind(this),
					},
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxAffichage.bind(
								this,
								"avecContenu",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"progression.AfficherContenus",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "PetitEspaceBas",
						"ie-display": this.jsxDisplayInfosAvecTAF.bind(this),
					},
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxAffichage.bind(this, "avecTAF"),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"progression.AfficherTAFs",
						),
					),
				),
			),
		);
		H.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identTreeView),
				style: "width:500px; height:300px;",
			}),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "PetitEspaceHaut" },
				IE.jsx.str("span", { id: this.idLegende, class: "Italique" }),
			),
		);
		return H.join("");
	}
	setDonnees(aParams) {
		Object.assign(this.parametres, aParams);
		this.setBoutonActif(this.indexBtnValider, false);
		const lTitre =
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.SelectionnerDonnees",
			) +
			" " +
			(this.parametres.strPublics ? this.parametres.strPublics : "") +
			(this.parametres.strMatiere ? " - " + this.parametres.strMatiere : "");
		this.setOptionsFenetre({ titre: lTitre });
		const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
			"progression.AideDejaAffecteCDTACours",
		);
		ObjetHtml_1.GHtml.setHtml(this.idLegende, lLibelle);
		const lInstanceDate = this.getInstance(this.identDateTAF);
		lInstanceDate.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			false,
			this.parametres.JoursPresenceCours,
		);
		lInstanceDate.setPremiereDateSaisissable(this.parametres.dateTAFMin, true);
		lInstanceDate.setDonnees(this.parametres.dateTAF);
		this.afficher();
		this._actualiserTreeView();
		this.controleur.$refreshSelf(true);
		this.surFixerTaille();
	}
	_actualiserTreeView() {
		this.setBoutonActif(this.indexBtnValider, false);
		const lObjetDonneesTreeView =
			new ObjetDonneesTreeViewProgression_2.ObjetDonneesTreeViewProgressionSelection(
				this.parametres.listeProgressions,
				this.parametres.avecElementsAssoc,
				this.parametres.avecContenu || !this.parametres.avecTAFVisible,
				this.parametres.avecTAF && this.parametres.avecTAFVisible,
			);
		this.getInstance(this.identTreeView).setDonnees(lObjetDonneesTreeView);
	}
	_leContenuEstDejaAffecte(aContenu) {
		if (aContenu && aContenu.listeAffectes) {
			for (let j = 0; j < aContenu.listeAffectes.count(); j++) {
				if (aContenu.listeAffectes.get(j).affecteCours) {
					return true;
				}
			}
		}
		return false;
	}
	_unContenuDeNodeEstDejaAffecte(aNodesContenu) {
		if (aNodesContenu) {
			for (let i = 0; i < aNodesContenu.length; i++) {
				if (
					aNodesContenu[i] &&
					this._leContenuEstDejaAffecte(aNodesContenu[i].contenu)
				) {
					return true;
				}
			}
		}
		return false;
	}
	surValidation(ANumeroBouton) {
		const lNodesSelections = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		if (ANumeroBouton === 1) {
			if (this._unContenuDeNodeEstDejaAffecte(lNodesSelections)) {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"progression.MsgDejaAffectesCDT",
					),
					callback: function (aGenreAction) {
						lThis._apresConfirmation(ANumeroBouton, true, aGenreAction);
					},
				});
			} else {
				this._apresConfirmation(ANumeroBouton, true);
			}
		} else {
			this._apresConfirmation(ANumeroBouton, true);
		}
	}
	_apresConfirmation(
		aNumeroBouton,
		aDeselectionCoursDejaAffectes,
		aBoutonMessage,
	) {
		const lNodesSelection = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		if (aBoutonMessage !== 1) {
			this._finValidation(aNumeroBouton, lNodesSelection);
		} else {
			if (aDeselectionCoursDejaAffectes) {
				const lNouvelleSelection = [];
				if (lNodesSelection) {
					for (let i = 0; i < lNodesSelection.length; i++) {
						if (lNodesSelection[i] && lNodesSelection[i].contenu) {
							if (!this._leContenuEstDejaAffecte(lNodesSelection[i].contenu)) {
								lNouvelleSelection.push(lNodesSelection[i]);
							}
						}
					}
				}
				if (lNouvelleSelection.length > 0) {
					this._finValidation(aNumeroBouton, lNouvelleSelection);
				} else {
					this.setBoutonActif(
						this.indexBtnValider,
						lNouvelleSelection && lNouvelleSelection.length > 0,
					);
					this.getInstance(this.identTreeView).setSelectionParContenuDeNode(
						lNouvelleSelection,
					);
				}
			}
		}
	}
	_finValidation(aNumeroBouton, aNodesSelection) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this._getSelection(aNodesSelection));
	}
	_evenementSurTreeView(aGenreEvenement, aNode) {
		switch (aGenreEvenement) {
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection: {
				const lSelection = this.getInstance(
					this.identTreeView,
				).getNodeSelection();
				this.setBoutonActif(
					this.indexBtnValider,
					Array.isArray(lSelection) ? lSelection.length > 0 : !!lSelection,
				);
				break;
			}
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView
				.selectionDblClick:
				if (
					aNode &&
					aNode.contenu &&
					(aNode.contenu.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ContenuDeCours ||
						aNode.contenu.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.TravailAFaire)
				) {
					this.surValidation(1);
				}
				break;
		}
	}
	_remplirChampsElement(aNode) {
		switch (aNode.contenu.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
				aNode.contenu.PourLe = this.parametres.dateTAF;
				break;
			case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
				aNode.contenu.Libelle =
					ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
						aNode,
						ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression,
					);
				break;
		}
		return aNode.contenu;
	}
	_getSelection(aNodesSelection) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (aNodesSelection) {
			if (MethodesObjet_1.MethodesObjet.isArray(aNodesSelection)) {
				for (let i = 0; i < aNodesSelection.length; i++) {
					lListe.addElement(this._remplirChampsElement(aNodesSelection[i]));
				}
			} else {
				lListe.addElement(this._remplirChampsElement(aNodesSelection));
			}
		}
		return lListe;
	}
	_evenementSurCheckBox() {
		const lAncienneSelection = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		this._actualiserTreeView();
		this.getInstance(this.identTreeView).setSelectionParContenuDeNode(
			lAncienneSelection,
		);
	}
}
exports.ObjetFenetre_ProgressionAffectationAuCours =
	ObjetFenetre_ProgressionAffectationAuCours;
ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression =
	ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.genreTitreContenu.Titre;

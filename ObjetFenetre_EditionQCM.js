exports.ObjetFenetre_EditionQCM = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
const ObjetFenetre_SelectionCategoriesQCM_1 = require("ObjetFenetre_SelectionCategoriesQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const GUID_1 = require("GUID");
class ObjetFenetre_EditionQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 350,
			hauteur: 250,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = { QCM: null, listeMatieres: null, listeEtiquettes: null };
		this.estContexteModeCollaboratif = false;
		this.optionsAffichage = {
			avecSaisieMatiereParFenetre: true,
			avecSaisieMatiereParCombo: false,
			avecSaisieNiveau: false,
			avecSaisieEtiquette: false,
		};
		this.estSaisieMatiereObligatoire = false;
		this.avecModificationEtiquettes = false;
		this.avecThemes = false;
	}
	construireInstances() {
		this.addInstanceThemes();
	}
	jsxModeleLibelle() {
		return {
			getValue: () => {
				return this.donnees.QCM ? this.donnees.QCM.getLibelle() : "";
			},
			setValue: (aValue) => {
				if (this.donnees.QCM) {
					this.donnees.QCM.setLibelle(aValue);
					this.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.verifierCoherencePourValider();
				}
			},
			getDisabled: () => {
				return !this.donnees.QCM;
			},
		};
	}
	jsxIfSaisieMatiereParCombo() {
		return !!this.optionsAffichage.avecSaisieMatiereParCombo;
	}
	jsxIfSaisieMatiereParFenetre() {
		return !!this.optionsAffichage.avecSaisieMatiereParFenetre;
	}
	jsxComboModelMatieres() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 288,
					hauteur: 16,
					hauteurLigneDefault: 16,
					labelWAICellule:
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe && this.donnees.listeMatieres) {
					const lListeLignes = new ObjetListeElements_1.ObjetListeElements();
					lListeLignes.add(this.donnees.listeMatieres);
					return lListeLignes;
				}
			},
			getLibelle: () => {
				let lLibelle = "";
				if (this.donnees.QCM && this.donnees.QCM.matiere) {
					const lNumero = this.donnees.QCM.matiere.getNumero();
					const lMatiereSelectionnee =
						this.donnees.listeMatieres.getElementParNumero(lNumero);
					if (lMatiereSelectionnee) {
						lLibelle = lMatiereSelectionnee.getLibelle();
					}
				}
				return lLibelle;
			},
			getIndiceSelection: () => {
				const lNumero = this.donnees.QCM.matiere.getNumero();
				return this.donnees.listeMatieres.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.getNumero() === lNumero;
					},
				);
			},
			event: (aParams) => {
				if (
					!!this.donnees.QCM &&
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.indice !==
						this.donnees.listeMatieres.getIndiceParElement(
							this.donnees.QCM.matiere,
						)
				) {
					this.donnees.QCM.matiere = this.donnees.listeMatieres.get(
						aParams.indice,
					);
					this.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.verifierCoherencePourValider();
				}
			},
			getDisabled: () => {
				return (
					!this.donnees.QCM ||
					this.donnees.QCM.nbCompetencesTotal > 0 ||
					this.donnees.QCM.estVerrouille
				);
			},
		};
	}
	jsxGetHtmlMatiere() {
		let lStrMatiere = "";
		if (!!this.donnees.QCM && !!this.donnees.QCM.matiere) {
			lStrMatiere = this.donnees.QCM.matiere.getLibelle();
		}
		return lStrMatiere || "&nbsp;";
	}
	jsxNodeInputTextMatiere(aNode) {
		$(aNode).eventValidation(() => {
			this.surBoutonChoixMatiere();
		});
	}
	jsxIfSaisieNiveau() {
		return !!this.optionsAffichage.avecSaisieNiveau;
	}
	jsxGetHtmlNiveau() {
		let lStrNiveau = "";
		if (!!this.donnees.QCM && !!this.donnees.QCM.niveau) {
			lStrNiveau = this.donnees.QCM.niveau.getLibelle();
		}
		return lStrNiveau || "&nbsp;";
	}
	jsxNodeInputTextNiveau(aNode) {
		$(aNode).eventValidation(() => {
			this.surBoutonChoixNiveau();
		});
	}
	jsxIfSaisieEtiquette() {
		return (
			!this.estContexteModeCollaboratif &&
			this.optionsAffichage.avecSaisieEtiquette
		);
	}
	jsxGetHtmlEtiquette() {
		const lStrEtiquettes = [];
		if (!!this.donnees.QCM && !!this.donnees.QCM.categories) {
			this.donnees.QCM.categories.parcourir((aEtiquette) => {
				lStrEtiquettes.push(
					UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
						aEtiquette.couleur,
						aEtiquette.abr,
					),
				);
			});
		}
		return lStrEtiquettes.length > 0 ? lStrEtiquettes.join(" ") : "&nbsp;";
	}
	jsxNodeInputTextEtiquette(aNode) {
		$(aNode).eventValidation(() => {
			this.surBoutonChoixEtiquettes();
		});
	}
	jsxModeleCheckboxPartagerQCM() {
		return {
			getValue: () => {
				return !!this.donnees.QCM ? !this.donnees.QCM.statutPrive : false;
			},
			setValue: (aValue) => {
				this.donnees.QCM.statutPrive = !aValue;
				this.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.verifierCoherencePourValider();
			},
		};
	}
	composeContenu() {
		const lHtmlThemes = [];
		if (this.avecThemes) {
			lHtmlThemes.push(
				IE.jsx.str(
					"div",
					{ class: "LigneChamp" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("Themes"),
						" :",
					),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identMultiSelectionTheme),
					}),
				),
			);
		}
		const lIdLibelle = GUID_1.GUID.getId();
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "ObjetFenetreEditionQCM" },
				IE.jsx.str(
					"div",
					{ class: "LigneChamp" },
					IE.jsx.str(
						"label",
						{ for: lIdLibelle },
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Libelle"),
					),
					IE.jsx.str(
						"div",
						{ class: "LigneChampValeur" },
						IE.jsx.str("input", {
							id: lIdLibelle,
							"ie-model": this.jsxModeleLibelle.bind(this),
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.HintLibelle",
							),
							spellcheck: "false",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "LigneChamp" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
					),
					IE.jsx.str(
						"div",
						{
							"ie-if": this.jsxIfSaisieMatiereParFenetre.bind(this),
							class: "LigneChampValeur ChampChoixParFenetre",
						},
						IE.jsx.str("div", {
							"ie-html": this.jsxGetHtmlMatiere.bind(this),
							class: "like-input AvecMain",
							"ie-node": this.jsxNodeInputTextMatiere.bind(this),
							tabindex: "0",
						}),
					),
					IE.jsx.str(
						"div",
						{
							"ie-if": this.jsxIfSaisieMatiereParCombo.bind(this),
							class: "LigneChampValeur",
						},
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelMatieres.bind(this),
							title: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.HintMatiere",
							),
						}),
					),
				),
				lHtmlThemes.join(""),
				IE.jsx.str(
					"div",
					{ "ie-if": this.jsxIfSaisieNiveau.bind(this), class: "LigneChamp" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Niveau"),
					),
					IE.jsx.str(
						"div",
						{ class: "LigneChampValeur ChampChoixParFenetre" },
						IE.jsx.str("div", {
							"ie-html": this.jsxGetHtmlNiveau.bind(this),
							class: "like-input AvecMain",
							"ie-node": this.jsxNodeInputTextNiveau.bind(this),
							tabindex: "0",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": this.jsxIfSaisieEtiquette.bind(this),
						class: "LigneChamp",
					},
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Categorie"),
					),
					IE.jsx.str(
						"div",
						{ class: "LigneChampValeur ChampChoixParFenetre" },
						IE.jsx.str("div", {
							"ie-html": this.jsxGetHtmlEtiquette.bind(this),
							class: "like-input AvecMain",
							"ie-node": this.jsxNodeInputTextEtiquette.bind(this),
							tabindex: "0",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "LigneChamp LigneChampPartage" },
					IE.jsx.str("i", {
						class: "icon_sondage_bibliotheque IconePartage",
						"aria-hidden": "true",
						role: "presentation",
					}),
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModeleCheckboxPartagerQCM.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.PartagerViaBiblioEtablissement",
						),
					),
				),
			),
		);
		return H.join("");
	}
	setContexteAffichage(aEstModeCollaboratif) {
		this.estContexteModeCollaboratif = aEstModeCollaboratif;
	}
	setDonnees(aQCM, aListeMatieres, aListeEtiquettes) {
		this.donnees.QCM = MethodesObjet_1.MethodesObjet.dupliquer(aQCM);
		this.avecModificationEtiquettes = false;
		this.donnees.listeEtiquettes = aListeEtiquettes;
		this.donnees.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
		this.donnees.listeMatieres.add(aListeMatieres);
		if (this.optionsAffichage.avecSaisieMatiereParCombo) {
			let lPere = null;
			this.donnees.listeMatieres.parcourir((aElement) => {
				if (lPere && aElement.cumul > lPere.cumul) {
					aElement.pere = lPere;
					lPere.listeMatieres.addElement(aElement);
				} else {
					lPere = aElement;
					lPere.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
					if (lPere) {
						lPere.listeMatieres.addElement(lPere);
					}
				}
				if (!aElement.libelleHtml) {
					aElement.libelleHtml = this._composeMatiereLibelleHTML(aElement);
				}
			});
		}
		if (this.avecThemes) {
			this.getInstance(this.identMultiSelectionTheme).setDonnees(
				this.donnees.QCM.ListeThemes ||
					new ObjetListeElements_1.ObjetListeElements(),
				!!this.donnees.QCM.matiere && this.donnees.QCM.matiere.getNumero()
					? this.donnees.QCM.matiere
					: null,
				this.donnees.QCM.libelleCBTheme,
			);
		}
		this.afficher();
		this.setBoutonActif(1, false);
	}
	addInstanceThemes() {}
	surBoutonChoixNiveau() {}
	surBoutonChoixMatiere() {
		const lThis = this;
		const lFenetreChoixMatiere =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionMatiere_1.ObjetFenetre_SelectionMatiere,
				{
					pere: lThis,
					evenement: function (
						aNumeroBouton,
						aIndiceSelection,
						aNumeroSelection,
					) {
						if (aNumeroBouton === 1) {
							const lMatiereSelectionnee =
								lThis.donnees.listeMatieres.getElementParNumero(
									aNumeroSelection,
								) || new ObjetElement_1.ObjetElement();
							lThis.donnees.QCM.matiere = lMatiereSelectionnee;
							lThis.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lThis.verifierCoherencePourValider();
						}
					},
					initialiser: function (aInstanceFenetre) {
						aInstanceFenetre.setOptionsFenetre({
							largeur: 300,
							hauteur: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						});
					},
				},
			);
		const lInfosListMatieres = {
			liste: lThis.donnees.listeMatieres,
			avecChoixFiltrageEnseignees: true,
			avecSelectionAucune: true,
			filtreEnseignees: null,
		};
		lFenetreChoixMatiere.setLibelleFiltreEnseignees(
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.UniquementMatieresEnseignees",
			),
		);
		lFenetreChoixMatiere.setDonnees(
			lInfosListMatieres.liste,
			lInfosListMatieres.avecChoixFiltrageEnseignees,
			lInfosListMatieres.avecSelectionAucune,
			lInfosListMatieres.filtreEnseignees,
		);
	}
	surBoutonChoixEtiquettes() {
		const lThis = this;
		const lFenetreSelectionEtiquettes =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionCategoriesQCM_1.ObjetFenetre_SelectionCategoriesQCM,
				{
					pere: lThis,
					evenement: function (aNumeroBouton, aDonnees) {
						if (aNumeroBouton === 1) {
							lThis.donnees.QCM.categories = !!aDonnees
								? aDonnees.etiquettesCochees
								: null;
							lThis.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lThis.verifierCoherencePourValider();
						} else if (
							aDonnees.avecModification &&
							!!aDonnees.listeToutesEtiquettes
						) {
							lThis.avecModificationEtiquettes = true;
							if (!!lThis.donnees.QCM.categories) {
								lThis.donnees.QCM.categories.parcourir((aEtiquette) => {
									const lEtiquetteModifiee =
										aDonnees.listeToutesEtiquettes.getElementParNumero(
											aEtiquette.getNumero(),
										);
									if (!!lEtiquetteModifiee) {
										aEtiquette.setLibelle(lEtiquetteModifiee.getLibelle());
										aEtiquette.abr = lEtiquetteModifiee.abr;
										aEtiquette.couleur = lEtiquetteModifiee.couleur;
									}
								});
								lThis.$refresh();
							}
						}
					},
				},
			);
		lFenetreSelectionEtiquettes.setDonnees(lThis.donnees.listeEtiquettes, {
			listeEtiquettesSelectionnees: lThis.donnees.QCM.categories,
			avecCocheSelection: true,
		});
	}
	surValidation(ANumeroBouton) {
		const lParametres = {
			QCM: this.donnees.QCM,
			avecModificationEtiquettes: false,
		};
		if (this.avecModificationEtiquettes) {
			lParametres.avecModificationEtiquettes = this.avecModificationEtiquettes;
		}
		this.callback.appel(ANumeroBouton, lParametres);
		this.fermer();
	}
	verifierCoherencePourValider() {
		let lEstBoutonValiderActif = false;
		const lQCM = this.donnees.QCM;
		if (!!lQCM) {
			const lLibelleOK = !!lQCM.getLibelle();
			const lMatiereOK =
				!this.estSaisieMatiereObligatoire ||
				(!!lQCM.matiere && lQCM.matiere.existeNumero());
			lEstBoutonValiderActif = lLibelleOK && lMatiereOK;
		}
		this.setBoutonActif(1, lEstBoutonValiderActif);
	}
	_composeMatiereLibelleHTML(aArticle) {
		const H = [];
		if (aArticle.couleur) {
			const lBorder =
				aArticle.cumul > 1
					? "border-radius:6px;"
					: "border-radius:6px 0 0 6px;";
			const lHeight = aArticle.cumul > 1 ? 6 : 25;
			const lStyles = ["min-width:6px;", "margin-right: 3px;"];
			lStyles.push(ObjetStyle_1.GStyle.composeHeight(lHeight));
			lStyles.push(ObjetStyle_1.GStyle.composeCouleurFond(aArticle.couleur));
			lStyles.push(lBorder);
			H.push(
				IE.jsx.str(
					"div",
					{ style: "display:flex; align-items:center;" },
					IE.jsx.str("div", { style: lStyles.join("") }),
					IE.jsx.str("div", null, aArticle.getLibelle()),
				),
			);
		} else {
			H.push(aArticle.getLibelle());
		}
		return H.join("");
	}
}
exports.ObjetFenetre_EditionQCM = ObjetFenetre_EditionQCM;

exports.ObjetFenetre_EditionTheme = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetIndexsUnique_1 = require("ObjetIndexsUnique");
class ObjetFenetre_EditionTheme extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.enCreation = false;
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: null,
			avecTailleSelonContenu: true,
			avecComposeBasInFooter: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Theme.titre.editionTheme",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				{
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					libelle: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				},
			],
		});
		this.ids = { btnTrash: GUID_1.GUID.getId() };
		this._indexsUnique = new ObjetIndexsUnique_1.ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle", "matiere.Numero"]);
	}
	jsxModeleBoutonSupprimer() {
		return {
			event: () => {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: this.theme.estUtiliseParAuteur
						? ObjetTraduction_1.GTraductions.getValeur(
								"Theme.msg.confSupprThemeUtiliseAuteur",
								this.theme.getLibelle(),
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Theme.msg.confSupprTheme",
							),
					callback: (aGenreAction) => {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							this.theme.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							this.theme.cmsActif = false;
							this.fermer();
							this.callback.appel(this.theme);
						}
					},
				});
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur("Supprimer");
			},
		};
	}
	jsxModelLibelleTheme() {
		return {
			getValue: () => {
				this.setBoutonActif(1, !!(!!this.theme && !!this.theme.getLibelle()));
				return this.theme ? this.theme.getLibelle() : "";
			},
			setValue: (aValue) => {
				if (this.theme) {
					aValue = aValue.replaceAll("\n", "");
					this.theme.setLibelle(aValue);
					this.enModification = true;
				}
			},
		};
	}
	jsxModelBtnSelecteurMatiere() {
		return {
			event: () => {
				this.surBoutonChoixMatiere();
			},
			getLibelle: () => {
				let lStrMatiere = "";
				if (this.theme && this.theme.matiere) {
					lStrMatiere = this.theme.matiere.getLibelle();
				}
				return lStrMatiere || "";
			},
		};
	}
	composeContenu() {
		const T = [];
		const lIdMatiere = GUID_1.GUID.getId();
		const lIdLibelleTheme = GUID_1.GUID.getId();
		T.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols" },
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ id: lIdMatiere, class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("Theme.label.matiere"),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": this.jsxModelBtnSelecteurMatiere.bind(this),
						"aria-labelledby": lIdMatiere,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ id: lIdLibelleTheme, class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("Theme.label.libelle"),
					),
					IE.jsx.str("ie-textareamax", {
						"aria-labelledby": lIdLibelleTheme,
						"ie-autoresize": true,
						"ie-model": this.jsxModelLibelleTheme.bind(this),
						class: "full-width",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"Theme.label.redigerMatiere",
						),
						maxlength: this.tailleLibelleTheme,
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"Theme.label.redigerMatiere",
						),
					}),
				),
			),
		);
		return T.join("");
	}
	setDonnees(aParams, aParametres) {
		this.theme = aParams.article
			? MethodesObjet_1.MethodesObjet.dupliquer(aParams.article)
			: new ObjetElement_1.ObjetElement();
		this.listeMatieres = aParametres.listeMatieres;
		this.tailleLibelleTheme = aParametres.tailleLibelleTheme;
		this.listeThemes = aParametres.listeThemes;
		if (aParametres.enCreation) {
			this.enCreation = true;
			ObjetHtml_1.GHtml.setDisplay(this.ids.btnTrash, false);
			this.theme.matiere = aParametres.matiereContexte;
		}
		this.enModification = false;
		this.afficher(this.composeContenu());
		this.positionnerFenetre();
	}
	composeBas() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ id: this.ids.btnTrash, class: "compose-bas" },
				IE.jsx.str("ie-btnicon", {
					"ie-model": this.jsxModeleBoutonSupprimer.bind(this),
					class: "icon_trash avecFond i-medium",
				}),
			),
		);
		return H.join("");
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			let lTestLibelleExisteDeja = false;
			if (this.listeThemes) {
				const lElement = this.theme;
				this.listeThemes.parcourir((aElement) => {
					if (
						!aElement.egalParNumeroEtGenre(
							lElement.getNumero(),
							lElement.getGenre(),
						) &&
						aElement.Etat !== Enumere_Etat_1.EGenreEtat.Suppression
					) {
						if (this._indexsUnique.estDoublon(lElement, aElement)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = ObjetTraduction_1.GTraductions.getValeur(
					"Theme.msg.doublon",
					[this.theme.getLibelle(), this.theme.matiere.getLibelle()],
				);
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lMessageDoublon,
				});
				return;
			}
			if (this.theme.estMixte) {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: `<div>${ObjetTraduction_1.GTraductions.getValeur("Theme.msg.modifThemeMixte")}</div><div class="EspaceHaut">${ObjetTraduction_1.GTraductions.getValeur("Theme.msg.confModifTheme")}</div>`,
					callback: function (aGenreAction) {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							lThis.fermer();
							if (lThis.enCreation) {
								lThis.theme.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
							} else if (lThis.enModification) {
								lThis.theme.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							}
							lThis.callback.appel(lThis.theme);
						}
					},
				});
			} else {
				this.fermer();
				if (this.enCreation) {
					this.theme.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				} else if (this.enModification) {
					this.theme.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				this.callback.appel(this.theme);
			}
		} else {
			this.fermer();
		}
	}
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
								this.listeMatieres.getElementParNumero(aNumeroSelection) ||
								new ObjetElement_1.ObjetElement();
							lThis.theme.matiere = lMatiereSelectionnee;
							lThis.enModification = true;
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
			liste: this.listeMatieres,
			avecChoixFiltrageEnseignees: ![
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			].includes(GEtatUtilisateur.GenreEspace),
			avecSelectionAucune: false,
		};
		lFenetreChoixMatiere.libelleFiltreEnseignees =
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.UniquementMatieresEnseignees",
			);
		lFenetreChoixMatiere.setDonnees(
			lInfosListMatieres.liste,
			lInfosListMatieres.avecChoixFiltrageEnseignees,
			lInfosListMatieres.avecSelectionAucune,
			undefined,
		);
	}
}
exports.ObjetFenetre_EditionTheme = ObjetFenetre_EditionTheme;

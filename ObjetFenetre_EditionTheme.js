const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
	ObjetFenetre_SelectionMatiere,
} = require("ObjetFenetre_SelectionMatiere.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetIndexsUnique } = require("ObjetIndexsUnique.js");
class ObjetFenetre_EditionTheme extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: null,
			avecTailleSelonContenu: true,
			avecComposeBasInFooter: true,
			titre: GTraductions.getValeur("Theme.titre.editionTheme"),
			listeBoutons: [
				GTraductions.getValeur("Fermer"),
				{
					theme: TypeThemeBouton.primaire,
					libelle: GTraductions.getValeur("Modifier"),
				},
			],
		});
		this.ids = { btnTrash: GUID.getId() };
		this._indexsUnique = new ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle", "matiere.Numero"]);
		this.enCreation = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnTrash: {
				event: function () {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: aInstance.theme.estUtiliseParAuteur
							? GTraductions.getValeur(
									"Theme.msg.confSupprThemeUtiliseAuteur",
									aInstance.theme.getLibelle(),
								)
							: GTraductions.getValeur("Theme.msg.confSupprTheme"),
						callback: function (aGenreAction) {
							if (aGenreAction === EGenreAction.Valider) {
								aInstance.theme.setEtat(EGenreEtat.Suppression);
								aInstance.theme.cmsActif = false;
								aInstance.fermer();
								aInstance.callback.appel(aInstance.theme);
							}
						},
					});
				},
				hint: function () {
					return GTraductions.getValeur("Supprimer");
				},
			},
			LibelleTheme: {
				getValue: function () {
					aInstance.setBoutonActif(
						1,
						!!(!!aInstance.theme && !!aInstance.theme.getLibelle()),
					);
					return aInstance.theme ? aInstance.theme.getLibelle() : "";
				},
				setValue: function (aValue) {
					if (aInstance.theme) {
						aValue = aValue.replaceAll("\n", "");
						aInstance.theme.setLibelle(aValue);
						aInstance.enModification = true;
					}
				},
			},
			getMatiere: {
				getLibelle: function () {
					let lStrMatiere = "";
					if (!!aInstance.theme && !!aInstance.theme.matiere) {
						lStrMatiere = aInstance.theme.matiere.getLibelle();
					}
					return lStrMatiere || "";
				},
			},
			Matiere: {
				getHtmlMatiere: function () {
					let lStrMatiere = "";
					if (!!aInstance.theme && !!aInstance.theme.matiere) {
						lStrMatiere = aInstance.theme.matiere.getLibelle();
					}
					return lStrMatiere || "&nbsp;";
				},
				nodeInputTexte: function () {
					$(this.node).eventValidation(() => {
						aInstance.surBoutonChoixMatiere();
					});
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		const lIdMatiere = GUID.getId();
		T.push(
			`<div class="flex-contain cols">\n    <div class="field-contain label-up">\n    <label id="${lIdMatiere}" class="ie-titre-petit">${GTraductions.getValeur("Theme.label.matiere")}</label>\n    <ie-btnselecteur ie-model="getMatiere" ie-node="Matiere.nodeInputTexte" aria-labelledby="${lIdMatiere}"></ie-btnselecteur>\n    </div>`,
		);
		T.push(
			tag(
				"div",
				{ class: "field-contain label-up" },
				tag(
					"label",
					{ class: "ie-titre-petit" },
					GTraductions.getValeur("Theme.label.libelle"),
				),
				tag("ie-textareamax", {
					"ie-autoresize": true,
					type: "text",
					"ie-model": "LibelleTheme",
					class: "full-width round-style",
					title: GTraductions.getValeur("Theme.label.redigerMatiere"),
					maxlength: this.tailleLibelleTheme,
					placeholder: GTraductions.getValeur("Theme.label.redigerMatiere"),
				}),
			),
		);
		T.push(`</div>`);
		return T.join("");
	}
	setDonnees(aParams, aParametres) {
		this.theme = aParams.article
			? MethodesObjet.dupliquer(aParams.article)
			: new ObjetElement();
		this.listeMatieres = aParametres.listeMatieres;
		this.tailleLibelleTheme = aParametres.tailleLibelleTheme;
		this.listeThemes = aParametres.listeThemes;
		if (aParametres.enCreation) {
			this.enCreation = true;
			GHtml.setDisplay(this.ids.btnTrash, false);
			this.theme.matiere = aParametres.matiereContexte;
		}
		this.enModification = false;
		this.afficher(this.composeContenu());
		this.positionnerFenetre();
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			`<div id="${this.ids.btnTrash}" class="compose-bas">\n                    <ie-btnicon ie-model="btnTrash" ie-hint="btnTrash.hint" class="icon_trash avecFond i-medium"></ie-btnicon>\n                </div>`,
		);
		return lHTML.join("");
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
						aElement.Etat !== EGenreEtat.Suppression
					) {
						if (this._indexsUnique.estDoublon(lElement, aElement)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = GTraductions.getValeur("Theme.msg.doublon", [
					this.theme.getLibelle(),
					this.theme.matiere.getLibelle(),
				]);
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: lMessageDoublon,
				});
				return;
			}
			if (this.theme.estMixte) {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: `<div>${GTraductions.getValeur("Theme.msg.modifThemeMixte")}</div><div class="EspaceHaut">${GTraductions.getValeur("Theme.msg.confModifTheme")}</div>`,
					callback: function (aGenreAction) {
						if (aGenreAction === EGenreAction.Valider) {
							lThis.fermer();
							if (lThis.enCreation) {
								lThis.theme.setEtat(EGenreEtat.Creation);
							} else if (lThis.enModification) {
								lThis.theme.setEtat(EGenreEtat.Modification);
							}
							lThis.callback.appel(lThis.theme);
						}
					},
				});
			} else {
				this.fermer();
				if (this.enCreation) {
					this.theme.setEtat(EGenreEtat.Creation);
				} else if (this.enModification) {
					this.theme.setEtat(EGenreEtat.Modification);
				}
				this.callback.appel(this.theme);
			}
		} else {
			this.fermer();
		}
	}
	surBoutonChoixMatiere() {
		const lThis = this;
		const lFenetreChoixMatiere = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionMatiere,
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
							new ObjetElement();
						lThis.theme.matiere = lMatiereSelectionnee;
						lThis.enModification = true;
					}
				},
				initialiser: function (aInstanceFenetre) {
					aInstanceFenetre.setOptionsFenetre({
						titre: GTraductions.getValeur("Theme.titre.matiere"),
						largeur: 300,
						hauteur: 400,
						listeBoutons: [GTraductions.getValeur("Fermer")],
					});
				},
			},
		);
		const lInfosListMatieres = {
			liste: this.listeMatieres,
			avecChoixFiltrageEnseignees: ![
				EGenreEspace.Etablissement,
				EGenreEspace.Mobile_Etablissement,
			].includes(GEtatUtilisateur.GenreEspace),
			avecSelectionAucune: false,
		};
		lFenetreChoixMatiere.libelleFiltreEnseignees = GTraductions.getValeur(
			"SaisieQCM.UniquementMatieresEnseignees",
		);
		lFenetreChoixMatiere.setDonnees(
			lInfosListMatieres.liste,
			lInfosListMatieres.avecChoixFiltrageEnseignees,
			lInfosListMatieres.avecSelectionAucune,
			lInfosListMatieres.filtreEnseignees,
		);
	}
}
module.exports = ObjetFenetre_EditionTheme;

exports.DonneesListe_Forum_ListeSujets = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_Forum_ListeSujets extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aFiltres) {
		super(aDonnees);
		this.filtres = aFiltres;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_ModificationSelection: true,
		});
	}
	getOptionsComboFiltre() {
		return {
			longueur: "100%",
			getContenuCellule(aElement) {
				return aElement.getLibelle();
			},
			getContenuElement(aParams) {
				return aParams.element.getLibelle();
			},
		};
	}
	getElementGeneriqueComboFiltre(aParametres) {
		return aParametres.element &&
			aParametres.element.getNumero() !== this.filtres.c_ident_filtre_tous
			? aParametres.element
			: null;
	}
	jsxComboModelFiltreMatieres() {
		return {
			init: (aCombo) => {
				aCombo.setDonneesObjetSaisie({
					liste: this.filtres.listeMatieresDisponibles,
					options: Object.assign(
						{
							libelleHaut: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
						},
						this.getOptionsComboFiltre(),
					),
				});
			},
			getIndiceSelection: () => {
				let lIndice = 0;
				if (this.filtres.matiereSelec) {
					lIndice =
						this.filtres.listeMatieresDisponibles.getIndiceParNumeroEtGenre(
							this.filtres.matiereSelec.getNumero(),
						) || 0;
				}
				return lIndice;
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle) {
					this.filtres.matiereSelec =
						this.getElementGeneriqueComboFiltre(aParams);
					this.paramsListe.actualiserListe();
				}
			},
		};
	}
	jsxComboModelFiltreThemes() {
		return {
			init: (aCombo) => {
				aCombo.setDonneesObjetSaisie({
					liste: this.filtres.listeThemesDisponibles,
					options: Object.assign(
						{
							libelleHaut:
								ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Theme"),
						},
						this.getOptionsComboFiltre(),
					),
				});
			},
			getIndiceSelection: () => {
				let lIndice = 0;
				if (this.filtres.themeSelec) {
					lIndice =
						this.filtres.listeThemesDisponibles.getIndiceParNumeroEtGenre(
							this.filtres.themeSelec.getNumero(),
						) || 0;
				}
				return lIndice;
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle) {
					this.filtres.themeSelec =
						this.getElementGeneriqueComboFiltre(aParams);
					this.paramsListe.actualiserListe();
				}
			},
		};
	}
	jsxComboModelModeration() {
		return {
			init: (aCombo) => {
				aCombo.setDonneesObjetSaisie({
					liste: this.filtres.listeModerationsDisponibles,
					options: Object.assign(
						{
							libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.TitreListeSujet",
							),
						},
						this.getOptionsComboFiltre(),
					),
				});
			},
			getIndiceSelection: () => {
				let lIndice = 0;
				if (this.filtres.moderationSelec) {
					lIndice =
						this.filtres.listeModerationsDisponibles.getIndiceParNumeroEtGenre(
							this.filtres.moderationSelec.getNumero(),
						) || 0;
				}
				return lIndice;
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle) {
					this.filtres.moderationSelec =
						this.getElementGeneriqueComboFiltre(aParams);
					this.paramsListe.actualiserListe();
				}
			},
		};
	}
	construireFiltres() {
		const H = [];
		if (
			this.filtres.listeMatieresDisponibles &&
			this.filtres.listeMatieresDisponibles.count() > 0
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelFiltreMatieres.bind(this),
						class: "combo-mobile on-mobile full-width",
					}),
				),
			);
		}
		if (
			this.filtres.listeThemesDisponibles &&
			this.filtres.listeThemesDisponibles.count() > 0
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelFiltreThemes.bind(this),
						class: "combo-mobile on-mobile full-width",
					}),
				),
			);
		}
		if (
			this.filtres.listeModerationsDisponibles &&
			this.filtres.listeModerationsDisponibles.count() > 0
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelModeration.bind(this),
						class: "combo-mobile on-mobile full-width",
					}),
				),
			);
		}
		return H.join("");
	}
	reinitFiltres() {
		if (this.filtres.listeMatieresDisponibles) {
			this.filtres.matiereSelec = null;
		}
		if (this.filtres.listeThemesDisponibles) {
			this.filtres.themeSelec = null;
		}
		if (this.filtres.listeModerationsDisponibles) {
			this.filtres.moderationSelec = null;
		}
		this.paramsListe.actualiserListe();
	}
	estFiltresParDefaut() {
		return (
			(!this.filtres.listeMatieresDisponibles || !this.filtres.matiereSelec) &&
			(!this.filtres.listeThemesDisponibles || !this.filtres.themeSelec) &&
			(!this.filtres.listeModerationsDisponibles ||
				!this.filtres.moderationSelec)
		);
	}
	getVisible(aArticle) {
		if (this.filtres.matiereSelec) {
			const lNumeroMatiereFiltre = this.filtres.matiereSelec.getNumero();
			if (
				(aArticle.matiere &&
					lNumeroMatiereFiltre === this.filtres.c_ident_filter_aucun) ||
				(!aArticle.matiere &&
					lNumeroMatiereFiltre !== this.filtres.c_ident_filter_aucun)
			) {
				return false;
			}
			if (
				aArticle.matiere &&
				aArticle.matiere.getNumero() !== lNumeroMatiereFiltre
			) {
				return false;
			}
		}
		if (
			this.filtres.themeSelec &&
			aArticle.listeThemes &&
			!aArticle.listeThemes.getElementParElement(this.filtres.themeSelec)
		) {
			return false;
		}
		if (this.filtres.moderationSelec) {
			const lFiltreRole = (aSujet, aRole) => {
				switch (aRole) {
					case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur:
						return aSujet.roles.contains(aRole);
					case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur:
						return (
							aSujet.roles.contains(
								TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
							) &&
							!aSujet.roles.contains(
								TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
							)
						);
					case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Membre:
						return (
							aSujet.roles.contains(
								TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Membre,
							) &&
							!aSujet.roles.contains(
								TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
							) &&
							!aSujet.roles.contains(
								TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
							)
						);
					case TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur:
						return aSujet.roles.count() === 1 && aSujet.roles.contains(aRole);
				}
			};
			if (!lFiltreRole(aArticle, this.filtres.moderationSelec.getNumero())) {
				return false;
			}
		}
		return true;
	}
	getZoneGauche(aParams) {
		let lStyle = "";
		if (aParams.article.matiere) {
			lStyle = "--color-line: " + aParams.article.matiere.couleur + ";";
		}
		return IE.jsx.str("div", {
			class: "couleur-matiere ie-line-color static only-color",
			style: lStyle,
		});
	}
	getTitreZonePrincipale(aParams) {
		return (
			aParams.article.titre ||
			ObjetTraduction_1.GTraductions.getValeur("ForumPeda.SansTitre")
		);
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.infosSuppZonePrincipale
		) {
			return `${aParams.article.strAuteur} - ${this.options.moteurForum.getStrNbParticipantsSujet(aParams.article)}`;
		}
	}
	getZoneComplementaire(aParams) {
		const lHIcones = [];
		if (aParams.article.nbNonLu > 0) {
			lHIcones.push(
				IE.jsx.str(
					"span",
					{
						class: "compteur-nlu",
						"ie-tooltiplabel":
							aParams.article.nbNonLu +
							" " +
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.HintNouveauxPosts",
							),
					},
					aParams.article.nbNonLu,
				),
			);
		}
		if (aParams.article.nbAModerer > 0) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_warning_sign",
					"ie-tooltiplabel":
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.AModerer"),
					role: "img",
				}),
			);
		}
		if (aParams.article.nbExclus > 0) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_user mix-icon_ne_pas_deranger",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.HintBloque_D",
						[aParams.article.nbExclus],
					),
					role: "img",
				}),
			);
		}
		if (
			aParams.article.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Ferme
		) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_time",
					"ie-tooltiplabel":
						this.options.moteurForum.getStrMessageParticipationFermee(
							aParams.article,
						),
					role: "img",
				}),
			);
		}
		if (
			aParams.article.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Verrou
		) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_lock",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ForumVerrouille",
					),
					role: "img",
				}),
			);
		}
		const H = [];
		if (lHIcones.length > 0) {
			H.push(
				IE.jsx.str("div", { class: "icones-conteneur" }, lHIcones.join("")),
			);
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const H = [];
		if (
			aParams.article.etatPub ===
			TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu
		) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.SujetSuspendu"),
				),
			);
		}
		if (
			aParams.article.roles.contains(
				TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
			)
		) {
			let lStrModerationAvApPublication;
			if (
				aParams.article.genreModeration ===
				TypesForumPedagogique_1.TypeGenreModerationForum.GMF_APriori
			) {
				lStrModerationAvApPublication =
					ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ModerationAvantPub",
					);
			} else {
				lStrModerationAvApPublication =
					ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ModerationApresPub",
					);
			}
			H.push(
				IE.jsx.str(
					"p",
					{ class: "color-theme-foncee" },
					lStrModerationAvApPublication,
				),
			);
		}
		if (aParams.article.estExclu) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ParticipationBloque",
					),
				),
			);
		}
		return H.join("");
	}
	avecBoutonActionLigne(aParams) {
		return (
			this.options.moteurForum.getCommandesMenuContextuelSujet(aParams.article)
				.length > 0
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		this.options.moteurForum.addCommandesMenuContextuelSujet(aParametres);
		aParametres.menuContextuel.setDonnees(aParametres.id);
	}
	estLigneOff(aParams) {
		return (
			aParams.article.etatPub !==
				TypesForumPedagogique_1.TypeEtatPub.EP_Ouvert ||
			aParams.article.estExclu ||
			(aParams.article.roles.count() === 1 &&
				aParams.article.roles.contains(
					TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur,
				))
		);
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init(
				"dateTri",
				ObjetTri_1.ObjetTri.genreTri.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
}
exports.DonneesListe_Forum_ListeSujets = DonneesListe_Forum_ListeSujets;

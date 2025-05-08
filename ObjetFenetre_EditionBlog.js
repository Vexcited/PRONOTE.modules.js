exports.ObjetFenetre_EditionBlog = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const GUID_1 = require("GUID");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
class ObjetFenetre_EditionBlog extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = { blog: null };
		this.moteurBlog = new ObjetMoteurBlog_1.ObjetMoteurBlog();
		this.setOptionsFenetre({
			largeur: 500,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnSupprimerBlog() {
				return (
					aInstance.donnees.blog &&
					aInstance.donnees.blog.getEtat() !==
						Enumere_Etat_1.EGenreEtat.Creation
				);
			},
			btnSupprimerBlog: {
				event() {
					if (aInstance.donnees.blog) {
						aInstance.donnees.blog.setEtat(
							Enumere_Etat_1.EGenreEtat.Suppression,
						);
						aInstance.surValidation(1);
					}
				},
				getDisabled() {
					return (
						!aInstance.donnees.blog || !aInstance.donnees.blog.estSupprimable
					);
				},
			},
			modelTitreBlog: {
				getValue() {
					var _a;
					return (
						((_a = aInstance.donnees.blog) === null || _a === void 0
							? void 0
							: _a.getLibelle()) || ""
					);
				},
				setValue(aValeur) {
					if (aInstance.donnees.blog) {
						aInstance.donnees.blog.setLibelle(aValeur);
						aInstance.donnees.blog.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			btnSelecteurModerateurs: {
				event(aGenreRessource) {
					if (aInstance.donnees.blog) {
						aInstance.moteurBlog.ouvrirFenetreChoixModerateursBlog(
							aInstance.donnees.blog,
							aGenreRessource,
							() => {
								aInstance.donnees.blog.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							},
						);
					}
				},
				getLibelle(aGenreRessource) {
					const lListeModerateurs = aInstance.moteurBlog.getModerateursDeGenre(
						aInstance.donnees.blog,
						aGenreRessource,
					);
					return lListeModerateurs
						? lListeModerateurs.getTableauLibelles().join(" ")
						: "";
				},
			},
			identiteDateFinRedaction() {
				return {
					class: ObjetCelluleDate_1.ObjetCelluleDate,
					pere: aInstance,
					init(aCelluleDate) {
						aCelluleDate.setOptionsObjetCelluleDate({
							premiereDateSaisissable: ObjetDate_1.GDate.getDateCourante(),
						});
					},
					start(aCelluleDate) {
						if (aInstance.donnees.blog) {
							aCelluleDate.setDonnees(
								aInstance.donnees.blog.dateFinRedactionBillet,
							);
						}
					},
					evenement(aDate) {
						if (aInstance.donnees.blog) {
							aInstance.donnees.blog.dateFinRedactionBillet = aDate;
							aInstance.donnees.blog.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					},
				};
			},
			btnSelecteurRedacteurs: {
				event(aGenreRessource) {
					if (aInstance.donnees.blog) {
						aInstance.moteurBlog.ouvrirFenetreChoixRedacteursBlog(
							aInstance.donnees.blog,
							aGenreRessource,
							() => {
								aInstance.donnees.blog.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							},
						);
					}
				},
				getLibelle(aGenreRessource) {
					const lListeRedacteurs = aInstance.moteurBlog.getRedacteursDeGenre(
						aInstance.donnees.blog,
						aGenreRessource,
					);
					return lListeRedacteurs
						? lListeRedacteurs.getTableauLibelles().join(" ")
						: "";
				},
			},
			cbAutoriserCommentaires: {
				getValue() {
					var _a;
					return (_a = aInstance.donnees.blog) === null || _a === void 0
						? void 0
						: _a.autoriserCommentaires;
				},
				setValue(aValeur) {
					if (aInstance.donnees.blog) {
						aInstance.donnees.blog.autoriserCommentaires = aValeur;
						aInstance.donnees.blog.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			btnSelecteurPublic: {
				event(aGenreRessource) {
					aInstance.moteurBlog.ouvrirFenetreChoixPublicsBlog(
						aInstance.donnees.blog,
						aGenreRessource,
						() => {
							aInstance.donnees.blog.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						},
					);
				},
				getLibelle(aGenreRessource) {
					const lListePublic = aInstance.moteurBlog.getPublicsDeGenre(
						aInstance.donnees.blog,
						aGenreRessource,
					);
					return lListePublic
						? lListePublic.getTableauLibelles().join(" ")
						: "";
				},
			},
		});
	}
	setDonnees(aBlog) {
		this.donnees.blog = aBlog;
		this.afficher(this.composeContenu());
	}
	getMessageDonneesBlogInvalides() {
		if (this.donnees.blog) {
			if (!this.donnees.blog.getLibelle()) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.fenetreEditionBlog.MsgAucunTitreBlog",
				);
			}
			if (
				!this.donnees.blog.listeModerateurs ||
				this.donnees.blog.listeModerateurs.count() === 0
			) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.fenetreEditionBlog.MsgAucunModerateur",
				);
			}
			if (
				!this.donnees.blog.listeRedacteurs ||
				this.donnees.blog.listeRedacteurs.count() === 0
			) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.fenetreEditionBlog.MsgAucunRedacteur",
				);
			}
		}
		return "";
	}
	surValidation(aGenreBouton) {
		const lAction =
			aGenreBouton === 1
				? Enumere_Action_1.EGenreAction.Valider
				: Enumere_Action_1.EGenreAction.Annuler;
		if (lAction === Enumere_Action_1.EGenreAction.Valider) {
			const lMessageDonneesBlogInvalides =
				this.getMessageDonneesBlogInvalides();
			if (lMessageDonneesBlogInvalides) {
				GApplication.getMessage().afficher({
					message: lMessageDonneesBlogInvalides,
				});
			} else {
				this.lancerCallbackEtFermetureFenetre(lAction);
			}
		} else {
			this.lancerCallbackEtFermetureFenetre(lAction);
		}
	}
	lancerCallbackEtFermetureFenetre(aAction) {
		this.callback.appel(aAction, this.donnees.blog);
		this.fermer();
	}
	composeContenu() {
		const T = [];
		T.push("<div>");
		T.push(
			this.composeZoneElementsGraphique(
				this.getTitreZoneObligatoire(
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.Descriptif",
					),
					true,
				),
				this.composeElementsDescriptif(),
			),
		);
		T.push(
			this.composeZoneElementsGraphique(
				this.getTitreZoneObligatoire(
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.Moderateurs",
					),
					true,
				),
				this.composeElementsModerateurs(),
			),
		);
		T.push(
			this.composeZoneElementsGraphique(
				this.getTitreZoneObligatoire(
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.Redacteurs",
					),
					true,
				),
				this.composeElementsRedacteurs(),
			),
		);
		T.push(
			this.composeZoneElementsGraphique(
				this.getTitreZoneObligatoire(
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.Public",
					),
				),
				this.composeElementsPublic(),
			),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "MarqueurChampsObligatoires" },
					ObjetTraduction_1.GTraductions.getValeur(
						"MarqueurChampsObligatoires",
					),
					" ",
					ObjetTraduction_1.GTraductions.getValeur("ChampsObligatoires"),
				),
			),
		);
		T.push("</div>");
		return T.join("");
	}
	composeBas() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "compose-bas", "ie-if": "avecBtnSupprimerBlog" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnSupprimerBlog",
						title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						class: "icon_trash avecFond i-medium",
					}),
				),
			),
		);
		return H.join("");
	}
	getTitreZoneObligatoire(aTitre, aEstZoneObligatoire = false) {
		return (
			aTitre +
			(aEstZoneObligatoire
				? " " +
					ObjetTraduction_1.GTraductions.getValeur("MarqueurChampsObligatoires")
				: "")
		);
	}
	composeZoneElementsGraphique(aTitreZone, aHtmlElementsGraphique) {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str("legend", null, aTitreZone),
					aHtmlElementsGraphique,
				),
			),
		);
		return H.join("");
	}
	composeElementsDescriptif() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Titre",
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("input", {
							"ie-model": "modelTitreBlog",
							class: "round-style full-width",
						}),
					),
				),
			),
		);
		return H.join("");
	}
	composeElementsModerateurs() {
		const lIdProfesseurs = "lblModProfs" + GUID_1.GUID.getId();
		const lIdPersonnels = "lblModPersonnels" + GUID_1.GUID.getId();
		const lIeModelBtnSelecteurModerateursProf =
			"btnSelecteurModerateurs(" +
			Enumere_Ressource_1.EGenreRessource.Enseignant +
			")";
		const lIeModelBtnSelecteurModerateursPersonnel =
			"btnSelecteurModerateurs(" +
			Enumere_Ressource_1.EGenreRessource.Personnel +
			")";
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "RolesIndividus" },
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.RoleModerateurs",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdProfesseurs },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Profs",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurModerateursProf,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdProfesseurs,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdPersonnels },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Personnels",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurModerateursPersonnel,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdPersonnels,
					}),
				),
			),
		);
		return H.join("");
	}
	composeElementsRedacteurs() {
		const lIdEleves = "lblRedEleves" + GUID_1.GUID.getId();
		const lIdProfesseurs = "lblRedProfs" + GUID_1.GUID.getId();
		const lIdPersonnels = "lblRedPersonnels" + GUID_1.GUID.getId();
		const lIeModelBtnSelecteurRedacteursEleve =
			"btnSelecteurRedacteurs(" +
			Enumere_Ressource_1.EGenreRessource.Eleve +
			")";
		const lIeModelBtnSelecteurRedacteursProf =
			"btnSelecteurRedacteurs(" +
			Enumere_Ressource_1.EGenreRessource.Enseignant +
			")";
		const lIeModelBtnSelecteurRedacteursPersonnel =
			"btnSelecteurRedacteurs(" +
			Enumere_Ressource_1.EGenreRessource.Personnel +
			")";
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "RolesIndividus" },
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.RoleRedacteursJusquau",
					),
					" ",
					IE.jsx.str("div", {
						class: "SelecteurDateFinRedaction",
						"ie-identite": "identiteDateFinRedaction",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdEleves },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Eleves",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurRedacteursEleve,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdEleves,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdProfesseurs },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Profs",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurRedacteursProf,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdProfesseurs,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdPersonnels },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Personnels",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurRedacteursPersonnel,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdPersonnels,
					}),
				),
			),
		);
		return H.join("");
	}
	composeElementsPublic() {
		const lIdEleves = "lblPubEleves" + GUID_1.GUID.getId();
		const lIdProfesseurs = "lblPubProfs" + GUID_1.GUID.getId();
		const lIdPersonnels = "lblPubPersonnels" + GUID_1.GUID.getId();
		const lIeModelBtnSelecteurPublicsEleve =
			"btnSelecteurPublic(" + Enumere_Ressource_1.EGenreRessource.Eleve + ")";
		const lIeModelBtnSelecteurPublicsProf =
			"btnSelecteurPublic(" +
			Enumere_Ressource_1.EGenreRessource.Enseignant +
			")";
		const lIeModelBtnSelecteurPublicsPersonnel =
			"btnSelecteurPublic(" +
			Enumere_Ressource_1.EGenreRessource.Personnel +
			")";
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "RolesIndividus" },
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.fenetreEditionBlog.RolePublic",
					),
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbAutoriserCommentaires" },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.AutoriserCommentaires",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdEleves },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.ElevesFamilles",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurPublicsEleve,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdEleves,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdProfesseurs },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Profs",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurPublicsProf,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdProfesseurs,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdPersonnels },
						ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.Personnels",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": lIeModelBtnSelecteurPublicsPersonnel,
						placeholder: ObjetTraduction_1.GTraductions.getValeur("Aucun"),
						"aria-labelledby": lIdPersonnels,
					}),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetFenetre_EditionBlog = ObjetFenetre_EditionBlog;

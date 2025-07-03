exports.DonneesListe_TypeAffRemplacements =
	exports.DonneesListe_RemplacementsEnseignants = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const Type3Etats_1 = require("Type3Etats");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const GUID_1 = require("GUID");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const MoteurRemplacementsEnseignants_1 = require("MoteurRemplacementsEnseignants");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetElement_1 = require("ObjetElement");
const TypeGenreCoursRemplacable_1 = require("TypeGenreCoursRemplacable");
class DonneesListe_RemplacementsEnseignants extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.idLabel = GUID_1.GUID.getId();
		this.setOptions({
			avecSelection: false,
			avecEvnt_Selection: false,
			avecDeploiement: true,
			avecFusionLignePereFils: false,
		});
		this.callback = aParams.evenement;
		this.moteur = aParams.moteur;
	}
	avecBoutonActionLigne(aParams) {
		return (
			!this.estUnDeploiement(aParams) &&
			[
				TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence,
				TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_suggestion,
			].includes(aParams.article.getGenre())
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		const lEstVolontariat =
			aParametres.article.getGenre() ===
			TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence;
		const lAvecAfficherModifierCommentaire =
			aParametres.article.genreReponse === Type3Etats_1.Type3Etats.TE_Oui;
		const lLibelle = lAvecAfficherModifierCommentaire
			? ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.volontaire.retirer",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.volontaire.postuler",
				);
		if (lEstVolontariat) {
			aParametres.menuContextuel.add(lLibelle, true, () => {
				if (lAvecAfficherModifierCommentaire) {
					this.validerRetirerDemande(aParametres.article);
				} else {
					this.ouvrirFenetreCommentaire(aParametres.article);
				}
			});
		} else {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.proposition.Accepter",
				),
				!lAvecAfficherModifierCommentaire,
				() => {
					this.ouvrirFenetreCommentaire(aParametres.article);
				},
			);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.proposition.Refuser",
				),
				aParametres.article.genreReponse !== Type3Etats_1.Type3Etats.TE_Non,
				() => {
					aParametres.article.genreReponse = Type3Etats_1.Type3Etats.TE_Non;
					aParametres.article.commentaire = "";
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.saisie,
						{
							genreLigne: aParametres.article.getGenre(),
							cours: aParametres.article.cours,
							annulation: aParametres.article.annulation,
							cycle: aParametres.article.cycle,
							genreReponse: aParametres.article.genreReponse,
							commentaire: aParametres.article.commentaire,
						},
					);
				},
			);
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur(
				"RemplacementsEnseignants.volontaire.editercommentaire",
			),
			lAvecAfficherModifierCommentaire,
			() => {
				this.ouvrirFenetreCommentaire(aParametres.article);
			},
		);
		aParametres.menuContextuel.setDonnees();
	}
	jsxModeleCheckboxProposition(aRemplacement, aAccept) {
		return {
			getValue: () => {
				if (aRemplacement) {
					if (aAccept) {
						return (
							aRemplacement.genreReponse === Type3Etats_1.Type3Etats.TE_Oui
						);
					} else {
						return (
							aRemplacement.genreReponse === Type3Etats_1.Type3Etats.TE_Non
						);
					}
				}
				return false;
			},
			setValue: (aValue) => {
				if (aRemplacement) {
					let lGenreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
					if (aValue) {
						lGenreReponse = aAccept
							? Type3Etats_1.Type3Etats.TE_Oui
							: Type3Etats_1.Type3Etats.TE_Non;
					}
					if (lGenreReponse !== Type3Etats_1.Type3Etats.TE_Oui) {
						aRemplacement.genreReponse = lGenreReponse;
						aRemplacement.commentaire = "";
						this.evenementRetour(
							MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
								.saisie,
							{
								genreLigne: aRemplacement.getGenre(),
								cours: aRemplacement.cours,
								annulation: aRemplacement.annulation,
								cycle: aRemplacement.cycle,
								genreReponse: aRemplacement.genreReponse,
								commentaire: aRemplacement.commentaire,
							},
						);
					} else {
						this.ouvrirFenetreCommentaire(aRemplacement);
					}
				}
			},
			getDisabled: () => {
				return GApplication.getModeExclusif();
			},
		};
	}
	jsxFuncAttrAriaLabel(aRemplacement) {
		let lLabel = "";
		if (aRemplacement) {
			switch (aRemplacement.genreReponse) {
				case Type3Etats_1.Type3Etats.TE_Oui:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintoui",
					);
					break;
				case Type3Etats_1.Type3Etats.TE_Non:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintnon",
					);
					break;
				case Type3Etats_1.Type3Etats.TE_Inconnu:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintinconnu",
					);
					break;
				default:
					break;
			}
		}
		return { "aria-label": lLabel };
	}
	jsxModeleCommentaire(aRemplacement) {
		return {
			getValue: () => {
				return aRemplacement.commentaire || "";
			},
			setValue: (aValue) => {
				aRemplacement.commentaire = aValue;
			},
		};
	}
	ouvrirFenetreCommentaire(aRemplacement) {
		const lCommentaireDebut = aRemplacement.commentaire || "";
		const lEstVolontariat =
			aRemplacement.getGenre() ===
			TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence;
		const lFenetreCommentaire = new ObjetFenetre_1.ObjetFenetre({
			pere: this,
			evenement: (aGenreBouton) => {
				if (aGenreBouton === 1) {
					aRemplacement.genreReponse = Type3Etats_1.Type3Etats.TE_Oui;
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.saisie,
						{
							genreLigne: aRemplacement.getGenre(),
							cours: aRemplacement.cours,
							annulation: aRemplacement.annulation,
							cycle: aRemplacement.cycle,
							genreReponse: aRemplacement.genreReponse,
							commentaire: aRemplacement.commentaire,
						},
					);
				} else {
					aRemplacement.commentaire = lCommentaireDebut;
				}
			},
		}).initAfficher({
			options: {
				titre: lEstVolontariat
					? ObjetTraduction_1.GTraductions.getValeur(
							"RemplacementsEnseignants.volontaire.postuler",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"RemplacementsEnseignants.proposition.Accepter",
						),
				hauteur: 120,
				hauteurMin: 100,
				largeur: 400,
				largeurMin: 400,
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
		});
		const lID = GUID_1.GUID.getId();
		lFenetreCommentaire.afficher(
			IE.jsx.str(
				"div",
				{ class: ["flex-contain", "cols"] },
				IE.jsx.str(
					"label",
					{ for: lID, class: "m-bottom" },
					ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.volontaire.commentaire",
					),
				),
				IE.jsx.str("ie-textareamax", {
					id: lID,
					"ie-model": this.jsxModeleCommentaire.bind(this, aRemplacement),
					placeholder: lEstVolontariat
						? ObjetTraduction_1.GTraductions.getValeur(
								"RemplacementsEnseignants.volontaire.infocommentaire",
							)
						: "",
					maxlength: "255",
				}),
			),
		);
	}
	validerRetirerDemande(aRemplacement) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RemplacementsEnseignants.volontaire.retirer",
			),
			message: ObjetTraduction_1.GTraductions.getValeur(
				"RemplacementsEnseignants.volontaire.retirerInfo",
			),
			callback: (aNumeroBouton) => {
				if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
					aRemplacement.genreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
					aRemplacement.commentaire = "";
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.saisie,
						{
							genreLigne: aRemplacement.getGenre(),
							cours: aRemplacement.cours,
							annulation: aRemplacement.annulation,
							cycle: aRemplacement.cycle,
							genreReponse: aRemplacement.genreReponse,
						},
					);
				}
			},
		});
	}
	jsxModeleBoutonSePorterVolontaire(aRemplacement) {
		return {
			event: () => {
				if (aRemplacement) {
					const lEtatActuel = aRemplacement.genreReponse;
					if (lEtatActuel === Type3Etats_1.Type3Etats.TE_Inconnu) {
						this.ouvrirFenetreCommentaire(aRemplacement);
					} else if (lEtatActuel === Type3Etats_1.Type3Etats.TE_Oui) {
						this.validerRetirerDemande(aRemplacement);
					} else {
					}
				}
			},
			getLibelle: () => {
				if (aRemplacement) {
					switch (aRemplacement.genreReponse) {
						case Type3Etats_1.Type3Etats.TE_Oui:
							return ObjetTraduction_1.GTraductions.getValeur(
								"RemplacementsEnseignants.volontaire.retirer",
							);
						case Type3Etats_1.Type3Etats.TE_Inconnu:
							return ObjetTraduction_1.GTraductions.getValeur(
								"RemplacementsEnseignants.volontaire.postuler",
							);
						default:
							return "";
					}
				}
				return "";
			},
			getDisabled: () => {
				return GApplication.getModeExclusif();
			},
		};
	}
	jsxGetClassBoutonVolontaire(aRemplacement) {
		const H = [];
		if (aRemplacement) {
			H.push("volontaire");
			if (aRemplacement.genreReponse === Type3Etats_1.Type3Etats.TE_Inconnu) {
				H.push("themeBoutonPrimaire");
			}
		}
		return H.join(" ");
	}
	jsxGetInfoVolontaire(aRemplacement) {
		if (
			aRemplacement &&
			aRemplacement.getGenre() ===
				TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence &&
			MethodesObjet_1.MethodesObjet.isNumber(aRemplacement.nbVolontaire)
		) {
			if (aRemplacement.nbVolontaire === 0) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.volontaire.aucun",
				);
			} else if (aRemplacement.nbVolontaire === 1) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.volontaire.1Volontaire",
				);
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"RemplacementsEnseignants.volontaire.nbVolontaire",
					[aRemplacement.nbVolontaire],
				);
			}
		}
		return "";
	}
	estUnDeploiement(aParams) {
		return (
			this.options.avecDeploiement &&
			aParams &&
			aParams.article &&
			aParams.article.estUnDeploiement
		);
	}
	avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
		return (
			aParamsCellule.article &&
			aParamsCellulePrec.article &&
			!aParamsCellule.article.estUnDeploiement &&
			!aParamsCellulePrec.article.estUnDeploiement
		);
	}
	getZoneGauche(aParams) {
		return !this.estUnDeploiement(aParams)
			? this.moteur.construireDate(aParams.article)
			: "";
	}
	getTitreZonePrincipale(aParams) {
		const lRemplacement = aParams.article;
		if (this.estUnDeploiement(aParams)) {
			return `${lRemplacement.getLibelle()} (${lRemplacement.count.toString()})`;
		} else {
			return this.moteur.construireTitre(lRemplacement);
		}
	}
	getInfosSuppZonePrincipale(aParams) {
		if (this.estUnDeploiement(aParams)) {
			return "";
		} else {
			return this.moteur.construireSousTitre(aParams.article);
		}
	}
	getClass(aParams) {
		const lClasses = [];
		if (this.estUnDeploiement(aParams)) {
			lClasses.push("ligneCumul");
		}
		return lClasses.join(" ");
	}
	getZoneMessage(aParams) {
		if (this.estUnDeploiement(aParams)) {
			return "";
		} else {
			const lMsg = [];
			lMsg.push(this.moteur.construireMessage(aParams.article));
			if (IE.estMobile) {
				lMsg.push(
					IE.jsx.str(
						"div",
						{ class: "flex-contain justify-end m-top" },
						this.moteur.getZoneReponse(aParams.article, {
							cbProposition: this.jsxModeleCheckboxProposition.bind(this),
							getAriaLabelProposition: this.jsxFuncAttrAriaLabel.bind(this),
							boutonVolontaires:
								this.jsxModeleBoutonSePorterVolontaire.bind(this),
							classBoutonVolontaires:
								this.jsxGetClassBoutonVolontaire.bind(this),
						}),
					),
				);
			}
			return lMsg.join("");
		}
	}
	getZoneComplementaire(aParams) {
		if (this.estUnDeploiement(aParams) || IE.estMobile) {
			return "";
		} else {
			return this.getZoneReponse(aParams);
		}
	}
	evenementRetour(aEvent, aObj) {
		if (this.callback) {
			this.callback(aEvent, aObj);
		}
	}
	getZoneReponse(aParams) {
		return this.moteur.getZoneReponse(aParams.article, {
			cbProposition: this.jsxModeleCheckboxProposition.bind(this),
			getAriaLabelProposition: this.jsxFuncAttrAriaLabel.bind(this),
			boutonVolontaires: this.jsxModeleBoutonSePorterVolontaire.bind(this),
			classBoutonVolontaires: this.jsxGetClassBoutonVolontaire.bind(this),
		});
	}
	jsxAvecFiltreUniquementMesRemplacements() {
		return [
			TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarVolontaire,
		].includes(this.moteur.affichageCourant.getGenre());
	}
	jsxAvecFiltreUniquementSiDisponible() {
		return [
			TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarVolontaire,
		].includes(this.moteur.affichageCourant.getGenre());
	}
	jsxAvecFiltreProfesseurs() {
		return [
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarAutresRemplacements,
		].includes(this.moteur.affichageCourant.getGenre());
	}
	jsxAvecFiltreMatieres() {
		return [
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarAutresRemplacements,
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsAVenir,
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsPasses,
		].includes(this.moteur.affichageCourant.getGenre());
	}
	jsxAvecFiltreClasses() {
		return [
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarAutresRemplacements,
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsAVenir,
			TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsPasses,
		].includes(this.moteur.affichageCourant.getGenre());
	}
	jsxModeleCheckboxUniquementMesRemplacements() {
		return {
			getValue: () => {
				return this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses;
			},
			setValue: (aValue) => {
				if (
					this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses !==
					aValue
				) {
					this.moteur.actualiserDonnees = true;
					this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
						aValue;
					this.moteur.affichageCourant.paramRequete.uniquementMesMatieresClasses =
						this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses;
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.filtre,
					);
				}
			},
		};
	}
	jsxModeleCheckboxUniquementSiDisponible() {
		return {
			getValue: () => {
				return this.moteur.affichageCourant.filtre.uniquementSiDisponible;
			},
			setValue: (aValue) => {
				if (
					this.moteur.affichageCourant.filtre.uniquementSiDisponible !== aValue
				) {
					this.moteur.actualiserDonnees = true;
					this.moteur.affichageCourant.filtre.uniquementSiDisponible = aValue;
					this.moteur.affichageCourant.paramRequete.uniquementSiDisponible =
						this.moteur.affichageCourant.filtre.uniquementSiDisponible;
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.filtre,
					);
				}
			},
		};
	}
	jsxModelBtnSelecteurProfesseurs() {
		return {
			event: () => {
				this.fenetreProfs = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
					{
						pere: this,
						evenement: function (
							aGenreRessource,
							aListeRessourcesSelectionnees,
						) {
							this.moteur.affichageCourant.filtre.profs =
								aListeRessourcesSelectionnees;
							this.evenementRetour(
								MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
									.filtre,
							);
						},
						initialiser: (aInstanceFenetre) => {
							const lTitre =
								ObjetTraduction_1.GTraductions.getValeur("Professeurs");
							aInstanceFenetre.setOptionsFenetre({
								titre: lTitre,
								largeur: 450,
								hauteurMin: 450,
								hauteurMaxContenu: 720,
								avecScroll: true,
								listeBoutons: [
									ObjetTraduction_1.GTraductions.getValeur("Fermer"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								],
							});
							aInstanceFenetre.setOptionsFenetreSelectionRessource({
								avecCocheRessources: true,
							});
							aInstanceFenetre.setSelectionObligatoire(false);
						},
					},
				);
				this.moteur
					.requetePublic({
						genres: [Enumere_Ressource_1.EGenreRessource.Enseignant],
					})
					.then((aParam) => {
						this.evntListePublicsApresRequete(aParam);
					});
			},
			getLibelle: () => {
				let lText;
				if (
					this.moteur.affichageCourant.filtre.profs.count() === 0 ||
					this.moteur.affichageCourant.filtre.profs.count() ===
						this.moteur.listes.profs.listePublic.count()
				) {
					lText = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.TousLesProfs",
					);
				} else if (this.moteur.affichageCourant.filtre.profs.count() < 3) {
					lText = this.moteur.affichageCourant.filtre.profs
						.getTableauLibelles()
						.join(", ");
				} else {
					let lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Professeurs") + " (%s)";
					lText = ObjetChaine_1.GChaine.format(lLibelle, [
						this.moteur.affichageCourant.filtre.profs.count() +
							" / " +
							this.moteur.listes.profs.listePublic.count(),
					]);
				}
				return lText;
			},
		};
	}
	jsxModelBtnSelecteurMatieres() {
		return {
			event: () => {
				if (this.moteur.affichageCourant.filtre.matieres.count() === 0) {
					this.moteur.affichageCourant.filtre.matieres =
						MethodesObjet_1.MethodesObjet.dupliquer(
							this.moteur.listes.matieres,
						);
				}
				const lDonnees = {
					genreRessource: Enumere_Ressource_1.EGenreRessource.Matiere,
					titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
					estGenreRessourceDUtilisateurConnecte: false,
					listeRessources: this.moteur.listes.matieres,
					listeRessourcesSelectionnees:
						this.moteur.affichageCourant.filtre.matieres,
				};
				this.fenetreMatieres = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
					{
						pere: this,
						evenement: function (
							aGenreRessource,
							aListeSelectionnee,
							aNumeroBouton,
						) {
							if (aNumeroBouton !== 0) {
								return;
							}
							this.moteur.affichageCourant.filtre.matieres = aListeSelectionnee;
							this.evenementRetour(
								MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
									.filtre,
							);
						},
						initialiser: function (aInstanceFenetre) {
							aInstanceFenetre.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
								hauteurMin: 450,
							});
							aInstanceFenetre.setOptionsFenetreSelectionRessource({
								autoriseEltAucun: true,
								listeFlatDesign: true,
								filtres: [
									{
										libelle: ObjetTraduction_1.GTraductions.getValeur(
											"UniquementMesMatieres",
										),
										filtre: function (aElement, aChecked) {
											return aChecked ? aElement.estEnseignee : true;
										},
										checked:
											this.moteur.affichageCourant.filtre
												.uniquementMesMatieresClasses,
										callbackChecked: (aChecked) => {
											this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
												aChecked;
										},
									},
								],
							});
						},
					},
				);
				this.fenetreMatieres.setDonnees(lDonnees);
			},
			getLibelle: () => {
				let lText;
				if (
					this.moteur.affichageCourant.filtre.matieres.count() === 0 ||
					this.moteur.affichageCourant.filtre.matieres.count() ===
						this.moteur.listes.matieres.count()
				) {
					lText = ObjetTraduction_1.GTraductions.getValeur("ToutesLesMatieres");
				} else if (this.moteur.affichageCourant.filtre.matieres.count() < 3) {
					lText = this.moteur.affichageCourant.filtre.matieres
						.getTableauLibelles()
						.join(", ");
				} else {
					let lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Matieres") + " (%s)";
					lText = ObjetChaine_1.GChaine.format(lLibelle, [
						this.moteur.affichageCourant.filtre.matieres.count() +
							" / " +
							this.moteur.listes.matieres.count(),
					]);
				}
				return lText;
			},
		};
	}
	jsxModelBtnSelecteurClasses() {
		return {
			event: () => {
				if (this.moteur.affichageCourant.filtre.classes.count() === 0) {
					this.moteur.affichageCourant.filtre.classes =
						MethodesObjet_1.MethodesObjet.dupliquer(this.moteur.listes.classes);
				}
				this.fenetreClasses = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
					{
						pere: this,
						evenement: function (
							aGenreRessource,
							aListeRessourcesSelect,
							aNumeroBouton,
						) {
							if (aNumeroBouton === 0) {
								this.moteur.affichageCourant.filtre.classes =
									aListeRessourcesSelect;
								this.evenementRetour(
									MoteurRemplacementsEnseignants_1.RemplacementsEnseignants
										.action.filtre,
								);
							}
						},
						initialiser: function (aInstanceFenetre) {
							aInstanceFenetre.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"fenetreSelectionClasseGroupe.titreClasses",
								),
								hauteurMin: 450,
							});
							aInstanceFenetre.setOptionsFenetreSelectionRessource({
								autoriseEltAucun: true,
								listeFlatDesign: true,
								filtres: [
									{
										libelle: ObjetTraduction_1.GTraductions.getValeur(
											"UniquementMesClasses",
										),
										filtre: function (aElement, aChecked) {
											return aChecked ? aElement.enseigne : true;
										},
										checked:
											this.moteur.affichageCourant.filtre
												.uniquementMesMatieresClasses,
										callbackChecked: (aChecked) => {
											this.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
												aChecked;
										},
									},
								],
								gestionCumulRessource: function (aElement, aListe) {
									let lNiveau = aListe.get(
										aListe.getIndiceParNumeroEtGenre(
											aElement.niveau.getNumero(),
											0,
										),
									);
									if (!lNiveau) {
										lNiveau = new ObjetElement_1.ObjetElement(
											aElement.niveau.getLibelle(),
											aElement.niveau.getNumero(),
											0,
										);
										lNiveau.enseigne = aElement.enseigne;
										lNiveau.estUnDeploiement = true;
										lNiveau.estDeploye = false;
										aListe.addElement(lNiveau);
									} else if (!lNiveau.enseigne) {
										lNiveau.enseigne = aElement.enseigne;
									}
									aElement.pere = lNiveau;
								},
							});
						},
					},
				);
				this.fenetreClasses.setDonnees({
					listeRessources: this.moteur.listes.classes,
					listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
						this.moteur.affichageCourant.filtre.classes,
					),
					genreRessource: Enumere_Ressource_1.EGenreRessource.Classe,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSelectionClasseGroupe.titreClasses",
					),
				});
			},
			getLibelle: () => {
				let lText;
				if (
					this.moteur.affichageCourant.filtre.classes.count() === 0 ||
					this.moteur.affichageCourant.filtre.classes.count() ===
						this.moteur.listes.classes.count()
				) {
					lText = ObjetTraduction_1.GTraductions.getValeur("ToutesLesClasses");
				} else if (this.moteur.affichageCourant.filtre.classes.count() < 3) {
					lText = this.moteur.affichageCourant.filtre.classes
						.getTableauLibelles()
						.join(", ");
				} else {
					let lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Classes") + " (%s)";
					lText = ObjetChaine_1.GChaine.format(lLibelle, [
						this.moteur.affichageCourant.filtre.classes.count() +
							" / " +
							this.moteur.listes.classes.count(),
					]);
				}
				return lText;
			},
		};
	}
	jsxIdentiteSelecteurDate(aEstDebut) {
		return {
			class: ObjetCelluleDate_1.ObjetCelluleDate,
			pere: this,
			init: (aInstanceCelluleDate) => {
				if (aEstDebut) {
					this._instanceSelecteurDe = aInstanceCelluleDate;
				} else {
					this._instanceSelecteurA = aInstanceCelluleDate;
				}
				const lOptions = {
					formatDate: "[%JJ/%MM/%AAAA]",
					avecBoutonsPrecedentSuivant: false,
				};
				if (
					[
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarPropositions,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarVolontaire,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsAVenir,
					].includes(this.moteur.affichageCourant.getGenre())
				) {
					lOptions.premiereDate = ObjetDate_1.GDate.getDateCourante(true);
				}
				if (
					[
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsPasses,
					].includes(this.moteur.affichageCourant.getGenre())
				) {
					lOptions.derniereDate = ObjetDate_1.GDate.getDateBornee(
						ObjetDate_1.GDate.hier,
					);
				}
				aInstanceCelluleDate.setOptionsObjetCelluleDate(lOptions);
				aInstanceCelluleDate.setControleNavigation(true);
				aInstanceCelluleDate.setActif(true);
			},
			start: (aInstanceCelluleDate) => {
				if (aEstDebut) {
					aInstanceCelluleDate.setDonnees(
						this.moteur.affichageCourant.filtre.de,
					);
				} else {
					aInstanceCelluleDate.setDonnees(
						this.moteur.affichageCourant.filtre.a,
					);
				}
			},
			evenement: (aDate) => {
				if (
					(aEstDebut && aDate !== this.moteur.affichageCourant.filtre.de) ||
					(!aEstDebut && aDate !== this.moteur.affichageCourant.filtre.a)
				) {
					this.moteur.setDateFiltreCourant(aDate, aEstDebut);
					if (aEstDebut) {
						this._instanceSelecteurA.setOptionsObjetCelluleDate({
							premiereDate: aDate,
						});
					} else {
						this._instanceSelecteurDe.setOptionsObjetCelluleDate({
							derniereDate: aDate,
						});
					}
					this.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.filtre,
					);
				}
			},
		};
	}
	evntListePublicsApresRequete(aParam) {
		if (this.moteur.affichageCourant.filtre.profs.count() === 0) {
			this.moteur.affichageCourant.filtre.profs =
				MethodesObjet_1.MethodesObjet.dupliquer(aParam.listePublic);
		}
		this.fenetreProfs.setDonnees({
			listeRessources: aParam.listePublic,
			listeRessourcesSelectionnees: this.moteur.affichageCourant.filtre.profs,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Enseignant,
		});
	}
	construireFiltres() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center m-bottom-l" },
				IE.jsx.str(
					"span",
					null,
					ObjetTraduction_1.GTraductions.getValeur("Du"),
				),
				IE.jsx.str("div", {
					class: "m-left",
					"ie-identite": this.jsxIdentiteSelecteurDate.bind(this, true),
				}),
				IE.jsx.str(
					"span",
					{ class: "m-left" },
					ObjetTraduction_1.GTraductions.getValeur("Au"),
				),
				IE.jsx.str("div", {
					class: "m-left",
					"ie-identite": this.jsxIdentiteSelecteurDate.bind(this, false),
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxAvecFiltreUniquementMesRemplacements.bind(this),
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model":
							this.jsxModeleCheckboxUniquementMesRemplacements.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.UniquementQuiMeConcernent",
					),
				),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxAvecFiltreUniquementSiDisponible.bind(this),
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": this.jsxModeleCheckboxUniquementSiDisponible.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.UniquementSiDisponible",
					),
				),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxAvecFiltreProfesseurs.bind(this),
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Prof" },
					ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxModelBtnSelecteurProfesseurs.bind(this),
					"aria-labelledby": this.idLabel + "Prof",
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxAvecFiltreMatieres.bind(this),
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Mat" },
					ObjetTraduction_1.GTraductions.getValeur("Matieres"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxModelBtnSelecteurMatieres.bind(this),
					"aria-labelledby": this.idLabel + "Mat",
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxAvecFiltreClasses.bind(this),
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Classe" },
					ObjetTraduction_1.GTraductions.getValeur("Classes"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxModelBtnSelecteurClasses.bind(this),
					"aria-labelledby": this.idLabel + "Classe",
				}),
			),
		);
	}
	reinitFiltres() {
		this.moteur.initFiltre(this.moteur.affichageCourant);
		this.evenementRetour(
			MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action.filtre,
		);
	}
	estFiltresParDefaut() {
		return this.moteur.estFiltreParDefault();
	}
}
exports.DonneesListe_RemplacementsEnseignants =
	DonneesListe_RemplacementsEnseignants;
class DonneesListe_TypeAffRemplacements extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEvnt_Selection: true, avecBoutonActionLigne: false });
	}
	getTitreZonePrincipale(aParams) {
		const lArticle = aParams.article;
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("div", null, IE.jsx.str("span", null, lArticle.getLibelle())),
		);
	}
	getIconeGaucheContenuFormate(aParams) {
		return aParams.article.icon;
	}
}
exports.DonneesListe_TypeAffRemplacements = DonneesListe_TypeAffRemplacements;

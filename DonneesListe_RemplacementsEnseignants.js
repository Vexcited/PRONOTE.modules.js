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
class DonneesListe_RemplacementsEnseignants extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.idLabel = GUID_1.GUID.getId();
		this.setOptions({
			avecEvnt_Selection: false,
			avecBoutonActionLigne: false,
			avecDeploiement: true,
			avecFusionLignePereFils: false,
		});
		this.callback = aParams.evenement;
		this.moteur = aParams.moteur;
	}
	getControleur(aInstance, aInstanceListe) {
		return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
			CheckProposition: {
				getValue: function (aLigne, aAccept) {
					const lElement = aInstance.Donnees.get(aLigne);
					if (!!lElement) {
						if (aAccept) {
							return lElement.genreReponse === Type3Etats_1.Type3Etats.TE_Oui;
						} else {
							return lElement.genreReponse === Type3Etats_1.Type3Etats.TE_Non;
						}
					}
					return false;
				},
				setValue: function (aLigne, aAccept, aValue) {
					const lElement = aInstance.Donnees.get(aLigne);
					if (aValue) {
						lElement.genreReponse = aAccept
							? Type3Etats_1.Type3Etats.TE_Oui
							: Type3Etats_1.Type3Etats.TE_Non;
					} else {
						lElement.genreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					aInstance.evenementRetour(
						MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
							.saisie,
						{
							genreLigne: lElement.getGenre(),
							cours: lElement.cours,
							annulation: lElement.annulation,
							cycle: lElement.cycle,
							genreReponse: lElement.genreReponse,
						},
					);
				},
				getDisabled: function () {
					return GApplication.getModeExclusif();
				},
			},
			getAriaLabel: function (aLigne) {
				const lElement = aInstance.Donnees.get(aLigne);
				let lLabel;
				switch (lElement.genreReponse) {
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
						return;
				}
				return { "aria-label": lLabel };
			},
			btnVolontaire: {
				event(aLigne) {
					const lElement = aInstance.Donnees.get(aLigne);
					const lEtatActuel = lElement.genreReponse;
					if (lEtatActuel === Type3Etats_1.Type3Etats.TE_Inconnu) {
						lElement.genreReponse = Type3Etats_1.Type3Etats.TE_Oui;
						aInstance.evenementRetour(
							MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
								.saisie,
							{
								genreLigne: lElement.getGenre(),
								cours: lElement.cours,
								annulation: lElement.annulation,
								cycle: lElement.cycle,
								genreReponse: lElement.genreReponse,
							},
						);
					} else if (lEtatActuel === Type3Etats_1.Type3Etats.TE_Oui) {
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
									lElement.genreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
									aInstance.evenementRetour(
										MoteurRemplacementsEnseignants_1.RemplacementsEnseignants
											.action.saisie,
										{
											genreLigne: lElement.getGenre(),
											cours: lElement.cours,
											annulation: lElement.annulation,
											cycle: lElement.cycle,
											genreReponse: lElement.genreReponse,
										},
									);
								}
							},
						});
					} else {
					}
				},
				getLibelle(aLigne) {
					const lElement = aInstance.Donnees.get(aLigne);
					switch (lElement.genreReponse) {
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
				},
				getDisabled: function () {
					return GApplication.getModeExclusif();
				},
			},
			getClassVolontaire(aLigne) {
				const lElement = aInstance.Donnees.get(aLigne);
				const H = ["volontaire"];
				if (lElement.genreReponse === Type3Etats_1.Type3Etats.TE_Inconnu) {
					H.push("themeBoutonPrimaire");
				}
				return H.join(" ");
			},
		});
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
						this.moteur.getZoneReponse(aParams.article, aParams.ligne),
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
		return this.moteur.getZoneReponse(aParams.article, aParams.ligne);
	}
	getControleurFiltres(aInstance, aInstanceListe) {
		return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
			identiteSelecteurDate(aEstDebut) {
				return {
					class: ObjetCelluleDate_1.ObjetCelluleDate,
					pere: aInstance,
					init(aInstanceCelluleDate) {
						if (aEstDebut) {
							aInstance._instanceSelecteurDe = aInstanceCelluleDate;
						} else {
							aInstance._instanceSelecteurA = aInstanceCelluleDate;
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
							].includes(aInstance.moteur.affichageCourant.getGenre())
						) {
							lOptions.premiereDate = ObjetDate_1.GDate.getDateCourante(true);
						}
						if (
							[
								TypeAffichageRemplacements_1.TypeAffichageRemplacements
									.tarMesRemplacementsPasses,
							].includes(aInstance.moteur.affichageCourant.getGenre())
						) {
							lOptions.derniereDate = ObjetDate_1.GDate.getDateBornee(
								ObjetDate_1.GDate.hier,
							);
						}
						aInstanceCelluleDate.setOptionsObjetCelluleDate(lOptions);
						aInstanceCelluleDate.setControleNavigation(true);
						aInstanceCelluleDate.setActif(true);
					},
					start(aInstanceCelluleDate) {
						if (aEstDebut) {
							aInstanceCelluleDate.setDonnees(
								aInstance.moteur.affichageCourant.filtre.de,
							);
						} else {
							aInstanceCelluleDate.setDonnees(
								aInstance.moteur.affichageCourant.filtre.a,
							);
						}
					},
					evenement(aDate) {
						if (
							(aEstDebut &&
								aDate !== aInstance.moteur.affichageCourant.filtre.de) ||
							(!aEstDebut &&
								aDate !== aInstance.moteur.affichageCourant.filtre.a)
						) {
							aInstance.moteur.setDateFiltreCourant(aDate, aEstDebut);
							if (aEstDebut) {
								aInstance._instanceSelecteurA.setOptionsObjetCelluleDate({
									premiereDate: aDate,
								});
							} else {
								aInstance._instanceSelecteurDe.setOptionsObjetCelluleDate({
									derniereDate: aDate,
								});
							}
							aInstance.evenementRetour(
								MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
									.filtre,
							);
						}
					},
				};
			},
			cbUniquementMes: {
				visible() {
					return [
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarVolontaire,
					].includes(aInstance.moteur.affichageCourant.getGenre());
				},
				getValue: function () {
					return aInstance.moteur.affichageCourant.filtre
						.uniquementMesMatieresClasses;
				},
				setValue: function (aValue) {
					if (
						aInstance.moteur.affichageCourant.filtre
							.uniquementMesMatieresClasses !== aValue
					) {
						aInstance.moteur.actualiserDonnees = true;
						aInstance.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
							aValue;
						aInstance.moteur.affichageCourant.paramRequete.uniquementMesMatieresClasses =
							aInstance.moteur.affichageCourant.filtre.uniquementMesMatieresClasses;
						aInstance.evenementRetour(
							MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
								.filtre,
						);
					}
				},
			},
			btnProfs: {
				visible() {
					return [
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarAutresRemplacements,
					].includes(aInstance.moteur.affichageCourant.getGenre());
				},
				event() {
					aInstance.fenetreProfs =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
							{
								pere: aInstance,
								evenement: function (
									aGenreRessource,
									aListeRessourcesSelectionnees,
								) {
									aInstance.moteur.affichageCourant.filtre.profs =
										aListeRessourcesSelectionnees;
									aInstance.evenementRetour(
										MoteurRemplacementsEnseignants_1.RemplacementsEnseignants
											.action.filtre,
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
					aInstance.moteur
						.requetePublic({
							genres: [Enumere_Ressource_1.EGenreRessource.Enseignant],
						})
						.then((aParam) => {
							aInstance.evntListePublicsApresRequete(aParam);
						});
				},
				getLibelle() {
					let lText;
					if (
						aInstance.moteur.affichageCourant.filtre.profs.count() === 0 ||
						aInstance.moteur.affichageCourant.filtre.profs.count() ===
							aInstance.moteur.listes.profs.listePublic.count()
					) {
						lText = ObjetTraduction_1.GTraductions.getValeur(
							"RemplacementsEnseignants.TousLesProfs",
						);
					} else if (
						aInstance.moteur.affichageCourant.filtre.profs.count() < 3
					) {
						lText = aInstance.moteur.affichageCourant.filtre.profs
							.getTableauLibelles()
							.join(", ");
					} else {
						let lLibelle =
							ObjetTraduction_1.GTraductions.getValeur("Professeurs") + " (%s)";
						lText = ObjetChaine_1.GChaine.format(lLibelle, [
							aInstance.moteur.affichageCourant.filtre.profs.count() +
								" / " +
								aInstance.moteur.listes.profs.listePublic.count(),
						]);
					}
					return lText;
				},
				getDisabled() {
					return false;
				},
			},
			btnMatieres: {
				visible() {
					return [
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarAutresRemplacements,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsAVenir,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsPasses,
					].includes(aInstance.moteur.affichageCourant.getGenre());
				},
				event() {
					if (aInstance.moteur.affichageCourant.filtre.matieres.count() === 0) {
						aInstance.moteur.affichageCourant.filtre.matieres =
							MethodesObjet_1.MethodesObjet.dupliquer(
								aInstance.moteur.listes.matieres,
							);
					}
					const lDonnees = {
						genreRessource: Enumere_Ressource_1.EGenreRessource.Matiere,
						titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
						estGenreRessourceDUtilisateurConnecte: false,
						listeRessources: aInstance.moteur.listes.matieres,
						listeRessourcesSelectionnees:
							aInstance.moteur.affichageCourant.filtre.matieres,
					};
					aInstance.fenetreMatieres =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
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
									aInstance.moteur.affichageCourant.filtre.matieres =
										aListeSelectionnee;
									aInstance.evenementRetour(
										MoteurRemplacementsEnseignants_1.RemplacementsEnseignants
											.action.filtre,
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
													aInstance.moteur.affichageCourant.filtre
														.uniquementMesMatieresClasses,
												callbackChecked: function (aChecked) {
													aInstance.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
														aChecked;
												},
											},
										],
									});
								},
							},
						);
					aInstance.fenetreMatieres.setDonnees(lDonnees);
				},
				getLibelle() {
					let lText;
					if (
						aInstance.moteur.affichageCourant.filtre.matieres.count() === 0 ||
						aInstance.moteur.affichageCourant.filtre.matieres.count() ===
							aInstance.moteur.listes.matieres.count()
					) {
						lText =
							ObjetTraduction_1.GTraductions.getValeur("ToutesLesMatieres");
					} else if (
						aInstance.moteur.affichageCourant.filtre.matieres.count() < 3
					) {
						lText = aInstance.moteur.affichageCourant.filtre.matieres
							.getTableauLibelles()
							.join(", ");
					} else {
						let lLibelle =
							ObjetTraduction_1.GTraductions.getValeur("Matieres") + " (%s)";
						lText = ObjetChaine_1.GChaine.format(lLibelle, [
							aInstance.moteur.affichageCourant.filtre.matieres.count() +
								" / " +
								aInstance.moteur.listes.matieres.count(),
						]);
					}
					return lText;
				},
				getDisabled() {
					return false;
				},
			},
			btnClasses: {
				visible() {
					return [
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarAutresRemplacements,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsAVenir,
						TypeAffichageRemplacements_1.TypeAffichageRemplacements
							.tarMesRemplacementsPasses,
					].includes(aInstance.moteur.affichageCourant.getGenre());
				},
				event() {
					if (aInstance.moteur.affichageCourant.filtre.classes.count() === 0) {
						aInstance.moteur.affichageCourant.filtre.classes =
							MethodesObjet_1.MethodesObjet.dupliquer(
								aInstance.moteur.listes.classes,
							);
					}
					aInstance.fenetreClasses =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
							{
								pere: this,
								evenement: function (
									aGenreRessource,
									aListeRessourcesSelect,
									aNumeroBouton,
								) {
									if (aNumeroBouton === 0) {
										aInstance.moteur.affichageCourant.filtre.classes =
											aListeRessourcesSelect;
										aInstance.evenementRetour(
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
													"CreneauxLibres.UniquementMesClasses",
												),
												filtre: function (aElement, aChecked) {
													return aChecked ? aElement.enseigne : true;
												},
												checked:
													aInstance.moteur.affichageCourant.filtre
														.uniquementMesMatieresClasses,
												callbackChecked: function (aChecked) {
													aInstance.moteur.affichageCourant.filtre.uniquementMesMatieresClasses =
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
					aInstance.fenetreClasses.setDonnees({
						listeRessources: aInstance.moteur.listes.classes,
						listeRessourcesSelectionnees:
							MethodesObjet_1.MethodesObjet.dupliquer(
								aInstance.moteur.affichageCourant.filtre.classes,
							),
						genreRessource: Enumere_Ressource_1.EGenreRessource.Classe,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSelectionClasseGroupe.titreClasses",
						),
					});
				},
				getLibelle() {
					let lText;
					if (
						aInstance.moteur.affichageCourant.filtre.classes.count() === 0 ||
						aInstance.moteur.affichageCourant.filtre.classes.count() ===
							aInstance.moteur.listes.classes.count()
					) {
						lText =
							ObjetTraduction_1.GTraductions.getValeur("ToutesLesClasses");
					} else if (
						aInstance.moteur.affichageCourant.filtre.classes.count() < 3
					) {
						lText = aInstance.moteur.affichageCourant.filtre.classes
							.getTableauLibelles()
							.join(", ");
					} else {
						let lLibelle =
							ObjetTraduction_1.GTraductions.getValeur("Classes") + " (%s)";
						lText = ObjetChaine_1.GChaine.format(lLibelle, [
							aInstance.moteur.affichageCourant.filtre.classes.count() +
								" / " +
								aInstance.moteur.listes.classes.count(),
						]);
					}
					return lText;
				},
				getDisabled() {
					return false;
				},
			},
		});
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
					"ie-identite": "identiteSelecteurDate(true)",
				}),
				IE.jsx.str(
					"span",
					{ class: "m-left" },
					ObjetTraduction_1.GTraductions.getValeur("Au"),
				),
				IE.jsx.str("div", {
					class: "m-left",
					"ie-identite": "identiteSelecteurDate(false)",
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": "cbUniquementMes.visible",
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "cbUniquementMes" },
					ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.UniquementQuiMeConcernent",
					),
				),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": "btnProfs.visible",
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Prof" },
					ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "btnProfs",
					"aria-labelledby": this.idLabel + "Prof",
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": "btnMatieres.visible",
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Mat" },
					ObjetTraduction_1.GTraductions.getValeur("Matieres"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "btnMatieres",
					"aria-labelledby": this.idLabel + "Mat",
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": "btnClasses.visible",
					class: "flex-contain flex-cols m-bottom-l remplacements-select",
				},
				IE.jsx.str(
					"label",
					{ id: this.idLabel + "Classe" },
					ObjetTraduction_1.GTraductions.getValeur("Classes"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "btnClasses",
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

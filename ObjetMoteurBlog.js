exports.EGenreEvntBillet = exports.ObjetMoteurBlog = void 0;
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetTri_1 = require("ObjetTri");
const TypeEtatCommentaireBillet_1 = require("TypeEtatCommentaireBillet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const tag_1 = require("tag");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const MethodesObjet_1 = require("MethodesObjet");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
var EGenreEvntBillet;
(function (EGenreEvntBillet) {
	EGenreEvntBillet[(EGenreEvntBillet["SurEdition"] = 1)] = "SurEdition";
	EGenreEvntBillet[(EGenreEvntBillet["SurModifPublication"] = 2)] =
		"SurModifPublication";
	EGenreEvntBillet[(EGenreEvntBillet["SurEditionCommentaire"] = 3)] =
		"SurEditionCommentaire";
	EGenreEvntBillet[(EGenreEvntBillet["surSuppression"] = 4)] = "surSuppression";
})(EGenreEvntBillet || (exports.EGenreEvntBillet = EGenreEvntBillet = {}));
class ObjetMoteurBlog {
	constructor() {
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.moteurDestinataires =
			new MoteurDestinatairesPN_1.MoteurDestinatairesPN({
				genreEspace: new GestionnaireBlocPN_1.UtilitaireGenreEspace(),
			});
	}
	estBlogDontJeSuisModerateur(aBlog) {
		let lNumeroUtilisateur = this.getNumeroUtilisateurConnecte();
		return (
			aBlog.listeModerateurs &&
			!!aBlog.listeModerateurs.getElementParNumero(lNumeroUtilisateur)
		);
	}
	existeAuMoinsUnBlogDontJeSuisModerateur(aListeBlogs) {
		let lExisteAuMoinsUnBlogDontJeSuisModerateur = false;
		if (aListeBlogs) {
			for (const lBlog of aListeBlogs) {
				if (this.estBlogDontJeSuisModerateur(lBlog)) {
					lExisteAuMoinsUnBlogDontJeSuisModerateur = true;
					break;
				}
			}
		}
		return lExisteAuMoinsUnBlogDontJeSuisModerateur;
	}
	getEltUserConnecte() {
		let lUtilisateurConnecte = this.etatUtilisateurSco.getUtilisateur();
		if (
			this.estEspaceDirection(this.etatUtilisateurSco.GenreEspace) &&
			lUtilisateurConnecte.estEnseignant
		) {
			let lEnseignantConnecte = lUtilisateurConnecte.ressourceEnseignant;
			if (lEnseignantConnecte !== null && lEnseignantConnecte !== undefined) {
				return lEnseignantConnecte;
			}
		}
		return lUtilisateurConnecte;
	}
	getNumeroUtilisateurConnecte() {
		let lEltUserConnecte = this.getEltUserConnecte();
		return lEltUserConnecte.getNumero();
	}
	lUtilisateurConnecteEstAuteurDuBlog(aBlog) {
		let lNumeroUtilisateur = this.getNumeroUtilisateurConnecte();
		return (
			aBlog.auteur !== null &&
			aBlog.auteur !== undefined &&
			aBlog.auteur.getNumero() === lNumeroUtilisateur
		);
	}
	peutRedigerUnBilletDansCeBlog(aBlog) {
		let lNumeroUtilisateur = this.getNumeroUtilisateurConnecte();
		return (
			(aBlog.listeRedacteurs &&
				!!aBlog.listeRedacteurs.getElementParNumero(lNumeroUtilisateur)) ||
			this.lUtilisateurConnecteEstAuteurDuBlog(aBlog)
		);
	}
	existeAuMoinsUnBlogDansLequelJePeuxRediger(aListeBlogs) {
		let lExisteAuMoinsUnBlogAvecRedaction = false;
		if (aListeBlogs) {
			for (const lBlog of aListeBlogs) {
				if (
					this.peutRedigerUnBilletDansCeBlog(lBlog) &&
					this.avecRedactionBilletPossibleALaDateCourante(lBlog)
				) {
					lExisteAuMoinsUnBlogAvecRedaction = true;
					break;
				}
			}
		}
		return lExisteAuMoinsUnBlogAvecRedaction;
	}
	getModerateurParDefaut() {
		return this.getEltUserConnecte();
	}
	creerNouveauBlog() {
		let lEltModerateurParDefaut = this.getModerateurParDefaut();
		const lNouveauBlog = ObjetElement_1.ObjetElement.create({
			listeModerateurs: new ObjetListeElements_1.ObjetListeElements().add(
				lEltModerateurParDefaut,
			),
			dateFinRedactionBillet: ObjetDate_1.GDate.getDerniereDate(),
			listeRedacteurs: new ObjetListeElements_1.ObjetListeElements(),
			listePublics: new ObjetListeElements_1.ObjetListeElements(),
			autoriserCommentaires: true,
		});
		lNouveauBlog.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lNouveauBlog;
	}
	creerNouveauBilletBlog(aBlogConcerne, aAuteur) {
		aAuteur.nonEditable = true;
		const lBilletBlog = ObjetElement_1.ObjetElement.create({
			blog: aBlogConcerne,
			auteur: aAuteur,
			listeCoRedacteurs: new ObjetListeElements_1.ObjetListeElements(),
			listeDocuments: new ObjetListeElements_1.ObjetListeElements(),
			estModifiable: true,
			estPublie: true,
			estPublicDuBlog: true,
		});
		lBilletBlog.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lBilletBlog;
	}
	creerCommentaireParDefaut() {
		const lResult = ObjetElement_1.ObjetElement.create({
			date: new Date(),
			auteur: this.etatUtilisateurSco.getUtilisateur(),
			estSupprimable: true,
		});
		return lResult;
	}
	creerDossierMediatheque(aMediatheque) {
		const lNouveauDossierMediatheque = ObjetElement_1.ObjetElement.create({
			mediatheque: aMediatheque,
			pere: aMediatheque,
		});
		lNouveauDossierMediatheque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lNouveauDossierMediatheque;
	}
	estBilletEditable(aBillet) {
		return aBillet && aBillet.estModifiable;
	}
	existeCommentairesSurBillet(aBillet) {
		return aBillet && aBillet.listeCommentaires
			? aBillet.listeCommentaires.count() > 0
			: false;
	}
	afficherMessageConfirmationSuppressionBillet(aBillet, aClbck) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"blog.msgConfirmSuppression",
				[aBillet.getLibelle()],
			),
			callback(aGenreBouton) {
				if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
					aBillet.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					if (aClbck) {
						aClbck();
					}
				}
			},
		});
	}
	afficherMessageConfirmationSuppressionCommentaire(aCommentaire, aClbck) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur("blog.msgConfirmSuppr"),
			callback: (aGenreBouton) => {
				if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
					aCommentaire.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					if (aClbck) {
						aClbck();
					}
				}
			},
		});
	}
	estAuteurOuCoAuteurDuBillet(aUser, aBillet) {
		if (!aUser || !aBillet) {
			return false;
		}
		let lResult = false;
		if (aBillet.auteur && aUser.getNumero() === aBillet.auteur.getNumero()) {
			lResult = true;
		} else {
		}
		return lResult;
	}
	estBilletDeMembreDUtilisateur(aBillet) {
		let lResult = false;
		const lListeMembres =
			this.etatUtilisateurSco.Identification.ListeRessources;
		lListeMembres.parcourir((aMembre) => {
			if (lResult === false) {
				lResult = this.estAuteurOuCoAuteurDuBillet(aMembre, aBillet);
			}
		});
		return lResult;
	}
	estCommentaireDeMembreDUtilisateur(aCommentaire) {
		let lResult = false;
		const lListeMembres =
			this.etatUtilisateurSco.Identification.ListeRessources;
		lListeMembres.parcourir((aMembre) => {
			if (lResult === false) {
				lResult = this.estCommentaireDUser(aCommentaire, aMembre);
			}
		});
		return lResult;
	}
	estBilletDUtilisateurConnecte(aBillet) {
		const lUserConnecte = this.etatUtilisateurSco.getUtilisateur();
		return this.estAuteurOuCoAuteurDuBillet(lUserConnecte, aBillet);
	}
	deserialiserListeCategories(aListeDonnees) {
		const lListeCategories = new ObjetListeElements_1.ObjetListeElements();
		if (aListeDonnees) {
			aListeDonnees.parcourir((aCategorie) => {
				if (!aCategorie.existeNumero()) {
					aCategorie.setLibelle(
						ObjetTraduction_1.GTraductions.getValeur("fenetre.Aucune"),
					);
					aCategorie.Genre = 0;
					aCategorie.estEditable = false;
					aCategorie.couleur = "#ffffff";
				} else {
					aCategorie.estEditable = true;
				}
				lListeCategories.add(aCategorie);
			});
		}
		lListeCategories.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.existeNumero();
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListeCategories.trier();
		return lListeCategories;
	}
	estBilletCommentable(aBillet) {
		return aBillet.blog ? aBillet.blog.autoriserCommentaires : false;
	}
	estCommentaireDUser(aCommentaire, aUser) {
		let lEstCommentaireDeLUtilisateur = false;
		if (aCommentaire && aCommentaire.auteur && aUser) {
			lEstCommentaireDeLUtilisateur =
				aCommentaire.auteur.getNumero() === aUser.getNumero();
		}
		return lEstCommentaireDeLUtilisateur;
	}
	getInfosEtatCommentaire(aCommentaire) {
		return {
			afficherEtat: true,
			etat: aCommentaire.etatCommentaire,
			iconEtat:
				TypeEtatCommentaireBillet_1.TypeEtatCommentaireBilletUtil.getIcon(
					aCommentaire.etatCommentaire,
				),
			str: TypeEtatCommentaireBillet_1.TypeEtatCommentaireBilletUtil.getStrEtat(
				aCommentaire.etatCommentaire,
			),
			class: TypeEtatCommentaireBillet_1.TypeEtatCommentaireBilletUtil.getClass(
				aCommentaire.etatCommentaire,
			),
		};
	}
	creerPhotoIndividuEnVignette(aIndividu) {
		const H = [];
		let lSrcPhoto = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aIndividu, {
			libelle: "photo.jpg",
		});
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "vignette vignetteBlog" },
					IE.jsx.str("img", {
						"ie-load-src": lSrcPhoto,
						class: "img-portrait",
						"ie-imgviewer": true,
						"aria-hidden": "true",
					}),
				),
			),
		);
		return H.join("");
	}
	creerPhotosIndividusEnVignette(aListeIndividus, aNbMaximumVignettes = 5) {
		const H = [];
		if (aListeIndividus && aListeIndividus.count() > 0) {
			let lIndex = 0;
			H.push('<div class="liste-vignettes">');
			for (const lIndividu of aListeIndividus) {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						this.creerPhotoIndividuEnVignette(lIndividu),
					),
				);
				lIndex++;
				if (lIndex === aNbMaximumVignettes) {
					break;
				}
			}
			H.push("</div>");
		}
		return H.join("");
	}
	composeCardBillet(aBilletBlog, aParam) {
		const H = [];
		const lClasseArticleBillet = ["ArticleBillet"];
		if (!aBilletBlog.estPublie) {
			lClasseArticleBillet.push("nonPublie");
		}
		H.push(
			(0, tag_1.tag)(
				"article",
				{ class: lClasseArticleBillet.join(" "), tabIndex: 0 },
				(aTabContenuBillet) => {
					const HBoutonsActions = [];
					if (this.estBilletEditable(aBilletBlog)) {
						HBoutonsActions.push('<div class="zone-btn-actions">');
						if (!aBilletBlog.estPublie) {
							const lIEModelEditer =
								"btnEditerBillet('" + aBilletBlog.getNumero() + "')";
							const lIEModelPublier =
								"btnPublierBillet('" + aBilletBlog.getNumero() + "')";
							HBoutonsActions.push(
								IE.jsx.str(
									IE.jsx.fragment,
									null,
									IE.jsx.str("ie-btnicon", {
										class: "avecFond icon_pencil m-right-l",
										"ie-model": lIEModelEditer,
										title:
											ObjetTraduction_1.GTraductions.getValeur(
												"blog.EditerBillet",
											),
									}),
								),
							);
							if (this.estBlogDontJeSuisModerateur(aBilletBlog.blog)) {
								HBoutonsActions.push(
									IE.jsx.str(
										IE.jsx.fragment,
										null,
										IE.jsx.str("ie-btnicon", {
											class: "avecFond icon_check_fin m-right-l",
											"ie-model": lIEModelPublier,
											title:
												ObjetTraduction_1.GTraductions.getValeur(
													"blog.Publier",
												),
										}),
									),
								);
							}
						}
						HBoutonsActions.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str("ie-btnicon", {
									class: "avecFond icon_ellipsis_vertical",
									"ie-model": "btnActionsBillet",
									title: ObjetTraduction_1.GTraductions.getValeur(
										"blog.ActionsSurBillet",
									),
								}),
							),
						);
						HBoutonsActions.push("</div>");
					}
					aTabContenuBillet.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"header",
								{ class: "header-billet" },
								IE.jsx.str(
									"div",
									{ class: "titre-billet" },
									aBilletBlog.getLibelle(),
								),
								HBoutonsActions.join(""),
							),
						),
					);
					if (aParam.avecAffichageNomBlog && aBilletBlog.blog) {
						aTabContenuBillet.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "LibelleBlog" },
									"(",
									aBilletBlog.blog.getLibelle(),
									")",
								),
							),
						);
					}
					if (this.estBilletEditable(aBilletBlog) && !aBilletBlog.estPublie) {
						aTabContenuBillet.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "message-publication" },
									IE.jsx.str("i", { class: "icon_edt_permanence m-right-l" }),
									IE.jsx.str(
										"span",
										{ class: "Italique" },
										this.estBlogDontJeSuisModerateur(aBilletBlog.blog)
											? ObjetTraduction_1.GTraductions.getValeur(
													"blog.BilletAPublier",
												)
											: ObjetTraduction_1.GTraductions.getValeur(
													"blog.BilletEnAttentePublication",
												),
									),
								),
							),
						);
					}
					aTabContenuBillet.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"div",
								{ class: "DatePublicationBillet" },
								IE.jsx.str(
									"time",
									{
										datetime: ObjetDate_1.GDate.formatDate(
											aBilletBlog.datePublication,
											"%MM-%JJ",
										),
									},
									ObjetDate_1.GDate.formatDate(
										aBilletBlog.datePublication,
										"%JJJ %JJ %MMM - %hh%sh%mm",
									),
								),
							),
						),
					);
					aTabContenuBillet.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"div",
								{ class: "ContenuBillet tiny-view" },
								this.getContenuBillet(aBilletBlog),
							),
						),
					);
					const lListeDocs = aBilletBlog.listeDocuments;
					if (!!lListeDocs && lListeDocs.getNbrElementsExistes()) {
						const lListeDocumentsCasier =
							new ObjetListeElements_1.ObjetListeElements();
						let lAvecImage = false;
						lListeDocs.parcourir((aDoc) => {
							if (aDoc.existe()) {
								if (!aDoc.documentCasier.avecMiniaturePossible) {
									lListeDocumentsCasier.add(aDoc);
								} else {
									lAvecImage = true;
								}
							}
						});
						const lAvecCarrousel = !!aParam.idGalerieCarrousel && lAvecImage;
						if (lAvecCarrousel) {
							aTabContenuBillet.push(
								(0, tag_1.tag)("div", { id: aParam.idGalerieCarrousel }),
							);
						}
						const lListePJ = lAvecCarrousel
							? lListeDocumentsCasier
							: lListeDocs;
						aTabContenuBillet.push(
							(0, tag_1.tag)("div", { class: "zone-docs" }, (aTabZoneDocs) => {
								lListePJ.parcourir((D) => {
									if (D.existe()) {
										aTabZoneDocs.push(
											ObjetChaine_1.GChaine.composerUrlLienExterne({
												documentJoint: D.documentCasier,
												genreRessource:
													Enumere_Ressource_1.EGenreRessource.DocumentJoint,
												maxWidth: GNavigateur.ecranL - 40,
											}),
										);
									}
								});
							}),
						);
					}
					const lListeRedacteurs = new ObjetListeElements_1.ObjetListeElements()
						.add(aBilletBlog.auteur)
						.add(aBilletBlog.listeCoRedacteurs);
					const lNbRedacteurs = lListeRedacteurs.count();
					const lNbMaximumVignettes = IE.estMobile ? 3 : 5;
					const lListePhotos = this.creerPhotosIndividusEnVignette(
						lListeRedacteurs,
						lNbMaximumVignettes,
					);
					const lArrInformationsPhoto = [];
					if (lNbRedacteurs === 1) {
						lArrInformationsPhoto.push(
							"<span>",
							aBilletBlog.auteur.getLibelle(),
							"</span>",
						);
					} else if (lNbRedacteurs > lNbMaximumVignettes) {
						let lNbRedacteursAuDelaDuMax = lNbRedacteurs - lNbMaximumVignettes;
						lArrInformationsPhoto.push(
							'<i class="icon_eye_open"></i><span>+</span><span>',
							lNbRedacteursAuDelaDuMax,
							"</span>",
						);
					}
					let lStrInformationPhoto = "";
					if (lArrInformationsPhoto.length > 0) {
						lStrInformationPhoto =
							'<div class="InformationPhotoRedacteur">' +
							lArrInformationsPhoto.join("") +
							"</div>";
					}
					aTabContenuBillet.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"div",
								{ class: "RedacteursBillet" },
								IE.jsx.str("div", { class: "photos" }, lListePhotos),
								lStrInformationPhoto,
								IE.jsx.str(
									"div",
									{ "ie-if": "avecBoutonVoirRedacteurs" },
									IE.jsx.str(
										"ie-bouton",
										{
											"ie-model": "btnVoirRedacteurs",
											class: "themeBoutonNeutre",
										},
										ObjetTraduction_1.GTraductions.getValeur(
											"blog.billet.VoirLesRedacteurs",
										),
									),
								),
							),
						),
					);
					if (this.estBilletCommentable(aBilletBlog)) {
						const lExisteCommentaires =
							this.existeCommentairesSurBillet(aBilletBlog);
						aTabContenuBillet.push(
							(0, tag_1.tag)(
								"div",
								{ class: "zone-btns-commentaires" },
								(aTabZoneBtnCommentaires) => {
									if (lExisteCommentaires) {
										if (aBilletBlog.listeCommentaires.count() > 0) {
											aTabZoneBtnCommentaires.push(
												IE.jsx.str(
													IE.jsx.fragment,
													null,
													IE.jsx.str(
														"ie-bouton",
														{
															"ie-model": "btnVoirCommentaires",
															"ie-icon": "icon_conversation_cours",
															class: "themeBoutonNeutre",
														},
														aBilletBlog.listeCommentaires.count(),
													),
												),
											);
										}
									}
									aTabZoneBtnCommentaires.push(
										IE.jsx.str(
											IE.jsx.fragment,
											null,
											IE.jsx.str(
												"ie-bouton",
												{
													"ie-model": "btnCommenterBillet",
													"ie-title": "getTitleBtnCommenterBillet",
													class: "themeBoutonPrimaire",
												},
												ObjetTraduction_1.GTraductions.getValeur(
													"blog.commenter",
												),
											),
										),
									);
								},
							),
						);
						if (lExisteCommentaires) {
							aTabContenuBillet.push('<div class="CommentairePlusRecent">');
							let lCommentaire = aBilletBlog.listeCommentaires.get(0);
							aBilletBlog.listeCommentaires.parcourir((aCommentaire) => {
								if (
									aCommentaire.estAdministrable &&
									aCommentaire.estAModerer &&
									lCommentaire.etatCommentaire !==
										TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
											.ECB_Supprime &&
									!this.applicationSco.droits.get(
										ObjetDroitsPN_1.TypeDroits.estEnConsultation,
									)
								) {
									lCommentaire = aCommentaire;
									return false;
								}
							});
							const lEstMien =
								this.estCommentaireDUser(
									lCommentaire,
									this.etatUtilisateurSco.getUtilisateur(),
								) ||
								(this.allumerCommentairesDeMembres(
									this.etatUtilisateurSco.GenreEspace,
								) &&
									this.estCommentaireDeMembreDUtilisateur(lCommentaire));
							aTabContenuBillet.push(
								this.composeCardCommentaire({
									commentaire: lCommentaire,
									styleOn: lEstMien,
								}),
							);
							aTabContenuBillet.push("</div>");
						}
					}
				},
			),
		);
		return H.join("");
	}
	composeCardCommentaire(aParam) {
		const H = [];
		const lCommentaire = aParam.commentaire;
		const lEstAllume = aParam.styleOn === true;
		if (lCommentaire) {
			const lInfosEtat = this.getInfosEtatCommentaire(lCommentaire);
			const lAvecAffichageEtat =
				lInfosEtat.afficherEtat &&
				(lInfosEtat.etat !==
					TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet.ECB_Publie ||
					(lCommentaire.estAdministrable && !lCommentaire.estSupprimable));
			const lAvecModeration =
				lCommentaire.estAdministrable &&
				lCommentaire.etatCommentaire !==
					TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet.ECB_Supprime &&
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				);
			const lDivLibelleEtat = [];
			if (lAvecAffichageEtat) {
				const lClassesI = [lInfosEtat.iconEtat, lInfosEtat.class, "m-right"];
				lDivLibelleEtat.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ class: "EtatCommentaire flex-contain flex-center m-bottom" },
							IE.jsx.str("i", { class: lClassesI.join(" ") }),
							IE.jsx.str("div", null, lInfosEtat.str),
						),
					),
				);
			}
			const lBoutonsModifierEtatCommentaire = [];
			if (lAvecAffichageEtat && lAvecModeration) {
				const lIEModelBtnAccepterCommentaire =
					"btnAcceptCommentaire('" + lCommentaire.getNumero() + "')";
				const lIEModelBtnRejeterCommentaire =
					"btnRejetCommentaire('" + lCommentaire.getNumero() + "')";
				lBoutonsModifierEtatCommentaire.push(
					IE.jsx.str("ie-btnicon", {
						class: "avecFond icon_check_fin",
						"ie-model": lIEModelBtnAccepterCommentaire,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"blog.accepterCommentaire",
						),
					}),
				);
				lBoutonsModifierEtatCommentaire.push(
					IE.jsx.str("ie-btnicon", {
						class: "avecFond icon_fermeture_widget m-left-l",
						"ie-model": lIEModelBtnRejeterCommentaire,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"blog.refuserCommentaire",
						),
					}),
				);
			}
			if (lAvecAffichageEtat || lAvecModeration) {
				if (lCommentaire.estSupprimable) {
					const lIEModelBtnSupprimerCommentaire =
						"btnSupprCommentaire('" + lCommentaire.getNumero() + "')";
					lBoutonsModifierEtatCommentaire.push(
						IE.jsx.str("ie-btnicon", {
							class: "avecFond icon_trash",
							"ie-model": lIEModelBtnSupprimerCommentaire,
							title: ObjetTraduction_1.GTraductions.getValeur(
								"blog.supprimerCommentaire",
							),
						}),
					);
				}
			}
			const lInformationAuteurDateHeure = [];
			if (lCommentaire.auteur) {
				lInformationAuteurDateHeure.push(lCommentaire.auteur.getLibelle());
				if (lCommentaire.auteur.classe) {
					lInformationAuteurDateHeure.push(
						IE.jsx.str(
							"div",
							{ class: "m-left", "ie-ellipsis": false },
							lCommentaire.auteur.classe,
						),
					);
				}
			}
			if (lCommentaire.date) {
				lInformationAuteurDateHeure.push(
					ObjetDate_1.GDate.formatDate(lCommentaire.date, "%JJJ %JJ %MMM"),
				);
				lInformationAuteurDateHeure.push(
					ObjetDate_1.GDate.formatDate(lCommentaire.date, "%hh%sh%mm"),
				);
			}
			const lClassesArticle = ["ArticleCommentaireBillet"];
			if (lEstAllume) {
				lClassesArticle.push("estMien");
			}
			if (lCommentaire.estAModerer) {
				lClassesArticle.push("estAModerer");
			}
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"article",
						{ class: lClassesArticle.join(" ") },
						IE.jsx.str(
							"header",
							{ class: "flex-contain flex-center" },
							IE.jsx.str(
								"div",
								null,
								this.creerPhotoIndividuEnVignette(lCommentaire.auteur),
							),
							IE.jsx.str(
								"div",
								{ class: "fluid-bloc flex-contain flex-cols m-left-l" },
								lDivLibelleEtat.join(""),
								IE.jsx.str(
									"div",
									null,
									lInformationAuteurDateHeure.join(" - "),
								),
							),
							IE.jsx.str("div", null, lBoutonsModifierEtatCommentaire.join("")),
						),
						IE.jsx.str("div", { class: "m-top-l" }, lCommentaire.getLibelle()),
					),
				),
			);
		}
		return H.join("");
	}
	composeCardsCommentairesBillet(aBilletBlog) {
		const H = [];
		if (this.existeCommentairesSurBillet(aBilletBlog)) {
			aBilletBlog.listeCommentaires.parcourir((aCommentaire) => {
				const lEstMien =
					this.estCommentaireDUser(
						aCommentaire,
						this.etatUtilisateurSco.getUtilisateur(),
					) ||
					(this.allumerCommentairesDeMembres(
						this.etatUtilisateurSco.GenreEspace,
					) &&
						this.estCommentaireDeMembreDUtilisateur(aCommentaire));
				H.push(
					this.composeCardCommentaire({
						commentaire: aCommentaire,
						styleOn: lEstMien,
					}),
				);
			});
		}
		return H.join("");
	}
	avecRedactionBilletPossibleALaDateCourante(aBlog) {
		let lDateFinDeRedactionDeBillet = null;
		if (aBlog) {
			lDateFinDeRedactionDeBillet = aBlog.dateFinRedactionBillet;
		}
		return !ObjetDate_1.GDate.estAvantJour(
			lDateFinDeRedactionDeBillet,
			ObjetDate_1.GDate.getDateCourante(),
		);
	}
	avecSaisieCommentairePossibleALaDateCourante(aBilletBlog) {
		return aBilletBlog
			? this.avecRedactionBilletPossibleALaDateCourante(aBilletBlog.blog)
			: false;
	}
	accepterCommentaire(aCommentaire, aCallback) {
		this.modifierEtatCommentaire(
			aCommentaire,
			TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet.ECB_Publie,
			aCallback,
		);
	}
	refuserCommentaire(aCommentaire, aCallback) {
		this.modifierEtatCommentaire(
			aCommentaire,
			TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet.ECB_Refuse,
			aCallback,
		);
	}
	modifierEtatCommentaire(aCommentaire, aEtat, aCallback) {
		if (aCommentaire) {
			aCommentaire.etatCommentaire = aEtat;
			aCommentaire.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (aCallback) {
				aCallback();
			}
		}
	}
	choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				element: null,
				numeroService: -1,
				listeDocumentsJoints: null,
			},
			aParams,
		);
		return new Promise(() => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				{
					pere: lParams.instance,
					evenement: function (aParam) {
						if (
							aParam.listeNouveauxDocs &&
							aParam.listeNouveauxDocs.count() > 0
						) {
							aParam.listeNouveauxDocs.parcourir((aElement) => {
								aParams.evntSelectFichierCloud.call(lParams.instance, {
									element: lParams.element,
									eltCloud: aElement,
									listeDocumentsJoints: lParams.listeDocumentsJoints,
								});
							});
							aParams.evntValidFichierCloud.call(lParams.instance, {
								listeDocumentsJoints: lParams.listeDocumentsJoints,
							});
						}
					},
				},
			).setDonnees({ service: lParams.numeroService });
		});
	}
	estEspaceDirection(aGenreEspace) {
		return [
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
		].includes(aGenreEspace);
	}
	estEspaceEnseignant(aGenreEspace) {
		return [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
		].includes(aGenreEspace);
	}
	estEspaceAvecBlog(aGenreEspace) {
		return (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			].includes(aGenreEspace) && this.parametresSco.activerBlog
		);
	}
	allumerCommentairesDeMembres(aGenreEspace) {
		return [
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
		].includes(aGenreEspace);
	}
	avecFiltreDestinataireAuteur(aGenreEspace) {
		return [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.PrimEleve,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
		].includes(aGenreEspace);
	}
	strFiltreDestinataire(aGenreEspace) {
		switch (aGenreEspace) {
			case Enumere_Espace_1.EGenreEspace.Professeur:
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
			case Enumere_Espace_1.EGenreEspace.PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.PrimDirection:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection:
			case Enumere_Espace_1.EGenreEspace.Eleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
			case Enumere_Espace_1.EGenreEspace.PrimEleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.billetDestinataire",
				);
			case Enumere_Espace_1.EGenreEspace.Parent:
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
			case Enumere_Espace_1.EGenreEspace.PrimParent:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.billetDestinataireEnfant",
				);
		}
		return "";
	}
	strFiltreAuteur(aGenreEspace) {
		switch (aGenreEspace) {
			case Enumere_Espace_1.EGenreEspace.Professeur:
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
			case Enumere_Espace_1.EGenreEspace.PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.PrimDirection:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection:
			case Enumere_Espace_1.EGenreEspace.Eleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
			case Enumere_Espace_1.EGenreEspace.PrimEleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.filtre.billetAuteur",
				);
			case Enumere_Espace_1.EGenreEspace.Parent:
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
			case Enumere_Espace_1.EGenreEspace.PrimParent:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.filtre.billetAuteurEnfant",
				);
		}
		return "";
	}
	estBilletVisibleSelonFiltreAuteur(aBillet, aGenreEspace) {
		switch (aGenreEspace) {
			case Enumere_Espace_1.EGenreEspace.Eleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
			case Enumere_Espace_1.EGenreEspace.PrimEleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				return this.estBilletDUtilisateurConnecte(aBillet);
			case Enumere_Espace_1.EGenreEspace.Parent:
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
			case Enumere_Espace_1.EGenreEspace.PrimParent:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				return this.estBilletDeMembreDUtilisateur(aBillet);
			case Enumere_Espace_1.EGenreEspace.Professeur:
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
			case Enumere_Espace_1.EGenreEspace.PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
			case Enumere_Espace_1.EGenreEspace.PrimDirection:
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection:
				return this.estBilletDUtilisateurConnecte(aBillet);
		}
		return false;
	}
	estUnBilletAModerer(aBilletBlog) {
		let lEstAModerer = false;
		if (
			aBilletBlog &&
			this.estBilletEditable(aBilletBlog) &&
			!aBilletBlog.estPublie
		) {
			lEstAModerer = this.estBlogDontJeSuisModerateur(aBilletBlog.blog);
		}
		return lEstAModerer;
	}
	possedeAuMoinsUnCommentaireAModerer(aBillet) {
		let lPossedeUnCommentaireAModerer = false;
		if (aBillet && aBillet.listeCommentaires) {
			for (const lCommentaire of aBillet.listeCommentaires) {
				if (
					lCommentaire &&
					lCommentaire.etatCommentaire ===
						TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
							.ECB_EnAttenteValidation
				) {
					lPossedeUnCommentaireAModerer = true;
					break;
				}
			}
		}
		return lPossedeUnCommentaireAModerer;
	}
	getContenuBillet(aBillet) {
		let lContenu = "";
		if (aBillet) {
			lContenu = aBillet.contenu
				? aBillet.contenu.replace(/<img src="/gi, '<img ie-load-src="')
				: aBillet.contenu;
		}
		return lContenu;
	}
	avecGestionAppareilPhoto() {
		return this.etatUtilisateurSco.avecGestionAppareilPhoto();
	}
	getModerateursDeGenre(aBlog, aGenreRessource) {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		if (aBlog && aBlog.listeModerateurs) {
			lResult = aBlog.listeModerateurs.getListeElements((D) => {
				return D.getGenre() === aGenreRessource;
			});
		}
		return lResult;
	}
	getRedacteursDeGenre(aBlog, aGenreRessource) {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		if (aBlog && aBlog.listeRedacteurs) {
			lResult = aBlog.listeRedacteurs.getListeElements((D) => {
				return D.getGenre() === aGenreRessource;
			});
		}
		return lResult;
	}
	getPublicsDeGenre(aBlog, aGenreRessource) {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		if (aBlog && aBlog.listePublics) {
			lResult = aBlog.listePublics.getListeElements((D) => {
				return D.getGenre() === aGenreRessource;
			});
		}
		return lResult;
	}
	getListeIndividusCumulesParRessources(aListeIndividus) {
		const lListeIndividus = new ObjetListeElements_1.ObjetListeElements()
			.add(aListeIndividus)
			.trier();
		const lHashParents = {};
		lListeIndividus.parcourir((aElement) => {
			const lGenre = aElement.getGenre();
			if (!lHashParents[lGenre]) {
				let lLibelleElementParent;
				switch (lGenre) {
					case Enumere_Ressource_1.EGenreRessource.Personnel:
						lLibelleElementParent = ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.Personnels",
						);
						break;
					case Enumere_Ressource_1.EGenreRessource.Enseignant:
						lLibelleElementParent =
							ObjetTraduction_1.GTraductions.getValeur("Messagerie.Profs");
						break;
					case Enumere_Ressource_1.EGenreRessource.Eleve:
						lLibelleElementParent =
							ObjetTraduction_1.GTraductions.getValeur("Messagerie.Eleves");
						break;
					default:
						lLibelleElementParent = "";
						break;
				}
				const lParent = new ObjetElement_1.ObjetElement(
					lLibelleElementParent,
					0,
					lGenre,
				);
				lHashParents[lGenre] = lParent;
				lParent.estUnDeploiement = true;
				lParent.estDeploye = true;
			}
			aElement.pere = lHashParents[lGenre];
		});
		for (const lKey in lHashParents) {
			lListeIndividus.addElement(lHashParents[lKey]);
		}
		return lListeIndividus;
	}
	ouvrirFenetreChoixIndividusParGenre(
		aListeIndividus,
		aListeIndividusSelectionnes,
		aCallback,
	) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
			{
				pere: this,
				evenement(aGenreRessource, aListeIndividusSelectionnes, aNumeroBouton) {
					if (aNumeroBouton === lFenetre.indexBtnValider) {
						if (aCallback) {
							aCallback(aListeIndividusSelectionnes);
						}
					}
				},
				initialiser(aInstance) {
					aInstance.indexBtnValider = 1;
					aInstance.setOptionsFenetre({
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		const lListeRessources =
			this.getListeIndividusCumulesParRessources(aListeIndividus);
		const lListeRessourcesSelectionnees =
			new ObjetListeElements_1.ObjetListeElements().add(
				aListeIndividusSelectionnes,
			);
		lFenetre.setOptionsFenetreSelectionRessource({
			listeFlatDesign: true,
			autoriseEltAucun: true,
		});
		lFenetre.setDonnees({
			listeRessources: lListeRessources,
			listeRessourcesSelectionnees: lListeRessourcesSelectionnees,
		});
	}
	ouvrirModaleChoixIndividus(
		aGenreRessource,
		aListeNonModifiables,
		aListeDIndividusDuBlog,
		aCallbackSurValidationFenetre,
	) {
		let lForcerTousLesEleves =
			this.estEspaceEnseignant(this.etatUtilisateurSco.GenreEspace) &&
			this.etatUtilisateurSco.getUtilisateur().estDirecteur;
		this.moteurDestinataires
			.getDonneesPublic({
				genreRessource: aGenreRessource,
				forcerSansFiltreSurEleve: lForcerTousLesEleves,
			})
			.then((aIndividusPossiblesDeGenreRessource) => {
				const lIndividusPossibles =
					new ObjetListeElements_1.ObjetListeElements();
				if (aIndividusPossiblesDeGenreRessource.listePublic) {
					for (const lIndividu of aIndividusPossiblesDeGenreRessource.listePublic) {
						lIndividusPossibles.add(
							MethodesObjet_1.MethodesObjet.dupliquer(lIndividu),
						);
					}
				}
				const lIndividusCoches = new ObjetListeElements_1.ObjetListeElements();
				if (lIndividusPossibles) {
					for (const lIndividuPossible of lIndividusPossibles) {
						if (
							aListeNonModifiables &&
							aListeNonModifiables.getElementParNumero(
								lIndividuPossible.getNumero(),
							)
						) {
							lIndividuPossible.nonModifiable = true;
							lIndividusCoches.add(lIndividuPossible);
						} else if (
							aListeDIndividusDuBlog &&
							aListeDIndividusDuBlog.getElementParNumeroEtGenre(
								lIndividuPossible.getNumero(),
								lIndividuPossible.getGenre(),
							)
						) {
							lIndividusCoches.add(lIndividuPossible);
						}
					}
				}
				this.moteurDestinataires.openModaleSelectPublic({
					clbck: (aParam) => {
						aCallbackSurValidationFenetre(aParam.listePublicDonnee);
					},
					titre: this.moteurDestinataires.getTitreSelectRessource({
						genreRessource: aGenreRessource,
					}),
					genreRessource: aGenreRessource,
					listeRessources: lIndividusPossibles,
					listePublicDonnee: lIndividusPossibles,
					listeRessourcesSelectionnees: lIndividusCoches,
					avecCoche: true,
					avecFiltreAucunAccesEspace:
						aGenreRessource === Enumere_Ressource_1.EGenreRessource.Personnel,
				});
			});
	}
	ouvrirFenetreChoixModerateursBlog(aBlog, aGenreRessource, aCallback) {
		if (aBlog) {
			const lListeModerateursDuBlog = this.getModerateursDeGenre(
				aBlog,
				aGenreRessource,
			);
			const lListeModerateursNonModifiables =
				new ObjetListeElements_1.ObjetListeElements().add(
					this.getModerateurParDefaut(),
				);
			this.ouvrirModaleChoixIndividus(
				aGenreRessource,
				lListeModerateursNonModifiables,
				lListeModerateursDuBlog,
				(aListeModerateursCoches) => {
					aBlog.listeModerateurs.removeFilter((D) => {
						return D.getGenre() === aGenreRessource;
					});
					aBlog.listeModerateurs.add(aListeModerateursCoches);
					if (aCallback) {
						aCallback();
					}
				},
			);
		}
	}
	ouvrirFenetreChoixRedacteursBlog(aBlog, aGenreRessource, aCallback) {
		if (aBlog) {
			const lListeRedacteursDuBlog = this.getRedacteursDeGenre(
				aBlog,
				aGenreRessource,
			);
			this.ouvrirModaleChoixIndividus(
				aGenreRessource,
				null,
				lListeRedacteursDuBlog,
				(aListeRedacteursCoches) => {
					aBlog.listeRedacteurs.removeFilter((D) => {
						return D.getGenre() === aGenreRessource;
					});
					if (aListeRedacteursCoches) {
						for (const lDonneeSelectionnee of aListeRedacteursCoches) {
							aBlog.listeRedacteurs.add(lDonneeSelectionnee);
						}
					}
					if (aCallback) {
						aCallback();
					}
				},
			);
		}
	}
	ouvrirFenetreChoixPublicsBlog(aBlog, aGenreRessource, aCallback) {
		const lListeRedacteursDuBlog = this.getRedacteursDeGenre(
			aBlog,
			aGenreRessource,
		);
		const lListePublicDuBlog = this.getPublicsDeGenre(aBlog, aGenreRessource);
		const lListeIndividusNonModifiables =
			new ObjetListeElements_1.ObjetListeElements().add(lListeRedacteursDuBlog);
		this.ouvrirModaleChoixIndividus(
			aGenreRessource,
			lListeIndividusNonModifiables,
			lListePublicDuBlog,
			(aListePublicCoches) => {
				aBlog.listePublics.removeFilter((D) => {
					return D.getGenre() === aGenreRessource;
				});
				if (aListePublicCoches) {
					for (const lDonneeSelectionnee of aListePublicCoches) {
						if (
							!lListeRedacteursDuBlog.getElementParNumero(
								lDonneeSelectionnee.getNumero(),
							)
						) {
							aBlog.listePublics.add(lDonneeSelectionnee);
						}
					}
				}
				if (aCallback) {
					aCallback();
				}
			},
		);
	}
	ouvrirFenetreChoixRedacteursBilletBlog(aBilletBlog, aCallback) {
		if (aBilletBlog && aBilletBlog.blog) {
			const lAuteurBilletCopie = MethodesObjet_1.MethodesObjet.dupliquer(
				aBilletBlog.auteur,
			);
			lAuteurBilletCopie.nonEditable = true;
			const lListeRedacteursPossibles =
				new ObjetListeElements_1.ObjetListeElements().add(
					aBilletBlog.blog.listeRedacteurs,
				);
			const lListeRedacteursSelectionnes =
				new ObjetListeElements_1.ObjetListeElements()
					.add(lAuteurBilletCopie)
					.add(aBilletBlog.listeCoRedacteurs);
			this.ouvrirFenetreChoixIndividusParGenre(
				lListeRedacteursPossibles,
				lListeRedacteursSelectionnes,
				(aListeRedacteursCoches) => {
					if (aBilletBlog.listeCoRedacteurs) {
						aBilletBlog.listeCoRedacteurs.vider();
						if (aListeRedacteursCoches) {
							aListeRedacteursCoches.removeFilter((D) => {
								return D.getNumero() === aBilletBlog.auteur.getNumero();
							});
							aBilletBlog.listeCoRedacteurs.add(aListeRedacteursCoches);
						}
						if (aCallback) {
							aCallback();
						}
					}
				},
			);
		}
	}
	getElevesPossiblesPublicDuBlog(aBlog) {
		const lListeElevesPossibles = new ObjetListeElements_1.ObjetListeElements();
		lListeElevesPossibles.add(
			this.getRedacteursDeGenre(
				aBlog,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
		);
		lListeElevesPossibles.add(
			this.getPublicsDeGenre(aBlog, Enumere_Ressource_1.EGenreRessource.Eleve),
		);
		return lListeElevesPossibles;
	}
	ouvrirFenetreChoixPublicBillet(aBilletBlog, aCallback) {
		if (aBilletBlog && aBilletBlog.blog) {
			const lElevesPublicDuBlog = this.getElevesPossiblesPublicDuBlog(
				aBilletBlog.blog,
			);
			this.ouvrirFenetreChoixIndividusParGenre(
				lElevesPublicDuBlog,
				aBilletBlog.listePublicsBillet,
				(aListePublicCoches) => {
					aBilletBlog.listePublicsBillet = aListePublicCoches;
					if (aCallback) {
						aCallback();
					}
				},
			);
		}
	}
}
exports.ObjetMoteurBlog = ObjetMoteurBlog;

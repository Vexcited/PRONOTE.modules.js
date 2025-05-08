exports.InterfaceBlogFilActu = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const ObjetMoteurBlog_2 = require("ObjetMoteurBlog");
const ObjetIdentite_1 = require("ObjetIdentite");
const GestionnaireBlocBilletsBlog_1 = require("GestionnaireBlocBilletsBlog");
const ObjetRequetePageBlogFilActus_1 = require("ObjetRequetePageBlogFilActus");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetRequeteSaisieBlog_1 = require("ObjetRequeteSaisieBlog");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_EditionBilletBlog_1 = require("ObjetFenetre_EditionBilletBlog");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const ObjetFiltre_1 = require("ObjetFiltre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionBlog_1 = require("ObjetFenetre_EditionBlog");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_Blogs_1 = require("DonneesListe_Blogs");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetPosition_1 = require("ObjetPosition");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const OptionsPDFSco_1 = require("OptionsPDFSco");
class InterfaceBlogFilActu extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.moteur = new ObjetMoteurBlog_2.ObjetMoteurBlog();
		this.ids = {
			listeBillets: GUID_1.GUID.getId(),
			btnFiltre: GUID_1.GUID.getId(),
			filtreLabelDateDebut: GUID_1.GUID.getId(),
			filtreLabelDateFin: GUID_1.GUID.getId(),
		};
		this.droits = { avecCreationBlog: false };
		this.avecCBFiltreDestinataireAuteur =
			this.moteur.avecFiltreDestinataireAuteur(
				this.etatUtilisateurSco.GenreEspace,
			);
		this.donneesFiltre = {
			dontJeSuisAuteur: false,
			dontJeSuisModerateur: false,
			uniquementAvecCommentairesAModerer: false,
			listeCategories: new ObjetListeElements_1.ObjetListeElements(),
			categorie: null,
			dateDebut: ObjetDate_1.GDate.premiereDate,
			dateFin: ObjetDate_1.GDate.derniereDate,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnCreerBillet() {
				let lAvecBtnCreerBillet = false;
				if (aInstance.blogSelectionne) {
					lAvecBtnCreerBillet = aInstance.moteur.peutRedigerUnBilletDansCeBlog(
						aInstance.blogSelectionne,
					);
				} else {
					lAvecBtnCreerBillet =
						aInstance.moteur.existeAuMoinsUnBlogDansLequelJePeuxRediger(
							aInstance.listeBlogs,
						);
				}
				return lAvecBtnCreerBillet;
			},
			btnCreerBillet: {
				event() {
					const lBlogSelectionne = aInstance.blogSelectionne;
					if (lBlogSelectionne) {
						aInstance.creerNouveauBilletBlog(lBlogSelectionne);
					} else {
						aInstance.afficherMenuContextuelChoixBlog(
							aInstance.listeBlogs,
							aInstance.creerNouveauBilletBlog.bind(aInstance),
						);
					}
				},
				getDisabled() {
					const lBlogSelectionne = aInstance.blogSelectionne;
					if (lBlogSelectionne) {
						return !aInstance.moteur.avecRedactionBilletPossibleALaDateCourante(
							lBlogSelectionne,
						);
					}
					return false;
				},
			},
			getTitleBtnCreerBillet() {
				const lBlogSelectionne = aInstance.blogSelectionne;
				if (lBlogSelectionne) {
					if (
						!aInstance.moteur.avecRedactionBilletPossibleALaDateCourante(
							lBlogSelectionne,
						)
					) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"blog.FinDeSaisieRedactionDeBillet",
						);
					}
				}
				return "";
			},
			Filtre: {
				comboFiltreCategorie: {
					init(aCombo) {
						aCombo.setOptionsObjetSaisie({
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							longueur: IE.estMobile ? "100%" : 150,
						});
					},
					getDonnees() {
						return aInstance.donneesFiltre.listeCategories;
					},
					getIndiceSelection() {
						let lIndice = 0;
						if (aInstance.donneesFiltre.categorie) {
							lIndice =
								aInstance.donneesFiltre.listeCategories.getIndiceParElement(
									aInstance.donneesFiltre.categorie,
								);
						}
						return lIndice;
					},
					event(aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.estSelectionManuelle &&
							(!aInstance.donneesFiltre.categorie ||
								aInstance.donneesFiltre.categorie.getNumero() !==
									aParametres.element.getNumero())
						) {
							let lNouvelleCategorie = aParametres.element;
							if (lNouvelleCategorie && lNouvelleCategorie.getNumero() === -1) {
								lNouvelleCategorie = null;
							}
							aInstance.donneesFiltre.categorie = lNouvelleCategorie;
							aInstance.afficherSelonFiltres();
						}
					},
				},
				avecFiltresPourModerateur() {
					return aInstance.avecFiltrePourModeration();
				},
				cbDontJeSuisModerateur: {
					getValue() {
						return aInstance.donneesFiltre.dontJeSuisModerateur;
					},
					setValue(aValue) {
						aInstance.donneesFiltre.dontJeSuisModerateur = aValue;
						aInstance.afficherSelonFiltres();
					},
				},
				cbUniquementCommentairesAModerer: {
					getValue() {
						return aInstance.donneesFiltre.uniquementAvecCommentairesAModerer;
					},
					setValue(aValue) {
						aInstance.donneesFiltre.uniquementAvecCommentairesAModerer = aValue;
						aInstance.afficherSelonFiltres();
					},
				},
				avecFiltreAuteur() {
					return aInstance.avecCBFiltreDestinataireAuteur;
				},
				cbDontJeSuisAuteur: {
					getValue() {
						return aInstance.donneesFiltre.dontJeSuisAuteur;
					},
					setValue(aValue) {
						aInstance.donneesFiltre.dontJeSuisAuteur = aValue;
						aInstance.afficherSelonFiltres();
					},
				},
				avecFiltreDates() {
					return true;
				},
				selecteurFiltreDate: (aEstDateDebut) => {
					return {
						class: ObjetCelluleDate_1.ObjetCelluleDate,
						pere: this,
						init: (aInstanceDate) => {
							aInstanceDate.initialiser();
							aInstanceDate.setOptionsObjetCelluleDate({
								designMobile: true,
								premiereDate: ObjetDate_1.GDate.premiereDate,
								derniereDate: ObjetDate_1.GDate.derniereDate,
								labelledById: aEstDateDebut
									? this.ids.filtreLabelDateDebut
									: this.ids.filtreLabelDateFin,
							});
							if (aEstDateDebut) {
								this.selecteurFiltreDateDebut = aInstanceDate;
							} else {
								this.selecteurFiltreDateFin = aInstanceDate;
							}
						},
						start: (aInstanceDate) => {
							aInstanceDate.setDonnees(
								aEstDateDebut
									? this.donneesFiltre.dateDebut
									: this.donneesFiltre.dateFin,
							);
						},
						evenement: (aDate) => {
							if (aEstDateDebut) {
								this.donneesFiltre.dateDebut = new Date(aDate);
								if (
									ObjetDate_1.GDate.estDateJourAvant(
										this.donneesFiltre.dateFin,
										aDate,
									)
								) {
									this.selecteurFiltreDateFin.setDonnees(aDate, true);
								}
							} else {
								this.donneesFiltre.dateFin = new Date(aDate);
								if (
									ObjetDate_1.GDate.estDateJourAvant(
										aDate,
										this.donneesFiltre.dateDebut,
									)
								) {
									this.selecteurFiltreDateDebut.setDonnees(aDate, true);
								}
							}
							aInstance.afficherSelonFiltres();
						},
					};
				},
			},
			btnSelecteurBlogMobile: {
				event() {
					aInstance.afficherFenetreListeBlogs();
				},
				getLibelle() {
					let lStrBlogSelectionne = "";
					if (aInstance.blogSelectionne) {
						lStrBlogSelectionne = aInstance.blogSelectionne.getLibelle();
					}
					return (
						lStrBlogSelectionne ||
						ObjetTraduction_1.GTraductions.getValeur("blog.TousLesBlogs")
					);
				},
			},
			getIdentiteBoutonFlottant() {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init(aBtn) {
						aInstance.btnFlottant = aBtn;
						const lListeBoutons = [];
						const lBtnGenerationPDF = {
							primaire: true,
							icone: "icon_pdf",
							callback: () => {
								let lParams = {
									callbaskEvenement:
										aInstance.lancerGenerationPDFMobile.bind(aInstance),
									modeGestion:
										UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF
											.modeGestion.PDF,
									avecDepot: false,
									avecTitreSelonOnglet: true,
								};
								UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
									lParams,
								);
							},
						};
						lListeBoutons.push(lBtnGenerationPDF);
						const lBtnCreation = {
							primaire: true,
							icone: "icon_plus_fin",
							avecPresenceBoutonDynamique:
								aInstance.avecBoutonFlottantCreation.bind(aInstance),
							callback: () => {
								aInstance.afficherMenuContextuelBoutonFlottant();
							},
						};
						lListeBoutons.push(lBtnCreation);
						aBtn.setOptionsBouton({ listeBoutons: lListeBoutons });
					},
				};
			},
			estBtnFlottantVisible() {
				const lAvecBoutonCreation = aInstance.avecBoutonFlottantCreation();
				const lAvecBoutonPDF = true;
				return lAvecBoutonCreation || lAvecBoutonPDF;
			},
		});
	}
	lancerGenerationPDFMobile() {
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: this._getParametresPDF(),
			optionsPDF: OptionsPDFSco_1.OptionsPDFSco.defaut,
		});
	}
	avecBoutonFlottantCreation() {
		let lAvecBoutonFlottantCreation = false;
		if (this.avecDroitCreationBlog()) {
			lAvecBoutonFlottantCreation = true;
		} else {
			if (this.blogSelectionne) {
				lAvecBoutonFlottantCreation = this.moteur.peutRedigerUnBilletDansCeBlog(
					this.blogSelectionne,
				);
			} else {
				lAvecBoutonFlottantCreation =
					this.moteur.existeAuMoinsUnBlogDansLequelJePeuxRediger(
						this.listeBlogs,
					);
			}
		}
		return lAvecBoutonFlottantCreation;
	}
	avecDroitCreationBlog() {
		return this.droits.avecCreationBlog;
	}
	avecFiltrePourModeration() {
		let lAvecFiltresModerateur = false;
		if (this.blogSelectionne) {
			lAvecFiltresModerateur = this.moteur.estBlogDontJeSuisModerateur(
				this.blogSelectionne,
			);
		} else {
			lAvecFiltresModerateur =
				this.moteur.existeAuMoinsUnBlogDontJeSuisModerateur(this.listeBlogs);
		}
		return lAvecFiltresModerateur;
	}
	afficherMenuContextuelBoutonFlottant() {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aMenu) => {
				if (this.avecDroitCreationBlog()) {
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("blog.NouveauBlog"),
						true,
						() => {
							this.creerNouveauBlog();
						},
					);
				}
				const lBlogSelectionne = this.blogSelectionne;
				if (lBlogSelectionne) {
					const lCommandeRedigerBilletEditable =
						this.moteur.peutRedigerUnBilletDansCeBlog(lBlogSelectionne) &&
						this.moteur.avecRedactionBilletPossibleALaDateCourante(
							lBlogSelectionne,
						);
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("blog.NouveauBillet"),
						lCommandeRedigerBilletEditable,
						() => {
							this.creerNouveauBilletBlog(lBlogSelectionne);
						},
					);
				} else if (
					this.moteur.existeAuMoinsUnBlogDansLequelJePeuxRediger(
						this.listeBlogs,
					)
				) {
					aMenu.addTitre(
						ObjetTraduction_1.GTraductions.getValeur("blog.NouveauBillet") +
							" :",
					);
					for (const lBlog of this.listeBlogs) {
						if (
							this.moteur.peutRedigerUnBilletDansCeBlog(lBlog) &&
							this.moteur.avecRedactionBilletPossibleALaDateCourante(
								lBlogSelectionne,
							)
						) {
							aMenu.add(lBlog.getLibelle(), true, () => {
								this.creerNouveauBilletBlog(lBlog);
							});
						}
					}
				}
			},
		});
	}
	afficherMenuContextuelChoixBlog(aListeBlogs, aCallbackSurChoixBlog) {
		if (aListeBlogs && aListeBlogs.count() > 0 && aCallbackSurChoixBlog) {
			ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
				pere: this,
				initCommandes: (aMenu) => {
					aMenu.addTitre(
						ObjetTraduction_1.GTraductions.getValeur("blog.DansLeBlog") + " :",
					);
					for (const lBlog of aListeBlogs) {
						if (
							this.moteur.peutRedigerUnBilletDansCeBlog(lBlog) &&
							this.moteur.avecRedactionBilletPossibleALaDateCourante(lBlog)
						) {
							aMenu.add(lBlog.getLibelle(), true, () => {
								aCallbackSurChoixBlog(lBlog);
							});
						}
					}
				},
			});
		}
	}
	construireInstances() {
		this.identListeBlogs = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeBlogs,
			this.initialiserListeBlogs,
		);
		this.identFiltre = this.add(ObjetFiltre_1.ObjetFiltre);
		this.gestionnaireBillets = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocBilletsBlog_1.GestionnaireBlocBilletsBlog,
			{ pere: this, evenement: this._surEvntGestionnaireBillets },
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		if (IE.estMobile) {
			this.AddSurZone = [];
			this.AddSurZone.push({
				html: IE.jsx.str("ie-btnselecteur", {
					"ie-model": "btnSelecteurBlogMobile",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"blog.SelectionnezUnBlog",
					),
				}),
			});
			this.AddSurZone.push(
				this.getInstance(this.identFiltre).getBtnPourAddSurZone(),
			);
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<section class="ibfa-main">');
		if (!IE.estMobile) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", {
						id: this.getInstance(this.identListeBlogs).getNom(),
						class: "ObjetListeBlogs",
					}),
				),
			);
		}
		H.push('<div class="ContentPrincipal">');
		if (!IE.estMobile) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "filtre-actu" },
						this.composeHtmlBtnCreerBillet(),
						IE.jsx.str("div", { id: this.ids.btnFiltre }),
					),
				),
			);
		}
		H.push(
			'<div id="',
			this.getInstance(this.identFiltre).getNom(),
			'"></div>',
		);
		H.push(
			'<div class="page-billet-actu" id="',
			this.ids.listeBillets,
			'"></div>',
		);
		if (IE.estMobile && !this.btnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-display="estBtnFlottantVisible" ie-identite="getIdentiteBoutonFlottant"></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		H.push("</div>");
		H.push("</section>");
		return H.join("");
	}
	initialiserListeBlogs(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			titreCreation:
				ObjetTraduction_1.GTraductions.getValeur("blog.NouveauBlog"),
		});
	}
	evenementListeBlogs(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.setBlogSelectionne(aParametres.article);
				this.afficherSelonFiltres();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.creerNouveauBlog();
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (aParametres.article.existeNumero()) {
					this.ouvrirFenetreEditionBlog(aParametres.article);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (aParametres.article.existeNumero()) {
					this.blogSelectionne = null;
					aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					this.lancerRequeteSaisie(
						ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionBlog,
						{ blog: aParametres.article },
					);
				}
				break;
		}
	}
	afficherFenetreListeBlogs() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: (aNumeroBouton, aIndiceBlogSelectionne) => {
					if (aNumeroBouton === 1) {
						let lBlogSelectionne = null;
						if (aIndiceBlogSelectionne > 0) {
							lBlogSelectionne = this.listeBlogs.get(
								aIndiceBlogSelectionne - 1,
							);
						}
						this.setBlogSelectionne(lBlogSelectionne);
						this.afficherSelonFiltres();
					}
				},
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur("blog.ChoixDuBlog"),
					});
					aFenetre.paramsListe = {
						optionsListe: {
							labelWAI:
								ObjetTraduction_1.GTraductions.getValeur("blog.ChoixDuBlog"),
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
						},
					};
				},
			},
		);
		const lListeBlogsDeListe = this.getListeBlogsAvecElementTous();
		lFenetre.setDonnees(
			new DonneesListe_Blogs_1.DonneesListe_Blogs(
				lListeBlogsDeListe,
			).setOptions({
				avecEvnt_Selection: true,
				avecTri: false,
				flatDesignMinimal: true,
				avecBoutonActionLigne: false,
			}),
			true,
		);
	}
	setBlogSelectionne(aBlogSelectionne) {
		this.blogSelectionne = aBlogSelectionne;
		if (aBlogSelectionne && !aBlogSelectionne.existeNumero()) {
			this.blogSelectionne = null;
		}
		this.gestionnaireBillets.setOptions({
			avecAffichageNomBlog: !this.blogSelectionne,
		});
	}
	composeHtmlBtnCreerBillet() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-if": "avecBtnCreerBillet",
						"ie-model": "btnCreerBillet",
						"ie-title": "getTitleBtnCreerBillet",
						"ie-icon": "icon_edit",
						class: "themeBoutonPrimaire",
					},
					ObjetTraduction_1.GTraductions.getValeur("blog.NouveauBillet"),
				),
			),
		);
		return H.join("");
	}
	recupererDonnees() {
		this.requeteBlogFilActu();
	}
	composeFiltres() {
		const lIdLabelCategorie = "categ" + GUID_1.GUID.getId();
		const lFiltres = [];
		lFiltres.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"article",
					null,
					IE.jsx.str(
						"label",
						{ id: lIdLabelCategorie },
						ObjetTraduction_1.GTraductions.getValeur("blog.filtre.categorie"),
					),
					IE.jsx.str("ie-combo", {
						"ie-model": "Filtre.comboFiltreCategorie",
						"aria-labelledby": lIdLabelCategorie,
					}),
				),
				IE.jsx.str(
					"article",
					{
						"ie-if": "Filtre.avecFiltresPourModerateur",
						class: "FiltresPourModerateur",
					},
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "Filtre.cbDontJeSuisModerateur" },
						ObjetTraduction_1.GTraductions.getValeur("blog.billetModerateur"),
					),
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "Filtre.cbUniquementCommentairesAModerer" },
						ObjetTraduction_1.GTraductions.getValeur("blog.uniquAModerer"),
					),
				),
				IE.jsx.str(
					"article",
					{ "ie-if": "Filtre.avecFiltreAuteur", class: "FiltreAuteur" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "Filtre.cbDontJeSuisAuteur" },
						this.moteur.strFiltreAuteur(this.etatUtilisateurSco.GenreEspace),
					),
				),
				IE.jsx.str(
					"article",
					{ "ie-if": "Filtre.avecFiltreDates", class: "FiltreDates" },
					IE.jsx.str(
						"div",
						{ class: "FiltreDatesDu" },
						ObjetTraduction_1.GTraductions.getValeur("Du"),
						" : ",
						IE.jsx.str("div", {
							"ie-identite": "Filtre.selecteurFiltreDate(true)",
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "FiltreDatesAu" },
						ObjetTraduction_1.GTraductions.getValeur("Au"),
						" : ",
						IE.jsx.str("div", {
							"ie-identite": "Filtre.selecteurFiltreDate(false)",
						}),
					),
				),
			),
		);
		return lFiltres.join("");
	}
	afficherSelonFiltres() {
		const lBilletsBlog = new ObjetListeElements_1.ObjetListeElements();
		const lBlogSelectionne = this.blogSelectionne;
		if (lBlogSelectionne) {
			lBilletsBlog.add(lBlogSelectionne.listeBillets);
		} else {
			for (const lBlog of this.listeBlogs) {
				lBilletsBlog.add(lBlog.listeBillets);
			}
		}
		let lListeFiltree = new ObjetListeElements_1.ObjetListeElements();
		if (lBilletsBlog) {
			lListeFiltree = lBilletsBlog.getListeElements((aElement) => {
				let lAccepte = true;
				if (
					this.donneesFiltre.categorie &&
					this.donneesFiltre.categorie.getNumero() !== -1
				) {
					const lEstAucuneCategorie =
						!this.donneesFiltre.categorie.existeNumero();
					if (lEstAucuneCategorie) {
						lAccepte =
							!aElement.categorie || !aElement.categorie.existeNumero();
					} else {
						lAccepte =
							aElement.categorie &&
							aElement.categorie.getNumero() ===
								this.donneesFiltre.categorie.getNumero();
					}
				}
				if (lAccepte) {
					if (
						this.avecCBFiltreDestinataireAuteur &&
						this.donneesFiltre.dontJeSuisAuteur
					) {
						lAccepte = this.moteur.estBilletVisibleSelonFiltreAuteur(
							aElement,
							this.etatUtilisateurSco.GenreEspace,
						);
					}
				}
				if (lAccepte) {
					if (
						this.avecFiltrePourModeration() &&
						this.donneesFiltre.dontJeSuisModerateur
					) {
						if (this.blogSelectionne) {
							lAccepte = true;
						} else {
							lAccepte = this.moteur.estBlogDontJeSuisModerateur(aElement.blog);
						}
					}
				}
				if (lAccepte) {
					if (
						this.avecFiltrePourModeration() &&
						this.donneesFiltre.uniquementAvecCommentairesAModerer
					) {
						lAccepte =
							this.moteur.estUnBilletAModerer(aElement) ||
							this.moteur.possedeAuMoinsUnCommentaireAModerer(aElement);
					}
				}
				if (lAccepte) {
					const lDateDebut = this.donneesFiltre.dateDebut;
					const lDateFin = this.donneesFiltre.dateFin;
					if (lDateDebut && lDateFin) {
						lAccepte =
							ObjetDate_1.GDate.estJourEgal(
								lDateDebut,
								aElement.dateDerniereModification,
							) ||
							ObjetDate_1.GDate.estJourEgal(
								lDateFin,
								aElement.dateDerniereModification,
							) ||
							(ObjetDate_1.GDate.estAvantJour(
								lDateDebut,
								aElement.dateDerniereModification,
							) &&
								ObjetDate_1.GDate.estAvantJour(
									aElement.dateDerniereModification,
									lDateFin,
								));
					}
				}
				return lAccepte;
			});
			lListeFiltree.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.dateDerniereModification;
				}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
			]);
			lListeFiltree.trier();
		}
		this._actualiserPage(lListeFiltree);
	}
	creerNouveauBlog() {
		const lNouveauBlog = this.moteur.creerNouveauBlog();
		this.ouvrirFenetreEditionBlog(lNouveauBlog);
	}
	ouvrirFenetreEditionBlog(aBlog) {
		if (aBlog) {
			const lFenetreCreerBlog =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_EditionBlog_1.ObjetFenetre_EditionBlog,
					{
						pere: this,
						evenement(aGenreBouton, aBlog) {
							if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
								this.lancerRequeteSaisie(
									ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionBlog,
									{ blog: aBlog },
								);
							}
						},
					},
				);
			const lTitreFenetre =
				aBlog.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
					? ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.NouveauBlog",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"blog.fenetreEditionBlog.EditionBlog",
						);
			lFenetreCreerBlog.setOptionsFenetre({ titre: lTitreFenetre });
			lFenetreCreerBlog.setDonnees(aBlog);
		}
	}
	_surEvntGestionnaireBillets(
		aBillet,
		aGenreEvnt,
		avecReouvertureFenetreApresSaisie = false,
	) {
		switch (aGenreEvnt) {
			case ObjetMoteurBlog_1.EGenreEvntBillet.SurEdition:
				this.ouvrirFenetreEditionBilletBlog(aBillet);
				break;
			case ObjetMoteurBlog_1.EGenreEvntBillet.SurModifPublication:
				if (aBillet) {
					this.sauverContexteBilletBlog(aBillet);
					aBillet.estPublie = !aBillet.estPublie;
					aBillet.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.lancerRequeteSaisie(
						ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionBillet,
						{ billetBlog: aBillet },
					);
				}
				break;
			case ObjetMoteurBlog_1.EGenreEvntBillet.SurEditionCommentaire:
				if (aBillet) {
					this.sauverContexteBilletBlog(
						aBillet,
						avecReouvertureFenetreApresSaisie,
					);
					aBillet.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.lancerRequeteSaisie(
						ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionCommentaireBillet,
						{ billetBlog: aBillet },
					);
				}
				break;
			case ObjetMoteurBlog_1.EGenreEvntBillet.surSuppression:
				if (aBillet) {
					this.sauverContexteBilletBlog(aBillet);
					aBillet.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					this.lancerRequeteSaisie(
						ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionBillet,
						{ billetBlog: aBillet },
					);
				}
				break;
		}
	}
	lancerRequeteSaisie(aTypeSaisie, aParametresRequeteSaisie) {
		const lParamUpload = { listeFichiers: null, listeDJCloud: null };
		if (
			aParametresRequeteSaisie.listeFichiers &&
			aParametresRequeteSaisie.listeFichiers.count() > 0
		) {
			$.extend(lParamUpload, {
				listeFichiers: aParametresRequeteSaisie.listeFichiers,
			});
		}
		if (
			aParametresRequeteSaisie.listeClouds &&
			aParametresRequeteSaisie.listeClouds.count() > 0
		) {
			$.extend(lParamUpload, {
				listeDJCloud: aParametresRequeteSaisie.listeClouds,
			});
		}
		new ObjetRequeteSaisieBlog_1.ObjetRequeteSaisieBlog(
			this,
			this.surRequeteSaisieBlog.bind(this),
		)
			.addUpload(lParamUpload)
			.lancerRequete(aTypeSaisie, aParametresRequeteSaisie);
	}
	async surRequeteSaisieBlog(aJSONReponseNet) {
		if (aJSONReponseNet && aJSONReponseNet.messageSaisieRefusee) {
			await GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: aJSONReponseNet.messageSaisieRefusee,
			});
		}
		this.recupererDonnees();
	}
	free() {
		super.free();
		if (this.btnFlottant) {
			$("#" + this.btnFlottant.getNom().escapeJQ()).remove();
		}
	}
	getListeBlogsAvecElementTous() {
		const lListeBlogsDeListe = new ObjetListeElements_1.ObjetListeElements();
		lListeBlogsDeListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("blog.TousLesBlogs"),
			),
		);
		if (this.listeBlogs) {
			lListeBlogsDeListe.add(this.listeBlogs);
		}
		return lListeBlogsDeListe;
	}
	async requeteBlogFilActu() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		const lDonnees =
			await new ObjetRequetePageBlogFilActus_1.ObjetRequetePageBlogFilActus(
				this,
			).lancerRequete();
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			this._getParametresPDF.bind(this),
		);
		this.getInstance(this.identFiltre).setDonnees(this.composeFiltres(), {
			controleur: this.controleur,
			reinitFiltres: () => {
				this.donneesFiltre.dontJeSuisAuteur = false;
				this.donneesFiltre.dontJeSuisModerateur = false;
				this.donneesFiltre.uniquementAvecCommentairesAModerer = false;
				this.donneesFiltre.categorie = null;
				this.donneesFiltre.dateDebut = ObjetDate_1.GDate.premiereDate;
				this.donneesFiltre.dateFin = ObjetDate_1.GDate.derniereDate;
				this.selecteurFiltreDateDebut.setDonnees(this.donneesFiltre.dateDebut);
				this.selecteurFiltreDateFin.setDonnees(this.donneesFiltre.dateFin);
				this.afficherSelonFiltres();
			},
			estFiltresParDefaut: () => {
				return (
					!this.donneesFiltre.dontJeSuisAuteur &&
					!this.donneesFiltre.dontJeSuisModerateur &&
					!this.donneesFiltre.uniquementAvecCommentairesAModerer &&
					(!this.donneesFiltre.categorie ||
						this.donneesFiltre.categorie.getNumero() === -1) &&
					ObjetDate_1.GDate.estJourEgal(
						this.donneesFiltre.dateDebut,
						ObjetDate_1.GDate.premiereDate,
					) &&
					ObjetDate_1.GDate.estJourEgal(
						this.donneesFiltre.dateFin,
						ObjetDate_1.GDate.derniereDate,
					)
				);
			},
		});
		if (!IE.estMobile) {
			this.getInstance(this.identFiltre).setHtmlBoutonFiltre(
				this.ids.btnFiltre,
			);
		}
		this.droits.avecCreationBlog = lDonnees.avecDroitCreationBlog;
		this.getInstance(this.identListeBlogs).setOptionsListe({
			avecLigneCreation: this.avecDroitCreationBlog(),
		});
		this.listeBlogs = lDonnees.listeBlogs;
		const lListeBlogsDeListe = this.getListeBlogsAvecElementTous();
		let lIndiceBlogSelectionne = 0;
		if (this.blogSelectionne) {
			lIndiceBlogSelectionne = lListeBlogsDeListe.getIndiceParElement(
				this.blogSelectionne,
			);
		}
		lIndiceBlogSelectionne = Math.max(0, lIndiceBlogSelectionne);
		this.getInstance(this.identListeBlogs).setDonnees(
			new DonneesListe_Blogs_1.DonneesListe_Blogs(lListeBlogsDeListe),
			lIndiceBlogSelectionne,
		);
		this.listeCategories = lDonnees.listeCategories;
		this.gestionnaireBillets.setOptions({
			tailleMaxCommentaires: lDonnees.tailleMaxCommentaireBillet,
			avecAffichageNomBlog: true,
		});
		this.donneesFiltre.listeCategories.vider();
		if (this.listeCategories) {
			this.donneesFiltre.listeCategories.add(
				MethodesObjet_1.MethodesObjet.dupliquer(this.listeCategories),
			);
			const lToutesLesCategories = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"blog.ToutesCategories",
				),
				Numero: -1,
			});
			this.donneesFiltre.listeCategories.insererElement(
				lToutesLesCategories,
				0,
			);
		}
		this.afficherSelonFiltres();
		const lContexteSauve = this.etatUtilisateurSco.getContexteBilletBlog();
		const lSelection = lContexteSauve ? lContexteSauve.billet : null;
		if (lSelection) {
			let lBilletRetrouve = null;
			for (const lBlog of this.listeBlogs) {
				if (lBlog && lBlog.listeBillets) {
					for (const lBillet of lBlog.listeBillets) {
						if (lBillet.getNumero() === lSelection.getNumero()) {
							lBilletRetrouve = lBillet;
							break;
						}
					}
				}
				if (lBilletRetrouve) {
					break;
				}
			}
			if (lBilletRetrouve) {
				this.scrollerSurBillet(lBilletRetrouve);
				if (lContexteSauve && lContexteSauve.fenetreCommentairesOuverte) {
					this.gestionnaireBillets.ouvrirFenetreCommentairesDeBillet(
						lBilletRetrouve,
					);
				}
			}
			this.sauverContexteBilletBlog(null);
		}
	}
	_getParametresPDF() {
		const lFiltresBillets = {
			dontJeSuisAuteur: this.donneesFiltre.dontJeSuisAuteur,
			dontJeSuisModerateur: this.donneesFiltre.dontJeSuisModerateur,
			uniquementAvecCommentairesAModerer:
				this.donneesFiltre.uniquementAvecCommentairesAModerer,
			categorie: this.donneesFiltre.categorie,
			dateDebut: this.donneesFiltre.dateDebut,
			dateFin: this.donneesFiltre.dateFin,
		};
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Blog,
			blog: this.blogSelectionne,
			filtresBillets: lFiltresBillets,
		};
	}
	sauverContexteBilletBlog(aBillet, aFenetreCommentairesOuverte = false) {
		this.etatUtilisateurSco.setContexteBilletBlog(
			aBillet,
			aFenetreCommentairesOuverte,
		);
	}
	scrollerSurBillet(aBilletBlog) {
		if (aBilletBlog) {
			const lInstanceBlocBillet =
				this.gestionnaireBillets.getInstanceObjetMetier(aBilletBlog);
			if (lInstanceBlocBillet !== null && lInstanceBlocBillet !== undefined) {
				const lJEltEntete = $(
					"#" + lInstanceBlocBillet.getNom().escapeJQ() + " .ArticleBillet",
				);
				if (lJEltEntete !== null && lJEltEntete !== undefined) {
					const lTopReel = lJEltEntete.position().top;
					lJEltEntete.focus();
					let lEltPage = ObjetHtml_1.GHtml.getParentScrollable(this.Nom);
					if (lEltPage) {
						let lJEltZoneFixe = $(
							IE.estMobile ? ".navbar-fixed" : ".filtre-actu",
						);
						if (lJEltZoneFixe) {
							let lEltZoneFixe = lJEltZoneFixe.get(0);
							if (lEltZoneFixe) {
								lEltPage.scrollTop =
									lTopReel -
									ObjetPosition_1.GPosition.getClientRect(lEltZoneFixe)
										.outerHeight;
							}
						}
					}
				}
			}
		}
	}
	_actualiserPage(aListeFiltree) {
		if (!aListeFiltree || aListeFiltree.count() === 0) {
			this._afficherMessage(
				ObjetTraduction_1.GTraductions.getValeur("blog.aucunBillet"),
			);
		} else {
			this._afficherPage(aListeFiltree);
		}
	}
	_afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setHtml(
			this.ids.listeBillets,
			this.composeMessage(aMessage) +
				'<div class="Image_No_Data no-blog-data m-all-auto" aria-hidden="true"></div>',
		);
	}
	_afficherPage(aListeFiltree) {
		const lHtml = [];
		if (aListeFiltree) {
			aListeFiltree.parcourir((aBillet) => {
				const lBloc = this.gestionnaireBillets.composeBloc(aBillet);
				lHtml.push(lBloc.html);
			});
		}
		ObjetHtml_1.GHtml.setHtml(this.ids.listeBillets, lHtml.join(""), {
			controleur: this.controleur,
		});
		this.gestionnaireBillets.refresh();
	}
	creerNouveauBilletBlog(aBlogConcerne) {
		const lBilletBlog = this.moteur.creerNouveauBilletBlog(
			aBlogConcerne,
			this.etatUtilisateurSco.getUtilisateur(),
		);
		this.ouvrirFenetreEditionBilletBlog(lBilletBlog);
	}
	ouvrirFenetreEditionBilletBlog(aBilletBlog) {
		if (aBilletBlog) {
			const lTitreFenetre =
				aBilletBlog.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
					? ObjetTraduction_1.GTraductions.getValeur("blog.creerBillet")
					: ObjetTraduction_1.GTraductions.getValeur("blog.EditerBillet");
			const lFenetreEditionBilletBlog =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_EditionBilletBlog_1.ObjetFenetre_EditionBilletBlog,
					{
						pere: this,
						evenement: (aGenreAction, aParams) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this.sauverContexteBilletBlog(aBilletBlog);
								const lBlogConcerne = aBilletBlog.blog;
								this.lancerRequeteSaisie(
									ObjetRequeteSaisieBlog_1.TypeSaisieBlog.EditionBillet,
									{
										blog: lBlogConcerne,
										billetBlog: aParams.billetBlog,
										listeFichiers: aParams.listeFichiers,
										listeClouds: aParams.listeClouds,
									},
								);
							}
						},
					},
				);
			lFenetreEditionBilletBlog.setOptionsFenetre({ titre: lTitreFenetre });
			lFenetreEditionBilletBlog.setDonnees(aBilletBlog, {
				listeCategories: this.listeCategories,
			});
		}
	}
}
exports.InterfaceBlogFilActu = InterfaceBlogFilActu;

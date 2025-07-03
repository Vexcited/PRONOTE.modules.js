exports.ObjetFenetre_EditionBilletBlog = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const GUID_1 = require("GUID");
const Enumere_Etat_1 = require("Enumere_Etat");
const TinyInit_1 = require("TinyInit");
const ObjetFenetre_ListeCategorieBillet_1 = require("ObjetFenetre_ListeCategorieBillet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetGalerieCarrousel_1 = require("ObjetGalerieCarrousel");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const ObjetFenetre_EditionUrl_1 = require("ObjetFenetre_EditionUrl");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetFenetre_SelectionDocsMediatheque_1 = require("ObjetFenetre_SelectionDocsMediatheque");
class ObjetFenetre_EditionBilletBlog extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.donnees = { billetBlog: null, listeCategories: null };
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
		this.ids = { EditeurHTML: GUID_1.GUID.getId() };
		this.dimensions = { hauteurTiny: 300 };
		this.optionsDocuments = {
			avecMediatheque: true,
			avecFichiersJoints:
				(this.estEspaceProfesseur() &&
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
					)) ||
				this.estEspaceEtablissement(),
		};
		this.listeFichiersUpload = new ObjetListeElements_1.ObjetListeElements();
		this.listeClouds = new ObjetListeElements_1.ObjetListeElements();
		this.setOptionsFenetre({
			largeur: 800,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	estEspaceEtablissement() {
		return [
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.PrimMairie,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
			Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
		].includes(this.etatUtilisateurSco.GenreEspace);
	}
	estEspaceProfesseur() {
		return [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
		].includes(this.etatUtilisateurSco.GenreEspace);
	}
	construireInstances() {
		this.identGalerie = this.add(
			ObjetGalerieCarrousel_1.ObjetGalerieCarrousel,
			this.evenementCarrousel,
			this.initialiserCarrousel,
		);
	}
	initialiserCarrousel(aInstance) {
		aInstance.setOptions({
			dimensionPhoto: 200,
			nbMaxDiaposEnZoneVisible: 1,
			avecSuppression: true,
			avecEditionLegende: true,
			altImage: ObjetTraduction_1.GTraductions.getValeur("blog.altImage"),
		});
		aInstance.initialiser();
	}
	evenementCarrousel(aTypeCallback) {
		switch (aTypeCallback) {
			case ObjetGalerieCarrousel_1.TypeCallbackObjetGalerieCarrousel
				.SuppressionDiapo:
				if (this.donnees.billetBlog) {
					this.donnees.billetBlog.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
				break;
		}
	}
	setDonnees(aBilletBlog, aParametresSupp) {
		this.donnees.billetBlog = aBilletBlog;
		if (aParametresSupp) {
			this.donnees.listeCategories = aParametresSupp.listeCategories;
		}
		this.afficher();
		const lListeDiaposCarrousel = new ObjetListeElements_1.ObjetListeElements();
		if (this.donnees.billetBlog) {
			lListeDiaposCarrousel.add(
				this.getListeDocumentsJointDuCarrousel(this.donnees.billetBlog),
			);
		}
		this.getInstance(this.identGalerie).setDonnees({
			listeDiapos: lListeDiaposCarrousel,
			ressourceDocJoint: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
		});
		if (!IE.estMobile) {
			this._initTiny();
		}
	}
	jsxModeleCheckboxBilletEstPublie() {
		return {
			getValue: () => {
				var _a;
				return (_a = this.donnees.billetBlog) === null || _a === void 0
					? void 0
					: _a.estPublie;
			},
			setValue: (aValue) => {
				if (this.donnees.billetBlog) {
					this.donnees.billetBlog.estPublie = aValue;
					this.donnees.billetBlog.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			},
		};
	}
	jsxModeleRadioTypePublic(aEstPublicDuBlog) {
		return {
			getValue: () => {
				var _a;
				const lEstBilletPourPublicDuBlog =
					(_a = this.donnees.billetBlog) === null || _a === void 0
						? void 0
						: _a.estPublicDuBlog;
				return (
					(aEstPublicDuBlog && lEstBilletPourPublicDuBlog) ||
					(!aEstPublicDuBlog && !lEstBilletPourPublicDuBlog)
				);
			},
			setValue: (aValue) => {
				if (this.donnees.billetBlog && aValue) {
					this.donnees.billetBlog.estPublicDuBlog = aEstPublicDuBlog;
					this.donnees.billetBlog.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			},
			getName: () => {
				return `${this.Nom}_TypePublic`;
			},
			getDisabled: () => {
				let lEstRadiosTypePublicActives = false;
				if (this.donnees.billetBlog) {
					lEstRadiosTypePublicActives = this.donnees.billetBlog.estPublie;
					if (lEstRadiosTypePublicActives) {
						const lListeElevesPossibles =
							this.moteur.getElevesPossiblesPublicDuBlog(
								this.donnees.billetBlog.blog,
							);
						lEstRadiosTypePublicActives =
							!!lListeElevesPossibles && lListeElevesPossibles.count() > 0;
					}
				}
				return !lEstRadiosTypePublicActives;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnSupprimerBilletBlog() {
				return (
					aInstance.donnees.billetBlog &&
					aInstance.donnees.billetBlog.getEtat() !==
						Enumere_Etat_1.EGenreEtat.Creation
				);
			},
			btnSupprimerBilletBlog: {
				event() {
					if (aInstance.donnees && aInstance.donnees.billetBlog) {
						aInstance.moteur.afficherMessageConfirmationSuppressionBillet(
							aInstance.donnees.billetBlog,
							() => {
								aInstance.surValidation(1);
							},
						);
					}
				},
			},
			btnSelecteurRedacteurs: {
				event() {
					aInstance.moteur.ouvrirFenetreChoixRedacteursBilletBlog(
						aInstance.donnees.billetBlog,
						() => {
							aInstance.donnees.billetBlog.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						},
					);
				},
				getLibelle() {
					var _a;
					const H = [];
					if (aInstance.donnees && aInstance.donnees.billetBlog) {
						const lStrAuteur =
							((_a = aInstance.donnees.billetBlog.auteur) === null ||
							_a === void 0
								? void 0
								: _a.getLibelle()) || "";
						H.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str("ie-chips", null, lStrAuteur),
							),
						);
						if (aInstance.donnees.billetBlog.listeCoRedacteurs) {
							for (const lRedacteur of aInstance.donnees.billetBlog
								.listeCoRedacteurs) {
								H.push(
									IE.jsx.str(
										IE.jsx.fragment,
										null,
										IE.jsx.str("ie-chips", null, lRedacteur.getLibelle()),
									),
								);
							}
						}
					}
					return H.join("");
				},
				getIcone() {
					return "icon_user";
				},
			},
			btnSelecteurCategorie: {
				event() {
					aInstance.ouvrirFenetreListeCategories(aInstance.donnees.billetBlog);
				},
				getLibelle() {
					const H = [];
					if (aInstance.donnees && aInstance.donnees.billetBlog) {
						if (aInstance.donnees.billetBlog.categorie) {
							H.push(aInstance.donnees.billetBlog.categorie.getLibelle());
						}
					}
					return H.join("");
				},
			},
			titreBillet: {
				getValue() {
					return !!aInstance.donnees.billetBlog
						? aInstance.donnees.billetBlog.getLibelle()
						: "";
				},
				setValue(aValue) {
					if (aInstance.donnees.billetBlog) {
						aInstance.donnees.billetBlog.setLibelle(aValue);
						aInstance.donnees.billetBlog.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			contenuBillet: {
				getValue() {
					return !!aInstance.donnees.billetBlog
						? aInstance.donnees.billetBlog.contenu
						: "";
				},
				setValue(aValue) {
					if (aInstance.donnees.billetBlog) {
						aInstance.donnees.billetBlog.contenu = aValue;
						aInstance.donnees.billetBlog.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			btnSelecteurDocumentsJoints: {
				event() {
					if (aInstance.donnees.billetBlog) {
						aInstance._afficherFenetreActionContextNewDoc(
							aInstance.donnees.billetBlog,
						);
					}
				},
				getLibelle() {
					let lLibelleAjoutDoc = "";
					if (
						aInstance.estEspaceProfesseur() ||
						aInstance.estEspaceEtablissement()
					) {
						lLibelleAjoutDoc = ObjetTraduction_1.GTraductions.getValeur(
							"blog.billet.ressources",
						);
					} else {
						lLibelleAjoutDoc = ObjetTraduction_1.GTraductions.getValeur(
							"blog.billet.ressourcesEleve",
						);
					}
					return lLibelleAjoutDoc;
				},
				getIcone() {
					return "icon_piece_jointe";
				},
			},
			getHtmlChipsDocumentsJoints() {
				const T = [];
				if (aInstance.donnees.billetBlog) {
					const lDocumentsJointsHorsCarrousel =
						aInstance.getListeDocumentsJointHorsCarrousel(
							aInstance.donnees.billetBlog,
						);
					if (
						lDocumentsJointsHorsCarrousel &&
						lDocumentsJointsHorsCarrousel.count() > 0
					) {
						T.push(
							UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
								lDocumentsJointsHorsCarrousel,
								{ IEModelChips: "supprimerDocumentJointHorsCarrousel" },
							),
						);
					}
				}
				return T.join("");
			},
			supprimerDocumentJointHorsCarrousel: {
				eventBtn(aIndiceDocJoint) {
					const lDocumentsJointsHorsCarrousel =
						aInstance.getListeDocumentsJointHorsCarrousel(
							aInstance.donnees.billetBlog,
						);
					if (lDocumentsJointsHorsCarrousel) {
						const lDocJoint =
							lDocumentsJointsHorsCarrousel.get(aIndiceDocJoint);
						if (!!lDocJoint) {
							aInstance._supprimerDocJointCasier(lDocJoint);
						}
					}
				},
			},
			avecZonePublication() {
				return (
					aInstance.estEspaceProfesseur() || aInstance.estEspaceEtablissement()
				);
			},
			btnSelecteurPublicBillet: {
				event() {
					if (aInstance.donnees.billetBlog) {
						aInstance.moteur.ouvrirFenetreChoixPublicBillet(
							aInstance.donnees.billetBlog,
							() => {
								aInstance.donnees.billetBlog.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							},
						);
					}
				},
				getLibelle() {
					const H = [];
					if (
						aInstance.donnees.billetBlog &&
						aInstance.donnees.billetBlog.listePublicsBillet
					) {
						for (const lPublicBillet of aInstance.donnees.billetBlog
							.listePublicsBillet) {
							H.push(
								IE.jsx.str(
									IE.jsx.fragment,
									null,
									IE.jsx.str("ie-chips", null, lPublicBillet.getLibelle()),
								),
							);
						}
					}
					return H.join("");
				},
				getDisabled() {
					return (
						!aInstance.donnees.billetBlog ||
						aInstance.donnees.billetBlog.estPublicDuBlog
					);
				},
			},
		});
	}
	getListeDocumentsJointHorsCarrousel(aBilletBlog) {
		const lListeDocumentsJoints = new ObjetListeElements_1.ObjetListeElements();
		if (aBilletBlog && aBilletBlog.listeDocuments) {
			for (const lDoc of aBilletBlog.listeDocuments) {
				const lAvecMiniaturePossible =
					ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
						lDoc.documentCasier.getLibelle(),
					);
				if (!lAvecMiniaturePossible) {
					lListeDocumentsJoints.add(lDoc.documentCasier);
				}
			}
		}
		return lListeDocumentsJoints;
	}
	getListeDocumentsJointDuCarrousel(aBilletBlog) {
		const lListeDocumentsJoints = new ObjetListeElements_1.ObjetListeElements();
		if (aBilletBlog && aBilletBlog.listeDocuments) {
			for (const lDoc of aBilletBlog.listeDocuments) {
				const lAvecMiniaturePossible =
					ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
						lDoc.documentCasier.getLibelle(),
					);
				if (lAvecMiniaturePossible) {
					lListeDocumentsJoints.add(lDoc);
				}
			}
		}
		return lListeDocumentsJoints;
	}
	getMessageDonneesBilletInvalides() {
		if (this.donnees.billetBlog) {
			if (!this.donnees.billetBlog.getLibelle()) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.billet.msgAucunTitre",
				);
			}
			if (!this.donnees.billetBlog.contenu) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.billet.msgAucunContenu",
				);
			}
			if (
				this.donnees.billetBlog.estPublie &&
				!this.donnees.billetBlog.estPublicDuBlog
			) {
				if (
					!this.donnees.billetBlog.listePublicsBillet ||
					this.donnees.billetBlog.listePublicsBillet.count() === 0
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"blog.billet.msgAucunEleve",
					);
				}
			}
		}
		return "";
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			if (!IE.estMobile) {
				const lContenuTiny = this._getContenuTiny();
				if (lContenuTiny !== this.donnees.billetBlog.contenu) {
					this.donnees.billetBlog.contenu = lContenuTiny;
					this.donnees.billetBlog.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			}
			const lMessageDonneesBilletInvalides =
				this.getMessageDonneesBilletInvalides();
			if (lMessageDonneesBilletInvalides) {
				GApplication.getMessage().afficher({
					message: lMessageDonneesBilletInvalides,
				});
				return;
			}
			for (const lDocument of this.getListeDocumentsJointDuCarrousel(
				this.donnees.billetBlog,
			)) {
				if (lDocument && lDocument.libelleEnModification) {
					lDocument.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.donnees.billetBlog.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			}
			this.callback.appel(Enumere_Action_1.EGenreAction.Valider, {
				billetBlog: this.donnees.billetBlog,
				listeFichiers: this.listeFichiersUpload,
				listeClouds: this.listeClouds,
			});
		}
		this.fermer();
	}
	ouvrirFenetreListeCategories(aBilletBlog) {
		if (aBilletBlog) {
			const lFenetreListeCategoriesBillet =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_ListeCategorieBillet_1.ObjetFenetre_ListeCategorieBillet,
					{
						pere: this,
						evenement(aNumeroBouton, aDonnees) {
							if (aNumeroBouton === 1) {
								aBilletBlog.categorie = aDonnees.selection;
								aBilletBlog.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							}
						},
						initialiser(aInstanceFenetre) {
							aInstanceFenetre.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"blog.billet.categorie",
								),
								hauteur: 500,
								largeur: 350,
							});
						},
					},
				);
			lFenetreListeCategoriesBillet.setDonnees({
				listeCategories: this.donnees.listeCategories,
				categorie: aBilletBlog.categorie,
			});
		}
	}
	composeContenu() {
		const T = [];
		T.push('<div class="p-x-l">');
		T.push(this._composeRedacteurs());
		T.push(this._composeCategorie());
		T.push(this._composeTitre());
		T.push(this._composeContenu());
		T.push(this._composeSelecteurDocumentsJoints());
		T.push(this._composePublication());
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
					{ class: "compose-bas", "ie-if": "avecBtnSupprimerBilletBlog" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnSupprimerBilletBlog",
						title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						class: "icon_trash avecFond i-medium",
					}),
				),
			),
		);
		return H.join("");
	}
	_initTiny() {
		var _a;
		if (
			this.ids.EditeurHTML &&
			!TinyInit_1.TinyInit.get(this.ids.EditeurHTML)
		) {
			const lHeight = this.dimensions.hauteurTiny;
			const lParamTiny = {
				id: this.ids.EditeurHTML,
				min_height: lHeight,
				max_height: lHeight,
				height: lHeight,
			};
			if (!IE.estMobile) {
				TinyInit_1.TinyInit.init(lParamTiny).then(
					() => {
						this._initTiny();
					},
					() => {},
				);
			}
			return;
		}
		if (
			(_a = this.donnees.billetBlog) === null || _a === void 0
				? void 0
				: _a.contenu
		) {
			this._setContenuTiny(this.donnees.billetBlog.contenu);
		}
	}
	_supprimerDocJointCasier(aDocRelation) {
		if (!!aDocRelation) {
			aDocRelation.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			for (const lDocBilleBlog of this.donnees.billetBlog.listeDocuments) {
				if (
					lDocBilleBlog.documentCasier &&
					lDocBilleBlog.documentCasier.getNumero() === aDocRelation.getNumero()
				) {
					lDocBilleBlog.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					break;
				}
			}
			this.donnees.billetBlog.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_getContenuTiny() {
		const lEditor = TinyInit_1.TinyInit.get(this.ids.EditeurHTML);
		if (lEditor) {
			return lEditor.getContent();
		}
	}
	_setContenuTiny(aContenu) {
		const lEditor = TinyInit_1.TinyInit.get(this.ids.EditeurHTML);
		if (lEditor) {
			lEditor.setContent(aContenu);
		}
	}
	composeStringAvecMarqueurChampObligatoire(aStr) {
		return (
			aStr +
			ObjetTraduction_1.GTraductions.getValeur("MarqueurChampsObligatoires")
		);
	}
	_composeRedacteurs() {
		const lIdLabelRedacteurs = "redac" + GUID_1.GUID.getId();
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdLabelRedacteurs },
						this.composeStringAvecMarqueurChampObligatoire(
							ObjetTraduction_1.GTraductions.getValeur(
								"blog.billet.redacteurs",
							),
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": "btnSelecteurRedacteurs",
						class: "chips-inside",
						"aria-labelledby": lIdLabelRedacteurs,
					}),
				),
			),
		);
		return T.join("");
	}
	_composeCategorie() {
		const lIdLabelCategorie = "categ" + GUID_1.GUID.getId();
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ id: lIdLabelCategorie },
						ObjetTraduction_1.GTraductions.getValeur("blog.billet.categorie"),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": "btnSelecteurCategorie",
						"aria-labelledby": lIdLabelCategorie,
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"blog.billet.categorie",
						),
					}),
				),
			),
		);
		return T.join("");
	}
	_composeTitre() {
		const lId = `${this.Nom}_inp_titre`;
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "LabelChamp" },
					IE.jsx.str(
						"label",
						{ for: lId },
						this.composeStringAvecMarqueurChampObligatoire(
							ObjetTraduction_1.GTraductions.getValeur("blog.billet.titre"),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("input", {
							id: lId,
							type: "text",
							class: "full-width",
							"ie-model": "titreBillet",
							placeholder: ObjetTraduction_1.GTraductions.getValeur(
								"blog.billet.rediger",
							),
						}),
					),
				),
			),
		);
		return T.join("");
	}
	_composeContenu() {
		const T = [];
		T.push('<div class="ChampContenuBillet">');
		T.push(
			'<label class="m-bottom">',
			this.composeStringAvecMarqueurChampObligatoire(
				ObjetTraduction_1.GTraductions.getValeur("blog.billet.contenu"),
			),
			"</label>",
		);
		if (IE.estMobile) {
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", {
						"ie-model": "contenuBillet",
						class: "contenteditable_index",
						contenteditable: "true",
					}),
				),
			);
		} else {
			const lStylesTiny = [
				"width:100%;",
				"height:" + this.dimensions.hauteurTiny + "px;",
			];
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", {
						id: this.ids.EditeurHTML,
						style: lStylesTiny.join(""),
					}),
				),
			);
		}
		T.push("</div>");
		return T.join("");
	}
	_composeSelecteurDocumentsJoints() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": "btnSelecteurDocumentsJoints",
					class: "pj ZoneSelectionPJ",
					role: "button",
				}),
				IE.jsx.str(
					"div",
					{ class: "ConteneurCarrousel" },
					IE.jsx.str("div", { id: this.getNomInstance(this.identGalerie) }),
				),
				IE.jsx.str("div", { "ie-html": "getHtmlChipsDocumentsJoints" }),
			),
		);
		T.push(
			'<div style="display:none; color:red;">',
			ObjetTraduction_1.GTraductions.getValeur("blog.msgInfoRotation"),
			"</div>",
		);
		return T.join("");
	}
	_composePublication() {
		const lClassesRadioPublicEleveFamille = ["m-top"];
		if (!IE.estMobile) {
			lClassesRadioPublicEleveFamille.push("flex-contain");
		}
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ "ie-if": "avecZonePublication", class: "ZonePublication" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxBilletEstPublie.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"blog.billet.etatPublie",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "m-left-xl" },
						IE.jsx.str(
							"div",
							{ class: "m-top" },
							IE.jsx.str(
								"ie-radio",
								{ "ie-model": this.jsxModeleRadioTypePublic.bind(this, true) },
								ObjetTraduction_1.GTraductions.getValeur(
									"blog.billet.auPublicDuBlog",
								),
							),
						),
						IE.jsx.str(
							"div",
							{ class: lClassesRadioPublicEleveFamille.join(" ") },
							IE.jsx.str(
								"ie-radio",
								{ "ie-model": this.jsxModeleRadioTypePublic.bind(this, false) },
								ObjetTraduction_1.GTraductions.getValeur(
									"blog.billet.uniquementEleveEtFamille",
								),
							),
							IE.jsx.str("ie-btnselecteur", {
								"ie-model": "btnSelecteurPublicBillet",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"blog.billet.waiPublicEleve",
								),
							}),
						),
					),
				),
			),
		);
		return T.join("");
	}
	_afficherFenetreActionContextNewDoc(aBilletBlog) {
		const lActions = [];
		if (this.optionsDocuments.avecMediatheque) {
			lActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"blog.billet.parmiDocumentsMediatheque",
				),
				icon: "icon_folder_close",
				event: () => {
					this._ouvrirFenetreSelectionDocsMediatheque(aBilletBlog);
				},
				class: "bg-green-claire",
			});
		}
		if (this.optionsDocuments.avecFichiersJoints) {
			if (this.moteur.avecGestionAppareilPhoto()) {
				lActions.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"blog.billet.prendrePhoto",
					),
					icon: "icon_camera",
					event: (aParams) => {
						this._addFiles(aBilletBlog, aParams);
					},
					optionsSelecFile: {
						title: "",
						maxFiles: 0,
						maxSize: this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
						),
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						acceptDragDrop: false,
						capture: "environment",
						accept: "image/*",
					},
					selecFile: true,
					class: "bg-orange-claire",
				});
				lActions.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"blog.billet.ouvrirGalerie",
					),
					icon: "icon_picture",
					event: (aParams) => {
						this._addFiles(aBilletBlog, aParams);
					},
					optionsSelecFile: {
						title: "",
						maxFiles: 0,
						maxSize: this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
						),
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						multiple: true,
						acceptDragDrop: false,
						accept: "image/*",
					},
					selecFile: true,
					class: "bg-orange-claire",
				});
			}
			const lAvecCloud =
				this.etatUtilisateurSco.listeCloud &&
				this.etatUtilisateurSco.listeCloud.count() > 0;
			lActions.push({
				libelle: IE.estMobile
					? ObjetTraduction_1.GTraductions.getValeur(
							"blog.billet.ouvrirMesDocuments",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"blog.billet.depuisMonPoste",
						),
				icon: "icon_folder_open",
				event: (aParams) => {
					this._addFiles(aBilletBlog, aParams);
				},
				optionsSelecFile: {
					title: "",
					maxFiles: 0,
					maxSize: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
					),
					genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					multiple: true,
					acceptDragDrop: false,
					avecTransformationFlux_versCloud: lAvecCloud,
				},
				selecFile: true,
				class: "bg-orange-claire",
			});
			if (lAvecCloud) {
				lActions.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"blog.billet.ouvrirCloud",
					),
					icon: "icon_cloud",
					event: () => {
						this.ouvrirFenetreChoixListeCloud(aBilletBlog);
					},
					class: "bg-orange-claire",
				});
			}
			if (GEtatUtilisateur.avecCloudENEJDisponible()) {
				const lActionENEJ =
					ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
						() => this.ouvrirFenetreCloudENEJ(aBilletBlog),
					);
				if (lActionENEJ) {
					lActions.push(lActionENEJ);
				}
			}
			lActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"blog.billet.nouveauLien",
				),
				icon: "icon_globe mix-icon_plus",
				event: () => {
					this._ouvrirFenetreEditionSiteWeb({
						billet: aBilletBlog,
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
					});
				},
				class: "bg-blue-claire",
			});
		}
		if (lActions.length < 2) {
			if (lActions.length === 1 && lActions[0].event) {
				lActions[0].event.apply(null);
			}
		} else {
			ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
				lActions,
				{ pere: this },
			);
		}
	}
	ouvrirFenetreChoixListeCloud(aBillet) {
		const lThis = this;
		let lParams = {
			callbaskEvenement: (aLigne) => {
				if (aLigne >= 0) {
					const lService = this.etatUtilisateurSco.listeCloud.get(aLigne);
					lThis.choisirFichierCloud(aBillet, lService);
				}
			},
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.Cloud,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	choisirFichierCloud(aBillet, aService) {
		this.moteur.choisirFichierCloud({
			instance: this,
			element: aBillet,
			numeroService: aService.getGenre(),
			listeDocumentsJoints: this.listeClouds,
			evntSelectFichierCloud: this._ajoutFichierCloud.bind(this),
			evntValidFichierCloud: () => {},
		});
	}
	ouvrirFenetreCloudENEJ(aBillet) {
		this.choisirFichierCloud(aBillet, GEtatUtilisateur.getCloudENEJ());
	}
	_ajoutFichierCloud(aParamSelect) {
		const lBillet = aParamSelect.element;
		const lDocCasier = aParamSelect.eltCloud;
		const lRelation = this._ajouterRelationDocCasierAuBillet(
			lDocCasier,
			lBillet,
		);
		if (
			ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
				lDocCasier.getLibelle(),
			)
		) {
			this.getInstance(this.identGalerie).ajouterDiapo(lRelation);
		}
		lBillet.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		aParamSelect.listeDocumentsJoints.addElement(lDocCasier);
	}
	_ouvrirFenetreEditionSiteWeb(aParam) {
		const lFenetreEditionSiteWeb =
			ObjetFenetre_EditionUrl_1.ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl(
				{
					pere: this,
					evenement: (aValider, aParamsFenetre) => {
						if (
							!!aParamsFenetre &&
							!!aParamsFenetre.bouton &&
							aParamsFenetre.bouton.valider &&
							!!aParamsFenetre.donnee
						) {
							const lBillet = aParam.billet;
							const lDocCasier = ObjetElement_1.ObjetElement.create({
								Libelle:
									aParamsFenetre.donnee.libelle || aParamsFenetre.donnee.url,
								Genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
								Etat: Enumere_Etat_1.EGenreEtat.Creation,
								url: aParamsFenetre.donnee.url,
							});
							this._ajouterRelationDocCasierAuBillet(lDocCasier, lBillet);
							lBillet.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					},
				},
			);
		lFenetreEditionSiteWeb.setOptionsFenetreEditionUrl({
			avecCommentaire: false,
		});
		lFenetreEditionSiteWeb.setDonnees({ libelle: "", url: "http://" });
	}
	_ajouterRelationDocCasierAuBillet(aDocCasier, aBillet) {
		const lDocRelation = ObjetElement_1.ObjetElement.create({
			Numero: aDocCasier.getNumero(),
			documentCasier: undefined,
			libelle: undefined,
			estDeMediatheque: undefined,
			libelleEnModification: undefined,
		});
		lDocRelation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lDocRelation.documentCasier = aDocCasier;
		aBillet.listeDocuments.addElement(lDocRelation);
		return lDocRelation;
	}
	_addFiles(aBilletBlog, aParams) {
		const lListeFichiers =
			aParams !== null && aParams !== undefined ? aParams.listeFichiers : null;
		const lListeFichiersClouds =
			UtilitaireSelecFile_1.UtilitaireSelecFile.extraireListeFichiersCloudsPartage(
				lListeFichiers,
			);
		if (
			lListeFichiers !== null &&
			lListeFichiers !== undefined &&
			lListeFichiers.count() > 0
		) {
			let lAvecAuMoinsUnAjoutCarrousel = false;
			lListeFichiers.parcourir((aFichier) => {
				if (aFichier) {
					aFichier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					this.listeFichiersUpload.addElement(aFichier);
					const lDocCasier = ObjetElement_1.ObjetElement.create({
						Numero: ObjetElement_1.ObjetElement.getNumeroCreation(),
						Libelle: aFichier.Libelle,
						Genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					});
					lDocCasier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					lDocCasier.fichier = aFichier;
					const lRelation = this._ajouterRelationDocCasierAuBillet(
						lDocCasier,
						aBilletBlog,
					);
					if (
						ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
							lDocCasier.getLibelle(),
						)
					) {
						lAvecAuMoinsUnAjoutCarrousel = true;
						this.getInstance(this.identGalerie).ajouterDiapo(lRelation);
					}
					aBilletBlog.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			});
			if (lAvecAuMoinsUnAjoutCarrousel) {
				this.positionnerFenetre();
			}
		}
		if (lListeFichiersClouds && lListeFichiersClouds.count() > 0) {
			lListeFichiersClouds.parcourir((aFichier) => {
				this._ajoutFichierCloud({
					element: aBilletBlog,
					eltCloud: aFichier,
					listeDocumentsJoints: this.listeClouds,
				});
			});
		}
	}
	_ouvrirFenetreSelectionDocsMediatheque(aBilletBlog) {
		if (this.optionsDocuments.avecMediatheque) {
			const lFenetreSelectionDocsMediatheque =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionDocsMediatheque_1.ObjetFenetre_SelectionDocsMediatheque,
					{
						pere: this,
						evenement(aNumeroBouton, aListeSelection) {
							if (aNumeroBouton === 1) {
								if (aListeSelection) {
									for (const lDocumentMediathequeSelectionnee of aListeSelection) {
										const lDocCasier =
											lDocumentMediathequeSelectionnee.documentCasier;
										lDocCasier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
										const lRelation = this._ajouterRelationDocCasierAuBillet(
											lDocCasier,
											aBilletBlog,
										);
										if (
											ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
												lDocCasier.getLibelle(),
											)
										) {
											this.getInstance(this.identGalerie).ajouterDiapo(
												lRelation,
											);
										}
										aBilletBlog.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
									}
								}
							}
						},
						initialiser(aInstance) {
							aInstance.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"blog.ressourcesMediatheque",
								),
								largeur: 800,
								hauteur: 600,
								listeBoutons: [
									ObjetTraduction_1.GTraductions.getValeur("Annuler"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								],
							});
						},
					},
				);
			lFenetreSelectionDocsMediatheque.setDonnees({
				blogConcerne: aBilletBlog.blog,
			});
		}
	}
}
exports.ObjetFenetre_EditionBilletBlog = ObjetFenetre_EditionBilletBlog;

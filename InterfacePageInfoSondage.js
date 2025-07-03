exports.InterfacePageInfoSondage = void 0;
const EGenreEvntActu_1 = require("EGenreEvntActu");
const InterfaceConsultInfoSondage_1 = require("InterfaceConsultInfoSondage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetPosition_1 = require("ObjetPosition");
const GUID_1 = require("GUID");
const DonneesListe_InfosSond_1 = require("DonneesListe_InfosSond");
const DonneesListeTypesAccesInfoSond_1 = require("DonneesListeTypesAccesInfoSond");
const ObjetDate_1 = require("ObjetDate");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const MethodesObjet_1 = require("MethodesObjet");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const AccessApp_1 = require("AccessApp");
class InterfacePageInfoSondage extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.genresAffichages = { reception: 0, saisie: 1, modeles: 2 };
		this.ids = { msgAucun: GUID_1.GUID.getId() };
		this.filtreModeItem = null;
		this.genreAff = this.genresAffichages.reception;
		this.uniquementNonLues = GEtatUtilisateur.getUniquementNonLues();
		this.modeAuteur = false;
		this.hauteurZoneCommandesDiffusion = IE.estMobile ? 0 : 80;
		this.init();
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this._surPostResize,
		);
		this.setOptionsInfoSondage();
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				InterfacePageInfoSondage.genreEcran.listeBlocs,
				InterfacePageInfoSondage.genreEcran.visuBloc,
			],
			avecMsgAucun: true,
			selectionCouranteModeReception: null,
			selectionCouranteModeDiffusion: null,
		});
		if (!this.avecAuteur) {
			this.contexte = $.extend(this.contexte, { niveauCourant: 0 });
		}
		if (this.avecFiltreCategorie) {
			this.categorie = GEtatUtilisateur.getCategorie();
		}
		this.typeSelectionne = null;
	}
	init() {}
	evntRetourEcranPrec() {
		switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
			case InterfacePageInfoSondage.genreEcran.visuBloc:
				this.selectionCouranteModeReception = null;
				this.selectionCouranteModeDiffusion = null;
				this.revenirSurEcranPrecedent();
				break;
		}
	}
	construireInstances() {
		this.identVisuInfoSondage = this.add(
			InterfaceConsultInfoSondage_1.InterfaceConsultInfoSondage,
			this._evntVisuInfoSond.bind(this),
			this._initVisuInfoSond.bind(this),
		);
		this.identListeInfosSond = this.add(
			ObjetListe_1.ObjetListe,
			this.evntSurListeInfoSond,
			(aListe) => {
				aListe.setOptionsListe({
					ariaLabel: () => {
						let lStr = GEtatUtilisateur.getLibelleLongOnglet();
						if (
							this.existeInstance(this.identListeTypesAccesInfosSond) &&
							this.typeSelectionne
						) {
							lStr += ` ${ObjetTraduction_1.GTraductions.getValeur("infoSond.Categories")} - ${this.typeSelectionne.getLibelle()}`;
						}
						return lStr;
					},
				});
			},
		);
		if (this.avecAuteur) {
			this.identListeTypesAccesInfosSond = this.add(
				ObjetListe_1.ObjetListe,
				this.evntSurListeTypeAccesInfoSond,
				this.initListeTypeAccesInfoSond,
			);
		}
		if (this.avecAuteur && this.droitSaisie) {
			this.identEditionInfoSond = this.instancierEditionInfoSond();
		}
	}
	initListeTypeAccesInfoSond(aInstance) {
		aInstance.setOptionsListe({
			ariaLabel: `${GEtatUtilisateur.getLibelleLongOnglet()} ${ObjetTraduction_1.GTraductions.getValeur("infoSond.Categories")}`,
			avecLigneCreation: false,
		});
	}
	declencherActionsAutoSurNavigation() {}
	getGenreAffichageSelonTypeAcces(aGenreTypeAcces) {
		return;
	}
	estModeAffDiffusion(aModeAff) {
		return aModeAff === this.genresAffichages.saisie;
	}
	initEcranTypeAccesInfoSond() {
		if (!this.avecAuteur) {
			return;
		}
		const lSelectionParDefault = () => {
			let lTypeSelectionCourante;
			if (this.typeSelectionne === null || this.typeSelectionne === undefined) {
				lTypeSelectionCourante = this.getTypeInfoSondParDefaut();
			} else {
				lTypeSelectionCourante = this.typeSelectionne.getGenre();
			}
			const lDataSelection = this.getItemDeType(lTypeSelectionCourante);
			if (lDataSelection !== null && lDataSelection !== undefined) {
				this.typeSelectionne = lDataSelection;
				this.surSelectionTypeAccesInfoSond(lDataSelection);
			}
		};
		if (this.optionsEcrans.avecBascule) {
			lSelectionParDefault();
			return;
		}
		new Promise((aResolve) => {
			this.afficherListeTypesInfoSond();
			aResolve();
		}).then(lSelectionParDefault);
	}
	getItemDeType(aType) {
		if (!this.avecAuteur) {
			return;
		}
		const lDonneesDeLaListe = this.optionsEcrans.avecBascule
			? this.getListeDonneesTypesInfoSond()
			: this.getInstance(this.identListeTypesAccesInfosSond).getListeArticles();
		return lDonneesDeLaListe.getElementParGenre(aType);
	}
	surSelectionTypeAccesInfoSond(aArticleTypeAccesInfoSond) {
		this.selectionnerTypeAccesInfoSond({
			selection: aArticleTypeAccesInfoSond,
		});
		const lGenreAff = this.getGenreAffichageSelonTypeAcces(
			aArticleTypeAccesInfoSond.getGenre(),
		);
		this.filtreModeItem = aArticleTypeAccesInfoSond.getGenre();
		new Promise((aResolve) => {
			this.genreAff = lGenreAff;
			this.modeAuteur =
				this.avecAuteur && (this.estGenreDiffusion() || this.estGenreModeles());
			this.formatterDataSurBasculeModeAff(lGenreAff, this.filtreModeItem);
			aResolve();
		}).then(() => {
			const lEcranDest = {
				niveauEcran: 0,
				genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			};
			this.basculerEcran(null, lEcranDest);
			this.declencherActionsAutoSurNavigation();
		});
	}
	evntSurListeTypeAccesInfoSond(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this._jetonReinitScrollListeInfosSond = true;
				this.surSelectionTypeAccesInfoSond(aParametres.article);
				break;
		}
	}
	getAvecBtnNouveau() {
		return this.droitSaisie;
	}
	initListeInfosSond(aInstance) {
		aInstance.setOptionsListe({
			avecLigneCreation: this.getAvecBtnNouveau(),
			nonEditableSurModeExclusif: true,
		});
	}
	evntSurListeInfoSond(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surSelectionInfoSondage({ infoSondage: aParametres.article });
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (!IE.estMobile) {
					const lPosBtn = ObjetPosition_1.GPosition.getClientRect(
						aParametres.nodeBouton,
					);
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: this,
						id: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
						initCommandes: (aMenu) => {
							const lEstModeModele = this.estGenreModeles();
							if (!lEstModeModele) {
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"actualites.creerInfo",
									),
									true,
									() => {
										this.evntBtnCreerActuInfo();
									},
									{ icon: "icon_diffuser_information" },
								);
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"actualites.creerSondage",
									),
									true,
									() => {
										this.evntBtnCreerActuSondage();
									},
									{ icon: "icon_diffuser_sondage" },
								);
							} else {
								if (this.avecModeles) {
									aMenu.add(
										ObjetTraduction_1.GTraductions.getValeur(
											"actualites.nouveauModele",
										),
										true,
										() => {
											this.evntBtnCreerModele({
												estInfo: this.estModeItemDeTypeInfo(),
											});
										},
										{ icon: "icon_sondage_bibliotheque" },
									);
									if (!IE.estMobile && this.estModeItemDeTypeSondage()) {
										aMenu.add(
											ObjetTraduction_1.GTraductions.getValeur(
												"actualites.importerModeleSondage",
											),
											this.droitSaisie,
											() => {
												this.evntImportModele();
											},
											{ icon: "icon_download_alt" },
										);
									}
								}
							}
						},
					});
				} else {
					this.evntBtnCreerActuInfo();
				}
				break;
		}
	}
	instancierEditionInfoSond() {
		return;
	}
	estModeItemDeTypeInfo() {
		return false;
	}
	estModeItemDeTypeSondage() {
		return false;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
		this.AddSurZone = [];
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="InterfacePageInfoSondage">');
		const lHauteurADeduire = 0;
		H.push(
			'<div class="ecrans ',
			this.optionsEcrans.avecBascule ? "mono" : "multi",
			'" style="height:calc(100% - ',
			lHauteurADeduire,
			'px)">',
		);
		if (this.avecAuteur && !this.optionsEcrans.avecBascule) {
			H.push('<div class="nav multi">');
			H.push(
				'<div id="',
				this.getNomInstance(this.identListeTypesAccesInfosSond),
				'" style="height:100%;"></div>',
			);
			H.push("</div>");
		}
		H.push(
			'<section class="section ',
			this.optionsEcrans.avecBascule ? "mono" : "multi",
			'" style="height:100%" id="',
			this.getIdDeNiveau({ niveauEcran: 0 }),
			'">',
		);
		H.push(
			'<div id="',
			this.getInstance(this.identListeInfosSond).getNom(),
			'" style="height:100%;"></div>',
		);
		H.push("</section>");
		H.push(
			'<aside class="aside ',
			this.optionsEcrans.avecBascule ? "mono" : "multi",
			'" id="',
			this.getIdDeNiveau({ niveauEcran: 1 }),
			'">',
		);
		H.push(
			'<div class="',
			this.optionsEcrans.avecBascule ? "ecran-visu" : "",
			'" id="',
			this.getInstance(this.identVisuInfoSondage).getNom(),
			'"></div>',
		);
		H.push("</aside>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	actualiserDonnees() {}
	recupererDonnees() {
		this.actualiserDonnees();
	}
	composeFiltreCategories() {
		const lJSXcomboFiltreCategories = () => {
			return {
				init: (aCombo) => {
					aCombo.setOptionsObjetSaisie({
						longueur: 200,
						hauteur: 16,
						hauteurLigneDefault: 16,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Categorie",
						),
					});
				},
				getDonnees: () => {
					if (
						this.listeCategories !== null &&
						this.listeCategories !== undefined
					) {
						return this.listeCategories;
					}
				},
				getIndiceSelection: () => {
					const lIndice = GEtatUtilisateur.getCategorie()
						? this.listeCategories.getIndiceParElement(
								GEtatUtilisateur.getCategorie(),
							)
						: 0;
					return lIndice;
				},
				event: (aParametres, aInstanceCombo) => {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstanceCombo.estUneInteractionUtilisateur()
					) {
						this._evntSurCategorie(
							aParametres.genreEvenement,
							aParametres.element,
						);
					}
				},
			};
		};
		return {
			getHtml: () =>
				IE.jsx.str("ie-combo", {
					"ie-model": lJSXcomboFiltreCategories,
					class: "combo-classic",
				}),
		};
	}
	composeCheckboxUniquementNonLues() {
		const lJSXcheckUniquementNonLues = () => {
			return {
				getValue: () => {
					return this.uniquementNonLues;
				},
				setValue: (aValeur) => {
					this.uniquementNonLues = aValeur;
					if (!this.modeAuteur) {
						GEtatUtilisateur.setUniquementNonLues(this.uniquementNonLues);
					}
					this._jetonReinitScrollListeInfosSond = true;
					this.afficherSelonFiltres();
				},
			};
		};
		const lJSXestVisibleCbUniquementNonLues = () => {
			return this.estGenreReception();
		};
		return {
			getHtml: () =>
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-display": lJSXestVisibleCbUniquementNonLues,
						"ie-model": lJSXcheckUniquementNonLues,
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.UniquementNonLues",
					),
				),
		};
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case InterfacePageInfoSondage.genreEcran.listeBlocs:
				return new Promise((aResolve) => {
					if (this.optionsEcrans.avecBascule) {
						let lHtmlBandeau = "";
						if (this.avecAuteur) {
							lHtmlBandeau = this.construireBandeauEcranListeInfoSondage();
						}
						this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
					}
					this.afficherSelonFiltres();
					aResolve();
				});
			case InterfacePageInfoSondage.genreEcran.visuBloc:
				return new Promise((aResolve) => {
					if (this.optionsEcrans.avecBascule) {
						const lHtmlBandeau = this.construireBandeauEcranVisuInfoSondage();
						this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
					}
					this._initVisuInfoSond(this.getInstance(this.identVisuInfoSondage));
					this.getInstance(this.identVisuInfoSondage).setUtilitaires(
						this.utilitaires,
					);
					const lActualite = this.getCtxSelection({ niveauEcran: 0 });
					this.getInstance(this.identVisuInfoSondage).setDonnees({
						actualite: lActualite,
						avecMsgAucun: this.contexte.avecMsgAucun,
					});
					aResolve();
				});
			default:
		}
	}
	afficherVisuInfoSondage() {
		const lEcranSrc = {
			niveauEcran: 1,
			genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			dataEcran: this.getCtxSelection({ niveauEcran: 0 }),
		};
		const lEcranDest = {
			niveauEcran: 1,
			genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
		};
		this.basculerEcran(lEcranSrc, lEcranDest);
	}
	construireBandeauEcranListeInfoSondage() {
		const H = [];
		if (this.avecAuteur && this.optionsEcrans.avecBascule) {
			H.push(
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxSelecteurTypesAccesInfosSond.bind(this),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"WAI.SelectionRubrique",
					),
				}),
			);
		}
		return H.join();
	}
	jsxSelecteurTypesAccesInfosSond() {
		return {
			event: this.afficherFenetreListeTypesInfoSond.bind(this),
			getLibelle: () => {
				let lLibelle = "";
				if (this.typeSelectionne) {
					lLibelle = this.typeSelectionne.getLibelle();
				}
				return lLibelle;
			},
			getIcone: () => {
				var _a, _b;
				return (_b =
					(_a = this.typeSelectionne) === null || _a === void 0
						? void 0
						: _a.icone) !== null && _b !== void 0
					? _b
					: "";
			},
		};
	}
	construireBandeauEcranVisuInfoSondage() {
		const lActu = this.getCtxSelection({ niveauEcran: 0 });
		const H = [];
		const lStr = lActu.estSondage
			? ObjetTraduction_1.GTraductions.getValeur(
					"infoSond.sondageDu",
					ObjetDate_1.GDate.formatDate(lActu.dateDebut, "%JJ %MMM"),
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"infoSond.infoDu",
					ObjetDate_1.GDate.formatDate(lActu.dateDebut, "%JJ %MMM"),
				);
		H.push('<h3 class="titre">', lStr, "</h3>");
		return this.construireBandeauEcran(H.join(""), { bgWhite: true });
	}
	deselectionnerContexte() {
		const lDataSelection = this.getCtxSelection({ niveauEcran: 0 });
		if (lDataSelection !== null && lDataSelection !== undefined) {
			if (!this.optionsEcrans.avecBascule) {
				lDataSelection.estSelectionne = false;
			}
			this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
		}
	}
	afficherSelectionDansListeTypeAcces(aSelection) {
		if (!this.avecAuteur) {
			return;
		}
		const lListe = this.getInstance(this.identListeTypesAccesInfosSond);
		const lListeElts = lListe.getListeArticles();
		if (lListeElts !== null && lListeElts !== undefined) {
			const lIndice = lListeElts.getIndiceElementParFiltre((D) => {
				return D.getNumero() === aSelection.getNumero();
			});
			if (lIndice !== null && lIndice !== undefined) {
				this.getInstance(this.identListeTypesAccesInfosSond).selectionnerLigne({
					ligne: lIndice,
					avecScroll: true,
					avecEvenement: false,
				});
			}
		}
	}
	afficherSelectionDansListeInfosSond(aSelection) {
		const lListe = this.getInstance(this.identListeInfosSond);
		const lListeElts = lListe.getListeArticles();
		if (lListeElts !== null && lListeElts !== undefined) {
			const lIndice = lListeElts.getIndiceElementParFiltre((D) => {
				return (
					D.getNumero() === aSelection.getNumero() &&
					(this.modeAuteur === true ||
						(D.public !== null &&
							D.public !== undefined &&
							aSelection.public !== null &&
							aSelection !== undefined &&
							D.public.getNumero() === aSelection.public.getNumero()))
				);
			});
			if (lIndice !== null && lIndice !== undefined) {
				this.getInstance(this.identListeInfosSond).selectionnerLigne({
					ligne: lIndice,
					avecScroll: true,
					avecEvenement: false,
				});
			}
		}
	}
	selectionnerTypeAccesInfoSond(aParam) {
		this.typeSelectionne = aParam.selection;
		if (!this.optionsEcrans.avecBascule) {
			this.marquerSelectionTypeAccesInfoSond();
		}
	}
	marquerSelectionTypeAccesInfoSond() {
		const lSelection = this.typeSelectionne;
		if (lSelection !== null && lSelection !== undefined) {
			lSelection.estSelectionne = true;
			this.afficherSelectionDansListeTypeAcces(lSelection);
		}
	}
	selectionnerInfoSond(aParam) {
		this.setCtxSelection({ niveauEcran: 0, dataEcran: aParam.infoSondage });
		if (!this.optionsEcrans.avecBascule) {
			const lSelection = this.getCtxSelection({ niveauEcran: 0 });
			if (lSelection !== null && lSelection !== undefined) {
				lSelection.estSelectionne = true;
				this.afficherSelectionDansListeInfosSond(lSelection);
			}
		}
		if (this.modeAuteur) {
			this.contexte.selectionCouranteModeDiffusion = aParam.infoSondage;
		} else {
			this.contexte.selectionCouranteModeReception = aParam.infoSondage;
		}
	}
	surSelectionInfoSondage(aParam) {
		this.deselectionnerContexte();
		this.selectionnerInfoSond(aParam);
		this.afficherVisuInfoSondage();
	}
	reInitCtxSelection(aParam) {
		this.deselectionnerContexte();
		this.contexte.avecMsgAucun = aParam.avecMsgAucun;
		if (!this.optionsEcrans.avecBascule) {
			this.afficherVisuInfoSondage();
		}
	}
	revenirSurEcranPrecedent() {
		if (IE.estMobile) {
			UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
		}
		if (
			this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant }) ===
			InterfacePageInfoSondage.genreEcran.visuBloc
		) {
			const lData = this.getCtxSelection({ niveauEcran: 0 });
			const lEstCtxDiffusion = this.modeAuteur === true;
			if (
				IE.estMobile &&
				!lData.lue &&
				!lEstCtxDiffusion &&
				!(0, AccessApp_1.getApp)().getModeExclusif()
			) {
				lData.lue = !lData.lue;
				lData.marqueLueSeulement = true;
				this.evntSurValidationInfoSond(
					lData,
					EGenreEvntActu_1.EGenreEvntActu.SurValidationDirecte,
					{ avecRecupDonnees: true },
				);
				return;
			}
		}
		super.revenirSurEcranPrecedent();
	}
	setOptionsActus(aOptions) {
		this.avecAuteur = aOptions.avecAuteur;
		this.forcerAR = aOptions.forcerAR;
		this.avecSondageAnonyme = aOptions.avecSondageAnonyme;
		this.droitSaisie = aOptions.droitSaisie;
		this.droitSaisie = aOptions.droitSaisie;
		this.droitSaisieModele = aOptions.droitSaisieModele;
		this.droitPublicationPageEtablissement =
			aOptions.droitPublicationPageEtablissement;
		this.avecModeles = aOptions.avecModeles;
		this.avecFiltreCategorie = aOptions.avecFiltreCategorie;
	}
	setOptionsInfoSondage() {
		const lDefault = {
			avecAuteur: false,
			avecFiltreCategorie: false,
			forcerAR: false,
			avecSondageAnonyme: false,
			droitSaisie: false,
			droitSaisieModele: false,
			avecModeles: false,
		};
		const lParam = {
			avecAuteur: this.getAvecAuteur(),
			droitSaisie: this.getAvecDroitSaisie(),
			droitSaisieModele: this.getAvecDroitSaisieModele(),
			droitPublicationPageEtablissement:
				this.getDroitPublicationPageEtablissement(),
			forcerAR: this.getForcerAR(),
			avecSondageAnonyme: this.getAvecSondageAnonyme(),
			avecFiltreCategorie: this.getAvecFiltreCategorie(),
			avecModeles: this.getAvecModeles(),
		};
		this.setOptionsActus($.extend(lDefault, lParam));
	}
	getDroitPublicationPageEtablissement() {
		return false;
	}
	getAvecFiltreCategorie() {
		return false;
	}
	getTypeSelectionne() {
		return this.typeSelectionne;
	}
	setTypeSelectionnne(aType) {
		this.typeSelectionne = aType;
		return this;
	}
	getAvecModeles() {
		return false;
	}
	initDataInfoSondSurEdition(aParams) {
		return null;
	}
	evntBtnCreerActuInfo() {
		this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("actualites.creerInfo"),
		});
		this.getInstance(this.identEditionInfoSond).setDonnees(
			this.initDataInfoSondSurEdition({
				estCreation: true,
				estInfo: true,
				avecRecupModele: this.getAvecRecupModele(),
			}),
		);
	}
	evntBtnCreerActuSondage() {
		this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.creerSondage",
			),
		});
		this.getInstance(this.identEditionInfoSond).setDonnees(
			this.initDataInfoSondSurEdition({
				estCreation: true,
				estInfo: false,
				avecRecupModele: this.getAvecRecupModele(),
			}),
		);
	}
	evntBtnCreerModele(aParam) {
		this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("actualites.creerModele"),
		});
		this.getInstance(this.identEditionInfoSond).setDonnees(
			this.initDataInfoSondSurEdition({
				estCreation: true,
				estInfo: aParam.estInfo,
				estModele: true,
			}),
		);
	}
	evntImportModele() {}
	initFenetreEditionInfoSond(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 950,
			hauteur: 660,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
				},
			],
		});
		aInstance.avecEtatSaisie = false;
		if (aInstance.setUtilitaires) {
			aInstance.setUtilitaires(this.utilitaires);
		}
	}
	eltSelectionPrecedenteRetrouveDansListe(aParam) {
		let lEltARetrouver;
		let lResult = null;
		const lEstCtxDiffusion = this.modeAuteur === true;
		if (lEstCtxDiffusion) {
			lEltARetrouver = this.contexte.selectionCouranteModeDiffusion;
		} else {
			lEltARetrouver = this.contexte.selectionCouranteModeReception;
		}
		if (lEltARetrouver !== null && lEltARetrouver !== undefined) {
			const lListe = aParam.liste;
			const lListeResult = lListe.getListeElements((D) => {
				return (
					D.getNumero() === lEltARetrouver.getNumero() &&
					(lEstCtxDiffusion ||
						(D.public !== null &&
							D.public !== undefined &&
							lEltARetrouver.public !== null &&
							lEltARetrouver.public !== undefined &&
							D.public.getNumero() === lEltARetrouver.public.getNumero()))
				);
			});
			if (lListeResult.count() === 1) {
				lResult = lListeResult.get(0);
			}
		}
		return lResult;
	}
	initContexteSelection(aListeFiltree) {
		const lListeNonVide = aListeFiltree.count() > 0;
		if (lListeNonVide) {
			const lEstCasRedirectionDepuisWidget =
				GEtatUtilisateur.getInfoSond !== null &&
				GEtatUtilisateur.getInfoSond !== undefined
					? GEtatUtilisateur.getInfoSond() !== null &&
						GEtatUtilisateur.getInfoSond() !== undefined
					: false;
			const lEstCtxDiffusion = this.modeAuteur === true;
			if (lEstCasRedirectionDepuisWidget && !lEstCtxDiffusion) {
				this.contexte.selectionCouranteModeReception =
					GEtatUtilisateur.getInfoSond();
				GEtatUtilisateur.setInfoSond(null);
			}
			if (
				!this.optionsEcrans.avecBascule ||
				(lEstCasRedirectionDepuisWidget && !lEstCtxDiffusion)
			) {
				const lEltASelectionner = this.eltSelectionPrecedenteRetrouveDansListe({
					liste: aListeFiltree,
				});
				if (lEltASelectionner !== null && lEltASelectionner !== undefined) {
					this.surSelectionInfoSondage({ infoSondage: lEltASelectionner });
				} else {
					this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
				}
			} else {
				this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
			}
		} else {
			this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
		}
	}
	getOptionsInfoSond() {
		return {};
	}
	getListeDonneesTypesInfoSond() {
		return;
	}
	afficherListeTypesInfoSond() {
		if (!this.avecAuteur) {
			return;
		}
		this.getInstance(this.identListeTypesAccesInfosSond).setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
		this.getInstance(this.identListeTypesAccesInfosSond).setDonnees(
			new DonneesListeTypesAccesInfoSond_1.DonneesListeTypesAccesInfoSond(
				this.getListeDonneesTypesInfoSond(),
			).setOptions({
				avecEvnt_Selection: true,
				avecTri: false,
				flatDesignMinimal: true,
				avecBoutonActionLigne: false,
			}),
		);
	}
	afficherFenetreListeTypesInfoSond() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement(aNumeroBouton, aSelection) {
					if (aNumeroBouton === 1) {
						this._jetonReinitScrollListeInfosSond = true;
						const lSelection =
							this.getListeDonneesTypesInfoSond().get(aSelection);
						this.surSelectionTypeAccesInfoSond(lSelection);
					}
				},
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"infoSond.Categories",
						),
					});
					aFenetre.paramsListe = {
						optionsListe: {
							ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
								"infoSond.Categories",
							),
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
						},
					};
				},
			},
		);
		lFenetre.setDonnees(
			new DonneesListeTypesAccesInfoSond_1.DonneesListeTypesAccesInfoSond(
				this.getListeDonneesTypesInfoSond(),
			).setOptions({
				avecEvnt_Selection: true,
				avecTri: false,
				flatDesignMinimal: true,
				avecBoutonActionLigne: false,
			}),
			true,
		);
	}
	afficherListeInfoSond(aListeFiltree) {
		const lFiltres = [];
		lFiltres.push(this.composeCheckboxUniquementNonLues());
		if (this.avecFiltreCategorie) {
			lFiltres.push(this.composeFiltreCategories());
		}
		lFiltres.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
		const lListe = this.getInstance(this.identListeInfosSond);
		lListe.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			boutons: lFiltres,
			messageContenuVide: this.composeMessage(
				this.estGenreModeles()
					? ObjetTraduction_1.GTraductions.getValeur("infoSond.msgAucunModele")
					: ObjetTraduction_1.GTraductions.getValeur("infoSond.msgAucun"),
			),
		});
		const lOptions = this.getOptionsInfoSond();
		const lConserverPositionScroll =
			this._jetonReinitScrollListeInfosSond !== true;
		lListe.setDonnees(
			new DonneesListe_InfosSond_1.DonneesListe_InfosSond(
				aListeFiltree,
				lOptions,
				this.utilitaires,
			).setOptions({ avecEvnt_Selection: true, avecTri: false }),
			null,
			{ conserverPositionScroll: lConserverPositionScroll },
		);
		if (
			MethodesObjet_1.MethodesObjet.isNumber(
				this._jetonReinitScrollListeInfosSond,
			) &&
			this._jetonReinitScrollListeInfosSond > 0
		) {
			lListe.setPositionScrollV(this._jetonReinitScrollListeInfosSond);
			delete this._jetonReinitScrollListeInfosSond;
		}
	}
	afficherSelonFiltres() {
		if (!this.listeActualites) {
			return;
		}
		this.marquerSelectionTypeAccesInfoSond();
		const lListeFiltree = this.getListeFiltree();
		this.afficherListeInfoSond(lListeFiltree);
		this.initContexteSelection(lListeFiltree);
	}
	getAvecRecupModele() {
		return this.avecModeles;
	}
	estGenreReception() {
		return this.genreAff === this.genresAffichages.reception;
	}
	estGenreDiffusion() {
		return this.genreAff === this.genresAffichages.saisie;
	}
	estGenreModeles() {
		return this.genreAff === this.genresAffichages.modeles;
	}
	_surPostResize() {
		this.afficherSelonFiltres();
	}
	_evntSurCategorie(aGenreEvenement, aCategorie) {
		if (
			aGenreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.categorie = aCategorie;
			GEtatUtilisateur.setCategorie(this.categorie);
			this._jetonReinitScrollListeInfosSond = true;
			this.afficherSelonFiltres();
		}
	}
	_initVisuInfoSond(aInstance) {
		aInstance.setOptions(this.getOptionsInfoSond());
	}
	_evntVisuInfoSond(aActu, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case EGenreEvntActu_1.EGenreEvntActu.SurMenuCtxActu:
				this.evntSurValidationInfoSond(aActu, aGenreEvnt, aParam);
				break;
			case EGenreEvntActu_1.EGenreEvntActu.SurAnnulationSondage:
				UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
				this.selectionCouranteModeReception = null;
				this.selectionCouranteModeDiffusion = null;
				this.revenirSurEcranPrecedent();
				this.actualiserDonnees();
				break;
			case EGenreEvntActu_1.EGenreEvntActu.SurAR:
			case EGenreEvntActu_1.EGenreEvntActu.SurValidationSondage:
				UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
				this.evntSurValidationInfoSond(aActu, aGenreEvnt, aParam);
				break;
			case EGenreEvntActu_1.EGenreEvntActu.SurVoirResultats:
				this.evntSurAfficherResultats(aActu);
				break;
			default:
				break;
		}
	}
	evntSurValidationInfoSond(aActu, aGenreEvnt, aParam) {}
	evntSurAfficherResultats(aActu) {}
	getTypeInfoSondParDefaut() {
		return null;
	}
	formatterDataSurBasculeModeAff(aGenreAff, aFiltre) {}
	getListeFiltree() {
		return null;
	}
	getAvecAuteur() {
		return false;
	}
	getAvecDroitSaisie() {
		return false;
	}
	getAvecDroitSaisieModele() {
		return this.getAvecDroitSaisie();
	}
	getForcerAR() {
		return false;
	}
	getAvecSondageAnonyme() {
		return false;
	}
	setUtilitaires(aUtilitaires) {}
}
exports.InterfacePageInfoSondage = InterfacePageInfoSondage;
(function (InterfacePageInfoSondage) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["listeBlocs"] = "listeBlocs";
		genreEcran["visuBloc"] = "visuBloc";
	})(
		(genreEcran =
			InterfacePageInfoSondage.genreEcran ||
			(InterfacePageInfoSondage.genreEcran = {})),
	);
})(
	InterfacePageInfoSondage ||
		(exports.InterfacePageInfoSondage = InterfacePageInfoSondage = {}),
);

exports._ObjetGrille = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_AffichageGrilleDate_1 = require("Enumere_AffichageGrilleDate");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetGrilleTranches_1 = require("ObjetGrilleTranches");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetScroll_1 = require("ObjetScroll");
const ObjetScroll_2 = require("ObjetScroll");
const ObjetScroll_3 = require("ObjetScroll");
const ObjetSupport_1 = require("ObjetSupport");
const UtilitaireCouleur_1 = require("UtilitaireCouleur");
const ObjetHint_1 = require("ObjetHint");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
let uCacheContextCanvas;
const uCachePatternBySrc = {};
class _ObjetGrille extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		const lIdReference = GUID_1.GUID.getId();
		const lClassReference = GUID_1.GUID.getClassCss();
		this.idConteneurGrille = lIdReference + "_c_g";
		this.idConteneurAbsGrille = lIdReference + "_ca";
		this.idGabaritGrille = lIdReference + "_gabar";
		this.IdCellulePrefixe = lIdReference + "_Grille_";
		this._cache = {
			id: lIdReference,
			scrollHVisible: true,
			cacheLargeurTitreGauche: 0,
			heightMaxGrille: null,
			widthMaxGrille: null,
			traitsHoraires: [],
			tailleCssHoraireEnColonne: 0,
			horaireEnColonneEnSuperposition: false,
			avecPiedTranche: false,
			avecPiedHoraire: false,
			idReference: lIdReference,
			idLigneTitre: lIdReference + "_titre",
			idLigneTitreG: lIdReference + "_titreG",
			idLigneTitreHoraire_Debut: lIdReference + "_titreGH",
			idLigneTitreHoraire_Fin: lIdReference + "_titreGB",
			idLignePied: lIdReference + "_pied",
			idTitreTranche: lIdReference + "_titreTranche",
			idPiedTrancheConteneurAbs: lIdReference + "_piedTrContAbs",
			classReference: lClassReference,
			nbPasHorairesEcranZoom: null,
			tailleTrancheEcranZoom: null,
			contextCanvas: {},
			hint: null,
			positionSurvolSourisEnCours: {},
			classCursorSurvolEnCours: "",
			canvasPartiel: false,
			positionCanvasPartiel: {},
			commandesCanvas: [],
		};
		this._initialiserOptions();
		if (this.Nom) {
			this.ScrollH = ObjetIdentite_1.Identite.creerInstance(
				ObjetScroll_1.ObjetScroll,
				{
					pere: this,
					evenement: this._evenementScrollH.bind(this),
					genre: ObjetScroll_2.EGenreScroll.Horizontal,
				},
			);
			this.ScrollV = ObjetIdentite_1.Identite.creerInstance(
				ObjetScroll_1.ObjetScroll,
				{
					pere: this,
					evenement: this._evenementScrollV.bind(this),
					genre: ObjetScroll_2.EGenreScroll.Vertical,
				},
			);
			if (this.avecEventResizeNavigateur()) {
				this.ajouterEvenementGlobal(
					Enumere_Event_1.EEvent.SurPreResize,
					this.surPreResize,
				);
				this.ajouterEvenementGlobal(
					Enumere_Event_1.EEvent.SurPostResize,
					this.surPostResize,
				);
			}
		}
	}
	async ouvrirFenetreDetailsGrille() {
		const lDetails = this.getDetailsGrille();
		await ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser: (aFenetre) => {
					aFenetre.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ObjetGrille.TitreInfosDetails",
						),
						largeur: 600,
						hauteur: 200,
						hauteurMaxContenu: 600,
						avecScroll: true,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
			},
		).afficher(
			lDetails ||
				ObjetTraduction_1.GTraductions.getValeur(
					"ObjetGrille.AucunInfosDetails",
				),
		);
	}
	getDetailsGrille() {
		return "";
	}
	_initialiserOptions() {
		this._options = {
			tailleMINPasHoraire: 10,
			tailleMAXPasHoraire: 0,
			tailleMaxTranche: null,
			tailleMinTranche: 60,
			nbTranchesEcran: 0,
			reserverPlaceTranchesEcran: false,
			nbGouttieresEcran: 0,
			genreAffichageDate:
				Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDateEtJour,
			blocHoraires: null,
			tranches: new ObjetGrilleTranches_1.ObjetGrilleTranches(),
			pasHoraire: 0,
			granularitPasHoraire: 1,
			taillePasHoraire: -1,
			nbPasHorairesEcran: 0,
			grilleInverse: false,
			hauteurPoliceMin: 12,
			largeurTitreGauche: 40,
			hauteurLigneTitre: 20,
			hauteurContenuTitre: null,
			nbAlternanceTitreColonnes: 1,
			tailleAlternanceTitreColonne: 12,
			desactiverTitreHorairesDebutFin: false,
			traitsHoraires: [],
			hauteurBasGrilleSansScroll: 5,
			avecPiedTranche: false,
			taillePiedTranche: 0,
			taillePiedTrancheInverse: 0,
			avecPiedHoraire: false,
			taillePiedHoraire: 0,
			couleurFond: GCouleur.grille.fond,
			couleurBordures: GCouleur.grille.bordure,
			couleurBorduresSecondaires: null,
			couleurLibellesLignes: GCouleur.grille.texte,
			couleurLibellesColonnes: GCouleur.grille.texte,
			couleurFondGouttiere: GCouleur.fond,
			ieClassConteneurGrille: "",
			titresHorairesParSequence: false,
			callbackMouseDownCellule: null,
			getNodeConteneurGrille: null,
			surLongTouchGrille: null,
			getLibelleTranche: null,
			getTailleLibelleTranche: null,
			tailleMaxLibelleTranche: 150,
			getLibelleDecorateurBlocTranche: null,
			tailleDecorateurBlocTranche: 16,
			avecDecorateurBlocHoraire: false,
			tailleDecorateurBlocHoraire: 15,
			getLibelleBlocHoraire: null,
			WAILabelGrille: "",
			margeHauteur: 2,
			avecZoomCtrlWheel: false,
			seuilZoomCtrlWheel: 30,
			avecModeTactile: true,
			avecScrollEnTactileV: !GNavigateur.isLayoutTactile,
			avecScrollEnTactileH: !GNavigateur.isLayoutTactile,
			getPourcentTailleTraitSeparateurCellule: function (aGenreSeparateur) {
				let lPourcent = 100;
				if (aGenreSeparateur === _ObjetGrille.separateurLigne.moyen) {
					lPourcent = 40;
				} else if (aGenreSeparateur === _ObjetGrille.separateurLigne.petit) {
					lPourcent = 20;
				}
				return lPourcent;
			},
			surfaceMaxCanvas: GNavigateur.isTactile ? 1500 * 1500 : 20000 * 20000,
		};
	}
	getIdCellulePrefixe() {
		return this.IdCellulePrefixe;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeNavigation: function () {
				$(this.node).on({
					keyup: function (aEvent) {
						aInstance.evenementNavigation(aEvent);
					},
				});
			},
			getNodeConteneurGrille: function () {
				if (aInstance._options.avecZoomCtrlWheel) {
					$(this.node).on("wheel", (aEvent) => {
						if (aEvent.ctrlKey) {
							aInstance._zoomMouseWheel(-aEvent.originalEvent.deltaY);
							aEvent.stopPropagation();
							aEvent.preventDefault();
						}
					});
				}
				if (aInstance._options.getNodeConteneurGrille) {
					aInstance._options.getNodeConteneurGrille(this.node);
				}
			},
			getNodeGrilleInterne: function () {
				aInstance.getNodeGrilleInterne(this.node);
				$(this.node).on({
					mouseleave: function () {
						if (aInstance._cache.hint) {
							ObjetHint_1.ObjetHint.stop(aInstance._cache.hint);
							aInstance._cache.hint = null;
						}
						aInstance._cache.positionSurvolSourisEnCours = {};
					},
					mousemove: function (aEvent) {
						aInstance._mousemoveGrille(aEvent);
					},
				});
			},
			getClassGrille: function () {
				return "";
			},
			nodeCanvasCalque: function (aGenreCalque, aWidth, aHeight) {
				const lNodeCanvas = this.node;
				$(lNodeCanvas).on("destroyed", () => {
					lNodeCanvas.height = 0;
					lNodeCanvas.width = 0;
				});
				const lContext = lNodeCanvas.getContext("2d");
				if (!lContext) {
					return;
				}
				if (
					aInstance._cache.canvasScaleX > 1 ||
					aInstance._cache.canvasScaleY > 1
				) {
					lNodeCanvas.style.transformOrigin = "0 0";
					lNodeCanvas.style.transform =
						"scale(" +
						aInstance._cache.canvasScaleX +
						", " +
						aInstance._cache.canvasScaleY +
						")";
				}
				if (!GNavigateur.isAndroid) {
					const lDpr = window.devicePixelRatio || 1;
					if (lDpr >= 1.5) {
						lNodeCanvas.width = aWidth * lDpr;
						lNodeCanvas.height = aHeight * lDpr;
						lContext.scale(lDpr, lDpr);
					}
				}
				aInstance._cache.contextCanvas[aGenreCalque] = lContext;
				$(lNodeCanvas).on("destroyed", () => {
					aInstance._cache.contextCanvas[aGenreCalque] = null;
					aInstance._cache.__test_patternHachure = null;
				});
				aInstance._traceCalque(aGenreCalque);
			},
		});
	}
	traceCanvasFondRectDePlace(aPlace, aCouleur) {
		const lContext = this._cache.contextCanvas[_ObjetGrille.calque.fond];
		if (!lContext) {
			return;
		}
		let lCouleurFond = aCouleur || this.getCouleurFond();
		if (!lCouleurFond) {
			return;
		}
		const lCoordonnes = this.getCoordonneesDePlace(aPlace);
		const lTailles = this.getTaillesDePositionGrille();
		this._fillRect({
			context: lContext,
			fillStyle: this._getCouleurPourCanvas(lContext, lCouleurFond),
			left: lCoordonnes.left,
			top: lCoordonnes.top,
			width: lTailles.width,
			height: lTailles.height,
		});
	}
	traceCanvasImageRepeat(aPlace, aSrc, aGenreCalque) {
		if (!uCacheContextCanvas) {
			uCacheContextCanvas = document.createElement("canvas").getContext("2d");
		}
		const lContext =
			this._cache.contextCanvas[aGenreCalque || _ObjetGrille.calque.fond];
		if (!lContext) {
			return;
		}
		const lCoordonnes = this.getCoordonneesDePlace(aPlace);
		const lTailles = this.getTaillesDePositionGrille();
		if (uCachePatternBySrc[aSrc]) {
			this._fillRect({
				context: lContext,
				fillStyle: uCachePatternBySrc[aSrc],
				left: lCoordonnes.left,
				top: lCoordonnes.top,
				width: lTailles.width,
				height: lTailles.height,
			});
			return;
		}
		const lImage = new Image();
		const lThis = this;
		lImage.onload = () => {
			const lPattern = uCacheContextCanvas.createPattern(lImage, "repeat");
			uCachePatternBySrc[aSrc] = lPattern;
			lThis._fillRect({
				context: lContext,
				fillStyle: lPattern,
				left: lCoordonnes.left,
				top: lCoordonnes.top,
				width: lTailles.width,
				height: lTailles.height,
			});
		};
		lImage.src = aSrc;
	}
	traceCanvasHachure(aParamsHachure) {
		const lParamsHachure = Object.assign(
			{
				place: -1,
				delta: 8,
				traitD: true,
				traitG: false,
				couleur: "",
				genreCalque: _ObjetGrille.calque.fond,
			},
			aParamsHachure,
		);
		const lContext =
			this._cache.contextCanvas[
				lParamsHachure.genreCalque || _ObjetGrille.calque.fond
			];
		if (!lContext) {
			return;
		}
		if (
			!(
				lParamsHachure.place >= 0 &&
				lParamsHachure.delta > 0 &&
				lParamsHachure.couleur &&
				(lParamsHachure.traitD || lParamsHachure.traitG)
			)
		) {
			return;
		}
		const lCle =
			lParamsHachure.delta +
			"_" +
			lParamsHachure.couleur +
			"_" +
			(lParamsHachure.traitD ? 1 : 0) +
			"_" +
			(lParamsHachure.traitG ? 1 : 0);
		if (!this._cache.__test_patternHachure) {
			this._cache.__test_patternHachure = {};
		}
		if (!this._cache.__test_patternHachure[lCle]) {
			const canvas = document.createElement("canvas");
			canvas.width = lParamsHachure.delta;
			canvas.height = lParamsHachure.delta;
			const lCtx = canvas.getContext("2d");
			lCtx.fillStyle = this._getCouleurPourCanvas(lCtx, lParamsHachure.couleur);
			if (lParamsHachure.traitD) {
				for (let i = 0; i <= lParamsHachure.delta; i++) {
					lCtx.fillRect(i, i, 1, 1);
				}
			}
			if (lParamsHachure.traitG) {
				for (let i = 0; i <= lParamsHachure.delta; i++) {
					lCtx.fillRect(lParamsHachure.delta - i, -1 + i, 1, 1);
				}
			}
			this._cache.__test_patternHachure[lCle] = lContext.createPattern(
				canvas,
				"repeat",
			);
		}
		const lCoordonnes = this.getCoordonneesDePlace(lParamsHachure.place);
		this._fillRect({
			context: lContext,
			fillStyle: this._cache.__test_patternHachure[lCle],
			left: lCoordonnes.left,
			top: lCoordonnes.top,
			width: lCoordonnes.right - lCoordonnes.left + 1,
			height: lCoordonnes.bottom - lCoordonnes.top + 1,
		});
	}
	traceCalqueCanvasFondDePlace(aPlace) {
		this.traceCanvasFondRectDePlace(
			aPlace,
			this.getCouleurFondDePlaceEDT(aPlace),
		);
	}
	traceCalqueCanvasQuadrillagedDePlace(aParams) {
		const lDernierHoraire =
			aParams.horaire === aParams.blocHoraire.fin &&
			aParams.blocHoraire.dernierBloc;
		const LGenreSeparateur = this.getGenreSeparateurLigne(
			aParams.horaire - aParams.blocHoraire.debutBloc,
			false,
		);
		const lAvecTraitSeparateur =
			LGenreSeparateur === _ObjetGrille.separateurLigne.plein &&
			!lDernierHoraire;
		const lCoords = this.getCoordonneesDePlace(aParams.place);
		const lFillStyle = this._getCouleurPourCanvas(
			aParams.context,
			aParams.couleurBordure,
		);
		const lGoutierreHorairePrecedent =
			aParams.horaire === aParams.blocHoraire.debut &&
			aParams.blocHoraire.indiceBloc > 0;
		if (lGoutierreHorairePrecedent) {
			if (this._options.grilleInverse) {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.left - 1,
					top: lCoords.top,
					width: 1,
					height: lCoords.bottom - lCoords.top + 1,
				});
			} else {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.left,
					top: lCoords.top - 1,
					width: lCoords.right - lCoords.left + 1,
					height: 1,
				});
			}
		}
		if (this._options.tranches.getTailleGouttiere(aParams.numeroTranche - 1)) {
			if (!this._options.grilleInverse) {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.left - 1,
					top: lCoords.top,
					width: 1,
					height: lCoords.bottom - lCoords.top + 1,
				});
			} else {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.left - 1,
					top: lCoords.top - 1,
					width: lCoords.right - lCoords.left + 2,
					height: 1,
				});
			}
		}
		if (this._options.grilleInverse) {
			this._fillRect({
				context: aParams.context,
				fillStyle: lFillStyle,
				left: lCoords.left,
				top: lCoords.bottom,
				width: lCoords.right - lCoords.left + 1,
				height: 1,
			});
		} else {
			this._fillRect({
				context: aParams.context,
				fillStyle: lFillStyle,
				left: lCoords.right,
				top: lCoords.top,
				width: 1,
				height: lCoords.bottom - lCoords.top + 1,
			});
		}
		if (lAvecTraitSeparateur) {
			if (this._options.grilleInverse) {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.right,
					top: lCoords.top,
					width: 1,
					height: lCoords.bottom - lCoords.top + 1,
				});
			} else {
				this._fillRect({
					context: aParams.context,
					fillStyle: lFillStyle,
					left: lCoords.left,
					top: lCoords.bottom,
					width: lCoords.right - lCoords.left + 1,
					height: 1,
				});
			}
		}
		if (
			LGenreSeparateur !== _ObjetGrille.separateurLigne.vide &&
			LGenreSeparateur !== _ObjetGrille.separateurLigne.plein
		) {
			let lPourcent = 100;
			if (this._options.getPourcentTailleTraitSeparateurCellule) {
				lPourcent =
					this._options.getPourcentTailleTraitSeparateurCellule(
						LGenreSeparateur,
					);
			}
			const lWidth = lCoords.right - lCoords.left;
			const lHeight = lCoords.bottom - lCoords.top;
			const lCouleur = this._getCouleurPourCanvas(
				aParams.context,
				aParams.couleurBordureSecondaire,
			);
			if (this._options.grilleInverse) {
				this._fillRect({
					context: aParams.context,
					fillStyle: lCouleur,
					left: lCoords.right,
					top:
						lCoords.top +
						Math.round(lHeight / 2 - (lHeight * lPourcent) / 100 / 2),
					width: 1,
					height: Math.round((lHeight * lPourcent) / 100),
				});
			} else {
				this._fillRect({
					context: aParams.context,
					fillStyle: lCouleur,
					left:
						lCoords.left +
						Math.round(lWidth / 2 - (lWidth * lPourcent) / 100 / 2),
					top: lCoords.bottom,
					width: Math.round((lWidth * lPourcent) / 100),
					height: 1,
				});
			}
		}
	}
	free() {
		super.free();
	}
	actualiser(...aParams) {
		return this.construireAffichage();
	}
	construireAffichage() {
		if (!this.donneesRecus) {
			return;
		}
		if (!ObjetHtml_1.GHtml.elementExiste(this.Nom)) {
			return;
		}
		let lRestaurerFocus = false;
		if (
			ObjetHtml_1.GHtml.focusEstDansElement &&
			ObjetHtml_1.GHtml.focusEstDansElement(this.Nom)
		) {
			lRestaurerFocus = true;
		}
		this._cache.heightMaxGrille = null;
		this._cache.widthMaxGrille = null;
		this._cache.tailleCssHoraireEnColonne = 0;
		this._cache.horaireEnColonneEnSuperposition = false;
		this._cache.couleursVarCss = {};
		this.EnAffichage = true;
		this.calculerDebutEtFin();
		const lScrollV = ObjetPosition_1.GPosition.getScrollTop(
			this.ScrollV.getIdZone(EZoneScroll.Grille),
		);
		let lScrollH = 0;
		if (this._cache.scrollHVisible) {
			lScrollH = this.ScrollH.getPosition(
				this.ScrollH.getIdZone(EZoneScroll.Grille),
			);
		}
		this.ScrollH.vider();
		this.ScrollV.vider();
		$("#" + this.Nom.escapeJQ()).ieHtml(this._construireGrille(), {
			controleur: this.controleur,
		});
		this.ScrollV.zonesSansScrollTouch = [
			EZoneScroll.TitreLignes,
			EZoneScroll.PiedTrancheInverse,
			EZoneScroll.PiedHoraire,
		];
		this.ScrollH.zonesSansScrollTouch = [
			EZoneScroll.TitreHaut,
			EZoneScroll.PiedTranche,
			EZoneScroll.PiedHoraireInverse,
		];
		this.ScrollV.avecScrollEnTactile =
			this._options.avecScrollEnTactileV || !this._estModeTactile();
		this.ScrollH.avecScrollEnTactile =
			this._options.avecScrollEnTactileH || !this._estModeTactile();
		this.ScrollV.setDonnees(
			EZoneScroll.TitreLignes,
			EZoneScroll.Grille,
			EZoneScroll.PiedTrancheInverse,
			EZoneScroll.PiedHoraire,
		);
		this.ScrollH.setDonnees(
			EZoneScroll.TitreHaut,
			EZoneScroll.Grille,
			EZoneScroll.PiedTranche,
			EZoneScroll.PiedHoraireInverse,
		);
		this._actualiserLibellesHeure(null, 0);
		if (lScrollV > 0) {
			this.ScrollV.scrollTo(lScrollV);
		}
		if (lScrollH > 0) {
			this.ScrollH.scrollTo(lScrollH);
		}
		if (lRestaurerFocus) {
			this.selectionnerGrille();
		}
		this.apresConstructionGrille();
	}
	effacer(aMessage) {
		this.ScrollV.vider();
		this.ScrollH.vider();
		super.effacer(aMessage);
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		this.apresInitialisationOptions();
		if (aOptions && aOptions.blocHoraires) {
			this._options.blocHoraires.initCache();
		}
		return this;
	}
	getOptions() {
		return this._options;
	}
	getOptionsBlocHoraires() {
		return this._options.blocHoraires;
	}
	apresInitialisationOptions() {
		this.EstAffiche = false;
		this.EnAffichage = false;
		this._cache.cacheLargeurTitreGauche = 0;
		this._cache.tailleCssHoraireEnColonne = 0;
		this._cache.horaireEnColonneEnSuperposition = false;
		this._cache.avecPiedTranche = null;
		this._cache.avecPiedHoraire = null;
	}
	apresConstructionGrille() {
		this._construireTraitsHoraire();
	}
	evenementNavigation(aEvent) {}
	selectionnerGrille() {}
	getLargeurTitreLibellesLignes() {
		if (!this._cache.cacheLargeurTitreGauche) {
			this._cache.cacheLargeurTitreGauche = this._options.largeurTitreGauche;
			if (
				this._options.titresHorairesParSequence &&
				!this._options.grilleInverse
			) {
				let lLibelle;
				this._cache.cacheLargeurTitreGauche = 20;
				this._options.blocHoraires.parcourirHoraires((aNumeroHoraire) => {
					lLibelle = this._getLibelleTitreHoraire(aNumeroHoraire);
					if (this.getAfficherPasHoraire() && lLibelle) {
						const lLargeurSequence =
							ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
								lLibelle,
								10,
								true,
							);
						this._cache.cacheLargeurTitreGauche = Math.max(
							this._cache.cacheLargeurTitreGauche,
							lLargeurSequence,
						);
					}
				});
			}
			if (
				this._options.grilleInverse &&
				this._options.getLibelleTranche &&
				this._options.getTailleLibelleTranche
			) {
				let lTaille = 0,
					lTranche;
				for (
					lTranche = 0;
					lTranche < this._options.tranches.count();
					lTranche++
				) {
					lTaille = Math.max(
						lTaille,
						this._options.getTailleLibelleTranche.call(
							this,
							lTranche,
							this._options.tranches.get(lTranche),
						),
					);
				}
				if (lTaille > 0) {
					if (this._options.tailleMaxLibelleTranche > 0) {
						lTaille = Math.min(lTaille, this._options.tailleMaxLibelleTranche);
					}
					this._cache.cacheLargeurTitreGauche = lTaille;
				}
			}
			this._cache.cacheLargeurTitreGauche = Math.ceil(
				Math.max(this._cache.cacheLargeurTitreGauche, 1),
			);
		}
		return this._cache.cacheLargeurTitreGauche;
	}
	getLargeurTitreLignes() {
		return (
			this.getLargeurTitreLibellesLignes() +
			(this._options.grilleInverse ? 2 : 0) +
			(this._options.avecDecorateurBlocHoraire &&
			!this._options.grilleInverse &&
			ObjetSupport_1.Support.avecSupportTransform
				? this._options.tailleDecorateurBlocHoraire || 0
				: 0) +
			(this._options.getLibelleDecorateurBlocTranche &&
			this._options.grilleInverse
				? (this._options.tailleDecorateurBlocTranche || 0) + 3
				: 0)
		);
	}
	getHauteurTitreColonnes() {
		return (
			this._options.hauteurLigneTitre +
			(!this._options.titresHorairesParSequence && this._options.grilleInverse
				? (this._options.nbAlternanceTitreColonnes - 1) *
					this._options.tailleAlternanceTitreColonne
				: 0) +
			(this._options.avecDecorateurBlocHoraire && this._options.grilleInverse
				? this._options.tailleDecorateurBlocHoraire || 0
				: 0) +
			(this._options.getLibelleDecorateurBlocTranche &&
			!this._options.grilleInverse &&
			ObjetSupport_1.Support.avecSupportTransform
				? this._options.tailleDecorateurBlocTranche || 0
				: 0)
		);
	}
	getHauteurMaxGrille() {
		if (this._estModeTactile()) {
			ObjetHtml_1.GHtml.setDisplay(this.idConteneurGrille, false);
		}
		const lHeight =
			ObjetPosition_1.GPosition.getHeight(this.getNom()) -
			this.getHauteurTitreColonnes() -
			(!this._options.grilleInverse &&
			this._getAvecPiedTranche() &&
			this._options.taillePiedTranche > 0
				? this._options.taillePiedTranche
				: 0) -
			(this._options.grilleInverse &&
			this._getAvecPiedHoraire() &&
			this._options.taillePiedHoraire > 0
				? this._options.taillePiedHoraire
				: 0) -
			(this._cache.scrollHVisible
				? GNavigateur.getLargeurBarreDeScroll()
				: this._options.hauteurBasGrilleSansScroll) -
			1 -
			(this._options.margeHauteur || 0);
		if (this._estModeTactile()) {
			ObjetHtml_1.GHtml.setDisplay(this.idConteneurGrille, true);
		}
		return Math.max(lHeight, this.ScrollV.tailleMin);
	}
	getLargeurMaxGrille() {
		if (this._estModeTactile()) {
			ObjetHtml_1.GHtml.setDisplay(this.idConteneurGrille, false);
		}
		const lWidth =
			ObjetPosition_1.GPosition.getWidth(this.getNom()) -
			this.getLargeurTitreLignes() -
			(this._options.grilleInverse &&
			this._getAvecPiedTranche() &&
			this._options.taillePiedTrancheInverse > 0
				? this._options.taillePiedTrancheInverse
				: 0) -
			(!this._options.grilleInverse &&
			this._getAvecPiedHoraire() &&
			this._options.taillePiedHoraire > 0
				? this._options.taillePiedHoraire
				: 0) -
			GNavigateur.getLargeurBarreDeScroll() -
			2;
		if (this._estModeTactile()) {
			ObjetHtml_1.GHtml.setDisplay(this.idConteneurGrille, true);
		}
		return lWidth;
	}
	resetValeurZoom() {
		this._cache.nbPasHorairesEcranZoom = null;
		this._cache.tailleTrancheEcranZoom = null;
	}
	getFormatTitreTrancheEnColonnes(aNombreColonnes, aLargeur) {
		return "";
	}
	composeTitresTranches(I, ALargeur, aFormatTitreColonnes) {
		return "";
	}
	getLibelleTitreHoraire(aNumeroHoraire, aTitreFin) {
		return "";
	}
	_avecTitreLibelleHoraire(aLigne, aTitreFin) {
		if (this._options.titresHorairesParSequence) {
			return false;
		}
		return (
			this.getAfficherPasHoraire() &&
			!!this._getLibelleTitreHoraire(aLigne, aTitreFin)
		);
	}
	getTaillePoliceHeure(aPourHeure) {
		if (this._cache.tailleCssHoraireEnColonne) {
			return this._cache.tailleCssHoraireEnColonne;
		}
		if (
			this._options.grilleInverse ||
			this.hauteurCellule >= this._options.hauteurPoliceMin
		) {
			return 0;
		}
		return 9;
	}
	_getClassTitreHoraireDHoraire(aHoraire) {
		if (this._options.titresHorairesParSequence) {
			return this._getClasseTaillePoliceHeure(true);
		} else {
			if (
				this._options.grilleInverse &&
				!this._cache.tailleCssHoraireEnColonne &&
				!this._options.titresHorairesParSequence
			) {
				this._calculTailleCssHoraireEnColonne();
			}
			const LGenreSeparateur = this.getGenreSeparateurLigne(aHoraire - 1, true);
			return this._getClasseTaillePoliceHeure(
				LGenreSeparateur === _ObjetGrille.separateurLigne.plein,
			);
		}
	}
	getAfficherPasHoraire() {
		return true;
	}
	composeTitresHoraires() {
		const lAfficherPasHoraire =
			this.getAfficherPasHoraire() ||
			this._options.grilleInverse ||
			(!this._options.grilleInverse &&
				this.hauteurCellule >= this._options.tailleMINPasHoraire);
		let lAvecPremierHoraire = false;
		let lClass, lLibelle, lNombreLignesCouvertes;
		const H = [];
		let lTailleGouttiere,
			lTailleLigne,
			lEtage,
			lNbHorairesAffiches = 0;
		const lGrilleInverse = this._options.grilleInverse;
		const lHauteurDecalagePolicePx = this._getDecalageTitrePoliceLigne();
		const lTabHoraires = {};
		this._options.blocHoraires.parcourirHoraires(
			(aNumeroHoraire, aBlocHoraire, aIndexBloc) => {
				let lLibelle = "";
				if (this._options.titresHorairesParSequence) {
					lLibelle = this._getLibelleTitreHoraire(aNumeroHoraire);
				} else if (
					(aNumeroHoraire > aBlocHoraire.debut ||
						aBlocHoraire.indiceBloc > 0) &&
					(lAfficherPasHoraire ||
						!lAvecPremierHoraire ||
						aNumeroHoraire % this._options.blocHoraires.nbHoraires() === 0 ||
						aNumeroHoraire === aBlocHoraire.fin) &&
					!(
						aNumeroHoraire === aBlocHoraire.debut &&
						aIndexBloc > 0 &&
						lGrilleInverse
					)
				) {
					lLibelle = this._getLibelleTitreHoraire(aNumeroHoraire);
				}
				lTabHoraires[aNumeroHoraire] = lLibelle;
			},
		);
		this._options.blocHoraires.parcourirHoraires(
			(aNumeroHoraire, aBlocHoraire) => {
				lTailleGouttiere = aBlocHoraire.tailleGouttiere;
				lTailleLigne = this.getTailleHoraire();
				if (lTailleGouttiere) {
					lTailleLigne += 1;
				}
				if (lGrilleInverse) {
					H.push(
						'<div style="',
						ObjetStyle_1.GStyle.composeWidth(lTailleLigne),
						'position:relative;" class="InlineBlock WhiteSpaceNormal AlignementMilieuVertical AlignementMilieu">',
					);
				} else {
					H.push(
						'<div style="',
						ObjetStyle_1.GStyle.composeHeight(lTailleLigne),
						ObjetStyle_1.GStyle.composeWidth(
							this.getLargeurTitreLibellesLignes(),
						),
						'">',
					);
				}
				lLibelle = lTabHoraires[aNumeroHoraire];
				if (!this._options.titresHorairesParSequence) {
					if (lLibelle) {
						if (lLibelle && lLibelle.trim().length > 0) {
							lNbHorairesAffiches += 1;
							if (
								lGrilleInverse &&
								this._options.nbAlternanceTitreColonnes > 1
							) {
								lEtage =
									(lNbHorairesAffiches - 1) %
									this._options.nbAlternanceTitreColonnes;
								if (lEtage > 0) {
									H.push(
										'<div style="',
										ObjetStyle_1.GStyle.composeHeight(
											this._options.tailleAlternanceTitreColonne * lEtage,
										),
										'">&nbsp;</div>',
									);
								}
							}
							lClass =
								(lGrilleInverse
									? "AlignementGauche "
									: "AlignementDroit PetitEspaceDroit ") +
								this._getClassTitreHoraireDHoraire(aNumeroHoraire);
							H.push(
								'<div id="',
								this._cache.idLigneTitreG + "_" + aNumeroHoraire,
								'" class="',
								lClass,
								'"',
								' style="',
								ObjetStyle_1.GStyle.composeCouleurTexte(
									this._options.couleurLibellesLignes,
								),
								lGrilleInverse
									? ObjetStyle_1.GStyle.composeWidth(lTailleLigne)
									: ObjetStyle_1.GStyle.composeHeight(lTailleLigne),
								"position:relative;",
								lGrilleInverse
									? "left:" +
											-Math.round(
												ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
													lLibelle,
													this.getTaillePoliceHeure(),
												) / 2,
											) +
											"px;"
									: "top:" + -lHauteurDecalagePolicePx + "px;",
								'">',
								ObjetChaine_1.GChaine.avecEspaceSiVide(lLibelle),
								"</div>",
							);
							if (
								lGrilleInverse &&
								this._options.nbAlternanceTitreColonnes > 1
							) {
								lEtage =
									(lNbHorairesAffiches - 1) %
									this._options.nbAlternanceTitreColonnes;
								if (lEtage < this._options.nbAlternanceTitreColonnes) {
									H.push(
										'<div style="',
										ObjetStyle_1.GStyle.composeHeight(
											this._options.tailleAlternanceTitreColonne *
												(this._options.nbAlternanceTitreColonnes - lEtage - 1),
										),
										'">&nbsp;</div>',
									);
								}
							}
						} else {
							H.push("&nbsp;");
						}
						if (
							!lAvecPremierHoraire &&
							aNumeroHoraire % this._options.pasHoraire === 0
						) {
							lAvecPremierHoraire = true;
						}
					}
				} else {
					const lAvecSequence =
						((lAfficherPasHoraire &&
							(aNumeroHoraire !== aBlocHoraire.fin ||
								this._options.pasHoraire === 1)) ||
							!lAvecPremierHoraire) &&
						lLibelle;
					if (lAvecSequence) {
						lClass =
							(lGrilleInverse
								? "AlignementMilieu "
								: "AlignementDroit PetitEspaceDroit ") +
							this._getClassTitreHoraireDHoraire(aNumeroHoraire);
						lNombreLignesCouvertes = this._options.pasHoraire;
						if (!lAvecPremierHoraire) {
							lNombreLignesCouvertes =
								lNombreLignesCouvertes -
								(aNumeroHoraire % this._options.pasHoraire);
						}
						lNombreLignesCouvertes = Math.min(
							lNombreLignesCouvertes,
							aBlocHoraire.fin - aNumeroHoraire + 1,
						);
						if (lLibelle) {
							lNbHorairesAffiches += 1;
							H.push(
								"<div ",
								' id="' +
									this._cache.idLigneTitreG +
									"_" +
									aNumeroHoraire +
									'" ',
								' class="' + lClass + '"',
								' style="',
								lGrilleInverse
									? ObjetStyle_1.GStyle.composeWidth(
											lTailleLigne * lNombreLignesCouvertes,
										)
									: ObjetStyle_1.GStyle.composeHeight(lTailleLigne),
								ObjetStyle_1.GStyle.composeCouleurTexte(
									this._options.couleurLibellesLignes,
								),
								lGrilleInverse
									? "overflow:hidden;"
									: "position:relative;top:" +
											(Math.floor((lTailleLigne * lNombreLignesCouvertes) / 2) -
												lHauteurDecalagePolicePx +
												1) +
											"px;",
								'">',
								ObjetChaine_1.GChaine.avecEspaceSiVide(lLibelle),
								"</div>",
							);
						}
						if (!lAvecPremierHoraire && lAvecSequence) {
							lAvecPremierHoraire = true;
						}
					}
				}
				H.push("</div>");
				if (lTailleGouttiere) {
					H.push(
						'<div style="' +
							(this._options.grilleInverse
								? ObjetStyle_1.GStyle.composeWidth(lTailleGouttiere)
								: ObjetStyle_1.GStyle.composeHeight(lTailleGouttiere)) +
							ObjetStyle_1.GStyle.composeCouleurFond(
								this._options.couleurFondGouttiere,
							) +
							'" ' +
							(this._options.grilleInverse
								? 'class="InlineBlock AlignementHaut"'
								: "") +
							"></div>",
					);
					lNbHorairesAffiches = 0;
				}
			},
		);
		return this._composeDecorateursBlocsHoraires(H.join(""));
	}
	getNodeGrilleInterne(aNode) {
		const lInstance = this;
		let lPlaceGrille;
		$(aNode).on({
			pointerdown: function (aEvent) {
				lPlaceGrille = lInstance.getPlaceDePosition(
					lInstance.getPositionGrilleEvent(aEvent),
				);
				lInstance.surMouseDownGrilleCellule(lPlaceGrille, this, aEvent);
			},
			"ie-pointerdownlong": function (aEvent) {
				if (
					aEvent.pointerType === "touch" &&
					MethodesObjet_1.MethodesObjet.isFunction(
						lInstance._options.surLongTouchGrille,
					)
				) {
					lPlaceGrille = lInstance.getPlaceDePosition(
						lInstance.getPositionGrilleEvent(aEvent),
					);
					lInstance._options.surLongTouchGrille({
						grille: lInstance,
						placeGrille: lPlaceGrille,
						event: aEvent,
					});
				}
			},
		});
	}
	surMouseDownGrilleCellule(aPlace, aElement, aEvent) {
		if (this._options.callbackMouseDownCellule) {
			this._options.callbackMouseDownCellule(aPlace, aElement, aEvent);
		}
	}
	composeFondTrancheBlocHoraire(aNumeroTranche, aBlocHoraire, aNumeroHoraire) {
		return "";
	}
	_composeContenuAbolueDansGrille() {
		return "";
	}
	numeroHoraireGranularite(aNumeroHoraire) {
		let lNumeroHoraire = aNumeroHoraire;
		if (
			this._options.granularitPasHoraire > 0 &&
			MethodesObjet_1.MethodesObjet.isNumber(this._options.granularitPasHoraire)
		) {
			while (
				lNumeroHoraire >= 0 &&
				lNumeroHoraire % this._options.granularitPasHoraire
			) {
				lNumeroHoraire += -1;
			}
		}
		return lNumeroHoraire;
	}
	getTailleHoraire() {
		return this._options.grilleInverse
			? this.largeurCellule
			: this.hauteurCellule;
	}
	getTailleTranche() {
		return this._options.grilleInverse
			? this.hauteurCellule
			: this.largeurCellule;
	}
	getGenreSeparateurLigne(aNumeroHoraire, aPourHoraire) {
		return _ObjetGrille.separateurLigne.moyen;
	}
	_getPourcentageLargeurSeparateur(aGenreSeparateur) {
		switch (aGenreSeparateur) {
			case _ObjetGrille.separateurLigne.moyen:
				return 40;
			default:
				return 20;
		}
	}
	getContenuHtmlCellule(aPlaceGrille, aCoords) {
		return "";
	}
	getHintCellule(aPlaceGrille) {
		return "";
	}
	getClassCurseurDeCellule(aPlaceGrille) {
		return "";
	}
	getCouleurFond() {
		return this._options.couleurFond;
	}
	getCouleurBordures() {
		return this._options.couleurBordures;
	}
	getCouleurFondDePlaceEDT(aPlaceEdt) {
		return "";
	}
	composeTitreHorairePiedTranche() {
		return "";
	}
	composeContenuPiedHoraire() {
		return "";
	}
	composeVoileTranche(aParams) {
		const lParams = Object.assign(
			{
				placeDebut: undefined,
				placeFin: undefined,
				couleur: "#FFFFFF",
				opacite: 0.5,
				zIndex: 10,
			},
			aParams,
		);
		if (
			lParams.placeFin < lParams.placeDebut ||
			lParams.placeDebut === undefined ||
			lParams.placeFin === undefined
		) {
			return "";
		}
		const lCoordsDebut = this.getCoordonneesDePlace(lParams.placeDebut, true);
		const lCoordsFin = this.getCoordonneesDePlace(lParams.placeFin, true);
		return [
			'<div style="position:absolute;z-index:',
			lParams.zIndex,
			";",
			ObjetStyle_1.GStyle.composeOpacite(lParams.opacite) +
				ObjetStyle_1.GStyle.composeCouleurFond(lParams.couleur),
			"pointer-events:none;",
			"left:" + lCoordsDebut.left + "px;",
			"top:" + lCoordsDebut.top + "px;",
			"width:" + (lCoordsFin.right - lCoordsDebut.left) + "px;",
			"height:" + (lCoordsFin.bottom - lCoordsDebut.top) + "px;",
			'"></div>',
		].join("");
	}
	calculerDebutEtFin() {}
	getTrancheHoraireDePlace(aPlace, aAccepteHorsGrille) {
		const lNbHoraires = this._options.blocHoraires.nbHoraires(),
			lTrancheHoraire = {
				tranche: Math.floor(aPlace / lNbHoraires),
				horaire: aPlace % lNbHoraires,
			};
		if (!this._estTrancheHoraireVisible(lTrancheHoraire)) {
			if (aAccepteHorsGrille) {
				lTrancheHoraire.erreur = true;
			} else {
				return { tranche: 0, horaire: 0, erreur: true };
			}
		}
		return lTrancheHoraire;
	}
	getTrancheHoraireDePosition(aPosition) {
		return {
			tranche: this._options.grilleInverse ? aPosition.y : aPosition.x,
			horaire: this._options.grilleInverse ? aPosition.x : aPosition.y,
		};
	}
	getPlaceDeTrancheHoraire(aTrancheHoraire) {
		if (
			!(
				aTrancheHoraire.tranche >= 0 &&
				aTrancheHoraire.tranche < this._options.tranches.count()
			)
		) {
			return 0;
		}
		return (
			aTrancheHoraire.tranche * this._options.blocHoraires.nbHoraires() +
			aTrancheHoraire.horaire
		);
	}
	getPositionDePlace(aPlace, aAccepteHorsGrille) {
		const lTrancheHoraire = this.getTrancheHoraireDePlace(
				aPlace,
				aAccepteHorsGrille,
			),
			lPos = {
				x: this._options.grilleInverse
					? lTrancheHoraire.horaire
					: lTrancheHoraire.tranche,
				y: this._options.grilleInverse
					? lTrancheHoraire.tranche
					: lTrancheHoraire.horaire,
			};
		if (lTrancheHoraire.erreur) {
			lPos.erreur = lTrancheHoraire.erreur;
		}
		return lPos;
	}
	getPlaceDePosition(aPosition) {
		return this.getPlaceDeTrancheHoraire({
			tranche: this._options.grilleInverse ? aPosition.y : aPosition.x,
			horaire: this._options.grilleInverse ? aPosition.x : aPosition.y,
		});
	}
	getPositionGrilleEvent(aEvent) {
		const lPositionEvent =
				ObjetPosition_1.GPosition.getPositionEventJQuery(aEvent),
			lElementGrille = ObjetHtml_1.GHtml.getElement(this.IdCellulePrefixe),
			lPosition = ObjetPosition_1.GPosition.getClientRect(lElementGrille);
		const lMax = {
				tranche: this._options.tranches.count() - 1,
				horaire: this._options.blocHoraires.nbHoraires() - 1,
			},
			lMaxPosition = {
				x: this._options.grilleInverse ? lMax.horaire : lMax.tranche,
				y: this._options.grilleInverse ? lMax.tranche : lMax.horaire,
			};
		return {
			y: Math.borner(
				this.getNumeroLigneDePositionTop(
					(lPositionEvent.y || 0) - (lPosition ? lPosition.top : 0),
					true,
				),
				0,
				lMaxPosition.y,
			),
			x: Math.borner(
				this.getNumeroColonneDePositionLeft(
					(lPositionEvent.x || 0) - (lPosition ? lPosition.left : 0),
					true,
				),
				0,
				lMaxPosition.x,
			),
		};
	}
	getTaillesDePositionGrille(aPositionGrille) {
		const lPositionGrille = Object.assign(
			{ nbHoraires: 1, nbTranches: 1 },
			aPositionGrille,
		);
		return {
			width:
				(this._options.grilleInverse
					? lPositionGrille.nbHoraires
					: lPositionGrille.nbTranches) * this.largeurCellule,
			height:
				(this._options.grilleInverse
					? lPositionGrille.nbTranches
					: lPositionGrille.nbHoraires) * this.hauteurCellule,
		};
	}
	getCoordonneesDePlace(aPlace, aAccepteHorsGrille) {
		const lPosition = this.getPositionDePlace(aPlace, aAccepteHorsGrille);
		if (lPosition.erreur && !aAccepteHorsGrille) {
			return { top: 0, left: 0, bottom: 0, right: 0, erreur: true };
		}
		const lTop = this.getPositionTopDeLigne(lPosition.y),
			lLeft = this.getPositionLeftDeColonne(lPosition.x);
		return {
			top: lTop,
			left: lLeft,
			bottom: lTop + this.hauteurCellule - 1,
			right: lLeft + this.largeurCellule - 1,
		};
	}
	getCoordonneesPiedTrancheDeNumeroTranche(aNumeroTranche) {
		const lPosition = this.getPositionTrancheDeNumeroTranche(aNumeroTranche);
		if (this._options.grilleInverse) {
			return {
				top: lPosition,
				left: 0,
				right: this._options.taillePiedTrancheInverse,
				bottom: lPosition + this.hauteurCellule,
			};
		} else {
			return {
				top: 0,
				left: lPosition,
				right: lPosition + this.largeurCellule,
				bottom: this._options.taillePiedTranche,
			};
		}
	}
	getPositionTopDeLigne(aNumeroLigne) {
		if (this._options.grilleInverse) {
			return this.getPositionTrancheDeNumeroTranche(aNumeroLigne);
		} else {
			return this.getPositionHoraireDeNumeroHoraire(aNumeroLigne);
		}
	}
	getNumeroLigneDePositionTop(aPositionTop, aUniquementLigneDebut) {
		if (this._options.grilleInverse) {
			return this.getNumeroTrancheDePositionTranche(
				aPositionTop,
				aUniquementLigneDebut,
			);
		} else {
			return this.getNumeroHoraireDePositionHoraire(
				aPositionTop,
				aUniquementLigneDebut,
			);
		}
	}
	getPositionLeftDeColonne(aNumeroColonne) {
		if (this._options.grilleInverse) {
			return this.getPositionHoraireDeNumeroHoraire(aNumeroColonne);
		} else {
			return this.getPositionTrancheDeNumeroTranche(aNumeroColonne);
		}
	}
	getNumeroColonneDePositionLeft(aPositionLeft, aUniquementColonneDebut) {
		if (this._options.grilleInverse) {
			return this.getNumeroHoraireDePositionHoraire(
				aPositionLeft,
				aUniquementColonneDebut,
			);
		} else {
			return this.getNumeroTrancheDePositionTranche(
				aPositionLeft,
				aUniquementColonneDebut,
			);
		}
	}
	getPositionTrancheDeNumeroTranche(aNumeroTranche, aTrancheFin) {
		let lPosition = 0;
		const lTailleTranche = this.getTailleTranche();
		this._options.tranches.parcourir((aNumeroTrancheParcours) => {
			if (aNumeroTrancheParcours >= aNumeroTranche) {
				if (aTrancheFin && aNumeroTrancheParcours === aNumeroTranche) {
					lPosition +=
						lTailleTranche +
						this._options.tranches.getTailleGouttiere(aNumeroTrancheParcours);
				}
				return false;
			}
			lPosition +=
				lTailleTranche +
				this._options.tranches.getTailleGouttiere(aNumeroTrancheParcours);
		});
		return lPosition;
	}
	getNumeroTrancheDePositionTranche(aPositionTranche, aUniquementTrancheDebut) {
		let lNumeroTranche = -1;
		this._options.tranches.parcourir((aNumeroTranche, aTranche) => {
			if (
				aTranche &&
				this.getPositionTrancheDeNumeroTranche(aNumeroTranche + 1) >
					aPositionTranche
			) {
				lNumeroTranche = Math.max(0, aNumeroTranche);
				return false;
			}
		});
		return lNumeroTranche < 0
			? this._options.tranches.count() + (aUniquementTrancheDebut ? -1 : 0)
			: lNumeroTranche;
	}
	getPositionHoraireDeNumeroHoraire(aNumeroHoraire, aHoraireFin) {
		const lBlocHoraire =
			this._options.blocHoraires.rechercheHoraire(aNumeroHoraire);
		const lTailleHoraire = this.getTailleHoraire();
		return (
			lTailleHoraire *
				(Math.borner(aNumeroHoraire, lBlocHoraire.debut, lBlocHoraire.fin + 1) -
					lBlocHoraire.decalage) +
			(aHoraireFin ? lTailleHoraire : 0) +
			lBlocHoraire.decalageGouttiere
		);
	}
	getNumeroHoraireDePositionHoraire(aPositionHoraire, aUniquementHoraireDebut) {
		let lNumeroHoraire = -1;
		if (
			!this._options.blocHoraires ||
			this._options.blocHoraires.nbHoraires() === 0
		) {
			return lNumeroHoraire;
		}
		this._options.blocHoraires.parcourirHoraires((aNumeroHoraire) => {
			if (
				this.getPositionHoraireDeNumeroHoraire(aNumeroHoraire + 1) >
				aPositionHoraire
			) {
				lNumeroHoraire = Math.max(0, aNumeroHoraire);
				return false;
			}
		});
		return lNumeroHoraire < 0
			? this._options.blocHoraires.horaires[
					this._options.blocHoraires.horaires.length - 1
				].fin + (aUniquementHoraireDebut ? 0 : 1)
			: lNumeroHoraire;
	}
	getStyleImageDansHoraire(aNumeroHoraire) {
		const lDescriptionHoraire =
			this._options.blocHoraires.rechercheHoraire(aNumeroHoraire);
		let lStyle = this._options.grilleInverse
			? "background-position:" +
				-((aNumeroHoraire - lDescriptionHoraire.debut) * this.largeurCellule) +
				"px 0px;"
			: "background-position:0px " +
				-((aNumeroHoraire - lDescriptionHoraire.debut) * this.hauteurCellule) +
				"px;";
		if (ObjetSupport_1.Support.avecBackgroundSize) {
			lStyle += this._options.grilleInverse
				? "background-size:" +
					this.hauteurCellule +
					"px " +
					this.hauteurCellule +
					"px;"
				: "background-size:" +
					this.largeurCellule +
					"px " +
					this.largeurCellule +
					"px;";
		}
		return lStyle;
	}
	getTailleSelonCellule(aParam) {
		const lParam = Object.assign(
				{ tailleMax: 3, tailleMin: 2, pourcentage: 45 },
				aParam,
			),
			lTailleDispo = Math.min(this.hauteurCellule, this.largeurCellule) - 1;
		return Math.max(
			lParam.tailleMin,
			Math.min(
				lParam.tailleMax,
				Math.floor((lTailleDispo * lParam.pourcentage) / 100),
			),
		);
	}
	construireLibelleInclineSurBlocHoraire(aParams) {
		const lParams = Object.assign(
			{
				libelle: "",
				class: "FondTrancheBlocHoraireTexte",
				blocHoraire: null,
				placeDebut: -1,
				placeFin: -1,
			},
			aParams,
		);
		if (!lParams.libelle || !lParams.class) {
			return "";
		}
		const lPlaceDebut =
			lParams.placeDebut >= 0 ? lParams.placeDebut : lParams.blocHoraire.debut;
		const lPlaceFin =
			lParams.placeFin >= 0 ? lParams.placeFin : lParams.blocHoraire.fin;
		const lTailleTranche = this.getTailleTranche();
		const lTailleHoraire = this.getTailleHoraire();
		const lTailleTexte = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			ObjetChaine_1.GChaine.enleverEntites(lParams.libelle),
			"1.1rem",
			true,
		);
		const lScale = ((lTailleTranche * 0.9) / lTailleTexte).toFixed(1);
		const lPourcentTranche = 90;
		const lNb = Math.max(
			1,
			Math.ceil(
				((lPlaceFin - lPlaceDebut + 1) *
					((lTailleHoraire * 100) / lPourcentTranche)) /
					lTailleTranche,
			),
		);
		const H = [];
		if (lParams.placeDebut >= 0 || lParams.placeFin >= 0) {
			const lCoordsDebutBloc = this.getCoordonneesDePlace(
				lParams.blocHoraire.debut,
			);
			const lCoordsDebut = this.getCoordonneesDePlace(lPlaceDebut);
			const lTailles = this.getTaillesDePositionGrille({
				nbTranches: 1,
				nbHoraires: lPlaceFin - lPlaceDebut + 1,
			});
			H.push(
				'<div class="FondTrancheBlocHoraire" style="left:',
				lCoordsDebut.left - lCoordsDebutBloc.left,
				"px;top:",
				lCoordsDebut.top - lCoordsDebutBloc.top,
				"px;",
				"width:" + lTailles.width + "px;",
				"height:" + lTailles.height + 'px;">',
			);
		}
		for (let i = 0; i < lNb; i++) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: lParams.class,
						style: `min-width:${this._options.grilleInverse ? (lTailleTranche * lPourcentTranche) / 100 : lTailleTranche}px;min-height:${!this._options.grilleInverse ? (lTailleTranche * lPourcentTranche) / 100 : lTailleTranche}px;`,
					},
					IE.jsx.str(
						"div",
						{
							style: `transform: scale(${lScale}) rotate(-45deg);`,
							role: "presentation",
						},
						lParams.libelle,
					),
				),
			);
		}
		if (lParams.placeDebut >= 0 || lParams.placeFin >= 0) {
			H.push("</div>");
		}
		return H.join("");
	}
	surPreResize() {
		if (this.EnAffichage) {
			this.effacer();
		}
	}
	surPostResize() {
		if (this.EnAffichage) {
			this.actualiser();
		}
	}
	_mousemoveGrille(aEvent) {
		const lPosition = this.getPositionGrilleEvent(aEvent);
		if (
			this._cache.positionSurvolSourisEnCours.x !== lPosition.x ||
			this._cache.positionSurvolSourisEnCours.y !== lPosition.y
		) {
			this._cache.positionSurvolSourisEnCours = lPosition;
			const lPlace = this.getPlaceDePosition(lPosition);
			if (this._cache.hint) {
				ObjetHint_1.ObjetHint.stop(this._cache.hint);
				this._cache.hint = null;
			}
			const lTitle = this.getHintCellule(lPlace);
			if (lTitle) {
				this._cache.hint = ObjetHint_1.ObjetHint.start(lTitle);
			}
			const lClassCurseur = this.getClassCurseurDeCellule(lPlace);
			if (lClassCurseur !== this._cache.classCursorSurvolEnCours) {
				$("#" + this.IdCellulePrefixe.escapeJQ())
					.removeClass(this._cache.classCursorSurvolEnCours)
					.addClass(lClassCurseur);
				this._cache.classCursorSurvolEnCours = lClassCurseur;
			}
		}
	}
	_fillRect(aParams) {
		this._fillRectDirect(aParams);
		this._cache.commandesCanvas.push(aParams);
	}
	_fillRectDirect(aParams) {
		if (aParams.fillStyle !== undefined) {
			aParams.context.fillStyle = aParams.fillStyle;
		}
		const lAvecCorrectionPrecisionWidth = aParams.width > 5;
		const lAvecCorrectionPrecisionHeight = aParams.height > 5;
		aParams.context.fillRect(
			(aParams.left - this._cache.positionCanvasPartiel.left) /
				this._cache.canvasScaleX +
				(lAvecCorrectionPrecisionWidth ? -0.5 : 0),
			(aParams.top - this._cache.positionCanvasPartiel.top) /
				this._cache.canvasScaleY +
				(lAvecCorrectionPrecisionHeight ? -0.5 : 0),
			aParams.width / this._cache.canvasScaleX +
				(lAvecCorrectionPrecisionWidth ? 1 : 0),
			aParams.height / this._cache.canvasScaleY +
				(lAvecCorrectionPrecisionHeight ? 1 : 0),
		);
	}
	_traceCalque(aGenreCalque) {
		const lContext = this._cache.contextCanvas[aGenreCalque];
		const lCouleurBordure = this.getCouleurBordures();
		const lCouleurBordureSecondaire =
			this._options.couleurBorduresSecondaires || lCouleurBordure;
		this._options.tranches.parcourir((aNumeroTranche, aTranche) => {
			const lDerniereTranche =
				aNumeroTranche === this._options.tranches.count() - 1;
			this._options.blocHoraires.parcourirHoraires(
				(aNumeroHoraire, aBlocHoraire) => {
					const lParams = {
						context: lContext,
						genreCalque: aGenreCalque,
						numeroTranche: aNumeroTranche,
						tranche: aTranche,
						horaire: aNumeroHoraire,
						place: this.getPlaceDeTrancheHoraire({
							tranche: aNumeroTranche,
							horaire: aNumeroHoraire,
						}),
						blocHoraire: aBlocHoraire,
						derniereTranche: lDerniereTranche,
						couleurBordure: lCouleurBordure,
						couleurBordureSecondaire: lCouleurBordureSecondaire,
					};
					switch (aGenreCalque) {
						case _ObjetGrille.calque.fond:
							this.traceCalqueCanvasFondDePlace(lParams.place);
							break;
						case _ObjetGrille.calque.quadrillage:
							this.traceCalqueCanvasQuadrillagedDePlace(lParams);
							break;
					}
				},
			);
		});
	}
	_zoomMouseWheel(aDelta, aNbPasPrecedent, aTailleTranchePrecedente) {
		const lTaillePasHoraire = this.getTailleHoraire();
		const lTailleTranche = this.getTailleTranche();
		const lBloquerZoomPas =
			(aDelta > 0 &&
				this._options.tailleMAXPasHoraire > 0 &&
				lTaillePasHoraire >= this._options.tailleMAXPasHoraire) ||
			(aDelta < 0 &&
				this._options.tailleMINPasHoraire > 0 &&
				lTaillePasHoraire <= this._options.tailleMINPasHoraire);
		const lBloquerZoomTranche =
			(aDelta < 0 && lTailleTranche <= this._cache.tailleTrancheEcranZoomMIN) ||
			(aDelta > 0 && lTailleTranche >= this._cache.tailleTrancheEcranZoomMAX);
		if (lBloquerZoomPas && lBloquerZoomTranche) {
			return;
		}
		let lInc;
		let lNbPas =
			this._cache.nbPasHorairesEcranZoom > 0
				? this._cache.nbPasHorairesEcranZoom
				: this._cache.nbPasHorairesEcranZoomMAX;
		if (!lBloquerZoomPas) {
			lInc = Math.ceil(
				this._cache.nbPasHorairesEcranZoomMAX /
					this._options.seuilZoomCtrlWheel,
			);
			if (aDelta > 0) {
				lNbPas -= lInc;
			} else if (aDelta < 0) {
				lNbPas += lInc;
			}
			lNbPas = Math.min(
				Math.max(2, lNbPas),
				this._cache.nbPasHorairesEcranZoomMAX,
			);
		}
		let lTailleTrancheZoom =
			this._cache.tailleTrancheEcranZoom > 0
				? this._cache.tailleTrancheEcranZoom
				: lTailleTranche;
		if (!lBloquerZoomTranche) {
			lInc = Math.ceil(lTailleTranche / this._options.seuilZoomCtrlWheel);
			if (aDelta > 0) {
				lTailleTrancheZoom += lInc;
			} else if (aDelta < 0) {
				lTailleTrancheZoom -= lInc;
			}
			lTailleTrancheZoom = Math.min(
				Math.max(this._cache.tailleTrancheEcranZoomMIN, lTailleTrancheZoom),
				this._cache.tailleTrancheEcranZoomMAX,
			);
		}
		if (
			lNbPas !== this._cache.nbPasHorairesEcranZoom ||
			lTailleTrancheZoom !== this._cache.tailleTrancheEcranZoom
		) {
			this._cache.nbPasHorairesEcranZoom = lNbPas;
			this._cache.tailleTrancheEcranZoom = lTailleTrancheZoom;
			const lWidth = this.getLargeurMaxGrille();
			const lHeight = this.getHauteurMaxGrille();
			const lNouvelleTaillePas = this._getTaillePasHoraire(
				this._options.grilleInverse ? lWidth : lHeight,
			);
			const lNouvelleTailleTranche = this._getTailleTranche(
				this._options.grilleInverse ? lHeight : lWidth,
			);
			this._cache.tailleTrancheEcranZoom = lNouvelleTailleTranche;
			if (
				lNouvelleTaillePas === lTaillePasHoraire &&
				lNouvelleTailleTranche === lTailleTranche
			) {
				if (
					aNbPasPrecedent !== lNbPas ||
					aTailleTranchePrecedente !== lTailleTrancheZoom
				) {
					this._zoomMouseWheel(aDelta, lNbPas, lTailleTrancheZoom);
				}
				return;
			}
			if (this._cache.timeoutZoom) {
				clearTimeout(this._cache.timeoutZoom);
				this._cache.timeoutZoom = null;
			}
			this._cache.timeoutZoom = setTimeout(() => {
				this._cache.timeoutZoom = null;
				this.actualiser();
			}, 10);
		}
	}
	_actualiserCalquesCanvasSurScroll() {
		Object.keys(_ObjetGrille.calque).forEach((aGenreCalque) => {
			this._cache.contextCanvas[aGenreCalque].clearRect(
				0,
				0,
				this._cache.positionCanvasPartiel.widthZone,
				this._cache.positionCanvasPartiel.heightZone,
			);
			$("#" + (this._cache.id + aGenreCalque).escapeJQ()).css({
				left: this._cache.positionCanvasPartiel.left,
				top: this._cache.positionCanvasPartiel.top,
			});
		});
		this._cache.commandesCanvas.forEach((aCommande) => {
			this._fillRectDirect(aCommande);
		});
	}
	_getTailleZone(aHauteur) {
		let lTaille = 0;
		if (aHauteur) {
			lTaille =
				this.getPositionTopDeLigne(
					Math.max(
						1,
						this.getNumeroLigneDePositionTop(this._cache.heightMaxGrille),
					),
				) - 1;
		} else {
			lTaille =
				this.getPositionLeftDeColonne(
					Math.max(
						1,
						this.getNumeroColonneDePositionLeft(this._cache.widthMaxGrille),
					),
				) - 1;
		}
		return lTaille;
	}
	_evenementScrollH(AGenre, APosition) {
		switch (AGenre) {
			case ObjetScroll_3.EGenreScrollEvenement.Deplacement: {
				const lColonne = this.getNumeroColonneDePositionLeft(
					APosition + this.largeurCellule / 2,
				);
				const lValeur = this.getPositionLeftDeColonne(lColonne);
				if (
					this._cache.canvasPartiel &&
					this._cache.positionCanvasPartiel.left !== lValeur
				) {
					this._cache.positionCanvasPartiel.left = lValeur;
					this._actualiserCalquesCanvasSurScroll();
				}
				if (this._options.grilleInverse) {
					this._actualiserLibellesHeure(Math.abs(lColonne), lValeur);
				}
				return lValeur;
			}
			case ObjetScroll_3.EGenreScrollEvenement.TailleZone:
				return this._getTailleZone(false);
			case ObjetScroll_3.EGenreScrollEvenement.TailleContenu:
				return this.getPositionLeftDeColonne(Number.MAX_VALUE) - 1;
		}
	}
	_evenementScrollV(AGenre, APosition) {
		let lLigne, lValeur;
		switch (AGenre) {
			case ObjetScroll_3.EGenreScrollEvenement.Deplacement:
				lLigne = this.getNumeroLigneDePositionTop(
					APosition + this.hauteurCellule / 2,
				);
				lValeur = this.getPositionTopDeLigne(lLigne);
				if (
					this._cache.canvasPartiel &&
					this._cache.positionCanvasPartiel.top !== lValeur
				) {
					this._cache.positionCanvasPartiel.top = lValeur;
					this._actualiserCalquesCanvasSurScroll();
				}
				if (!this._options.grilleInverse) {
					this._actualiserLibellesHeure(Math.abs(lLigne), lValeur);
				}
				return lValeur;
			case ObjetScroll_3.EGenreScrollEvenement.TailleZone:
				return (
					this.getPositionTopDeLigne(
						Math.max(
							1,
							this.getNumeroLigneDePositionTop(this._cache.heightMaxGrille),
						),
					) - 1
				);
			case ObjetScroll_3.EGenreScrollEvenement.TailleContenu:
				return $(
					"#" + this.ScrollV.getIdContenu(EZoneScroll.Grille).escapeJQ(),
				).height();
		}
	}
	scrollToHTMLElement(aNode) {
		this.ScrollV.scrollToElement(aNode);
		this.ScrollH.scrollToElement(aNode);
	}
	_estModeTactile() {
		return GNavigateur.isLayoutTactile && this._options.avecModeTactile;
	}
	_getTaillePasHoraire(aTaille) {
		let lTaille = 0;
		let lHoraire;
		let lNbHoraires = 0;
		if (
			!this._options.blocHoraires ||
			this._options.blocHoraires.nbHoraires() === 0
		) {
			return 0;
		}
		this._options.blocHoraires.parcourirBlocs((aBlocHoraire, aIndex) => {
			if (
				this._options.nbGouttieresEcran > 0 &&
				aIndex >= this._options.nbGouttieresEcran
			) {
				return false;
			}
			lHoraire = aBlocHoraire;
			lNbHoraires += lHoraire.fin - lHoraire.debut + 1;
		});
		this._cache.nbPasHorairesEcranZoomMAX = lNbHoraires;
		if (
			this._options.avecZoomCtrlWheel &&
			this._cache.nbPasHorairesEcranZoom > 0
		) {
			lNbHoraires = Math.min(
				this._cache.nbPasHorairesEcranZoomMAX,
				this._cache.nbPasHorairesEcranZoom,
			);
		}
		if (
			this._options.nbGouttieresEcran > 0 &&
			this._options.blocHoraires.horaires.length > 1
		) {
			lTaille = Math.floor(
				(aTaille -
					this._options.blocHoraires.rechercheHoraire(lHoraire.fin + 1)
						.decalageGouttiere) /
					lNbHoraires,
			);
		} else if (this._options.nbPasHorairesEcran > 0) {
			this._cache.nbPasHorairesEcranZoomMAX = this._options.nbPasHorairesEcran;
			this._cache.nbPasHorairesEcranZoom = Math.min(
				this._cache.nbPasHorairesEcranZoom,
				this._cache.nbPasHorairesEcranZoomMAX,
			);
			lNbHoraires = Math.min(this._options.nbPasHorairesEcran, lNbHoraires);
			lTaille = Math.floor(
				(aTaille -
					this._options.blocHoraires.rechercheHoraire(lNbHoraires + 1)
						.decalageGouttiere) /
					lNbHoraires,
			);
		} else {
			lTaille =
				this._options.taillePasHoraire > 0
					? this._options.taillePasHoraire
					: Math.floor(
							(aTaille -
								this._options.blocHoraires.rechercheHoraire(lHoraire.fin)
									.decalageGouttiere) /
								lNbHoraires,
						);
		}
		lTaille = Math.max(lTaille, this._options.tailleMINPasHoraire);
		if (
			this._options.tailleMAXPasHoraire > 0 &&
			!(
				this._cache.nbPasHorairesEcranZoom > 0 &&
				this._cache.nbPasHorairesEcranZoom <
					this._cache.nbPasHorairesEcranZoomMAX
			)
		) {
			lTaille = Math.min(lTaille, this._options.tailleMAXPasHoraire);
		}
		return Math.floor(lTaille);
	}
	_getTailleTranche(aTaille) {
		const lZoomTranche =
			this._options.avecZoomCtrlWheel && this._cache.tailleTrancheEcranZoom > 0;
		const lCalculParNbTranches = this._options.nbTranchesEcran > 0;
		let lTaille = aTaille;
		this._cache.tailleTrancheEcranZoomMAX = aTaille;
		let lNbTranchesEcran = this._options.tranches.count();
		if (lCalculParNbTranches) {
			if (this._options.reserverPlaceTranchesEcran) {
				lNbTranchesEcran = this._options.nbTranchesEcran;
			} else {
				lNbTranchesEcran = Math.min(
					this._options.nbTranchesEcran,
					this._options.tranches.count(),
				);
			}
		}
		this._options.tranches.parcourir((aNumeroTranche) => {
			if (lCalculParNbTranches && aNumeroTranche > lNbTranchesEcran) {
				return false;
			}
			lTaille += -this._options.tranches.getTailleGouttiere(aNumeroTranche);
		});
		lTaille = Math.floor(lTaille / lNbTranchesEcran);
		this._cache.tailleTrancheEcranZoomMIN = lTaille;
		if (lZoomTranche) {
			lTaille = Math.max(lTaille, this._cache.tailleTrancheEcranZoom);
		}
		if (
			this._options.tailleMaxTranche > 0 &&
			!lCalculParNbTranches &&
			!lZoomTranche
		) {
			lTaille = Math.min(lTaille, this._options.tailleMaxTranche);
		}
		lTaille = Math.max(lTaille, this._options.tailleMinTranche);
		return Math.floor(lTaille);
	}
	_calculerDimensions(aSurRecalcul, aWidth) {
		const lEstPremiereFois = this.hauteurCellule === undefined;
		const lScrollHVisible_old = this._cache.scrollHVisible;
		if (!aSurRecalcul) {
			this._cache.scrollHVisible = false;
		}
		const LWidth = aWidth || this.getLargeurMaxGrille();
		let LHeight = this.getHauteurMaxGrille();
		this.largeurCellule = !this._options.grilleInverse
			? this._getTailleTranche(LWidth)
			: this._getTaillePasHoraire(LWidth);
		this._cache.scrollHVisible =
			LWidth < this.getPositionLeftDeColonne(Number.MAX_VALUE);
		if (this._cache.scrollHVisible !== lScrollHVisible_old) {
			LHeight = this.getHauteurMaxGrille();
		}
		this.hauteurCellule = !this._options.grilleInverse
			? this._getTaillePasHoraire(LHeight)
			: this._getTailleTranche(LHeight);
		this._cache.heightMaxGrille = LHeight;
		this._cache.widthMaxGrille = LWidth;
		if (lEstPremiereFois || (!aSurRecalcul && this._cache.scrollHVisible)) {
			this._calculerDimensions(true, LWidth);
		}
	}
	_construireGrille() {
		this._calculerDimensions();
		this.ScrollH.pas = this.largeurCellule;
		this.ScrollV.pas =
			this.hauteurCellule + (this._options.grilleInverse ? 0 : 1);
		if (
			!this._options.tranches ||
			this._options.tranches.count() === 0 ||
			!this._options.blocHoraires ||
			this._options.blocHoraires.nbHoraires() === 0
		) {
			IE.log.addLog("Grille sans horaires et/ou sans tranches => vide");
			return "";
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.idConteneurGrille,
					class: [
						"ObjetGrille",
						this._options.grilleInverse
							? " GrilleInverse"
							: " GrilleNonInverse",
					],
					role: this._options.WAILabelGrille ? "group" : false,
					"aria-label": this._options.WAILabelGrille,
				},
				(aTab) => {
					aTab.push(this._composeEnTete());
					aTab.push(this._composeCorps());
					aTab.push(this._composePied());
				},
			),
		);
		return H.join("");
	}
	_composeEnTete() {
		const H = [];
		H.push(
			'<div id="',
			this._cache.idLigneTitre,
			'" class="NoWrap titre-entete" style="',
			ObjetStyle_1.GStyle.composeHeight(this.getHauteurTitreColonnes()),
			'">',
		);
		H.push(
			IE.jsx.str("div", {
				id: this._cache.idLigneTitreHoraire_Debut,
				"aria-hidden": "true",
				class: "InlineBlock WhiteSpaceNormal AlignementMilieuVertical",
				style:
					ObjetStyle_1.GStyle.composeWidth(this.getLargeurTitreLignes()) +
					" height:100%; position:relative;",
			}),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "InlineBlock WhiteSpaceNormal AlignementMilieuVertical" },
				this._composeTitreColonnes(),
			),
		);
		if (this._options.grilleInverse) {
			H.push(
				IE.jsx.str("div", {
					id: this._cache.idLigneTitreHoraire_Fin,
					"aria-hidden": "true",
					class: "InlineBlock WhiteSpaceNormal AlignementMilieuVertical",
					style:
						ObjetStyle_1.GStyle.composeWidth(this.ScrollV.Largeur) +
						" height:100%; position:relative;",
				}),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeDecorateurBlocTrancheDeTranches(aTranches) {
		const H = [];
		const lWidth =
			(this._options.grilleInverse
				? this.hauteurCellule
				: this.largeurCellule) * aTranches.length;
		H.push(
			'<div class="decorateurTitre_BlocTranche" style="width:' + lWidth + "px;",
			ObjetStyle_1.GStyle.composeHeight(
				this._options.tailleDecorateurBlocTranche,
			),
			'">',
			this._options.getLibelleDecorateurBlocTranche.call(this, {
				width: lWidth,
				tranches: aTranches,
			}),
			"</div>",
		);
		return H.join("");
	}
	_composeDecorateurBlocTrancheDeGrille(aStyleConteneur) {
		const H = [];
		let lTranches = [];
		H.push(
			'<div class="decorateurTitre_conteneur_BlocTranche"',
			aStyleConteneur ? ' style="' + aStyleConteneur + '"' : "",
			">",
		);
		this._options.tranches.parcourir((aNumeroTranche, aTranche) => {
			lTranches.push(aTranche);
			const lGouttiere =
				this._options.tranches.getTailleGouttiere(aNumeroTranche);
			if (lGouttiere) {
				H.push(this._composeDecorateurBlocTrancheDeTranches(lTranches));
				H.push('<div style="width:' + lGouttiere + 'px;"></div>');
				lTranches = [];
			}
		});
		if (lTranches.length > 0) {
			H.push(this._composeDecorateurBlocTrancheDeTranches(lTranches));
		}
		H.push("</div>");
		return H.join("");
	}
	_composeTitreColonnes() {
		const H = [];
		H.push(
			'<div id="',
			this.ScrollH.getIdZone(EZoneScroll.TitreHaut),
			'" style="overflow:hidden;">',
		);
		H.push(
			'<div id="' +
				this.ScrollH.getIdContenu(EZoneScroll.TitreHaut) +
				'" class="NoWrap"',
			this._options.hauteurContenuTitre > 0
				? ' style="' +
						ObjetStyle_1.GStyle.composeHeight(
							this._options.hauteurContenuTitre,
						) +
						'"'
				: "",
			">",
		);
		if (this._options.grilleInverse) {
			H.push(this.composeTitresHoraires());
		} else {
			const lFormatTitreColonnes = this.getFormatTitreTrancheEnColonnes(
				this._options.tranches.count(),
				this.largeurCellule,
			);
			const lAvecDecorateur = !!this._options.getLibelleDecorateurBlocTranche;
			if (lAvecDecorateur) {
				H.push(this._composeDecorateurBlocTrancheDeGrille());
				H.push('<div class="NoWrap">');
			}
			this._options.tranches.parcourir((aNumeroTranche, aTranche) => {
				H.push(
					'<div id="',
					this._cache.idTitreTranche + aNumeroTranche,
					'" aria-hidden="true" class="InlineBlock WhiteSpaceNormal AlignementMilieuVertical AlignementMilieu" style="width:' +
						this.largeurCellule +
						'px; position:relative;">',
					this._options.getLibelleTranche
						? this._options.getLibelleTranche.call(this, {
								numeroTranche: aNumeroTranche,
								tranche: aTranche,
								width: this.largeurCellule,
								format: lFormatTitreColonnes,
							})
						: this.composeTitresTranches(
								aNumeroTranche,
								this.largeurCellule,
								lFormatTitreColonnes,
							),
					"</div>",
				);
				const lGouttiere =
					this._options.tranches.getTailleGouttiere(aNumeroTranche);
				if (lGouttiere) {
					H.push(
						'<div class="InlineBlock AlignementMilieuVertical" style="width:' +
							lGouttiere +
							'px;"></div>',
					);
				}
			});
			if (lAvecDecorateur) {
				H.push("</div>");
			}
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeCorps() {
		const H = [];
		H.push('<div class="corpsGrille">');
		H.push('<div aria-hidden="true">');
		H.push(this._composeTitreLignes());
		H.push("</div>");
		H.push("<div>");
		H.push(this._composeGrille());
		H.push("</div>");
		if (this._options.grilleInverse && this._getAvecPiedTranche()) {
			H.push("<div>");
			H.push(this._composePiedTranche());
			H.push("</div>");
		}
		if (!this._options.grilleInverse && this._getAvecPiedHoraire()) {
			H.push("<div>", this._composePiedHoraire(), "</div>");
		}
		H.push("<div>");
		H.push(
			'<div id="' +
				this.ScrollV.getIdScroll() +
				'" style="padding-top:1px;min-height:',
			this.ScrollV.tailleMin + 'px;"></div>',
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_getLibelleTitreHoraire(aNumeroHoraire, aTitreFin) {
		const lBlocHoraire = this._options.blocHoraires.rechercheHoraire(
			aNumeroHoraire + (aTitreFin ? -1 : 0),
		);
		return this.getLibelleTitreHoraire(
			aNumeroHoraire - lBlocHoraire.debutBloc,
			aTitreFin,
		);
	}
	_getClasseTaillePoliceHeure(aPourHeure) {
		const lTaille = this.getTaillePoliceHeure(aPourHeure);
		if (lTaille > 0) {
			return "Texte" + lTaille;
		}
		return "";
	}
	_calculTailleCssHoraireEnColonne() {
		this._cache.tailleCssHoraireEnColonne = 10;
		this._cache.horaireEnColonneEnSuperposition = false;
		const lLargeur = [];
		const lNumeroHoraire = [];
		let lNbHorairesAffiches = 0;
		let lEtageHoraire = 0;
		let lLibelle;
		this._options.blocHoraires.parcourirHoraires(
			(aNumeroHoraire, aBlocHoraire, aIndexBloc) => {
				if (aIndexBloc > 0) {
					return false;
				}
				lLibelle = this._getLibelleTitreHoraire(aNumeroHoraire);
				if (lLibelle && lLibelle.trim().length > 0) {
					lNbHorairesAffiches += 1;
					if (this._options.nbAlternanceTitreColonnes > 1) {
						lEtageHoraire =
							(lNbHorairesAffiches - 1) %
							this._options.nbAlternanceTitreColonnes;
					} else {
						lEtageHoraire = 0;
					}
					if (
						lNumeroHoraire[lEtageHoraire] >= 0 &&
						lLargeur[lEtageHoraire] > 0
					) {
						if (
							(aNumeroHoraire - lNumeroHoraire[lEtageHoraire]) *
								this.largeurCellule <
							lLargeur[lEtageHoraire]
						) {
							this._cache.tailleCssHoraireEnColonne -= 1;
							if (this._cache.tailleCssHoraireEnColonne <= 8) {
								this._cache.horaireEnColonneEnSuperposition = true;
								return false;
							}
						}
					}
					lLargeur[lEtageHoraire] =
						ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
							lLibelle,
							this._cache.tailleCssHoraireEnColonne,
						);
					lNumeroHoraire[lEtageHoraire] = aNumeroHoraire;
				}
			},
		);
	}
	_getDecalageTitrePoliceLigne() {
		let lTaille = this.getTaillePoliceHeure(true);
		if (lTaille <= 0) {
			lTaille = 10;
		}
		return Math.floor((lTaille + 2) / 2);
	}
	_composeDecorateursBlocsHoraires(aHtml) {
		const H = [];
		let lLibelle, lTaille, lTailleTexte, lTailleGouttiere;
		if (
			this._options.avecDecorateurBlocHoraire &&
			(ObjetSupport_1.Support.avecSupportTransform ||
				this._options.grilleInverse)
		) {
			if (this._options.grilleInverse) {
				H.push(
					'<div class="NoWrap PetitEspaceBas" style="',
					ObjetStyle_1.GStyle.composeHeight(
						this._options.tailleDecorateurBlocHoraire,
					),
					'">',
				);
			} else {
				H.push(
					'<div class="InlineBlock AlignementHaut" style="',
					ObjetStyle_1.GStyle.composeWidth(
						this._options.tailleDecorateurBlocHoraire,
					),
					'">',
				);
			}
			this._options.blocHoraires.parcourirBlocs((aBlocHoraire) => {
				lTaille =
					this.getTailleHoraire() *
						(aBlocHoraire.fin - aBlocHoraire.debut + 1) +
					1;
				const lStyleDeco =
					"overflow:hidden;" +
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.moyen1);
				let lTailleDispoLibelle = lTaille;
				if (this._options.grilleInverse) {
					H.push(
						'<div class="InlineBlock AlignementMilieu NoWrap" style="',
						lStyleDeco,
						ObjetStyle_1.GStyle.composeHeight(
							this._options.tailleDecorateurBlocHoraire,
						),
						ObjetStyle_1.GStyle.composeWidth(lTaille),
						'">',
					);
				} else {
					H.push(
						'<div style="position:relative;',
						lStyleDeco,
						ObjetStyle_1.GStyle.composeWidth(
							this._options.tailleDecorateurBlocHoraire,
						),
						ObjetStyle_1.GStyle.composeHeight(lTaille),
						'">',
					);
				}
				lLibelle = "";
				if (this._options.grilleInverse) {
					let lLibelleHoraire;
					const lLineHeight =
						"line-height:" + this._options.tailleDecorateurBlocHoraire + "px;";
					if (!this._options.titresHorairesParSequence) {
						lLibelleHoraire = this._getLibelleTitreHoraire(aBlocHoraire.debut);
						if (lLibelleHoraire) {
							H.push(
								'<div class="Gras InlineBlock AlignementBas" style="',
								lLineHeight,
								'">',
								ObjetChaine_1.GChaine.insecable(lLibelleHoraire),
								"</div>",
							);
							lTailleDispoLibelle -=
								ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
									lLibelleHoraire,
									10,
									true,
								) + 3;
						}
						lLibelleHoraire = this._getLibelleTitreHoraire(
							aBlocHoraire.fin + 1,
							true,
						);
						if (lLibelleHoraire) {
							lTailleDispoLibelle -=
								ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
									lLibelleHoraire,
									10,
									true,
								) + 3;
						}
					}
					if (this._options.getLibelleBlocHoraire) {
						lLibelle = this._options.getLibelleBlocHoraire.call(
							this,
							aBlocHoraire,
							lTailleDispoLibelle,
						);
					}
					H.push(
						'<div ie-ellipsis class="Titre_Jours_Grille InlineBlock AlignementBas" style="',
						ObjetStyle_1.GStyle.composeWidth(Math.max(1, lTailleDispoLibelle)),
						lLineHeight,
						'">',
						ObjetChaine_1.GChaine.insecable(lLibelle),
						"</div>",
					);
					if (lLibelleHoraire) {
						H.push(
							'<div class="Gras InlineBlock AlignementBas" style="',
							lLineHeight,
							'">',
							ObjetChaine_1.GChaine.insecable(lLibelleHoraire),
							"</div>",
						);
					}
				} else {
					if (this._options.getLibelleBlocHoraire) {
						lLibelle = this._options.getLibelleBlocHoraire.call(
							this,
							aBlocHoraire,
							lTaille,
						);
					}
					lTailleTexte = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
						lLibelle,
						10,
						true,
					);
					H.push(
						'<div class="Titre_Jours_Grille" style="position:absolute; left:1px; top:',
						Math.round(lTaille / 2 + lTailleTexte / 2),
						'px;">',
						ObjetChaine_1.GChaine.insecable(lLibelle),
						"</div>",
					);
				}
				H.push("</div>");
				lTailleGouttiere = this._options.blocHoraires.rechercheHoraire(
					aBlocHoraire.fin,
				).tailleGouttiere;
				if (lTailleGouttiere) {
					if (this._options.grilleInverse) {
						H.push(
							'<div class="InlineBlock" style="' +
								ObjetStyle_1.GStyle.composeWidth(lTailleGouttiere) +
								'"></div>',
						);
					} else {
						H.push(
							'<div style="' +
								ObjetStyle_1.GStyle.composeHeight(lTailleGouttiere) +
								'"></div>',
						);
					}
				}
			});
			H.push("</div>");
			if (this._options.grilleInverse) {
				H.push('<div class="InlineBlock AlignementMilieuVertical NoWrap">');
			} else {
				H.push(
					'<div class="InlineBlock AlignementHaut" style="',
					ObjetStyle_1.GStyle.composeWidth(
						this.getLargeurTitreLibellesLignes(),
					),
					'">',
				);
			}
			H.push(aHtml);
			H.push("</div>");
			return H.join("");
		} else {
			return aHtml;
		}
	}
	_composeTitreLignes() {
		const H = [];
		let lLargeur = this.getLargeurTitreLignes();
		H.push(
			'<div id="',
			this.ScrollV.getIdZone(EZoneScroll.TitreLignes),
			'" style="overflow:hidden;">',
		);
		H.push(
			'<div id="' +
				this.ScrollV.getIdContenu(EZoneScroll.TitreLignes) +
				'" style="position:relative; ',
			ObjetStyle_1.GStyle.composeWidth(lLargeur),
			'">',
		);
		if (this._options.grilleInverse) {
			const lAvecDecorateur = !!this._options.getLibelleDecorateurBlocTranche;
			const lEcartDecorateur = 3;
			if (lAvecDecorateur) {
				lLargeur +=
					-this._options.tailleDecorateurBlocTranche - lEcartDecorateur;
				H.push(
					this._composeDecorateurBlocTrancheDeGrille(
						"bottom:" + -this._options.tailleDecorateurBlocTranche + "px;",
					),
				);
			}
			const lFormatTitreColonnes = this.getFormatTitreTrancheEnColonnes(
					this._options.tranches.count(),
					lLargeur,
				),
				lPaddingRight = 2;
			this._options.tranches.parcourir((aNumeroTranche, aTranche) => {
				H.push(
					'<div id="',
					this._cache.idTitreTranche + aNumeroTranche,
					'" class="WhiteSpaceNormal AlignementMilieuVertical" style="',
					ObjetStyle_1.GStyle.composeWidth(lLargeur),
					ObjetStyle_1.GStyle.composeHeight(this.hauteurCellule),
					lAvecDecorateur
						? "padding-left:" +
								(this._options.tailleDecorateurBlocTranche + lEcartDecorateur) +
								"px;"
						: "",
					"line-height:",
					this.hauteurCellule,
					"px; position:relative; padding-right:",
					lPaddingRight,
					'px;">',
					this._options.getLibelleTranche
						? this._options.getLibelleTranche.call(this, {
								numeroTranche: aNumeroTranche,
								tranche: aTranche,
								width: lLargeur - lPaddingRight,
								format: lFormatTitreColonnes,
							})
						: this.composeTitresTranches(
								aNumeroTranche,
								lLargeur - lPaddingRight,
								lFormatTitreColonnes,
							),
					"</div>",
				);
				const lGouttiere =
					this._options.tranches.getTailleGouttiere(aNumeroTranche);
				if (lGouttiere) {
					H.push('<div style="height:' + lGouttiere + 'px;"></div>');
				}
			});
		} else {
			H.push(this.composeTitresHoraires());
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeGrille() {
		const H = [];
		this._cache.classCursorSurvolEnCours = "";
		H.push(
			'<div id="',
			this.ScrollV.getIdZone(EZoneScroll.Grille),
			'" style="overflow:hidden;',
			ObjetStyle_1.GStyle.composeCouleurBordure(this.getCouleurBordures()),
			'">',
		);
		H.push(
			'<div id="' +
				this.ScrollV.getIdContenu(EZoneScroll.Grille) +
				'" style="position:relative;"',
			' ie-node="getNodeConteneurGrille"',
			this._options.ieClassConteneurGrille
				? ' ie-class="' + this._options.ieClassConteneurGrille + '"'
				: "",
			">",
		);
		const lWidth = this.getPositionLeftDeColonne(Number.MAX_VALUE);
		const lHeight = this.getPositionTopDeLigne(Number.MAX_VALUE);
		H.push(
			'<div id="' + this.idConteneurAbsGrille + '" class="conteneurAbs">',
			'<div id="',
			this.idGabaritGrille,
			'"></div>',
			this._composeCalques(lWidth, lHeight),
			"</div>",
		);
		H.push(
			IE.jsx.str("div", {
				id: this.IdCellulePrefixe,
				"ie-node": "getNodeGrilleInterne",
				"ie-class": "getClassGrille",
				class: "SansSelectionTexte",
				style:
					ObjetStyle_1.GStyle.composeWidth(lWidth - 1) +
					ObjetStyle_1.GStyle.composeHeight(lHeight - 1),
			}),
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeFondTrancheBlocHoraireCalque(
		aNumeroTranche,
		aBlocHoraire,
		aNumeroHoraire,
	) {
		const lHtml = this.composeFondTrancheBlocHoraire(
			aNumeroTranche,
			aBlocHoraire,
			aNumeroHoraire,
		);
		if (lHtml) {
			const lPlace = this.getPlaceDeTrancheHoraire({
				tranche: aNumeroTranche,
				horaire: aBlocHoraire.debut,
			});
			const lCoordonnes = this.getCoordonneesDePlace(lPlace);
			const lTailles = this.getTaillesDePositionGrille({
				nbTranches: 1,
				nbHoraires: aBlocHoraire.fin - aBlocHoraire.debut + 1,
			});
			return [
				'<div class="FondTrancheBlocHoraire" style="left:' + lCoordonnes.left,
				"px;top:",
				lCoordonnes.top,
				"px;width:",
				lTailles.width,
				"px;height:",
				lTailles.height,
				'px;">' + lHtml + "</div>",
			].join("");
		}
		return "";
	}
	_composeFondTranches() {
		const H = ['<div class="calqueFondTranchesHtml" aria-hidden="true">'];
		this._options.tranches.parcourir((aNumeroTranche) => {
			const lHtmlBloc = [];
			this._options.blocHoraires.parcourirBlocs((aBlocHoraire) => {
				lHtmlBloc.push(
					this._composeFondTrancheBlocHoraireCalque(
						aNumeroTranche,
						aBlocHoraire,
						aBlocHoraire.debut,
					),
				);
			});
			H.push(lHtmlBloc.join(""));
		});
		H.push("</div>");
		return H.join("");
	}
	_composeContenuHtmlCellules() {
		const H = ['<div class="calqueContenusHtml">'];
		this._options.tranches.parcourir((aNumeroTranche) => {
			this._options.blocHoraires.parcourirHoraires((aNumeroHoraire) => {
				const lPlace = this.getPlaceDeTrancheHoraire({
					tranche: aNumeroTranche,
					horaire: aNumeroHoraire,
				});
				const lParams = Object.assign(
					{ place: lPlace },
					this.getCoordonneesDePlace(lPlace),
					this.getTaillesDePositionGrille(),
				);
				const lContenuCellule = this.getContenuHtmlCellule(lPlace, lParams);
				if (lContenuCellule) {
					H.push(lContenuCellule);
				}
			});
		});
		H.push("</div>");
		return H.join("");
	}
	_composeCalques(aWidth, aHeight) {
		const H = [];
		const lWidthZone =
			this._estModeTactile() && !this._options.avecScrollEnTactileH
				? aWidth
				: Math.min(aWidth, this._getTailleZone(false));
		const lHeightZone =
			this._estModeTactile() && !this._options.avecScrollEnTactileV
				? aHeight
				: Math.min(aHeight, this._getTailleZone(true));
		this._cache.canvasPartiel = aWidth > lWidthZone || aHeight > lHeightZone;
		this._cache.positionCanvasPartiel = {
			left: 0,
			top: 0,
			widthZone: lWidthZone,
			heightZone: lHeightZone,
			widthTot: aWidth,
			heightTot: aHeight,
		};
		this._cache.commandesCanvas = [];
		this._cache.canvasScaleX = 1;
		this._cache.canvasScaleY = 1;
		let lWidth = lWidthZone;
		let lHeight = lHeightZone;
		if (lWidthZone * lHeightZone > this._options.surfaceMaxCanvas) {
			const lScale =
				(lWidthZone * lHeightZone) / this._options.surfaceMaxCanvas;
			lWidth = Math.floor(lWidthZone / lScale);
			lHeight = Math.floor(lHeightZone / lScale);
			this._cache.canvasScaleX = lWidthZone / lWidth;
			this._cache.canvasScaleY = lHeightZone / lHeight;
		}
		const lGetCanvas = (aGenre) => {
			return [
				'<canvas id="',
				this._cache.id + aGenre,
				'" width="',
				lWidth,
				'" height="',
				lHeight,
				'" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidth),
				ObjetStyle_1.GStyle.composeHeight(lHeight),
				'"',
				ObjetHtml_1.GHtml.composeAttr("ie-node", "nodeCanvasCalque", [
					aGenre,
					lWidth,
					lHeight,
				]),
				"></canvas>",
			].join("");
		};
		H.push(
			lGetCanvas.call(this, _ObjetGrille.calque.fond),
			this._composeFondTranches(),
			this._composeContenuHtmlCellules(),
			lGetCanvas.call(this, _ObjetGrille.calque.quadrillage),
			this._composeContenuAbolueDansGrille(),
		);
		return H.join("");
	}
	_getAvecPiedTranche() {
		if (
			this._cache.avecPiedTranche !== true &&
			this._cache.avecPiedTranche !== false
		) {
			if (
				MethodesObjet_1.MethodesObjet.isFunction(this._options.avecPiedTranche)
			) {
				this._cache.avecPiedTranche = this._options.avecPiedTranche();
			} else {
				this._cache.avecPiedTranche = !!this._options.avecPiedTranche;
			}
		}
		if (
			(!this._options.grilleInverse && !this._options.taillePiedTranche) ||
			(this._options.grilleInverse && !this._options.taillePiedTrancheInverse)
		) {
			return false;
		}
		return this._cache.avecPiedTranche;
	}
	_composePiedTranche() {
		const H = [];
		const lNbTranches = this._options.tranches.count();
		const lEstGrilleInverse = this._options.grilleInverse;
		const lIdScroll = lEstGrilleInverse
			? EZoneScroll.PiedTrancheInverse
			: EZoneScroll.PiedTranche;
		let lITranche;
		if (!this._options.grilleInverse) {
			H.push(
				'<div class="PiedTrancheNonInverse" style="',
				ObjetStyle_1.GStyle.composeHeight(this._options.taillePiedTranche),
				'">',
			);
			const lLargeur = this.getLargeurTitreLignes();
			H.push('<div style="', ObjetStyle_1.GStyle.composeWidth(lLargeur), '">');
			H.push(this.composeTitreHorairePiedTranche());
			H.push("</div>");
		}
		H.push(
			'<div id="',
			this.ScrollV.getIdZone(lIdScroll),
			'" class="PiedTrancheScroll" style="',
			lEstGrilleInverse
				? ObjetStyle_1.GStyle.composeWidth(
						this._options.taillePiedTrancheInverse,
					)
				: ObjetStyle_1.GStyle.composeHeight(this._options.taillePiedTranche),
			'">',
		);
		H.push(
			'<div id="' +
				this.ScrollV.getIdContenu(lIdScroll) +
				'" style="position:relative;">',
		);
		H.push(
			'<div class="PiedTrancheContenu" style="',
			lEstGrilleInverse
				? ObjetStyle_1.GStyle.composeHeight(this.hauteurCellule * lNbTranches)
				: ObjetStyle_1.GStyle.composeWidth(this.largeurCellule * lNbTranches),
			'">',
		);
		H.push(
			'<div role="list" id="',
			this._cache.idPiedTrancheConteneurAbs,
			'" style="position:absolute" class="ObjetGrilleCours"></div>',
		);
		if (this.composeContenuPiedTranche) {
			for (lITranche = 0; lITranche < lNbTranches; lITranche++) {
				H.push(
					'<div class="AlignementMilieu" style="',
					lEstGrilleInverse
						? ObjetStyle_1.GStyle.composeHeight(this.hauteurCellule)
						: ObjetStyle_1.GStyle.composeWidth(this.largeurCellule),
					'position:relative;">',
					this.composeContenuPiedTranche({
						numeroTranche: lITranche,
						derniereTranche: lITranche === lNbTranches - 1,
					}),
					"</div>",
				);
				const lGouttiere = this._options.tranches.getTailleGouttiere(lITranche);
				if (lGouttiere) {
					H.push('<div style="width:' + lGouttiere + 'px;"></div>');
				}
			}
		}
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		if (!this._options.grilleInverse) {
			H.push("</div>");
		}
		return H.join("");
	}
	_getAvecPiedHoraire() {
		if (
			this._cache.avecPiedHoraire !== true &&
			this._cache.avecPiedHoraire !== false
		) {
			if (
				MethodesObjet_1.MethodesObjet.isFunction(this._options.avecPiedHoraire)
			) {
				this._cache.avecPiedHoraire = this._options.avecPiedHoraire();
			} else {
				this._cache.avecPiedHoraire = !!this._options.avecPiedHoraire;
			}
		}
		if (!this._options.taillePiedHoraire) {
			return false;
		}
		return this._cache.avecPiedHoraire;
	}
	_composePiedHoraire() {
		const H = [];
		const lEstGrilleInverse = this._options.grilleInverse;
		const lIdScroll = lEstGrilleInverse
			? EZoneScroll.PiedHoraireInverse
			: EZoneScroll.PiedHoraire;
		H.push(
			'<div id="',
			this.ScrollV.getIdZone(lIdScroll),
			'" class="PiedHoraireScroll" style="',
			!lEstGrilleInverse
				? ObjetStyle_1.GStyle.composeWidth(this._options.taillePiedHoraire)
				: ObjetStyle_1.GStyle.composeHeight(this._options.taillePiedHoraire) +
						"margin-left:" +
						this.getLargeurTitreLignes() +
						"px;",
			'">',
		);
		H.push(
			'<div id="' +
				this.ScrollV.getIdContenu(lIdScroll) +
				'" class="PiedHoraireContenu" style="',
			lEstGrilleInverse
				? ObjetStyle_1.GStyle.composeHeight(this._options.taillePiedHoraire)
				: ObjetStyle_1.GStyle.composeWidth(this._options.taillePiedHoraire),
			'">',
		);
		const lHtml = this.composeContenuPiedHoraire();
		if (lHtml) {
			H.push(lHtml);
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composePied() {
		const H = [];
		if (!this._options.grilleInverse) {
			H.push(
				IE.jsx.str("div", {
					id: this._cache.idLigneTitreHoraire_Fin,
					"aria-hidden": "true",
					class: "WhiteSpaceNormal AlignementHaut",
					style:
						"height:0px;" +
						ObjetStyle_1.GStyle.composeWidth(this.getLargeurTitreLignes()) +
						"position:relative;",
				}),
			);
		}
		if (!this._options.grilleInverse && this._getAvecPiedTranche()) {
			H.push(this._composePiedTranche());
		}
		if (this._options.grilleInverse && this._getAvecPiedHoraire()) {
			H.push(this._composePiedHoraire());
		}
		H.push(
			'<div id="',
			this._cache.idLignePied,
			'" class="piedScroll" style="',
			ObjetStyle_1.GStyle.composeHeight(
				this._cache.scrollHVisible
					? GNavigateur.getLargeurBarreDeScroll()
					: this._options.hauteurBasGrilleSansScroll,
			),
			'">',
		);
		H.push(
			'<div class="InlineBlock WhiteSpaceNormal AlignementHaut" style="height:0px; ',
			ObjetStyle_1.GStyle.composeWidth(this.getLargeurTitreLignes()),
			' position:relative;">',
		);
		H.push("</div>");
		H.push('<div class="InlineBlock WhiteSpaceNormal AlignementHaut">');
		H.push('<div id="' + this.ScrollH.getIdScroll() + '"></div>');
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_actualiserLibellesHeure(aHoraireScroll, aScrollEcart) {
		let H, lLibelle;
		if (this._options.desactiverTitreHorairesDebutFin) {
			return;
		}
		if (this._options.titresHorairesParSequence) {
			return;
		}
		if (!MethodesObjet_1.MethodesObjet.isNumber(aHoraireScroll)) {
			const lBlocHoraire = this._options.blocHoraires.horaires[0];
			if (lBlocHoraire) {
				aHoraireScroll = lBlocHoraire.debut;
			}
		}
		const lHauteurDecalagePolice = this._getDecalageTitrePoliceLigne();
		const lTaillePolice = this.getTaillePoliceHeure();
		aHoraireScroll = Math.max(0, aHoraireScroll);
		let lHoraireMax;
		const lBlocHoraireDernier =
			this._options.blocHoraires.horaires[
				this._options.blocHoraires.horaires.length - 1
			];
		if (lBlocHoraireDernier) {
			lHoraireMax = lBlocHoraireDernier.fin + 1;
		} else {
			lHoraireMax =
				aHoraireScroll + this._options.blocHoraires.nbHorairesVisibles();
		}
		aHoraireScroll = Math.min(aHoraireScroll, lHoraireMax);
		const lJPremierLibelle = $(
			"#" + this._cache.idLigneTitreHoraire_Debut.escapeJQ(),
		);
		if (this._avecTitreLibelleHoraire(aHoraireScroll)) {
			H = [];
			lLibelle = this._getLibelleTitreHoraire(aHoraireScroll);
			if (this._options.grilleInverse) {
				H.push(
					'<div class="AlignementGauche ',
					this._getClassTitreHoraireDHoraire(aHoraireScroll),
					'"',
					' style="',
					ObjetStyle_1.GStyle.composeCouleurTexte(
						this._options.couleurLibellesColonnes,
					),
					" position:relative; left:",
					this.getLargeurTitreLignes() -
						Math.round(
							ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
								lLibelle,
								lTaillePolice,
							) / 2,
						),
					"px;",
					" top:",
					Math.floor(
						this.getHauteurTitreColonnes() / 2 - lHauteurDecalagePolice,
					),
					"px;",
					'">',
					ObjetChaine_1.GChaine.avecEspaceSiVide(lLibelle),
					"</div>",
				);
			} else {
				H.push(
					'<div class="AlignementDroit PetitEspaceDroit ',
					this._getClassTitreHoraireDHoraire(aHoraireScroll),
					'"',
					' style="',
					ObjetStyle_1.GStyle.composeCouleurTexte(
						this._options.couleurLibellesColonnes,
					),
					ObjetStyle_1.GStyle.composeHeight(this._options.tailleMINPasHoraire),
					" position:relative; top:",
					this.getHauteurTitreColonnes() - lHauteurDecalagePolice + 1,
					'px;">',
					ObjetChaine_1.GChaine.avecEspaceSiVide(lLibelle),
					"</div>",
				);
			}
			lJPremierLibelle.html(H.join(""));
		} else {
			lJPremierLibelle.html("");
		}
		const lJDernierLibelle = $(
				"#" + this._cache.idLigneTitreHoraire_Fin.escapeJQ(),
			),
			lDernierHoraireVisible = Math.min(
				Math.min(
					lHoraireMax,
					this.getNumeroHoraireDePositionHoraire(
						aScrollEcart +
							(this._options.grilleInverse
								? ObjetPosition_1.GPosition.getWidth(
										this.ScrollH.getIdZone(EZoneScroll.Grille),
									)
								: ObjetPosition_1.GPosition.getHeight(
										this.ScrollV.getIdZone(EZoneScroll.Grille),
									)),
					),
				),
				this._options.blocHoraires.nbHoraires(),
			);
		if (this._avecTitreLibelleHoraire(lDernierHoraireVisible, true)) {
			H = [];
			lLibelle = this._getLibelleTitreHoraire(lDernierHoraireVisible, true);
			H.push(
				'<div class="AlignementDroit PetitEspaceDroit ',
				this._getClassTitreHoraireDHoraire(lDernierHoraireVisible),
				'" style="',
				ObjetStyle_1.GStyle.composeCouleurTexte(
					this._options.couleurLibellesColonnes,
				),
				ObjetStyle_1.GStyle.composeHeight(this._options.tailleMINPasHoraire),
				this._options.grilleInverse
					? "position:absolute; left:" +
							-Math.round(
								ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
									lLibelle,
									lTaillePolice,
								) / 2,
							) +
							"px;" +
							" top:" +
							Math.floor(
								this.getHauteurTitreColonnes() / 2 - lHauteurDecalagePolice,
							) +
							"px;"
					: "position:relative; top:" + (-lHauteurDecalagePolice - 1) + "px;",
				'">',
				ObjetChaine_1.GChaine.avecEspaceSiVide(lLibelle),
				"</div>",
			);
			lJDernierLibelle.html(H.join(""));
		} else {
			lJDernierLibelle.html("");
		}
		this._options.blocHoraires.parcourirHoraires((aNumeroHoraire) => {
			const lId = this._cache.idLigneTitreG + "_" + aNumeroHoraire;
			if (
				aNumeroHoraire > aHoraireScroll &&
				aNumeroHoraire < lDernierHoraireVisible
			) {
				ObjetStyle_1.GStyle.setVisible(lId, true);
			} else {
				ObjetStyle_1.GStyle.setVisible(lId, false);
			}
		});
	}
	_estTrancheHoraireVisible(aTrancheHoraire) {
		if (!aTrancheHoraire) {
			return false;
		}
		if (
			!(
				aTrancheHoraire.tranche >= 0 &&
				aTrancheHoraire.tranche < this._options.tranches.count()
			)
		) {
			return false;
		}
		if (
			!this._options.blocHoraires.rechercheHoraire(aTrancheHoraire.horaire)
				.trouve
		) {
			return false;
		}
		return true;
	}
	_traceCanvasQuadrillageTraitHoraire(aParam) {
		const lContext = this._cache.contextCanvas[_ObjetGrille.calque.quadrillage];
		if (!lContext) {
			return;
		}
		const lCouleur = this._getCouleurPourCanvas(lContext, aParam.couleur);
		const lRGB = UtilitaireCouleur_1.UtilitaireCouleur.couleurToRGB(lCouleur);
		const lFillStyle =
			"rgba(" +
			lRGB.r +
			"," +
			lRGB.g +
			"," +
			lRGB.b +
			"," +
			aParam.opacite +
			")";
		this._options.tranches.parcourir((aNumeroTranche) => {
			if (
				aParam.numeroTranche >= 0 &&
				aParam.numeroTranche !== aNumeroTranche
			) {
				return;
			}
			this._options.blocHoraires.parcourirHoraires(
				(aNumeroHoraire, aBlocHoraire) => {
					if (
						aParam.numeroBlocHoraire >= 0 &&
						aParam.numeroBlocHoraire !== aBlocHoraire.indiceBloc
					) {
						return;
					}
					let lEstDernierHoraire = false;
					if (
						aNumeroHoraire === aBlocHoraire.fin &&
						aNumeroHoraire + 1 === aParam.place
					) {
						lEstDernierHoraire = true;
					} else if (aNumeroHoraire !== aParam.place) {
						return;
					}
					const lPlace = this.getPlaceDeTrancheHoraire({
						tranche: aNumeroTranche,
						horaire: lEstDernierHoraire ? aParam.place - 1 : aParam.place,
					});
					const lCoords = this.getCoordonneesDePlace(lPlace);
					if (
						aParam.place > aBlocHoraire.debut &&
						aParam.place <= aBlocHoraire.fin + 1
					) {
						if (this._options.grilleInverse) {
							this._fillRect({
								context: lContext,
								fillStyle: lFillStyle,
								left: lEstDernierHoraire ? lCoords.right - 1 : lCoords.left - 2,
								top: lCoords.top,
								width: 1,
								height: lCoords.bottom - lCoords.top + 1,
							});
						} else {
							this._fillRect({
								context: lContext,
								fillStyle: lFillStyle,
								left: lCoords.left,
								top: lEstDernierHoraire ? lCoords.bottom - 1 : lCoords.top - 2,
								width: lCoords.right - lCoords.left + 1,
								height: 1,
							});
						}
					}
					if (
						!lEstDernierHoraire &&
						(aParam.afficherDoubleTrait || aParam.place === aBlocHoraire.debut)
					) {
						if (this._options.grilleInverse) {
							this._fillRect({
								context: lContext,
								fillStyle: lFillStyle,
								left: lCoords.left,
								top: lCoords.top,
								width: 1,
								height: lCoords.bottom - lCoords.top + 1,
							});
						} else {
							this._fillRect({
								context: lContext,
								fillStyle: lFillStyle,
								left: lCoords.left,
								top: lCoords.top,
								width: lCoords.right - lCoords.left + 1,
								height: 1,
							});
						}
					}
				},
			);
		});
	}
	_construireTraitsHoraire() {
		if (!this._cache.traitsHoraires) {
			this._cache.traitsHoraires = [];
		}
		if (
			this._options.traitsHoraires &&
			this._options.traitsHoraires.length > 0
		) {
			this._cache.traitsHoraires = this._cache.traitsHoraires.concat(
				this._options.traitsHoraires,
			);
		}
		if (
			!this._cache.traitsHoraires ||
			this._cache.traitsHoraires.length === 0
		) {
			return;
		}
		this._cache.traitsHoraires.forEach((aTrait) => {
			const lTrait = Object.assign(
				{
					place: -1,
					couleur: "red",
					opacite: 0.7,
					afficherDoubleTrait: true,
					zIndex: 1,
					numeroTranche: -1,
					numeroBlocHoraire: -1,
				},
				aTrait,
			);
			this._traceCanvasQuadrillageTraitHoraire(lTrait);
		});
	}
	_getCouleurPourCanvas(aContextCanvas, aCouleur) {
		if (!this._cache.couleursVarCss) {
			this._cache.couleursVarCss = {};
		}
		if (this._cache.couleursVarCss[aCouleur]) {
			return this._cache.couleursVarCss[aCouleur];
		}
		if (
			aCouleur &&
			aContextCanvas &&
			aContextCanvas.canvas &&
			aCouleur.startsWith &&
			aCouleur.startsWith("var(--")
		) {
			let lCouleur_temp = aCouleur.replace(/var\((--.*)\)/gi, "$1");
			if (lCouleur_temp.startsWith("--")) {
				lCouleur_temp = ObjetStyle_1.GStyle.getComputedValue(
					aContextCanvas.canvas,
					lCouleur_temp,
				);
				if (
					lCouleur_temp &&
					lCouleur_temp.trim &&
					lCouleur_temp.trim().startsWith("#")
				) {
					lCouleur_temp = lCouleur_temp.trim();
					this._cache.couleursVarCss[aCouleur] = lCouleur_temp;
					return lCouleur_temp;
				}
			}
		}
		return aCouleur;
	}
}
exports._ObjetGrille = _ObjetGrille;
(function (_ObjetGrille) {
	let calque;
	(function (calque) {
		calque["fond"] = "fond";
		calque["quadrillage"] = "quadrillage";
	})((calque = _ObjetGrille.calque || (_ObjetGrille.calque = {})));
	let separateurLigne;
	(function (separateurLigne) {
		separateurLigne[(separateurLigne["vide"] = 3)] = "vide";
		separateurLigne[(separateurLigne["petit"] = 2)] = "petit";
		separateurLigne[(separateurLigne["moyen"] = 1)] = "moyen";
		separateurLigne[(separateurLigne["plein"] = 0)] = "plein";
	})(
		(separateurLigne =
			_ObjetGrille.separateurLigne || (_ObjetGrille.separateurLigne = {})),
	);
})(_ObjetGrille || (exports._ObjetGrille = _ObjetGrille = {}));
var EZoneScroll;
(function (EZoneScroll) {
	EZoneScroll["TitreHaut"] = "TitreHaut";
	EZoneScroll["TitreLignes"] = "TitreLignes";
	EZoneScroll["Grille"] = "Grille";
	EZoneScroll["PiedTranche"] = "PiedTranche";
	EZoneScroll["PiedTrancheInverse"] = "PiedTrancheInverse";
	EZoneScroll["PiedHoraire"] = "PiedHoraire";
	EZoneScroll["PiedHoraireInverse"] = "PiedHoraireInverse";
})(EZoneScroll || (EZoneScroll = {}));

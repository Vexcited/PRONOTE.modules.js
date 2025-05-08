const IEHtml = require("IEHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetScroll_1 = require("ObjetScroll");
const ObjetScroll_2 = require("ObjetScroll");
const ObjetScroll_3 = require("ObjetScroll");
const MethodesObjet_1 = require("MethodesObjet");
const UtilitaireResizeObserver_1 = require("UtilitaireResizeObserver");
const ObjetIdentite_1 = require("ObjetIdentite");
IEHtml.addAttribut(
	"ie-scroll",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		const lValue = _creerScroll(
			aContexteCourant,
			aAttributValue,
			aOutils,
			true,
			true,
		);
		return lValue;
	},
);
IEHtml.addAttribut(
	"ie-scrollv",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		const lValue = _creerScroll(
			aContexteCourant,
			aAttributValue,
			aOutils,
			true,
			false,
		);
		return lValue;
	},
);
IEHtml.addAttribut(
	"ie-scrollh",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		const lValue = _creerScroll(
			aContexteCourant,
			aAttributValue,
			aOutils,
			false,
			true,
		);
		return lValue;
	},
);
function _creerScroll(
	aContexteCourant,
	aAttributValue,
	aOutils,
	aAvecScrollV,
	aAvecScrollH,
) {
	if (!aContexteCourant.controleur) {
		return true;
	}
	let lReserverPlaceScrollVisible = false;
	if (aContexteCourant.node.hasAttribute("ie-scrollReservation")) {
		lReserverPlaceScrollVisible = true;
		aContexteCourant.node.removeAttribute("ie-scrollReservation");
	}
	let lReserverPlaceScrollFixe = false;
	if (aContexteCourant.node.hasAttribute("ie-scrollReservationFixe")) {
		lReserverPlaceScrollFixe = true;
		aContexteCourant.node.removeAttribute("ie-scrollReservationFixe");
	}
	aOutils.addCommentaireDebug(
		aContexteCourant.node,
		"ie-scroll" +
			(!aAvecScrollV ? (!aAvecScrollH ? "" : "h") : "v") +
			(aAttributValue ? '="' + aAttributValue + '"' : "") +
			(lReserverPlaceScrollVisible ? " ie-scrollReservation" : "") +
			(lReserverPlaceScrollFixe ? " ie-scrollReservationFixe" : ""),
	);
	const lNom = aAttributValue;
	let lInfosCallback = null;
	let lInstanceV;
	let lInstanceH;
	let lJNode;
	let lBoucheTrou;
	const lApi = {
		avecScrollV: aAvecScrollV,
		avecScrollH: aAvecScrollH,
		tailleScroll: 11,
		heightContenuMinZone: false,
		reserverPlaceScrollVisible: lReserverPlaceScrollVisible,
		reserverPlaceScrollFixe: lReserverPlaceScrollFixe,
		couleurBoucheTrou: GCouleur.themeNeutre.legere,
		decalageScrollH: 1,
		decalageScrollV: 1,
		avecResizeObserver: true,
		avecRefresh: true,
		actualiser: _actualiser,
		scrollToElement: _scrollToElement,
		surRefresh: null,
		resizeEnCours: false,
		surResize: function () {
			if (!lApi.resizeEnCours) {
				_surPreResize();
				_surPostResize();
			}
		},
		surPreResize: _surPreResize,
		surPostResize: _surPostResize,
		scrollV: null,
		scrollH: null,
		scrollsVisible: { v: false, h: false },
		zone: null,
		heightZone: 0,
		heightContenu: 0,
		widthZone: 0,
		widthContenu: 0,
	};
	if (lNom) {
		lInfosCallback = aOutils.getAccesParametres(lNom, aContexteCourant);
		if (!lInfosCallback.estFonction) {
			return true;
		}
		lInfosCallback.callback([lApi]);
	}
	lJNode = $(aContexteCourant.node);
	lJNode.wrapInner('<div role="presentation">');
	let lZone = lJNode.get(0).firstChild;
	lApi.zone = lZone;
	if (!lZone) {
		return true;
	}
	const lContenu = lZone.firstChild;
	lBoucheTrou = null;
	if (!lContenu) {
		return true;
	}
	let lPere = {};
	let lLargeur;
	if (lApi.avecScrollV) {
		lInstanceV = ObjetIdentite_1.Identite.creerInstance(
			ObjetScroll_1.ObjetScroll,
			{
				pere: lPere,
				evenement: function (aGenre, aScrollTop) {
					switch (aGenre) {
						case ObjetScroll_3.EGenreScrollEvenement.Deplacement:
							return aScrollTop;
						case ObjetScroll_3.EGenreScrollEvenement.TailleZone:
							return (
								lApi.heightZone +
								(lApi.scrollsVisible.h && !lApi.reserverPlaceScrollFixe
									? -lLargeur
									: 0)
							);
						case ObjetScroll_3.EGenreScrollEvenement.TailleContenu:
							return lApi.heightContenu;
					}
				},
				genre: ObjetScroll_2.EGenreScroll.Vertical,
			},
		);
		lApi.scrollV = lInstanceV;
		lPere.Nom = "pere_" + lApi.scrollV.getNom();
		lApi.scrollV.pas = 30;
		lApi.scrollV.Largeur = lApi.tailleScroll;
		lApi.scrollV.avecScrollEnTactile = true;
	}
	if (lApi.avecScrollH) {
		lInstanceH = ObjetIdentite_1.Identite.creerInstance(
			ObjetScroll_1.ObjetScroll,
			{
				pere: lPere,
				evenement: function (aGenre, aScrollTop) {
					switch (aGenre) {
						case ObjetScroll_3.EGenreScrollEvenement.Deplacement:
							return aScrollTop;
						case ObjetScroll_3.EGenreScrollEvenement.TailleZone:
							return (
								lApi.widthZone +
								(lApi.scrollsVisible.v && !lApi.reserverPlaceScrollFixe
									? -lLargeur
									: 0)
							);
						case ObjetScroll_3.EGenreScrollEvenement.TailleContenu:
							return lApi.widthContenu;
					}
				},
				genre: ObjetScroll_2.EGenreScroll.Horizontal,
			},
		);
		lApi.scrollH = lInstanceH;
		lPere.Nom = "pere_" + lApi.scrollH.getNom();
		lApi.scrollH.pas = 30;
		lApi.scrollH.Largeur = lApi.tailleScroll;
		lApi.scrollH.avecScrollEnTactile = true;
	}
	lJNode.css({ position: "relative", overflow: "hidden" });
	const lCss = { overflow: "hidden", "box-sizing": "border-box" };
	if (lApi.reserverPlaceScrollFixe) {
		if (lApi.avecScrollV) {
			lCss["padding-right"] = lApi.tailleScroll;
		}
		if (lApi.avecScrollH) {
			lCss["padding-bottom"] = lApi.tailleScroll;
		}
		if (lApi.reserverPlaceScrollVisible) {
			lApi.reserverPlaceScrollVisible = false;
		}
	}
	$(lZone).css(lCss);
	const lJScroll = lJNode.find(
		"#" + (lApi.scrollV || lApi.scrollH).getNom().escapeJQ(),
	);
	lApi.DOMScroll = lJScroll.get(0);
	const lObjetCss = { "box-sizing": "border-box" };
	if (lApi.heightContenuMinZone) {
		lObjetCss.height = "100%";
	}
	$(lContenu).css(lObjetCss);
	lLargeur = (lApi.scrollV || lApi.scrollH).Largeur;
	let lBorderWidth = parseInt(lJNode.css("borderWidth") || "0", 10);
	if (lZone.id) {
		if (lApi.scrollV) {
			lApi.scrollV.getIdZone = function () {
				return lZone.id;
			};
		}
		if (lApi.scrollH) {
			lApi.scrollH.getIdZone = function () {
				return lZone.id;
			};
		}
	} else {
		lZone.id = (lApi.scrollV || lApi.scrollH).getIdZone(0);
	}
	if (lContenu.id) {
		if (lApi.scrollV) {
			lApi.scrollV.getIdContenu = function () {
				return lContenu.id;
			};
		}
		if (lApi.scrollH) {
			lApi.scrollH.getIdContenu = function () {
				return lContenu.id;
			};
		}
	} else {
		lContenu.id = (lApi.scrollV || lApi.scrollH).getIdContenu(0);
	}
	$(lZone).on("scroll", () => {
		if (lApi.scrollV) {
			lApi.scrollV.actualiser(0);
		}
		if (lApi.scrollH) {
			lApi.scrollH.actualiser(0);
		}
	});
	function _scrollToElement(aElement) {
		if (lApi.scrollV && lApi.scrollsVisible.v) {
			lApi.scrollV.scrollToElement(aElement);
		}
		if (lApi.scrollH && lApi.scrollsVisible.h) {
			lApi.scrollH.scrollToElement(aElement);
		}
	}
	function _actualiser() {
		const lForcerActualisation = _actualiserZone();
		_actualiserContenu(lForcerActualisation);
	}
	function _actualiserZone(aForcer) {
		const lHeight = lApi.avecScrollV ? lJNode.height() : 0,
			lWidth = lApi.avecScrollH ? lJNode.width() : 0;
		if (!aForcer && lHeight === lApi.heightZone && lWidth === lApi.widthZone) {
			return false;
		}
		lApi.heightZone = lHeight;
		lApi.widthZone = lWidth;
		if (lApi.avecScrollV) {
			$(lZone).height(lApi.heightZone);
		}
		if (lApi.avecScrollH) {
			$(lZone).width(lApi.widthZone);
		}
		return true;
	}
	function _actualiserContenu(aForcerActualisation) {
		const lHeight = lApi.avecScrollV ? _getHeightContenu() : 0;
		const lWidth = lApi.avecScrollH ? lContenu.scrollWidth : 0;
		let lScrollTop = -1;
		let lScrollLeft = -1;
		if (
			!aForcerActualisation &&
			lHeight === lApi.heightContenu &&
			lWidth === lApi.widthContenu
		) {
			return;
		}
		lApi.heightContenu = lHeight;
		lApi.widthContenu = lWidth;
		if (lApi.scrollsVisible.v) {
			lScrollTop = lZone.scrollTop;
			lApi.scrollV.setDonnees(0);
			$(lZone).height(lApi.heightZone);
			$("#" + lApi.scrollV.getIdScroll().escapeJQ()).remove();
			if (lApi.reserverPlaceScrollVisible) {
				$(lZone).css("padding-right", "");
			}
		}
		if (lApi.scrollsVisible.h) {
			lScrollLeft = $(lZone).scrollLeft();
			lApi.scrollH.setDonnees(0);
			$("#" + lApi.scrollH.getIdScroll().escapeJQ()).remove();
			if (lApi.reserverPlaceScrollVisible) {
				$(lZone).css("padding-bottom", "");
			}
		}
		if (lApi.avecScrollH) {
			$(lZone).width(lApi.widthZone);
		}
		if (lApi.avecScrollV) {
			$(lZone).height(lApi.heightZone);
		}
		if (lBoucheTrou) {
			$(lBoucheTrou).remove();
			lBoucheTrou = null;
		}
		_construireScrolls();
		if (lApi.scrollsVisible.v && lScrollTop >= 0) {
			lApi.scrollV.scrollTo(lScrollTop);
		}
		if (lApi.scrollsVisible.h && lScrollLeft >= 0) {
			lApi.scrollH.scrollTo(lScrollLeft);
		}
	}
	function _surPreResize() {
		lApi.resizeEnCours = true;
		const lCss = {
			position: "absolute",
			top: 0,
			left: 0,
			right: lApi.reserverPlaceScrollFixe ? lApi.tailleScroll + "px" : "",
			height: "",
			bottom: undefined,
		};
		if (lApi.heightContenuMinZone) {
			lCss.bottom = 0;
		}
		$(lContenu).css(lCss);
		$("#" + lZone.id.escapeJQ()).css({ height: "100%", width: "100%" });
		if (lApi.scrollsVisible.v) {
			$("#" + lApi.scrollV.getIdScroll().escapeJQ()).hide();
		}
		if (lApi.scrollsVisible.h) {
			$("#" + lApi.scrollH.getIdScroll().escapeJQ()).hide();
		}
	}
	function _actualiserHeightContenu() {
		if (lApi.heightContenuMinZone) {
			$(lContenu).height(lApi.scrollsVisible.v ? "" : "100%");
		}
	}
	function _surPostResize() {
		_actualiserZone(true);
		$("#" + lContenu.id.escapeJQ()).css({
			position: "",
			top: "",
			left: "",
			right: "",
			overflow: "",
			bottom: "",
		});
		if (lApi.scrollsVisible.v) {
			$("#" + lApi.scrollV.getIdScroll().escapeJQ()).show();
		}
		_actualiserHeightContenu();
		if (lApi.scrollsVisible.h) {
			$("#" + lApi.scrollH.getIdScroll().escapeJQ()).show();
		}
		_actualiserContenu(true);
		lApi.resizeEnCours = false;
	}
	function _construireScrolls() {
		lApi.scrollsVisible = _avecScroll();
		const lNbPixReservation = MethodesObjet_1.MethodesObjet.isNumber(
			lApi.reserverPlaceScrollVisible,
		)
			? lApi.reserverPlaceScrollVisible
			: lApi.tailleScroll;
		if (lApi.scrollsVisible.v) {
			_construireScrollV(lApi.scrollsVisible.h);
			if (lApi.reserverPlaceScrollVisible) {
				$(lZone).css("padding-right", lNbPixReservation + "px");
			}
		} else if (lApi.avecScrollV) {
			lApi.scrollV.setTaille(
				lZone,
				lApi.scrollV.callbackAppel(
					ObjetScroll_3.EGenreScrollEvenement.TailleZone,
				),
			);
		}
		_actualiserHeightContenu();
		if (lApi.scrollsVisible.h) {
			_construireScrollH(lApi.scrollsVisible.v);
			if (lApi.reserverPlaceScrollVisible) {
				$(lZone).css("padding-bottom", lNbPixReservation + "px");
			}
		} else if (lApi.avecScrollH) {
			lApi.scrollH.setTaille(
				lZone,
				lApi.scrollH.callbackAppel(
					ObjetScroll_3.EGenreScrollEvenement.TailleZone,
				),
			);
		}
		if (lApi.scrollsVisible.v && lApi.scrollsVisible.h) {
			lJNode.append(
				'<div role="presentation" style="position:absolute;' +
					ObjetStyle_1.GStyle.composeCouleurFond(lApi.couleurBoucheTrou) +
					"bottom:" +
					(lApi.decalageScrollH +
						lBorderWidth +
						parseInt(lJNode.css("paddingBottom"), 10) -
						1) +
					"px;" +
					"right:" +
					(lApi.decalageScrollV +
						lBorderWidth +
						parseInt(lJNode.css("paddingRight"), 10) -
						1) +
					"px;" +
					"width:" +
					lLargeur +
					"px; height:" +
					lLargeur +
					'px"></div>',
			);
			lBoucheTrou = lJNode.get(0).lastChild;
		}
	}
	function _construireScrollV(aAvecScrollH) {
		lJNode.append(
			'<div role="presentation" id="' +
				lApi.scrollV.getIdScroll() +
				'" style="position:absolute; top:0px; bottom:' +
				(aAvecScrollH ? lLargeur : 0) +
				"px; right:" +
				(lApi.decalageScrollV +
					lBorderWidth +
					parseInt(lJNode.css("paddingRight"), 10) -
					1) +
				"px; width:" +
				lLargeur +
				'px"></div>',
		);
		lApi.scrollV.setDonnees(0);
	}
	function _construireScrollH(aAvecScrollV) {
		lJNode.append(
			'<div id="' +
				lApi.scrollH.getIdScroll() +
				'" role="presentation" style="position:absolute; bottom:' +
				(lApi.decalageScrollH +
					lBorderWidth +
					parseInt(lJNode.css("paddingBottom"), 10) -
					1) +
				"px; left:0px; right:" +
				(aAvecScrollV ? lLargeur : 0) +
				"px;" +
				"height:" +
				lLargeur +
				'px"></div>',
		);
		lApi.scrollH.setDonnees(0);
	}
	function _avecScroll() {
		const lObj = { v: false, h: false };
		let lHeightZone = lApi.heightZone;
		let lWidthZone = lApi.widthZone;
		let lWidthContenu = lApi.widthContenu;
		if (lApi.avecScrollV && lApi.heightContenu > lHeightZone) {
			lObj.v = true;
			lWidthZone = lWidthZone - lLargeur;
			if (lApi.avecScrollH) {
				$(lZone).width(lWidthZone);
				lWidthContenu = lContenu.scrollWidth;
				$(lZone).width(lApi.widthContenu);
			}
		}
		if (lApi.avecScrollH && lWidthContenu > lWidthZone) {
			lObj.h = true;
			lHeightZone = lHeightZone - lLargeur;
			if (lApi.avecScrollV && lApi.heightContenu > lHeightZone) {
				lObj.v = true;
			}
		}
		return lObj;
	}
	$(aContexteCourant.node).on("destroyed", () => {
		if (lApi.scrollV) {
			lApi.scrollV.free();
			lApi.scrollV = null;
		}
		if (lApi.scrollH) {
			lApi.scrollH.free();
			lApi.scrollH = null;
		}
		lJNode = null;
		lApi.destroyed = true;
		lApi.scrollV = null;
		lApi.scrollH = null;
	});
	function _getHeightContenu() {
		const lJContenu = $(lContenu);
		if (lApi.heightContenuMinZone) {
			lJContenu.height("");
		}
		const lHeight = lJContenu.height();
		_actualiserHeightContenu();
		return lHeight;
	}
	let lCompteur = 0;
	function _MAJVisible() {
		if ($(aContexteCourant.node).is(":visible")) {
			if (lApi.avecScrollV) {
				lApi.heightZone = lJNode.height();
				lApi.heightContenu = _getHeightContenu();
				$(lZone).height(lApi.heightZone);
			}
			if (lApi.avecScrollH) {
				lApi.widthZone = lJNode.width();
				lApi.widthContenu = lContenu.scrollWidth;
				$(lZone).width(lApi.widthZone);
			}
			_construireScrolls();
			if (lApi.surRefresh) {
				lApi.surRefresh();
			}
		} else {
			lCompteur += 1;
			if (lCompteur > 100) {
				return;
			}
			setTimeout(_MAJVisible, 0);
		}
	}
	aOutils.surInjectionHtml(
		aContexteCourant,
		(aParams) => {
			aParams.addMutate(() => {
				_MAJVisible();
			});
		},
		true,
	);
	const lFuncActualisation = function () {
		if (!lApi.resizeEnCours && $(aContexteCourant.node).is(":visible")) {
			_actualiser();
			if (lApi.surRefresh) {
				lApi.surRefresh();
			}
		}
	};
	if (lApi.avecResizeObserver) {
		UtilitaireResizeObserver_1.UtilitaireResizeObserver.observe({
			node: aContexteCourant.node,
			nodeObserve: lContenu,
			callback: function () {
				lFuncActualisation();
			},
		});
	}
	if (lApi.avecRefresh) {
		aOutils.abonnerRefresh(
			() => {
				if (lApi.timeout) {
					clearTimeout(lApi.timeout);
					lApi.timeout = null;
				}
				lApi.timeout = setTimeout(() => {
					lFuncActualisation();
				}, 0);
			},
			aContexteCourant.node,
			aContexteCourant,
		);
	}
	return true;
}

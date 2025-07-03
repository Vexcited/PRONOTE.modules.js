exports.ObjetFenetre_Bloc = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_Bloc extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._idBloc = this.Nom + "_fenetre_bloc";
		this.idScroll = this.Nom + "_scroll";
		this.hauteurMax = ObjetNavigateur_1.Navigateur.ecranH - 120;
		this._donnees = { element: null, gestionnaireBloc: null };
		this.setOptionsFenetre({
			avecTitre: false,
			largeur: 600,
			hauteur: 150,
			marge: 7,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
					index: 0,
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				},
			],
			avecPaddingContenu: false,
			positionnerFenetreSurAfficher: false,
		});
		this.setLargeurMin(this.optionsFenetre.largeurMin);
	}
	setLargeurMin(aValeur) {
		if (aValeur !== this.optionsFenetre.largeurMin) {
			this.setOptionsFenetre({ largeurMin: aValeur });
		}
		this.largeurMax = ObjetNavigateur_1.Navigateur.ecranL - 100;
		if (this.largeurMax < this.optionsFenetre.largeurMin) {
			this.largeurMax = this.optionsFenetre.largeurMin;
		}
	}
	setDonnees(aDonnees) {
		$.extend(this._donnees, aDonnees);
		this.actualiser();
		this.afficher();
		this.remplirBlocs();
		this.apresAfficher();
		this.$refreshSelf();
	}
	remplirBlocs() {
		if (!!this._donnees.liste) {
			const nbElements = this._donnees.liste.count();
			for (let i = 0; i < nbElements; i++) {
				const aElement = this._donnees.liste.get(i);
				this.ajouterElementAuBloc(aElement, i);
			}
		} else {
			this.ajouterElementAuBloc(this._donnees.element, 0);
		}
	}
	ajouterElementAuBloc(aElement, aIndice) {
		const lEltBloc = this.composeElementBloc(aElement);
		if (lEltBloc) {
			let lElementAvecMarge = "";
			if (aIndice > 0) {
				lElementAvecMarge =
					'<div style="margin: 2px 10px 5px 10px;"><hr style="border-color: ' +
					(0, AccessApp_1.getApp)().getCouleur().themeNeutre.light +
					';" /></div>';
			}
			lElementAvecMarge += "<div>" + lEltBloc.html + "</div>";
			ObjetHtml_1.GHtml.addHtml(this._idBloc, lElementAvecMarge, {
				controleur: lEltBloc.controleur,
			});
		}
	}
	composeElementBloc(aElement) {
		if (this._donnees.gestionnaireBloc !== null) {
			return this._donnees.gestionnaireBloc.composeBlocComplet(aElement);
		}
	}
	infoOverflow(aWidthBtnAction) {
		const lResult = {
			avecOverflow: false,
			scrollWidth: this.optionsFenetre.largeurMin - aWidthBtnAction,
			scrollHeight: 0,
		};
		const lJqElm = $("#" + this._idBloc.escapeJQ()).find(
			".PourFenetreBloc_Contenu",
		);
		lJqElm.each((index, element) => {
			if (lResult.scrollWidth < element.scrollWidth) {
				if (element.scrollWidth === this.largeurMax - 20 - aWidthBtnAction) {
					$(element).width(lResult.scrollWidth);
					if (element.scrollWidth > lResult.scrollWidth) {
						lResult.scrollWidth = element.scrollWidth;
					}
					$(element).css("width", "auto");
				} else {
					lResult.scrollWidth = element.scrollWidth;
				}
			}
			if (lResult.scrollHeight < element.scrollHeight) {
				lResult.scrollHeight = element.scrollHeight;
			}
		});
		if (lResult.scrollWidth > this.largeurMax - 20 - aWidthBtnAction) {
			lResult.avecOverflow = true;
		}
		return lResult;
	}
	apresAfficher() {
		if (!!this._donnees.gestionnaireBloc) {
			this._donnees.gestionnaireBloc.refresh();
			ObjetPosition_1.GPosition.placer(this.Nom, 0, 0);
			if (this.idScroll) {
				const lJqScroll = $("#" + this.idScroll.escapeJQ());
				if (lJqScroll.length === 1) {
					let lNewWidth = this.largeurMax;
					const lJqBloc = $("#" + this._idBloc.escapeJQ());
					const lHeight = lJqBloc.outerHeight(true);
					const lWidth = lJqBloc.outerWidth(true) + 5;
					const lRatioHeight =
						(lHeight + this.hauteurMax) / (this.hauteurMax * 2);
					const lRatioWidth =
						(lWidth + this.largeurMax) / (this.largeurMax * 2);
					const lWidthBtnAction =
						this._donnees.gestionnaireBloc._instances &&
						this._donnees.gestionnaireBloc._instances.length > 0
							? this._donnees.gestionnaireBloc._instances[0].getWidthBtnAction()
							: 0;
					const lInfoOverflow = this.infoOverflow(lWidthBtnAction);
					const lJqContenu = lJqBloc.find(".PourFenetreBloc_Contenu");
					if (
						((lHeight < this.hauteurMax && lWidth >= this.largeurMax) ||
							lRatioHeight < lRatioWidth ||
							(lRatioHeight > 1 && lRatioWidth < 1)) &&
						!lInfoOverflow.avecOverflow
					) {
						lNewWidth = Math.max(
							Math.ceil(this.largeurMax * lRatioHeight),
							this.optionsFenetre.largeurMin,
							lInfoOverflow.scrollWidth + 20 + lWidthBtnAction,
						);
						lNewWidth = Math.min(lNewWidth, this.largeurMax);
						lJqScroll.css({ maxWidth: lNewWidth });
						lJqContenu.css({ maxWidth: lNewWidth - 20 - lWidthBtnAction });
					}
					if (lInfoOverflow.avecOverflow) {
						lJqContenu.each((index, element) => {
							$(element).css({ overflow: "" });
							$(element).css({ maxWidth: "" });
							$(element).width(lInfoOverflow.scrollWidth);
							$(element)
								.parents(".UtilitaireBloc_containerNormal")
								.first()
								.css({ "justify-content": "flex-start" });
						});
					}
				}
			}
			if (this._donnees.coordonnees) {
				ObjetPosition_1.GPosition.placer(
					this.Nom,
					this._donnees.coordonnees.left,
					this._donnees.coordonnees.top,
				);
				this.setCoordonnees();
			} else {
				ObjetPosition_1.GPosition.centrer(this.Nom);
			}
		}
	}
	composeContenu() {
		const T = [];
		if (IE.estMobile) {
			T.push('<div id="', this._idBloc, '"></div>');
		} else {
			const lHauteurZoneDeplacement = this.optionsFenetre.marge + 16;
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", {
						class: "ZoneDeplacementFenetre",
						"ie-draggable": this.getDragFenetre.bind(this),
						style: `position:absolute;width:100%; height:${lHauteurZoneDeplacement}px; top: -${lHauteurZoneDeplacement}px; left:0px; z-index:100;`,
					}),
					IE.jsx.str(
						"div",
						{
							id: this.idScroll,
							class: "overflow-auto",
							style: `width:100%; height:100%; max-height:${this.hauteurMax}px; max-width:${this.largeurMax}px;`,
						},
						IE.jsx.str("div", { id: this._idBloc, tabindex: "0" }),
					),
				),
			);
		}
		return T.join("");
	}
	focusSurPremierElement() {
		if (ObjetHtml_1.GHtml.elementExiste(this._idBloc)) {
			ObjetHtml_1.GHtml.setFocus(this._idBloc);
		}
	}
}
exports.ObjetFenetre_Bloc = ObjetFenetre_Bloc;

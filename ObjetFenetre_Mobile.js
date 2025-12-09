exports.ObjetFenetreMobile = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTraduction_1 = require("ObjetTraduction");
const _ObjetFenetre_1 = require("_ObjetFenetre");
const Invocateur_1 = require("Invocateur");
const tag_1 = require("tag");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class ObjetFenetreMobile extends _ObjetFenetre_1._ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.openAnimFinished = false;
		this.setOptionsFenetre({
			modale: true,
			fermerFenetreSurClicHorsFenetre: true,
			avecTailleSelonContenuMobile: false,
			avecFooterFlottant: true,
			sansPaddingContenu: false,
			titre: "",
			titreNavigation: "",
			cssFenetre:
				MethodesObjet_1.MethodesObjet.getObjectClass(this) + "_racine",
			themeMenuDark: false,
			avecCroixFermeture: true,
			indiceCroixFermeture: -1,
			avecNavigation: false,
			addParametresValidation: null,
			surValiderAvantFermer: null,
			callback: null,
			callbackFermer: null,
			callbackApresFermer: null,
			callbackNavigation: null,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			listeBoutonsInactifs: [],
			avecAbonnementFermetureFenetreGenerale: true,
			estFicheMobile: false,
			avecComposeBasInFooter: false,
			avecAnimationOuverture: true,
			avecAnimationFermeture: true,
		});
		Object.assign(this.optionsInterne, {
			closeStart: () => {},
			closeEnd: () => {
				return this._fermetureAnimationPromise();
			},
		});
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.fermerFenetres,
			(aForcer) => {
				if (
					aForcer ||
					this.optionsFenetre.avecAbonnementFermetureFenetreGenerale
				) {
					this.fermer();
				}
			},
			this,
		);
	}
	free() {
		if (this.isDestroyed()) {
			return;
		}
		super.free();
		$("#" + this.Nom.escapeJQ()).remove();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getClassStickyScroll: function () {
				let lResult = aInstance._getClassScrollContent(
					$("#" + aInstance.NomFenetre.escapeJQ()),
				);
				if (!lResult) {
					lResult = aInstance._getClassScrollContent(aInstance._getJContent());
				}
				return lResult;
			},
			btnNavigation: {
				event: function (aSuivant) {
					if (
						MethodesObjet_1.MethodesObjet.isFunction(
							aInstance.optionsFenetre.callbackNavigation,
						)
					) {
						aInstance.optionsFenetre.callbackNavigation(aSuivant);
					}
				},
				avecNavigation: function () {
					return !!aInstance.optionsFenetre.avecNavigation;
				},
			},
			getDragTitre() {
				return {
					drag(aParamsDrag) {
						const lDecalage = Math.min(0, -aParamsDrag.offset.y);
						$(`#${aInstance.NomFenetre.escapeJQ()}`).css("bottom", lDecalage);
					},
					stop(aParamsDrag) {
						if (aParamsDrag.offset.y > 0) {
							const lJFenetre = $(`#${aInstance.NomFenetre.escapeJQ()}`);
							if (aParamsDrag.offset.y < 50) {
								lJFenetre.data("_ouverture_drag", true);
								aInstance._ouvertureAnimationPromise();
							} else {
								aInstance.eventSurCroixFermeture();
							}
						}
					},
				};
			},
			avecTitre: function () {
				return (
					!!aInstance.optionsFenetre.titre ||
					!!aInstance.optionsFenetre.avecCroixFermeture
				);
			},
			avecTitreNavigation: function () {
				return (
					!!aInstance.optionsFenetre.titreNavigation ||
					!!aInstance.optionsFenetre.avecNavigation
				);
			},
			getTitre: function () {
				const lTitre =
					(MethodesObjet_1.MethodesObjet.isFunction(
						aInstance.optionsFenetre.titre,
					)
						? aInstance.optionsFenetre.titre()
						: aInstance.optionsFenetre.titre) || "";
				const lStyle = aInstance.optionsFenetre.couleurTexteBandeau
					? ObjetStyle_1.GStyle.composeCouleurTexte(
							aInstance.optionsFenetre.couleurTexteBandeau,
						)
					: "";
				return (
					'<h1 class="ie-titre"' +
					(lStyle ? ' style="' + lStyle + '"' : "") +
					">" +
					lTitre +
					"</h1>"
				);
			},
			getTitreNavigation: function () {
				const lTitre =
					(MethodesObjet_1.MethodesObjet.isFunction(
						aInstance.optionsFenetre.titreNavigation,
					)
						? aInstance.optionsFenetre.titreNavigation()
						: aInstance.optionsFenetre.titreNavigation) || "";
				const lStyle = aInstance.optionsFenetre.couleurTexteBandeau
					? ObjetStyle_1.GStyle.composeCouleurTexte(
							aInstance.optionsFenetre.couleurTexteBandeau,
						)
					: "";
				const lAttr = { style: lStyle };
				return IE.jsx.str(
					"div",
					Object.assign(
						{
							role: "heading",
							"aria-level": "2",
							class: "ie-titre flex-contain cols",
						},
						lAttr,
					),
					lTitre,
				);
			},
			_getNodeContent: function () {
				ObjetHtml_1.GHtml.setHtml(
					this.node,
					aInstance._composer(
						aInstance.optionsFenetre.estFicheMobile ? "&nbsp;" : null,
					),
					{ instance: aInstance },
				);
			},
			htmlRepeatBoutons: function (aBoutonRepeat) {
				return aInstance.construireBouton(aBoutonRepeat);
			},
			getNodeOverlay() {
				$(this.node).on("click", () => {
					if (
						aInstance.EnAffichage &&
						aInstance.openAnimFinished &&
						(!aInstance.optionsFenetre.modale ||
							aInstance.optionsFenetre.fermerFenetreSurClicHorsFenetre)
					) {
						aInstance.eventSurCroixFermeture();
					}
				});
			},
		});
	}
	construireBouton(aBoutonRepeat) {
		return [
			'<ie-bouton ie-model="fenetreBtn(bouton)"',
			' id="',
			this._getIdBoutons(aBoutonRepeat.element.index),
			'"',
			aBoutonRepeat.element.theme &&
			MethodesObjet_1.MethodesObjet.isString(aBoutonRepeat.element.theme)
				? ' class="' + aBoutonRepeat.element.theme + '"'
				: "",
			' style="',
			this.optionsFenetre.listeBoutonsInvisibles[
				aBoutonRepeat.element.index
			] === true
				? "display:none;"
				: "",
			'"',
			">",
			"</ie-bouton>",
		].join("");
	}
	jsxIfAvecBtnFermeture() {
		return !!this.optionsFenetre.avecCroixFermeture;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("span", {
				class: Divers_css_1.StylesDivers.srOnly,
				tabindex: "0",
				"ie-node": this.jsxNodeFocusSurPremierOuDernierElement.bind(this, true),
			}),
			IE.jsx.str(
				"div",
				{
					id: this.NomFenetre,
					"ie-node": this.jsxNodeCreationNodeFenetre.bind(this),
					class: [
						!this.optionsFenetre.avecTailleSelonContenuMobile
							? " height-max"
							: "",
						"ObjetFenetre_Mobile",
						this.optionsFenetre.cssFenetre || "",
						this.optionsFenetre.themeMenuDark
							? "couleur-menu-dark disable-dark-mode"
							: "",
					],
					role: this.optionsFenetre.roleWAI || "dialog",
					"aria-modal": this.optionsFenetre.modale ? `true` : false,
				},
				IE.jsx.str(
					"div",
					{ class: "FormSaisie ofm-design" },
					IE.jsx.str(
						"header",
						null,
						IE.jsx.str("div", {
							id: this.IdTitre,
							class: "Fenetre_Titre",
							"ie-html": "getTitre",
							"ie-if": "avecTitre",
							tabindex: "-1",
							"ie-draggable": this.optionsFenetre.avecCroixFermeture
								? "getDragTitre"
								: false,
						}),
						IE.jsx.str("ie-btnicon", {
							class: "icon_fermeture_widget",
							"ie-model": this.jsxModeleBoutonCroixFermeture.bind(this),
							"ie-if": this.jsxIfAvecBtnFermeture.bind(this),
							title: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "navigation-contain", "ie-class": "getClassStickyScroll" },
						IE.jsx.str("ie-btnicon", {
							class: "icon_angle_left",
							"ie-model": "btnNavigation(false)",
							"ie-if": "avecNavigation",
							title: ObjetTraduction_1.GTraductions.getValeur("Precedent"),
						}),
						IE.jsx.str("div", {
							class: "Fenetre_Titre",
							"ie-html": "getTitreNavigation",
							"ie-if": "avecTitreNavigation",
							tabindex: "-1",
						}),
						IE.jsx.str("ie-btnicon", {
							class: "icon_angle_right",
							"ie-model": "btnNavigation(true)",
							"ie-if": "avecNavigation",
							title: ObjetTraduction_1.GTraductions.getValeur("Suivant"),
						}),
					),
					IE.jsx.str("section", {
						class: [
							"content",
							this.optionsFenetre.sansPaddingContenu ? "without-padding" : "",
						],
						style: "display:none;",
						"ie-node": "_getNodeContent",
					}),
					IE.jsx.str(
						"footer",
						{
							class: this.optionsFenetre.avecFooterFlottant ? "sticky" : false,
							"ie-class": "getClassStickyScroll",
						},
						this.optionsFenetre.avecComposeBasInFooter && this.composeBas
							? this.composeBas()
							: "",
						IE.jsx.str("div", {
							"ie-repeat": "bouton in listeBoutons",
							"ie-html": "htmlRepeatBoutons(bouton)",
							class: "repeat-bouton",
						}),
					),
				),
			),
			IE.jsx.str("div", {
				class: "ObjetFenetre_Mobile-overlay hide",
				"ie-node": "getNodeOverlay",
			}),
			IE.jsx.str("span", {
				class: Divers_css_1.StylesDivers.srOnly,
				tabindex: "0",
				"ie-node": this.jsxNodeFocusSurPremierOuDernierElement.bind(
					this,
					false,
				),
			}),
		);
	}
	actualiser() {
		ObjetHtml_1.GHtml.setHtml(this.IdContenu, this.composeContenu(), {
			controleur: this.controleur,
		});
	}
	async afficher(aHtml) {
		if (this.isDestroyed()) {
			return Promise.reject();
		}
		const lEnAffichage_old = this.EnAffichage;
		this.EnAffichage = true;
		if (!lEnAffichage_old) {
			this._focusPrecedent = null;
			if (
				!this.optionsFenetre.bloquerFocus &&
				this.optionsFenetre.restaurerFocusSurFermeture
			) {
				this._focusPrecedent = document.activeElement;
			}
		}
		Invocateur_1.Invocateur.evenement("surAffichageFenetre");
		if (!lEnAffichage_old && ObjetHtml_1.GHtml.elementExiste(this.NomFenetre)) {
			this._ouvertureAnimationPromise();
		}
		const lJContenu = this._getJContent();
		if (aHtml) {
			lJContenu
				.ieHtml(this._composer(aHtml), { controleur: this.controleur })
				.show();
		}
		lJContenu.show();
		this.$refreshSelf();
		this.promise = new Promise((aResolve) => {
			this._promiseResolve = aResolve;
		});
		return this.promise;
	}
	_ouvertureAnimationPromise() {
		this.openAnimFinished = false;
		return new Promise((aResolve) => {
			const lJFenetre = $("#" + this.NomFenetre.escapeJQ());
			const lJInstance = $(`#${this.Nom.escapeJQ()}`);
			lJInstance.css(
				"z-index",
				ObjetNavigateur_1.Navigateur.getZIndexModalMobile(true),
			);
			lJInstance.show();
			const lJOverlay = lJInstance.find(">.ObjetFenetre_Mobile-overlay");
			lJOverlay.removeClass("hide");
			let lAvecOpacite = true;
			if (lJFenetre.data("_ouverture_drag") === true) {
				lAvecOpacite = false;
				lJFenetre.data("_ouverture_drag", null);
			}
			lJFenetre.finish().animate(
				{ bottom: "0%" },
				{
					duration: this.optionsFenetre.avecAnimationOuverture ? 300 : 0,
					step(aNow, fx) {
						if (lAvecOpacite) {
							lJOverlay.css({ opacity: fx.pos });
						}
					},
					done: () => {
						var _a, _b, _c;
						this.openAnimFinished = true;
						if (!this._openEndInitial) {
							(_a = this.surAfficher) === null || _a === void 0
								? void 0
								: _a.call(this);
							(_c = (_b = this.optionsFenetre).callbackSurAfficher) === null ||
							_c === void 0
								? void 0
								: _c.call(_b);
						}
						this._openEndInitial = !this.optionsFenetre.estFicheMobile;
						if (!this.optionsFenetre.bloquerFocus) {
							this.focusSurPremierElement();
						}
						this.$refreshSelf();
						aResolve();
					},
				},
			);
		});
	}
	async _fermetureAnimationPromise() {
		const lJFenetre = $("#" + this.NomFenetre.escapeJQ());
		const lJInstance = $(`#${this.Nom.escapeJQ()}`);
		lJInstance.css(
			"z-index",
			ObjetNavigateur_1.Navigateur.getZIndexModalMobile(false),
		);
		const lJOverlay = lJInstance.find(">.ObjetFenetre_Mobile-overlay");
		return new Promise((aResolve) => {
			lJFenetre.finish().animate(
				{ bottom: "-100%" },
				{
					duration: this.optionsFenetre.avecAnimationFermeture ? 200 : 0,
					step(aNow, fx) {
						lJOverlay.css({ opacity: 1 - fx.pos });
					},
					done: () => {
						lJInstance.hide();
						lJOverlay.addClass("hide");
						aResolve();
					},
				},
			);
		});
	}
	_composer(aHtml) {
		const H = [
			(0, tag_1.tag)(
				"div",
				{ class: "wrapper-contenu" },
				(0, tag_1.tag)(
					"div",
					{ id: this.IdContenu, class: "Fenetre_Contenu" },
					aHtml || this.composeContenu(),
				),
			),
		];
		if (!this.optionsFenetre.avecComposeBasInFooter) {
			const lHtmlBas = this.composeBas ? this.composeBas() : "";
			if (lHtmlBas) {
				H.push('<div class="Fenetre_Bas">', lHtmlBas, "</div>");
			}
		}
		return H.join("");
	}
	_getJContent() {
		return $("#" + this.NomFenetre.escapeJQ()).find(">div>section.content");
	}
	_getClassScrollContent(aJNode) {
		if (aJNode.length === 1) {
			if (aJNode.prop("scrollHeight") > Math.ceil(aJNode.outerHeight())) {
				return "avec-scroll";
			}
		}
		return null;
	}
}
exports.ObjetFenetreMobile = ObjetFenetreMobile;

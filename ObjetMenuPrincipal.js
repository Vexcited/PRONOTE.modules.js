exports.ObjetMenuPrincipal = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetWAI_1 = require("ObjetWAI");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetCentraleNotifications_1 = require("ObjetCentraleNotifications");
const IEHtml_1 = require("IEHtml");
const C_delayAnimationDeploiement = 550;
class ObjetMenuPrincipal extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.ListeElements = null;
		this.listeTraitee = new ObjetListeElements_1.ObjetListeElements();
		this.NomWrapper = this.Nom + "_Wrapper";
		this.NomCombo = this.Nom + "_Combo";
		this.NomListe = this.Nom + "_Liste";
		this.NomNiveau = [];
		this.baseNomNiveau = "_niveau";
		this.tabIndex = 0;
		this.rayonArrondi = 7;
		this.hauteurLigne = 17;
		this._options = {
			labelWAIcombo: "",
			roleWAIbutton: ObjetWAI_1.EGenreRole.Button,
			roleWAIlist: ObjetWAI_1.EGenreRole.Menuitem,
			roleWAIlistitem: ObjetWAI_1.EGenreRole.Menuitem,
		};
		this.setParametres({});
		IE.log.setIDFiltrageLog("NAVIGATIONCLAVIER", false);
		IE.log.setIDFiltrageLog("IDSCLAVIER", false);
		Invocateur_1.Invocateur.abonner(
			"fermerAutresMenuOnglet",
			this._notificationFermer.bind(this),
			this,
		);
	}
	setParametres(aParam) {
		this.avecSousMenu = !!aParam.avecSousMenu;
		this.avecPlusieursNiveau = !!aParam.avecPlusieursNiveau;
		this.avecGroupeCliquable = !!aParam.avecGroupeCliquable;
		this.avecSousMenuVisible = !!aParam.avecSousMenuVisible;
		this.masquerLibelleOnglet = !!aParam.masquerLibelleOnglet;
		this.niveauMaximum = 3;
		this.largeur = null;
		this.largeurMaxLibelle = aParam.largeurMaxLibelle || null;
		this.hauteur = 35;
		this.minHauteur = aParam.minHauteur ? aParam.minHauteur : 0;
		this.tabIndex = aParam.tabIndex || 0;
		this.libelleCentre = aParam.libelleCentre !== false;
		this.actionSurClickSiSeul = aParam.actionSurClickSiSeul || false;
		this.seulEtActionSurClick = false;
		this.sansClicPrincipal = aParam.sansClicPrincipal || false;
		this.avecCollapse = aParam.avecCollapse || false;
		this.avecScrollSousMenu = aParam.avecScrollSousMenu || false;
		this.bloquerCouleurOnglet = aParam.bloquerCouleurOnglet || false;
		this.avecCompteur = aParam.avecCompteur || false;
		this.avecCompteurOngletRacine = aParam.avecCompteurOngletRacine || false;
		this.vitesseAnimationOuverture = 250;
		this.vitesseAnimationFermeture = 0;
	}
	ajouterNiveau() {
		const lNiveauAjoute = this.NomNiveau.length;
		if (lNiveauAjoute === 0) {
			this.IdPremierElement = this.NomCombo + lNiveauAjoute;
		}
		this.NomNiveau.push(this.baseNomNiveau + lNiveauAjoute);
		const lClass = [];
		if (this.sansClicPrincipal) {
			lClass.push("SansMain");
			if (this.avecCollapse && this.avecSousMenu) {
				lClass.push("is-collapse");
			}
		} else if (this.avecSousMenu) {
			lClass.push("is-collapse");
		}
		const lIdSousMenu = this.NomListe + this.NomNiveau[lNiveauAjoute];
		let H = IE.jsx.str(
			"li",
			{
				class: [
					"item-menu_niveau0",
					lClass.join(" "),
					this.avecSousMenu ? "avec-sousmenu" : "",
				],
				tabindex: this.tabIndex,
				role: "menuitem",
				"aria-expanded": this.avecSousMenu ? "false" : false,
				"aria-haspopup": this.avecSousMenu ? "true" : false,
				"aria-controls": this.avecSousMenu ? lIdSousMenu : false,
			},
			IE.jsx.str("div", {
				id: this.NomCombo + lNiveauAjoute,
				"aria-atomic": "true",
				style:
					(MethodesObjet_1.MethodesObjet.isNumeric(this.largeur)
						? "width:" + this.largeur + "px;"
						: "") +
					(this.largeurMaxLibelle
						? "text-overflow:ellipsis; overflow:hidden;max-width:" +
							this.largeurMaxLibelle +
							"px;"
						: "") +
					(this.minHauteur ? "min-height:" + this.minHauteur + "px;" : "") +
					(!this.libelleCentre ? "text-align:left;" : ""),
				class: "label-menu_niveau0",
			}),
			IE.jsx.str("div", {
				id: lIdSousMenu,
				class: "submenu-wrapper",
				style: this.avecSousMenu ? "" : "display:none;",
			}),
		);
		$("#" + this.NomWrapper.escapeJQ()).append(H);
		return lNiveauAjoute;
	}
	construireAffichage() {
		return IE.jsx.str("ul", {
			id: this.NomWrapper,
			class: "menu-principal_niveau0",
			role: "presentation",
		});
	}
	recupererDonnees() {
		const lContainer = $("#" + this.Nom.escapeJQ());
		lContainer
			.on(
				"mouseenter focusin",
				".item-menu_niveau0 ,.item-menu_niveau1",
				{ aObjet: this },
				function (aEvent) {
					if (!ObjetMenuPrincipal.estMenuEnModeResponsive()) {
						if (
							aEvent.type === "mouseenter" &&
							aEvent.relatedTarget &&
							aEvent.relatedTarget.classList &&
							aEvent.relatedTarget.classList.contains("BloquerInterface")
						) {
							return;
						}
						if (!$(this).hasClass("item-menu_niveau1")) {
							$(this).addClass("focused-in");
							if (this.classList.contains("avec-sousmenu")) {
								this.setAttribute("aria-expanded", "true");
							}
							aEvent.data.aObjet.ajouterClassScroll($(this));
						}
					}
				},
			)
			.on(
				"mouseleave focusout",
				".item-menu_niveau0",
				{ aObjet: this },
				function () {
					if (!ObjetMenuPrincipal.estMenuEnModeResponsive()) {
						this.classList.remove("focused-in");
						if (this.classList.contains("avec-sousmenu")) {
							this.setAttribute("aria-expanded", "false");
						}
						ObjetMenuPrincipal.enleverClassScroll($(this));
					}
				},
			)
			.on(
				"click",
				".item-menu_niveau0, .item-menu_niveau1",
				{ aObjet: this },
				function (aEvent) {
					const lEstResponsive = ObjetMenuPrincipal.estMenuEnModeResponsive();
					if ($(this).hasClass("item-menu_niveau0") && !lEstResponsive) {
						return;
					}
					const lEstDeploye = !this.classList.contains("focused-in");
					$(this)
						.toggleClass("focused-in")
						.siblings()
						.removeClass("focused-in")
						.removeClass("avec-scroll")
						.each(function () {
							if (lEstResponsive && this.classList.contains("avec-sousmenu")) {
								this.setAttribute("aria-expanded", "false");
							}
						});
					if (lEstResponsive && this.classList.contains("avec-sousmenu")) {
						this.setAttribute("aria-expanded", lEstDeploye ? "true" : "false");
					}
				},
			)
			.on(
				"keyup",
				".item-menu_niveau0, .item-menu_niveau1, .item-menu_niveau2",
				{ aObjet: this },
				this.navigationClavierMenu,
			)
			.on(
				"click",
				".item-menu_niveau2, .has-submenu",
				{ aObjet: this },
				function (event) {
					if (
						event.data.aObjet.avecGroupeCliquable ||
						$(this).children("ul").length === 0
					) {
						if (
							!ObjetMenuPrincipal.estMenuEnModeResponsive() ||
							$(this).hasClass("has-submenu")
						) {
							event.stopImmediatePropagation();
						}
						if (ObjetMenuPrincipal.estMenuEnModeResponsive()) {
							const lNextSubList = $(this).children("ul");
							if (!lNextSubList.hasClass("shown")) {
								lNextSubList.addClass("shown");
							} else {
								lNextSubList.removeClass("shown");
							}
							$(this).siblings().children("ul").removeClass("shown");
						}
						if (
							$(this).hasClass("item-menu_niveau2") ||
							$(this).children("ul").length === 0
						) {
							event.data.aObjet.surValidation(true, $(this).data("indice"));
							if (ObjetMenuPrincipal.estMenuEnModeResponsive()) {
								event.stopImmediatePropagation();
								ObjetMenuPrincipal.afficherMasquerMenuResponsive();
							}
						}
					}
				},
			)
			.on(
				"click",
				'[id^="' +
					this.NomListe.escapeJQ() +
					this.baseNomNiveau +
					"\"] ul > li:not('.not-clickable')",
				{ aObjet: this },
				function (event) {
					event.stopImmediatePropagation();
					event.data.aObjet.surValidation(true, $(this).data("indice"));
					if (
						ObjetMenuPrincipal.estMenuEnModeResponsive() &&
						!lContainer.hasClass("objetBandeauEntete_membres")
					) {
						ObjetMenuPrincipal.afficherMasquerMenuResponsive();
					}
				},
			)
			.on("click", ".item-menu_niveau0", { aObjet: this }, function (event) {
				if (
					lContainer.hasClass("objetBandeauEntete_membres") &&
					!ObjetMenuPrincipal.estMenuEnModeResponsive()
				) {
					if (!this.classList.contains("focused-in")) {
						this.classList.add("focused-in");
						this.setAttribute("aria-expanded", "true");
					} else {
						this.setAttribute("aria-expanded", "false");
					}
				}
				const lThis = event.data.aObjet;
				if (
					!lThis.avecSousMenu ||
					(!lThis.sansClicPrincipal &&
						!ObjetMenuPrincipal.estMenuEnModeResponsive())
				) {
					const lNiveau = parseInt(
						$(this)
							.children('div[id^="' + lThis.NomCombo.escapeJQ() + '"]')
							.attr("id")
							.substring(lThis.NomCombo.length),
					);
					let lElement = lThis.listeTraitee.get(lNiveau);
					while (lElement.children && lElement.children.count()) {
						lElement = lElement.children.get(0);
					}
					lThis.surValidation(true, lElement.indice);
				}
			})
			.on(
				"keyup",
				'[id^="' + this.NomListe.escapeJQ() + this.baseNomNiveau + '"] li',
				{ aObjet: this },
				this.navigationClavierMenu,
			)
			.on(
				"keydown",
				'[id^="' + this.NomListe.escapeJQ() + this.baseNomNiveau + '"] li',
				{ aObjet: this },
				(event) => {
					if (event.which === ToucheClavier_1.ToucheClavier.Tab) {
						$(event.delegateTarget).trigger("mouseleave");
					}
				},
			);
	}
	navigationClavierMenu(event) {
		const lThis = event.data.aObjet;
		const lParentNiveau = $(this).parents(
			'[id^="' + lThis.NomListe + '"]:first',
		);
		let lNomNiveau =
			lParentNiveau.length === 1
				? lParentNiveau
						.get(0)
						.id.substring(lThis.NomListe.length + lThis.baseNomNiveau.length)
				: lThis.NomNiveau[0];
		const lEstResponsive = ObjetMenuPrincipal.estMenuEnModeResponsive();
		if (
			$(this).children('div[id^="' + lThis.NomCombo.escapeJQ() + '"]').length >
			0
		) {
			lNomNiveau = $(this)
				.children('div[id^="' + lThis.NomCombo.escapeJQ() + '"]')
				.attr("id")
				.substring(lThis.NomCombo.length);
			if (event.which === ToucheClavier_1.ToucheClavier.RetourChariot) {
				$(this).trigger("click");
			} else if (
				event.which === ToucheClavier_1.ToucheClavier.Espace ||
				event.which === ToucheClavier_1.ToucheClavier.FlecheBas
			) {
				if (lThis.seulEtActionSurClick) {
					if (event.which !== ToucheClavier_1.ToucheClavier.FlecheBas) {
						lThis.surValidation(true, lThis.listeTraitee.get(0).indice);
					}
				} else if (!lEstResponsive) {
					const lItem = $(
						"#" +
							lThis.NomListe.escapeJQ() +
							lThis.baseNomNiveau +
							$(this)
								.children('div[id^="' + lThis.NomCombo.escapeJQ() + '"]')
								.attr("id")
								.substring(lThis.NomCombo.length),
					).find("ul:first-child li:not(.not-clickable):first");
					if (lItem.attr("role") === "menuitem") {
						lThis.focusElementNiv1(lItem, true, false);
					} else {
						lItem.find("ul li:not(.not-clickable):first").focus();
					}
				}
			}
		} else {
			if (
				event.which === ToucheClavier_1.ToucheClavier.RetourChariot ||
				event.which === ToucheClavier_1.ToucheClavier.Espace
			) {
				$(this).click();
			} else if (
				event.which === ToucheClavier_1.ToucheClavier.FlecheBas &&
				!lEstResponsive
			) {
				if ($(this).is("li")) {
					if (lThis.estUnItemMenuNiv1AvecSousMenuDeploye($(this))) {
						lThis.focusElementMenuNiv2depuisNiv1($(this), true);
					} else {
						const lElementSuivant = $(this).next();
						if (lElementSuivant.length === 1) {
							lThis.focusElementNiv1(lElementSuivant);
						} else {
							if (lThis.estUnItemMenuNiv2AvecParentDeploye($(this))) {
								const lProchainItemNiv1 = $(this).parent().parent().next();
								if (lProchainItemNiv1.length === 1) {
									lThis.focusElementNiv1(lProchainItemNiv1);
								} else {
									lThis.focusElementMenuNiv1DepuisMenu(
										$(this).closest(".menu-principal_niveau1"),
										true,
									);
								}
							} else {
								lThis.focusElementMenuNiv1DepuisMenu($(this).parent(), true);
							}
						}
					}
				}
			} else if (
				event.which === ToucheClavier_1.ToucheClavier.FlecheHaut &&
				!lEstResponsive
			) {
				if ($(this).is("li")) {
					const lElementPrecedent = $(this).prev();
					if (lThis.estUnItemMenuNiv1AvecSousMenuDeploye($(this))) {
						if (lElementPrecedent.length === 1) {
							lThis.focusElementNiv1(lElementPrecedent, false, true);
						} else {
							lThis.focusElementMenuNiv1DepuisMenu(
								$(this).parent(),
								false,
								true,
							);
						}
					} else {
						if (lElementPrecedent.length === 1) {
							lThis.focusElementNiv1(lElementPrecedent, false, true);
						} else {
							if (lThis.estUnItemMenuNiv2AvecParentDeploye($(this))) {
								$(this).closest(".item-menu_niveau1").focus();
							} else {
								lThis.focusElementMenuNiv1DepuisMenu(
									$(this).parent(),
									false,
									true,
								);
							}
						}
					}
				}
			}
		}
		if (
			!lEstResponsive &&
			(event.which === ToucheClavier_1.ToucheClavier.FlecheDroite ||
				event.which === ToucheClavier_1.ToucheClavier.FlecheGauche)
		) {
			if (
				lThis.NomNiveau[
					parseInt(lNomNiveau) +
						(event.which === ToucheClavier_1.ToucheClavier.FlecheDroite
							? 1
							: -1)
				]
			) {
				$(
					"#" +
						lThis.NomCombo.escapeJQ() +
						(parseInt(lNomNiveau) +
							(event.which === ToucheClavier_1.ToucheClavier.FlecheDroite
								? 1
								: -1)),
				)
					.parent()
					.focus();
			}
		} else if (event.which === ToucheClavier_1.ToucheClavier.Echap) {
			$("#" + lThis.NomListe.escapeJQ() + lNomNiveau).blur();
			$("#" + lThis.NomCombo.escapeJQ() + lNomNiveau).focus();
			lThis._fermer();
		}
		event.stopImmediatePropagation();
	}
	estUnItemMenuNiv1AvecSousMenuDeploye(aElement) {
		return (
			aElement.hasClass("has-submenu") &&
			aElement.hasClass("submenu-active") &&
			aElement.hasClass("item-menu_niveau1") &&
			!ObjetMenuPrincipal.estMenuEnModeResponsive()
		);
	}
	focusElementMenuNiv2depuisNiv1(aElement, aPremierElement) {
		aElement
			.find(
				`ul.menu-principal_niveau2 li:${aPremierElement ? "first" : "last"}-child`,
			)
			.focus();
	}
	focusElementMenuNiv1DepuisMenu(
		aMenu,
		aPremierElement,
		aAvecSelectionNiveau2 = false,
	) {
		const lElementMenuNiv1 = aMenu.find(
			`> li:${aPremierElement ? "first" : "last"}-child`,
		);
		this.focusElementNiv1(
			lElementMenuNiv1,
			aPremierElement,
			aAvecSelectionNiveau2,
		);
	}
	focusElementNiv1(
		aElement,
		aPremierElement = false,
		aAvecSelectionNiveau2 = false,
	) {
		if (
			aAvecSelectionNiveau2 &&
			this.estUnItemMenuNiv1AvecSousMenuDeploye(aElement)
		) {
			this.focusElementMenuNiv2depuisNiv1(aElement, aPremierElement);
		} else {
			aElement.focus();
		}
	}
	estUnItemMenuNiv2AvecParentDeploye(aElement) {
		return (
			this.estUnItemMenuNiv1AvecSousMenuDeploye(aElement.parent().parent()) &&
			aElement.hasClass("item-menu_niveau2")
		);
	}
	_notificationFermer(aNomInstanceOrigine) {
		if (this.Nom !== aNomInstanceOrigine) {
			this._fermer();
		}
	}
	_fermer() {
		$("[id^=" + this.NomListe.escapeJQ() + "]").each(function () {
			if ($(this).is(":visible")) {
				setTimeout(() => {
					const lUlHeight = $(this).children("ul:first-child").height();
					$(this).css("height", Math.round(lUlHeight) * 0.1 + "rem");
				}, 10);
			}
		});
		if (ObjetMenuPrincipal.estMenuEnModeResponsive()) {
			ObjetMenuPrincipal.afficherMasquerMenuResponsive(false);
			$(".navbar-toggler").trigger("focus");
			return;
		}
		const lElement = $("#" + this.Nom.escapeJQ()).find("li");
		lElement.removeClass("focused-in").each(function () {
			if (
				this.classList.contains("avec-sousmenu") &&
				this.classList.contains("item-menu_niveau0")
			) {
				this.setAttribute("aria-expanded", "false");
			}
		});
		ObjetMenuPrincipal.enleverClassScroll(lElement);
	}
	setDonnees(AListeElements, aGenreOnglet, aGenreSousOnglet, aGenreAffichage) {
		this.ListeElements = null;
		this.listeTraitee = new ObjetListeElements_1.ObjetListeElements();
		this.ListeElements = AListeElements;
		const lNbElements = this.ListeElements.count();
		for (let i = 0; i < lNbElements; i++) {
			const lElement = this.ListeElements.get(i);
			if (
				lElement.Actif &&
				lElement.Visible !== false &&
				lElement.profondeur === 0
			) {
				const lNewElement = ObjetElement_1.ObjetElement.create({
					Libelle: lElement.Libelle,
					Numero: lElement.Numero,
					Genre: lElement.Genre,
					Position: lElement.Position,
					Actif: lElement.Actif,
					indice: i,
					libelleHtml: lElement.libelleHtml,
					controleur: lElement.controleur,
					profondeur: lElement.profondeur,
					compteur: lElement.compteur,
				});
				if (lElement.avecClic) {
					lNewElement.avecClic = lElement.avecClic;
				}
				_trouveFils(lNewElement, this.ListeElements, []);
				if (lNewElement.children.count() || lNewElement.avecClic) {
					this.listeTraitee.addElement(lNewElement);
				}
			}
		}
		if (!this.avecSousMenu) {
			const lListePreTraitee = this.listeTraitee;
			this.listeTraitee = new ObjetListeElements_1.ObjetListeElements();
			for (let i = 0; i < lListePreTraitee.count(); i++) {
				const lElement = lListePreTraitee.get(i);
				_traiterFils(
					lElement,
					this.listeTraitee,
					this.ListeElements,
					this.masquerLibelleOnglet,
				);
			}
		} else {
			for (let i = 0; i < this.listeTraitee.count(); i++) {
				const lElement = this.listeTraitee.get(i);
				_formatageFils(
					i,
					lElement,
					this.listeTraitee,
					this.avecPlusieursNiveau,
				);
			}
		}
		this.seulEtActionSurClick =
			this.actionSurClickSiSeul &&
			this.listeTraitee.count() === 1 &&
			(!this.listeTraitee.get(0).children ||
				this.listeTraitee.get(0).children.count() === 0);
		$("#" + this.NomWrapper.escapeJQ()).html("");
		this.NomNiveau = [];
		const lNombreNiveau = this.avecPlusieursNiveau
			? this.listeTraitee.count()
			: 1;
		for (let i = 0; i < lNombreNiveau; i++) {
			const lNiveauAjoute = this.ajouterNiveau();
			const lJqListe = $(
				"#" + this.NomListe.escapeJQ() + this.NomNiveau[lNiveauAjoute],
			);
			lJqListe.html("");
			if (this.avecPlusieursNiveau) {
				const lNiveau = this.listeTraitee.get(lNiveauAjoute);
				if (lNiveau.children) {
					this.remplirListe(
						lJqListe,
						lNiveau.children,
						lNiveau.profondeur,
						true,
					);
				} else {
					$("#" + this.NomCombo.escapeJQ() + lNiveauAjoute).addClass(
						"has-submenu",
					);
				}
				this.setLibelleOnglet(lNiveau, lNiveauAjoute);
				$("#" + this.NomCombo.escapeJQ() + lNiveauAjoute).data(
					"indice",
					lNiveau.indice,
				);
			} else {
				this.remplirListe(lJqListe, this.listeTraitee, 0);
				if (this.listeTraitee.count() === 0) {
					$("#" + this.NomCombo.escapeJQ() + lNiveauAjoute).css({
						display: "none",
					});
				}
			}
			if (this.avecSousMenuVisible) {
				lJqListe.addClass("avecSousMenuVisible");
			} else {
				lJqListe
					.find("li > ul > li:only-child")
					.parent()
					.css({ display: "none" })
					.parent()
					.removeClass("has-submenu");
			}
			if (this.avecCompteur) {
				let lListe = this.listeTraitee;
				if (this.avecPlusieursNiveau) {
					lListe = this.listeTraitee.get(lNiveauAjoute).children;
					lListe.parcourir((aEle) => {
						if (aEle.children) {
							lListe.add(aEle.children);
						}
					});
				}
				const lThis = this;
				lJqListe.find("li").each(function () {
					const lListeElement = lListe.getListeElements((aEle) => {
						return aEle.indice === $(this).data("indice");
					});
					const lElement =
						lListeElement.count() === 1 ? lListeElement.get(0) : null;
					const lCompteur = _calculerCompteur(lElement);
					if (lElement && lCompteur) {
						$(this)
							.find("> .label-menu-container")
							.append(lThis.getHtmlCompteurNotif(lCompteur));
					}
				});
			}
		}
		if (aGenreOnglet !== undefined && aGenreOnglet !== null) {
			this.setOnglet(aGenreOnglet, aGenreSousOnglet, aGenreAffichage);
		}
	}
	getHtmlCompteurNotif(aNb) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("span", { class: "badge", "aria-hidden": "true" }, aNb),
			IE.jsx.str(
				"span",
				{ class: Divers_css_1.StylesDivers.srOnly },
				" - ",
				aNb === 0
					? ObjetCentraleNotifications_1.TradObjetCentraleNotifications
							.AucuneNotification
					: aNb === 1
						? ObjetCentraleNotifications_1.TradObjetCentraleNotifications.Notification_S.format(
								[aNb],
							)
						: ObjetCentraleNotifications_1.TradObjetCentraleNotifications.Notifications_S.format(
								[aNb],
							),
			),
		);
	}
	changeResponsive() {
		let lResponsive = ObjetMenuPrincipal.estMenuEnModeResponsive();
		if (lResponsive) {
			$(`#${this.Nom.escapeJQ()} li.menuitem-niveau`).attr("tabindex", "0");
			$(`#${this.Nom.escapeJQ()} li.menuitem-niveau.avec-sousmenu`).attr(
				"aria-expanded",
				"false",
			);
		} else {
			$("#" + this.Nom.escapeJQ())
				.find("li.focused-in")
				.removeClass("focused-in");
			$(
				`#${this.Nom.escapeJQ()} li.menuitem-niveau:not(.menuitem-niveau-tabindex)`,
			).attr("tabindex", "-1");
			$(
				`#${this.Nom.escapeJQ()} li.menuitem-niveau.menuitem-niveau-tabindex`,
			).attr("tabindex", "0");
			$(`#${this.Nom.escapeJQ()} li.menuitem-niveau.avec-sousmenu`).attr(
				"aria-expanded",
				"true",
			);
		}
	}
	remplirListe(aJqContainer, aListe, aProfondeurListe, aAvecNavTab) {
		const lNiveau = (aProfondeurListe || 0) + 1;
		const lClassUL = "menu-principal_niveau" + lNiveau;
		aJqContainer.append(IE.jsx.str("ul", { role: "menu", class: lClassUL }));
		const lJqUl = aJqContainer.children("ul:last-child");
		for (let i = 0; aListe && i < aListe.count(); i++) {
			const lElement = aListe.get(i);
			const lAvecSousMenu =
				lElement.profondeur < this.niveauMaximum &&
				lElement.children &&
				lElement.children.count() > 0;
			const lClassCss = [];
			const lHtml = this.composeElementListe(
				lElement,
				aProfondeurListe,
				lClassCss,
				aAvecNavTab,
			);
			lJqUl.append(lHtml);
			const lJqLastLi = lJqUl.children("li:last-child");
			if (lAvecSousMenu) {
				if (!this.avecSousMenuVisible && lElement.children.count() > 1) {
					lJqLastLi.addClass("submenu-active");
				}
				lJqLastLi.addClass(
					this.avecGroupeCliquable ? "has-submenu" : "not-clickable",
				);
				this.remplirListe(
					lJqLastLi,
					lElement.children,
					lElement.profondeur,
					aAvecNavTab,
				);
			} else if (lElement.profondeur === 0) {
				if (lElement.avecClic) {
					lJqLastLi.addClass("has-submenu");
					lJqLastLi.addClass("is-member-accueil");
				} else {
					lJqLastLi.slideUp(0);
				}
			}
		}
	}
	composeElementListe(aElement, aProfondeurListe, aClassCss, aAvecNavTab) {
		const lAvecSousMenu =
			aElement.profondeur < this.niveauMaximum &&
			aElement.children &&
			aElement.children.count() > 0;
		const lAvecTabIndex = aAvecNavTab && aElement.profondeur === 0;
		const lAvecNavTab =
			ObjetMenuPrincipal.estMenuEnModeResponsive() || lAvecTabIndex;
		const lAvecSousMenuDeploiement =
			lAvecSousMenu && aElement.profondeur > 0 && aElement.children.count() > 1;
		const lHtml = IE.jsx.str(
			"li",
			{
				role: "menuitem",
				tabindex: lAvecNavTab ? 0 : -1,
				"data-genre": aElement.getGenre(),
				"data-indice": aElement.indice,
				class: [
					"item-menu_niveau" + ((aProfondeurListe || 0) + 1),
					aClassCss.join(" "),
					"menuitem-niveau",
					lAvecTabIndex ? "menuitem-niveau-tabindex" : "",
					lAvecSousMenuDeploiement ? "avec-sousmenu" : "",
					!this.avecGroupeCliquable &&
					aElement.children &&
					aElement.children.count() > 0
						? " SansMain"
						: "",
				],
			},
			IE.jsx.str(
				"div",
				{ class: "label-menu-container" },
				IE.jsx.str(
					"div",
					{
						role: aElement.profondeur < 1 ? "presentation" : false,
						class: "label-submenu",
					},
					aElement.libelleHtml ||
						(this.avecSousMenu
							? aElement.getLibelle()
							: aElement.libelleLong || aElement.getLibelle()),
				),
			),
		);
		return lHtml;
	}
	ouvrirPremierNiveau() {
		$("#" + (this.NomListe + this.NomNiveau[0]).escapeJQ()).trigger(
			"mouseover",
		);
	}
	surValidation(AInteractionUtilisateur, ASelection) {
		let lElement = this.ListeElements.get(ASelection);
		if (this.avecPlusieursNiveau) {
			while (lElement.onglet) {
				lElement = lElement.onglet;
			}
			let lIndicePere = 0;
			for (
				lIndicePere = 0;
				lIndicePere < this.ListeElements.count();
				lIndicePere++
			) {
				const lElementPere = this.ListeElements.get(lIndicePere);
				if (
					lElementPere.getNumero() === lElement.getNumero() &&
					lElementPere.getGenre() === lElement.getGenre() &&
					lElementPere.profondeur === 0
				) {
					break;
				}
			}
			this.setCouleurOnglet(lIndicePere);
		}
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			this.InteractionUtilisateur = AInteractionUtilisateur;
			this.selection = ASelection;
			const lElement = this.ListeElements.get(ASelection);
			this.callback.appel(lElement);
			this._fermer();
		});
	}
	setCouleurOnglet(aIndicePere) {
		if (this.bloquerCouleurOnglet) {
			return;
		}
		$('[id^="' + this.NomCombo.escapeJQ() + '"]').each(function (aIndex) {
			if (
				aIndicePere !== undefined &&
				($(this).data("indice") === aIndicePere ||
					(aIndicePere === true && aIndex === 0))
			) {
				$(this).parent().addClass("item-selected");
			} else {
				$(this).parent().removeClass("item-selected");
			}
		});
	}
	setLibelleGenreOnglet(aGenreOnglet) {
		if (this.ListeElements) {
			const lOnglet = this.ListeElements.getElementParNumeroEtGenre(
				null,
				aGenreOnglet,
			);
			this.setLibelleOnglet(lOnglet);
		}
	}
	getLibelleOnglet(aOnglet) {
		return aOnglet.libelleLong ? aOnglet.libelleLong : aOnglet.getLibelle();
	}
	getListeDeGenreOnglet(aGenreOnglet, aTabGenreAGenerer) {
		if (this.ListeElements) {
			let lOnglet = this.ListeElements.getElementParNumeroEtGenre(
				null,
				aGenreOnglet,
			);
			while (lOnglet && lOnglet.onglet) {
				lOnglet = lOnglet.onglet;
			}
			if (!lOnglet) {
				return;
			}
			const lIndice = this.listeTraitee.getIndiceParNumeroEtGenre(
				null,
				lOnglet.getGenre(),
			);
			if (MethodesObjet_1.MethodesObjet.isNumeric(lIndice)) {
				return $(
					"#" + (this.NomListe + this.NomNiveau[lIndice]).escapeJQ(),
				).html();
			} else if (
				aTabGenreAGenerer &&
				aTabGenreAGenerer.includes(aGenreOnglet)
			) {
				const lJqContainerTemp = $("<div></div>"),
					lListeTemp = new ObjetListeElements_1.ObjetListeElements(),
					lOngletGeneration = MethodesObjet_1.MethodesObjet.dupliquer(lOnglet);
				lOngletGeneration.avecClic = true;
				lListeTemp.addElement(lOngletGeneration);
				this.remplirListe(lJqContainerTemp, lListeTemp, lIndice);
				return lJqContainerTemp.html();
			}
			return "";
		}
	}
	getLibelleDOngletDeGenreOnglet(aGenreOnglet) {
		const lLibelleOnglet = [];
		if (this.ListeElements) {
			const lOnglet = this.ListeElements.getElementParNumeroEtGenre(
				null,
				aGenreOnglet,
			);
			if (lOnglet) {
				if (lOnglet.profondeur >= 2 && lOnglet.onglet) {
					lLibelleOnglet.push(this.getLibelleOnglet(lOnglet.onglet));
					lLibelleOnglet.push(" > ");
				}
				lLibelleOnglet.push(this.getLibelleOnglet(lOnglet));
			}
		}
		return lLibelleOnglet.join("");
	}
	setLibelleOnglet(aOnglet, aNiveau, aControleur) {
		aNiveau = aNiveau ? aNiveau : 0;
		const lLibelleComplet = aOnglet ? this.getLibelleOnglet(aOnglet) : "",
			lJqElement = $("#" + this.NomCombo.escapeJQ() + aNiveau);
		if (lJqElement && lJqElement.length) {
			ObjetHtml_1.GHtml.setHtml(lJqElement.get(0), lLibelleComplet, {
				controleur: aControleur,
			});
			if (this.avecCompteurOngletRacine) {
				const lCompteur = _calculerCompteur(this.listeTraitee.get(aNiveau));
				if (lCompteur) {
					lJqElement.append(this.getHtmlCompteurNotif(lCompteur));
				}
			}
		}
	}
	reset() {
		this.setDonnees(new ObjetListeElements_1.ObjetListeElements());
	}
	setOnglet(aGenreOnglet, aGenreSousOnglet, aGenreAffichage) {
		if (aGenreOnglet !== undefined) {
			let lOnglet = this.listeTraitee.getElementParGenre(aGenreOnglet);
			if (
				lOnglet &&
				lOnglet.getActif() &&
				aGenreAffichage !== undefined &&
				aGenreAffichage !== null &&
				lOnglet.children &&
				lOnglet.children.count() > 0
			) {
				lOnglet = lOnglet.children.get(aGenreAffichage);
			}
			if (lOnglet && this.avecPlusieursNiveau) {
				let lElement = this.ListeElements.get(lOnglet.indice);
				while (lElement.onglet) {
					lElement = lElement.onglet;
				}
				let lIndicePere = 0;
				for (
					lIndicePere = 0;
					lIndicePere < this.ListeElements.count();
					lIndicePere++
				) {
					const lElementPere = this.ListeElements.get(lIndicePere);
					if (
						lElementPere.getNumero() === lElement.getNumero() &&
						lElementPere.getGenre() === lElement.getGenre() &&
						lElementPere.profondeur === 0
					) {
						break;
					}
				}
				this.setCouleurOnglet(lIndicePere);
			}
		}
		this._fermer();
	}
	setOngletHP(aGenreOnglet) {
		if (aGenreOnglet !== undefined) {
			let lElement = this.ListeElements.getElementParNumeroEtGenre(
				null,
				aGenreOnglet,
			);
			while (lElement && lElement.onglet) {
				lElement = lElement.onglet;
			}
			let lIndicePere;
			if (lElement && this.avecPlusieursNiveau) {
				for (
					lIndicePere = 0;
					lIndicePere < this.ListeElements.count();
					lIndicePere++
				) {
					const lElementPere = this.ListeElements.get(lIndicePere);
					if (
						lElementPere.getNumero() === lElement.getNumero() &&
						lElementPere.getGenre() === lElement.getGenre() &&
						lElementPere.profondeur === 0
					) {
						break;
					}
				}
			} else {
				lIndicePere = !!lElement;
			}
			this.setCouleurOnglet(lIndicePere);
		}
	}
	setOngletPN(aGenreOnglet) {
		if (aGenreOnglet !== undefined) {
			let lElement = this.ListeElements.getElementParNumeroEtGenre(
				null,
				aGenreOnglet,
			);
			while (lElement && lElement.onglet) {
				lElement = lElement.onglet;
			}
			let lIndicePere;
			if (this.avecPlusieursNiveau) {
				for (
					lIndicePere = 0;
					lIndicePere < this.ListeElements.count();
					lIndicePere++
				) {
					const lElementPere = this.ListeElements.get(lIndicePere);
					if (
						lElementPere.getNumero() === lElement.getNumero() &&
						lElementPere.getGenre() === lElement.getGenre() &&
						lElementPere.profondeur === 0
					) {
						break;
					}
				}
			} else {
				lIndicePere = !!lElement;
			}
			this.setCouleurOnglet(lIndicePere);
		}
	}
	selectionnerSousOnglet(aGenre) {
		for (let I = 0; I < this.ListeElements.count(); I++) {
			if (this.ListeElements.getGenre(I) + "" === aGenre + "") {
				this.surValidation(true, I);
				return;
			}
		}
	}
	ajouterClassScroll(aItemMenuNiv0) {
		if (!this.avecScrollSousMenu) {
			return;
		}
		ObjetMenuPrincipal.ajouterClassScroll(aItemMenuNiv0);
	}
	static ajouterClassScroll(aItemMenuNiv0) {
		if (ObjetMenuPrincipal.estMenuEnModeResponsive()) {
			return;
		}
		ObjetMenuPrincipal.enleverClassScroll(aItemMenuNiv0);
		const lSubmenuWrapper = aItemMenuNiv0.find(".submenu-wrapper");
		if (lSubmenuWrapper) {
			setTimeout(() => {
				if (aItemMenuNiv0.hasClass("focused-in")) {
					lSubmenuWrapper.addClass("avec-scroll");
				}
			}, C_delayAnimationDeploiement);
		}
	}
	static enleverClassScroll(aItemMenuNiv0) {
		const lSubmenuWrapper = aItemMenuNiv0.find(".submenu-wrapper");
		if (lSubmenuWrapper && lSubmenuWrapper.hasClass("avec-scroll")) {
			lSubmenuWrapper.removeClass("avec-scroll");
		}
	}
	static afficherMasquerMenuResponsive(aAfficher) {
		const lMainMenu = $(".objetBandeauEntete_menu");
		const lJSelected = $(".item-selected");
		if (!lMainMenu.hasClass("show-menu") || aAfficher) {
			lMainMenu.addClass("show-menu");
			lJSelected.addClass("focused-in");
			if (lJSelected.hasClass("avec-sousmenu")) {
				lJSelected.get(0).setAttribute("aria-expanded", "true");
			}
			ObjetMenuPrincipal.ajouterClassScroll(lJSelected);
		} else {
			lMainMenu.removeClass("show-menu");
			lJSelected.removeClass("focused-in");
			ObjetMenuPrincipal.enleverClassScroll(lJSelected);
		}
		IEHtml_1.default.refresh();
	}
	static estMenuEnModeResponsive() {
		return $(".navbar-toggler").is(":visible");
	}
}
exports.ObjetMenuPrincipal = ObjetMenuPrincipal;
function _trouveFils(aElement, aListe, aProfondeurDesElements) {
	aElement.children = new ObjetListeElements_1.ObjetListeElements();
	for (let inc = 0; aListe && inc < aListe.count(); inc++) {
		const lElement = aListe.get(inc);
		if (
			lElement.Actif &&
			lElement.Visible !== false &&
			lElement.profondeur === aProfondeurDesElements.length + 1 &&
			lElement.onglet &&
			((MethodesObjet_1.MethodesObjet.isNumeric(aElement.getGenre()) &&
				lElement.onglet.getGenre() === aElement.getGenre()) ||
				lElement.onglet.getLibelle() === aElement.getLibelle())
		) {
			if (
				aProfondeurDesElements.length < 1 ||
				lElement.onglet.onglet.getGenre() ===
					aProfondeurDesElements[0].onglet.getGenre()
			) {
				const lNewElement = ObjetElement_1.ObjetElement.create({
					Libelle: lElement.Libelle,
					Numero: lElement.Numero,
					Genre: lElement.Genre,
					Position: lElement.Position,
					Actif: lElement.Actif,
					libelleLong: lElement.libelleLong,
					indice: inc,
					libelleHtml: lElement.libelleHtml,
					profondeur: lElement.profondeur,
					compteur: lElement.compteur,
				});
				const lNewProfondeurDesElements = aProfondeurDesElements.concat([]);
				lNewProfondeurDesElements.push(lElement);
				aElement.children.addElement(lNewElement);
				if (lNewElement.profondeur < 10) {
					_trouveFils(lNewElement, aListe, lNewProfondeurDesElements);
				}
			}
		}
	}
}
function _traiterFils(
	aElement,
	aListe,
	aListeOriginelle,
	aMasquerLibelleOnglet,
) {
	if (aElement.children && aElement.children.count() > 0) {
		for (let lChild = 0; lChild < aElement.children.count(); lChild++) {
			const lChildElement = aElement.children.get(lChild);
			_traiterFils(
				lChildElement,
				aListe,
				aListeOriginelle,
				aMasquerLibelleOnglet,
			);
		}
	} else if (aListe) {
		const lElementOriginel = aListeOriginelle.get(aElement.indice);
		let lElementPourLibelle = lElementOriginel;
		let lLibelle = lElementPourLibelle.Libelle;
		while (!aMasquerLibelleOnglet && lElementPourLibelle.onglet) {
			lLibelle = lElementPourLibelle.onglet.Libelle + " &gt; " + lLibelle;
			lElementPourLibelle = lElementPourLibelle.onglet;
		}
		const lNewElement = ObjetElement_1.ObjetElement.create({
			Libelle: lLibelle,
			Numero: lElementOriginel.Numero,
			Genre: lElementOriginel.Genre,
			Position: lElementOriginel.Position,
			Actif: lElementOriginel.Actif,
			indice: aElement.indice,
			profondeur: 0,
			avecClic: true,
			libelleLong: lElementOriginel.libelleLong,
			controleur: lElementOriginel.controleur,
			compteur: lElementOriginel.compteur,
		});
		aListe.addElement(lNewElement);
	}
}
function _formatageFils(aIndice, aElement, aListe, aAvecPlsNivx) {
	let lChildElement;
	if (
		(aElement.children && aElement.children.count() > 0) ||
		(aAvecPlsNivx && aElement.profondeur === 0)
	) {
		for (let lChild = 0; lChild < aElement.children.count(); lChild++) {
			lChildElement = aElement.children.get(lChild);
			_formatageFils(lChild, lChildElement, aElement.children, aAvecPlsNivx);
		}
	} else if (aListe && aElement.children && aElement.children.count() === 1) {
		lChildElement = aElement.children.get(0);
		lChildElement.Libelle = lChildElement.libelleLong || lChildElement.Libelle;
		lChildElement.profondeur = aElement.profondeur;
		if (lChildElement.profondeur === 0) {
			lChildElement.avecClic = true;
		}
		aListe.addElement(lChildElement, aIndice);
		if (lChildElement.children.count() > 0) {
			_formatageFils(aIndice, lChildElement, aListe, aAvecPlsNivx);
		}
	}
}
function _calculerCompteur(aElement) {
	let lNb =
		aElement &&
		MethodesObjet_1.MethodesObjet.isNumeric(aElement.compteur) &&
		aElement.compteur > 0
			? aElement.compteur
			: 0;
	if (aElement && aElement.children && aElement.children.count() > 0) {
		for (let k = 0; k < aElement.children.count(); k++) {
			lNb += _calculerCompteur(aElement.children.get(k));
		}
	}
	return lNb;
}

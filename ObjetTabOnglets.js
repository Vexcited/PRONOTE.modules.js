exports.ObjetTabOnglets = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetWAI_1 = require("ObjetWAI");
const ToucheClavier_1 = require("ToucheClavier");
const tag_1 = require("tag");
class ObjetTabOnglets extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		this.idOnglets = this.Nom + "_Onglets";
		this.IdPremierElement = this.idOnglets;
		this.ongletSelectionne = 0;
		this.optionsTabOnglets = {
			afficherOngletUnique: !IE.estMobile,
			avecSwipe: true,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeOnglet(aIndice) {
				$(this.node)
					.on("keyup", (aEvent) => {
						switch (aEvent.which) {
							case ToucheClavier_1.ToucheClavier.FlecheGauche: {
								aInstance._selectOngletSuivant(
									aInstance.ongletSelectionne,
									true,
								);
								break;
							}
							case ToucheClavier_1.ToucheClavier.FlecheDroite: {
								aInstance._selectOngletSuivant(
									aInstance.ongletSelectionne,
									false,
								);
								break;
							}
						}
					})
					.eventValidation(() => {
						aInstance.selectOnglet(aIndice);
					});
			},
		});
	}
	setOptionsTabOnglets(aOptions) {
		$.extend(this.optionsTabOnglets, aOptions);
	}
	setParametres(aListeOnglets) {
		this.setListeOnglets(aListeOnglets);
	}
	construireAffichage(aIdWAI) {
		let lNbrOngletsVisibles = 0;
		if (this.listeOnglets && this.listeOnglets.parcourir) {
			this.listeOnglets.parcourir((aElement) => {
				if (this._estOngletVisible(aElement)) {
					lNbrOngletsVisibles += 1;
				}
			});
		}
		if (
			(this.optionsTabOnglets.afficherOngletUnique &&
				lNbrOngletsVisibles > 0) ||
			(!this.optionsTabOnglets.afficherOngletUnique && lNbrOngletsVisibles > 1)
		) {
			return this.composePage(aIdWAI);
		} else {
			return "";
		}
	}
	setListeOnglets(aListeOnglets) {
		this.listeOnglets = aListeOnglets;
	}
	setDonnees(aListeOnglets, aIndiceOnglet, aAvecCallbackSelection = false) {
		this.setListeOnglets(aListeOnglets);
		this.afficher();
		if (aIndiceOnglet >= 0) {
			this.selectOnglet(aIndiceOnglet, !aAvecCallbackSelection);
		}
		if (this.optionsTabOnglets.avecSwipe && IE.estMobile && this.Pere) {
			const lJPage = $(
				`#${this.Pere.getNom().escapeJQ()}.objetInterfaceMobile_identPage`,
			);
			if (lJPage.length === 1) {
				const lInstance = this;
				lJPage.off("swipeleft.tabonglet swiperight.tabonglet").on({
					"swiperight.tabonglet": function () {
						lInstance._selectOngletSuivant(lInstance.ongletSelectionne, true);
					},
					"swipeleft.tabonglet": function () {
						lInstance._selectOngletSuivant(lInstance.ongletSelectionne, false);
					},
				});
				$(`#${this.Nom.escapeJQ()}`).on("destroyed", () => {
					lJPage.off("swipeleft.tabonglet swiperight.tabonglet");
				});
			}
		}
	}
	composePage(aIdWAI) {
		const lHtml = [];
		lHtml.push(
			'<div class="menu-tabs" id="',
			this.idOnglets,
			'" ',
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Tablist),
			">",
			this._composeOnglets(aIdWAI),
			"</div>",
		);
		return lHtml.join("");
	}
	setLibelleOngletDIndice(aIndice, aLibelle) {
		const lID = this.getIdOnglet(aIndice);
		const lElmOnglet = this.listeOnglets.get(aIndice);
		lElmOnglet.setLibelle(aLibelle);
		ObjetHtml_1.GHtml.setHtml("nav_" + lID, aLibelle);
	}
	getIdOnglet(i) {
		return this.Nom + "_Tab_" + i;
	}
	getIdPanel(i) {
		return this.Nom + "_Panel_" + i;
	}
	selectOnglet(i, aSansCallback = false) {
		const lIdCourant = this.getIdOnglet(this.ongletSelectionne);
		const lIdNouveau = this.getIdOnglet(i);
		const lElement = this.listeOnglets.get(i);
		ObjetHtml_1.GHtml.delClass("tab_" + lIdCourant, "selected");
		$(`#nav_${lIdCourant.escapeJQ()}`)
			.removeClass("sel")
			.attr("aria-selected", "false")
			.attr("tabindex", "-1");
		this.ongletSelectionne = i;
		ObjetHtml_1.GHtml.addClass("tab_" + lIdNouveau, "selected");
		$(`#nav_${lIdNouveau.escapeJQ()}`)
			.addClass("sel")
			.attr("aria-selected", "true")
			.attr("tabindex", "0");
		if (this.listeOnglets && this.listeOnglets.parcourir) {
			this.listeOnglets.parcourir((aOnglet) => {
				if (aOnglet.idDiv) {
					const lJOnglet = $(`#${aOnglet.idDiv.escapeJQ()}`);
					if (aOnglet === lElement && this._estOngletVisible(aOnglet)) {
						lJOnglet.show();
					} else {
						lJOnglet.hide();
					}
				}
			});
		}
		if (!aSansCallback) {
			this.callback.appel(lElement);
			this.$refresh();
		}
	}
	getIndiceOngletSelectionne() {
		return this.ongletSelectionne;
	}
	getOngletSelectionne() {
		return this.listeOnglets.get(this.ongletSelectionne);
	}
	estOngletDIndiceVisible(aIndice) {
		const lOnglet = this.listeOnglets.get(aIndice);
		return this._estOngletVisible(lOnglet);
	}
	_composeOnglets(aIdWAI) {
		const lHtml = [];
		let i = 0;
		let idCourant = "";
		for (i = 0; i < this.listeOnglets.count(); i++) {
			const lElmOnglet = this.listeOnglets.get(i);
			if (this._estOngletVisible(lElmOnglet)) {
				const lLibelle = lElmOnglet.Libelle;
				idCourant = this.getIdOnglet(i);
				lHtml.push(
					'<div id="div_',
					idCourant,
					'" class="tab-item" role="presentation">',
					'<div id="tab_',
					idCourant,
					'" class="tab-content" role="presentation">',
					(0, tag_1.tag)(
						"div",
						{
							id: `nav_${idCourant}`,
							role: "tab",
							class: "libelle",
							tabindex: "-1",
							"ie-node": tag_1.tag.funcAttr("getNodeOnglet", i),
							"aria-describedby": aIdWAI ? aIdWAI : false,
							"aria-selected": "false",
						},
						lLibelle,
					),
					"</div>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
	_estOngletVisible(aOnglet) {
		return !!aOnglet && !aOnglet.invisible && aOnglet.getActif();
	}
	_selectOngletSuivant(aIndiceOnglet, aPrecedent) {
		if (this.listeOnglets && this.listeOnglets.parcourir) {
			const lFunc = (aIndice) => {
				const lOnglet = this.listeOnglets.get(aIndice);
				if (this._estOngletVisible(lOnglet)) {
					this.selectOnglet(aIndice);
					ObjetHtml_1.GHtml.setFocus("nav_" + this.getIdOnglet(aIndice));
					return true;
				}
			};
			if (aPrecedent) {
				for (let i = aIndiceOnglet - 1; i >= 0; i--) {
					if (lFunc(i)) {
						return;
					}
				}
				lFunc(this.listeOnglets.count() - 1);
			} else {
				for (let i = aIndiceOnglet + 1; i < this.listeOnglets.count(); i++) {
					if (lFunc(i)) {
						return;
					}
				}
				lFunc(0);
			}
		}
	}
}
exports.ObjetTabOnglets = ObjetTabOnglets;

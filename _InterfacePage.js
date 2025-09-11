exports._InterfacePage = void 0;
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const _InterfacePageProduit_1 = require("_InterfacePageProduit");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetInterface_1 = require("ObjetInterface");
const _ObjetInterfaceEspaceCP_1 = require("_ObjetInterfaceEspaceCP");
const AccessApp_1 = require("AccessApp");
class _InterfacePage extends _InterfacePageProduit_1._InterfacePageProduit {
	constructor(...aParams) {
		super(...aParams);
		this._idAddZoneBandeau = GUID_1.GUID.getId();
	}
	construireStructureAffichageBandeau() {
		const lHTML = [];
		let lGenre, lGenrePourLargeurComplete;
		let lAlignementDroite = true;
		const lExisteGenre = {};
		let lInfos;
		const lInfosSurZone = [];
		for (let I = 0; I < this.AddSurZone.length; I++) {
			lInfosSurZone.push(this._getInfosSurZone(I));
		}
		for (let I = 0; I < this.AddSurZone.length; I++) {
			lInfos = lInfosSurZone[I];
			if (lInfos.ident !== undefined && lInfos.ident !== null) {
				lGenre = this.GenreAffichage[lInfos.ident];
				lExisteGenre[lGenre + ""] = true;
			}
			lAlignementDroite = lAlignementDroite && lInfos.alignementDroite;
		}
		const lOrdreGenre = this.getPrioriteAffichageBandeauLargeur();
		for (let I in lOrdreGenre) {
			lGenre = lOrdreGenre[I];
			if (
				(lGenrePourLargeurComplete === null ||
					lGenrePourLargeurComplete === undefined) &&
				lExisteGenre[lGenre + ""]
			) {
				lGenrePourLargeurComplete = lGenre;
			}
		}
		if (lAlignementDroite && this.AddSurZone.length > 0) {
			lHTML.push(IE.jsx.str("div", { class: "objetBandeauEntete_fullsize" }));
			if (lGenrePourLargeurComplete === undefined) {
				lGenrePourLargeurComplete = true;
			}
		}
		let lEstDansBlocUl = false;
		let lCptBloc = 0;
		for (let I = 0; I < this.AddSurZone.length; I++) {
			lInfos = lInfosSurZone[I];
			lGenre =
				lInfos.ident !== undefined && lInfos.ident !== null
					? this.GenreAffichage[lInfos.ident]
					: null;
			if (lInfos.blocGauche) {
				lHTML.push('<ul class="objetBandeauEntete_AddSurZone_wrapper">');
				lCptBloc += 1;
				lEstDansBlocUl = true;
			} else if (lInfos.blocDroit) {
				lEstDansBlocUl = false;
				lHTML.push("</ul>");
				lCptBloc -= 1;
			} else if (lInfos.separateur) {
				lHTML.push(
					lEstDansBlocUl
						? IE.jsx.str("li", {
								class: "objetBandeauEntete_fullsize",
								"aria-hidden": "true",
							})
						: IE.jsx.str("div", { class: "objetBandeauEntete_fullsize" }),
				);
				if (lGenrePourLargeurComplete === undefined) {
					lGenrePourLargeurComplete = true;
				}
			} else if (this.Instances[lInfos.ident] || lInfos.html) {
				const lAttrs = {
					id: lInfos.html
						? this.getIdZoneBandeauDIndice(I)
						: this.Instances[lInfos.ident].getNom(),
					"ie-display": lInfos.getDisplay ? lInfos.getDisplay : "",
					class: "element-bandeau-wrapper",
				};
				const lHtml = lInfos.html && !lInfos.controleur ? lInfos.html : "";
				lHTML.push(
					lEstDansBlocUl
						? IE.jsx.str("li", Object.assign({}, lAttrs), lHtml)
						: IE.jsx.str("div", Object.assign({}, lAttrs), lHtml),
				);
			}
		}
		if (lGenrePourLargeurComplete === undefined) {
			lHTML.push(IE.jsx.str("div", { class: "objetBandeauEntete_fullsize" }));
		}
		ObjetHtml_1.GHtml.setDisplay(
			(0, AccessApp_1.getApp)().idLigneBandeau,
			true,
		);
		ObjetHtml_1.GHtml.addHtml(
			(0, AccessApp_1.getApp)().idLigneBandeau,
			lHTML.join(""),
			{ controleur: this.controleur },
		);
		for (let I = 0; I < this.AddSurZone.length; I++) {
			lInfos = lInfosSurZone[I];
			if (lInfos.controleur) {
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneBandeauDIndice(I),
					lInfos.html,
					{ controleur: lInfos.controleur },
				);
			}
		}
		if (
			this.Pere &&
			this.Pere instanceof ObjetInterface_1.ObjetInterface &&
			this.Pere.surResizeInterface
		) {
			this.Pere.surResizeInterface();
		}
		this.surResizeInterface();
	}
	getIdZoneBandeauDIndice(aIndice) {
		return `${this._idAddZoneBandeau}_bandzone_${aIndice}`;
	}
	reinitialiser() {
		super.reinitialiser();
		this.AddSurZone = [];
		if (
			this.Pere &&
			this.Pere instanceof _ObjetInterfaceEspaceCP_1._ObjetInterfaceEspaceCP
		) {
			$("#" + (0, AccessApp_1.getApp)().idLigneBandeau.escapeJQ())
				.children(
					":not(#" + (0, AccessApp_1.getApp)().idBreadcrumb.escapeJQ() + ")",
				)
				.remove();
		}
	}
	setBandeau(aHtml) {
		ObjetHtml_1.GHtml.setDisplay(
			(0, AccessApp_1.getApp)().idLigneBandeau,
			true,
		);
		ObjetHtml_1.GHtml.addHtml((0, AccessApp_1.getApp)().idLigneBandeau, aHtml, {
			controleur: this.controleur,
		});
		if (
			this.Pere &&
			this.Pere instanceof ObjetInterface_1.ObjetInterface &&
			this.Pere.surResizeInterface
		) {
			this.Pere.surResizeInterface();
		}
		this.surResizeInterface();
	}
	afficherBandeau(aAfficher) {
		let lIdent, lInfos;
		for (const I in this.AddSurZone) {
			lInfos = this._getInfosSurZone(parseInt(I));
			if (!lInfos.getDisplay) {
				lIdent =
					lInfos.ident !== undefined && lInfos.ident !== null
						? lInfos.ident
						: null;
				if (lInfos.html) {
					ObjetStyle_1.GStyle.setVisible(
						this.getIdZoneBandeauDIndice(I),
						aAfficher,
					);
				} else if (this.conditionSuppAfficherBandeau(lIdent)) {
					ObjetStyle_1.GStyle.setVisible(
						this.Instances[lIdent].getNom(),
						aAfficher,
					);
				}
			}
		}
	}
	evenementAfficherMessage(aGenreMessage) {}
	conditionSuppAfficherBandeau(aIdent) {
		return false;
	}
}
exports._InterfacePage = _InterfacePage;

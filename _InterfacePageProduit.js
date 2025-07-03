exports._InterfacePageProduit = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
class _InterfacePageProduit extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this._idAddZoneBandeau = GUID_1.GUID.getId();
		this.contexte = {
			niveauCourant: 0,
			selection: [],
			guidRef: GUID_1.GUID.getId(),
		};
	}
	setOptionsEcrans(aOptions) {
		this.optionsEcrans = aOptions;
	}
	getIdDeNiveau(aParam) {
		return this.contexte.guidRef + "_" + aParam.niveauEcran;
	}
	setCtxEcran(aParam) {
		this.contexte.ecran[aParam.niveauEcran] = aParam.genreEcran;
	}
	getCtxEcran(aParam) {
		return this.contexte.ecran[aParam.niveauEcran];
	}
	setCtxSelection(aParam) {
		this.contexte.selection[aParam.niveauEcran] = aParam.dataEcran;
	}
	getCtxSelection(aParam) {
		const lContexte =
			aParam.contexte !== null && aParam.contexte !== undefined
				? aParam.contexte
				: this.contexte;
		return lContexte.selection[aParam.niveauEcran];
	}
	getNiveauDeGenreEcran(aParam) {
		for (let i = 0, lNbr = this.optionsEcrans.nbNiveaux; i < lNbr; i++) {
			if (this.contexte.ecran[i] === aParam.genreEcran) {
				return i;
			}
		}
		return null;
	}
	basculerVisibiliteEcran(aParam) {
		if (this.optionsEcrans.avecBascule) {
			for (let i = 0, lNbr = this.optionsEcrans.nbNiveaux; i < lNbr; i++) {
				const lGuid = this.getIdDeNiveau({ niveauEcran: i });
				$("#" + lGuid.escapeJQ()).css(
					"display",
					i === aParam.niveauEcran ? "" : "none",
				);
			}
		}
		this.contexte.niveauCourant = aParam.niveauEcran;
	}
	basculerVisibiliteSurGenreEcran(aGenreEcran) {
		const lNiveauEcran = this.getNiveauDeGenreEcran({
			genreEcran: aGenreEcran,
		});
		if (lNiveauEcran !== null) {
			this.basculerVisibiliteEcran({ niveauEcran: lNiveauEcran });
		}
	}
	basculerEcran(aEcranPrec, aEcranSuiv) {
		if (aEcranSuiv !== null && aEcranSuiv !== undefined) {
			this.setCtxEcran({
				niveauEcran: aEcranSuiv.niveauEcran,
				genreEcran: aEcranSuiv.genreEcran,
			});
		}
		if (aEcranPrec !== null && aEcranPrec !== undefined) {
			this.setCtxSelection({
				niveauEcran: aEcranPrec.niveauEcran,
				dataEcran: aEcranPrec.dataEcran,
			});
		}
		this.basculerVisibiliteSurGenreEcran(aEcranSuiv.genreEcran);
		return this.construireEcran(aEcranSuiv);
	}
	construireEcran(aParams) {}
	revenirSurEcranPrecedent() {
		const lEcranSrc = {
			niveauEcran: this.contexte.niveauCourant,
			genreEcran: this.getCtxEcran({
				niveauEcran: this.contexte.niveauCourant,
			}),
		};
		const lEcranDest = {
			niveauEcran: this.contexte.niveauCourant - 1,
			genreEcran: this.getCtxEcran({
				niveauEcran: this.contexte.niveauCourant - 1,
			}),
		};
		this.basculerEcran(lEcranSrc, lEcranDest);
	}
	setHtmlStructureAffichageBandeau(aHtml) {
		ObjetHtml_1.GHtml.setHtml((0, AccessApp_1.getApp)().idLigneBandeau, aHtml, {
			controleur: this.controleur,
			instance: this,
		});
	}
	construireBandeauEcran(aHtmlMetier, aParam) {
		const H = [];
		H.push(
			'<header class="nav-page-profonde-container',
			aParam && aParam.bgWhite ? " bg-white" : "",
			aParam && aParam.class ? ` ${aParam.class}` : "",
			'">',
		);
		H.push(
			IE.jsx.str("ie-btnimage", {
				"ie-model": this.jsxBtnRetourEcranPrec.bind(this),
				class: "fleche-nav btnImageIcon icon_retour_mobile",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur("Precedent"),
			}),
		);
		H.push(
			"<div ",
			aParam && aParam.avecRetourSurContenuBandeau === true
				? ' ie-node="retourEcranPrecSurContenu" '
				: "",
			' class="nav-container">',
			aHtmlMetier,
			"</div>",
		);
		H.push("</header>");
		return H.join("");
	}
	jsxBtnRetourEcranPrec() {
		return {
			event: () => {
				this.revenirSurEcranPrecedent();
			},
		};
	}
	_getInfosSurZone(aIndice) {
		const lElement =
			typeof aIndice === "number" ? this.AddSurZone[aIndice] : aIndice;
		return $.extend(
			{
				ident: typeof lElement === "number" ? lElement : null,
				html: null,
				controleur: null,
				getDisplay: null,
				alignementDroite: false,
				separateur: false,
			},
			lElement,
		);
	}
	getPrioriteAffichageBandeauLargeur() {
		return [];
	}
	setBandeau(aHtml) {}
	afficherBandeau(aAfficher) {}
	composeAucuneDonnee(aHtml) {
		return ObjetHtml_1.GHtml.composeFondAucuneDonnee(aHtml);
	}
	afficherMessage(aMessage) {
		if (!this.existeInstance(this.IdentZoneAlClient)) {
			return;
		}
		ObjetHtml_1.GHtml.setHtml(
			this.getInstance(this.IdentZoneAlClient).getNom(),
			this.composeAucuneDonnee(aMessage),
		);
	}
}
exports._InterfacePageProduit = _InterfacePageProduit;

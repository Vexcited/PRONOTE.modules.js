exports.InterfacePage_Mobile = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const _InterfacePageProduit_1 = require("_InterfacePageProduit");
const AccessApp_1 = require("AccessApp");
class InterfacePage_Mobile extends _InterfacePageProduit_1._InterfacePageProduit {
	constructor(...aParams) {
		super(...aParams);
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Verticale;
		this.avecBandeau = true;
	}
	setParametresGeneraux() {
		this.AvecCadre = false;
		this.IdentZoneAlClient = this.identPage;
	}
	setGenreAffichage(aGenreAffichage) {
		this.genreAffichage = aGenreAffichage;
	}
	construireStructureAffichageVerticale() {
		const H = [];
		let lInfo;
		if (this.AddSurZone.length) {
			this.construireStructureAffichageBandeau();
		} else {
			$("#" + (0, AccessApp_1.getApp)().idLigneBandeau.escapeJQ())
				.html("")
				.hide();
		}
		const lTabAffichages = [];
		for (let I = 0; I < this.NombreGenreAffichage; I++) {
			if (
				!this.appartientAZone(I) &&
				!this.getObjetGraphique(this.GenreAffichage[I]).estFenetre
			) {
				if (this.getObjetGraphique(this.GenreAffichage[I])) {
					lInfo = { estZoneClient: this.IdentZoneAlClient === I, indice: I };
				}
				lTabAffichages.push(lInfo);
			}
		}
		for (let I = 0; I < lTabAffichages.length; I++) {
			lInfo = lTabAffichages[I];
			H.push("<div ");
			H.push('id="' + this.getZoneId(lInfo.indice) + '">');
			H.push("</div>");
		}
		return H.join("");
	}
	construireStructureAffichageBandeau() {
		const H = [];
		let lInfo;
		const lTabAffichages = [];
		for (let I = 0; I < this.NombreGenreAffichage; I++) {
			if (
				this.appartientAZone(I) &&
				!this.getObjetGraphique(this.GenreAffichage[I]).estFenetre
			) {
				lInfo = { estZoneClient: this.IdentZoneAlClient === I, indice: I };
				lTabAffichages.push(lInfo);
			}
		}
		for (let I = 0; I < lTabAffichages.length; I++) {
			lInfo = lTabAffichages[I];
			H.push("<div ");
			H.push('id="' + this.getZoneId(lInfo.indice) + '">');
			H.push("</div>");
		}
		for (let I = 0, lNbr = this.AddSurZone.length; I < lNbr; I++) {
			const lInfo = this._getInfosSurZone(I);
			if (lInfo && lInfo.html) {
				H.push("<div ");
				H.push(
					'id="' + this._idAddZoneBandeau + I + '" ',
					lInfo.getDisplay ? ' ie-display="' + lInfo.getDisplay + '"' : "",
					" >",
				);
				H.push(lInfo.html && !lInfo.controleur ? lInfo.html : "");
				H.push("</div>");
			}
		}
		ObjetHtml_1.GHtml.setHtml(
			(0, AccessApp_1.getApp)().idLigneBandeau,
			H.join(""),
			{ controleur: this.controleur, instance: this },
		);
		$("#" + (0, AccessApp_1.getApp)().idLigneBandeau.escapeJQ()).show();
		for (let I = 0, lNbr = this.AddSurZone.length; I < lNbr; I++) {
			const lInfo = this._getInfosSurZone(I);
			if (lInfo.controleur) {
				ObjetHtml_1.GHtml.setHtml(this._idAddZoneBandeau + I, lInfo.html, {
					controleur: lInfo.controleur,
				});
			}
		}
	}
}
exports.InterfacePage_Mobile = InterfacePage_Mobile;

exports.ObjetInfoBase = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_2 = require("ObjetStyle");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetInfoBase extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = GApplication;
		this.objetCouleurConsoles = GCouleur;
		this.donneesRecues = false;
	}
	setParametres(aNomBase) {
		this.nomBase = aNomBase;
		this.donneesRecues = true;
	}
	estServeurHttpActif() {
		var _a, _b;
		return !!((_b =
			(_a = this.objetApplicationConsoles) === null || _a === void 0
				? void 0
				: _a.etatServeurHttp) === null || _b === void 0
			? void 0
			: _b.getEtatActif());
	}
	estServeurHttpConnecteAuServeur() {
		var _a, _b;
		return !!((_b =
			(_a = this.objetApplicationConsoles) === null || _a === void 0
				? void 0
				: _a.etatServeurHttp) === null || _b === void 0
			? void 0
			: _b.getConnecteAuServeur());
	}
	construireAffichage() {
		if (this.donneesRecues) {
			const H = [];
			H.push(
				'<table id="',
				this.Nom,
				'_Bandeau" class="Texte11 full-width" style="height:28px;">',
				"<tr>",
				"<td>",
				'<div id="',
				this.Nom,
				'_Etat" style="width: 160px;" class="EspaceGauche">',
				this.afficherEtatServeur(),
				"</div>",
				"</td>",
				'<td><div id="',
				this.Nom,
				'_Trait" style="height: 19px; ',
				ObjetStyle_2.GStyle.composeCouleurBordure(
					this.estServeurHttpActif()
						? this.objetCouleurConsoles.enService.texte
						: GCouleur.texte,
					1,
					ObjetStyle_1.EGenreBordure.droite,
				),
				'">&nbsp;</div></td>',
				'<td class="EspaceGauche Insecable">' +
					(this.estServeurHttpConnecteAuServeur()
						? ObjetTraduction_1.GTraductions.getValeur(
								"zoneInfosPrincipales.base",
							)
						: "") +
					"</td>",
				'<td class="EspaceGauche Insecable Gras" style="width: 100%">' +
					(this.estServeurHttpConnecteAuServeur()
						? ObjetChaine_1.GChaine.insecable(this.nomBase)
						: "") +
					"</td>",
				"</tr>",
				"</table>",
			);
			return H.join("");
		}
		return "&nbsp;";
	}
	afficherEtatServeur() {
		let lStrBasePubliee;
		if (this.estServeurHttpActif()) {
			lStrBasePubliee = ObjetTraduction_1.GTraductions.getValeur(
				"zoneInfosPrincipales.basePubliee",
			);
		} else {
			lStrBasePubliee = ObjetTraduction_1.GTraductions.getValeur(
				"zoneInfosPrincipales.baseNonPubliee",
			);
		}
		const H = [];
		H.push(
			this.estServeurHttpActif()
				? '<div style="float: left;" class="Image_Diode_Actif">&nbsp;</div>'
				: '<div style="float: left;" class="Image_Diode_Inactif">&nbsp;</div>',
		);
		H.push(
			'<table style="float; left; height: 19px;"><tr><td style="' +
				ObjetStyle_2.GStyle.composeCouleurTexte(
					this.estServeurHttpActif()
						? this.objetCouleurConsoles.enService.texte
						: this.objetCouleurConsoles.enService.texteRouge,
				) +
				'" class="EspaceGauche Texte12">',
			ObjetChaine_1.GChaine.insecable(lStrBasePubliee),
			"</td></tr></table>",
		);
		return H.join("");
	}
}
exports.ObjetInfoBase = ObjetInfoBase;

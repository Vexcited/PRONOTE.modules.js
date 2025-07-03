exports.ObjetFenetre_InstallPronote = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_InstallPronote extends ObjetFenetre_1.ObjetFenetre {
	setParametres(aUrlInstClient, aUrlParamClient, aDesignationClient) {
		this.urlInstClient = aUrlInstClient;
		this.urlParamClient = aUrlParamClient;
		this.designationClient = aDesignationClient;
	}
	composeContenu() {
		const H = [];
		H.push('<ol class="Texte10">');
		H.push(
			"<li>" +
				'<a class="Texte10 Gras" href="' +
				this.urlInstClient +
				'" target="_blank">' +
				ObjetTraduction_1.GTraductions.getValeur("InstallPronote.Installer") +
				"</a>" +
				" " +
				ObjetTraduction_1.GTraductions.getValeur(
					"InstallPronote.SurOrdinateur",
				) +
				"</li>",
		);
		if (this.urlParamClient) {
			H.push(
				'<li class="EspaceHaut">' +
					'<a class="Texte10 Gras" href="' +
					this.urlParamClient +
					'" target="_blank">' +
					ObjetTraduction_1.GTraductions.getValeur("InstallPronote.Appliquer") +
					"</a>" +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"InstallPronote.PourServeur",
					) +
					"</li>",
			);
			H.push(
				'<li class="EspaceHaut">' +
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur("InstallPronote.Cliquer"),
						[this.designationClient],
					) +
					"</li>",
			);
		} else {
			H.push(
				'<li class="EspaceHaut">' +
					ObjetChaine_1.GChaine.replaceRCToHTML(
						ObjetTraduction_1.GTraductions.getValeur(
							"InstallPronote.Parametrer",
						),
					) +
					"</li>",
			);
		}
		H.push("</ol>");
		return H.join("");
	}
}
exports.ObjetFenetre_InstallPronote = ObjetFenetre_InstallPronote;

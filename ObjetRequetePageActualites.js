const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequetePageActualites extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		let lListeCategories = null;
		if (this.JSONReponse.listeCategories) {
			lListeCategories = this.JSONReponse.listeCategories;
			const lCategorie = new ObjetElement(
				GTraductions.getValeur("actualites.ToutesCategories"),
				0,
			);
			lCategorie.toutesLesCategories = true;
			lListeCategories.addElement(lCategorie);
			lListeCategories.setTri([
				ObjetTri.init((D) => {
					return !D.toutesLesCategories;
				}),
				ObjetTri.init("Libelle"),
			]);
			lListeCategories.trier();
		}
		const lTabModeAff = this.JSONReponse.listeModesAff;
		this.callbackReussite.appel({
			listeCategories: lListeCategories,
			tabModeAff: lTabModeAff,
		});
	}
}
Requetes.inscrire("PageActualites", ObjetRequetePageActualites);
module.exports = { ObjetRequetePageActualites };

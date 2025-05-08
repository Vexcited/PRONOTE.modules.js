const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequetePagePunitions extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListePunitions = this.JSONReponse.listePunitions;
		let lPere;
		for (let i = 0; i < lListePunitions.count(); i++) {
			const lElement = lListePunitions.get(i);
			if (!lElement.estUnCumul && lElement.pere) {
				const lGenre = lElement.pere.getGenre();
				lPere = lListePunitions.getElementParGenre(lGenre);
				if (lPere) {
					if (!lPere.nombreSeances) {
						lPere.nombreSeances = 1;
					} else {
						lPere.nombreSeances++;
					}
					lElement.pere = lPere;
				}
			}
		}
		this.callbackReussite.appel(lListePunitions);
	}
}
Requetes.inscrire("PagePunitions", ObjetRequetePagePunitions);
module.exports = ObjetRequetePagePunitions;

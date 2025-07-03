exports.ObjetRequetePagePunitions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePagePunitions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
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
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePagePunitions = ObjetRequetePagePunitions;
CollectionRequetes_1.Requetes.inscrire(
	"PagePunitions",
	ObjetRequetePagePunitions,
);

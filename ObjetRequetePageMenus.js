exports.ObjetRequetePageMenus = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageMenus extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aDate) {
		this.JSON.date = aDate;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			ListeJours: this.JSONReponse.ListeJours,
			DomaineDePresence: this.JSONReponse.DomaineDePresence,
			AvecRepasMidi: this.JSONReponse.AvecRepasMidi,
			AvecRepasSoir: this.JSONReponse.AvecRepasSoir,
			ListeAllergenes: this.JSONReponse.ListeAllergenes,
			Listelabels: this.JSONReponse.Listelabels,
		});
	}
}
exports.ObjetRequetePageMenus = ObjetRequetePageMenus;
CollectionRequetes_1.Requetes.inscrire("PageMenus", ObjetRequetePageMenus);

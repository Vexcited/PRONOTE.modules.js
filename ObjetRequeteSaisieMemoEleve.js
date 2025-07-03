exports.ObjetRequeteSaisieMemoEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieMemoEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		const lEstValorisation = aParametres.estValorisation;
		if (this.JSON.listeMemos) {
			this.JSON.listeMemos.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					aJSON.date = aElement.date;
					if (lEstValorisation) {
						aJSON.commentaire = aElement.commentaire;
						aJSON.estPubliee = aElement.estPubliee;
						if (aElement.dateFinMiseEnEvidence) {
							aJSON.dateFinMiseEnEvidence = aElement.dateFinMiseEnEvidence;
						}
					} else {
						aJSON.publie = aElement.publie;
						aJSON.publieVS = aElement.publieVS;
					}
				},
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieMemoEleve = ObjetRequeteSaisieMemoEleve;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieMemoEleve",
	ObjetRequeteSaisieMemoEleve,
);

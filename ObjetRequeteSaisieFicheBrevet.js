exports.ObjetRequeteSaisieFicheBrevet = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieFicheBrevet extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON = {};
		this.JSON.classe = aParam.classe;
		this.JSON.eleve = aParam.eleve;
		if (aParam.palier) {
			this.JSON.palier = aParam.palier;
		}
		this.JSON.recu = aParam.recu;
		this.JSON.mention = aParam.mention;
		if (aParam.listePiliers) {
			aParam.listePiliers.setSerialisateurJSON({
				methodeSerialisation: _serialisationPiliers.bind(this),
			});
			this.JSON.listePiliers = aParam.listePiliers;
		}
		this.JSON.appGenerale = aParam.appGenerale;
		if (aParam.listeControleContinu) {
			aParam.listeControleContinu.setSerialisateurJSON({
				methodeSerialisation: this.serialisationCC.bind(this),
			});
			this.JSON.listeControleContinu = aParam.listeControleContinu;
		}
		return this.appelAsynchrone();
	}
	serialisationCC(aElement, aJSON) {
		if (!aElement.moyenneAnnuel) {
			return;
		}
		if (
			"moyenne" in aElement.moyenneAnnuel &&
			!aElement.moyenneAnnuel.moyenne.estUneNoteVide()
		) {
			aJSON.moyenneAnnuel = aElement.moyenneAnnuel.moyenne;
			const lProps = ["serviceEleve", "codeMatiereRef", "typeModaliteRef"];
			lProps.forEach((aProps) => {
				if (aProps in aElement) {
					aJSON[aProps] = aElement[aProps];
				}
			});
		}
	}
}
exports.ObjetRequeteSaisieFicheBrevet = ObjetRequeteSaisieFicheBrevet;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieFicheBrevet",
	ObjetRequeteSaisieFicheBrevet,
);
function _serialisationPiliers(aPilier, aJSON) {
	$.extend(aJSON, aPilier.copieToJSON());
}

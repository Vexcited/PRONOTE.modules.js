const { PageCompteMobile } = require("PageCompte.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const ObjetRequeteSaisieInformations = require("ObjetRequeteSaisieInformations.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class InterfacePageCompteMobile extends InterfacePage_Mobile {
	construireInstances() {
		this.identPage = this.add(PageCompteMobile, null, null);
	}
	valider() {
		const lStructure = {};
		if (
			this.getInstance(this.identPage).getStructurePourValidation(lStructure)
		) {
			this.setEtatSaisie(false);
			const lFichiers =
				!!lStructure.signature && !!lStructure.signature.listeFichiers
					? lStructure.signature.listeFichiers
					: new ObjetListeElements();
			new ObjetRequeteSaisieInformations(this, this.surValidation)
				.addUpload({ listeFichiers: lFichiers })
				.lancerRequete(lStructure);
		}
	}
	surValidation() {
		this.getInstance(this.identPage).recupererDonnees();
	}
}
module.exports = { InterfacePageCompteMobile };

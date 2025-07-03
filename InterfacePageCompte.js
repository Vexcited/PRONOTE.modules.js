exports.InterfacePageCompteMobile = void 0;
const PageCompte_1 = require("PageCompte");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetRequeteSaisieInformations_1 = require("ObjetRequeteSaisieInformations");
const ObjetListeElements_1 = require("ObjetListeElements");
class InterfacePageCompteMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	construireInstances() {
		this.identPage = this.add(PageCompte_1.PageCompteMobile, null, null);
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
					: new ObjetListeElements_1.ObjetListeElements();
			new ObjetRequeteSaisieInformations_1.ObjetRequeteSaisieInformations(
				this,
				this.surValidation,
			)
				.addUpload({ listeFichiers: lFichiers })
				.lancerRequete(lStructure);
		}
	}
	surValidation() {
		this.getInstance(this.identPage).recupererDonnees();
	}
}
exports.InterfacePageCompteMobile = InterfacePageCompteMobile;

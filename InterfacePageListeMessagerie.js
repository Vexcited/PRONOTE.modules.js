exports.InterfacePageListeMessagerie = void 0;
const InterfacePage_1 = require("InterfacePage");
const InterfaceListeMessagerie_1 = require("InterfaceListeMessagerie");
const UtilitaireContactVieScolaire_Espace_1 = require("UtilitaireContactVieScolaire_Espace");
class InterfacePageListeMessagerie extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.AvecCadre = false;
	}
	construireInstances() {
		this.identPage = this.add(
			InterfaceListeMessagerie_1.InterfaceListeMessagerie,
			null,
			(aInstance) => {
				aInstance.setOptions({
					utilitaireContactVS:
						UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace,
				});
			},
		);
		this.IdentZoneAlClient = this.identPage;
	}
	recupererDonnees() {
		this.idPremierObjet = this.getInstance(this.identPage).idPremierObjet;
	}
}
exports.InterfacePageListeMessagerie = InterfacePageListeMessagerie;

exports.ObjetRequetePageMesEnfants = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const AccessApp_1 = require("AccessApp");
class ObjetRequetePageMesEnfants extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	lancerRequete() {
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (!!this.JSONReponse.informationsCompte) {
			const LAvecMotDePasseEnClair =
				!!this.JSONReponse.informationsCompte.MotDePasse;
			this.JSONReponse.informationsCompte.MotDePasse = LAvecMotDePasseEnClair
				? ObjetChaine_1.GChaine.ajouterEntites(
						this.applicationSco
							.getCommunication()
							.getChaineDechiffreeAES(
								this.JSONReponse.informationsCompte.MotDePasse,
							),
					)
				: "*****";
			this.JSONReponse.informationsCompte.Identifiant =
				ObjetChaine_1.GChaine.ajouterEntites(
					this.applicationSco
						.getCommunication()
						.getChaineDechiffreeAES(
							this.JSONReponse.informationsCompte.Identifiant,
						),
				);
			this.JSONReponse.informationsCompte.MotDePasseEnClair =
				LAvecMotDePasseEnClair;
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageMesEnfants = ObjetRequetePageMesEnfants;
CollectionRequetes_1.Requetes.inscrire(
	"PageMesEnfants",
	ObjetRequetePageMesEnfants,
);

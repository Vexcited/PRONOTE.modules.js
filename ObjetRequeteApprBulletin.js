exports.ObjetRequeteApprBulletin = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetElement_1 = require("ObjetElement");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteApprBulletin extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = lApplicationSco.getObjetParametres();
	}
	lancerRequete(aParam) {
		const lParam = $.extend(
			{
				ressource: new ObjetElement_1.ObjetElement(),
				periode: new ObjetElement_1.ObjetElement(),
				service: new ObjetElement_1.ObjetElement(),
			},
			aParam,
		);
		this.JSON = {
			ressource: lParam.ressource,
			periode: lParam.periode,
			service: lParam.service,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeLignes) {
			for (const lLigne of this.JSONReponse.listeLignes) {
				if (lLigne.niveauPeriode1) {
					const lNiveauDAcquisitionGlobal =
						this.parametresSco.listeNiveauxDAcquisitions.getElementParNumero(
							lLigne.niveauPeriode1.getNumero(),
						);
					lLigne.niveauPeriode1 = lNiveauDAcquisitionGlobal;
				}
				if (lLigne.niveauPeriode2) {
					const lNiveauDAcquisitionGlobal =
						this.parametresSco.listeNiveauxDAcquisitions.getElementParNumero(
							lLigne.niveauPeriode2.getNumero(),
						);
					lLigne.niveauPeriode2 = lNiveauDAcquisitionGlobal;
				}
			}
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteApprBulletin = ObjetRequeteApprBulletin;
CollectionRequetes_1.Requetes.inscrire(
	"PageApprBulletin",
	ObjetRequeteApprBulletin,
);

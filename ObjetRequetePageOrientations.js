const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequetePageOrientations extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	actionApresRequete() {
		const lParam = {};
		lParam.Message = this.JSONReponse.Message;
		if (!lParam.Message) {
			lParam.TexteNiveau = this.JSONReponse.TexteNiveau;
			if (this.JSONReponse.listeOrientations) {
				lParam.listeOrientations = _organiseListeOrientation.call(
					this,
					this.JSONReponse.listeOrientations,
				);
			}
			lParam.Parametres = this.JSONReponse.Parametres;
			lParam.Niveau = this.JSONReponse.Niveau
				? new ObjetElement().fromJSON(this.JSONReponse.Niveau)
				: null;
			lParam.InfosEleve = this.JSONReponse.InfosEleve;
			lParam.ListeMaquettes = this.JSONReponse.listeMaquettes;
			lParam.listeRubriques = this.JSONReponse.listeRubriques;
			lParam.masquerPictoEtab = this.JSONReponse.masquerPictoEtab;
			lParam.estNiveauPremiere = this.JSONReponse.estNiveauPremiere;
			lParam.estMultiNiveau = this.JSONReponse.estMultiNiveau;
			lParam.rubriqueLV = this.JSONReponse.rubriqueLV;
		}
		this.callbackReussite.appel(lParam);
	}
}
Requetes.inscrire("PageOrientations", ObjetRequetePageOrientations);
function _organiseListeOrientation(aListeOrientations) {
	aListeOrientations.setTri(
		ObjetTri.init((a) => {
			return a.voieMefStat5;
		}),
	);
	aListeOrientations.trier();
	let lVoieCourante;
	const lListeOrganisee = new ObjetListeElements();
	aListeOrientations.parcourir((a) => {
		if (!a.getNumero()) {
			if (a.voieMefStat5 !== lVoieCourante) {
				lVoieCourante = a.voieMefStat5;
				lListeOrganisee.addElement(a);
			}
		} else {
			lListeOrganisee.addElement(a);
		}
	});
	return lListeOrganisee;
}
module.exports = { ObjetRequetePageOrientations };

const { Identite } = require("ObjetIdentite.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetCompte_AutorisationImage extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.param = { autoriserImage: false };
	}
	setDonnees(aParam) {
		$.extend(this.param, aParam);
		this.donneesRecues = true;
		GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			switchAutoriserImage: {
				getValue: function () {
					return !aInstance.param.autoriserImage;
				},
				setValue: function (aValeur) {
					aInstance.param.autoriserImage = !aValeur;
					aInstance.declencherCallback({ estAutorise: !aValeur });
				},
			},
		});
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return _composeAutorisationImage.call(this);
		}
		return "";
	}
	getTitre() {
		return GTraductions.getValeur("ParametresUtilisateur.DroitALImage");
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam);
		}
	}
}
function _composeAutorisationImage() {
	const H = [];
	H.push('<div class="NoWrap">');
	H.push(
		'<ie-switch ie-model="switchAutoriserImage">',
		GTraductions.getValeur("infosperso.autoriserImageParents", [
			GEtatUtilisateur.getMembre().getLibelle(),
			GApplication.nomProduit,
		]),
		"</ie-switch>",
	);
	H.push("</div>");
	return H.join("");
}
module.exports = { ObjetCompte_AutorisationImage };

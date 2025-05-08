const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	DonneesListe_ParametresWidgets,
} = require("DonneesListe_ParametresWidgets.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_ParametresWidgets extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identListeWidgets = this.add(
			ObjetListe,
			null,
			_initialiserListeWidgets,
		);
	}
	setDonnees(aListeDonnees) {
		this.afficher();
		this.getInstance(this.identListeWidgets).setDonnees(
			new DonneesListe_ParametresWidgets(
				aListeDonnees ? aListeDonnees : new ObjetListeElements(),
			),
		);
	}
	surValidation(aGenreBouton) {
		this.callback.appel(aGenreBouton);
		this.fermer();
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div style="height:400px;" id="',
			this.getNomInstance(this.identListeWidgets),
			'"></div>',
		);
		return T.join("");
	}
}
function _initialiserListeWidgets(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		flatDesignMinimal: true,
		avecSelection: false,
		labelWAI: GTraductions.getValeur("accueil.wai.selecWidgets"),
	});
}
module.exports = { ObjetFenetre_ParametresWidgets };

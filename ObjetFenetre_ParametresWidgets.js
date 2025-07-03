exports.ObjetFenetre_ParametresWidgets = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_ParametresWidgets_1 = require("DonneesListe_ParametresWidgets");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ParametresWidgets extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identListeWidgets = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeWidgets,
		);
	}
	setDonnees(aListeDonnees) {
		this.afficher();
		this.getInstance(this.identListeWidgets).setDonnees(
			new DonneesListe_ParametresWidgets_1.DonneesListe_ParametresWidgets(
				aListeDonnees
					? aListeDonnees
					: new ObjetListeElements_1.ObjetListeElements(),
			),
		);
	}
	surValidation(aGenreBouton) {
		this.callback.appel(aGenreBouton);
		this.fermer();
	}
	composeContenu() {
		return IE.jsx.str("div", {
			style: { height: "400px" },
			id: this.getNomInstance(this.identListeWidgets),
		});
	}
	_initialiserListeWidgets(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"accueil.wai.selecWidgets",
			),
		});
	}
}
exports.ObjetFenetre_ParametresWidgets = ObjetFenetre_ParametresWidgets;

exports.ObjetFenetre_SelecteurMembreCP = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_SelecteurMembreCP extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			class: "full-height",
			id: this.getNomInstance(this.identListe),
		});
	}
	setDonnees(aParams) {
		const lBoutons = [];
		if (aParams.listeRessources.count() >= aParams.nbreRecherche) {
			lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
		}
		this.getInstance(this.identListe).setOptionsListe({ boutons: lBoutons });
		this.getInstance(this.identListe).setDonnees(
			this.getDonneesListe(aParams.listeRessources),
		);
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: true,
		});
	}
}
exports.ObjetFenetre_SelecteurMembreCP = ObjetFenetre_SelecteurMembreCP;
ObjetFenetre_SelecteurMembreCP.miniPourRecherche = 10;

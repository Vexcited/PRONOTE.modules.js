exports.ObjetFenetre_ListeMediatheques = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Mediatheques_1 = require("DonneesListe_Mediatheques");
class ObjetFenetre_ListeMediatheques extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ avecTailleSelonContenu: true, largeur: 300 });
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
		);
	}
	setDonnees(aListeMediatheques) {
		this.listeMediatheques = aListeMediatheques;
		this.setOptionsFenetre({
			hauteur: 420,
			titre: ObjetTraduction_1.GTraductions.getValeur("blog.listeMediatheques"),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this.afficher();
		this.getInstance(this.identListe).setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
		this._actualiserListe();
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", {
					style: "height:400px",
					id: this.getInstance(this.identListe).getNom(),
				}),
			),
		);
		return T.join("");
	}
	getParametresValidation(aNumeroBouton) {
		const lParametresValidation = {
			mediathequeDestination: this._getSelectionCourante(),
		};
		return lParametresValidation;
	}
	_evenementSurListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surValidation(1);
				break;
		}
	}
	_actualiserListe() {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Mediatheques_1.DonneesListe_Mediatheques(
				this.listeMediatheques,
			),
		);
	}
	_getSelectionCourante() {
		const lSelections = this.getInstance(
			this.identListe,
		).getListeElementsSelection();
		let lSelection = null;
		if (
			lSelections !== null &&
			lSelections !== undefined &&
			lSelections.count() > 0
		) {
			lSelection = lSelections.get(0);
		}
		return lSelection;
	}
}
exports.ObjetFenetre_ListeMediatheques = ObjetFenetre_ListeMediatheques;

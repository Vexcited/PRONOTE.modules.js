exports.ObjetFenetre_ChoixTypeAppreciation = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_ChoixTypeAppreciation extends ObjetFenetre_1.ObjetFenetre {
	construireInstances() {
		this.identListeTypesAppreciation = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeTypesAppreciation.bind(this),
			this._initialiserListeTypesAppreciation,
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="table-contain full-size" id="',
			this.getInstance(this.identListeTypesAppreciation).getNom(),
			'"></div>',
		);
		return T.join("");
	}
	setDonnees(aListeTypeAppreciation) {
		this.afficher();
		this.listeTypesAppreciation = aListeTypeAppreciation;
		this.setBoutonActif(1, false);
		this.getInstance(this.identListeTypesAppreciation).setDonnees(
			new DonneesListe_ChoixTypeAppreciation(aListeTypeAppreciation),
		);
	}
	_initialiserListeTypesAppreciation(aInstance) {
		const lColonnes = [];
		lColonnes.push({ id: Colonnes.libelle, taille: "100%" });
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	_evenementSurListeTypesAppreciation(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.typeAppreciationCourant = this.listeTypesAppreciation
					.get(aParametres.ligne)
					.getLibelle();
				this.setBoutonActif(1, true);
				break;
		}
	}
}
exports.ObjetFenetre_ChoixTypeAppreciation = ObjetFenetre_ChoixTypeAppreciation;
class DonneesListe_ChoixTypeAppreciation extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case Colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
var Colonnes;
(function (Colonnes) {
	Colonnes["libelle"] = "DL_ChoixTypeAppreciation_libelle";
})(Colonnes || (Colonnes = {}));

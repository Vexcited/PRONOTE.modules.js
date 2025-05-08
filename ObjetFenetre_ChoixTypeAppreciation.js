const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
class ObjetFenetre_ChoixTypeAppreciation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identListeTypesAppreciation = this.add(
			ObjetListe,
			_evenementSurListeTypesAppreciation.bind(this),
			_initialiserListeTypesAppreciation,
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
}
function _initialiserListeTypesAppreciation(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ChoixTypeAppreciation.colonnes.libelle,
		taille: "100%",
	});
	aInstance.setOptionsListe({ colonnes: lColonnes });
}
function _evenementSurListeTypesAppreciation(
	aParametres,
	aGenreEvenementListe,
	aColonne,
	aLigne,
) {
	switch (aGenreEvenementListe) {
		case EGenreEvenementListe.Selection:
			this.typeAppreciationCourant = this.listeTypesAppreciation
				.get(aLigne)
				.getLibelle();
			this.setBoutonActif(1, true);
			break;
	}
}
class DonneesListe_ChoixTypeAppreciation extends ObjetDonneesListe {
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
			case DonneesListe_ChoixTypeAppreciation.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getCouleurCellule() {
		return ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
DonneesListe_ChoixTypeAppreciation.colonnes = {
	libelle: "DL_ChoixTypeAppreciation_libelle",
};
module.exports = { ObjetFenetre_ChoixTypeAppreciation };

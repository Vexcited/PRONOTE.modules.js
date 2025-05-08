const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_EditionMotifs extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.creerIndexUnique("Libelle");
		this.setOptions({
			avecSuppression: false,
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
		});
	}
	getVisible(D) {
		return D.Libelle.length > 0;
	}
	surCreation(D, V) {
		D.Libelle = V[0];
	}
	avecEdition() {
		return GApplication.droits.get(TypeDroits.dossierVS.saisieMotifsDossiersVS);
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
}
module.exports = { DonneesListe_EditionMotifs };

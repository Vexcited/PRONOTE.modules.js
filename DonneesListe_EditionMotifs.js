exports.DonneesListe_EditionMotifs = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const AccessApp_1 = require("AccessApp");
class DonneesListe_EditionMotifs extends ObjetDonneesListe_1.ObjetDonneesListe {
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
		return (0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.dossierVS.saisieMotifsDossiersVS,
		);
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
}
exports.DonneesListe_EditionMotifs = DonneesListe_EditionMotifs;

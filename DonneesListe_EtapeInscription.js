exports.DonneesListe_EtapeInscription = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_EtapeInscription extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecBoutonActionLigne: false,
			avecTri: false,
			avecEvnt_Selection: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneGauche(aParams) {
		const H = [];
		if (aParams.article.Position > 0) {
			const lClasses = ["pastille-etape"];
			if (!aParams.article.Actif) {
				lClasses.push("etape-off");
			}
			H.push("<span class=", lClasses.join(" "), ">");
			H.push(aParams.article.getPosition().toString());
			H.push("</span>");
		} else {
			H.push('<span class="m-x-l">&nbsp;</span>');
		}
		return H.join("");
	}
	avecSelection(aParams) {
		return aParams.article.Actif;
	}
	estLigneOff(aParams) {
		return !aParams.article.Actif;
	}
}
exports.DonneesListe_EtapeInscription = DonneesListe_EtapeInscription;

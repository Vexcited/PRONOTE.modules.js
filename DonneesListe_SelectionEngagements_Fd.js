exports.DonneesListe_SelectionEngagements_Fd = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_Etat_1 = require("Enumere_Etat");
class DonneesListe_SelectionEngagements_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecCB: true, avecCocheCBSurLigne: true });
	}
	getTitreZonePrincipale(aDonnees) {
		let H = [];
		H.push(
			`<div ie-ellipsis class="ie-titre"><span>${aDonnees.article.getLibelle()}</span>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
	getValueCB(aParams) {
		return aParams.article.cmsActif !== undefined
			? aParams.article.cmsActif
			: false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		aParams.article.cmsActif = aValue;
	}
	avecBoutonActionLigne() {
		return false;
	}
}
exports.DonneesListe_SelectionEngagements_Fd =
	DonneesListe_SelectionEngagements_Fd;

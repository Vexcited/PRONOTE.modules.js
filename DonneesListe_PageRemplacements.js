exports.DonneesListe_PageRemplacements = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_PageRemplacements extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false });
	}
	getZoneGauche(aParams) {
		const H = [];
		if (aParams.article.Date) {
			let lDate = ObjetDate_1.GDate.formatDate(
				aParams.article.Date,
				"%JJ %MMM",
			);
			H.push(
				`<time class="date-contain ie-line-color left" style="--color-line :#2338BB;" datetime="${ObjetDate_1.GDate.formatDate(aParams.article.Date, "%MM-%JJ")}">${lDate}</time>`,
			);
		}
		return H.join("");
	}
	getTitreZonePrincipale(aParams) {
		const H = [];
		if (aParams.article.ListeProfesseurs) {
			aParams.article.ListeProfesseurs.parcourir((aProf) => {
				if (aProf.getLibelle()) {
					H.push(
						`<div ie-ellipsis class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
					);
				}
			});
		}
		return H.join("");
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (aParams.article.Matiere) {
			H.push(
				`<div ie-ellipsis class="ie-sous-titre capitalize">${aParams.article.Matiere.getLibelle()}</div>`,
			);
		}
		if (aParams.article.ListeProfesseurs) {
			aParams.article.ListeProfesseurs.parcourir((aProf) => {
				if (aParams.article.HeureDebut && aParams.article.HeureFin) {
					H.push(
						`<div class="ie-sous-titre ">${ObjetTraduction_1.GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [aParams.article.HeureDebut, aParams.article.HeureFin])}</div>`,
					);
				}
			});
		}
		return H.join("");
	}
	getZoneMessageLarge(aParams) {
		const H = [];
		if (aParams.article.ListeRemplacements.count() === 0) {
			H.push(
				`<div class="ie-titre ">${ObjetTraduction_1.GTraductions.getValeur("PageRemplacement.Annule")}</div>`,
			);
		}
		if (aParams.article.ListeRemplacements.count() !== 0) {
			H.push(
				`<div ie-ellipsis class="ie-titre m-bottom-l"> ${ObjetTraduction_1.GTraductions.getValeur("PageRemplacement.RemplacePar")}</div>`,
			);
			aParams.article.ListeRemplacements.parcourir((aRemp) => {
				if (aRemp.ListeProfesseurs) {
					aRemp.ListeProfesseurs.parcourir((aProf) => {
						H.push(
							`<div class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
						);
					});
				}
				if (aRemp.Matiere) {
					H.push(
						`<div class="ie-sous-titre capitalize">${aRemp.Matiere.getLibelle()}</div>`,
					);
				}
				if (aRemp.HeureDebut && aRemp.HeureFin) {
					H.push(
						`<div class="ie-sous-titre ">${ObjetTraduction_1.GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [aRemp.HeureDebut, aRemp.HeureFin])}</div>`,
					);
				}
			});
		}
		return H.join("");
	}
}
exports.DonneesListe_PageRemplacements = DonneesListe_PageRemplacements;

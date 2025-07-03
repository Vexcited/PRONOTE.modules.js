exports.DonneesListe_ServicesEvaluationsPrim = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetStyle_1 = require("ObjetStyle");
class DonneesListe_ServicesEvaluationsPrim extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			hauteurMinCellule: 37,
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecTri: false,
			avecDeselectionSurNonSelectionnable: false,
		});
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ServicesEvaluationsPrim.colonnes.libelle: {
				const lLibelle = [];
				if (aParams.article.couleur) {
					const lBorder =
						aParams.article.cumul > 1
							? "border-radius:6px;"
							: "border-radius:6px 0 0 6px;";
					const lHeight = aParams.article.cumul > 1 ? 6 : 25;
					lLibelle.push(
						'<div style="display:flex; align-items:center;">',
						'<div style="',
						ObjetStyle_1.GStyle.composeHeight(lHeight),
						"min-width:6px; margin-right: 3px; " +
							ObjetStyle_1.GStyle.composeCouleurFond(aParams.article.couleur),
						lBorder,
						'"></div>',
						"<div >",
						aParams.article.getLibelle(),
						"</div>",
						"</div>",
					);
				} else {
					lLibelle.push(aParams.article.getLibelle());
				}
				return lLibelle.join("");
			}
			case DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe: {
				const H = [];
				if (aParams.article.groupe && aParams.article.groupe.getLibelle()) {
					H.push(aParams.article.groupe.getLibelle());
				} else if (aParams.article.classe) {
					H.push(aParams.article.classe.getLibelle());
				}
				return H.join("");
			}
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (this.avecSelection(aParams)) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	getIndentationCellule(aParams) {
		return (
			((aParams.article.cumul || 1) - 1) * this.options.indentationCelluleEnfant
		);
	}
	avecAlternanceCouleurLigne(aParams) {
		return aParams.article.cumul === 1;
	}
}
exports.DonneesListe_ServicesEvaluationsPrim =
	DonneesListe_ServicesEvaluationsPrim;
DonneesListe_ServicesEvaluationsPrim.colonnes = {
	libelle: "libelle",
	classeGroupe: "classeGroupe",
};

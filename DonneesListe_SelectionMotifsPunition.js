exports.DonneesListe_SelectionMotifsPunition = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_SelectionMotifsPunition extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
			avecDeploiement: true,
			avecEvnt_Creation: true,
			avecEllipsis: false,
		});
		this.avecCumuls = aParam.avecCumuls || false;
	}
	getValueCB(aDonnees) {
		if (!!aDonnees.article.cmsActif) {
			return aDonnees.article.cmsActif;
		}
	}
	setValueCB(aDonnees, aValue) {
		aDonnees.article.cmsActif = aValue;
	}
	getTitreZonePrincipale(aDonnees) {
		return IE.jsx.str(
			"div",
			{ class: "ie-titre flex-contain flex-center justify-between" },
			IE.jsx.str("span", null, aDonnees.article.getLibelle() || ""),
			aDonnees.article.dossierObligatoire
				? IE.jsx.str("i", {
						class: "icon_folder_close mix-icon_ok i-green m-x-xl",
						"ie-tooltiplabel-static": ObjetTraduction_1.GTraductions.getValeur(
							"liste.DossierObligatoire",
						),
						role: "img",
					})
				: "",
		);
	}
	getInfosSuppZonePrincipale(aDonnees) {
		let H = [];
		if (!!aDonnees.article.sousCategorieDossier) {
			H.push(
				`<div>${aDonnees.article.sousCategorieDossier.getLibelle()}</div>`,
			);
		}
		return H.join("");
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.ssMotif;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getLibelle();
				}),
			]),
		];
	}
	getVisible(aArticle) {
		if (this.avecCumuls) {
			return true;
		}
		return !!aArticle.sousCategorieDossier || !aArticle.estUnDeploiement;
	}
}
exports.DonneesListe_SelectionMotifsPunition =
	DonneesListe_SelectionMotifsPunition;

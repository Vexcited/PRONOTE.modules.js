exports.DonneesListe_SelectElevesTAF_Prim = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetChaine_1 = require("ObjetChaine");
class DonneesListe_SelectElevesTAF_Prim extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			flatDesignMinimal: true,
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecDeploiement: true,
			avecEventDeploiementSurCellule: false,
			avecTri: false,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return composeLibelle.call(this, aParams.article);
	}
	getValueCB(aParams) {
		return aParams.article.estUnDeploiement
			? this.getEtatCocheSelonFils(aParams.article, aParams)
			: !!aParams.article.cmsActif;
	}
	setValueCB(aParams, aValue) {
		aParams.article.cmsActif = aValue;
		if (aParams.article.estUnDeploiement) {
			aParams.article.pourTous = aValue;
			this.Donnees.parcourir((aFils) => {
				if (aFils.pere === aParams.article) {
					aFils.cmsActif = aValue;
				}
			});
		} else {
			let lAuMoinsUnFilsSelectionne = false;
			let lTousLesFilsSelectionne = true;
			let lPere;
			aParams.article.estConcerne = aValue;
			this.Donnees.parcourir((aFils) => {
				if (aParams.article.pere === aFils) {
					lPere = aFils;
				}
				if (aFils.pere && aFils.pere === lPere && !lAuMoinsUnFilsSelectionne) {
					lAuMoinsUnFilsSelectionne = aFils.cmsActif;
				}
				if (aFils.pere && aFils.pere === lPere && lTousLesFilsSelectionne) {
					lTousLesFilsSelectionne = aFils.cmsActif;
				}
			});
			lPere.cmsActif = lAuMoinsUnFilsSelectionne;
			lPere.pourTous = lTousLesFilsSelectionne;
		}
	}
}
exports.DonneesListe_SelectElevesTAF_Prim = DonneesListe_SelectElevesTAF_Prim;
function composePhoto(aArticle, aLargeurDiv) {
	const result = [];
	if (aArticle) {
		result.push(
			'<div class="InlineBlock AlignementHaut" style="height: 100%; width: ',
			aLargeurDiv,
			'px; ">',
			'<img ie-load-src="',
			ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aArticle, {
				libelle: "photo.jpg",
			}),
			'" class="img-portrait" ie-imgviewer style="height: auto; width: auto; max-height: 100%; max-width: 100%;" alt="',
			aArticle.getLibelle(),
			'" data-libelle="',
			aArticle.getLibelle(),
			'"/>',
			"</div>",
		);
	}
	return result.join("");
}
function composeLibelle(aArticle) {
	if (aArticle.estUnDeploiement) {
		return aArticle.getLibelle();
	} else {
		const lResult = [];
		lResult.push('<div style="height: 38px;">');
		lResult.push(composePhoto(aArticle, 30));
		lResult.push(
			'<div class="InlineBlock AlignementHaut EspaceGauche">',
			aArticle.getLibelle(),
			"</div>",
		);
		lResult.push("</div>");
		return lResult.join("");
	}
}

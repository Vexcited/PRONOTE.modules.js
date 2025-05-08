const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GHtml } = require("ObjetHtml.js");
const { GChaine } = require("ObjetChaine.js");
class DonneesListe_SelectElevesTAF_Prim extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			flatDesignMinimal: true,
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecDeploiement: true,
			avecEventDeploiementSurCellule: false,
			avecTri: false,
			avecMenuContextuel: false,
			avecBoutonActionLigne: false,
		});
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				nodePhoto: function (aNoArticle) {
					$(this.node).on("error", () => {
						const lElement =
							aInstanceDonneesListe.Donnees.getElementParNumero(aNoArticle);
						lElement.avecPhoto = false;
					});
				},
			},
		);
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
function composePhoto(aArticle, aLargeurDiv) {
	const result = [];
	if (aArticle) {
		let lSrcPhoto = "";
		if (aArticle.avecPhoto !== false) {
			lSrcPhoto = GChaine.creerUrlBruteLienExterne(aArticle, {
				libelle: "photo.jpg",
			});
		}
		result.push(
			'<div class="InlineBlock AlignementHaut" style="height: 100%; width: ',
			aLargeurDiv,
			'px; ">',
			'<img ie-load-src="',
			lSrcPhoto,
			'" class="img-portrait" ie-imgviewer ',
			GHtml.composeAttr("ie-node", "nodePhoto", aArticle.getNumero()),
			' style="height: auto; width: auto; max-height: 100%; max-width: 100%;" aria-hidden="true" />',
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
		lResult.push(composePhoto.call(this, aArticle, 30));
		lResult.push(
			'<div class="InlineBlock AlignementHaut EspaceGauche">',
			aArticle.getLibelle(),
			"</div>",
		);
		lResult.push("</div>");
		return lResult.join("");
	}
}
module.exports = { DonneesListe_SelectElevesTAF_Prim };

exports.DonneesListeTypesAccesInfoSond = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListeTypesAccesInfoSond extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	getIconeGaucheContenuFormate(aParams) {
		return aParams.article.icone;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneComplementaire(aParams) {
		const lCmp = aParams.article.compteur;
		return lCmp !== null && lCmp !== undefined && lCmp > 0
			? '<div class="compteur Gras">' + lCmp + "</div>"
			: "";
	}
	avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
		return (
			super.avecSeparateurLigneHautFlatdesign(
				aParamsCellule,
				aParamsCellulePrec,
			) &&
			aParamsCellule.article &&
			aParamsCellule.article.estAvecSeparateurHaut
		);
	}
}
exports.DonneesListeTypesAccesInfoSond = DonneesListeTypesAccesInfoSond;

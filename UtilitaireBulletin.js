const { GTraductions } = require("ObjetTraduction.js");
const UtilitaireBulletin = {
	getInfosTypeAccuseReceptionBulletinEleve(aListeAccusesReception) {
		let lNbTotalAccusesReception = 0;
		let lNbAccusesReceptionValides = 0;
		if (!!aListeAccusesReception) {
			lNbTotalAccusesReception = aListeAccusesReception.count();
			for (const lResponsable of aListeAccusesReception) {
				if (lResponsable && lResponsable.aPrisConnaissance) {
					lNbAccusesReceptionValides++;
				}
			}
		}
		const lResultatCellule = { actif: true };
		if (lNbTotalAccusesReception === 0 || lNbAccusesReceptionValides === 0) {
			lResultatCellule.nomIcone = "icon_remove";
			lResultatCellule.couleurIcone = "#CD0020";
			lResultatCellule.classCouleur = "tdb-reponse-notok";
			lResultatCellule.libelle = GTraductions.getValeur(
				"BulletinEtReleve.AucunAccuseReception",
			);
			lResultatCellule.actif = false;
		} else if (lNbTotalAccusesReception === lNbAccusesReceptionValides) {
			if (lNbTotalAccusesReception === 1) {
				lResultatCellule.nomIcone = "icon_ok";
				lResultatCellule.couleurIcone = "#147600";
				lResultatCellule.classCouleur = "tdb-reponse-ok";
				lResultatCellule.libelle = GTraductions.getValeur(
					"BulletinEtReleve.ResponsableAAccuseReception",
					[aListeAccusesReception.getPremierElement().getLibelle() || ""],
				);
			} else {
				lResultatCellule.nomIcone = "icon_double_check";
				lResultatCellule.couleurIcone = "#147600";
				lResultatCellule.classCouleur = "tdb-reponse-ok";
				lResultatCellule.libelle = GTraductions.getValeur(
					"BulletinEtReleve.TousLesResponsablesOntAccuseReception",
				);
			}
		} else {
			lResultatCellule.nomIcone = "icon_double_check_vide";
			lResultatCellule.couleurIcone = "#666";
			lResultatCellule.classCouleur = "tdb-reponse-ok";
			lResultatCellule.libelle = GTraductions.getValeur(
				"BulletinEtReleve.CertainsResponsablesOntAccuseReception",
			);
		}
		return lResultatCellule;
	},
};
module.exports = { UtilitaireBulletin };

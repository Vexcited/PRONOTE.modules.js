exports.TypeDecisionDemandeInscriptionUtil =
	exports.TypeDecisionDemandeInscription = void 0;
var TypeDecisionDemandeInscription;
(function (TypeDecisionDemandeInscription) {
	TypeDecisionDemandeInscription[
		(TypeDecisionDemandeInscription["ddi_Acceptee"] = 0)
	] = "ddi_Acceptee";
	TypeDecisionDemandeInscription[
		(TypeDecisionDemandeInscription["ddi_EnCours"] = 1)
	] = "ddi_EnCours";
	TypeDecisionDemandeInscription[
		(TypeDecisionDemandeInscription["ddi_Refusee"] = 2)
	] = "ddi_Refusee";
})(
	TypeDecisionDemandeInscription ||
		(exports.TypeDecisionDemandeInscription = TypeDecisionDemandeInscription =
			{}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDecisionDemandeInscriptionUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeDecisionDemandeInscription.ddi_Acceptee:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.recapAccepte",
				);
			case TypeDecisionDemandeInscription.ddi_EnCours:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.recapAttente",
				);
			case TypeDecisionDemandeInscription.ddi_Refusee:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.recapRefuse",
				);
			default:
				break;
		}
	},
	getClass(aGenre) {
		switch (aGenre) {
			case TypeDecisionDemandeInscription.ddi_Acceptee:
				return "icon_ok text-util-vert-moyen";
			case TypeDecisionDemandeInscription.ddi_EnCours:
				return "";
			case TypeDecisionDemandeInscription.ddi_Refusee:
				return "icon_remove text-util-rouge-moyen";
			default:
				break;
		}
	},
};
exports.TypeDecisionDemandeInscriptionUtil = TypeDecisionDemandeInscriptionUtil;

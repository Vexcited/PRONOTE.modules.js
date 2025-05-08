exports.TypeOrigineCreationEtatDemandeInscriptionUtil =
	exports.TypeOrigineCreationEtatDemandeInscription = void 0;
var TypeOrigineCreationEtatDemandeInscription;
(function (TypeOrigineCreationEtatDemandeInscription) {
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_NonTraite"] = 0)
	] = "tOCEDI_NonTraite";
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_EnCoursDeTraitement"] =
			1)
	] = "tOCEDI_EnCoursDeTraitement";
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_ACompleter"] = 2)
	] = "tOCEDI_ACompleter";
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_Traite"] = 3)
	] = "tOCEDI_Traite";
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_Utilisateur"] = 4)
	] = "tOCEDI_Utilisateur";
	TypeOrigineCreationEtatDemandeInscription[
		(TypeOrigineCreationEtatDemandeInscription["tOCEDI_ListeAttente"] = 5)
	] = "tOCEDI_ListeAttente";
})(
	TypeOrigineCreationEtatDemandeInscription ||
		(exports.TypeOrigineCreationEtatDemandeInscription =
			TypeOrigineCreationEtatDemandeInscription =
				{}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeOrigineCreationEtatDemandeInscriptionUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_NonTraite:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.enAttenteTraitement",
				);
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_EnCoursDeTraitement:
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_Utilisateur:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.enCoursTraitement",
				);
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_ACompleter:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.aCompleter",
				);
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_Traite:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.traitee",
				);
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_ListeAttente:
				return ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.listeAttente",
				);
			default:
				break;
		}
	},
	getIcone(aGenre) {
		switch (aGenre) {
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_NonTraite:
				return "icon_edt_permanence";
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_EnCoursDeTraitement:
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_Utilisateur:
				return "icon_time";
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_ACompleter:
				return "icon_bullhorn";
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_Traite:
				return "icon_rond";
			case TypeOrigineCreationEtatDemandeInscription.tOCEDI_ListeAttente:
				return "icon_list mix-icon_time";
			default:
				break;
		}
	},
};
exports.TypeOrigineCreationEtatDemandeInscriptionUtil =
	TypeOrigineCreationEtatDemandeInscriptionUtil;

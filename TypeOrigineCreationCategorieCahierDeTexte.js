exports.TypeOrigineCreationCategorieCahierDeTexteUtil =
	exports.TypeOrigineCreationCategorieCahierDeTexte = void 0;
var TypeOrigineCreationCategorieCahierDeTexte;
(function (TypeOrigineCreationCategorieCahierDeTexte) {
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Utilisateur"] = 0)
	] = "OCCCDT_Utilisateur";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Cours"] = 1)
	] = "OCCCDT_Pre_Cours";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Correction"] = 2)
	] = "OCCCDT_Pre_Correction";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Devoir"] = 3)
	] = "OCCCDT_Pre_Devoir";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Interro"] = 4)
	] = "OCCCDT_Pre_Interro";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_TD"] = 5)
	] = "OCCCDT_Pre_TD";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_TP"] = 6)
	] = "OCCCDT_Pre_TP";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Evaluation"] = 7)
	] = "OCCCDT_Pre_Evaluation";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_EPI"] = 8)
	] = "OCCCDT_Pre_EPI";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_AP"] = 9)
	] = "OCCCDT_Pre_AP";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Mod_Peda_Oral"] = 10)
	] = "OCCCDT_Pre_Mod_Peda_Oral";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Mod_Peda_Ecrit"] =
			11)
	] = "OCCCDT_Pre_Mod_Peda_Ecrit";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_LienVisio"] = 12)
	] = "OCCCDT_Pre_LienVisio";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_CCF"] = 13)
	] = "OCCCDT_Pre_CCF";
	TypeOrigineCreationCategorieCahierDeTexte[
		(TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_EC"] = 14)
	] = "OCCCDT_Pre_EC";
})(
	TypeOrigineCreationCategorieCahierDeTexte ||
		(exports.TypeOrigineCreationCategorieCahierDeTexte =
			TypeOrigineCreationCategorieCahierDeTexte =
				{}),
);
const TypeOrigineCreationCategorieCahierDeTexteUtil = {
	getIcone(aGenre) {
		switch (aGenre) {
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_LienVisio:
				return "icon_cours_virtuel";
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir:
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation:
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_EPI:
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_AP:
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_CCF:
			case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_EC:
				return "icon-text";
		}
		return "";
	},
	estTypeAvecIcone(aType) {
		return TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(aType) !== "";
	},
};
exports.TypeOrigineCreationCategorieCahierDeTexteUtil =
	TypeOrigineCreationCategorieCahierDeTexteUtil;

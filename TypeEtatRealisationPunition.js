exports.TypeEtatRealisationPunitionUtil = exports.TypeEtatRealisationPunition =
	void 0;
var TypeEtatRealisationPunition;
(function (TypeEtatRealisationPunition) {
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_NonProgrammable"] = 0)
	] = "Terp_NonProgrammable";
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_NonRealisee"] = 1)
	] = "Terp_NonRealisee";
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_Perimee"] = 2)
	] = "Terp_Perimee";
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_Realise"] = 3)
	] = "Terp_Realise";
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_Programmee"] = 4)
	] = "Terp_Programmee";
	TypeEtatRealisationPunition[
		(TypeEtatRealisationPunition["Terp_Reportee"] = 5)
	] = "Terp_Reportee";
})(
	TypeEtatRealisationPunition ||
		(exports.TypeEtatRealisationPunition = TypeEtatRealisationPunition = {}),
);
const TypeEtatRealisationPunitionUtil = {
	getClassImage(aTypesEtatRealisationPunition) {
		if (
			aTypesEtatRealisationPunition.contains(
				TypeEtatRealisationPunition.Terp_NonRealisee,
			)
		) {
			return "Image_Punition_RealiseNon";
		} else if (
			aTypesEtatRealisationPunition.contains(
				TypeEtatRealisationPunition.Terp_Perimee,
			)
		) {
			return "Image_Punition_RealiseOuNon";
		} else if (
			aTypesEtatRealisationPunition.contains(
				TypeEtatRealisationPunition.Terp_Realise,
			)
		) {
			return "Image_Punition_Realise";
		} else if (
			aTypesEtatRealisationPunition.contains(
				TypeEtatRealisationPunition.Terp_Programmee,
			)
		) {
			return "Image_Punition_RealiseProgramme";
		} else {
			return "Image_Punition_Vide";
		}
	},
};
exports.TypeEtatRealisationPunitionUtil = TypeEtatRealisationPunitionUtil;

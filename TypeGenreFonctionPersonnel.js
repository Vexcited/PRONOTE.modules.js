exports.TypeGenreFonctionPersonnelUtil = exports.TypeGenreFonctionPersonnel =
	void 0;
var TypeGenreFonctionPersonnel;
(function (TypeGenreFonctionPersonnel) {
	TypeGenreFonctionPersonnel[(TypeGenreFonctionPersonnel["FP_Aucune"] = 0)] =
		"FP_Aucune";
	TypeGenreFonctionPersonnel[(TypeGenreFonctionPersonnel["FP_Direction"] = 1)] =
		"FP_Direction";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_VieScolaire"] = 2)
	] = "FP_VieScolaire";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_Administratif"] = 3)
	] = "FP_Administratif";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_Encadrement"] = 4)
	] = "FP_Encadrement";
	TypeGenreFonctionPersonnel[(TypeGenreFonctionPersonnel["FP_Medical"] = 5)] =
		"FP_Medical";
	TypeGenreFonctionPersonnel[(TypeGenreFonctionPersonnel["FP_Autre"] = 6)] =
		"FP_Autre";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_Accompagnant"] = 7)
	] = "FP_Accompagnant";
	TypeGenreFonctionPersonnel[(TypeGenreFonctionPersonnel["FP_Tuteur"] = 8)] =
		"FP_Tuteur";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_Periscolaire"] = 9)
	] = "FP_Periscolaire";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_MairieGestion"] = 10)
	] = "FP_MairieGestion";
	TypeGenreFonctionPersonnel[
		(TypeGenreFonctionPersonnel["FP_MairieDirection"] = 11)
	] = "FP_MairieDirection";
})(
	TypeGenreFonctionPersonnel ||
		(exports.TypeGenreFonctionPersonnel = TypeGenreFonctionPersonnel = {}),
);
const C_FonctionsMairie = [
	TypeGenreFonctionPersonnel.FP_MairieDirection,
	TypeGenreFonctionPersonnel.FP_MairieGestion,
];
const TypeGenreFonctionPersonnelUtil = {
	estFonctionMairie(aTypeFonction) {
		return C_FonctionsMairie.includes(aTypeFonction);
	},
};
exports.TypeGenreFonctionPersonnelUtil = TypeGenreFonctionPersonnelUtil;

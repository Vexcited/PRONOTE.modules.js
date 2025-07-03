exports.TypeDispenseEleveDeCoursUtil = exports.TypeDispenseEleveDeCours =
	void 0;
var TypeDispenseEleveDeCours;
(function (TypeDispenseEleveDeCours) {
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_confine"] = 0)] =
		"tdec_confine";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_enStage"] = 1)] =
		"tdec_enStage";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_dispense"] = 2)] =
		"tdec_dispense";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_dispensePresent"] = 3)
	] = "tdec_dispensePresent";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_dispensePNO"] = 4)] =
		"tdec_dispensePNO";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_maisonPO"] = 5)] =
		"tdec_maisonPO";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_maisonPNO"] = 6)] =
		"tdec_maisonPNO";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_excluClasse"] = 7)] =
		"tdec_excluClasse";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_excluEtablissement"] = 8)
	] = "tdec_excluEtablissement";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_mesureConservatoire"] = 9)
	] = "tdec_mesureConservatoire";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_absent"] = 10)] =
		"tdec_absent";
	TypeDispenseEleveDeCours[(TypeDispenseEleveDeCours["tdec_detache"] = 11)] =
		"tdec_detache";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_conseildeclasse"] = 12)
	] = "tdec_conseildeclasse";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_sortiepedagogique"] = 13)
	] = "tdec_sortiepedagogique";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_sortieNonPedagogique"] = 14)
	] = "tdec_sortieNonPedagogique";
	TypeDispenseEleveDeCours[
		(TypeDispenseEleveDeCours["tdec_estAccompagne"] = 15)
	] = "tdec_estAccompagne";
})(
	TypeDispenseEleveDeCours ||
		(exports.TypeDispenseEleveDeCours = TypeDispenseEleveDeCours = {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const TypeDispenseEleveDeCoursUtil = {
	getClass(aType) {
		const lClass = ["tdedc-picto"];
		switch (aType) {
			case TypeDispenseEleveDeCours.tdec_confine:
				lClass.push("icon_home");
				break;
			case TypeDispenseEleveDeCours.tdec_enStage:
				lClass.push("icon_entreprise");
				break;
			case TypeDispenseEleveDeCours.tdec_dispense:
			case TypeDispenseEleveDeCours.tdec_dispensePNO:
				lClass.push("icon_dispense");
				break;
			case TypeDispenseEleveDeCours.tdec_dispensePresent:
				lClass.push("icon_dispense present");
				break;
			case TypeDispenseEleveDeCours.tdec_excluClasse:
			case TypeDispenseEleveDeCours.tdec_excluEtablissement:
			case TypeDispenseEleveDeCours.tdec_mesureConservatoire:
				lClass.push("icon_exclamation_sign");
				break;
			case TypeDispenseEleveDeCours.tdec_absent:
				lClass.push("icon_absences");
				break;
			case TypeDispenseEleveDeCours.tdec_detache:
				lClass.push("icon_eleve_detache");
				break;
			case TypeDispenseEleveDeCours.tdec_conseildeclasse:
				lClass.push("icon_mode_conseil_classe");
				break;
			case TypeDispenseEleveDeCours.tdec_sortiepedagogique:
				lClass.push("icon_sortie_pedagogique");
				break;
			case TypeDispenseEleveDeCours.tdec_sortieNonPedagogique:
				lClass.push("icon_competence_absent");
				break;
			case TypeDispenseEleveDeCours.tdec_estAccompagne:
				lClass.push("icon_accompagnant");
				break;
		}
		return lClass.join(" ");
	},
	getPicto(aType) {
		switch (aType) {
			case TypeDispenseEleveDeCours.tdec_confine:
			case TypeDispenseEleveDeCours.tdec_enStage:
			case TypeDispenseEleveDeCours.tdec_dispense:
			case TypeDispenseEleveDeCours.tdec_dispensePresent:
			case TypeDispenseEleveDeCours.tdec_dispensePNO:
			case TypeDispenseEleveDeCours.tdec_excluClasse:
			case TypeDispenseEleveDeCours.tdec_excluEtablissement:
			case TypeDispenseEleveDeCours.tdec_mesureConservatoire:
			case TypeDispenseEleveDeCours.tdec_absent:
			case TypeDispenseEleveDeCours.tdec_detache:
			case TypeDispenseEleveDeCours.tdec_conseildeclasse:
			case TypeDispenseEleveDeCours.tdec_sortiepedagogique:
			case TypeDispenseEleveDeCours.tdec_sortieNonPedagogique:
			case TypeDispenseEleveDeCours.tdec_estAccompagne:
				return `<i class="${this.getClass(aType)}" aria-hidden="true"></i>`;
			default:
				break;
		}
		return "";
	},
	construirePictos(aPictos) {
		const H = [];
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeDispenseEleveDeCours,
		)) {
			const lType = TypeDispenseEleveDeCours[lKey];
			if (aPictos && aPictos.contains(lType)) {
				H.push(this.getPicto(lType));
			}
		}
		return `<div class="typedispenseelevedecours">${H.join("")}</div>`;
	},
};
exports.TypeDispenseEleveDeCoursUtil = TypeDispenseEleveDeCoursUtil;

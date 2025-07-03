exports.EGenreElementDossierUtil = exports.EGenreElementDossier = void 0;
var EGenreElementDossier;
(function (EGenreElementDossier) {
	EGenreElementDossier[(EGenreElementDossier["Absence"] = 0)] = "Absence";
	EGenreElementDossier[(EGenreElementDossier["Retard"] = 1)] = "Retard";
	EGenreElementDossier[(EGenreElementDossier["Dispense"] = 2)] = "Dispense";
	EGenreElementDossier[(EGenreElementDossier["Punition"] = 3)] = "Punition";
	EGenreElementDossier[(EGenreElementDossier["Sanction"] = 4)] = "Sanction";
	EGenreElementDossier[(EGenreElementDossier["Communication"] = 5)] =
		"Communication";
	EGenreElementDossier[(EGenreElementDossier["ConvocationVS"] = 6)] =
		"ConvocationVS";
	EGenreElementDossier[(EGenreElementDossier["AbsenceRepas"] = 7)] =
		"AbsenceRepas";
	EGenreElementDossier[(EGenreElementDossier["AbsenceInternat"] = 8)] =
		"AbsenceInternat";
	EGenreElementDossier[(EGenreElementDossier["PassageInfirmerie"] = 9)] =
		"PassageInfirmerie";
	EGenreElementDossier[(EGenreElementDossier["Incident"] = 10)] = "Incident";
	EGenreElementDossier[(EGenreElementDossier["Valorisation"] = 100)] =
		"Valorisation";
	EGenreElementDossier[(EGenreElementDossier["Commission"] = 101)] =
		"Commission";
})(
	EGenreElementDossier ||
		(exports.EGenreElementDossier = EGenreElementDossier = {}),
);
const Enumere_Ressource_1 = require("Enumere_Ressource");
const EGenreElementDossierUtil = {
	toGenreRessource(aGenreElementDossier) {
		switch (aGenreElementDossier) {
			case EGenreElementDossier.Absence:
				return Enumere_Ressource_1.EGenreRessource.Absence;
			case EGenreElementDossier.Retard:
				return Enumere_Ressource_1.EGenreRessource.Retard;
			case EGenreElementDossier.Dispense:
				return Enumere_Ressource_1.EGenreRessource.Dispense;
			case EGenreElementDossier.Punition:
				return Enumere_Ressource_1.EGenreRessource.Punition;
			case EGenreElementDossier.Sanction:
				return Enumere_Ressource_1.EGenreRessource.Sanction;
			case EGenreElementDossier.Communication:
				return Enumere_Ressource_1.EGenreRessource.Communication;
		}
	},
	getIconePolice(aGenreElementDossier) {
		switch (aGenreElementDossier) {
			case EGenreElementDossier.Absence:
				return "icon_absences ";
			case EGenreElementDossier.Retard:
				return "icon_retard";
			case EGenreElementDossier.Dispense:
				return "icon_dispense";
			case EGenreElementDossier.Punition:
				return "icon_warning_sign";
			case EGenreElementDossier.Sanction:
				return "icon_legal";
			case EGenreElementDossier.Communication:
				return "icon_envelope";
			case EGenreElementDossier.ConvocationVS:
				return "icon_convocation";
			case EGenreElementDossier.AbsenceRepas:
				return "icon_food";
			case EGenreElementDossier.AbsenceInternat:
				return "icon_internat";
			case EGenreElementDossier.PassageInfirmerie:
				return "icon_f0fe";
			case EGenreElementDossier.Incident:
				return "icon_bolt";
			case EGenreElementDossier.Valorisation:
				return "icon_valorisation";
			case EGenreElementDossier.Commission:
				return "icon_group";
			default:
				break;
		}
		return "";
	},
};
exports.EGenreElementDossierUtil = EGenreElementDossierUtil;

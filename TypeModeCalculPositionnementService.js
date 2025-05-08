exports.TypeModeCalculPositionnementServiceUtil =
	exports.TypeModeCalculPositionnementService = void 0;
var TypeModeCalculPositionnementService;
(function (TypeModeCalculPositionnementService) {
	TypeModeCalculPositionnementService[
		(TypeModeCalculPositionnementService["tMCPS_Defaut"] = 0)
	] = "tMCPS_Defaut";
	TypeModeCalculPositionnementService[
		(TypeModeCalculPositionnementService["tMCPS_NDernieresEvals"] = 1)
	] = "tMCPS_NDernieresEvals";
	TypeModeCalculPositionnementService[
		(TypeModeCalculPositionnementService["tMCPS_NMeilleursEvals"] = 2)
	] = "tMCPS_NMeilleursEvals";
	TypeModeCalculPositionnementService[
		(TypeModeCalculPositionnementService["tMCPS_PonderationAutoProgressive"] =
			3)
	] = "tMCPS_PonderationAutoProgressive";
})(
	TypeModeCalculPositionnementService ||
		(exports.TypeModeCalculPositionnementService =
			TypeModeCalculPositionnementService =
				{}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeCalculPositionnementServiceUtil = {
	getListe() {
		return [
			TypeModeCalculPositionnementService.tMCPS_Defaut,
			TypeModeCalculPositionnementService.tMCPS_NDernieresEvals,
			TypeModeCalculPositionnementService.tMCPS_NMeilleursEvals,
			TypeModeCalculPositionnementService.tMCPS_PonderationAutoProgressive,
		];
	},
	getNomSimulation(aTypeModeCalcul) {
		return _getNomSimulation(aTypeModeCalcul);
	},
	getLibelleComplet(aTypeModeCalcul, aDonneesGlobalesCalcul) {
		const result = [];
		result.push(_getNomSimulation(aTypeModeCalcul));
		result.push(
			_getExplicationSimulation(aTypeModeCalcul, aDonneesGlobalesCalcul),
		);
		return result.join(" - ");
	},
};
exports.TypeModeCalculPositionnementServiceUtil =
	TypeModeCalculPositionnementServiceUtil;
function _getNomSimulation(aTypeModeCalcul) {
	switch (aTypeModeCalcul) {
		case TypeModeCalculPositionnementService.tMCPS_Defaut:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.libelle.ModeCalculDefaut",
			);
		case TypeModeCalculPositionnementService.tMCPS_NDernieresEvals:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.libelle.ModeCalculNDernieresEvals",
			);
		case TypeModeCalculPositionnementService.tMCPS_NMeilleursEvals:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.libelle.ModeCalculNMeilleuresEvals",
			);
		case TypeModeCalculPositionnementService.tMCPS_PonderationAutoProgressive:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.libelle.ModeCalculPonderationAutoProgressive",
			);
	}
	return "";
}
function _getExplicationSimulation(aTypeModeCalcul, aDonneesGlobalesCalcul) {
	switch (aTypeModeCalcul) {
		case TypeModeCalculPositionnementService.tMCPS_Defaut:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.explication.ModeCalculDefaut",
			);
		case TypeModeCalculPositionnementService.tMCPS_NDernieresEvals: {
			let lStrExplicationSimulation = "";
			if (aDonneesGlobalesCalcul) {
				const lDonneesCalculSimu = aDonneesGlobalesCalcul.dernieresEvaluations;
				if (lDonneesCalculSimu) {
					if (lDonneesCalculSimu.utiliserNb) {
						if (lDonneesCalculSimu.nb > 1) {
							lStrExplicationSimulation =
								ObjetTraduction_1.GTraductions.getValeur(
									"TypeModeCalculPositionnementService.explication.ModeCalculNDernieresEvalsNb",
									[lDonneesCalculSimu.nb],
								);
						} else {
							lStrExplicationSimulation =
								ObjetTraduction_1.GTraductions.getValeur(
									"TypeModeCalculPositionnementService.explication.ModeCalculNDernieresEvalsNbSing",
								);
						}
					} else {
						lStrExplicationSimulation =
							ObjetTraduction_1.GTraductions.getValeur(
								"TypeModeCalculPositionnementService.explication.ModeCalculNDernieresEvalsPourcent",
								[lDonneesCalculSimu.pourcent],
							);
					}
				}
			}
			return lStrExplicationSimulation;
		}
		case TypeModeCalculPositionnementService.tMCPS_NMeilleursEvals: {
			let lStrExplicationSimulation = "";
			if (aDonneesGlobalesCalcul) {
				const lDonneesCalculSimu = aDonneesGlobalesCalcul.meilleuresEvals;
				if (lDonneesCalculSimu) {
					if (lDonneesCalculSimu.utiliserNb) {
						if (lDonneesCalculSimu.nb > 1) {
							lStrExplicationSimulation =
								ObjetTraduction_1.GTraductions.getValeur(
									"TypeModeCalculPositionnementService.explication.ModeCalculNMeilleuresEvalsNb",
									[lDonneesCalculSimu.nb],
								);
						} else {
							lStrExplicationSimulation =
								ObjetTraduction_1.GTraductions.getValeur(
									"TypeModeCalculPositionnementService.explication.ModeCalculNMeilleuresEvalsNbSing",
								);
						}
					} else {
						lStrExplicationSimulation =
							ObjetTraduction_1.GTraductions.getValeur(
								"TypeModeCalculPositionnementService.explication.ModeCalculNMeilleuresEvalsPourcent",
								[lDonneesCalculSimu.pourcent],
							);
					}
				}
			}
			return lStrExplicationSimulation;
		}
		case TypeModeCalculPositionnementService.tMCPS_PonderationAutoProgressive:
			return ObjetTraduction_1.GTraductions.getValeur(
				"TypeModeCalculPositionnementService.explication.ModeCalculPonderationAutoProgressive",
			);
	}
}

exports.EGenreActivite_Tvx_Util = exports.EGenreActivite_Tvx = void 0;
var EGenreActivite_Tvx;
(function (EGenreActivite_Tvx) {
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Act_Consigne"] = 0)] =
		"ga_Act_Consigne";
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Act_QCM"] = 1)] = "ga_Act_QCM";
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Act_Exercice"] = 2)] =
		"ga_Act_Exercice";
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Taf_Consigne"] = 3)] =
		"ga_Taf_Consigne";
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Taf_QCM"] = 4)] = "ga_Taf_QCM";
	EGenreActivite_Tvx[(EGenreActivite_Tvx["ga_Taf_Exercice"] = 5)] =
		"ga_Taf_Exercice";
})(
	EGenreActivite_Tvx || (exports.EGenreActivite_Tvx = EGenreActivite_Tvx = {}),
);
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const EGenreActivite_Tvx_Util = {
	toGenreTravailAFaire(aGenreActivite_Tvx) {
		switch (aGenreActivite_Tvx) {
			case EGenreActivite_Tvx.ga_Act_Consigne:
			case EGenreActivite_Tvx.ga_Act_QCM:
			case EGenreActivite_Tvx.ga_Act_Exercice:
				return TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite;
			case EGenreActivite_Tvx.ga_Taf_Consigne:
			case EGenreActivite_Tvx.ga_Taf_QCM:
			case EGenreActivite_Tvx.ga_Taf_Exercice:
				return TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail;
			default:
		}
		return null;
	},
	estUneActivite(aGenreActivite_Tvx) {
		return [
			EGenreActivite_Tvx.ga_Act_Consigne,
			EGenreActivite_Tvx.ga_Act_QCM,
			EGenreActivite_Tvx.ga_Act_Exercice,
		].includes(aGenreActivite_Tvx);
	},
	estUnTAF(aGenreActivite_Tvx) {
		return [
			EGenreActivite_Tvx.ga_Taf_Consigne,
			EGenreActivite_Tvx.ga_Taf_QCM,
			EGenreActivite_Tvx.ga_Taf_Exercice,
		].includes(aGenreActivite_Tvx);
	},
	estUnQCM(aGenreActivite_Tvx) {
		return [
			EGenreActivite_Tvx.ga_Taf_QCM,
			EGenreActivite_Tvx.ga_Act_QCM,
		].includes(aGenreActivite_Tvx);
	},
	estUnExerciceNumerique(aGenreActivite_Tvx) {
		return [
			EGenreActivite_Tvx.ga_Taf_Exercice,
			EGenreActivite_Tvx.ga_Act_Exercice,
		].includes(aGenreActivite_Tvx);
	},
	estUneConsigne(aGenreActivite_Tvx) {
		return [
			EGenreActivite_Tvx.ga_Taf_Consigne,
			EGenreActivite_Tvx.ga_Act_Consigne,
		].includes(aGenreActivite_Tvx);
	},
	getExerciceDeGenreTravailAFaire(aGenreTravailAFaire) {
		return aGenreTravailAFaire ===
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
			? EGenreActivite_Tvx.ga_Taf_Exercice
			: EGenreActivite_Tvx.ga_Act_Exercice;
	},
	getQCMDeGenreTravailAFaire(aGenreTravailAFaire) {
		return aGenreTravailAFaire ===
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
			? EGenreActivite_Tvx.ga_Taf_QCM
			: EGenreActivite_Tvx.ga_Act_QCM;
	},
	getConsigneDeGenreTravailAFaire(aGenreTravailAFaire) {
		return aGenreTravailAFaire ===
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
			? EGenreActivite_Tvx.ga_Taf_Consigne
			: EGenreActivite_Tvx.ga_Act_Consigne;
	},
};
exports.EGenreActivite_Tvx_Util = EGenreActivite_Tvx_Util;

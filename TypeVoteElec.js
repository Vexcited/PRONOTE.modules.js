exports.TypeGenreRoleMembreBureauEP =
	exports.TypeEtatElectionP =
	exports.TypeGenrePourSSo =
		void 0;
var TypeGenrePourSSo;
(function (TypeGenrePourSSo) {
	TypeGenrePourSSo[(TypeGenrePourSSo["GSSO_Electeur"] = 0)] = "GSSO_Electeur";
	TypeGenrePourSSo[(TypeGenrePourSSo["GSSO_MembreBureau"] = 1)] =
		"GSSO_MembreBureau";
	TypeGenrePourSSo[(TypeGenrePourSSo["GSSO_Organisateur"] = 2)] =
		"GSSO_Organisateur";
})(TypeGenrePourSSo || (exports.TypeGenrePourSSo = TypeGenrePourSSo = {}));
var TypeEtatElectionP;
(function (TypeEtatElectionP) {
	TypeEtatElectionP[(TypeEtatElectionP["EEP_AvantScrutin"] = 0)] =
		"EEP_AvantScrutin";
	TypeEtatElectionP[(TypeEtatElectionP["EEP_ScrutinEnCours"] = 1)] =
		"EEP_ScrutinEnCours";
	TypeEtatElectionP[(TypeEtatElectionP["EEP_ScrutinTermine"] = 2)] =
		"EEP_ScrutinTermine";
	TypeEtatElectionP[(TypeEtatElectionP["EEP_ScrutinScelle"] = 3)] =
		"EEP_ScrutinScelle";
	TypeEtatElectionP[(TypeEtatElectionP["EEP_ScelleeAvantScrutin"] = 4)] =
		"EEP_ScelleeAvantScrutin";
	TypeEtatElectionP[(TypeEtatElectionP["EEP_AvantEnvoi"] = 5)] =
		"EEP_AvantEnvoi";
	TypeEtatElectionP[
		(TypeEtatElectionP["EEP_PreteScellementAvantScrutin"] = 6)
	] = "EEP_PreteScellementAvantScrutin";
})(TypeEtatElectionP || (exports.TypeEtatElectionP = TypeEtatElectionP = {}));
var TypeGenreRoleMembreBureauEP;
(function (TypeGenreRoleMembreBureauEP) {
	TypeGenreRoleMembreBureauEP[
		(TypeGenreRoleMembreBureauEP["GRM_Administrateur"] = 0)
	] = "GRM_Administrateur";
	TypeGenreRoleMembreBureauEP[
		(TypeGenreRoleMembreBureauEP["GRM_Assesseur"] = 1)
	] = "GRM_Assesseur";
})(
	TypeGenreRoleMembreBureauEP ||
		(exports.TypeGenreRoleMembreBureauEP = TypeGenreRoleMembreBureauEP = {}),
);

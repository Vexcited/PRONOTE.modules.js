exports.EEtape =
	exports.EGroupeDonneeInscription =
	exports.ETypeDonneeInscription =
	exports.ETypeValidation =
	exports.EModeValidation =
		void 0;
var EModeValidation;
(function (EModeValidation) {
	EModeValidation[(EModeValidation["MV_LettresUniquement"] = 0)] =
		"MV_LettresUniquement";
	EModeValidation[(EModeValidation["MV_ChiffreUniquement"] = 1)] =
		"MV_ChiffreUniquement";
	EModeValidation[(EModeValidation["MV_Telephone"] = 2)] = "MV_Telephone";
	EModeValidation[(EModeValidation["MV_AlphaNumerique"] = 3)] =
		"MV_AlphaNumerique";
	EModeValidation[(EModeValidation["MV_CodePostal"] = 4)] = "MV_CodePostal";
	EModeValidation[(EModeValidation["MV_Date"] = 5)] = "MV_Date";
	EModeValidation[(EModeValidation["MV_All"] = 6)] = "MV_All";
	EModeValidation[(EModeValidation["MV_Obligatoire"] = 7)] = "MV_Obligatoire";
})(EModeValidation || (exports.EModeValidation = EModeValidation = {}));
var ETypeValidation;
(function (ETypeValidation) {
	ETypeValidation[(ETypeValidation["TV_Regex"] = 1)] = "TV_Regex";
	ETypeValidation[(ETypeValidation["TV_Date"] = 2)] = "TV_Date";
	ETypeValidation[(ETypeValidation["TV_Aucun"] = 3)] = "TV_Aucun";
})(ETypeValidation || (exports.ETypeValidation = ETypeValidation = {}));
var ETypeDonneeInscription;
(function (ETypeDonneeInscription) {
	ETypeDonneeInscription["civilite"] = "civilite";
	ETypeDonneeInscription["nom"] = "nom";
	ETypeDonneeInscription["nomNaissance"] = "nomNaissance";
	ETypeDonneeInscription["prenom"] = "prenoms";
	ETypeDonneeInscription["ville"] = "ville";
	ETypeDonneeInscription["pays"] = "pays";
	ETypeDonneeInscription["villeNaissance"] = "villeNaissance";
	ETypeDonneeInscription["paysNaissance"] = "paysNaissance";
	ETypeDonneeInscription["adresse"] = "adresse";
	ETypeDonneeInscription["complementAdresse"] = "complementAdresse";
	ETypeDonneeInscription["codePostal"] = "codePostal";
	ETypeDonneeInscription["parente"] = "parente";
	ETypeDonneeInscription["etablissementActuel"] = "etablissementActuel";
	ETypeDonneeInscription["classeActuelle"] = "classeActuelle";
	ETypeDonneeInscription["projetsAccompagnement"] = "projetsAccompagnement";
	ETypeDonneeInscription["scolariteActuelle"] = "scolariteActuelle";
	ETypeDonneeInscription["regime"] = "regime";
	ETypeDonneeInscription["hebergeEnfant"] = "hebergeEnfant";
	ETypeDonneeInscription["responsableFinancier"] = "responsableFinancier";
	ETypeDonneeInscription["percoitAides"] = "percoitAides";
	ETypeDonneeInscription["situation"] = "situation";
	ETypeDonneeInscription["profession"] = "profession";
	ETypeDonneeInscription["indicatifTelFixe"] = "indicatifTelFixe";
	ETypeDonneeInscription["numeroTelFixe"] = "numeroTelFixe";
	ETypeDonneeInscription["indicatifTelMobile"] = "indicatifTelMobile";
	ETypeDonneeInscription["numeroTelMobile"] = "numeroTelMobile";
	ETypeDonneeInscription["indicatifTelBureau"] = "indicatifTelBureau";
	ETypeDonneeInscription["numeroTelBureau"] = "numeroTelBureau";
	ETypeDonneeInscription["formation"] = "formation";
	ETypeDonneeInscription["options"] = "options";
	ETypeDonneeInscription["redoublant"] = "redoublant";
	ETypeDonneeInscription["dateNaissance"] = "dateNaissance";
	ETypeDonneeInscription["nomEnfant"] = "nomEnfantPostulant";
	ETypeDonneeInscription["prenomEnfant"] = "prenomEnfantPostulant";
	ETypeDonneeInscription["sexe"] = "sexeEnfant";
	ETypeDonneeInscription["email"] = "email";
	ETypeDonneeInscription["commentairePA"] = "commentairePA";
	ETypeDonneeInscription["commentaire"] = "commentaire";
	ETypeDonneeInscription["ine"] = "ine";
	ETypeDonneeInscription["boursier"] = "boursier";
	ETypeDonneeInscription["responsabilite"] = "responsabilite";
})(
	ETypeDonneeInscription ||
		(exports.ETypeDonneeInscription = ETypeDonneeInscription = {}),
);
var EGroupeDonneeInscription;
(function (EGroupeDonneeInscription) {
	EGroupeDonneeInscription["identite"] = "identite";
	EGroupeDonneeInscription["responsables"] = "responsables";
	EGroupeDonneeInscription["scolariteActuelle"] = "scolariteActuelle";
	EGroupeDonneeInscription["fratrie"] = "fratrie";
	EGroupeDonneeInscription["scolarite"] = "scolarite";
})(
	EGroupeDonneeInscription ||
		(exports.EGroupeDonneeInscription = EGroupeDonneeInscription = {}),
);
var EEtape;
(function (EEtape) {
	EEtape["consigne"] = "consigne";
	EEtape["identite"] = "identite";
	EEtape["scolarite"] = "scolarite";
	EEtape["responsables"] = "responsables";
	EEtape["fratrie"] = "fratrie";
	EEtape["champsLibre"] = "champsLibre";
	EEtape["documents"] = "documents";
})(EEtape || (exports.EEtape = EEtape = {}));

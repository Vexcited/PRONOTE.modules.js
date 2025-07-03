exports.typeGenreDestinataireCollecteToTypeGenreDestinataire =
	exports.typeGenreDestinataireCollecteToTypeGenreCumulDocEleve =
	exports.typeGenreCumulDocEleveToTypeGenreDestinataireCollecte =
	exports.genreRessourceToTypeGenreCumulDocEleve =
	exports.typeGenreCumulDocEleveToGenreRessource =
	exports.TypeGenreDestinataireCollecte =
	exports.TypeGenreCumulDocEleve =
	exports.TypeColonneDocumentsEleve =
	exports.TypeConsultationDocumentCasier =
		void 0;
var TypeConsultationDocumentCasier;
(function (TypeConsultationDocumentCasier) {
	TypeConsultationDocumentCasier[
		(TypeConsultationDocumentCasier["CoDC_Depositaire"] = 0)
	] = "CoDC_Depositaire";
	TypeConsultationDocumentCasier[
		(TypeConsultationDocumentCasier["CoDC_Destinataire"] = 1)
	] = "CoDC_Destinataire";
	TypeConsultationDocumentCasier[
		(TypeConsultationDocumentCasier["CoDC_DestResponsable"] = 2)
	] = "CoDC_DestResponsable";
	TypeConsultationDocumentCasier[
		(TypeConsultationDocumentCasier["CoDC_DepResponsable"] = 3)
	] = "CoDC_DepResponsable";
	TypeConsultationDocumentCasier[
		(TypeConsultationDocumentCasier["CoDC_DestSignature"] = 4)
	] = "CoDC_DestSignature";
})(
	TypeConsultationDocumentCasier ||
		(exports.TypeConsultationDocumentCasier = TypeConsultationDocumentCasier =
			{}),
);
var TypeColonneDocumentsEleve;
(function (TypeColonneDocumentsEleve) {
	TypeColonneDocumentsEleve[(TypeColonneDocumentsEleve["CDE_Sigma"] = 0)] =
		"CDE_Sigma";
	TypeColonneDocumentsEleve[(TypeColonneDocumentsEleve["CDE_Libelle"] = 1)] =
		"CDE_Libelle";
	TypeColonneDocumentsEleve[(TypeColonneDocumentsEleve["CDE_Eleves"] = 2)] =
		"CDE_Eleves";
	TypeColonneDocumentsEleve[
		(TypeColonneDocumentsEleve["CDE_Responsables"] = 3)
	] = "CDE_Responsables";
	TypeColonneDocumentsEleve[(TypeColonneDocumentsEleve["CDE_DateDepot"] = 4)] =
		"CDE_DateDepot";
	TypeColonneDocumentsEleve[
		(TypeColonneDocumentsEleve["CDE_Notification"] = 5)
	] = "CDE_Notification";
	TypeColonneDocumentsEleve[
		(TypeColonneDocumentsEleve["CDE_AutorisationAcces"] = 6)
	] = "CDE_AutorisationAcces";
})(
	TypeColonneDocumentsEleve ||
		(exports.TypeColonneDocumentsEleve = TypeColonneDocumentsEleve = {}),
);
var TypeGenreCumulDocEleve;
(function (TypeGenreCumulDocEleve) {
	TypeGenreCumulDocEleve[(TypeGenreCumulDocEleve["gcdeAucun"] = 0)] =
		"gcdeAucun";
	TypeGenreCumulDocEleve[(TypeGenreCumulDocEleve["gcdeEleve"] = 1)] =
		"gcdeEleve";
	TypeGenreCumulDocEleve[(TypeGenreCumulDocEleve["gcdeRespEleve"] = 2)] =
		"gcdeRespEleve";
	TypeGenreCumulDocEleve[(TypeGenreCumulDocEleve["gcdeResp"] = 3)] = "gcdeResp";
})(
	TypeGenreCumulDocEleve ||
		(exports.TypeGenreCumulDocEleve = TypeGenreCumulDocEleve = {}),
);
var TypeGenreDestinataireCollecte;
(function (TypeGenreDestinataireCollecte) {
	TypeGenreDestinataireCollecte[
		(TypeGenreDestinataireCollecte["gdcEleve"] = 0)
	] = "gdcEleve";
	TypeGenreDestinataireCollecte[
		(TypeGenreDestinataireCollecte["gdcEleveResp"] = 1)
	] = "gdcEleveResp";
	TypeGenreDestinataireCollecte[
		(TypeGenreDestinataireCollecte["gdcResponsable"] = 2)
	] = "gdcResponsable";
})(
	TypeGenreDestinataireCollecte ||
		(exports.TypeGenreDestinataireCollecte = TypeGenreDestinataireCollecte =
			{}),
);
const ChoixDestinatairesParCriteres_1 = require("ChoixDestinatairesParCriteres");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const typeGenreCumulDocEleveToGenreRessource = (aType, aPourFinal = true) => {
	switch (aType) {
		case TypeGenreCumulDocEleve.gcdeAucun:
			break;
		case TypeGenreCumulDocEleve.gcdeEleve:
			return Enumere_Ressource_1.EGenreRessource.Eleve;
		case TypeGenreCumulDocEleve.gcdeRespEleve:
			return aPourFinal
				? Enumere_Ressource_1.EGenreRessource.Responsable
				: Enumere_Ressource_1.EGenreRessource.Eleve;
		case TypeGenreCumulDocEleve.gcdeResp:
			return Enumere_Ressource_1.EGenreRessource.Responsable;
		default:
			break;
	}
};
exports.typeGenreCumulDocEleveToGenreRessource =
	typeGenreCumulDocEleveToGenreRessource;
const genreRessourceToTypeGenreCumulDocEleve = (aGenre, aPourFinal = true) => {
	switch (aGenre) {
		case Enumere_Ressource_1.EGenreRessource.Eleve:
			return TypeGenreCumulDocEleve.gcdeEleve;
		case Enumere_Ressource_1.EGenreRessource.Responsable:
			return aPourFinal
				? TypeGenreCumulDocEleve.gcdeResp
				: TypeGenreCumulDocEleve.gcdeRespEleve;
		default:
			break;
	}
};
exports.genreRessourceToTypeGenreCumulDocEleve =
	genreRessourceToTypeGenreCumulDocEleve;
const typeGenreCumulDocEleveToTypeGenreDestinataireCollecte = (aType) => {
	switch (aType) {
		case TypeGenreCumulDocEleve.gcdeEleve:
			return TypeGenreDestinataireCollecte.gdcEleve;
		case TypeGenreCumulDocEleve.gcdeRespEleve:
			return TypeGenreDestinataireCollecte.gdcEleveResp;
		case TypeGenreCumulDocEleve.gcdeResp:
			return TypeGenreDestinataireCollecte.gdcResponsable;
		default:
			break;
	}
};
exports.typeGenreCumulDocEleveToTypeGenreDestinataireCollecte =
	typeGenreCumulDocEleveToTypeGenreDestinataireCollecte;
const typeGenreDestinataireCollecteToTypeGenreCumulDocEleve = (aType) => {
	switch (aType) {
		case TypeGenreDestinataireCollecte.gdcEleve:
			return TypeGenreCumulDocEleve.gcdeEleve;
		case TypeGenreDestinataireCollecte.gdcEleveResp:
			return TypeGenreCumulDocEleve.gcdeRespEleve;
		case TypeGenreDestinataireCollecte.gdcResponsable:
			return TypeGenreCumulDocEleve.gcdeResp;
		default:
			break;
	}
};
exports.typeGenreDestinataireCollecteToTypeGenreCumulDocEleve =
	typeGenreDestinataireCollecteToTypeGenreCumulDocEleve;
const typeGenreDestinataireCollecteToTypeGenreDestinataire = (aType) => {
	switch (aType) {
		case TypeGenreDestinataireCollecte.gdcEleve:
		case TypeGenreDestinataireCollecte.gdcEleveResp:
			return ChoixDestinatairesParCriteres_1.TypeGenreDestinataire.GD_Eleve;
		case TypeGenreDestinataireCollecte.gdcResponsable:
			return ChoixDestinatairesParCriteres_1.TypeGenreDestinataire
				.GD_Responsable;
		default:
			break;
	}
};
exports.typeGenreDestinataireCollecteToTypeGenreDestinataire =
	typeGenreDestinataireCollecteToTypeGenreDestinataire;

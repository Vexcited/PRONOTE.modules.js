exports.genreRessourceToTypeGenreDestinataire =
	exports.TypeGenreDestinataire =
	exports.TypeGenreDocumentTelechargeable =
	exports.TypeGenreRequeteDestinataireParCriteres =
	exports.TypeChoixTelechargementDoc =
	exports.TypeGenreCritereTelechargement =
	exports.TradChoixDestinatairesParCriteres =
		void 0;
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
const TradChoixDestinatairesParCriteres =
	ObjetTraduction_1.TraductionsModule.getModule(
		"ChoixDestinatairesParCriteres",
		{
			Classe: "",
			ClasseSelec: "",
			ClassesSelec: "",
			Rubriques: "",
			RubriqueSelec: "",
			RubriquesSelec: "",
			Regime: "",
			RegimeSelec: "",
			RegimesSelec: "",
			AutorisationDeSortie: "",
			AutorisationSelec: "",
			AutorisationsSelec: "",
			Delegue: "",
			ProjetAcc: "",
			PASelec: "",
			PAsSelec: "",
			Niveau: "",
			NiveauSelec: "",
			NiveauxSelec: "",
			messageCtnRubrique: "",
			messageCtnRegime: "",
			messageCtnAutorisationDeSortie: "",
			messageCtnProjetAccompagnement: "",
			WaiClasse: "",
			WaiRubrique: "",
			WaiRegime: "",
			WaiAutorisationDeSortie: "",
			WaiDelegue: "",
			WaiProjetAcc: "",
			WaiNiveau: "",
			WaiSelectionDesRessources: "",
			WaiGenreRessourceCritere: "",
			Tous: "",
			Nominativement: "",
			ParCriteres: "",
			SerontPrisEnCompte: "",
			ChoixCritereDisponibilite: "",
			RepasMidi: "",
			RepasSoir: "",
			RepasMidiSoir: "",
			Internat: "",
			ChoixDesDestinataires: "",
			TitreFenetreCritere: "",
			TotalIndiv: "",
			Destinataires: "",
			AucunDestinataire: "",
			ChoisirDestinataires: "",
			ChoisirCriteres: "",
			DeResponsable: "",
			DesEleve: "",
		},
	);
exports.TradChoixDestinatairesParCriteres = TradChoixDestinatairesParCriteres;
var TypeGenreCritereTelechargement;
(function (TypeGenreCritereTelechargement) {
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_AppartenanceClasse"] = 0)
	] = "CTMDOC_AppartenanceClasse";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_LienFamille"] = 1)
	] = "CTMDOC_LienFamille";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_Regime"] = 2)
	] = "CTMDOC_Regime";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_AutorisationDeSortie"] = 3)
	] = "CTMDOC_AutorisationDeSortie";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_EstDelegue"] = 4)
	] = "CTMDOC_EstDelegue";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_NiveauResponsabilite"] = 5)
	] = "CTMDOC_NiveauResponsabilite";
	TypeGenreCritereTelechargement[
		(TypeGenreCritereTelechargement["CTMDOC_ProjetAccompagnement"] = 6)
	] = "CTMDOC_ProjetAccompagnement";
})(
	TypeGenreCritereTelechargement ||
		(exports.TypeGenreCritereTelechargement = TypeGenreCritereTelechargement =
			{}),
);
var TypeChoixTelechargementDoc;
(function (TypeChoixTelechargementDoc) {
	TypeChoixTelechargementDoc[
		(TypeChoixTelechargementDoc["CTD_Nominatif"] = 0)
	] = "CTD_Nominatif";
	TypeChoixTelechargementDoc[(TypeChoixTelechargementDoc["CTD_Critere"] = 1)] =
		"CTD_Critere";
	TypeChoixTelechargementDoc[(TypeChoixTelechargementDoc["CTD_Tous"] = 2)] =
		"CTD_Tous";
})(
	TypeChoixTelechargementDoc ||
		(exports.TypeChoixTelechargementDoc = TypeChoixTelechargementDoc = {}),
);
var TypeGenreRequeteDestinataireParCriteres;
(function (TypeGenreRequeteDestinataireParCriteres) {
	TypeGenreRequeteDestinataireParCriteres[
		(TypeGenreRequeteDestinataireParCriteres["TGR_InfosCriteres"] = 0)
	] = "TGR_InfosCriteres";
	TypeGenreRequeteDestinataireParCriteres[
		(TypeGenreRequeteDestinataireParCriteres["TGR_TotalIndividus"] = 1)
	] = "TGR_TotalIndividus";
})(
	TypeGenreRequeteDestinataireParCriteres ||
		(exports.TypeGenreRequeteDestinataireParCriteres =
			TypeGenreRequeteDestinataireParCriteres =
				{}),
);
var TypeGenreDocumentTelechargeable;
(function (TypeGenreDocumentTelechargeable) {
	TypeGenreDocumentTelechargeable[
		(TypeGenreDocumentTelechargeable["TDT_ModeleDocument"] = 0)
	] = "TDT_ModeleDocument";
	TypeGenreDocumentTelechargeable[
		(TypeGenreDocumentTelechargeable["TDT_DocumentCasier"] = 1)
	] = "TDT_DocumentCasier";
	TypeGenreDocumentTelechargeable[
		(TypeGenreDocumentTelechargeable["TDT_NatureDocument"] = 2)
	] = "TDT_NatureDocument";
})(
	TypeGenreDocumentTelechargeable ||
		(exports.TypeGenreDocumentTelechargeable = TypeGenreDocumentTelechargeable =
			{}),
);
var TypeGenreDestinataire;
(function (TypeGenreDestinataire) {
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Professeur"] = 0)] =
		"GD_Professeur";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Responsable"] = 1)] =
		"GD_Responsable";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Eleve"] = 2)] = "GD_Eleve";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Personnel"] = 3)] =
		"GD_Personnel";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Entreprise"] = 4)] =
		"GD_Entreprise";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Inspecteur"] = 5)] =
		"GD_Inspecteur";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Academie"] = 6)] =
		"GD_Academie";
	TypeGenreDestinataire[(TypeGenreDestinataire["GD_Collectivite"] = 7)] =
		"GD_Collectivite";
})(
	TypeGenreDestinataire ||
		(exports.TypeGenreDestinataire = TypeGenreDestinataire = {}),
);
const genreRessourceToTypeGenreDestinataire = (aGenre) => {
	switch (aGenre) {
		case Enumere_Ressource_1.EGenreRessource.Enseignant:
			return TypeGenreDestinataire.GD_Professeur;
		case Enumere_Ressource_1.EGenreRessource.Responsable:
			return TypeGenreDestinataire.GD_Responsable;
		case Enumere_Ressource_1.EGenreRessource.Eleve:
			return TypeGenreDestinataire.GD_Eleve;
		case Enumere_Ressource_1.EGenreRessource.Personnel:
			return TypeGenreDestinataire.GD_Personnel;
		case Enumere_Ressource_1.EGenreRessource.Entreprise:
			return TypeGenreDestinataire.GD_Entreprise;
		default:
			break;
	}
};
exports.genreRessourceToTypeGenreDestinataire =
	genreRessourceToTypeGenreDestinataire;

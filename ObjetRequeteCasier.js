exports.TypeGenreRequeteCasier = exports.ObjetRequeteCasier = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequeteCasier extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams = {}) {
		this.JSON = $.extend(
			{ genreRequeteCasier: TypeGenreRequeteCasier.GRC_Affichage },
			aParams,
		);
		if (aParams.listeClasses) {
			aParams.listeClasses.setSerialisateurJSON({ ignorerEtatsElements: true });
			this.JSON.listeClasses = aParams.listeClasses;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.categories) {
			this.JSONReponse.categories.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			this.JSONReponse.categories.trier();
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteCasier = ObjetRequeteCasier;
CollectionRequetes_1.Requetes.inscrire("Casier", ObjetRequeteCasier);
var TypeGenreRequeteCasier;
(function (TypeGenreRequeteCasier) {
	TypeGenreRequeteCasier[(TypeGenreRequeteCasier["GRC_Affichage"] = 0)] =
		"GRC_Affichage";
	TypeGenreRequeteCasier[
		(TypeGenreRequeteCasier["GRC_ListeElevesCollecteParDocuments"] = 1)
	] = "GRC_ListeElevesCollecteParDocuments";
	TypeGenreRequeteCasier[
		(TypeGenreRequeteCasier["GRC_ListeElevesCollecteParEleves"] = 2)
	] = "GRC_ListeElevesCollecteParEleves";
	TypeGenreRequeteCasier[
		(TypeGenreRequeteCasier["GRC_ListeCategorieCasier"] = 3)
	] = "GRC_ListeCategorieCasier";
	TypeGenreRequeteCasier[
		(TypeGenreRequeteCasier["GRC_ListeCriteresEtCategoriesCasier"] = 4)
	] = "GRC_ListeCriteresEtCategoriesCasier";
})(
	TypeGenreRequeteCasier ||
		(exports.TypeGenreRequeteCasier = TypeGenreRequeteCasier = {}),
);

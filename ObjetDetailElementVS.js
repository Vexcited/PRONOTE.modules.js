exports.ObjetDetailElementVS = void 0;
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const _ObjetDetailElementVS_1 = require("_ObjetDetailElementVS");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class ObjetDetailElementVS extends _ObjetDetailElementVS_1._ObjetDetailElementVS {
	constructor(...aParams) {
		super(...aParams);
		this.avecInfoJustificationObligatoire = true;
		this.optionsAffichage.afficherNew = true;
	}
	getGenreRessourceDocumentJoint() {
		return Enumere_Ressource_1.EGenreRessource.DocumentJoint;
	}
	getGenreRessourceDocumentJointEleve() {
		return Enumere_Ressource_1.EGenreRessource.DocJointEleve;
	}
	estEspaceParent() {
		return [
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	getListeMotifs(aGenreElementVS) {
		return aGenreElementVS === Enumere_Ressource_1.EGenreRessource.Absence
			? GEtatUtilisateur.listeMotifsAbsences
			: GEtatUtilisateur.listeMotifsRetards;
	}
	estGenreElementAvecUploadDocuments(aGenreElementVS) {
		return aGenreElementVS === Enumere_Ressource_1.EGenreRessource.Absence;
	}
	getTailleMaxDocJointEtablissement() {
		return GApplication.droits.get(
			ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
		);
	}
	eventCallBackValider() {
		this.callback.appel(
			_ObjetDetailElementVS_1.TypeBoutonFenetreDetailElementVS.Valider,
			{ element: this.elementVS, documents: this.listeNouveauxDocuments },
		);
	}
}
exports.ObjetDetailElementVS = ObjetDetailElementVS;

const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GHtml } = require("ObjetHtml.js");
const {
	UtilitaireManuelsNumeriques,
} = require("UtilitaireManuelsNumeriques.js");
Requetes.inscrire("ManuelsNumeriques", ObjetRequeteConsultation);
class InterfaceManuelsNumeriques_Mobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecNomEditeur: [
				EGenreEspace.Mobile_Professeur,
				EGenreEspace.Mobile_PrimProfesseur,
				EGenreEspace.PrimDirection,
				EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecDetailsRessources: [
				EGenreEspace.Mobile_Professeur,
				EGenreEspace.Mobile_PrimProfesseur,
				EGenreEspace.PrimDirection,
				EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecCumulMatiere: [
				EGenreEspace.Mobile_Eleve,
				EGenreEspace.Mobile_PrimEleve,
			].includes(GEtatUtilisateur.GenreEspace),
		};
	}
	recupererDonnees() {
		this.actualiserDonnees();
	}
	actualiserDonnees() {
		Requetes(
			"ManuelsNumeriques",
			this,
			_surRecupererDonnees.bind(this),
		).lancerRequete();
	}
	getControleur() {
		return $.extend(true, super.getControleur(this), {});
	}
}
function _surRecupererDonnees(aJSON) {
	aJSON.kiosque.listeRessources.setTri([
		ObjetTri.init((D) => {
			return D.matiere ? !D.matiere.existeNumero() : false;
		}),
		ObjetTri.init((D) => {
			return D.matiere ? D.matiere.getLibelle() : "";
		}),
		ObjetTri.init("editeur"),
		ObjetTri.init("titre"),
	]);
	aJSON.kiosque.listeRessources.trier();
	const lHtml = [];
	lHtml.push(
		UtilitaireManuelsNumeriques.composeListeManuelsNumeriquesMobile(
			aJSON.kiosque.listeRessources,
			this.options,
			this.controleur,
		),
	);
	GHtml.setHtml(this.Nom, lHtml.join(""), { controleur: this.controleur });
}
module.exports = InterfaceManuelsNumeriques_Mobile;

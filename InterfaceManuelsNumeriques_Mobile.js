exports.InterfaceManuelsNumeriques_Mobile = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireManuelsNumeriques_1 = require("UtilitaireManuelsNumeriques");
class ObjetRequeteManuelsNumeriques extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"ManuelsNumeriques",
	ObjetRequeteManuelsNumeriques,
);
class InterfaceManuelsNumeriques_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecNomEditeur: [
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecDetailsRessources: [
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecCumulMatiere: [
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			].includes(GEtatUtilisateur.GenreEspace),
		};
	}
	recupererDonnees() {
		this.actualiserDonnees();
	}
	async actualiserDonnees() {
		const lReponse = await new ObjetRequeteManuelsNumeriques(
			this,
		).lancerRequete();
		lReponse.kiosque.listeRessources.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.matiere ? !D.matiere.existeNumero() : false;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.matiere ? D.matiere.getLibelle() : "";
			}),
			ObjetTri_1.ObjetTri.init("editeur"),
			ObjetTri_1.ObjetTri.init("titre"),
		]);
		lReponse.kiosque.listeRessources.trier();
		const lHtml = [];
		lHtml.push(
			UtilitaireManuelsNumeriques_1.UtilitaireManuelsNumeriques.composeListeManuelsNumeriquesMobile(
				lReponse.kiosque.listeRessources,
				this.options,
			),
		);
		ObjetHtml_1.GHtml.setHtml(this.Nom, lHtml.join(""), {
			controleur: this.controleur,
		});
	}
}
exports.InterfaceManuelsNumeriques_Mobile = InterfaceManuelsNumeriques_Mobile;

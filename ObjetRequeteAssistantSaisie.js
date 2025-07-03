exports.ObjetRequeteAssistantSaisie = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteAssistantSaisie extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = {};
		if (!!aParametres && !!aParametres.rangAppreciation) {
			this.JSON.rangAppreciation = aParametres.rangAppreciation;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeTypesAppreciations = this.JSONReponse.ListeTypesAppreciations;
		lListeTypesAppreciations.parcourir(this.ajouterTypeAppreciation.bind(this));
		this.callbackReussite.appel(lListeTypesAppreciations);
	}
	ajouterTypeAppreciation(aTypeAppreciation) {
		aTypeAppreciation.listeCategories.parcourir(
			this.ajouterCategoriePourTypeAppreciation.bind(
				this,
				aTypeAppreciation.getGenre(),
			),
		);
	}
	ajouterCategoriePourTypeAppreciation(aGenreAppreciation, aCategorie) {
		aCategorie.Editable = aCategorie.getActif();
		aCategorie.Supprimable = aCategorie.getActif();
		aCategorie.typeAppreciation = aGenreAppreciation;
		aCategorie.listeAppreciations.parcourir(
			this.ajouterAppreciationPourCategorie.bind(this),
		);
		aCategorie.listeAppreciations.trier();
	}
	ajouterAppreciationPourCategorie(aAppreciation) {
		aAppreciation.Editable = aAppreciation.getActif();
		aAppreciation.Supprimable = aAppreciation.getActif();
	}
}
exports.ObjetRequeteAssistantSaisie = ObjetRequeteAssistantSaisie;
CollectionRequetes_1.Requetes.inscrire(
	"PageAssistantSaisieAppreciations",
	ObjetRequeteAssistantSaisie,
);

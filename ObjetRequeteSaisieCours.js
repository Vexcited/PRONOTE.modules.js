exports.ObjetRequeteSaisieCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteSaisieCours extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		this.JSON = $.extend(
			{
				cours: null,
				numeroSemaine: -1,
				numeroSemainePlacement: undefined,
				modificationMemo: null,
				suppressionCours: false,
				scinderCours: undefined,
				scinderCoursDuree: undefined,
				coursDuplique: null,
				listeRessources: null,
				genreRessource: -1,
				ressourceRemplacee: undefined,
				deplacementCours: false,
				placePose: undefined,
				dureePose: undefined,
				forcerSaisie: false,
			},
			aParametres,
		);
		if (this.JSON.listeCours) {
			this.JSON.listeCours.setSerialisateurJSON({
				ignorerEtatsElements: true,
				nePasTrierPourValidation: true,
			});
		}
		if (this.JSON.listeRessources) {
			this.JSON.listeRessources.setSerialisateurJSON({
				ignorerEtatsElements: true,
				nePasTrierPourValidation: true,
			});
			this.JSON.ressourcesRemplacees =
				new ObjetListeElements_1.ObjetListeElements();
			this.JSON.ressourcesRemplacees.setSerialisateurJSON({
				ignorerEtatsElements: true,
				nePasTrierPourValidation: true,
			});
			if (aParametres.ressourceRemplacee) {
				if (
					aParametres.ressourceRemplacee instanceof
					ObjetListeElements_1.ObjetListeElements
				) {
					this.JSON.ressourcesRemplacees.add(aParametres.ressourceRemplacee);
				} else if (
					aParametres.ressourceRemplacee instanceof ObjetElement_1.ObjetElement
				) {
					this.JSON.ressourcesRemplacees.addElement(
						aParametres.ressourceRemplacee,
					);
				}
				this.JSON.ressourceRemplacee = undefined;
			}
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieCours = ObjetRequeteSaisieCours;
CollectionRequetes_1.Requetes.inscrire("SaisieCours", ObjetRequeteSaisieCours);

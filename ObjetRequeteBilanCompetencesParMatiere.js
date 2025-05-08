const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class ObjetRequeteBilanCompetencesParMatiere extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = $.extend({ classe: null, periode: null, eleve: null }, aParams);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse) {
			_deserialiserListeElementsCompetences(this.JSONReponse.listeCompetences);
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire(
	"BilanCompetencesParMatiere",
	ObjetRequeteBilanCompetencesParMatiere,
);
function _deserialiserListeElementsCompetences(aListe) {
	if (aListe) {
		aListe.parcourir((D) => {
			if (D.listeNiveaux) {
				D.listeNiveaux.parcourir((aNiveau) => {
					Object.assign(aNiveau, _getNiveauGlobalDeGenre(aNiveau.getGenre()));
				});
				D.listeNiveauxParNiveau =
					TUtilitaireCompetences.regroupeNiveauxDAcquisitions(D.listeNiveaux);
			}
			if (D.listeColonnesServices) {
				D.listeColonnesServices.parcourir((aColonneService) => {
					if (aColonneService.listeNiveaux) {
						aColonneService.listeNiveaux.parcourir((aNiveau) => {
							Object.assign(
								aNiveau,
								_getNiveauGlobalDeGenre(aNiveau.getGenre()),
							);
						});
						aColonneService.listeNiveauxParNiveau =
							TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
								aColonneService.listeNiveaux,
							);
					}
					if (aColonneService.niveauAcqui) {
						aColonneService.niveauAcqui = _getNiveauGlobalDeGenre(
							aColonneService.niveauAcqui.getGenre(),
						);
					}
					if (aColonneService.niveauAcquiMoyenne) {
						aColonneService.niveauAcquiMoyenne = _getNiveauGlobalDeGenre(
							aColonneService.niveauAcquiMoyenne.getGenre(),
						);
					}
				});
			}
		});
	}
}
function _getNiveauGlobalDeGenre(aGenre) {
	return GParametres.listeNiveauxDAcquisitions.getElementParGenre(aGenre);
}
module.exports = ObjetRequeteBilanCompetencesParMatiere;

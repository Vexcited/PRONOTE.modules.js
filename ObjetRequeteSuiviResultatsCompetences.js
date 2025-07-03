exports.ObjetRequeteSuiviResultatsCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class ObjetRequeteSuiviResultatsCompetences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{
				classe: null,
				periode: null,
				eleve: null,
				seuilSucces: 0,
				seuilEchecs: 0,
			},
			aParams,
		);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeCompetencesEchecs) {
			this._deserialiserListeElementsCompetences(
				this.JSONReponse.listeCompetencesEchecs,
			);
		}
		if (this.JSONReponse.listeCompetencesSucces) {
			this._deserialiserListeElementsCompetences(
				this.JSONReponse.listeCompetencesSucces,
			);
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
	_deserialiserListeElementsCompetences(aListe) {
		if (aListe) {
			for (const lElemCompetence of aListe) {
				if (lElemCompetence.listeNiveaux) {
					lElemCompetence.listeNiveaux.parcourir((aNiveau) => {
						Object.assign(
							aNiveau,
							this._getNiveauGlobalDeGenre(aNiveau.getGenre()),
						);
					});
					lElemCompetence.listeNiveauxParNiveau =
						UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
							lElemCompetence.listeNiveaux,
						);
				}
			}
		}
	}
	_getNiveauGlobalDeGenre(aGenre) {
		return GParametres.listeNiveauxDAcquisitions.getElementParGenre(aGenre);
	}
}
exports.ObjetRequeteSuiviResultatsCompetences =
	ObjetRequeteSuiviResultatsCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"SuiviResultatsCompetences",
	ObjetRequeteSuiviResultatsCompetences,
);

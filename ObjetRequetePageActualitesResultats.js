exports.ObjetRequetePageActualitesResultats = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
class ObjetRequetePageActualitesResultats extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.actualite = aParametres.actualite;
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		let lNumeroPere;
		function _getIndicePere(aEle) {
			return aEle.NumeroArticleLigne === lNumeroPere;
		}
		function _getIndicePremierFils(aEle) {
			return aEle.NumeroArticlePere === lNumeroPere;
		}
		this.actualite.avecResultats = false;
		const lResultats = this.JSONReponse;
		if (lResultats && lResultats.listeQuestions) {
			lResultats.listeQuestions.parcourir((aQstResultat) => {
				const lQuestion = this.actualite.listeQuestions.getElementParNumero(
					aQstResultat.getNumero(),
				);
				lQuestion.niveauMaxCumul = 0;
				if (!!lQuestion && !!aQstResultat && !!aQstResultat.listeRepondant) {
					lQuestion.resultats = {};
					lQuestion.resultats.listeRepondant = aQstResultat.listeRepondant;
					this.actualite.avecResultats = true;
					lQuestion.resultats.listeRepondant.parcourir((lElement) => {
						if (lElement.estCumul) {
							lElement.estDeploye = false;
							lNumeroPere = lElement.NumeroArticleLigne;
							lElement.estUnDeploiement =
								!this.actualite.reponseAnonyme ||
								lQuestion.genreReponse ===
									TypeGenreReponseInternetActualite_1
										.TypeGenreReponseInternetActualite.Textuelle ||
								lQuestion.resultats.listeRepondant.getIndiceElementParFiltre(
									_getIndicePremierFils,
								) > -1;
							lQuestion.niveauMaxCumul = Math.max(
								lQuestion.niveauMaxCumul,
								lElement.niveauCumul,
							);
						} else {
							lElement.estUnDeploiement = false;
						}
						if (lElement.NumeroArticlePere !== 0) {
							lNumeroPere = lElement.NumeroArticlePere;
							const lIndicePere =
								lQuestion.resultats.listeRepondant.getIndiceElementParFiltre(
									_getIndicePere,
								);
							if (lIndicePere > -1) {
								lElement.pere =
									lQuestion.resultats.listeRepondant.get(lIndicePere);
							}
						}
					});
					lQuestion.niveauMaxCumul += 1;
				}
			});
		}
		this.callbackReussite.appel(this.actualite);
	}
}
exports.ObjetRequetePageActualitesResultats =
	ObjetRequetePageActualitesResultats;
CollectionRequetes_1.Requetes.inscrire(
	"PageActualitesResultats",
	ObjetRequetePageActualitesResultats,
);

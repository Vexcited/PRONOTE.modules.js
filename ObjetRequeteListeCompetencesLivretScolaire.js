exports.ObjetRequeteListeCompetencesLivretScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteListeCompetencesLivretScolaire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lResult = {};
		if (this.JSONReponse.listeEvaluationsLS) {
			lResult.listeEvaluationsLS =
				new ObjetListeElements_1.ObjetListeElements();
			this.recupererDonnees(
				this.JSONReponse.listeEvaluationsLS,
				lResult.listeEvaluationsLS,
			);
		}
		if (this.JSONReponse.listeEvaluationsLSLV) {
			lResult.listeEvaluationsLSLV =
				new ObjetListeElements_1.ObjetListeElements();
			this.recupererDonnees(
				this.JSONReponse.listeEvaluationsLSLV,
				lResult.listeEvaluationsLSLV,
			);
		}
		this.callbackReussite.appel(lResult);
	}
	recupererDonnees(aTabJSON, aDonnees) {
		if (aTabJSON) {
			for (let i in aTabJSON) {
				this._ajouterItemEvaluation(aTabJSON[i], aDonnees);
			}
		} else {
			aDonnees = null;
		}
	}
	_ajouterItemEvaluation(aJSON, aParametre) {
		const lElement = aJSON
			? new ObjetElement_1.ObjetElement().fromJSON(aJSON)
			: null;
		lElement.abbreviation = aJSON.abbreviation ? aJSON.abbreviation : "";
		if (lElement.getGenre() === undefined) {
			lElement.Genre = -1;
		}
		aParametre.addElement(lElement);
	}
}
exports.ObjetRequeteListeCompetencesLivretScolaire =
	ObjetRequeteListeCompetencesLivretScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"ListeCompetencesLivretScolaire",
	ObjetRequeteListeCompetencesLivretScolaire,
);

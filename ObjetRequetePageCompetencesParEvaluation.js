const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetUtilitaireEvaluation } = require("ObjetUtilitaireEvaluation.js");
class ObjetRequetePageCompetencesParEvaluation extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.evaluation = aParams.evaluation
			? aParams.evaluation
			: aParams.devoir.evaluation;
		this.JSON = {
			evaluation: aParams.evaluation,
			devoir: aParams.devoir,
			ressource: this.evaluation.classe
				? this.evaluation.classe
				: aParams.classe,
			periodeEvaluation: this.evaluation ? this.evaluation.periode : undefined,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeClasses = this.JSONReponse.listeClasses;
		const lListeEleves = this.JSONReponse.listeEleves;
		lListeEleves.parcourir((aEleve) => {
			const lClasse = lListeClasses.getElementParNumero(
				aEleve.classe.getNumero(),
			);
			if (lClasse) {
				aEleve.listePiliers = lClasse.listePiliers;
				if (lClasse.niveau) {
					aEleve.classe.niveau = lClasse.niveau;
				}
			}
		});
		lListeEleves.trier();
		this.evaluation.listeEleves = lListeEleves;
		ObjetUtilitaireEvaluation.initEvaluation(
			this.evaluation,
			lListeEleves,
			this.evaluation.listePiliers,
		);
		const lEvaluation = this.evaluation;
		let lEleveEvaluation = null;
		if (!!this.JSONReponse.ListeElevesCompetences) {
			this.JSONReponse.ListeElevesCompetences.parcourir((aEleveCompetence) => {
				if (!!aEleveCompetence && !!aEleveCompetence.ListeCompetences) {
					lEleveEvaluation =
						lEvaluation.listeEleves.getElementParElement(aEleveCompetence);
					if (!!lEleveEvaluation && !!lEleveEvaluation.listeCompetences) {
						aEleveCompetence.ListeCompetences.parcourir(
							(aCompetenceDEleveCompetence) => {
								let lCompetenceDEleveEval = null;
								lEleveEvaluation.listeCompetences.parcourir((D) => {
									if (
										D &&
										D.relationESI &&
										D.relationESI.getNumero() ===
											aCompetenceDEleveCompetence.getNumero()
									) {
										lCompetenceDEleveEval = D;
										return false;
									}
								});
								if (!!lCompetenceDEleveEval) {
									lCompetenceDEleveEval.niveauDAcquisition =
										aCompetenceDEleveCompetence.NiveauDAcquisition;
									lCompetenceDEleveEval.date = aCompetenceDEleveCompetence.Date;
									lCompetenceDEleveEval.observation =
										aCompetenceDEleveCompetence.Observation;
									lCompetenceDEleveEval.observationPubliee =
										aCompetenceDEleveCompetence.ObservationPubliee;
									lCompetenceDEleveEval.listeReponsesQCM =
										aCompetenceDEleveCompetence.listeReponsesQCM;
								}
							},
						);
					}
				}
			});
		}
		if (!!this.JSONReponse.ListeElevesNotes) {
			this.JSONReponse.ListeElevesNotes.parcourir((aEleveNote) => {
				if (!!aEleveNote && !!aEleveNote.devoir) {
					lEleveEvaluation =
						lEvaluation.listeEleves.getElementParElement(aEleveNote);
					if (!!lEleveEvaluation) {
						lEleveEvaluation.note = aEleveNote.devoir.note;
					}
				}
			});
		}
		this.callbackReussite.appel(this.evaluation);
	}
}
Requetes.inscrire(
	"PageCompetencesParEvaluation",
	ObjetRequetePageCompetencesParEvaluation,
);
module.exports = { ObjetRequetePageCompetencesParEvaluation };

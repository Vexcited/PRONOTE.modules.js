const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class ObjetRequeteListeEvaluations extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = {
			service: aParams.service,
			ressource: aParams.ressource,
			periode: aParams.periode,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeEvaluations = this.JSONReponse.listeEvaluations;
		lListeEvaluations.parcourir((aElement) => {
			if (GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement) {
				aElement.serviceLVE =
					aElement.service && aElement.service.existeNumero()
						? aElement.service
						: null;
			}
			aElement.listeSujets = new ObjetListeElements();
			if (!!aElement.elmSujet) {
				aElement.listeSujets.addElement(aElement.elmSujet);
			} else if (!!aElement.libelleSujet) {
				aElement.listeSujets.addElement(
					new ObjetElement(
						aElement.libelleSujet,
						aElement.getNumero(),
						EGenreDocumentJoint.Fichier,
					),
				);
			}
			aElement.listeCorriges = new ObjetListeElements();
			if (!!aElement.elmCorrige) {
				aElement.listeCorriges.addElement(aElement.elmCorrige);
			} else if (!!aElement.libelleCorrige) {
				aElement.listeCorriges.addElement(
					new ObjetElement(
						aElement.libelleCorrige,
						aElement.getNumero(),
						EGenreDocumentJoint.Fichier,
					),
				);
			}
			for (
				let i = 0;
				aElement.listeCompetences && i < aElement.listeCompetences.count();
				i++
			) {
				const lCompetence = aElement.listeCompetences.get(i);
				if (lCompetence.pilier.estSocleCommun) {
					aElement.estSocleCommun = true;
				}
				if (lCompetence.pilier.estPersonnalise) {
					aElement.estPersonnalise = true;
				}
				if (!!lCompetence.niveauAcquiDefaut) {
					lCompetence.niveauAcquiDefaut =
						GParametres.listeNiveauxDAcquisitions.getElementParGenre(
							lCompetence.niveauAcquiDefaut.getGenre(),
						);
				}
				if (!!lCompetence.informationQCM) {
					lCompetence.informationQCM.listeQuestions =
						new ObjetListeElements().fromJSON(
							lCompetence.informationQCM.listeQuestions,
							_ajouterQuestionQCM,
						);
				}
			}
		});
		if (this.JSONReponse.listePeriodes) {
			this.JSONReponse.listePeriodes.trier();
		}
		this.callbackReussite.appel({
			strInfoCloture: this.JSONReponse.strInfoCloture,
			avecSaisie: this.JSONReponse.avecSaisie,
			serviceNavigationEstLVE: this.JSONReponse.estServiceLVE,
			droitSaisieNotes: this.JSONReponse.droitSaisieNotes,
			listeEvaluations: lListeEvaluations,
			listeSujets: this.JSONReponse.listeSujets,
			listeCorriges: this.JSONReponse.listeCorriges,
			listeServicesLVE: this.JSONReponse.listeServicesLVE,
			listePeriodes: this.JSONReponse.listePeriodes,
			parametresCreationDevoir: this.JSONReponse.paramsCreationDevoir,
			listeReferentielsUniques: this.JSONReponse.listeReferentielsUniques,
			messageCreationImpossible: this.JSONReponse.messageCreationImpossible,
			hintOptionPourcentageReussite:
				this.JSONReponse.hintOptionPourcentageReussite,
		});
	}
}
Requetes.inscrire("ListeEvaluations", ObjetRequeteListeEvaluations);
function _ajouterQuestionQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	aElement.nouvellePosition = aElement.position;
	if (aJSON.listeReponses) {
		aElement.listeReponses = new ObjetListeElements().fromJSON(
			aJSON.listeReponses,
			_ajouterReponseQCM,
		);
	}
}
function _ajouterReponseQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}
module.exports = { ObjetRequeteListeEvaluations };

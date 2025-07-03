exports.ObjetRequeteListeEvaluations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Espace_1 = require("Enumere_Espace");
class ObjetRequeteListeEvaluations extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lListeEvaluations = this.JSONReponse.listeEvaluations;
		lListeEvaluations.parcourir((aElement) => {
			if (
				GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement
			) {
				aElement.serviceLVE =
					aElement.service && aElement.service.existeNumero()
						? aElement.service
						: null;
			}
			aElement.listeSujets = new ObjetListeElements_1.ObjetListeElements();
			if (!!aElement.elmSujet) {
				aElement.listeSujets.addElement(aElement.elmSujet);
			} else if (!!aElement.libelleSujet) {
				aElement.listeSujets.addElement(
					new ObjetElement_1.ObjetElement(
						aElement.libelleSujet,
						aElement.getNumero(),
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					),
				);
			}
			aElement.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
			if (!!aElement.elmCorrige) {
				aElement.listeCorriges.addElement(aElement.elmCorrige);
			} else if (!!aElement.libelleCorrige) {
				aElement.listeCorriges.addElement(
					new ObjetElement_1.ObjetElement(
						aElement.libelleCorrige,
						aElement.getNumero(),
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
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
						new ObjetListeElements_1.ObjetListeElements().fromJSON(
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
exports.ObjetRequeteListeEvaluations = ObjetRequeteListeEvaluations;
CollectionRequetes_1.Requetes.inscrire(
	"ListeEvaluations",
	ObjetRequeteListeEvaluations,
);
function _ajouterQuestionQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
	aElement.nouvellePosition = aElement.position;
	if (aJSON.listeReponses) {
		aElement.listeReponses =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				aJSON.listeReponses,
				_ajouterReponseQCM,
			);
	}
}
function _ajouterReponseQCM(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}

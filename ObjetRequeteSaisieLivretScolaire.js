exports.ObjetRequeteSaisieLivretScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetSerialiser_1 = require("ObjetSerialiser");
const TypeModeDAffichagePFMP_1 = require("TypeModeDAffichagePFMP");
class ObjetRequeteSaisieLivretScolaire extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aDonnees) {
		let lListe;
		this.JSON.classe = aDonnees.classeSelectionne.toJSON();
		switch (aDonnees.genre) {
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche:
				if (aDonnees.eleve) {
					this.JSON.eleve = aDonnees.eleve.toJSON();
				}
				lListe = aDonnees.eleve.listeLivret.getListeElements((aElement) => {
					const lEnModification =
						aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun;
					const lAppreciationModifie =
						aElement.appreciationAnnuelle &&
						aElement.appreciationAnnuelle.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Aucun;
					const lAvecModifConserverAnciennesNotes =
						aDonnees.eleve.estRedoublant &&
						aElement.modifConserveAnciennesNotes === true;
					return (
						lEnModification ||
						lAppreciationModifie ||
						lAvecModifConserverAnciennesNotes
					);
				});
				break;
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations:
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences:
				if (aDonnees.service) {
					this.JSON.service = aDonnees.service.toJSON();
				}
				lListe = aDonnees.service.listeLivret.getListeElements((aElement) => {
					const lEnModification =
						aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun;
					const lAppreciationModifie =
						aElement.appreciationAnnuelle &&
						aElement.appreciationAnnuelle.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Aucun;
					return lEnModification || lAppreciationModifie;
				});
				break;
			default:
		}
		lListe.setSerialisateurJSON({
			ignorerEtatsElements: true,
			methodeSerialisation: _serialisation.bind(this),
		});
		this.JSON.listeLivret = lListe;
		const lParametres = aDonnees.piedDePage;
		if (
			lParametres &&
			lParametres.avisCE &&
			lParametres.avisCE.infosLivret &&
			lParametres.avisCE.infosLivret.pourValidation()
		) {
			this.JSON.infosAvisCE = lParametres.avisCE.infosLivret.toJSON();
			this.JSON.infosAvisCE.commentaire =
				lParametres.avisCE.infosLivret.commentaire;
			if (lParametres.avisCE.infosLivret.date) {
				this.JSON.infosAvisCE.date = lParametres.avisCE.infosLivret.date;
			}
			if (lParametres.avisCE.infosLivret.auteur) {
				this.JSON.infosAvisCE.auteur = lParametres.avisCE.infosLivret.auteur;
			}
			if (lParametres.avisCE.infosLivret.avis) {
				this.JSON.infosAvisCE.avis =
					lParametres.avisCE.infosLivret.avis.toJSON();
			}
		}
		if (
			lParametres &&
			lParametres.engagements &&
			lParametres.engagements.infosLivret &&
			lParametres.engagements.estModifie
		) {
			lParametres.engagements.listeEngagements.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			this.JSON.infosEngagements = lParametres.engagements.infosLivret.toJSON();
			if (lParametres.engagements.infosLivret.pourValidation()) {
				this.JSON.infosEngagements.commentaire =
					lParametres.engagements.infosLivret.commentaire;
			}
			if (lParametres.engagements.infosLivret.date) {
				this.JSON.infosEngagements.date =
					lParametres.engagements.infosLivret.date;
			}
			if (lParametres.engagements.infosLivret.auteur) {
				this.JSON.infosEngagements.auteur =
					lParametres.engagements.infosLivret.auteur;
			}
			this.JSON.infosEngagements.listeEngagements =
				lParametres.engagements.listeEngagements;
		}
		if (
			lParametres &&
			lParametres.investissement &&
			lParametres.investissement.infosLivret &&
			lParametres.investissement.estModifie
		) {
			this.JSON.infosInvestissement =
				lParametres.investissement.infosLivret.toJSON();
			if (lParametres.investissement.infosLivret.pourValidation()) {
				this.JSON.infosInvestissement.commentaire =
					lParametres.investissement.infosLivret.commentaire;
			}
			if (lParametres.investissement.infosLivret.date) {
				this.JSON.infosInvestissement.date =
					lParametres.investissement.infosLivret.date;
			}
			if (lParametres.investissement.infosLivret.auteur) {
				this.JSON.infosInvestissement.auteur =
					lParametres.investissement.infosLivret.auteur;
			}
		}
		if (
			lParametres &&
			lParametres.pfmp &&
			lParametres.pfmp.infosLSEleve &&
			lParametres.pfmp.infosLSEleve.pourValidation()
		) {
			this.JSON.infosPfmp = lParametres.pfmp.infosLSEleve.toJSON();
			if (
				lParametres.pfmp.modeAff !==
				TypeModeDAffichagePFMP_1.TypeModeDAffichagePFMP.tMAPFMP_CAP
			) {
				this.JSON.infosPfmp.nombreSemaines =
					lParametres.pfmp.infosLSEleve.nombreSemaines;
				this.JSON.infosPfmp.aLEtranger =
					lParametres.pfmp.infosLSEleve.aLEtranger;
			}
			this.JSON.infosPfmp.appreciation =
				lParametres.pfmp.infosLSEleve.appreciation;
		}
		if (
			lParametres &&
			lParametres.parcoursDifferencie &&
			lParametres.parcoursDifferencie.infosLivret &&
			lParametres.parcoursDifferencie.infosLivret.pourValidation()
		) {
			this.JSON.parcoursDifferencie =
				lParametres.parcoursDifferencie.infosLivret.toJSON();
			this.JSON.parcoursDifferencie.commentaire =
				lParametres.parcoursDifferencie.infosLivret.commentaire;
			this.JSON.parcoursDifferencie.date =
				lParametres.parcoursDifferencie.infosLivret.date;
			this.JSON.parcoursDifferencie.auteur =
				lParametres.parcoursDifferencie.infosLivret.auteur;
		}
		if (!!aDonnees.listeTypesAppreciations) {
			const lObjetSerialiser = new ObjetSerialiser_1.ObjetSerialiser();
			aDonnees.listeTypesAppreciations.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation:
					lObjetSerialiser.serialiseTypeAppreciationAssistSaisie.bind(
						lObjetSerialiser,
					),
			});
			this.JSON.listeTypeAppreciations = aDonnees.listeTypesAppreciations;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieLivretScolaire = ObjetRequeteSaisieLivretScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieLivretScolaire",
	ObjetRequeteSaisieLivretScolaire,
);
function _serialisation(aElement, aJSON) {
	if (aElement.service) {
		aJSON.service = aElement.service.toJSON();
	}
	if (aElement.services && aElement.services.count() > 1) {
		aElement.services.setSerialisateurJSON({
			methodeSerialisation: _serialisationService,
		});
		aJSON.services = aElement.services;
	}
	if (aElement.metaMatiere) {
		aJSON.metaMatiere = aElement.metaMatiere.toJSON();
	}
	if (aElement.periode) {
		aJSON.periode = aElement.periode.toJSON();
	}
	if (aElement.eleve) {
		aJSON.eleve = aElement.eleve.toJSON();
	}
	if (aElement.modifConserveAnciennesNotes) {
		aJSON.conserveAnciennesNotes = aElement.conserveAnciennesNotes;
	}
	if (aElement.itemLivretScolaire) {
		if (
			aElement.itemLivretScolaire.getEtat() !==
				Enumere_Etat_1.EGenreEtat.Aucun ||
			aElement.modifConserveAnciennesNotes
		) {
			aJSON.itemLivretScolaire = aElement.itemLivretScolaire.toJSON();
			if (
				aElement.itemLivretScolaire.getEtat() !==
				Enumere_Etat_1.EGenreEtat.Aucun
			) {
				aJSON.itemLivretScolaire.evaluation =
					aElement.itemLivretScolaire.evaluation.toJSON();
			}
		}
	}
	if (aElement.listeCompetences) {
		aElement.listeCompetences.setSerialisateurJSON({
			methodeSerialisation: _serialisationCompetence,
		});
		aJSON.listeCompetences = aElement.listeCompetences;
	}
	if (
		aElement.appreciationAnnuelle &&
		aElement.appreciationAnnuelle.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
	) {
		aJSON.appreciationAnnuelle = aElement.appreciationAnnuelle.toJSON();
	}
}
function _serialisationService(aElement, aJSON) {
	aJSON.appreciationAnnuelle = aElement.appreciationAnnuelle.toJSON();
}
function _serialisationCompetence(aElement, aJSON) {
	aJSON.evaluation = aElement.evaluation.toJSON();
}

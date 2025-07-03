exports.ObjetRequeteSaisieAbsences = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieAbsences extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		this.JSON = {};
		if (!!aParametres.cours) {
			this.JSON.cours = aParametres.cours;
			this.JSON.appelFait = aParametres.cours.AppelFait;
			this.JSON.numeroSemaine = IE.Cycles.cycleDeLaDate(aParametres.date);
			this.JSON.placeSaisieDebut = aParametres.placeDebut;
			this.JSON.placeSaisieFin = aParametres.placeFin;
			this.JSON.placeCours = aParametres.cours.Debut;
			this.JSON.dureeCours =
				aParametres.cours.Fin - aParametres.cours.Debut + 1;
			this.JSON.professeur = aParametres.professeur;
			if (
				aParametres.cours.estSortiePedagogique &&
				aParametres.cours.absencesLiees
			) {
				this.JSON.absencesLiees =
					aParametres.cours.absencesLiees.setSerialisateurJSON({
						ignorerEtatsElements: true,
					});
			}
		}
		this.JSON.date = aParametres.date;
		if (!!aParametres.listeColonnes) {
			aParametres.listeColonnes.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					aJSON.A = aElement.Actif;
				},
			});
			this.JSON.listeColonnes = aParametres.listeColonnes;
		}
		if (!!aParametres.listeEleves) {
			aParametres.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiserEleve,
			});
			this.JSON.listeEleves = aParametres.listeEleves;
		}
		if (!!aParametres.listeFichiers) {
			this.JSON.listeFichiers = aParametres.listeFichiers.setSerialisateurJSON({
				methodeSerialisation: _serialiserFichier,
			});
		}
		if (!!aParametres.listeFichiersTAF) {
			this.JSON.listeFichiersTAF =
				aParametres.listeFichiersTAF.setSerialisateurJSON({
					methodeSerialisation: _serialiserFichier,
				});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieAbsences = ObjetRequeteSaisieAbsences;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAbsences",
	ObjetRequeteSaisieAbsences,
);
function _serialiserEleve(aElement, aJSON) {
	if (!aElement.existeNumero()) {
		return false;
	}
	if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
		return true;
	}
	if (aElement.ListeAbsences) {
		aElement.ListeAbsences.setSerialisateurJSON({
			methodeSerialisation: _serialiserAbsenceEleve,
		});
		aJSON.listeAbsences = aElement.ListeAbsences.toJSON();
	}
	if (aElement.listePunitions) {
		aElement.listePunitions.setSerialisateurJSON({
			methodeSerialisation: _serialiserPunitionEleve,
		});
		aJSON.listePunitions = aElement.listePunitions.toJSON();
	}
	if (aElement.ListeDispenses) {
		aElement.ListeDispenses.setSerialisateurJSON({
			methodeSerialisation: _serialiserDispenseEleve,
		});
		aJSON.listeDispenses = aElement.ListeDispenses.toJSON();
	}
	if (aElement.listeDemandesDispense) {
		aElement.listeDemandesDispense.setSerialisateurJSON({
			methodeSerialisation: _serialiserDemandeDispenseEleve,
		});
		aJSON.listeDemandesDispense = aElement.listeDemandesDispense.toJSON();
	}
	if (aElement.listeMemos) {
		aElement.listeMemos.setSerialisateurJSON({
			methodeSerialisation: _serialiserMemoEleve,
		});
		aJSON.listeMemos = aElement.listeMemos.toJSON();
	}
	if (aElement.listeValorisations) {
		aElement.listeValorisations.setSerialisateurJSON({
			methodeSerialisation: _serialiserMemoEleve,
		});
		aJSON.listeValorisations = aElement.listeValorisations.toJSON();
	}
	if (aElement.listeAbsencesNonReglees) {
		aElement.listeAbsencesNonReglees.setSerialisateurJSON({
			methodeSerialisation: _serialiserAbsenceNonRegleeEleve,
		});
		aJSON.listeAbsencesNonReglees = aElement.listeAbsencesNonReglees.toJSON();
	}
	if (
		aElement.devoirARendre &&
		aElement.devoirARendre.programmation &&
		aElement.devoirARendre.programmation.pourValidation()
	) {
		aJSON.programmation = aElement.devoirARendre.programmation;
	}
	return (
		aElement.pourValidation() ||
		(aJSON.listeAbsences && aJSON.listeAbsences.length > 0) ||
		(aJSON.listePunitions && aJSON.listePunitions.length > 0) ||
		(aJSON.listeDispenses && aJSON.listeDispenses.length > 0) ||
		(aJSON.listeMemos && aJSON.listeMemos.length > 0) ||
		(aJSON.listeValorisations && aJSON.listeValorisations.length > 0) ||
		(aJSON.listeAbsencesNonReglees &&
			aJSON.listeAbsencesNonReglees.length > 0) ||
		!!aJSON.programmation
	);
}
function _serialiserAbsenceEleve(aElement, aJSON) {
	aJSON.placeDebut = aElement.PlaceDebut;
	aJSON.placeFin = aElement.PlaceFin;
	switch (aElement.getGenre()) {
		case Enumere_Ressource_1.EGenreRessource.Absence:
			aJSON.ouverte = !!aElement.EstOuverte;
			if (
				(0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites
						.appelSaisirMotifJustifDAbsence,
				)
			) {
				if (aElement.listeMotifs && aElement.listeMotifs.count() > 0) {
					aJSON.motif = aElement.listeMotifs.get(0);
				}
				aJSON.reglee = aElement.reglee;
			}
			if (aElement.tabAbs) {
				aJSON.tabAbs = aElement.tabAbs;
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Retard:
			aJSON.duree = aElement.Duree;
			if (
				(0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
				)
			) {
				if (aElement.listeMotifs && aElement.listeMotifs.count() > 0) {
					aJSON.motif = aElement.listeMotifs.get(0);
				}
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Exclusion:
			if (!!aElement.listeMotifs) {
				aElement.listeMotifs.setSerialisateurJSON({
					ignorerEtatsElements: true,
				});
				aJSON.listeMotifs = aElement.listeMotifs;
			}
			if (!!aElement.documents) {
				aElement.documents.setSerialisateurJSON({
					methodeSerialisation: _serialiser_Documents,
				});
				aJSON.documents = aElement.documents;
			}
			if (!!aElement.documentsTAF) {
				aElement.documentsTAF.setSerialisateurJSON({
					methodeSerialisation: _serialiser_Documents,
				});
				aJSON.documentsTAF = aElement.documentsTAF;
			}
			aJSON.circonstance = aElement.circonstance;
			aJSON.commentaire = aElement.commentaire;
			aJSON.accompagnateur = aElement.Accompagnateur;
			if (aElement.datePublication) {
				aJSON.datePublication = aElement.datePublication;
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Infirmerie:
			aJSON.dateDebut = aElement.DateDebut;
			aJSON.dateFin = aElement.DateFin;
			aJSON.accompagnateur = aElement.Accompagnateur;
			aJSON.commentaire = aElement.commentaire;
			aJSON.publicationWeb = aElement.estPubliee;
			break;
		case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
			aJSON.observation = aElement.observation;
			aJSON.commentaire = aElement.commentaire;
			aJSON.estPubliee = aElement.estPubliee;
			if (aElement.dateFinMiseEnEvidence) {
				aJSON.dateFinMiseEnEvidence = aElement.dateFinMiseEnEvidence;
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
			aJSON.type = aElement.type;
			break;
	}
}
function _serialiserFichier(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
	aJSON.TAF = aElement.TAF;
}
function _serialiser_Documents(aDocument, aJSON) {
	$.extend(aJSON, aDocument.copieToJSON());
}
function _serialiserPunitionEleve(aElement, aJSON) {
	if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
		aJSON.nature = aElement.naturePunition;
		if (!!aElement.listeMotifs) {
			aElement.listeMotifs.setSerialisateurJSON({ ignorerEtatsElements: true });
			aJSON.listeMotifs = aElement.listeMotifs;
		}
		if (!!aElement.documents) {
			aElement.documents.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Documents,
			});
			aJSON.documents = aElement.documents;
		}
		if (!!aElement.documentsTAF) {
			aElement.documentsTAF.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Documents,
			});
			aJSON.documentsTAF = aElement.documentsTAF;
		}
		if (aElement.circonstance) {
			aJSON.circonstance = aElement.circonstance;
		}
		if (aElement.datePublication) {
			aJSON.datePublication = aElement.datePublication;
		}
		if (aElement.publierTafApresDebutRetenue) {
			aJSON.publierTafApresDebutRetenue = aElement.publierTafApresDebutRetenue;
		}
		if (aElement.commentaire) {
			aJSON.commentaire = aElement.commentaire;
		}
		if (
			aElement.naturePunition &&
			aElement.naturePunition.getGenre() !==
				TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
		) {
			aJSON.duree = aElement.duree;
		} else {
			if (aElement.date) {
				aJSON.date = aElement.date;
			}
		}
	}
}
function _serialiserDispenseEleve(aElement, aJSON) {
	if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
		aJSON.matiere = aElement.matiere;
		if (aElement.commentaire) {
			aJSON.commentaire = aElement.commentaire;
		}
		aJSON.placeDebut = aElement.PlaceDebut;
		aJSON.placeFin = aElement.PlaceFin;
	}
}
function _serialiserDemandeDispenseEleve(aElement, aJSON) {
	if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
		aJSON.estRefusee = aElement.estRefusee;
		aJSON.estValider = aElement.estValider;
		aJSON.eleve = aElement.eleve.toJSON();
	}
}
function _serialiserMemoEleve(aElement, aJSON) {
	if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
		aJSON.date = aElement.date;
		aJSON.publie = !!aElement.publie;
		aJSON.publieVS = !!aElement.publieVS;
	}
}
function _serialiserAbsenceNonRegleeEleve(aElement, aJSON) {
	if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Modification) {
		if (aElement.motif.getEtat() === Enumere_Etat_1.EGenreEtat.Modification) {
			aJSON.motif = aElement.motif;
		}
		aJSON.reglee = !!aElement.reglee;
	}
}

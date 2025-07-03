exports.ObjetRequeteSaisieBulletinCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetSerialiser_1 = require("ObjetSerialiser");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieBulletinCompetences extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	lancerRequete(aParam) {
		const lEleveRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		$.extend(this.JSON, {
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			eleve: lEleveRessource,
		});
		if (!!aParam.aPrisConnaissance) {
			this.JSON.aPrisConnaissance = aParam.aPrisConnaissance;
		}
		if (aParam.rangAppreciation) {
			this.JSON.rangAppA = aParam.rangAppreciation.appA;
			if (!!lEleveRessource && lEleveRessource.existeNumero()) {
				this.JSON.rangAppB = aParam.rangAppreciation.appB;
				this.JSON.rangAppC = aParam.rangAppreciation.appC;
			}
		}
		if (aParam.listeServices) {
			aParam.listeServices.setSerialisateurJSON({
				methodeSerialisation: this._serialiseListeServices.bind(this),
			});
			this.JSON.listeServices = aParam.listeServices;
		}
		const lApprPdB = new ObjetListeElements_1.ObjetListeElements();
		if (aParam.listeConseils) {
			for (let i = 0, lNbr = aParam.listeConseils.count(); i < lNbr; i++) {
				lApprPdB.add(aParam.listeConseils.get(i).ListeAppreciations);
			}
		}
		if (aParam.listeCommentaires) {
			for (let i = 0, lNbr = aParam.listeCommentaires.count(); i < lNbr; i++) {
				lApprPdB.add(aParam.listeCommentaires.get(i).ListeAppreciations);
			}
		}
		if (aParam.listeCpe) {
			for (let i = 0, lNbr = aParam.listeCpe.count(); i < lNbr; i++) {
				lApprPdB.add(aParam.listeCpe.get(i).ListeAppreciations);
			}
		}
		this.JSON.apprPiedBull = lApprPdB.toJSON();
		if (aParam.parcoursEducatif && aParam.parcoursEducatif.listeParcours) {
			const lSerialisateur = new ObjetSerialiser_1.ObjetSerialiser();
			aParam.parcoursEducatif.listeParcours.setSerialisateurJSON({
				methodeSerialisation:
					lSerialisateur.parcoursEducatif.bind(lSerialisateur),
			});
			this.JSON.parcoursEducatif = aParam.parcoursEducatif;
		}
		if (aParam.competences && aParam.competences.listePiliers) {
			aParam.competences.listePiliers.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					if (aElement.palier) {
						aJSON.palier = aElement.palier.toJSON();
					}
					if (aElement.niveauDAcquisition) {
						aJSON.niveauDAcquisition = aElement.niveauDAcquisition.toJSON();
					}
				},
			});
			this.JSON.competences = aParam.competences;
		}
		if (aParam.listeAttestations) {
			aParam.listeAttestations.setSerialisateurJSON({
				methodeSerialisation: new ObjetSerialiser_1.ObjetSerialiser()
					.serialiseAttestation,
			});
			this.JSON.listeAttestations = aParam.listeAttestations;
		}
		if (!!aParam.listeAppreciationsAssistSaisie) {
			aParam.listeAppreciationsAssistSaisie.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation:
					this._serialiseTypeAppreciationAssistSaisie.bind(this),
			});
			this.JSON.listeTypeAppreciations = aParam.listeAppreciationsAssistSaisie;
		}
		return this.appelAsynchrone();
	}
	_serialiseListeServices(aElement, aJSON) {
		if (!!aElement.appreciationA) {
			aJSON.appreciationA = aElement.appreciationA;
		}
		if (!!aElement.appreciationB) {
			aJSON.appreciationB = aElement.appreciationB;
		}
		if (!!aElement.appreciationC) {
			aJSON.appreciationC = aElement.appreciationC;
		}
		if (
			!!aElement.posLSUNiveau &&
			aElement.posLSUNiveau.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
		) {
			aJSON.posLSUNiveau = aElement.posLSUNiveau.toJSON();
		}
		if (!!aElement.posLSUNote) {
			aJSON.posLSUNote = aElement.posLSUNote;
		}
		if (!!aElement.listeEltProgramme) {
			aJSON.listeEltProgramme = aElement.listeEltProgramme;
		}
		if (!!aElement.listeColonnesTransv) {
			aElement.listeColonnesTransv.setSerialisateurJSON({
				methodeSerialisation: this._serialiseColonnesTransv.bind(this),
			});
			aJSON.listeColonnesTransv = aElement.listeColonnesTransv;
		}
	}
	_serialiseColonnesTransv(aElement, aJSON) {
		aJSON.niveauAcquiEstCalcule = !aElement.niveauAcqui;
		if (!!aElement.niveauAcqui) {
			aJSON.niveauAcqui = aElement.niveauAcqui.toJSON();
		}
	}
	_serialiseTypeAppreciationAssistSaisie(aTypeAppreciation, aJSON) {
		if (!!aTypeAppreciation.listeCategories) {
			aTypeAppreciation.listeCategories.setSerialisateurJSON({
				methodeSerialisation:
					this._serialiseCategorieAppreciationAssistSaisie.bind(this),
			});
			aJSON.listeCategories = aTypeAppreciation.listeCategories;
		}
	}
	_serialiseCategorieAppreciationAssistSaisie(aCategorie, aJSON) {
		if (!!aCategorie.listeAppreciations) {
			aJSON.listeAppreciations = aCategorie.listeAppreciations;
		}
	}
}
exports.ObjetRequeteSaisieBulletinCompetences =
	ObjetRequeteSaisieBulletinCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieBulletinCompetences",
	ObjetRequeteSaisieBulletinCompetences,
);

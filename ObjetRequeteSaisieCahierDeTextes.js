exports.ObjetRequeteSaisieCahierDeTextes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
class ObjetRequeteSaisieCahierDeTextes extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ afficherMessageErreur: false });
	}
	lancerRequete(
		aNumeroCours,
		aNumeroSemaine,
		aListeCategories,
		aListeDocumentsJoints,
		aListeModeles,
		aListeCahierDeTextes,
		aJSON,
	) {
		Object.assign(
			this.JSON,
			{
				cours: new ObjetElement_1.ObjetElement("", aNumeroCours),
				numeroSemaine: aNumeroSemaine,
				ListeModeles: aListeModeles,
				listeCategories: aListeCategories,
				ListeCahierDeTextes: aListeCahierDeTextes
					? aListeCahierDeTextes.setSerialisateurJSON({
							methodeSerialisation: this.serialiserCahierDeTextes.bind(this),
						})
					: null,
				ListeFichiers: aListeDocumentsJoints
					? aListeDocumentsJoints.setSerialisateurJSON({
							methodeSerialisation: this.serialiserFichier,
						})
					: undefined,
				forcerSaisie: false,
			},
			aJSON,
		);
		return this.appelAsynchrone();
	}
	serialiserExecutionQCM(aElement, aJSON) {
		return new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
			aElement,
			aJSON,
		);
	}
	surValidationTravailAFaire(aElement, aJSON) {
		if (aElement.PourLe) {
			aJSON.Date = aElement.PourLe;
		}
		aJSON.niveauDifficulte = aElement.niveauDifficulte;
		aJSON.genreRendu = aElement.genreRendu;
		if (
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
				aElement.genreRendu,
			)
		) {
			aJSON.ressource = aElement.ressource;
		}
		aJSON.duree = aElement.duree;
		aJSON.Descriptif = new TypeChaineHtml_1.TypeChaineHtml(aElement.descriptif);
		aJSON.avecMiseEnForme = aElement.avecMiseEnForme;
		if (aElement.ListePieceJointe) {
			aJSON.ListeDocumentsJoints =
				aElement.ListePieceJointe.setSerialisateurJSON({
					methodeSerialisation: this.serialiserFichier,
				});
		}
		if (aElement.ListeThemes) {
			aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		aJSON.estPourTous = aElement.estPourTous;
		if (!aElement.estPourTous) {
			aJSON.ListeEleves = aElement.listeEleves;
		} else if (aElement.avecModificationPublic) {
			aJSON.avecModificationPublic = true;
		}
		if (aElement.referenceProgression) {
			aJSON.referenceProgression = aElement.referenceProgression;
			if (aElement.copieReference) {
				aJSON.copieReference = true;
			}
		}
		if (aElement.executionQCM && aElement.executionQCM.pourValidation()) {
			if (aElement.service) {
				aJSON.service = aElement.service;
			}
			if (aElement.periode) {
				aJSON.periode = aElement.periode;
			}
			aJSON.executionQCM = aElement.executionQCM.toJSON();
			new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
				aElement.executionQCM,
				aJSON.executionQCM,
			);
			if (
				aElement.executionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
			) {
				if (!!aElement.executionQCM.estLieADevoir) {
					aJSON.executionQCM.avecCreationDevoir = true;
				}
				if (!!aElement.executionQCM.estLieAEvaluation) {
					aJSON.executionQCM.avecCreationEvaluation = true;
				}
			}
		}
	}
	async actionApresRequete(aGenreReponse) {
		if (
			this.messageErreur &&
			this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer &&
			this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer.count() > 0
		) {
			const lGenreAction = await GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: "",
				message: this.messageErreur.message,
			});
			if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer.parcourir(
					(aElement) => {
						aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					},
				);
				await new ObjetRequeteSaisieCahierDeTextes({}).lancerRequete(
					null,
					null,
					null,
					this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer,
					null,
					null,
					{ forcerSaisie: true },
				);
			}
		} else if (this.messageErreur) {
			GApplication.getMessage().afficher(this.messageErreur);
		}
		super.actionApresRequete(aGenreReponse);
	}
	serialiserFichier(aElement, aJSON) {
		if (aElement.Fichier) {
			aJSON.IDFichier = ObjetChaine_1.GChaine.cardinalToStr(
				aElement.Fichier.idFichier,
			);
		}
		if (aElement.url) {
			aJSON.url = aElement.url;
		}
		if (aElement.ressource) {
			aJSON.ressource = aElement.ressource;
		}
		if (
			aElement.estUnLienInterne !== null &&
			aElement.estUnLienInterne !== undefined
		) {
			aJSON.estUnLienInterne = aElement.estUnLienInterne;
		}
	}
	serialiserCahierDeTextes(AElement, aJSON) {
		aJSON.Publie = AElement.publie;
		aJSON.DatePublication = AElement.datePublication;
		if (AElement.listeContenus) {
			AElement.listeContenus.verifierAvantValidation();
		}
		if (AElement.ListeTravailAFaire) {
			AElement.ListeTravailAFaire.verifierAvantValidation();
		}
		aJSON.noteProchaineSeance = AElement.noteProchaineSeance;
		aJSON.commentairePrive = AElement.commentairePrive;
		aJSON.Contenus = AElement.listeContenus;
		if (aJSON.Contenus) {
			aJSON.Contenus.setSerialisateurJSON({
				methodeSerialisation: this._serialiseContenu.bind(this),
			});
		}
		aJSON.ListeTravauxAFaire = AElement.ListeTravailAFaire;
		if (aJSON.ListeTravauxAFaire) {
			aJSON.ListeTravauxAFaire.setSerialisateurJSON({
				methodeSerialisation: this.surValidationTravailAFaire.bind(this),
			});
		}
		if (
			AElement.listeElementsProgrammeCDT &&
			AElement.listeElementsProgrammeCDT.avecSaisie
		) {
			aJSON.listeElementsProgrammeCDT = AElement.listeElementsProgrammeCDT;
		}
		if (!!AElement.servicePourComptabilisationBulletin) {
			aJSON.servicePourComptabilisationBulletin =
				AElement.servicePourComptabilisationBulletin.toJSON();
			if (
				AElement.servicePourComptabilisationBulletin
					.listeDernPeriodesNonCloturees
			) {
				aJSON.servicePourComptabilisationBulletin.listeDernPeriodesNonCloturees =
					AElement.servicePourComptabilisationBulletin.listeDernPeriodesNonCloturees.setSerialisateurJSON(
						{ ignorerEtatsElements: true },
					);
			}
		}
		const lExiste = !(
			(!AElement.listeContenus ||
				AElement.listeContenus.getNbrElementsExistes() === 0) &&
			(!AElement.ListeTravailAFaire ||
				AElement.ListeTravailAFaire.getNbrElementsExistes() === 0) &&
			!AElement.listeElementsProgrammeCDT &&
			!AElement.noteProchaineSeance &&
			!AElement.commentairePrive
		);
		if (!lExiste && AElement.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
			return false;
		}
		return true;
	}
	_serialiseContenu(aElement, aJSON) {
		if (
			aElement.estVide &&
			aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
		) {
			return false;
		}
		aJSON.Categorie = aElement.categorie;
		aJSON.parcoursEducatif = aElement.parcoursEducatif;
		if (aElement.ListeThemes) {
			aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		aJSON.Descriptif = new TypeChaineHtml_1.TypeChaineHtml(aElement.descriptif);
		if (aElement.objectifs) {
			aJSON.objectifs = new TypeChaineHtml_1.TypeChaineHtml(aElement.objectifs);
		}
		if (aElement.ListePieceJointe) {
			aJSON.ListeDocumentsJoints =
				aElement.ListePieceJointe.setSerialisateurJSON({
					methodeSerialisation: this.serialiserFichier,
				});
		}
		if (aElement.referenceProgression) {
			aJSON.referenceProgression = aElement.referenceProgression;
			if (aElement.copieReference) {
				aJSON.copieReference = true;
			}
		}
		if (
			aElement.listeExecutionQCM &&
			aElement.listeExecutionQCM.existeElementPourValidation()
		) {
			aElement.listeExecutionQCM.setSerialisateurJSON({
				methodeSerialisation: this.serialiserExecutionQCM.bind(this),
			});
			aJSON.ListeExecutionsQCM = aElement.listeExecutionQCM;
		}
		if (
			aElement.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir ||
			aElement.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation
		) {
			aJSON.genreLienDS = aElement.genreLienDS;
			if (aElement.suppressionLien) {
				aJSON.suppressionLien = true;
			}
			if (aElement.infosDS) {
				aJSON.infosDS = {};
				if (aElement.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir) {
					if (!aElement.infosDS.lien) {
						$.extend(aJSON.infosDS, {
							service: aElement.infosDS.service,
							periode: aElement.infosDS.periode,
						});
					}
					$.extend(aJSON.infosDS, {
						coefficient: aElement.infosDS.coefficient,
						bareme: aElement.infosDS.bareme,
					});
				} else {
					if (aElement.infosDS.listeItems) {
						aElement.infosDS.listeItems.setSerialisateurJSON({
							methodeSerialisation: this._serialiseItemEvaluation,
						});
						aJSON.infosDS.listeItems = aElement.infosDS.listeItems;
					}
					if (!aElement.infosDS.lien) {
						$.extend(aJSON.infosDS, {
							service: aElement.infosDS.service,
							periode: aElement.infosDS.periode,
							periodeSecondaire: aElement.infosDS.periodeSecondaire,
							palier: aElement.infosDS.palier,
						});
					} else {
						aJSON.infosDS.intitule = aElement.infosDS.lien.getLibelle();
					}
				}
			}
		}
	}
	_serialiseItemEvaluation(aElement, aJSON) {
		if (
			aElement.relationESI &&
			aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression
		) {
			aJSON.relationESI = aElement.relationESI;
		}
	}
}
exports.ObjetRequeteSaisieCahierDeTextes = ObjetRequeteSaisieCahierDeTextes;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCahierDeTextes",
	ObjetRequeteSaisieCahierDeTextes,
);

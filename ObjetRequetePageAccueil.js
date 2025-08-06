exports.ObjetRequetePageAccueil = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const Enumere_Widget_1 = require("Enumere_Widget");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
const AccessApp_1 = require("AccessApp");
class ObjetRequetePageAccueil extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aDonnees) {
		this.JSON = $.extend({ avecConseilDeClasse: true }, aDonnees);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		let lUtilitaireDeserialisation;
		let lVieScolaire;
		if (
			this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.vieScolaire) &&
			this.JSONReponse.vieScolaire
		) {
			const lListeAbsences =
				new ObjetDeserialiser_1.ObjetDeserialiser().listeEvenementsVS(
					this.JSONReponse.vieScolaire.listeAbsences,
					true,
				);
			lListeAbsences.libelle = this.JSONReponse.vieScolaire.L;
			lVieScolaire = {
				listeAbsences:
					this.JSONReponse.vieScolaire.listeAbsences.getListeElements(
						(aElement) => {
							return (
								![Enumere_Ressource_1.EGenreRessource.Incident].includes(
									aElement.getGenre(),
								) ||
								!aElement.mesure ||
								!aElement.mesure.publication ||
								!lListeAbsences.getElementParNumero(aElement.mesure.getNumero())
							);
						},
					),
				avecContactReferentsVieScolaire:
					UtilitaireContactReferents_1.UtilitaireContactReferents.avecAffichageContactReferentsVieScolaire(
						GEtatUtilisateur.GenreEspace,
					),
				commentaireRetardObligatoire:
					this.JSONReponse.vieScolaire.commentaireRetardObligatoire,
				commentaireAbsenceObligatoire:
					this.JSONReponse.vieScolaire.commentaireAbsenceObligatoire,
			};
		}
		let lQCM;
		if (this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.QCM)) {
			lUtilitaireDeserialisation = new ObjetDeserialiser_1.ObjetDeserialiser();
			const lListeExecutionsQCM = this.JSONReponse.QCM
				? new ObjetListeElements_1.ObjetListeElements().fromJSON(
						this.JSONReponse.QCM.listeExecutionsQCM,
						lUtilitaireDeserialisation._ajouterQCM.bind(
							lUtilitaireDeserialisation,
						),
					)
				: null;
			const lListeExecutionKiosque = this.JSONReponse.QCM
				? new ObjetListeElements_1.ObjetListeElements().fromJSON(
						this.JSONReponse.QCM.listeDevoirs,
						this._ajouterDevoir.bind(this),
					)
				: null;
			let lListeWidgetQCMKiosque = null;
			if (!!lListeExecutionsQCM || !!lListeExecutionKiosque) {
				if (!!lListeExecutionsQCM) {
					lListeWidgetQCMKiosque = lListeExecutionsQCM;
				} else {
					lListeWidgetQCMKiosque =
						new ObjetListeElements_1.ObjetListeElements();
				}
				if (!!lListeExecutionKiosque) {
					lListeWidgetQCMKiosque.add(lListeExecutionKiosque);
				}
			}
			lQCM = { listeExecutionsQCM: lListeWidgetQCMKiosque };
		}
		let lEDT;
		if (
			this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.EDT) &&
			this.JSONReponse.ListeCours
		) {
			lEDT = {
				listeCours: new ObjetDeserialiser_1.ObjetDeserialiser().listeCours(
					this.JSONReponse,
				),
				avecCoursAnnule: this.JSONReponse.AvecCoursAnnule,
				listeAbsRessources: this.JSONReponse.listeAbsRessources || null,
				joursStage: this.JSONReponse.joursStage || null,
				disponibilites: this.JSONReponse.disponibilites || null,
				prefsGrille: this.JSONReponse.prefsGrille || null,
				absences: this.JSONReponse.absences || null,
				debutDemiPensionHebdo: this.JSONReponse.debutDemiPensionHebdo || null,
				finDemiPensionHebdo: this.JSONReponse.finDemiPensionHebdo || null,
				dateSelection: this.JSONReponse.dateSelectionnee || null,
				prochaineDate: this.JSONReponse.prochaineDate || null,
				prochainJourCycle: this.JSONReponse.prochainJourCycle,
				jourCycleSelectionne: this.JSONReponse.jourCycleSelectionne,
				premierePlaceHebdoDuJour: this.JSONReponse.premierePlaceHebdoDuJour,
			};
		}
		let lPlanning;
		if (
			this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.Planning) &&
			this.JSONReponse.planning
		) {
			lPlanning = {
				listeRessourcesPlanning:
					this.JSONReponse.planning.listeRessourcesPlanning,
			};
		}
		if (
			this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.agenda) &&
			this.JSONReponse.agenda
		) {
			this.JSONReponse.agenda.listeEvenements =
				new ObjetDeserialiser_1.ObjetDeserialiser().getListeEvenements(
					this.JSONReponse.agenda.listeEvenements,
					true,
				);
		}
		if (
			this._recupererDonneesWidget(undefined) &&
			!!this.JSONReponse.notes &&
			!!this.JSONReponse.notes.listeDevoirs
		) {
			this.JSONReponse.notes.listeDevoirs.setTri([
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]);
			this.JSONReponse.notes.listeDevoirs.trier();
		}
		if (
			this._recupererDonneesWidget(
				Enumere_Widget_1.EGenreWidget.ressourcePedagogique,
			) &&
			this.JSONReponse.ressourcePedagogique
		) {
			lUtilitaireDeserialisation = new ObjetDeserialiser_1.ObjetDeserialiser();
			this.JSONReponse.ressourcePedagogique.listeRessources.parcourir(
				(aEle) => {
					if (aEle && aEle.ressource && aEle.ressource.QCM) {
						const lTempEle = new ObjetElement_1.ObjetElement();
						lUtilitaireDeserialisation._ajouterQCM(aEle.ressource, lTempEle);
						aEle.ressource = lTempEle;
					}
				},
			);
		}
		if (
			this._recupererDonneesWidget(
				Enumere_Widget_1.EGenreWidget.travailAFaire,
			) &&
			this.JSONReponse.travailAFaire
		) {
			lUtilitaireDeserialisation = new ObjetDeserialiser_1.ObjetDeserialiser();
			this.JSONReponse.travailAFaire.listeTAF.parcourir((aEle) => {
				if (aEle && aEle.executionQCM) {
					const lTempEle = new ObjetElement_1.ObjetElement();
					lUtilitaireDeserialisation._ajouterQCM(aEle.executionQCM, lTempEle);
					aEle.executionQCM = lTempEle;
				}
			});
		}
		if (
			this._recupererDonneesWidget(Enumere_Widget_1.EGenreWidget.activite) &&
			this.JSONReponse.activite
		) {
			lUtilitaireDeserialisation = new ObjetDeserialiser_1.ObjetDeserialiser();
			this.JSONReponse.activite.listeActivite.parcourir((aEle) => {
				if (aEle && aEle.executionQCM) {
					const lTempEle = new ObjetElement_1.ObjetElement();
					lUtilitaireDeserialisation._ajouterQCM(aEle.executionQCM, lTempEle);
					aEle.executionQCM = lTempEle;
				}
			});
		}
		const lAutorisationKiosque = !!this.JSONReponse.autorisationKiosque;
		this.callbackReussite.appel(
			{
				message: this.JSONReponse.message,
				QCM: lQCM,
				notes: this.JSONReponse.notes,
				vieScolaire: lVieScolaire,
				actualites: this.JSONReponse.actualites,
				discussions: this.JSONReponse.discussions,
				agenda: this.JSONReponse.agenda,
				menuDeLaCantine: this.JSONReponse.menuDeLaCantine,
				EDT: lEDT,
				planning: lPlanning,
				travailAFaire: this.JSONReponse.travailAFaire,
				travailAFairePrimaire: (0, AccessApp_1.getApp)()
					.getEtatUtilisateur()
					.pourPrimaire()
					? this.JSONReponse.travailAFaire
					: undefined,
				casier: this.JSONReponse.casier,
				appelNonFait: this.JSONReponse.appelNonFait,
				CDTNonSaisi: this.JSONReponse.CDTNonSaisi,
				conseilDeClasse: this.JSONReponse.conseilDeClasse,
				infosParcoursupLSL: this.JSONReponse.infosParcoursupLSL,
				ressources: this.JSONReponse.ressources,
				kiosque: this.JSONReponse.kiosque,
				ressourcePedagogique: this.JSONReponse.ressourcePedagogique,
				devoirSurveille: this.JSONReponse.devoirSurveille,
				competences: this.JSONReponse.competences,
				penseBete: this.JSONReponse.penseBete,
				coursNonAssures: this.JSONReponse.coursNonAssures,
				personnelsAbsents: this.JSONReponse.personnelsAbsents,
				devoirSurveilleEvaluation: this.JSONReponse.devoirSurveilleEvaluation,
				carnetDeCorrespondance: this.JSONReponse.carnetDeCorrespondance,
				TAFARendre: this.JSONReponse.TAFARendre,
				intendanceExecute: this.JSONReponse.IntendanceExecute,
				tachesSecretariatExecute: this.JSONReponse.tachesSecretariatExecute,
				maintenanceInfoExecute: this.JSONReponse.maintenanceInfoExecute,
				lienUtile: this.JSONReponse.lienUtile,
				partenaireCDI: this.JSONReponse.partenaireCDI,
				partenaireAgate: this.JSONReponse.partenaireAgate,
				partenaireArd: this.JSONReponse.partenaireARD,
				partenaireApplicam: this.JSONReponse.partenaireApplicam,
				incidents: this.JSONReponse.incidents,
				exclusions: this.JSONReponse.exclusions,
				donneesVS: this.JSONReponse.donneesVS,
				donneesProfs: this.JSONReponse.donneesProfs,
				connexionsEnCours: this.JSONReponse.connexionsEnCours,
				elections: this.JSONReponse.elections,
				voteElecMembreBureau: this.JSONReponse.voteElecMembreBureau,
				voteElecElecteur: this.JSONReponse.voteElecElecteur,
				activite: this.JSONReponse.activite,
				enseignementADistance: this.JSONReponse.enseignementADistance,
				suiviAbsRetardsARegler: this.JSONReponse.suiviAbsRetardsARegler,
				blogFilActu: this.JSONReponse.blogFilActu,
				tableauDeBord: this.JSONReponse.tableauDeBord,
				TAFEtActivites: this.JSONReponse.TAFEtActivites,
				evenementsRappel: this.JSONReponse.evenementsRappel,
				commandeExecute: this.JSONReponse.commandeExecute,
				registreAppel: this.JSONReponse.registreAppel,
				previsionnelAbsServiceAnnexe:
					this.JSONReponse.previsionnelAbsServiceAnnexe,
				documentsASigner: this.JSONReponse.documentsASigner,
				partenaireFAST: this.JSONReponse.partenaireFAST,
				modificationsEDT: this.JSONReponse.modificationsEDT,
				remplacementsenseignants: this.JSONReponse.remplacementsenseignants,
			},
			lAutorisationKiosque,
		);
	}
	_ajouterDevoir(aJSON, aDevoir) {
		aDevoir.copieJSON(aJSON);
	}
	_recupererDonneesWidget(aGenreWidget) {
		if (this.JSON.widgets) {
			return this.JSON.widgets.includes(aGenreWidget);
		}
		return true;
	}
}
exports.ObjetRequetePageAccueil = ObjetRequetePageAccueil;
CollectionRequetes_1.Requetes.inscrire("PageAccueil", ObjetRequetePageAccueil);

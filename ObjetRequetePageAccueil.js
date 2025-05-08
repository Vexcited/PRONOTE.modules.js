const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
const { EGenreWidget } = require("Enumere_Widget.js");
const { UtilitaireContactReferents } = require("UtilitaireContactReferents.js");
class ObjetRequetePageAccueil extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aDonnees) {
    this.JSON = $.extend({ avecConseilDeClasse: true }, aDonnees);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lUtilitaireDeserialisation;
    let lVieScolaire;
    if (
      this._recupererDonneesWidget(EGenreWidget.vieScolaire) &&
      this.JSONReponse.vieScolaire
    ) {
      const lListeAbsences = new ObjetDeserialiser().listeEvenementsVS(
        this.JSONReponse.vieScolaire.listeAbsences,
        true,
      );
      lListeAbsences.libelle = this.JSONReponse.vieScolaire.L;
      lVieScolaire = {
        listeAbsences:
          this.JSONReponse.vieScolaire.listeAbsences.getListeElements(
            (aElement) => {
              return (
                ![EGenreRessource.Incident].includes(aElement.getGenre()) ||
                !aElement.mesure ||
                !aElement.mesure.publication ||
                !lListeAbsences.getElementParNumero(aElement.mesure.getNumero())
              );
            },
          ),
        avecContactReferentsVieScolaire:
          UtilitaireContactReferents.avecAffichageContactReferentsVieScolaire(
            GEtatUtilisateur.GenreEspace,
          ),
      };
    }
    let lQCM;
    if (this._recupererDonneesWidget(EGenreWidget.QCM)) {
      lUtilitaireDeserialisation = new ObjetDeserialiser();
      const lListeExecutionsQCM = this.JSONReponse.QCM
        ? new ObjetListeElements().fromJSON(
            this.JSONReponse.QCM.listeExecutionsQCM,
            lUtilitaireDeserialisation._ajouterQCM.bind(
              lUtilitaireDeserialisation,
            ),
          )
        : null;
      const lListeExecutionKiosque = this.JSONReponse.QCM
        ? new ObjetListeElements().fromJSON(
            this.JSONReponse.QCM.listeDevoirs,
            this._ajouterDevoir.bind(this),
          )
        : null;
      let lListeWidgetQCMKiosque = null;
      if (!!lListeExecutionsQCM || !!lListeExecutionKiosque) {
        if (!!lListeExecutionsQCM) {
          lListeWidgetQCMKiosque = lListeExecutionsQCM;
        } else {
          lListeWidgetQCMKiosque = new ObjetListeElements();
        }
        if (!!lListeExecutionKiosque) {
          lListeWidgetQCMKiosque.add(lListeExecutionKiosque);
        }
      }
      lQCM = { listeExecutionsQCM: lListeWidgetQCMKiosque };
    }
    let lEDT;
    if (
      this._recupererDonneesWidget(EGenreWidget.EDT) &&
      this.JSONReponse.ListeCours
    ) {
      lEDT = {
        listeCours: new ObjetDeserialiser().listeCours(this.JSONReponse),
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
      this._recupererDonneesWidget(EGenreWidget.Planning) &&
      this.JSONReponse.planning
    ) {
      lPlanning = {
        listeRessourcesPlanning:
          this.JSONReponse.planning.listeRessourcesPlanning,
      };
    }
    if (
      this._recupererDonneesWidget(EGenreWidget.agenda) &&
      this.JSONReponse.agenda
    ) {
      this.JSONReponse.agenda.listeEvenements =
        new ObjetDeserialiser().getListeEvenements(
          this.JSONReponse.agenda.listeEvenements,
          true,
        );
    }
    if (
      this._recupererDonneesWidget(EGenreWidget.Notes) &&
      !!this.JSONReponse.notes &&
      !!this.JSONReponse.notes.listeDevoirs
    ) {
      this.JSONReponse.notes.listeDevoirs.setTri([
        ObjetTri.init("date", EGenreTriElement.Decroissant),
      ]);
      this.JSONReponse.notes.listeDevoirs.trier();
    }
    if (
      this._recupererDonneesWidget(EGenreWidget.ressourcePedagogique) &&
      this.JSONReponse.ressourcePedagogique
    ) {
      lUtilitaireDeserialisation = new ObjetDeserialiser();
      this.JSONReponse.ressourcePedagogique.listeRessources.parcourir(
        (aEle) => {
          if (aEle && aEle.ressource && aEle.ressource.QCM) {
            const lTempEle = new ObjetElement();
            lUtilitaireDeserialisation._ajouterQCM(aEle.ressource, lTempEle);
            aEle.ressource = lTempEle;
          }
        },
      );
    }
    if (
      this._recupererDonneesWidget(EGenreWidget.travailAFaire) &&
      this.JSONReponse.travailAFaire
    ) {
      lUtilitaireDeserialisation = new ObjetDeserialiser();
      this.JSONReponse.travailAFaire.listeTAF.parcourir((aEle) => {
        if (aEle && aEle.executionQCM) {
          const lTempEle = new ObjetElement();
          lUtilitaireDeserialisation._ajouterQCM(aEle.executionQCM, lTempEle);
          aEle.executionQCM = lTempEle;
        }
      });
    }
    if (
      this._recupererDonneesWidget(EGenreWidget.activite) &&
      this.JSONReponse.activite
    ) {
      lUtilitaireDeserialisation = new ObjetDeserialiser();
      this.JSONReponse.activite.listeActivite.parcourir((aEle) => {
        if (aEle && aEle.executionQCM) {
          const lTempEle = new ObjetElement();
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
        travailAFairePrimaire: GEtatUtilisateur.pourPrimaire()
          ? this.JSONReponse.travailAFaire
          : undefined,
        casier: this.JSONReponse.casier,
        appelNonFait: this.JSONReponse.appelNonFait,
        CDTNonSaisi: this.JSONReponse.CDTNonSaisi,
        conseilDeClasse: this.JSONReponse.conseilDeClasse,
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
Requetes.inscrire("PageAccueil", ObjetRequetePageAccueil);
module.exports = { ObjetRequetePageAccueil };

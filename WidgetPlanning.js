exports.WidgetPlanning = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHoraireGrillePlanning_1 = require("TypeHoraireGrillePlanning");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequeteFicheCours_1 = require("ObjetRequeteFicheCours");
const ObjetSaisie_1 = require("ObjetSaisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const UtilitaireEDTSortiePedagogique_1 = require("UtilitaireEDTSortiePedagogique");
const TypeStatutCours_1 = require("TypeStatutCours");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
const FicheCours_1 = require("FicheCours");
const ObjetWidget_1 = require("ObjetWidget");
const MultipleObjetModule_EDTSaisie = require("ObjetModule_EDTSaisie");
class WidgetPlanning extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    this.parametresSco = this.applicationSco.getObjetParametres();
    this.donneesGrille = {
      estPlanning: true,
      ressources: new ObjetListeElements_1.ObjetListeElements(),
      avecCoursAnnule: WidgetPlanning.avecCoursAnnule,
    };
    this.donnees = { widget: null, requete: null };
    if (MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie) {
      this.moduleSaisie =
        new MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie({
          instance: this,
          actionSurValidation: () => {
            this._requeteEDT();
          },
        });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      WidgetPlanning: {
        avecBoutonCoursAnnules() {
          const lAcces = aInstance.etatUtilisateurSco.getAcces();
          return (
            aInstance.etatUtilisateurSco.getAvecChoixCoursAnnule() &&
            lAcces &&
            lAcces.autoriseSurDate
          );
        },
        btnAfficherCoursAnnules: {
          event() {
            WidgetPlanning.avecCoursAnnule = !WidgetPlanning.avecCoursAnnule;
            aInstance.donneesGrille.avecCoursAnnule =
              WidgetPlanning.avecCoursAnnule;
            aInstance._fermerFiches();
            aInstance.grille.setDonnees(aInstance.donneesGrille);
          },
          getSelection() {
            return WidgetPlanning.avecCoursAnnule;
          },
          getTitle() {
            if (WidgetPlanning.avecCoursAnnule) {
              return ObjetTraduction_1.GTraductions.getValeur(
                "EDT.MasquerCoursAnnules",
              );
            }
            return ObjetTraduction_1.GTraductions.getValeur(
              "EDT.AfficherCoursAnnules",
            );
          },
          getClassesMixIcon() {
            return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
              WidgetPlanning.avecCoursAnnule,
            );
          },
        },
      },
    });
  }
  construire(aParams) {
    this.donnees.widget = aParams.donnees;
    this.donnees.requete = aParams.donneesRequete;
    this._setDateGrille(
      MethodesObjet_1.MethodesObjet.dupliquer(aParams.instance.dateParDefaut),
    );
    Object.assign(this.donneesGrille, {
      listeCours: new ObjetListeElements_1.ObjetListeElements(),
    });
    this._creerObjetsPlanning();
    const lWidget = {
      html: this.composeWidgetEDT(),
      titre: ObjetTraduction_1.GTraductions.getValeur("accueil.planning"),
      resize: () => {
        this.grille.getInstanceGrille().surPostResize();
      },
      titreFixe: true,
      nbrElements: null,
      afficherMessage: false,
      listeElementsGraphiques: [
        { id: this.comboRessource.getNom() },
        { id: this.dateEDT.getNom() },
        {
          html:
            '<span ie-if="WidgetPlanning.avecBoutonCoursAnnules">' +
            UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnules(
              "WidgetPlanning.btnAfficherCoursAnnules",
            ) +
            "</span>",
        },
      ],
      getPage: () => {
        let lOnglet;
        switch (WidgetPlanning.genrePlanningAccueil) {
          case Enumere_Ressource_1.EGenreRessource.Classe:
            lOnglet = Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Classe;
            break;
          case Enumere_Ressource_1.EGenreRessource.Enseignant:
            lOnglet =
              Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Professeur;
            break;
          case Enumere_Ressource_1.EGenreRessource.Salle:
            lOnglet = Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Salle;
            break;
          case Enumere_Ressource_1.EGenreRessource.Materiel:
            lOnglet =
              Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Materiel;
            break;
          default:
        }
        this.etatUtilisateurSco.setSemaineSelectionnee(
          this.donneesGrille.numeroSemaine,
        );
        this.etatUtilisateurSco.Navigation.setRessource(
          WidgetPlanning.genrePlanningAccueil,
          this.donneesGrille.ressources,
        );
        return { Onglet: lOnglet };
      },
    };
    Object.assign(this.donnees.widget, lWidget);
    aParams.construireWidget(this.donnees.widget);
    this.initialiserObjetsEDT();
    this._requeteEDT();
  }
  _setDateGrille(aDate) {
    this.donneesGrille.date = aDate;
    const lResult = IE.Cycles.dateEnCycleEtJourCycle(
      this.donneesGrille.date,
      null,
    );
    const lSemaine = IE.Cycles.cycleDeLaDate(this.donneesGrille.date);
    Object.assign(this.donneesGrille, {
      numeroSemaine: lSemaine,
      indiceJourCycle: lResult.indice,
    });
  }
  async _requeteEDT() {
    this._fermerFiches();
    if (!this.etatUtilisateurSco.widgets[this.donnees.widget.genre].visible) {
      return;
    }
    if (this.donneesGrille.ressources.count() === 0) {
      Object.assign(this.donneesGrille, {
        listeCours: new ObjetListeElements_1.ObjetListeElements(),
        joursStage: null,
        listeAbsRessources: null,
        disponibilites: null,
        prefsGrille: null,
      });
      this.grille.setDonnees(this.donneesGrille);
      return;
    }
    const lReponse =
      await new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
        this,
      ).lancerRequete({
        avecConseilDeClasse: true,
        avecAbsencesRessource: true,
        avecCoursSortiePeda: true,
        avecRetenuesEleve: true,
        avecDisponibilites: true,
        listeRessources: this.donneesGrille.ressources,
        dateDebut: this.donneesGrille.date,
        dateFin: this.donneesGrille.date,
        ignorerHeures: true,
        avecInfosPrefsGrille: true,
      });
    Object.assign(this.donneesGrille, {
      listeCours: lReponse.listeCours,
      joursStage: lReponse.joursStage,
      listeAbsRessources: lReponse.listeAbsRessources,
      disponibilites: lReponse.disponibilites,
      prefsGrille: lReponse.prefsGrille,
    });
    this.grille
      .getInstanceGrille()
      .setOptions({
        recreations: lReponse.recreations || this.parametresSco.recreations,
      });
    this.grille.setDonnees(this.donneesGrille);
  }
  _creerObjetsPlanning() {
    if (!this.grille) {
      this.grille = ObjetIdentite_1.Identite.creerInstance(
        InterfaceGrilleEDT_1.InterfaceGrilleEDT,
        { pere: this, evenement: this.evenementSurGrille },
      );
      this.initialiserGrille(this.grille);
    }
    if (!this.ficheCours) {
      this.ficheCours = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        FicheCours_1.FicheCours,
        { pere: this, evenement: function () {}, initialiser: false },
      );
      this.ficheCours.destructionSurFermeture = false;
    }
    if (!this.dateEDT) {
      this.dateEDT = ObjetIdentite_1.Identite.creerInstance(
        ObjetCelluleDate_1.ObjetCelluleDate,
        { pere: this, evenement: this._evenementDateEDT },
      );
      this.dateEDT.setOptionsObjetCelluleDate({
        formatDate: "[%JJJ %JJ %MMM]",
        avecBoutonsPrecedentSuivant: true,
        classeCSSTexte: "Maigre",
        largeurComposant: 90,
      });
      this.dateEDT.setParametresFenetre(
        this.parametresSco.PremierLundi,
        this.parametresSco.PremiereDate,
        this.parametresSco.DerniereDate,
        this.parametresSco.JoursOuvres,
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
        ),
      );
    }
    if (!this.comboRessource) {
      this.comboRessource = ObjetIdentite_1.Identite.creerInstance(
        ObjetSaisie_1.ObjetSaisie,
        {
          pere: this,
          evenement: (aParams) => {
            if (
              aParams.genreEvenement ===
                Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                  .selection &&
              this.comboRessource.InteractionUtilisateur
            ) {
              WidgetPlanning.genrePlanningAccueil = aParams.element.getGenre();
              this.donneesGrille.ressources = aParams.element.liste;
              this._requeteEDT();
            }
          },
        },
      );
      this.comboRessource.setOptionsObjetSaisie({
        longueur: 105,
        labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
          "WAI.SelectionRessourceEDT",
        ),
      });
    }
  }
  initialiserObjetsEDT() {
    this.grille.initialiser();
    this.grille.setDonnees(this.donneesGrille);
    this.ficheCours.initialiser();
    this.comboRessource.initialiser();
    let lIndiceSelection = -1;
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    this.donnees.widget.listeRessourcesPlanning.parcourir(
      (aElement, aIndice) => {
        const lElement = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
        switch (aElement.getGenre()) {
          case Enumere_Ressource_1.EGenreRessource.Classe:
            lElement.Libelle =
              ObjetTraduction_1.GTraductions.getValeur("Classes");
            lElement.liste = this.etatUtilisateurSco.getListeClasses({
              avecClasse: true,
              uniquementClasseEnseignee: true,
            });
            break;
          case Enumere_Ressource_1.EGenreRessource.Enseignant:
            lElement.Libelle =
              ObjetTraduction_1.GTraductions.getValeur("Professeurs");
            lElement.liste = this.etatUtilisateurSco
              .getListeProfesseurs()
              .getListeElements((aElement) => {
                return aElement.existeNumero();
              });
            break;
          case Enumere_Ressource_1.EGenreRessource.Salle:
            lElement.Libelle =
              ObjetTraduction_1.GTraductions.getValeur("Salles");
            break;
          case Enumere_Ressource_1.EGenreRessource.Materiel:
            lElement.Libelle =
              ObjetTraduction_1.GTraductions.getValeur("Materiels");
            break;
          default:
        }
        lElement.liste.trier();
        lListe.addElement(lElement);
        if (WidgetPlanning.genrePlanningAccueil === aElement.getGenre()) {
          lIndiceSelection = aIndice;
        }
      },
    );
    if (lIndiceSelection < 0) {
      lIndiceSelection = 0;
      WidgetPlanning.genrePlanningAccueil = lListe.getGenre(lIndiceSelection);
    }
    this.donneesGrille.ressources = lListe.get(lIndiceSelection).liste;
    this.comboRessource.setDonnees(lListe, lIndiceSelection);
    if (this.dateEDT) {
      this.dateEDT.initialiser();
      this.dateEDT.setDonnees(this.donneesGrille.date);
    }
  }
  composeWidgetEDT() {
    const H = [];
    H.push(
      '<div id="',
      this.grille.getNom(),
      '" class="widget-conteneur-planning">',
      "</div>",
    );
    return H.join("");
  }
  initialiserGrille(aInstance) {
    aInstance.setOptionsInterfaceGrilleEDT({
      estPlanning: true,
      estPlanningParRessource: true,
      typePlanningEDT:
        TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour,
      avecParametresUtilisateursPrefsHorairesEtPas: true,
      optionsGrille: {
        grilleInverse: true,
        tailleMINPasHoraire: GNavigateur.isLayoutTactile
          ? Math.max(10, 550 / this.parametresSco.PlacesParJour)
          : 10,
        tailleMAXPasHoraire: 75,
        frequences: this.parametresSco.frequences,
        avecSelection: true,
        margeHauteur: 0,
        tailleMaxLibelleTranche: 100,
        avecScrollEnTactileH: true,
        avecScrollEnTactileV: true,
      },
      evenementMouseDownPlace: () => {
        this._fermerFiches();
      },
    });
  }
  _evenementDateEDT(aDate) {
    this._setDateGrille(aDate);
    this._requeteEDT();
  }
  evenementSurGrille(aParam) {
    switch (aParam.genre) {
      case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
      case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu:
      case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage: {
        if (!aParam.cours.coursMultiple) {
          this._requeteFicheCours(aParam);
        }
        break;
      }
      case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel: {
        if (aParam.cours.coursMultiple) {
          break;
        }
        this._fermerFiches();
        if (this.moduleSaisie) {
          this.moduleSaisie.afficherMenuContextuelDeCoursGrille(aParam.cours);
        }
        break;
      }
    }
    this.$refreshSelf();
  }
  _fermerFiches() {
    this.ficheCours.fermer();
    if (this.fenetre_SortiePedagogique) {
      this.fenetre_SortiePedagogique.fermer();
    }
  }
  async _requeteFicheCours(aParamsCours) {
    this._fermerFiches();
    if (
      aParamsCours.cours.getGenre() ===
        TypeStatutCours_1.TypeStatutCours.ConseilDeClasse &&
      !this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.cours.avecFicheCoursConseil,
      )
    ) {
      return;
    }
    if (aParamsCours.cours && aParamsCours.cours.estSortiePedagogique) {
      this.fenetre_SortiePedagogique =
        UtilitaireEDTSortiePedagogique_1.UtilitaireEDTSortiePedagogique.afficherFenetreSortiePeda(
          {
            pere: this,
            cours: aParamsCours.cours,
            idCours: aParamsCours.id,
            surFermerFenetre: () => {
              this.fenetre_SortiePedagogique = null;
            },
          },
        );
      return;
    }
    let lRessource = aParamsCours.cours.ressource;
    if (!lRessource) {
      lRessource = this.donneesGrille.ressources.get(0);
    }
    let lReponse;
    try {
      lReponse = await new ObjetRequeteFicheCours_1.ObjetRequeteFicheCours(
        this,
      ).lancerRequete({
        cours: aParamsCours.cours,
        ressource: lRessource,
        numeroSemaine: this.donneesGrille.numeroSemaine,
      });
    } catch (aMessage) {
      const lMessage =
        aMessage && aMessage.length > 0
          ? aMessage
          : ObjetTraduction_1.GTraductions.getValeur("requete.erreur");
      this.applicationSco.getMessage().afficher({ message: lMessage });
      this._requeteEDT();
      return;
    }
    const lDonneesFiche = {
      id: aParamsCours.id,
      listeCours: lReponse.listeCours,
      coursSelectionne: aParamsCours.cours,
      numeroSemaine: this.donneesGrille.numeroSemaine,
    };
    if (this.moduleSaisie) {
      $.extend(lDonneesFiche, this.moduleSaisie.getDonneesFicheCours());
    }
    this.ficheCours.setDonneesFicheCours(lDonneesFiche);
  }
}
exports.WidgetPlanning = WidgetPlanning;
WidgetPlanning.avecCoursAnnule = true;
WidgetPlanning.genrePlanningAccueil =
  Enumere_Ressource_1.EGenreRessource.Classe;

const {
  PanelDetailServiceNotationPN,
} = require("PanelDetailServiceNotationPN.js");
const { ObjetFenetre_DevoirPN } = require("ObjetFenetre_DevoirPN.js");
const { TypeCallbackFenetreDevoir } = require("ObjetFenetre_Devoir.js");
const {
  ObjetFenetre_MethodeCalculMoyenne,
} = require("ObjetFenetre_MethodeCalculMoyenne.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEleveDansDevoir } = require("Enumere_EleveDansDevoir.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
  EGenreEvenementNotesEtAppreciations,
} = require("Enumere_EvenementNotesEtAppreciations.js");
const {
  EGenreEvenementSaisieNotes,
} = require("Enumere_EvenementSaisieNotes.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre_Periode } = require("ObjetFenetre_Periode.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeNote } = require("TypeNote.js");
const { EGenreEvntMenusDeroulants } = require("Enumere_EvntMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const ObjetRequetePageNotes = require("ObjetRequetePageNotes.js");
const { ObjetRequeteSaisieNotes } = require("ObjetRequeteSaisieNotes.js");
const ObjetFenetre_CompetencesParEvaluation = require("ObjetFenetre_CompetencesParEvaluation.js");
const {
  ObjetFenetre_ParamSaisieNotes,
} = require("ObjetFenetre_ParamSaisieNotes.js");
const {
  ObjetRequeteSaisieNotesUnitaire,
} = require("ObjetRequeteSaisieNotesUnitaire.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  GestionnaireImportExport_PN,
} = require("GestionnaireImportExport_PN.js");
const {
  ENatureOperation,
  EFormatFichierIE,
} = require("GestionnaireImportExport.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_PageNotes } = require("DonneesListe_PageNotes.js");
const { DonneesListe_PageNotesPN } = require("DonneesListe_PageNotesPN.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { EGenreAction } = require("Enumere_Action.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { ObjetUtilitaireDevoir } = require("ObjetUtilitaireDevoir.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
class InterfacePageNotes extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.ordreDevoir = 100;
    this.moteur = new ObjetMoteurReleveBulletin();
  }
  construireInstances() {
    this.IdentTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    this.identListe = this.add(ObjetListe, this.evenementSurListe, null);
    this.identFicheService = this.add(
      PanelDetailServiceNotationPN,
      this.evenementSurFicheService,
      this.initialiserFicheService,
    );
    this.IdentFenetreDevoir = this.add(
      ObjetFenetre_DevoirPN,
      this.evenementSurFenetreDevoir,
      this.initialiserFenetreDevoir,
    );
    this.identFenetrePeriode = this.addFenetre(
      ObjetFenetre_Periode,
      this.evenementSurFenetrePeriode,
      this.initialiserFenetrePeriode,
    );
    this.identFenetreParametresAffichage = this.add(
      ObjetFenetre_ParamSaisieNotes,
      _evenementSurFenetreParametresAffichage,
      _initialiserFenetreParametresAffichage,
    );
    this.identFenetreMethodeCalculMoyenne = this.add(
      ObjetFenetre_MethodeCalculMoyenne,
      this._gestionFocusApresFenetreCalculMoyenne,
      this.initialiserMethodeCalculMoyenne,
    );
    if (
      this.IdentTripleCombo !== null &&
      this.IdentTripleCombo !== undefined &&
      this.getInstance(this.IdentTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.IdentTripleCombo,
      ).getPremierElement();
    }
    this.identFenetreCompetences = this.addFenetre(
      ObjetFenetre_CompetencesParEvaluation,
      _evenementFenetreCompetences.bind(this),
    );
    if (GEtatUtilisateur.avecImports()) {
      this.identImports = this.add(
        GestionnaireImportExport_PN,
        _eventImport.bind(this),
        _initImport.bind(this),
      );
    }
    this.construireFicheEleveEtFichePhoto();
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.IdentTripleCombo);
    this.AddSurZone.push({ html: '<span ie-html = "getInfoCloture"></span>' });
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
        "btnTriDevoirs",
      ),
    });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnAfficherMasquerZone(
        "btnAfficherParametresServices",
      ),
    });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
        "btnAfficherMonsieurFiche",
      ),
    });
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnOptionsAffichage"),
    });
    this.AddSurZone.push({ blocDroit: true });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="flex-contain cols flex-gap-l p-all-l">');
    H.push(
      '  <div id="',
      this.getInstance(this.identListe).getNom() +
        '" class="fluid-bloc"></div>',
    );
    H.push(
      '  <div id="' +
        this.getInstance(this.identFicheService).getNom() +
        '" class="fix-bloc"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  evenementAfficherMessage(aGenreMessage) {
    GHtml.setDisplay(this.getInstance(this.identFicheService).getNom(), false);
    this.getInstance(this.identListe).effacer();
    this._evenementAfficherMessage(aGenreMessage);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInfoCloture: function () {
        return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
      },
      btnTriDevoirs: {
        event() {
          GEtatUtilisateur.inverserTriDevoirs();
          if (aInstance.identFenetreMethodeCalculMoyenne) {
            const lFenetre = aInstance.getInstance(
              aInstance.identFenetreMethodeCalculMoyenne,
            );
            if (lFenetre.estAffiche()) {
              const l1 = {
                ordreChronologique: GEtatUtilisateur.getTriDevoirs(),
              };
              const l2 = $.extend({}, lFenetre.parametresCalcul, l1);
              lFenetre.setDonnees(l2);
            }
          }
          aInstance.actualiser();
        },
        getTitle() {
          if (GEtatUtilisateur.getTriDevoirs()) {
            return GTraductions.getValeur(
              "Notes.Bouton.OrdreChronologiqueInverse",
            );
          }
          return GTraductions.getValeur("Notes.Bouton.OrdreChronologique");
        },
        getSelection() {
          return GEtatUtilisateur.getTriDevoirs();
        },
      },
      btnAfficherParametresServices: {
        event() {
          GEtatUtilisateur.inverserAfficherFicheService();
          aInstance.actualiser();
        },
        getTitle() {
          return GTraductions.getValeur("Notes.Bouton.ParametresServices");
        },
        getSelection() {
          return GEtatUtilisateur.getAfficherFicheService();
        },
      },
      btnAfficherMonsieurFiche: {
        event() {
          let lMrFiche;
          if (TypeNote.estAnnotationPermise(EGenreAnnotation.absentZero)) {
            lMrFiche = "Notes.MFicheNotationSpecifiqueWetZ";
          } else {
            lMrFiche = "Notes.MFicheNotationSpecifique";
          }
          GApplication.getMessage().afficher({ idRessource: lMrFiche });
        },
        getTitle() {
          return GTraductions.getValeur("Notes.Bouton.Aide");
        },
      },
      btnOptionsAffichage: {
        event() {
          const lOptionsAffichage = aInstance
            .getInstance(aInstance.identListe)
            .getDonneesListe()
            .getOptionsAffichage();
          const lFenetreOptionsAffichage = aInstance.getInstance(
            aInstance.identFenetreParametresAffichage,
          );
          lFenetreOptionsAffichage.setDonnees({
            afficherProjetsAccompagnement:
              lOptionsAffichage.afficherProjetsAccompagnement,
            afficherMoyenneBrute: lOptionsAffichage.afficherMoyenneBrute,
          });
          lFenetreOptionsAffichage.afficher();
        },
        getTitle() {
          return GTraductions.getValeur("Notes.parametresAffichage");
        },
        getSelection() {
          return aInstance
            .getInstance(aInstance.identFenetreParametresAffichage)
            .estAffiche();
        },
      },
    });
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres(
      [
        EGenreRessource.Classe,
        EGenreRessource.Periode,
        EGenreRessource.Service,
      ],
      true,
    );
    aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
  }
  initialiserMethodeCalculMoyenne(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      titre: GTraductions.getValeur(
        "BulletinEtReleve.TitreFenetreCalculMoyenne",
      ),
      largeur: 600,
      hauteur: 300,
      listeBoutons: [GTraductions.getValeur("principal.fermer")],
      largeurMin: 600,
      hauteurMin: 150,
    });
  }
  initialiserFicheService(aInstance) {
    aInstance.setVisible(false);
  }
  initialiserFenetreDevoir(aInstance) {
    aInstance.avecSelectionService = true;
  }
  initialiserFenetrePeriode(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("Notes.SelectionnerPeriode"),
    });
  }
  getPageImpression(aProportion) {
    this.actualiser(null, true);
    let lProportion = 100;
    switch (aProportion) {
      case 0:
        lProportion = 140;
        break;
      case 1:
        lProportion = 120;
        break;
      case 2:
        lProportion = 100;
        break;
      case 3:
        lProportion = 80;
        break;
    }
    const lImpression = {
      titre1: GEtatUtilisateur.getLibelleImpression(
        GTraductions.getValeur("Notes.TitreImpression"),
        true,
        true,
        false,
        true,
        true,
      ),
      contenu: this.getInstance(this.identListe).composeImpression(lProportion),
      legende: composeLegendePageImpression(this.listeDevoirs),
    };
    this.actualiser(null, false);
    return lImpression;
  }
  evenementSurDernierMenuDeroulant(
    aClasse,
    aPeriode,
    aService,
    aMatiere,
    aProfesseur,
  ) {
    this.Classe = aClasse;
    this.Periode = aPeriode;
    this.Service = aService;
    this.Matiere = aMatiere;
    this.Professeur = aProfesseur;
    this.LibelleRessource = aClasse.getLibelle();
    this.NumeroRessource = aClasse.getNumero();
    this.GenreRessource = aClasse.getGenre();
    this.periode = aPeriode;
    this.LibelleService = aService.getLibelle();
    this.NumeroService = aService.getNumero();
    if (GEtatUtilisateur.avecImports()) {
      this.getInstance(this.identImports).setContexteImport({
        service: this.Service,
        periode: this.Periode,
        professeur: this.Professeur,
        niveau: this.Classe,
      });
    }
    this.afficherPage();
  }
  evenementSurListe(aParamEvnt) {
    switch (aParamEvnt.genreEvnt) {
      case EGenreEvenementSaisieNotes.EditionDevoir: {
        this._objGestionFocus_apresFenetreDevoir = {
          element: aParamEvnt.devoir,
        };
        const lFenetreDevoir = this.getInstance(this.IdentFenetreDevoir);
        const lListeBoutons = [];
        if (this.Service.getActif()) {
          lListeBoutons.push(
            GTraductions.getValeur("Supprimer"),
            "",
            GTraductions.getValeur("Annuler"),
            GTraductions.getValeur("Valider"),
            "",
          );
        } else {
          lListeBoutons.push(
            "",
            "",
            GTraductions.getValeur("principal.fermer"),
            "",
            "",
          );
        }
        lFenetreDevoir.setOptionsFenetre({ listeBoutons: lListeBoutons });
        const lCloture = this.leDevoirEstCloturePourNotation(aParamEvnt.devoir);
        lFenetreDevoir.setActif(this.Service.getActif(), lCloture, lCloture);
        lFenetreDevoir.avecSelectionService = false;
        lFenetreDevoir.setDonnees(
          aParamEvnt.devoir,
          false,
          null,
          this.baremeService,
          true,
          this.listeCategories,
        );
        break;
      }
      case EGenreEvenementSaisieNotes.SurDeselection:
        this.surDeselection(aParamEvnt);
        break;
      case EGenreEvenementSaisieNotes.CreationDevoir: {
        this._objGestionFocus_apresFenetreDevoir = {
          id: this.getInstance(this.identListe).getDonneesListe()
            .idBtnCreerDevoir,
        };
        this.getInstance(this.IdentFenetreDevoir).setOptionsFenetre({
          listeBoutons: [
            "",
            "",
            GTraductions.getValeur("Annuler"),
            "",
            {
              libelle: GTraductions.getValeur("Notes.Creer"),
              theme: TypeThemeBouton.primaire,
            },
          ],
        });
        let lListeService = null,
          lServiceDefaut = null;
        if (
          this.Service.estUnService &&
          this.Service.listeServices.count() > 0
        ) {
          this.getInstance(this.IdentFenetreDevoir).avecSelectionService = true;
          lListeService = this.Service.listeServices;
          if (this.Service.estCoEnseignement) {
            const lThis = this,
              lListeServiceFiltre = lListeService.getListeElements((aEle) => {
                return lThis.Professeur
                  ? aEle.professeur.getNumero() === lThis.Professeur.getNumero()
                  : aEle.professeur.getNumero() ===
                      GEtatUtilisateur.getUtilisateur().getNumero();
              });
            lServiceDefaut = lListeServiceFiltre.get(0);
          }
          if (!lServiceDefaut) {
            lServiceDefaut = lListeService.get(0);
          }
        } else {
          this.getInstance(this.IdentFenetreDevoir).avecSelectionService =
            false;
        }
        this.getInstance(this.IdentFenetreDevoir).setDonnees(
          this.creerDevoirParDefaut(lServiceDefaut),
          true,
          lListeService,
          this.baremeService,
          true,
          this.listeCategories,
        );
        break;
      }
      case EGenreEvenementSaisieNotes.Competences: {
        if (aParamEvnt.devoir.evaluation) {
          const lOptionsAffichage = this.getInstance(this.identListe)
            .getDonneesListe()
            .getOptionsAffichage();
          const lAvecSaisieNotes = !GApplication.droits.get(
            TypeDroits.estEnConsultation,
          );
          this.getInstance(
            this.identFenetreCompetences,
          ).setEstFenetreEditionCommentaireSurNoteUniquement(false);
          this.getInstance(this.identFenetreCompetences).setDonnees(
            {
              devoir: aParamEvnt.devoir,
              classe: GEtatUtilisateur.Navigation.getRessource(
                EGenreRessource.Classe,
              ),
              droitSaisieNotes: lAvecSaisieNotes,
            },
            {
              afficherProjetsAccompagnement:
                lOptionsAffichage.afficherProjetsAccompagnement,
              afficherMoyenneBrute: lOptionsAffichage.afficherMoyenneBrute,
              afficherCommentaireSurNote:
                !!aParamEvnt.devoir.avecCommentaireSurNoteEleve,
            },
          );
        }
        break;
      }
      case EGenreEvenementNotesEtAppreciations.MethodeCalculMoyenne: {
        let lClasse = aParamEvnt.classe
          ? aParamEvnt.classe
          : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
        if (
          lClasse !== null &&
          lClasse !== undefined &&
          lClasse.getNumero() === -1 &&
          lClasse.getGenre() === EGenreRessource.Aucune
        ) {
          let lEleve = aParamEvnt.eleve;
          lClasse = lEleve.classe;
        }
        const lPeriode = aParamEvnt.periode
          ? aParamEvnt.periode
          : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
        const lService = aParamEvnt.service
          ? aParamEvnt.service
          : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
        const lParametresCalcul = {
          libelleEleve: aParamEvnt.eleve.getLibelle(),
          numeroEleve: aParamEvnt.eleve.getNumero(),
          libelleClasse: lClasse.getLibelle(),
          numeroClasse: lClasse.getNumero(),
          libelleServiceNotation: lService.getLibelle(),
          numeroServiceNotation: lService.getNumero(),
          numeroPeriodeNotation: lPeriode.getNumero(),
          genreChoixNotation: lPeriode.getGenre(),
          moyenneTrimestrielle: true,
          pourMoyenneNette: aParamEvnt.estMoyenneNette,
          ordreChronologique: GEtatUtilisateur.getTriDevoirs(),
        };
        if (this.identFenetreMethodeCalculMoyenne) {
          this.getInstance(this.identFenetreMethodeCalculMoyenne).setDonnees(
            lParametresCalcul,
          );
        }
        break;
      }
      case EGenreEvenementNotesEtAppreciations.SelectionLigne: {
        GEtatUtilisateur.Navigation.setRessource(
          EGenreRessource.Eleve,
          aParamEvnt.eleve,
        );
        this.surSelectionEleve(true);
        break;
      }
      case EGenreEvenementSaisieNotes.Import: {
        this.getInstance(this.identImports).surSelectionFichierImport(
          aParamEvnt.file,
        );
        break;
      }
      case EGenreEvenementSaisieNotes.CommentaireSurNote: {
        if (aParamEvnt.devoir.avecCommentaireSurNoteEleve) {
          const lAvecSaisieNotes = !GApplication.droits.get(
            TypeDroits.estEnConsultation,
          );
          this.getInstance(
            this.identFenetreCompetences,
          ).setEstFenetreEditionCommentaireSurNoteUniquement(true);
          this.getInstance(this.identFenetreCompetences).setDonnees(
            {
              devoir: aParamEvnt.devoir,
              droitSaisieNotes: lAvecSaisieNotes,
              baremeParDefaut: this.baremeParDefaut,
            },
            {
              afficherCommentaireSurNote:
                !!aParamEvnt.devoir.avecCommentaireSurNoteEleve,
            },
          );
        }
        break;
      }
      case EGenreEvenementSaisieNotes.EditionCommentaireSurNote: {
        if (aParamEvnt.eleveDeDevoir) {
          _ouvrirFenetreCommentaireSurNote.call(this, aParamEvnt);
        }
        break;
      }
      default: {
        switch (aParamEvnt.genreEvenement) {
          case EGenreEvenementListe.Edition: {
            switch (aParamEvnt.idColonne) {
              case DonneesListe_PageNotes.colonnes.moyNR: {
                const lEleve = aParamEvnt.article;
                if (lEleve.estMoyNREditable) {
                  if (!lEleve.estMoyNR) {
                    GApplication.getMessage().afficher({
                      type: EGenreBoiteMessage.Confirmation,
                      titre: GTraductions.getValeur(
                        "Notes.TitreConfirmationMoyNR",
                      ),
                      message: GTraductions.getValeur(
                        "Notes.ConfirmationMoyNR",
                      ),
                      callback: function (aGenreAction) {
                        if (aGenreAction === EGenreAction.Valider) {
                          _basculerMoyNRDEleve.call(this, lEleve);
                        }
                      }.bind(this),
                    });
                  } else {
                    _basculerMoyNRDEleve.call(this, lEleve);
                  }
                }
                break;
              }
              default:
                break;
            }
            break;
          }
          default:
            break;
        }
        break;
      }
    }
  }
  surDeselection(aParamEvnt) {
    if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
      this.setEtatSaisie(true);
    }
    this.surModifContexteAffichage();
    if (!GApplication.droits.get(TypeDroits.estEnConsultation)) {
      aParamEvnt.periode = this.Periode;
      aParamEvnt.service = this.Service;
      new ObjetRequeteSaisieNotesUnitaire(this, () => {
        if (aParamEvnt && aParamEvnt.eleve) {
          aParamEvnt.eleve.setEtat(EGenreEtat.Aucun);
          if (aParamEvnt.devoir && aParamEvnt.devoir.listeEleves) {
            const lEleveDuDevoir =
              aParamEvnt.devoir.listeEleves.getElementParNumero(
                aParamEvnt.eleve.getNumero(),
              );
            if (lEleveDuDevoir) {
              lEleveDuDevoir.setEtat(EGenreEtat.Aucun);
            }
          }
        }
      }).lancerRequete(aParamEvnt);
    }
    if (aParamEvnt.avecActualisation) {
      const lInstanceListe = this.getInstance(this.identListe);
      if (aParamEvnt.ligneSuivante) {
        lInstanceListe.selectionnerCelluleSuivante({
          orientationVerticale: true,
          avecCelluleEditable: true,
          entrerEdition: false,
          avecSelection: false,
        });
      }
      const lSelectionCellule = lInstanceListe.getSelectionCellule();
      this.actualiser();
      lInstanceListe.demarrerEditionSurCellule(
        lSelectionCellule.ligne,
        lSelectionCellule.colonne,
      );
    }
  }
  surEvntMenusDeroulants(aParam) {
    switch (aParam.genreEvenement) {
      case EGenreEvntMenusDeroulants.surOuvertureCombo:
        this.surModifContexteAffichage();
        break;
      case EGenreEvntMenusDeroulants.ressourceNonTrouve:
        this.surRessourceCouranteNonTrouveeDansCombo(aParam);
        break;
    }
  }
  surModifContexteAffichage() {
    if (this.identFenetreMethodeCalculMoyenne) {
      const lFenetre = this.getInstance(this.identFenetreMethodeCalculMoyenne);
      if (lFenetre.EstAffiche) {
        lFenetre.fermer();
      }
    }
  }
  evenementSurFicheService() {
    if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
      this.setEtatSaisie(true);
    }
    this.surModifContexteAffichage();
    const lScrollTop = GHtml.getElement(this.Nom).scrollTop;
    const lCallbackApresReussite = () => {
      GHtml.getElement(this.Nom).scrollTop = lScrollTop;
    };
    if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
      this.actualiser(lCallbackApresReussite);
    } else {
      this.valider(lCallbackApresReussite);
    }
  }
  synchroniserSujetEtCorrige(aDevoir) {
    const lSujet = aDevoir.listeSujets.get(0);
    if (lSujet) {
      lSujet.setNumero(aDevoir.getNumero());
      this.listeSujets.addElement(
        lSujet,
        this.listeSujets.getIndiceParNumeroEtGenre(aDevoir.getNumero()),
      );
    }
    const lCorrige = aDevoir.listeCorriges.get(0);
    if (lCorrige) {
      lCorrige.setNumero(aDevoir.getNumero());
      this.listeCorriges.addElement(
        lCorrige,
        this.listeCorriges.getIndiceParNumeroEtGenre(aDevoir.getNumero()),
      );
    }
  }
  evenementSurFenetreDevoir(aGenreEvenement, aParam) {
    if (aGenreEvenement === TypeCallbackFenetreDevoir.periode) {
      this.selection_ClasseDevoir = aParam.classe;
      this.selection_PeriodeDevoir = aParam.periode;
      const lClasse = this.listeClasses.getElementParNumero(
        aParam.classe.getNumero(),
      );
      this.getInstance(this.identFenetrePeriode).setDonnees(
        lClasse.listePeriodes,
        aParam.avecSansPeriode,
        false,
        false,
      );
    } else if (aGenreEvenement === TypeCallbackFenetreDevoir.validation) {
      switch (aParam.bouton) {
        case this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler: {
          break;
        }
        case this.getInstance(this.IdentFenetreDevoir).genreBouton.supprimer: {
          this.listeDevoirs.addElement(
            aParam.devoir,
            this.listeDevoirs.getIndiceParElement(aParam.devoir),
          );
          aParam.devoir.setEtat(EGenreEtat.Suppression);
          break;
        }
        case this.getInstance(this.IdentFenetreDevoir).genreBouton.valider: {
          this.listeDevoirs.addElement(
            aParam.devoir,
            this.listeDevoirs.getIndiceParElement(aParam.devoir),
          );
          this.synchroniserSujetEtCorrige(aParam.devoir);
          for (let i = 0; i < aParam.devoir.listeEleves.count(); i++) {
            const lEleve = aParam.devoir.listeEleves.get(i);
            if (lEleve.Note.getValeur() > aParam.devoir.bareme.getValeur()) {
              lEleve.Note = new TypeNote(aParam.devoir.bareme.getValeur());
              lEleve.setEtat(aParam.devoir.Modification);
            }
          }
          aParam.devoir.setEtat(EGenreEtat.Modification);
          break;
        }
        case this.getInstance(this.IdentFenetreDevoir).genreBouton.creer: {
          if (aParam.devoir.service && aParam.devoir.service.listeEleves) {
            aParam.devoir.listeEleves = this.creerDevoirParDefautListeEleves(
              aParam.devoir.service.listeEleves,
            );
          }
          aParam.devoir.ordre = this.ordreDevoir--;
          this.synchroniserSujetEtCorrige(aParam.devoir);
          this.listeDevoirs.addElement(aParam.devoir);
          break;
        }
      }
      if (
        MethodesObjet.isNumeric(aParam.bouton) &&
        aParam.bouton !== -1 &&
        aParam.bouton !==
          this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler
      ) {
        let lCallbackFocusApresSaisie;
        if (
          aParam.bouton ===
            this.getInstance(this.IdentFenetreDevoir).genreBouton.creer ||
          aParam.bouton ===
            this.getInstance(this.IdentFenetreDevoir).genreBouton.valider
        ) {
          const lThis = this;
          const lBouton = aParam.bouton;
          let lNumeroDevoir =
            aParam.bouton ===
            this.getInstance(this.IdentFenetreDevoir).genreBouton.valider
              ? aParam.devoir.getNumero()
              : 0;
          lCallbackFocusApresSaisie = function (aJSONReponseSaisie) {
            if (lNumeroDevoir === 0) {
              if (
                !!aJSONReponseSaisie &&
                !!aJSONReponseSaisie.listeDevoirsCrees &&
                aJSONReponseSaisie.listeDevoirsCrees.count() > 0
              ) {
                const lDevoirCree =
                  aJSONReponseSaisie.listeDevoirsCrees.getPremierElement();
                if (!!lDevoirCree) {
                  lNumeroDevoir = lDevoirCree.getNumero();
                }
              } else {
              }
            }
            let lDevoirConcerne;
            if (!!lNumeroDevoir && !!lThis.listeDevoirs) {
              lDevoirConcerne =
                lThis.listeDevoirs.getElementParNumero(lNumeroDevoir);
            }
            if (!!lDevoirConcerne) {
              lThis._gestionFocusApresFenetreDevoir(lBouton, lDevoirConcerne);
            }
          };
        }
        if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
          this.actualiser();
          this.setEtatSaisie(true);
        }
        this.valider(lCallbackFocusApresSaisie);
      }
    } else if (aGenreEvenement === TypeCallbackFenetreDevoir.service) {
      let lListeService = null;
      if (this.Service.estUnService && this.Service.listeServices.count() > 0) {
        this.getInstance(this.IdentFenetreDevoir).avecSelectionService = true;
        lListeService = this.Service.listeServices;
      } else {
        this.getInstance(this.IdentFenetreDevoir).avecSelectionService = false;
      }
      this.getInstance(this.IdentFenetreDevoir).setDonnees(
        this.creerDevoirParDefaut(aParam.service),
        true,
        lListeService,
        this.baremeService,
        true,
        this.listeCategories,
      );
    }
  }
  evenementSurFenetrePeriode(aGenreEvenement, aPeriodeDevoir) {
    switch (aGenreEvenement) {
      case 0: {
        break;
      }
      case 1: {
        if (
          this.selection_PeriodeDevoir.getNumero() !==
          aPeriodeDevoir.getNumero()
        ) {
          if (
            this.selection_ClasseDevoir.listePeriodes.getElementParNumero(
              aPeriodeDevoir.getNumero(),
            ) === null ||
            this.selection_ClasseDevoir.listePeriodes.getElementParNumero(
              aPeriodeDevoir.getNumero(),
            ) === undefined
          ) {
            this.selection_PeriodeDevoir.setNumero(aPeriodeDevoir.getNumero());
            this.selection_PeriodeDevoir.setLibelle(
              aPeriodeDevoir.existeNumero() ? aPeriodeDevoir.getLibelle() : "",
            );
            this.selection_PeriodeDevoir.setActif(true);
            this.selection_PeriodeDevoir.setEtat(EGenreEtat.Modification);
            this.selection_PeriodeDevoir.estEvaluationCloturee =
              aPeriodeDevoir.estEvaluationCloturee;
          } else {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Information,
              message: GTraductions.getValeur("Notes.PeriodeDejaAffectee"),
            });
          }
        }
        this.getInstance(this.IdentFenetreDevoir).actualiser();
        break;
      }
    }
    this._gestionFocusApresFenetreSelectionPeriode();
  }
  afficherPage(aCallbackApresAffichage) {
    this.setEtatSaisie(false);
    this.afficherBandeau(true);
    const lParam = {
      numeroRessource: this.NumeroRessource,
      genreRessource: this.GenreRessource,
      numeroService: this.NumeroService,
      periode: this.periode,
    };
    new ObjetRequetePageNotes(
      this,
      this.actionSurEvenementAfficherPage.bind(this, aCallbackApresAffichage),
    ).lancerRequete(lParam);
  }
  actionSurEvenementAfficherPage(aCallbackApresAffichage, aParam) {
    this.afficherBandeau(true);
    this.strInfoCloture = aParam.strInfoCloture || "";
    this.serviceEntier = aParam.serviceEntier;
    this.autorisations = aParam.autorisations;
    this.Service = aParam.Service;
    this.listeClasses = aParam.listeClasses;
    this.listeEleves = aParam.listeEleves;
    this.listeDevoirs = aParam.listeDevoirs;
    this.listeSujets = aParam.listeSujets;
    this.listeCorriges = aParam.listeCorriges;
    this.listeCategories = aParam.listeCategories;
    this.baremeParDefaut = aParam.baremeParDefaut;
    this.baremeService = aParam.baremeService;
    this.avecColNR =
      aParam.avecColNR !== null && aParam.avecColNR !== undefined
        ? aParam.avecColNR
        : false;
    this.actualiser(aCallbackApresAffichage);
  }
  actualiser(aCallbackApresAffichage, aPourImpression) {
    if (this.listeEleves && this.listeEleves.count()) {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.Format,
        this,
      );
      this.controlerElevesClotures();
      GHtml.setDisplay(this.Nom + "_Bandeau", true);
      this.getInstance(this.identFicheService).setVisible(
        GEtatUtilisateur.getAfficherFicheService() &&
          this.Periode.existeNumero(),
      );
      this.surResizeInterface();
      const lCloture = this.laPeriodeEstClotureePourNotation(
        this.Periode,
        this.Classe.getGenre() === EGenreRessource.Classe ? this.Classe : null,
      );
      const lClotureGlobal = this.laPeriodeEstClotureePourNotation(
        this.Periode,
      );
      const lActifBoutonCreerDevoir =
        this.Service.getActif() &&
        this.periode.existeNumero() &&
        !lClotureGlobal;
      this.getInstance(this.identFicheService).setPanelDetailServiceActif(
        this.Service.getActif(),
        lCloture,
        lClotureGlobal,
      );
      this.getInstance(this.IdentFenetreDevoir).setActif(
        this.Service.getActif(),
        lCloture,
        lClotureGlobal,
      );
      this.listeDevoirs.setTri([
        ObjetTri.init(
          "date",
          GEtatUtilisateur.getTriDevoirs()
            ? EGenreTriElement.Croissant
            : EGenreTriElement.Decroissant,
        ),
      ]);
      this.listeDevoirs.trier();
      const lMatiereService = this.Service.matiere.getLibelle();
      const lAfficherMatiere =
        this.Service.estUnService &&
        this.Service.listeServices.count() > 0 &&
        this.Service.listeServices
          .getListeElements((aEle) => {
            return aEle.matiere.getLibelle() !== lMatiereService;
          })
          .count() > 0;
      this.getInstance(this.identListe).setDonnees(
        new DonneesListe_PageNotesPN(
          { listeEleves: this.listeEleves, listeDevoirs: this.listeDevoirs },
          {
            avecColonneClasse:
              this.Classe.getGenre() === EGenreRessource.Groupe ||
              (this.Classe.getNumero() === -1 &&
                this.Classe.getGenre() === EGenreRessource.Aucune &&
                !!this.Service &&
                this.Service.estUnServiceEnGroupe),
            matiere: this.Matiere,
            service: this.Service,
            periode: this.periode,
            listeClasses: this.listeClasses,
            forcerMoyenneBruteDevoir: false,
            forcerSansSousService: false,
            avecNomMatiere: lAfficherMatiere,
            avecTotal: false,
            baremeParDefaut: this.baremeService,
            avecNomProfesseur: false,
            callbackEvnt: this.evenementSurListe.bind(this),
            instance: this.getInstance(this.identListe),
            optionsAffichage: this.getInstance(
              this.identFenetreParametresAffichage,
            ),
            pourImpression: aPourImpression,
            avecImport: GEtatUtilisateur.avecImports(),
            avecColNR: this.avecColNR,
          },
        ),
      );
      this.getInstance(this.identListe)
        .getDonneesListe()
        .setActif(this.Service.getActif(), lActifBoutonCreerDevoir);
      this.activerFichesEleve(this.selectionnerEleveCourant());
      if (this.periode.getNumero()) {
        this.Instances[this.identFicheService].setDonnees(
          this.autorisations,
          this.Periode,
          this.Service,
        );
      }
    } else {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.Aucune,
      );
      if (this.listeEleves) {
        this.evenementAfficherMessage(
          GTraductions.getValeur("Notes.AucunEleve"),
        );
      }
    }
    if (
      !!aCallbackApresAffichage &&
      MethodesObjet.isFunction(aCallbackApresAffichage)
    ) {
      aCallbackApresAffichage();
    }
  }
  valider(aCallbackApresSaisie) {
    const lListeSujetsEtCorriges = new ObjetListeElements();
    lListeSujetsEtCorriges.add(this.listeSujets);
    lListeSujetsEtCorriges.add(this.listeCorriges);
    const lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
      return aElement.getGenre() === EGenreDocumentJoint.Cloud;
    });
    new ObjetRequeteSaisieNotes(
      this,
      _surSaisieNotes.bind(this, aCallbackApresSaisie),
    )
      .addUpload({
        listeFichiers: lListeSujetsEtCorriges,
        listeDJCloud: lListeCloud,
      })
      .lancerRequete({
        periode: this.Periode,
        service: this.Service,
        listeEleves: this.listeEleves,
        listeDevoirs: this.listeDevoirs,
        listeSujetsEtCorriges: lListeSujetsEtCorriges,
      });
  }
  creerDevoirParDefaut(aService) {
    const lDevoir = new ObjetElement();
    lDevoir.service = aService || this.Service;
    lDevoir.estDevoirEditable = lDevoir.service.getActif();
    lDevoir.matiere = MethodesObjet.dupliquer(this.Matiere);
    lDevoir.date = GDate.getDateCourante();
    lDevoir.coefficient = new TypeNote(1.0);
    lDevoir.bareme = new TypeNote(this.baremeParDefaut.getValeur());
    lDevoir.commentaire = "";
    lDevoir.datePublication =
      ObjetUtilitaireDevoir.getDatePublicationDevoirParDefaut(lDevoir.date);
    lDevoir.listeClasses = this.creerDevoirParDefautListeClasses();
    lDevoir.listeEleves = this.creerDevoirParDefautListeEleves();
    lDevoir.verrouille = false;
    lDevoir.commeUneNote = false;
    lDevoir.commeUnBonus = false;
    lDevoir.ramenerSur20 = false;
    lDevoir.listeSujet = "";
    lDevoir.libelleCorrige = "";
    lDevoir.listeSujets = new ObjetListeElements();
    lDevoir.listeCorriges = new ObjetListeElements();
    lDevoir.libelleCBTheme = GTraductions.getValeur("Theme.libelleCB.devoir");
    lDevoir.avecCommentaireSurNoteEleve = false;
    lDevoir.setEtat(EGenreEtat.Creation);
    return lDevoir;
  }
  creerDevoirParDefautListeClasses() {
    const llisteClasses = new ObjetListeElements();
    for (let i = 0, lNbr = this.listeClasses.count(); i < lNbr; i++) {
      let lClasse = this.listeClasses.get(i);
      const lClasseDevoir = MethodesObjet.dupliquer(lClasse);
      lClasseDevoir.service = MethodesObjet.dupliquer(lClasse.service);
      let lPeriode = lClasse.listePeriodes.getElementParNumero(
        this.periode.getNumero(),
      );
      if (!lPeriode) {
        lPeriode = lClasse.periodeParDefaut;
      }
      let lPremierePeriodeDevoir = new ObjetElement(
        lPeriode.getLibelle(),
        lPeriode.getNumero(),
        null,
        null,
        true,
      );
      lPremierePeriodeDevoir.estEvaluationCloturee =
        lPeriode.estEvaluationCloturee;
      lClasseDevoir.listePeriodes = new ObjetListeElements();
      lClasseDevoir.listePeriodes.addElement(lPremierePeriodeDevoir);
      lClasseDevoir.listePeriodes.addElement(
        new ObjetElement("", 0, null, null, true),
      );
      llisteClasses.addElement(lClasseDevoir);
    }
    return llisteClasses;
  }
  creerDevoirParDefautListeEleves(aListeEleves) {
    const lListeEleves = new ObjetListeElements();
    if (!aListeEleves) {
      aListeEleves = this.listeEleves;
    }
    for (let I = 0; I < aListeEleves.count(); I++) {
      const lEleve = aListeEleves.get(I);
      const lEleveDevoir = new ObjetElement("", lEleve.getNumero());
      lEleveDevoir.Note = new TypeNote("");
      lListeEleves.addElement(lEleveDevoir);
    }
    return lListeEleves;
  }
  getPeriodesAnnee() {
    const lPeriodesAnnee = [];
    for (let I = 0; I < this.listeClasses.count(); I++) {
      const lClasse = this.listeClasses.get(I);
      for (let J = 0; J < lClasse.listePeriodes.count(); J++) {
        lPeriodesAnnee[lClasse.listePeriodes.getNumero(J)] = true;
      }
    }
    return lPeriodesAnnee;
  }
  _estEleveDansLaClasseALaDate(aEleve, aDate) {
    let lEstDansClasse =
      !aEleve.classe ||
      !aEleve.classe.datesDebut ||
      aEleve.classe.datesDebut.length === 0;
    for (let i = 0; i < aEleve.classe.datesDebut.length; i++) {
      if (
        aDate >= aEleve.classe.datesDebut[i] &&
        aDate <= aEleve.classe.datesFin[i]
      ) {
        lEstDansClasse = true;
        break;
      }
    }
    return lEstDansClasse;
  }
  controlerElevesClotures() {
    for (let I = 0; I < this.listeDevoirs.count(); I++) {
      const lDevoir = this.listeDevoirs.get(I);
      for (let J = 0; J < lDevoir.listeEleves.count(); J++) {
        const lEleveDevoir = lDevoir.listeEleves.get(J);
        let lEleve = null;
        const lListeElevesPourEleveDevoir = this.listeEleves.getListeElements(
          (D) => {
            return D && D.getNumero() === lEleveDevoir.getNumero();
          },
        );
        if (lListeElevesPourEleveDevoir.count() >= 1) {
          if (lListeElevesPourEleveDevoir.count() === 1) {
            lEleve = lListeElevesPourEleveDevoir.get(0);
          } else {
            for (const lElevePourEleveDevoir of lListeElevesPourEleveDevoir) {
              if (
                this._estEleveDansLaClasseALaDate(
                  lElevePourEleveDevoir,
                  lDevoir.date,
                )
              ) {
                lEleve = lElevePourEleveDevoir;
                break;
              }
            }
            if (!lEleve) {
              lEleve = lListeElevesPourEleveDevoir.get(0);
            }
          }
        }
        if (lEleve) {
          const lClasseDevoir = lDevoir.listeClasses.getElementParNumero(
            lEleve.classe.getNumero(),
          );
          if (lClasseDevoir) {
            lEleveDevoir.Actif = true;
            for (let K = 0; K < lClasseDevoir.listePeriodes.count(); K++) {
              if (
                this.laPeriodeEstClotureePourNotation(
                  lClasseDevoir.listePeriodes.get(K),
                  lClasseDevoir,
                )
              ) {
                lEleveDevoir.Actif = false;
              }
            }
          } else {
            lEleveDevoir.Actif = false;
          }
        }
      }
    }
  }
  laPeriodeEstClotureePourNotation(aPeriode, aClasse) {
    if (!aPeriode.existeNumero()) {
      return false;
    }
    const N = aClasse ? 1 : this.listeClasses.count();
    for (let I = 0; I < N; I++) {
      const lClasse = aClasse
        ? this.listeClasses.getElementParNumero(aClasse.getNumero())
        : this.listeClasses.get(I);
      const lPeriode = lClasse.listePeriodes.getElementParNumero(
        aPeriode.getNumero(),
      );
      if (lPeriode && !lPeriode.getActif()) {
        return true;
      }
    }
    return false;
  }
  leDevoirEstCloturePourNotation(aDevoir) {
    for (let i = 0; i < aDevoir.listeClasses.count(); i++) {
      let lClasse = aDevoir.listeClasses.get(i);
      for (let j = 0; j < lClasse.listePeriodes.count(); j++) {
        let lPeriode = lClasse.listePeriodes.get(j);
        if (this.laPeriodeEstClotureePourNotation(lPeriode, lClasse)) {
          return true;
        }
      }
    }
    return false;
  }
  selectionnerEleveCourant() {
    let lTrouve = false;
    const lEleve = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    if (lEleve && !lEleve.multiSelection) {
      const lNbEleves = this.listeEleves.count();
      for (let I = 0; I < lNbEleves; I++) {
        const lElement = this.listeEleves.get(I);
        if (lElement.getNumero() === lEleve.getNumero()) {
          lTrouve = true;
          this.getInstance(this.identListe).selectionnerLigne({
            ligne: I,
            avecScroll: true,
          });
          break;
        }
      }
    }
    return lTrouve;
  }
  getIndexEleveSurDevoir(aDevoir) {
    if (aDevoir && aDevoir.listeEleves && aDevoir.listeEleves.count()) {
      for (let lIndex = 0; lIndex < this.listeEleves.count(); lIndex++) {
        const lEleve = this.listeEleves.get(lIndex);
        const lEleveDevoir = aDevoir.listeEleves.getElementParNumeroEtGenre(
          lEleve.getNumero(),
        );
        const lEleveDansDevoir = lEleve.dansDevoir[aDevoir.getNumero()];
        if (
          lEleveDevoir &&
          lEleveDevoir.Note &&
          lEleveDansDevoir === EGenreEleveDansDevoir.Oui &&
          this.getInstance(this.identListe)
            .getDonneesListe()
            .devoirDansPeriode(aDevoir, lEleve, this.periode.getNumero())
        ) {
          return lIndex;
        }
      }
    }
    return -1;
  }
  _gestionFocusApresFenetreDevoir(aGenreEvenement, aDevoir) {
    if (aGenreEvenement === null || aGenreEvenement === undefined) {
      return;
    }
    switch (aGenreEvenement) {
      case -1:
      case this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler:
        break;
      case this.getInstance(this.IdentFenetreDevoir).genreBouton.supprimer:
        this._objGestionFocus_apresFenetreDevoir = {
          id: this.getInstance(this.identListe).getDonneesListe()
            .idBtnCreerDevoir,
        };
        break;
      case this.getInstance(this.IdentFenetreDevoir).genreBouton.valider:
      case this.getInstance(this.IdentFenetreDevoir).genreBouton.creer:
        if (!aDevoir.verrouille) {
          const lIndexEleve = this.getIndexEleveSurDevoir(aDevoir);
          if (lIndexEleve === -1) {
            this._objGestionFocus_apresFenetreDevoir = {
              id: this.getInstance(this.identListe).getDonneesListe()
                .idBtnCreerDevoir,
            };
          } else {
            let lIndexDevoir = this.listeDevoirs.getIndiceParElement(aDevoir);
            if (lIndexDevoir >= 0) {
              lIndexDevoir = this.getInstance(this.identListe)
                .getDonneesListe()
                .getNumeroColonneDId(
                  DonneesListe_PageNotes.colonnes.devoir + "_" + lIndexDevoir,
                );
              this.getInstance(this.identListe).demarrerEditionSurCellule(
                lIndexEleve,
                lIndexDevoir,
              );
              this.getInstance(this.identListe).selectionnerLigne({
                ligne: lIndexEleve,
              });
              return;
            }
          }
        } else {
          this._objGestionFocus_apresFenetreDevoir = {
            id: this.getInstance(this.identListe).getDonneesListe()
              .idBtnCreerDevoir,
          };
        }
        break;
      default:
        break;
    }
    let lID = this.getInstance(this.identListe).Nom;
    if (this._objGestionFocus_apresFenetreDevoir.id) {
      lID = this._objGestionFocus_apresFenetreDevoir.id;
      delete this._objGestionFocus_apresFenetreDevoir.element;
    }
    GHtml.setFocus(lID);
  }
  _gestionFocusApresFenetreCalculMoyenne() {}
  _gestionFocusApresFenetreSelectionPeriode() {
    if (
      this._objGestionFocus_apresFenetreSelectionPeriode &&
      this._objGestionFocus_apresFenetreSelectionPeriode.id
    ) {
      GHtml.setFocus(this._objGestionFocus_apresFenetreSelectionPeriode.id);
    }
    this._objGestionFocus_apresFenetreSelectionPeriode = null;
  }
}
function _initImport(aInstance) {
  aInstance.setOptions({
    genreOperation: ENatureOperation.import,
    genreImport: EFormatFichierIE.workbook,
  });
}
function _eventImport() {
  this.setEtatSaisie(true);
  this.valider();
}
function _evenementFenetreCompetences() {
  this.afficherPage();
}
function composeLegendePageImpression(aListeDevoirs) {
  const H = [];
  if (!!aListeDevoirs && aListeDevoirs.getNbrElementsExistes() > 0) {
    aListeDevoirs.parcourir((aDevoir, aIndex) => {
      if (!!aDevoir && aDevoir.existe() && !!aDevoir.commentaire) {
        H.push("<div>(", aIndex + 1, ") ", aDevoir.commentaire, "</div>");
      }
    });
  }
  return H.join("");
}
function _initialiserFenetreParametresAffichage(aInstance) {
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("Notes.parametresAffichage"),
    largeur: 350,
    hauteur: 80,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
}
function _evenementSurFenetreParametresAffichage(aNumeroBouton, aParametres) {
  if (aNumeroBouton === 1) {
    this.getInstance(this.identListe)
      .getDonneesListe()
      .setOptionsAffichage({
        afficherProjetsAccompagnement:
          aParametres.afficherProjetsAccompagnement,
        afficherMoyenneBrute: aParametres.afficherMoyenneBrute,
      });
    this.actualiser();
  }
}
function _surSaisieNotes(aCallbackApresSaisie, aJSONReponse) {
  let lCallbackApresSaisie;
  if (!!aCallbackApresSaisie) {
    lCallbackApresSaisie = aCallbackApresSaisie.bind(this, aJSONReponse);
  }
  this.actionSurValidation(lCallbackApresSaisie);
}
function _basculerMoyNRDEleve(aEleve) {
  if (aEleve.estMoyNREditable) {
    this.moteur.saisieMoyNR({
      paramRequete: {
        estMoyNR: !aEleve.estMoyNR,
        periode: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Periode,
        ),
        eleve: aEleve,
        service: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Service,
        ),
      },
      instanceListe: this.getInstance(this.identListe),
      clbckSucces: function (aParamSucces) {
        const lDonneesListe = this.getInstance(
          this.identListe,
        ).getListeArticles();
        const lLignes = lDonneesListe.getListeElements((aLigne) => {
          return aLigne.getNumero() === aParamSucces.numeroEleve;
        });
        const lLigne = lLignes.get(0);
        lLigne.estMoyNR = aParamSucces.estMoyNRSaisie;
        this.getInstance(this.identListe)
          .getDonneesListe()
          .actualiserMoyennes();
      }.bind(this),
      paramCellSuivante: null,
      clbckEchec: function () {}.bind(this),
    });
  }
}
function _ouvrirFenetreCommentaireSurNote(aParams = {}) {
  if (!aParams.eleveDeDevoir) {
    return;
  }
  const lCommentaireDupliquer = aParams.eleveDeDevoir.commentaire
    ? MethodesObjet.dupliquer(aParams.eleveDeDevoir.commentaire)
    : "";
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
    pere: this,
    initialiser: (aInstanceFenetre) => {
      aInstanceFenetre.setOptionsFenetre({
        titre: GTraductions.getValeur("Notes.remarque"),
        avecTailleSelonContenu: true,
        largeur: 400,
        hauteur: 200,
        listeBoutons: [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Valider"),
        ],
      });
    },
    evenement: (aGenreBouton, aParamFenetre) => {
      if (aGenreBouton === 1) {
        aParams.eleveDeDevoir.commentaire = aParamFenetre.instance.commentaire;
        if (!aParams.eleveDeDevoir.note && aParams.eleveDeDevoir.Note) {
          aParams.eleveDeDevoir.note = aParams.eleveDeDevoir.Note;
        }
        this.surDeselection({
          avecActualisation: true,
          devoir: aParams.devoir,
          eleve: aParams.eleveDeDevoir,
          note: aParams.eleveDeDevoir.note,
        });
      }
    },
  });
  lFenetre.commentaire = lCommentaireDupliquer;
  lFenetre.controleur.textareamax = {
    getValue() {
      return this.instance.commentaire;
    },
    setValue(aValue) {
      this.instance.commentaire = aValue;
    },
  };
  const H = [];
  H.push(
    `<div class="field-contain">`,
    `<ie-textareamax ie-model="textareamax" class="round-style fluid-bloc" placeholder='' maxlength="10000" style="min-height: 7rem;" ></ie-textareamax>`,
    `</div>`,
  );
  lFenetre.afficher(H.join(""));
}
module.exports = InterfacePageNotes;

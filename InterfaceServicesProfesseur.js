const { TypeDroits } = require("ObjetDroitsPN.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_ServicesProfesseur,
} = require("DonneesListe_ServicesProfesseur.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
  ObjetFenetre_SaisieSousService,
} = require("ObjetFenetre_SaisieSousService.js");
const { ObjetRequeteListeServices } = require("ObjetRequeteListeServices.js");
const ObjetRequeteSaisieSousServices = require("ObjetRequeteSaisieSousServices.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetRequeteProgrammesBO } = require("ObjetRequeteProgrammesBO.js");
const {
  ObjetRequeteCreationDevoirDNL,
} = require("ObjetRequeteCreationDevoirDNL.js");
const { ObjetInvocateur } = require("Invocateur.js");
const { Invocateur } = require("Invocateur.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class InterfaceServicesProfesseur extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.droits = {
      creerSousService: GApplication.droits.get(
        TypeDroits.services.avecCreationSousServices,
      ),
      modifierCoefGeneral: GApplication.droits.get(
        TypeDroits.services.avecModificationCoefGeneral,
      ),
      avecGestionNotation: GApplication.droits.get(
        TypeDroits.fonctionnalites.gestionNotation,
      ),
      avecColonneDNL: GApplication.droits.get(
        TypeDroits.fonctionnalites.importExportEducationNationale,
      ),
    };
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _eventSurDernierMenuDeroulant.bind(this),
      _initTripleCombo,
    );
    this.identListe = this.add(
      ObjetListe,
      _evenementListe.bind(this),
      _initialiserListe.bind(this),
    );
    this.identFenetre_SaisieSousService = this.addFenetre(
      ObjetFenetre_SaisieSousService,
      _eventFenetreSaisieSousService,
      _initFenetreSaisieSousService,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    if (this.droits.creerSousService === true) {
      this.AddSurZone.push({
        html:
          '<ie-bouton ie-model="btnCreerSousService" class="small-bt" title="' +
          GChaine.toTitle(
            GTraductions.getValeur(
              "servicesProfesseur.CommandeCreerSousService",
            ),
          ) +
          '">' +
          GTraductions.getValeur(
            "servicesProfesseur.CommandeCreerSousService",
          ) +
          "</ie-bouton>",
        alignementDroite: true,
      });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnCreerSousService: {
        event() {
          const lListeServices = aInstance.getInstance(aInstance.identListe);
          if (!!lListeServices) {
            _callbackCreerSousService.call(
              aInstance,
              lListeServices.getListeElementsSelection().getPremierElement(),
            );
          }
        },
        getDisabled() {
          const lListeServices = aInstance.getInstance(aInstance.identListe);
          if (!!lListeServices) {
            const objElementSelectionne = lListeServices
              .getListeElementsSelection()
              .getPremierElement();
            if (
              !!objElementSelectionne &&
              objElementSelectionne.estService === true &&
              aInstance.droits.creerSousService === true
            ) {
              return false;
            }
          }
          return true;
        },
      },
    });
  }
  _recupererDonnees() {
    const lPeriode = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Periode,
    );
    new ObjetRequeteListeServices(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete(GEtatUtilisateur.getUtilisateur(), null, lPeriode);
  }
  actionSurRecupererDonnees(aListeServices) {
    this.listeServices = aListeServices;
    if (this.listeServices) {
      this.listeServices.parcourir((aService) => {
        if (aService.services && aService.services.count() > 0) {
          aService.services.parcourir((aSousService) => {
            aSousService.pere = aService;
          });
          aService.estUnDeploiement = true;
          aService.estDeploye = true;
        }
      });
    }
    const lOptionsListe = {
      avecCreerSousServices: this.droits.creerSousService,
      callbackCreerSousService: _callbackCreerSousService.bind(this),
      callbackSupprimerSousService: _callbackSupprimerSousService.bind(this),
      callbackCreerDevoirDNL: _callbackCreerDevoirDNL.bind(this),
      avecEdition: this.droits.modifierCoefGeneral,
      avecGestionNotation: this.droits.avecGestionNotation,
    };
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_ServicesProfesseur(this.listeServices, lOptionsListe),
    );
  }
  _supprimerSousService(aSousService, aParametres) {
    const lThis = this;
    const lAncienEtatSousService = aSousService.Etat;
    aSousService.setEtat(EGenreEtat.Suppression);
    new ObjetRequeteSaisieSousServices(
      this,
      (aJSONRapportSaisie, aJSONReponse) => {
        if (
          aJSONReponse &&
          (aJSONReponse.messageConfirmation || aJSONReponse.messageInformation)
        ) {
          aSousService.setEtat(lAncienEtatSousService);
          if (!!aJSONReponse.messageConfirmation) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: aJSONReponse.messageConfirmation,
              callback: function (aGenreAction) {
                if (aGenreAction === EGenreAction.Valider) {
                  lThis._supprimerSousService(aSousService, {
                    confirmation: true,
                  });
                }
              },
            });
          } else {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Information,
              message: aJSONReponse.messageInformation,
            });
          }
        } else {
          lThis._recupererDonnees();
        }
      },
    ).lancerRequete(Object.assign({ service: aSousService }, aParametres));
  }
}
function _initFenetreSaisieSousService(aInstance) {
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur(
      "servicesProfesseur.CreerSousService.TitreFenetre",
    ),
    listeBoutons: [GTraductions.getValeur("Fermer")],
    largeur: 400,
    hauteur: 470,
  });
}
function _initTripleCombo(aInstance) {
  aInstance.setParametres([EGenreRessource.Periode]);
}
function _initialiserListe(aInstance) {
  const lAvecGestionNotation = this.droits.avecGestionNotation;
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.matiere,
    taille: 300,
    titre: GTraductions.getValeur("servicesProfesseur.Matiere"),
  });
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.classe,
    taille: 100,
    titre: GTraductions.getValeur("servicesProfesseur.Classe"),
  });
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.professeur,
    taille: 150,
    titre: GTraductions.getValeur("servicesProfesseur.Professeur"),
  });
  if (lAvecGestionNotation) {
    lColonnes.push({
      id: DonneesListe_ServicesProfesseur.colonnes.facultatif,
      taille: 50,
      titre: GTraductions.getValeur("servicesProfesseur.Facultatif"),
      hint: GTraductions.getValeur("servicesProfesseur.HintFacultatif"),
    });
  }
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.modeDEvaluation,
    taille: 80,
    titre: GTraductions.getValeur("servicesProfesseur.ModeDEvaluation"),
    hint: GTraductions.getValeur("servicesProfesseur.HintModeDEvaluation"),
  });
  if (lAvecGestionNotation) {
    lColonnes.push({
      id: DonneesListe_ServicesProfesseur.colonnes.nbDevoirs,
      taille: 50,
      titre: GTraductions.getValeur("servicesProfesseur.NbDevoirs"),
      hint: GTraductions.getValeur("servicesProfesseur.HintNbDevoirs"),
    });
  }
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.nbEvaluations,
    taille: 50,
    titre: GTraductions.getValeur("servicesProfesseur.NbEvaluations"),
    hint: GTraductions.getValeur("servicesProfesseur.HintNbEvaluations"),
  });
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.volume,
    taille: 100,
    titre: GTraductions.getValeur("servicesProfesseur.Volume"),
    hint: GTraductions.getValeur("servicesProfesseur.HintVolume"),
  });
  if (lAvecGestionNotation) {
    lColonnes.push({
      id: DonneesListe_ServicesProfesseur.colonnes.coefficient,
      taille: 50,
      titre: {
        libelleHtml:
          '<span ie-html="getTitreColonneCoefficient" ie-hint="geHintColonneCoeff"></span>',
        controleur: {
          getTitreColonneCoefficient() {
            let lTitreColonne = "";
            const lPeriode = GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Periode,
            );
            if (
              lPeriode &&
              lPeriode.existeNumero() &&
              !GParametres.estPeriodeOfficielle(lPeriode.getNumero())
            ) {
              lTitreColonne =
                GTraductions.getValeur(
                  "servicesProfesseur.CoefficientPeriodeNonOff",
                ) +
                " " +
                lPeriode.getLibelle();
            } else {
              lTitreColonne = GTraductions.getValeur(
                "servicesProfesseur.CoefficientPeriodeOff",
              );
            }
            return lTitreColonne;
          },
          geHintColonneCoeff() {
            let lHintColonne = "";
            const lPeriode = GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Periode,
            );
            if (
              lPeriode &&
              lPeriode.existeNumero() &&
              !GParametres.estPeriodeOfficielle(lPeriode.getNumero())
            ) {
              lHintColonne = GTraductions.getValeur(
                "servicesProfesseur.HintCoefficientPeriodeNonOff",
                [lPeriode.getLibelle()],
              );
            } else {
              lHintColonne = GTraductions.getValeur(
                "servicesProfesseur.HintCoefficientPeriodeOff",
              );
            }
            return lHintColonne;
          },
        },
      },
    });
  }
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.periodes,
    taille: 150,
    titre: GTraductions.getValeur("servicesProfesseur.Periodes"),
  });
  lColonnes.push({
    id: DonneesListe_ServicesProfesseur.colonnes.programmesBO,
    taille: 60,
    titre: {
      libelleHtml: '<i class="icon_academie i-medium" role="presentation"></i>',
      title: GTraductions.getValeur("servicesProfesseur.HintProgrammesBO"),
    },
  });
  if (this.droits.avecColonneDNL) {
    lColonnes.push({
      id: DonneesListe_ServicesProfesseur.colonnes.DNL,
      taille: 50,
      titre: GTraductions.getValeur("servicesProfesseur.DNL"),
      hint: GTraductions.getValeur("servicesProfesseur.HintDNL"),
    });
  }
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    scrollHorizontal: true,
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
  });
  GEtatUtilisateur.setTriListe({
    liste: aInstance,
    tri: DonneesListe_ServicesProfesseur.colonnes.matiere,
  });
}
function _eventSurDernierMenuDeroulant() {
  this._recupererDonnees();
}
function _evenementListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      this.$refreshSelf();
      break;
    case EGenreEvenementListe.Suppression:
      this._supprimerSousService(aParametres.article);
      break;
    case EGenreEvenementListe.ApresEdition:
      new ObjetRequeteSaisieSousServices(
        this,
        this._recupererDonnees,
      ).lancerRequete({
        service: aParametres.article,
        periode: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Periode,
        ),
      });
      break;
    case EGenreEvenementListe.SelectionDblClick:
      if (
        !!aParametres.article.liensProgrammesBO &&
        aParametres.article.liensProgrammesBO.count() > 0
      ) {
        const lProgrammeBO = aParametres.article.liensProgrammesBO.get(0);
        if (!!lProgrammeBO) {
          new ObjetRequeteProgrammesBO(
            this,
            _surRecupererProgrammeBO.bind(this, lProgrammeBO),
          ).lancerRequete(lProgrammeBO);
        }
      }
      break;
  }
}
function _surRecupererProgrammeBO(
  aProgrammeBO,
  aJSONListeProgrammes,
  aJSONProgramme,
) {
  if (!!aJSONProgramme) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
      pere: this,
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: aProgrammeBO.titre,
          largeur: 700,
          hauteurMaxContenu: 400,
          listeBoutons: [GTraductions.getValeur("Fermer")],
          avecScroll: true,
        });
      },
    });
    lFenetre.afficher(aJSONProgramme);
  }
}
function _eventFenetreSaisieSousService(aParametres) {
  if (aParametres.rafraichissementNecessaire) {
    this._recupererDonnees();
  }
}
function _callbackCreerSousService(aService) {
  this.getInstance(this.identFenetre_SaisieSousService).requeteDetailService(
    aService,
  );
}
function _callbackSupprimerSousService(aSousService) {
  this._supprimerSousService(aSousService);
}
function _callbackCreerDevoirDNL(aService) {
  new ObjetRequeteCreationDevoirDNL(this, (aJSON) => {
    if (!!aJSON && !!aJSON.periodeDNL) {
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Periode,
        aJSON.periodeDNL,
      );
      Invocateur.evenement(
        ObjetInvocateur.events.navigationOnglet,
        EGenreOnglet.ListeServices,
      );
    }
  }).lancerRequete({ service: aService });
}
module.exports = InterfaceServicesProfesseur;

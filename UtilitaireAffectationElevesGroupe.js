const { TypeDroits } = require("ObjetDroitsPN.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetFenetre_ChoixDateEleveGAEV = require("ObjetFenetre_ChoixDateEleveGAEV.js");
const ObjetFenetre_ChoixEleveGAEV = require("ObjetFenetre_ChoixEleveGAEV.js");
const ObjetFenetre_ChoixEleveNonGAEV = require("ObjetFenetre_ChoixEleveNonGAEV.js");
const ObjetFenetre_ChoixSemainesEleveGAEV = require("ObjetFenetre_ChoixSemainesEleveGAEV.js");
const ObjetFenetre_SortieEleveGroupe = require("ObjetFenetre_SortieEleveGroupe.js");
const ObjetRequeteSaisieElevesGAEV = require("ObjetRequeteSaisieElevesGAEV.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const EGenreCreationListeEleves = { choixEleves: 0, choisSemaines: 1 };
class TUtilitaireAffectationElevesGroupe {
  constructor(aInstance) {
    this.instance = aInstance;
  }
  autorisationEditionGroupeGAEV(aGroupe, aEstCoursGAEV) {
    return (
      ((aGroupe && aGroupe.estGAEV) || aEstCoursGAEV) &&
      GApplication.droits.get(
        TypeDroits.eleves.avecAffectationElevesGroupesGAEV,
      )
    );
  }
  autorisationEditionGroupeNonGAEV(aGroupe) {
    return (
      aGroupe &&
      !aGroupe.estGAEV &&
      GApplication.droits.get(
        TypeDroits.eleves.avecAffectationElevesGroupesNonGAEV,
      )
    );
  }
  ajoutEleveAuGroupe(aParam) {
    let lParam = $.extend(
      { instance: null, cours: null, domaine: null, callbackSaisie: null },
      aParam,
    );
    if (
      this.autorisationEditionGroupeGAEV(
        lParam.groupe,
        lParam.cours ? lParam.cours.estGAEV : false,
      )
    ) {
      ObjetMenuContextuel.afficher({
        pere: lParam.instance,
        initCommandes: function (aInstance) {
          aInstance.addCommande(
            EGenreCreationListeEleves.choixEleves,
            GTraductions.getValeur("ChoixEleveGAEV.nouveau"),
          );
          aInstance.addCommande(
            EGenreCreationListeEleves.choixSemaines,
            GTraductions.getValeur("ChoixEleveGAEV.AffecterLesEleves"),
          );
        },
        evenement: _evenementSurMenuContextuelCreationListeEleves.bind(
          this,
          lParam,
        ),
      });
      return;
    }
    if (!this.autorisationEditionGroupeNonGAEV(lParam.groupe)) {
      return;
    }
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ChoixEleveNonGAEV, {
      pere: aParam.instance,
      evenement: function (aValider, aListeEleves) {
        if (aValider) {
          aListeEleves.setSerialisateurJSON({ ignorerEtatsElements: true });
          new ObjetRequeteSaisieElevesGAEV(
            aParam.instance,
            _surReponseRequeteSaisieElevesGAEV.bind(this, aParam),
          ).lancerRequete({
            domaine: aParam.domaine,
            groupe: aParam.groupe,
            listeEleves: aListeEleves,
          });
        }
      },
    }).setDonnees(aParam.groupe, aParam.domaine);
  }
  surSuppressionEleve(aParam) {
    let lParam = $.extend(
      {
        instance: null,
        cours: null,
        groupe: null,
        domaine: null,
        eleve: null,
        callbackSaisie: null,
      },
      aParam,
    );
    if (this.autorisationEditionGroupeNonGAEV(lParam.groupe)) {
      if (
        lParam.eleve.historiqueGroupes &&
        lParam.eleve.historiqueGroupes.count() > 1
      ) {
        this.ouvrirFenetreHistoriqueChangementsDEleve(
          lParam.instance,
          lParam.eleve,
          lParam.callbackSaisie,
        );
        return;
      }
      ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SortieEleveGroupe, {
        pere: lParam.instance,
        evenement: function (aValider, aSurAnneeComplete, aDate) {
          if (aValider) {
            const lListeEleves = new ObjetListeElements();
            lListeEleves.addElement(lParam.eleve);
            lParam.eleve.setEtat(EGenreEtat.Suppression);
            lListeEleves.setSerialisateurJSON({
              methodeSerialisation: function (aElement, aJSON) {
                if (aSurAnneeComplete) {
                  aJSON.surAnneeComplete = aSurAnneeComplete;
                } else {
                  aJSON.dateSortie = aDate;
                }
              },
            });
            new ObjetRequeteSaisieElevesGAEV(
              lParam.instance,
              _surReponseRequeteSaisieElevesGAEV.bind(this, lParam),
            ).lancerRequete({
              cours: lParam.cours,
              domaine: lParam.domaine,
              groupe: lParam.groupe,
              listeEleves: lListeEleves,
            });
          }
        },
      }).setDonnees(lParam);
    } else if (
      this.autorisationEditionGroupeGAEV(
        lParam.groupe,
        lParam.cours ? lParam.cours.estGAEV : false,
      )
    ) {
      const lListeEleves = new ObjetListeElements();
      lListeEleves.addElement(lParam.eleve);
      lParam.eleve.setEtat(EGenreEtat.Suppression);
      _ouvrirFenetreChoixDateEleveGAEV(aParam, lListeEleves);
    } else {
    }
  }
  getOptionsListe(aGroupe, aEstCoursGEAV) {
    if (
      this.autorisationEditionGroupeGAEV(aGroupe, aEstCoursGEAV) ||
      this.autorisationEditionGroupeNonGAEV(aGroupe)
    ) {
      return {
        listeCreations: 0,
        avecLigneCreation: true,
        titreCreation: this.autorisationEditionGroupeGAEV(
          aGroupe,
          aEstCoursGEAV,
        )
          ? GTraductions.getValeur("ChoixEleveGAEV.nouveau")
          : GTraductions.getValeur("liste.nouveau"),
        AvecSuppression: true,
      };
    }
    return {
      listeCreations: null,
      avecLigneCreation: false,
      AvecSuppression: false,
    };
  }
  saisieDateEleve(aCallback, aEleve, aSurEntree, aGroupe, aParametresSaisie) {
    let lListe = new ObjetListeElements().addElement(aEleve);
    aEleve.setEtat(EGenreEtat.Modification);
    lListe.setSerialisateurJSON({
      ignorerEtatsElements: false,
      methodeSerialisation: function (aElement, aJSON) {
        aJSON.modifierDates = true;
        aJSON.dateEntree = aSurEntree ? aElement._saisieEntree : undefined;
        aJSON.dateSortie = !aSurEntree ? aElement._saisieSortie : undefined;
        aJSON.borneEntree =
          aParametresSaisie && aParametresSaisie.dateEntree
            ? aParametresSaisie.dateEntree
            : undefined;
        aJSON.borneSortie =
          aParametresSaisie && aParametresSaisie.dateSortie
            ? aParametresSaisie.dateSortie
            : undefined;
      },
    });
    new ObjetRequeteSaisieElevesGAEV(this, () => {
      aCallback();
    }).lancerRequete({
      modifierDates: true,
      groupe: aGroupe
        ? aGroupe
        : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      listeEleves: lListe,
    });
  }
  ouvrirFenetreHistoriqueChangementsDEleve(aInstance, aEleve, aCallback) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_HistoriqueChangementsGroupes,
      { pere: aInstance, evenement: null },
    );
    lFenetre.setDonnees({
      listeGroupes: aEleve.historiqueGroupes,
      eleve: aEleve,
      callbackSaisieDate: function (
        aGroupe,
        aSurEntree,
        aDateEntree,
        aDateSortie,
      ) {
        aEleve._saisieEntree = aGroupe._saisieEntree;
        aEleve._saisieSortie = aGroupe._saisieSortie;
        this.saisieDateEleve(aCallback, aEleve, aSurEntree, aGroupe, {
          dateEntree: aDateEntree,
          dateSortie: aDateSortie,
        });
      }.bind(this),
    });
  }
  static surEditionDateListe(aSurEntree, aDate, aElementBorne, aElement) {
    if (aSurEntree) {
      if (
        aElementBorne.borneEntree.dateMessageSup &&
        aDate > aElementBorne.borneEntree.dateMessageSup &&
        !GDate.estJourEgal(aDate, aElementBorne.borneEntree.dateMessageSup) &&
        aElementBorne.borneEntree.messageSup
      ) {
        return aElementBorne.borneEntree.messageSup;
      }
      if (
        aElementBorne.borneEntree.dateMessageInf &&
        aDate < aElementBorne.borneEntree.dateMessageInf &&
        !GDate.estJourEgal(aDate, aElementBorne.borneEntree.dateMessageInf) &&
        aElementBorne.borneEntree.messageInf
      ) {
        return aElementBorne.borneEntree.messageInf;
      }
      aElement._saisieEntree = aDate;
    } else {
      if (
        aElementBorne.borneSortie.dateMessageInf &&
        aDate < aElementBorne.borneSortie.dateMessageInf &&
        !GDate.estJourEgal(aDate, aElementBorne.borneSortie.dateMessageInf) &&
        aElementBorne.borneSortie.messageInf
      ) {
        return aElementBorne.borneSortie.messageInf;
      }
      if (
        aElementBorne.borneSortie.dateMessageSup &&
        aDate > aElementBorne.borneSortie.dateMessageSup &&
        !GDate.estJourEgal(aDate, aElementBorne.borneSortie.dateMessageSup) &&
        aElementBorne.borneSortie.messageSup
      ) {
        return aElementBorne.borneSortie.messageSup;
      }
      aElement._saisieSortie = aDate;
    }
  }
  static initialiserDateListe(aInstance, aSurEntree, aElement) {
    aInstance.setParametres(
      GParametres.PremierLundi,
      aSurEntree ? GParametres.PremiereDate : _getDateEleve(aElement, true),
      aSurEntree ? _getDateEleve(aElement, false) : GParametres.DerniereDate,
    );
  }
  static setDonneesDateListe(aInstance, aSurEntree, aElement) {
    aInstance.setDonnees(_getDateEleve(aElement, aSurEntree));
  }
}
function _surReponseRequeteSaisieElevesGAEV(aParam) {
  aParam.callbackSaisie.call(aParam.instance);
}
function _saisieElevesGAEV(aParam, aListeElevesGAEV, aDomaine) {
  new ObjetRequeteSaisieElevesGAEV(
    aParam.instance,
    _surReponseRequeteSaisieElevesGAEV.bind(aParam.instance, aParam),
  ).lancerRequete({
    cours: aParam.cours,
    groupe: aParam.groupe,
    domaine: aDomaine,
    listeEleves: aListeElevesGAEV,
  });
}
function _ouvrirFenetreChoixDateEleveGAEV(aParam, aListeElevesGAEV) {
  let lEstSuppressionEleve = true;
  aListeElevesGAEV.parcourir((aEleve) => {
    if (
      aEleve.getEtat() === EGenreEtat.Modification ||
      aEleve.getEtat() === EGenreEtat.Creation
    ) {
      lEstSuppressionEleve = false;
      return false;
    }
  });
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ChoixDateEleveGAEV, {
    pere: aParam.instance,
    evenement: function (aGenreBouton, aDomaine) {
      if (aGenreBouton === 1) {
        _saisieElevesGAEV(aParam, aListeElevesGAEV, aDomaine);
      }
    },
  }).setDonnees(aParam.domaine, lEstSuppressionEleve);
}
function _evenementSurMenuContextuelCreationListeEleves(aParam, aLigne) {
  switch (aLigne.getNumero()) {
    case EGenreCreationListeEleves.choixEleves:
      ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_ChoixEleveGAEV,
        {
          pere: aParam.instance,
          evenement: function (aGenreBouton, aListeElevesGAEV) {
            if (aGenreBouton === 1) {
              _ouvrirFenetreChoixDateEleveGAEV(aParam, aListeElevesGAEV);
            }
          },
        },
        {
          titre: GTraductions.getValeur("ChoixEleveGAEV.titre"),
          largeur: 500,
          hauteur: 600,
          listeBoutons: [
            GTraductions.getValeur("Annuler"),
            GTraductions.getValeur("Valider"),
          ],
        },
      ).setDonnees(aParam.cours, aParam.groupe, aParam.domaine);
      break;
    case EGenreCreationListeEleves.choixSemaines: {
      const lFenetre = ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_ChoixSemainesEleveGAEV,
        {
          pere: aParam.instance,
          evenement: function (aGenreBouton, aNumeroSemaine) {
            if (aGenreBouton === 1) {
              new ObjetRequeteSaisieElevesGAEV(
                aParam.instance,
                _surReponseRequeteSaisieElevesGAEV.bind(this, aParam),
              ).lancerRequete({
                cours: aParam.cours,
                groupe: aParam.groupe,
                domaine: aParam.domaine,
                numeroSemaineSource: aNumeroSemaine,
              });
            }
          },
        },
      );
      lFenetre.afficher();
      break;
    }
  }
}
class DonneesListe_HistoriqueGroupe extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
  }
  avecSuppression() {
    return false;
  }
  avecEtatSaisie() {
    return false;
  }
  avecEdition(aParams) {
    return (
      aParams.article &&
      (aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree ||
        aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.sortie)
    );
  }
  getMessageEditionImpossible(aParams, aErreur) {
    if (MethodesObjet.isString(aErreur)) {
      return aErreur;
    }
    return super.getMessageEditionImpossible(aParams, aErreur);
  }
  avecEvenementApresEdition() {
    return true;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_HistoriqueGroupe.colonnes.nom:
        return aParams.article.getLibelle();
      case DonneesListe_HistoriqueGroupe.colonnes.entree:
        return aParams.article.entree;
      case DonneesListe_HistoriqueGroupe.colonnes.sortie:
        return GDate.estJourEgal(
          aParams.article.sortie,
          GParametres.DerniereDate,
        )
          ? null
          : aParams.article.sortie;
      default:
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_HistoriqueGroupe.colonnes.entree:
      case DonneesListe_HistoriqueGroupe.colonnes.sortie:
        return ObjetDonneesListe.ETypeCellule.DateCalendrier;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_HistoriqueGroupe.colonnes.entree:
      case DonneesListe_HistoriqueGroupe.colonnes.sortie: {
        const lResult = TUtilitaireAffectationElevesGroupe.surEditionDateListe(
          aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
          V,
          aParams.article,
          aParams.article,
        );
        if (lResult) {
          return lResult;
        }
        break;
      }
      default:
    }
  }
  getTri() {
    return [
      ObjetTri.init("entree", EGenreTriElement.Decroissant),
      ObjetTri.init("Libelle"),
    ];
  }
  initialiserObjetGraphique(aParams, aInstance) {
    TUtilitaireAffectationElevesGroupe.initialiserDateListe(
      aInstance,
      aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
      aParams.article,
    );
  }
  setDonneesObjetGraphique(aParams, aInstance) {
    TUtilitaireAffectationElevesGroupe.setDonneesDateListe(
      aInstance,
      aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
      aParams.article,
    );
  }
}
DonneesListe_HistoriqueGroupe.colonnes = {
  nom: "nom",
  entree: "entree",
  sortie: "sortie",
};
function _getDateEleve(aEleve, aEstDateEntree) {
  return aEstDateEntree
    ? aEleve.entree
      ? aEleve.entree
      : GParametres.PremiereDate
    : aEleve.sortie
      ? aEleve.sortie
      : GParametres.DerniereDate;
}
class ObjetFenetre_HistoriqueChangementsGroupes extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 320,
      listeBoutons: [GTraductions.getValeur("Fermer")],
      avecTailleSelonContenu: true,
    });
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      function (aParametres) {
        switch (aParametres.genreEvenement) {
          case EGenreEvenementListe.ApresEdition:
            switch (aParametres.idColonne) {
              case DonneesListe_HistoriqueGroupe.colonnes.entree:
                if (
                  aParametres.article._saisieEntree &&
                  !GDate.estJourEgal(
                    aParametres.article._saisieEntree,
                    aParametres.article.entree,
                  )
                ) {
                  this.parametres.callbackSaisieDate(
                    aParametres.article,
                    true,
                    aParametres.article.entree,
                    aParametres.article.sortie,
                  );
                  this.fermer();
                }
                break;
              case DonneesListe_HistoriqueGroupe.colonnes.sortie:
                if (
                  aParametres.article._saisieSortie &&
                  !GDate.estJourEgal(
                    aParametres.article._saisieSortie,
                    aParametres.article.sortie,
                  )
                ) {
                  this.parametres.callbackSaisieDate(
                    aParametres.article,
                    false,
                    aParametres.article.entree,
                    aParametres.article.sortie,
                  );
                  this.fermer();
                }
                break;
              default:
            }
            return;
        }
      },
      (aInstance) => {
        aInstance.setOptionsListe({
          colonnes: [
            {
              id: DonneesListe_HistoriqueGroupe.colonnes.nom,
              titre: GTraductions.getValeur("Nom"),
              taille: "100%",
            },
            {
              id: DonneesListe_HistoriqueGroupe.colonnes.entree,
              titre: GTraductions.getValeur("ListeRessources.Entree"),
              taille: 60,
            },
            {
              id: DonneesListe_HistoriqueGroupe.colonnes.sortie,
              titre: GTraductions.getValeur("ListeRessources.Sortie"),
              taille: 60,
            },
          ],
          hauteurAdapteContenu: true,
          hauteurMaxAdapteContenu: 300,
          AvecSuppression: false,
        });
      },
    );
  }
  setDonnees(aParams) {
    this.parametres = $.extend(
      { listeGroupes: null, eleve: null, callbackSaisieDate: null },
      aParams,
    );
    this.setOptionsFenetre({
      titre:
        this.parametres.eleve.getLibelle() +
        " - " +
        GTraductions.getValeur("ListeRessources.HistoriqueChangements"),
    });
    this.afficher();
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_HistoriqueGroupe(this.parametres.listeGroupes),
    );
    if (this.optionsListe && this.optionsListe.hauteurAdapteContenu) {
      this.positionnerFenetre();
    }
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Table">');
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListe) +
        '" style="height:100%">&nbsp;</div>',
    );
    T.push("</div>");
    return T.join("");
  }
}
module.exports = TUtilitaireAffectationElevesGroupe;

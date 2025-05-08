const { TypeDroits } = require("ObjetDroitsPN.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class DonneesListe_Dispenses extends ObjetDonneesListe {
  constructor(aParams) {
    super(aParams.donnees);
    this._autorisations = aParams.autorisations;
    const lDroitSaisie = GApplication.droits.get(TypeDroits.dispenses.saisie);
    this.setOptions({
      avecSuppression: lDroitSaisie,
      avecEvnt_ApresSuppression: lDroitSaisie,
    });
  }
  getControleur(aDonneesListe, aListe) {
    return $.extend(true, super.getControleur(aDonneesListe, aListe), {
      nodeCertificat: function (aligne) {
        const lArticle = aDonneesListe.Donnees.get(aligne);
        if (lArticle && lArticle.documents) {
          $(this.node).on("click", () => {
            ObjetMenuContextuel.afficher({
              pere: aListe,
              initCommandes: function (aMenu) {
                lArticle.documents.parcourir((aDocument) => {
                  if (aDocument.existe()) {
                    aMenu.add(aDocument.getLibelle(), true, () => {
                      _openDocumentDArticle(aDocument);
                    });
                  }
                });
              },
            });
          });
        }
      },
    });
  }
  getLibelleDraggable(aParams) {
    const lDate =
      GTraductions.getValeur("Du") +
      " " +
      GDate.formatDate(aParams.article.dateDebut, "%JJ/%MM/%AA %hh:%mm") +
      " " +
      GTraductions.getValeur("Au") +
      " " +
      GDate.formatDate(aParams.article.dateFin, "%JJ/%MM/%AA %hh:%mm");
    return GTraductions.getValeur("dispenses.suppressionDispense", [
      aParams.article.eleve.getLibelle(),
      lDate,
    ]);
  }
  getMessageSuppressionConfirmation() {
    return GTraductions.getValeur("dispenses.confirmerSuppression");
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.commentaire:
        return ObjetDonneesListe.ETypeCellule.ZoneTexte;
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
        return ObjetDonneesListe.ETypeCellule.Coche;
      default:
        return ObjetDonneesListe.ETypeCellule.Texte;
    }
  }
  avecSelecFile(aParams) {
    return (
      this._autorisations.saisie &&
      aParams.idColonne === DonneesListe_Dispenses.colonnes.fichierJoint &&
      aParams.article &&
      (!aParams.article.documents ||
        aParams.article.documents.getNbrElementsExistes() === 0) &&
      !GApplication.droits.get(TypeDroits.estEnConsultation)
    );
  }
  getOptionsSelecFile() {
    return {
      maxSize: GApplication.droits.get(
        TypeDroits.tailleMaxDocJointEtablissement,
      ),
    };
  }
  evenementSurSelecFile(aParams, aParamsInput) {
    const lListe = new ObjetListeElements();
    lListe.addElement(aParamsInput.eltFichier);
    this.options.saisie(
      {
        genreSaisie: DonneesListe_Dispenses.genreAction.AjouterDocument,
        article: aParams.article,
        Libelle: aParamsInput.eltFichier.getLibelle(),
        idFichier: aParamsInput.eltFichier.idFichier,
      },
      null,
      null,
      lListe,
    );
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.eleve:
        return aParams.article.eleve.getLibelle();
      case DonneesListe_Dispenses.colonnes.classe:
        return aParams.article.classe.getLibelle();
      case DonneesListe_Dispenses.colonnes.matiere:
        return aParams.article.matiere.getLibelle();
      case DonneesListe_Dispenses.colonnes.date:
        return (
          GTraductions.getValeur("Du") +
          " " +
          GDate.formatDate(aParams.article.dateDebut, "%JJ/%MM/%AA %hh:%mm") +
          " " +
          GTraductions.getValeur("Au") +
          " " +
          GDate.formatDate(aParams.article.dateFin, "%JJ/%MM/%AA %hh:%mm")
        );
      case DonneesListe_Dispenses.colonnes.presenceObligatoire:
        return aParams.article.presenceOblig
          ? GTraductions.getValeur("Oui")
          : GTraductions.getValeur("Non");
      case DonneesListe_Dispenses.colonnes.heuresPerdues:
        return aParams.article.presenceOblig
          ? "-"
          : aParams.article.heuresPerduesTotales;
      case DonneesListe_Dispenses.colonnes.commentaire:
        return aParams.article.commentaire;
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        if (
          !!aParams.article.documents &&
          aParams.article.documents.getNbrElementsExistes() > 0
        ) {
          const lListeDocs = aParams.article.documents.getListeElements(
            (aElement) => {
              return aElement.existe();
            },
          );
          if (lListeDocs.count() === 1) {
            return GChaine.composerUrlLienExterne({
              libelleEcran:
                '<div class="Image_Trombone" style="margin-left:auto; margin-right:auto;"></div>',
              documentJoint: lListeDocs.get(0),
              genreRessource: EGenreRessource.DocJointEleve,
              afficherIconeDocument: false,
            });
          }
          return (
            '<div class="Image_Trombone AvecMain" style="margin-left:auto; margin-right:auto;"' +
            GHtml.composeAttr("ie-node", "nodeCertificat", aParams.ligne) +
            "></div>"
          );
        }
        return "";
      case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
        if (
          !!aParams.article.documents &&
          aParams.article.documents.getNbrElementsExistes() > 0
        ) {
          return aParams.article.publierPJFeuilleDAppel;
        }
        return false;
      default:
        return false;
    }
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        return aParams.article.documents &&
          aParams.article.documents.count() > 0
          ? aParams.article.documents.trier().getTableauLibelles().join("\n")
          : "";
      case DonneesListe_Dispenses.colonnes.commentaire:
        return GTraductions.getValeur(
          "AbsenceVS.dispense.commentaireDeLaDispense",
        );
    }
    return "";
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.matiere:
        return false;
      case DonneesListe_Dispenses.colonnes.date:
        return false;
      case DonneesListe_Dispenses.colonnes.presenceObligatoire:
        return this._autorisations.saisie;
      case DonneesListe_Dispenses.colonnes.heuresPerdues:
        return false;
      case DonneesListe_Dispenses.colonnes.commentaire:
        return this._autorisations.saisie;
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        return this.avecSelecFile(aParams);
      case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
        return (
          this._autorisations.saisie &&
          aParams.idColonne ===
            DonneesListe_Dispenses.colonnes.publierPJFeuilleDA &&
          aParams.article &&
          !!aParams.article.documents &&
          aParams.article.documents.getNbrElementsExistes() > 0 &&
          !GApplication.droits.get(TypeDroits.estEnConsultation)
        );
    }
    return false;
  }
  autoriserChaineVideSurEdition(aParams) {
    return aParams.idColonne === DonneesListe_Dispenses.colonnes.commentaire;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.presenceObligatoire:
        aParams.article.presenceOblig = !aParams.article.presenceOblig;
        break;
      case DonneesListe_Dispenses.colonnes.commentaire:
        aParams.article.commentaire = V;
        break;
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        break;
      case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
        aParams.article.publierPJFeuilleDAppel = V;
        break;
    }
  }
  avecEvenementEdition(aParams) {
    return (
      this._autorisations.saisie &&
      aParams.idColonne === DonneesListe_Dispenses.colonnes.presenceObligatoire
    );
  }
  getClass(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_Dispenses.colonnes.heuresPerdues:
        if (aParams.article.presenceObligatoire) {
          lClasses.push("AlignementMilieu");
        }
        break;
      case DonneesListe_Dispenses.colonnes.fichierJoint:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join("");
  }
  getCouleurCellule(aParams) {
    if (
      this._autorisations.saisie &&
      aParams.idColonne === DonneesListe_Dispenses.colonnes.fichierJoint &&
      !GApplication.droits.get(TypeDroits.estEnConsultation)
    ) {
      return ObjetDonneesListe.ECouleurCellule.Blanc;
    }
  }
  getTri(aColonneDeTri, aGenreTri) {
    function _triDate(aGenreTri) {
      return [
        ObjetTri.init("dateDebut", aGenreTri),
        ObjetTri.init("dateFin", aGenreTri),
      ];
    }
    let lTris = [];
    if (aColonneDeTri === null || aColonneDeTri === undefined) {
      return lTris;
    }
    const lTriDate = _triDate(aGenreTri);
    if (this.getId(aColonneDeTri) === DonneesListe_Dispenses.colonnes.date) {
      lTris = lTriDate;
    } else {
      lTris = [
        ObjetTri.init(
          this.getValeurPourTri.bind(this, aColonneDeTri),
          aGenreTri,
        ),
      ];
    }
    let lTriDefaut = [
      ObjetTri.init(
        this.getValeurPourTri.bind(
          this,
          this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.eleve),
        ),
      ),
      ObjetTri.init(
        this.getValeurPourTri.bind(
          this,
          this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.classe),
        ),
      ),
      ObjetTri.init(
        this.getValeurPourTri.bind(
          this,
          this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.matiere),
        ),
      ),
    ];
    lTriDefaut = lTriDefaut.concat(lTriDate);
    return lTris.concat(lTriDefaut);
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (aParametres.surFondListe) {
      return;
    }
    let lAvecCommandeActive = false;
    if (
      aParametres.article &&
      this._autorisations.saisie &&
      aParametres.listeSelection &&
      aParametres.listeSelection.count() === 1
    ) {
      const lAvecDocuments =
          aParametres.article.documents &&
          aParametres.article.documents.getNbrElementsExistes() > 0,
        lEstConsultation = GApplication.droits.get(
          TypeDroits.estEnConsultation,
        );
      if (lAvecDocuments) {
        if (!lEstConsultation) {
          aParametres.menuContextuel.addSelecFile(
            GTraductions.getValeur("dispenses.menu.addDocument"),
            {
              getOptionsSelecFile: function () {
                return {
                  maxSize: GApplication.droits.get(
                    TypeDroits.tailleMaxDocJointEtablissement,
                  ),
                };
              }.bind(this),
              addFiles: this.evenementSurSelecFile.bind(this, aParametres),
            },
          );
        }
        _addSousMenuListe({
          menu: aParametres.menuContextuel,
          libelle: GTraductions.getValeur("dispenses.menu.consulter"),
          liste: aParametres.article.documents,
          callback: function (aDocument) {
            _openDocumentDArticle(aDocument);
          },
          pourConsultation: true,
        });
        if (!lEstConsultation && !aParametres.nonEditable) {
          _addSousMenuListe({
            menu: aParametres.menuContextuel,
            libelle: GTraductions.getValeur("dispenses.menu.supprimer"),
            liste: aParametres.article.documents,
            callback: function (aDocument) {
              GApplication.getMessage()
                .afficher({
                  type: EGenreBoiteMessage.Confirmation,
                  message: GChaine.format(
                    GTraductions.getValeur("selecteurPJ.msgConfirmPJ"),
                    [aDocument.getLibelle()],
                  ),
                })
                .then((aGenreAction) => {
                  if (aGenreAction === EGenreAction.Valider) {
                    this.options.saisie({
                      genreSaisie:
                        DonneesListe_Dispenses.genreAction.SupprimerDocument,
                      article: aParametres.article,
                      document: aDocument,
                    });
                  }
                });
            }.bind(this),
          });
        }
        lAvecCommandeActive = true;
      }
    }
    return lAvecCommandeActive;
  }
}
DonneesListe_Dispenses.colonnes = {
  eleve: "dispensesEleve",
  classe: "dispensesClasse",
  matiere: "dispensesMatiere",
  date: "dispensesDate ",
  presenceObligatoire: "dispensesPresenceObligatoire",
  heuresPerdues: "dispensesHeuresPerdues",
  commentaire: "dispensesCommentaire",
  fichierJoint: "dispensesFichierJoint",
  publierPJFeuilleDA: "dispensesPublierPJFeuilleDA",
};
DonneesListe_Dispenses.genreAction = {
  AjouterDocument: 0,
  SupprimerDocument: 1,
};
function _openDocumentDArticle(aDocument) {
  window.open(
    GChaine.creerUrlBruteLienExterne(aDocument, {
      genreRessource: EGenreRessource.DocJointEleve,
    }),
  );
}
function _addSousMenuListe(aParam) {
  if (!aParam.liste || !aParam.liste.count || aParam.liste.count() === 0) {
    return false;
  }
  aParam.menu.addSousMenu(aParam.libelle, (aSousMenu) => {
    aParam.liste.parcourir((aElement) => {
      if (
        aElement.existe() &&
        (!aParam.pourConsultation || aElement.getEtat() !== EGenreEtat.Creation)
      ) {
        aSousMenu.add(aElement.getLibelle(), true, () => {
          aParam.callback(aElement);
        });
      }
    });
  });
  return true;
}
module.exports = { DonneesListe_Dispenses };

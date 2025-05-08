const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { Identite } = require("ObjetIdentite.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GDate } = require("ObjetDate.js");
const {
  ObjetRequeteSaisieFicheEleve,
} = require("ObjetRequeteSaisieFicheEleve.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { ObjetCelluleBouton } = require("ObjetCelluleBouton.js");
const { EGenreBoutonCellule } = require("ObjetCelluleBouton.js");
const { EEvent } = require("Enumere_Event.js");
const {
  ObjetFenetre_TypeProjetAccompagnement,
} = require("ObjetFenetre_TypeProjetAccompagnement.js");
const {
  ObjetFenetre_MotifProjetAccompagnement,
} = require("ObjetFenetre_MotifProjetAccompagnement.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetFenetre_ProjetAccompagnement extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 430,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      avecComposeBasInFooter: true,
    });
    this.enModification = false;
    this.ids = { pieceJointe: GUID.getId(), docsJoints: GUID.getId() };
  }
  construireInstances() {
    this.selecDateDebut = Identite.creerInstance(ObjetCelluleDate, {
      pere: this,
      evenement: (aDate, aGenreBouton) => {
        if (aGenreBouton === 0) {
          delete this.projetAccompagnement.debut;
          this.projetAccompagnement.dateDebut = "";
          this.selecDateDebut.initialiser();
        } else {
          this.projetAccompagnement.debut = aDate;
          this.projetAccompagnement.dateDebut = GDate.formatDate(
            aDate,
            "%JJ/%MM/%AAAA",
          );
        }
        _initialiserDate.call(this);
      },
    });
    this.selecDateDebut.setOptionsObjetCelluleDate({
      largeurComposant: IE.estMobile ? 130 : 100,
      formatDate: "%JJ/%MM/%AAAA",
      placeHolder: GTraductions.getValeur("FicheEleve.DateDebut"),
      labelWAI: GTraductions.getValeur("FicheEleve.DateDebut"),
    });
    this.selecDateFin = Identite.creerInstance(ObjetCelluleDate, {
      pere: this,
      evenement: (aDate, aGenreBouton) => {
        if (aGenreBouton === 0) {
          delete this.projetAccompagnement.fin;
          this.projetAccompagnement.dateFin = "";
          this.selecDateFin.initialiser();
        } else {
          this.projetAccompagnement.fin = aDate;
          this.projetAccompagnement.dateFin = GDate.formatDate(
            aDate,
            "%JJ/%MM/%AAAA",
          );
        }
        _initialiserDate.call(this);
      },
    });
    this.selecDateFin.setOptionsObjetCelluleDate({
      largeurComposant: IE.estMobile ? 130 : 100,
      formatDate: "%JJ/%MM/%AAAA",
      placeHolder: GTraductions.getValeur("FicheEleve.DateFin"),
      labelWAI: GTraductions.getValeur("FicheEleve.DateFin"),
    });
    this.identSelecteurPJ = this.add(
      ObjetSelecteurPJ,
      _evntSelecteurPJ.bind(this),
      _initSelecteurPJ.bind(this),
    );
    this.identType = this.add(
      ObjetCelluleBouton,
      _evntType.bind(this),
      _initType.bind(this),
    );
    this.identMotif = this.add(
      ObjetCelluleBouton,
      _evntMotif.bind(this),
      _initMotif.bind(this),
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      inputCommentaire: {
        getValue() {
          return aInstance.projetAccompagnement
            ? aInstance.projetAccompagnement.commentaire
            : "";
        },
        setValue(aValue) {
          aInstance.projetAccompagnement.commentaire = aValue;
        },
      },
      cbConsultableEquipePeda: {
        getValue() {
          return aInstance.projetAccompagnement
            ? aInstance.projetAccompagnement.consultableEquipePeda
            : false;
        },
        setValue(aValue) {
          aInstance.projetAccompagnement.consultableEquipePeda = aValue;
        },
        getDisplay: function () {
          return !GApplication.estPrimaire;
        },
      },
      getNodeSelecDate: function (aEstDateDebut) {
        const lInstanceDate = aEstDateDebut
          ? aInstance.selecDateDebut
          : aInstance.selecDateFin;
        lInstanceDate.initialiser();
        if (this.projetAccompagnement) {
          lInstanceDate.setParametresFenetre(
            GParametres.PremierLundi,
            aEstDateDebut
              ? GParametres.PremiereDate
              : aInstance.projetAccompagnement.debut
                ? aInstance.projetAccompagnement.debut
                : GParametres.PremiereDate,
            aEstDateDebut
              ? aInstance.projetAccompagnement.fin
                ? aInstance.projetAccompagnement.fin
                : GParametres.DerniereDate
              : GParametres.DerniereDate,
            GParametres.JoursOuvres,
            null,
            GParametres.JoursFeries,
            null,
            null,
          );
        }
      },
      btnSupprimer: {
        event: function () {
          if (
            aInstance.enModification &&
            aInstance.donnees &&
            aInstance.projetAccompagnement &&
            aInstance.projetAccompagnement.existeNumero()
          ) {
            GApplication.getMessage()
              .afficher({
                type: EGenreBoiteMessage.Confirmation,
                width: 370,
                message: GTraductions.getValeur(
                  "FicheEleve.msgConfirmerSuppression",
                  [""],
                ),
              })
              .then(
                ((aGenreAction) => {
                  if (aGenreAction === EGenreAction.Valider) {
                    aInstance.projetAccompagnement.setEtat(
                      EGenreEtat.Suppression,
                    );
                    aInstance.surValidation(1);
                  }
                }).bind(aInstance),
              );
          }
        },
        getDisabled: function () {
          return !aInstance.donnees || !aInstance.enModification;
        },
      },
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          if (aBoutonRepeat.element.index === 1) {
            return !(
              aInstance.projetAccompagnement &&
              aInstance.projetAccompagnement.projetIndividuel &&
              aInstance.projetAccompagnement.projetIndividuel.existeNumero()
            );
          }
          return (
            aInstance.optionsFenetre.listeBoutonsInactifs &&
            aInstance.optionsFenetre.listeBoutonsInactifs[
              aBoutonRepeat.element.index
            ] === true
          );
        },
      },
      chipsPJ: {
        event: function () {
          return true;
        },
        eventBtn: function (aIndex) {
          _evntSupprPJ.call(aInstance, aIndex);
        },
      },
    });
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    if (aDonnees.projetAccompagnement) {
      this.enModification = true;
      this.projetAccompagnement = MethodesObjet.dupliquer(
        aDonnees.projetAccompagnement,
      );
      _initialiserDate.call(this);
      this.projetAccompagnement.setEtat(EGenreEtat.Modification);
    } else {
      this.projetAccompagnement = new ObjetElement();
      this.projetAccompagnement.setEtat(EGenreEtat.Creation);
      this.projetAccompagnement.consultableEquipePeda = true;
      this.projetAccompagnement.listeHandicaps = this.donnees.listeMotifs;
    }
    this.getInstance(this.identSelecteurPJ).setDonnees({
      listePJ: this.projetAccompagnement.documents,
      listeTotale: new ObjetListeElements(),
      idContextFocus: this.Nom,
    });
    _actualiserPJ.call(this);
    const lLibelleType =
      this.projetAccompagnement && this.projetAccompagnement.projetIndividuel
        ? this.projetAccompagnement.projetIndividuel.getLibelle()
        : "";
    this.getInstance(this.identType).setLibelle(lLibelleType);
    this.getInstance(this.identType).setActif(true);
    if (this.projetAccompagnement && this.projetAccompagnement.listeHandicaps) {
      this.getInstance(this.identMotif).setLibelle(
        this.projetAccompagnement.listeHandicaps
          .getListeElements((aElement) => {
            return aElement.selectionne;
          })
          .getTableauLibelles()
          .join(", "),
      );
    }
    this.getInstance(this.identMotif).setActif(true);
    this.afficher();
  }
  surValidation(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      const lListeProjetAccompagnement = new ObjetListeElements();
      const lListeFichiers = this.projetAccompagnement.documents;
      lListeProjetAccompagnement.add(this.projetAccompagnement);
      new ObjetRequeteSaisieFicheEleve(this, this.actionSurValidation)
        .addUpload({ listeFichiers: lListeFichiers })
        .lancerRequete({
          listeTypes: this.donnees.listeTypes,
          listeProjets: lListeProjetAccompagnement,
          listeFichiers: lListeFichiers,
          eleve: this.donnees.eleve,
        });
      this.callback.appel(aNumeroBouton, this.projetAccompagnement, {
        listeMotifs: this.donnees.listeMotifs,
        listeTypes: this.donnees.listeTypes,
      });
    }
    this.fermer();
  }
  composeContenu() {
    const T = [];
    T.push(
      `<div class="flex-contain cols">\n              <div class="field-contain">\n                <label class="fix-bloc " style="width: 4.5rem;">${GTraductions.getValeur("FicheEleve.type")} : </label>\n                <div class="on-mobile" id="${this.getNomInstance(this.identType)}"></div>\n              </div>\n              <div class="field-contain">\n                <label class="fix-bloc " style="width: 4.5rem;">${GTraductions.getValeur("FicheEleve.motifs")} : </label>\n                <div class="on-mobile" id="${this.getNomInstance(this.identMotif)}"></div>\n              </div>\n              <div class="field-contain">\n                <label class="fix-bloc  only-mobile m-bottom-l">${GTraductions.getValeur("FicheEleve.commentaire")} : </label>\n                <ie-textareamax ie-model="inputCommentaire" class="round-style txt-comment fluid-bloc full-width" maxlength="1000" ie-compteur="" placeholder="${GTraductions.getValeur("FicheEleve.redigezCommentaire")}"></ie-textareamax>\n              </div>\n              <div class="field-contain label-up p-bottom-l">\n                <div class="pj-global-conteneur no-line" id="${this.getNomInstance(this.identSelecteurPJ)}" title="${GTraductions.getValeur("FicheEleve.ajouterPJ")}"></div>\n                <div id="${this.ids.docsJoints}" class="pj-liste-conteneur m-top"></div>\n              </div>\n              <div class="field-contain periode-contain">\n                <div class="m-top m-right m-bottom">\n                  <label class="only-espace m-top-l ">${GTraductions.getValeur("FicheEleve.DateDebut")}</label>\n                  <div class="m-left-s" id="${this.selecDateDebut.getNom()}" ie-node="getNodeSelecDate(true)"></div>\n                </div>\n                <div class="m-all">\n                  <label class="only-espace m-top-l">${GTraductions.getValeur("FicheEleve.DateFin")}</label>\n                  <div id="${this.selecDateFin.getNom()}" ie-node="getNodeSelecDate(false)"></div>\n                </div>\n              </div>\n              <div class="public-team" ie-display="cbConsultableEquipePeda.getDisplay">\n              <span class="icon-contain only-mobile"><i class="icon_info_sondage_publier i-medium i-as-deco"></i></span>\n                <ie-checkbox ie-model="cbConsultableEquipePeda">${GTraductions.getValeur("FicheEleve.publieEquipePeda")}</ie-checkbox>\n            </div>\n          </div>`,
    );
    return T.join("");
  }
  composeBas() {
    const lHTML = [];
    lHTML.push(
      `<div class="compose-bas">\n                    <ie-btnicon ie-model="btnSupprimer" title="${GTraductions.getValeur("Supprimer")}" class="icon_trash avecFond i-medium"></ie-btnicon>\n                </div>`,
    );
    return lHTML.join("");
  }
}
function _initialiserDate() {
  if (this.projetAccompagnement) {
    if (this.selecDateDebut) {
      this.selecDateDebut.setPremiereDateSaisissable(
        GParametres.PremiereDate,
        true,
      );
      this.selecDateDebut.setOptionsObjetCelluleDate({ avecAucuneDate: true });
      if (this.projetAccompagnement.debut) {
        this.selecDateDebut.setDonnees(this.projetAccompagnement.debut);
      }
      this.selecDateDebut.setParametresFenetre(
        GParametres.PremierLundi,
        GParametres.PremiereDate,
        this.projetAccompagnement.fin
          ? this.projetAccompagnement.fin
          : GParametres.DerniereDate,
        GParametres.JoursOuvres,
        null,
        null,
        true,
        null,
      );
    }
    if (this.selecDateFin) {
      this.selecDateFin.setPremiereDateSaisissable(
        this.projetAccompagnement.debut,
        true,
      );
      this.selecDateFin.setOptionsObjetCelluleDate({ avecAucuneDate: true });
      if (this.projetAccompagnement.fin) {
        this.selecDateFin.setDonnees(this.projetAccompagnement.fin);
      }
      this.selecDateFin.setParametresFenetre(
        GParametres.PremierLundi,
        this.projetAccompagnement.debut
          ? this.projetAccompagnement.debut
          : GParametres.PremiereDate,
        GParametres.DerniereDate,
        GParametres.JoursOuvres,
        null,
        null,
        true,
        null,
      );
    }
  }
}
function _initSelecteurPJ(aInstance) {
  aInstance.setOptions({
    genrePJ: EGenreDocumentJoint.Fichier,
    genreRessourcePJ: EGenreRessource.DocJointEtablissement,
    maxFiles: 0,
    maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
    idLibellePJ: this.ids.pieceJointe,
    avecAjoutExistante: true,
    avecEtatSaisie: false,
    avecBoutonSupp: true,
    ouvrirFenetreChoixTypesAjout: false,
    libelleSelecteur: GTraductions.getValeur("AjouterDesPiecesJointes"),
  });
}
function _actualiserPJ() {
  if (!this.projetAccompagnement.documents) {
    this.projetAccompagnement.documents = new ObjetListeElements();
  }
  const lInstance = this.getInstance(this.identSelecteurPJ);
  lInstance.setDonnees({
    listePJ: this.projetAccompagnement.documents,
    listeTotale: new ObjetListeElements(),
    idContextFocus: this.Nom,
  });
  this.avecSaisie = true;
  if (this.projetAccompagnement.documents.count() > 0) {
    GHtml.setHtml(
      this.ids.docsJoints,
      UtilitaireUrl.construireListeUrls(this.projetAccompagnement.documents, {
        IEModelChips: "chipsPJ",
      }),
      { controleur: this.controleur },
    );
  }
}
function _evntSelecteurPJ() {
  _actualiserPJ.call(this);
}
function _evntSupprPJ(aIndex) {
  if (!!this.projetAccompagnement && this.projetAccompagnement.documents) {
    this.projetAccompagnement.documents
      .get(aIndex)
      .setEtat(EGenreEtat.Suppression);
  }
  _actualiserPJ.call(this);
}
function _initType(aInstance) {
  aInstance.setOptionsObjetCelluleBouton({
    estSaisissable: true,
    avecZoneSaisie: false,
    genreBouton: EGenreBoutonCellule.Points,
    largeur: 180,
    hauteur: 17,
    largeurBouton: 16,
    placeHolder: GTraductions.getValeur("FicheEleve.aucunTypeDeProjet"),
  });
}
function _evntType(aGenreEvent) {
  if (
    (aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
    aGenreEvent === EEvent.SurMouseDown
  ) {
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_TypeProjetAccompagnement, {
      pere: this,
      evenement(aNumeroBouton, aTypeSelectionne, aListeType) {
        if (aNumeroBouton === 1) {
          if (aTypeSelectionne) {
            this.projetAccompagnement.setLibelle(aTypeSelectionne.getLibelle());
            this.projetAccompagnement.projetIndividuel = aTypeSelectionne;
            this.getInstance(this.identType).setLibelle(
              this.projetAccompagnement.projetIndividuel.getLibelle(),
            );
          }
        }
        this.donnees.listeTypes = aListeType;
      },
      initialiser(aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("FicheEleve.typeDeProjet"),
        });
      },
    }).setDonnees(this.donnees.listeTypes, { eleve: this.donnees.eleve });
  }
}
function _initMotif(aInstance) {
  aInstance.setOptionsObjetCelluleBouton({
    estSaisissable: true,
    avecZoneSaisie: false,
    genreBouton: EGenreBoutonCellule.Points,
    largeur: 180,
    hauteur: 17,
    largeurBouton: 16,
    placeHolder: GTraductions.getValeur("FicheEleve.aucunMotifProjet"),
  });
}
function _evntMotif(aGenreEvent) {
  if (
    (aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
    aGenreEvent === EEvent.SurMouseDown
  ) {
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_MotifProjetAccompagnement, {
      pere: this,
      evenement(aNumeroBouton, aMotifSelectionnes, aListeMotifs) {
        if (aNumeroBouton === 1) {
          if (aMotifSelectionnes) {
            this.projetAccompagnement.listeHandicaps = aMotifSelectionnes;
            if (
              this.projetAccompagnement &&
              this.projetAccompagnement.listeHandicaps
            ) {
              this.getInstance(this.identMotif).setLibelle(
                this.projetAccompagnement.listeHandicaps
                  .getListeElements((aElement) => {
                    return aElement.selectionne;
                  })
                  .getTableauLibelles()
                  .join(", "),
              );
            }
          }
          this.donnees.listeMotifs = aListeMotifs;
        }
      },
      initialiser(aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("FicheEleve.motifs"),
        });
      },
    }).setDonnees(this.projetAccompagnement.listeHandicaps);
  }
}
module.exports = { ObjetFenetre_ProjetAccompagnement };

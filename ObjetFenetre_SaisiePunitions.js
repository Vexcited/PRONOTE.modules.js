const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetCelluleMultiSelectionMotif,
} = require("ObjetCelluleMultiSelectionMotif.js");
const { ObjetMoteurPunitions } = require("ObjetMoteurPunitions.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetSelecteurPJCP } = require("ObjetSelecteurPJCP.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
class ObjetFenetre_SaisiePunitions extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idContenuPage = this.Nom + "_contenuPage";
    this.idContenuMessage = this.Nom + "_contenuMessage";
    this.idLibelleDate = this.Nom + "_libelleDate";
    this.idTitreProgrammation = this.Nom + "_programmation";
    this.idLabelMotif = this.Nom + "_labelMotif";
    this.idTextareaDetail = this.Nom + "_textareaDetail";
    this.idTextareaTAF = this.Nom + "_textareaTAF";
    this.moteurPunitions = new ObjetMoteurPunitions(this);
  }
  construireInstances() {
    this.identComboType = this.add(
      ObjetSaisiePN,
      this._evenementComboType,
      _initialiserComboType,
    );
    this.identComboAccomp = this.add(
      ObjetSaisiePN,
      this._evenementComboAccomp,
      _initialiserComboAccomp,
    );
    this.identComboDuree = this.add(
      ObjetSaisiePN,
      this._evenementComboDuree,
      _initialiserComboDuree,
    );
    this.identComboDate = this.add(
      ObjetSaisiePN,
      this._evenementComboDate,
      _initialiserComboDate,
    );
    this.identFenetreCalendrier = this.addFenetre(
      ObjetFenetre_Date,
      this._evenementFenetreCalendrier,
      _initialiserFenetreCalendrier,
    );
    this.identCMS_Motifs = this.add(
      ObjetCelluleMultiSelectionMotif,
      this._evenementChoixMotifs,
      (aInstance) => {
        aInstance.setOptions({ labelledById: this.idLabelMotif });
      },
    );
    this.identSelecteurPJ = this.add(
      ObjetSelecteurPJ,
      _evntSelecteurPJ.bind(this),
      _initSelecteurPJ,
    );
    this.identSelecteurPJTAF = this.add(
      ObjetSelecteurPJ,
      _evntSelecteurPJTAF.bind(this),
      _initSelecteurPJ,
    );
    this.IdPremierElement = this.getInstance(
      this.identComboType,
    ).getPremierElement();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      cbTafPublierDebutSeance: {
        getValue() {
          const lPunition = aInstance.moteurPunitions.punition;
          return lPunition && lPunition.publierTafApresDebutRetenue;
        },
        setValue(aValue) {
          const lPunition = aInstance.moteurPunitions.punition;
          if (lPunition) {
            lPunition.publierTafApresDebutRetenue = aValue;
            lPunition.setEtat(EGenreEtat.Modification);
          }
        },
        getDisplay() {
          const lPunition = aInstance.moteurPunitions.punition;
          return (
            lPunition &&
            lPunition.naturePunition &&
            lPunition.naturePunition.getGenre() ===
              TypeGenrePunition.GP_Retenues
          );
        },
      },
    });
  }
  setDonnees(aParam) {
    this.moteurPunitions.init(aParam);
    this.listePJ = aParam.listePJ;
    this.date = aParam.date;
    this.afficher();
    if (aParam.eleve) {
      this.setOptionsFenetre({
        titre: this.moteurPunitions.getTitre(),
        listeBoutons: this.moteurPunitions.listeBoutons,
      });
      this._actualiserDureeDate();
      GHtml.setDisplay(this.idContenuPage, true);
      GHtml.setDisplay(this.idContenuMessage, false);
      this.getInstance(this.identComboType).setDonnees(
        this.moteurPunitions.listeNature,
        this.moteurPunitions.genreRessource === EGenreRessource.Punition &&
          this.moteurPunitions.punition.naturePunition
          ? this.moteurPunitions.listeNature.getIndiceParNumeroEtGenre(
              this.moteurPunitions.punition.naturePunition.getNumero(),
            )
          : 0,
      );
      this.getInstance(this.identComboAccomp).setDonnees(
        this.moteurPunitions.listeEleves,
        this.moteurPunitions.indiceAccompagnateur,
      );
      this.getInstance(this.identComboType).setActif(
        this.moteurPunitions.avecModifType(),
      );
      this.getInstance(this.identCMS_Motifs).setDonnees(
        this.moteurPunitions.punition.listeMotifs,
      );
      const lListePJ = this.moteurPunitions.punition.documents
        ? this.moteurPunitions.punition.documents
        : new ObjetListeElements();
      this.documents = new ObjetListeElements();
      this.getInstance(this.identSelecteurPJ).setActif(true);
      this.getInstance(this.identSelecteurPJ).setOptions({
        genreRessourcePJ: EGenreRessource.DocJointEleve,
      });
      this.getInstance(this.identSelecteurPJ).setDonnees({
        listePJ: lListePJ,
        listeTotale: this.documents,
        idContextFocus: this.Nom,
      });
      const lListePJTAF = this.moteurPunitions.punition.documentsTAF
        ? this.moteurPunitions.punition.documentsTAF
        : new ObjetListeElements();
      this.getInstance(this.identSelecteurPJTAF).setActif(true);
      this.getInstance(this.identSelecteurPJTAF).setOptions({
        genreRessourcePJ: EGenreRessource.DocJointEleve,
      });
      this.getInstance(this.identSelecteurPJTAF).setDonnees({
        listePJ: lListePJTAF,
        listeTotale: this.documents,
        idContextFocus: this.Nom,
      });
      this.getInstance(this.identComboDuree).setActif(
        this.moteurPunitions.avecModifDuree(),
      );
      $("#" + this.idTitreProgrammation.escapeJQ()).css("display", "none");
    } else {
      GHtml.setDisplay(this._idContenuPage, false);
      GHtml.setDisplay(this.idContenuMessage, true);
    }
  }
  afficher() {
    super.afficher();
  }
  _evenementComboType(aParams) {
    const lPunition = this.moteurPunitions.punition;
    if (!lPunition) {
      return;
    }
    if (
      aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
      aParams.element
    ) {
      lPunition.naturePunition = new ObjetElement(
        aParams.element.Libelle,
        aParams.element.getNumero(),
        aParams.element.getGenre(),
      );
      lPunition.naturePunition.nbJoursDecalagePublicationParDefaut =
        aParams.element.nbJoursDecalagePublicationParDefaut;
      lPunition.naturePunition.dureeParDefaut = aParams.element.dureeParDefaut;
      const lEstEnDevoir = this.moteurPunitions.estPunitionEnDevoir();
      this._actualiserDureeDate();
      if (lEstEnDevoir) {
        delete lPunition.duree;
      } else {
        delete lPunition.date;
      }
    }
  }
  _evenementComboAccomp(aParams) {
    if (this.moteurPunitions.genreRessource === EGenreRessource.Punition) {
      return;
    }
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      if (!this.moteurPunitions.punition.Accompagnateur) {
        this.moteurPunitions.punition.Accompagnateur = new ObjetElement();
      }
      this.moteurPunitions.punition.Accompagnateur.Numero =
        aParams.element.getNumero();
    }
  }
  _evenementComboDuree(aParams) {
    if (!this.moteurPunitions.punition) {
      return;
    }
    const lInstanceCombo = this.getInstance(this.identComboDuree);
    if (
      aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
      lInstanceCombo.estUneInteractionUtilisateur() &&
      !this.moteurPunitions.estPunitionEnDevoir() &&
      !!aParams.element
    ) {
      this.moteurPunitions.punition.duree = aParams.element.duree;
    }
  }
  _evenementComboDate(aParams) {
    if (!this.moteurPunitions.punition) {
      return;
    }
    switch (aParams.genreEvenement) {
      case EGenreEvenementObjetSaisie.deploiement:
        if (this.moteurPunitions.estPunitionEnDevoir()) {
          const lDate =
            this.moteurPunitions.punition.date ||
            this.moteurPunitions.punition.dateProgrammation ||
            this.date;
          this.getInstance(this.identFenetreCalendrier).setDonnees(lDate);
          return false;
        }
        break;
    }
  }
  _evenementFenetreCalendrier(aGenreBouton, aDate) {
    if (aGenreBouton === 1) {
      let lDateCourant = aDate;
      if (!GDate.estUnJourOuvre(lDateCourant)) {
        const lStrDate = !!lDateCourant
          ? GDate.formatDate(lDateCourant, "%JJ/%MM/%AAAA")
          : "";
        GApplication.getMessage().afficher({
          message: GTraductions.getValeur(
            "fenetreSaisiePunition.DatePasUnJoursOuvre",
            [lStrDate],
          ),
        });
        do {
          lDateCourant = GDate.getJourSuivant(lDateCourant, -1);
        } while (!GDate.estUnJourOuvre(lDateCourant));
      }
      this.moteurPunitions.punition.date = lDateCourant;
      this.getInstance(this.identComboDate).setDonnees(
        this.moteurPunitions.getListeDuree(),
        0,
      );
    }
  }
  _evenementChoixMotifs(aNumeroBouton, aListeDonnees) {
    if (aNumeroBouton === 1) {
      miseAJourPunition.call(this, aListeDonnees);
    } else {
      this.getInstance(this.identCMS_Motifs).setDonnees(
        this.moteurPunitions.punition.listeMotifs,
      );
    }
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="',
      this.idContenuPage,
      '">',
      this._construirePage(),
      "</div>",
      '<div id="',
      this.idContenuMessage,
      '" style="margin:5px;"></div>',
    );
    return T.join("");
  }
  _construirePage() {
    const T = [];
    const lLargeur = this.optionsFenetre.largeur - 22;
    T.push('<div style="max-width:', lLargeur, 'px;">');
    T.push(
      '<div class="p-bottom-l">',
      '<ul><li class="NoWrap">',
      '<span class="Gras">',
      GTraductions.getValeur("fenetreSaisiePunition.circonstances"),
      "</span>",
      "</li></ul>",
      '<hr class="m-all-none" />',
      "</div>",
    );
    T.push(
      '<div class="field-contain label-up full-width">',
      '<label class="m-bottom" id="',
      this.idLabelMotif,
      '">',
      GTraductions.getValeur("fenetreSaisiePunition.motif"),
      " : ",
      "</label>",
      '<div id="' +
        this.getInstance(this.identCMS_Motifs).getNom() +
        '"></div>',
      "</div>",
    );
    T.push(
      '<div class="field-contain label-up full-width">',
      '<label for="',
      this.idTextareaDetail,
      '" class="m-bottom">',
      GTraductions.getValeur("fenetreSaisiePunition.details"),
      " : ",
      "</label>",
      '<textarea id="',
      this.idTextareaDetail,
      '" ie-model="circonstance" class="round-style" style="' +
        GStyle.composeWidth(lLargeur) +
        GStyle.composeHeight(GChaine.getHauteurPolice(10) * 3 + 4) +
        '" ></textarea>',
      "</div>",
    );
    T.push(
      '<div class="pj-cols p-bottom" id="' +
        this.getInstance(this.identSelecteurPJ).getNom() +
        '" style="max-width:',
      lLargeur,
      'px;"></div>',
    );
    T.push(
      '<div class="p-y-l">',
      '<ul><li class="NoWrap">',
      '<span class="Gras">',
      GTraductions.getValeur("fenetreSaisiePunition.suiteDonnee"),
      "</span>",
      "</li></ul>",
      '<hr class="m-all-none" />',
      "</div>",
    );
    T.push(
      '<div class="flex-contain flex-center justify-between p-y-l">',
      '<div class="flex-contain flex-center">',
      '<span ie-html="libelleCombo" class="m-right"></span>',
      '<div ie-style="visibiliteComboType"><div id="' +
        this.getInstance(this.identComboType).getNom() +
        '"></div></div>',
      '<div ie-style="visibiliteComboAccomp"><div id="' +
        this.getInstance(this.identComboAccomp).getNom() +
        '"></div></div>',
      "</div>",
      '<div class="flex-contain flex-center" ie-style="visibiliteChoixDuree">',
      '<span class="m-right ie-titre-petit">',
      GTraductions.getValeur("fenetreSaisiePunition.duree"),
      "</span>",
      '<div id="' +
        this.getInstance(this.identComboDuree).getNom() +
        '"></div>',
      "</div>",
      '<div class="flex-contain flex-center" ie-style="visibiliteChoixDate">',
      '<span class="m-right ie-titre-petit">',
      GTraductions.getValeur("fenetreSaisiePunition.aRendre"),
      "</span>",
      '<div id="' + this.getInstance(this.identComboDate).getNom() + '"></div>',
      "</div>",
      "</div>",
    );
    T.push(
      '<div  class="field-contain label-up full-width">',
      '<label for="',
      this.idTextareaTAF,
      '" class="m-bottom">',
      GTraductions.getValeur("fenetreSaisiePunition.taf"),
      " : ",
      "</label>",
      '<textarea id="',
      this.idTextareaTAF,
      '" ie-model="commentaire" class="round-style" style="' +
        GStyle.composeWidth(lLargeur) +
        GStyle.composeHeight(GChaine.getHauteurPolice(10) * 4 + 4) +
        '"></textarea>',
      "</div>",
    );
    T.push(
      '<div class="p-bottom-xl pj-cols" id="' +
        this.getInstance(this.identSelecteurPJTAF).getNom() +
        '" style="max-width:',
      lLargeur,
      'px;"></div>',
    );
    T.push(
      '<div><ie-checkbox class="m-top" ie-model="cbTafPublierDebutSeance" ie-display="cbTafPublierDebutSeance.getDisplay">',
      GTraductions.getValeur("punition.publierUniquementDebutRetenue"),
      "</ie-checkbox>",
    );
    T.push(
      '<div id="',
      this.idTitreProgrammation,
      '" class="p-bottom-l">',
      '<ul><li class="NoWrap">',
      '<span class="Gras">',
      GTraductions.getValeur("fenetreSaisiePunition.aProgrammer"),
      "</span>",
      "</li></ul>",
      '<hr class="m-all-none" />',
      "</div>",
    );
    T.push(
      '<div class="p-top-l"',
      this.moteurPunitions.avecDroitPublie() ? "" : ' style="display:none;"',
      ">",
    );
    T.push(
      '<div class="flex-contain flex-gap-l">',
      '<ie-checkbox ie-model="checkPublierPunition">',
      GTraductions.getValeur("fenetreSaisiePunition.publierPunition"),
      "</ie-checkbox>",
      '<i role="img" role="presentation" ie-class="getClasseCssImagePublicationPunition" ie-hint="getHintImagePublicationPunition"></i>',
      "</div>",
    );
    T.push(
      '<div class="p-top-l m-left-xl flex-contain flex-center">',
      GTraductions.getValeur("Le_Maj"),
      '<div class="InlineBlock m-left" style="width: 10rem;">',
      `<ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur>`,
      "</div>",
      "</div>",
    );
    T.push("</div></div>");
    return T.join("");
  }
  surValidation(ANumeroBouton) {
    if (this.moteurPunitions.surValidation(ANumeroBouton)) {
      const lPunition = this.moteurPunitions.punition;
      if (
        !!lPunition &&
        !lPunition.duree &&
        !this.moteurPunitions.estPunitionEnDevoir()
      ) {
        const lElementDureeSelectionnee = this.getInstance(
          this.identComboDuree,
        ).getSelection();
        if (!!lElementDureeSelectionnee && !!lElementDureeSelectionnee.duree) {
          lPunition.duree = lElementDureeSelectionnee.duree;
        }
      }
      this.callback.appel(ANumeroBouton, this.moteurPunitions.genreRessource);
    }
    this.fermer();
  }
  _actualiserDureeDate() {
    if (this.moteurPunitions.estPunitionEnDevoir()) {
      this.moteurPunitions.punition.date =
        this.moteurPunitions.punition.date ||
        this.moteurPunitions.punition.dateProgrammation ||
        this.date;
      this.getInstance(this.identComboDate).setDonnees(
        this.moteurPunitions.getListeDuree(),
        0,
      );
    } else if (
      this.moteurPunitions.genreRessource === EGenreRessource.Punition
    ) {
      const lListeDuree = this.moteurPunitions.getListeDuree();
      const lPunition = this.moteurPunitions.punition;
      let lDureeRecherchee;
      if (lPunition.duree > 0) {
        lDureeRecherchee = lPunition.duree;
      } else if (
        !!lPunition.naturePunition &&
        !!lPunition.naturePunition.dureeParDefaut
      ) {
        lDureeRecherchee = TUtilitaireDuree.dureeEnMin(
          lPunition.naturePunition.dureeParDefaut,
        );
      }
      let lIndiceSelection = 0;
      if (!!lDureeRecherchee) {
        for (let i = 0; i < lListeDuree.count(); i++) {
          if (lListeDuree.get(i).duree === lDureeRecherchee) {
            lIndiceSelection = i;
            break;
          }
        }
      }
      this.getInstance(this.identComboDuree).setDonnees(
        this.moteurPunitions.getListeDuree(),
        lIndiceSelection,
      );
    }
  }
}
function _initialiserComboType(aInstance) {
  aInstance.setAvecTabulation(false);
  aInstance.setOptionsObjetSaisie({
    longueur: 230,
    labelWAICellule: GTraductions.getValeur(
      "fenetrePunition.Accessible_comboType",
    ),
  });
}
function _initialiserComboAccomp(aInstance) {
  aInstance.setAvecTabulation(false);
  aInstance.setOptionsObjetSaisie({
    longueur: 230,
    celluleAvecTexteHtml: true,
    labelWAICellule: GTraductions.getValeur(
      "fenetrePunition.Accessible_comboAccomp",
    ),
  });
}
function _initialiserComboDuree(aInstance) {
  aInstance.setAvecTabulation(false);
  aInstance.setOptionsObjetSaisie({
    longueur: 75,
    labelWAICellule: GTraductions.getValeur(
      "fenetrePunition.Accessible_comboDuree",
    ),
  });
}
function _initialiserComboDate(aInstance) {
  aInstance.setAvecTabulation(false);
  aInstance.setOptionsObjetSaisie({
    longueur: 75,
    forcerBoutonDeploiement: true,
    labelWAICellule: GTraductions.getValeur(
      "fenetrePunition.Accessible_comboDate",
    ),
  });
}
function _initialiserFenetreCalendrier(aInstance) {
  aInstance.setParametres(
    GDate.PremierLundi,
    this.date,
    GDate.derniereDate,
    GParametres.JoursOuvres,
  );
}
function _initSelecteurPJ(aInstance) {
  aInstance.setOptions({
    genrePJ: EGenreDocumentJoint.Fichier,
    genreRessourcePJ: EGenreRessource.DocJointEleve,
    interdireDoublonsLibelle: false,
    libelleSelecteur: GTraductions.getValeur("AjouterDesPiecesJointes"),
    avecBoutonSupp: true,
    avecCmdAjoutNouvelle: false,
    avecMenuSuppressionPJ: false,
    avecAjoutExistante: true,
    ouvrirFenetreChoixTypesAjout: false,
    maxFiles: 0,
    maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
  });
}
function _evntSelecteurPJ(aParam) {
  switch (aParam.evnt) {
    case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
      if (this.moteurPunitions.punition) {
        this.listePJ.addElement(aParam.fichier);
        this.moteurPunitions.punition.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
      if (this.moteurPunitions.punition) {
        this.moteurPunitions.punition.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    default:
      break;
  }
}
function _evntSelecteurPJTAF(aParam) {
  switch (aParam.evnt) {
    case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
      if (this.moteurPunitions.punition) {
        this.listePJ.addElement(aParam.fichier);
        this.moteurPunitions.punition.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
      if (this.moteurPunitions.punition) {
        this.moteurPunitions.punition.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    default:
      break;
  }
}
function miseAJourPunition(aListeDonnees) {
  const lPunition = this.moteurPunitions.punition;
  if (lPunition) {
    lPunition.listeMotifs = aListeDonnees;
    if (this.moteurPunitions.enCreation && !lPunition.datePublication) {
      for (let I = 0; I < lPunition.listeMotifs.count(); I++) {
        const lMotif = lPunition.listeMotifs.get(I);
        if (lMotif.publication) {
          this.moteurPunitions.setDatePublication(
            ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
              lPunition.naturePunition,
            ),
          );
          break;
        }
      }
    }
  }
}
module.exports = { ObjetFenetre_SaisiePunitions };

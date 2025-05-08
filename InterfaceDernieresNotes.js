const { GHtml } = require("ObjetHtml.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_DernieresNotes,
} = require("DonneesListe_DernieresNotes.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetRequeteDernieresNotes } = require("ObjetRequeteDernieresNotes.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const {
  ObjetFenetre_MethodeCalculMoyenne,
} = require("ObjetFenetre_MethodeCalculMoyenne.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { MoteurDernieresNotes } = require("MoteurDernieresNotes.js");
const { UtilitaireQCMPN } = require("UtilitaireQCMPN.js");
class InterfaceDernieresNotes extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.ids = {
      detailDerniereNote: this.Nom + "_detail",
      valeurMoyenneGenerale: this.Nom + "_moyGen",
    };
    this.parametres = {
      triParOrdreChronologique: true,
      afficherMoyenneService: true,
      afficherMoyenneDevoir: true,
      largeurs: { liste: 625, detail: 600 },
    };
    this.donnees = {
      moyenneGenerale: "",
      avecDetailService: true,
      avecDetailDevoir: true,
    };
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurDernieresNotes = new MoteurDernieresNotes();
  }
  construireInstances() {
    this.identComboPeriodes = this.add(
      ObjetSaisiePN,
      _evenementSurComboPeriodes.bind(this),
      _initComboPeriodes,
    );
    this.identListeDernieresNotes = this.add(
      ObjetListe,
      _evenementListeDernieresNotes.bind(this),
      _initListeDernieresNotes.bind(this),
    );
    this.identFenetreMethodeCalculMoyenne = this.add(
      ObjetFenetre_MethodeCalculMoyenne,
      null,
      this.initialiserMethodeCalculMoyenne,
    );
    this.identFenetreVisuQCM = this.addFenetre(ObjetFenetreVisuEleveQCM);
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identListeDernieresNotes;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identComboPeriodes);
    this.AddSurZone.push({
      html:
        '<ie-radio class="as-chips" ie-model="radioTriDevoirs(0)">' +
        GTraductions.getValeur("DernieresNotes.tri.Par_ordre_chronologique") +
        "</ie-radio>" +
        '<ie-radio class="m-left as-chips" ie-model="radioTriDevoirs(1)">' +
        GTraductions.getValeur("DernieresNotes.tri.Par_matiere") +
        "</ie-radio>",
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      radioTriDevoirs: {
        getValue: function (aMode) {
          return aMode === 0
            ? aInstance.parametres.triParOrdreChronologique
            : !aInstance.parametres.triParOrdreChronologique;
        },
        setValue: function (aData) {
          aInstance.parametres.triParOrdreChronologique = aData === 0;
          const lListeDernieresNotes = aInstance.getInstance(
            aInstance.identListeDernieresNotes,
          );
          if (lListeDernieresNotes.getDonneesListe()) {
            lListeDernieresNotes
              .getDonneesListe()
              .setParametres({
                avecServices: !aInstance.parametres.triParOrdreChronologique,
              });
            lListeDernieresNotes.actualiser({
              conserverSelection: true,
              avecScrollSelection: true,
            });
            if (!getSelectedDevoir() || !getSelectedDevoir().existeNumero()) {
              GHtml.setHtml(
                aInstance.ids.detailDerniereNote,
                _composeDetailSelectionnezUnDevoir.call(aInstance),
              );
            }
          }
          _surModifContexteAffichage.call(aInstance);
        },
      },
      btnCalculMoyenne: {
        event: function (aNumeroService) {
          const lService =
            aInstance.listeDevoirs.getElementParNumero(aNumeroService);
          const lEleve = GEtatUtilisateur.getMembre();
          const lClasse = lEleve.Classe;
          const lPeriode = GEtatUtilisateur.getPeriode();
          const lParametresCalcul = {
            libelleEleve: lEleve.getLibelle(),
            numeroEleve: lEleve.getNumero(),
            libelleClasse: lClasse.getLibelle(),
            numeroClasse: lClasse.getNumero(),
            libelleServiceNotation: lService.getLibelle(),
            numeroServiceNotation: lService.getNumero(),
            numeroPeriodeNotation: lPeriode.getNumero(),
            genreChoixNotation: lPeriode.getGenre(),
            moyenneTrimestrielle: true,
            pourMoyenneNette: true,
            ordreChronologique: GEtatUtilisateur.getTriDevoirs(),
          };
          if (aInstance.identFenetreMethodeCalculMoyenne) {
            aInstance
              .getInstance(aInstance.identFenetreMethodeCalculMoyenne)
              .setDonnees(lParametresCalcul);
          }
        },
        getDisabled: function (aNumeroService) {
          const lService =
            aInstance.listeDevoirs.getElementParNumero(aNumeroService);
          return !lService.moyEleve || !lService.moyEleve.estUneValeur();
        },
      },
      afficherCorrigerQCM: {
        event: function () {
          aInstance.evntCorrigeQCM();
        },
      },
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(`<div class="InterfaceDernieresNotes">`);
    H.push(
      `<section id="${this.getInstance(this.identListeDernieresNotes).getNom()}" class="liste-contain ListeDernieresNotes" style="--liste-width : ${this.parametres.largeurs.liste}px;"></section>`,
    );
    H.push(
      `<section tabindex="0" id="${this.ids.detailDerniereNote}" class="Zone-DetailsNotes detail-contain"  style="--detail-width : ${this.parametres.largeurs.detail}px;"></section>`,
    );
    H.push(`</div>`);
    return H.join("");
  }
  initialiserMethodeCalculMoyenne(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      titre: GTraductions.getValeur(
        "DernieresNotes.Detail.DetailsMethodeCalcMoy",
      ),
      largeur: 600,
      hauteur: 300,
      listeBoutons: [GTraductions.getValeur("principal.fermer")],
      largeurMin: 600,
      hauteurMin: 150,
    });
  }
  evntCorrigeQCM(aNumero, aGenre) {
    let lDevoir;
    if (aNumero === undefined) {
      lDevoir = getSelectedDevoir();
    } else {
      lDevoir = this.listeDevoirs.getElementParNumeroEtGenre(aNumero, aGenre);
    }
    if (!!lDevoir && !!lDevoir.executionQCM) {
      this.afficherExecutionQCM(lDevoir.executionQCM);
    }
  }
  afficherExecutionQCM(aExecutionQCM) {
    UtilitaireQCMPN.executerQCM(
      this.getInstance(this.identFenetreVisuQCM),
      aExecutionQCM,
      true,
    );
  }
  recupererDonnees() {
    if (this.Instances[this.identComboPeriodes]) {
      this.IdPremierElement = this.getInstance(
        this.identComboPeriodes,
      ).getPremierElement();
      this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
      if (this.listePeriodes && this.listePeriodes.count()) {
        this.Instances[this.identComboPeriodes].setVisible(true);
        this.Instances[this.identComboPeriodes].setDonnees(this.listePeriodes);
        this.Instances[this.identComboPeriodes].setSelectionParElement(
          GEtatUtilisateur.getPeriode(),
          0,
        );
      } else {
        this.Instances[this.identComboPeriodes].setVisible(false);
      }
    }
  }
}
function _initComboPeriodes(aInstance) {
  aInstance.setOptionsObjetSaisie({
    labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
  });
}
function _evenementSurComboPeriodes(aParams) {
  if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
    GEtatUtilisateur.Navigation.setRessource(
      EGenreRessource.Periode,
      aParams.element,
    );
    new ObjetRequeteDernieresNotes(
      this,
      _surRequeteDernieresNotes.bind(this),
    ).lancerRequete({ periode: aParams.element });
    _surModifContexteAffichage.call(this);
  }
}
function _initListeDernieresNotes(aInstance) {
  const lOptionsListes = {
    skin: ObjetListe.skin.flatDesign,
    avecOmbreDroite: true,
  };
  aInstance.setOptionsListe(lOptionsListes);
}
function _evenementListeDernieresNotes(aParametres, aGenreEvenement) {
  switch (aGenreEvenement) {
    case EGenreEvenementListe.Selection:
    case EGenreEvenementListe.SelectionClick:
      if (
        !!aParametres.article &&
        aParametres.article.getGenre() === EGenreRessource.Devoir
      ) {
        setSelectedDevoir.call(this, aParametres.article);
      } else {
        setSelectedDevoir.call(this, null);
      }
      GHtml.setHtml(
        this.ids.detailDerniereNote,
        _composeDetail.call(this, aParametres.article),
        { instance: this },
      );
      GHtml.setFocus(this.ids.detailDerniereNote);
      break;
  }
}
function _composeDetailSelectionnezUnDevoir() {
  let lMessage = "";
  if (this.donnees.avecDetailDevoir) {
    lMessage = GTraductions.getValeur("DernieresNotes.Selectionnez_un_devoir");
  } else if (
    this.donnees.avecDetailService &&
    !this.parametres.triParOrdreChronologique
  ) {
    lMessage =
      GTraductions.getValeur("Message")[EGenreMessage.SelectionMatiere];
  }
  return [
    '<div class="Gras AlignementMilieu GrandEspaceHaut">',
    lMessage,
    "</div>",
  ].join("");
}
function _composeDetail(aElement) {
  const H = [];
  if (aElement) {
    if (aElement.getGenre() === EGenreRessource.Service) {
      H.push(
        this.moteurDernieresNotes.composeDetailsService(aElement, {
          avecAffichageComplet: this.donnees.avecDetailService,
          libelleMoyenneDuPublicService: aElement.estServiceEnGroupe
            ? GTraductions.getValeur("DernieresNotes.Moyenne_groupe")
            : GTraductions.getValeur("DernieresNotes.Moyenne_classe"),
        }),
      );
    } else {
      H.push(
        this.moteurDernieresNotes.composeDetailsDevoir(aElement, {
          commentaireEnTitre: true,
          libelleMoyenneDuPublicDevoir: aElement.estEnGroupe
            ? GTraductions.getValeur("DernieresNotes.Moyenne_groupe")
            : GTraductions.getValeur("DernieresNotes.Moyenne_classe"),
          piecesJointes: this.moteur.composePieceJointeDevoir(aElement),
        }),
      );
    }
  }
  return H.join("");
}
function _surRequeteDernieresNotes(aDonnees) {
  if (
    !!aDonnees &&
    !!aDonnees.listeDevoirs &&
    aDonnees.listeDevoirs.count() > 0
  ) {
    this.afficherBandeau(true);
    const lListeDernieresNotes = this.getInstance(
      this.identListeDernieresNotes,
    );
    this.donnees.avecDetailService = aDonnees.avecDetailService || false;
    this.donnees.avecDetailDevoir = aDonnees.avecDetailDevoir || false;
    this.donnees.moyenneGenerale = !!aDonnees.moyenneGenerale
      ? aDonnees.moyenneGenerale
      : null;
    const lListeDevoirs = new ObjetListeElements();
    aDonnees.listeDevoirs.parcourir((D) => {
      let lServiceDeLaListeDevoirs = lListeDevoirs.getElementParNumero(
        D.service.getNumero(),
      );
      if (!lServiceDeLaListeDevoirs) {
        lListeDevoirs.addElement(D.service);
        lServiceDeLaListeDevoirs = D.service;
        lServiceDeLaListeDevoirs.nbNotesEleve = 0;
      }
      lListeDevoirs.addElement(D);
      D.pere = lServiceDeLaListeDevoirs;
      lServiceDeLaListeDevoirs.nbNotesEleve++;
    });
    this.listeDevoirs = lListeDevoirs;
    lListeDernieresNotes.setDonnees(
      new DonneesListe_DernieresNotes(this.listeDevoirs, {
        avecServices: !this.parametres.triParOrdreChronologique,
        afficherMoyenneService: this.parametres.afficherMoyenneService,
        afficherMoyenneDevoir: this.parametres.afficherMoyenneDevoir,
        avecDetailService: this.donnees.avecDetailService,
        avecDetailDevoir: this.donnees.avecDetailDevoir,
        callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
        htmlTotal: this.donnees.moyenneGenerale
          ? this.moteurDernieresNotes.composeLigneTotaleDernieresNotes(
              this.donnees.moyenneGenerale,
            )
          : "",
      }),
    );
    let llIndexSelectionDevoir = -1;
    const lNavigationDevoir = getSelectedDevoir();
    if (!!lNavigationDevoir && lNavigationDevoir.existeNumero()) {
      llIndexSelectionDevoir = lListeDevoirs.getIndiceElementParFiltre((D) => {
        return D.getNumero() === lNavigationDevoir.getNumero();
      });
    }
    if (llIndexSelectionDevoir !== -1) {
      lListeDernieresNotes.selectionnerLigne({
        ligne: llIndexSelectionDevoir,
        avecScroll: true,
        avecEvenement: true,
      });
    } else {
      GHtml.setHtml(
        this.ids.detailDerniereNote,
        _composeDetailSelectionnezUnDevoir.call(this),
      );
    }
  } else {
    GHtml.setHtml(this.ids.detailDerniereNote, "&nbsp;");
    this.evenementAfficherMessage(EGenreMessage.PasDeNotes);
    setSelectedDevoir.call(this, null);
  }
}
function getSelectedDevoir() {
  return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Devoir);
}
function setSelectedDevoir(aDevoir) {
  _surModifContexteAffichage.call(this);
  GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Devoir, aDevoir);
}
function _surModifContexteAffichage() {
  if (this.identFenetreMethodeCalculMoyenne) {
    const lFenetre = this.getInstance(this.identFenetreMethodeCalculMoyenne);
    if (lFenetre.EstAffiche) {
      lFenetre.fermer();
    }
  }
}
module.exports = InterfaceDernieresNotes;

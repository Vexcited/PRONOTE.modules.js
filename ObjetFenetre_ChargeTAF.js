const { EGenreDomaineInformation } = require("Enumere_DomaineInformation.js");
const { ObjetGrilleCalendrier } = require("ObjetGrilleCalendrier.js");
const { GUID } = require("GUID.js");
const { GPosition } = require("ObjetPosition.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { GClass } = require("ObjetClass.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetRequetePageCahierDeTexte,
} = require("ObjetRequetePageCahierDeTexte.js");
const {
  ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { TUtilitaireCDT } = require("UtilitaireCDT.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  EGenreBtnActionBlocCDT,
  GestionnaireBlocCDT,
} = require("GestionnaireBlocCDT.js");
const {
  ObjetFenetre_ListeTAFFaits,
  TypeBoutonFenetreTAFFaits,
} = require("ObjetFenetre_ListeTAFFaits.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class ObjetFenetre_ChargeTAF extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.selection = {
      afficherDS: true,
      afficherTAF: true,
      afficherMatieres: false,
      afficherDetail: false,
    };
    this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte();
    const lGuid = GUID.getId();
    this.idGrille = lGuid + "_aff";
    this.idFieldset = lGuid + "_field";
    this.setOptionsFenetre({
      modale: false,
      listeBoutons: [GTraductions.getValeur("principal.fermer")],
      titre: GTraductions.getValeur("CahierDeTexte.titreFenetreChargeTAF", [
        "",
      ]),
      largeur: 1100,
      hauteur: 600,
      avecRetaillage: true,
      largeurMin: 600,
      hauteurMin: 400,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecChoixClasse() {
        return aInstance.listeClasses && aInstance.listeClasses.count() > 1;
      },
      getHtmlChoixClasse() {
        const H = [];
        if (aInstance.listeClasses) {
          aInstance.listeClasses.parcourir((aClasse) => {
            H.push(
              "<ie-radio ie-model=\"radioChoixClasseAffichee('",
              aClasse.getNumero(),
              '\')" class="as-chips m-right">',
              aClasse.getLibelle(),
              "</ie-radio>",
            );
          });
        }
        return H.join("");
      },
      radioChoixClasseAffichee: {
        getValue(aNumeroClasse) {
          return (
            aInstance.classeGpe &&
            aInstance.classeGpe.getNumero() === aNumeroClasse
          );
        },
        setValue(aNumeroClasse) {
          if (aInstance.listeClasses) {
            aInstance.classeGpe =
              aInstance.listeClasses.getElementParNumero(aNumeroClasse);
            _requete.call(aInstance);
          }
        },
      },
      paramAff: {
        getValue: function (aGenre) {
          const lSelection = aInstance.selection;
          switch (aGenre) {
            case ObjetFenetre_ChargeTAF.genreParam.cbDS:
              return lSelection.afficherDS;
            case ObjetFenetre_ChargeTAF.genreParam.cbTAF:
              return lSelection.afficherTAF;
            case ObjetFenetre_ChargeTAF.genreParam.cbMatieres:
              return lSelection.afficherMatieres;
            case ObjetFenetre_ChargeTAF.genreParam.cbDetail:
              return lSelection.afficherDetail;
          }
        },
        setValue: function (aGenre, aValue) {
          const lSelection = aInstance.selection;
          switch (aGenre) {
            case ObjetFenetre_ChargeTAF.genreParam.cbDS:
              lSelection.afficherDS = aValue;
              break;
            case ObjetFenetre_ChargeTAF.genreParam.cbTAF:
              lSelection.afficherTAF = aValue;
              break;
            case ObjetFenetre_ChargeTAF.genreParam.cbMatieres:
              lSelection.afficherMatieres = aValue;
              break;
            case ObjetFenetre_ChargeTAF.genreParam.cbDetail:
              lSelection.afficherDetail = aValue;
              break;
          }
          aInstance.filtrerDonnees();
        },
      },
    });
  }
  construireInstances() {
    this.identCalendrier = this.add(
      ObjetCalendrier,
      _evntSurCalendrier.bind(this),
      _initCalendrier.bind(this),
    );
    this.identCahierDeTexte = this.add(
      ObjetGrilleCalendrier,
      _evntSurGrille.bind(this),
      _initGrilleCalendrier.bind(this),
    );
    this.identFenetreVisuQCM = this.addFenetre(ObjetFenetreVisuEleveQCM);
  }
  setDonnees(aCours, aListeClasses, aEleve, aNumeroSemaine) {
    this.cours = aCours;
    this.listeClasses = aListeClasses;
    this.eleve = aEleve;
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("CahierDeTexte.titreFenetreChargeTAF", [
        _getTitre.call(this),
      ]),
    });
    this.classeGpe = this.listeClasses.get(0);
    this.afficher();
    this.surResizeInterface();
    this.getInstance(this.identCalendrier).setSelection(
      aNumeroSemaine || GEtatUtilisateur.getSemaineSelectionnee(),
    );
  }
  filtrerDonnees() {
    this.getInstance(this.identCahierDeTexte).modeAffichage = this.selection
      .afficherDetail
      ? ObjetGrilleCalendrier.genreAffichage.deployer
      : ObjetGrilleCalendrier.genreAffichage.fermer;
    this.actualiser();
  }
  composeContenu() {
    const H = [];
    H.push('<div class="flex-contain cols full-height">');
    H.push(
      '<div class="fix-bloc m-bottom-l" id="' +
        this.getInstance(this.identCalendrier).getNom() +
        '" style="width: 100%;"></div>',
    );
    H.push(
      '<fieldset id="',
      this.idFieldset,
      '" class="fix-bloc Bordure" style="margin: 0 0 0.8rem 0;">',
    );
    H.push(
      '<legend class="',
      GClass.getLegende(),
      '">',
      GTraductions.getValeur("CahierDeTexte.afficherOption"),
      "</legend>",
    );
    const lAvecGestionNotation = GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionNotation,
    );
    H.push('<div class="NoWrap">');
    H.push(
      '<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="paramAff(',
      ObjetFenetre_ChargeTAF.genreParam.cbDS,
      ')" class="Espace NoWrap">',
      lAvecGestionNotation
        ? GTraductions.getValeur("CahierDeTexte.optionDSEval")
        : GTraductions.getValeur("CahierDeTexte.optionEval"),
      "</ie-checkbox></div>",
    );
    H.push(
      '<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="paramAff(',
      ObjetFenetre_ChargeTAF.genreParam.cbTAF,
      ')" class="Espace NoWrap">',
      GTraductions.getValeur("CahierDeTexte.optionAvecTAF"),
      "</ie-checkbox></div>",
    );
    H.push(
      '<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="paramAff(',
      ObjetFenetre_ChargeTAF.genreParam.cbMatieres,
      ')" class="Espace NoWrap">',
      GTraductions.getValeur("CahierDeTexte.optionToutesMatieres"),
      "</ie-checkbox></div>",
    );
    H.push(
      '<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="paramAff(',
      ObjetFenetre_ChargeTAF.genreParam.cbDetail,
      ')" class="Espace NoWrap">',
      GTraductions.getValeur("CahierDeTexte.optionDeployerDetail"),
      "</ie-checkbox></div>",
    );
    H.push("</div>");
    H.push("</fieldset>");
    H.push(
      '<div ie-if="avecChoixClasse" ie-html="getHtmlChoixClasse" class="fix-bloc m-bottom-l"></div>',
    );
    H.push(
      '<div class="fluid-bloc" id="',
      this.getInstance(this.identCahierDeTexte).getNom(),
      '"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
    switch (aGenreEvnt) {
      case EGenreBtnActionBlocCDT.executionQCM:
      case EGenreBtnActionBlocCDT.voirQCM: {
        const lExecQCM =
          aParam && !!aParam.estQCM ? aElement : aElement.executionQCM;
        this.surExecutionQCM(aParam.event, lExecQCM);
        break;
      }
      case EGenreBtnActionBlocCDT.detailTAF:
        ObjetFenetre_ListeTAFFaits.ouvrir(
          { pere: this, evenement: this._evenementFenetreTAFFaits },
          aElement,
        );
        break;
      default:
        break;
    }
  }
  _evenementFenetreTAFFaits(aGenreBouton) {
    if (aGenreBouton === TypeBoutonFenetreTAFFaits.Fermer) {
      this.callback.appel({ surModifTAFARendre: true });
      if (this.fenetreCDT) {
        this.fenetreCDT.fermer();
      }
      _requete.call(this);
    }
  }
  actionSurEvntSurCalendrier(aParametres) {
    this.ListeTravailAFaire = aParametres.listeTAF;
    this.ListeCahierDeTextes = aParametres.listeCDT;
    this.listeDS = aParametres.listeDS;
    this.listeMatieres = aParametres.listeMatieres;
    this.actualiser();
  }
  actualiser() {
    const lDonnees = this.formatDonnees();
    this.getInstance(this.identCahierDeTexte).setDonnees(
      IE.Cycles.dateDebutCycle(this.domaine.getPremierePosition(true)),
      IE.Cycles.dateFinCycle(this.domaine.getDernierePosition(true)),
      lDonnees,
      true,
    );
  }
  formatDonnees() {
    return this.utilitaireCDT.formatDonnees({
      modeAffichage: EGenreAffichageCahierDeTextes.TravailAFaire,
      listeCDT: this.ListeCahierDeTextes,
      listeTAF: this.ListeTravailAFaire,
      listeDS: this.listeDS,
      listeMatieres: this.listeMatieres,
      avecDS: this.selection.afficherDS,
      avecTAF: this.selection.afficherTAF,
      avecMatieres: this.selection.afficherMatieres,
      avecDetailTAF: GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur,
      nom: this.Nom,
      avecDonneeLe: true,
      estChargeTAF: true,
    });
  }
  surExecutionQCM(aEvent, aElement) {
    if (aEvent) {
      aEvent.stopImmediatePropagation();
    }
    _evntFiche.bind(this)({ executionQCM: aElement });
  }
  surResizeInterface() {
    super.surResizeInterface();
    this.getInstance(this.identCahierDeTexte).surPostResize();
  }
  surFixerTaille() {
    super.surFixerTaille();
    this.getInstance(this.identCalendrier).surPostResize();
  }
  debutRetaillage() {
    super.debutRetaillage();
    GPosition.setHeight(this.getInstance(this.identCahierDeTexte).getNom(), 0);
    this.getInstance(this.identCahierDeTexte).surPreResize();
  }
  finRetaillage() {
    super.finRetaillage();
    this.surResizeInterface();
  }
}
ObjetFenetre_ChargeTAF.genreParam = {
  cbDS: 2,
  cbTAF: 3,
  cbMatieres: 4,
  cbDetail: 5,
};
function _getTitre() {
  if (this.eleve) {
    return this.eleve.getLibelle();
  }
  const lPublics = [];
  if (this.cours && this.cours.ListeContenus) {
    this.cours.ListeContenus.parcourir((aElement) => {
      if (aElement.getGenre() === EGenreRessource.Groupe) {
        lPublics.push(aElement.getLibelle());
      }
    });
    this.cours.ListeContenus.parcourir((aElement) => {
      if (aElement.getGenre() === EGenreRessource.Classe) {
        lPublics.push(aElement.getLibelle());
      }
    });
    this.cours.ListeContenus.parcourir((aElement) => {
      if (aElement.getGenre() === EGenreRessource.PartieDeClasse) {
        lPublics.push(aElement.getLibelle());
      }
    });
  }
  if (lPublics.length > 0) {
    return lPublics.join(", ");
  }
  if (this.listeClasses && this.listeClasses.count() > 0) {
    return this.listeClasses.getLibelle(0);
  }
}
function _initCalendrier(aInstance) {
  UtilitaireInitCalendrier.init(aInstance);
  aInstance.setDomaineInformation(
    IE.Cycles.getDomaineFerie(),
    EGenreDomaineInformation.Feriee,
  );
}
function _initGrilleCalendrier(aInstance) {
  aInstance.setParametresGrilleCalendrier({
    premiereDate: GParametres.PremiereDate,
    derniereDate: GParametres.DerniereDate,
    joursOuvres: GParametres.JoursOuvres,
    griseJourAvant: false,
    avecDonneesAvecFondBlanc: true,
  });
  aInstance.setOptions({
    avecDeploiement: false,
    avecSelection: true,
    avecCouleurSelection: false,
  });
}
function _evntFiche(aParam) {
  if (aParam && aParam.executionQCM) {
    this.getInstance(this.identFenetreVisuQCM).setParametres(
      aParam.executionQCM.getNumero(),
      true,
    );
    this.getInstance(this.identFenetreVisuQCM).setDonnees(aParam.executionQCM);
  }
  if (aParam && aParam.surModifTAFARendre) {
    this.callback.appel(aParam);
  }
}
function _requete() {
  new ObjetRequetePageCahierDeTexte(
    this,
    this.actionSurEvntSurCalendrier,
  ).lancerRequete({
    domaine: this.domaine,
    ressource: this.eleve ? undefined : this.classeGpe,
    eleve: this.eleve,
  });
}
function _evntSurCalendrier(aSelection, aDomaine) {
  this.domaine = aDomaine;
  if (this.fenetreCDT) {
    this.fenetreCDT.fermer();
  }
  _requete.call(this);
}
function _evntSurGrille(aID, aMatiere) {
  if (aMatiere.ressources.count() > 0) {
    const lCdt = new ObjetElement();
    lCdt.Matiere = aMatiere;
    lCdt.ListeTravailAFaire = this.ListeTravailAFaire;
    TUtilitaireCDT.afficheFenetreDetail(
      this,
      {
        cahiersDeTextes: lCdt,
        genreAffichage: EGenreAffichageCahierDeTextes.TravailAFaire,
        gestionnaire: GestionnaireBlocCDT,
      },
      { evenementSurBlocCDT: this.evenementSurBlocCDT },
    );
  }
}
module.exports = { ObjetFenetre_ChargeTAF };

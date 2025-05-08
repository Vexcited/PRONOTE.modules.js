const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const {
  DonneesListe_CategoriesMotif,
} = require("DonneesListe_CategoriesMotif.js");
const { ObjetRequeteSaisieMotifs } = require("ObjetRequeteSaisieMotifs.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  DonneesListe_SelectionMotifs,
} = require("DonneesListe_SelectionMotifs.js");
Requetes.inscrire("ListesSaisiesPourIncidents", ObjetRequeteConsultation);
class ObjetGestionnaireMotifs extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.droits = {
      avecCreationMotifs: GApplication.droits.get(
        TypeDroits.creerMotifIncidentPunitionSanction,
      ),
    };
    this.initOptions();
    this.listeSelectionneOrigin = new ObjetListeElements();
  }
  initOptions() {
    this._options = {
      titreFenetre: GTraductions.getValeur("fenetreMotifs.titre"),
      titresColonnes: [
        null,
        GTraductions.getValeur("fenetreMotifs.motif"),
        "",
        GTraductions.getValeur("fenetreMotifs.genre"),
      ],
      taillesColonnes: ["20", "100%", "15", "150"],
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      paramListe: {
        avecCreation: this.droits.avecCreationMotifs,
        avecEdition: this.droits.avecCreationMotifs,
        avecSuppression: this.droits.avecCreationMotifs,
      },
      avecLigneCreation: !!this.droits.avecCreationMotifs,
      creations: this.droits.avecCreationMotifs
        ? [
            DonneesListe_SelectionMotifs.colonnes.motif,
            DonneesListe_SelectionMotifs.colonnes.incident,
          ]
        : null,
      callbckCreation: _eventSurCreationMotif.bind(this),
      callbckEdition: _eventSurEditionMotif.bind(this),
      colonnesCachees: null,
      largeurFenetre: 500,
      hauteurFenetre: 400,
      avecAuMoinsUnEltSelectionne: false,
    };
  }
  setOptions(aOptions) {
    $.extend(this._options, aOptions);
    if (!!this._options.droits) {
      $.extend(this.droits, this._options.droits);
    }
  }
  detruireInstances() {
    _fermerFenetre.call(this);
  }
  setDonnees(aParam) {
    const lParam = {
      listeSelectionne: new ObjetListeElements(),
      avecOuvertureFenetre: false,
      reinitialiserlisteMotifs: false,
    };
    $.extend(lParam, aParam);
    if (!!lParam && !!lParam.listeSelectionne) {
      this.listeSelectionneOrigin = lParam.listeSelectionne;
    }
    if (!this.listMotifsOrigin || lParam.reinitialiserlisteMotifs) {
      Requetes(
        "ListesSaisiesPourIncidents",
        this,
        _apresRequeteDonneesMotifs.bind(this, lParam.avecOuvertureFenetre),
      ).lancerRequete({
        avecLieux: false,
        avecSalles: false,
        avecMotifs: true,
        avecAucunMotif: false,
        avecInfoSupprimable: true,
        avecActions: false,
        avecSousCategorieDossier: this.droits.avecCreationMotifs,
        avecPunitions: false,
        avecSanctions: false,
        avecProtagonistes: false,
      });
    } else {
      _chargerDonnees.call(this, {
        listeSelectionne: this.listeSelectionneOrigin,
        listeComplet: this.listMotifsOrigin,
      });
      if (aParam.avecOuvertureFenetre) {
        _ouvrirFenetre.call(this);
      }
    }
  }
  getDonnees() {
    return this.donnees;
  }
  ouvrirFenetre(aParam) {
    const lParam = {
      listeSelectionne: new ObjetListeElements(),
      avecSetDonnees: false,
    };
    $.extend(lParam, aParam);
    if (lParam.avecSetDonnees) {
      this.setDonnees({
        listeSelectionne: lParam.listeSelectionne,
        avecOuvertureFenetre: true,
      });
    } else {
      _ouvrirFenetre.call(this);
    }
  }
  _initDonnees(aListeSelectionnee, aListeOrigin) {
    const lResult = MethodesObjet.dupliquer(aListeOrigin);
    for (let i = 0; i < aListeSelectionnee.count(); i++) {
      const lElm = lResult.getElementParNumero(aListeSelectionnee.getNumero(i));
      if (!!lElm) {
        lElm.cmsActif = true;
      }
    }
    return lResult;
  }
  surFenetre(aGenreBouton, aSelection, aAvecChangementListe) {
    this.genreBouton = aGenreBouton;
    const lListeActif = this.donnees.getListeElements((aElement) => {
      return aElement.cmsActif;
    });
    if (aGenreBouton === 1) {
      if (aAvecChangementListe) {
        requeteSaisieMotifs.call(this, lListeActif, this.donnees);
      } else {
        _finSurFenetre.call(this, aAvecChangementListe);
      }
    } else {
      _chargerDonnees.call(this, {
        listeSelectionne: this.listeSelectionneOrigin,
        listeComplet: this.listMotifsOrigin,
      });
      _finSurFenetre.call(this, aAvecChangementListe);
    }
  }
}
ObjetGestionnaireMotifs.genreEvent = {
  actualiserCellule: 0,
  actualiserDonnees: 1,
};
function _ouvrirFenetre() {
  if (this.fenetre) {
    _fermerFenetre.call(this);
  }
  this.fenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
    pere: this,
    evenement: this.surFenetre,
    initialiser: false,
  });
  const lSelf = this;
  this.fenetre.ajouterCallbackSurDestruction(() => {
    lSelf.fenetre = null;
  });
  const lParam = {
    titres: this._options.titresColonnes
      ? this._options.titresColonnes
      : [{ estCoche: true }, GTraductions.getValeur("Libelle")],
    tailles: this._options.taillesColonnes
      ? this._options.taillesColonnes
      : [20, "100%"],
    avecLigneCreation: this._options.avecLigneCreation,
    creations: this._options.creations,
    callbckCreation: this._options.callbckCreation,
    callbckEdition: this._options.callbckEdition,
    colonnesCachees: this._options.colonnesCachees,
    optionsListe: this._options.optionsListe,
    editable: true,
  };
  const lOptionsFenetre = {
    titre: this._options.titreFenetre,
    largeur: this._options.largeurFenetre,
    hauteur: this._options.hauteurFenetre,
    listeBoutons: this._options.listeBoutons
      ? this._options.listeBoutons
      : [GTraductions.getValeur("Fermer")],
  };
  if (this._options.avecAuMoinsUnEltSelectionne) {
    lOptionsFenetre.modeActivationBtnValider =
      this.fenetre.modeActivationBtnValider.auMoinsUnEltSelectionne;
  }
  this.fenetre.setOptionsFenetre(lOptionsFenetre);
  this.fenetre.paramsListe = lParam;
  this.fenetre.initialiser();
  this.donneesListe = new DonneesListe_SelectionMotifs(
    this.donnees,
    this._options.paramListe,
  );
  this.fenetre.setDonnees(this.donneesListe, false);
  this.fenetre.positionnerSousId(this.Nom);
}
function _eventSurCreationMotif(aCol) {
  switch (aCol) {
    case DonneesListe_SelectionMotifs.colonnes.incident:
      _ouvrirFenetreSCDossier.call(this, _evntFenetreSousCategorieDossier);
      return true;
    default:
      break;
  }
}
function _eventSurEditionMotif(aParametres) {
  switch (aParametres.colonne) {
    case DonneesListe_SelectionMotifs.colonnes.incident:
      this.motifSelectionne = this.donnees.get(aParametres.ligne);
      this.elmSelectionne = aParametres.article;
      _ouvrirFenetreSCDossier.call(this, _evntEditionSousCategorieDossier);
      return true;
    default:
      break;
  }
}
function _ouvrirFenetreSCDossier(aEvenement) {
  if (this.fenetreSCD) {
    _fermerFenetreSCD.call(this);
  }
  const lSelf = this;
  this.fenetreSCD = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
    pere: this,
    evenement: aEvenement.bind(lSelf),
    initialiser: false,
  });
  this.fenetreSCD.ajouterCallbackSurDestruction(() => {
    lSelf.fenetreSCD = null;
  });
  const lParamsListe = { tailles: ["100%"], editable: false };
  this.fenetreSCD.setOptionsFenetre({
    titre: GTraductions.getValeur("dossierVS.titreIncident"),
    largeur: 300,
    hauteurMin: 160,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  this.fenetreSCD.paramsListe = lParamsListe;
  this.fenetreSCD.initialiser();
  this.fenetreSCD.setDonnees(
    new DonneesListe_CategoriesMotif(this.listeSousCategorieDossier),
  );
  this.fenetreSCD.positionnerSousId(this.Nom);
}
function _evntFenetreSousCategorieDossier(aGenreBouton, aSelection) {
  if (aGenreBouton === 1) {
    const lIncident = this.listeSousCategorieDossier.get(aSelection);
    this.fenetre
      .getInstance(this.fenetre.identListe)
      .ajouterElementCreation(lIncident);
  } else {
    this.fenetre.getInstance(this.fenetre.identListe).annulerCreation();
  }
}
function _evntEditionSousCategorieDossier(aGenreBouton, aSelection) {
  if (aGenreBouton === 1) {
    const lIncident = this.listeSousCategorieDossier.get(aSelection);
    if (
      !this.elmSelectionne.sousCategorieDossier ||
      lIncident.getNumero() !==
        this.elmSelectionne.sousCategorieDossier.getNumero()
    ) {
      this.elmSelectionne.sousCategorieDossier = lIncident;
      this.elmSelectionne.setEtat(EGenreEtat.Modification);
      this.fenetre.actualiserListe(true, true);
    }
  }
}
function _apresRequeteDonneesMotifs(aAvecOuvertureFenetre, aJSON) {
  this.listMotifsOrigin = aJSON.motifs;
  this.listeSousCategorieDossier = aJSON.listeSousCategorieDossier;
  _chargerDonnees.call(this, {
    listeSelectionne: this.listeSelectionneOrigin,
    listeComplet: this.listMotifsOrigin,
  });
  if (aAvecOuvertureFenetre) {
    _ouvrirFenetre.call(this);
  }
}
function _chargerDonnees(aParam) {
  if (aParam.listeComplet) {
    if (aParam.listeSelectionne) {
      this.donnees = this._initDonnees(
        aParam.listeSelectionne,
        aParam.listeComplet,
      );
    } else {
      this.donnees = MethodesObjet.dupliquer(aParam.listeComplet);
    }
    this.donnees.setTri([
      ObjetTri.init((D) => {
        return !D.ssMotif;
      }, ObjetTri.init("Libelle")),
    ]);
    this.donnees.trier();
    this.callback.appel({
      event: ObjetGestionnaireMotifs.genreEvent.actualiserCellule,
    });
  }
}
function _fermerFenetreSCD() {
  if (!this.fenetreSCD) {
    return;
  }
  this.fenetreSCD.fermer();
}
function _finSurFenetre(aAvecChangementListe) {
  _fermerFenetre.call(this);
  const lListeActif = this.donnees.getListeElements((aElement) => {
    return aElement.cmsActif;
  });
  this.callback.appel({
    genreBouton: this.genreBouton,
    liste: lListeActif,
    event: ObjetGestionnaireMotifs.genreEvent.actualiserDonnees,
    listeComplet: aAvecChangementListe ? this.listMotifsOrigin : null,
  });
}
function requeteSaisieMotifs(aListeDonnees, aListeTot) {
  new ObjetRequeteSaisieMotifs(
    this,
    _apresRequeteSaisieMotifs.bind(this),
  ).lancerRequete({
    motifs: aListeTot,
    selection: aListeDonnees,
    avecAucunMotif: false,
  });
}
function _apresRequeteSaisieMotifs(aListeDonnees, aListeTot) {
  if (aListeTot) {
    this.listMotifsOrigin = aListeTot;
  }
  if (aListeDonnees) {
    this.listeSelectionneOrigin = aListeDonnees;
  }
  _chargerDonnees.call(this, {
    listeSelectionne: this.listeSelectionneOrigin,
    listeComplet: this.listMotifsOrigin,
  });
  _finSurFenetre.call(this, true);
}
function _fermerFenetre() {
  if (!this.fenetre) {
    return;
  }
  this.fenetre.fermer();
}
module.exports = { ObjetGestionnaireMotifs };

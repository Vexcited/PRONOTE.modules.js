const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetRequeteDernieresNotes } = require("ObjetRequeteDernieresNotes.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  DonneesListe_DernieresNotes,
} = require("DonneesListe_DernieresNotes.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_DetailsNote } = require("ObjetFenetre_DetailsNote.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GHtml } = require("ObjetHtml.js");
const { MoteurDernieresNotes } = require("MoteurDernieresNotes.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { MethodesObjet } = require("MethodesObjet.js");
const TypeOngletDernieresNotes = { ParDate: 0, ParMatiere: 1 };
class InterfacePageDernieresNotes extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    if (!GEtatUtilisateur.infosSupp) {
      GEtatUtilisateur.infosSupp = {};
    }
    if (!GEtatUtilisateur.infosSupp.DernieresNotesMobile) {
      GEtatUtilisateur.infosSupp.DernieresNotesMobile = {};
    }
    if (
      !MethodesObjet.isNumeric(
        GEtatUtilisateur.infosSupp.DernieresNotesMobile.genreOngletSelectionne,
      )
    ) {
      GEtatUtilisateur.infosSupp.DernieresNotesMobile.genreOngletSelectionne =
        TypeOngletDernieresNotes.ParDate;
    }
    this.listePeriodes = new ObjetListeElements();
    this.periodeCourant = new ObjetElement();
    this.indiceParDefaut = 0;
    this.listeTabs = new ObjetListeElements();
    this.ongletAffiche = this.getGenreOngletSelectionne();
    this.moteur = new MoteurDernieresNotes();
    this.moteurBulletin = new ObjetMoteurReleveBulletin();
  }
  construireInstances() {
    this.idListeDevoirs = this.add(
      ObjetListe,
      _evenementListeDevoirs.bind(this),
      _initialiserListeDevoirs.bind(this),
    );
    this.identSelection = this.add(
      ObjetSelection,
      this.surSelectionPeriode,
      _initSelecteur.bind(this),
    );
    this.identTabs = this.add(ObjetTabOnglets, _eventSurTabs.bind(this));
    const lElementDate = new ObjetElement(
      GTraductions.getValeur("Date"),
      null,
      TypeOngletDernieresNotes.ParDate,
      null,
      false,
    );
    this.listeTabs.addElement(lElementDate);
    const lElementMatiere = new ObjetElement(
      GTraductions.getValeur("Matiere"),
      null,
      TypeOngletDernieresNotes.ParMatiere,
      null,
      false,
    );
    this.listeTabs.addElement(lElementMatiere);
    this.AddSurZone = [this.identSelection, this.identTabs];
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.GenreStructure = EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    return `<section class="ListeDernieresNotes full-height" id="${this.getInstance(this.idListeDevoirs).getNom()}"></section>`;
  }
  getGenreOngletSelectionne() {
    return GEtatUtilisateur.infosSupp.DernieresNotesMobile
      .genreOngletSelectionne;
  }
  sauverGenreOngletSelectionne(aGenreOnglet) {
    GEtatUtilisateur.infosSupp.DernieresNotesMobile.genreOngletSelectionne =
      aGenreOnglet;
  }
  getDevoirWidgetSelectionne() {
    return GEtatUtilisateur.infosSupp.DernieresNotesMobile
      .devoirWidgetSelectionne;
  }
  recupererDonnees() {
    const lOngletInfosPeriodes = GEtatUtilisateur.getOngletInfosPeriodes();
    this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
    if (this.listePeriodes && this.listePeriodes.count() > 0) {
      const lNrPeriodeParDefaut =
        GEtatUtilisateur.getPage() && GEtatUtilisateur.getPage().periode
          ? GEtatUtilisateur.getPage().periode.getNumero()
          : lOngletInfosPeriodes.periodeParDefaut.getNumero();
      this.indiceParDefaut =
        this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
      if (!this.indiceParDefaut) {
        this.indiceParDefaut = 0;
      }
      this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
      this.getInstance(this.identSelection).setDonnees(
        this.listePeriodes,
        this.indiceParDefaut,
      );
    }
  }
  actionSurRecupererNotes(aListe) {
    this.donnees = aListe;
    this.listeTabs.getElementParGenre(TypeOngletDernieresNotes.ParDate).Actif =
      true;
    this.listeTabs.getElementParGenre(
      TypeOngletDernieresNotes.ParMatiere,
    ).Actif = true;
    if (!this.donnees.listeDevoirs.count()) {
      const lMessage =
        typeof EGenreMessage.PasDeNotes === "number"
          ? GTraductions.getValeur("Message")[EGenreMessage.PasDeNotes]
          : EGenreMessage.PasDeNotes;
      _afficherMessage.call(this, lMessage);
      this.getInstance(this.identTabs).setDonnees(new ObjetListeElements());
      this.getInstance(this.identTabs).setVisible(false);
    } else {
      const lListeDevoirs = new ObjetListeElements();
      this.donnees.listeDevoirs.parcourir((D) => {
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
      let lIndiceOngletASelectionner = -1;
      for (let i = 0; i < this.listeTabs.count(); i++) {
        if (this.listeTabs.get(i).getGenre() === this.ongletAffiche) {
          lIndiceOngletASelectionner = i;
          break;
        }
      }
      if (lIndiceOngletASelectionner === -1) {
        lIndiceOngletASelectionner = TypeOngletDernieresNotes.ParDate;
      }
      this.getInstance(this.identTabs).setDonnees(
        this.listeTabs,
        lIndiceOngletASelectionner,
        true,
      );
      this.getInstance(this.identTabs).setVisible(true);
    }
  }
  recupererDernieresNotes() {
    new ObjetRequeteDernieresNotes(
      this,
      this.actionSurRecupererNotes,
    ).lancerRequete({ periode: this.periodeCourant });
  }
  evntCorrigeQCM(aExecutionQCM) {
    if (aExecutionQCM) {
      this.callback.appel({
        genreOnglet: GEtatUtilisateur.genreOnglet,
        executionQCM: aExecutionQCM,
      });
    }
  }
  surSelectionPeriode(aParam) {
    this.periodeCourant = aParam.element;
    this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
      this.periodeCourant,
    );
    this.recupererDernieresNotes();
  }
}
function _afficherMessage(aMessage) {
  GHtml.setHtml(
    this.getInstance(this.idListeDevoirs).getNom(),
    this.composeAucuneDonnee(aMessage),
  );
}
function _initialiserListeDevoirs(aInstance) {
  const lOptionsListe = { skin: ObjetListe.skin.flatDesign };
  aInstance.setOptionsListe(lOptionsListe);
}
function _evenementListeDevoirs(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.SelectionClick: {
      _surClickListe.call(this, aParametres);
      break;
    }
    case EGenreEvenementListe.Selection: {
      if (!aParametres.surInteractionUtilisateur) {
        _surClickListe.call(this, aParametres);
      }
      break;
    }
  }
}
function _surClickListe(aParametres) {
  const lSelection = aParametres.article;
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsNote, {
    pere: this,
    evenement: (aNumerobouton, aParams) => {
      if (aParams && aParams.executionQCM) {
        this.evntCorrigeQCM(aParams.executionQCM);
      }
    },
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre:
          lSelection.getGenre() === EGenreRessource.Service
            ? GTraductions.getValeur("DernieresNotes.DetailsDuService")
            : GTraductions.getValeur("DernieresNotes.DetailsDuDevoir"),
        largeur: 600,
        hauteur: 300,
        heightMax_mobile: true,
        listeBoutons: [GTraductions.getValeur("principal.fermer")],
        modale: false,
      });
    },
  }).setDonnees(lSelection, this.donnees, {
    estUnService: lSelection.getGenre() === EGenreRessource.Service,
    libelleMoyenneDuPublicService: lSelection.estServiceEnGroupe
      ? GTraductions.getValeur("DernieresNotes.Moyenne_groupe")
      : GTraductions.getValeur("DernieresNotes.Moyenne_classe"),
    libelleMoyenneDuPublicDevoir: lSelection.estEnGroupe
      ? GTraductions.getValeur("DernieresNotes.Moyenne_groupe")
      : GTraductions.getValeur("DernieresNotes.Moyenne_classe"),
    commentaireEnTitre: true,
    getPiecesJointes: this.moteurBulletin.composePieceJointeDevoir.bind(this),
    callBackSurClicMethodeCalculMoyenne:
      _surClicMethodeCalculMoyenne.bind(this),
    callBackSurClicPrecedentSuivant: _surClickProchainElement.bind(this),
  });
}
function _eventSurTabs(aParams) {
  if (!!aParams) {
    this.ongletAffiche = aParams.getGenre();
    this.sauverGenreOngletSelectionne(this.ongletAffiche);
    const lListeDevoirs = this.getInstance(this.idListeDevoirs);
    const lDonneesListe = new DonneesListe_DernieresNotes(this.listeDevoirs, {
      avecServices: this.ongletAffiche === TypeOngletDernieresNotes.ParMatiere,
      afficherMoyenneService: true,
      afficherMoyenneDevoir: true,
      avecDetailService: this.donnees.avecDetailService,
      avecDetailDevoir: this.donnees.avecDetailDevoir,
      callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
      htmlTotal: this.donnees.moyenneGenerale
        ? this.moteur.composeLigneTotaleDernieresNotes(
            this.donnees.moyenneGenerale,
          )
        : "",
    });
    lListeDevoirs.setDonnees(lDonneesListe);
    const lDevoirWidgetSelectionne = this.getDevoirWidgetSelectionne();
    if (!!lDevoirWidgetSelectionne && lDevoirWidgetSelectionne.existeNumero()) {
      const lIndice = this.listeDevoirs.getIndiceElementParFiltre(
        (aDevoir) =>
          aDevoir.getNumero() === lDevoirWidgetSelectionne.getNumero(),
      );
      if (lIndice !== -1) {
        lListeDevoirs.selectionnerLigne({
          ligne: lIndice,
          avecScroll: true,
          avecEvenement: true,
        });
      }
      GEtatUtilisateur.infosSupp.DernieresNotesMobile.devoirWidgetSelectionne =
        null;
    }
  }
}
function _surClicMethodeCalculMoyenne(aInstanceFenetreMCM, aService) {
  const lEleve = GEtatUtilisateur.getMembre();
  const lClasse = lEleve.Classe;
  const lPeriode = this.periodeCourant;
  const lParametresCalcul = {
    libelleEleve: lEleve.getLibelle(),
    numeroEleve: lEleve.getNumero(),
    libelleClasse: lClasse.getLibelle(),
    numeroClasse: lClasse.getNumero(),
    libelleServiceNotation: aService.getLibelle(),
    numeroServiceNotation: aService.getNumero(),
    numeroPeriodeNotation: lPeriode.getNumero(),
    genreChoixNotation: lPeriode.getGenre(),
    moyenneTrimestrielle: true,
    pourMoyenneNette: true,
  };
  aInstanceFenetreMCM.setDonnees(lParametresCalcul);
}
function _surClickProchainElement(
  aNumeroElement,
  aGenreElement,
  aRechercheSuivant,
) {
  let lIndexElement = this.listeDevoirs.getIndiceParNumeroEtGenre(
    aNumeroElement,
    aGenreElement,
  );
  if (lIndexElement === undefined) {
    lIndexElement = 0;
  }
  const lNbTotalElements = this.listeDevoirs.count();
  let lProchainElement;
  if (lNbTotalElements > 1) {
    let lIndexProchainElement = aRechercheSuivant
      ? lIndexElement + 1
      : lIndexElement - 1;
    while (!lProchainElement && lIndexProchainElement !== lIndexElement) {
      if (lIndexProchainElement < 0) {
        lIndexProchainElement = lNbTotalElements - 1;
      }
      if (lIndexProchainElement === lNbTotalElements) {
        lIndexProchainElement = 0;
      }
      const lElementTemp = this.listeDevoirs.get(lIndexProchainElement);
      const lAvecAction =
        lElementTemp.getGenre() === EGenreRessource.Service
          ? this.donnees.avecDetailService
          : this.donnees.avecDetailDevoir;
      if (lElementTemp.getGenre() === aGenreElement && lAvecAction) {
        lProchainElement = lElementTemp;
      } else {
        lIndexProchainElement = aRechercheSuivant
          ? lIndexProchainElement + 1
          : lIndexProchainElement - 1;
      }
    }
  }
  return lProchainElement;
}
function _initSelecteur(aInstance) {
  aInstance.setParametres({
    labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
  });
}
module.exports = InterfacePageDernieresNotes;

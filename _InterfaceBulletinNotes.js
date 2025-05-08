const { InterfacePage } = require("InterfacePage.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { DonneesListe_BulletinNotes } = require("DonneesListe_BulletinNotes.js");
const { ObjetRequetePageBulletins } = require("ObjetRequetePageBulletins.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { ObjetFicheGraphe } = require("ObjetFicheGraphe.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GUID } = require("GUID.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class _InterfaceBulletinNotes extends InterfacePage {
  constructor(aNom, aIdent, aPere, aEvenement, aParam) {
    super(aNom, aIdent, aPere, aEvenement);
    this.param = $.extend(
      { avecSaisie: false, avecInfosEleve: false, avecDocsATelecharger: false },
      aParam,
    );
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurPdB = new ObjetMoteurPiedDeBulletin();
    this.idBulletin = GUID.getId();
  }
  instancierCombos() {}
  instancierBulletin() {}
  instancierPiedBulletin() {}
  instancierDocsATelecharger() {}
  instancierAssistantSaisie() {}
  addSurZoneAssistantSaisie() {}
  addSurZoneFichesEleve() {}
  addSurZoneDatePublicationBulletin() {}
  addSurZoneAccuseReception() {
    return false;
  }
  getListeTypesAppreciations() {}
  getListeAnnotationsPourAvisReligion() {}
  estCtxEleve() {
    const lEleve = this.getEleve();
    return lEleve !== null && lEleve !== undefined && lEleve.existeNumero();
  }
  getEleve() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
  }
  getClasse() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
  }
  getPeriode() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
  setPeriode(aElementPeriode) {
    GEtatUtilisateur.Navigation.setRessource(
      EGenreRessource.Periode,
      aElementPeriode,
    );
  }
  construireInstances() {
    this.identTripleCombo = this.instancierCombos();
    if (
      this.identTripleCombo !== null &&
      this.identTripleCombo !== undefined &&
      this.getInstance(this.identTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
    this.identListe = this.instancierBulletin();
    this.identPiedPage = this.instancierPiedBulletin();
    if (this.param.avecGraphe) {
      this.identFicheGraphe = this.add(ObjetFicheGraphe);
    }
    if (this.param.avecSaisie) {
      this.instancierAssistantSaisie();
    }
    if (this.param.avecInfosEleve) {
      this.construireFicheEleveEtFichePhoto();
    }
    if (this.param.avecDocsATelecharger) {
      this.identDocumentsATelecharger = this.instancierDocsATelecharger();
    }
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div style="height:100%">');
    H.push('<div style="height:100%" id="', this.idBulletin, '">');
    H.push(
      '<div class="Espace" id="',
      this.getInstance(this.identListe).getNom(),
      '"></div>',
    );
    H.push(
      '<div class="Espace AlignementBas" id="',
      this.getInstance(this.identPiedPage).getNom(),
      '"></div>',
    );
    H.push("</div>");
    if (this.param.avecDocsATelecharger) {
      if (this.getInstance(this.identDocumentsATelecharger)) {
        H.push(
          '<div class="Espace" id="' +
            this.getInstance(this.identDocumentsATelecharger).getNom() +
            '" style="display:none; height:100%;width: 70rem;"></div>',
        );
      }
    }
    H.push("</div>");
    return H.join("");
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
    this.addSurZoneDatePublicationBulletin();
    const lAvecAR = this.addSurZoneAccuseReception();
    if (this.param.avecGraphe) {
      if (!lAvecAR) {
        this.AddSurZone.push({ separateur: true });
      }
      this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
    }
    if (this.param.avecSaisie) {
      this.addSurZoneAssistantSaisie();
    }
    if (this.param.avecInfosEleve) {
      this.addSurZoneFichesEleve();
    }
  }
  evenementAfficherMessage(aGenreMessage) {
    $("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
      "display",
      "none",
    );
    this._evenementAfficherMessage(aGenreMessage);
  }
  envoyerRequeteBulletin(aParam) {
    new ObjetRequetePageBulletins(
      this,
      this.actionSurRecupererDonnees.bind(this),
    ).lancerRequete(aParam);
  }
  actionSurRecupererDonnees(aParam) {
    this.setGraphe(null);
    if (aParam.Message) {
      this.evenementAfficherMessage(aParam.Message);
      _masquerVisibilitePiedPage.call(this, true);
      this.desactiverImpression();
    } else {
      _masquerVisibilitePiedPage.call(this, false);
      $.extend(this, aParam.aCopier);
      this.donneesAbsences = aParam.absences;
      if (this.param.avecSaisie) {
        this.getListeAnnotationsPourAvisReligion();
      }
      _afficherBulletin.call(this);
      _afficherPiedPage.call(this);
      if (
        GApplication.droits.get(
          TypeDroits.autoriserImpressionBulletinReleveBrevet,
        )
      ) {
        _activerImpression.call(this);
      }
    }
    if (this.param.avecGraphe && !!this.identFicheGraphe) {
      this.getInstance(this.identFicheGraphe).fermer();
    }
    if (!aParam.Message) {
      this.afficherBandeau(true);
      if (aParam.aCopier.graph) {
        this.setGraphe({
          image: [aParam.aCopier.graph],
          titre: GTraductions.getValeur("BulletinEtReleve.titreGraphe"),
          message: GTraductions.getValeur(
            "BulletinEtReleve.pasDAffichageGraphe",
          ),
          alt: _construireAltGraph.call(this),
        });
      }
      this.surResizeInterface();
    }
  }
  desactiverImpression() {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
  }
  initPiedPage(aParam) {
    const lInstancePdP = this.getInstance(this.identPiedPage);
    const lParam = {
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
      typeContexteBulletin: aParam.typeContexteBulletin,
      avecSaisie: this.param.avecSaisie,
    };
    if (this.param.avecSaisie) {
      const lContexte = {
        classe: this.getClasse(),
        periode: this.getPeriode(),
        eleve: this.getEleve(),
        service: null,
        typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
      };
      $.extend(lParam, {
        avecValidationAuto: true,
        clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(
          this,
          lContexte,
        ),
      });
    }
    this.moteurPdB.initPiedPage(lInstancePdP, lParam);
    lInstancePdP.initialiser(true);
  }
}
function _activerImpression() {
  const lGenreImpression = this.moteur.getGenreImpression({
    typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
  });
  Invocateur.evenement(
    ObjetInvocateur.events.activationImpression,
    lGenreImpression,
    this,
    lGenreImpression === EGenreImpression.GenerationPDF
      ? getParametresPDF.bind(this)
      : null,
  );
}
function getParametresPDF() {
  const lParam = {
    genreGenerationPDF: this.moteur.getGenreGenerationPdf({
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
    }),
    periode: this.getPeriode(),
    avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
  };
  if (this.param.avecSaisie) {
    $.extend(lParam, { classe: this.getClasse(), eleve: this.getEleve() });
  }
  return lParam;
}
function _clbckValidationAutoSurEdition(aCtx, aParam) {
  this.moteurPdB.clbckValidationAutoSurEditionPdB(
    $.extend(aCtx, {
      clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
    }),
    aParam,
  );
}
function _afficherPiedPage() {
  if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
    this.getInstance(this.identPiedPage).setDonnees({
      donnees: this.PiedDePage,
      absences: this.donneesAbsences,
    });
  }
}
function _masquerVisibilitePiedPage(aMasquer) {
  if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
    $("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
      "display",
      aMasquer ? "none" : "",
    );
  }
}
function _afficherBulletin() {
  const lExisteEleve = this.estCtxEleve();
  this.listeElementsLineaire = this.moteur._getListeDonneesLineaire(
    this.ListeElements,
    { typeReleveBulletin: TypeReleveBulletin.BulletinNotes },
  );
  const lDonneesAcRegroup = this.moteur._formatterDonneesPourRegroupements.call(
    this,
    this.listeElementsLineaire,
    this.tableauSurMatieres,
    { typeReleveBulletin: TypeReleveBulletin.BulletinNotes },
  );
  let lParamDonneesListe = {
    instanceListe: this.getInstance(this.identListe),
    estCtxClasse: !lExisteEleve,
    affichage: this.Affichage,
    estEnConsultation: !this.param.avecSaisie,
    saisie: this.param.avecSaisie && this.ServiceEditable,
    periode: GEtatUtilisateur.getPeriode(),
    total: this.MoyenneGenerale,
  };
  if (this.param.avecSaisie) {
    lParamDonneesListe = $.extend(lParamDonneesListe, {
      baremeNotationNiveau:
        this.baremeNotationNiveau !== null &&
        this.baremeNotationNiveau !== undefined
          ? this.baremeNotationNiveau
          : GParametres.baremeNotation,
      avecCrayonEltPgm:
        GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
        lExisteEleve,
      tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
        estCtxPied: false,
        eleve: this.getEleve(),
        typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
      }),
    });
  }
  this.getInstance(this.identListe).setDonnees(
    new DonneesListe_BulletinNotes(lDonneesAcRegroup, lParamDonneesListe),
  );
}
function _construireAltGraph() {
  const H = [];
  if (this.ListeElements && this.ListeElements.count()) {
    H.push(
      GTraductions.getValeur("BulletinEtReleve.BaremeClasse", [
        this.moteur.getStrNote(this.baremeParDefaut),
      ]),
    );
    this.ListeElements.parcourir((aService) => {
      if (
        aService.MoyenneClasse &&
        aService.MoyenneClasse.estUneValeur() &&
        aService.MoyenneEleve &&
        aService.MoyenneEleve.estUneValeur()
      ) {
        H.push(
          `${aService.getLibelle()} : ${GTraductions.getValeur("BulletinEtReleve.MoyEleve")} ${this.moteur.getStrNote(aService.MoyenneEleve)} ${GTraductions.getValeur("BulletinEtReleve.MoyenneClasse")} ${this.moteur.getStrNote(aService.MoyenneClasse)}`,
        );
      }
    });
  }
  return H.join(". ");
}
module.exports = { _InterfaceBulletinNotes };

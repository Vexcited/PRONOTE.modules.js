const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  ObjetRequetePageFicheBrevet,
} = require("ObjetRequetePageFicheBrevet.js");
const {
  ObjetRequeteSaisieFicheBrevet,
} = require("ObjetRequeteSaisieFicheBrevet.js");
const { GUID } = require("GUID.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeNote } = require("TypeNote.js");
const {
  DonneesListe_FicheBrevetBilan,
} = require("DonneesListe_FicheBrevetBilan.js");
const {
  DonneesListe_FicheBrevetCompetence,
} = require("DonneesListe_FicheBrevetCompetence.js");
const {
  DonneesListe_FicheBrevetControle,
} = require("DonneesListe_FicheBrevetControle.js");
const { EGenreNiveauDAcquisition } = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { Type3Etats } = require("Type3Etats.js");
const {
  TypeEnseignementComplement,
  TypeEnseignementComplementUtil,
} = require("TypeEnseignementComplement.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { TypeMentionBrevetUtil } = require("TypeMentionBrevet.js");
const {
  TypePointsEnseignementComplementUtil,
} = require("TypePointsEnseignementComplement.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class InterfaceFicheBrevet extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.idPage = GUID.getId();
    this.idMessage = GUID.getId();
    this._autorisations = {
      saisieAppreciationsGenerales: GApplication.droits.get(
        TypeDroits.avecSaisieAppreciationsGenerales,
      ),
      tailleMaxAppreciation: GParametres.getTailleMaxAppreciationParEnumere(
        TypeGenreAppreciation.GA_BilanAnnuel_Generale,
      ),
    };
    this.donneesRecu = false;
    this._initDonneesSaisie();
  }
  _initDonneesSaisie() {
    this.donneesSaisie = {
      listeEnseignementComplements: TypeEnseignementComplementUtil.toListe(),
      listePointsEnseignementComplement:
        TypePointsEnseignementComplementUtil.toListe(true),
      listeMentions: TypeMentionBrevetUtil.toListe(),
      listeAvis: new ObjetListeElements(),
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInformationDatePublication: function () {
        let lStr = "";
        if (aInstance.strInfoDatePublication) {
          lStr = ` ${aInstance.estCFG ? GTraductions.getValeur("FicheBrevet.certificatDeFormationGenerale") : GTraductions.getValeur("FicheBrevet.ficheBrevet")} - ${aInstance.strInfoDatePublication}`;
        }
        return lStr;
      },
      textarea: {
        getValue: function () {
          return aInstance.appGenerale &&
            aInstance.appGenerale.appreciationAnnuelle
            ? aInstance.appGenerale.appreciationAnnuelle.getLibelle()
            : "";
        },
        setValue: function (aValue) {
          aInstance.appGenerale.appreciationAnnuelle.setLibelle(aValue);
          aInstance.appGenerale.appreciationAnnuelle.setEtat(
            EGenreEtat.Modification,
          );
          aInstance.setEtatSaisie(true);
        },
        getDisabled: function () {
          return !aInstance._autorisations.saisieAppreciationsGenerales;
        },
      },
      cbRecu: {
        getValue: function () {
          if (aInstance.donneesRecu) {
            return aInstance.appGenerale
              ? aInstance.appGenerale.recu.getGenre() === Type3Etats.TE_Oui
              : false;
          }
        },
        setValue: function (aValue) {
          if (aValue) {
            aInstance.appGenerale.recu.Genre = Type3Etats.TE_Oui;
          } else {
            aInstance.appGenerale.recu.Genre = Type3Etats.TE_Inconnu;
          }
          aInstance.appGenerale.recu.setEtat(EGenreEtat.Modification);
          aInstance
            .getInstance(aInstance.identRecuAjourne)
            .setDonnees(aInstance.donneesSaisie.listeMentions, 0);
          aInstance
            .getInstance(aInstance.identRecuAjourne)
            .setActif(
              aInstance._autorisations.saisieAppreciationsGenerales &&
                aInstance.appGenerale.recu.getGenre() === Type3Etats.TE_Oui,
            );
          aInstance.setEtatSaisie(true);
        },
        getDisabled: function () {
          return !aInstance._autorisations.saisieAppreciationsGenerales;
        },
      },
      cbAjourne: {
        getValue: function () {
          if (aInstance.donneesRecu) {
            return aInstance.appGenerale
              ? aInstance.appGenerale.recu.getGenre() === Type3Etats.TE_Non
              : false;
          }
        },
        setValue: function (aValue) {
          if (aValue) {
            aInstance.appGenerale.recu.Genre = Type3Etats.TE_Non;
          } else {
            aInstance.appGenerale.recu.Genre = Type3Etats.TE_Inconnu;
          }
          aInstance.appGenerale.recu.setEtat(EGenreEtat.Modification);
          if (!aInstance.estCFG) {
            aInstance
              .getInstance(aInstance.identRecuAjourne)
              .setDonnees(aInstance.donneesSaisie.listeMentions, 0);
            aInstance
              .getInstance(aInstance.identRecuAjourne)
              .setActif(
                aInstance._autorisations.saisieAppreciationsGenerales &&
                  aInstance.appGenerale.recu.getGenre() === Type3Etats.TE_Oui,
              );
          }
          aInstance.setEtatSaisie(true);
        },
        getDisabled: function () {
          return !aInstance._autorisations.saisieAppreciationsGenerales;
        },
      },
      estPasCFG() {
        return !aInstance.estCFG;
      },
      estCFG() {
        return !!aInstance.estCFG;
      },
    });
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.IdentPage;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.IdentTripleCombo);
    this.AddSurZone.push({
      html: '<span ie-html="getInformationDatePublication"></span>',
    });
    if (this.avecFicheEleve()) {
      this.AddSurZone.push({ separateur: true });
    }
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
  }
  construireInstances() {
    this.IdentTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    this.identListeCompetence = this.add(
      ObjetListe,
      _evntListe.bind(this),
      _initialiserCompetence,
    );
    this.identEnseignementCompl = this.add(
      ObjetSaisie,
      this._enseignementCompl,
      this.initialiserEnseignementCompl,
    );
    this.identEnseignementComplPoints = this.add(
      ObjetSaisie,
      this._enseignementComplPoints,
      this.initialiserEnseignementComplPoints,
    );
    this.identEnseignementComplAvis = this.add(
      ObjetSaisie,
      this._enseignementComplAvis,
      this.initialiserEnseignementComplAvis,
    );
    this.identListeControle = this.add(
      ObjetListe,
      null,
      this.initialiserControle,
    );
    this.identListeBrevet = this.add(ObjetListe, null, _initialiserBrevet);
    this.identRecuAjourne = this.add(
      ObjetSaisie,
      _eventMention.bind(this),
      this.initialiserRecuAjourne,
    );
    this.construireFicheEleveEtFichePhoto();
    this.IdPremierElement = this.getInstance(
      this.IdentTripleCombo,
    ).getPremierElement();
  }
  evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
    this.NumeroClasse = aLigneClasse.getNumero();
    this.NumeroEleve = aLigneEleve.getNumero();
    this.eleve = aLigneEleve;
    this.NumeroPeriode = aLignePeriode.getNumero();
    this.GenrePeriode = aLignePeriode.getGenre();
    this.surSelectionEleve();
    this.afficherPage();
  }
  initMenuContextuelListe(aParametres) {
    TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
      instance: this,
      menuContextuel: aParametres.menuContextuel,
      genreChoixValidationCompetence:
        TypeGenreValidationCompetence.tGVC_Competence,
      callbackNiveau: this.evenementSurFenetre.bind(this),
      avecDispense: this.competenceSelectionnee.estPilierLVE,
    });
  }
  evenementSurFenetre(aGenreBouton, aNiveauAcquisition) {
    if (
      aGenreBouton &&
      this.competenceSelectionnee.niveauDAcquisition.getNumero() !==
        aNiveauAcquisition.getNumero()
    ) {
      _mettreAJourNiveauDAcquisitionDeCompetenceSelectionnee.call(
        this,
        aNiveauAcquisition,
      );
    }
  }
  _enseignementCompl(aParams) {
    switch (aParams.genreEvenement) {
      case EGenreEvenementObjetSaisie.selection:
        if (
          this.complements.enseignementComplement.getGenre() !==
          aParams.element.getGenre()
        ) {
          this.complements.enseignementComplement = new ObjetElement(
            "",
            undefined,
            aParams.element.getGenre(),
          );
          this.complements.enseignementComplement.setEtat(
            EGenreEtat.Modification,
          );
          this.setEtatSaisie(true);
          this.getInstance(this.identEnseignementComplPoints).setActif(
            aParams.element.getGenre() !== TypeEnseignementComplement.tecAucun,
          );
          this.getInstance(this.identEnseignementComplPoints).setSelection(0);
        }
        break;
      default:
        break;
    }
  }
  _enseignementComplAvis(aParams) {
    if (
      aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
      aParams.element.getNumero() !==
        this.appGenerale.avisChefDEtablissement.getNumero()
    ) {
      this.appGenerale.avisChefDEtablissement = aParams.element;
      this.appGenerale.avisChefDEtablissement.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
    }
  }
  _enseignementComplPoints(aParams) {
    switch (aParams.genreEvenement) {
      case EGenreEvenementObjetSaisie.selection:
        if (
          this.complements.nombreDePoints.getGenre() !==
          aParams.element.getGenre()
        ) {
          this.complements.nombreDePoints = new ObjetElement(
            "",
            undefined,
            aParams.element.getGenre(),
          );
          this.complements.nombreDePoints.setEtat(EGenreEtat.Modification);
          this.setEtatSaisie(true);
          const lPoints = TypePointsEnseignementComplementUtil.getPoints(
            aParams.element.getGenre(),
          );
          _mettreAJourLigneEnseignementComplement.call(this, lPoints);
        }
        break;
      default:
        break;
    }
  }
  evenementAfficherMessage(aGenreMessage) {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    GHtml.setDisplay(this.idPage, false);
    GHtml.setDisplay(this.idMessage, true);
    this.afficherBandeau(true);
    const lMessage =
      typeof aGenreMessage === "number"
        ? GTraductions.getValeur("Message")[aGenreMessage]
        : aGenreMessage;
    GHtml.setHtml(this.idMessage, this.composeMessage(lMessage));
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
    aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
  }
  initialiserEnseignementCompl(aInstance) {
    aInstance.setOptionsObjetSaisie({ longueur: 200, classTexte: "Gras" });
  }
  initialiserEnseignementComplPoints(aInstance) {
    aInstance.setOptionsObjetSaisie({ longueur: 150, classTexte: "Gras" });
  }
  initialiserEnseignementComplAvis(aInstance) {
    aInstance.setOptionsObjetSaisie({
      longueur: 200,
      texteEdit: GTraductions.getValeur("FicheBrevet.AvisChefEtablissement"),
      styleTexteEdit: "margin:15px;font-weight: normal;",
      classTexte: "Gras",
    });
  }
  initialiserRecuAjourne(aInstance) {
    aInstance.setOptionsObjetSaisie({ longueur: 150, classTexte: "Gras" });
  }
  initialiserControle(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_FicheBrevetControle.colonnes.controle,
      taille: 650,
      titre: GTraductions.getValeur("FicheBrevet.titre.ControleFinal"),
    });
    lColonnes.push({
      id: DonneesListe_FicheBrevetControle.colonnes.points,
      taille: 100,
      titre: GTraductions.getValeur("FicheBrevet.titre.Points"),
    });
    lColonnes.push({
      id: DonneesListe_FicheBrevetControle.colonnes.bareme,
      taille: 100,
      titre: GTraductions.getValeur("FicheBrevet.titre.Bareme"),
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      avecLigneTotal: true,
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div id="',
      this.idPage,
      '" class="p-all-l" style="display: none;">',
    );
    H.push(
      '<div class="m-bottom-xl" id="',
      this.getNomInstance(this.identListeCompetence),
      '"></div>',
    );
    H.push('<div class="m-bottom-xl" ie-display="estPasCFG">');
    H.push(
      '<h4 class="m-left-xl semi-bold">',
      GTraductions.getValeur("FicheBrevet.EnseignementsComplements"),
      "</h4>",
    );
    H.push(
      '<div class="flex-contain flex-center flex-gap-xl p-bottom-xl m-top">',
    );
    H.push(
      '<div id="',
      this.getNomInstance(this.identEnseignementCompl),
      '"></div>',
    );
    H.push(
      '<div id="',
      this.getNomInstance(this.identEnseignementComplPoints),
      '"></div>',
    );
    H.push("</div>");
    H.push('<div style="width:870px;">');
    H.push(
      '<fieldset class="Bordure">',
      "<legend>",
      GTraductions.getValeur("FicheBrevet.AppreciationGenerale"),
      "</legend>",
      '<div id="',
      this.getNomInstance(this.identEnseignementComplAvis),
      '"></div>',
      '<ie-textareamax ie-model="textarea" rows="5" style="width: 850px; height:66px;" maxlength="',
      this._autorisations.tailleMaxAppreciation,
      '"></ie-textareamax>',
      "</fieldset>",
    );
    H.push("</div>");
    H.push("</div>");
    H.push(
      '<div id="',
      this.getNomInstance(this.identListeControle),
      '"></div><br><br>',
    );
    H.push(
      '<div id="',
      this.getNomInstance(this.identListeBrevet),
      '"></div><br><br>',
    );
    H.push('<div class="noWrap">');
    H.push(
      '<div class="InlineBlock AlignementMilieuVertical" style="margin-right: 20px;"><ie-checkbox ie-model="cbRecu">',
      GTraductions.getValeur("FicheBrevet.Recu"),
      "</ie-checkbox></div>",
    );
    H.push(
      '<div class="InlineBlock AlignementMilieuVertical" ie-display="estPasCFG" id="',
      this.getNomInstance(this.identRecuAjourne),
      '"></div>',
    );
    H.push(
      '<div class="InlineBlock AlignementMilieuVertical" style="margin-left: 20px;"><ie-checkbox ie-model="cbAjourne">',
      GTraductions.getValeur("FicheBrevet.Ajourne"),
      "</ie-checkbox></div>",
    );
    H.push("</div>");
    H.push("</div>");
    H.push('<div id="', this.idMessage, '"></div>');
    return H.join("");
  }
  afficherPage() {
    this.setEtatSaisie(false);
    new ObjetRequetePageFicheBrevet(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete({ eleve: this.eleve });
  }
  actionSurRecupererDonnees(aJSON) {
    if (aJSON.message) {
      this.evenementAfficherMessage(aJSON.message);
    } else {
      this.estCFG = aJSON.estCFG;
      this.appGenerale = aJSON.appGenerale;
      this.competences = aJSON.competences;
      this.controlFinal = aJSON.controlFinal;
      if (this.estCFG) {
        this.initCFG(aJSON);
        return;
      }
      this.donneesRecu = true;
      this._autorisations.saisieAppreciationsGenerales =
        aJSON.saisieAppreciationsGenerales;
      this._autorisations.saisieEnseignementDeComplement =
        aJSON.saisieEnseignementDeComplement;
      this.strInfoDatePublication = aJSON.strInfoDatePublication;
      GHtml.setDisplay(this.idPage, true);
      GHtml.setDisplay(this.idMessage, false);
      this.complements = aJSON.Complements;
      this.donneesSaisie.listeAvis = aJSON.listeAvis;
      const lIndiceEnseignCompl =
        this.donneesSaisie.listeEnseignementComplements.getIndiceParElement(
          this.complements.enseignementComplement,
        );
      const lIndiceEnseignPoint =
        this.donneesSaisie.listePointsEnseignementComplement.getIndiceParElement(
          this.complements.nombreDePoints,
        );
      this.donneesSaisie.listeAvis.insererElement(
        new ObjetElement("", 0, -1),
        0,
      );
      const lIndiceListeAvis = this.donneesSaisie.listeAvis.getIndiceParElement(
        this.appGenerale.avisChefDEtablissement,
      );
      _initialisationDonnees.call(this);
      const lIndiceMentionBrevet =
        this.donneesSaisie.listeMentions.getIndiceParElement(
          this.appGenerale.mention,
        );
      const lIndices = {
        enseignementComplement: lIndiceEnseignCompl,
        pointsEnseignementComplement: lIndiceEnseignPoint,
        mentionBrevet: lIndiceMentionBrevet,
        avis: lIndiceListeAvis,
      };
      _initSetDonnees.call(this, lIndices);
      this.activerImpression();
    }
  }
  activerImpression() {
    if (
      GApplication.droits.get(
        TypeDroits.autoriserImpressionBulletinReleveBrevet,
      )
    ) {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.GenerationPDF,
        this,
        () => {
          return {
            genreGenerationPDF: TypeHttpGenerationPDFSco.FicheBrevet,
            eleve: this.eleve,
          };
        },
      );
    }
  }
  initCFG(aJSON) {
    this.donneesRecu = true;
    this.strInfoDatePublication = aJSON.strInfoDatePublication;
    GHtml.setDisplay(this.idPage, true);
    GHtml.setDisplay(this.idMessage, false);
    this.recu = aJSON.recu;
    _initialisationDonnees.call(this);
    _initSetDonnees.call(this);
    this.activerImpression();
  }
  valider() {
    new ObjetRequeteSaisieFicheBrevet(
      this,
      this.actionSurValidation,
    ).lancerRequete({
      classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
      palier: this.competences.palier,
      listePiliers: this.competences.listePiliers,
      complements: this.complements,
      appGenerale: this.appGenerale,
    });
  }
}
function _evntListe(aParametres, aGenreEvenementListe, aColonne, aLigne) {
  this.competenceSelectionnee = this.competences.listePiliers.get(aLigne);
  switch (aGenreEvenementListe) {
    case EGenreEvenementListe.Selection:
      break;
    case EGenreEvenementListe.Edition:
      aParametres.ouvrirMenuContextuel();
      break;
    default:
      break;
  }
}
function _evntMenuContextuel(aElement, aLigne) {
  this.competenceSelectionnee = this.competences.listePiliers.get(aLigne);
  _mettreAJourNiveauDAcquisitionDeCompetenceSelectionnee.call(this, aElement);
}
function _calculTotal() {
  let lReCalculTotal = 0;
  let lAvecBonus = false;
  this.competences.listePiliers.parcourir((aPilier) => {
    if (
      aPilier.estPilierLVE &&
      aPilier.niveauDAcquisition &&
      aPilier.niveauDAcquisition.getGenre() ===
        EGenreNiveauDAcquisition.Dispense
    ) {
      lAvecBonus = true;
    }
    const lValeur = aPilier.points.getValeur();
    lReCalculTotal += isNaN(lValeur) ? 0 : lValeur;
  });
  if (lAvecBonus) {
    lReCalculTotal = Math.ceil((lReCalculTotal * 8) / 7);
  }
  return new TypeNote(lReCalculTotal > 0 ? lReCalculTotal : "");
}
function _mettreAJourNiveauDAcquisitionDeCompetenceSelectionnee(
  aNiveauAcquisition,
) {
  this.competenceSelectionnee.niveauDAcquisition =
    MethodesObjet.dupliquer(aNiveauAcquisition);
  if (this.competenceSelectionnee.niveauDAcquisition.getGenre() === 0) {
    this.competenceSelectionnee.niveauDAcquisition.setLibelle("");
  }
  this.competenceSelectionnee.points =
    TUtilitaireCompetences.getNombrePointsBrevet(aNiveauAcquisition);
  this.competences.totalPoints = _calculTotal.call(this);
  this.competenceSelectionnee.niveauDAcquisition.setEtat(
    EGenreEtat.Modification,
  );
  this.competenceSelectionnee.setEtat(EGenreEtat.FilsModification);
  this.setEtatSaisie(true);
  this.getInstance(this.identListeCompetence).actualiser(true);
  const lLigneCompetence = this.brevet.listeBrevet.getElementParGenre(0);
  lLigneCompetence.points = this.competences.totalPoints;
  lLigneCompetence.bareme = this.competences.totalBareme;
  _mettreAJourLigneEnseignementComplement.call(this);
}
function _mettreAJourLigneEnseignementComplement(aPoints) {
  if (this.estCFG) {
    return;
  }
  const lLigneEnseignCompl = this.brevet.listeBrevet.getElementParGenre(2);
  if (aPoints !== undefined) {
    lLigneEnseignCompl.points = aPoints;
  }
  const lComp = isNaN(this.competences.totalPoints.getValeur())
    ? 0
    : this.competences.totalPoints.getValeur();
  const lTotalPoints = isNaN(lLigneEnseignCompl.points)
    ? this.controlFinal.totalPoints.getValeur() +
      lComp +
      lLigneEnseignCompl.points.getValeur()
    : this.controlFinal.totalPoints.getValeur() + lComp;
  this.brevet.totalPoints = new TypeNote(lTotalPoints);
  this.getInstance(this.identListeBrevet).actualiser(true);
}
function _eventMention(aParams) {
  if (
    aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
    this.appGenerale.mention.getGenre() !== aParams.element.getGenre()
  ) {
    this.appGenerale.mention = new ObjetElement(
      "",
      undefined,
      aParams.element.getGenre(),
    );
    this.appGenerale.mention.setEtat(EGenreEtat.Modification);
    this.setEtatSaisie(true);
  }
}
function _initialiserCompetence(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.competences,
    taille: 400,
    titre: GTraductions.getValeur("FicheBrevet.titre.DomainesSocle"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.maitrise,
    taille: 250,
    titre: GTraductions.getValeur("FicheBrevet.titre.Maitrise"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.points,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Points"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetCompetence.colonnes.bareme,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Bareme"),
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: true,
    avecLigneTotal: true,
  });
}
function _initialiserBrevet(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_FicheBrevetBilan.colonnes.bilan,
    taille: 650,
    titre: this.estCFG
      ? GTraductions.getValeur("FicheBrevet.certificatDeFormationGenerale")
      : GTraductions.getValeur("FicheBrevet.titre.Brevet"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetBilan.colonnes.points,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Points"),
  });
  lColonnes.push({
    id: DonneesListe_FicheBrevetBilan.colonnes.bareme,
    taille: 100,
    titre: GTraductions.getValeur("FicheBrevet.titre.Bareme"),
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: true,
    avecLigneTotal: true,
  });
}
function _initialisationDonnees() {
  const lLigneCompetence = new ObjetElement(
    GTraductions.getValeur("FicheBrevet.ControleContinu"),
    undefined,
    0,
  );
  if (this.competences) {
    lLigneCompetence.points = this.competences.totalPoints;
    lLigneCompetence.bareme = this.competences.totalBareme;
  }
  const lLigneControle = new ObjetElement(
    GTraductions.getValeur("FicheBrevet.titre.ControleFinal"),
    undefined,
    1,
  );
  lLigneControle.points = this.controlFinal.totalPoints;
  lLigneControle.bareme = this.controlFinal.totalBareme;
  const lLigneEnseignCompl = new ObjetElement(
    GTraductions.getValeur("FicheBrevet.EnseignementsComplements"),
    undefined,
    2,
  );
  if (this.complements) {
    lLigneEnseignCompl.points = TypePointsEnseignementComplementUtil.getPoints(
      this.complements.nombreDePoints.getGenre(),
    );
    lLigneEnseignCompl.bareme = new TypeNote("");
  }
  const lTotalP =
    (this.competences.totalPoints.estUneValeur()
      ? this.competences.totalPoints.getValeur()
      : 0) +
    (this.controlFinal.totalPoints.estUneValeur()
      ? this.controlFinal.totalPoints.getValeur()
      : 0) +
    (lLigneEnseignCompl.points && lLigneEnseignCompl.points.estUneValeur()
      ? lLigneEnseignCompl.points.getValeur()
      : 0);
  const lTotalB =
    (this.competences &&
    this.competences.totalBareme &&
    this.competences.totalBareme.estUneValeur()
      ? this.competences.totalBareme.getValeur()
      : 0) +
    (this.controlFinal.totalBareme.estUneValeur()
      ? this.controlFinal.totalBareme.getValeur()
      : 0) +
    (lLigneEnseignCompl.bareme && lLigneEnseignCompl.bareme.estUneValeur()
      ? lLigneEnseignCompl.bareme.getValeur()
      : 0);
  this.brevet = {
    listeBrevet: new ObjetListeElements(),
    totalPoints: new TypeNote(lTotalP ? lTotalP : ""),
    totalBareme: new TypeNote(lTotalB ? lTotalB : ""),
  };
  this.brevet.listeBrevet.addElement(lLigneCompetence);
  this.brevet.listeBrevet.addElement(lLigneControle);
  if (!this.estCFG) {
    this.brevet.listeBrevet.addElement(lLigneEnseignCompl);
  }
}
function _initSetDonnees(aIndices) {
  this.getInstance(this.identListeCompetence).setDonnees(
    new DonneesListe_FicheBrevetCompetence(this.competences, {
      callBackMenuContextuel: _evntMenuContextuel.bind(this),
      initMenuContextuel: this.initMenuContextuelListe.bind(this),
    }),
  );
  this.getInstance(this.identListeControle).setDonnees(
    new DonneesListe_FicheBrevetControle(this.controlFinal),
  );
  _initialiserBrevet.call(this, this.getInstance(this.identListeBrevet));
  this.getInstance(this.identListeBrevet).setDonnees(
    new DonneesListe_FicheBrevetBilan(this.brevet),
  );
  if (!this.estCFG && aIndices) {
    this.getInstance(this.identEnseignementCompl).setDonnees(
      this.donneesSaisie.listeEnseignementComplements,
    );
    this.getInstance(this.identEnseignementCompl).setActif(
      this._autorisations.saisieEnseignementDeComplement,
    );
    this.getInstance(this.identEnseignementCompl).initSelection(
      aIndices.enseignementComplement || 0,
    );
    this.getInstance(this.identEnseignementComplPoints).setDonnees(
      this.donneesSaisie.listePointsEnseignementComplement,
    );
    this.getInstance(this.identEnseignementComplPoints).setActif(
      this._autorisations.saisieEnseignementDeComplement &&
        this.complements.enseignementComplement.getGenre() !==
          TypeEnseignementComplement.tecAucun,
    );
    this.getInstance(this.identEnseignementComplPoints).initSelection(
      aIndices.pointsEnseignementComplement || 0,
    );
    this.getInstance(this.identEnseignementComplAvis).setDonnees(
      this.donneesSaisie.listeAvis,
    );
    this.getInstance(this.identEnseignementComplAvis).setActif(
      this._autorisations.saisieAppreciationsGenerales,
    );
    this.getInstance(this.identEnseignementComplAvis).initSelection(
      aIndices.avis || 0,
    );
    this.getInstance(this.identRecuAjourne).setDonnees(
      this.donneesSaisie.listeMentions,
    );
    this.getInstance(this.identRecuAjourne).setActif(
      this._autorisations.saisieAppreciationsGenerales &&
        this.appGenerale.recu.getGenre() === Type3Etats.TE_Oui,
    );
    this.getInstance(this.identRecuAjourne).initSelection(
      aIndices.mentionBrevet || 0,
    );
  }
}
module.exports = InterfaceFicheBrevet;

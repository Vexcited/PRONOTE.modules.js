const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const {
  ObjetSelecteurTypeRessourceAbsence,
} = require("ObjetSelecteurTypeRessourceAbsence.js");
const { ObjetSelecteurClasseGpe } = require("ObjetSelecteurClasseGpe.js");
const { ObjetSelecteurRegimeEleve } = require("ObjetSelecteurRegimeEleve.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_SelectionMotif,
} = require("ObjetFenetre_SelectionMotif.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetRequeteListeRegimesEleve,
} = require("ObjetRequeteListeRegimesEleve.js");
const {
  DonneesListe_SuiviJustificationsAbsRetards,
} = require("DonneesListe_SuiviJustificationsAbsRetards.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { TUtilitaireListePeriodes } = require("UtilitaireListePeriodes.js");
const {
  TypeHttpSaisieAbsencesGrille,
} = require("TypeHttpSaisieAbsencesGrille.js");
const {
  TypeRessourceAbsence,
  TypeRessourceAbsenceUtil,
} = require("TypeRessourceAbsence.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  ObjetRequeteSaisieAbsencesGrille,
} = require("ObjetRequeteSaisieAbsencesGrille.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetFenetre_SuiviUnique } = require("ObjetFenetre_SuiviUnique.js");
Requetes.inscrire(
  "SuiviJustificationsAbsencesRetards",
  ObjetRequeteConsultation,
);
class InterfaceSuiviJustificationsAbsRetards extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.cacheListes = {
      periodes: TUtilitaireListePeriodes.construireListePeriodes([
        TUtilitaireListePeriodes.choix.aujourdhui,
        TUtilitaireListePeriodes.choix.semainePrecedente,
        TUtilitaireListePeriodes.choix.semaineCourante,
        TUtilitaireListePeriodes.choix.moisCourant,
        TUtilitaireListePeriodes.choix.annee,
        TUtilitaireListePeriodes.choix.periodes,
        TUtilitaireListePeriodes.choix.mois,
      ]),
      motifsAbsences: null,
      motifsRetards: null,
    };
    this.listeTypeRessAbsences = new ObjetListeElements();
    this.listeTypeRessAbsences.addElement(
      new ObjetElement(
        TypeRessourceAbsenceUtil.getLibelle(TypeRessourceAbsence.TR_Absence),
        TypeRessourceAbsence.TR_Absence,
        TypeRessourceAbsence.TR_Absence,
      ),
    );
    this.listeTypeRessAbsences.addElement(
      new ObjetElement(
        TypeRessourceAbsenceUtil.getLibelle(TypeRessourceAbsence.TR_Retard),
        TypeRessourceAbsence.TR_Retard,
        TypeRessourceAbsence.TR_Retard,
      ),
    );
    this.listeTypeRessAbsences.parcourir((aGenreRessource) => {
      aGenreRessource.selectionne = true;
    });
    this.donnees = {
      listeClasses: null,
      listeRegimes: null,
      uniquementNonRA: false,
      dateDebut: null,
      dateFin: null,
      listeAbsencesRetards: null,
    };
  }
  construireInstances() {
    this.identSelecteurTypeRessourceAbs = this.add(
      ObjetSelecteurTypeRessourceAbsence,
      surEvenementSelecteurTypeRessourceAbs.bind(this),
      initSelecteurTypeRessourceAbs.bind(this),
    );
    this.identSelecteurClasses = this.add(
      ObjetSelecteurClasseGpe,
      surEvenementSelecteurClasses.bind(this),
      _initSelecteurClasses,
    );
    this.identSelecteurRegimeEleve = this.add(
      ObjetSelecteurRegimeEleve,
      surEvenementSelecteurRegimes.bind(this),
    );
    this.identListeJustifications = this.add(
      ObjetListe,
      evenementListeJustifications.bind(this),
      _initListeJustifications,
    );
    this.identComboPeriode = this.add(
      ObjetSaisie,
      _evenementSurComboPeriode,
      _initialiserComboPeriode.bind(this),
    );
    this.identDate = this.add(
      ObjetCelluleDate,
      surEvenementSelecteurDate.bind(this, true),
      _initialiserSelecteurDate,
    );
    this.identDate2 = this.add(
      ObjetCelluleDate,
      surEvenementSelecteurDate.bind(this, false),
      _initialiserSelecteurDate,
    );
    this.construireFicheEleveEtFichePhoto();
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identListeJustifications;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identSelecteurTypeRessourceAbs);
    this.AddSurZone.push(this.identSelecteurClasses);
    this.AddSurZone.push(this.identSelecteurRegimeEleve);
    this.AddSurZone.push({
      html:
        '<ie-checkbox ie-model="cbFiltreUniquementNonRA">' +
        GTraductions.getValeur("SuiviJustificationAbsRet.FiltreNonRA") +
        "</ie-checkbox>",
    });
    this.AddSurZone.push({ separateur: true });
    this.AddSurZone.push(
      { html: GTraductions.getValeur("Periode") },
      this.identComboPeriode,
    );
    this.AddSurZone.push(
      { html: GTraductions.getValeur("Du") },
      this.identDate,
    );
    this.AddSurZone.push(
      { html: GTraductions.getValeur("Au") },
      this.identDate2,
    );
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      cbFiltreUniquementNonRA: {
        getValue: function () {
          return aInstance.donnees.uniquementNonRA;
        },
        setValue: function () {
          aInstance.donnees.uniquementNonRA =
            !aInstance.donnees.uniquementNonRA;
          aInstance.lancerRequeteRecuperationJustificationsAbsRetards();
        },
      },
    });
  }
  recupererDonnees() {
    this.getInstance(this.identSelecteurTypeRessourceAbs).actualiserLibelle();
    this.donnees.listeClasses = GEtatUtilisateur.getListeClasses({
      avecClasse: true,
      uniquementClasseEnseignee: true,
    });
    this.getInstance(this.identSelecteurClasses).setDonnees({
      titre: GTraductions.getValeur(
        "fenetreSelectionClasseGroupe.titreClasses",
      ),
      listeSelection: this.donnees.listeClasses,
      listeTotale: this.donnees.listeClasses,
    });
    this.getInstance(this.identSelecteurClasses).actualiserLibelle();
    const lThis = this;
    new ObjetRequeteListeRegimesEleve(this)
      .lancerRequete({
        avecRegimesEleves: true,
        avecSeulementUtilises: true,
        avecAucun: true,
      })
      .then((aJSONListeRegimes) => {
        lThis.donnees.listeRegimes = aJSONListeRegimes.ListeRegimes;
        lThis
          .getInstance(lThis.identSelecteurRegimeEleve)
          .setDonnees({
            listeSelection: lThis.donnees.listeRegimes,
            listeTotale: lThis.donnees.listeRegimes,
          });
        lThis.getInstance(lThis.identSelecteurRegimeEleve).actualiserLibelle();
        new ObjetRequeteListeRegimesEleve(lThis)
          .lancerRequete({
            avecMotifsAbsence: true,
            avecMotifsRetard: true,
            avecSeulementUtilises: false,
            avecAucun: true,
          })
          .then((aJSONListeMotifs) => {
            lThis.cacheListes.motifsAbsences =
              aJSONListeMotifs.listeMotifsAbsenceEleve;
            lThis.cacheListes.motifsRetards =
              aJSONListeMotifs.listeMotifsRetards;
            let lIndiceSemaineCourante = -1;
            lThis.cacheListes.periodes.parcourir((D, aIndice) => {
              if (D.choix === TUtilitaireListePeriodes.choix.semaineCourante) {
                lIndiceSemaineCourante = aIndice;
                return false;
              }
            });
            lThis
              .getInstance(lThis.identComboPeriode)
              .setSelection(lIndiceSemaineCourante);
            lThis.lancerRequeteRecuperationJustificationsAbsRetards();
          });
      });
  }
  lancerRequeteRecuperationJustificationsAbsRetards() {
    const lParamsRequete = {
      classes: this.donnees.listeClasses,
      regimes: this.donnees.listeRegimes,
      uniquementNonRA: this.donnees.uniquementNonRA,
      dateDebut: this.donnees.dateDebut,
      dateFin: this.donnees.dateFin,
    };
    if (lParamsRequete.classes) {
      lParamsRequete.classes.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    if (lParamsRequete.regimes) {
      lParamsRequete.regimes.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    Requetes(
      "SuiviJustificationsAbsencesRetards",
      this,
      this.surRecuperationListeJustificationsAbsRetards,
    ).lancerRequete(lParamsRequete);
  }
  surRecuperationListeJustificationsAbsRetards(aJSON) {
    this.donnees.listeAbsencesRetards = aJSON.listeJustifications;
    if (!!this.donnees.listeAbsencesRetards) {
      const lThis = this;
      let lMotifDeListe;
      this.donnees.listeAbsencesRetards.parcourir((aJustification) => {
        if (!!aJustification.motif) {
          lMotifDeListe = _getMotifDeListeComplete.call(
            lThis,
            aJustification.getGenre(),
            aJustification.motif,
          );
          aJustification.motif = lMotifDeListe;
        }
        if (!!aJustification.motifParent) {
          lMotifDeListe = _getMotifDeListeComplete.call(
            lThis,
            aJustification.getGenre(),
            aJustification.motifParent,
          );
          aJustification.motifParent = lMotifDeListe;
        }
      });
    }
    this.getInstance(this.identListeJustifications).setDonnees(
      new DonneesListe_SuiviJustificationsAbsRetards(
        this.donnees.listeAbsencesRetards,
        {
          callbackAjoutDocumentJoint:
            this.callbackAjoutDocumentJoint.bind(this),
          callbackRemplacerDocumentJoint:
            this.callbackRemplacerDocumentJoint.bind(this),
          callbackSuppressionDocumentJoint:
            this.callbackSuppressionDocumentJoint.bind(this),
          listeFiltreTypeRessAbsences: this.listeTypeRessAbsences,
        },
      ),
    );
  }
  callbackAjoutDocumentJoint(aArticle, aFichier) {
    if (!!aArticle) {
      aArticle.setEtat(EGenreEtat.Modification);
      aArticle.ListeFichiers = new ObjetListeElements().addElement(aFichier);
      this.valider(TypeHttpSaisieAbsencesGrille.sag_AjouterCertificat, {
        Libelle: aFichier.getLibelle(),
        idFichier: aFichier.idFichier,
      });
    }
  }
  callbackRemplacerDocumentJoint(aArticle, aFichier) {
    if (
      !!aArticle &&
      !!aArticle.listeDocJointsParent &&
      aArticle.listeDocJointsParent.count() > 0
    ) {
      aArticle.setEtat(EGenreEtat.Modification);
      aArticle.ListeFichiers = new ObjetListeElements().addElement(aFichier);
      this.valider(TypeHttpSaisieAbsencesGrille.sag_RemplacerCertificat, {
        ancienCertificat: aArticle.listeDocJointsParent.get(0),
        Libelle: aFichier.getLibelle(),
        idFichier: aFichier.idFichier,
      });
    }
  }
  callbackSuppressionDocumentJoint(aArticle) {
    if (
      !!aArticle &&
      !!aArticle.listeDocJointsParent &&
      aArticle.listeDocJointsParent.count() > 0
    ) {
      aArticle.setEtat(EGenreEtat.Modification);
      this.valider(TypeHttpSaisieAbsencesGrille.sag_SupprimerCertificat, {
        certificat: aArticle.listeDocJointsParent.get(0),
      });
    }
  }
  valider(aTypeSaisie, aDonneesSupplementaires) {
    let lRessourceASaisir = null;
    this.donnees.listeAbsencesRetards.parcourir((D) => {
      if (D.pourValidation()) {
        lRessourceASaisir = D;
        return false;
      }
    });
    if (!!lRessourceASaisir) {
      const lParamsRequete = {
        genreSaisie: aTypeSaisie,
        eleve: lRessourceASaisir.eleve,
        genreAbsence: TypeRessourceAbsenceUtil.toGenreRessource(
          lRessourceASaisir.getGenre(),
        ),
        article: lRessourceASaisir,
      };
      if (!!aDonneesSupplementaires) {
        Object.assign(lParamsRequete, aDonneesSupplementaires);
      }
      let lListeFichiersUpload = null;
      if (
        lRessourceASaisir.ListeFichiers &&
        lRessourceASaisir.ListeFichiers.count() > 0
      ) {
        if (!lListeFichiersUpload) {
          lListeFichiersUpload = new ObjetListeElements();
        }
        lListeFichiersUpload.add(lRessourceASaisir.ListeFichiers);
      }
      new ObjetRequeteSaisieAbsencesGrille(
        this,
        this.lancerRequeteRecuperationJustificationsAbsRetards,
      )
        .addUpload({ listeFichiers: lListeFichiersUpload })
        .lancerRequete(lParamsRequete);
    }
  }
}
function _getMotifDeListeComplete(aGenreJustification, aMotifRecherche) {
  let lMotifDeListe = null;
  if (aMotifRecherche) {
    let lListeConcernee;
    if (aGenreJustification === TypeRessourceAbsence.TR_Absence) {
      lListeConcernee = this.cacheListes.motifsAbsences;
    } else if (aGenreJustification === TypeRessourceAbsence.TR_Retard) {
      lListeConcernee = this.cacheListes.motifsRetards;
    }
    if (!!lListeConcernee) {
      lMotifDeListe = lListeConcernee.getElementParNumero(
        aMotifRecherche.getNumero(),
      );
    }
  }
  return lMotifDeListe;
}
function initSelecteurTypeRessourceAbs(aInstance) {
  aInstance.setDonnees({
    listeSelection: this.listeTypeRessAbsences,
    listeTotale: this.listeTypeRessAbsences,
  });
}
function surEvenementSelecteurTypeRessourceAbs(aParametres) {
  this.listeTypeRessAbsences.parcourir((D) => {
    D.selectionne = false;
  });
  if (!!aParametres.listeSelection) {
    const lThis = this;
    aParametres.listeSelection.parcourir((aTypeRessourceSelectionne) => {
      const lTypeRessourceDeListe =
        lThis.listeTypeRessAbsences.getElementParGenre(
          aTypeRessourceSelectionne.getGenre(),
        );
      if (!!lTypeRessourceDeListe) {
        lTypeRessourceDeListe.selectionne = true;
      }
    });
    this.getInstance(this.identListeJustifications).actualiser(true);
  }
}
function _initSelecteurClasses(aInstance) {
  aInstance.setOptions({ avecSelectionObligatoire: true });
}
function surEvenementSelecteurClasses(aParam) {
  this.donnees.listeClasses = aParam.listeSelection;
  this.lancerRequeteRecuperationJustificationsAbsRetards();
}
function surEvenementSelecteurRegimes(aParam) {
  this.donnees.listeRegimes = aParam.listeSelection;
  this.lancerRequeteRecuperationJustificationsAbsRetards();
}
function _initialiserComboPeriode(aInstance) {
  aInstance.setOptionsObjetSaisie({
    longueur: 150,
    hauteur: 17,
    classTexte: "Gras",
    labelWAICellule: GTraductions.getValeur("Periode"),
  });
  aInstance.setControleNavigation(true);
  aInstance.setDonnees(this.cacheListes.periodes);
}
function _evenementSurComboPeriode(aParams) {
  if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
    this.donnees.dateDebut = aParams.element.dates.debut;
    this.donnees.dateFin = aParams.element.dates.fin;
    this.getInstance(this.identDate).setDonnees(this.donnees.dateDebut);
    this.getInstance(this.identDate2).setDonnees(this.donnees.dateFin);
    if (this.getInstance(this.identComboPeriode).InteractionUtilisateur) {
      this.lancerRequeteRecuperationJustificationsAbsRetards();
    }
  }
}
function _initialiserSelecteurDate(aInstance) {
  aInstance.setControleNavigation(true);
}
function surEvenementSelecteurDate(aEstDateDebut, aDate) {
  this.donnees.dateDebut = this.getInstance(this.identDate).getDate();
  this.donnees.dateFin = this.getInstance(this.identDate2).getDate();
  if (aEstDateDebut) {
    if (this.getInstance(this.identDate2).getDate() < aDate) {
      this.getInstance(this.identDate2).setDonnees(aDate);
      this.donnees.dateFin = aDate;
    }
  } else {
    if (this.getInstance(this.identDate).getDate() > aDate) {
      this.getInstance(this.identDate).setDonnees(aDate);
      this.donnees.dateDebut = aDate;
    }
  }
  _actualiserComboSelonDates.call(
    this,
    this.donnees.dateDebut,
    this.donnees.dateFin,
  );
  this.lancerRequeteRecuperationJustificationsAbsRetards();
}
function _actualiserComboSelonDates(aDateDebut, aDateFin) {
  let lIndiceSemaineCourante = -1;
  this.cacheListes.periodes.parcourir((D, aIndice) => {
    if (
      GDate.estJourEgal(D.dates.debut, aDateDebut) &&
      GDate.estJourEgal(D.dates.fin, aDateFin)
    ) {
      lIndiceSemaineCourante = aIndice;
      return false;
    }
  });
  if (lIndiceSemaineCourante >= 0) {
    this.getInstance(this.identComboPeriode).setSelection(
      lIndiceSemaineCourante,
    );
  } else {
    this.getInstance(this.identComboPeriode).setContenu("");
  }
}
function _initListeJustifications(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.AouR"),
    hint: GTraductions.getValeur("SuiviJustificationAbsRet.AbsenceOuRetard"),
    taille: 40,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.NomEleve"),
    taille: 150,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Classe"),
    taille: 60,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Regime"),
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeRetard,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.DureeRetard"),
    hint: GTraductions.getValeur("SuiviJustificationAbsRet.HintDureeRetard"),
    taille: 60,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.date,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Date"),
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Motif"),
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents,
    titre: [
      {
        libelle: GTraductions.getValeur(
          "SuiviJustificationAbsRet.JustificationParents",
        ),
      },
      { classeCssImage: "Image_Trombone" },
    ],
    taille: 20,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.raisonDonneeParents,
    titre: [
      { libelle: TypeFusionTitreListe.FusionGauche },
      {
        libelle: GTraductions.getValeur(
          "SuiviJustificationAbsRet.RaisonDonneeParents",
        ),
        title: GTraductions.getValeur(
          "SuiviJustificationAbsRet.JustificationParents",
        ),
      },
    ],
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes
      .dateJustificationParents,
    titre: [
      { libelle: TypeFusionTitreListe.FusionGauche },
      {
        libelle: GTraductions.getValeur(
          "SuiviJustificationAbsRet.DateJustificationParents",
        ),
        title: GTraductions.getValeur(
          "SuiviJustificationAbsRet.HintDateJustificationParents",
        ),
      },
    ],
    taille: 80,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.commentaireParents,
    titre: [
      { libelle: TypeFusionTitreListe.FusionGauche },
      {
        libelle: GTraductions.getValeur(
          "SuiviJustificationAbsRet.CommentaireParents",
        ),
        title: GTraductions.getValeur(
          "SuiviJustificationAbsRet.HintCommentaireParents",
        ),
      },
    ],
    taille: 120,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.justifieParParents,
    titre: [
      { libelle: TypeFusionTitreListe.FusionGauche },
      {
        libelle: GTraductions.getValeur("SuiviJustificationAbsRet.JustifiePar"),
      },
    ],
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes
      .acceptationEtablissement,
    titre: [
      { libelle: TypeFusionTitreListe.FusionGauche },
      {
        libelle: GTraductions.getValeur(
          "SuiviJustificationAbsRet.AcceptationEtablissement",
        ),
      },
    ],
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeAbsenceCours,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.DureeAbsenceCours"),
    hint: GTraductions.getValeur(
      "SuiviJustificationAbsRet.HintDureeAbsenceCours",
    ),
    taille: 100,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.MatieresAffectees"),
    taille: 100,
  });
  if (GApplication.droits.get(TypeDroits.absences.avecSaisieAbsenceOuverte)) {
    lColonnes.push({
      id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert,
      titre: GTraductions.getValeur("SuiviJustificationAbsRet.EstOuvert"),
      hint: GTraductions.getValeur("SuiviJustificationAbsRet.HintEstOuvert"),
      taille: 60,
    });
  }
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes
      .demiJourneesBulletin,
    titre: GTraductions.getValeur(
      "SuiviJustificationAbsRet.DemiJourneesBulletin",
    ),
    hint: GTraductions.getValeur(
      "SuiviJustificationAbsRet.HintDemiJourneesBulletin",
    ),
    taille: 60,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.estMotifRecevable,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Justifie"),
    taille: 60,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes
      .estRegleAdministrativement,
    titre: GTraductions.getValeur(
      "SuiviJustificationAbsRet.RegleAdministrativement",
    ),
    hint: GTraductions.getValeur(
      "SuiviJustificationAbsRet.HintRegleAdministrativement",
    ),
    taille: 30,
  });
  lColonnes.push({
    id: DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi,
    titre: GTraductions.getValeur("SuiviJustificationAbsRet.Suivi"),
    taille: 100,
  });
  aInstance.setOptionsListe({ colonnes: lColonnes, colonnesTriables: true });
}
function evenementListeJustifications(aParametres) {
  const lThis = this;
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Eleve,
        aParametres.article.eleve,
      );
      this.surSelectionEleve();
      break;
    case EGenreEvenementListe.Edition:
      switch (aParametres.idColonne) {
        case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
          surEditionMotif.call(
            this,
            aParametres.article,
            true,
            (aArticle, aNouveauMotif) => {
              if (
                !aArticle.motif ||
                (!!aNouveauMotif &&
                  aArticle.motif.getNumero() !== aNouveauMotif.getNumero())
              ) {
                aArticle.setEtat(EGenreEtat.Modification);
                lThis.valider(TypeHttpSaisieAbsencesGrille.sag_Motif, {
                  motifModifie: aNouveauMotif,
                });
              }
            },
          );
          break;
        case DonneesListe_SuiviJustificationsAbsRetards.colonnes
          .acceptationEtablissement: {
          const lMotifOfficielRenseigne =
            !!aParametres.article.motif &&
            aParametres.article.motif.existeNumero() &&
            !aParametres.article.motif.nonConnu;
          let lAvecConfirmationPerteMotif = false;
          if (aParametres.article.estMotifParentAccepte) {
            lAvecConfirmationPerteMotif = lMotifOfficielRenseigne;
          }
          const lFonctionSaisieRaisonDonneeParParents = function () {
            const lParametresSaisie = {
              accepteRaisonDonneeParents:
                !aParametres.article.estMotifParentAccepte,
            };
            if (
              lParametresSaisie.accepteRaisonDonneeParents &&
              !lMotifOfficielRenseigne &&
              (!aParametres.article.motifParent ||
                !aParametres.article.motifParent.existeNumero() ||
                !!aParametres.article.motifParent.nonConnu)
            ) {
              surEditionMotif.call(
                lThis,
                aParametres.article,
                false,
                (aArticle, aNouveauMotif) => {
                  if (!!aArticle.estOuvert) {
                    surChoixDateFermetureAbsence.call(
                      lThis,
                      aArticle,
                      (aArticle2, aDate) => {
                        aArticle2.setEtat(EGenreEtat.Modification);
                        lParametresSaisie.motif = aNouveauMotif;
                        lParametresSaisie.dateFermetureAbsence = aDate;
                        lThis.valider(
                          TypeHttpSaisieAbsencesGrille.sag_RaisonDonneeParParents,
                          lParametresSaisie,
                        );
                      },
                    );
                  } else {
                    aArticle.setEtat(EGenreEtat.Modification);
                    lParametresSaisie.motif = aNouveauMotif;
                    lThis.valider(
                      TypeHttpSaisieAbsencesGrille.sag_RaisonDonneeParParents,
                      lParametresSaisie,
                    );
                  }
                },
              );
            } else {
              if (!!aParametres.article.estOuvert) {
                surChoixDateFermetureAbsence.call(
                  lThis,
                  aParametres.article,
                  (aArticle, aDate) => {
                    aArticle.setEtat(EGenreEtat.Modification);
                    lParametresSaisie.dateFermetureAbsence = aDate;
                    lThis.valider(
                      TypeHttpSaisieAbsencesGrille.sag_RaisonDonneeParParents,
                      lParametresSaisie,
                    );
                  },
                );
              } else {
                aParametres.article.setEtat(EGenreEtat.Modification);
                lThis.valider(
                  TypeHttpSaisieAbsencesGrille.sag_RaisonDonneeParParents,
                  lParametresSaisie,
                );
              }
            }
          };
          if (lAvecConfirmationPerteMotif) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "SuiviJustificationAbsRet.ConfirmationEcrasementMotif",
              ),
              callback: function (aGenreAction) {
                if (aGenreAction === 0) {
                  lFonctionSaisieRaisonDonneeParParents();
                }
              },
            });
          } else {
            lFonctionSaisieRaisonDonneeParParents();
          }
          break;
        }
        case DonneesListe_SuiviJustificationsAbsRetards.colonnes
          .estMotifRecevable:
          aParametres.article.setEtat(EGenreEtat.Modification);
          this.valider(TypeHttpSaisieAbsencesGrille.sag_MotifRecevable);
          break;
        case DonneesListe_SuiviJustificationsAbsRetards.colonnes
          .estRegleAdministrativement:
          aParametres.article.setEtat(EGenreEtat.Modification);
          this.valider(TypeHttpSaisieAbsencesGrille.sag_Reglement);
          break;
        case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi: {
          const lFenetreSuivi = ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SuiviUnique,
            {
              pere: this,
              evenement: function () {
                lThis.lancerRequeteRecuperationJustificationsAbsRetards();
              },
            },
            { titre: GTraductions.getValeur("SuiviJustificationAbsRet.Suivi") },
          );
          lFenetreSuivi.setDonnees(
            aParametres.article.eleve,
            aParametres.article,
          );
          break;
        }
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      aParametres.article.setEtat(EGenreEtat.Modification);
      this.valider(TypeHttpSaisieAbsencesGrille.sag_DJBulletin, {
        DJBulletin: aParametres.article.nbDemiJourneeBulletin,
      });
      break;
  }
}
function surEditionMotif(aArticle, aAvecMotifNonConnu, aSurChoixMotif) {
  if (!!aArticle) {
    let lListeMotifs;
    if (aArticle.getGenre() === TypeRessourceAbsence.TR_Absence) {
      lListeMotifs = this.cacheListes.motifsAbsences;
    } else if (aArticle.getGenre() === TypeRessourceAbsence.TR_Retard) {
      lListeMotifs = this.cacheListes.motifsRetards;
    }
    if (!!lListeMotifs) {
      if (!aAvecMotifNonConnu) {
        lListeMotifs = lListeMotifs.getListeElements((aMotif) => {
          return !aMotif.nonConnu;
        });
      }
      const lFenetreSelectionMotif = ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_SelectionMotif,
        {
          pere: this,
          evenement: function (aGenreBouton, aMotif) {
            if (aGenreBouton === 1) {
              if (!!aSurChoixMotif) {
                aSurChoixMotif(aArticle, aMotif);
              }
            }
          },
        },
      );
      lFenetreSelectionMotif.setDonnees(lListeMotifs);
    }
  }
}
function surChoixDateFermetureAbsence(aAbsence, aCallback) {
  const lFenetreChoixDate = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_Date,
    {
      pere: this,
      evenement: function (aNumeroBouton, aDate) {
        if (aNumeroBouton === 1) {
          aCallback(aAbsence, aDate);
        }
      },
      initialiser: function (aInstance) {
        aInstance.setParametres(
          GDate.PremierLundi,
          new Date(0),
          GParametres.DerniereDate,
        );
      },
    },
  );
  lFenetreChoixDate.setDonnees(null);
}
module.exports = { InterfaceSuiviJustificationsAbsRetards };

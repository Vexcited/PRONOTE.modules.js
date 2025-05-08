exports.InterfacePage = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Invocateur_1 = require("Invocateur");
const _InterfacePage_1 = require("_InterfacePage");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const MultipleObjetAffichagePageAvecMenusDeroulants = require("InterfacePageAvecMenusDeroulants");
const ObjetAffichagePageAvecMenusDeroulants =
  MultipleObjetAffichagePageAvecMenusDeroulants === null ||
  MultipleObjetAffichagePageAvecMenusDeroulants === void 0
    ? void 0
    : MultipleObjetAffichagePageAvecMenusDeroulants.ObjetAffichagePageAvecMenusDeroulants;
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireRenseignementsEleve_1 = require("UtilitaireRenseignementsEleve");
class InterfacePage extends _InterfacePage_1._InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.estBoutonsFicheEleveActif = false;
    this.applicationSco = GApplication;
  }
  getPrioriteAffichageBandeauLargeur() {
    return [ObjetAffichagePageAvecMenusDeroulants];
  }
  conditionSuppAfficherBandeau(aIdent) {
    return (
      this.Instances[aIdent] &&
      ![
        ObjetAffichagePageAvecMenusDeroulants,
        ObjetSaisiePN_1.ObjetSaisiePN,
      ].includes(this.GenreAffichage[aIdent])
    );
  }
  afficherMessage(aMessage) {
    ObjetHtml_1.GHtml.setHtml(this.idPage, this.composeMessage(aMessage));
  }
  _evenementAfficherMessage(AGenreMessage) {
    this.afficherBandeau(false);
    if (this.Instances[this.IdentZoneAlClient]) {
      const LMessage =
        typeof AGenreMessage === "number"
          ? ObjetTraduction_1.GTraductions.getValeur("Message")[AGenreMessage]
          : AGenreMessage;
      this.Instances[this.IdentZoneAlClient].effacer(
        this.composeMessage(LMessage),
      );
      this.Instances[this.IdentZoneAlClient].setPremierElement(
        this.idMessageActionRequise,
      );
    }
  }
  evenementAfficherMessage(aGenreMessage) {
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      Enumere_GenreImpression_1.EGenreImpression.Aucune,
    );
    this._evenementAfficherMessage(aGenreMessage);
  }
  construireFicheEleveEtFichePhoto() {
    if (this.avecFicheEleve()) {
      UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.construireInstances(
        this,
      );
      UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.construireInstances(
        this,
      );
    }
  }
  addSurZoneFicheEleve() {
    if (this.avecFicheEleve()) {
      UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.addSurZone(this);
    }
  }
  addSurZonePhotoEleve() {
    if (this.avecPhotoEleve()) {
      UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.addSurZone(this);
    }
  }
  estUnOngletAvecFicheEleve(aOnglet) {
    const lListeOngletsAvecFicheEleve = [
      Enumere_Onglet_1.EGenreOnglet.Bulletins,
      Enumere_Onglet_1.EGenreOnglet.Dossiers,
      Enumere_Onglet_1.EGenreOnglet.FicheBrevet,
      Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche,
      Enumere_Onglet_1.EGenreOnglet.Releve,
      Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi,
      Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel,
      Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur,
      Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin,
      Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales,
      Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales_Competences,
      Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsReleve,
      Enumere_Onglet_1.EGenreOnglet.SaisieApprGeneralesReleve,
      Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
      Enumere_Onglet_1.EGenreOnglet.SuivisAbsenceRetard,
      Enumere_Onglet_1.EGenreOnglet.ListeEleves,
      Enumere_Onglet_1.EGenreOnglet.AbsencesGrille,
      Enumere_Onglet_1.EGenreOnglet.SaisieOrientation,
      Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
      Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParClasse,
      Enumere_Onglet_1.EGenreOnglet.BulletinCompetences,
      Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences,
      Enumere_Onglet_1.EGenreOnglet.AppreciationsBulletinParEleve,
      Enumere_Onglet_1.EGenreOnglet.Evaluation,
      Enumere_Onglet_1.EGenreOnglet.ListeEvaluation,
      Enumere_Onglet_1.EGenreOnglet.SaisieAvisProfesseur,
      Enumere_Onglet_1.EGenreOnglet.SuiviJustificationsAbsencesRetards,
      Enumere_Onglet_1.EGenreOnglet.SyntheseAcquis,
      Enumere_Onglet_1.EGenreOnglet.BilanAnnuelApprentissage,
      Enumere_Onglet_1.EGenreOnglet.CarnetDeSuivi,
    ];
    return lListeOngletsAvecFicheEleve.includes(aOnglet);
  }
  avecFicheEleve() {
    return (
      ObjetFenetre_FicheEleve &&
      this.estUnOngletAvecFicheEleve(
        this.applicationSco.getEtatUtilisateur().getGenreOnglet(),
      ) &&
      (GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
      ) ||
        GApplication.droits.get(
          ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
        ))
    );
  }
  avecPhotoEleve() {
    return (
      this.avecFicheEleve() &&
      GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
      )
    );
  }
  setGraphe(aGraphe, aParamGraphe = null) {
    this._graphe = aGraphe;
    this._paramGraphe = aParamGraphe;
  }
  actualiserFicheGraphe() {
    if (
      this.getInstance(this.identFicheGraphe) &&
      this.getInstance(this.identFicheGraphe).EnAffichage
    ) {
      this.getInstance(this.identFicheGraphe).setDonnees(
        this._graphe,
        this._paramGraphe,
      );
    }
  }
  getHtmlBoutonBandeauGraphe() {
    return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnGrapheAraignee(
      "btnGrapheAraignee",
    );
  }
  getTitleBoutonGraphe() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "competences.GrapheAraignee",
    );
  }
  getControleur(aInstance) {
    const lControleur = $.extend(true, super.getControleur(aInstance), {
      btnGrapheAraignee: {
        event() {
          if (aInstance.getInstance(aInstance.identFicheGraphe)) {
            if (aInstance._graphe.image[0]) {
              aInstance
                .getInstance(aInstance.identFicheGraphe)
                .setDonnees(aInstance._graphe, aInstance._paramGraphe);
            } else {
              GApplication.getMessage().afficher({
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
                titre: null,
                message: aInstance._graphe.message,
                callback: null,
                avecDecalageFocusBouton: true,
              });
            }
          }
        },
        getSelection() {
          return (
            aInstance.getInstance(aInstance.identFicheGraphe) &&
            aInstance.getInstance(aInstance.identFicheGraphe).estAffiche()
          );
        },
        getTitle() {
          return aInstance.getTitleBoutonGraphe();
        },
        getDisabled() {
          return !aInstance._graphe;
        },
      },
    });
    UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.ajoutControleur(
      aInstance,
      lControleur,
    );
    UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.ajoutControleur(
      aInstance,
      lControleur,
    );
    return lControleur;
  }
  initialiserFenetreFicheEleve(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      titre: "",
      largeur: 850,
      hauteur: 750,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
    });
    aInstance.setOngletsVisibles({ projets: false, attestations: false });
  }
  fermerFenetreFicheEleve() {
    if (this.estFenetreFicheEleveAffiche()) {
      this.getInstance(this.identFenetreFicheEleve).fermer();
    }
  }
  fermerPhotoEleve() {
    if (this.estFenetrePhotoEleveAffiche()) {
      this.getInstance(this.identFichePhoto).fermer();
    }
  }
  estFenetreFicheEleveAffiche() {
    if (this.identFenetreFicheEleve) {
      const lFenetre = this.getInstance(this.identFenetreFicheEleve);
      return lFenetre && lFenetre.estAffiche();
    }
    return false;
  }
  estFenetrePhotoEleveAffiche() {
    if (this.identFichePhoto) {
      const lFenetre = this.getInstance(this.identFichePhoto);
      return lFenetre && lFenetre.estAffiche();
    }
    return false;
  }
  surSelectionEleve(aSansFocusPolling = false) {
    this.activerFichesEleve(true);
    if (this.estFenetreFicheEleveAffiche()) {
      const lFenetre = this.getInstance(this.identFenetreFicheEleve);
      if (this.applicationSco.getEtatUtilisateur().estModeAccessible()) {
        lFenetre.fermer();
      } else {
        lFenetre.setDonnees(null, true, aSansFocusPolling);
      }
    }
    if (this.estFenetrePhotoEleveAffiche()) {
      if (this.applicationSco.getEtatUtilisateur().estModeAccessible()) {
        this.getInstance(this.identFichePhoto).fermer();
      } else {
        UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve._afficherPhotoEleve.call(
          this,
          true,
        );
      }
    }
  }
  activerFichesEleve(aActiver) {
    this.estBoutonsFicheEleveActif = !!aActiver;
    if (!aActiver) {
      this.fermerFenetreFicheEleve();
      this.fermerPhotoEleve();
    }
  }
  selectionneEleveAutoDansPage(aIdentPage) {
    const lTrouve = this.getInstance(aIdentPage).selectionnerEleveCourant();
    this.activerFichesEleve(lTrouve);
  }
  surEvntMenusDeroulants(aParam) {
    switch (aParam.genreEvenement) {
      case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
        .ressourceNonTrouve:
        this.surRessourceCouranteNonTrouveeDansCombo(aParam);
        break;
    }
  }
  surRessourceCouranteNonTrouveeDansCombo(aParam) {
    this.activerFichesEleve(false);
  }
}
exports.InterfacePage = InterfacePage;

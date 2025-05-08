exports.InterfaceSaisieQCM_PN = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const InterfaceSaisieQCM_1 = require("InterfaceSaisieQCM");
const InterfaceEditionListeQCM_PN_1 = require("InterfaceEditionListeQCM_PN");
const InterfaceEditionDetailSelectionQCM_PN_1 = require("InterfaceEditionDetailSelectionQCM_PN");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetListeElements_1 = require("ObjetListeElements");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteListeQCM_1 = require("ObjetRequeteListeQCM");
const ObjetRequeteSaisieQCM_1 = require("ObjetRequeteSaisieQCM");
const DonneesListe_FiltresQCM_1 = require("DonneesListe_FiltresQCM");
class InterfaceSaisieQCM_PN extends InterfaceSaisieQCM_1.InterfaceSaisieQCM {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    this.idMsgSelect = this.Nom + "_msg_Select";
    (this.options.avecGestionCategorie = true),
      (this.options.avecGestionNotation = this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
      ));
  }
  getGenreRessourceQCM() {
    return Enumere_Ressource_1.EGenreRessource.QCM;
  }
  getGenreRessourceExecutionQCM() {
    return Enumere_Ressource_1.EGenreRessource.ExecutionQCM;
  }
  construireInstances() {
    super.construireInstances();
    if (this.etatUtilisateurSco.pourPrimaire()) {
      this.identTripleCombo = this.add(
        InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
        this.evenementSurDernierMenuDeroulant,
        this.initialiserTripleCombo,
      );
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
    this.interfaceListeQCM = this.add(
      InterfaceEditionListeQCM_PN_1.InterfaceEditionListeQCM_PN,
      this.evntSurInterfaceListeQCM,
      this.initInterfaceListeQCM,
    );
    this.idPremierObjet = this.getInstance(
      this.interfaceListeQCM,
    ).getPremierElement();
    this.interfaceDetailSelectionQCM = this.add(
      InterfaceEditionDetailSelectionQCM_PN_1.InterfaceEditionDetailSelectionQCM_PN,
      this.evntSurInterfaceDetailQCM,
      this.initInterfaceDetailSelectionQCM,
    );
  }
  avecFiltreGlobalMatiere() {
    return !this.etatUtilisateurSco.pourPrimaire();
  }
  avecFiltreGlobalNiveau() {
    return !this.etatUtilisateurSco.pourPrimaire();
  }
  composeSectionMessage() {
    const T = [];
    if (this.etatUtilisateurSco.pourPrimaire()) {
      T.push(
        '<div id="',
        this.idMsgSelect,
        '" class="ISQ_SectionMessage">',
        ObjetTraduction_1.GTraductions.getValeur(
          "SaisieQCM.SelectionnerUneClasse",
        ),
        "</div>",
      );
    }
    return T.join("");
  }
  faireRequeteListeQCM(aNumeroEltASelectionner, aSurInit = false) {
    if (this.etatUtilisateurSco.pourPrimaire() && aSurInit === true) {
      this.numeroEltASelectionner = aNumeroEltASelectionner;
      this.surInit = true;
      $("#" + this.idMsgSelect.escapeJQ())
        .show()
        .siblings()
        .hide();
    } else {
      new ObjetRequeteListeQCM_1.ObjetRequeteListeQCM(
        this,
        this.actionSurListeQCM.bind(this, aNumeroEltASelectionner),
      ).lancerRequete();
    }
  }
  actionSurListeQCM(aNumEltASelectionner, aListeQCM, aAutresDonneesRequetes) {
    this.getInstance(this.interfaceDetailSelectionQCM)._initialiser({
      initOngletSelectionne: false,
    });
    this.listeQCM = aListeQCM;
    this.listeServices = aAutresDonneesRequetes.listeServices;
    this.listeClasses = aAutresDonneesRequetes.listeClasses;
    this.listeProfs = aAutresDonneesRequetes.listeProfesseurs;
    this.avecServicesEvaluation = aAutresDonneesRequetes.avecServicesEvaluation;
    this.listeCategoriesQCM = aAutresDonneesRequetes.listeCategories;
    this.miseAJourFiltresGlobaux(aListeQCM);
    this.actualiserIfcListeQCM(aNumEltASelectionner);
  }
  estElementQCMVisibleSelonProduit(aElementQCM) {
    let lEstVisible = super.estElementQCMVisibleSelonProduit(aElementQCM);
    if (
      lEstVisible &&
      !!aElementQCM &&
      this.etatUtilisateurSco.pourPrimaire()
    ) {
      const lQCM =
        aElementQCM.getGenre() === this.genreRessource.execQCM
          ? aElementQCM.QCM
          : aElementQCM;
      lEstVisible =
        lQCM.niveau.getNumero() ===
        this.classePrimSelectionne.niveau.getNumero();
    }
    return lEstVisible;
  }
  getTypesFiltreQCMLies() {
    let lTypesFiltre = [];
    if (this.etatUtilisateurSco.pourPrimaire()) {
      if (
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCompetences,
        )
      ) {
        lTypesFiltre = [
          DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
            .LiesAEvaluation,
        ];
      }
    } else {
      if (!!this.options.avecGestionNotation) {
        lTypesFiltre.push(
          DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.LiesADevoir,
        );
      }
      lTypesFiltre.push(
        DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
          .LiesAEvaluation,
        DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
          .LiesAContenuDeCours,
        DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
          .LiesATravailAFaire,
      );
    }
    return lTypesFiltre;
  }
  actualiserIfcListeQCM(aNumEltASelectionner) {
    const lPrimaire = this.etatUtilisateurSco.pourPrimaire();
    if (lPrimaire) {
      const lJqMsgSelec = $("#" + this.idMsgSelect.escapeJQ());
      if (lJqMsgSelec.is(":visible")) {
        lJqMsgSelec.hide().siblings().show();
      }
    }
    this.actualiserVisibilitesElementsQCM(this.listeQCM);
    const lListeSelection = new ObjetListeElements_1.ObjetListeElements();
    if (aNumEltASelectionner !== null && aNumEltASelectionner !== undefined) {
      const lElement = this.listeQCM.getElementParNumero(aNumEltASelectionner);
      if (!!lElement) {
        lListeSelection.addElement(lElement);
      }
    }
    this.actualiserListeFiltresQCM();
    this.getInstance(this.interfaceListeQCM).setDonnees({
      listeQCM: this.listeQCM,
      listeServices: this.listeServices,
      listeClasses: this.listeClasses,
      listeProfs: this.listeProfs,
      selection: this.element,
      genreQCM: this.genreRessource.QCM,
      genreExecQCM: this.genreRessource.execQCM,
      listeMatieres: this.etatUtilisateurSco.listeMatieres,
      listeMatieresPrim: this.listeServicesPrim,
      classePrimSelectionne: this.classePrimSelectionne
        ? this.classePrimSelectionne
        : null,
      niveau: this.classePrimSelectionne
        ? this.classePrimSelectionne.niveau
        : null,
      avecServicesEvaluation: this.avecServicesEvaluation,
      avecSaisieCahierDeTexte: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisieCahierDeTexte,
      ),
      avecSaisieDevoirs: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.notation.avecSaisieDevoirs,
      ),
      avecSaisieEvaluations: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.competence.avecSaisieEvaluations,
      ),
      avecGestionNotation: this.options.avecGestionNotation,
      genreContributeurs: Enumere_Ressource_1.EGenreRessource.Enseignant,
      listeCategoriesQCM: this.listeCategoriesQCM,
    });
    this.getInstance(this.interfaceDetailSelectionQCM).setDonnees({
      listeQCM: this.listeQCM,
      genreQCM: this.genreRessource.QCM,
      genreExecQCM: this.genreRessource.execQCM,
    });
    if (lListeSelection.count() > 0) {
      this.getInstance(this.interfaceListeQCM).setSelectionListe(
        lListeSelection,
      );
    }
  }
  lancerRequeteSaisieQCMSelonProduit(aCallback) {
    new ObjetRequeteSaisieQCM_1.ObjetRequeteSaisieQCM(
      this,
      aCallback,
    ).lancerRequete(this.listeQCM);
  }
  estModeCollaboratif() {
    return (
      this.etatUtilisateurSco.getGenreOnglet() ===
      Enumere_Onglet_1.EGenreOnglet.QCM_Collaboratif
    );
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Classe], true);
  }
  initInterfaceListeQCM(aInstance) {
    const lEstModeCollaboratif = this.estModeCollaboratif();
    const lAvecAffichageCategories =
      this.options.avecGestionCategorie && !lEstModeCollaboratif;
    $.extend(aInstance.options, {
      avecCategorie: lAvecAffichageCategories,
      avecProprietaire: lEstModeCollaboratif,
      estProprietaireEditable: false,
      avecImportFichier: true,
      avecImportNathan: this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNathan,
      ),
      avecCollaboratif: !this.etatUtilisateurSco.pourPrimaire(),
      avecAssocTAF:
        !lEstModeCollaboratif && !this.etatUtilisateurSco.pourPrimaire(),
      avecAssocDevoirs:
        !lEstModeCollaboratif && !this.etatUtilisateurSco.pourPrimaire(),
      avecTafToDevoir:
        !lEstModeCollaboratif && !this.etatUtilisateurSco.pourPrimaire(),
      avecAssocEvaluations: !lEstModeCollaboratif,
      avecRegrouperPeriodes: false,
      estModeCollab: lEstModeCollaboratif,
      avecContributeurs: lEstModeCollaboratif,
      avecCopie: true,
    });
  }
  initInterfaceDetailSelectionQCM(aInstance) {
    const lEstModeCollaboratif = this.estModeCollaboratif();
    aInstance.setOptions({
      avecResultats: !lEstModeCollaboratif,
      avecModalitesExec: !lEstModeCollaboratif,
      estModeCollab: lEstModeCollaboratif,
    });
  }
  evenementSurDernierMenuDeroulant() {
    this.classePrimSelectionne =
      this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Classe,
      );
    if (this.etatUtilisateurSco.pourPrimaire()) {
      this.element = null;
      this.getInstance(this.interfaceDetailSelectionQCM)._initialiser({
        initOngletSelectionne: false,
      });
      Invocateur_1.Invocateur.evenement(
        Invocateur_1.ObjetInvocateur.events.activationImpression,
        Enumere_GenreImpression_1.EGenreImpression.Aucune,
      );
      (0, CollectionRequetes_1.Requetes)("ListeMatieresPourSaisieEDT", this)
        .lancerRequete({
          ressource: this.classePrimSelectionne,
          estEdtAnnuel: true,
        })
        .then((aJSON) => {
          this.evntApresRequeteServicesDeClasse(aJSON.listeMatieres);
        });
    }
  }
  evntApresRequeteServicesDeClasse(aListeServices) {
    this.listeServicesPrim = aListeServices;
    if (this.surInit) {
      this.faireRequeteListeQCM(this.numeroEltASelectionner);
      this.surInit = undefined;
    } else {
      this.actualiserIfcListeQCM(this.numeroEltASelectionner);
    }
  }
  evntSurInterfaceListeQCM(aParam) {
    super.evntSurInterfaceListeQCM(aParam);
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      this.activerImpression()
        ? Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
        : Enumere_GenreImpression_1.EGenreImpression.Aucune,
      this,
      this._getParametresPDF.bind(this),
    );
  }
  evenementAfficherMessage(aGenreMessage) {
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      Enumere_GenreImpression_1.EGenreImpression.Aucune,
    );
    this.afficherBandeau(false);
    if (this.Instances[this.IdentZoneAlClient]) {
      const LMessage =
        typeof aGenreMessage === "number"
          ? ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage]
          : aGenreMessage;
      this.Instances[this.IdentZoneAlClient].effacer(
        this.composeMessage(LMessage),
      );
      this.Instances[this.IdentZoneAlClient].setPremierElement(
        this.idMessageActionRequise,
      );
    }
  }
  _getParametresPDF() {
    return {
      genreGenerationPDF:
        TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ResultatsQCM,
      element: this.element,
    };
  }
}
exports.InterfaceSaisieQCM_PN = InterfaceSaisieQCM_PN;

exports.ObjetDonneesTreeViewProgression_Affectation =
  exports.ObjetDonneesTreeViewProgression =
  exports.EGenreEvenementContextuelTreeViewProgression =
  exports.ObjetDonneesTreeViewProgressionSelection =
  exports._ObjetDonneesTreeViewProgression =
    void 0;
const MethodesTableau_1 = require("MethodesTableau");
const Enumere_EvenementTreeView_1 = require("Enumere_EvenementTreeView");
const _ObjetDonneesTreeView_1 = require("_ObjetDonneesTreeView");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class _ObjetDonneesTreeViewProgression extends _ObjetDonneesTreeView_1._ObjetDonneesTreeView {
  constructor(aListeElements) {
    super(aListeElements);
    this.toutDeploye = true;
  }
  construireNodes() {
    super.construireNodes();
    this._construireNodesDeListe(this.donnees, null);
    this.traiterNodes();
  }
  _construireNodesDeListe(aListeElements, aPere) {
    if (!aListeElements) {
      return;
    }
    let lOrdre = 0;
    for (let i = 0, lNb = aListeElements.count(); i < lNb; i++) {
      const lElement = aListeElements.get(i);
      if (lElement && lElement.existe()) {
        if (
          !this.avecContenu &&
          lElement.getGenre() ===
            Enumere_Ressource_1.EGenreRessource.ContenuDeCours
        ) {
          continue;
        }
        if (
          !this.avecTAF &&
          lElement.getGenre() ===
            Enumere_Ressource_1.EGenreRessource.TravailAFaire
        ) {
          continue;
        }
        lOrdre++;
        lElement.ordre = lOrdre;
        const lNode = this.creerNode(aPere, lElement, true);
        this.ajouterNode(lNode);
        if ("listeAffectes" in lElement && lElement.listeAffectes) {
          lNode.affecte = true;
        }
        if ("listeDossiers" in lElement) {
          this._construireNodesDeListe(lElement.listeDossiers, lNode);
        }
        if ("listeContenus" in lElement) {
          this._construireNodesDeListe(lElement.listeContenus, lNode);
        }
      }
    }
  }
  traiterNodes() {}
  getLibelleNode(aNode) {
    return aNode.contenu.getLibelle();
  }
  getClassLibelle(aNode) {
    if (
      aNode.contenu.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.Progression
    ) {
      return "Insecable Gras";
    } else {
      return "Insecable";
    }
  }
  getVisible(aNode) {
    return (
      !this.sansElementsAssoc || (this.sansElementsAssoc && !aNode.affecte)
    );
  }
  getClassIcon(aNode) {
    switch (aNode.contenu.getGenre()) {
      case Enumere_Ressource_1.EGenreRessource.Progression:
        return aNode.deploye && aNode.existeFils()
          ? "icon_folder_open"
          : "icon_folder_close";
      case Enumere_Ressource_1.EGenreRessource.DossierProgression:
        return aNode.deploye && aNode.existeFils()
          ? "icon_folder_open"
          : "icon_folder_close";
      case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
        return "icon_contenu_cours";
      case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
        return "icon_taf";
    }
  }
  avecEvenementDeGenre(aGenreEvenement) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.suppression:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.edition:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.menuContextuel:
        return true;
      default:
        return false;
    }
  }
  static getLibelleSelonChoix(aNode, aGenreTitreContenu) {
    if (!aNode) {
      return "";
    }
    switch (aGenreTitreContenu) {
      case _ObjetDonneesTreeViewProgression.genreTitreContenu.Titre:
        return aNode.contenu.getLibelle();
      case _ObjetDonneesTreeViewProgression.genreTitreContenu.SsDossierTitre:
        return aNode.pere
          ? aNode.pere.contenu.getLibelle() + " : " + aNode.contenu.getLibelle()
          : _ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
              aNode,
              _ObjetDonneesTreeViewProgression.genreTitreContenu.Titre,
            );
      case _ObjetDonneesTreeViewProgression.genreTitreContenu
        .DossierSsDossierTitre:
        return aNode.pere
          ? aNode.pere.pere
            ? aNode.pere.pere.contenu.getLibelle() +
              " - " +
              aNode.pere.contenu.getLibelle() +
              " : " +
              aNode.contenu.getLibelle()
            : _ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
                aNode,
                _ObjetDonneesTreeViewProgression.genreTitreContenu
                  .SsDossierTitre,
              )
          : _ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
              aNode,
              _ObjetDonneesTreeViewProgression.genreTitreContenu.Titre,
            );
    }
    return aNode.contenu.getLibelle();
  }
}
exports._ObjetDonneesTreeViewProgression = _ObjetDonneesTreeViewProgression;
(function (_ObjetDonneesTreeViewProgression) {
  let genreTitreContenu;
  (function (genreTitreContenu) {
    genreTitreContenu[(genreTitreContenu["Titre"] = 0)] = "Titre";
    genreTitreContenu[(genreTitreContenu["SsDossierTitre"] = 1)] =
      "SsDossierTitre";
    genreTitreContenu[(genreTitreContenu["DossierSsDossierTitre"] = 2)] =
      "DossierSsDossierTitre";
  })(
    (genreTitreContenu =
      _ObjetDonneesTreeViewProgression.genreTitreContenu ||
      (_ObjetDonneesTreeViewProgression.genreTitreContenu = {})),
  );
})(
  _ObjetDonneesTreeViewProgression ||
    (exports._ObjetDonneesTreeViewProgression =
      _ObjetDonneesTreeViewProgression =
        {}),
);
class ObjetNouveauElementDeProgression extends ObjetElement_1.ObjetElement {
  constructor(aLibelle, aGenreRessource, aDescriptif) {
    super(aLibelle, null, aGenreRessource);
    if (
      aGenreRessource !== Enumere_Ressource_1.EGenreRessource.DossierProgression
    ) {
      this.descriptif = aDescriptif ? aDescriptif : "";
      this.ListePieceJointe = new ObjetListeElements_1.ObjetListeElements();
      if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.ContenuDeCours
      ) {
        this.categorie = new ObjetElement_1.ObjetElement("", 0);
        this.listeExecutionQCM = new ObjetListeElements_1.ObjetListeElements();
      } else {
        this.date = 0;
      }
    }
    this.contenu = true;
    this.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  }
}
class ObjetDonneesTreeViewProgressionSelection extends _ObjetDonneesTreeViewProgression {
  constructor(aListeElements, aSansElementsAssoc, aAvecContenu, aAvecTAF) {
    super(aListeElements);
    this.sansElementsAssoc = aSansElementsAssoc;
    this.avecContenu = aAvecContenu;
    this.avecTAF = aAvecTAF;
  }
  traiterNodes() {
    const lRacines = this.listeRacines();
    let lNode;
    for (let i = 0; i < lRacines.length; i++) {
      lNode = lRacines[i];
      const lResult = this.tousLesFilsSontAffectes(lNode);
      if (
        lResult &&
        lNode.contenu.getGenre() !==
          Enumere_Ressource_1.EGenreRessource.Progression
      ) {
        lNode.affecte = lResult.affecte;
        lNode.avecFeuille =
          lResult.avecFeuille && !!lNode.contenu.listeContenus;
        if (lNode.affecte || !lNode.avecFeuille) {
          lNode.deploye = false;
        }
      }
    }
    if (this.sansElementsAssoc) {
      let i = 0;
      while (i < this.listeNodes.length) {
        lNode = this.listeNodes[i];
        switch (lNode.contenu.getGenre()) {
          case Enumere_Ressource_1.EGenreRessource.DossierProgression: {
            if (lNode.affecte || !lNode.avecFeuille) {
              this.supprimerNode(lNode);
            } else {
              i++;
            }
            break;
          }
          case Enumere_Ressource_1.EGenreRessource.Progression: {
            i++;
            break;
          }
          default: {
            if (lNode.affecte) {
              this.supprimerNode(lNode);
            } else {
              i++;
            }
            break;
          }
        }
      }
    }
  }
  tousLesFilsSontAffectes(aNode) {
    if (!aNode) {
      return null;
    }
    const lResult = { affecte: true, avecFeuille: false };
    const lFils = aNode.listeFils();
    for (let i = 0; i < lFils.length; i++) {
      const lNode = lFils[i];
      if (
        lNode.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierProgression
      ) {
        const lResultFils = this.tousLesFilsSontAffectes(lNode);
        lNode.avecFeuille =
          !!lNode.contenu.listeContenus && lResultFils.avecFeuille;
        lNode.affecte = lResultFils.affecte && lNode.avecFeuille;
        if (lNode.avecFeuille) {
          lResult.avecFeuille = true;
        }
        if (!lNode.affecte && lNode.avecFeuille) {
          lResult.affecte = false;
        }
        if (lNode.affecte || !lNode.avecFeuille) {
          lNode.deploye = false;
        }
      } else {
        lNode.affecte = !!lNode.contenu.listeAffectes;
        lResult.avecFeuille = true;
        if (!lNode.affecte) {
          lResult.affecte = false;
        }
      }
    }
    return lResult;
  }
  getVisible(aNode) {
    return (
      !this.sansElementsAssoc ||
      (this.sansElementsAssoc &&
        !aNode.affecte &&
        (aNode.avecFeuille ||
          aNode.contenu.getGenre() !==
            Enumere_Ressource_1.EGenreRessource.DossierProgression))
    );
  }
  getSelection(aNode) {
    if (aNode) {
      switch (aNode.contenu.getGenre()) {
        case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
        case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
          return aNode;
      }
    }
    return null;
  }
  avecMultiSelection() {
    return false;
  }
  getSelectionFocus(aNode) {
    if (aNode) {
      switch (aNode.contenu.getGenre()) {
        case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
        case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
          return aNode;
        case Enumere_Ressource_1.EGenreRessource.DossierProgression:
          if (
            (!aNode.contenu.listeDossiers ||
              aNode.contenu.listeDossiers.count() === 0) &&
            aNode.contenu.listeContenus &&
            aNode.contenu.listeContenus.count() > 0
          ) {
            return aNode;
          }
      }
    }
    return null;
  }
  avecEdition() {
    return false;
  }
  getLibelleNode(aNode) {
    const lLibelle = aNode.contenu.getLibelle();
    return aNode.affecte ? "* " + lLibelle : lLibelle;
  }
  getStyleLibelle(aNode, aSelectionne) {
    let lStyle = super.getStyleLibelle(aNode, aSelectionne);
    if (!aSelectionne && aNode.affecte) {
      lStyle += ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.grisFonce);
    }
    return lStyle;
  }
  getClassLibelle(aNode) {
    let lClass = super.getClassLibelle(aNode);
    if (aNode && aNode.affecte) {
      lClass += " Italique";
    }
    return lClass.trim();
  }
  avecHintDeLibelle(aNode) {
    return !!(aNode && aNode.contenu.listeAffectes);
  }
  getHintDeLibelle(aNode) {
    const H = [];
    if (aNode && aNode.contenu.listeAffectes) {
      for (let i = 0, lNb = aNode.contenu.listeAffectes.count(); i < lNb; i++) {
        const lDate = aNode.contenu.listeAffectes.get(i).date;
        if (lDate) {
          const lChaineDate = ObjetDate_1.GDate.formatDate(
            lDate,
            "%J %MMMM %AAAA",
          );
          if (!H.includes(lChaineDate)) {
            H.push(lChaineDate);
          }
        }
      }
    }
    let lChaine = "";
    if (H.length > 0) {
      lChaine +=
        ObjetTraduction_1.GTraductions.getValeur(
          "progression.HintDateAffectation",
        ) + " : ";
    }
    lChaine += H.join(", ");
    return lChaine;
  }
  avecEvenementDeGenre(aGenreEvenement) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView
        .selectionDblClick:
        return true;
      default:
        return false;
    }
  }
}
exports.ObjetDonneesTreeViewProgressionSelection =
  ObjetDonneesTreeViewProgressionSelection;
const EGenreEvenementContextuelTreeViewProgression = {
  ajouterDossier: 1,
  ajouterSousDossier: 2,
  ajouterContenu: 3,
  ajouterTAF: 4,
  editer: 6,
  supprimer: 7,
  affecterProgramme: 9,
};
exports.EGenreEvenementContextuelTreeViewProgression =
  EGenreEvenementContextuelTreeViewProgression;
class ObjetDonneesTreeViewProgression extends _ObjetDonneesTreeViewProgression {
  constructor(aListeElements) {
    super(aListeElements);
    this.sansElementsAssoc = false;
    this.avecContenu = true;
    this.avecTAF = true;
    this.setOptionsTreeView({
      avecCreation: true,
      avecEdition: true,
      avecSuppression: true,
    });
  }
  avecDragNDrop() {
    return true;
  }
  dragAutorise() {
    return true;
  }
  dropNodeAutorise(aNodeSource, aNodeCible) {
    if (
      aNodeSource &&
      aNodeCible &&
      aNodeCible.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierProgression
    ) {
      if (
        aNodeSource.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierProgression
      ) {
        if (
          aNodeSource.identique(aNodeCible) ||
          aNodeSource.estAncetreDuNoeud(aNodeCible) ||
          (aNodeSource.pere && aNodeSource.pere.identique(aNodeCible))
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return !aNodeSource.pere.identique(aNodeCible);
      }
    }
  }
  dropInterNodeAutorise(aNodeSource, aNodeCibleAvant, aNodeCibleApres) {
    if (!aNodeSource) {
      return false;
    }
    if (!aNodeCibleApres && !aNodeCibleAvant) {
      return false;
    }
    if (
      aNodeSource.identique(aNodeCibleAvant) ||
      aNodeSource.identique(aNodeCibleApres)
    ) {
      return false;
    }
    switch (aNodeSource.contenu.getGenre()) {
      case Enumere_Ressource_1.EGenreRessource.DossierProgression: {
        if (
          aNodeCibleAvant &&
          aNodeCibleAvant.visible() &&
          [
            Enumere_Ressource_1.EGenreRessource.ContenuDeCours,
            Enumere_Ressource_1.EGenreRessource.TravailAFaire,
          ].includes(aNodeCibleAvant.contenu.getGenre())
        ) {
          return false;
        }
        return true;
      }
      case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
      case Enumere_Ressource_1.EGenreRessource.TravailAFaire: {
        if (
          aNodeCibleApres &&
          aNodeCibleApres.visible() &&
          aNodeCibleApres.contenu.getGenre() ===
            Enumere_Ressource_1.EGenreRessource.DossierProgression
        ) {
          return false;
        }
        return true;
      }
    }
  }
  surDeplacement(aNodeSource, aNodeCible, aInsertionAvant) {
    const lResult = this._trouverListeEtIndex(
      this.donnees,
      aNodeSource.contenu,
    );
    if (!lResult || !lResult.liste) {
      return false;
    }
    if (aInsertionAvant === null || aInsertionAvant === undefined) {
      if (aNodeSource.identique(aNodeCible)) {
        return false;
      }
      switch (aNodeSource.contenu.getGenre()) {
        case Enumere_Ressource_1.EGenreRessource.DossierProgression: {
          if (!aNodeSource.pere && !aNodeCible) {
            return false;
          }
          aNodeSource.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          MethodesTableau_1.MethodesTableau.supprimerElement(
            lResult.liste.getTabListeElements(),
            lResult.index,
          );
          if (aNodeCible) {
            if (!aNodeCible.contenu.listeDossiers) {
              aNodeCible.contenu.listeDossiers =
                new ObjetListeElements_1.ObjetListeElements();
            }
            aNodeCible.contenu.listeDossiers.addElement(aNodeSource.contenu);
          } else {
            this.donnees.addElement(aNodeSource.contenu);
          }
          return true;
        }
        case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
        case Enumere_Ressource_1.EGenreRessource.TravailAFaire: {
          if (!aNodeCible) {
            return false;
          }
          aNodeSource.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          MethodesTableau_1.MethodesTableau.supprimerElement(
            lResult.liste.getTabListeElements(),
            lResult.index,
          );
          if (!aNodeCible.contenu.listeContenus) {
            aNodeCible.contenu.listeContenus =
              new ObjetListeElements_1.ObjetListeElements();
          }
          aNodeCible.contenu.listeContenus.addElement(aNodeSource.contenu);
          return true;
        }
      }
    } else {
      if (!aNodeCible) {
        return false;
      }
      const lResultCible = this._trouverListeEtIndex(
        this.donnees,
        aNodeCible.contenu,
      );
      if (!lResult || !lResultCible || !lResult.liste || !lResultCible.liste) {
        return false;
      }
      aNodeSource.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      const lIndexSource = lResult.index;
      let lIndexCible = lResultCible.index + (aInsertionAvant ? 0 : 1);
      if (lIndexCible > lIndexSource) {
        lIndexCible--;
      }
      MethodesTableau_1.MethodesTableau.supprimerElement(
        lResult.liste.getTabListeElements(),
        lIndexSource,
      );
      lResult.liste.insererElement(aNodeSource.contenu, lIndexCible);
      return true;
    }
  }
  surCreation(aNodePere, aElement) {
    if (!aElement) {
      return false;
    }
    if (!aNodePere) {
      this.donnees.addElement(aElement);
      return true;
    }
    if (!aNodePere.contenu) {
      return false;
    }
    if (
      aElement.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.DossierProgression
    ) {
      if (!aNodePere.contenu.listeDossiers) {
        aNodePere.contenu.listeDossiers =
          new ObjetListeElements_1.ObjetListeElements();
      }
      aNodePere.contenu.listeDossiers.addElement(aElement);
    } else {
      if (!aNodePere.contenu.listeContenus) {
        aNodePere.contenu.listeContenus =
          new ObjetListeElements_1.ObjetListeElements();
      }
      aNodePere.contenu.listeContenus.addElement(aElement);
    }
    return true;
  }
  avecEditionApresCreation() {
    return true;
  }
  surEditionFin(aNode, aValue) {
    if (aValue && aValue.length > 0) {
      if (aNode.contenu.Libelle === aValue) {
        return false;
      }
      aNode.contenu.Libelle = aValue;
      aNode.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      return true;
    } else {
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        message: ObjetTraduction_1.GTraductions.getValeur(
          "progression.LibelleNonVide",
        ),
      });
      return false;
    }
  }
  surSuppression(aNode) {
    aNode.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    return;
  }
  avecMenuContextuel() {
    return true;
  }
  avecMenuContextuelSurBouton(aNode, aGenreEvenementDeBouton) {
    if (
      aGenreEvenementDeBouton ===
      Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation
    ) {
      return true;
    } else {
      return false;
    }
  }
  initialisationMenuContextuel(aInstance, aNode) {
    this._initialisationMenuContextuelProgression(aInstance, aNode, false);
  }
  initialisationMenuContextuelSurBouton(
    aInstance,
    aNode,
    aGenreEvenementTreeView,
  ) {
    if (
      aGenreEvenementTreeView !==
      Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation
    ) {
      return;
    }
    this._initialisationMenuContextuelProgression(aInstance, aNode, true);
  }
  _initialisationMenuContextuelProgression(
    aInstance,
    aNode,
    aSurBoutonCreation,
  ) {
    if (!aInstance) {
      return;
    }
    if (!aNode) {
      aInstance.addCommande(
        EGenreEvenementContextuelTreeViewProgression.ajouterDossier,
        ObjetTraduction_1.GTraductions.getValeur(
          "progression.AjouterUnDossier",
        ),
      );
    } else {
      if (
        aNode.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierProgression
      ) {
        if (!aNode.pere) {
          aInstance.addCommande(
            EGenreEvenementContextuelTreeViewProgression.ajouterDossier,
            ObjetTraduction_1.GTraductions.getValeur(
              "progression.AjouterUnDossier",
            ),
          );
        }
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.ajouterSousDossier,
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.AjouterUnSousDossier",
          ),
        );
        aInstance.addSeparateur();
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.ajouterContenu,
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.AjouterUnContenu",
          ),
        );
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.ajouterTAF,
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.AjouterUnTravail",
          ),
        );
        if (!aSurBoutonCreation) {
          aInstance.addSeparateur();
        }
      }
      if (!aSurBoutonCreation) {
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.editer,
          ObjetTraduction_1.GTraductions.getValeur("progression.EditerLibelle"),
        );
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.supprimer,
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.SupprimerSelection",
          ),
        );
      } else if (
        aNode.contenu.getGenre() !==
        Enumere_Ressource_1.EGenreRessource.DossierProgression
      ) {
        aInstance.addCommande(
          EGenreEvenementContextuelTreeViewProgression.ajouterDossier,
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.AjouterUnDossier",
          ),
        );
      }
    }
    aInstance.addSeparateur();
    aInstance.addCommande(
      EGenreEvenementContextuelTreeViewProgression.affecterProgramme,
      ObjetTraduction_1.GTraductions.getValeur(
        "progression.AjouterContenusProgramme",
      ),
    );
    aInstance.setDonnees();
  }
  evenementMenuContextuel(aNode, aLigne) {
    let lNouveauDossier;
    const lGenreEvenement = aLigne.getNumero();
    switch (lGenreEvenement) {
      case EGenreEvenementContextuelTreeViewProgression.ajouterDossier: {
        lNouveauDossier = new ObjetNouveauElementDeProgression(
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.NouveauDossier",
          ),
          Enumere_Ressource_1.EGenreRessource.DossierProgression,
        );
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation,
          true,
          true,
          null,
          lNouveauDossier,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.ajouterSousDossier: {
        lNouveauDossier = new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.NouveauSousDossier",
          ),
          null,
          Enumere_Ressource_1.EGenreRessource.DossierProgression,
        );
        lNouveauDossier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation,
          true,
          true,
          aNode,
          lNouveauDossier,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.ajouterContenu: {
        lNouveauDossier = new ObjetNouveauElementDeProgression(
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.NouveauContenu",
          ),
          Enumere_Ressource_1.EGenreRessource.ContenuDeCours,
        );
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation,
          true,
          true,
          aNode,
          lNouveauDossier,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.ajouterTAF: {
        lNouveauDossier = new ObjetNouveauElementDeProgression(
          ObjetTraduction_1.GTraductions.getValeur("progression.NouveauTAF"),
          Enumere_Ressource_1.EGenreRessource.TravailAFaire,
        );
        lNouveauDossier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation,
          true,
          true,
          aNode,
          lNouveauDossier,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.supprimer: {
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.suppression,
          false,
          false,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.editer: {
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.edition,
          false,
          false,
        );
      }
      case EGenreEvenementContextuelTreeViewProgression.affecterProgramme: {
        return _ObjetDonneesTreeView_1._ObjetDonneesTreeView.getObjetInfosMenuContextuel(
          Enumere_EvenementTreeView_1.EGenreEvenementTreeView.menuContextuel,
          false,
          false,
        );
      }
    }
    return null;
  }
  _trouverListeEtIndex(aListe, aElement) {
    if (!aListe) {
      return null;
    }
    const lIndex = aListe.getIndiceParElement(aElement);
    if (lIndex >= 0) {
      return { liste: aListe, index: lIndex };
    } else {
      for (let i = 0, lNb = aListe.count(); i < lNb; i++) {
        const lElement = aListe.get(i);
        if (lElement.existe()) {
          let lResult = this._trouverListeEtIndex(
            lElement.listeDossiers,
            aElement,
          );
          if (lResult) {
            return lResult;
          }
          lResult = this._trouverListeEtIndex(lElement.listeContenus, aElement);
          if (lResult) {
            return lResult;
          }
        }
      }
    }
    return null;
  }
  avecBoutonsEvenementDuGenre(aGenreEvenement) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.suppression:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.deplacement:
        return true;
      default:
        return false;
    }
  }
  getHintBoutonsEvenementDuGenre(aGenreEvenement, aDeplacementHaut) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation:
        return ObjetTraduction_1.GTraductions.getValeur(
          "progression.BoutonAjouter",
        );
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.suppression:
        return ObjetTraduction_1.GTraductions.getValeur(
          "progression.SupprimerSelection",
        );
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.deplacement:
        return aDeplacementHaut
          ? ObjetTraduction_1.GTraductions.getValeur(
              "progression.MonterSelection",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "progression.DescendreSelection",
            );
      default:
        return "";
    }
  }
  avecEvenementDeGenre(aGenreEvenement) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.suppression:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.editionDebut:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.editionFin:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.edition:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.creation:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.menuContextuel:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragDebut:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragFin:
        return true;
      default:
        return false;
    }
  }
}
exports.ObjetDonneesTreeViewProgression = ObjetDonneesTreeViewProgression;
class ObjetDonneesTreeViewProgression_Affectation extends _ObjetDonneesTreeViewProgression {
  constructor(aListeElements) {
    super(aListeElements);
    this.sansElementsAssoc = false;
    this.avecContenu = true;
    this.avecTAF = true;
    this.setOptionsTreeView({ avecEdition: false });
  }
  avecDragNDrop() {
    return true;
  }
  getSelection(aNode) {
    return aNode &&
      (aNode.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.ContenuDeCours ||
        aNode.contenu.getGenre() ===
          Enumere_Ressource_1.EGenreRessource.TravailAFaire)
      ? aNode
      : null;
  }
  dragAutorise(aNode) {
    return (
      aNode &&
      aNode.contenu &&
      (aNode.contenu.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.ContenuDeCours ||
        aNode.contenu.getGenre() ===
          Enumere_Ressource_1.EGenreRessource.TravailAFaire)
    );
  }
  avecEvenementDeGenre(aGenreEvenement) {
    switch (aGenreEvenement) {
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragDebut:
      case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragFin:
        return true;
      default:
        return false;
    }
  }
}
exports.ObjetDonneesTreeViewProgression_Affectation =
  ObjetDonneesTreeViewProgression_Affectation;

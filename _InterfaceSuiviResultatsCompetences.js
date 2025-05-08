const { InterfacePage } = require("InterfacePage.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  ObjetRequeteSuiviResultatsCompetences,
} = require("ObjetRequeteSuiviResultatsCompetences.js");
const {
  DonneesListe_SuiviResultatsCompEleve,
} = require("DonneesListe_SuiviResultatsCompEleve.js");
const {
  DonneesListe_SuiviResultatsCompClasse,
} = require("DonneesListe_SuiviResultatsCompClasse.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class _InterfaceSuiviResultatsCompetences extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.ids = {
      pageMessage: this.Nom + "_pageMessage",
      pageDonnees: this.Nom + "_pageDonnees",
      pageDonneesEleve: this.Nom + "_pageDonneesEleve",
      pageDonneesClasse: this.Nom + "_pageDonneesClasse",
    };
    this.donnees = {
      listePaliers: null,
      palierSelectionne: null,
      titreCompetencesMaitrisees: "",
      titreCompetencesNonMaitrisees: "",
    };
    this.optionsAffichage = {
      seuilEchecs: 75,
      seuilSucces: 75,
      niveauReference: EGenreRessource.Competence,
      afficheJaugeChronologique: false,
    };
  }
  getClasseConcernee() {}
  getPeriodeConcernee() {}
  getEleveConcerne() {}
  getElementsAddSurZoneSelection() {
    return [];
  }
  getElementsAddSurZoneParametrage() {
    return [];
  }
  estJaugeCliquable() {
    return false;
  }
  surClicJaugeEvaluations() {}
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      estComboPalierAffiche() {
        return (
          aInstance.donnees.listePaliers &&
          aInstance.donnees.listePaliers.count() > 0
        );
      },
      comboPalier: {
        init(aCombo) {
          aCombo.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur("WAI.listeSelectionPalier"),
          });
        },
        getDonnees() {
          return aInstance.donnees.listePaliers;
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (
            aInstance.donnees.palierSelectionne &&
            aInstance.donnees.listePaliers
          ) {
            lIndice = aInstance.donnees.listePaliers.getIndiceParElement(
              aInstance.donnees.palierSelectionne,
            );
          }
          return Math.max(lIndice, 0);
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle && aParametres.element) {
            aInstance.donnees.palierSelectionne = aParametres.element;
            aInstance.lancerRequeteRecuperationDonnees();
          }
        },
      },
      getTitreCompetencesMaitrisees() {
        return (
          aInstance.donnees.titreCompetencesMaitrisees ||
          GTraductions.getValeur(
            "SuiviResultatsCompetences.ListeCompetencesMaitrisees",
          )
        );
      },
      getTitreCompetencesNonMaitrisees() {
        return (
          aInstance.donnees.titreCompetencesNonMaitrisees ||
          GTraductions.getValeur(
            "SuiviResultatsCompetences.ListeCompetencesNonMaitrisees",
          )
        );
      },
    });
  }
  construireInstances() {
    super.construireInstances();
    this.identListeEleveEchecs = this.add(
      ObjetListe,
      this.evenemementSurListesEleve,
      this.initialiserListesEleve,
    );
    this.identListeEleveSucces = this.add(
      ObjetListe,
      this.evenemementSurListesEleve,
      this.initialiserListesEleve,
    );
    this.identListeClasse = this.add(
      ObjetListe,
      this.evenementSurListeClasse,
      this.initialiserListeClasse,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(...this.getElementsAddSurZoneSelection());
    this.AddSurZone.push({
      html: '<ie-combo ie-model="comboPalier" ie-display="estComboPalierAffiche"></ie-combo>',
    });
    const lElementsAddSurZoneParametrage =
      this.getElementsAddSurZoneParametrage();
    if (
      lElementsAddSurZoneParametrage &&
      lElementsAddSurZoneParametrage.length > 0
    ) {
      this.AddSurZone.push({ separateur: true });
      this.AddSurZone.push({ blocGauche: true });
      this.AddSurZone.push(...lElementsAddSurZoneParametrage);
      this.AddSurZone.push({ blocDroit: true });
    }
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="SuiviResultatsCompetences interface_affV">');
    H.push('<div id="', this.ids.pageMessage, '"></div>');
    H.push(
      '<div id="',
      this.ids.pageDonnees,
      '" class="PageDonnees interface_affV_client" style="display:none;">',
    );
    H.push(
      '<div id="',
      this.ids.pageDonneesEleve,
      '" class="PageDonneesEleve" style="display:none;">',
      '<div class="PanelDonneesEleveListe m-bottom-l">',
      '<div class="BandeauTitreTypeResultats" ie-html="getTitreCompetencesNonMaitrisees"></div>',
      '<div id="',
      this.getInstance(this.identListeEleveEchecs).getNom(),
      '"></div>',
      "</div>",
      '<div class="PanelDonneesEleveListe">',
      '<div class="BandeauTitreTypeResultats" ie-html="getTitreCompetencesMaitrisees"></div>',
      '<div id="',
      this.getInstance(this.identListeEleveSucces).getNom(),
      '"></div>',
      "</div>",
      "</div>",
    );
    H.push(
      '<div id="',
      this.ids.pageDonneesClasse,
      '" style="display:none;" class="interface_affV">',
      '<div class="interface_affV_client">',
      '<div id="',
      this.getInstance(this.identListeClasse).getNom(),
      '" class="full-height"></div>',
      "</div>",
      "</div>",
    );
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  evenementAfficherMessage(aGenreMessage) {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    GHtml.setDisplay(this.ids.pageMessage, true);
    GHtml.setDisplay(this.ids.pageDonnees, false);
    const lMessage =
      typeof aGenreMessage === "number"
        ? GTraductions.getValeur("Message")[aGenreMessage]
        : aGenreMessage;
    GHtml.setHtml(this.ids.pageMessage, this.composeMessage(lMessage));
  }
  afficherPage() {
    this.lancerRequeteRecuperationDonnees();
  }
  lancerRequeteRecuperationDonnees() {
    new ObjetRequeteSuiviResultatsCompetences(
      this,
      this._actionSurRecupererResultatsSuivis,
    ).lancerRequete({
      classe: this.getClasseConcernee(),
      periode: this.getPeriodeConcernee(),
      eleve: this.getEleveConcerne(),
      seuilEchecs: this.optionsAffichage.seuilEchecs,
      seuilSucces: this.optionsAffichage.seuilSucces,
      niveauReference: this.optionsAffichage.niveauReference,
      palierSelectionne: this.donnees.palierSelectionne,
    });
  }
  _actionSurRecupererResultatsSuivis(aJSON) {
    GHtml.setDisplay(this.ids.pageMessage, false);
    GHtml.setDisplay(this.ids.pageDonnees, true);
    this.donnees.listePaliers = aJSON.listePaliers;
    this.donnees.palierSelectionne = aJSON.palierSelectionne;
    const lEleveConcerne = this.getEleveConcerne();
    const lAfficheDonneesEleve =
      lEleveConcerne && lEleveConcerne.existeNumero();
    GHtml.setDisplay(this.ids.pageDonneesEleve, lAfficheDonneesEleve);
    GHtml.setDisplay(this.ids.pageDonneesClasse, !lAfficheDonneesEleve);
    this.donnees.titreCompetencesNonMaitrisees = "";
    this.donnees.titreCompetencesMaitrisees = "";
    if (lAfficheDonneesEleve) {
      this.donnees.titreCompetencesNonMaitrisees =
        aJSON.titreCompetencesNonMaitrisees;
      this._formaterDonneesListeCompetences(aJSON.listeCompetencesEchecs);
      this.donnees.titreCompetencesMaitrisees =
        aJSON.titreCompetencesMaitrisees;
      this._formaterDonneesListeCompetences(aJSON.listeCompetencesSucces);
      this.getInstance(this.identListeEleveEchecs).setDonnees(
        new DonneesListe_SuiviResultatsCompEleve(aJSON.listeCompetencesEchecs, {
          avecJaugeCliquable: this.estJaugeCliquable(),
        }),
      );
      this.getInstance(this.identListeEleveSucces).setDonnees(
        new DonneesListe_SuiviResultatsCompEleve(aJSON.listeCompetencesSucces, {
          avecJaugeCliquable: this.estJaugeCliquable(),
        }),
      );
    } else {
      this.getInstance(this.identListeClasse).setDonnees(
        new DonneesListe_SuiviResultatsCompClasse(aJSON.listeEleves),
      );
    }
  }
  _formaterDonneesListeCompetences(aListeCompetences) {
    if (aListeCompetences) {
      const lDerniersPeres = [];
      aListeCompetences.parcourir((D) => {
        let lNivDepl = D.niveauDeploiement;
        if (lNivDepl > 1) {
          const lPereNiveauPrecedent = lDerniersPeres[lNivDepl - 2];
          if (lPereNiveauPrecedent) {
            D.pere = lPereNiveauPrecedent;
            lPereNiveauPrecedent.estUnDeploiement = true;
            lPereNiveauPrecedent.estDeploye = true;
          }
        }
        lDerniersPeres[lNivDepl - 1] = D;
      });
    }
  }
  initialiserListesEleve(aInstance) {
    const lInstanceInterface = this;
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_SuiviResultatsCompEleve.colonnes.libelle,
      titre: GTraductions.getValeur("SuiviResultatsCompetences.colonnes.Items"),
      taille: 400,
    });
    const lLibelleColonneJauge = [];
    lLibelleColonneJauge.push('<div class="flex-contain flex-center">');
    lLibelleColonneJauge.push(
      '<ie-btnimage ie-model="btnBasculeJauge" class="Image_BasculeJauge" style="width:18px;"></ie-btnimage>',
    );
    lLibelleColonneJauge.push(
      `<span class="fluid-bloc">${GTraductions.getValeur("SuiviResultatsCompetences.colonnes.Jauge")}</span>`,
    );
    lLibelleColonneJauge.push("</div>");
    lColonnes.push({
      id: DonneesListe_SuiviResultatsCompEleve.colonnes.jauge,
      titre: {
        libelleHtml: lLibelleColonneJauge.join(""),
        controleur: {
          btnBasculeJauge: {
            event() {
              lInstanceInterface.optionsAffichage.afficheJaugeChronologique =
                !lInstanceInterface.optionsAffichage.afficheJaugeChronologique;
              lInstanceInterface.miseAJourListeEleves();
            },
            getTitle() {
              return lInstanceInterface.optionsAffichage
                .afficheJaugeChronologique
                ? GTraductions.getValeur(
                    "BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
                  )
                : GTraductions.getValeur(
                    "BulletinEtReleve.hintBtnAfficherJaugeChronologique",
                  );
            },
            getSelection() {
              return lInstanceInterface.optionsAffichage
                .afficheJaugeChronologique;
            },
          },
        },
      },
      taille: 400,
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      boutons: [{ genre: ObjetListe.typeBouton.deployer }],
    });
  }
  evenemementSurListesEleve(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.SelectionClick:
        if (
          aParametres.idColonne ===
            DonneesListe_SuiviResultatsCompEleve.colonnes.jauge &&
          this.estJaugeCliquable()
        ) {
          this.surClicJaugeEvaluations(aParametres.article);
        }
        break;
    }
  }
  miseAJourListeEleves() {
    const lParams = {
      afficheJaugeChronologique:
        this.optionsAffichage.afficheJaugeChronologique,
    };
    this.getInstance(this.identListeEleveEchecs)
      .getDonneesListe()
      .setOptionsAffichage(lParams);
    this.getInstance(this.identListeEleveSucces)
      .getDonneesListe()
      .setOptionsAffichage(lParams);
    this.getInstance(this.identListeEleveEchecs).actualiser(true);
    this.getInstance(this.identListeEleveSucces).actualiser(true);
  }
  initialiserListeClasse(aInstance) {
    const lFuncConstruitTitreColonne = function (
      aClasseMixIcon,
      aClasseCouleurMixIcon,
      aCleTraduction,
    ) {
      return (
        '<i class="icon_sigma ' +
        aClasseMixIcon +
        " " +
        aClasseCouleurMixIcon +
        ' i-top" aria-hidden="true"></i><span class="m-left">' +
        GTraductions.getValeur(aCleTraduction) +
        "</span>"
      );
    };
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_SuiviResultatsCompClasse.colonnes.eleve,
      titre: GTraductions.getValeur(
        "SuiviResultatsCompetences.colonnes.Eleves",
      ),
      taille: 300,
    });
    lColonnes.push({
      id: DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs,
      titre: {
        libelleHtml: lFuncConstruitTitreColonne(
          "mix-icon_remove",
          "i-red",
          "SuiviResultatsCompetences.colonnes.NbCompetencesEchecs",
        ),
        title: GTraductions.getValeur(
          "SuiviResultatsCompetences.hintColonnes.NbCompetencesEchecs",
        ),
      },
      taille: 120,
    });
    lColonnes.push({
      id: DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces,
      titre: {
        libelleHtml: lFuncConstruitTitreColonne(
          "mix-icon_ok",
          "i-green",
          "SuiviResultatsCompetences.colonnes.NbCompetencesSucces",
        ),
        title: GTraductions.getValeur(
          "SuiviResultatsCompetences.hintColonnes.NbCompetencesSucces",
        ),
      },
      taille: 120,
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
    GEtatUtilisateur.setTriListe({
      liste: aInstance,
      tri: [DonneesListe_SuiviResultatsCompClasse.colonnes.eleve],
    });
  }
  evenementSurListeClasse() {}
}
module.exports = { _InterfaceSuiviResultatsCompetences };

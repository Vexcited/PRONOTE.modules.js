const { GStyle } = require("ObjetStyle.js");
const { GHtml } = require("ObjetHtml.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_CompetencesNumeriques,
} = require("DonneesListe_CompetencesNumeriques.js");
const { InterfacePage } = require("InterfacePage.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
class _InterfaceCompetencesNumeriques extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = {};
    this.filtrerNiveauxSansEvaluation = false;
    this.ids = {
      piedPage: this.Nom + "_pied",
      listeConteneur: this.Nom + "_listeConteneur",
      textareaApprecation: this.Nom + "_appreciation",
    };
    this.parametres = { heightPied: 10, heightLibelleObservation: 2 };
  }
  estAffichageDeLaClasse() {
    return false;
  }
  construireInstances() {
    this.identReleve = this.add(ObjetListe);
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div style="',
      GStyle.composeHeight(100, "%"),
      '" class="EspaceGauche EspaceDroit">',
    );
    H.push(
      '<div id="',
      this.ids.listeConteneur,
      '" ',
      GNavigateur.isLayoutTactile
        ? ""
        : 'style="height:calc(100% - ' + this.parametres.heightPied + 'rem);"',
      ">",
      '<div id="',
      this.getInstance(this.identReleve).getNom(),
      '" style="height:100%;"></div>',
      "</div>",
    );
    H.push(
      '<div id="',
      this.ids.piedPage,
      '" style="height:',
      this.parametres.heightPied,
      'rem; display: none;">',
      '<div class="Gras" style="',
      GStyle.composeHeight(this.parametres.heightLibelleObservation, "rem"),
      " line-height: ",
      this.parametres.heightLibelleObservation,
      'rem;">',
      `<label ie-html="getLibelleAppreciation" for="${this.ids.textareaApprecation}"></label>`,
      "</div>",
      '<ie-textareamax id="',
      this.ids.textareaApprecation,
      '" ie-model="modelAppreciation" maxlength="',
      GParametres.getTailleMaxAppreciationParEnumere(
        TypeGenreAppreciation.GA_BilanAnnuel_Generale,
      ),
      '" style="height: calc(100% - ' +
        this.parametres.heightLibelleObservation +
        'rem - 1rem);width: 100%;margin: 0;"></ie-textareamax>',
      "</div>",
    );
    H.push("</div>");
    return H.join("");
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identReleve;
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  evenementAfficherMessage(aGenreMessage) {
    GHtml.setDisplay(this.ids.piedPage, false);
    super.evenementAfficherMessage(aGenreMessage);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      cbFiltrerNiveauxEvalues: {
        getValue: function () {
          return aInstance.filtrerNiveauxSansEvaluation;
        },
        setValue: function () {
          aInstance.filtrerNiveauxSansEvaluation =
            !aInstance.filtrerNiveauxSansEvaluation;
          if (aInstance.getEtatSaisie() === true) {
            ControleSaisieEvenement(aInstance.afficherPage.bind(aInstance));
          } else {
            aInstance.afficherPage();
          }
        },
        getDisabled: function () {
          return aInstance.estAffichageDeLaClasse();
        },
      },
      modelAppreciation: {
        getValue: function () {
          return aInstance.donnees.appreciation;
        },
        setValue: function (aValue) {
          aInstance.donnees.appreciation = aValue;
          aInstance.setEtatSaisie(true);
        },
        getDisabled: function () {
          return !aInstance.donnees.appreciationEstEditable;
        },
      },
      getLibelleAppreciation: function () {
        if (aInstance.estAffichageDeLaClasse()) {
          return GTraductions.getValeur("competences.AppreciationDeLaClasse");
        } else {
          return GTraductions.getValeur("competences.AppreciationDeLEleve");
        }
      },
    });
  }
  _construitAddSurZoneCommun() {
    return [
      {
        html:
          '<ie-checkbox ie-model="cbFiltrerNiveauxEvalues">' +
          GTraductions.getValeur("competences.FiltrerItemsEvalues") +
          "</ie-checkbox>",
      },
    ];
  }
  _actualiserCommandePDF() {
    return false;
  }
  _reponseRequeteCompetences(aDonnees) {
    this.setEtatSaisie(false);
    GHtml.setDisplay(this.ids.listeConteneur, true);
    this.donnees = Object.assign(
      {
        droitSaisie: false,
        palier: null,
        listePiliers: null,
        listeCompetences: null,
        appreciation: "",
        appreciationEstEditable: false,
        appreciationsDifferentes: false,
      },
      aDonnees,
    );
    _initListeReleve.call(this, this.getInstance(this.identReleve));
    GHtml.setDisplay(this.ids.piedPage, true);
    _actualiserListe.call(this);
    const $textareaAppreciation = $(
      "#" + this.ids.textareaApprecation.escapeJQ(),
    );
    if (
      this.estAffichageDeLaClasse() &&
      this.donnees.appreciationsDifferentes
    ) {
      $textareaAppreciation.attr(
        "placeholder",
        GTraductions.getValeur("competences.AppreciationsDifferentes"),
      );
    } else {
      $textareaAppreciation.removeAttr("placeholder");
    }
    if (this.estAffichageDeLaClasse()) {
      GHtml.setDisplay(this.ids.listeConteneur, false);
    }
    this._actualiserCommandePDF();
  }
}
function _avecColonneEvaluations() {
  return !GEtatUtilisateur.pourPrimaire();
}
function _initListeReleve(aInstance) {
  const lThis = this;
  const lAvecBoutonValid = this.donnees.droitSaisie;
  if (lAvecBoutonValid) {
    aInstance.controleur.btnValidationAuto = {
      event() {
        TUtilitaireCompetences.surBoutonValidationAuto({
          estCompetenceNumerique: true,
          instance: lThis,
          palier: lThis.donnees.palier,
          listePiliers: lThis.donnees.listePiliers,
        });
      },
      getTitle() {
        return GTraductions.getValeur(
          "competences.validationAuto.hintBoutonCN",
        );
      },
    };
  }
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_CompetencesNumeriques.colonnes.items,
    taille: "100%",
    titre: GTraductions.getValeur("competences.competetencesNumeriques"),
  });
  if (_avecColonneEvaluations()) {
    lColonnes.push({
      id: DonneesListe_CompetencesNumeriques.colonnes.evaluations,
      taille: 200,
      titre: GTraductions.getValeur("competences.evaluations"),
    });
  }
  lColonnes.push({
    id: DonneesListe_CompetencesNumeriques.colonnes.niveau,
    taille: 70,
    titre: {
      libelleHtml:
        (lAvecBoutonValid
          ? '<ie-btnicon ie-model="btnValidationAuto" class="icon_sigma color-neutre MargeDroit"></ie-btnicon>'
          : "") + GTraductions.getValeur("competences.niveau"),
    },
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
  });
}
function _actualiserListe() {
  const lDonneesListe = new DonneesListe_CompetencesNumeriques(
    this.donnees.listeCompetences,
    {
      callbackInitMenuContextuel: this._initMenuContextuelListe
        ? this._initMenuContextuelListe.bind(this)
        : null,
    },
  );
  lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
  this.getInstance(this.identReleve).setDonnees(lDonneesListe);
}
module.exports = { _InterfaceCompetencesNumeriques };

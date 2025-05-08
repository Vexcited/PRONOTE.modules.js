const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const {
  ObjetRequetePageStageGeneral,
} = require("ObjetRequetePageStageGeneral.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const {
  DonneesListe_EvaluationAccueilStage,
} = require("DonneesListe_EvaluationAccueilStage.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TypeEtatSatisfaction } = require("TypeEtatSatisfaction.js");
Requetes.inscrire("EvaluationAccueilStage", ObjetRequeteConsultation);
Requetes.inscrire("SaisieEvaluationAccueilStage", ObjetRequeteSaisie);
class InterfaceEvaluationAccueilStage extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.classMessage = GUID.getClassCss();
    this.classPage = GUID.getClassCss();
    this.idPage = GUID.getId();
    this.donnees = { libelleBandeau: "", hintLibelleBandeau: "" };
  }
  construireInstances() {
    this.identCombo = this.add(
      ObjetSaisiePN,
      this.evenementCombo,
      this.initialiserCombo,
    );
    this.IdPremierElement = this.getInstance(
      this.identCombo,
    ).getPremierElement();
    this.identListeEvaluation = this.add(
      ObjetListe,
      this.evenementListeEvaluation,
      this.initialiserListeEvaluation,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identCombo);
    this.AddSurZone.push({
      html: '<span class="Gras" ie-html="getLibelleBandeau" ie-hint="getHintLibelleBandeau"></span>',
    });
  }
  construireStructureAffichageAutre() {
    const lHTML = [];
    const lIdObservation = GUID.getId();
    lHTML.push(
      '<div id="',
      this.idPage,
      '" class="',
      this.classPage,
      ' p-all-l flex-contain cols" style="display: none; max-width:800px;">',
      '<h2 class="ie-titre-couleur p-bottom-l border-bottom">',
      GTraductions.getValeur("questionnaireStage.EntrepriseDAccueil"),
      "</h2>",
      '<div class="p-all-l m-top-l" ie-html="entreprise"></div>',
      '<h2 class="ie-titre-couleur p-bottom-l border-bottom">',
      GTraductions.getValeur("questionnaireStage.AvisQualiteAccueil"),
      "</h2>",
      '<div class="p-all-l" ie-html="messageRepondreAvant"></div>',
      '<div class="p-all-l m-bottom-l" id="',
      this.getInstance(this.identListeEvaluation).getNom(),
      '"></div>',
      '<h2 id="',
      lIdObservation,
      '" class="ie-titre-couleur p-y-l border-bottom">',
      GTraductions.getValeur("questionnaireStage.Observations"),
      "</h2>",
      '<div class="p-y-l p-left-l"><ie-textareamax aria-labelledby="',
      lIdObservation,
      '" ie-model="observation" maxlength="1000" class="round-style FondBlanc" style="',
      GStyle.composeHeight(120),
      '" ></ie-textareamax></div>',
      "</div>",
    );
    lHTML.push(
      '<div class="',
      this.classMessage,
      ' semi-bold p-top-l AlignementMilieu" ie-html="getMessage" style="height: 100%;" tabindex="0" "' +
        GObjetWAI.composeAttribut({
          genre: EGenreAttribut.labelledby,
          valeur: this.idMessage,
        }) +
        '"></div>',
    );
    return lHTML.join("");
  }
  recupererDonnees() {
    this.setEtatSaisie(false);
    new ObjetRequetePageStageGeneral(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete(
      GEtatUtilisateur.getMembre()
        ? GEtatUtilisateur.getMembre().getNumero()
        : 0,
    );
  }
  actionSurRecupererDonnees(aListeStages) {
    this.listeStages = aListeStages.getListeElements((aElement) => {
      return aElement.questionnaireEstPublie;
    });
    if (this.listeStages.count() > 0) {
      this.getInstance(this.identCombo).setDonnees(this.listeStages);
      this.getInstance(this.identCombo).setSelectionParNumeroEtGenre(
        GEtatUtilisateur.Navigation.getNumeroRessource(EGenreRessource.Stage),
        GEtatUtilisateur.Navigation.getGenreRessource(EGenreRessource.Stage),
        0,
      );
      this.getInstance(this.identCombo).setVisible(true);
      GHtml.setDisplay(this.idPage, true);
    } else {
      this.getInstance(this.identCombo).setVisible(false);
      GHtml.setDisplay(this.idPage, false);
      this.message = GTraductions.getValeur(
        "questionnaireStage.AucunQuestionnairePublie",
      );
    }
  }
  evenementCombo(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      this.libelleStage = aParams.element.getLibelle();
      this.stageCourant = aParams.element;
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Stage,
        aParams.element,
      );
      let lNouveauLibelleBandeau = aParams.element.periode;
      let lInfobulleBandeau = "";
      const lArray = lNouveauLibelleBandeau.split("; ");
      if (lArray.length > 5) {
        lInfobulleBandeau = lNouveauLibelleBandeau;
        lNouveauLibelleBandeau = "&nbsp;";
        for (let i = 0; i < 5; i++) {
          lNouveauLibelleBandeau += lArray[i] + "; ";
        }
        lNouveauLibelleBandeau += "...";
      } else {
        lNouveauLibelleBandeau = "&nbsp;" + lNouveauLibelleBandeau;
      }
      this.donnees.libelleBandeau = lNouveauLibelleBandeau;
      this.donnees.hintLibelleBandeau = "";
      if (!!lInfobulleBandeau) {
        this.donnees.hintLibelleBandeau = lInfobulleBandeau;
      }
      Requetes(
        "EvaluationAccueilStage",
        this,
        _actionApresRequeteEvaluationAccueilStage.bind(this),
      ).lancerRequete({ stage: this.stageCourant });
    }
  }
  evenementListeEvaluation(aParams) {
    let lDonnee;
    if (
      aParams.article &&
      aParams.genreEvenement === EGenreEvenementListe.Edition
    ) {
      lDonnee = aParams.article;
      switch (aParams.idColonne) {
        case DonneesListe_EvaluationAccueilStage.colonnes.tresInsatisfait:
          lDonnee.typeSatisfaction =
            lDonnee.typeSatisfaction !==
            TypeEtatSatisfaction.Tes_TresInsatisfait
              ? TypeEtatSatisfaction.Tes_TresInsatisfait
              : TypeEtatSatisfaction.Tes_NonEvalue;
          break;
        case DonneesListe_EvaluationAccueilStage.colonnes.insatisfait:
          lDonnee.typeSatisfaction =
            lDonnee.typeSatisfaction !== TypeEtatSatisfaction.Tes_Insatisfait
              ? TypeEtatSatisfaction.Tes_Insatisfait
              : TypeEtatSatisfaction.Tes_NonEvalue;
          break;
        case DonneesListe_EvaluationAccueilStage.colonnes.satisfait:
          lDonnee.typeSatisfaction =
            lDonnee.typeSatisfaction !== TypeEtatSatisfaction.Tes_Satisfait
              ? TypeEtatSatisfaction.Tes_Satisfait
              : TypeEtatSatisfaction.Tes_NonEvalue;
          break;
        case DonneesListe_EvaluationAccueilStage.colonnes.tresSatisfait:
          lDonnee.typeSatisfaction =
            lDonnee.typeSatisfaction !== TypeEtatSatisfaction.Tes_TresSatisfait
              ? TypeEtatSatisfaction.Tes_TresSatisfait
              : TypeEtatSatisfaction.Tes_NonEvalue;
          break;
      }
      lDonnee.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      this.getInstance(this.identListeEvaluation).actualiser(true);
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getLibelleBandeau: function () {
        return aInstance.donnees.libelleBandeau;
      },
      getHintLibelleBandeau: function () {
        return aInstance.donnees.hintLibelleBandeau;
      },
      observation: {
        getValue: function () {
          return aInstance.observation ? aInstance.observation : "";
        },
        setValue: function (aValue) {
          if (aInstance.observation !== aValue) {
            aInstance.observation = aValue;
            aInstance.setEtatSaisie(true);
          }
        },
        getDisabled: function () {
          return !aInstance.editable;
        },
      },
      entreprise: function () {
        const lHtml = [];
        if (aInstance.entreprise) {
          lHtml.push(
            `<div class="flex-contain flex-center">\n						<i class="fix-bloc icone-m m-right-l ${aInstance.entreprise.estSiegeSocial ? `icon_building` : `icon_entreprise`} theme_color_moyen1"></i>\n		        <span class="ie-titre">${aInstance.entreprise.getLibelle()}</span>${!!aInstance.entreprise.nomCommercial ? `<span> / ${aInstance.entreprise.nomCommercial}</span>` : ""}</div>`,
          );
          lHtml.push(`<div class="m-left-big p-bottom-xl">`);
          if (aInstance.entreprise.adresse1) {
            lHtml.push("<div>", aInstance.entreprise.adresse1, "</div>");
          }
          if (aInstance.entreprise.adresse2) {
            lHtml.push("<div>", aInstance.entreprise.adresse2, "</div>");
          }
          if (aInstance.entreprise.adresse3) {
            lHtml.push("<div>", aInstance.entreprise.adresse3, "</div>");
          }
          if (aInstance.entreprise.adresse4) {
            lHtml.push("<div>", aInstance.entreprise.adresse4, "</div>");
          }
          if (aInstance.entreprise.codePostal || aInstance.entreprise.ville) {
            lHtml.push("<div>");
          }
          if (aInstance.entreprise.codePostal) {
            lHtml.push(aInstance.entreprise.codePostal);
          }
          if (aInstance.entreprise.codePostal && aInstance.entreprise.ville) {
            lHtml.push(" ");
          }
          if (aInstance.entreprise.ville) {
            lHtml.push(aInstance.entreprise.ville);
          }
          if (aInstance.entreprise.codePostal || aInstance.entreprise.ville) {
            lHtml.push("</div>");
          }
          if (aInstance.entreprise.province) {
            lHtml.push("<div>", aInstance.entreprise.province, "</div>");
          }
          if (aInstance.entreprise.responsable) {
            lHtml.push(
              '<div class="m-top">',
              GTraductions.getValeur("questionnaireStage.RepresenteePar"),
              ' <span class="semi-bold">',
              aInstance.entreprise.responsable.getLibelle(),
              "</span>",
              "</div>",
            );
          }
          lHtml.push("</div>");
        }
        return lHtml.join("");
      },
      getMessage() {
        return aInstance.message;
      },
      messageRepondreAvant() {
        if (aInstance && !!aInstance.dateFin) {
          if (aInstance.editable) {
            return GTraductions.getValeur("questionnaireStage.RepondreAvant", [
              GDate.formatDate(
                aInstance.dateFin,
                '<span class="medium TexteRouge">%JJ/%MM/%AAAA</span>',
              ),
            ]);
          } else if (
            !aInstance.editable &&
            GDate.estAvantJourCourant(aInstance.dateFin)
          ) {
            return (
              '<span class="medium TexteRouge">' +
              GTraductions.getValeur("questionnaireStage.expire") +
              "</span>"
            );
          }
        }
        return "";
      },
    });
  }
  initialiserListeEvaluation(aInstance) {
    DonneesListe_EvaluationAccueilStage.init(aInstance);
  }
  initialiserCombo(aInstance) {
    aInstance.setOptionsObjetSaisie({
      labelWAICellule: GTraductions.getValeur("stage.comboStage"),
      avecTriListeElements: true,
      longueur: 160,
      initAutoSelectionAvecUnElement: false,
    });
    aInstance.setVisible(true);
  }
  valider() {
    this.listeQuestions.setSerialisateurJSON({
      methodeSerialisation: _serialisation.bind(this),
    });
    Requetes(
      "SaisieEvaluationAccueilStage",
      this,
      this.actionSurValidation,
    ).lancerRequete({
      stage: this.stageCourant,
      observation: this.observation,
      listeQuestions: this.listeQuestions,
    });
  }
  afficherPage() {
    this.recupererDonnees();
  }
}
function _actionApresRequeteEvaluationAccueilStage(aJSON) {
  this.message = aJSON && aJSON.message ? aJSON.message : "";
  if (!!this.message) {
    $("." + this.classPage.escapeJQ()).hide();
    $("." + this.classMessage.escapeJQ()).show();
  } else {
    $("." + this.classMessage.escapeJQ()).hide();
    $("." + this.classPage.escapeJQ()).show();
  }
  this.observation = aJSON && aJSON.observation ? aJSON.observation : "";
  this.listeQuestions =
    aJSON && aJSON.listeQuestions
      ? aJSON.listeQuestions
      : new ObjetListeElements();
  this.entreprise =
    aJSON && aJSON.entreprise ? aJSON.entreprise : new ObjetElement();
  this.editable = aJSON && aJSON.editable ? aJSON.editable : false;
  this.dateFin = aJSON && aJSON.dateFin ? aJSON.dateFin : null;
  this.getInstance(this.identListeEvaluation).setDonnees(
    new DonneesListe_EvaluationAccueilStage(this.listeQuestions, this.editable),
  );
}
function _serialisation(aElement, aJSON) {
  aJSON.typeSatisfaction = aElement.typeSatisfaction;
}
module.exports = { InterfaceEvaluationAccueilStage };

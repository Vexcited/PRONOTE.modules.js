const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeNote } = require("TypeNote.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class ObjetFenetre_ParametresReleveDEvaluations extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.strMarqueurAsterisque = " (*)";
    this.typeReleveEvaluations = undefined;
    this.constantes = {};
    this.optionsAffichage = {
      avecSynthese: false,
      typeEvolution: true,
      toleranceEvolution: 0,
      avecPourcentageAcqui: false,
      avecPositionnementLSUNiveau: false,
      avecPositionnementPrecedents: false,
      avecPositionnementLSUNote: false,
      avecNiveauMaitriseDomaine: false,
      avecAppreciations: false,
      avecSimuCalculPositionnement: false,
      avecRegroupementParDomaine: false,
      avecEvaluationsCoeffNul: false,
      avecEvaluationsHistoriques: false,
      avecProjetsAccompagnement: false,
      ordreColonnes: 0,
    };
    this.avecChangementsDonneesCalculSimu = false;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      checkAvecSynthese: {
        getValue() {
          return aInstance.optionsAffichage.avecSynthese;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecSynthese = aData;
        },
      },
      checkAvecEvolution: {
        getValue() {
          return (
            aInstance.optionsAffichage.typeEvolution !==
            aInstance.constantes.TypesEvolution.Aucun
          );
        },
        setValue(aData) {
          const lDataTemp = aData
            ? aInstance.constantes.TypesEvolution.Score
            : aInstance.constantes.TypesEvolution.Aucun;
          aInstance.optionsAffichage.typeEvolution = lDataTemp;
        },
      },
      surRadioTypeEvolution: {
        getValue(aTypeEvolution) {
          return aInstance.optionsAffichage.typeEvolution === aTypeEvolution;
        },
        setValue(aTypeEvolution) {
          aInstance.optionsAffichage.typeEvolution = aTypeEvolution;
        },
        getDisabled() {
          return !this.controleur.checkAvecEvolution.getValue();
        },
      },
      inputToleranceEvolution: {
        getNote() {
          return new TypeNote(
            aInstance.optionsAffichage.toleranceEvolution || 0,
          );
        },
        setNote(aNote) {
          aInstance.optionsAffichage.toleranceEvolution = aNote.getValeur();
        },
        getOptionsNote() {
          return {
            avecVirgule: false,
            sansNotePossible: false,
            avecAnnotation: false,
            min: 0,
            max: 100,
            hintSurErreur: true,
          };
        },
        getDisabled() {
          return (
            aInstance.optionsAffichage.typeEvolution !==
            aInstance.constantes.TypesEvolution.TauxReussite
          );
        },
      },
      checkAvecPourcentageAcqui: {
        getValue() {
          return aInstance.optionsAffichage.avecPourcentageAcqui;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecPourcentageAcqui = aData;
        },
      },
      checkAvecPositionnementLSUNiveau: {
        getValue() {
          return aInstance.optionsAffichage.avecPositionnementLSUNiveau;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecPositionnementLSUNiveau = aData;
        },
      },
      checkAvecPosPeriodesPrecedentes: {
        getValue() {
          return aInstance.optionsAffichage.avecPositionnementPrecedents;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecPositionnementPrecedents = aData;
        },
      },
      checkAvecPositionnementLSUNote: {
        getValue() {
          return aInstance.optionsAffichage.avecPositionnementLSUNote;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecPositionnementLSUNote = aData;
        },
      },
      checkAvecNiveauMaitriseDomaine: {
        getValue() {
          return aInstance.optionsAffichage.avecNiveauMaitriseDomaine;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecNiveauMaitriseDomaine = aData;
        },
      },
      checkAvecAppreciations: {
        getValue() {
          return aInstance.optionsAffichage.avecAppreciations;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecAppreciations = aData;
        },
      },
      checkAvecSimuCalculPositionnement: {
        getValue() {
          return aInstance.optionsAffichage.avecSimuCalculPositionnement;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecSimuCalculPositionnement = aData;
        },
      },
      btnAfficherPrefCalculPositionnement: {
        event() {
          const lEstContexteParService =
            aInstance.typeReleveEvaluations ===
            aInstance.constantes.AffichageParService;
          const lEstEnSaisie =
            !!aInstance.optionsAffichage.avecSimuCalculPositionnement;
          TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
            lEstContexteParService,
            {
              enLectureSeule: !lEstEnSaisie,
              callbackSurChangement: () => {
                aInstance.avecChangementsDonneesCalculSimu = true;
              },
            },
          );
        },
        getTitle() {
          return GTraductions.getValeur(
            "FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
          );
        },
      },
      checkAvecRegroupementParDomaine: {
        getValue() {
          return aInstance.optionsAffichage.avecRegroupementParDomaine;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecRegroupementParDomaine = aData;
        },
      },
      checkAvecEvaluationsCoeffNul: {
        getValue() {
          return aInstance.optionsAffichage.avecEvaluationsCoeffNul;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecEvaluationsCoeffNul = aData;
        },
      },
      checkAvecEvaluationsHistoriques: {
        getValue() {
          return aInstance.optionsAffichage.avecEvaluationsHistoriques;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecEvaluationsHistoriques = aData;
        },
      },
      checkAvecProjetsAccompagnement: {
        getValue() {
          return aInstance.optionsAffichage.avecProjetsAccompagnement;
        },
        setValue(aData) {
          aInstance.optionsAffichage.avecProjetsAccompagnement = aData;
        },
      },
      surRadioOrdreColonne: {
        getValue(aOrdre) {
          return aInstance.optionsAffichage.ordreColonnes === aOrdre;
        },
        setValue(aData) {
          aInstance.optionsAffichage.ordreColonnes = aData;
        },
      },
    });
  }
  _getLibelleAsterisque() {
    let lLibelle;
    if (this.typeReleveEvaluations === this.constantes.AffichageParService) {
      lLibelle = GTraductions.getValeur(
        "releve_evaluations.parametres.SelonDroitMaquette",
      );
    } else {
      lLibelle = GTraductions.getValeur(
        "releve_evaluations.parametres.SelonOptionCalculNivAcqui",
      );
    }
    return lLibelle;
  }
  _avecAsterisqueSelonDroitMaquette() {
    return this.typeReleveEvaluations === this.constantes.AffichageParService;
  }
  _getTrisPossibles() {
    const result = [];
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.OrdonnerParEvaluation",
      ),
      this.constantes.TypesTri.ParEvaluation,
    ]);
    result.push([
      GTraductions.getValeur("releve_evaluations.parametres.OrdonnerParDate"),
      this.constantes.TypesTri.ParDate,
    ]);
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.OrdonnerParCompetence",
      ),
      this.constantes.TypesTri.ParCompetence,
    ]);
    if (this.typeReleveEvaluations === this.constantes.AffichageParClasse) {
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.OrdonnerParMatiere",
        ),
        this.constantes.TypesTri.ParMatiere,
      ]);
    }
    return result;
  }
  _getOptionsGeneralesPossibles() {
    const result = [];
    if (
      this.typeReleveEvaluations === this.constantes.AffichageParService &&
      !GEtatUtilisateur.pourPrimaire()
    ) {
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecRegroupementParDomaine",
        ),
        "checkAvecRegroupementParDomaine",
      ]);
    }
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.AvecEvaluationsCoeffNul",
      ),
      "checkAvecEvaluationsCoeffNul",
    ]);
    if (this.typeReleveEvaluations === this.constantes.AffichageParClasse) {
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecEvaluationsHistoriques",
        ) + this.strMarqueurAsterisque,
        "checkAvecEvaluationsHistoriques",
      ]);
    }
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.AvecProjetsAccompagnement",
      ),
      "checkAvecProjetsAccompagnement",
    ]);
    return result;
  }
  _getColonnesComplementairesPossibles() {
    const result = [];
    result.push([
      GTraductions.getValeur("releve_evaluations.parametres.AvecSynthese"),
      "checkAvecSynthese",
    ]);
    if (this.typeReleveEvaluations === this.constantes.AffichageParClasse) {
      result.push([
        GTraductions.getValeur("releve_evaluations.parametres.AvecEvolution"),
        "checkAvecEvolution",
      ]);
    }
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.AvecPourcentageAcqui",
      ) +
        (this._avecAsterisqueSelonDroitMaquette()
          ? this.strMarqueurAsterisque
          : ""),
      "checkAvecPourcentageAcqui",
    ]);
    if (this.typeReleveEvaluations === this.constantes.AffichageParService) {
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecPosLSUNiveau",
        ) + this.strMarqueurAsterisque,
        "checkAvecPositionnementLSUNiveau",
      ]);
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecPosPeriodesPrecedentes",
        ) + this.strMarqueurAsterisque,
        "checkAvecPosPeriodesPrecedentes",
      ]);
      if (!GEtatUtilisateur.pourPrimaire()) {
        result.push([
          GTraductions.getValeur(
            "releve_evaluations.parametres.AvecPosLSUNote",
          ) + this.strMarqueurAsterisque,
          "checkAvecPositionnementLSUNote",
        ]);
      }
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecAppreciations",
        ) + this.strMarqueurAsterisque,
        "checkAvecAppreciations",
      ]);
    } else {
      result.push([
        GTraductions.getValeur(
          "releve_evaluations.parametres.AvecNiveauMaitriseDomaine",
        ),
        "checkAvecNiveauMaitriseDomaine",
      ]);
    }
    result.push([
      GTraductions.getValeur(
        "releve_evaluations.parametres.AvecSimulationsCalculPosLSU",
      ) + this.strMarqueurAsterisque,
      "checkAvecSimuCalculPositionnement",
    ]);
    return result;
  }
  composeContenu() {
    const lThis = this;
    const T = [];
    T.push('<div class="EspaceGauche">');
    T.push(
      "<fieldset>",
      "<legend>",
      GTraductions.getValeur(
        "releve_evaluations.parametres.PresenterResultats",
      ),
      "</legend>",
      '<div class="GrandEspaceGauche">',
    );
    this._getTrisPossibles().forEach((D) => {
      T.push(
        '<div class="PetitEspaceHaut">',
        '<ie-radio ie-model="surRadioOrdreColonne(',
        D[1],
        ')" class="AlignementMilieuVertical PetitEspaceDroit">',
        D[0],
        "</ie-radio>",
        "</div>",
      );
    });
    T.push("</div>", "</fieldset>");
    T.push('<div class="EspaceHaut">');
    this._getOptionsGeneralesPossibles().forEach((D) => {
      T.push(
        '<div class="EspaceHaut">',
        '<ie-checkbox class="AlignementMilieuVertical m-right" ie-model="',
        D[1],
        '">',
        D[0],
        "</ie-checkbox>",
        "</div>",
      );
    });
    T.push("</div>");
    T.push(
      '<div class="EspaceHaut10">',
      "<div>",
      GTraductions.getValeur(
        "releve_evaluations.parametres.ColonnesComplementaires",
      ),
      "</div>",
      '<div class="GrandEspaceGauche">',
    );
    this._getColonnesComplementairesPossibles().forEach((D) => {
      T.push(
        '<div class="EspaceHaut">',
        '<ie-checkbox class="AlignementMilieuVertical m-right" ie-model="',
        D[1],
        '">',
        D[0],
        "</ie-checkbox>",
      );
      if (D[1] === "checkAvecSimuCalculPositionnement") {
        T.push(
          '<ie-btnicon style="float: right;" ie-model="btnAfficherPrefCalculPositionnement" class="icon_cog"></ie-btnicon>',
        );
      } else if (D[1] === "checkAvecEvolution") {
        T.push("</div>");
        T.push(
          '<div class="GrandEspaceGauche">',
          "<div>",
          '<ie-radio ie-model="surRadioTypeEvolution(',
          lThis.constantes.TypesEvolution.TauxReussite,
          ')" class="AlignementMilieuVertical PetitEspaceDroit">',
          GTraductions.getValeur(
            "releve_evaluations.parametres.Evolution.SurTauxReussite",
          ),
          "</ie-radio>",
          '<label class="EspaceGauche">',
          GTraductions.getValeur(
            "releve_evaluations.parametres.Evolution.ToleranceTxReussite",
          ),
          "</label>",
          '<ie-inputnote ie-model="inputToleranceEvolution" style="width:30px;" class="EspaceGauche"></ie-inputnote>',
          "</div>",
          "<div>",
          '<ie-radio ie-model="surRadioTypeEvolution(',
          lThis.constantes.TypesEvolution.Score,
          ')" class="AlignementMilieuVertical PetitEspaceDroit">',
          GTraductions.getValeur(
            "releve_evaluations.parametres.Evolution.SurScore",
          ),
          "</ie-radio>",
          "</div>",
        );
      }
      T.push("</div>");
    });
    T.push(" </div>", "</div>");
    T.push("</div>");
    T.push(
      '<div class="Espace Italique">',
      this._getLibelleAsterisque(),
      "</div>",
    );
    return T.join("");
  }
  setParametres(aTypeReleveEvaluations, aConstantes) {
    this.typeReleveEvaluations = aTypeReleveEvaluations;
    this.constantes = aConstantes;
  }
  setOptionsAffichage(aOptionsAffichage) {
    Object.assign(this.optionsAffichage, aOptionsAffichage);
    this.avecChangementsDonneesCalculSimu = false;
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    if (aNumeroBouton === 1 || this.avecChangementsDonneesCalculSimu) {
      this.callback.appel(
        this.optionsAffichage,
        this.avecChangementsDonneesCalculSimu,
      );
    }
  }
}
module.exports = { ObjetFenetre_ParametresReleveDEvaluations };

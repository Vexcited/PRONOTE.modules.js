const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetHint } = require("ObjetHint.js");
const {
  ObjetRequeteValidationAutoCompetences,
} = require("ObjetRequeteValidationAutoCompetences.js");
const {
  TypeModeCalculPositionnementService,
  TypeModeCalculPositionnementServiceUtil,
} = require("TypeModeCalculPositionnementService.js");
const { ObjetJSON } = require("ObjetJSON.js");
const TypeEvenementValidationAutoCompetences = {
  Saisie: "saisie",
  AfficherPreferencesCalcul: "afficherPrefCalcul",
};
class ObjetFenetre_ValidationAutoCompetence extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      estCompetenceNumerique: false,
      estPourLaClasse: false,
      estValidationCECRLDomaine: false,
      estValidationCECRLLV: false,
      avecChoixCalcul: false,
      mrFiche: null,
    };
    this.donnees = {
      palier: null,
      listePiliers: null,
      periode: null,
      service: null,
      listeEleves: null,
      modeCalcul: TypeModeCalculPositionnementService.tMCPS_Defaut,
      donneesModeCalcul: null,
    };
    this.setOptionsFenetre({
      titre: getTitreObjetMessage.bind(this),
      largeur: 600,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getLibelleModeCalcul(aModeCalcul) {
        return TypeModeCalculPositionnementServiceUtil.getLibelleComplet(
          aModeCalcul,
          aInstance.donnees.donneesModeCalcul,
        );
      },
      btnAfficherPreferencesCalcul: {
        event() {
          aInstance.callback.appel(
            TypeEvenementValidationAutoCompetences.AfficherPreferencesCalcul,
          );
        },
        getTitle() {
          return GTraductions.getValeur(
            "FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
          );
        },
      },
      surRadioChoixModeCalcul: {
        getValue(aModeCalcul) {
          return aInstance.donnees.modeCalcul === aModeCalcul;
        },
        setValue(aModeCalcul) {
          aInstance.donnees.modeCalcul = aModeCalcul;
          GApplication.parametresUtilisateur.set(
            "CalculPositionnementEleveParClasse.ModeCalcul",
            aModeCalcul,
          );
        },
      },
      cbRemplacerExistants: {
        getValue() {
          return GEtatUtilisateur.remplacerNiveauxDAcquisitions;
        },
        setValue(aValue) {
          GEtatUtilisateur.remplacerNiveauxDAcquisitions = aValue;
        },
      },
      surAfficherMrFiche: {
        event() {
          const lJSONMrFiche = aInstance._getJSONMrFiche();
          if (!!lJSONMrFiche) {
            ObjetHint.start(lJSONMrFiche.html, { sansDelai: true });
          }
        },
      },
    });
  }
  _getJSONMrFiche() {
    let lJsonMrFiche = null;
    if (!!this.options.mrFiche) {
      lJsonMrFiche = ObjetJSON.parse(this.options.mrFiche);
    }
    return lJsonMrFiche;
  }
  setOptions(aOptions) {
    Object.assign(this.options, aOptions);
  }
  setDonnees(aDonnees) {
    Object.assign(this.donnees, aDonnees);
  }
  mettreAJourValeursDonneesCalcul() {
    this.$refreshSelf();
  }
  composeContenu() {
    const lMessage = [];
    const lStrDetailExplication = getStrDetailExplication.call(this);
    if (!!lStrDetailExplication) {
      lMessage.push("<div>", lStrDetailExplication, "</div>");
      const lOptionsLi = getTableauOptionsDetailCalcul.call(this);
      if (lOptionsLi.length > 0) {
        lMessage.push("<div>");
        lMessage.push('<ul class="browser-default">');
        for (let i = 0; i < lOptionsLi.length; i++) {
          lMessage.push("<li>", lOptionsLi[i], "</li>");
        }
        lMessage.push("</ul>");
        lMessage.push("</div>");
      }
    }
    const lStrDetailSuite = getStrDetailExplicationSuite.call(this);
    if (lStrDetailSuite.length > 0) {
      const lClasses = [];
      if (lMessage.length > 0) {
        lClasses.push("GrandEspaceHaut");
      }
      lMessage.push(
        `<div class="${lClasses.join(" ")}">${lStrDetailSuite}</div>`,
      );
    }
    if (
      this.options.avecChoixCalcul &&
      GParametres.general.SansValidationNivIntermediairesDsValidAuto
    ) {
      this.donnees.modeCalcul = GApplication.parametresUtilisateur.get(
        "CalculPositionnementEleveParClasse.ModeCalcul",
      );
      if (!this.donnees.modeCalcul && this.donnees.modeCalcul !== 0) {
        this.donnees.modeCalcul =
          TypeModeCalculPositionnementService.tMCPS_Defaut;
      }
      this.donnees.donneesModeCalcul = {
        dernieresEvaluations: GApplication.parametresUtilisateur.get(
          "CalculPositionnementEleveParClasse.NDernieresEvaluations",
        ),
        meilleuresEvals: GApplication.parametresUtilisateur.get(
          "CalculPositionnementEleveParClasse.NMeilleuresEvaluations",
        ),
      };
      lMessage.push(
        '<div class="EspaceHaut10">',
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.IndiquezModeCalcul",
        ),
        '<ie-btnicon style="float: right;" ie-model="btnAfficherPreferencesCalcul" class="icon_cog"></ie-btnicon>',
        "</div>",
      );
      lMessage.push('<div class="EspaceGauche">');
      for (const sModeCalcul in TypeModeCalculPositionnementServiceUtil.getListe()) {
        const lModeCalcul = parseInt(sModeCalcul);
        lMessage.push(
          '<div class="PetitEspaceHaut">',
          '<ie-radio ie-html="getLibelleModeCalcul(',
          lModeCalcul,
          ')" class="AlignementMilieuVertical" ie-model="surRadioChoixModeCalcul(',
          lModeCalcul,
          ')">',
          "</ie-radio>",
          "</div>",
        );
      }
      lMessage.push("</div>");
    } else {
      lMessage.push(
        '<div class="GrandEspaceHaut">',
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.QuestionContinuer",
        ),
        "</div>",
      );
    }
    lMessage.push(
      '<div class="m-top-xl m-left">',
      '<ie-checkbox ie-model="cbRemplacerExistants">',
      getMessageRemplacerExistants.call(this),
      "</ie-checkbox>",
      "</div>",
    );
    const lJSONMrFiche = this._getJSONMrFiche();
    if (lJSONMrFiche) {
      lMessage.push(
        '<div class="EspaceHaut flex-contain flex-center">',
        "<span>",
        lJSONMrFiche.titre,
        "</span>",
        '<ie-btnicon class="MargeGauche icon_question bt-activable" ie-model="surAfficherMrFiche" title="',
        lJSONMrFiche.titre,
        '"></ie-btnicon>',
        "</div>",
      );
    }
    return lMessage.join("");
  }
  surValidation(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      this.lancerRequeteSaisie();
    } else {
      this.fermer();
    }
  }
  lancerRequeteSaisie() {
    const lAvecService = [EGenreOnglet.BilanParDomaine].includes(
      GEtatUtilisateur.getGenreOnglet(),
    );
    const lAvecPeriode = [
      EGenreOnglet.BilanFinDeCycle,
      EGenreOnglet.ReleveEvaluationsParClasse,
    ].includes(GEtatUtilisateur.getGenreOnglet());
    const lPalier = !!this.donnees.palier
      ? this.donnees.palier
      : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Palier);
    const lListePiliers = !!this.donnees.listePiliers
      ? this.donnees.listePiliers
      : GEtatUtilisateur.Navigation.getRessources(EGenreRessource.Pilier);
    const lListeEleves = !!this.donnees.listeEleves
      ? this.donnees.listeEleves
      : GEtatUtilisateur.Navigation.getRessources(EGenreRessource.Eleve);
    let lService = null;
    if (lAvecService) {
      lService = !!this.donnees.service
        ? this.donnees.service
        : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
    }
    let lPeriode = null;
    if (lAvecPeriode) {
      lPeriode = this.donnees.periode;
    }
    let lModeCalcul = null;
    if (this.options.avecChoixCalcul) {
      lModeCalcul = this.donnees.modeCalcul;
    }
    new ObjetRequeteValidationAutoCompetences(
      this,
      this.surRequeteSaisie,
    ).lancerRequete({
      palier: lPalier,
      listePiliers: lListePiliers,
      service: lService,
      periode: lPeriode,
      listeEleves: lListeEleves,
      modeCalcul: lModeCalcul,
      remplacerNiveauxDAcquisitions:
        GEtatUtilisateur.remplacerNiveauxDAcquisitions,
    });
  }
  surRequeteSaisie() {
    this.callback.appel(TypeEvenementValidationAutoCompetences.Saisie);
    this.fermer();
  }
}
function _estMultiDomaines() {
  return !!this.donnees.listePiliers && this.donnees.listePiliers.count() > 1;
}
function getTitreObjetMessage() {
  let lTitre;
  if (!!this.options.estCompetenceNumerique) {
    lTitre = GTraductions.getValeur(
      "competences.fenetreValidationAuto.titre.validationAutoCN",
    );
  } else if (_estMultiDomaines.call(this)) {
    if (!!this.options.estPourLaClasse) {
      lTitre = GTraductions.getValeur(
        "competences.fenetreValidationAuto.titre.validationAutoDesComposantesDesClasses",
      );
    } else {
      lTitre = GTraductions.getValeur(
        "competences.fenetreValidationAuto.titre.validationAutoDesComposantes",
      );
    }
  }
  if (!lTitre) {
    lTitre = GTraductions.getValeur(
      "competences.fenetreValidationAuto.titre.validationAuto",
    );
  }
  return lTitre;
}
function getLibellesNiveauxAcquis() {
  const lLibelles = [];
  GParametres.listeNiveauxDAcquisitions.parcourir((aNiveauGlobal) => {
    if (!!aNiveauGlobal && !!aNiveauGlobal.estAcqui) {
      lLibelles.push(aNiveauGlobal.getLibelle());
    }
  });
  return lLibelles.join(", ");
}
function estPourPrimaire() {
  return GEtatUtilisateur.pourPrimaire();
}
function getStrDetailExplication() {
  const H = [];
  if (
    this.options.estCompetenceNumerique ||
    this.options.estValidationCECRLLV
  ) {
    if (!estPourPrimaire()) {
      H.push(
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.ExplicationCalculCN",
        ),
      );
    }
  } else if (this.options.estValidationCECRLDomaine) {
    H.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.ExplicationCalculCECRLDomaine",
      ),
    );
  } else {
    H.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.ExplicationCalcul",
      ),
    );
  }
  return H.join("");
}
function getTableauOptionsDetailCalcul() {
  const H = [];
  if (
    this.options.estCompetenceNumerique ||
    this.options.estValidationCECRLLV
  ) {
    H.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.OptionNivAcquisCN",
        [getLibellesNiveauxAcquis()],
      ),
    );
  } else if (!this.options.estValidationCECRLDomaine) {
    if (GParametres.general.SansValidationNivIntermediairesDsValidAuto) {
      H.push(
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.CalculParEvaluations",
        ),
      );
    } else {
      H.push(
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.CalculParNiveauxMaitrise",
        ),
      );
    }
  }
  if (!this.donnees.periode || !this.donnees.periode.existeNumero()) {
    if (!this.options.estValidationCECRLDomaine) {
      if (
        !(this.options.estCompetenceNumerique && estPourPrimaire()) ||
        this.options.estValidationCECRLLV
      ) {
        if (GParametres.general.NeComptabiliserQueEvalsAnneeScoDsValidAuto) {
          H.push(
            GTraductions.getValeur(
              "competences.fenetreValidationAuto.EvaluationsAnneeEnCours",
            ),
          );
        } else {
          H.push(
            GTraductions.getValeur(
              "competences.fenetreValidationAuto.EvaluationsCycle",
            ),
          );
        }
      }
    }
  }
  if (
    !this.options.estValidationCECRLDomaine &&
    !this.options.estValidationCECRLLV &&
    !this.options.estCompetenceNumerique
  ) {
    if (GParametres.general.PondererMatieresSelonLeurCoeffDsDomaine) {
      H.push(
        GTraductions.getValeur(
          "competences.fenetreValidationAuto.EnPonderantMatieres",
        ),
      );
    }
  }
  return H;
}
function getStrDetailExplicationSuite() {
  const H = [];
  if (
    this.options.estCompetenceNumerique ||
    this.options.estValidationCECRLLV
  ) {
    H.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.ExplicationCalculAuto3CN",
      ),
    );
  }
  return H.join("");
}
function getMessageRemplacerExistants() {
  const lMessageRemplacerExistants = [];
  if (
    this.options.estCompetenceNumerique ||
    this.options.estValidationCECRLLV
  ) {
    lMessageRemplacerExistants.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.RemplacerExistantsCN",
      ),
    );
  } else {
    lMessageRemplacerExistants.push(
      GTraductions.getValeur(
        "competences.fenetreValidationAuto.RemplacerExistants",
      ),
    );
  }
  return lMessageRemplacerExistants.join("");
}
module.exports = {
  ObjetFenetre_ValidationAutoCompetence,
  TypeEvenementValidationAutoCompetences,
};

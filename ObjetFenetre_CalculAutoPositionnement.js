const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GStyle } = require("ObjetStyle.js");
const { GDate } = require("ObjetDate.js");
const {
  TypeModeCalculPositionnementService,
  TypeModeCalculPositionnementServiceUtil,
} = require("TypeModeCalculPositionnementService.js");
const { TypeModeValidationAuto } = require("TypeModeValidationAuto.js");
const { ObjetHint } = require("ObjetHint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetRequeteValidationAutoPositionnement,
} = require("ObjetRequeteValidationAutoPositionnement.js");
const { ObjetJSON } = require("ObjetJSON.js");
const TypeEvenementValidationAutoPositionnement = {
  Saisie: "saisie",
  AfficherPreferencesCalcul: "afficherPrefCalcul",
};
class ObjetFenetre_CalculAutoPositionnement extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.donneesAffichage = {
      messageRestrictionsSurCalculAuto: null,
      message: "",
      avecChoixCalcul: false,
      avecChoixPreferencesCalcul: false,
      mrFiche: null,
    };
    this.donnees = {
      borneDateDebut: null,
      borneDateFin: null,
      calculMultiServices: false,
      modeCalculPositionnement: null,
      modeValidationAuto: null,
      listeEleves: null,
      donneesModeCalcul: null,
    };
    this.setOptionsFenetre({
      largeur: 500,
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
            TypeEvenementValidationAutoPositionnement.AfficherPreferencesCalcul,
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
          return aInstance.donnees.modeCalculPositionnement === aModeCalcul;
        },
        setValue(aModeCalcul) {
          aInstance.donnees.modeCalculPositionnement = aModeCalcul;
          GApplication.parametresUtilisateur.set(
            "CalculPositionnementEleveParService.ModeCalcul",
            aInstance.donnees.modeCalculPositionnement,
          );
        },
      },
      surCbRemplacerPosExistants: {
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
  _getDetailPointsCompetences() {
    let lDetailPointCompetences;
    const lListeGlobalNiveauxDAcquisitions = MethodesObjet.dupliquer(
      GParametres.listeNiveauxDAcquisitions,
    );
    if (
      !!lListeGlobalNiveauxDAcquisitions &&
      lListeGlobalNiveauxDAcquisitions.count() > 0
    ) {
      lDetailPointCompetences = [];
      lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
        if (!!D.ponderation && D.ponderation.estUneValeur()) {
          lDetailPointCompetences.push(
            '<span class="InlineBlock AlignementDroit" style="' +
              GStyle.composeWidth(40) +
              '">' +
              D.ponderation.getNoteEntier() +
              " " +
              GTraductions.getValeur("BulletinEtReleve.Pts") +
              "</span> : " +
              D.getLibelle(),
          );
        }
      });
    }
    return lDetailPointCompetences;
  }
  _getJSONMrFiche() {
    let lJsonMrFiche = null;
    if (!!this.donnees.modeValidationAuto) {
      let lMrFiche;
      if (!!this.donneesAffichage.mrFiche) {
        lMrFiche = this.donneesAffichage.mrFiche;
      } else {
        if (
          this.donnees.modeValidationAuto ===
          TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
        ) {
          lMrFiche = GTraductions.getValeur(
            "BulletinEtReleve.MFicheCalculNoteAutomatique",
          );
        } else {
          lMrFiche = GTraductions.getValeur(
            "BulletinEtReleve.MFichePostionnement",
          );
        }
      }
      lJsonMrFiche = ObjetJSON.parse(lMrFiche);
    }
    return lJsonMrFiche;
  }
  composeContenu() {
    const T = [];
    const lAvecMessageRestrictions =
      !!this.donneesAffichage.messageRestrictionsSurCalculAuto &&
      this.donneesAffichage.messageRestrictionsSurCalculAuto.length > 0;
    if (lAvecMessageRestrictions) {
      T.push(
        '<div class="Gras">',
        this.donneesAffichage.messageRestrictionsSurCalculAuto,
        "</div>",
      );
    }
    if (this.donneesAffichage.message) {
      T.push(
        "<div",
        lAvecMessageRestrictions ? ' class="EspaceHaut"' : "",
        ">",
        this.donneesAffichage.message,
        "</div>",
      );
    } else {
      const lDetailPointCompetences = this._getDetailPointsCompetences();
      const lExplicationCalcul = this.donnees.calculMultiServices
        ? GTraductions.getValeur(
            "competences.fenetreValidationAutoPositionnement.messageCalculTousServices",
          )
        : GTraductions.getValeur(
            "competences.fenetreValidationAutoPositionnement.message",
          );
      T.push(
        "<div",
        lAvecMessageRestrictions ? ' class="EspaceHaut"' : "",
        ">",
        lExplicationCalcul,
        "</div>",
        '<div class="EspaceHaut">',
        "<div>",
        GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.detailPoints",
        ),
        "</div>",
        !!lDetailPointCompetences
          ? '<div class="EspaceGauche PetitEspaceHaut">' +
              lDetailPointCompetences.join(
                '</div><div class="EspaceGauche PetitEspaceHaut">',
              ) +
              "</div>"
          : "",
        "</div>",
      );
    }
    if (!!this.donnees.borneDateDebut && !!this.donnees.borneDateFin) {
      T.push(
        '<div class="EspaceHaut">',
        GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.messageOptionnel",
          [
            GDate.formatDate(this.donnees.borneDateDebut, "%JJ/%MM/%AAAA"),
            GDate.formatDate(this.donnees.borneDateFin, "%JJ/%MM/%AAAA"),
          ],
        ),
        "</div>",
      );
    }
    this.donnees.modeCalculPositionnement =
      GApplication.parametresUtilisateur.get(
        "CalculPositionnementEleveParService.ModeCalcul",
      );
    if (
      !this.donnees.modeCalculPositionnement &&
      this.donnees.modeCalculPositionnement !== 0
    ) {
      this.donnees.modeCalculPositionnement =
        TypeModeCalculPositionnementService.tMCPS_Defaut;
    }
    if (this.donneesAffichage.avecChoixCalcul) {
      T.push(
        '<div class="EspaceHaut">',
        GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.indiquezModeCalculPositionnement",
        ),
      );
      if (this.donneesAffichage.avecChoixPreferencesCalcul) {
        T.push(
          '<ie-btnicon style="float: right;" ie-model="btnAfficherPreferencesCalcul" class="icon_cog"></ie-btnicon>',
        );
      }
      T.push("</div>");
      this.donnees.donneesModeCalcul = {
        dernieresEvaluations: GApplication.parametresUtilisateur.get(
          "CalculPositionnementEleveParService.NDernieresEvaluations",
        ),
        meilleuresEvals: GApplication.parametresUtilisateur.get(
          "CalculPositionnementEleveParService.NMeilleuresEvaluations",
        ),
      };
      T.push('<div class="EspaceGauche">');
      for (const sModeCalcul in TypeModeCalculPositionnementServiceUtil.getListe()) {
        const lModeCalcul = parseInt(sModeCalcul);
        T.push(
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
      T.push("</div>");
    } else {
      T.push(
        '<div class="EspaceHaut">',
        GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.voulezVousContinuer",
        ),
        "</div>",
      );
    }
    let lLibelleRemplacerExistants;
    if (
      this.donnees.modeValidationAuto ===
      TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
    ) {
      lLibelleRemplacerExistants = GTraductions.getValeur(
        "competences.fenetreValidationAutoPositionnement.remplacerPositionnementsNote",
      );
    } else {
      lLibelleRemplacerExistants = GTraductions.getValeur(
        "competences.fenetreValidationAutoPositionnement.remplacerPositionnementsExistants",
      );
    }
    T.push(
      '<div class="EspaceHaut10 EspaceGauche10">',
      '<ie-checkbox ie-model="surCbRemplacerPosExistants">',
      lLibelleRemplacerExistants,
      "</ie-checkbox>",
      "</div>",
    );
    if (!!this.donnees.modeValidationAuto) {
      const lJsonMrFiche = this._getJSONMrFiche();
      T.push(
        '<div class="flex-contain flex-center">',
        "<span>",
        lJsonMrFiche.titre,
        "</span>",
        '<ie-btnicon class="MargeGauche icon_question bt-activable" ie-model="surAfficherMrFiche" title="',
        lJsonMrFiche.titre,
        '"></ie-btnicon>',
        "</div>",
      );
    }
    return T.join("");
  }
  setDonneesAffichage(aDonneesAffichage) {
    Object.assign(this.donneesAffichage, aDonneesAffichage);
  }
  setDonnees(aDonnees) {
    Object.assign(this.donnees, aDonnees);
  }
  mettreAJourValeursDonneesCalcul() {
    this.$refreshSelf();
  }
  surValidation(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      this.lancerRequeteSaisie();
    } else {
      this.fermer();
    }
  }
  lancerRequeteSaisie() {
    let lService = !!this.donnees.calculMultiServices
      ? null
      : GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
    let lRessource = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Classe,
    );
    if (
      lRessource !== null &&
      lRessource !== undefined &&
      lRessource.getNumero() === -1 &&
      lRessource.getGenre() === EGenreRessource.Aucune
    ) {
      if (lService !== null && lService !== undefined) {
        let lGpeDuService = lService.groupe;
        if (lGpeDuService && lGpeDuService.existeNumero()) {
          lGpeDuService.Genre = EGenreRessource.Groupe;
          lRessource = lGpeDuService;
        } else {
          let lClasseDuService = lService.classe;
          if (lClasseDuService && lClasseDuService.existeNumero()) {
            lClasseDuService.Genre = EGenreRessource.Classe;
            lRessource = lClasseDuService;
          }
        }
      }
    }
    const lParamsSaisie = {
      periode: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ),
      calculMultiServices: !!this.donnees.calculMultiServices,
      service: lService,
      ressource: lRessource,
      remplacerPosExistants: GEtatUtilisateur.remplacerNiveauxDAcquisitions,
      modeValidationAuto: this.donnees.modeValidationAuto,
      modeCalcul: this.donnees.modeCalculPositionnement,
      borneDateDebut: this.donnees.borneDateDebut,
      borneDateFin: this.donnees.borneDateFin,
    };
    if (!!this.donnees.listeEleves) {
      lParamsSaisie.listeEleves = this.donnees.listeEleves;
    }
    new ObjetRequeteValidationAutoPositionnement(
      this,
      this.surRequeteSaisieCalculAutoPositionnement,
    ).lancerRequete(lParamsSaisie);
  }
  surRequeteSaisieCalculAutoPositionnement() {
    this.callback.appel(TypeEvenementValidationAutoPositionnement.Saisie);
    this.fermer();
  }
}
module.exports = {
  TypeEvenementValidationAutoPositionnement,
  ObjetFenetre_CalculAutoPositionnement,
};

exports.ObjetFenetre_RemplirProgression = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_ListeProgramme_1 = require("ObjetFenetre_ListeProgramme");
class ObjetFenetre_RemplirProgression extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({ largeur: 270 });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecProgrammeNational: function () {
        return avecFonctionnaliteProgrammesBO();
      },
      radioTypeRemplissage: {
        getValue: function (aTypeRemplissage) {
          return aInstance.genreEvenement === aTypeRemplissage;
        },
        setValue: function (aTypeRemplissage) {
          aInstance.genreEvenement = aTypeRemplissage;
        },
      },
    });
  }
  surAfficher() {
    this.genreEvenement =
      ObjetFenetre_RemplirProgression.TypeRemplissageProgression.ProgressionExistante;
    if (avecFonctionnaliteProgrammesBO()) {
      this.genreEvenement =
        ObjetFenetre_RemplirProgression.TypeRemplissageProgression.ProgrammeNational;
    }
  }
  composeContenu() {
    const H = [];
    H.push(
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur(
        "progression.RemplirCetteProgression",
      ),
      "</div>",
    );
    H.push(
      '<div class="PetitEspaceGauche">',
      '<div ie-if="avecProgrammeNational()">',
      composeRadioTypeRemplissage(
        ObjetFenetre_RemplirProgression.TypeRemplissageProgression
          .ProgrammeNational,
      ),
      "</div>",
      "<div>",
      composeRadioTypeRemplissage(
        ObjetFenetre_RemplirProgression.TypeRemplissageProgression
          .ProgressionExistante,
      ),
      "</div>",
      "<div>",
      composeRadioTypeRemplissage(
        ObjetFenetre_RemplirProgression.TypeRemplissageProgression
          .ProgressionParDefaut,
      ),
      "</div>",
      "</div>",
    );
    return H.join("");
  }
  surValidation(aGenreBouton) {
    this.fermer();
    this.callback.appel(aGenreBouton, this.genreEvenement);
  }
  static validerProgressionAvecEvenement(aParametres) {
    const lParametres = $.extend(
      {
        pere: null,
        indiceProgression: -1,
        progression: null,
        genreEvenement: -1,
        callbackFinCreation: null,
        annuler: function () {},
        listeProgressionsPublicPourCopie: null,
        listeNiveaux: null,
        classeFenetreProgression: null,
      },
      aParametres,
    );
    switch (aParametres.genreEvenement) {
      case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
        .ProgrammeNational:
        ObjetFenetre_RemplirProgression.programmeNational({
          progression: lParametres.progression,
          pere: lParametres.pere,
          evenement: lParametres.callbackFinCreation.bind(
            null,
            lParametres.indiceProgression,
            lParametres.progression,
          ),
          annuler: lParametres.annuler.bind(
            null,
            lParametres.indiceProgression,
            lParametres.progression,
          ),
        });
        break;
      case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
        .ProgressionExistante: {
        const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          lParametres.classeFenetreProgression,
          {
            pere: lParametres.pere,
            evenement: _surEvenementFenetreProgressionCopie.bind(
              null,
              lParametres,
            ),
          },
          {
            titre: ObjetTraduction_1.GTraductions.getValeur(
              "progression.SelectionDeLaProgressionsACopier",
            ),
          },
        );
        lInstance.setDonnees({
          progressionSource: lParametres.progression,
          listeProgressions: lParametres.listeProgressionsPublicPourCopie,
          listeNiveaux: lParametres.listeNiveaux,
          avecCreation: false,
          avecProgressionsPublic: true,
        });
        break;
      }
      case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
        .ProgressionParDefaut:
        lParametres.progression.creationAutomatique = true;
        lParametres.callbackFinCreation(
          lParametres.indiceProgression,
          lParametres.progression,
        );
        break;
      default:
    }
  }
  static programmeNational(aParametres) {
    if (GEtatUtilisateur.listeProgrammesParNiveau.count() > 0) {
      const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_ListeProgramme_1.ObjetFenetre_ListeProgramme,
        {
          pere: aParametres.pere,
          evenement: _evenementFenetre_ListeProgramme.bind(null, aParametres),
        },
        {
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "progression.SelectionnerProgramme",
          ),
          largeur: 700,
          hauteur: 400,
          listeBoutons: [
            ObjetTraduction_1.GTraductions.getValeur("Annuler"),
            ObjetTraduction_1.GTraductions.getValeur("Valider"),
          ],
        },
      );
      lInstance.setDonnees(aParametres.progression.niveau);
    } else {
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        message: ObjetTraduction_1.GTraductions.getValeur(
          "progression.AucunProgrammeNiveau",
        ),
      });
      if (aParametres.annuler) {
        aParametres.annuler();
      }
    }
  }
}
exports.ObjetFenetre_RemplirProgression = ObjetFenetre_RemplirProgression;
function avecFonctionnaliteProgrammesBO() {
  return GApplication.droits.get(
    ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionProgrammesBO,
  );
}
function getLibelleTypeRemplissage(aTypeRemplissage) {
  let lLibelle = "";
  switch (aTypeRemplissage) {
    case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
      .ProgrammeNational:
      lLibelle = ObjetTraduction_1.GTraductions.getValeur(
        "progression.ProgrammeNational",
      );
      break;
    case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
      .ProgressionExistante:
      lLibelle = ObjetTraduction_1.GTraductions.getValeur(
        "progression.CopierProgression",
      );
      break;
    case ObjetFenetre_RemplirProgression.TypeRemplissageProgression
      .ProgressionParDefaut:
      lLibelle = ObjetTraduction_1.GTraductions.getValeur(
        "progression.ProgressionParDefaut",
      );
      break;
  }
  return lLibelle;
}
function composeRadioTypeRemplissage(aTypeRemplissage) {
  const H = [];
  H.push(
    '<ie-radio ie-model="radioTypeRemplissage(',
    aTypeRemplissage,
    ')">',
    getLibelleTypeRemplissage(aTypeRemplissage),
    "</ie-radio>",
  );
  return H.join("");
}
function _apresConfirmation_AjoutProgramme(
  aParametres,
  aProgramme,
  aNiveau,
  aIndiceChoix,
  aNumeroBouton,
) {
  if (aNumeroBouton !== 0) {
    if (aParametres.annuler) {
      aParametres.annuler();
    }
    return;
  }
  if (!aProgramme || !aProgramme.getNumero) {
  }
  const lProgressionCourante = aParametres.progression;
  if (lProgressionCourante.listeDossiers && aIndiceChoix === 1) {
    for (
      let i = 0, lnb = lProgressionCourante.listeDossiers.count();
      i < lnb;
      i++
    ) {
      lProgressionCourante.listeDossiers
        .get(i)
        .setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    }
  }
  lProgressionCourante.creationAutomatique = true;
  lProgressionCourante.programmeReference = aProgramme;
  $.extend(lProgressionCourante.programmeReference, {
    strMatiere: aProgramme.getLibelle(),
    strNiveau: aNiveau.getLibelle(),
    strFiliereXml: lProgressionCourante.programmeReference.filiere,
    strCycle: lProgressionCourante.programmeReference.cycle,
    estNouveau: lProgressionCourante.programmeReference.nouveau,
  });
  aParametres.evenement();
}
function _evenementFenetre_ListeProgramme(
  aParametres,
  aGenreBouton,
  aProgramme,
  aNiveau,
) {
  if (aGenreBouton === 1) {
    const lProgressionCourante = aParametres.progression;
    if (
      lProgressionCourante.listeDossiers &&
      lProgressionCourante.listeDossiers.getNbrElementsExistes() > 0
    ) {
      let lChoix = 0;
      const lControleur = {
        rb: {
          getValue: function (aIndice) {
            return lChoix === aIndice;
          },
          setValue: function (aIndice) {
            lChoix = aIndice;
          },
        },
      };
      const H = [];
      H.push(
        '<div class="EspaceBas">',
        ObjetTraduction_1.GTraductions.getValeur("progression.MSGBOITECONF"),
        "</div>",
      );
      H.push('<div class="GrandEspaceGauche">');
      H.push(
        '<div class="PetitEspaceBas"><ie-radio ie-model="rb(',
        0,
        ')" class="NoWrap">',
        ObjetTraduction_1.GTraductions.getValeur("progression.AJOUTERCONTENU"),
        "</ie-radio></div>",
      );
      H.push(
        '<div class="PetitEspaceBas"><ie-radio ie-model="rb(',
        1,
        ')" class="NoWrap">',
        ObjetTraduction_1.GTraductions.getValeur("progression.REMPLACER"),
        "</ie-radio></div>",
      );
      H.push("</div>");
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "progression.TITREBOITECONF",
        ),
        message: H.join(""),
        controleur: lControleur,
        callback: function (aNumeroBouton) {
          _apresConfirmation_AjoutProgramme(
            aParametres,
            aProgramme,
            aNiveau,
            lChoix,
            aNumeroBouton,
          );
        },
      });
    } else {
      _apresConfirmation_AjoutProgramme(
        aParametres,
        aProgramme,
        aNiveau,
        null,
        0,
      );
    }
  } else if (aParametres.annuler) {
    aParametres.annuler();
  }
}
function _surEvenementFenetreProgressionCopie(
  aParametres,
  aNumeroBouton,
  aIndiceSelection,
) {
  if (aNumeroBouton === 1) {
    const lProgressionACopier =
      aParametres.listeProgressionsPublicPourCopie.get(aIndiceSelection);
    aParametres.progression.creationAutomatique = true;
    aParametres.progression.copieReference = lProgressionACopier;
  }
  aParametres.callbackFinCreation(
    aParametres.indiceProgression,
    aParametres.progression,
  );
}
(function (ObjetFenetre_RemplirProgression) {
  let TypeRemplissageProgression;
  (function (TypeRemplissageProgression) {
    TypeRemplissageProgression[
      (TypeRemplissageProgression["ProgrammeNational"] = 1)
    ] = "ProgrammeNational";
    TypeRemplissageProgression[
      (TypeRemplissageProgression["ProgressionExistante"] = 2)
    ] = "ProgressionExistante";
    TypeRemplissageProgression[
      (TypeRemplissageProgression["ProgressionParDefaut"] = 3)
    ] = "ProgressionParDefaut";
  })(
    (TypeRemplissageProgression =
      ObjetFenetre_RemplirProgression.TypeRemplissageProgression ||
      (ObjetFenetre_RemplirProgression.TypeRemplissageProgression = {})),
  );
})(
  ObjetFenetre_RemplirProgression ||
    (exports.ObjetFenetre_RemplirProgression = ObjetFenetre_RemplirProgression =
      {}),
);

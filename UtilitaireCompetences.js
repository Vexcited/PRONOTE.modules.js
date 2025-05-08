const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetHint } = require("ObjetHint.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeNote } = require("TypeNote.js");
const {
  EGenreNiveauDAcquisition,
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const {
  ObjetRequeteCalculAutoNotesSelonCompetences,
} = require("ObjetRequeteCalculAutoNotesSelonCompetences.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypeModeValidationAuto } = require("TypeModeValidationAuto.js");
const { TypePositionnement } = require("TypePositionnement.js");
const { TypeNiveauEquivalenceCEUtil } = require("TypeNiveauEquivalenceCE.js");
const {
  ObjetFenetre_ValidationAutoCompetence,
  TypeEvenementValidationAutoCompetences,
} = require("ObjetFenetre_ValidationAutoCompetence.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_PreferencesCalculPositionnement,
} = require("ObjetFenetre_PreferencesCalculPositionnement.js");
const {
  TypeEvenementValidationAutoPositionnement,
  ObjetFenetre_CalculAutoPositionnement,
} = require("ObjetFenetre_CalculAutoPositionnement.js");
const { ObjetJSON } = require("ObjetJSON.js");
function TUtilitaireCompetences() {}
TUtilitaireCompetences.construitInfoActiviteLangagiere = function (
  aParams = {},
) {
  const lAvecLibelle = aParams.avecLibelle || false;
  const lAvecHint = !!aParams.avecHint;
  const lStr = GTraductions.getValeur(
    "competences.LegendeCompetenceLangagiere",
  );
  const H = [];
  H.push(
    '<i style="color: ',
    GParametres.general.couleurActiviteLangagiere,
    ';" class="icon_star"',
  );
  if (lAvecHint) {
    H.push(' title="', GChaine.toTitle(lStr), '"');
  }
  H.push("></i>");
  if (lAvecLibelle) {
    H.push('<span class="MargeGauche">', lStr, "</span>");
  }
  return H.join("");
};
TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu = function (
  aParams,
) {
  const lListeEvaluations = new ObjetListeElements();
  const lPourPositionnement =
    aParams.genrePositionnement !== undefined &&
    aParams.genrePositionnement !== null;
  for (let I = 0; I < GParametres.listeNiveauxDAcquisitions.count(); I++) {
    let lEvaluation = MethodesObjet.dupliquer(
      GParametres.listeNiveauxDAcquisitions.get(I),
    );
    lEvaluation.Position = EGenreNiveauDAcquisitionUtil.ordre().indexOf(
      lEvaluation.getGenre(),
    );
    if (
      lEvaluation.actifPour.contains(aParams.genreChoixValidationCompetence)
    ) {
      if (
        aParams.avecDispense ||
        lEvaluation.getGenre() !== EGenreNiveauDAcquisition.Dispense
      ) {
        if (lPourPositionnement) {
          lEvaluation.Libelle =
            EGenreNiveauDAcquisitionUtil.getLibellePositionnement({
              niveauDAcquisition: lEvaluation,
              genrePositionnement: aParams.genrePositionnement,
            });
          lEvaluation.image =
            EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: lEvaluation,
              genrePositionnement: aParams.genrePositionnement,
            });
        } else {
          lEvaluation.Libelle =
            EGenreNiveauDAcquisitionUtil.getLibelle(lEvaluation);
          lEvaluation.image =
            EGenreNiveauDAcquisitionUtil.getImage(lEvaluation);
        }
        let lRaccourci = "";
        if (aParams.avecLibelleRaccourci && !!lEvaluation) {
          let lRaccourciTemp;
          if (!lPourPositionnement && !!lEvaluation.raccourci) {
            lRaccourciTemp = lEvaluation.raccourci;
          } else if (
            lPourPositionnement &&
            !!lEvaluation.raccourciPositionnement
          ) {
            lRaccourciTemp = lEvaluation.raccourciPositionnement;
          }
          if (lRaccourciTemp && lRaccourciTemp.toUpperCase) {
            lRaccourci = lRaccourciTemp.toUpperCase();
          }
        }
        if (lRaccourci) {
          lEvaluation.tableauLibelles = [lEvaluation.Libelle, lRaccourci];
        }
        lListeEvaluations.addElement(lEvaluation);
      }
    }
  }
  lListeEvaluations.trier();
  if (aParams.avecSelecteurNiveauCalcule) {
    const lSelecteurNivCalcule = new ObjetElement();
    lSelecteurNivCalcule.Libelle = GTraductions.getValeur(
      "competences.niveauCalculeEvals",
    );
    lListeEvaluations.insererElement(lSelecteurNivCalcule, 0);
  }
  return lListeEvaluations;
};
TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourCombo = function (
  aParams,
) {
  const lListeEvaluations = new ObjetListeElements();
  GParametres.listeNiveauxDAcquisitions.parcourir((aNiveauGlobal) => {
    let lEvaluation = MethodesObjet.dupliquer(aNiveauGlobal);
    lEvaluation.Position = EGenreNiveauDAcquisitionUtil.ordre().indexOf(
      lEvaluation.getGenre(),
    );
    if (!lEvaluation.existeNumero() && aParams.sansLibelleAucun) {
      lEvaluation.Position = 0;
      lEvaluation.Libelle = "";
    }
    if (
      lEvaluation.actifPour.contains(aParams.genreChoixValidationCompetence) &&
      (!!aParams.avecDispense ||
        lEvaluation.getGenre() !== EGenreNiveauDAcquisition.Dispense)
    ) {
      if (lEvaluation.existeNumero()) {
        lEvaluation.libelleHtml =
          '<span style="margin: 0 3px; width:20px; text-align: center; display: inline-block;" >' +
          EGenreNiveauDAcquisitionUtil.getImage(lEvaluation) +
          "</span><span>" +
          lEvaluation.getLibelle() +
          "</span>";
      }
      lListeEvaluations.addElement(lEvaluation);
    }
  });
  lListeEvaluations.trier();
  return lListeEvaluations;
};
TUtilitaireCompetences.getNombrePointsBrevet = function (aNiveauDAcquisition) {
  const lNiveauDAcquisition =
    GParametres.listeNiveauxDAcquisitions.getElementParElement(
      aNiveauDAcquisition,
    );
  if (lNiveauDAcquisition) {
    return EGenreNiveauDAcquisitionUtil.getNombrePointsBrevet(
      lNiveauDAcquisition,
    );
  }
  return 0;
};
TUtilitaireCompetences.composeJaugeChronologique = function (aParams) {
  let result = "";
  if (aParams.listeNiveaux) {
    const H = [];
    let lSeparateur = "";
    let lNiveau;
    const lEstModeAccessible =
      GParametres.afficherAbbreviationNiveauDAcquisition ||
      GEtatUtilisateur.estAvecCodeCompetences();
    if (lEstModeAccessible) {
      lSeparateur = ", ";
      aParams.listeNiveaux.parcourir((aNiveau) => {
        lNiveau = GParametres.listeNiveauxDAcquisitions.getElementParGenre(
          aNiveau.getGenre(),
        );
        if (lNiveau.abbreviation) {
          H.push('<div class="InlineBlock">' + lNiveau.abbreviation + "</div>");
        }
      });
    } else {
      let lCouleur;
      let lContenuPastille;
      aParams.listeNiveaux.parcourir((aNiveau) => {
        lNiveau = GParametres.listeNiveauxDAcquisitions.getElementParGenre(
          aNiveau.getGenre(),
        );
        lCouleur = EGenreNiveauDAcquisitionUtil.getCouleur(lNiveau);
        lContenuPastille = "&nbsp;";
        if (aParams.afficherValeurPourNonRempli && !lNiveau.existeNumero()) {
          lContenuPastille =
            !!lNiveau.abbreviation && lNiveau.abbreviation.length > 0
              ? lNiveau.abbreviation.charAt(0)
              : "&nbsp;";
        }
        H.push(
          '<div class="InlineBlock AlignementMilieu"',
          ' style="width: 6px;',
          "border: ",
          aParams.pourImpression
            ? "3px solid " + lCouleur + ";"
            : "1px solid black;",
          "background-color:",
          lCouleur,
          ";",
          "color: black;",
          '"',
          ">",
          aParams.pourImpression ? "" : lContenuPastille,
          "</div>",
        );
      });
    }
    result = H.join(lSeparateur);
  }
  if (result.length > 0 && !!aParams.hint) {
    result =
      '<div title="' +
      GChaine.toTitle(aParams.hint) +
      '" aria-label="' +
      GChaine.toTitle(aParams.hint) +
      '">' +
      result +
      "</div>";
  }
  return result;
};
function _composeJaugeParNiveauxOuPastilles(aParams, aEstJaugeParPastilles) {
  const H = [];
  const lSeparateur = "";
  if (aParams.listeNiveaux) {
    const lEstModeAccessible =
      GParametres.afficherAbbreviationNiveauDAcquisition ||
      GEtatUtilisateur.estAvecCodeCompetences();
    let lTotalNiveaux = 0;
    const lInfosNiveauParNiveaux = [];
    let lCouleur, lImage, lNombre, lNiveauParam;
    const lListeGlobaleNiveaux = MethodesObjet.dupliquer(
      GParametres.listeNiveauxDAcquisitions,
    );
    lListeGlobaleNiveaux.setTri([ObjetTri.init("positionJauge")]);
    lListeGlobaleNiveaux.trier();
    const _acceptNiveau = function (aNiveau) {
      let result = false;
      if (aNiveau.existeNumero()) {
        result =
          !aParams.listeGenreNiveauxIgnores ||
          aParams.listeGenreNiveauxIgnores.indexOf(aNiveau.getGenre()) === -1;
      }
      return result;
    };
    lListeGlobaleNiveaux.parcourir((aNiveauGlobal) => {
      if (_acceptNiveau(aNiveauGlobal)) {
        lCouleur = EGenreNiveauDAcquisitionUtil.getCouleur(aNiveauGlobal);
        lImage = EGenreNiveauDAcquisitionUtil.getImage(aNiveauGlobal, {
          avecTitle: !aParams.hint,
        });
        lNombre = 0;
        lNiveauParam = aParams.listeNiveaux.getElementParGenre(
          aNiveauGlobal.getGenre(),
        );
        if (!!lNiveauParam && lNiveauParam.nbr) {
          lNombre += lNiveauParam.nbr;
        }
        lTotalNiveaux += lNombre;
        lInfosNiveauParNiveaux.push({
          nombre: lNombre,
          couleur: lCouleur,
          image: lImage,
        });
      }
    });
    if (lTotalNiveaux > 0) {
      H.push(
        '<table class="full-width" aria-hidden="true"',
        aParams.hint ? ` title="${GChaine.toTitle(aParams.hint)}" ` : "",
        "><tr>",
      );
      let lInfoNiveau, lWidthCellule;
      for (let i = 0; i < lInfosNiveauParNiveaux.length; i++) {
        lInfoNiveau = lInfosNiveauParNiveaux[i];
        if (lEstModeAccessible || aEstJaugeParPastilles) {
          lWidthCellule = 100 / lInfosNiveauParNiveaux.length;
          H.push(
            '<td class="AlignementDroit EspaceDroit" style=width:',
            lWidthCellule,
            '%;">',
          );
          if (lInfoNiveau.nombre) {
            H.push(
              '<div class="InlineBlock" style="margin-right: 5px;">',
              lInfoNiveau.nombre,
              '</div><div class="InlineBlock">',
              lInfoNiveau.image,
              "</div></div>",
            );
          } else {
            H.push("&nbsp;");
          }
          H.push("</td>");
        } else {
          if (lInfoNiveau.nombre > 0) {
            lWidthCellule = (lInfoNiveau.nombre * 100) / lTotalNiveaux;
            H.push(
              '<td style="border:',
              aParams.pourImpression
                ? "3px solid " + lInfoNiveau.couleur + ";"
                : "1px solid black;",
              "background-color:",
              lInfoNiveau.couleur,
              ";",
              "width:",
              lWidthCellule,
              '%;"',
              ">",
              aParams.pourImpression ? "" : "&nbsp;",
              "</td>",
            );
          }
        }
      }
      H.push("</tr></table>");
      if (aParams.hint) {
        H.push(`<p class="sr-only">${aParams.hint}</p>`);
      }
    }
  }
  return H.join(lSeparateur);
}
TUtilitaireCompetences.composeJaugeParNiveaux = function (aParams) {
  return _composeJaugeParNiveauxOuPastilles(aParams, false);
};
TUtilitaireCompetences.composeJaugeParPastilles = function (aParams) {
  return _composeJaugeParNiveauxOuPastilles(aParams, true);
};
TUtilitaireCompetences.existeBarreNiveauxDAcquisitionsDePiliers = function (
  aListePiliers,
) {
  if (!!aListePiliers) {
    for (let i = 0; i < aListePiliers.count(); i++) {
      let lPilier = aListePiliers.get(i);
      if (lPilier) {
        if (
          this.existeBarreNiveauxDAcquisitionsDeNiveaux(lPilier.listeNiveaux)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
TUtilitaireCompetences.existeBarreNiveauxDAcquisitionsDeNiveaux = function (
  aListeNiveaux,
  aPourChronologique,
) {
  if (aListeNiveaux) {
    if (aPourChronologique === true) {
      return aListeNiveaux.count() > 0;
    }
    for (let i = 0; i < aListeNiveaux.count(); i++) {
      let lNiveau = aListeNiveaux.get(i);
      if (lNiveau.nbr > 0) {
        return true;
      }
    }
  }
  return false;
};
TUtilitaireCompetences.regroupeNiveauxDAcquisitions = function (
  aListeNiveauxDAcquisition,
) {
  const result = new ObjetListeElements();
  if (aListeNiveauxDAcquisition) {
    aListeNiveauxDAcquisition.parcourir((aNiveau) => {
      if (aNiveau.getGenre() >= EGenreNiveauDAcquisition.Expert) {
        const lValeurDuNiveau =
          aNiveau.coeff !== undefined && aNiveau.coeff !== null
            ? aNiveau.coeff
            : 1;
        if (lValeurDuNiveau > 0) {
          let lNiveauDeListeRegroupee = result.getElementParGenre(
            aNiveau.getGenre(),
          );
          if (lNiveauDeListeRegroupee === undefined) {
            lNiveauDeListeRegroupee = MethodesObjet.dupliquer(aNiveau);
            lNiveauDeListeRegroupee.nbr = lValeurDuNiveau;
            result.addElement(lNiveauDeListeRegroupee);
          } else {
            lNiveauDeListeRegroupee.nbr += lValeurDuNiveau;
          }
        }
      }
    });
  }
  return result;
};
TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille =
  function (aListeNiveauxDAcquisitionRegroupes) {
    const result = [];
    if (aListeNiveauxDAcquisitionRegroupes) {
      const lListeGlobalNiveauxDAcquisitions = MethodesObjet.dupliquer(
        GParametres.listeNiveauxDAcquisitions,
      );
      lListeGlobalNiveauxDAcquisitions.setTri([ObjetTri.init("positionJauge")]);
      lListeGlobalNiveauxDAcquisitions.trier();
      let niveau = null;
      lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
        niveau = aListeNiveauxDAcquisitionRegroupes.getElementParGenre(
          D.getGenre(),
        );
        if (!!niveau) {
          result.push(niveau.nbr + " " + niveau.getLibelle());
        }
      });
    }
    return result.length > 0 ? result.join("\n") : "";
  };
TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique =
  function (aListeNiveauxDAcquisition, aAvecAffichageZero) {
    const result = [];
    if (aListeNiveauxDAcquisition) {
      const lListeGlobalNiveauxDAcquisitions = MethodesObjet.dupliquer(
        GParametres.listeNiveauxDAcquisitions,
      );
      lListeGlobalNiveauxDAcquisitions.setTri([ObjetTri.init("positionJauge")]);
      lListeGlobalNiveauxDAcquisitions.trier();
      lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
        const lListe = aListeNiveauxDAcquisition.getListeElements((D2) => {
          return D2.getGenre() === D.getGenre();
        });
        if (aAvecAffichageZero || lListe.count() > 0) {
          result.push(lListe.count() + " " + D.getLibelle());
        }
      });
    }
    return result.length > 0 ? result.join("\n") : "";
  };
TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition = function (
  aListeNiveauxDAcquisitionRegroupes,
) {
  let lTotalNotesSynthese = 0,
    lNbDEvaluationsNotees = 0,
    lTypeNotePonderation = null;
  if (aListeNiveauxDAcquisitionRegroupes) {
    aListeNiveauxDAcquisitionRegroupes.parcourir((D) => {
      lTypeNotePonderation = EGenreNiveauDAcquisitionUtil.getPonderation(D);
      if (!!lTypeNotePonderation && lTypeNotePonderation.estUneValeur()) {
        lTotalNotesSynthese += D.nbr * lTypeNotePonderation.getValeur();
        lNbDEvaluationsNotees += D.nbr;
      }
    });
  }
  return new TypeNote(
    lNbDEvaluationsNotees > 0 ? lTotalNotesSynthese / lNbDEvaluationsNotees : 0,
  );
};
TUtilitaireCompetences.surBoutonValidationAuto = function (aParams) {
  if (GEtatUtilisateur.EtatSaisie) {
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Information,
      titre: GTraductions.getValeur("interface.SaisieNonValidee"),
      message: GTraductions.getValeur("interface.SaisieAValider"),
    });
  } else {
    const lInstancePage = aParams.instance;
    const lFenetreValidationAutoCompetences = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_ValidationAutoCompetence,
      {
        pere: lInstancePage,
        evenement(aTypeSaisie) {
          if (aTypeSaisie === TypeEvenementValidationAutoCompetences.Saisie) {
            if (lInstancePage && lInstancePage.afficherPage) {
              lInstancePage.afficherPage();
            }
          } else if (
            aTypeSaisie ===
            TypeEvenementValidationAutoCompetences.AfficherPreferencesCalcul
          ) {
            TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
              false,
              {
                callbackSurChangement: () => {
                  lFenetreValidationAutoCompetences.mettreAJourValeursDonneesCalcul();
                },
              },
            );
          }
        },
        initialiser(aInstance) {
          aInstance.setOptions({
            estCompetenceNumerique: !!aParams.estCompetenceNumerique,
            estPourLaClasse: !!aParams.estPourLaClasse,
            estValidationCECRLDomaine: !!aParams.estValidationCECRLDomaine,
            estValidationCECRLLV: !!aParams.estValidationCECRLLV,
            avecChoixCalcul: !!aParams.avecChoixCalcul,
            mrFiche: aParams.mrFiche,
          });
          aInstance.setDonnees({
            palier: aParams.palier,
            listePiliers: aParams.listePiliers,
            periode: aParams.periode,
            service: aParams.service,
            listeEleves: aParams.listeEleves,
          });
        },
      },
    );
    lFenetreValidationAutoCompetences.afficher();
  }
};
TUtilitaireCompetences.surBoutonValidationAutoPositionnement = function (
  aParams,
) {
  if (GEtatUtilisateur.EtatSaisie) {
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Information,
      titre: GTraductions.getValeur("interface.SaisieNonValidee"),
      message: GTraductions.getValeur("interface.SaisieAValider"),
    });
  } else {
    let lTitre;
    if (!!aParams.titre) {
      lTitre = aParams.titre;
    } else {
      if (
        aParams.modeValidationAuto ===
        TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation
      ) {
        lTitre = GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.titrePositionnementNote",
        );
      } else {
        lTitre = GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.titre",
        );
      }
    }
    const lFenetreCalculAutoPositionnement = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_CalculAutoPositionnement,
      {
        pere: this,
        evenement(aTypeSaisie) {
          if (
            aTypeSaisie === TypeEvenementValidationAutoPositionnement.Saisie
          ) {
            const lCallbackReussite =
              !!aParams.callback && MethodesObjet.isFunction(aParams.callback)
                ? aParams.callback
                : aParams.instance.afficherPage;
            if (lCallbackReussite) {
              lCallbackReussite.call(aParams.instance);
            }
          } else if (
            aTypeSaisie ===
            TypeEvenementValidationAutoPositionnement.AfficherPreferencesCalcul
          ) {
            TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
              true,
              {
                callbackSurChangement: () => {
                  lFenetreCalculAutoPositionnement.mettreAJourValeursDonneesCalcul();
                },
              },
            );
          }
        },
        initialiser(aInstance) {
          aInstance.setDonneesAffichage({
            messageRestrictionsSurCalculAuto:
              aParams.messageRestrictionsSurCalculAuto,
            message: aParams.message,
            avecChoixCalcul: aParams.avecChoixCalcul,
            avecChoixPreferencesCalcul: aParams.avecChoixPreferencesCalcul,
            mrFiche: aParams.mrFiche,
          });
          aInstance.setDonnees({
            borneDateDebut: aParams.borneDateDebut,
            borneDateFin: aParams.borneDateFin,
            calculMultiServices: aParams.calculMultiServices,
            modeCalculPositionnement: aParams.modeCalculPositionnement,
            modeValidationAuto: aParams.modeValidationAuto,
            listeEleves: aParams.listeEleves,
          });
          aInstance.setOptionsFenetre({ titre: lTitre });
        },
      },
    );
    lFenetreCalculAutoPositionnement.afficher();
  }
};
TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement = function (
  aEstContexteParService,
  aParams,
) {
  let lPrefixeParametresUtilisateur;
  if (aEstContexteParService) {
    lPrefixeParametresUtilisateur = "CalculPositionnementEleveParService";
  } else {
    lPrefixeParametresUtilisateur = "CalculPositionnementEleveParClasse";
  }
  const lDonneesModeCalcul = {
    dernieresEvaluations: {
      utiliserNb: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NDernieresEvaluations.utiliserNb",
      ),
      nb: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NDernieresEvaluations.nb",
      ),
      pourcent: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NDernieresEvaluations.pourcent",
      ),
    },
    meilleuresEvals: {
      utiliserNb: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.utiliserNb",
      ),
      nb: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.nb",
      ),
      pourcent: GApplication.parametresUtilisateur.get(
        lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.pourcent",
      ),
    },
  };
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_PreferencesCalculPositionnement,
    {
      pere: this,
      evenement(aDonneesModeCalculModifiees) {
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NDernieresEvaluations.utiliserNb",
          aDonneesModeCalculModifiees.dernieresEvaluations.utiliserNb,
        );
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NDernieresEvaluations.nb",
          aDonneesModeCalculModifiees.dernieresEvaluations.nb,
        );
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NDernieresEvaluations.pourcent",
          aDonneesModeCalculModifiees.dernieresEvaluations.pourcent,
        );
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.utiliserNb",
          aDonneesModeCalculModifiees.meilleuresEvals.utiliserNb,
        );
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.nb",
          aDonneesModeCalculModifiees.meilleuresEvals.nb,
        );
        GApplication.parametresUtilisateur.set(
          lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.pourcent",
          aDonneesModeCalculModifiees.meilleuresEvals.pourcent,
        );
        if (aParams.callbackSurChangement) {
          aParams.callbackSurChangement();
        }
      },
    },
  );
  lFenetre.setDonneesModeCalcul(lDonneesModeCalcul);
  lFenetre.setLectureSeule(!!aParams.enLectureSeule);
  lFenetre.afficher();
};
TUtilitaireCompetences.surBoutonCalculNotesDevoir = function (aParams) {
  if (GEtatUtilisateur.EtatSaisie) {
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Information,
      titre: GTraductions.getValeur("interface.SaisieNonValidee"),
      message: GTraductions.getValeur("interface.SaisieAValider"),
    });
  } else {
    const lMrFiche = GTraductions.getValeur("evaluations.MFicheCalculNote");
    const lJsonMrFiche = ObjetJSON.parse(lMrFiche);
    const lMessageHTML = [];
    lMessageHTML.push(
      "<div>",
      GTraductions.getValeur("evaluations.confirmationAffectationNotes"),
      "</div>",
      '<div class="EspaceHaut10 flex-contain flex-center">',
      "<span>",
      lJsonMrFiche.titre,
      "</span>",
      '<ie-btnicon class="MargeGauche icon_question bt-activable" ie-model="surAfficherMrFiche" title="',
      lJsonMrFiche.titre,
      '"></ie-btnicon>',
      "</div>",
    );
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Confirmation,
      titre: aParams.titre,
      message: lMessageHTML.join(""),
      callback: this._surConfirmationCalculNotesDevoir.bind(this, aParams),
      controleur: {
        surAfficherMrFiche: {
          event() {
            ObjetHint.start(lJsonMrFiche.html, { sansDelai: true });
          },
        },
      },
    });
  }
};
TUtilitaireCompetences._surConfirmationCalculNotesDevoir = function (
  aParams,
  aGenreBouton,
) {
  if (aGenreBouton === 0) {
    const lParamsSaisie = { evaluation: aParams.evaluation };
    const lCallbackReussite =
      !!aParams.callback && MethodesObjet.isFunction(aParams.callback)
        ? aParams.callback
        : aParams.instance.afficherPage;
    new ObjetRequeteCalculAutoNotesSelonCompetences(
      aParams.instance,
      lCallbackReussite,
    ).lancerRequete(lParamsSaisie);
  }
};
TUtilitaireCompetences.getNiveauAcqusitionDEventClavier = function (
  aEvent,
  aListeNiveaux,
  aPourPositionnement = false,
) {
  if (!aListeNiveaux || !aEvent) {
    return null;
  }
  if (aEvent.ctrlKey || aEvent.altKey) {
    return null;
  }
  const lEventKey =
    !!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
  let lGenre = -1;
  if (!!lEventKey) {
    GParametres.listeNiveauxDAcquisitions.parcourir((D) => {
      if (
        (!aPourPositionnement && D.raccourci === lEventKey) ||
        (aPourPositionnement && D.raccourciPositionnement === lEventKey)
      ) {
        lGenre = D.getGenre();
        return false;
      }
    });
  }
  if (lGenre >= 0) {
    return aListeNiveaux.getElementParNumeroEtGenre(null, lGenre);
  }
  return null;
};
function _initMenuContextuelNiveauEquivalence(aPourCN, aParametres) {
  const lParametres = Object.assign(
    {
      instance: null,
      menuContextuel: null,
      evaluationsEditables: true,
      callbackNiveau: null,
    },
    aParametres,
  );
  lParametres.menuContextuel.setOptions({ largeurMin: 120 });
  if (MethodesObjet.isFunction(lParametres.callbackNiveau)) {
    let lListe;
    if (aPourCN) {
      lListe = TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceCN(true);
    } else {
      lListe = TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceLVE(true);
    }
    if (!!lListe) {
      lListe.parcourir((aElement) => {
        if (aElement.existe()) {
          lParametres.menuContextuel.add(
            aElement.getLibelle(),
            lParametres.evaluationsEditables,
            () => {
              lParametres.callbackNiveau.call(lParametres.instance, aElement);
            },
          );
        }
      });
    }
  }
}
TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceLVE = function (
  aParametres,
) {
  _initMenuContextuelNiveauEquivalence(false, aParametres);
};
TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceCN = function (
  aParametres,
) {
  _initMenuContextuelNiveauEquivalence(true, aParametres);
};
TUtilitaireCompetences.initMenuContextuelNiveauAcquisition = function (
  aParametres,
) {
  const lParametres = Object.assign(
    {
      instance: null,
      menuContextuel: null,
      genreChoixValidationCompetence: -1,
      genrePositionnement: undefined,
      avecDispense: true,
      avecSupprimerLesEvaluations: false,
      evaluationsEditables: true,
      estObservationEditable: false,
      estDateEditable: false,
      callbackNiveau: null,
      callbackCommentaire: null,
      callbackDate: null,
      avecLibelleRaccourci: false,
      avecSousMenu: false,
      avecSelecteurNiveauCalcule: false,
    },
    aParametres,
  );
  lParametres.menuContextuel.setOptions({
    largeurMin: 150,
    largeurColonneGauche: 30,
  });
  let lListe = null;
  if (MethodesObjet.isFunction(lParametres.callbackNiveau)) {
    lListe = TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
      genreChoixValidationCompetence:
        lParametres.genreChoixValidationCompetence,
      avecDispense: lParametres.avecDispense,
      avecLibelleRaccourci: lParametres.avecLibelleRaccourci,
      genrePositionnement: lParametres.genrePositionnement,
      avecSelecteurNiveauCalcule: lParametres.avecSelecteurNiveauCalcule,
    });
    if (lParametres.avecSousMenu) {
      lParametres.menuContextuel.addSousMenu(
        GTraductions.getValeur("competences.ModifierNiveauAcquisition"),
        ((aInstanceSousMenu) => {
          lListe.parcourir(
            ((aElement) => {
              if (aElement.existe()) {
                aInstanceSousMenu.add(
                  aElement.tableauLibelles || aElement.getLibelle(),
                  aElement.actif !== false && lParametres.evaluationsEditables,
                  () => {
                    lParametres.callbackNiveau.call(
                      lParametres.instance,
                      aElement,
                    );
                  },
                  {
                    image: aElement.image,
                    imageFormate: true,
                    largeurImage: aElement.largeurImage,
                  },
                );
              }
            }).bind(lParametres.instance),
          );
        }).bind(lParametres.instance),
      );
    } else {
      lListe.parcourir(
        ((aElement) => {
          if (aElement.existe()) {
            lParametres.menuContextuel.add(
              aElement.tableauLibelles || aElement.getLibelle(),
              aElement.actif !== false && lParametres.evaluationsEditables,
              () => {
                lParametres.callbackNiveau.call(lParametres.instance, aElement);
              },
              {
                image: aElement.image,
                imageFormate: true,
                largeurImage: aElement.largeurImage,
              },
            );
          }
        }).bind(lParametres.instance),
      );
    }
  }
  if (MethodesObjet.isFunction(lParametres.callbackCommentaire)) {
    lParametres.menuContextuel.add(
      GTraductions.getValeur("competences.AjouterCommentaire"),
      lParametres.estObservationEditable,
      () => {
        lParametres.callbackCommentaire.call(lParametres.instance);
      },
    );
  }
  if (MethodesObjet.isFunction(lParametres.callbackDate)) {
    lParametres.menuContextuel.add(
      GTraductions.getValeur("competences.ModifierDate"),
      lParametres.estDateEditable,
      () => {
        lParametres.callbackDate.call(lParametres.instance);
      },
    );
  }
  if (
    lParametres.avecSupprimerLesEvaluations &&
    MethodesObjet.isFunction(lParametres.callbackNiveau)
  ) {
    const lNiveauSuppression = lListe
      ? lListe.getElementParNumeroEtGenre(
          null,
          EGenreNiveauDAcquisition.Utilisateur,
        )
      : null;
    if (!!lNiveauSuppression) {
      lParametres.menuContextuel.add(
        GTraductions.getValeur("competences.SupprimerEvaluations"),
        lNiveauSuppression.actif !== false && lParametres.evaluationsEditables,
        () => {
          lParametres.callbackNiveau.call(
            lParametres.instance,
            lNiveauSuppression,
          );
        },
      );
    }
  }
};
TUtilitaireCompetences.getLibellePositionnement = function (aParams) {
  aParams.niveauDAcquisition =
    GParametres.listeNiveauxDAcquisitions.getElementParElement(
      aParams.niveauDAcquisition,
    );
  if (aParams.niveauDAcquisition) {
    return EGenreNiveauDAcquisitionUtil.getLibellePositionnement(aParams);
  }
};
TUtilitaireCompetences.getImagePositionnement = function (aParams) {
  aParams.niveauDAcquisition =
    GParametres.listeNiveauxDAcquisitions.getElementParElement(
      aParams.niveauDAcquisition,
    );
  if (aParams.niveauDAcquisition) {
    return EGenreNiveauDAcquisitionUtil.getImagePositionnement(aParams);
  }
};
TUtilitaireCompetences.composeLegende = function (aParams) {
  const lParams = Object.assign(
    {
      avecTitreLegende: true,
      titreLegende: GTraductions.getValeur("competences.Legende"),
      avecListeCompetences: true,
      avecListePositionnements: false,
      genrePositionnement: TypePositionnement.POS_Echelle,
      affichageLigneSimple: false,
    },
    aParams,
  );
  const _composeLigneSimpleLegende = function (aParams) {
    const H = [];
    let lLibelleNiveau, lImageNiveau;
    H.push(
      "<div",
      aParams.avecEspaceHaut === true ? ' class="EspaceHaut"' : "",
      ">",
    );
    GParametres.listeNiveauxDAcquisitions.parcourir((D) => {
      if (
        D.existeNumero() &&
        D.actifPour.contains(aParams.typeGenreValidation)
      ) {
        lLibelleNiveau = aParams.estPourPositionnement
          ? EGenreNiveauDAcquisitionUtil.getLibellePositionnement({
              niveauDAcquisition: D,
              genrePositionnement: lParams.genrePositionnement,
            })
          : D.getLibelle();
        lImageNiveau = aParams.estPourPositionnement
          ? EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: D,
              genrePositionnement: lParams.genrePositionnement,
            })
          : EGenreNiveauDAcquisitionUtil.getImage(D);
        H.push(
          '<div class="',
          aParams.avecInline ? "InlineBlock " : "",
          'm-bottom-l p-left-xl">',
          lImageNiveau,
          '<span class="m-left">',
          lLibelleNiveau,
          "</span></div>",
        );
      }
    });
    H.push("</div>");
    return H.join("");
  };
  const result = [];
  if (lParams.avecListeCompetences || lParams.avecListePositionnements) {
    result.push('<div class="EspaceHaut EspaceBas">');
    if (lParams.avecTitreLegende) {
      result.push(
        '<div class="Espace" style="',
        GStyle.composeCouleurBordure(GCouleur.bordure),
        GStyle.composeCouleurFond(GCouleur.fond),
        '">',
        '<div class="AlignementHaut Gras">',
        lParams.titreLegende,
        "</div>",
      );
    }
    if (
      lParams.avecListeCompetences &&
      lParams.avecListePositionnements &&
      (lParams.genrePositionnement === TypePositionnement.POS_Echelle ||
        lParams.genrePositionnement === TypePositionnement.POS_Moyenne)
    ) {
      let lOnAfficheLesDeuxImages, lImageCompetence, lImagePositionnement;
      result.push("<div>");
      GParametres.listeNiveauxDAcquisitions.parcourir((D) => {
        if (
          D.existeNumero() &&
          (D.actifPour.contains(
            TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          ) ||
            D.actifPour.contains(TypeGenreValidationCompetence.tGVC_Competence))
        ) {
          lImageCompetence = EGenreNiveauDAcquisitionUtil.getImage(D);
          lImagePositionnement =
            EGenreNiveauDAcquisitionUtil.getImagePositionnement({
              niveauDAcquisition: D,
              genrePositionnement: lParams.genrePositionnement,
            });
          lOnAfficheLesDeuxImages =
            D.actifPour.contains(
              TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
            ) &&
            D.actifPour.contains(
              TypeGenreValidationCompetence.tGVC_Competence,
            ) &&
            D.getGenre() <= EGenreNiveauDAcquisition.NonAcquis;
          if (lOnAfficheLesDeuxImages) {
            result.push(
              '<div class="InlineBlock PetitEspaceDroit AlignementMilieuVertical" style="padding-left: 15px;">',
              lImageCompetence,
              "</div>",
            );
            result.push(
              '<div class="InlineBlock PetitEspaceDroit AlignementMilieuVertical">',
              lImagePositionnement,
              "</div>",
            );
          } else {
            result.push(
              '<div class="InlineBlock PetitEspaceDroit AlignementMilieuVertical" style="padding-left: 15px;">',
              D.actifPour.contains(
                TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
              )
                ? lImageCompetence
                : lImagePositionnement,
              "</div>",
            );
          }
          result.push(
            '<span class="AlignementMilieuVertical">',
            D.getLibelle(),
            "</span>",
          );
        }
      });
      result.push("</div>");
    } else {
      if (lParams.avecListeCompetences) {
        result.push(
          _composeLigneSimpleLegende({
            typeGenreValidation:
              TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
            estPourPositionnement: false,
            avecInline: lParams.affichageLigneSimple,
          }),
        );
      }
      if (lParams.avecListePositionnements) {
        result.push(
          _composeLigneSimpleLegende({
            typeGenreValidation: TypeGenreValidationCompetence.tGVC_Competence,
            estPourPositionnement: true,
            avecEspaceHaut: !!lParams.avecListeCompetences,
            avecInline: lParams.affichageLigneSimple,
          }),
        );
      }
    }
    if (lParams.avecTitreLegende) {
      result.push("</div>");
    }
    result.push("</div>");
  }
  return result.join("");
};
TUtilitaireCompetences.composeTitleEvaluation = function (aCompetence) {
  const lTitleEvaluation = [];
  if (!!aCompetence) {
    if (aCompetence.pilier) {
      lTitleEvaluation.push("<b>", aCompetence.pilier.getLibelle(), "</b>");
      if (aCompetence.palier) {
        const lLibellePalier = aCompetence.palier.getLibelle();
        if (lLibellePalier) {
          lTitleEvaluation.push(" (", lLibellePalier, ")");
        }
      }
      lTitleEvaluation.push("<br/>");
    }
    if (!!aCompetence.coefficient || aCompetence.coefficient === 0) {
      lTitleEvaluation.push(
        GTraductions.getValeur("competences.coefficient"),
        " <b>",
        aCompetence.coefficient,
        "</b>",
        "<br/><br/>",
      );
    }
    if (!!aCompetence.nivEquivCELong) {
      lTitleEvaluation.push("[", aCompetence.nivEquivCELong, "] ");
    }
    lTitleEvaluation.push(aCompetence.getLibelle());
  }
  return lTitleEvaluation.join("");
};
TUtilitaireCompetences.composeHintEvaluationEleve = function (aParams) {
  const lHintEvaluationEleve = [];
  if (!!aParams.libelleEleve) {
    lHintEvaluationEleve.push("<b>", aParams.libelleEleve, "</b>");
    lHintEvaluationEleve.push("<br/><br/>");
  }
  if (aParams.estSaisieClotureePourEleve) {
    lHintEvaluationEleve.push(
      GTraductions.getValeur("competences.EvaluationClotureePourLaClasse"),
      '<i class="icon_lock m-left"></i><br/><br/>',
    );
  }
  lHintEvaluationEleve.push(aParams.hintCompetence);
  if (!!aParams.niveauDAcquisition) {
    if (GParametres.listeNiveauxDAcquisitions) {
      const lNiveauDAcquisition =
        GParametres.listeNiveauxDAcquisitions.getElementParNumero(
          aParams.niveauDAcquisition.getNumero(),
        );
      if (lNiveauDAcquisition) {
        const lLibelleNivAcqui =
          EGenreNiveauDAcquisitionUtil.getLibelle(lNiveauDAcquisition);
        lHintEvaluationEleve.push("<br/><br/>");
        lHintEvaluationEleve.push(
          "<b><u>",
          GTraductions.getValeur("competences.evaluation"),
          "</u></b> : ",
          lLibelleNivAcqui,
        );
      }
    }
  }
  if (!!aParams.observation) {
    lHintEvaluationEleve.push("<br/>", aParams.observation);
  }
  return GChaine.toTitle(lHintEvaluationEleve.join(""));
};
TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise = function (aParams) {
  let lListeNiveauxRaccourcis;
  const lListeGlobaleNiveaux = MethodesObjet.dupliquer(
    GParametres.listeNiveauxDAcquisitions,
  );
  if (!!lListeGlobaleNiveaux && lListeGlobaleNiveaux.count() > 0) {
    lListeGlobaleNiveaux.setTri([
      ObjetTri.init("positionJauge", EGenreTriElement.Decroissant),
    ]);
    lListeGlobaleNiveaux.trier();
    lListeNiveauxRaccourcis = [];
    lListeGlobaleNiveaux.parcourir((D) => {
      if (
        aParams.genreChoixValidationCompetence === undefined ||
        D.actifPour.contains(aParams.genreChoixValidationCompetence)
      ) {
        const lRaccourci =
          !!D.raccourci && D.raccourci.toUpperCase
            ? D.raccourci.toUpperCase()
            : "";
        const lImage = EGenreNiveauDAcquisitionUtil.getImage(D);
        lListeNiveauxRaccourcis.push(
          '<div class="PetitEspaceBas">',
          '<span class="InlineBlock AlignementMilieu" style="',
          GStyle.composeWidth(30),
          '">',
          lRaccourci,
          " : </span>",
          '<span class="InlineBlock AlignementMilieu" style="',
          GStyle.composeWidth(30),
          '" aria-hidden="true">',
          lImage || "",
          "</span>",
          "<span>",
          D.getLibelle(),
          "</span>",
          "</div>",
        );
      }
    });
  }
  const lMessageHtml = [];
  lMessageHtml.push(
    "<p>",
    GTraductions.getValeur("competences.MessageAideSaisieNivMaitrise"),
    "</p>",
  );
  if (!!lListeNiveauxRaccourcis) {
    lMessageHtml.push(
      '<div class="MargeGauche GrandEspaceHaut">',
      lListeNiveauxRaccourcis.join(""),
      "</div>",
    );
  }
  GApplication.getMessage()
    .afficher({
      type: EGenreBoiteMessage.MrFiche,
      titre: GTraductions.getValeur("competences.TitreAideSaisieNivMaitrise"),
      width: 420,
      message: lMessageHtml.join(""),
    })
    .then(() => {
      if (!!aParams.callback) {
        aParams.callback();
      }
    });
};
TUtilitaireCompetences.getListeNiveauxAcquis = function () {
  const lListeNiveauxAcquis = new ObjetListeElements();
  GParametres.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
    if (TUtilitaireCompetences.estNiveauAcqui(aNiveau)) {
      lListeNiveauxAcquis.add(aNiveau);
    }
  });
  return lListeNiveauxAcquis;
};
TUtilitaireCompetences.getListeNiveauxNonAcquis = function () {
  const lListeNiveauxAcquis = new ObjetListeElements();
  GParametres.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
    if (TUtilitaireCompetences.estNiveauNonAcqui(aNiveau)) {
      lListeNiveauxAcquis.add(aNiveau);
    }
  });
  return lListeNiveauxAcquis;
};
TUtilitaireCompetences.estNiveauAcqui = function (aNiveauAcquisition) {
  let lEstUnNiveauAcquis = false;
  if (!!aNiveauAcquisition) {
    const lNiveauGlobal =
      GParametres.listeNiveauxDAcquisitions.getElementParGenre(
        aNiveauAcquisition.getGenre(),
      );
    lEstUnNiveauAcquis = !!lNiveauGlobal && !!lNiveauGlobal.estAcqui;
  }
  return lEstUnNiveauAcquis;
};
TUtilitaireCompetences.estNiveauNonAcqui = function (aNiveauAcquisition) {
  let lEstUnNiveauAcquis = false;
  if (!!aNiveauAcquisition) {
    const lNiveauGlobal =
      GParametres.listeNiveauxDAcquisitions.getElementParGenre(
        aNiveauAcquisition.getGenre(),
      );
    lEstUnNiveauAcquis = !!lNiveauGlobal && !!lNiveauGlobal.estNonAcqui;
  }
  return lEstUnNiveauAcquis;
};
TUtilitaireCompetences.estNotantPourTxReussiteEvaluation = function (
  aNiveauAcquisition,
) {
  let lEstUnNiveauAcquisNotant = false;
  if (!!aNiveauAcquisition) {
    const lNiveauGlobal =
      GParametres.listeNiveauxDAcquisitions.getElementParGenre(
        aNiveauAcquisition.getGenre(),
      );
    lEstUnNiveauAcquisNotant =
      !!lNiveauGlobal && !!lNiveauGlobal.estNotantPourTxReussite;
  }
  return lEstUnNiveauAcquisNotant;
};
module.exports = { TUtilitaireCompetences };

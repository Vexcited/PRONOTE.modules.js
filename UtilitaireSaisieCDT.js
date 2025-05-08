exports.UtilitaireSaisieCDT = UtilitaireSaisieCDT;
const ObjetElement_1 = require("ObjetElement");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const TinyInit_1 = require("TinyInit");
const ObjetTri_1 = require("ObjetTri");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const EGenreFenetreDocumentJoint_1 = require("EGenreFenetreDocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const ObjetDate_1 = require("ObjetDate");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequeteListeContenuTAFsEtContenus = require("ObjetRequeteListeContenuTAFsEtContenus");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetFenetre_EditionUrl_1 = require("ObjetFenetre_EditionUrl");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const ObjetFenetre_ProgressionAffectationAuCours_1 = require("ObjetFenetre_ProgressionAffectationAuCours");
const ObjetFenetre_Categorie_1 = require("ObjetFenetre_Categorie");
function UtilitaireSaisieCDT() {}
UtilitaireSaisieCDT.initCahierDeTextes = function () {
  const lCahierDeTextes = new ObjetElement_1.ObjetElement();
  lCahierDeTextes.listeContenus = new ObjetListeElements_1.ObjetListeElements();
  lCahierDeTextes.listeContenus.aUnElementVide =
    ObjetDeserialiser_1.ObjetDeserialiser._aUnElementVide;
  lCahierDeTextes.listeContenus.verifierAvantValidation =
    ObjetDeserialiser_1.ObjetDeserialiser._verifierAvantValidation;
  lCahierDeTextes.listeContenus.addElement(UtilitaireSaisieCDT.createContenu());
  lCahierDeTextes.Etat = Enumere_Etat_1.EGenreEtat.Aucun;
  lCahierDeTextes.ListeTravailAFaire =
    new ObjetListeElements_1.ObjetListeElements();
  lCahierDeTextes.ListeTravailAFaire.aUnElementVide =
    ObjetDeserialiser_1.ObjetDeserialiser._aUnElementVide;
  lCahierDeTextes.ListeTravailAFaire.verifierAvantValidation =
    ObjetDeserialiser_1.ObjetDeserialiser._verifierAvantValidation;
  lCahierDeTextes.publie = false;
  lCahierDeTextes.verrouille = null;
  lCahierDeTextes.dateVisa = null;
  return lCahierDeTextes;
};
UtilitaireSaisieCDT.initContenu = function (aContenu) {
  if (aContenu) {
    aContenu.Libelle = "";
    aContenu.descriptif = "";
    aContenu.objectifs = "";
    aContenu.estVide = true;
    aContenu.categorie = new ObjetElement_1.ObjetElement("", 0);
    aContenu.ListeThemes = new ObjetListeElements_1.ObjetListeElements();
    aContenu.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
      "Theme.libelleCB.contenu",
    );
    aContenu.parcoursEducatif = -1;
    aContenu.ListePieceJointe = new ObjetListeElements_1.ObjetListeElements();
    aContenu.listeExecutionQCM = new ObjetListeElements_1.ObjetListeElements();
    aContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
  }
  return aContenu;
};
UtilitaireSaisieCDT.initTAF = function (aTAF, aDate) {
  if (aTAF) {
    const lApp = GApplication;
    Object.assign(aTAF, {
      descriptif: "",
      PourLe: aDate || new Date(),
      ListePieceJointe: new ObjetListeElements_1.ObjetListeElements(),
      listeEleves: new ObjetListeElements_1.ObjetListeElements(),
      estPourTous: true,
      avecMiseEnForme: lApp.parametresUtilisateur.get(
        "CDT.TAF.ActiverMiseEnForme",
      ),
      niveauDifficulte: lApp.parametresUtilisateur.get(
        "CDT.TAF.NiveauDifficulte",
      ),
      duree: lApp.parametresUtilisateur.get("CDT.TAF.Duree"),
      genreRendu: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu,
      ListeThemes: new ObjetListeElements_1.ObjetListeElements(),
      libelleCBTheme: ObjetTraduction_1.GTraductions.getValeur(
        "Theme.libelleCB.taf",
      ),
    });
  }
  return aTAF;
};
UtilitaireSaisieCDT.createContenu = function () {
  const lNewContenu = new ObjetElement_1.ObjetElement("");
  lNewContenu.Numero = null;
  return UtilitaireSaisieCDT.initContenu(lNewContenu);
};
UtilitaireSaisieCDT.estContenuVide = function (aContenu) {
  if (!aContenu) {
    return true;
  }
  return (
    aContenu.Libelle === "" &&
    TinyInit_1.TinyInit.estContenuVide(aContenu.descriptif) &&
    TinyInit_1.TinyInit.estContenuVide(aContenu.objectifs) &&
    aContenu.categorie &&
    !aContenu.categorie.existeNumero() &&
    !aContenu.ListeThemes.getNbrElementsExistes() &&
    aContenu.ListePieceJointe.getNbrElementsExistes() === 0 &&
    aContenu.listeExecutionQCM.getNbrElementsExistes() === 0 &&
    (!aContenu.referenceProgression ||
      !aContenu.referenceProgression.existeNumero())
  );
};
UtilitaireSaisieCDT.verifierContenu = function (aContenu) {
  if (aContenu) {
    aContenu.estVide = UtilitaireSaisieCDT.estContenuVide(aContenu);
  }
};
UtilitaireSaisieCDT.estTAFVide = function (aTAF) {
  return (
    !aTAF ||
    (TinyInit_1.TinyInit.estContenuVide(aTAF.descriptif) && !aTAF.executionQCM)
  );
};
UtilitaireSaisieCDT.estTAFPrimaireVide = function (aTAF) {
  return (
    !aTAF ||
    (TinyInit_1.TinyInit.estContenuVide(aTAF.descriptif) &&
      aTAF.ListePieceJointe.count() === 0)
  );
};
UtilitaireSaisieCDT.collerTAF = function (
  aCDT,
  aTAFAColler,
  aDate,
  aTAFARemplacer,
) {
  if (!aTAFAColler || !aCDT) {
    return;
  }
  if (aTAFARemplacer) {
    aTAFARemplacer.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    aTAFARemplacer.ListePieceJointe.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    });
  }
  const lTAF = MethodesObjet_1.MethodesObjet.dupliquer(aTAFAColler);
  aCDT.ListeTravailAFaire.addElement(lTAF);
  aCDT.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
  lTAF.PourLe = aDate;
  lTAF.listeEleves = new ObjetListeElements_1.ObjetListeElements();
  lTAF.estPourTous = true;
  lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  if (lTAF.executionQCM) {
    lTAF.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  } else {
    lTAF.ListePieceJointe.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    });
  }
};
UtilitaireSaisieCDT.collerContenu = function (
  aCDT,
  aContenuAColler,
  aContenuARemplacer,
) {
  if (!aContenuAColler || !aCDT) {
    return;
  }
  if (aContenuARemplacer) {
    aContenuARemplacer.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    aContenuARemplacer.ListePieceJointe.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    });
  }
  const lContenu = MethodesObjet_1.MethodesObjet.dupliquer(aContenuAColler);
  aCDT.listeContenus.addElement(lContenu);
  aCDT.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
  lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  lContenu.ListePieceJointe.parcourir((D) => {
    D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  });
  lContenu.listeExecutionQCM.parcourir((D) => {
    D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  });
};
function _collerTAFsDansCDT(aCDT, aTAFsAColler, aDate) {
  if (!aCDT || !aTAFsAColler || !aDate) {
    return;
  }
  for (let I = 0; I < aCDT.ListeTravailAFaire.count(); I++) {
    const lTAF = aCDT.ListeTravailAFaire.get(I);
    lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    for (let J = 0; J < lTAF.ListePieceJointe.count(); J++) {
      const lPJ = lTAF.ListePieceJointe.get(J);
      lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    }
  }
  aTAFsAColler.parcourir((aTaf) => {
    if (aTaf.getNumero() !== 0) {
      UtilitaireSaisieCDT.collerTAF(aCDT, aTaf, aDate);
    }
  });
  aCDT.ListeTravailAFaire.trier();
}
UtilitaireSaisieCDT.collerCDT = function (
  aCDTCible,
  aCDTSource,
  aAvecCopieEletProg,
  aDateTAF,
) {
  if (!aCDTCible || !aCDTSource) {
    return;
  }
  aCDTCible.publie = aCDTSource.publie;
  aCDTCible.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
  aCDTCible.listeContenus.parcourir((aContenu) => {
    aContenu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    aContenu.ListePieceJointe.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
    });
  });
  aCDTSource.listeContenus.parcourir((aContenu) => {
    if (
      aContenu.getNumero() !== 0 &&
      !UtilitaireSaisieCDT.estContenuVide(aContenu)
    ) {
      UtilitaireSaisieCDT.collerContenu(aCDTCible, aContenu);
    }
  });
  _collerTAFsDansCDT(aCDTCible, aCDTSource.ListeTravailAFaire, aDateTAF);
  if (aAvecCopieEletProg && aCDTSource.listeElementsProgrammeCDT) {
    if (!aCDTCible.listeElementsProgrammeCDT) {
      aCDTCible.listeElementsProgrammeCDT =
        new ObjetListeElements_1.ObjetListeElements();
    }
    aCDTCible.listeElementsProgrammeCDT =
      new ObjetListeElements_1.ObjetListeElements().add(
        aCDTSource.listeElementsProgrammeCDT,
      );
    aCDTCible.listeElementsProgrammeCDT.avecSaisie = true;
    aCDTCible.listeElementsProgrammeCDT.setSerialisateurJSON({
      ignorerEtatsElements: true,
    });
  }
};
UtilitaireSaisieCDT.getElementCategorieVide = function () {
  return new ObjetElement_1.ObjetElement("", 0);
};
UtilitaireSaisieCDT.getlisteCategoriesPourCombo = function (aListeCategories) {
  const lListe = MethodesObjet_1.MethodesObjet.dupliquer(aListeCategories);
  lListe.addElement(UtilitaireSaisieCDT.getElementCategorieVide());
  lListe
    .setTri([
      ObjetTri_1.ObjetTri.init((D) => {
        return D.getNumero() !== 0;
      }),
      ObjetTri_1.ObjetTri.init("Libelle"),
    ])
    .trier();
  return lListe;
};
UtilitaireSaisieCDT.ouvrirFenetreEditionCategorie = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      listeCategories: null,
      callback: null,
      avecAjoutAucuneCategorie: true,
    },
    aParams,
  );
  const lListeCategories = MethodesObjet_1.MethodesObjet.dupliquer(
    lParams.listeCategories,
  );
  let lElementAucun = lListeCategories.getElementParElement(
    UtilitaireSaisieCDT.getElementCategorieVide(),
  );
  if (!lElementAucun && lParams.avecAjoutAucuneCategorie) {
    lElementAucun = UtilitaireSaisieCDT.getElementCategorieVide();
    lListeCategories.addElement(lElementAucun);
  }
  if (lElementAucun) {
    lElementAucun.Libelle = ObjetTraduction_1.GTraductions.getValeur("Aucune");
    lElementAucun.Editable = false;
  }
  let lAvecSaisie = false;
  ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_Categorie_1.ObjetFenetre_Categorie,
    {
      pere: lParams.instance,
      evenement: function (aNumeroBouton, aParams) {
        lParams.callback({
          valider: aParams.bouton.valider,
          listeCategories: lListeCategories,
          numeroCategorie: aParams.numeroCategorie,
          avecSaisie: lAvecSaisie,
        });
      },
      initialiser: function (aInstance) {
        aInstance.setEtatSaisie = function (aEtatSaisie) {
          if (aEtatSaisie) {
            lAvecSaisie = true;
          }
        };
      },
    },
    {
      addParametresValidation: function (aParams) {
        return {
          numeroCategorie: aParams.bouton.valider
            ? aParams.instance.getNumeroCategorie()
            : null,
        };
      },
    },
  ).setDonnees(lListeCategories);
};
UtilitaireSaisieCDT.ouvrirFenetrePJ = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      element: null,
      genrePJ: null,
      nodeFocus: null,
      listePJTot: null,
      listePJContexte: null,
      dateCours: null,
      validation: null,
      maxSize: GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
      ),
    },
    aParams,
  );
  let lAvecSaisie = false;
  const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_PieceJointe,
    {
      pere: lParams.instance,
      evenement: function (aNumeroBouton, aParamsFenetre) {
        const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
        lParams.listePJTot.parcourir((aDocument) => {
          let lDocumentJoint = lParams.listePJContexte.getElementParNumero(
            aDocument.getNumero(),
          );
          const lActif = aDocument.Actif && aDocument.existe();
          if (lDocumentJoint) {
            if (!lActif) {
              lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
              lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              lAvecSaisie = true;
            }
          } else {
            if (lActif) {
              lDocumentJoint = new ObjetElement_1.ObjetElement(
                aDocument.getLibelle(),
                aDocument.getNumero(),
                aDocument.getGenre(),
              );
              lDocumentJoint.url = aDocument.url;
              lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
              lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              lParams.listePJContexte.addElement(lDocumentJoint);
              lAvecSaisie = true;
            }
          }
        });
        lParams.listePJTot.trier();
        const lPromise = lParams.validation(
          aParamsFenetre,
          lListeFichiers,
          lAvecSaisie,
        );
        return (lPromise || Promise.resolve()).then(() => {
          if (lParams.nodeFocus) {
            ObjetHtml_1.GHtml.setFocus(lParams.nodeFocus, true);
          }
        });
      },
      initialiser: function (aInstance) {
        aInstance.setEtatSaisie = function (aEtatSaisie) {
          if (aEtatSaisie) {
            lAvecSaisie = true;
          }
        };
      },
    },
  );
  lFenetre.afficherFenetrePJ({
    listePJTot: lParams.listePJTot,
    listePJContexte: lParams.listePJContexte,
    genreFenetrePJ:
      EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.CahierDeTextes,
    genrePJ: lParams.genrePJ,
    genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
    optionsSelecFile: { maxSize: lParams.maxSize },
    avecFiltre: { date: true, classeMatiere: true },
    dateCours: lParams.dateCours,
    avecThemes: GApplication.parametresUtilisateur.get("avecGestionDesThemes"),
  });
};
function _creer_QCM_Training(aEltQCM) {
  const lExecutionQCM = new ObjetElement_1.ObjetElement();
  lExecutionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  $.extend(lExecutionQCM, {
    autoriserLaNavigation: aEltQCM.autoriserLaNavigation,
    homogeneiserNbQuestParNiveau: aEltQCM.homogeneiserNbQuestParNiveau,
    jeuQuestionFixe: aEltQCM.jeuQuestionFixe,
    melangerLesQuestionsGlobalement: aEltQCM.melangerLesQuestionsGlobalement,
    melangerLesQuestionsParNiveau: aEltQCM.melangerLesQuestionsParNiveau,
    melangerLesReponses: aEltQCM.melangerLesReponses,
    modeDiffusionCorrige: [
      TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans,
      TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate,
    ].includes(aEltQCM.modeDiffusionCorrige)
      ? TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion
      : aEltQCM.modeDiffusionCorrige,
    nombreQuestionsSoumises: aEltQCM.nombreQuestionsSoumises,
    dureeMaxQCM: aEltQCM.dureeMaxQCM,
    nbMaxTentative: aEltQCM.nbMaxTentative,
    ressentiRepondant: aEltQCM.ressentiRepondant,
    tolererFausses: aEltQCM.tolererFausses,
    acceptIncomplet: aEltQCM.acceptIncomplet,
  });
  $.extend(true, lExecutionQCM, { QCM: aEltQCM, avecParamModifiables: true });
  return lExecutionQCM;
}
UtilitaireSaisieCDT.choisirQCM = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      paramsRequete: null,
      donneesSupplementaire: null,
      element: null,
      pourTAF: false,
    },
    aParams,
  );
  return new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(
    lParams.instance,
  )
    .lancerRequete(lParams.paramsRequete, lParams.donneesSupplementaire)
    .then((aTabParams) => {
      return new Promise((aResolve) => {
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
          {
            pere: lParams.instance,
            evenement: function (aNumeroBouton, aEltQCM) {
              if (aNumeroBouton !== 1) {
                return aResolve({ valider: false });
              }
              if (lParams.element && !lParams.pourTAF) {
                const lQCM = _creer_QCM_Training(aEltQCM);
                lParams.element.listeExecutionQCM.addElement(lQCM);
                lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                lParams.element.estVide = false;
              }
              aResolve({ valider: true, eltQCM: aEltQCM });
            },
            initialiser: function (aInstance) {
              UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
              aInstance.setGenreRessources({
                genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
                genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
                genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
                genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
              });
            },
          },
        ).setDonnees(aTabParams[0], aTabParams[1], aTabParams[2]);
      });
    });
};
UtilitaireSaisieCDT._creerTAFAvecQCM = function (aParams) {
  const lParams = Object.assign(
    {
      qcm: null,
      avecDevoir: false,
      avecEvaluation: false,
      dateCreationTAF: null,
      dateFinCours: null,
      service: null,
      periode: null,
      cours: null,
      numeroSemaine: null,
    },
    aParams,
  );
  if (!lParams.qcm) {
    return;
  }
  const lTAF = new ObjetElement_1.ObjetElement();
  lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
  Object.assign(lTAF, {
    descriptif: lParams.qcm.getLibelle(),
    PourLe: lParams.dateCreationTAF,
    listeEleves: new ObjetListeElements_1.ObjetListeElements(),
    estPourTous: true,
    niveauDifficulte: GApplication.parametresUtilisateur.get(
      "CDT.TAF.NiveauDifficulte",
    ),
    duree: 0,
    genreRendu: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu,
    libelleCBTheme: ObjetTraduction_1.GTraductions.getValeur(
      "Theme.libelleCB.taf",
    ),
  });
  if (lParams.avecDevoir || lParams.avecEvaluation) {
    lTAF.service = lParams.service;
    lTAF.periode = lParams.periode;
  }
  if (lParams.qcm.getGenre() === Enumere_Ressource_1.EGenreRessource.QCM) {
    UtilitaireQCM_1.UtilitaireQCM.surSelectionQCM(lTAF, lParams.qcm, {
      genreAucune: Enumere_Ressource_1.EGenreRessource.Aucune,
      genreExecQCM: Enumere_Ressource_1.EGenreRessource.ExecutionQCM,
    });
    const lDateDebutPub = lParams.dateFinCours
      ? new Date(
          lParams.dateFinCours.getFullYear(),
          lParams.dateFinCours.getMonth(),
          lParams.dateFinCours.getDate(),
          0,
          0,
        )
      : new Date(new Date().getTime() + ObjetDate_1.GDate.DureeHeures);
    const lDateFinPub = lParams.dateCreationTAF
      ? new Date(
          lParams.dateCreationTAF.getFullYear(),
          lParams.dateCreationTAF.getMonth(),
          lParams.dateCreationTAF.getDate(),
          23,
          59,
        )
      : new Date();
    $.extend(lTAF.executionQCM, {
      estLieADevoir: lParams.avecDevoir,
      estLieAEvaluation: lParams.avecEvaluation,
      estUnTAF: true,
      dateDebutPublication: lDateDebutPub,
      dateFinPublication: lDateFinPub,
    });
    UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(lTAF.executionQCM);
  }
  return lTAF;
};
UtilitaireSaisieCDT.creerTAFAvecQCM = function (aParams) {
  return UtilitaireSaisieCDT._creerTAFAvecQCM(aParams);
};
UtilitaireSaisieCDT.creerTAFAvecQCMAvecDevoir = function (aParams) {
  aParams.avecDevoir = true;
  aParams.avecEvaluation = false;
  return UtilitaireSaisieCDT._creerTAFAvecQCM(aParams);
};
UtilitaireSaisieCDT.creerTAFAvecQCMAvecEvaluation = function (aParams) {
  aParams.avecDevoir = false;
  aParams.avecEvaluation = true;
  return UtilitaireSaisieCDT._creerTAFAvecQCM(aParams);
};
UtilitaireSaisieCDT.choisirFichierCloud = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      element: null,
      numeroService: -1,
      listeDocumentsJoints: null,
    },
    aParams,
  );
  return new Promise((aResolve) => {
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
      {
        pere: lParams.instance,
        evenement: function (aParam) {
          if (
            aParam.listeNouveauxDocs &&
            aParam.listeNouveauxDocs.count() > 0
          ) {
            lParams.element.ListePieceJointe.add(aParam.listeNouveauxDocs);
            lParams.element.estVide = false;
            lParams.listeDocumentsJoints.add(aParam.listeNouveauxDocs);
            lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
            aResolve();
          }
        },
      },
    ).setDonnees({ service: lParams.numeroService });
  });
};
UtilitaireSaisieCDT.choisirElevesTAF = function (aParams) {
  const lParams = Object.assign(
    { instance: null, element: null, listeTousEleves: null, callback: null },
    aParams,
  );
  let lListeSelectionEleves = new ObjetListeElements_1.ObjetListeElements();
  lParams.listeDetaches = new ObjetListeElements_1.ObjetListeElements();
  lParams.listeEnCours = new ObjetListeElements_1.ObjetListeElements();
  lParams.listeTousEleves.parcourir((aElement) => {
    if (aElement.estElevesDetachesDuCours) {
      lParams.listeDetaches.addElement(aElement);
    } else {
      lParams.listeEnCours.addElement(aElement);
    }
  });
  if (
    !lParams.element.listeEleves ||
    lParams.element.listeEleves.count() === 0
  ) {
    if (lParams.listeDetaches && lParams.listeDetaches.count()) {
      lListeSelectionEleves = MethodesObjet_1.MethodesObjet.dupliquer(
        lParams.listeEnCours,
      );
    } else {
      lListeSelectionEleves = MethodesObjet_1.MethodesObjet.dupliquer(
        lParams.listeTousEleves,
      );
    }
  } else {
    lParams.element.listeEleves.parcourir((D) => {
      const lEleve = MethodesObjet_1.MethodesObjet.dupliquer(D);
      lEleve.Genre = Enumere_Ressource_1.EGenreRessource.Eleve;
      lListeSelectionEleves.addElement(lEleve);
    });
  }
  const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
    {
      pere: this,
      evenement: function (aGenre, aListe, aNumeroBouton) {
        if (aNumeroBouton === 1) {
          const lEstPourTousInitial = lParams.element.estPourTous;
          lParams.element.listeEleves =
            new ObjetListeElements_1.ObjetListeElements();
          if (!lParams.listeDetaches || lParams.listeDetaches.count() === 0) {
            lParams.element.estPourTous =
              aListe.count() === lParams.listeTousEleves.count();
          } else {
            lParams.element.estPourTous =
              aListe.count() === lParams.listeEnCours.count() &&
              aListe.getIndiceElementParFiltre((aElement) => {
                return aElement.estElevesDetachesDuCours;
              }) === -1;
          }
          if (!lParams.element.estPourTous) {
            aListe.parcourir((D) => {
              D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              lParams.element.listeEleves.addElement(D);
            });
          } else {
            if (lEstPourTousInitial !== lParams.element.estPourTous) {
              lParams.element.avecModificationPublic = true;
            }
          }
          lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          lParams.callback();
        }
      },
    },
    {
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.titreFenetreTAFEleves",
      ),
    },
  );
  lFenetre.setOptionsFenetreSelectionRessource({
    avecCocheRessources: true,
    avecBarreTitre: false,
    estDeploye: true,
  });
  lFenetre.setSelectionObligatoire(true);
  const lListeCumulDispo = new ObjetListeElements_1.ObjetListeElements();
  lListeCumulDispo.addElement(
    new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur(
        "Fenetre_SelectionPublic.Cumul.Aucun",
      ),
      0,
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.sans,
    ),
  );
  lListeCumulDispo.addElement(
    new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Classe"),
      0,
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
    ),
  );
  lListeCumulDispo.addElement(
    new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Groupe"),
      0,
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.groupe,
    ),
  );
  lListeCumulDispo.addElement(
    new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur(
        "actualites.Cumul.LieuEnseignement",
      ),
      0,
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.lieuEnseignement,
    ),
  );
  lListeCumulDispo.addElement(
    new ObjetElement_1.ObjetElement(
      ObjetTraduction_1.GTraductions.getValeur(
        "Fenetre_SelectionPublic.Cumul.AttendusEnCours",
      ),
      0,
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.attendusEnCours,
    ),
  );
  lFenetre.setListeCumuls(lListeCumulDispo);
  lFenetre.setGenreCumulActif(
    ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
  );
  lFenetre.setOptions({ avecElevesDetaches: true });
  lFenetre.setDonnees({
    listeRessources: lParams.listeTousEleves,
    listeRessourcesSelectionnees: lListeSelectionEleves,
    genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
    titre:
      Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
        Enumere_Ressource_1.EGenreRessource.Eleve,
      ),
  });
};
function _getContenuPrecedentPourAffectation(aListeCDTPrecdents) {
  const lCDT = aListeCDTPrecdents
    ? aListeCDTPrecdents.get(aListeCDTPrecdents.count() - 1)
    : null;
  if (lCDT && lCDT.contenus && lCDT.contenus.count() > 0) {
    return lCDT.contenus.get(lCDT.contenus.count() - 1);
  }
  return null;
}
function _getElementProgressionCDTPrecedent(aListeCDTPrecdents) {
  const lCDT = aListeCDTPrecdents
    ? aListeCDTPrecdents.get(aListeCDTPrecdents.count() - 1)
    : null;
  if (lCDT && lCDT.elementProgression) {
    return lCDT.elementProgression;
  }
  return null;
}
UtilitaireSaisieCDT.getOptionsContenuMenuMagique = function (aParams) {
  const lParams = Object.assign(
    { cdt: null, listeCDTsPrecedents: null },
    aParams,
  );
  const lExisteDevoirEtEvalDansCDT = {};
  if (lParams.cdt.listeContenus) {
    lParams.cdt.listeContenus.parcourir((D) => {
      if (D.categorie) {
        if (
          D.categorie.getGenre() ===
          TypeOrigineCreationCategorieCahierDeTexte_1
            .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
        ) {
          lExisteDevoirEtEvalDansCDT[
            TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
          ] = true;
        }
        if (
          D.categorie.getGenre() ===
          TypeOrigineCreationCategorieCahierDeTexte_1
            .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation
        ) {
          lExisteDevoirEtEvalDansCDT[
            TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation
          ] = true;
        }
      }
    });
  }
  return {
    avecContenuPrecedent: !!_getContenuPrecedentPourAffectation(
      lParams.listeCDTsPrecedents,
    ),
    avecPoursuireProgression: !!_getElementProgressionCDTPrecedent(
      lParams.listeCDTsPrecedents,
    ),
    existeDevoirEtEvalDansCDT: lExisteDevoirEtEvalDansCDT,
  };
};
function _controlerElementCDTDejaAffecte(
  aCDT,
  aListeElementsCDT,
  aElementCDT,
  aGenreRessource,
) {
  let lElementCDTTrouve;
  const lElementCDTOrigine = aListeElementsCDT.getElementParNumeroEtGenre(
    aElementCDT.getNumero(),
    aGenreRessource,
  );
  if (lElementCDTOrigine) {
    if (
      aGenreRessource === Enumere_Ressource_1.EGenreRessource.ContenuDeCours
    ) {
      aElementCDT.Libelle = lElementCDTOrigine.getLibelle();
    }
    if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.TravailAFaire) {
      aElementCDT.PourLe = lElementCDTOrigine.PourLe;
    }
  }
  if (
    lElementCDTOrigine &&
    lElementCDTOrigine.listeAffectes &&
    lElementCDTOrigine.listeAffectes.count() > 0
  ) {
    for (
      let i = 0, lNb = lElementCDTOrigine.listeAffectes.count();
      i < lNb;
      i++
    ) {
      const lElementAffecte = lElementCDTOrigine.listeAffectes.get(i);
      if (
        lElementAffecte.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.ContenuDeCours
      ) {
        lElementCDTTrouve = aCDT.listeContenus.getElementParNumeroEtGenre(
          lElementAffecte.getNumero(),
        );
      } else {
        lElementCDTTrouve = aCDT.ListeTravailAFaire.getElementParNumeroEtGenre(
          lElementAffecte.getNumero(),
        );
      }
      if (lElementCDTTrouve) {
        lElementCDTTrouve.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
      }
    }
  }
}
function _getCategorieGenreCours(aListeCategories) {
  let lCategorie = null;
  aListeCategories.parcourir((D) => {
    if (
      D.getGenre() ===
      TypeOrigineCreationCategorieCahierDeTexte_1
        .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Cours
    ) {
      lCategorie = D;
      return false;
    }
  });
  return lCategorie;
}
function _surReponseListeContenuTAFsEtContenus(
  aParams,
  aListeElementsCDT,
  aListeTAFs,
  aListeContenus,
) {
  let i;
  const lResult = {
    listeNewContenus: new ObjetListeElements_1.ObjetListeElements(),
    listeNewTAFs: new ObjetListeElements_1.ObjetListeElements(),
    listeContenus: aListeContenus,
    listeTAFs: aListeTAFs,
  };
  if (aListeContenus) {
    for (i = 0; i < aListeContenus.count(); i++) {
      const lContenu = aListeContenus.get(i);
      if (aListeElementsCDT) {
        _controlerElementCDTDejaAffecte(
          aParams.cdt,
          aListeElementsCDT,
          lContenu,
          Enumere_Ressource_1.EGenreRessource.ContenuDeCours,
        );
      }
      const lNewContenu = new ObjetElement_1.ObjetElement(
        lContenu.getLibelle(),
      );
      lNewContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
      lNewContenu.descriptif = lContenu.descriptif;
      lNewContenu.estVide = false;
      lNewContenu.categorie = MethodesObjet_1.MethodesObjet.dupliquer(
        lContenu.categorie.getNumero() === 0
          ? _getCategorieGenreCours(aParams.listeCategories)
          : lContenu.categorie,
      );
      lNewContenu.ListePieceJointe = MethodesObjet_1.MethodesObjet.dupliquer(
        lContenu.ListePieceJointe,
      );
      lNewContenu.ListePieceJointe.parcourir((aElement) => {
        aElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
      });
      lNewContenu.referenceProgression = lContenu;
      lNewContenu.ListeThemes = MethodesObjet_1.MethodesObjet.dupliquer(
        lContenu.ListeThemes,
      );
      lNewContenu.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
        "Theme.libelleCB.contenu",
      );
      lResult.listeNewContenus.addElement(lNewContenu);
    }
  }
  if (aListeTAFs) {
    for (i = 0; i < aListeTAFs.count(); i++) {
      const lTAFModele = aListeTAFs.get(i);
      if (aListeElementsCDT) {
        _controlerElementCDTDejaAffecte(
          aParams.cdt,
          aListeElementsCDT,
          lTAFModele,
          Enumere_Ressource_1.EGenreRessource.TravailAFaire,
        );
      }
      const lNewTAF = new ObjetElement_1.ObjetElement(
        lTAFModele.getLibelle(),
        null,
        lTAFModele.Genre,
      );
      lNewTAF.descriptif = lTAFModele ? lTAFModele.descriptif : "";
      lNewTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
      lNewTAF.referenceProgression = lTAFModele;
      if (!lNewTAF.getLibelle()) {
        lNewTAF.Libelle = "";
      }
      lNewTAF.genreRendu =
        TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu;
      lNewTAF.niveauDifficulte = GApplication.parametresUtilisateur.get(
        "CDT.TAF.NiveauDifficulte",
      );
      lNewTAF.duree = GApplication.parametresUtilisateur.get("CDT.TAF.Duree");
      lNewTAF.PourLe = lTAFModele.PourLe || aParams.dateTAF;
      lNewTAF.avecMiseEnForme = true;
      lNewTAF.listeEleves = new ObjetListeElements_1.ObjetListeElements();
      lNewTAF.estPourTous = true;
      lNewTAF.estVide = false;
      lNewTAF.ListeThemes = MethodesObjet_1.MethodesObjet.dupliquer(
        lTAFModele.ListeThemes,
      );
      lNewTAF.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
        "Theme.libelleCB.taf",
      );
      lNewTAF.ListePieceJointe = MethodesObjet_1.MethodesObjet.dupliquer(
        lTAFModele.ListePieceJointe,
      );
      if (!lNewTAF.ListePieceJointe) {
        lNewTAF.ListePieceJointe =
          new ObjetListeElements_1.ObjetListeElements();
      }
      lNewTAF.ListePieceJointe.parcourir((aElement) => {
        aElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
      });
      lResult.listeNewTAFs.addElement(lNewTAF);
    }
  }
  aParams.callbackAffectation(lResult);
}
UtilitaireSaisieCDT.affecterProgressionAuCdT = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      avecTAFVisible: true,
      cours: null,
      numeroSemaine: null,
      cdt: null,
      JoursPresenceCours: null,
      dateTAFMin: null,
      dateTAF: null,
      listeCategories: null,
      strPublics: "",
      strMatiere: "",
      callbackAffectation: null,
    },
    aParams,
  );
  return new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
    lParams.instance,
  )
    .lancerRequete({
      ProgressionsDeCours: true,
      Cours: lParams.cours,
      NumeroCycle: lParams.numeroSemaine,
      avecListeCategorieEtDocJoints: false,
    })
    .then((aTabParams) => {
      const lListeProgressions = aTabParams[0];
      if (lListeProgressions && lListeProgressions.count() > 0) {
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_ProgressionAffectationAuCours_1.ObjetFenetre_ProgressionAffectationAuCours,
          {
            pere: lParams.instance,
            evenement: function (aNumeroBouton, aListeElementsCDT) {
              if (aNumeroBouton === 1) {
                const lListeElementsCDT = aListeElementsCDT;
                new ObjetRequeteListeContenuTAFsEtContenus(
                  lParams.instance,
                  _surReponseListeContenuTAFsEtContenus.bind(
                    null,
                    aParams,
                    lListeElementsCDT,
                  ),
                ).lancerRequete(lListeElementsCDT);
              }
            },
            initialiser: function (aInstance) {
              aInstance.setOptionsFenetre({
                titre: "",
                largeur: 500,
                hauteur: 480,
                listeBoutons: [
                  ObjetTraduction_1.GTraductions.getValeur("Annuler"),
                  ObjetTraduction_1.GTraductions.getValeur("Valider"),
                ],
              });
            },
          },
        ).setDonnees({
          listeProgressions: lListeProgressions,
          strPublics: lParams.strPublics,
          strMatiere: lParams.strMatiere,
          avecTAFVisible: lParams.avecTAFVisible,
          JoursPresenceCours: lParams.JoursPresenceCours,
          dateTAFMin: lParams.dateTAFMin,
          dateTAF: lParams.dateTAF,
        });
      } else if (
        lListeProgressions &&
        lListeProgressions.messageAucuneProgression
      ) {
        return GApplication.getMessage().afficher({
          message: lListeProgressions.messageAucuneProgression,
        });
      }
    });
};
UtilitaireSaisieCDT.poursuivreProgression = function (aParams) {
  const lParams = Object.assign(
    {
      instance: null,
      listeCDTsPrecedents: null,
      elementAvecProgression: null,
      cdt: null,
      dateTAF: null,
      listeCategories: null,
      callbackAffectation: null,
    },
    aParams,
  );
  let lElement = lParams.elementAvecProgression;
  if (!lElement && lParams.listeCDTsPrecedents) {
    lElement = _getElementProgressionCDTPrecedent(lParams.listeCDTsPrecedents);
  }
  if (lElement) {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    lListe.addElement(lElement);
    new ObjetRequeteListeContenuTAFsEtContenus(
      lParams.instance,
      _surReponseListeContenuTAFsEtContenus.bind(this, aParams, null),
    ).lancerRequete(lListe);
  }
};
UtilitaireSaisieCDT.getCopieContenuCoursPrecedent = function (
  alisteCDTsPrecedents,
) {
  const lContenuPrecedent =
    _getContenuPrecedentPourAffectation(alisteCDTsPrecedents);
  let lNewContenu = null;
  if (lContenuPrecedent) {
    lNewContenu = new ObjetElement_1.ObjetElement(
      lContenuPrecedent.getLibelle(),
    );
    lNewContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    lNewContenu.descriptif = lContenuPrecedent.descriptif;
    lNewContenu.estVide = false;
    lNewContenu.categorie = lContenuPrecedent.categorie
      ? MethodesObjet_1.MethodesObjet.dupliquer(lContenuPrecedent.categorie)
      : new ObjetElement_1.ObjetElement();
    lNewContenu.ListeThemes = lContenuPrecedent.ListeThemes;
    lNewContenu.libelleCBTheme = lContenuPrecedent.libelleCBTheme;
    lNewContenu.ListePieceJointe =
      new ObjetListeElements_1.ObjetListeElements();
  }
  return lNewContenu;
};
UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ =
  function (aRessourceKiosque, aListePJ) {
    const lIndexExists = aListePJ.getIndiceElementParFiltre((aElement) => {
      let lLibellesIdem, lNomKiosqueIdem, lUrlRessourceIdem, lUAIIdem;
      if (
        aElement.getGenre() ===
          Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque &&
        !!aElement.SSO
      ) {
        lLibellesIdem =
          aElement.getLibelle() === aRessourceKiosque.getLibelle();
        lNomKiosqueIdem =
          aElement.SSO.nomKiosque === aRessourceKiosque.SSO.nomKiosque;
        lUrlRessourceIdem =
          aElement.SSO.urlRessource === aRessourceKiosque.SSO.urlRessource;
        lUAIIdem = aElement.SSO.UAI === aRessourceKiosque.SSO.UAI;
      }
      return lLibellesIdem && lNomKiosqueIdem && lUrlRessourceIdem && lUAIIdem;
    });
    return lIndexExists > -1;
  };
UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes = function (
  aParametres = {},
) {
  var _a;
  const lAvecSaisiePieceJointe = GApplication.droits.get(
    ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
  );
  const lTabActions = [];
  if (aParametres.avecGestionAppareilPhoto === true) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.prendrePhoto",
      ),
      icon: "icon_camera",
      event: function (aParams) {
        if (aParametres.clbckPrendrePhoto) {
          aParametres.clbckPrendrePhoto(aParams);
        }
      },
      optionsSelecFile: {
        title: "",
        maxFiles: 0,
        maxSize: aParametres.maxSizeNouvellePJ,
        genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
        acceptDragDrop: false,
        capture: "environment",
        accept: "image/*",
      },
      selecFile: true,
      class: "bg-util-marron-claire",
    });
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.ouvrirGalerie",
      ),
      icon: "icon_picture",
      event: function (aParams) {
        if (aParametres.clbckOuvrirGalerie) {
          aParametres.clbckOuvrirGalerie(aParams);
        }
      },
      optionsSelecFile: {
        title: "",
        maxFiles: 0,
        maxSize: aParametres.maxSizeNouvellePJ,
        genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
        multiple: true,
        acceptDragDrop: false,
        accept: "image/*",
      },
      selecFile: true,
      class: "bg-util-marron-claire",
    });
  }
  if (lAvecSaisiePieceJointe) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.FichierParmiUtilises",
      ),
      icon: "icon_file_alt",
      event() {
        if (aParametres.callbackChoixParmiFichiersExistants) {
          aParametres.callbackChoixParmiFichiersExistants();
        }
      },
      class: "bg-util-vert-claire",
    });
  }
  if (lAvecSaisiePieceJointe && aParametres.callbackChoixParmiLiensExistants) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.LienParmiUtilises",
      ),
      icon: "icon_globe",
      event() {
        aParametres.callbackChoixParmiLiensExistants();
      },
      class: "bg-util-vert-claire",
    });
  }
  if (aParametres.callbackAjoutQCM) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.QCMDeRevision",
      ),
      icon: "icon_qcm",
      event() {
        aParametres.callbackAjoutQCM();
      },
      class: "bg-util-vert-claire",
    });
  }
  if (lAvecSaisiePieceJointe && aParametres.callbackUploadNouvellePJ) {
    lTabActions.push({
      libelle: IE.estMobile
        ? ObjetTraduction_1.GTraductions.getValeur(
            "CahierDeTexte.piecesJointes.FichierDepuisDocument",
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "CahierDeTexte.piecesJointes.FichierDepuisDisque",
          ),
      icon: "icon_folder_open",
      selecFile: true,
      optionsSelecFile: {
        maxSize: aParametres.maxSizeNouvellePJ,
        multiple: aParametres.avecUploadMultiple,
        avecTransformationFlux_versCloud:
          !!aParametres.callbackChoixDepuisCloud,
      },
      event(aParamsInput) {
        if (aParamsInput) {
          aParametres.callbackUploadNouvellePJ(aParamsInput);
        }
      },
      class: "bg-util-marron-claire",
    });
  }
  if (lAvecSaisiePieceJointe && aParametres.callbackChoixDepuisCloud) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.FichierDepuisCloud",
      ),
      icon: "icon_cloud",
      event() {
        aParametres.callbackChoixDepuisCloud();
      },
      class: "bg-util-marron-claire",
    });
  }
  if (lAvecSaisiePieceJointe && aParametres.callbackAjoutLienKiosque) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.DepuisManuelNumerique",
      ),
      icon: "icon_exercice_numerique",
      event() {
        aParametres.callbackAjoutLienKiosque();
      },
      class: "bg-util-marron-claire",
    });
  }
  if (lAvecSaisiePieceJointe && aParametres.callbackNouvelleURL) {
    lTabActions.push({
      libelle: ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.piecesJointes.LienNouveau",
      ),
      icon: "icon_globe mix-icon_plus",
      event() {
        const lFenetreEditionSiteWeb =
          ObjetFenetre_EditionUrl_1.ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl(
            {
              pere: aParametres.instance,
              evenement(aGenreBouton, aDonnees) {
                if (aGenreBouton === 1) {
                  const lLibelle = aDonnees.donnee.libelle || "";
                  const lNouvelleUrl = new ObjetElement_1.ObjetElement(
                    lLibelle,
                    0,
                    Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
                  );
                  lNouvelleUrl.url = aDonnees.donnee.url;
                  lNouvelleUrl.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
                  aParametres.callbackNouvelleURL(lNouvelleUrl);
                }
              },
            },
          );
        lFenetreEditionSiteWeb.setOptionsFenetreEditionUrl({
          avecCommentaire: false,
        });
        lFenetreEditionSiteWeb.setDonnees({ libelle: "", url: "http://" });
      },
      class: "bg-util-bleu-claire",
    });
  }
  if (lTabActions.length > 0) {
    const lParams = {};
    lParams.optionsFenetre = { idPositionnement: aParametres.id };
    lParams.pere =
      (_a = aParametres.instance) !== null && _a !== void 0 ? _a : {};
    ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
      lTabActions,
      lParams,
    );
  }
};

const { MethodesTableau } = require("MethodesTableau.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GHtml } = require("ObjetHtml.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenreTravailAFaire } = require("TypeGenreTravailAFaire.js");
const { TypeChaineHtml } = require("TypeChaineHtml.js");
const { Requetes } = require("CollectionRequetes.js");
const { SerialiserQCM_PN } = require("SerialiserQCM_PN.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const {
  TypeGenreRenduTAF,
  TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const {
  EGenreActivite_Tvx,
  EGenreActivite_Tvx_Util,
} = require("Enumere_Activites_Tvx.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { tag } = require("tag.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const DonneesListe_SelectClassesMN = require("DonneesListe_SelectClassesMN.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  DonneesListe_SelectElevesTAF_Prim,
} = require("DonneesListe_SelectElevesTAF_Prim.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe.js");
const {
  ObjetFenetre_ParamExecutionQCM,
} = require("ObjetFenetre_ParamExecutionQCM.js");
const EGenreEvntMenuCtxActiviteTAFPP = {
  creerActivite: 1,
  editerActivite: 2,
  supprimerActivite: 3,
  creerRappel: 4,
  editerRappel: 5,
  supprimerRappel: 6,
};
function UtilitaireActiviteTAFPP() {}
UtilitaireActiviteTAFPP.getListeElevesPourRessources = function (
  aListeEleves,
  aArrayClasses,
  aTousLesElevesPotentiel,
) {
  return _getListeElevesPourRessources(
    aListeEleves,
    aArrayClasses,
    aTousLesElevesPotentiel,
  );
};
function _getListeElevesPourRessources(
  aListeEleves,
  aArrayClasses,
  aTousLesElevesPotentiel,
) {
  const lResult = new ObjetListeElements();
  for (let iEleve = 0; iEleve < aListeEleves.count(); iEleve++) {
    const lEleve = aListeEleves.get(iEleve);
    const lEstConcerne = aArrayClasses.includes(lEleve.classe.getNumero());
    if (lEleve && lEleve.classe && (lEstConcerne || aTousLesElevesPotentiel)) {
      const lNewElement = new ObjetElement(
        lEleve.getLibelle(),
        lEleve.getNumero(),
        lEleve.getGenre(),
      );
      lNewElement.classe = lEleve.classe;
      lNewElement.estConcerne = lEstConcerne;
      lResult.addElement(lNewElement);
    }
  }
  return lResult;
}
UtilitaireActiviteTAFPP.recupererElementsElevesSelectionnesPourChips =
  function (aActivite, aListeEleves) {
    let lResult = new ObjetListeElements();
    const lNombreTotal = aActivite.eleves.count();
    const lNombreMax = 5;
    let iCount = 0;
    let iNbrChipsEleves = 0;
    const lArrNrClassesFait = [];
    let iEleve, lEleve, lEleveDeListe;
    const lListeElementAAfficher = new ObjetListeElements();
    for (iEleve = 0; iEleve < lNombreTotal; iEleve++) {
      if (iCount < lNombreMax) {
        lEleve = aActivite.eleves.get(iEleve);
        lEleveDeListe = aListeEleves.getElementParNumeroEtGenre(
          lEleve.getNumero(),
          lEleve.getGenre(),
        );
        if (lEleve.existe()) {
          if (!!lEleveDeListe && !!lEleveDeListe.pere) {
            if (lEleveDeListe.pere.pourTous) {
              if (!lArrNrClassesFait.includes(lEleveDeListe.pere.getNumero())) {
                lListeElementAAfficher.addElement(lEleveDeListe.pere);
                lArrNrClassesFait.push(lEleveDeListe.pere.getNumero());
              }
            } else {
              iNbrChipsEleves++;
            }
          }
        }
      }
    }
    for (iEleve = 0; iEleve < lNombreTotal && iCount < lNombreMax; iEleve++) {
      lEleve = aActivite.eleves.get(iEleve);
      lEleveDeListe = aListeEleves.getElementParNumeroEtGenre(
        lEleve.getNumero(),
        lEleve.getGenre(),
      );
      if (
        lEleve.existe() &&
        !!lEleveDeListe &&
        !!lEleveDeListe.pere &&
        !lEleveDeListe.pere.pourTous
      ) {
        iCount++;
        lListeElementAAfficher.addElement(lEleve);
      }
    }
    if (iNbrChipsEleves > lNombreMax) {
      const lElement = new ObjetElement("...");
      lElement.sansSuppression = true;
      lElement.title = GTraductions.getValeur(
        "CahierDeTexte.TAF.xAutresEleves",
        [iNbrChipsEleves - lNombreMax],
      );
      lListeElementAAfficher.addElement(lElement);
    }
    if (
      aActivite.classeMN &&
      aActivite.classeMN.classes &&
      aActivite.classeMN.classes.count() === lArrNrClassesFait.length
    ) {
      lResult.addElement(aActivite.classeMN);
    } else if (
      !!aActivite.classes &&
      aActivite.classes.count() === 1 &&
      aActivite.classes.getGenre(0) === EGenreRessource.Groupe &&
      !!aActivite.classes.get(0).listeComposantes &&
      aActivite.classes.get(0).listeComposantes.count() ===
        lArrNrClassesFait.length
    ) {
      lResult.addElement(aActivite.classes.get(0));
    } else {
      lResult = lListeElementAAfficher;
    }
    return lResult;
  };
UtilitaireActiviteTAFPP.getListeElevePourSelection = function (aActivite) {
  return _getListeElevePourSelection(aActivite);
};
function _getListeElevePourSelection(aActivite) {
  const lResult = new ObjetListeElements();
  if (
    aActivite.elevesPotentiel !== null &&
    aActivite.elevesPotentiel !== undefined
  ) {
    aActivite.elevesPotentiel.setTri([
      ObjetTri.init("classe.Libelle", EGenreTriElement.Croissant),
      ObjetTri.init("Libelle", EGenreTriElement.Croissant),
    ]);
    aActivite.elevesPotentiel.trier();
    let lPere;
    let iEleve, lEleve, lNewEleve;
    for (iEleve = 0; iEleve < aActivite.elevesPotentiel.count(); iEleve++) {
      lEleve = aActivite.elevesPotentiel.get(iEleve);
      lNewEleve = new ObjetElement(
        lEleve.getLibelle(),
        lEleve.getNumero(),
        lEleve.getGenre(),
      );
      if (!lPere || !lPere.egalParNumeroEtGenre(lEleve.classe.getNumero())) {
        lPere = new ObjetElement(
          lEleve.classe.getLibelle(),
          lEleve.classe.getNumero(),
          lEleve.classe.getGenre(),
        );
        lPere.estUnDeploiement = true;
        lPere.estDeploye = true;
        lPere.pourTous = true;
        lResult.addElement(lPere);
      }
      lNewEleve.pere = lPere;
      lNewEleve.cmsActif =
        lEleve.estConcerne &&
        (aActivite.pourTous ||
          !!aActivite.eleves.getElementParNumero(lEleve.getNumero()));
      if (lNewEleve.cmsActif) {
        lPere.cmsActif = true;
      }
      if (lPere.pourTous) {
        lPere.pourTous = lNewEleve.cmsActif;
      }
      lResult.addElement(lNewEleve);
    }
  }
  return lResult;
}
UtilitaireActiviteTAFPP.getClassesMN = function (aParams) {
  let lResult;
  if (
    aParams.ressource &&
    (aParams.ressource.dansRegroupement || aParams.ressource.estClasseMN)
  ) {
    const lListeClasse = GEtatUtilisateur.getListeClasses({
      avecClasse: true,
      avecGroupe: true,
      avecClasseMultiNiveau: true,
      sansClasseDeRegroupement: false,
      uniquementClassePrincipal: false,
      uniquementClasseEnseignee: true,
    });
    for (let i = 0; i < lListeClasse.count() && lResult === undefined; i++) {
      const lClasse = lListeClasse.get(i);
      if (
        lClasse.getGenre() === EGenreRessource.Groupe &&
        lClasse.listeComposantes
      ) {
        const lIndiceRessource =
          lClasse.listeComposantes.getIndiceElementParFiltre((aElement) => {
            return aParams.ressource.getNumero() === aElement.getNumero();
          });
        if (
          lIndiceRessource > -1 ||
          aParams.ressource.getNumero() === lClasse.getNumero()
        ) {
          lResult = new ObjetElement(
            lClasse.getLibelle(),
            lClasse.getNumero(),
            lClasse.getGenre(),
          );
          lResult.classes = new ObjetListeElements();
          for (
            let iClasse = 0;
            iClasse < lClasse.listeComposantes.count();
            iClasse++
          ) {
            const lElement = lClasse.listeComposantes.get(iClasse);
            lResult.classes.addElement(
              new ObjetElement(
                lElement.getLibelle(),
                lElement.getNumero(),
                lElement.getGenre(),
              ),
            );
          }
        }
      }
    }
  }
  return lResult;
};
UtilitaireActiviteTAFPP.creerNouvelleActivite = function (aParams) {
  const lActivite = new ObjetElement("", null, aParams.genre);
  lActivite.consigne = "";
  lActivite.DateDebut = aParams.date;
  lActivite.donneLe = GDate.aujourdhui;
  lActivite.genreBloc = EGenreBloc.Activite_Prim;
  lActivite.pourTous = true;
  lActivite.editable = true;
  lActivite.documents = new ObjetListeElements();
  lActivite.classes = new ObjetListeElements();
  lActivite.classes.addElement(aParams.ressource);
  lActivite.classeMN = UtilitaireActiviteTAFPP.getClassesMN(aParams);
  lActivite.eleves = new ObjetListeElements();
  lActivite.tousElevesDesRessourcesALaDate = new ObjetListeElements();
  lActivite.elevesPotentiel = new ObjetListeElements();
  lActivite.genreRendu = TypeGenreRenduTAF.GRTAF_AucunRendu;
  lActivite.matiere = aParams.matiere;
  if (aParams.QCM) {
    UtilitaireActiviteTAFPP.associerQCMAActivite({
      activite: lActivite,
      eltQCM: aParams.QCM,
    });
  }
  return lActivite;
};
UtilitaireActiviteTAFPP.creerNouveauRappel = function (aParam) {
  const lEvenementRappel = new ObjetElement();
  lEvenementRappel.DateDebut = !!aParam.date
    ? aParam.date
    : GDate.getDateJour();
  lEvenementRappel.description = "";
  lEvenementRappel.titre = "";
  lEvenementRappel.classes = new ObjetListeElements();
  lEvenementRappel.classes.addElement(aParam.ressource);
  lEvenementRappel.classeMN = UtilitaireActiviteTAFPP.getClassesMN(aParam);
  lEvenementRappel.eleves = new ObjetListeElements();
  lEvenementRappel.tousElevesDesRessourcesALaDate = new ObjetListeElements();
  lEvenementRappel.elevesPotentiel = new ObjetListeElements();
  return lEvenementRappel;
};
UtilitaireActiviteTAFPP.initFenetreSelectionQCM = function (aInstance) {
  UtilitaireQCM.initFenetreSelectionQCM(aInstance);
  aInstance.setGenreRessources({
    genreQCM: EGenreRessource.QCM,
    genreNiveau: EGenreRessource.Niveau,
    genreMatiere: EGenreRessource.Matiere,
    genreAucun: EGenreRessource.Aucune,
  });
};
UtilitaireActiviteTAFPP.associerQCMAActivite = function (aParam) {
  let lActivite = aParam.activite;
  let lEltQCM = aParam.eltQCM;
  UtilitaireQCM.surSelectionQCM(lActivite, lEltQCM, {
    genreAucune: EGenreRessource.Aucune,
    genreExecQCM: EGenreRessource.ExecutionQCM,
  });
  const lObjInitDateQCM =
    UtilitaireActiviteTAFPP.initHeureDebutEtFin(lActivite);
  $.extend(lActivite.executionQCM, {
    estLieADevoir: false,
    estLieAEvaluation: false,
    estUnTAF: true,
    estUneActivite:
      lActivite.getGenre() === TypeGenreTravailAFaire.tGTAF_Activite,
    dateDebutPublication: lObjInitDateQCM.dateDebut,
    dateFinPublication: lObjInitDateQCM.dateFin,
  });
  UtilitaireQCM.verifierDateCorrection(lActivite.executionQCM);
};
UtilitaireActiviteTAFPP.initHeureDebutEtFin = function (aActivite) {
  const lObjInitDateQCM = UtilitaireQCM.initHeureDebutEtFin(
    aActivite.DateDebut,
  );
  const lDateDebutPub = aActivite.donneLe
    ? new Date(
        aActivite.donneLe.getFullYear(),
        aActivite.donneLe.getMonth(),
        aActivite.donneLe.getDate(),
        0,
        0,
      )
    : lObjInitDateQCM.dateDebut;
  const lDateFinPub = aActivite.DateDebut
    ? new Date(
        aActivite.DateDebut.getFullYear(),
        aActivite.DateDebut.getMonth(),
        aActivite.DateDebut.getDate(),
        23,
        59,
      )
    : lObjInitDateQCM.dateFin;
  return { dateDebut: lDateDebutPub, dateFin: lDateFinPub };
};
UtilitaireActiviteTAFPP.requeteSaisieRappel = function (aArticle, aParam) {
  if (aArticle.classes) {
    aArticle.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
  }
  if (aArticle.eleves) {
    aArticle.eleves.setSerialisateurJSON({ ignorerEtatsElements: true });
  }
  const lJSON = aArticle.toJSONAll();
  return Requetes("SaisieEvenementRappel", this)
    .lancerRequete({ evenementRappel: lJSON })
    .catch(() => {
      IE.log.addLog("Erreur saisie EvenementRappel");
    })
    .then(() => {
      this.setEtatSaisie(false);
      if (aParam.callback) {
        aParam.callback.call(this, aParam.donneesCallback);
      }
    });
};
UtilitaireActiviteTAFPP.requeteSaisie = function (aActivite, aParam) {
  if (aActivite.documents) {
    aActivite.documents.setSerialisateurJSON({
      methodeSerialisation: _surValidation_Fichier.bind(
        this,
        aParam.listeDocuments,
      ),
    });
  }
  if (aActivite.classes) {
    aActivite.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
  }
  if (aActivite.eleves) {
    aActivite.eleves.setSerialisateurJSON({ ignorerEtatsElements: true });
  }
  aActivite.consigne = new TypeChaineHtml(aActivite.consigne);
  const lJSON = aActivite.toJSONAll();
  if (aActivite.executionQCM && aActivite.executionQCM.pourValidation()) {
    lJSON.executionQCM = aActivite.executionQCM.toJSON();
    new SerialiserQCM_PN().executionQCM(
      aActivite.executionQCM,
      lJSON.executionQCM,
    );
  }
  const lOjbJSON = { activite: lJSON };
  if (aParam.listeDocuments) {
    lOjbJSON.ListeFichiers = aParam.listeDocuments.setSerialisateurJSON({
      methodeSerialisation: _surValidation_Fichier.bind(this, null),
    });
  }
  return Requetes("SaisieTAF", this)
    .addUpload({
      listeFichiers: aParam.listeFichiersCrees || new ObjetListeElements(),
      listeDJCloud: aParam.listeDocuments || new ObjetListeElements(),
    })
    .lancerRequete(lOjbJSON)
    .catch(() => {
      IE.log.addLog("Erreur saisie Activité");
    })
    .then(() => {
      this.setEtatSaisie(false);
      if (aParam.callback) {
        aParam.callback.call(this, aParam.donneesCallback);
      }
    });
};
function _surValidation_Fichier(aListeDocuments, aElement, aJSON) {
  let lElement;
  if (aListeDocuments) {
    lElement = aListeDocuments.getElementParNumero(aElement.getNumero());
  }
  if (aElement.Fichier) {
    aJSON.IDFichier = GChaine.cardinalToStr(aElement.Fichier.idFichier);
  } else if (lElement && lElement.Fichier) {
    aJSON.IDFichier = GChaine.cardinalToStr(lElement.Fichier.idFichier);
  } else if (aElement.idFichier) {
    aJSON.IDFichier = GChaine.cardinalToStr(aElement.idFichier);
  }
  if (aElement.url) {
    aJSON.url = aElement.url;
  }
  if (aElement.ressource) {
    aJSON.ressource = aElement.ressource;
  }
}
UtilitaireActiviteTAFPP.getInfosRendus = function (aParam) {
  let lNbEleves = 0;
  let lNbRendusEleve = 0;
  let lStrLienNombreRendus = "";
  const lActivite = aParam.activite;
  if (!!lActivite.eleves) {
    lNbEleves = lActivite.eleves.count();
    lNbRendusEleve = lActivite.eleves
      .getListeElements((aEleve) => {
        return (
          !!aEleve && aEleve.existe() && (aEleve.estRendu || aEleve.TAFFait)
        );
      })
      .count();
    if (
      TypeGenreRenduTAFUtil.estUnRenduEnligne(lActivite.genreRendu, false) &&
      aParam.tenirCompteRenduEnLigne
    ) {
      lStrLienNombreRendus = GTraductions.getValeur(
        "CahierDeTexte.TAF.RenduX/Y",
        [lNbRendusEleve, lNbEleves],
      );
    } else {
      lStrLienNombreRendus = GTraductions.getValeur(
        "CahierDeTexte.TAF.FaitX/Y",
        [lNbRendusEleve, lNbEleves],
      );
    }
    if (lNbEleves > 0) {
      if (aParam.avecLienPourVisuDetail) {
        lStrLienNombreRendus = tag(
          "a",
          {
            class: ["LienAccueil"],
            "ie-node": aParam.strControleVisuDetail,
            "ie-hint": GTraductions.getValeur("FenetreListeTAFFaits.Titre"),
          },
          lStrLienNombreRendus,
        );
      } else if (aParam.avecBtnPourVisuDetail) {
        lStrLienNombreRendus = tag(
          "ie-bouton",
          {
            class: ["themeBoutonNeutre"],
            "ie-model": aParam.strControleVisuDetail,
            title: GTraductions.getValeur("FenetreListeTAFFaits.Titre"),
          },
          lStrLienNombreRendus,
        );
      }
    }
  }
  return {
    nbEleves: lNbEleves,
    nbRendusEleves: lNbRendusEleve,
    strLienNbrRendus: lStrLienNombreRendus,
  };
};
UtilitaireActiviteTAFPP.getArrayClasses = function (aActivite) {
  let lArrayClasses = [];
  const lClasse = !!aActivite.classes ? aActivite.classes.get(0) : null;
  if (
    aActivite.classes.count() === 1 &&
    lClasse.getGenre() === EGenreRessource.Groupe
  ) {
    if (!!aActivite.classeMN) {
      lArrayClasses = aActivite.classeMN.classes.getTableauNumeros();
    } else if (!!lClasse && lClasse.listeComposantes) {
      lArrayClasses = lClasse.listeComposantes.getTableauNumeros();
    }
  } else {
    lArrayClasses = aActivite.classes.getTableauNumeros();
  }
  return lArrayClasses;
};
UtilitaireActiviteTAFPP.majElevesPotentiels = function (
  aActivite,
  aArrayClasses,
  aAvecTousElevesPotentiel,
) {
  const lAvecTousElevesPotentiel =
    aAvecTousElevesPotentiel !== null && aAvecTousElevesPotentiel !== undefined
      ? aAvecTousElevesPotentiel
      : aActivite.getGenre() === TypeGenreTravailAFaire.tGTAF_Travail;
  aActivite.elevesPotentiel =
    UtilitaireActiviteTAFPP.getListeElevesPourRessources(
      aActivite.tousElevesDesRessourcesALaDate,
      aArrayClasses,
      lAvecTousElevesPotentiel,
    );
};
UtilitaireActiviteTAFPP.verifierElevesConcernes = function (
  aActivite,
  aArrayClasses,
  aEstCreation,
) {
  if (aArrayClasses === undefined) {
    aArrayClasses = UtilitaireActiviteTAFPP.getArrayClasses(aActivite);
  }
  UtilitaireActiviteTAFPP.majElevesPotentiels(aActivite, aArrayClasses);
  if (
    (aEstCreation ||
      aActivite.getEtat() === EGenreEtat.Creation ||
      aActivite.getEtat() === EGenreEtat.Modification) &&
    (aActivite.getGenre() === TypeGenreTravailAFaire.tGTAF_Activite ||
      !aActivite.eleves)
  ) {
    aActivite.eleves = UtilitaireActiviteTAFPP.getListeElevesPourRessources(
      aActivite.tousElevesDesRessourcesALaDate,
      aArrayClasses,
    );
  }
};
UtilitaireActiviteTAFPP.miseAJourInfosEleves = function (
  aActivite,
  aTousLesElevesPotentiel,
  aAvecTousElevesPotentiels,
) {
  aActivite.tousElevesDesRessourcesALaDate = aTousLesElevesPotentiel;
  let lArrayClasses = UtilitaireActiviteTAFPP.getArrayClasses(aActivite);
  UtilitaireActiviteTAFPP.majElevesPotentiels(
    aActivite,
    lArrayClasses,
    aAvecTousElevesPotentiels,
  );
  if (!aActivite.eleves || aActivite.eleves.count() === 0) {
    aActivite.eleves = aActivite.elevesPotentiel.getListeElements(
      (aElement) => {
        return aElement.estConcerne;
      },
    );
  }
};
UtilitaireActiviteTAFPP.getListePublicDeData = function (aActivite) {
  let lListePublic;
  if (aActivite.getGenre() === TypeGenreTravailAFaire.tGTAF_Travail) {
    const lListeEleves =
      UtilitaireActiviteTAFPP.getListeElevePourSelection(aActivite);
    lListePublic =
      UtilitaireActiviteTAFPP.recupererElementsElevesSelectionnesPourChips(
        aActivite,
        lListeEleves,
      );
  } else {
    if (aActivite.classeMN) {
      lListePublic = aActivite.classes;
    }
  }
  return lListePublic;
};
UtilitaireActiviteTAFPP.toGenreActiviteTvx = function (aActivite) {
  let lResult = EGenreActivite_Tvx_Util.getConsigneDeGenreTravailAFaire(
    aActivite.getGenre(),
  );
  if (aActivite.executionQCM) {
    lResult = EGenreActivite_Tvx_Util.getQCMDeGenreTravailAFaire(
      aActivite.getGenre(),
    );
  } else if (aActivite.titreKiosque) {
    lResult = EGenreActivite_Tvx_Util.getExerciceDeGenreTravailAFaire(
      aActivite.getGenre(),
    );
  }
  return lResult;
};
UtilitaireActiviteTAFPP.getTitreFenetreActivite = function (
  aGenreActivite,
  aEstCreation,
) {
  const lStrCreerActivite = GTraductions.getValeur(
    "CahierDeTexte.AjouterActiviteEnClasse",
  );
  const lStrModifierActivite = GTraductions.getValeur(
    "CahierDeTexte.ModifierActiviteEnClasse",
  );
  const lStrCreerTAF = GTraductions.getValeur(
    "CahierDeTexte.AjouterTravailALaMaison",
  );
  const lStrModifierTAF = GTraductions.getValeur(
    "CahierDeTexte.ModifierTravailALaMaison",
  );
  const lStrCasConsigne = GTraductions.getValeur(
    "CahierDeTexte.SaisirConsigne",
  );
  const lStrCasQCM = GTraductions.getValeur("CahierDeTexte.enligne.qcm");
  const lStrCasExNum = GTraductions.getValeur(
    "CahierDeTexte.enligne.exerciceNumerique",
  );
  const lResult = [];
  const lEstActivite =
    EGenreActivite_Tvx_Util.toGenreTravailAFaire(aGenreActivite) ===
    TypeGenreTravailAFaire.tGTAF_Activite;
  lResult.push(
    !!aEstCreation
      ? lEstActivite
        ? lStrCreerActivite
        : lStrCreerTAF
      : lEstActivite
        ? lStrModifierActivite
        : lStrModifierTAF,
  );
  if (!!aEstCreation) {
    const lEstUnQCM = EGenreActivite_Tvx_Util.estUnQCM(aGenreActivite);
    const lEstUnExNum =
      EGenreActivite_Tvx_Util.estUnExerciceNumerique(aGenreActivite);
    lResult.push(
      lEstUnQCM ? lStrCasQCM : lEstUnExNum ? lStrCasExNum : lStrCasConsigne,
    );
  }
  return lResult.join(" - ");
};
UtilitaireActiviteTAFPP.initCmdCtxSaisieActivitesTvx = function (aParam) {
  let lMenu = aParam.menuCtx;
  let lClbck = aParam.clbck;
  let lDate = aParam.date;
  let lAvecKiosque = aParam.avecKiosque;
  if (aParam.avecRappels) {
    lMenu.add(
      GTraductions.getValeur("EvenementRappel.TitreFenetre"),
      true,
      lClbck.bind(this, {
        date: lDate,
        cmd: null,
        cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerRappel,
      }),
      { icon: "icon_bell" },
    );
  }
  if (!GDate.estJourCourant(lDate)) {
    let lLibelleTitreTravailCeJour = tag(
      "span",
      { class: ["iconic", "icon_home"] },
      GChaine.insecable(
        GTraductions.getValeur("CahierDeTexte.TravailPourCeJour"),
      ),
    );
    lMenu.addTitre(lLibelleTitreTravailCeJour);
    lMenu.add(
      GTraductions.getValeur("CahierDeTexte.SaisirConsigne"),
      true,
      lClbck.bind(this, {
        date: lDate,
        cmd: EGenreActivite_Tvx.ga_Taf_Consigne,
        cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
      }),
      {},
    );
    lMenu.add(
      GTraductions.getValeur("CahierDeTexte.enligne.qcm"),
      true,
      lClbck.bind(this, {
        date: lDate,
        cmd: EGenreActivite_Tvx.ga_Taf_QCM,
        cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
      }),
      {},
    );
    if (lAvecKiosque) {
      lMenu.add(
        GTraductions.getValeur("CahierDeTexte.enligne.exerciceNumerique"),
        true,
        lClbck.bind(this, {
          date: lDate,
          cmd: EGenreActivite_Tvx.ga_Taf_Exercice,
          cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
        }),
        {},
      );
    }
  }
  let lLibelleTitreActivite = tag(
    "span",
    { class: ["iconic", "icon_ecole"] },
    GChaine.insecable(
      GTraductions.getValeur("CahierDeTexte.ActiviteSurCeJour"),
    ),
  );
  lMenu.addTitre(lLibelleTitreActivite);
  lMenu.add(
    GTraductions.getValeur("CahierDeTexte.SaisirConsigne"),
    true,
    lClbck.bind(this, {
      date: lDate,
      cmd: EGenreActivite_Tvx.ga_Act_Consigne,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
    }),
    {},
  );
  lMenu.add(
    GTraductions.getValeur("CahierDeTexte.enligne.qcm"),
    true,
    lClbck.bind(this, {
      date: lDate,
      cmd: EGenreActivite_Tvx.ga_Act_QCM,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
    }),
    {},
  );
  if (lAvecKiosque) {
    lMenu.add(
      GTraductions.getValeur("CahierDeTexte.enligne.exerciceNumerique"),
      true,
      lClbck.bind(this, {
        date: lDate,
        cmd: EGenreActivite_Tvx.ga_Act_Exercice,
        cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
      }),
      {},
    );
  }
};
UtilitaireActiviteTAFPP.initCmdCtxRappel = function (aParam) {
  let lMenu = aParam.menuCtx;
  let lClbck = aParam.clbck;
  lMenu.add(
    GTraductions.getValeur("Modifier"),
    true,
    lClbck.bind(this, {
      article: aParam.article,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.editerRappel,
    }),
    { icon: "icon_pencil" },
  );
  lMenu.add(
    GTraductions.getValeur("Supprimer"),
    true,
    lClbck.bind(this, {
      article: aParam.article,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.supprimerRappel,
    }),
    { icon: "icon_trash" },
  );
};
UtilitaireActiviteTAFPP.initCmdCtxActiviteTvx = function (aParam) {
  let lMenu = aParam.menuCtx;
  let lClbck = aParam.clbck;
  lMenu.add(
    GTraductions.getValeur("Modifier"),
    true,
    lClbck.bind(this, {
      article: aParam.article,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.editerActivite,
    }),
    { icon: "icon_pencil" },
  );
  lMenu.add(
    GTraductions.getValeur("Supprimer"),
    true,
    lClbck.bind(this, {
      article: aParam.article,
      cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.supprimerActivite,
    }),
    { icon: "icon_trash" },
  );
};
UtilitaireActiviteTAFPP.surCmdSupprimerActivite = function (aParam) {
  let lActivite = aParam.activite;
  let lClbck = aParam.clbck;
  if (lActivite && lActivite.existeNumero()) {
    GApplication.getMessage()
      .afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: GTraductions.getValeur(
          "CahierDeTexte.msgConfirmationSupprimerActivite",
        ),
      })
      .then(function (aGenreAction) {
        if (aGenreAction === EGenreAction.Valider) {
          lClbck.call(this, {});
        }
      });
  }
};
UtilitaireActiviteTAFPP.surCmdSupprimerRappel = function (aParam) {
  let lArticle = aParam.article;
  let lClbck = aParam.clbck;
  if (lArticle && lArticle.existeNumero()) {
    GApplication.getMessage()
      .afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: GTraductions.getValeur(
          "EvenementRappel.msgConfirmationSupprimer",
        ),
      })
      .then(function (aGenreAction) {
        if (aGenreAction === EGenreAction.Valider) {
          lClbck.call(this, {});
        }
      });
  }
};
UtilitaireActiviteTAFPP.surEvntSelectDatePourLe = function (aParam) {
  let lActivite = aParam.activite;
  if (lActivite && !GDate.estDateEgale(lActivite.DateDebut, aParam.date)) {
    if (
      lActivite.getGenre() === TypeGenreTravailAFaire.tGTAF_Travail &&
      GDate.estJourCourant(aParam.date)
    ) {
      GApplication.getMessage()
        .afficher({
          type: EGenreBoiteMessage.Information,
          message: GTraductions.getValeur(
            "CahierDeTexte.msgInformationImpossibleSaisirTAFsurAujourdhui",
          ),
        })
        .then(() => {
          aParam.instanceSelectDate.setDonnees(lActivite.DateDebut);
        });
    } else {
      lActivite.DateDebut = aParam.date;
      if (!!lActivite.executionQCM) {
        const lObjInitDateQCM = this.initHeureDebutEtFin(lActivite);
        lActivite.executionQCM.dateFinPublication = lObjInitDateQCM.dateFin;
        lActivite.executionQCM.setEtat(EGenreEtat.Modification);
        if (
          lActivite.executionQCM.dateDebutPublication >
          lActivite.executionQCM.dateFinPublication
        ) {
          lActivite.executionQCM.dateDebutPublication =
            lObjInitDateQCM.dateDebut;
        }
      }
      lActivite.setEtat(EGenreEtat.Modification);
    }
  }
};
UtilitaireActiviteTAFPP.getListeClassesDActivite = function (aParam) {
  let lListeClasses = new ObjetListeElements();
  let lActivite = aParam.activite;
  let lClasseMN = lActivite.classeMN;
  if (!lClasseMN) {
    return;
  }
  let lClasses = lActivite.classes;
  const lPere = new ObjetElement(
    lClasseMN.getLibelle(),
    lClasseMN.getNumero(),
    lClasseMN.getGenre(),
  );
  lPere.estUnDeploiement = true;
  lPere.estDeploye = true;
  lPere.cmsActif = !!lClasses.getElementParNumero(lPere.getNumero());
  lListeClasses.addElement(lPere);
  for (let iClasse = 0; iClasse < lClasseMN.classes.count(); iClasse++) {
    const lClasse = new ObjetElement(
      lClasseMN.classes.getLibelle(iClasse),
      lClasseMN.classes.getNumero(iClasse),
      lClasseMN.classes.getGenre(iClasse),
    );
    lClasse.pere = lPere;
    lClasse.cmsActif =
      lPere.cmsActif || !!lClasses.getElementParNumero(lClasse.getNumero());
    lListeClasses.addElement(lClasse);
  }
  return lListeClasses;
};
UtilitaireActiviteTAFPP.ouvrirFenetreSelectionClasseGpe = function (aParam) {
  let lListeClasses = UtilitaireActiviteTAFPP.getListeClassesDActivite(aParam);
  let lActivite = aParam.activite;
  const lDonneesListe = new DonneesListe_SelectClassesMN(lListeClasses, {
    avecTri: false,
  });
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
    pere: this,
    evenement: function (aNumeroBouton) {
      if (aNumeroBouton === 1 && lActivite) {
        const lClasses = lListeClasses.getListeElements((aElement) => {
          return !!aElement.cmsActif;
        });
        let lTabClassesSelection;
        const lEstSelectionClasseMN =
          lListeClasses.count() === lClasses.count();
        let lModifierActivite = false;
        if (
          lEstSelectionClasseMN &&
          lActivite.classes.getGenre(0) !== EGenreRessource.Groupe
        ) {
          lActivite.classes = new ObjetListeElements();
          lActivite.classes.addElement(lClasses.get(0));
          lTabClassesSelection = lClasses.getTableauNumeros();
          lModifierActivite = true;
        } else if (!lEstSelectionClasseMN) {
          const lTableauClassesActuelles =
            lActivite.classes.getTableauNumeros();
          lTabClassesSelection = lClasses.getTableauNumeros();
          const lTableauClassesIntersect = MethodesTableau.intersection(
            lTableauClassesActuelles,
            lTabClassesSelection,
          );
          if (
            lTableauClassesActuelles.length !== lTabClassesSelection.length ||
            lTableauClassesActuelles.length !== lTableauClassesIntersect.length
          ) {
            lActivite.classes = lClasses;
            lModifierActivite = true;
          }
        }
        if (lModifierActivite) {
          lActivite.setEtat(EGenreEtat.Modification);
          if (aParam.clbck !== null && aParam.clbck !== undefined) {
            aParam.clbck(lActivite, lTabClassesSelection);
          }
        }
      }
    },
    initialiser: function (aInstance) {
      const lParamsListe = {
        optionsListe: {
          skin: ObjetListe.skin.flatDesign,
          hauteurAdapteContenu: true,
        },
      };
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur(
          "CahierDeTexte.TAF.SelectionClasseGroupe",
        ),
        largeur: 320,
        avecTailleSelonContenu: true,
        heightMax_mobile: false,
        listeBoutons: [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Valider"),
        ],
        modeActivationBtnValider:
          aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
      });
      aInstance.paramsListe = lParamsListe;
    },
  }).setDonnees(lDonneesListe);
};
UtilitaireActiviteTAFPP.ouvrirFenetreSelectionEleves = function (aParam) {
  const lDonneesListe = new DonneesListe_SelectElevesTAF_Prim(
    aParam.listeEleves,
    { avecTri: false },
  );
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
    pere: this,
    evenement: function (aNumeroBouton) {
      if (aNumeroBouton === 1) {
        if (
          aParam.clbckSurValider !== null &&
          aParam.clbckSurValider !== undefined
        ) {
          aParam.clbckSurValider();
        }
      } else {
        if (
          aParam.clbckSurAnnuler !== null &&
          aParam.clbckSurAnnuler !== undefined
        ) {
          aParam.clbckSurAnnuler();
        }
      }
    },
    initialiser: function (aInstance) {
      const lParamsListe = {
        optionsListe: { skin: ObjetListe.skin.flatDesign },
      };
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("CahierDeTexte.TAF.SelectionEleves"),
        largeur: 350,
        hauteur: 500,
        listeBoutons: [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Valider"),
        ],
        modeActivationBtnValider:
          aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
      });
      aInstance.paramsListe = lParamsListe;
    },
  }).setDonnees(lDonneesListe);
};
UtilitaireActiviteTAFPP.miseAJourClassesConcerneesDepuisListeEleves = function (
  aParam,
) {
  let lArticle = aParam.article;
  let lRessourceMN = aParam.ressourceMN;
  let lElevesPotentielDesClasses = lArticle.elevesPotentiel;
  const lClassesConcernees = aParam.listeEleves.getListeElements((aElement) => {
    return (
      !!aElement.estUnDeploiement &&
      !!aElement.cmsActif &&
      (!aParam.tenirComptePourTous || !!aElement.pourTous)
    );
  });
  if (lClassesConcernees && lRessourceMN) {
    const lEstSelectionClasseMN = lRessourceMN.classes
      ? lRessourceMN.classes.count() === lClassesConcernees.count()
      : false;
    if (
      lEstSelectionClasseMN &&
      (lArticle.classes.count() === 0 ||
        lArticle.classes.getGenre(0) !== EGenreRessource.Groupe)
    ) {
      lArticle.classes = new ObjetListeElements();
      const lGroupe = new ObjetElement(
        lRessourceMN.getLibelle(),
        lRessourceMN.getNumero(),
        lRessourceMN.getGenre(),
      );
      lArticle.classes.addElement(lGroupe);
    } else if (!lEstSelectionClasseMN) {
      const lTableauClassesActuelles = lArticle.classes.getTableauNumeros();
      const lTableauClassesSelection = lClassesConcernees.getTableauNumeros();
      const lTableauClassesIntersect = MethodesTableau.intersection(
        lTableauClassesActuelles,
        lTableauClassesSelection,
      );
      if (
        lTableauClassesActuelles.length !== lTableauClassesSelection.length ||
        lTableauClassesActuelles.length !== lTableauClassesIntersect.length
      ) {
        lArticle.classes = lClassesConcernees;
      }
      lElevesPotentielDesClasses =
        UtilitaireActiviteTAFPP.getListeElevesPourRessources(
          lArticle.elevesPotentiel,
          lTableauClassesSelection,
        );
    }
  }
  return lElevesPotentielDesClasses;
};
UtilitaireActiviteTAFPP.miseAJourElevesConcernes = function (aParam) {
  let lArticle = aParam.article;
  const lElevesConcernees = aParam.listeEleves.getListeElements((aElement) => {
    return !!aElement.pere && !!aElement.cmsActif;
  });
  lElevesConcernees.setTri([
    ObjetTri.init("Libelle", EGenreTriElement.Croissant),
  ]);
  lElevesConcernees.trier();
  lArticle.elevesPotentiel.parcourir((aEleve) => {
    aEleve.estConcerne = !!lElevesConcernees.getElementParNumero(
      aEleve.getNumero(),
    );
  });
  const lPourTous =
    aParam.elevesPotentielDesClasses.count() === lElevesConcernees.count();
  lArticle.pourTous = lPourTous;
  lArticle.eleves = lElevesConcernees;
  lArticle.setEtat(EGenreEtat.Modification);
};
UtilitaireActiviteTAFPP.verifierActiviteValide = function (aActivite) {
  let lResult = false;
  if (!!aActivite) {
    lResult =
      !!aActivite.matiere &&
      aActivite.matiere.existeNumero() &&
      (aActivite.consigne !== "" ||
        (!!aActivite.documents &&
          aActivite.documents.getNbrElementsExistes() > 0) ||
        !!aActivite.executionQCM ||
        !!aActivite.ressourceDataLien) &&
      aActivite.getEtat() !== EGenreEtat.Aucun;
  }
  return lResult;
};
UtilitaireActiviteTAFPP.ouvrirModalitesExecQCMDActivite = function (aParam) {
  let lActivite = aParam.activite;
  if (
    !!lActivite &&
    !!lActivite.executionQCM &&
    lActivite.executionQCM.getEtat() === EGenreEtat.Creation
  ) {
    if (!lActivite.pourTous && lActivite.eleves && lActivite.eleves.count()) {
      lActivite.executionQCM.classes = undefined;
      lActivite.executionQCM.listeElevesTAF = lActivite.eleves;
      lActivite.executionQCM.listeElevesTAF.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    } else {
      lActivite.executionQCM.listeElevesTAF = undefined;
      lActivite.executionQCM.classes = lActivite.classes;
      lActivite.executionQCM.classes.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
  }
  UtilitaireActiviteTAFPP.ouvrirFenetreParamExecutionQCM(
    this,
    (aNumeroBouton, aExecutionQCM) => {
      lActivite.executionQCM = aExecutionQCM;
      if (aNumeroBouton > 0) {
        lActivite.executionQCM.setEtat(EGenreEtat.Modification);
        lActivite.setEtat(EGenreEtat.Modification);
      }
      aParam.clbck();
    },
    {
      titre:
        GTraductions.getValeur("CahierDeTexte.ParametresExeQCMTAF") +
        (IE.estMobile
          ? '<span role="doc-noteref" aria-label="' +
            GTraductions.getValeur(
              "FenetreParamExecutionQCM.msgOptionsReduites",
            ) +
            '" > *</span>'
          : ""),
    },
    {
      afficherModeQuestionnaire: false,
      afficherRessentiEleve: false,
      autoriserSansCorrige: false,
      autoriserCorrigerALaDate: true,
      executionQCM: lActivite.executionQCM,
      avecConsigne: true,
      avecPersonnalisationProjetAccompagnement: true,
      avecModeCorrigeALaDate: true,
      avecMultipleExecutions: true,
    },
  );
};
UtilitaireActiviteTAFPP.ouvrirFenetreParamExecutionQCM = function (
  aPere,
  aEvenement,
  aOptionsFenetre,
  aDonnees,
) {
  const lOptionsFenetre = $.extend(
    {
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    },
    aOptionsFenetre,
  );
  if (!IE.estMobile) {
    lOptionsFenetre.largeur = 540;
  }
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_ParamExecutionQCM,
    { pere: aPere, evenement: aEvenement },
    lOptionsFenetre,
  );
  lFenetre.setDonnees($.extend(aDonnees, { afficherEnModeForm: IE.estMobile }));
};
UtilitaireActiviteTAFPP.choisirFichierCloud = function (aParams) {
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
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_FichiersCloud, {
      pere: lParams.instance,
      evenement(aParam) {
        if (aParam.listeNouveauxDocs && aParam.listeNouveauxDocs.count() > 0) {
          lParams.element.documents.add(aParam.listeNouveauxDocs);
          lParams.listeDocumentsJoints.add(aParam.listeNouveauxDocs);
          lParams.element.setEtat(EGenreEtat.Modification);
          aResolve(true);
        }
      },
      initialiser(aFenetre) {
        aFenetre.setOptionsFenetre({
          callbackApresFermer() {
            aResolve();
          },
        });
      },
    }).setDonnees({ service: lParams.numeroService });
  });
};
UtilitaireActiviteTAFPP.ouvrirFenetrePJ = function (aParams) {
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
      maxSize: null,
    },
    aParams,
  );
  let lAvecSaisie = false;
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_PieceJointe, {
    pere: lParams.instance,
    evenement: function (aNumeroBouton, aParamsFenetre) {
      const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
      lParams.listePJTot.parcourir((aDocument) => {
        let lDocumentJoint = lParams.listePJContexte.getElementParNumero(
          aDocument.getNumero(),
        );
        const lActif = aDocument.Actif && aDocument.existe();
        if (lDocumentJoint) {
          const lChangementDoc =
            lDocumentJoint.getLibelle() !== aDocument.getLibelle() ||
            (lParams.genrePJ === EGenreDocumentJoint.Url &&
              lDocumentJoint.url !== aDocument.url);
          if (!lActif) {
            lDocumentJoint.setEtat(EGenreEtat.Suppression);
            lParams.element.setEtat(EGenreEtat.Modification);
            lAvecSaisie = true;
          } else if (lChangementDoc) {
            lDocumentJoint.setLibelle(aDocument.getLibelle());
            lDocumentJoint.setEtat(EGenreEtat.Modification);
            lParams.element.setEtat(EGenreEtat.Modification);
            lAvecSaisie = true;
          }
        } else {
          if (lActif) {
            lDocumentJoint = new ObjetElement(
              aDocument.getLibelle(),
              aDocument.getNumero(),
              aDocument.getGenre(),
            );
            lDocumentJoint.url = aDocument.url;
            lDocumentJoint.setEtat(EGenreEtat.Creation);
            lParams.element.setEtat(EGenreEtat.Modification);
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
          GHtml.setFocus(lParams.nodeFocus, true);
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
  }).afficherFenetrePJ({
    listePJTot: lParams.listePJTot,
    listePJContexte: lParams.listePJContexte,
    genreFenetrePJ: -1,
    genrePJ: lParams.genrePJ,
    genreRessourcePJ: EGenreRessource.DocumentJoint,
    optionsSelecFile: { maxSize: lParams.maxSize },
    avecFiltre: { date: false, classeMatiere: false },
    dateCours: lParams.dateCours,
    modeFlat: lParams.genrePJ === EGenreDocumentJoint.Url,
  });
};
UtilitaireActiviteTAFPP.ouvrirFenetreChoixRessourcePeda = function (aParam) {
  const lAvecCloud = GEtatUtilisateur.avecCloudDisponibles();
  const lAvecGestionAppareilPhoto = GEtatUtilisateur.avecGestionAppareilPhoto();
  const lParamSelectPJ = {
    instance: aParam.instance,
    element: aParam.activite,
    nodeFocus: aParam.nodeFocus,
    listePJTot: aParam.listePJTot,
    listePJContexte: aParam.activite.documents,
    validation: function (aParamsFenetre, aListeFichiers) {
      aParam.listeFichiersCrees.add(aListeFichiers);
    },
    maxSize: aParam.tailleMaxPJ,
  };
  UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes({
    instance: aParam.instance,
    avecGestionAppareilPhoto: lAvecGestionAppareilPhoto,
    clbckPrendrePhoto: lAvecGestionAppareilPhoto
      ? (aParametresInput) => {
          UtilitaireActiviteTAFPP.addFiles(aParametresInput, aParam);
        }
      : null,
    clbckOuvrirGalerie: lAvecGestionAppareilPhoto
      ? (aParametresInput) => {
          UtilitaireActiviteTAFPP.addFiles(aParametresInput, aParam);
        }
      : null,
    callbackChoixParmiFichiersExistants: () => {
      UtilitaireActiviteTAFPP.ouvrirFenetrePJ(
        $.extend(lParamSelectPJ, { genrePJ: EGenreDocumentJoint.Fichier }),
      );
    },
    callbackChoixParmiLiensExistants: () => {
      UtilitaireActiviteTAFPP.ouvrirFenetrePJ(
        $.extend(lParamSelectPJ, { genrePJ: EGenreDocumentJoint.Url }),
      );
    },
    maxSizeNouvellePJ: aParam.tailleMaxPJ,
    avecUploadMultiple: true,
    callbackUploadNouvellePJ: (aParametresInput) => {
      UtilitaireActiviteTAFPP.addFiles(aParametresInput, aParam);
    },
    callbackChoixDepuisCloud: lAvecCloud
      ? () => {
          let lParams = {
            callbaskEvenement: function (aLigne) {
              if (aLigne >= 0) {
                const lService = GEtatUtilisateur.listeCloud.get(aLigne);
                UtilitaireActiviteTAFPP.choisirFichierCloud({
                  instance: aParam.instance,
                  element: aParam.activite,
                  numeroService: lService.getGenre(),
                  listeDocumentsJoints: aParam.listePJTot,
                });
              }
            }.bind(this),
            modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
          };
          UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
        }
      : null,
    callbackAjoutLienKiosque: aParam.callbackAjoutLienKiosque,
    callbackNouvelleURL: (aNouvelleURL) => {
      aParam.activite.documents.addElement(aNouvelleURL);
      aParam.listePJTot.addElement(aNouvelleURL);
      aParam.activite.setEtat(EGenreEtat.Modification);
    },
  });
};
UtilitaireActiviteTAFPP.addFiles = function (aParametresInput, aParamCtx) {
  if (
    aParametresInput &&
    aParametresInput.listeFichiers &&
    aParametresInput.listeFichiers.count() > 0
  ) {
    const lListePJContexte = aParamCtx.activite.documents;
    const lListePJTotal = aParamCtx.listePJTot;
    aParametresInput.listeFichiers.parcourir((aFichier) => {
      const lDocumentJoint = new ObjetElement(
        aFichier.getLibelle(),
        aFichier.getNumero(),
        aFichier.getGenre(),
      );
      lDocumentJoint.url = aFichier.url;
      lDocumentJoint.Fichier = aFichier;
      lDocumentJoint.idFichier = aFichier.idFichier;
      lDocumentJoint.nomOriginal = aFichier.nomOriginal;
      lDocumentJoint.file = aFichier.file;
      lDocumentJoint.setEtat(EGenreEtat.Creation);
      lListePJContexte.addElement(lDocumentJoint);
      lListePJTotal.addElement(lDocumentJoint);
    });
    aParamCtx.activite.setEtat(EGenreEtat.Modification);
    aParamCtx.listeFichiersCrees.add(aParametresInput.listeFichiers);
  }
};
module.exports = { UtilitaireActiviteTAFPP, EGenreEvntMenuCtxActiviteTAFPP };

const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const TypeLigneDetailEvaluationsCompetences = {
  Matiere: 0,
  Evaluation: 1,
  Competence: 2,
};
class ObjetFenetre_DetailEvaluationsCompetences extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idStrDomaine = GUID.getId();
  }
  construireInstances() {
    this.identListeEvaluations = this.add(ObjetListe, _surEvenementListe);
  }
  composeContenu() {
    const T = [];
    T.push('<div class="EspaceBas10 hide" id="', this.idStrDomaine, '"></div>');
    T.push(
      '<div id="',
      this.getNomInstance(this.identListeEvaluations),
      '" style="width: 100%; height: 100%"></div>',
    );
    return T.join("");
  }
  getTitreFenetreParDefaut(aEleve, aElt) {
    const lTitreFenetre = [];
    if (!!aEleve) {
      lTitreFenetre.push(aEleve.getLibelle());
    }
    let lLibelleSuite;
    if (!!aElt.service) {
      lLibelleSuite = aElt.service.getLibelle
        ? aElt.service.getLibelle()
        : aElt.service;
    } else {
      lLibelleSuite = aElt.getLibelle();
    }
    if (lLibelleSuite) {
      lTitreFenetre.push(lLibelleSuite);
    }
    return lTitreFenetre.join(" - ");
  }
  setDonnees(aElt, aJSON, aParametres) {
    this.afficher();
    let lTitreFenetre = null;
    if (!!aParametres && !!aParametres.titreFenetre) {
      lTitreFenetre = aParametres.titreFenetre;
    }
    if (!lTitreFenetre) {
      lTitreFenetre = aElt.getLibelle();
    }
    this.setOptionsFenetre({ titre: lTitreFenetre });
    let lLibelleComplementaire;
    if (!!aParametres && aParametres.libelleComplementaire) {
      lLibelleComplementaire = aParametres.libelleComplementaire;
    } else if (
      aElt.getGenre() === TypeLigneDetailEvaluationsCompetences.Competence &&
      !!aElt.strElmtCompetence
    ) {
      lLibelleComplementaire = aElt.strElmtCompetence;
    }
    if (!!lLibelleComplementaire) {
      GHtml.setHtml(this.idStrDomaine.escapeJQ(), lLibelleComplementaire);
      $("#" + this.idStrDomaine.escapeJQ()).removeClass("hide");
      const lHauteurDomaine = $(
        "#" + this.idStrDomaine.escapeJQ(),
      ).outerHeight();
      $("#" + this.getNomInstance(this.identListeEvaluations).escapeJQ()).css(
        "height",
        "calc(100% - " + lHauteurDomaine + "px)",
      );
    } else {
      $("#" + this.idStrDomaine.escapeJQ()).addClass("hide");
      $("#" + this.getNomInstance(this.identListeEvaluations).escapeJQ()).css(
        "height",
        "100%",
      );
    }
    const lListePourAffichage = new ObjetListeElements();
    if (!!aJSON.listeLignes) {
      let lEltPereCourant0;
      let lEltPereCourant1;
      aJSON.listeLignes.parcourir((aLigneJSON) => {
        if (
          aLigneJSON.getGenre() ===
          TypeLigneDetailEvaluationsCompetences.Matiere
        ) {
          lEltPereCourant0 = aLigneJSON;
        } else if (
          aLigneJSON.getGenre() ===
          TypeLigneDetailEvaluationsCompetences.Evaluation
        ) {
          lEltPereCourant1 = aLigneJSON;
          if (!!lEltPereCourant0) {
            aLigneJSON.pere = lEltPereCourant0;
            lEltPereCourant0.estUnDeploiement = true;
            lEltPereCourant0.estDeploye = true;
          }
        } else {
          if (!!lEltPereCourant1) {
            aLigneJSON.pere = lEltPereCourant1;
            lEltPereCourant1.estUnDeploiement = true;
            lEltPereCourant1.estDeploye = true;
          }
        }
        lListePourAffichage.addElement(aLigneJSON);
      });
    }
    const lObjetListe = this.getInstance(this.identListeEvaluations);
    if (!!aParametres && aParametres.affichageListeSimplifiee) {
      _initListeColonnesAffichageSimplifie(lObjetListe);
    } else {
      _initListeColonnesDefault(lObjetListe, aJSON.titreColonneEvaluation);
    }
    lObjetListe.setDonnees(
      new DonneesListe_DetailEvaluationsCompetences(lListePourAffichage, {
        callbackRemplirMenuContextuel: _remplirMenuContextuelListe.bind(this),
      }),
    );
  }
  surValidation(aNumeroBouton) {
    const lListeElementsModifies = new ObjetListeElements();
    const lListeElementsComp = this.getInstance(
      this.identListeEvaluations,
    ).getListeArticles();
    if (!!lListeElementsComp) {
      lListeElementsComp.parcourir((D) => {
        if (!!D && D.getEtat() !== EGenreEtat.Aucun) {
          lListeElementsModifies.addElement(D);
        }
      });
    }
    this.fermer();
    if (!!lListeElementsModifies && lListeElementsModifies.count() > 0) {
      this.callback.appel(aNumeroBouton, lListeElementsModifies);
    }
  }
}
function _initListeColonnesDefault(aInstance, aTitreColonneEvaluation) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation,
    titre: aTitreColonneEvaluation,
    taille: "100%",
  });
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient,
    titre: GTraductions.getValeur("competences.colonne.coef"),
    taille: 50,
  });
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu,
    titre: GTraductions.getValeur("competences.niveau"),
    taille: 50,
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
  });
}
function _initListeColonnesAffichageSimplifie(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.dateEvaluation,
    titre: "",
    taille: 70,
  });
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation,
    titre: "",
    taille: "100%",
  });
  lColonnes.push({
    id: DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu,
    titre: "",
    taille: 50,
  });
  aInstance.setOptionsListe({ colonnes: lColonnes });
}
function _surEvenementListe(aParametres, aGenreEvenement) {
  switch (aGenreEvenement) {
    case EGenreEvenementListe.Edition:
      if (
        aParametres.idColonne ===
        DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu
      ) {
        aParametres.ouvrirMenuContextuel();
      }
      break;
  }
}
function _remplirMenuContextuelListe(aParametres) {
  const lAvecDispense = true;
  TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
    instance: this,
    menuContextuel: aParametres.menuContextuel,
    genreChoixValidationCompetence:
      TypeGenreValidationCompetence.tGVC_Competence,
    callbackNiveau: _surSelectionNiveauAcquisition.bind(
      this,
      aParametres.article,
    ),
    avecDispense: lAvecDispense,
  });
}
function _surSelectionNiveauAcquisition(aArticle, aNiveau) {
  if (!!aArticle) {
    aArticle.niveauAcqu = aNiveau;
    aArticle.setEtat(EGenreEtat.Modification);
    this.getInstance(this.identListeEvaluations).actualiser(true, true);
  }
}
class DonneesListe_DetailEvaluationsCompetences extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.param = Object.assign(
      { callbackRemplirMenuContextuel: null },
      aParams,
    );
    this.setOptions({
      avecSelection: false,
      avecSuppression: false,
      avecDeploiement: true,
      avecTri: false,
    });
  }
  getCouleurCellule(aParams) {
    if (!!aParams.article && aParams.article.estUnDeploiement) {
      return ObjetDonneesListe.ECouleurCellule.Deploiement;
    }
  }
  avecImageSurColonneDeploiement(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation
    );
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu:
        return !!aParams.article.estEditable;
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    return this.avecEdition(aParams);
  }
  avecMenuContextuel() {
    return false;
  }
  remplirMenuContextuel(aParametres) {
    this.param.callbackRemplirMenuContextuel(aParametres);
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_DetailEvaluationsCompetences.genreColonne
        .dateEvaluation:
        return !!aParams.article.dateEvaluation
          ? GDate.formatDate(aParams.article.dateEvaluation, "%JJ/%MM/%AAAA")
          : "";
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation:
        return aParams.article.getLibelle();
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
        return aParams.article.strCoef ? aParams.article.strCoef : "";
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu: {
        const lHtmlNivAcquisition = [];
        if (
          aParams.article.getGenre() ===
            TypeLigneDetailEvaluationsCompetences.Competence &&
          !!aParams.article.niveauAcqu
        ) {
          const lNiveauAcqui = aParams.article.niveauAcqu;
          const lNiveauAcquiGlobal =
            GParametres.listeNiveauxDAcquisitions.getElementParGenre(
              aParams.article.niveauAcqu.getGenre(),
            );
          lHtmlNivAcquisition.push(
            EGenreNiveauDAcquisitionUtil.getImage(lNiveauAcquiGlobal, {
              avecTitle: false,
            }),
          );
          if (!!lNiveauAcqui.observation) {
            lHtmlNivAcquisition.push(
              '<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment"></i>',
            );
          }
        }
        return lHtmlNivAcquisition.join("");
      }
    }
    return "";
  }
  getHintHtmlForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
        return !!aParams.article ? aParams.article.hintCoef : "";
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu: {
        const lHintNiveauAcqui = [];
        if (
          aParams.article.getGenre() ===
            TypeLigneDetailEvaluationsCompetences.Competence &&
          !!aParams.article.niveauAcqu
        ) {
          const lNiveauAcqui = aParams.article.niveauAcqu;
          const lNiveauDAcquisitionGlobal =
            GParametres.listeNiveauxDAcquisitions.getElementParNumero(
              lNiveauAcqui.getNumero(),
            );
          if (!!lNiveauDAcquisitionGlobal) {
            lHintNiveauAcqui.push(
              EGenreNiveauDAcquisitionUtil.getLibelle(
                lNiveauDAcquisitionGlobal,
              ),
            );
          }
          if (!!lNiveauAcqui.observation) {
            const lObs = lNiveauAcqui.observation.replace(/\n/g, "<br/>");
            if (lHintNiveauAcqui.length > 0) {
              lHintNiveauAcqui.push("<br />");
            }
            lHintNiveauAcqui.push(lObs);
            if (!!lNiveauAcqui.observationPubliee) {
              lHintNiveauAcqui.push(
                " (",
                GTraductions.getValeur("competences.PublieSurEspaceParent"),
                ")",
              );
            }
          }
        }
        return lHintNiveauAcqui.join("");
      }
    }
    return "";
  }
  getClass(aParams) {
    const lClasses = [];
    if (!!aParams.article && aParams.article.estUnDeploiement) {
      lClasses.push("Gras");
      lClasses.push("AvecMain");
    }
    switch (aParams.idColonne) {
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation:
        if (aParams.article && aParams.article.estHistorique) {
          lClasses.push("Italique");
        }
        break;
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
        lClasses.push("AlignementDroit");
        break;
      case DonneesListe_DetailEvaluationsCompetences.genreColonne
        .dateEvaluation:
      case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join(" ");
  }
  getTypeValeur(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu
    ) {
      return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
}
DonneesListe_DetailEvaluationsCompetences.genreColonne = {
  dateEvaluation: "DetailEvalComp_dateEvaluation",
  evaluation: "DetailEvalComp_evaluation",
  coefficient: "DetailEvalComp_coefficient",
  niveauAcqu: "DetailEvalComp_niveau",
};
module.exports = { ObjetFenetre_DetailEvaluationsCompetences };

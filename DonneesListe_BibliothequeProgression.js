exports.DonneesListe_BibliothequeProgression = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_BibliothequeProgression extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aParams) {
    super(_construireListe(aParams.donnees));
    this.params = $.extend(
      { donnees: null, callbackMenuContextuel: null },
      aParams,
    );
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecDeploiement: true,
      avecImageSurColonneDeploiement: true,
      avecEvnt_Selection: true,
    });
  }
  getTypeValeur() {
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
  }
  getIndentationCellule(aParams) {
    return this.getIndentationCelluleSelonParente(aParams);
  }
  getValeur(aParams) {
    const H = [];
    switch (aParams.idColonne) {
      case DonneesListe_BibliothequeProgression.colonnes.libelle: {
        if (aParams.article.estUnDeploiement) {
          H.push(
            aParams.article.getLibelle(),
            " (",
            aParams.article.nbFils,
            ")",
          );
        } else {
          H.push(aParams.article.strProfs || "");
        }
        break;
      }
    }
    return H.join("");
  }
  getCouleurCellule(aParams) {
    let lCouleurCellule = GCouleur.liste.nonEditable;
    if (aParams.article.estUnDeploiement) {
      lCouleurCellule =
        GCouleur.liste.cumul[_getProfondeur(aParams.article) - 1];
    }
    return lCouleurCellule;
  }
  getClass(aParams) {
    const lClasses = [];
    if (!!aParams.article && !aParams.article.nonPersonnel) {
      lClasses.push("Gras");
    }
    return lClasses.join(" ");
  }
  getHintForce(aParams) {
    const lHint = [];
    if (!aParams.article.estUnDeploiement) {
      const lLibelleMatiere = !!aParams.article.pere
        ? aParams.article.pere.getLibelle()
        : "";
      if (!!lLibelleMatiere) {
        lHint.push("[", lLibelleMatiere, "] ");
      }
      if (!!aParams.article.strProfs) {
        lHint.push(aParams.article.strProfs);
      }
    }
    return lHint.join("");
  }
  avecMenuContextuel(aParams) {
    return aParams.article && !aParams.article.estUnDeploiement;
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (!aParametres.article.estUnDeploiement) {
      aParametres.menuContextuel.addCommande(
        0,
        ObjetTraduction_1.GTraductions.getValeur(
          "progression.CopierLaProgressionVers",
        ),
      );
      aParametres.menuContextuel.setDonnees();
    }
  }
  evenementMenuContextuel(aParametres) {
    this.params.callbackMenuContextuel(
      aParametres.numeroMenu,
      aParametres.article,
    );
    return;
  }
  getTri() {
    return [
      ObjetTri_1.ObjetTri.init((D) => {
        return D.estNiveau
          ? D.getLibelle()
          : D.estMatiere
            ? D.pere.getLibelle()
            : D.pere.pere.getLibelle();
      }),
      ObjetTri_1.ObjetTri.init((D) => {
        return D.estNiveau
          ? ""
          : D.estMatiere
            ? D.getLibelle()
            : D.pere.getLibelle();
      }),
      ObjetTri_1.ObjetTri.init((D) => {
        return !D.estUnDeploiement ? D.strProfs : "";
      }),
    ];
  }
}
exports.DonneesListe_BibliothequeProgression =
  DonneesListe_BibliothequeProgression;
(function (DonneesListe_BibliothequeProgression) {
  let colonnes;
  (function (colonnes) {
    colonnes["libelle"] = "DL_BibliothequeProgression_libelle";
  })(
    (colonnes =
      DonneesListe_BibliothequeProgression.colonnes ||
      (DonneesListe_BibliothequeProgression.colonnes = {})),
  );
})(
  DonneesListe_BibliothequeProgression ||
    (exports.DonneesListe_BibliothequeProgression =
      DonneesListe_BibliothequeProgression =
        {}),
);
function _getProfondeur(D) {
  return D.estNiveau ? 1 : D.estMatiere ? 2 : 3;
}
function _construireListe(aDonnees) {
  const lListe = new ObjetListeElements_1.ObjetListeElements(),
    lHashNiveaux = {};
  let lLigne;
  if (aDonnees) {
    aDonnees.parcourir((aProgression) => {
      if (!aProgression.estPublic) {
        return;
      }
      if (aProgression.estVide) {
        return;
      }
      if (!lHashNiveaux[aProgression.niveau.getNumero()]) {
        lLigne = MethodesObjet_1.MethodesObjet.dupliquer(aProgression.niveau);
        lListe.addElement(lLigne);
        lLigne.estDeploye = true;
        lLigne.estUnDeploiement = true;
        lLigne.estNiveau = true;
        lLigne.nbFils = 0;
        lLigne.hashMatieres = {};
        lHashNiveaux[aProgression.niveau.getNumero()] = lLigne;
      }
      const lNiveau = lHashNiveaux[aProgression.niveau.getNumero()];
      if (!lNiveau.hashMatieres[aProgression.matiere.getNumero()]) {
        lLigne = MethodesObjet_1.MethodesObjet.dupliquer(aProgression.matiere);
        lListe.addElement(lLigne);
        lLigne.estDeploye = true;
        lLigne.estMatiere = true;
        lLigne.estUnDeploiement = true;
        lLigne.pere = lNiveau;
        lLigne.nbFils = 0;
        lLigne.pere.nbFils += 1;
        lLigne.hashMatieres = {};
        lNiveau.hashMatieres[aProgression.matiere.getNumero()] = lLigne;
      }
      lLigne = MethodesObjet_1.MethodesObjet.dupliquer(aProgression);
      lListe.addElement(lLigne);
      lLigne.source = aProgression;
      lLigne.pere = lNiveau.hashMatieres[aProgression.matiere.getNumero()];
      lLigne.pere.nbFils += 1;
      if (aProgression.listeCoEnseignants) {
        aProgression.listeCoEnseignants.parcourir((D) => {
          if (D.getNumero() === GEtatUtilisateur.getUtilisateur().getNumero()) {
            D.Position = 0;
          }
        });
        aProgression.listeCoEnseignants.trier();
        lLigne.strProfs = aProgression.listeCoEnseignants
          .getTableauLibelles()
          .join(", ");
      } else {
        lLigne.strProfs = GEtatUtilisateur.getMembre().getLibelle();
      }
    });
  }
  return lListe;
}

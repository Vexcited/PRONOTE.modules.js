const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjectCouleurCellule } = require("_ObjetCouleur.js");
class DonneesListe_AssSaisie_Categorie extends ObjetDonneesListe {
  constructor(aDonnees, aAvecEtatSaisie) {
    super(aDonnees);
    this.creerIndexUnique([
      function (D) {
        return D.estUnDeploiement || !D.pere
          ? D.getLibelle()
          : D.pere.getLibelle();
      },
      function (D) {
        return D.estUnDeploiement || !D.pere ? null : D.getLibelle();
      },
    ]);
    this.setOptions({
      avecDeploiement: true,
      avecImageSurColonneDeploiement: true,
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_ApresCreation: true,
      avecEvnt_Suppression: true,
      avecEvnt_ApresSuppression: true,
      avecEvnt_ApresEdition: true,
      avecEtatSaisie:
        aAvecEtatSaisie !== null && aAvecEtatSaisie !== undefined
          ? aAvecEtatSaisie
          : true,
    });
  }
  getCouleurCellule(aParams) {
    let lCouleurCellule;
    if (aParams.article.estUneCategorie) {
      lCouleurCellule = ObjetDonneesListe.ECouleurCellule.Blanc;
    } else {
      lCouleurCellule = new ObjectCouleurCellule(
        GCouleur.grisFonce,
        GCouleur.noir,
        GCouleur.fenetre.bordure,
      );
    }
    return lCouleurCellule;
  }
  getClass(aParams) {
    const lClasses = [];
    if (
      !!aParams.article &&
      (!aParams.article.estUneCategorie || !aParams.article.Supprimable)
    ) {
      lClasses.push("Gras");
    }
    return lClasses.join(" ");
  }
  avecMenuContextuel() {
    return false;
  }
  surCreation(D, V) {
    D.Libelle = V[0];
    D.Editable = true;
    D.Supprimable = true;
    D.listeAppreciations = new ObjetListeElements();
    D.estUneCategorie = true;
    D.estUnDeploiement = false;
    D.estDeploye = false;
    D.pere = null;
    D.traiterApresCreation = true;
  }
  avecEdition(aParams) {
    return aParams.article.Editable;
  }
  surEdition(aParams, V) {
    aParams.article.Libelle = V;
  }
  suppressionImpossible(D) {
    return !D.Supprimable;
  }
  getMessageSuppressionImpossible() {
    return GTraductions.getValeur("Appreciations.MsgSuppressionCategInterdit");
  }
  getMessageSuppressionConfirmation(D) {
    const lNbrAppreciations = D.listeAppreciations.count();
    const lMsg = [];
    if (lNbrAppreciations > 0) {
      if (lNbrAppreciations === 1) {
        lMsg.push(GTraductions.getValeur("Appreciations.MsgSupprCategAppr"));
        lMsg.push(
          GTraductions.getValeur("Appreciations.MsgSupprCategApprDetail"),
        );
      } else {
        lMsg.push(GTraductions.getValeur("Appreciations.MsgSupprCategXAppr"));
        lMsg.push(
          GTraductions.getValeur("Appreciations.MsgSupprCategXApprDetail", [
            lNbrAppreciations,
          ]),
        );
      }
      lMsg.push(GTraductions.getValeur("Appreciations.MsgConfirmSuppr"));
    } else {
      lMsg.push(GTraductions.getValeur("Appreciations.MsgConfirmSupprDirect"));
    }
    return lMsg.join("\n");
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_AssSaisie_Categorie.colonnes.libelle:
        return aParams.article.getLibelle();
    }
    return "";
  }
  getTri() {
    return [
      ObjetTri.init((D) => {
        return D.pere ? D.pere.getLibelle() : D.getLibelle();
      }),
      ObjetTri.init((D) => {
        return !!D.pere;
      }),
      ObjetTri.init("Libelle"),
    ];
  }
}
DonneesListe_AssSaisie_Categorie.colonnes = {
  libelle: "DL_AssistSaisieCategorie_libelle",
};
module.exports = { DonneesListe_AssSaisie_Categorie };

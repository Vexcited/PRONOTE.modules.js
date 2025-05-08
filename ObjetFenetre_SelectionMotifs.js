const { ObjectCouleurCellule } = require("_ObjetCouleur.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
  ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_SelectionMotifs extends ObjetFenetre_SelectionRessource {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 300,
      hauteur: 400,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.indexBtnValider = 1;
  }
  setDonnees(aParam) {
    this.listeRessourcesSelectionnees = aParam.listeRessourcesSelectionnees;
    this.genreRessource = aParam.genreRessource;
    this.construireListeRessource(
      aParam.listeRessources,
      aParam.listeRessourcesSelectionnees,
    );
    this.setOptionsFenetre({ titre: aParam.titre });
    this.afficher();
    this._actualiserListe();
  }
  _actualiserListe() {
    this.setBoutonActif(
      this.indexBtnValider,
      !this.selectionObligatoire || this._nbRessourcesCochees() > 0,
    );
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SelectionMotifs(this.listeRessources),
    );
  }
  _initialiserListe(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_SelectionMotifs.colonnes.coche,
      titre: this._options.avecCocheRessources ? { estCoche: true } : "",
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_SelectionMotifs.colonnes.couleur,
      titre: "",
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_SelectionMotifs.colonnes.libelle,
      titre: GTraductions.getValeur("Nom"),
      taille: "100%",
    });
    aInstance.setOptionsListe({ colonnes: lColonnes, avecListeNeutre: true });
  }
}
class DonneesListe_SelectionMotifs extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecSuppression: false,
      avecEvnt_ApresEdition: true,
      avecEtatSaisie: false,
    });
  }
  avecEdition(aParams) {
    return aParams.idColonne === DonneesListe_SelectionMotifs.colonnes.coche;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionMotifs.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionMotifs.colonnes.coche:
        return !!aParams.article.selectionne;
      case DonneesListe_SelectionMotifs.colonnes.libelle:
        return aParams.article.getLibelle() || "";
    }
    return "";
  }
  surEdition(aParams, V) {
    aParams.article.selectionne = V;
  }
  getCouleurCellule(aParams) {
    let lCouleurCellule = null;
    switch (aParams.idColonne) {
      case DonneesListe_SelectionMotifs.colonnes.couleur:
        lCouleurCellule = new ObjectCouleurCellule(
          aParams.article.couleur,
          aParams.article.couleur,
          GCouleur.fenetre.bordure,
        );
        break;
    }
    return lCouleurCellule;
  }
  getTri() {
    const lTris = [];
    lTris.push(
      ObjetTri.init((D) => {
        return !D.nonConnu;
      }),
    );
    lTris.push(ObjetTri.init("Libelle"));
    return lTris;
  }
}
DonneesListe_SelectionMotifs.colonnes = {
  coche: "DL_SelectionMotifs_coche",
  couleur: "DL_SelectionMotifs_couleur",
  libelle: "DL_SelectionMotifs_libelle",
};
module.exports = { ObjetFenetre_SelectionMotifs };

const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_RessourcesPedagogiquesProfesseur,
} = require("DonneesListe_RessourcesPedagogiquesProfesseur.js");
class ObjetFenetre_SelectionImportRessourcePedagogique extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      avecTailleSelonContenu: true,
    });
    this.parametres = {};
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          let lDisabled = false;
          if (aBoutonRepeat.element.index === 1) {
            lDisabled =
              _getIdentsDocsSelectionne.call(this.instance).length === 0;
          }
          return lDisabled;
        },
      },
    });
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe, null, _initialiserListe);
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListe) +
        '" style="width: 100%; height: 100%"></div>',
    );
    return T.join("");
  }
  setDonnees(aParametres) {
    $.extend(this.parametres, aParametres);
    const lThis = this;
    if (this.parametres.dureeDeVie) {
      this.parametres.timeoutFermeture = setTimeout(() => {
        lThis.fermer();
      }, this.parametres.dureeDeVie);
    }
    const lAvecDonnees =
      this.parametres.liste && this.parametres.liste.count() > 0;
    this.setOptionsFenetre({ titre: this.parametres.titre });
    this.getInstance(this.identListe).setOptionsListe({
      hauteurAdapteContenu: lAvecDonnees,
    });
    this.afficher();
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SelectionImportRessourcesPedagogiques({
        donnees: this.parametres.liste,
      }),
    );
    this.positionnerFenetre();
  }
  fermer(aParam) {
    clearTimeout(this.parametres.timeoutFermeture);
    super.fermer(aParam);
  }
  surValidation(ANumeroBouton) {
    this.fermer();
    this.callback.appel(
      ANumeroBouton === 1,
      this.parametres,
      ANumeroBouton === 1 ? _getIdentsDocsSelectionne.call(this) : [],
    );
  }
}
function _getIdentsDocsSelectionne() {
  const lIdents = [];
  if (this.parametres.liste) {
    this.parametres.liste.parcourir((D) => {
      if (D.selectionne && D.ressource) {
        lIdents.push(D.ressource.getNumero());
      }
    });
  }
  return lIdents;
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche,
        taille: 16,
        titre: { estCoche: true },
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
        taille: 21,
        titre: "",
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
        taille: 220,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.document"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
        taille: 180,
        titre: GTraductions.getValeur(
          "RessourcePedagogique.colonne.commentaire",
        ),
      },
    ],
    hauteurAdapteContenu: true,
    hauteurMaxAdapteContenu: 400,
  });
  GEtatUtilisateur.setTriListe({
    liste: aInstance,
    tri: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
    identifiant: "fenetre_import",
  });
}
class DonneesListe_SelectionImportRessourcesPedagogiques extends DonneesListe_RessourcesPedagogiquesProfesseur {
  constructor(aParam) {
    const lParams = $.extend(
      {
        donnees: null,
        pourPartage: true,
        afficherCumul: true,
        theme: GCouleur.themeNeutre,
      },
      aParam,
    );
    super(lParams);
    this.param = lParams;
    this.setOptions({ avecSelection: false, avecSuppression: false });
  }
  _ressourceAcceptee() {
    return true;
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
        return !!aParams.article.donnee && !!aParams.article.donnee.ressource;
    }
    return false;
  }
  avecMenuContextuel() {
    return false;
  }
  getClass() {
    return "";
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
        return !!aParams.article.donnee && !!aParams.article.donnee.selectionne;
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
        return aParams.article.donnee.ressource
          ? aParams.article.donnee.ressource.getLibelle()
          : "";
    }
    return super.getValeur(aParams);
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
      default:
        return super.getTypeValeur(aParams);
    }
  }
  fusionCelluleAvecColonnePrecedente(aParams, I) {
    return (
      aParams.article.estUnDeploiement &&
      this.getId(I) !==
        DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche &&
      this.getId(I) !==
        DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type
    );
  }
  surEdition(aParams, V) {
    aParams.article.donnee.setEtat(EGenreEtat.Modification);
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
        aParams.article.donnee.selectionne = !!V;
        break;
      default:
    }
  }
  avecEtatSaisie() {
    return false;
  }
}
module.exports = { ObjetFenetre_SelectionImportRessourcePedagogique };

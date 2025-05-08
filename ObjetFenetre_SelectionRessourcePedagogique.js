const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
  DonneesListe_RessourcesPedagogiquesProfesseur,
} = require("DonneesListe_RessourcesPedagogiquesProfesseur.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetFenetre_SelectionRessourcePedagogique extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur(
        "RessourcePedagogique.RessourcesAffecteesADAutres",
      ),
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      avecTailleSelonContenu: true,
    });
    this.parametres = {
      donnees: null,
      publics: null,
      listeMatieresParRessource: null,
      genreAffiches: null,
      selection: null,
    };
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          return aBoutonRepeat.element.index === 0
            ? false
            : !this.instance.parametres.selection;
        },
      },
    });
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      _evenementSurListe.bind(this),
      _initialiserListe.bind(this),
    );
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
    this.afficher();
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_RessourcesPedagogiquesProfesseur_Selection(
        $.extend(this.parametres, { theme: GCouleur.themeNeutre }),
      ),
    );
    this.positionnerFenetre();
  }
  surValidation(ANumeroBouton) {
    this.fermer();
    this.callback.appel(ANumeroBouton === 1, this.parametres.selection);
  }
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
        taille: 21,
        titre: "",
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
        taille: 300,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.document"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
        taille: 200,
        titre: GTraductions.getValeur(
          "RessourcePedagogique.colonne.commentaire",
        ),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public,
        taille: 80,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.public"),
      },
      {
        id: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date,
        taille: 70,
        titre: GTraductions.getValeur("RessourcePedagogique.colonne.deposeLe"),
      },
    ],
    hauteurMaxAdapteContenu: 400,
    hauteurAdapteContenu: true,
  });
  GEtatUtilisateur.setTriListe({
    liste: aInstance,
    tri: DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
    identifiant: "fenetre_selectionRessourcePeda",
  });
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      this.parametres.selection = aParametres.article.estUnDeploiement
        ? null
        : aParametres.article.donnee;
      break;
  }
}
class DonneesListe_RessourcesPedagogiquesProfesseur_Selection extends DonneesListe_RessourcesPedagogiquesProfesseur {
  constructor(aParam) {
    aParam.listeMatieresAcceptes = null;
    let lElement;
    if (aParam.publics.count() === 1) {
      lElement = aParam.listeMatieresParRessource.getElementParElement(
        aParam.publics.get(0),
      );
      aParam.listeMatieresAcceptes = lElement.listeMatieres;
    } else {
      aParam.publics.parcourir((aElement) => {
        lElement =
          aParam.listeMatieresParRessource.getElementParElement(aElement);
        if (lElement) {
          if (aParam.listeMatieresAcceptes === null) {
            aParam.listeMatieresAcceptes = lElement.listeMatieres;
          } else {
            aParam.listeMatieresAcceptes =
              lElement.listeMatieres.getListeElements((D) => {
                return !!aParam.listeMatieresAcceptes.getElementParElement(D);
              });
          }
        }
      });
    }
    if (!aParam._ressourceAcceptee) {
      aParam._ressourceAcceptee = _ressourceAcceptee;
    }
    super(aParam);
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
  }
  avecEvenementSelection() {
    return this.options.avecEvnt_Selection;
  }
  avecMenuContextuel() {
    return false;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
        return aParams.article.donnee.ressource.getLibelle();
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public:
        return aParams.article.donnee.listePublics
          .getTableauLibelles(null, true, true)
          .join(", ");
    }
    return super.getValeur(aParams);
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getClass() {
    return "";
  }
}
function _ressourceAcceptee(aParams, aRessource) {
  if (!aRessource.editable) {
    return false;
  }
  if (
    !aParams.listeMatieresAcceptes.getElementParNumero(
      aRessource.matiere.getNumero(),
    )
  ) {
    return false;
  }
  if (aRessource.listePublics.count() === 0) {
    return false;
  }
  const lPublicsCourantsTrouves = new ObjetListeElements();
  aRessource.listePublics.parcourir((D) => {
    if (D.existe()) {
      const lElementTrouve = aParams.publics.getElementParElement(D);
      if (lElementTrouve && !lPublicsCourantsTrouves.getElementParElement(D)) {
        lPublicsCourantsTrouves.addElement(D);
      }
    }
  });
  if (lPublicsCourantsTrouves.count() === aParams.publics.count()) {
    return false;
  }
  return true;
}
module.exports = { ObjetFenetre_SelectionRessourcePedagogique };

const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class ObjetFenetre_SelectionServicesDEvaluation extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 250,
      hauteur: 500,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  setDonnees(aListeServices, aAvecMultiSelection, aAvecDetailServices) {
    this.listeServices = MethodesObjet.dupliquer(aListeServices);
    this.avecMultiSelection = aAvecMultiSelection;
    this.avecDetailServices = aAvecDetailServices;
    const lNbrServices = this.listeServices.count();
    if (lNbrServices === 0) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Information,
        message: GTraductions.getValeur("competences.ImpossibleDeDupliquer"),
      });
    } else if (lNbrServices === 1) {
      this.callback.appel(aListeServices, 1);
    } else {
      const lTitreFenetre =
        GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement
          ? GTraductions.getValeur("competences.DupliquerEvalLVE")
          : GTraductions.getValeur("competences.DupliquerEvalService");
      this.setOptionsFenetre({ titre: lTitreFenetre });
      this._initialiserListe(this.getInstance(this.identListe));
      this.afficher();
      this._actualiserListe();
      this.positionnerFenetre();
    }
  }
  surValidation(ANumeroBouton) {
    let lListeSelection = new ObjetListeElements();
    if (ANumeroBouton === 1) {
      lListeSelection = this.getInstance(
        this.identListe,
      ).getListeElementsSelection();
    }
    this.fermer();
    this.callback.appel(lListeSelection, ANumeroBouton);
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe, _evenementSurListe.bind(this));
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="',
      this.getNomInstance(this.identListe),
      '" class="table-contain full-size"></div>',
    );
    return T.join("");
  }
  _initialiserListe(aInstance) {
    const lColonnes = [];
    if (this.avecDetailServices) {
      lColonnes.push({
        id: DonneesListeSelectionService.colonnes.classeGroupe,
        titre:
          GTraductions.getValeur("Classe") +
          "/" +
          GTraductions.getValeur("Groupe"),
        taille: 90,
      });
      lColonnes.push({
        id: DonneesListeSelectionService.colonnes.service,
        titre: GTraductions.getValeur("Matiere"),
        taille: 150,
      });
      lColonnes.push({
        id: DonneesListeSelectionService.colonnes.professeurs,
        titre: GTraductions.getValeur("Professeurs"),
        taille: 150,
      });
    } else {
      lColonnes.push({
        id: DonneesListeSelectionService.colonnes.classeGroupe,
        titre: GTraductions.getValeur("Classe"),
        taille: 150,
      });
    }
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  _actualiserListe() {
    this.setBoutonActif(1, false);
    this.getInstance(this.identListe).setDonnees(
      new DonneesListeSelectionService(
        this.listeServices,
        this.avecMultiSelection,
      ),
    );
  }
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      this.setBoutonActif(
        1,
        this.getInstance(this.identListe).getListeElementsSelection().count() >
          0,
      );
      break;
  }
}
class DonneesListeSelectionService extends ObjetDonneesListe {
  constructor(aDonnees, aAvecMultiSelection) {
    super(aDonnees);
    this.setOptions({
      avecMultiSelection: aAvecMultiSelection,
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
  }
  getTri() {
    const lTris = [];
    lTris.push(
      ObjetTri.init((D) => {
        return D.strClasseGroupe || "";
      }),
    );
    lTris.push(ObjetTri.init("Libelle"));
    return lTris;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListeSelectionService.colonnes.classeGroupe:
        return aParams.article.strClasseGroupe || "";
      case DonneesListeSelectionService.colonnes.service:
        return aParams.article.getLibelle();
      case DonneesListeSelectionService.colonnes.professeurs:
        return aParams.article.strProfesseur || "";
    }
    return "";
  }
}
DonneesListeSelectionService.colonnes = {
  classeGroupe: "SelectionService_classeGroupe",
  service: "SelectionService_service",
  professeurs: "SelectionService_profs",
};
module.exports = { ObjetFenetre_SelectionServicesDEvaluation };

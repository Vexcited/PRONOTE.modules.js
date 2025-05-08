const { ObjetFenetre } = require("ObjetFenetre.js");
const { InterfaceFicheEleve } = require("InterfaceFicheEleve.js");
const { ObjetRequeteFicheEleve } = require("ObjetRequeteFicheEleve.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetFenetre_FicheEleve extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.idFicheEleve = this.add(InterfaceFicheEleve);
  }
  surFermer() {}
  setDonnees(aOngletSelection, aBloquerFocus, aSansFocusPolling) {
    this.setOptionsFenetre({ bloquerFocus: aBloquerFocus });
    this.afficher();
    this.getInstance(this.idFicheEleve).setOptions(this.listeOnglets);
    this.getInstance(this.idFicheEleve).setDonnees({
      onglet: aOngletSelection,
      formatTitrePrimaire: GEtatUtilisateur.pourPrimaire(),
      sansFocusPolling: aSansFocusPolling,
    });
  }
  surValidation(ANumeroBouton) {
    this.getInstance(this.idFicheEleve).surValidation(ANumeroBouton);
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div class="fiche-wrapper" style="height:100%" id="',
      this.getInstance(this.idFicheEleve).getNom(),
      '"></div>',
    );
    return T.join("");
  }
  setOngletParDefaut(aGenreOnglet) {
    this.getInstance(this.idFicheEleve).setOngletParDefaut(aGenreOnglet);
  }
  setOngletActif(aGenreOnglet) {
    this.getInstance(this.idFicheEleve).setOngletActif(aGenreOnglet);
  }
  setOngletsVisibles(aListeOnglets) {
    this.listeOnglets = aListeOnglets;
  }
  recupererDonneesFicheEleve() {
    const lParam = {
      numeroEleve: this.donnees.eleve.getNumero(),
      avecEleve: GApplication.droits.get(
        TypeDroits.eleves.consulterIdentiteEleve,
      ),
      avecResponsables: GApplication.droits.get(
        TypeDroits.eleves.consulterFichesResponsables,
      ),
      avecAutresContacts: GApplication.droits.get(
        TypeDroits.eleves.consulterFichesResponsables,
      ),
    };
    new ObjetRequeteFicheEleve(
      this,
      this.actionSurReponseRequeteFicheEleve,
    ).lancerRequete(lParam);
  }
  actionSurReponseRequeteFicheEleve(
    aIdentite,
    aScolarite,
    aListeTypes,
    aListeMotifs,
    aListeAttestations,
    aListeResponsables,
    aListeMemosEleve,
  ) {
    const lFicheEleve = {
      identite: aIdentite,
      scolarite: aScolarite,
      listeMemos: aListeMemosEleve,
      listeResponsables: aListeResponsables,
    };
    const lAutorisations = {
      avecIdentiteEleve: GApplication.droits.get(
        TypeDroits.eleves.consulterIdentiteEleve,
      ),
      avecFicheResponsables: GApplication.droits.get(
        TypeDroits.eleves.consulterFichesResponsables,
      ),
      avecPhotoEleve: GApplication.droits.get(
        TypeDroits.eleves.consulterPhotosEleves,
      ),
    };
    Object.assign(this.donnees, lFicheEleve, lAutorisations);
    this.afficher();
    this.afficherFicheEleve();
  }
  afficherFicheEleve() {
    GEtatUtilisateur.Navigation.setRessource(
      EGenreRessource.Eleve,
      this.donnees.eleve,
    );
    this.getInstance(this.idFicheEleve).setOptions(this.listeOnglets);
    const lParams = {
      onglet: null,
      formatTitrePrimaire: GEtatUtilisateur.pourPrimaire(),
    };
    if (this.donnees.ongletSelection !== undefined) {
      lParams.onglet = this.donnees.ongletSelection;
    }
    this.getInstance(this.idFicheEleve).setDonnees(lParams);
  }
  static ouvrir(aParametres) {
    if (
      IE.estMobile &&
      !GApplication.droits.get(TypeDroits.eleves.consulterIdentiteEleve) &&
      !GApplication.droits.get(TypeDroits.eleves.consulterFichesResponsables)
    ) {
      return;
    }
    const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_FicheEleve,
      {
        pere: aParametres.instance,
        initialiser: function (aInstance) {
          const lOptions = { cssFenetre: "liste-eleves" };
          if (!IE.estMobile) {
            lOptions.largeur = 750;
            lOptions.hauteur = 750;
          } else {
            lOptions.heightMax_mobile = true;
          }
          if (
            aParametres.avecRequeteDonnees &&
            !!aParametres.donnees &&
            !!aParametres.donnees.listeEleves
          ) {
            lOptions.avecNavigation = true;
            lOptions.callbackNavigation = _getEleveSuivant.bind(aInstance);
          }
          aInstance.setOptionsFenetre(lOptions);
        },
      },
    );
    if (aParametres.avecRequeteDonnees) {
      lInstanceFenetre.donnees = Object.assign(
        { eleve: null, listeEleves: null },
        aParametres.donnees,
      );
      lInstanceFenetre.recupererDonneesFicheEleve();
    } else {
      lInstanceFenetre.setDonnees(
        aParametres.donnees.ongletSelection,
        !!aParametres.donnees.bloquerFocus,
      );
    }
  }
}
function _getEleveSuivant(aSuivant) {
  if (this.donnees.listeEleves) {
    const lListeEleves = this.donnees.listeEleves;
    let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
    lIndiceElementActuel = lListeEleves.getIndiceParElement(this.donnees.eleve);
    if (aSuivant) {
      lIndiceProchainElement =
        lIndiceElementActuel + 1 < lListeEleves.count()
          ? lIndiceElementActuel + 1
          : 0;
    } else {
      lIndiceProchainElement =
        lIndiceElementActuel === 0
          ? lListeEleves.count() - 1
          : lIndiceElementActuel - 1;
    }
    lProchainElement = lListeEleves.get(lIndiceProchainElement);
    if (lProchainElement) {
      this.donnees.eleve = lProchainElement;
      this.afficherFicheEleve();
    }
  }
}
module.exports = ObjetFenetre_FicheEleve;

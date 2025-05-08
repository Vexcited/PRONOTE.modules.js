const { ObjetAideContextuelle } = require("ObjetAideContextuelle.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { tag } = require("tag.js");
class ObjetWrapperAideContextuelle_Mobile {
  constructor(aDonnees) {
    this.donnees = aDonnees;
  }
  ouvrir(aOnglet, aNombre) {
    this.onglet = aOnglet;
    this.nombre = aNombre;
    if (!this.instanceAide) {
      this.instanceAide = ObjetFenetre.creerInstanceFenetre(
        _ObjetFenetreAideContextuelle_Mobile,
        { pere: this.donnees.pere },
        {
          options: { onglet: this.onglet, nombre: this.nombre },
          callbackApresFermer: () => {
            this.instanceAide = null;
          },
        },
      );
      this.instanceAide.afficher();
    } else {
      this.instanceAide.fermer();
      this.instanceAide = null;
    }
  }
}
class _ObjetFenetreAideContextuelle_Mobile extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      fermerFenetreSurClicHorsFenetre: true,
      heightMax_mobile: true,
      listeBoutons: [],
      avecCroixFermeture: false,
      themeMenuDark: true,
    });
  }
  construireInstances() {
    this.identAide = this.add(
      ObjetAideContextuelle,
      () => {
        this.fermer();
      },
      (aInstance) => {
        aInstance.setOptionsAideContextuelle(this.optionsFenetre.options);
      },
    );
  }
  composeContenu() {
    return tag("div", {
      id: this.getInstance(this.identAide).Nom,
      style: "height:100%",
    });
  }
}
module.exports = { ObjetWrapperAideContextuelle_Mobile };

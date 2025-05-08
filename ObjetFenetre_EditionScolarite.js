exports.ObjetFenetre_EditionScolarite = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const InterfaceFicheEleve_1 = require("InterfaceFicheEleve");
class ObjetFenetre_EditionScolarite extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
    this.initialiser();
  }
  construireInstances() {
    this.idFicheEleve = this.add(InterfaceFicheEleve_1.InterfaceFicheEleve);
  }
  setDonnees(aOngletSelection, aBloquerFocus) {
    this.setOptionsFenetre({ bloquerFocus: aBloquerFocus, modale: false });
    this.afficher();
    this.getInstance(this.idFicheEleve).initialiser();
    this.getInstance(this.idFicheEleve).setDonnees({
      onglet: aOngletSelection,
      formatTitrePrimaire: this.etatUtilisateurSco.pourPrimaire(),
    });
  }
  surValidation(ANumeroBouton) {
    this.getInstance(this.idFicheEleve).surValidation(ANumeroBouton);
  }
  composeContenu() {
    const T = [];
    T.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", {
          class: "fiche-wrapper full-size",
          id: this.getInstance(this.idFicheEleve).getNom(),
        }),
      ),
    );
    return T.join("");
  }
  setOngletParDefaut(aGenreOnglet) {
    this.getInstance(this.idFicheEleve).setOngletParDefaut(aGenreOnglet);
  }
}
exports.ObjetFenetre_EditionScolarite = ObjetFenetre_EditionScolarite;

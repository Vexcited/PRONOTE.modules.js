const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class ObjetFenetre_ParametresAffListeStagiaires extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this._parametres = {
      dateNaissance: false,
      formation: false,
      adresse: false,
      telephone: false,
      email: false,
      denominationCommerciale: false,
      coordonneesEntreprise: false,
      responsableEntreprise: false,
    };
    this.setOptionsFenetre({
      avecRetaillage: false,
      largeurMin: 300,
      largeur: 300,
      hauteur: 210,
    });
  }
  construireInstances() {}
  setDonnees(aParametres) {
    $.extend(this._parametres, aParametres);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("stage.listeStagiaire.parametres"),
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.afficher();
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Texte10 Espace">');
    T.push(
      _composeTitreSection(
        GTraductions.getValeur("stage.listeStagiaire.infosStagiaire"),
      ),
    );
    T.push('<div class="Texte10 EspaceBas">');
    T.push(
      '<div class="EspaceHaut"><ie-checkbox ie-model="dateNaissance">',
      GTraductions.getValeur("stage.listeStagiaire.dateNaissance"),
      "</ie-checkbox></div>",
    );
    T.push(
      '<div class="EspaceHaut"><ie-checkbox ie-model="formation">',
      GTraductions.getValeur("stage.listeStagiaire.formation"),
      "</ie-checkbox></div>",
    );
    if (GApplication.droits.get(TypeDroits.eleves.consulterIdentiteEleve)) {
      T.push(
        '<div class="EspaceHaut"><ie-checkbox ie-model="adresse">',
        GTraductions.getValeur("stage.listeStagiaire.adresse"),
        "</ie-checkbox></div>",
      );
      T.push(
        '<div class="EspaceHaut"><ie-checkbox ie-model="telephone">',
        GTraductions.getValeur("stage.listeStagiaire.telephone"),
        "</ie-checkbox></div>",
      );
      T.push(
        '<div class="EspaceHaut"><ie-checkbox ie-model="email">',
        GTraductions.getValeur("stage.listeStagiaire.email"),
        "</ie-checkbox></div>",
      );
    }
    T.push("</div>");
    T.push(
      _composeTitreSection(
        GTraductions.getValeur("stage.listeStagiaire.infosEntreprise"),
        true,
      ),
    );
    T.push('<div class="Texte10">');
    T.push(
      '<div class="EspaceHaut"><ie-checkbox ie-model="denominationCommerciale">',
      GTraductions.getValeur("stage.listeStagiaire.denominationCommerciale"),
      "</ie-checkbox></div>",
    );
    T.push(
      '<div class="EspaceHaut"><ie-checkbox ie-model="coordonneesEntreprise">',
      GTraductions.getValeur("stage.listeStagiaire.coordonneesEntreprise"),
      "</ie-checkbox></div>",
    );
    T.push(
      '<div class="EspaceHaut"><ie-checkbox ie-model="responsableEntreprise">',
      GTraductions.getValeur("stage.listeStagiaire.responsableEntreprise"),
      "</ie-checkbox></div>",
    );
    T.push("</div>");
    T.push("</div>");
    return T.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      dateNaissance: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.dateNaissance
            ? this.instance._parametres.dateNaissance
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.dateNaissance = aValue;
        },
      },
      formation: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.formation
            ? this.instance._parametres.formation
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.formation = aValue;
        },
      },
      adresse: {
        getValue: function () {
          return this.instance._parametres && this.instance._parametres.adresse
            ? this.instance._parametres.adresse
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.adresse = aValue;
        },
      },
      telephone: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.telephone
            ? this.instance._parametres.telephone
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.telephone = aValue;
        },
      },
      email: {
        getValue: function () {
          return this.instance._parametres && this.instance._parametres.email
            ? this.instance._parametres.email
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.email = aValue;
        },
      },
      denominationCommerciale: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.denominationCommerciale
            ? this.instance._parametres.denominationCommerciale
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.denominationCommerciale = aValue;
        },
      },
      coordonneesEntreprise: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.coordonneesEntreprise
            ? this.instance._parametres.coordonneesEntreprise
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.coordonneesEntreprise = aValue;
        },
      },
      responsableEntreprise: {
        getValue: function () {
          return this.instance._parametres &&
            this.instance._parametres.responsableEntreprise
            ? this.instance._parametres.responsableEntreprise
            : false;
        },
        setValue: function (aValue) {
          this.instance._parametres.responsableEntreprise = aValue;
        },
      },
    });
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, this._parametres);
  }
}
function _composeTitreSection(aMessage, aAvecMargeHaut) {
  const T = [];
  T.push(
    "<div ",
    aAvecMargeHaut ? 'class="EspaceHaut"' : "",
    ">",
    '<div class="Texte10 Gras PetitEspaceBas">',
    aMessage,
    "</div>",
    "</div>",
  );
  return T.join("");
}
module.exports = { ObjetFenetre_ParametresAffListeStagiaires };

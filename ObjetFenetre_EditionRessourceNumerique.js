const { GChaine } = require("ObjetChaine.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
class ObjetFenetre_EditionRessourceNumerique extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.ressourceNumerique;
    const lOptionsFenetre = {
      titre: GTraductions.getValeur("Fenetre_EditionRessourceNumerique.titre"),
      largeur: 460,
      hauteurMin: 280,
      listeBoutons: [
        {
          libelle: GTraductions.getValeur("Annuler"),
          theme: TypeThemeBouton.secondaire,
          action: ObjetFenetre_EditionRessourceNumerique.genreAction.annuler,
        },
        {
          libelle: GTraductions.getValeur("Valider"),
          valider: true,
          theme: TypeThemeBouton.primaire,
          action: ObjetFenetre_EditionRessourceNumerique.genreAction.valider,
        },
      ],
    };
    this.boutonOuvrir = {
      libelle: GTraductions.getValeur(
        "Fenetre_EditionRessourceNumerique.ouvrir",
      ),
      theme: TypeThemeBouton.primaire,
      action: ObjetFenetre_EditionRessourceNumerique.genreAction.ouvrir,
    };
    this.boutonSupprimer = {
      libelle: GTraductions.getValeur("Supprimer"),
      theme: TypeThemeBouton.secondaire,
      action: ObjetFenetre_EditionRessourceNumerique.genreAction.supprimer,
    };
    this.setOptionsFenetre(lOptionsFenetre);
  }
  setOptions(aOptions) {
    $.extend(this.options, aOptions);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          if (
            aBoutonRepeat.element.action ===
            ObjetFenetre_EditionRessourceNumerique.genreAction.valider
          ) {
            return (
              !aInstance.ressourceNumerique ||
              aInstance.ressourceNumerique.getEtat() === EGenreEtat.Aucun
            );
          }
          return false;
        },
      },
      btnSupprimer: {
        event: function () {
          GApplication.getMessage()
            .afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "Fenetre_EditionRessourceNumerique.suppression",
              ),
            })
            .then(
              function (aAccepte) {
                if (aAccepte === EGenreAction.Valider) {
                  this.surValidation(
                    ObjetFenetre_EditionRessourceNumerique.genreAction
                      .supprimer,
                  );
                }
              }.bind(aInstance),
            );
        },
      },
      btnOuvrir: {
        event: function () {
          if (!!aInstance.ressourceNumerique) {
            window.open(
              GChaine.creerUrlBruteLienExterne(aInstance.ressourceNumerique),
            );
          }
        },
      },
      titre: {
        getValue: function () {
          return aInstance && aInstance.ressourceNumerique
            ? aInstance.ressourceNumerique.getLibelle()
            : "";
        },
        setValue: function (aValue) {
          if (
            aInstance &&
            aInstance.ressourceNumerique &&
            aInstance.ressourceNumerique.getLibelle() !== aValue
          ) {
            aInstance.ressourceNumerique.setLibelle(aValue);
            aInstance.ressourceNumerique.setEtat(EGenreEtat.Modification);
          }
        },
        getDisabled: function () {
          return !aInstance || !aInstance.ressourceNumerique;
        },
      },
      commentaire: {
        getValue: function () {
          return aInstance && aInstance.ressourceNumerique
            ? aInstance.ressourceNumerique.commentaire
            : "";
        },
        setValue: function (aValue) {
          if (
            aInstance &&
            aInstance.ressourceNumerique &&
            aInstance.ressourceNumerique.commentaire !== aValue
          ) {
            aInstance.ressourceNumerique.commentaire = aValue;
            aInstance.ressourceNumerique.setEtat(EGenreEtat.Modification);
          }
        },
        getDisabled: function () {
          return !aInstance || !aInstance.ressourceNumerique;
        },
      },
    });
  }
  setDonnees(aRessource) {
    this.ressourceNumerique = aRessource;
    this.actualiser();
    this.afficher();
  }
  composeBas() {
    const H = [];
    H.push(
      '<span class="OFERN_Obligatoire">* ',
      GTraductions.getValeur(
        "Fenetre_EditionRessourceNumerique.champObligatoire",
      ),
      "</span>",
    );
    if (this.boutonSupprimer) {
      const lBouton = this.boutonSupprimer;
      H.push(
        '<ie-bouton class="' + lBouton.theme + '"',
        ' ie-model="btnSupprimer">',
        lBouton.libelle,
        "</ie-bouton>",
      );
    }
    return H.join("");
  }
  composeContenu() {
    const T = [];
    T.push('<div class="OFERN_Main">');
    T.push(
      '<div class="OFERN_LigneTitre"><span>',
      GTraductions.getValeur("Fenetre_EditionRessourceNumerique.label"),
      ' : *</span><ie-bouton class="' + this.boutonOuvrir.theme + '"',
      ' ie-model="btnOuvrir">',
      this.boutonOuvrir.libelle,
      "</ie-bouton></div>",
    );
    T.push('<div class="OFERN_Titre"><input ie-model="titre" /></div>');
    T.push(
      '<div class="OFERN_LigneCommentaire">',
      GTraductions.getValeur("Fenetre_EditionRessourceNumerique.commentaire"),
      " :</div>",
    );
    T.push(
      '<div class="OFERN_Commentaire"><textarea ie-model="commentaire"></textarea></div>',
    );
    T.push("</div>");
    return T.join("");
  }
  surValidation(aNumeroBouton) {
    const lResult = {
      genreBouton: aNumeroBouton,
      ressource: this.ressourceNumerique,
    };
    this.callback.appel(lResult);
    this.fermer();
  }
  static ouvrir(aParams) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_EditionRessourceNumerique,
      { pere: aParams.instance, evenement: aParams.callback },
    );
    lFenetre.setDonnees(aParams.ressource);
  }
}
ObjetFenetre_EditionRessourceNumerique.genreAction = {
  annuler: 0,
  valider: 1,
  supprimer: 2,
  ouvrir: 3,
};
module.exports = ObjetFenetre_EditionRessourceNumerique;

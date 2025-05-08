const { MethodesObjet } = require("MethodesObjet.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
class FenetreEditionDestinatairesParEntites extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.id = { nbEntiteClasse: GUID.getId(), nbEntiteGpe: GUID.getId() };
    this.options = { avecChoixParEleve: true };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodeSelectChoixClassesGpes: function (aGenreRessource) {
        $(this.node).on(
          "click",
          function () {
            this.openModaleSelectRessource({
              genreRessource: aGenreRessource,
              donnee: this.donnee,
              clbck: function () {
                this.updateCompteurs();
              }.bind(this),
            });
          }.bind(aInstance),
        );
      },
      cbGenreDest: {
        getValue: function (aGenreRessource) {
          return this.utilitaires !== null && this.utilitaires !== undefined
            ? this.utilitaires.moteurDestinataires.estGenrePublicEntite({
                genreRessource: aGenreRessource,
                donnee: this.donnee,
              })
            : false;
        }.bind(aInstance),
        setValue: function (aGenreRessource, aValue) {
          if (this.utilitaires !== null && this.utilitaires !== undefined) {
            this.utilitaires.moteurDestinataires.setGenrePublicEntite({
              genreRessource: aGenreRessource,
              donnee: this.donnee,
              valeur: aValue,
            });
          }
        }.bind(aInstance),
        getDisabled: function () {
          return false;
        }.bind(aInstance),
      },
      rbChxParMembre: {
        getValue: function (aGenreRessource, aChoixParMembre) {
          if (this.utilitaires !== null && this.utilitaires !== undefined) {
            const lRelatifEleve =
              this.utilitaires.moteurDestinataires.estRelatifEleve({
                genreRessource: aGenreRessource,
                donnee: this.donnee,
              });
            if (aChoixParMembre === true) {
              return lRelatifEleve === true;
            } else {
              return lRelatifEleve === false;
            }
          }
        }.bind(aInstance),
        setValue: function (aGenreRessource, aChoixParMembre) {
          if (this.utilitaires !== null && this.utilitaires !== undefined) {
            this.utilitaires.moteurDestinataires.setChoixParMembre({
              genreRessource: aGenreRessource,
              donnee: this.donnee,
              choixParMembre: aChoixParMembre,
            });
          }
        }.bind(aInstance),
        getDisabled: function (aGenreRessource) {
          return this.utilitaires !== null && this.utilitaires !== undefined
            ? !this.utilitaires.moteurDestinataires.estGenrePublicEntite({
                genreRessource: aGenreRessource,
                donnee: this.donnee,
              })
            : true;
        }.bind(aInstance),
      },
      cbElevesRattaches: {
        getValue: function () {
          if (this.donnee !== null && this.donnee !== undefined) {
            return this.donnee.avecElevesRattaches;
          }
        }.bind(aInstance),
        setValue: function (aValue) {
          if (this.donnee !== null && this.donnee !== undefined) {
            this.donnee.avecElevesRattaches = aValue;
            this.donnee.avecModificationPublic = true;
          }
        }.bind(aInstance),
        getDisabled: function () {
          return false;
        }.bind(aInstance),
      },
      getDestIcon: {
        getIcone() {
          return `<i class="icon_group"></i>`;
        },
      },
    });
  }
  construireInstances() {}
  setDonnees(aParam) {
    this.donneeOrigine = aParam.donnee;
    this.donnee = MethodesObjet.dupliquer(this.donneeOrigine);
    this.afficher(this.composeContenu());
    this.updateCompteurs();
  }
  setUtilitaires(aUtilitaires) {
    this.utilitaires = aUtilitaires;
  }
  setOptions(aOptions) {
    this.options = aOptions;
  }
  composeContenu() {
    const H = [];
    H.push('<div class="FenetreEditionDestinatairesParEntites">');
    H.push(_construireHtmlChoixClassesGpe.call(this));
    H.push(_construireHtmlSelectionTypeDestinataires.call(this));
    H.push("</div>");
    return H.join("");
  }
  openModaleSelectRessource(aParam) {
    this.utilitaires.moteurDestinataires.ouvrirModaleSelectionRessource(aParam);
  }
  updateCompteurs() {
    const lNbClasses = this.donnee.listePublicEntite
      .getListeElements((D) => {
        return (
          D.getGenre() === this.utilitaires.genreRessource.getRessourceClasse()
        );
      })
      .getNbrElementsExistes();
    GHtml.setHtml(
      this.id.nbEntiteClasse,
      _construireHtmlNb.call(this, lNbClasses),
    );
    const lNbGpe = this.donnee.listePublicEntite
      .getListeElements((D) => {
        return (
          D.getGenre() === this.utilitaires.genreRessource.getRessourceGroupe()
        );
      })
      .getNbrElementsExistes();
    GHtml.setHtml(this.id.nbEntiteGpe, _construireHtmlNb.call(this, lNbGpe));
  }
  surValidation(aGenreBouton) {
    const lEstValidation = aGenreBouton === 1;
    this.callback.appel(aGenreBouton, {
      donnee: lEstValidation ? this.donnee : this.donneeOrigine,
    });
    this.fermer();
  }
}
function _construireHtmlChoixClassesGpe() {
  const H = [];
  H.push(
    '<div class="titreSection first"><span >',
    "1. ",
    GTraductions.getValeur("destinataires.choixClassesGpes"),
    "</span></div>",
  );
  H.push(
    `<div class="field-contain">\n  <ie-btnselecteur ie-model="getDestIcon" aria-label="${GTraductions.getValeur("destinataires.classes")}" ie-node="nodeSelectChoixClassesGpes(${this.utilitaires.genreRessource.getRessourceClasse()})">${GTraductions.getValeur("destinataires.classes")} <span class="strNumber" id="${this.id.nbEntiteClasse}">(0)</span></ie-btnselecteur>\n  </div>`,
  );
  H.push(
    `<div class="field-contain">\n  <ie-btnselecteur ie-model="getDestIcon" aria-label="${GTraductions.getValeur("destinataires.gpes")}" ie-node="nodeSelectChoixClassesGpes(${this.utilitaires.genreRessource.getRessourceGroupe()})">${GTraductions.getValeur("destinataires.gpes")} <span class="strNumber" id="${this.id.nbEntiteGpe}">(0)</span></ie-btnselecteur>\n  </div>`,
  );
  if (this.options && this.options.avecCBElevesRattaches === true) {
    H.push('<div class="item flex-contain vertical">');
    H.push(
      '<ie-checkbox class="cb" ie-model="cbElevesRattaches()" ie-textright>',
      GTraductions.getValeur("actualites.public.elevesRattaches"),
      "</ie-checkbox>",
    );
    H.push("</div>");
  }
  return H.join("");
}
function _construireHtmlSelectionDeRessource(aParam) {
  const H = [];
  H.push(
    '<div  class="item flex-contain vertical',
    aParam.estDernier === true ? " last " : "",
    '">',
  );
  H.push(
    '<ie-checkbox class="cb" ie-model="cbGenreDest(',
    aParam.genreRessource,
    ')" ie-textright>',
    aParam.strRessource,
    "</ie-checkbox>",
  );
  if (aParam.avecChoixParEleve === true) {
    H.push(
      '<ie-radio class="rb" ie-model="rbChxParMembre(',
      aParam.genreRessource,
      ", ",
      true,
      ')" ie-textright>',
      GTraductions.getValeur("destinataires.envoiParEleve"),
      "</ie-radio>",
    );
    H.push(
      '<ie-radio class="rb" ie-model="rbChxParMembre(',
      aParam.genreRessource,
      ", ",
      false,
      ')" ie-textright>',
      GTraductions.getValeur("destinataires.envoiParResp"),
      "</ie-radio>",
    );
  }
  H.push("</div>");
  return H.join("");
}
function _construireHtmlSelectionTypeDestinataires() {
  const H = [];
  H.push(
    '<div class="titreSection"><span >',
    "2. ",
    GTraductions.getValeur("destinataires.selectionnerTypeDests"),
    "</span></div>",
  );
  H.push(
    _construireHtmlSelectionDeRessource.call(this, {
      genreRessource: this.utilitaires.genreRessource.getRessourceEleve(),
      strRessource: GTraductions.getValeur("destinataires.eleves"),
    }),
  );
  H.push(
    _construireHtmlSelectionDeRessource.call(this, {
      genreRessource: this.utilitaires.genreRessource.getRessourceParent(),
      strRessource: GTraductions.getValeur("destinataires.responsables"),
      avecChoixParEleve: this.options.avecChoixParEleve,
    }),
  );
  H.push(
    _construireHtmlSelectionDeRessource.call(this, {
      genreRessource: this.utilitaires.genreRessource.getRessourceProf(),
      strRessource: GTraductions.getValeur("destinataires.professeurs"),
    }),
  );
  H.push(
    _construireHtmlSelectionDeRessource.call(this, {
      genreRessource: this.utilitaires.genreRessource.getRessourcePersonnel(),
      strRessource: GTraductions.getValeur("destinataires.personnels"),
    }),
  );
  H.push(
    _construireHtmlSelectionDeRessource.call(this, {
      genreRessource: this.utilitaires.genreRessource.getRessourceEntreprise(),
      strRessource: GTraductions.getValeur("destinataires.maitresDeStage"),
      estDernier: true,
    }),
  );
  return H.join("");
}
function _construireHtmlNb(aNb) {
  return " (" + aNb + ") ";
}
module.exports = { FenetreEditionDestinatairesParEntites };

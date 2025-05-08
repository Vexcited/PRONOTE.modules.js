const { MethodesObjet } = require("MethodesObjet.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
class FenetreEditionDestinatairesParIndividus extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.id = {
      nbEleves: GUID.getId(),
      nbProfs: GUID.getId(),
      nbResps: GUID.getId(),
      nbPersonnels: GUID.getId(),
      nbMdS: GUID.getId(),
      nbInspecteurs: GUID.getId(),
    };
    this.options = {
      avecGestionEleves: true,
      avecGestionPersonnels: true,
      avecGestionStages: true,
      avecGestionIPR: true,
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecBtnListeDiffusion() {
        return aInstance.avecListeDiffusion;
      },
      btnListeDiffusion: {
        event() {
          aInstance.surBtnListeDiffusion().then((aListeSelec) => {
            if (aListeSelec && aListeSelec.count() > 0) {
              aListeSelec.parcourir((aDiffusion) => {
                aDiffusion.listePublicIndividu.parcourir((aElement) => {
                  if (
                    !aInstance.donnee.listePublicIndividu.getElementParElement(
                      aElement,
                    ) &&
                    !_getDisabledParGenre.call(aInstance, aElement.getGenre())
                  ) {
                    aInstance.donnee.listePublicIndividu.addElement(
                      MethodesObjet.dupliquer(aElement),
                    );
                  }
                });
              });
              aInstance.donnee.avecModificationPublic = true;
              aInstance.updateCompteurs();
            }
          });
        },
      },
      nodeSelectGenreDest: function (aGenreRessource) {
        $(this.node).on(
          "click",
          function () {
            this.utilitaires.moteurDestinataires
              .getDonneesPublic({ genreRessource: aGenreRessource })
              .then((aDonnees) => {
                this.utilitaires.moteurDestinataires.openModaleSelectPublic({
                  titre:
                    this.utilitaires.moteurDestinataires.getTitreSelectRessource(
                      { genreRessource: aGenreRessource },
                    ),
                  listePublicDonnee: this.donnee.listePublicIndividu,
                  genreRessource: aGenreRessource,
                  listeRessources: aDonnees.listePublic,
                  listeServicesPeriscolaire: aDonnees.listeServicesPeriscolaire,
                  listeProjetsAcc: aDonnees.listeProjetsAcc,
                  listeFamilles: aDonnees.listeFamilles,
                  listeRessourcesSelectionnees:
                    this.donnee.listePublicIndividu.getListeElements((aElt) => {
                      return aElt.getGenre() === aGenreRessource;
                    }),
                  listeNiveauxResponsabilite:
                    aDonnees.listeNiveauxResponsabilite,
                  clbck: (aParam) => {
                    this.donnee.avecModificationPublic =
                      aParam.avecModificationPublic;
                    this.donnee.listePublicIndividu = aParam.listePublicDonnee;
                    this.updateCompteurs();
                  },
                });
              });
          }.bind(aInstance),
        );
      },
      getDestIcon: {
        getIcone() {
          return `<i class="icon_user"></i>`;
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
    this.options = $.extend(this.options, aOptions);
  }
  composeContenu() {
    const H = [];
    const lTabInfosRessources = _getTabInfosRessources.call(this);
    H.push('<div class="FenetreEditionDestinatairesParIndividus">');
    H.push(
      '<div class="m-all" ie-if="avecBtnListeDiffusion"><ie-bouton class="small-bt themeBoutonNeutre" ie-model="btnListeDiffusion">',
      GTraductions.getValeur("listeDiffusion.btnListeDiffusion"),
      "</ie-bouton></div>",
    );
    for (let i = 0, lNbr = lTabInfosRessources.length; i < lNbr; i++) {
      const lInfosRessource = lTabInfosRessources[i];
      H.push(
        _construireHtmlSelectionDeRessource.call(
          this,
          $.extend(lInfosRessource, { estDernier: i === lNbr - 1 }),
        ),
      );
    }
    H.push("</div>");
    return H.join("");
  }
  updateCompteurs() {
    const lTabInfosRessources = _getTabInfosRessources.call(this);
    for (let i = 0, lNbr = lTabInfosRessources.length; i < lNbr; i++) {
      const lInfosRessource = lTabInfosRessources[i];
      const lNb = this.donnee.listePublicIndividu
        .getListeElements((D) => {
          return D.getGenre() === lInfosRessource.genreRessource;
        })
        .getNbrElementsExistes();
      GHtml.setHtml(
        lInfosRessource.idCompteur,
        _construireHtmlNb.call(this, lNb),
      );
    }
  }
  surValidation(aGenreBouton) {
    const lEstValidation = aGenreBouton === 1;
    this.callback.appel(aGenreBouton, {
      donnee: lEstValidation ? this.donnee : this.donneeOrigine,
    });
    this.fermer();
  }
}
function _construireHtmlSelectionDeRessource(aParam) {
  const H = [];
  H.push(
    `<div class="field-contain">\n  <ie-btnselecteur ie-model="getDestIcon" aria-label="${aParam.strRessource}" ie-node="nodeSelectGenreDest(${aParam.genreRessource})">${aParam.strRessource}<span class="strNumber" id="${aParam.idCompteur}"></span></ie-btnselecteur>\n  </div>`,
  );
  return H.join("");
}
function _construireHtmlNb(aNb) {
  return " (" + aNb + ") ";
}
function _getTabInfosRessources() {
  const lResult = [];
  if (this.options.avecGestionEleves) {
    lResult.push({
      genreRessource: this.utilitaires.genreRessource.getRessourceEleve(),
      strRessource: GTraductions.getValeur("destinataires.eleves"),
      idCompteur: this.id.nbEleves,
    });
  }
  lResult.push(
    {
      genreRessource: this.utilitaires.genreRessource.getRessourceParent(),
      strRessource: GTraductions.getValeur("destinataires.responsables"),
      idCompteur: this.id.nbResps,
    },
    {
      genreRessource: this.utilitaires.genreRessource.getRessourceProf(),
      strRessource: GTraductions.getValeur("destinataires.professeurs"),
      idCompteur: this.id.nbProfs,
    },
  );
  if (this.options.avecGestionPersonnels) {
    lResult.push({
      genreRessource: this.utilitaires.genreRessource.getRessourcePersonnel(),
      strRessource: GTraductions.getValeur("destinataires.personnels"),
      idCompteur: this.id.nbPersonnels,
    });
  }
  if (this.options.avecGestionStages) {
    lResult.push({
      genreRessource: this.utilitaires.genreRessource.getRessourceEntreprise(),
      strRessource: GTraductions.getValeur("destinataires.maitresDeStage"),
      idCompteur: this.id.nbMdS,
    });
  }
  if (this.options.avecGestionIPR) {
    lResult.push({
      genreRessource: this.utilitaires.genreRessource.getRessourceInspecteur(),
      strRessource: GTraductions.getValeur("destinataires.inspecteur"),
      idCompteur: this.id.nbInspecteurs,
    });
  }
  return lResult;
}
function _getDisabledParGenre(aGenre) {
  switch (aGenre) {
    case this.utilitaires.genreRessource.getRessourceEleve():
      return !this.options.avecGestionEleves;
    case this.utilitaires.genreRessource.getRessourcePersonnel():
      return !this.options.avecGestionPersonnels;
    case this.utilitaires.genreRessource.getRessourceEntreprise():
      return !this.options.avecGestionStages;
    case this.utilitaires.genreRessource.getRessourceInspecteur():
      return !this.options.avecGestionIPR;
    default:
      return false;
  }
}
module.exports = { FenetreEditionDestinatairesParIndividus };

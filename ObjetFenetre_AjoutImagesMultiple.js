const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { tag } = require("tag.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { UtilitaireSelecFile } = require("UtilitaireSelecFile.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireTraitementImage } = require("UtilitaireTraitementImage.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GChaine } = require("ObjetChaine.js");
class ObjetFenetre_AjoutImagesMultiple extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.id = { ctnChips: GUID.getId(), ctnImagesPreview: GUID.getId() };
    this.options = { avecChipsPJ: false, avecPreview: true };
    this.maxSize = GApplication.droits.get(
      TypeDroits.tailleMaxDocJointEtablissement,
    );
    this.setOptionsFenetre({
      hauteurMaxContenu: 600,
      modale: true,
      titre: GTraductions.getValeur("fenetreAjoutImagesMultiple.titre"),
      largeur: 380,
      hauteur: 200,
      fermerFenetreSurClicHorsFenetre: true,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnAdd: {
        getOptionsSelecFile: function () {
          return {
            avecResizeImage: true,
            maxSize: aInstance.maxSize,
            multiple: false,
            avecTransformationFlux: false,
            accept: UtilitaireTraitementImage.getTabMimePDFImage().join(", "),
          };
        },
        addFiles: function (aParams) {
          if (aParams.listeFichiers && aParams.listeFichiers.count() > 0) {
            if (
              !aInstance.utilitaire.estFichierValidePourPDF(
                aParams.listeFichiers.get(0),
              )
            ) {
              GApplication.getMessage().afficher({
                message: GChaine.format(
                  GTraductions.getValeur("inputFile.echecImagePDF_S"),
                  [aParams.listeFichiers.get(0).getLibelle() || ""],
                ),
              });
            } else {
              _addFile.call(aInstance, aParams);
            }
          }
        },
      },
      chips: {
        eventBtn(aIndice) {
          if (aInstance.options.avecChipsPJ) {
            aInstance.liste.remove(aIndice);
            _updateAffichage.call(aInstance);
          }
        },
      },
      avecPreview() {
        return aInstance && aInstance.options && aInstance.options.avecPreview;
      },
      avecChipsPJ() {
        return aInstance && aInstance.options && aInstance.options.avecChipsPJ;
      },
    });
  }
  setDonnees(aParam) {
    this.liste = aParam.liste || new ObjetListeElements();
    this.utilitaire = aParam.utilitaire;
    this.listeInitial = MethodesObjet.dupliquer(this.liste);
    this.afficher(this.composeContenu());
    _updateAffichage.call(this);
  }
  composeContenu() {
    const H = [];
    H.push(
      tag(
        "div",
        { class: "ObjetFenetre_AjoutImagesMultiple", style: "height : 100%" },
        tag(
          "ie-bouton",
          {
            class: [TypeThemeBouton.primaire, "btn-width", "m-top-l"],
            "ie-model": "btnAdd",
            "ie-selecFile": true,
          },
          GTraductions.getValeur("fenetreAjoutImagesMultiple.deposerUneImage"),
        ),
        tag("div", {
          class: "ctnChips",
          id: this.id.ctnChips,
          "ie-if": "avecChipsPJ",
        }),
        tag("div", {
          class: [
            "flex-contain cols",
            "m-top-l",
            "flex-gap-l",
            "ctnImagesPreview",
          ],
          id: this.id.ctnImagesPreview,
          "ie-if": "avecPreview",
        }),
      ),
    );
    return H.join("");
  }
  surValidation(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      const lListeRetour = this.liste.getListeElements((aElement) =>
        aElement.existe(),
      );
      if (lListeRetour.count() > 0) {
        const lNomPDF = this.utilitaire.getNomPdfGenere();
        const lMessagesErreur = [];
        UtilitaireSelecFile.genererPdfAsync(
          lListeRetour,
          lMessagesErreur,
          lNomPDF,
          EGenreDocumentJoint.Fichier,
        ).then(() => {
          const lListeFichiersAEnvoyer =
            UtilitaireSelecFile.controleTailleFichiers(
              lListeRetour,
              lMessagesErreur,
              this.maxSize,
            );
          if (lMessagesErreur.length > 0) {
            return GApplication.getMessage().afficher({
              message: lMessagesErreur.join("<br>"),
            });
          } else {
            const lFichierPdfGenere = lListeFichiersAEnvoyer.get(0);
            this.callback.appel(
              EGenreAction.Valider,
              new ObjetListeElements().add(lFichierPdfGenere),
            );
          }
        });
      }
    }
    this.fermer();
  }
}
function _updateAffichage() {
  if (this.options.avecChipsPJ) {
    GHtml.setHtml(
      this.id.ctnChips,
      UtilitaireUrl.construireListeUrls(this.liste, {
        genreFiltre: EGenreDocumentJoint.Fichier,
        genreRessource: EGenreRessource.DocumentJoint,
        IEModelChips: "chips",
        class: "icon_fichier_image",
      }),
      { controleur: this.controleur },
    );
  }
  if (this.options.avecPreview) {
    _construireListeImage.call(this);
  }
}
function _construireListeImage() {
  GHtml.setHtml(this.id.ctnImagesPreview, "");
  this.liste.parcourir((aImage, aIndex) => {
    if (URL && URL.createObjectURL) {
      const lURL = URL.createObjectURL(aImage.file);
      if (lURL && aImage.file) {
        const lId = `${this.Nom}_image_${aIndex}`;
        GHtml.addHtml(this.id.ctnImagesPreview, tag("img", { id: lId }));
        const lImg = $("#" + lId.escapeJQ());
        lImg.attr("src", lURL);
        lImg.on("destroyed", () => URL.revokeObjectURL(lURL));
      }
    }
  });
}
function _addFile(aParams) {
  this.liste.add(aParams.listeFichiers);
  _updateAffichage.call(this);
}
module.exports = { ObjetFenetre_AjoutImagesMultiple };

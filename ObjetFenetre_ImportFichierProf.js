const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const ObjetRequeteSaisieImportFichierProf = require("ObjetRequeteSaisieImportFichierProf.js");
const { TypeGenreEchangeDonnees } = require("TypeGenreEchangeDonnees.js");
class ObjetFenetre_ImportFichierProf extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 380,
      titre: "",
      listeBoutons: [GTraductions.getValeur("Annuler")],
      avecTailleSelonContenu: true,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnUpload: {
        getOptionsSelecFile: function () {
          return {
            maxSize: 500 * 1024 * 1024,
            accept: "application/zip",
            extensions: ["zip"],
            avecTransformationFlux: false,
          };
        },
        addFiles: function (aParametres) {
          aInstance.fermer();
          new ObjetRequeteSaisieImportFichierProf({})
            .addUpload({
              listeFichiers: aParametres.listeFichiers,
              maxChunkSize: 1 * 1024 * 1024,
              annulerSurErreurUpload: true,
            })
            .lancerRequete({ genreFichier: aInstance.options.genreFichier })
            .then(
              function (aSucces) {
                if (aSucces) {
                  return GApplication.getMessage().afficher({
                    message: GTraductions.getValeur(
                      "Fenetre_ImportFichierProf.ReussiteImport",
                    ),
                    callback: function () {
                      this.callback.appel();
                    }.bind(this),
                  });
                }
              }.bind(aInstance),
            );
        },
      },
    });
  }
  setDonnees() {
    this.afficher();
  }
  composeBoutons() {
    const H = [];
    H.push(super.composeBoutons());
    H.push('<div class="btn-conteneur" style="flex: none; padding-left: 0">');
    H.push(
      '<ie-bouton ie-model="btnUpload" class="themeBoutonPrimaire" ie-selecfile >',
      GTraductions.getValeur("Fenetre_ImportFichierProf.ChoisirLeFichier"),
      "</ie-bouton>",
    );
    H.push("</div>");
    return H.join("");
  }
  composeContenu() {
    let lMsg;
    switch (this.options.genreFichier) {
      case TypeGenreEchangeDonnees.GED_PAS:
        lMsg = GTraductions.getValeur(
          "Fenetre_ImportFichierProf.TexteExplicatif",
        );
        break;
      case TypeGenreEchangeDonnees.GED_ModelesSondage:
        lMsg = GTraductions.getValeur(
          "Fenetre_ImportFichierProf.TexteExplicatifModelesSond",
        );
        break;
      default:
        lMsg = "";
    }
    const T = [];
    T.push(
      '<div class="Table Texte10">',
      GChaine.replaceRCToHTML(lMsg),
      "</div>",
    );
    return T.join("");
  }
  surValidation(ANumeroBouton) {
    this.fermer();
    this.callback.appel(ANumeroBouton);
  }
}
module.exports = ObjetFenetre_ImportFichierProf;

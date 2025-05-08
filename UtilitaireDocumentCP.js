exports.UtilitaireDocumentCP = void 0;
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const ObjetChaine_1 = require("ObjetChaine");
class UtilitaireDocumentCP {
  static getIconFromFileName(aNomFichier) {
    let lClass = "";
    if (aNomFichier) {
      const lSuffixe =
        ObjetChaine_1.GChaine.extraireExtensionFichier(aNomFichier);
      lClass = Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
        Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
          lSuffixe,
        ),
      );
    }
    return lClass;
  }
  static ouvrirUrl(aDocument, aParams = {}) {
    const lParams = Object.assign({ forcerURLComplete: true }, aParams);
    const lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
      aDocument,
      lParams,
    );
    window.open(lUrl);
  }
  static getIconPDF() {
    return Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
      Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf,
    );
  }
}
exports.UtilitaireDocumentCP = UtilitaireDocumentCP;

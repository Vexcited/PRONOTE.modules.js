exports.WidgetDSEvaluation = void 0;
const WidgetDS_1 = require("WidgetDS");
const ObjetTri_1 = require("ObjetTri");
const Enumere_LienDS_1 = require("Enumere_LienDS");
class WidgetDSEvaluation extends WidgetDS_1.WidgetDS {
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.donneesSurveille = aParams.instance.donnees.devoirSurveille;
    if (this.donneesSurveille.listeDS) {
      this.donneesSurveille.listeDS.setTri([
        ObjetTri_1.ObjetTri.init("dateDebut"),
      ]);
      this.donneesSurveille.listeDS.trier();
    }
    const lWidget = {
      html: this.composeWidgetDS(Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation),
      nbrElements: this.donnees.listeDS.count(),
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
}
exports.WidgetDSEvaluation = WidgetDSEvaluation;

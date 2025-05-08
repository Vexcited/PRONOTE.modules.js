const { GChaine } = require("ObjetChaine.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFiche } = require("ObjetFiche.js");
class ObjetFicheDocumentsJoints extends ObjetFiche {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({ fermerFenetreSurClicHorsFenetre: true });
    this.avecBandeau = false;
    this.avecDescription = false;
  }
  setOptionsFicheDocumentsJoints(aOptions) {
    if (aOptions.avecBandeau) {
      this.avecBandeau = aOptions.avecBandeau;
    }
    if (aOptions.avecDescription) {
      this.avecDescription = aOptions.avecDescription;
    }
  }
  setDonnees(aParam) {
    window.clearTimeout(this.timer);
    this.params = Object.assign(
      { docsJoints: null, genreDJ: -1, id: "" },
      aParam,
    );
    this.tableauDocumentsJoints = aParam.docsJoints;
    this.genrePJ = aParam.genreDJ;
    if (this.avecDescription) {
      this.description = aParam.description;
    }
    const lAvecDocumentsJoints =
      this.tableauDocumentsJoints && this.tableauDocumentsJoints.count() > 0;
    if (lAvecDocumentsJoints || (this.avecDescription && this.description)) {
      if (
        lAvecDocumentsJoints &&
        this.tableauDocumentsJoints.count() === 1 &&
        (!this.avecDescription || !this.description)
      ) {
        window.open(
          GChaine.creerUrlBruteLienExterne(this.tableauDocumentsJoints.get(0)),
        );
      } else {
        this.afficher(aParam.id);
        if (!this.avecBandeau) {
          this.timer = window.setTimeout(() => {
            this.fermer();
          }, 3000);
        }
      }
    } else {
    }
  }
  fermer(...aParams) {
    window.clearTimeout(this.timer);
    super.fermer(...aParams);
  }
  composeContenu() {
    const lContenus = [];
    const lEstAvecDocJoints =
      !!this.tableauDocumentsJoints && this.tableauDocumentsJoints.count() > 0;
    if (this.avecDescription && this.description) {
      const lClasses = lEstAvecDocJoints ? "EspaceBas10" : "";
      let lDescription;
      if (GChaine.contientAuMoinsUneURL(this.description)) {
        lDescription = GChaine.ajouterLiensURL(this.description);
      } else {
        lDescription = this.description;
      }
      lContenus.push(
        '<div class="',
        lClasses,
        '">',
        GChaine.replaceRCToHTML(lDescription),
        "</div>",
      );
    }
    if (lEstAvecDocJoints) {
      lContenus.push("<div>");
      lContenus.push('<table class="Tableau full-width cellpadding-3">');
      for (let I = 0; I < this.tableauDocumentsJoints.count(); I++) {
        const lDocumentJoint = this.tableauDocumentsJoints.get(I);
        lContenus.push("<tr><td>");
        if (lDocumentJoint.getEtat() === EGenreEtat.Aucun) {
          const lGenreRessource = lDocumentJoint.genrRessource
            ? lDocumentJoint.genrRessource
            : this.genrePJ;
          lContenus.push(
            GChaine.composerUrlLienExterne({
              documentJoint: lDocumentJoint,
              genreDocumentJoint: EGenreDocumentJoint.Fichier,
              genreRessource: lGenreRessource,
              libelleEcran: lDocumentJoint.libelleEcran,
            }),
          );
        } else {
          lContenus.push(lDocumentJoint.getLibelle());
        }
        lContenus.push("</td></tr>");
      }
      lContenus.push("</table>");
      lContenus.push("</div>");
    }
    const H = [];
    if (lContenus.length > 0) {
      H.push(
        '<div class="Espace" onmouseover="',
        this.Nom,
        '.surSurvol (true)" onmouseout="',
        this.Nom,
        '.surSurvol (false)">',
        lContenus.join(""),
        "</div>",
      );
    }
    return H.join("");
  }
  surSurvol(aSurSurvol) {
    if (this._surSurvol && !aSurSurvol && !this.avecBandeau) {
      this.timer = window.setTimeout(this.Nom + ".fermer ()", 1000);
    }
    this._surSurvol = aSurSurvol;
    if (this._surSurvol && !this.avecBandeau) {
      window.clearTimeout(this.timer);
    }
  }
}
module.exports = { ObjetFicheDocumentsJoints };

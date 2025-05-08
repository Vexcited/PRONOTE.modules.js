const { GDate } = require("ObjetDate.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_PageRemplacements extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees.ListeCours);
    this.setOptions({ avecSelection: false });
  }
  getZoneGauche(aDonnees) {
    let H = [];
    if (aDonnees.article.Date) {
      let lDate = GDate.formatDate(aDonnees.article.Date, "%JJ %MMM");
      H.push(
        `<time class="date-contain ie-line-color bottom" style="--color-line :#2338BB;" datetime="${GDate.formatDate(aDonnees.article.Date, "%MM-%JJ")}">${lDate}</time>`,
      );
    }
    return H.join("");
  }
  getTitreZonePrincipale(aDonnees) {
    let H = [];
    if (aDonnees.article.ListeProfesseurs) {
      aDonnees.article.ListeProfesseurs.parcourir((aProf) => {
        if (aProf.getLibelle()) {
          H.push(
            `<div ie-ellipsis class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
          );
        }
      });
    }
    return H.join("");
  }
  getInfosSuppZonePrincipale(aDonnees) {
    let H = [];
    if (aDonnees.article.Matiere !== 0) {
      H.push(
        `<div ie-ellipsis class="ie-sous-titre capitalize">${aDonnees.article.Matiere.getLibelle()}</div>`,
      );
    }
    if (aDonnees.article.ListeProfesseurs) {
      aDonnees.article.ListeProfesseurs.parcourir((aProf) => {
        if (aDonnees.article.HeureDebut && aDonnees.article.HeureFin) {
          H.push(
            `<div class="ie-sous-titre ">${GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [aDonnees.article.HeureDebut, aDonnees.article.HeureFin])}</div>`,
          );
        }
      });
    }
    return H.join("");
  }
  getZoneMessageLarge(aDonnees) {
    let H = [];
    if (aDonnees.article.ListeRemplacements.count() === 0) {
      H.push(
        `<div class="ie-titre ">${GTraductions.getValeur("PageRemplacement.Annule")}</div>`,
      );
    }
    if (aDonnees.article.ListeRemplacements.count() !== 0) {
      H.push(
        `<div ie-ellipsis class="ie-titre m-bottom-l"> ${GTraductions.getValeur("PageRemplacement.RemplacePar")}</div>`,
      );
      aDonnees.article.ListeRemplacements.parcourir((aRemp) => {
        if (aRemp.ListeProfesseurs) {
          aRemp.ListeProfesseurs.parcourir((aProf) => {
            H.push(
              `<div class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
            );
          });
        }
        if (aRemp.Matiere) {
          H.push(
            `<div class="ie-sous-titre capitalize">${aRemp.Matiere.getLibelle()}</div>`,
          );
        }
        if (aRemp.HeureDebut && aRemp.HeureFin) {
          H.push(
            `<div class="ie-sous-titre ">${GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [aRemp.HeureDebut, aRemp.HeureFin])}</div>`,
          );
        }
      });
    }
    return H.join("");
  }
}
module.exports = DonneesListe_PageRemplacements;

exports.ObjetMenuCantine = void 0;
require("IEHtml.Scroll.js");
const ObjetDate_1 = require("ObjetDate");
const ObjetInterface_1 = require("ObjetInterface");
const UtilitaireMenus_1 = require("UtilitaireMenus");
class ObjetMenuCantine extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = null;
    this.dateDebutCycle = null;
    this.dateFinCycle = null;
    this.genreRepas = null;
  }
  setDonnees(aParams) {
    if (aParams) {
      this.donnees = aParams.donnees;
      if (IE.estMobile) {
        const lParams = aParams;
        this.genreRepas = lParams.genreRepas;
      } else {
        const lParams = aParams;
        this.dateDebutCycle = lParams.dateDebutCycle;
        this.dateFinCycle = lParams.dateFinCycle;
        this.cycles = lParams.cycles;
      }
    }
    this.afficher(this.construireAffichage());
  }
  afficherMessage(aHtml) {
    this.afficher(aHtml);
  }
  construireAffichage() {
    var _a;
    const H = [];
    if (this.donnees) {
      H.push(`<div class="menu-cantine">`);
      if (IE.estMobile) {
        const lDonnees = this.donnees;
        const lGenre = lDonnees.listeRepas.get(0).getGenre();
        H.push(
          UtilitaireMenus_1.UtilitaireMenus.composeRepas(
            lDonnees,
            (_a = this.genreRepas) !== null && _a !== void 0 ? _a : lGenre,
          ),
        );
      } else if (this.dateDebutCycle && this.dateFinCycle) {
        let lIndice = 0;
        const lCycleDebut = this.cycles.cycleDeLaDate(this.dateDebutCycle);
        for (let i = 0; i <= this.cycles.nombreJoursOuvresParCycle() - 1; i++) {
          let lDate = this.cycles.jourCycleEnDate(i, lCycleDebut);
          let lElements = this.donnees.getListeElements((aJours) =>
            ObjetDate_1.GDate.estJourEgal(lDate, aJours.date),
          );
          const lParams = Object.assign(
            lElements.count() > 0 ? lElements.get(0) : { estJourVide: true },
            {
              date: lDate,
              indice: lIndice,
              estDernierJourCycle: ObjetDate_1.GDate.estJourEgal(
                lDate,
                this.dateFinCycle,
              ),
            },
          );
          H.push(UtilitaireMenus_1.UtilitaireMenus.composeColonne(lParams));
          lIndice++;
        }
      }
      H.push(`</div>`);
    }
    return H.join("");
  }
  setFiltre(aValue) {
    this.avecDetailAllergenes = aValue;
    return this;
  }
}
exports.ObjetMenuCantine = ObjetMenuCantine;

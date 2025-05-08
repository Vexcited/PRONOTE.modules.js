exports.ObjetSelecteurMotifInfirmerie = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetSelecteurMotifInfirmerie extends _ObjetSelecteur_1._ObjetSelecteur {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
        "RecapAbs.selectionIssuesInfirmerie",
      ),
      titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
        "RecapAbs.issuesInfirmerie",
      ),
    });
  }
  construireInstanceFenetreSelection() {
    this.identFenetreSelection = this.addFenetre(
      ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
      this.evntFenetreSelection,
      this.initFenetreSelection,
    );
  }
  initFenetreSelection(aInstance) {
    aInstance.setAutoriseEltAucun(true);
    aInstance.setOptionsFenetre({
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
    aInstance.indexBtnValider = 1;
  }
  evntBtnSelection() {
    this.getInstance(this.identFenetreSelection).setDonnees({
      listeRessources: this.listeTotale,
      listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
        this.listeSelection,
      ),
      titre: this._options.titreFenetre,
      genreRessource: Enumere_Ressource_1.EGenreRessource.Infirmerie,
    });
  }
}
exports.ObjetSelecteurMotifInfirmerie = ObjetSelecteurMotifInfirmerie;

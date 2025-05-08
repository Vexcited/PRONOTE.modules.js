const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Mention } = require("DonneesListe_Mention.js");
class ObjetFenetre_Mention extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.listeMention = new ObjetListeElements();
    this.titreListe = GTraductions.getValeur("Appreciations.Mentions");
  }
  construireInstances() {
    this.IdentListe = this.add(
      ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
  }
  initialiserListe(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_Mention.colonnes.libelle,
      titre: this.titreListe,
      taille: "100%",
    });
    lColonnes.push({
      id: DonneesListe_Mention.colonnes.imprimee,
      titre: { classeCssImage: "Image_Publie" },
      taille: 20,
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  setParametresMention(aTitreListe) {
    this.titreListe = aTitreListe;
  }
  setDonnees(aListeMention) {
    this.afficher(null);
    this.listeMention = aListeMention;
    this.setBoutonActif(1, false);
    this.initialiserListe(this.getInstance(this.IdentListe));
    this.getInstance(this.IdentListe).setDonnees(
      new DonneesListe_Mention(this.listeMention),
    );
  }
  reset() {
    this.listeMention = new ObjetListeElements();
  }
  composeContenu() {
    const lHTML = [];
    lHTML.push(
      '<div class="table-contain full-size" id="' +
        this.getNomInstance(this.IdentListe) +
        '"></div>',
    );
    return lHTML.join("");
  }
  getMentionSelectionnee() {
    if (!!this.listeMention) {
      return this.listeMention.get(this.posMention);
    }
    return null;
  }
  evenementSurListe(aParametres, aGenreEvenementListe, I, J) {
    this.setBoutonActif(
      1,
      aGenreEvenementListe === EGenreEvenementListe.Selection,
    );
    this.posMention = J;
    switch (aGenreEvenementListe) {
      case EGenreEvenementListe.Selection:
        this.surValidation(1);
        break;
      case EGenreEvenementListe.SelectionDblClick:
        this.surValidation(1);
        break;
      case EGenreEvenementListe.Edition:
        this.surValidation(1);
        break;
    }
  }
  traiterSelectionEleve(aLigne) {
    if (aLigne) {
      const lLibelleWAI = aLigne.ListeAppreciations.ListeElements[0].LibelleWAI;
      this.getInstance(this.IdentListe).setOptionsListe({
        labelWAI: lLibelleWAI,
      });
    }
  }
}
module.exports = { ObjetFenetre_Mention };

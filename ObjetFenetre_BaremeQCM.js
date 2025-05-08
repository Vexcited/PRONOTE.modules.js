exports.ObjetFenetre_BaremeQCM = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetFenetre_BaremeQCM extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identListeBareme = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListeBareme.bind(this),
      this.initialiserListeBareme,
    );
  }
  composeContenu() {
    const H = [];
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", {
          style: "height:100%;",
          id: this.getInstance(this.identListeBareme).getNom(),
        }),
      ),
    );
    return H.join("");
  }
  setDonnees() {
    this.afficher();
    this.setBoutonActif(1, false);
    this.listeBareme = new ObjetListeElements_1.ObjetListeElements();
    for (
      let i = GParametres.minBaremeQuestionQCM;
      i <= GParametres.maxBaremeQuestionQCM;
      i++
    ) {
      this.listeBareme.addElement(
        new ObjetElement_1.ObjetElement("" + i, null, null, i),
      );
    }
    this.getInstance(this.identListeBareme).setDonnees(
      new DonneesListe_BaremeQCM(this.listeBareme),
    );
  }
  surValidation(aNumeroBouton) {
    this.callback.appel(
      aNumeroBouton,
      this.listeBareme.get(
        this.getInstance(this.identListeBareme).getSelection(),
      ),
    );
    this.fermer();
  }
  initialiserListeBareme(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_BaremeQCM.colonnes.valeur,
      taille: "100%",
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  evenementSurListeBareme(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
        this.setBoutonActif(1, true);
        break;
    }
  }
}
exports.ObjetFenetre_BaremeQCM = ObjetFenetre_BaremeQCM;
class DonneesListe_BaremeQCM extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
    this.creerIndexUnique("Libelle");
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BaremeQCM.colonnes.valeur:
        return aParams.article.getLibelle();
    }
    return "";
  }
}
DonneesListe_BaremeQCM.colonnes = { valeur: "DL_Bareme_valeur" };

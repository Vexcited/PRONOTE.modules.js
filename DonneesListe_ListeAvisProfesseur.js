exports.DonneesListe_ListeAvisProfesseur = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_ListeAvisProfesseur extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({ avecEdition: false, avecSuppression: false });
  }
  avecMenuContextuel() {
    return false;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeAvisProfesseur.colonnes.matiere:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneEleve:
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneClasseGroupe:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeAvisProfesseur.colonnes.matiere: {
        const lValeurMatiere = [];
        lValeurMatiere.push(
          '<span class="Gras">',
          aParams.article.libelleMatiere,
          "</span>",
        );
        if (
          !!aParams.article.listeProfesseurs &&
          aParams.article.listeProfesseurs.count() > 0
        ) {
          lValeurMatiere.push("<br/>");
          lValeurMatiere.push(
            aParams.article.listeProfesseurs.getTableauLibelles(),
          );
        }
        return lValeurMatiere.join("");
      }
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneEleve:
        return aParams.article.moyenneEleve
          ? aParams.article.moyenneEleve.toString()
          : "";
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneClasseGroupe:
        return aParams.article.moyenneReference
          ? aParams.article.moyenneReference.toString()
          : "";
      case DonneesListe_ListeAvisProfesseur.colonnes.avis:
        return aParams.article.avisProfesseur || "";
    }
    return "";
  }
  getTri(aColonne, aGenreTri) {
    const lTris = [];
    switch (this.getId(aColonne)) {
      case DonneesListe_ListeAvisProfesseur.colonnes.matiere:
        lTris.push(ObjetTri_1.ObjetTri.init("libelleMatiere", aGenreTri));
        break;
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneEleve:
        lTris.push(ObjetTri_1.ObjetTri.init("moyenneEleve", aGenreTri));
        break;
      case DonneesListe_ListeAvisProfesseur.colonnes.moyenneClasseGroupe:
        lTris.push(ObjetTri_1.ObjetTri.init("moyenneReference", aGenreTri));
        break;
    }
    lTris.push(ObjetTri_1.ObjetTri.init("libelleMatiere"));
    return lTris;
  }
}
exports.DonneesListe_ListeAvisProfesseur = DonneesListe_ListeAvisProfesseur;
DonneesListe_ListeAvisProfesseur.colonnes = {
  matiere: "DL_ListeAvis_matiere",
  moyenneEleve: "DL_ListeAvis_moyEleve",
  moyenneClasseGroupe: "DL_ListeAvis_moyClasseGroupe",
  avis: "DL_ListeAvis_avis",
};

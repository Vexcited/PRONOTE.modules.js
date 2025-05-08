exports.DonneesListe_ReponseASaisir = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIndexsUnique_1 = require("ObjetIndexsUnique");
class DonneesListe_ReponseASaisir extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aGenre, aCaseSensitive, aHauteurDonnees) {
    super(aDonnees);
    if (
      aGenre ===
        TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
          .GEQ_ShortAnswer &&
      aCaseSensitive
    ) {
      this.creerIndexUnique([
        ObjetIndexsUnique_1.ObjetIndexsUnique.ajouterChamp(
          function (a) {
            return a
              .getLibelle()
              .replace(/^\s+/, "")
              .replace(/\s+$/, "")
              .replace(/\s+/gi, " ");
          },
          true,
          true,
        ),
      ]);
    } else if (
      aGenre ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_ShortAnswer
    ) {
      this.creerIndexUnique([
        ObjetIndexsUnique_1.ObjetIndexsUnique.ajouterChamp(
          function (a) {
            return ObjetChaine_1.GChaine.latinize(
              a
                .getLibelle()
                .replace(/^\s+/, "")
                .replace(/\s+$/, "")
                .replace(/\s+/gi, " "),
            ).toLowerCase();
          },
          true,
          false,
        ),
      ]);
    } else {
      this.creerIndexUnique([
        ObjetIndexsUnique_1.ObjetIndexsUnique.ajouterChamp(
          function (a) {
            return ObjetChaine_1.GChaine.latinize(
              a
                .getLibelle()
                .replace(/\s+/gi, "")
                .replace(/\./, ",")
                .replace(/٫/gi, ",")
                .replace(/²/gi, "2")
                .replace(/³/gi, "3"),
            ).toLowerCase();
          },
          true,
          false,
        ),
      ]);
    }
    this.autoriserValeurNumeriqueUniquement =
      aGenre ===
      TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
        .GEQ_NumericalAnswer;
    const lOptions = {
      avecEvnt_Creation: true,
      avecEvnt_ApresEdition: true,
      avecEvnt_Suppression: true,
    };
    if (aHauteurDonnees > 0) {
      $.extend(lOptions, { hauteurMinCellule: aHauteurDonnees });
    }
    this.setOptions(lOptions);
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ReponseASaisir.colonnes.responsePossible:
        return aParams.article.getLibelle();
      case DonneesListe_ReponseASaisir.colonnes.commentaire:
        return aParams.article.feedback || "";
    }
    return "";
  }
  getTypeValeur() {
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  _estUneValeurDeReponseAutorisee(aValeur) {
    let lEstUneValeurAutorisee = true;
    if (this.autoriserValeurNumeriqueUniquement) {
      if (aValeur) {
        aValeur = aValeur.replace(/,/, ".");
      }
      if (isNaN(aValeur)) {
        lEstUneValeurAutorisee = false;
      }
    }
    return lEstUneValeurAutorisee;
  }
  surCreation(D, V) {
    if (!this._estUneValeurDeReponseAutorisee(V[0])) {
      return ObjetTraduction_1.GTraductions.getValeur(
        "SaisieQCM.ReponseDoitEtreNumerique",
      );
    }
    D.Libelle = V[0]
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/\s+/gi, " ");
    D.feedback = "";
  }
  getMessageCreationImpossible(aMessageErreur) {
    return aMessageErreur;
  }
  autoriserChaineVideSurEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_ReponseASaisir.colonnes.commentaire
    );
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_ReponseASaisir.colonnes.responsePossible: {
        let lMessageRefusEdition = "";
        if (!this._estUneValeurDeReponseAutorisee(V)) {
          lMessageRefusEdition = ObjetTraduction_1.GTraductions.getValeur(
            "SaisieQCM.ReponseDoitEtreNumerique",
          );
        }
        if (lMessageRefusEdition) {
          GApplication.getMessage().afficher({ message: lMessageRefusEdition });
        } else {
          aParams.article.setLibelle(V);
        }
        break;
      }
      case DonneesListe_ReponseASaisir.colonnes.commentaire:
        aParams.article.feedback = V;
        break;
      default:
        break;
    }
    if (aParams.article.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
      aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      aParams.article.Etat = Enumere_Etat_1.EGenreEtat.Modification;
    }
  }
  getTailleTexteMax(aParams) {
    return aParams.idColonne ===
      DonneesListe_ReponseASaisir.colonnes.responsePossible
      ? 35
      : 0;
  }
}
exports.DonneesListe_ReponseASaisir = DonneesListe_ReponseASaisir;
DonneesListe_ReponseASaisir.colonnes = {
  responsePossible: "DonneesListe_ReponseASaisir_reponse",
  commentaire: "DonneesListe_ReponseASaisir_commentaire",
};

const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { TypeNote } = require("TypeNote.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreNiveauDAcquisition,
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const CommandeMenuContextuelCompetencesQCM = {
  ChoisirCompetenceDansReferentiel: "cmdMenu_ChoixCompetenceDansReferentiel",
};
class DonneesListe_EvaluationsQCM extends ObjetDonneesListe {
  constructor(aDonnees, aOptions) {
    super(aDonnees);
    if (aOptions) {
      this.getValeurMaxCoefficientCompetence =
        aOptions.getValeurMaxCoefficientCompetence;
      this.avecEditionTBMaitrise = !!aOptions.avecEditionTBMaitrise;
      this.avecCreationNouvelleCompetence =
        !!aOptions.avecCreationNouvelleCompetence;
      this.callbackChoixCompetenceDansReferentiel =
        aOptions.callbackChoixCompetenceDansReferentiel;
      this.avecMessageAucuneMatierePourEvaluations =
        !!aOptions.avecMessageAucuneMatierePourEvaluations;
      this.listePaliersDesReferentielsUniques =
        aOptions.listePaliersDesReferentielsUniques;
      if (aOptions.hauteurMinCellule) {
        this.setOptions({ hauteurMinCellule: aOptions.hauteurMinCellule });
      }
    }
  }
  _estUnLibelleUnique(aArticle, V) {
    let lEstUnLibelleUnique = true;
    this.Donnees.parcourir((aElementListe) => {
      if (
        aElementListe !== aArticle &&
        aElementListe.getEtat() !== EGenreEtat.Suppression &&
        aElementListe.getLibelle() === V
      ) {
        lEstUnLibelleUnique = false;
        return false;
      }
    });
    return lEstUnLibelleUnique;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.libelle:
        return aParams.article.getLibelle();
      case DonneesListe_EvaluationsQCM.colonnes.maitrise: {
        let lGenreNiveau;
        if (aParams.article.tbMaitrise) {
          lGenreNiveau = EGenreNiveauDAcquisition.Expert;
        } else {
          lGenreNiveau = EGenreNiveauDAcquisition.Acquis;
        }
        return EGenreNiveauDAcquisitionUtil.getImage(
          GParametres.listeNiveauxDAcquisitions.getElementParGenre(
            lGenreNiveau,
          ),
        );
      }
      case DonneesListe_EvaluationsQCM.colonnes.coef:
        return aParams.article
          ? new TypeNote(aParams.article.coefficient)
          : null;
      default:
        break;
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.maitrise:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_EvaluationsQCM.colonnes.coef:
        return ObjetDonneesListe.ETypeCellule.Note;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getHintHtmlForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.libelle:
        if (aParams.article && aParams.article.palier) {
          return (
            aParams.article.getLibelle() +
            " (" +
            aParams.article.palier.getLibelle() +
            ")"
          );
        }
    }
    return "";
  }
  getClass(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.maitrise:
        return "AlignementMilieu";
    }
    return "";
  }
  avecEvenementCreation() {
    return (
      !this.avecCreationNouvelleCompetence ||
      this.avecMessageAucuneMatierePourEvaluations
    );
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.coef:
        return true;
    }
    return false;
  }
  avecEvenementSelectionClick(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.maitrise:
        return this.avecEditionTBMaitrise;
    }
    return false;
  }
  getCouleurCellule(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.maitrise:
        if (this.avecEditionTBMaitrise) {
          return ObjetDonneesListe.ECouleurCellule.Blanc;
        }
        break;
    }
  }
  avecEvenementApresEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.coef:
        return true;
    }
    return false;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationsQCM.colonnes.coef:
        if (!V.estUneNoteVide()) {
          aParams.article.coefficient = V.getValeur();
        }
        break;
      default:
        break;
    }
  }
  getOptionsNote() {
    return {
      avecVirgule: false,
      afficherAvecVirgule: false,
      listeAnnotations: [],
      sansNotePossible: false,
      min: 0,
      max: !!this.getValeurMaxCoefficientCompetence
        ? this.getValeurMaxCoefficientCompetence
        : 100,
    };
  }
  avecMenuContextuel() {
    return true;
  }
  remplirMenuContextuel(aParametres) {
    let lAvecCommandeActive = false,
      lCommande;
    if (aParametres.ligne === -1) {
      if (!this.avecCreationNouvelleCompetence) {
        return;
      }
      aParametres.menuContextuel.addCommande(
        CommandeMenuContextuelCompetencesQCM.ChoisirCompetenceDansReferentiel,
        GTraductions.getValeur(
          "QCM_Divers.listeCompetences.ChoisirCompetencesParmiExistantes",
        ),
      );
      if (
        this.listePaliersDesReferentielsUniques &&
        this.listePaliersDesReferentielsUniques.count() > 1
      ) {
        aParametres.menuContextuel.addSousMenu(
          GTraductions.getValeur(
            "QCM_Divers.listeCompetences.SaisirNouvelleCompetence",
          ),
          (aInstanceSousMenu) => {
            for (const lPalierRefUnique of this
              .listePaliersDesReferentielsUniques) {
              aInstanceSousMenu.addCommande(
                EGenreCommandeMenu.Creation,
                lPalierRefUnique.getLibelle(),
                true,
                { palierRefUniqueConcerne: lPalierRefUnique },
              );
            }
          },
        );
      } else {
        const lPalierReferentielUniqueConcerne =
          this.listePaliersDesReferentielsUniques.get(0);
        aParametres.menuContextuel.addCommande(
          EGenreCommandeMenu.Creation,
          GTraductions.getValeur(
            "QCM_Divers.listeCompetences.SaisirNouvelleCompetence",
          ),
          true,
          { palierRefUniqueConcerne: lPalierReferentielUniqueConcerne },
        );
      }
    } else {
      lCommande = aParametres.menuContextuel.addCommande(
        EGenreCommandeMenu.Suppression,
        GTraductions.getValeur("liste.supprimer"),
        !aParametres.nonEditable &&
          aParametres &&
          aParametres.avecSuppression &&
          this._avecSuppression(aParametres),
      );
      if (lCommande.actif) {
        lAvecCommandeActive = true;
      }
      return lAvecCommandeActive;
    }
  }
  evenementMenuContextuel(aParametres) {
    switch (aParametres.numeroMenu) {
      case CommandeMenuContextuelCompetencesQCM.ChoisirCompetenceDansReferentiel:
        if (!!this.callbackChoixCompetenceDansReferentiel) {
          this.callbackChoixCompetenceDansReferentiel();
        }
        break;
    }
    return false;
  }
  surCreation(D, V) {
    if (!!D) {
      const lLibelle = V && V[0] ? V[0].trim() : "";
      if (V.data) {
        const lPalierReferentielUniqueConcerne = V.data.palierRefUniqueConcerne;
        if (lPalierReferentielUniqueConcerne) {
          D.palier = lPalierReferentielUniqueConcerne;
        }
      }
      const lEstUnLibelleUnique = this._estUnLibelleUnique(D, lLibelle);
      if (lEstUnLibelleUnique) {
        D.Numero = "0";
        D.Genre = EGenreRessource.Competence;
        D.coefficient = 1;
        D.setLibelle(lLibelle);
      } else {
        return D;
      }
    }
  }
}
DonneesListe_EvaluationsQCM.getOptionsListe = function (aPourEdition) {
  const lColonnes = [
    {
      id: DonneesListe_EvaluationsQCM.colonnes.libelle,
      taille: "100%",
      titre: GTraductions.getValeur(
        "QCM_Divers.listeCompetences.colLibelleCompetences",
      ),
    },
    {
      id: DonneesListe_EvaluationsQCM.colonnes.maitrise,
      taille: 40,
      titre: GTraductions.getValeur("QCM_Divers.listeCompetences.colMaitrise"),
      hint: GTraductions.getValeur(
        "QCM_Divers.listeCompetences.hintColMaitrise",
      ),
    },
    {
      id: DonneesListe_EvaluationsQCM.colonnes.coef,
      taille: 40,
      titre: GTraductions.getValeur("QCM_Divers.listeCompetences.colCoef"),
    },
  ];
  const lOptions = {
    colonnes: lColonnes,
    colonnesCachees: [],
    avecListeNeutre: true,
    hauteurAdapteContenu: true,
    hauteurMaxAdapteContenu: 150,
    paddingCelluleTB: 3,
  };
  if (aPourEdition) {
    $.extend(lOptions, {
      titreCreation: GTraductions.getValeur(
        "QCM_Divers.listeCompetences.ajouterCompetences",
      ),
      avecLigneCreation: true,
      listeCreations: 0,
      hauteurMaxAdapteContenu: 130,
    });
  }
  return lOptions;
};
DonneesListe_EvaluationsQCM.colonnes = {
  libelle: "DL_EvalQCM_Libelle",
  maitrise: "DL_EvalQCM_Maitrise",
  coef: "DL_EvalQCM_Coeff",
};
module.exports = { DonneesListe_EvaluationsQCM };

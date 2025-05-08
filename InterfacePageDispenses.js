const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { ObjetRequetePageDispenses } = require("ObjetRequetePageDispenses.js");
const { DonneesListe_Dispenses } = require("DonneesListe_Dispenses.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TUtilitaireDispenses } = require("UtilitaireDispenses.js");
const { InterfacePageEtablissement } = require("InterfacePageEtablissement.js");
Requetes.inscrire("SaisieDispenses", ObjetRequeteSaisie);
class InterfacePageDispenses extends InterfacePageEtablissement {
  constructor(...aParams) {
    super(...aParams);
    this._autorisations = {
      saisie: GApplication.droits.get(TypeDroits.dispenses.saisie),
    };
  }
  initialiserListe(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.eleve,
      taille: 200,
      titre: GTraductions.getValeur("Eleve"),
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.classe,
      taille: 100,
      titre: GTraductions.getValeur("Classe"),
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.matiere,
      taille: 210,
      titre: GTraductions.getValeur("Matiere"),
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.date,
      taille: 200,
      titre: GTraductions.getValeur("Date"),
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.presenceObligatoire,
      taille: 70,
      titre: {
        libelle: GTraductions.getValeur("dispenses.presenceObligatoire"),
        nbLignes: 2,
      },
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.heuresPerdues,
      taille: 55,
      titre: { libelle: GTraductions.getValeur("HeuresPerdues"), nbLignes: 2 },
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.commentaire,
      taille: 250,
      titre: GTraductions.getValeur("Commentaire"),
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.fichierJoint,
      taille: 25,
      titre: [
        {
          libelle: GTraductions.getValeur("dispenses.pj"),
          title: GTraductions.getValeur("dispenses.piecesjointes"),
          avecFusionColonne: true,
        },
        { classeCssImage: "Image_Trombone" },
      ],
    });
    lColonnes.push({
      id: DonneesListe_Dispenses.colonnes.publierPJFeuilleDA,
      taille: 25,
      titre: [
        {
          libelle: GTraductions.getValeur("dispenses.pj"),
          title: GTraductions.getValeur("dispenses.piecesjointes"),
          avecFusionColonne: true,
        },
        {
          classeCssImage: "Image_Publie",
          title: GTraductions.getValeur("dispenses.publicationPJFeuilleDAppel"),
        },
      ],
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
    });
  }
  evenementSurListe(aParam, aGenreEvenementListe) {
    switch (aGenreEvenementListe) {
      case EGenreEvenementListe.Edition:
        switch (aParam.idColonne) {
          case DonneesListe_Dispenses.colonnes.presenceObligatoire:
            aParam.article.presenceOblig = !aParam.article.presenceOblig;
            _actualiserApresSaisie.call(this, aParam.article);
            break;
          case DonneesListe_Dispenses.colonnes.heuresPerdues:
            break;
        }
        break;
      case EGenreEvenementListe.ApresSuppression:
        break;
    }
  }
  requetePage(aNavigation) {
    new ObjetRequetePageDispenses(
      this,
      this._reponseRequetePageDispenses,
    ).lancerRequete({
      dateDebut: aNavigation.dateDebut,
      dateFin: aNavigation.dateFin,
    });
  }
  actionApresSaisieDocument() {
    this.getInstance(this.identListe).actualiser();
  }
  valider() {
    this.listeDispenses.setSerialisateurJSON({
      methodeSerialisation:
        TUtilitaireDispenses.serialisationDonnees.bind(this),
    });
    Requetes("SaisieDispenses", this, this.actionSurValidation)
      .addUpload({ listeFichiers: this.listeFichiersUpload })
      .lancerRequete({ listeDispenses: this.listeDispenses });
  }
  _reponseRequetePageDispenses(aJSON) {
    this.listeDispenses = aJSON.listeDispenses;
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_Dispenses({
        donnees: aJSON.listeDispenses,
        autorisations: this._autorisations,
      }).setOptions({ saisie: TUtilitaireDispenses.saisieDocument.bind(this) }),
    );
  }
}
function _actualiserApresSaisie(aDonnee) {
  aDonnee.setEtat(EGenreEtat.Modification);
  this.setEtatSaisie(true);
  this.getInstance(this.identListe).actualiser();
}
module.exports = { InterfacePageDispenses };

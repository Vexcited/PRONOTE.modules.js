exports.ObjetRequeteSaisieCDTProgressions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
class ObjetRequeteSaisieCDTProgressions extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({ afficherMessageErreur: false });
  }
  lancerRequete(
    aListeProgressions,
    aListeDocumentsJoints,
    aListeCategories,
    aJSON,
  ) {
    Object.assign(
      this.JSON,
      {
        listeProgressions: aListeProgressions
          ? aListeProgressions.setSerialisateurJSON({
              methodeSerialisation: this._surValidationProgression.bind(this),
            })
          : null,
        listeCategories: aListeCategories,
        ListeFichiers: aListeDocumentsJoints
          ? aListeDocumentsJoints.setSerialisateurJSON({
              methodeSerialisation: this.surValidationFichier.bind(this),
            })
          : undefined,
        forcerSaisie: false,
      },
      aJSON,
    );
    return this.appelAsynchrone();
  }
  _surValidationProgression(aElement, aJSON) {
    if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
      return aElement.pourValidation();
    }
    aJSON.Matiere = aElement.matiere;
    aJSON.Niveau = aElement.niveau;
    let lResult = false;
    if (aElement.listeDossiers) {
      this._verifierOrdreDossiers(aElement.listeDossiers);
      aJSON.listeDossiers = aElement.listeDossiers;
      aJSON.listeDossiers.setSerialisateurJSON({
        methodeSerialisation: this._surValidationListeDossiers.bind(this),
      });
      aJSON.listeDossiers = aJSON.listeDossiers.toJSON();
      lResult = aJSON.listeDossiers.length > 0;
    }
    if (aElement.creationAutomatique) {
      aJSON.creationAuto = true;
      if (aElement.copieReference) {
        aJSON.copieDeProgression = aElement.copieReference;
      } else if (aElement.programmeReference) {
        aJSON.programmeReference = aElement.programmeReference.toJSON();
        aJSON.programmeReference.strMatiere =
          aElement.programmeReference.strMatiere;
        aJSON.programmeReference.strNiveau =
          aElement.programmeReference.strNiveau;
        aJSON.programmeReference.strFiliereXml =
          aElement.programmeReference.strFiliereXml;
        aJSON.programmeReference.strCycle =
          aElement.programmeReference.strCycle;
        aJSON.programmeReference.estNouveau =
          aElement.programmeReference.estNouveau;
      }
      if (aElement.avecOptionsProgression) {
        _serialiserOptionsProgression(aElement, aJSON);
      }
      lResult = true;
    } else {
      _serialiserOptionsProgression(aElement, aJSON);
    }
    return lResult ? true : null;
  }
  surValidationFichier(aElement, aJSON) {
    if (aElement.Fichier) {
      aJSON.IDFichier = ObjetChaine_1.GChaine.cardinalToStr(
        aElement.Fichier.idFichier,
      );
    }
    if (aElement.url) {
      aJSON.url = aElement.url;
    }
  }
  _surValidationListeDossiers(aElement, aJSON) {
    this._surValidationAjouterDetail(aElement, aJSON);
    if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
      return aElement.pourValidation();
    }
    let lResult = null;
    aJSON.listeDossiers = aElement.listeDossiers;
    if (aJSON.listeDossiers) {
      aJSON.listeDossiers.setSerialisateurJSON({
        methodeSerialisation: this._surValidationListeDossiers.bind(this),
      });
      aJSON.listeDossiers = aJSON.listeDossiers.toJSON();
      if (aJSON.listeDossiers.length > 0) {
        lResult = true;
      }
    }
    aJSON.listeElements = aElement.listeContenus;
    if (aJSON.listeElements) {
      aJSON.listeElements.setSerialisateurJSON({
        methodeSerialisation: this._surValidationAjouterDetail.bind(this),
      });
      aJSON.listeElements = aJSON.listeElements.toJSON();
      if (aJSON.listeElements.length > 0) {
        lResult = true;
      }
    }
    return lResult;
  }
  _surValidationAjouterDetail(aElement, aJSON) {
    aJSON.Ordre = aElement.ordre;
    if (aElement.categorie) {
      aJSON.Categorie = aElement.categorie;
    }
    if (aElement.date) {
      aJSON.Date = aElement.date;
    }
    if (MethodesObjet_1.MethodesObjet.isString(aElement.descriptif)) {
      aJSON.Descriptif = new TypeChaineHtml_1.TypeChaineHtml(
        aElement.descriptif,
      );
    }
    aJSON.ListeDocumentsJoints = aElement.ListePieceJointe
      ? aElement.ListePieceJointe.setSerialisateurJSON({
          methodeSerialisation: this.surValidationFichier.bind(this),
        })
      : undefined;
    if (aElement.listeCoursAffectes) {
      aJSON.listeCoursAffectes = aElement.listeCoursAffectes;
      aJSON.listeCoursAffectes.setSerialisateurJSON({
        methodeSerialisation: this._surValidationCoursAffectes.bind(this),
      });
    }
    if (aElement.ListeThemes) {
      aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
  }
  _surValidationCoursAffectes(aElement, aJSON) {
    aJSON.date = aElement.DateDuCours;
    return true;
  }
  _verifierOrdreDossiers(aListeDossiers) {
    if (!aListeDossiers) {
      return;
    }
    const lNb = aListeDossiers.count();
    for (let i = 0; i < lNb; i++) {
      let lElement = aListeDossiers.get(i);
      if (lElement !== Enumere_Etat_1.EGenreEtat.Suppression) {
        if (lElement.ordre !== lElement._ordreOrigine) {
          lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        }
        if (lElement.listeDossiers) {
          this._verifierOrdreDossiers(lElement.listeDossiers);
        }
      }
    }
  }
  actionApresRequete(aGenreReponse) {
    Promise.resolve()
      .then(() => {
        if (
          this.JSONRapportSaisie &&
          this.messageErreur &&
          this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer &&
          this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer.count() > 0
        ) {
          return GApplication.getMessage()
            .afficher({
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              titre: "",
              message: this.messageErreur.message,
            })
            .then((aGenreAction) => {
              if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
                this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer.parcourir(
                  (aElement) => {
                    aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
                  },
                );
                return new ObjetRequeteSaisieCDTProgressions({}).lancerRequete(
                  null,
                  this.JSONRapportSaisie.listeFichiersSuppressionAConfirmer,
                  null,
                  { forcerSaisie: true },
                );
              }
            });
        } else if (this.messageErreur) {
          GApplication.getMessage().afficher(this.messageErreur);
        }
      })
      .then(() => {
        super.actionApresRequete(aGenreReponse);
      });
  }
}
exports.ObjetRequeteSaisieCDTProgressions = ObjetRequeteSaisieCDTProgressions;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieCDTProgressions",
  ObjetRequeteSaisieCDTProgressions,
);
function _serialiserOptionsProgression(aElement, aJSON) {
  aJSON.estPublic = !!aElement.estPublic;
  if (aElement.listeCoEnseignants) {
    aJSON.listeProfs = aElement.listeCoEnseignants;
    aJSON.listeProfs.setSerialisateurJSON({
      methodeSerialisation: function () {
        return true;
      },
    });
  }
}

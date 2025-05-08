const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreReponseSaisie } = require("ObjetRequeteJSON.js");
const DonneesListe_CategoriesDiscussion = require("DonneesListe_CategoriesDiscussion.js");
const {
  ObjetFenetre_SelecteurCouleur,
} = require("ObjetFenetre_SelecteurCouleur.js");
Requetes.inscrire("SaisieEtiquetteMessage", ObjetRequeteSaisie);
class ObjetFenetre_ListeCategoriesDiscussion extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({ largeur: 350 });
    this.parametres = {};
  }
  construireInstances() {
    this.IdentListe = this.add(ObjetListe, _evenementSurListe);
  }
  setDonnees(aParametres) {
    this.parametres = Object.assign(
      { listeMessages: null, listeEtiquettes: null },
      aParametres,
    );
    this.setOptionsFenetre({
      titre: this.parametres.listeMessages
        ? GTraductions.getValeur(
            "Messagerie.categorie.SelectionnerCategorieEtiquette",
          )
        : GTraductions.getValeur(
            "Messagerie.categorie.EditerCategorieEtiquette",
          ),
      listeBoutons: this.parametres.listeMessages
        ? [GTraductions.getValeur("Annuler"), GTraductions.getValeur("Valider")]
        : [GTraductions.getValeur("Fermer")],
    });
    this.afficher();
    const lColonnes = [];
    if (this.parametres.listeMessages) {
      lColonnes.push({
        id: DonneesListe_CategoriesDiscussion.colonnes.coche,
        titre: "",
        taille: 20,
      });
    }
    lColonnes.push(
      {
        id: DonneesListe_CategoriesDiscussion.colonnes.couleur,
        titre: { classeCssImage: "Image_PaletteDesCouleurs" },
        taille: 18,
      },
      {
        id: DonneesListe_CategoriesDiscussion.colonnes.nom,
        titre: GTraductions.getValeur("Messagerie.categorie.Nom"),
        taille: "100%",
      },
      {
        id: DonneesListe_CategoriesDiscussion.colonnes.abr,
        titre: GTraductions.getValeur("Messagerie.categorie.Abrev"),
        taille: IE.estMobile ? 45 : 40,
      },
    );
    this.getInstance(this.IdentListe).setOptionsListe({
      colonnes: lColonnes,
      avecLigneCreation: !GApplication.droits.get(TypeDroits.estEnConsultation),
      listeCreations: [DonneesListe_CategoriesDiscussion.colonnes.nom],
      titreCreation: IE.estMobile
        ? GTraductions.getValeur("liste.nouveau")
        : GTraductions.getValeur(
            "Messagerie.categorie.CreerCategorieEtiquette",
          ),
      boutons: IE.estMobile ? [] : [{ genre: ObjetListe.typeBouton.supprimer }],
      nonEditable: GApplication.droits.get(TypeDroits.estEnConsultation),
      hauteurAdapteContenu: true,
      hauteurMaxAdapteContenu: 500,
    });
    _actualiserListe.call(this);
    this.positionnerFenetre();
  }
  composeContenu() {
    const T = [];
    T.push('<div id="' + this.getNomInstance(this.IdentListe) + '"></div>');
    return T.join("");
  }
  surValidation(ANumeroBouton) {
    if (this._saisieEnCours) {
      return;
    }
    Promise.resolve()
      .then(() => {
        if (this.parametres.listeMessages && ANumeroBouton === 1) {
          const lListePossessions = new ObjetListeElements();
          this.parametres.listeMessages.parcourir((aMessage) => {
            if (aMessage.possessionMessage) {
              lListePossessions.addElement(aMessage.possessionMessage);
            } else if (aMessage.listePossessionsMessages) {
              lListePossessions.add(aMessage.listePossessionsMessages);
            } else {
            }
          });
          const lListeEtiquettesPlus = new ObjetListeElements(),
            lListeEtiquettesMoins = new ObjetListeElements();
          this.getInstance(this.IdentListe)
            .getListeArticles()
            .parcourir((aArticle) => {
              if (aArticle.getEtat() === EGenreEtat.Modification) {
                switch (aArticle.coche) {
                  case ObjetDonneesListe.EGenreCoche.Aucune:
                    lListeEtiquettesMoins.addElement(aArticle.etiquette);
                    break;
                  case ObjetDonneesListe.EGenreCoche.Verte:
                    lListeEtiquettesPlus.addElement(aArticle.etiquette);
                    break;
                  default:
                }
              }
            });
          if (
            lListeEtiquettesPlus.count() > 0 ||
            lListeEtiquettesMoins.count() > 0
          ) {
            return _saisie(this, {
              commande: "modifierEtiquettesMessages",
              listePossessionsMessages: lListePossessions.setSerialisateurJSON({
                ignorerEtatsElements: true,
              }),
              listeEtiquettesPlus: lListeEtiquettesPlus.setSerialisateurJSON({
                ignorerEtatsElements: true,
              }),
              listeEtiquettesMoins: lListeEtiquettesMoins.setSerialisateurJSON({
                ignorerEtatsElements: true,
              }),
            });
          }
        }
      })
      .then(() => {
        this.fermer();
      });
  }
}
function _saisie(aInstance, aParametres) {
  const lListe = aInstance.getInstance(aInstance.IdentListe);
  let lSelections = lListe.getListeElementsSelection();
  aInstance._saisieEnCours = true;
  return Requetes("SaisieEtiquetteMessage", aInstance)
    .lancerRequete(aParametres)
    .then(
      (aParams) => {
        if (aParams && aParams.genreReponse === EGenreReponseSaisie.succes) {
          aInstance.optionsFenetre.surSaisieEtiquette(aParametres.commande);
          if (aParams.JSONReponse && aParams.JSONReponse.listeEtiquettes) {
            aInstance.parametres.listeEtiquettes =
              aParams.JSONReponse.listeEtiquettes.trier();
          }
          if (
            aParametres.commande === "creation" &&
            aParams.JSONRapportSaisie &&
            aParams.JSONRapportSaisie.etiquetteCree
          ) {
            lSelections = new ObjetListeElements().addElement(
              aParams.JSONRapportSaisie.etiquetteCree,
            );
          }
        }
        return aParams;
      },
      () => {},
    )
    .then(() => {
      _actualiserListe.call(aInstance);
      lListe.setListeElementsSelection(lSelections);
    })
    .finally(() => {
      delete aInstance._saisieEnCours;
    });
}
function _evenementSurListe(aParams) {
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Edition:
      switch (aParams.idColonne) {
        case DonneesListe_CategoriesDiscussion.colonnes.couleur:
          ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SelecteurCouleur, {
            pere: this,
            evenement: function (aGenreBouton, aCouleur) {
              if (aGenreBouton === 1) {
                if (aParams.article.etiquette.couleur !== aCouleur) {
                  _saisie(this, {
                    commande: "couleur",
                    etiquette: aParams.article.etiquette,
                    couleur: aCouleur,
                  });
                }
              }
            },
          }).setDonnees(aParams.article.etiquette.couleur);
          break;
        default:
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      switch (aParams.idColonne) {
        case DonneesListe_CategoriesDiscussion.colonnes.nom:
          if (
            aParams.article.getLibelle() &&
            aParams.article.getLibelle() !==
              aParams.article.etiquette.getLibelle()
          ) {
            _saisie(this, {
              commande: "libelle",
              etiquette: aParams.article.etiquette,
              libelle: aParams.article.getLibelle(),
            });
          }
          break;
        case DonneesListe_CategoriesDiscussion.colonnes.abr:
          if (aParams.article.abr !== aParams.article.etiquette.abr) {
            _saisie(this, {
              commande: "abr",
              etiquette: aParams.article.etiquette,
              abr: aParams.article.abr,
            });
          }
          break;
        default:
      }
      break;
    case EGenreEvenementListe.ApresCreation:
      _saisie(this, {
        commande: "creation",
        libelle: aParams.article.getLibelle(),
      });
      break;
    case EGenreEvenementListe.Suppression:
      _saisie(this, {
        commande: "suppression",
        etiquette: aParams.article.etiquette,
      });
      break;
  }
}
function _actualiserListe() {
  const lListe = this.getInstance(this.IdentListe);
  const lOldListeAffichage = lListe.getDonneesListe()
    ? lListe.getListeArticles()
    : null;
  lListe.setDonnees(
    new DonneesListe_CategoriesDiscussion(this.parametres, lOldListeAffichage),
  );
}
module.exports = ObjetFenetre_ListeCategoriesDiscussion;

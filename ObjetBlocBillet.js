const { ObjetMoteurBlog, EGenreEvntBillet } = require("ObjetMoteurBlog.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeEtatCommentaireBillet } = require("TypeEtatCommentaireBillet.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_EditionCommentairesBlog,
} = require("ObjetFenetre_EditionCommentairesBlog.js");
const {
  ObjetFenetre_ListeRedacteursBillet,
} = require("ObjetFenetre_ListeRedacteursBillet.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { Identite } = require("ObjetIdentite.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GChaine } = require("ObjetChaine.js");
class ObjetBlocBillet extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.moteur = new ObjetMoteurBlog();
    this._saisieCommentaireEnCours = false;
    this.identGalerie = Identite.creerInstance(ObjetGalerieCarrousel, {
      pere: this,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      btnCommenterBillet: {
        event() {
          _afficherFenetreCommentaires.call(aInstance, {
            titre: GTraductions.getValeur("blog.ajouterCommentaire"),
          });
        },
        getDisabled() {
          let lSaisieCommentairePossible = false;
          if (
            aInstance.donnee &&
            aInstance.moteur.estBilletCommentable(aInstance.donnee) &&
            aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
              aInstance.donnee,
            )
          ) {
            lSaisieCommentairePossible = true;
          }
          return !lSaisieCommentairePossible;
        },
      },
      getTitleBtnCommenterBillet() {
        if (
          aInstance.donnee &&
          aInstance.moteur.estBilletCommentable(aInstance.donnee)
        ) {
          if (
            !aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
              aInstance.donnee,
            )
          ) {
            return GTraductions.getValeur(
              "blog.SaisieCommentaireEnFinDeSaisie",
            );
          }
        }
        return "";
      },
      btnVoirCommentaires: {
        event() {
          const lTitre = aInstance.getTitreCommentaires(aInstance.donnee);
          _afficherFenetreCommentaires.call(aInstance, { titre: lTitre });
        },
        getDisabled() {
          return false;
        },
      },
      avecBoutonVoirRedacteurs() {
        let lNbCoRedacteurs = 0;
        if (aInstance.donnee && aInstance.donnee.listeCoRedacteurs) {
          lNbCoRedacteurs = aInstance.donnee.listeCoRedacteurs.count();
        }
        return lNbCoRedacteurs > 0;
      },
      btnVoirRedacteurs: {
        event() {
          _afficherFenetreRedacteurs.call(aInstance);
        },
        getDisabled() {
          return false;
        },
      },
      nodePhoto: function () {
        $(this.node).on("error", function () {
          $(this).parent().find(".ibe_util_photo_i").show();
          $(this).remove();
        });
      },
      btnEditerBillet: {
        event() {
          aInstance.callback.appel(
            aInstance.donnee,
            EGenreEvntBillet.SurEdition,
          );
        },
      },
      btnPublierBillet: {
        event() {
          aInstance.callback.appel(
            aInstance.donnee,
            EGenreEvntBillet.SurModifPublication,
          );
        },
      },
      btnActionsBillet: {
        event() {
          const lBillet = aInstance.donnee;
          ObjetMenuContextuel.afficher({
            pere: aInstance,
            initCommandes: function (aMenu) {
              if (aInstance.moteur.estBilletEditable(lBillet)) {
                if (lBillet.estPublie) {
                  aMenu.add(
                    GTraductions.getValeur("blog.EditerBillet"),
                    true,
                    () => {
                      aInstance.callback.appel(
                        lBillet,
                        EGenreEvntBillet.SurEdition,
                      );
                    },
                  );
                  aMenu.add(
                    GTraductions.getValeur("blog.Depublier"),
                    true,
                    () => {
                      aInstance.callback.appel(
                        lBillet,
                        EGenreEvntBillet.SurModifPublication,
                      );
                    },
                  );
                }
                aMenu.add(
                  GTraductions.getValeur("blog.SupprimerBillet"),
                  true,
                  () => {
                    aInstance.moteur.afficherMessageConfirmationSuppressionBillet(
                      lBillet,
                      () => {
                        aInstance.callback.appel(
                          lBillet,
                          EGenreEvntBillet.surSuppression,
                        );
                      },
                    );
                  },
                );
              }
              if (aInstance.moteur.estBilletCommentable(lBillet)) {
                aMenu.addSeparateur();
                aMenu.add(
                  GTraductions.getValeur("blog.VoirLesCommentaires"),
                  true,
                  () => {
                    const lTitre = aInstance.getTitreCommentaires(lBillet);
                    _afficherFenetreCommentaires.call(aInstance, {
                      titre: lTitre,
                    });
                  },
                );
                const lCommenterEstPossible =
                  aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
                    lBillet,
                  );
                aMenu.add(
                  GTraductions.getValeur("blog.commenter"),
                  lCommenterEstPossible,
                  () => {
                    _afficherFenetreCommentaires.call(aInstance, {
                      titre: GTraductions.getValeur("blog.ajouterCommentaire"),
                    });
                  },
                );
              }
            },
          });
        },
      },
      btnSupprCommentaire: {
        event(aNumeroCommentaire) {
          let lCommentaire = null;
          if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
            lCommentaire =
              aInstance.donnee.listeCommentaires.getElementParNumero(
                aNumeroCommentaire,
              );
          }
          if (lCommentaire && lCommentaire.estSupprimable) {
            aInstance.moteur.afficherMessageConfirmationSuppressionCommentaire(
              lCommentaire,
              () => {
                aInstance.donnee.setEtat(EGenreEtat.Modification);
                aInstance.editerCommentaire(aInstance.donnee);
              },
            );
          }
        },
        getDisabled() {
          return GApplication.droits.get(TypeDroits.estEnConsultation);
        },
      },
      btnAcceptCommentaire: {
        event(aNumeroCommentaire) {
          let lCommentaire = null;
          if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
            lCommentaire =
              aInstance.donnee.listeCommentaires.getElementParNumero(
                aNumeroCommentaire,
              );
          }
          if (lCommentaire) {
            aInstance.moteur.accepterCommentaire(lCommentaire, () => {
              aInstance.donnee.setEtat(EGenreEtat.Modification);
              aInstance.editerCommentaire(aInstance.donnee);
            });
          }
        },
        getDisabled(aNumeroCommentaire) {
          let lEstDisabled = true;
          if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
            const lCommentaire =
              aInstance.donnee.listeCommentaires.getElementParNumero(
                aNumeroCommentaire,
              );
            if (lCommentaire) {
              lEstDisabled =
                lCommentaire.etatCommentaire ===
                  TypeEtatCommentaireBillet.ECB_Publie ||
                GApplication.droits.get(TypeDroits.estEnConsultation);
            }
          }
          return lEstDisabled;
        },
      },
      btnRejetCommentaire: {
        event(aNumeroCommentaire) {
          let lCommentaire = null;
          if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
            lCommentaire =
              aInstance.donnee.listeCommentaires.getElementParNumero(
                aNumeroCommentaire,
              );
          }
          if (lCommentaire) {
            aInstance.moteur.refuserCommentaire(lCommentaire, () => {
              aInstance.donnee.setEtat(EGenreEtat.Modification);
              aInstance.editerCommentaire(aInstance.donnee);
            });
          }
        },
        getDisabled(aNumeroCommentaire) {
          let lEstDisabled = true;
          if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
            const lCommentaire =
              aInstance.donnee.listeCommentaires.getElementParNumero(
                aNumeroCommentaire,
              );
            if (lCommentaire) {
              lEstDisabled =
                lCommentaire.etatCommentaire ===
                  TypeEtatCommentaireBillet.ECB_Refuse ||
                GApplication.droits.get(TypeDroits.estEnConsultation);
            }
          }
          return lEstDisabled;
        },
      },
    });
  }
  editerCommentaire(aBillet, aEditionIssueDeFenetre = false) {
    this.donnee = aBillet;
    this.donnee.setEtat(EGenreEtat.Modification);
    this.callback.appel(
      this.donnee,
      EGenreEvntBillet.SurEditionCommentaire,
      aEditionIssueDeFenetre,
    );
  }
  construireAffichage() {
    return this.afficher();
  }
  afficher() {
    return this.moteur.composeCardBillet(this.donnee, {
      idGalerieCarrousel: this.identGalerie.getNom(),
      avecAffichageNomBlog: this.options.avecAffichageNomBlog,
    });
  }
  recupererDonnees() {
    this.identGalerie.setOptions({
      dimensionPhoto: 200,
      nbMaxDiaposEnZoneVisible: 4,
      avecSuppression: false,
      avecEditionLegende: false,
      altImage: GTraductions.getValeur("blog.altImage"),
    });
    const lListeDocs = this.donnee.listeDocuments;
    const lListeImages = new ObjetListeElements();
    if (!!lListeDocs && lListeDocs.getNbrElementsExistes()) {
      lListeDocs.parcourir((aDoc) => {
        if (aDoc.existe()) {
          if (
            GChaine.estFichierImageAvecMiniaturePossible(
              aDoc.documentCasier.getLibelle(),
            )
          ) {
            lListeImages.add(aDoc);
          }
        }
      });
    }
    this.identGalerie.initialiser();
    this.identGalerie.setDonnees({
      listeDiapos: lListeImages,
      ressourceDocJoint: EGenreRessource.DocumentJoint,
    });
  }
  setParametres(aElement, aOptions) {
    this.donneesRecues = true;
    this.donnee = aElement;
    this.setOptions(aOptions);
  }
  getBilletConcerne() {
    return this.donnee;
  }
  setOptions(aOptions) {
    this.options.tailleMaxCommentaires = aOptions.tailleMaxCommentaires;
    this.options.avecAffichageNomBlog = aOptions.avecAffichageNomBlog;
  }
  ouvrirFenetreCommentairesDeBillet(aBillet) {
    this.donnee = aBillet;
    _afficherFenetreCommentaires.call(this);
  }
  getTitreCommentaires(aBillet) {
    let lNbCommentaires = 0;
    if (aBillet && aBillet.listeCommentaires) {
      lNbCommentaires = aBillet.listeCommentaires.count();
    }
    return GTraductions.getValeur(
      lNbCommentaires > 1 ? "blog.commentaireN" : "blog.commentaire1",
      [lNbCommentaires],
    );
  }
}
function _afficherFenetreRedacteurs() {
  let lNbRedacteurs = 1;
  if (this.donnee && this.donnee.listeCoRedacteurs) {
    lNbRedacteurs += this.donnee.listeCoRedacteurs.count();
  }
  const lFenetreListeRedacteurs = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_ListeRedacteursBillet,
    {
      pere: this,
      evenement: null,
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("blog.tousLesRedacteursN", [
            lNbRedacteurs,
          ]),
          largeur: 350,
          hauteur: 500,
          avecScroll: true,
        });
      },
    },
  );
  lFenetreListeRedacteurs.setDonnees(this.donnee);
}
function _afficherFenetreCommentaires(aParam = {}) {
  const lTitreFenetre = aParam.titre || this.getTitreCommentaires(this.donnee);
  const lFenetreEditionCommentaires = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_EditionCommentairesBlog,
    {
      pere: this,
      evenement: (aNumeroBouton, aDonneesFenetre) => {
        if (aNumeroBouton === 1 && aDonneesFenetre) {
          this.editerCommentaire(
            aDonneesFenetre.billet,
            aDonneesFenetre.avecReouvertureFenetreApresSaisie,
          );
        }
      },
      initialiser: (aInstance) => {
        aInstance.setOptionsFenetre({
          titre: lTitreFenetre,
          largeur: 500,
          hauteurMaxContenu: 600,
          avecScroll: true,
          listeBoutons: [],
          callbackFermer: function () {
            if (this._saisieCommentaireEnCours !== true) {
              this.donnee.listeCommentaires.removeFilter((aElt) => {
                return aElt.getEtat() === EGenreEtat.Creation;
              });
            }
            this._saisieCommentaireEnCours = false;
          }.bind(this),
          bloquerFocus: true,
          avecComposeBasInFooter: true,
        });
        aInstance.setParametres({
          tailleMaxCommentaires: this.options.tailleMaxCommentaires,
        });
      },
    },
  );
  lFenetreEditionCommentaires.setDonnees(this.donnee);
}
module.exports = { ObjetBlocBillet };

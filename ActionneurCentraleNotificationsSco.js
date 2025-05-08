exports.ActionneurCentraleNotificationsSco = void 0;
const Enumere_Onglet_1 = require("Enumere_Onglet");
const MethodesObjet_1 = require("MethodesObjet");
const Invocateur_1 = require("Invocateur");
const ObjetListeElements_1 = require("ObjetListeElements");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ActionneurCentraleNotificationsCP_1 = require("ActionneurCentraleNotificationsCP");
const ObjetElement_1 = require("ObjetElement");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetRequeteURLSignataire_1 = require("ObjetRequeteURLSignataire");
const DocumentsATelecharger_1 = require("DocumentsATelecharger");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetChaine_1 = require("ObjetChaine");
const C_IdDiscussions = "Discussions";
const C_IdCasiers = "Casiers";
const C_IdInformations = "Informations";
const C_IdSujetsForum = "SujetsForum";
const C_IdDemandeRemplacements = "DemandeRemplacements";
const C_IdSignatairePref = "Signataire_";
class ActionneurCentraleNotificationsSco extends ActionneurCentraleNotificationsCP_1.ActionneurCentraleNotificationsCP {
  constructor() {
    super(...arguments);
    this.etatUtilisateurPN = GApplication.getEtatUtilisateur();
  }
  actionSurRequeteURLSignataire(aJSON) {
    if (aJSON.message) {
      UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        titre: "",
        message: aJSON.message,
      });
    } else if (aJSON.url) {
      UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aJSON.url);
    } else {
      UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
    }
  }
  actionNotification(aNotification) {
    var _a, _b, _c, _d;
    let lOnglet = null;
    let lChangerMembre = null;
    if (aNotification.ouvrirFicheEtab) {
      if (
        global.GEtatUtilisateur &&
        this.etatUtilisateurPN.listeInformationsEtablissements &&
        this.etatUtilisateurPN.listeInformationsEtablissements.parcourir &&
        aNotification.etabNotif &&
        aNotification.etabNotif.getNumero
      ) {
        this.etatUtilisateurPN.listeInformationsEtablissements.parcourir(
          (aEtab) => {
            if (aNotification.etabNotif.getNumero() === aEtab.getNumero()) {
              aEtab.relancerNotif = false;
            }
          },
        );
      }
      Invocateur_1.Invocateur.evenement("ouvrir_ficheEtab");
      return;
    }
    if (aNotification.ouvrirLienSignataire) {
      UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
      if (ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire) {
        const lObj = {
          typeAction: ObjetRequeteURLSignataire_1.TypeActionSignataire.signer,
        };
        if (aNotification.signataire) {
          lObj.signataire = aNotification.signataire;
        } else if (aNotification.bundle) {
          lObj.bundle = aNotification.bundle;
        }
        new ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire(
          this,
          this.actionSurRequeteURLSignataire,
        ).lancerRequete(lObj);
      }
      return;
    }
    if (
      Array.isArray(aNotification.navOnglets) &&
      aNotification.navOnglets.length > 0
    ) {
      aNotification.navOnglets.every((aOnglet) => {
        if (this._estOngletVisible(aOnglet)) {
          lOnglet = aOnglet;
          return false;
        }
        return true;
      });
    }
    if (aNotification.detailMessage && aNotification.detailPossession) {
      this.etatUtilisateurPN.message = MethodesObjet_1.MethodesObjet.dupliquer(
        aNotification.detailMessage,
      );
      this.etatUtilisateurPN.message.listePossessionsMessages =
        new ObjetListeElements_1.ObjetListeElements().addElement(
          aNotification.detailPossession,
        );
      this.etatUtilisateurPN.message.estUneDiscussion = true;
      this.etatUtilisateurPN.message.__marquerLu__ = true;
    }
    if (aNotification.estDetailActu) {
      this.etatUtilisateurPN.jeton_OngletInformation_dateNotification =
        aNotification.date;
    }
    if (aNotification.notifRencontre) {
      this.etatUtilisateurPN.jeton_notifRencontre =
        aNotification.notifRencontre;
    }
    if (aNotification.notifBillet) {
      this.etatUtilisateurPN.setContexteBilletBlog(aNotification.notifBillet);
    }
    if (aNotification.id.startsWith(C_IdSignatairePref)) {
      return;
    }
    if (!MethodesObjet_1.MethodesObjet.isNumber(lOnglet)) {
      switch (aNotification.id) {
        case C_IdDiscussions:
          lOnglet = Enumere_Onglet_1.EGenreOnglet.Messagerie;
          break;
        case C_IdCasiers:
          lOnglet = Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier;
          break;
        case C_IdInformations:
          lOnglet = Enumere_Onglet_1.EGenreOnglet.Informations;
          break;
        case C_IdSujetsForum:
          lOnglet = Enumere_Onglet_1.EGenreOnglet.ForumPedagogique;
          break;
        case C_IdDemandeRemplacements:
          lOnglet = Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants;
          break;
        default:
      }
    }
    if (
      aNotification.id === C_IdDemandeRemplacements &&
      aNotification.genreAffichage !== undefined
    ) {
      this.etatUtilisateurPN.setContexteRemplacementsEnseignant({
        genreAffichage: aNotification.genreAffichage,
        debut: aNotification.debut,
        fin: aNotification.fin,
      });
    }
    let lCallbackAvantNavigation = null;
    if (aNotification.estNotifCours) {
      lCallbackAvantNavigation = () => {
        if (!this.options.estMobile) {
          if (
            !aNotification.domaine ||
            !aNotification.domaine.getSemaines ||
            aNotification.domaine.getSemaines().length === 0
          ) {
            return;
          }
          this.etatUtilisateurPN.setDomaineSelectionne(aNotification.domaine);
          this.etatUtilisateurPN._coursASelectionner = aNotification.cours;
        } else {
          if (!aNotification.dateCours) {
            return;
          }
          this.etatUtilisateurPN.setDerniereDate(aNotification.dateCours);
        }
      };
    }
    if (
      aNotification.collecteDocument ||
      (aNotification.modeleDocument &&
        MethodesObjet_1.MethodesObjet.isNumeric(lOnglet))
    ) {
      const lLibelleOnglet =
        (_b =
          (_a =
            this.etatUtilisateurPN.listeOnglets.getElementParGenre(lOnglet)) ===
            null || _a === void 0
            ? void 0
            : _a.getLibelle) === null || _b === void 0
          ? void 0
          : _b.call(_a);
      if (lLibelleOnglet) {
        this.etatUtilisateurPN.getInfosSupp(lLibelleOnglet).genreRubrique =
          aNotification.collecteDocument
            ? DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
                .documentsAFournir
            : DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
                .documents;
      }
    }
    if (aNotification.documentSignature) {
      if (aNotification.documentSignature.sansAccesAffichage) {
        if (!aNotification.documentSignature.documentArchive) {
          UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
          if (ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire) {
            const lObj = {
              typeAction:
                ObjetRequeteURLSignataire_1.TypeActionSignataire.voirDocument,
              document: aNotification.documentSignature,
            };
            new ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire(this)
              .lancerRequete(lObj)
              .then((aJSON) => {
                if (aJSON.message) {
                  UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
                  GApplication.getMessage().afficher({
                    type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
                    titre: "",
                    message: aJSON.message,
                  });
                } else if (aJSON.url) {
                  UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(
                    aJSON.url,
                  );
                } else {
                  UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
                }
              });
          }
        } else {
          const lDocument = new ObjetElement_1.ObjetElement(
            aNotification.documentSignature.documentArchive.getLibelle(),
            aNotification.documentSignature.getNumero(),
            aNotification.documentSignature.documentArchive.getGenre(),
          );
          const lURL =
            ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lDocument);
          if (lURL) {
            window.open(lURL);
          }
        }
        return;
      } else {
        const lLibelleOnglet =
          (_d =
            (_c =
              this.etatUtilisateurPN.listeOnglets.getElementParGenre(
                lOnglet,
              )) === null || _c === void 0
              ? void 0
              : _c.getLibelle) === null || _d === void 0
            ? void 0
            : _d.call(_c);
        if (lLibelleOnglet) {
          const lInfosOnglet =
            this.etatUtilisateurPN.getInfosSupp(lLibelleOnglet);
          lInfosOnglet.genreAffichage =
            Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details;
          if (aNotification.eleve) {
            lInfosOnglet.eleve = aNotification.eleve;
          }
          if (aNotification.stage) {
            this.etatUtilisateurPN.Navigation.setRessource(
              Enumere_Ressource_1.EGenreRessource.Stage,
              aNotification.stage,
            );
          }
          if (
            [
              Enumere_Espace_1.EGenreEspace.Professeur,
              Enumere_Espace_1.EGenreEspace.Etablissement,
            ].includes(this.etatUtilisateurPN.GenreEspace)
          ) {
            if (aNotification.classe) {
              this.etatUtilisateurPN.setClasse(aNotification.classe);
            }
            if (aNotification.eleve) {
              this.etatUtilisateurPN.Navigation.setRessource(
                Enumere_Ressource_1.EGenreRessource.Eleve,
                aNotification.eleve,
              );
            }
          } else if (
            [
              Enumere_Espace_1.EGenreEspace.Parent,
              Enumere_Espace_1.EGenreEspace.Mobile_Parent,
              Enumere_Espace_1.EGenreEspace.Entreprise,
            ].includes(this.etatUtilisateurPN.GenreEspace)
          ) {
            if (
              aNotification.eleve &&
              !this.etatUtilisateurPN
                .getMembre()
                .egalParNumeroEtGenre(aNotification.eleve.getNumero())
            ) {
              lChangerMembre = aNotification.eleve;
            }
          }
        }
      }
    }
    if (this._estOngletVisible(lOnglet)) {
      (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
        if (lCallbackAvantNavigation) {
          if (lCallbackAvantNavigation() === false) {
            return;
          }
        }
        Invocateur_1.Invocateur.evenement(
          Invocateur_1.ObjetInvocateur.events.navigationOnglet,
          lOnglet,
        );
        if (lChangerMembre) {
          Invocateur_1.Invocateur.evenement(
            Invocateur_1.ObjetInvocateur.events.changerMembre,
            lChangerMembre,
          );
        }
      });
    } else {
    }
  }
  _estOngletVisible(aOnglet) {
    if (aOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil) {
      const lOngletAccueil = GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.Accueil,
      );
      if (lOngletAccueil && lOngletAccueil.Actif) {
        return true;
      }
      return false;
    }
    return this.etatUtilisateurPN.ongletEstVisible(aOnglet);
  }
}
exports.ActionneurCentraleNotificationsSco = ActionneurCentraleNotificationsSco;

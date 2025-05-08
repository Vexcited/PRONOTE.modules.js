exports.UtilitaireContactVieScolaire =
  exports.ObjetRequeteSaisieContactVieScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SplashAlerte_1 = require("ObjetFenetre_SplashAlerte");
const TypeOrigineCreationModeleAlerte_1 = require("TypeOrigineCreationModeleAlerte");
const ObjetChaine_1 = require("ObjetChaine");
const TypeStatutConnexion_1 = require("TypeStatutConnexion");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const Enumere_Etat_1 = require("Enumere_Etat");
class ObjetRequeteSaisieContactVieScolaire extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieContactVieScolaire =
  ObjetRequeteSaisieContactVieScolaire;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieContactVieScolaire",
  ObjetRequeteSaisieContactVieScolaire,
);
let uFenetreAlerteSplash_Visible = false;
let uCacheListeModelesAlerte = null;
class UtilitaireContactVieScolaire {
  constructor() {
    this.listeAlertePPMSEnCours = new ObjetListeElements_1.ObjetListeElements();
    this.compteurFenetreAlertePPMS = 0;
  }
  getListeAlertePPMSEnCours() {
    return this.listeAlertePPMSEnCours;
  }
  getCompteurFenetreAlertePPMS() {
    return this.compteurFenetreAlertePPMS;
  }
  demarrerMessageInstantane() {
    new ObjetRequeteSaisieContactVieScolaire()
      .setOptions({ messageDetail: "" })
      .lancerRequete({ pourContactVS: false })
      .then(
        (aReponse) => {
          if (
            aReponse.genreReponse !==
            ObjetRequeteJSON_1.EGenreReponseSaisie.succes
          ) {
            return;
          }
          const lListeContacts = aReponse.JSONReponse.listeContacts;
          if (
            !lListeContacts ||
            !aReponse.JSONRapportSaisie.listeDestinataires
          ) {
            return GApplication.getMessage().afficher({
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "ModeExclusif.UsageExclusif",
              ),
              message: ObjetTraduction_1.GTraductions.getValeur(
                "ModeExclusif.SaisieImpossibleConsultation",
              ),
            });
          }
          this.afficherDestMessageInstantane({
            listeContacts: lListeContacts,
            listeDestinataires: aReponse.JSONRapportSaisie.listeDestinataires,
            statutConnexion: aReponse.JSONReponse.statutConnexion,
            creerDiscussionContactVS:
              this.creerDiscussionVieScolaire.bind(this),
            creerMessageInstantane: (aListeConnectes, aListeNonConnectes) => {
              if (aListeConnectes.count() > 0) {
                this.creerChat({
                  genreDiscussion:
                    TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Conversation,
                  listeContacts: lListeContacts,
                  listeDestinataires:
                    new ObjetListeElements_1.ObjetListeElements()
                      .add(aListeConnectes)
                      .add(aListeNonConnectes),
                  objet: ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.Conversation",
                  ),
                });
              } else {
                this.creerNouvelleDiscussion({
                  genreDiscussion:
                    TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Discussion,
                  listeContacts: lListeContacts,
                  listeDestinataires: MethodesObjet_1.MethodesObjet.dupliquer(
                    aListeNonConnectes,
                  ).parcourir((aDest) => {
                    aDest.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                  }),
                });
              }
            },
          });
        },
        () => {},
      );
  }
  creerDiscussionVieScolaire() {
    new ObjetRequeteSaisieContactVieScolaire()
      .setOptions({ messageDetail: "" })
      .lancerRequete({ pourContactVS: true })
      .then(
        (aReponse) => {
          if (
            aReponse.genreReponse !==
            ObjetRequeteJSON_1.EGenreReponseSaisie.succes
          ) {
            return;
          }
          if (
            !aReponse.JSONRapportSaisie.listeDestinataires ||
            aReponse.JSONRapportSaisie.listeDestinataires.count() === 0
          ) {
            GApplication.getMessage().afficher({
              message: ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.AucunPersonnelConnecte",
              ),
            });
            return;
          }
          const lListeContacts = aReponse.JSONReponse.listeContacts;
          lListeContacts.trier();
          aReponse.JSONRapportSaisie.listeDestinataires.trier();
          const lListeSelectionnables = MethodesObjet_1.MethodesObjet.dupliquer(
            aReponse.JSONRapportSaisie.listeDestinataires,
          );
          lListeContacts.parcourir((aRessource) => {
            const lRessourceTrouve =
              lListeSelectionnables.getElementParElement(aRessource);
            if (!lRessourceTrouve) {
              aRessource.nonEditable = true;
            }
          });
          this.creerChat({
            genreDiscussion:
              TypeGenreDiscussion_1.TypeGenreDiscussion.GD_ContactVS,
            estContactVS: true,
            listeContacts: lListeContacts,
            listeDestinataires: aReponse.JSONRapportSaisie.listeDestinataires,
            listeSelectionnables: lListeSelectionnables,
            objet: ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.ContacterVS",
            ),
          });
        },
        () => {},
      );
  }
  creerAlertePPMS() {
    new ObjetRequeteSaisieContactVieScolaire()
      .setOptions({ messageDetail: "" })
      .lancerRequete({
        pourContactVS: false,
        pourAlerte: true,
        avecListeModelesAlerte: !uCacheListeModelesAlerte,
      })
      .then(
        (aReponse) => {
          if (
            aReponse.genreReponse !==
            ObjetRequeteJSON_1.EGenreReponseSaisie.succes
          ) {
            return;
          }
          if (!aReponse.JSONReponse.listeContacts) {
            GApplication.getMessage().afficher({
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "ModeExclusif.UsageExclusif",
              ),
              message: ObjetTraduction_1.GTraductions.getValeur(
                "ModeExclusif.SaisieImpossibleConsultation",
              ),
            });
            return;
          }
          if (aReponse.JSONReponse.listeModelesAlerte) {
            uCacheListeModelesAlerte = aReponse.JSONReponse.listeModelesAlerte;
          }
          if (!uCacheListeModelesAlerte) {
            return;
          }
          const lListeEtablissements =
            aReponse.JSONReponse.listeEtablissementsPourAlerte ||
            new ObjetListeElements_1.ObjetListeElements();
          if (lListeEtablissements.count()) {
            lListeEtablissements.insererElement(
              new ObjetElement_1.ObjetElement(
                ObjetTraduction_1.GTraductions.getValeur(
                  "SplashAlerte.tousEtablissements",
                ),
                -1,
                -1,
              ),
              0,
            );
          }
          const lAlerte = {
            estExercice: false,
            modeleAlerte: uCacheListeModelesAlerte.get(0),
            listeModelesAlerte: uCacheListeModelesAlerte,
            listeEtablissements: lListeEtablissements,
          };
          const lListeContacts = aReponse.JSONReponse.listeContacts;
          const lListeDestinataires =
            new ObjetListeElements_1.ObjetListeElements()
              .add(lListeContacts)
              .trier();
          const lHashParents = {};
          lListeContacts.parcourir((aElement) => {
            const lGenre = aElement.getGenre();
            if (!lHashParents[lGenre]) {
              const lParent = new ObjetElement_1.ObjetElement(
                lGenre === Enumere_Ressource_1.EGenreRessource.Personnel
                  ? ObjetTraduction_1.GTraductions.getValeur(
                      "Messagerie.Personnels",
                    )
                  : ObjetTraduction_1.GTraductions.getValeur(
                      "Messagerie.Profs",
                    ),
                0,
                lGenre,
              );
              lHashParents[lGenre] = lParent;
              lParent.estUnDeploiement = true;
              lParent.estDeploye = true;
            }
            aElement.pere = lHashParents[lGenre];
          });
          for (const lKey in lHashParents) {
            lListeContacts.addElement(lHashParents[lKey]);
          }
          this.creerChat({
            genreDiscussion:
              TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte,
            listeContacts: lListeContacts,
            listeDestinataires: lListeDestinataires,
            alerte: lAlerte,
            objet: ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.AlerteEnseignantsPersonnels",
            ),
          });
        },
        () => {},
      );
  }
  _getTitreAlerteDeMessage(aMessage) {
    if (
      aMessage.genreAlerte ===
      TypeOrigineCreationModeleAlerte_1.TypeOrigineCreationModeleAlerte
        .OCMA_Pre_Defaut
    ) {
      return (
        aMessage.libelleAlerte ||
        ObjetTraduction_1.GTraductions.getValeur("SplashAlerte.AlerteDefaut")
      );
    }
    return (
      ObjetTraduction_1.GTraductions.getValeur("SplashAlerte.AlerteDefaut") +
      (aMessage.libelleAlerte ? " " + aMessage.libelleAlerte : "")
    );
  }
  _getInfosChatMessage(aMessage) {
    const lResult = {
      titre: ObjetTraduction_1.GTraductions.getValeur("Messagerie.ContacterVS"),
      contenuInitial: "",
    };
    const lMessageChat = aMessage;
    const lMessage = aMessage;
    if (lMessageChat.estAlerte) {
      const lTitreAlerte = this._getTitreAlerteDeMessage(lMessageChat);
      lResult.titre = lMessageChat.strInitiateur
        ? ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.AlerteTypeeLanceePar",
            [lTitreAlerte, lMessageChat.strInitiateur],
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.AlerteTypeeEnseignantsPersonnels",
            [lTitreAlerte],
          );
    } else if (
      lMessageChat.strEmetteur &&
      lMessageChat.getGenre() ===
        TypeGenreDiscussion_1.TypeGenreDiscussion.GD_ContactVS
    ) {
      lResult.titre = ObjetChaine_1.GChaine.format(
        ObjetTraduction_1.GTraductions.getValeur("Messagerie.AppelDe"),
        [lMessageChat.strEmetteur],
      );
    } else if (
      lMessageChat.getGenre() ===
      TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Conversation
    ) {
      if (lMessageChat.contenu) {
        lResult.titre = lMessageChat.contenu;
      } else if (lMessageChat.strEmetteur) {
        lResult.titre = ObjetChaine_1.GChaine.format("%s - %s", [
          ObjetTraduction_1.GTraductions.getValeur("Messagerie.Conversation"),
          lMessageChat.strEmetteur,
        ]);
      }
    } else if (lMessage.objet) {
      lResult.titre =
        UtilitaireMessagerie_1.UtilitaireMessagerie.getTitreFenetreDeMessage(
          lMessage,
        );
    }
    if (
      !lMessageChat.estAlerte &&
      aMessage.getGenre() ===
        TypeGenreDiscussion_1.TypeGenreDiscussion.GD_ContactVS &&
      aMessage.listePossessionsMessages &&
      aMessage.listePossessionsMessages.count() === 1
    ) {
      lResult.contenuInitial = ObjetTraduction_1.GTraductions.getValeur(
        "Messagerie.DemandePriseEnCompte",
      );
    }
    return lResult;
  }
  afficherAlertePPMS() {
    this._afficherChatVS(this.listeAlertePPMSEnCours, {
      ignorerAlertePPMSSpalsh: true,
      filtre: function (aMessage) {
        if (aMessage.estFenetreAffichee) {
          return false;
        }
      },
    });
  }
  _avecConversationsEnPopup() {
    return (
      GApplication.donneesCentraleNotifications.statutConnexionCommunication !==
      TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Disponible
    );
  }
  declarer() {
    const lInstance = this;
    Invocateur_1.Invocateur.abonner("notification_chatVS", (aListe) => {
      Invocateur_1.Invocateur.evenement("traiter_notifications_chatVS", aListe);
      this._afficherChatVS(aListe, {
        filtre: (aMessage) => {
          if (aMessage.estAlerte) {
            const lIndice = this._getIndiceMessageDansListe(
                aMessage,
                lInstance.listeAlertePPMSEnCours,
              ),
              lMessageTrouve = lInstance.listeAlertePPMSEnCours.get(lIndice);
            if (lIndice >= 0 && lMessageTrouve) {
              if (aMessage.cloture) {
                lInstance.listeAlertePPMSEnCours.remove(lIndice);
                if (uFenetreAlerteSplash_Visible) {
                  uFenetreAlerteSplash_Visible.fermerSiEstAlerte(aMessage);
                }
              } else {
                Object.assign(lMessageTrouve, aMessage);
                aMessage.estAlerteSplash = false;
              }
              if (lMessageTrouve.estFenetreAffichee) {
                return false;
              }
            } else if (!aMessage.cloture) {
              lInstance.listeAlertePPMSEnCours.addElement(aMessage);
            }
            if (
              !aMessage.estAlerteSplash &&
              lInstance.compteurFenetreAlertePPMS === 0
            ) {
              return false;
            }
          }
          switch (aMessage.getGenre()) {
            case TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Discussion:
              return false;
          }
          if (aMessage.perso) {
            return false;
          }
          return true;
        },
      });
    });
    lInstance.listeAlertePPMSEnCours =
      GApplication.donneesCentraleNotifications.listeNotifsChatVS ||
      new ObjetListeElements_1.ObjetListeElements();
    this._afficherChatVS(lInstance.listeAlertePPMSEnCours, {
      filtre: function (aMessage) {
        if (!aMessage.estAlerteSplash) {
          return false;
        }
        if (uFenetreAlerteSplash_Visible) {
          return false;
        }
      },
    });
  }
  _afficherChatVS(aListe, aOptions) {
    const lOptions = Object.assign(
      { filtre: null, ignorerAlertePPMSSpalsh: false },
      aOptions,
    );
    if (!aListe) {
      return;
    }
    const lListePourFenetre = new ObjetListeElements_1.ObjetListeElements();
    const lInstance = this;
    aListe.parcourir((aMessage) => {
      if (aMessage.messageDejaTraite && !aMessage.estAlerte) {
        return;
      }
      if (
        MethodesObjet_1.MethodesObjet.isFunction(lOptions.filtre) &&
        lOptions.filtre(aMessage) === false
      ) {
        return;
      }
      if (aMessage.estAlerteSplash) {
        aMessage.estAlerteSplash = false;
        if (
          !uFenetreAlerteSplash_Visible &&
          lOptions.ignorerAlertePPMSSpalsh !== true &&
          lInstance.compteurFenetreAlertePPMS === 0
        ) {
          const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SplashAlerte_1.ObjetFenetre_SplashAlerte,
            {
              pere: GInterface,
              evenement: function (aNumeroBouton) {
                if (aNumeroBouton === 1) {
                  lInstance.afficherAlertePPMS();
                }
              },
              initialiser: function (aInstance) {
                aInstance.setMessage(
                  aMessage,
                  lInstance._getTitreAlerteDeMessage(aMessage),
                );
                aInstance.setOptionsFenetre({
                  callbackFermer: function () {
                    uFenetreAlerteSplash_Visible = null;
                  },
                });
              },
            },
          );
          lFenetre.afficher();
          if (aMessage.dureeSon && aMessage.dureeSon > 0) {
            try {
              new Audio("sons/AlertePPMS.mp3").addEventListener(
                "canplaythrough",
                function () {
                  this.loop = true;
                  this.play().catch(() => {});
                  const lTimer = setInterval(() => {
                    if (!lFenetre.EnAffichage) {
                      this.loop = false;
                      clearInterval(lTimer);
                    }
                  }, 500);
                  setTimeout(() => {
                    this.loop = false;
                    clearInterval(lTimer);
                  }, aMessage.dureeSon * 1000);
                },
              );
            } catch (error) {}
          }
          uFenetreAlerteSplash_Visible = {
            fermerSiEstAlerte: (aMessageAlerteCloturee) => {
              if (
                this._getIndiceMessageDansListe(
                  aMessageAlerteCloturee,
                  new ObjetListeElements_1.ObjetListeElements().add(aMessage),
                ) >= 0
              ) {
                lFenetre.fermer();
                return true;
              }
              return false;
            },
          };
          return;
        }
      }
      lListePourFenetre.addElement(aMessage);
    });
    lListePourFenetre.setTri([ObjetTri_1.ObjetTri.init("date")]).trier();
    this.creerChatDeListe(lListePourFenetre);
  }
  _getIndiceMessageDansListe(aMessageModele, aListe) {
    let lIndice = -1;
    if (
      aMessageModele &&
      aMessageModele.listePossessionsMessages &&
      aMessageModele.listePossessionsMessages.count()
    ) {
      aListe.parcourir((aMessage, aIndice) => {
        if (aMessage.listePossessionsMessages) {
          aMessage.listePossessionsMessages.parcourir((aPossession) => {
            if (
              aMessageModele.listePossessionsMessages.getElementParElement(
                aPossession,
              )
            ) {
              lIndice = aIndice;
              return false;
            }
          });
        }
        if (lIndice >= 0) {
          return false;
        }
      });
    }
    return lIndice;
  }
}
exports.UtilitaireContactVieScolaire = UtilitaireContactVieScolaire;

exports.UtilitaireContactVieScolaire_Mobile = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetIdentite_1 = require("ObjetIdentite");
const UtilitaireContactVieScolaire_1 = require("UtilitaireContactVieScolaire");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Invocateur_1 = require("Invocateur");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DestMessageInstantane_1 = require("ObjetFenetre_DestMessageInstantane");
const Enumere_Etat_1 = require("Enumere_Etat");
class ClassUtilitaireContactVieScolaire_Mobile extends UtilitaireContactVieScolaire_1.UtilitaireContactVieScolaire {
  constructor() {
    super(...arguments);
    this.listeConversationsEnCours =
      new ObjetListeElements_1.ObjetListeElements();
  }
  creerChat(aParams) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile,
      { pere: this, moteurMessagerie: this._creerMoteurMessagerie(this) },
    );
    aParams.listeDestinataires.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
    });
    lInstance
      .setOptions({
        estDiscussionEnFenetre: true,
        estChat: true,
        genreDiscussion: aParams.genreDiscussion,
        callbackFermeture: function () {
          lInstance.free();
        },
      })
      .setDonnees({
        titre: aParams.objet,
        creationDiscussion: true,
        alertePPMS: aParams.alerte,
        destinataires: { listeDestinataires: aParams.listeDestinataires },
        listeContacts: aParams.listeContacts,
      });
  }
  creerNouvelleDiscussion(aParams) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile,
      { pere: this, moteurMessagerie: this._creerMoteurMessagerie(this) },
    );
    const lGenresDest = [];
    [
      Enumere_Ressource_1.EGenreRessource.Personnel,
      Enumere_Ressource_1.EGenreRessource.Enseignant,
    ].forEach((aGenre) => {
      if (
        UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
          aGenre,
        )
      ) {
        lGenresDest.push(aGenre);
      }
    });
    lInstance
      .setOptions({
        estDiscussionEnFenetre: true,
        genreDiscussion: aParams.genreDiscussion,
        genresDestinatairesAutorises: lGenresDest,
        avecDestinatairesListeDiffusion: false,
        callbackEnvoyer: function () {
          lInstance.masquer();
          Invocateur_1.Invocateur.evenement("actualiserListeDiscussion_mobile");
        }.bind(this),
        callbackFermeture: function () {
          lInstance.free();
        },
      })
      .setDonnees({
        titre: undefined,
        creationDiscussion: true,
        destinataires: { listeDestinataires: aParams.listeDestinataires },
        listeContacts: aParams.listeContacts,
      });
  }
  creerChatDeListe(aListe) {
    if (!aListe || aListe.count() === 0) {
      return;
    }
    const lListeChats = new ObjetListeElements_1.ObjetListeElements();
    const lNbConversations = this.listeConversationsEnCours.count();
    aListe.parcourir((aMessage) => {
      if (
        aMessage.getGenre() ===
          TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Conversation &&
        !aMessage.messageDejaTraite
      ) {
        let lTrouve = false;
        this.listeConversationsEnCours.parcourir((aMessageEnCours, aIndex) => {
          if (
            UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
              aMessageEnCours,
              aMessage,
            )
          ) {
            lTrouve = true;
            this.listeConversationsEnCours.addElement(aMessage, aIndex);
            return false;
          }
        });
        if (!lTrouve) {
          if (this._avecConversationsEnPopup()) {
            this.listeConversationsEnCours.add(aMessage);
          } else {
            lListeChats.add(aMessage);
          }
        }
      } else {
        lListeChats.add(aMessage);
      }
    });
    if (lNbConversations !== this.listeConversationsEnCours.count()) {
      Invocateur_1.Invocateur.evenement(
        "modifier_nb_conversationEnCours",
        this.listeConversationsEnCours.count(),
      );
    }
    if (lListeChats.count() > 0) {
      this._initFenetreChatMultiple(lListeChats);
    }
  }
  afficherDestMessageInstantane(aParams) {
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_DestMessageInstantane_1.ObjetFenetre_DestMessageInstantane,
      { pere: this },
      {
        options: {
          getListeConversations: () => {
            return this.listeConversationsEnCours;
          },
          surMessage: (aMessage) => {
            this._initFenetreChatMultiple(
              new ObjetListeElements_1.ObjetListeElements().add(aMessage),
            );
          },
          surSuppressionConversationEnCours: (aMessageCherche) => {
            let lTrouve = false;
            this.listeConversationsEnCours.parcourir((aMessage, aIndice) => {
              if (
                UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
                  aMessageCherche,
                  aMessage,
                )
              ) {
                this.listeConversationsEnCours.remove(aIndice);
                lTrouve = true;
                return false;
              }
            });
            if (lTrouve) {
              Invocateur_1.Invocateur.evenement(
                "modifier_nb_conversationEnCours",
                this.listeConversationsEnCours.count(),
              );
            }
          },
        },
      },
    ).setDonnees(aParams);
  }
  _creerMoteurMessagerie(aInstance) {
    return new MoteurMessagerie_1.MoteurMessagerie().setOptions({
      instance: aInstance,
      estChat: true,
    });
  }
  _creerFenetreChatMultiple(
    aIndiceCourant,
    aListe,
    aInstance,
    aMoteurMessagerie,
  ) {
    const lMessage = aListe.get(aIndiceCourant);
    aMoteurMessagerie
      .requeteMessagesVisu({ message: lMessage, marquerCommeLu: true })
      .then((aParam) => {
        if (lMessage.estAlerte) {
          this.compteurFenetreAlertePPMS += 1;
        }
        lMessage.estFenetreAffichee = true;
        const lInfosMessage = this._getInfosChatMessage(lMessage);
        const lNbMessages = aListe.count();
        const lTitre =
          lNbMessages < 2
            ? lInfosMessage.titre
            : ObjetChaine_1.GChaine.format("(%s/%s) %s", [
                aIndiceCourant + 1,
                lNbMessages,
                lInfosMessage.titre,
              ]);
        aInstance
          .setOptions({
            estDiscussionEnFenetre: true,
            estChat: true,
            callbackNavigation:
              lNbMessages > 1
                ? (aPrec) => {
                    aIndiceCourant += aPrec ? -1 : 1;
                    if (aIndiceCourant < 0) {
                      aIndiceCourant = lNbMessages - 1;
                    } else if (aIndiceCourant >= lNbMessages) {
                      aIndiceCourant = 0;
                    }
                    if (lMessage.estAlerte) {
                      this.compteurFenetreAlertePPMS = Math.max(
                        0,
                        this.compteurFenetreAlertePPMS - 1,
                      );
                    }
                    this._creerFenetreChatMultiple(
                      aIndiceCourant,
                      aListe,
                      aInstance,
                      aMoteurMessagerie,
                    );
                  }
                : null,
            callbackFermeture: () => {
              if (lMessage.estAlerte) {
                this.compteurFenetreAlertePPMS = Math.max(
                  0,
                  this.compteurFenetreAlertePPMS - 1,
                );
              }
              aInstance.free();
            },
          })
          .setDonnees(
            Object.assign(
              {
                titre: lTitre,
                message: lMessage,
                contenuInitial: lInfosMessage.contenuInitial,
              },
              aParam,
            ),
          );
      });
  }
  _initFenetreChatMultiple(aListe) {
    const lMoteurMessagerie = this._creerMoteurMessagerie(this);
    const lIndiceChatCourant = 0;
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile,
      { pere: this, moteurMessagerie: lMoteurMessagerie },
    );
    this._creerFenetreChatMultiple(
      lIndiceChatCourant,
      aListe,
      lInstance,
      lMoteurMessagerie,
    );
  }
}
exports.UtilitaireContactVieScolaire_Mobile =
  new ClassUtilitaireContactVieScolaire_Mobile();

exports.UtilitaireContactVieScolaire_Espace =
  exports.ClasseUtilitaireContactVieScolaire_Espace = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_Discussion_1 = require("ObjetFenetre_Discussion");
const UtilitaireContactVieScolaire_1 = require("UtilitaireContactVieScolaire");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const ObjetFichePopupConversation_1 = require("ObjetFichePopupConversation");
const MethodesTableau_1 = require("MethodesTableau");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_DestMessageInstantane_1 = require("ObjetFenetre_DestMessageInstantane");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const GUID_1 = require("GUID");
class ClasseUtilitaireContactVieScolaire_Espace extends UtilitaireContactVieScolaire_1.UtilitaireContactVieScolaire {
  constructor() {
    super(...arguments);
    this.fichesConversationEnCours = [];
  }
  creerChat(aParams) {
    const lFenetre = this._creerFenetreDiscussion(
      {},
      {
        genreDiscussion: aParams.genreDiscussion,
        hauteurTiny:
          aParams.genreDiscussion ===
          TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte
            ? 125
            : undefined,
        getHtmlDestinataires: this._getHtmlDestinatairesMessagerie.bind(
          this,
          Object.assign(
            {
              optionsFenetreSelRess: {
                getClassRessource: function (D) {
                  return D.nonEditable ? "Italique" : "";
                },
                genreDiscussion: aParams.genreDiscussion,
                autoriseEltAucun:
                  aParams.genreDiscussion ===
                  TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte,
              },
            },
            aParams,
          ),
        ),
      },
    );
    aParams.listeDestinataires.parcourir((D) => {
      D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
    });
    lFenetre.setDonnees({
      creationAlerte: aParams.alerte,
      discussion: null,
      listeMessagerie: null,
      creationDiscussion: true,
      getListeDestinatairesChat: function () {
        return aParams.listeDestinataires;
      },
      objet: aParams.objet,
    });
  }
  creerNouvelleDiscussion(aParams) {
    const lListeProfesseurs = aParams.listeDestinataires.getListeElements(
      (D) => {
        return D.Genre === Enumere_Ressource_1.EGenreRessource.Enseignant;
      },
    );
    const lListePersonnels = aParams.listeDestinataires.getListeElements(
      (D) => {
        return D.Genre === Enumere_Ressource_1.EGenreRessource.Personnel;
      },
    );
    ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
      this,
      {
        ListeRessources: aParams.listeContacts,
        genresRessources: [
          {
            genre: Enumere_Ressource_1.EGenreRessource.Enseignant,
            listeDestinataires: lListeProfesseurs,
            getDisabled() {
              return !UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
                Enumere_Ressource_1.EGenreRessource.Enseignant,
              );
            },
          },
          {
            genre: Enumere_Ressource_1.EGenreRessource.Personnel,
            listeDestinataires: lListePersonnels,
            getDisabled() {
              return !UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
                Enumere_Ressource_1.EGenreRessource.Personnel,
              );
            },
          },
        ],
      },
      { avecChoixDestinataires: true },
    );
  }
  afficherDestMessageInstantane(aParams) {
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_DestMessageInstantane_1.ObjetFenetre_DestMessageInstantane,
      { pere: this },
    ).setDonnees(aParams);
  }
  afficherFenetreMessage(aParams) {
    const lParams = Object.assign(
      {
        message: null,
        possessionMessageDiscussionUnique: null,
        estConversation: false,
        optionsFenetre: null,
        optionsDiscusssion: null,
      },
      aParams,
    );
    this._afficherChatMessage(lParams);
  }
  creerChatDeListe(aListe) {
    aListe.parcourir((aMessage) => {
      if (
        aMessage.getGenre() ===
          TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Conversation &&
        !aMessage.messageDejaTraite &&
        this._afficherFichesConversation(aMessage)
      ) {
        return;
      }
      this._afficherChatMessage({ message: aMessage });
    });
  }
  _getHtmlDestinatairesMessagerie(aParams, aInstanceMessagerie) {
    const H = [];
    aInstanceMessagerie.controleur.destinatairesChat = {
      afficher: function () {
        return !aInstanceMessagerie.message;
      },
      libelle: function () {
        const lNb = aParams.listeDestinataires.count();
        return !aParams.estContactVS
          ? ObjetChaine_1.GChaine.format(
              lNb < 2
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.NDestinataire",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.NDestinataires",
                  ),
              [lNb],
            )
          : ObjetChaine_1.GChaine.format(
              lNb < 2
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.NContactVS",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.NContactsVS",
                  ),
              [lNb],
            );
      },
      hint: function () {
        return aParams.listeDestinataires.getTableauLibelles().join(", ");
      },
      btn: {
        event: function () {
          const lRessourcesSelectionnees =
            MethodesObjet_1.MethodesObjet.dupliquer(aParams.listeDestinataires);
          const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
            {
              pere: aInstanceMessagerie,
              evenement: function (
                aGenreRessource,
                aListeSelectionnee,
                aNumeroBouton,
              ) {
                if (aNumeroBouton !== 0) {
                  return;
                }
                aParams.listeDestinataires.vider();
                aListeSelectionnee.parcourir((aRessource) => {
                  const lRessource =
                    MethodesObjet_1.MethodesObjet.dupliquer(aRessource);
                  lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                  aParams.listeDestinataires.addElement(lRessource);
                });
              },
            },
            {
              titre:
                aParams.genreDiscussion ===
                TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte
                  ? ObjetTraduction_1.GTraductions.getValeur(
                      "Messagerie.DestinatairesAlerteEtab",
                    )
                  : aParams.genreDiscussion ===
                      TypeGenreDiscussion_1.TypeGenreDiscussion.GD_ContactVS
                    ? ObjetTraduction_1.GTraductions.getValeur(
                        "Messagerie.SelectionDesPersonnels",
                      )
                    : ObjetTraduction_1.GTraductions.getValeur(
                        "Messagerie.ListeDestinataires",
                      ),
            },
          );
          lFenetre.setOptionsFenetreSelectionRessource(
            Object.assign(
              { listeFlatDesign: true },
              aParams.optionsFenetreSelRess,
            ),
          );
          lFenetre.setDonnees({
            listeRessources: aParams.listeContacts,
            listeRessourcesSelectionnees: lRessourcesSelectionnees,
            genreRessource: Enumere_Ressource_1.EGenreRessource.Personnel,
          });
        },
      },
    };
    (aInstanceMessagerie.controleur.comboEtablissement = {
      init: function (aInstanceCombo) {
        aInstanceCombo.setOptionsObjetSaisie({
          longueur: 160,
          labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
            "WAI.SelectionEtablissement",
          ),
        });
      },
      getDonnees: function (aDonnees) {
        if (aDonnees) {
          return;
        }
        return aParams.alerte.listeEtablissements;
      },
      getIndiceSelection: function (aInstanceCombo) {
        return aInstanceCombo.Selection > 0 ? aInstanceCombo.Selection : 0;
      },
      async event(aParametres, aInstanceCombo) {
        if (
          aParametres.genreEvenement ===
            Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
              .selection &&
          aParametres.element &&
          aInstanceCombo.estUneInteractionUtilisateur()
        ) {
          aParams.listeDestinataires.vider();
          if (aParametres.element.getNumero() === -1) {
            aParams.listeContacts.parcourir((aContact) => {
              const lRessource =
                MethodesObjet_1.MethodesObjet.dupliquer(aContact);
              if (lRessource.getNumero() !== 0) {
                lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                aParams.listeDestinataires.add(lRessource);
              }
            });
          } else {
            const lReponse =
              await new UtilitaireContactVieScolaire_1.ObjetRequeteSaisieContactVieScolaire()
                .setOptions({ messageDetail: "" })
                .lancerRequete({
                  pourAlerte: true,
                  pourEtablissement: true,
                  etablissement: aParametres.element,
                });
            const lListeContacts = lReponse.JSONReponse.listeContacts;
            lListeContacts.parcourir((aContact) => {
              const lRessource =
                MethodesObjet_1.MethodesObjet.dupliquer(aContact);
              lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              aParams.listeDestinataires.add(lRessource);
            });
          }
        }
      },
    }),
      (aInstanceMessagerie.controleur.afficherComboEtab = function () {
        return aParams.alerte.listeEtablissements.count() > 0;
      });
    const lId = GUID_1.GUID.getId();
    H.push(
      IE.jsx.str(
        "div",
        { "ie-if": "destinatairesChat.afficher" },
        IE.jsx.str(
          "div",
          { style: "margin-left: 5px; float: right;" },
          IE.jsx.str(
            "ie-bouton",
            {
              "ie-model": "destinatairesChat.btn",
              "aria-label": ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.ChoisirDestinataires",
              ),
              "aria-describedby": lId,
            },
            "...",
          ),
        ),
        IE.jsx.str("div", {
          id: lId,
          "ie-html": "destinatairesChat.libelle",
          "ie-title": "destinatairesChat.hint",
          style: "margin-left: 5px; margin-top:4px; float: right;",
        }),
      ),
    );
    return H.join("");
  }
  _creerFenetreDiscussion(
    aOptions,
    aOptionsFenetreDiscussion,
    aOptionsFenetre,
  ) {
    let lLargeur = 515,
      lEcart = 25,
      lFenetre,
      lOptions = Object.assign(
        { estAlertePPMS: false, estConversation: false, message: null },
        aOptions,
      ),
      lOptionsFenetreDiscussion = Object.assign(
        {
          avecListeDiscussions: false,
          estChat: true,
          heightDiscussionFixe: false,
          maxHeightDiscussion: 300,
          getHtmlDestinataires: null,
        },
        aOptionsFenetreDiscussion,
      );
    if (lOptions.estAlertePPMS) {
      this.compteurFenetreAlertePPMS += 1;
    }
    const lInstance = this;
    const lOptionsFenetre = Object.assign(
      {
        largeur: lLargeur,
        hauteur: null,
        avecTailleSelonContenu: true,
        listeBoutons: [],
        modale: false,
        avecAbonnementFermetureFenetreGenerale: false,
        callbackDeplacer: function () {
          delete lFenetresPosition[lFenetre.getNom()];
        },
        callbackFermer: function () {
          delete lFenetresPosition[lFenetre.getNom()];
          if (lOptions.estAlertePPMS) {
            lInstance.compteurFenetreAlertePPMS = Math.max(
              0,
              lInstance.compteurFenetreAlertePPMS - 1,
            );
          }
          if (lOptions.message) {
            delete lOptions.message.estFenetreAffichee;
          }
        },
      },
      aOptionsFenetre,
    );
    if (lOptions.estConversation) {
      if (!lOptionsFenetre.listeBoutons) {
        lOptionsFenetre.listeBoutons = [];
      }
      lOptionsFenetre.listeBoutons.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.QuitterModeInstantane",
        ),
        title: ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.HintQuitterModeInstantane",
        ),
        estSortieConversation: true,
      });
    }
    lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_Discussion_1.ObjetFenetre_Discussion,
      {
        pere: GInterface,
        evenement: function (aNumeroBouton) {
          const lBouton = lFenetre.getBoutonNumero(aNumeroBouton);
          if (lBouton && lBouton.estSortieConversation) {
            MoteurMessagerie_1.MoteurMessagerie.saisieSortirConversation(
              GInterface,
              lOptions.message,
              lOptions.possessionMessageDiscussionUnique,
            );
          }
        },
        initialiser: false,
      },
      lOptionsFenetre,
    );
    if (lOptions.message) {
      lOptions.message.estFenetreAffichee = true;
    }
    const lCompteur = Object.keys(lFenetresPosition).length;
    lFenetresPosition[lFenetre.getNom()] = true;
    lFenetre.coordonnees = {
      left: GNavigateur.clientL - lLargeur - 30 - lCompteur * lEcart,
      top: 90 + lCompteur * lEcart,
    };
    lFenetre.setOptions(lOptionsFenetreDiscussion);
    lFenetre.initialiser();
    return lFenetre;
  }
  _afficherFichesConversation(aMessage) {
    let lFiche = null;
    if (aMessage && aMessage.listePossessionsMessages) {
      this.fichesConversationEnCours.every((aFiche) => {
        if (
          UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
            aMessage,
            aFiche.optionsFenetre.message,
          )
        ) {
          lFiche = aFiche;
        }
        return !lFiche;
      });
    }
    let lIndicePosition = 0;
    if (lFiche) {
      lFiche.setOptionsFenetre({ message: aMessage });
      lIndicePosition = lFiche._indicePosition;
    } else {
      if (!this._avecConversationsEnPopup()) {
        return false;
      }
      const lThis = this;
      lFiche = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFichePopupConversation_1.ObjetFichePopupConversation,
        {
          pere: GInterface,
          initialiser: function (aInstanceFiche) {
            aInstanceFiche.setOptionsFenetre({
              message: aMessage,
              clickSurMessage: () => {
                lThis._afficherChatMessage({
                  message: aMessage,
                  estConversation: true,
                });
              },
              callbackApresFermer: function () {
                MethodesTableau_1.MethodesTableau.remove(
                  lThis.fichesConversationEnCours,
                  lFiche,
                );
              },
            });
          },
        },
      );
      this.fichesConversationEnCours.push(lFiche);
      const lEnsPos = new TypeEnsembleNombre_1.TypeEnsembleNombre();
      this.fichesConversationEnCours.forEach((aFiche) => {
        lEnsPos.add(aFiche._indicePosition);
      });
      lEnsPos.items().every((aPosition) => {
        if (aPosition === lIndicePosition) {
          lIndicePosition += 1;
          return true;
        }
        return false;
      });
      lFiche._indicePosition = lIndicePosition;
    }
    const lEcart = 5;
    const lLeft = Math.max(0, GNavigateur.ecranL - 330 - lEcart);
    const lTop = Math.max(
      lEcart,
      GNavigateur.ecranH -
        88 * (lIndicePosition + 1) -
        (lIndicePosition > 0 ? 5 : 0) -
        lEcart,
    );
    lFiche.afficherFiche({ top: lTop, left: lLeft });
    return true;
  }
  _afficherChatMessage(aParams) {
    var _a;
    const lParams = Object.assign(
      {
        message: null,
        possessionMessageDiscussionUnique: null,
        estConversation: false,
        optionsFenetre: null,
        optionsDiscusssion: null,
      },
      aParams,
    );
    const lInfos = this._getInfosChatMessage(lParams.message);
    const lFenetre = this._creerFenetreDiscussion(
      {
        estAlertePPMS:
          (_a = lParams.message) === null || _a === void 0
            ? void 0
            : _a.estAlerte,
        estConversation: lParams.estConversation,
        message: lParams.message,
      },
      lParams.optionsDiscusssion,
      lParams.optionsFenetre,
    );
    const lListeMessagerie =
      new ObjetListeElements_1.ObjetListeElements().addElement(lParams.message);
    lFenetre.setDonnees({
      discussion: lParams.message,
      possessionMessageDiscussionUnique:
        lParams.possessionMessageDiscussionUnique,
      estConversation: lParams.estConversation,
      listeMessagerie: lListeMessagerie,
      objet: lInfos.titre,
      contenuInitial: lInfos.contenuInitial,
    });
  }
}
exports.ClasseUtilitaireContactVieScolaire_Espace =
  ClasseUtilitaireContactVieScolaire_Espace;
const lFenetresPosition = {};
exports.UtilitaireContactVieScolaire_Espace =
  new ClasseUtilitaireContactVieScolaire_Espace();

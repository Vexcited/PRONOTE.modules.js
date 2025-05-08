exports.InterfacePageMessagerie_Mobile = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeOrigineCreationEtiquetteMessage_1 = require("TypeOrigineCreationEtiquetteMessage");
const ObjetListe_1 = require("ObjetListe");
const tag_1 = require("tag");
const DonneesListe_Messagerie_1 = require("DonneesListe_Messagerie");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetFenetre_1 = require("ObjetFenetre");
const DonneesListe_SelectEtiquettes_1 = require("DonneesListe_SelectEtiquettes");
const Enumere_Etat_1 = require("Enumere_Etat");
class InterfacePageMessagerie_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.idDiscussions = this.Nom + "_Convers";
    this.idFenetreConversation = this.Nom + "_FenetreConvers";
    this.listeMessagerie = null;
    this.listesDiffusion = null;
    this.surAffichageDiscussions = true;
    this.etiquetteSelectionnee = null;
    this.message = null;
    this.indiceMessage = null;
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    const lListeDestProfs =
      UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestProfsDiscussionPrimEleveFormat();
    this.avecDiscussionProf =
      !UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDestinatairesProfsStatique() ||
      (lListeDestProfs && lListeDestProfs.count() > 0);
    this.AddSurZone = [
      {
        html: IE.jsx.str("ie-btnselecteur", {
          "ie-model": "btnSelecteurEtiquette",
          "ie-if": "btnSelecteurEtiquette.getVisible",
          "aria-label": ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.MesDossiersDiscussions",
          ),
        }),
      },
    ];
    this.moteurMessagerie =
      new MoteurMessagerie_1.MoteurMessagerie().setOptions({
        instance: this,
        avecFiltreNonLues: true,
      });
    this.pageDiscussion = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile,
      { pere: this, moteurMessagerie: this.moteurMessagerie },
    );
    this.pageDiscussion.setOptions({
      estChat: false,
      estDiscussionResponsables:
        this.etatUtilisateurSco.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Mobile_Parent,
      activerBoutonsBrouillon: true,
      callbackFermeture: this._retourListe.bind(this),
      callbackEnvoyer: (aParams) => {
        if (aParams && aParams.creationDiscussion) {
          if (aParams.message) {
            this.message = MethodesObjet_1.MethodesObjet.dupliquer(
              aParams.message,
            );
          }
          this.pageDiscussion.masquer();
        } else {
          this._evenementSurSaisieMessage();
        }
      },
    });
    Invocateur_1.Invocateur.abonner(
      "actualiserListeDiscussion_mobile",
      () => {
        this._retourListe();
      },
      this,
    );
    Invocateur_1.Invocateur.abonner(
      "notification_actualisationMessage",
      this.notificationActualisationMessage,
      this,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnSelecteurEtiquette: {
        event() {
          aInstance._ouvrirFenetreEtiquettes();
        },
        getLibelle() {
          return aInstance.etiquetteSelectionnee
            ? aInstance.etiquetteSelectionnee.getLibelle()
            : "";
        },
        getIcone() {
          if (aInstance.etiquetteSelectionnee) {
            if (aInstance.etiquetteSelectionnee.estSansEtiquette) {
              return IE.jsx.str("div", {
                class: "utilMess_etiquette sans-etiquette",
              });
            }
            return UtilitaireMessagerie_1.UtilitaireMessagerie.construireImageEtiquette(
              aInstance.etiquetteSelectionnee,
            ).icone;
          }
          return "";
        },
        getVisible() {
          return aInstance.surAffichageDiscussions;
        },
      },
      getDisplayDiscussions(aPourDiscussions) {
        return aPourDiscussions === aInstance.surAffichageDiscussions;
      },
      getIdentiteListe: function () {
        return {
          class: ObjetListe_1.ObjetListe,
          pere: aInstance,
          evenement: function (aParametres) {
            switch (aParametres.genreEvenement) {
              case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
                aInstance._ouvrirFenetreCreation();
                return;
              case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
                aInstance._surClicConversation(
                  UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
                    aInstance.listeMessagerie,
                    aParametres.article,
                  ),
                );
                return;
            }
          },
          start: function (aListe) {
            aInstance.instanceListeMessagerie = aListe;
            const lListeBoutons = [];
            lListeBoutons.push({
              html: (0, tag_1.tag)(
                "ie-checkbox",
                { "ie-model": "cbNonLu", "ie-textleft": true },
                ObjetTraduction_1.GTraductions.getValeur("Messagerie.NonLues"),
              ),
              controleur: {
                cbNonLu: {
                  getValue: function () {
                    return aInstance.applicationSco.parametresUtilisateur.get(
                      "Communication.DiscussionNonLues",
                    );
                  },
                  setValue: function (aValue) {
                    aInstance.applicationSco.parametresUtilisateur.set(
                      "Communication.DiscussionNonLues",
                      !!aValue,
                    );
                    aInstance.moteurMessagerie.modifierVisibiliteListeMessagerie(
                      null,
                    );
                    aListe.actualiser();
                  },
                },
              },
            });
            if (
              aInstance.moteurMessagerie.avecIconeAvertissementListeMessagerie()
            ) {
              lListeBoutons.push({
                class: "icon_warning_sign",
                title: ObjetTraduction_1.GTraductions.getValeur(
                  "Messagerie.TitreFenetreAvertissement",
                ),
                event: function () {
                  aInstance.moteurMessagerie.ouvrirFenetreAvertissement(false);
                },
              });
            }
            if (
              aInstance.etiquetteSelectionnee &&
              aInstance.etiquetteSelectionnee.getGenre() ===
                TypeOrigineCreationEtiquetteMessage_1
                  .TypeOrigineCreationEtiquetteMessage.OCEM_Pre_Poubelle &&
              aInstance.applicationSco.droits.get(
                ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
              )
            ) {
              lListeBoutons.push({
                class: "icon_trash",
                title: ObjetTraduction_1.GTraductions.getValeur(
                  "Messagerie.Menu_ViderCorbeille",
                ),
                event: function () {
                  const lNb =
                    aInstance.moteurMessagerie.getNbMessagesSupprimablesPoubelle();
                  aInstance.moteurMessagerie.saisieViderCorbeille(lNb);
                },
                getDisabled: function () {
                  return (
                    aInstance.moteurMessagerie.getNbMessagesSupprimablesPoubelle() ===
                    0
                  );
                },
              });
            }
            aInstance.moteurMessagerie.ouvrirFenetreAvertissement(true);
            aListe.setOptionsListe({
              colonnes: [{ taille: "100%" }],
              skin: ObjetListe_1.ObjetListe.skin.flatDesign,
              avecLigneCreation:
                !aInstance.applicationSco.droits.get(
                  ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
                ) && aInstance.avecDiscussionProf,
              messageContenuVide: aInstance.applicationSco.droits.get(
                ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
              )
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.AucuneDiscussion",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.DiscussionsDesactivees",
                  ),
              boutons: lListeBoutons,
              nonEditableSurModeExclusif: true,
            });
            aInstance.moteurMessagerie.modifierVisibiliteListeMessagerie(null);
            aListe.setDonnees(
              new DonneesListe_Messagerie_1.DonneesListe_Messagerie(
                aInstance.listeMessagerie,
              ).setOptions({
                avecDeploiement: true,
                avecImagePurge: true,
                getEtiquette: function () {
                  return aInstance.etiquetteSelectionnee;
                }.bind(aInstance),
                avecToutesIconesGauche: true,
                addCommandesMenuContextuel(aParametres) {
                  return aInstance.moteurMessagerie.addCommandesMenuContextuelDiscussion(
                    {
                      message: aParametres.article,
                      menuContextuel: aParametres.menuContextuel,
                      callback: function (aParams, aCommande) {
                        aInstance.pageDiscussion.execCommandesMenuContextuel(
                          aParams,
                        );
                      },
                    },
                  );
                },
              }),
            );
            if (aInstance._jetonPositionScrollListe > 0) {
              aListe.setPositionScrollV(aInstance._jetonPositionScrollListe);
              aInstance._jetonPositionScrollListe = null;
            }
          },
        };
      },
    });
  }
  async recupererDonnees() {
    await this.requeteListe();
    if (this.etatUtilisateurSco.message) {
      this.message = null;
      this.indiceMessage = null;
      this.listeMessagerie_TOUTES.parcourir((aMessage, aIndex) => {
        if (
          UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
            aMessage,
            this.etatUtilisateurSco.message,
          )
        ) {
          this.message = aMessage;
          this.indiceMessage = aIndex;
          return false;
        }
      });
      delete this.etatUtilisateurSco.message;
      if (this.message) {
        this._requeteListeMessages(this.message);
      }
    }
  }
  _actualiser(aConserverPosScroll = true) {
    this._setListeMessagerie(this.listeMessagerie_TOUTES);
    this._jetonPositionScrollListe = null;
    if (this.instanceListeMessagerie && aConserverPosScroll) {
      this._jetonPositionScrollListe =
        this.instanceListeMessagerie.getPositionScrollV();
    }
    const lHtml = IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        {
          id: this.idDiscussions,
          class: "full-height",
          "ie-display": "getDisplayDiscussions(true)",
        },
        IE.jsx.str("div", {
          "ie-identite": "getIdentiteListe",
          class: "full-height",
        }),
      ),
      IE.jsx.str("div", {
        id: this.pageDiscussion.getNom(),
        class: "full-height",
        "ie-display": "getDisplayDiscussions(false)",
      }),
      IE.jsx.str("div", {
        id: this.idFenetreConversation,
        style: "display:none;",
      }),
    );
    this.afficher(lHtml);
  }
  async _retourListe() {
    this.surAffichageDiscussions = true;
    return await this.requeteListe();
  }
  _setListeMessagerie(aListeMessagerie) {
    this.listeMessagerie = new ObjetListeElements_1.ObjetListeElements();
    if (aListeMessagerie) {
      aListeMessagerie.parcourir((aMessage) => {
        if (
          UtilitaireMessagerie_1.UtilitaireMessagerie.estDiscussionVisibleSelonEtiquette(
            aMessage,
            this.etiquetteSelectionnee,
          )
        ) {
          this.listeMessagerie.add(aMessage);
        }
      });
    }
  }
  async _evenementSurSaisieMessage() {
    await this.requeteListe(true);
    this.instanceListeMessagerie.actualiser(true);
    const lIndice =
      UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
        this.listeMessagerie_TOUTES,
        this.message,
      );
    const lMessage = this.listeMessagerie_TOUTES.get(lIndice);
    if (lMessage && (lMessage.nbPublic || lMessage.public)) {
      this.message = lMessage;
      this._requeteListeMessages(lMessage);
    }
  }
  _surClicConversation(aNb) {
    this.indiceMessage = aNb;
    this.message = this.listeMessagerie.get(aNb);
    this._requeteListeMessages(this.message);
    $("body").scrollTop(0);
  }
  _requeteListeMessages(aMessage) {
    this.moteurMessagerie
      .requeteMessagesVisu({
        message: aMessage,
        marquerCommeLu: true,
        nbMessagesVus:
          UtilitaireMessagerie_1.UtilitaireMessagerie.palierNbMessages,
      })
      .then((aParamRequete) => {
        this.surAffichageDiscussions = false;
        this.pageDiscussion.setDonnees({
          message: this.message,
          brouillon: aParamRequete.brouillon,
          messagePourReponse: aParamRequete.messagePourReponse,
          listeBoutons: aParamRequete.listeBoutons,
          listeMessages: aParamRequete.listeMessages,
          destinataires: aParamRequete.destinataires,
          nbPossessionsMessageListe: aParamRequete.nbPossessionsMessage,
        });
      });
  }
  async requeteListe(aIgnorerRecuperationEtiquettes) {
    const lReponse = await this.moteurMessagerie.requeteListeMessagerie({
      avecMessage: true,
      avecLu: true,
    });
    this.listeMessagerie_TOUTES = lReponse.listeMessagerie;
    this.listeEtiquettes = lReponse.listeEtiquettes;
    this.listeDestinatairesCarnetLiaison = lReponse.destinatairesCarnetLiaison;
    this.pageDiscussion.setOptions({
      listeEtiquettes: this.listeEtiquettes,
      listeMessagerie: this.listeMessagerie_TOUTES,
    });
    this._setListeMessagerie(lReponse.listeMessagerie);
    if (!aIgnorerRecuperationEtiquettes) {
      let lMessage = null;
      if (this.etatUtilisateurSco.message) {
        lMessage = this.listeMessagerie_TOUTES.get(
          UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
            this.listeMessagerie_TOUTES,
            this.etatUtilisateurSco.message,
          ),
        );
      }
      this.etiquetteSelectionnee =
        UtilitaireMessagerie_1.UtilitaireMessagerie.getEtiquetteInitSelonMessage(
          this.listeEtiquettes,
          this.etiquetteSelectionnee,
          true,
          lMessage,
        );
      this._actualiser();
    }
    return lReponse;
  }
  _ouvrirFenetreCreation() {
    if (
      !UtilitaireMessagerie_1.UtilitaireMessagerie.controleMessagerieDesactivee()
    ) {
      return;
    }
    this.surAffichageDiscussions = false;
    const lEstPrimParentSurEtiquetteCL =
      this.etatUtilisateurSco.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Mobile_PrimParent &&
      this.etiquetteSelectionnee &&
      this.etiquetteSelectionnee.getGenre() ===
        TypeOrigineCreationEtiquetteMessage_1
          .TypeOrigineCreationEtiquetteMessage.OCEM_Pre_CarnetLiaison &&
      this.etiquetteSelectionnee.contexte &&
      this.etiquetteSelectionnee.contexte.getNumero();
    let lListeDestCarnetLiaison = null;
    let lEleveCarnetLiaison = null;
    if (lEstPrimParentSurEtiquetteCL) {
      lEleveCarnetLiaison = this.etiquetteSelectionnee.contexte;
      lListeDestCarnetLiaison =
        UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestCarnetLiaisonDElevePrimParent(
          lEleveCarnetLiaison.getNumero(),
        ).parcourir((aDest) => {
          aDest.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        });
    }
    this.pageDiscussion.setDonnees({
      message: this.message,
      creationDiscussion: true,
      estPrimParentSurEtiquetteCL: lEstPrimParentSurEtiquetteCL,
      listeDestinatairesCarnetLiaison: lListeDestCarnetLiaison,
      eleveCarnetLiaison: lEleveCarnetLiaison,
      titre: lEstPrimParentSurEtiquetteCL
        ? ObjetTraduction_1.GTraductions.getValeur(
            "MessagerieCarnetLiaison.TitreFenetreNouveauPourVotreEnfant",
          )
        : "",
    });
    this.$refreshSelf();
  }
  notificationActualisationMessage() {
    if (!this.pageDiscussion.estAffiche()) {
      this.requeteListe();
    }
  }
  _ouvrirFenetreEtiquettes() {
    const lCreateDonneesListe = () => {
      return new DonneesListe_SelectEtiquettes_1.DonneesListe_SelectEtiquettes(
        this.listeEtiquettes,
        {
          listeMessages: this.listeMessagerie_TOUTES,
          moteurMessagerie: this.moteurMessagerie,
        },
      ).setOptions({ flatDesignMinimal: false });
    };
    const lInstance = this;
    class ObjetFenetreEtiquette extends ObjetFenetre_1.ObjetFenetre {
      getControleur(aInstance) {
        return $.extend(true, super.getControleur(aInstance), {
          listeEtiquettes() {
            return {
              class: ObjetListe_1.ObjetListe,
              pere: aInstance,
              init(aListe) {
                aInstance.instanceListe = aListe;
                aListe.setOptionsListe({
                  skin: ObjetListe_1.ObjetListe.skin.flatDesign,
                });
              },
              evenement(aParametres) {
                switch (aParametres.genreEvenement) {
                  case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
                    if (aParametres.article.categories) {
                      lInstance.moteurMessagerie.ouvrirFenetreListeCategoriesDiscussion(
                        null,
                        lInstance.listeEtiquettes,
                        async () => {
                          await lInstance._retourListe();
                          aInstance.instanceListe.setDonnees(
                            lCreateDonneesListe(),
                          );
                        },
                      );
                    } else {
                      lInstance.etiquetteSelectionnee = aParametres.article;
                      lInstance._actualiser(false);
                      aInstance.fermer();
                    }
                    break;
                }
              },
            };
          },
        });
      }
      surAfficher() {
        this.instanceListe.setDonnees(lCreateDonneesListe());
      }
    }
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(ObjetFenetreEtiquette, {
      pere: this,
      initialiser(aFenetre) {
        aFenetre.setOptionsFenetre({
          heightMax_mobile: true,
          empilerFenetre: false,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.MesDossiersDiscussions",
          ),
        });
      },
    }).afficher(
      IE.jsx.str("div", {
        "ie-identite": "listeEtiquettes",
        class: "full-height",
      }),
    );
  }
}
exports.InterfacePageMessagerie_Mobile = InterfacePageMessagerie_Mobile;

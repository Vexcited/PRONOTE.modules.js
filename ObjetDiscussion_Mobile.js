exports.ObjetDiscussion_Mobile = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const TypeHttpReponseMessage_1 = require("TypeHttpReponseMessage");
const Invocateur_1 = require("Invocateur");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const TypeCommandeMessagerie_1 = require("TypeCommandeMessagerie");
const tag_1 = require("tag");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DestDiscussion_Mobile_1 = require("ObjetFenetre_DestDiscussion_Mobile");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_Espace_1 = require("Enumere_Espace");
const TinyInit_1 = require("TinyInit");
const UtilitaireTiny_1 = require("UtilitaireTiny");
const jsx_1 = require("jsx");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const GUID_1 = require("GUID");
class ObjetDiscussion_Mobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    this._estAffiche = false;
    this.listePJ = new ObjetListeElements_1.ObjetListeElements();
    this.idConteneurPanel = this.Nom + "_ConteneurPanel";
    this.idConversation_Reponse = this.Nom + "_ConversReponse";
    this.idCheckboxDirecteur = this.Nom + "_cbDirecteur";
    this.idTiny = `${this.Nom}_tinyReponse`;
    this.avecInclureParentsEleves = false;
    this.moteurMessagerie = aParams ? aParams[0].moteurMessagerie : null;
    this.moteurMessagerie.setOptions({
      callbackApresSaisie: (aGenre) => {
        switch (aGenre) {
          case MoteurMessagerie_1.MoteurMessagerie.TypeApresSaisieMessage.vider:
            return this.masquer();
        }
      },
    });
    const lDiscussionAvancee = this.applicationSco.droits.get(
      ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
    );
    this.setOptions({
      estDiscussionEnFenetre: false,
      estChat: false,
      genreDiscussion: TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Discussion,
      callbackEnvoyer: null,
      callbackNavigation: null,
      callbackFermeture: null,
      callbackBtnCreation: null,
      callbackSelectDiscussion: null,
      discussionAvancee: lDiscussionAvancee,
      avecPJ:
        UtilitaireMessagerie_1.UtilitaireMessagerie.avecAjoutPieceJointeMessage(),
      avecHtml: UtilitaireMessagerie_1.UtilitaireMessagerie.avecEditeurTiny(),
      parametresSupplementaireSaisieDiscussion: null,
      genresDestinatairesAutorises: null,
      avecDestinatairesListeDiffusion: true,
      activerBoutonsBrouillon: false,
    });
    Invocateur_1.Invocateur.abonner(
      "notification_actualisationMessage",
      this.notificationActualisationMessage,
      this,
    );
  }
  setOptions(aOptions) {
    super.setOptions(aOptions);
    this.moteurMessagerie.setOptions({ estChat: this.options.estChat });
    return this;
  }
  estAffiche() {
    return this._estAffiche;
  }
  setDonnees(aDonnees) {
    this.donnees = Object.assign(
      {
        message: null,
        destinataires: null,
        listeBoutons: null,
        messagePourReponse: null,
        brouillon: null,
        conserverBrouillon: false,
        creationDiscussion: false,
        alertePPMS: null,
        listeMessages: null,
        tableauDeBord: null,
        listeContacts: null,
        titre: null,
        nbPossessionsMessageListe: 0,
        estPrimParentSurEtiquetteCL: false,
        MAJNbMessages: false,
      },
      aDonnees,
    );
    if (
      this.donnees.creationDiscussion &&
      !UtilitaireMessagerie_1.UtilitaireMessagerie.controleMessagerieDesactivee()
    ) {
      return;
    }
    this._initGenresDest();
    if (!this.donnees.messagePourReponse) {
      this.donnees.messagePourReponse = new ObjetElement_1.ObjetElement();
    }
    if (this.donnees.message) {
      this.donnees.message.lu = true;
    }
    if (
      this.donnees.creationDiscussion &&
      (!this.donnees.listeBoutons || this.donnees.listeBoutons.count() === 0)
    ) {
      this.donnees.listeBoutons =
        new ObjetListeElements_1.ObjetListeElements().addElement(
          new ObjetElement_1.ObjetElement(
            ObjetTraduction_1.GTraductions.getValeur("Messagerie.BtnEnvoyer"),
          ),
        );
    }
    let lBrouillon = this.donnees.brouillon;
    if (this.donnees.conserverBrouillon) {
      lBrouillon = MethodesObjet_1.MethodesObjet.dupliquer(this.newMsg);
    }
    this._initNewMsg(lBrouillon, true);
    this.listePJ =
      this.options.avecPJ && this.etatUtilisateurSco.listeDonnees
        ? this.etatUtilisateurSco.listeDonnees[
            TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
              .THND_ListeDocJointEtablissement
          ]
        : null;
    this.afficher();
  }
  afficher() {
    this._estAffiche = true;
    const lHtml = this._composer();
    let lBackupScroll = 0;
    let lElementScroll;
    if (this.donnees.MAJNbMessages) {
      lElementScroll = this._getElementScroll();
      if (lElementScroll) {
        lBackupScroll = lElementScroll.scrollHeight - lElementScroll.scrollTop;
      }
    }
    if (this.options.estDiscussionEnFenetre) {
      let lJConteneurDiscussion = $("#" + this.getNom().escapeJQ());
      if (
        !ObjetDiscussion_Mobile.ids[this.getNom()] ||
        lJConteneurDiscussion.length === 0
      ) {
        Object.keys(ObjetDiscussion_Mobile.ids).forEach((aId) => {
          const lObj = ObjetDiscussion_Mobile.ids[aId];
          if (lObj && lObj.instance && lObj.instance._fenetreWrapper) {
            lObj.instance._fenetreWrapper.fermer();
          }
        });
        this._fenetreWrapper = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_1.ObjetFenetre,
          {
            pere: {},
            initialiser: (aFenetre) => {
              aFenetre.setOptionsFenetre({
                titre: this._getTitre(this._estNouvelleDiscussion()),
                heightMax_mobile: true,
                fermerFenetreSurClicHorsFenetre: true,
                listeBoutons: [],
                callbackFermer: () => {
                  if (this._fenetreWrapper) {
                    this._fermer();
                  }
                  this._fenetreWrapper = null;
                  this.free();
                },
              });
            },
          },
        );
        this._fenetreWrapper.afficher(
          (0, tag_1.tag)("div", { id: this.getNom(), style: "height: 100%" }),
        );
        lJConteneurDiscussion = $("#" + this.getNom().escapeJQ());
      } else if (this._fenetreWrapper) {
        this._fenetreWrapper.setOptionsFenetre({
          titre: this._getTitre(this._estNouvelleDiscussion()),
        });
      }
      lJConteneurDiscussion.ieHtml(lHtml, { controleur: this.controleur });
      ObjetDiscussion_Mobile.ids[this.getNom()] = { instance: this };
    } else if (this.options.estPanelFixe) {
      const lConteneur = GInterface.getInstance(
        this.applicationSco.getInterfaceMobile().getIdentPageMobile(),
      );
      const lZoneSelection = this.applicationSco.idLigneBandeau;
      ObjetHtml_1.GHtml.addHtml(
        lConteneur.getNom(),
        '<div id="' + this.idConteneurPanel + '"></div>',
      );
      ObjetHtml_1.GHtml.setHtml(this.idConteneurPanel, lHtml, {
        controleur: this.controleur,
      });
      $("#" + this.idConteneurPanel.escapeJQ())
        .siblings()
        .hide();
      $("#" + lZoneSelection.escapeJQ()).hide();
    } else {
      $("#" + this.Nom.escapeJQ()).show();
      super.afficher(lHtml);
    }
    if (this.options.estChat) {
      Invocateur_1.Invocateur.desabonner("traiter_notifications_chatVS", this);
      Invocateur_1.Invocateur.abonner(
        "traiter_notifications_chatVS",
        this._actualisationSurNotificationChat.bind(this),
        this,
      );
    }
    lElementScroll = this._getElementScroll();
    if (lElementScroll) {
      if (lBackupScroll > 0) {
        lElementScroll.scrollTop = lElementScroll.scrollHeight - lBackupScroll;
      } else {
        lElementScroll.scrollTop = lElementScroll.scrollHeight;
      }
    }
  }
  masquer() {
    this._estAffiche = false;
    if (this.options.estDiscussionEnFenetre) {
      if (this._fenetreWrapper) {
        this._fenetreWrapper.fermer();
      }
    } else {
      super.afficher("");
      $("#" + this.Nom.escapeJQ()).hide();
      this._fermer();
    }
  }
  free() {
    if (this.isDestroyed()) {
      return;
    }
    super.free();
    delete ObjetDiscussion_Mobile.ids[this.getNom()];
    if (this.options.estDiscussionEnFenetre) {
      if (this._fenetreWrapper) {
        this._fenetreWrapper.fermer();
      }
      $("#" + this.Nom.escapeJQ()).remove();
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnFermer: {
        event: function () {
          UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
          if (aInstance.options.estPanelFixe) {
            ObjetHtml_1.GHtml.setDisplay(aInstance.idConteneurPanel, false);
            ObjetHtml_1.GHtml.setHtml(aInstance.idConteneurPanel, "");
            const lZoneSelection = aInstance.applicationSco.idLigneBandeau;
            $("#" + aInstance.idConteneurPanel.escapeJQ())
              .siblings()
              .show();
            ObjetHtml_1.GHtml.setDisplay(lZoneSelection, true);
          }
          aInstance.masquer();
        },
      },
      btnNav: {
        event: function (aNavGauche) {
          aInstance.avecInclureParentsEleves = false;
          aInstance.options.callbackNavigation(!!aNavGauche);
        },
      },
      getNodeBtnCreation: function () {
        $(this.node).on("click", (aEvent) => {
          aInstance.options.callbackBtnCreation(aEvent);
        });
      },
      comboEtablissement: {
        getDonnees: function (aDonnees) {
          if (aDonnees) {
            return;
          }
          return aInstance.donnees.alertePPMS.listeEtablissements;
        },
        getIndiceSelection: function (aInstanceCombo) {
          return aInstanceCombo.Selection > 0 ? aInstanceCombo.Selection : 0;
        },
        event: function (aParametres, aInstanceCombo) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            aParametres.element &&
            aInstanceCombo.estUneInteractionUtilisateur()
          ) {
            aInstance.newMsg.listeDestinataires.vider();
            if (aParametres.element.getNumero() === -1) {
              aInstance.donnees.listeContacts.parcourir((aContact) => {
                const lRessource =
                  MethodesObjet_1.MethodesObjet.dupliquer(aContact);
                if (lRessource.getNumero() !== 0) {
                  lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                  aInstance.newMsg.listeDestinataires.add(lRessource);
                }
              });
            } else {
              (0, CollectionRequetes_1.Requetes)("SaisieContactVieScolaire", {})
                .setOptions({ messageDetail: "" })
                .lancerRequete({
                  pourAlerte: true,
                  pourEtablissement: true,
                  etablissement: aParametres.element,
                })
                .then((aReponse) => {
                  const lListeContacts = aReponse.JSONReponse.listeContacts;
                  lListeContacts.parcourir((aContact) => {
                    const lRessource =
                      MethodesObjet_1.MethodesObjet.dupliquer(aContact);
                    lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                    aInstance.newMsg.listeDestinataires.add(lRessource);
                  });
                });
            }
          }
        },
      },
      afficherComboEtab() {
        return (
          aInstance.donnees &&
          aInstance.donnees.alertePPMS.listeEtablissements.count() > 0
        );
      },
      destList: {
        getIcone() {
          return (0, tag_1.tag)("i", { class: "icon_user" });
        },
        getLibelle: function () {
          const lHtml = [];
          if (aInstance.genresDest) {
            aInstance.genresDest.parcourir((aEle) => {
              const lNb = aInstance.newMsg.listeDestinataires
                .getListeElements((aE) => {
                  return aE.getGenre() === aEle.getGenre() && aE.getGenre() > 0;
                })
                .count();
              if (lNb > 0) {
                lHtml.push(
                  (0, tag_1.tag)(
                    "ie-chips",
                    {
                      "ie-model": tag_1.tag.funcAttr(
                        "chipsDest",
                        aEle.getGenre(),
                      ),
                      class: "chips-dest",
                    },
                    aEle.getLibelle() + " (" + lNb + ")",
                  ),
                );
              }
            });
          }
          return lHtml.join("");
        },
      },
      getNodeModifDest: function (aGenre) {
        $(this.node).on("click", (aEvent) => {
          aInstance._popupDestinataires(aEvent, aGenre);
        });
      },
      chipsDest: {
        event: function (aGenre, aEvent) {
          aInstance._popupDestinataires(aEvent, aGenre);
        },
        eventBtn: function (aGenre, aEvent) {
          aEvent.stopPropagation();
          aInstance.newMsg.listeDestinataires =
            aInstance.newMsg.listeDestinataires.getListeElements((aDest) => {
              return aDest.getGenre() !== aGenre;
            });
          aInstance.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        },
      },
      cbProfsDest: {
        getValue(aNumero, aGenre) {
          return !!aInstance.newMsg.listeDestinataires.getElementParNumeroEtGenre(
            aNumero,
            aGenre,
          );
        },
        setValue(aNumero, aGenre, aValue) {
          if (aValue) {
            if (
              !aInstance.newMsg.listeDestinataires.getElementParNumeroEtGenre(
                aNumero,
                aGenre,
              )
            ) {
              const lDest = new ObjetElement_1.ObjetElement({
                Numero: aNumero,
                Genre: aGenre,
              });
              lDest.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              aInstance.newMsg.listeDestinataires.add(lDest);
            }
          } else {
            if (aInstance.newMsg.listeDestinataires.count() > 1) {
              aInstance.newMsg.listeDestinataires.removeFilter((aDest) => {
                return (
                  aDest.getNumero() === aNumero && aDest.getGenre() === aGenre
                );
              });
            }
          }
        },
      },
      cbExerciceAlerte: {
        getValue: function () {
          return aInstance.newMsg.estExercice;
        },
        setValue: function (aValue) {
          aInstance.newMsg.estExercice = aValue;
        },
      },
      modelChipsPJ: {
        eventBtn: function (aIndice) {
          const lElement = aInstance.newMsg.listeFichiers
            ? aInstance.newMsg.listeFichiers.get(aIndice)
            : null;
          if (lElement) {
            aInstance.applicationSco
              .getMessage()
              .afficher({
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "selecteurPJ.msgConfirmPJ",
                  [lElement.getLibelle()],
                ),
              })
              .then((aGenreAction) => {
                if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
                  lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
                  aInstance.newMsg.setEtat(
                    Enumere_Etat_1.EGenreEtat.Modification,
                  );
                }
              });
          }
        },
        getDisabled: function (aIndice) {
          const lElement = aInstance.newMsg.listeFichiers
            ? aInstance.newMsg.listeFichiers.get(aIndice)
            : null;
          return !aInstance.Actif || !lElement;
        },
      },
      getHtmlPJ: function () {
        if (
          aInstance.options.avecPJ &&
          aInstance.newMsg.listeFichiers &&
          aInstance.newMsg.listeFichiers.count() > 0
        ) {
          return UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
            aInstance.newMsg.listeFichiers,
            { IEModelChips: "modelChipsPJ" },
          );
        }
        return "";
      },
      inputObjet: {
        getValue: function () {
          return aInstance.newMsg.objet || "";
        },
        setValue: function (aValue) {
          aInstance.newMsg.objet = aValue;
          aInstance.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        },
      },
      nodeTiny() {
        TinyInit_1.TinyInit.init({
          id: this.node.id,
          autoresize_bottom_margin: 0,
          autoresize_on_init: true,
          min_height: 22,
          max_height: aInstance.donnees.creationDiscussion ? 170 : 120,
          height: "",
          plugins: ["autoresize"],
          toolbar: false,
          setup: function (editor) {
            editor.on("KeyUp", function () {
              aInstance._setValeurMessage(editor.getContent(), true);
            });
            editor.on("Change", function () {
              if (!editor._enCoursDestruction) {
                aInstance._setValeurMessage(editor.getContent(), true);
              }
            });
          },
        }).then((aEditor) => {
          if (aEditor) {
            aEditor.setContent(aInstance.newMsg.contenu || "");
          }
        });
      },
      modelSaisieContenu: {
        getValue: function () {
          return aInstance.newMsg.contenu;
        },
        setValue: function (aEstHtml, aValue) {
          aInstance._setValeurMessage(aValue, false);
        },
        fromDisplay(aEstHtml, aValue) {
          let lValue = aValue;
          if (aEstHtml) {
            const lJNode = $((0, tag_1.tag)("div", aValue));
            const lAvec = ObjetHtml_1.GHtml.nettoyerEditeurRiche(lJNode);
            if (lAvec) {
              lValue = lJNode.get(0).innerHTML;
              aInstance.applicationSco
                .getMessage()
                .afficher({
                  message: ObjetTraduction_1.GTraductions.getValeur(
                    "CahierDeTexte.MessageSuppressionImage",
                  ),
                });
            }
            lValue = ObjetChaine_1.GChaine.htmlDOMPurify(lValue);
          }
          return lValue;
        },
        node: function (aEstHtml) {
          if (!aEstHtml) {
            return;
          }
          $(this.node).on({
            focus: function () {
              $(this).siblings("label").addClass("active");
            },
            blur: function () {
              if (!this.innerHTML) {
                $(this).siblings("label").removeClass("active");
              }
            },
          });
          const lThis = this.node;
          $(this)
            .siblings("label")
            .on("focus", () => {
              lThis.focus();
            });
        },
      },
      btnIconPiedSaisie: {
        event: function (
          aAvecPJ,
          aAvecModifDest,
          aAvecBtnInclurePE,
          aInclurePEHorsLimite,
          aAvecCommandesBrouillon,
          aAvecSignature,
          aAvecTiny,
        ) {
          ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
            pere: aInstance,
            id: this.node,
            initCommandes: function (aMenu) {
              aInstance._addCommandesMenuPiedSaisie(
                aMenu,
                aAvecPJ,
                aAvecModifDest,
                aAvecBtnInclurePE,
                aInclurePEHorsLimite,
                aAvecCommandesBrouillon,
                aAvecSignature,
                aAvecTiny,
              );
            },
          });
        },
      },
      buttonRepondre: {
        event: function (aGenre) {
          aInstance._surBoutonRepondre(aGenre);
        },
        getDisabled: function () {
          return aInstance.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.estEnConsultation,
          );
        },
      },
      visuMessage: {
        btnDest: {
          event(aNumeroMessage, aParticipants) {
            aInstance._afficherFenetreDestinatairesDemessage(
              aNumeroMessage,
              aParticipants,
              false,
            );
          },
        },
      },
      cbProfsCarnetL: {
        getValue: function (aNumeroArticle) {
          return !!aInstance.listeSelectionProfsCarnetLiaison.getElementParNumero(
            aNumeroArticle,
          );
        },
        setValue: function (aNumeroArticle, aValue) {
          if (!aValue) {
            if (aInstance.listeSelectionProfsCarnetLiaison.count() === 1) {
              return;
            }
            const lIndice =
              aInstance.listeSelectionProfsCarnetLiaison.getIndiceParNumeroEtGenre(
                aNumeroArticle,
              );
            if (lIndice >= 0) {
              aInstance.listeSelectionProfsCarnetLiaison.remove(lIndice);
            }
          } else {
            if (
              !aInstance.listeSelectionProfsCarnetLiaison.getElementParNumero(
                aNumeroArticle,
              )
            ) {
              aInstance.listeSelectionProfsCarnetLiaison.add(
                new ObjetElement_1.ObjetElement("", aNumeroArticle),
              );
            }
          }
        },
      },
      cbInclureResp2: {
        getValue() {
          let lListe = aInstance.newMsg.listeDestinataires;
          let lActif = false;
          lListe.parcourir((aDest) => {
            if (
              aDest.getGenre() ===
              Enumere_Ressource_1.EGenreRessource.Responsable
            ) {
              lActif = aDest.Actif;
            }
          });
          return lActif;
        },
        setValue(aValue) {
          let lListe = aInstance.newMsg.listeDestinataires;
          lListe.parcourir((aDest) => {
            if (
              aDest.getGenre() ===
              Enumere_Ressource_1.EGenreRessource.Responsable
            ) {
              aDest.Actif = aValue;
            }
          });
        },
      },
      modelComboAlerte: {
        init(aCombo) {
          const lListe = new ObjetListeElements_1.ObjetListeElements();
          aInstance.donnees.alertePPMS.listeModelesAlerte.parcourir(
            (aModele) => {
              const lArticle = new ObjetElement_1.ObjetElement(
                aModele.getLibelle(),
              );
              lArticle.modele = aModele;
              lListe.add(lArticle);
              lArticle.callbackSelection = (aParametres) => {
                if (aParametres.estSelectionManuelle) {
                  aInstance.newMsg.modeleAlerte =
                    MethodesObjet_1.MethodesObjet.dupliquer(
                      aParametres.element.modele,
                    );
                  aInstance._setValeurMessage(
                    aInstance.newMsg.modeleAlerte.contenu,
                    false,
                  );
                  if (aInstance.options.avecHtml) {
                    TinyInit_1.TinyInit.onLoadEnd(aInstance.idTiny).then(
                      (aParams) => {
                        if (aParams.tiny) {
                          aParams.tiny.setContent(
                            aInstance.newMsg.modeleAlerte.contenu,
                          );
                        }
                      },
                    );
                  }
                }
              };
            },
          );
          aCombo.setDonneesObjetSaisie({ liste: lListe, selection: 0 });
        },
      },
      comboTableauDeBord_choixDisc: {
        init(aCombo) {
          const lListe = new ObjetListeElements_1.ObjetListeElements();
          let lIndiceSelection = 0;
          if (
            aInstance.donnees.tableauDeBord &&
            aInstance.donnees.tableauDeBord.listeDiscussions
          ) {
            aInstance.donnees.tableauDeBord.listeDiscussions.parcourir(
              (D, aIndiceDiscussion) => {
                if (D.estUneDiscussion && D.profondeur === 0) {
                  const lElement = new ObjetElement_1.ObjetElement(
                    D.objet ||
                      ObjetTraduction_1.GTraductions.getValeur(
                        "Messagerie.ObjetVideDiscussion",
                      ),
                  );
                  lListe.add(lElement);
                  if (
                    aInstance.donnees.tableauDeBord
                      .indiceDiscussionSelectionnee === aIndiceDiscussion
                  ) {
                    lIndiceSelection = lListe.count() - 1;
                  }
                  lElement.callbackSelection = (aParametres) => {
                    if (
                      aParametres.estSelectionManuelle &&
                      aIndiceDiscussion !==
                        aInstance.donnees.tableauDeBord
                          .indiceDiscussionSelectionnee
                    ) {
                      aInstance.avecInclureParentsEleves = false;
                      aInstance.options.callbackSelectDiscussion(
                        aIndiceDiscussion,
                      );
                    }
                  };
                }
              },
            );
          }
          aCombo.setDonneesObjetSaisie({
            liste: lListe,
            selection: lIndiceSelection,
          });
        },
      },
    });
  }
  execCommandesMenuContextuel(aParams) {
    const lInstance = this;
    switch (aParams.genre) {
      case TypeCommandeMessagerie_1.TypeCommandeMessagerie
        .afficherDestinataires:
        if (aParams.numeroMessage) {
          this._afficherFenetreDestinatairesDemessage(
            aParams.numeroMessage,
            aParams.estPublicParticipant,
            aParams.estDestinatairesReponse,
          );
        }
        return;
      case TypeCommandeMessagerie_1.TypeCommandeMessagerie.repondreMessage:
        this._requeteListeMessages({
          titre: this.donnees.titre,
          message: aParams.message,
          marquerCommeLu: false,
        });
        return;
      case TypeCommandeMessagerie_1.TypeCommandeMessagerie.afficherDiscussion: {
        let lMessage = aParams.message;
        while (lMessage && lMessage.pere) {
          lMessage = lMessage.pere;
        }
        if (lMessage) {
          this._requeteListeMessages({
            titre: this.donnees.titre,
            message: lMessage,
            marquerCommeLu: false,
          });
        }
        return;
      }
      default:
        return lInstance.masquer();
    }
  }
  static creerCarnetDeLiaisonPrimParent() {
    const lEleve = GApplication.getEtatUtilisateur().getMembre();
    const lListeDestinataires =
      UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestCarnetLiaisonDElevePrimParent(
        lEleve.getNumero(),
      ).parcourir((aDest) => {
        aDest.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      });
    const lMessage = ObjetElement_1.ObjetElement.create({
      listeDestinataires: lListeDestinataires,
      estCreationCarnetLiaison: true,
    });
    const lMoteurMessagerie =
      new MoteurMessagerie_1.MoteurMessagerie().setOptions({
        instance: {},
        estChat: false,
      });
    const lAffDiscussion = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile,
      { pere: {}, moteurMessagerie: lMoteurMessagerie },
    );
    lAffDiscussion
      .setOptions({
        estDiscussionEnFenetre: true,
        estChat: false,
        avecPJ: false,
        callbackEnvoyer: function () {
          lAffDiscussion.masquer();
          Invocateur_1.Invocateur.evenement("actualiserListeDiscussion_mobile");
        },
      })
      .setDonnees({
        message: MethodesObjet_1.MethodesObjet.dupliquer(lMessage),
        creationDiscussion: true,
        estPrimParentSurEtiquetteCL: true,
        listeDestinatairesCarnetLiaison: lListeDestinataires,
        eleveCarnetLiaison: lEleve,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "MessagerieCarnetLiaison.TitreFenetreNouveauPourLEleve",
          [lEleve.getLibelle()],
        ),
      });
  }
  static creerDiscussionEnFenetre() {
    const lMoteurMessagerie =
      new MoteurMessagerie_1.MoteurMessagerie().setOptions({
        instance: {},
        estChat: false,
      });
    const lAffDiscussion = ObjetIdentite_1.Identite.creerInstance(
      ObjetDiscussion_Mobile,
      { pere: {}, moteurMessagerie: lMoteurMessagerie },
    );
    lAffDiscussion
      .setOptions({
        estDiscussionEnFenetre: true,
        estChat: false,
        callbackEnvoyer: function () {
          lAffDiscussion.masquer();
          Invocateur_1.Invocateur.evenement("actualiserListeDiscussion_mobile");
        },
      })
      .setDonnees({
        creationDiscussion: true,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.EcrireUnMessage",
        ),
      });
  }
  _getElementScroll() {
    return $(
      "#" + this.Nom.escapeJQ() + " .utilMess_conteneur_visu_messages>div",
    ).get(0);
  }
  _fermer() {
    this._estAffiche = false;
    if (this.options.callbackFermeture) {
      this.options.callbackFermeture(this.donnees);
    }
    this.avecInclureParentsEleves = false;
  }
  _avecGenreDest(aGenreRessource) {
    return (
      UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
        aGenreRessource,
      ) &&
      (!this.options.genresDestinatairesAutorises ||
        !this.options.genresDestinatairesAutorises.indexOf ||
        this.options.genresDestinatairesAutorises.indexOf(aGenreRessource) >= 0)
    );
  }
  _initGenresDest() {
    this.genresDest = new ObjetListeElements_1.ObjetListeElements();
    if (
      (!this.options.estChat ||
        (this.donnees.listeContacts &&
          this.donnees.listeContacts.getElementParGenre(
            Enumere_Ressource_1.EGenreRessource.Enseignant,
          ))) &&
      this._avecGenreDest(Enumere_Ressource_1.EGenreRessource.Enseignant)
    ) {
      this.genresDest.addElement(
        new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
          null,
          Enumere_Ressource_1.EGenreRessource.Enseignant,
          null,
          UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
            Enumere_Ressource_1.EGenreRessource.Enseignant,
          ),
        ),
      );
    }
    if (
      (!this.options.estChat ||
        (this.donnees.listeContacts &&
          this.donnees.listeContacts.getElementParGenre(
            Enumere_Ressource_1.EGenreRessource.Personnel,
          ))) &&
      this._avecGenreDest(Enumere_Ressource_1.EGenreRessource.Personnel)
    ) {
      this.genresDest.addElement(
        new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur("Personnels"),
          null,
          Enumere_Ressource_1.EGenreRessource.Personnel,
          null,
          UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
            Enumere_Ressource_1.EGenreRessource.Personnel,
          ),
        ),
      );
    }
    let lAvecDestResp = false;
    if (this.options.discussionAvancee && !this.options.estChat) {
      if (this._avecGenreDest(Enumere_Ressource_1.EGenreRessource.Eleve)) {
        this.genresDest.addElement(
          new ObjetElement_1.ObjetElement(
            ObjetTraduction_1.GTraductions.getValeur("Eleves"),
            null,
            Enumere_Ressource_1.EGenreRessource.Eleve,
            null,
            UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
              Enumere_Ressource_1.EGenreRessource.Eleve,
            ),
          ),
        );
      }
      if (
        this._avecGenreDest(Enumere_Ressource_1.EGenreRessource.Responsable)
      ) {
        lAvecDestResp = true;
        this.genresDest.addElement(
          new ObjetElement_1.ObjetElement(
            ObjetTraduction_1.GTraductions.getValeur("Messagerie.Parents"),
            null,
            Enumere_Ressource_1.EGenreRessource.Responsable,
            null,
            UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
              Enumere_Ressource_1.EGenreRessource.Responsable,
            ),
          ),
        );
      }
    }
    if (
      !lAvecDestResp &&
      !this.options.estChat &&
      this.options.estDiscussionResponsables &&
      this.applicationSco.getObjetParametres()
        .ActivationMessagerieEntreParents &&
      this.etatUtilisateurSco.Identification.ressource
        .avecDiscussionResponsables &&
      this._avecGenreDest(Enumere_Ressource_1.EGenreRessource.Responsable)
    ) {
      this.genresDest.addElement(
        new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur("Messagerie.Parents"),
          null,
          Enumere_Ressource_1.EGenreRessource.Responsable,
          null,
          UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
            Enumere_Ressource_1.EGenreRessource.Responsable,
          ),
        ),
      );
    }
  }
  _initNewMsg(aBrouillon, aRecupererModeleAlerte) {
    this.newMsg = Object.assign(
      UtilitaireMessagerie_1.UtilitaireMessagerie.getBrouillonDefaut(),
      {
        avecHtml: this.options.avecHtml,
        listePublic: [],
        genreDiscussion: this.options.genreDiscussion,
        listeDestinataires: new ObjetListeElements_1.ObjetListeElements(),
      },
    );
    if (this.donnees.tableauDeBord) {
      this.newMsg = Object.assign(
        new ObjetElement_1.ObjetElement(),
        this.donnees.message,
      );
      this.newMsg.listeDestinataires = this.donnees.message.listeDestinataires
        ? this.donnees.message.listeDestinataires
        : new ObjetListeElements_1.ObjetListeElements();
    } else if (aBrouillon) {
      this.newMsg = MethodesObjet_1.MethodesObjet.dupliquer(aBrouillon);
      this.newMsg.brouillon = aBrouillon;
      if (aBrouillon.contenu) {
        this.newMsg.contenu = aBrouillon.contenu;
      }
      this.newMsg.commande = "";
      if (!this.newMsg.listeDestinataires) {
        this.newMsg.listeDestinataires =
          new ObjetListeElements_1.ObjetListeElements();
      }
      if (aBrouillon.listeDestinataires) {
        this.newMsg.listeDestinataires = aBrouillon.listeDestinataires;
      } else if (
        this.donnees.destinataires &&
        this.donnees.destinataires.listeDestinataires
      ) {
        this.newMsg.listeDestinataires.add(
          this.donnees.destinataires.listeDestinataires,
        );
      }
      if (aBrouillon.listeDocumentsJoints) {
        this.newMsg.listeFichiers = aBrouillon.listeDocumentsJoints;
      }
    } else {
      if (
        this.donnees.destinataires &&
        this.donnees.destinataires.listeDestinataires
      ) {
        this.newMsg.listeDestinataires.add(
          this.donnees.destinataires.listeDestinataires,
        );
      }
    }
    if (!this.newMsg.listeFichiers) {
      this.newMsg.listeFichiers = new ObjetListeElements_1.ObjetListeElements();
    }
    if (this.donnees.estPrimParentSurEtiquetteCL) {
      this.newMsg.estCreationCarnetLiaison = true;
      if (!this.donnees.listeDestinatairesCarnetLiaison) {
        throw "pas de liste destinataires";
      }
      if (!this.donnees.eleveCarnetLiaison) {
        throw "Il faut un eleve carnet de liaison";
      }
      this.newMsg.listeDestinataires = MethodesObjet_1.MethodesObjet.dupliquer(
        this.donnees.listeDestinatairesCarnetLiaison,
      );
      this.newMsg.eleveCarnetLiaison = this.donnees.eleveCarnetLiaison;
    }
    this.newMsg.estChat = this.options.estChat;
    if (
      this.options.estChat &&
      this.donnees.creationDiscussion &&
      this.donnees.titre
    ) {
      this.newMsg.objet = this.donnees.titre;
    }
    if (this.donnees.alertePPMS && aRecupererModeleAlerte) {
      this.newMsg.genreDiscussion ===
        TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte;
      if (
        this.donnees.alertePPMS.modeleAlerte &&
        this.donnees.alertePPMS.modeleAlerte.contenu
      ) {
        this.newMsg.contenu = this.donnees.alertePPMS.modeleAlerte.contenu;
      }
      this.newMsg.modeleAlerte = this.donnees.alertePPMS.modeleAlerte;
      this.newMsg.estExercice = false;
    }
    this.newMsg.listePublic = this.newMsg.listeDestinataires
      ? this.newMsg.listeDestinataires.getTableauLibelles()
      : [];
  }
  _requeteSaisie(aCommande) {
    this._desactiverAbonnementNotifMessage = true;
    return this.moteurMessagerie.requeteSaisieMessage(aCommande).finally(() => {
      delete this._desactiverAbonnementNotifMessage;
    });
  }
  _addFile(aFichier, aPourCloud) {
    if (
      !aPourCloud &&
      this.listePJ.getTableauLibelles().includes(aFichier.getLibelle())
    ) {
      this.applicationSco
        .getMessage()
        .afficher({
          message: ObjetTraduction_1.GTraductions.getValeur(
            "inputFile.msgEchecLibelleFichier",
          ),
        });
    } else {
      this.newMsg.listeFichiers.addElement(aFichier);
      this.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      this.listePJ.addElement(aFichier);
    }
  }
  _addCommandesMenuPiedSaisie(
    aMenu,
    aAvecPJ,
    aAvecModifDest,
    aAvecBtnInclurePE,
    aInclurePEHorsLimite,
    aAvecCommandesBrouillon,
    aAvecSignature,
    aAvecTiny,
  ) {
    const lEstEnConsulation = this.applicationSco.droits.get(
      ObjetDroitsPN_1.TypeDroits.estEnConsultation,
    );
    const lInstance = this;
    if (aAvecTiny) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.miseEnForme"),
        true,
        () => {
          UtilitaireTiny_1.UtilitaireTiny.ouvrirFenetreHtml({
            instance: this,
            descriptif: this.newMsg.contenu || "",
            readonly: false,
            modeMail: true,
            callback: (aParams) => {
              if (aParams.valider) {
                this._setValeurMessage(aParams.descriptif, true);
                TinyInit_1.TinyInit.onLoadEnd(this.idTiny).then(
                  (aParamsTiny) => {
                    if (aParamsTiny.tiny) {
                      aParamsTiny.tiny.setContent(aParams.descriptif);
                    }
                  },
                );
              }
              const lEditor = TinyInit_1.TinyInit.get(this.idTiny);
              if (lEditor) {
                lEditor.focus();
              }
            },
          });
        },
        { icon: "icon_font" },
      );
    }
    if (aAvecPJ && !lEstEnConsulation) {
      const lAvecCloud = this.etatUtilisateurSco.avecCloudDisponibles();
      const lOptionsSelecFile = {
        maxSize: this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
        ),
        multiple: true,
        avecTransformationFlux_versCloud: lAvecCloud,
      };
      if (lAvecCloud) {
        aMenu.add(
          ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintPJ"),
          true,
          () => {
            const lTabActions = [];
            lTabActions.push({
              libelle: ObjetTraduction_1.GTraductions.getValeur(
                "CahierDeTexte.piecesJointes.FichierDepuisDocument",
              ),
              icon: "icon_folder_open",
              selecFile: true,
              optionsSelecFile: lOptionsSelecFile,
              event(aParamsInput) {
                if (aParamsInput && aParamsInput.listeFichiers) {
                  aParamsInput.listeFichiers.parcourir((aFichier) => {
                    lInstance._addFile(aFichier, false);
                  });
                }
              },
              class: "bg-util-marron-claire",
            });
            lTabActions.push({
              libelle: ObjetTraduction_1.GTraductions.getValeur(
                "CahierDeTexte.piecesJointes.FichierDepuisCloud",
              ),
              icon: "icon_cloud",
              event() {
                UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.ouvrirFenetreCloud().then(
                  (aListeNouveauxDocs) => {
                    aListeNouveauxDocs.parcourir((aFichier) => {
                      lInstance._addFile(aFichier, true);
                    });
                  },
                );
              },
              class: "bg-util-marron-claire",
            });
            ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
              lTabActions,
              { pere: this },
            );
          },
          { icon: "icon_piece_jointe" },
        );
      } else {
        aMenu.addSelecFile(
          ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintPJ"),
          {
            icon: "icon_piece_jointe",
            getOptionsSelecFile() {
              return lOptionsSelecFile;
            },
            addFiles(aParams) {
              lInstance._addFile(aParams.eltFichier, false);
            },
          },
        );
      }
    }
    if (aAvecModifDest) {
      const lNb = this.newMsg.listeDestinataires
        ? this.newMsg.listeDestinataires.count()
        : 0;
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintAjouterDest") +
          (lNb > 0 ? " (" + lNb + ")" : ""),
        !!this.donnees.destinataires && !lEstEnConsulation,
        () => {
          this._popupDestinataires(null, undefined, true);
        },
        { icon: "icon_plus_cercle" },
      );
    }
    if (
      aAvecBtnInclurePE &&
      !UtilitaireMessagerie_1.UtilitaireMessagerie.interdireReponseParentEleve()
    ) {
      const lEstCoche = this.avecInclureParentsEleves && !aInclurePEHorsLimite;
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.InclureParentsEleves",
        ),
        !lEstEnConsulation,
        () => {
          if (aInclurePEHorsLimite) {
            this.applicationSco
              .getMessage()
              .afficher({
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "Messagerie.HintInclureParentsElevesDisabled",
                ),
              });
          } else {
            this.avecInclureParentsEleves = !lEstCoche;
          }
        },
        {
          icon: lEstCoche ? "icon_case_on" : "icon_check_empty",
          visuInactif: !!aInclurePEHorsLimite,
        },
      );
    }
    if (aAvecSignature) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.HintAjouterSignature",
        ),
        !lEstEnConsulation,
        () => {
          this.newMsg.contenu =
            this.newMsg.contenu +
            this.etatUtilisateurSco.messagerieSignature.signature;
          this.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
          this.$refreshSelf();
        },
        { icon: "icon_signature" },
      );
    }
    if (aAvecCommandesBrouillon) {
      const lBrouillon = this.newMsg;
      const lMessagePourReponse = this.donnees.messagePourReponse;
      let lEstActif =
        lMessagePourReponse &&
        lBrouillon.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun &&
        !lEstEnConsulation;
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.HintEnregistrerBrouillon",
        ),
        !!lEstActif,
        () => {
          this.moteurMessagerie
            .saisieBrouillon(lBrouillon, lMessagePourReponse)
            .then(() => {
              if (this.options.callbackEnvoyer) {
                this.options.callbackEnvoyer({});
              }
            });
        },
        { icon: "icon_save" },
      );
      lEstActif =
        lBrouillon &&
        lBrouillon.existeNumero() &&
        lBrouillon.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation &&
        !lEstEnConsulation;
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.HintSupprimerBrouillon",
        ),
        !!lEstActif,
        () => {
          const lCreation = this._estBrouillonCreationDiscussion();
          this.moteurMessagerie
            .supprimerBrouillonConfirmationPromise(lBrouillon)
            .then((aResult) => {
              if (aResult && aResult.saisieMessageOK === true) {
                if (lCreation) {
                  this.masquer();
                } else {
                  if (this.options.callbackEnvoyer) {
                    this.options.callbackEnvoyer({});
                  }
                }
              }
            });
        },
        { icon: "icon_trash" },
      );
    }
  }
  _actualisationSurNotificationChat(aListeDiscussions) {
    if (!aListeDiscussions) {
      return;
    }
    let lMessageActualisation = null;
    aListeDiscussions.parcourir((aMessage) => {
      if (aMessage.listePossessionsMessages) {
        if (
          !this.donnees.message &&
          this._creationChatAvecSaisieMessage &&
          aMessage.perso &&
          aMessage.listePossessionsMessages.count() === 1
        ) {
          lMessageActualisation = aMessage;
        } else if (
          this.donnees.message &&
          this.donnees.message.listePossessionsMessages
        ) {
          aMessage.listePossessionsMessages.parcourir((aPossessionMessage) => {
            if (
              this.donnees.message.listePossessionsMessages.getElementParElement(
                aPossessionMessage,
              )
            ) {
              lMessageActualisation = aMessage;
              return false;
            }
          });
        }
        if (lMessageActualisation) {
          lMessageActualisation.messageDejaTraite = true;
          return false;
        }
      }
    });
    if (lMessageActualisation) {
      lMessageActualisation = MethodesObjet_1.MethodesObjet.dupliquer(
        lMessageActualisation,
      );
      this._requeteListeMessages({
        titre: this.donnees.titre,
        message: lMessageActualisation,
        marquerCommeLu: true,
        conserverBrouillon: true,
      });
    }
  }
  _requeteListeMessages(aParams) {
    const lNbMessagesVus =
      aParams.nbMessagesVus < 0
        ? undefined
        : aParams.nbMessagesVus ||
          UtilitaireMessagerie_1.UtilitaireMessagerie.palierNbMessages;
    if (this.donnees.message && aParams.marquerCommeLu) {
      this.donnees.message.lu = true;
    }
    return this.moteurMessagerie
      .requeteMessagesVisu({
        message: aParams.message,
        marquerCommeLu: aParams.marquerCommeLu,
        nbMessagesVus: lNbMessagesVus,
      })
      .then((aParamRequette) => {
        this.setDonnees({
          titre: aParams.titre,
          message: aParams.message,
          messagePourReponse: aParamRequette.messagePourReponse,
          listeBoutons: aParamRequette.listeBoutons,
          listeMessages: aParamRequette.listeMessages,
          destinataires: aParamRequette.destinataires,
          nbPossessionsMessageListe: aParamRequette.nbPossessionsMessage,
          brouillon: aParamRequette.brouillon,
          conserverBrouillon: aParams.conserverBrouillon,
          MAJNbMessages: aParams.MAJNbMessages,
        });
      });
  }
  _surBoutonRepondre(aGenre) {
    const lGenre = UtilitaireMessagerie_1.UtilitaireMessagerie.getGenreReponse(
      aGenre,
      this.avecInclureParentsEleves,
    );
    let lContenuEscape = this.newMsg.contenu.trim();
    if (this.options.avecHtml) {
      lContenuEscape = $(
        ObjetHtml_1.GHtml.htmlToDOM((0, tag_1.tag)("div", lContenuEscape)),
      )
        .text()
        .trim();
    }
    const lControleContenuNonVide =
      lGenre !==
      TypeHttpReponseMessage_1.TypeHttpReponseMessage.rm_ClotureAlerte;
    const lEstBrouillonCreationDiscussion =
      this._estBrouillonCreationDiscussion();
    if (
      this.donnees.estPrimParentSurEtiquetteCL &&
      this.listeSelectionProfsCarnetLiaison &&
      this.listeSelectionProfsCarnetLiaison.count() > 0
    ) {
      this.newMsg.listeDestinataires.removeFilter((D) => {
        if (
          D.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant &&
          !this.listeSelectionProfsCarnetLiaison.getElementParNumero(
            D.getNumero(),
          )
        ) {
          return true;
        }
        return false;
      });
    }
    if (
      (this.donnees.creationDiscussion || lEstBrouillonCreationDiscussion) &&
      (!this.newMsg.listeDestinataires ||
        this.newMsg.listeDestinataires.count() === 0)
    ) {
      return this.applicationSco
        .getMessage()
        .afficher({
          message: ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.MsgAucunDestinataire",
          ),
        });
    }
    if (lControleContenuNonVide && !lContenuEscape) {
      return this.applicationSco
        .getMessage()
        .afficher({
          message: ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.MsgAucunContenu",
          ),
        });
    }
    if (this.options.estChat && !this.donnees.message) {
      this._creationChatAvecSaisieMessage = true;
    }
    if (!this.donnees.creationDiscussion) {
      this.newMsg.bouton = new ObjetElement_1.ObjetElement("", 0, lGenre);
    }
    this.newMsg.avecHtml = this.options.avecHtml;
    this.newMsg.messagePourReponse = this.donnees.messagePourReponse;
    if (this._avecCBDirecteur()) {
      if ($("#" + this.idCheckboxDirecteur.escapeJQ()).is(":checked")) {
        const lElement = new ObjetElement_1.ObjetElement(
          "",
          0,
          Enumere_Ressource_1.EGenreRessource.Personnel,
        );
        lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        this.newMsg.listeDestinataires.addElement(lElement);
      }
    }
    if (
      this.donnees.creationDiscussion &&
      this.options.parametresSupplementaireSaisieDiscussion
    ) {
      Object.assign(
        this.newMsg,
        this.options.parametresSupplementaireSaisieDiscussion,
      );
    }
    this.newMsg.listeDestinataires.removeFilter((D) => {
      if (D.getGenre() === Enumere_Ressource_1.EGenreRessource.Responsable) {
        return !D.Actif;
      }
      return false;
    });
    const lMessageSaisie = this.newMsg;
    this._requeteSaisie(lMessageSaisie).then(() => {
      this._initNewMsg();
      if (this.options.callbackEnvoyer) {
        this.options.callbackEnvoyer({
          creationDiscussion:
            this.donnees.creationDiscussion || lEstBrouillonCreationDiscussion,
          message: lMessageSaisie,
        });
      }
    });
  }
  _popupDestinataires(aEvent, aGenre, aUniquementAjouterDest) {
    if (aEvent) {
      aEvent.stopPropagation();
    }
    let lGenreRessource = aGenre;
    const lGenreDest = this.genresDest.getElementParGenre(lGenreRessource);
    if (!lGenreDest) {
      const lAvecListesDiffusions =
        this.options.discussionAvancee &&
        !this.options.estChat &&
        this.options.avecDestinatairesListeDiffusion &&
        !aUniquementAjouterDest &&
        UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDiffusionSelonEspace();
      if (!lAvecListesDiffusions && this.genresDest.count() === 1) {
        lGenreRessource = this.genresDest.get(0).getGenre();
      } else {
        return ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_DestDiscussion_Mobile_1.ObjetFenetre_DestDiscussion_Mobile,
          { pere: this },
          {
            genresDest: this.genresDest,
            avecListesDiffusion: lAvecListesDiffusions,
            selection: (aArticle) => {
              if ("estListeDiff" in aArticle && aArticle.estListeDiff) {
                UtilitaireMessagerie_1.UtilitaireMessagerie.selectionnerListeDiffusions(
                  this,
                ).then((aListeSelec) => {
                  if (aListeSelec && aListeSelec.count() > 0) {
                    aListeSelec.parcourir((aDiffusion) => {
                      this._ajouterListeDestinatairesMessage(
                        aDiffusion.listePublicIndividu,
                      );
                    });
                  }
                });
              } else {
                this._ouvrirFenetreSelectionDest(
                  aArticle.getGenre(),
                  aUniquementAjouterDest,
                );
              }
            },
          },
        ).afficher();
      }
    }
    this._ouvrirFenetreSelectionDest(lGenreRessource, aUniquementAjouterDest);
  }
  async _ouvrirFenetreSelectionDest(aGenre, aUniquementAjouterDest) {
    let lListeRessourcesPresente = null;
    if (
      this.donnees.listeContacts &&
      (this.donnees.alertePPMS || this.options.estChat)
    ) {
      lListeRessourcesPresente = new ObjetListeElements_1.ObjetListeElements();
      this.donnees.listeContacts.parcourir((aElement) => {
        if (aElement.getGenre() === aGenre && aElement.existeNumero()) {
          const lElement = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
          lListeRessourcesPresente.add(lElement);
          if (lElement.pere && !lElement.pere.existeNumero()) {
            lElement.pere = null;
          }
        }
      });
    }
    if (this.options.discussionAvancee) {
      const lEleGenre = this.genresDest.getElementParGenre(aGenre);
      if (lEleGenre && lEleGenre.listePublic) {
        lListeRessourcesPresente = lEleGenre.listePublic;
      }
    }
    let lListeRessourcesInvisibles = null;
    if (
      aUniquementAjouterDest &&
      this.donnees.destinataires &&
      this.donnees.destinataires.listeDestinataires
    ) {
      lListeRessourcesInvisibles =
        this.donnees.destinataires.listeDestinataires.getListeElements(
          (aElement) => aElement.getGenre() === aGenre,
        );
    }
    const lParamsFenetrePublic = {
      instance: this,
      genreRessource: aGenre,
      avecIndicationDiscussionInterdit: true,
      listeRessourcesSelectionnees:
        this.newMsg.listeDestinataires.getListeElements(
          (aElement) => aElement.getGenre() === aGenre,
        ),
      uniquementAjouterDest: aUniquementAjouterDest,
      listeRessourcesInvisibles: lListeRessourcesInvisibles,
      estAlertePPMS: !!(this.donnees && this.donnees.alertePPMS),
    };
    let lResult;
    if (lListeRessourcesPresente) {
      lResult =
        await UtilitaireMessagerie_1.UtilitaireMessagerie.fenetreSelectionnerListePublics(
          Object.assign(
            { listeRessources: lListeRessourcesPresente },
            lParamsFenetrePublic,
          ),
        );
    } else {
      lResult =
        await UtilitaireMessagerie_1.UtilitaireMessagerie.selectionnerListePublics(
          lParamsFenetrePublic,
        );
    }
    if (!lResult) {
      return;
    }
    if (!aUniquementAjouterDest) {
      this.newMsg.listeDestinataires =
        this.newMsg.listeDestinataires.getListeElements((aElement) => {
          return aElement.getGenre() !== aGenre;
        });
    }
    return this._ajouterListeDestinatairesMessage(lResult);
  }
  _ajouterListeDestinatairesMessage(aListe) {
    const lNewMsg = this.newMsg;
    const lMapGenresActifs = {};
    this.genresDest.parcourir((aElement) => {
      if (aElement.Actif) {
        lMapGenresActifs[aElement.getGenre()] = true;
      }
    });
    let lAvecAjout = false;
    aListe.parcourir((aElement) => {
      if (
        lMapGenresActifs[aElement.getGenre()] &&
        !lNewMsg.listeDestinataires.getElementParNumero(aElement.getNumero())
      ) {
        const lElementAjout = new ObjetElement_1.ObjetElement({
          Libelle: "",
          Genre: aElement.getGenre(),
          Numero: aElement.getNumero(),
        });
        lElementAjout.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        lNewMsg.listeDestinataires.add(lElementAjout);
        lAvecAjout = true;
      }
    });
    if (lAvecAjout) {
      lNewMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
      lNewMsg.listePublic = lNewMsg.listeDestinataires.getTableauLibelles();
    }
  }
  _composeSelectionDiscussion() {
    if (!this.donnees.tableauDeBord || !this.options.callbackSelectDiscussion) {
      return "";
    }
    const lIndiceDiscussionSelectionnee =
      this.donnees.tableauDeBord.indiceDiscussionSelectionnee;
    let lAvecDiscussion = false;
    if (this.donnees.tableauDeBord.listeDiscussions) {
      this.donnees.tableauDeBord.listeDiscussions.parcourir((aMessage) => {
        if (aMessage.estUneDiscussion) {
          lAvecDiscussion = true;
          return false;
        }
      });
    }
    !!this.donnees.tableauDeBord.listeDiscussions
      ? this.donnees.tableauDeBord.listeDiscussions.count()
      : 0;
    const H = [];
    if (lIndiceDiscussionSelectionnee >= 0 && lAvecDiscussion) {
      let lNbDiscussionsNonLues = 0;
      if (!!this.donnees.tableauDeBord.listeDiscussions) {
        this.donnees.tableauDeBord.listeDiscussions.parcourir((D) => {
          if (D.estUneDiscussion && D.profondeur === 0) {
            let nbMessagesNonLus = 0;
            if (!!D.nbNonLus && D.nbNonLus > 0) {
              nbMessagesNonLus = D.nbNonLus;
            }
            if (nbMessagesNonLus > 0) {
              lNbDiscussionsNonLues++;
            }
          }
        });
      }
      let lStrNbNonLues;
      if (lNbDiscussionsNonLues > 0) {
        lStrNbNonLues =
          '<span class="selectDiscussionNonLu">' +
          ObjetTraduction_1.GTraductions.getValeur(
            lNbDiscussionsNonLues === 1
              ? "Messagerie.NombreNonLue"
              : "Messagerie.NombreNonLues",
            [lNbDiscussionsNonLues],
          ) +
          "</span>";
      }
      H.push(
        '<div class="selectDiscussion">',
        lStrNbNonLues || "",
        (0, tag_1.tag)("ie-combo", {
          "ie-model": "comboTableauDeBord_choixDisc",
          class: "combo-disc combo-mobile",
        }),
        "</div>",
      );
    }
    return H.join("");
  }
  _composeSelectAlerte() {
    const lId = GUID_1.GUID.getId();
    return IE.jsx.str(
      "div",
      { class: "field-contain" },
      IE.jsx.str(
        "label",
        { id: lId },
        ObjetTraduction_1.GTraductions.getValeur("Messagerie.ModeleAlerte"),
      ),
      IE.jsx.str("ie-combo", {
        "ie-model": "modelComboAlerte",
        "aria-labelledby": lId,
      }),
    );
  }
  _composeStrListeDestinataires() {
    this.listeSelectionProfsCarnetLiaison =
      new ObjetListeElements_1.ObjetListeElements();
    const H = [];
    if (
      !!this.newMsg.listeDestinataires &&
      this.newMsg.listeDestinataires.count() > 0
    ) {
      let lListeChoixProfs = null;
      let lListeDestinatairesAAfficher = this.newMsg.listeDestinataires;
      if (this.donnees.estPrimParentSurEtiquetteCL) {
        lListeChoixProfs = this.newMsg.listeDestinataires.getListeElements(
          (D) => {
            return (
              D.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant
            );
          },
        );
        if (lListeChoixProfs.count() === 1) {
          lListeChoixProfs = null;
        } else {
          this.listeSelectionProfsCarnetLiaison.add(lListeChoixProfs.get(0));
          lListeDestinatairesAAfficher =
            this.newMsg.listeDestinataires.getListeElements((D) => {
              return (
                D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Enseignant
              );
            });
        }
      }
      H.push('<div class="flex-contain cols">');
      if (lListeChoixProfs) {
        lListeChoixProfs.parcourir((D) => {
          H.push(
            "<ie-checkbox",
            ObjetHtml_1.GHtml.composeAttr(
              "ie-model",
              "cbProfsCarnetL",
              D.getNumero(),
            ),
            ' ie-textright class="m-bottom-l">',
            D.getLibelle(),
            "</ie-checkbox>",
          );
        });
      }
      lListeDestinatairesAAfficher.parcourir((D) => {
        if (D.getGenre() === Enumere_Ressource_1.EGenreRessource.Responsable) {
          H.push(
            "<ie-checkbox ",
            ObjetHtml_1.GHtml.composeAttr("ie-model", "cbInclureResp2"),
            ' ie-textright class="m-bottom-l">',
            D.getLibelle(),
            "</ie-checkbox>",
          );
        } else {
          H.push(
            '<span class="labelDestinataire m-bottom-l">',
            D.getLibelle(),
            "</span>",
          );
        }
      });
      H.push("</div>");
    }
    return H.join("");
  }
  _estBrouillonCreationDiscussion() {
    return !!(
      this.newMsg &&
      this.newMsg.brouillon &&
      (!this.donnees.messagePourReponse ||
        !this.donnees.messagePourReponse.existeNumero())
    );
  }
  _getHtmlBtnRepondre() {
    const H = [];
    if (this.donnees.listeBoutons) {
      this.donnees.listeBoutons.parcourir((aBouton, aIndex) => {
        if (aIndex === this.donnees.listeBoutons.count() - 1) {
          H.push(
            (0, tag_1.tag)("ie-bouton", {
              "ie-icon": "icon_envoyer",
              class: "themeBoutonPrimaire",
              "ie-model": tag_1.tag.funcAttr(
                "buttonRepondre",
                aBouton.getGenre(),
              ),
            }),
          );
        } else {
          H.push(
            (0, tag_1.tag)(
              "ie-bouton",
              {
                class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
                "ie-model": tag_1.tag.funcAttr(
                  "buttonRepondre",
                  aBouton.getGenre(),
                ),
                "ie-ellipsis": true,
              },
              aBouton.getLibelle(),
            ),
          );
        }
      });
    }
    return H.join("");
  }
  _composer() {
    const lDiscussionDesactiveeSelonHoraire = this.applicationSco.droits.get(
      ObjetDroitsPN_1.TypeDroits.communication.discussionDesactiveeSelonHoraire,
    );
    const lMessageNonEditable =
      UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
        this.donnees.messagePourReponse,
      );
    const lCreationAlertePPMS = this.donnees.alertePPMS && this.options.estChat;
    const lEstNouvelleDiscussion = this._estNouvelleDiscussion();
    const lAvecPublic =
      this.donnees.messagePourReponse &&
      this.donnees.messagePourReponse.existeNumero() &&
      !this.donnees.creationDiscussion;
    const lAvecBtnActions =
      !this.options.estDiscussionEnFenetre &&
      !lEstNouvelleDiscussion &&
      !this.options.estChat;
    const lEstMessageCarnetLiaison =
      this.donnees.messagePourReponse &&
      this.donnees.messagePourReponse.estCarnetLiaison;
    const lEstMessageVisuChat =
      UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageVisuChat(
        this.donnees.messagePourReponse,
      );
    const H = [];
    let lLibelle = this._getTitre(lEstNouvelleDiscussion);
    H.push(
      '<div id="',
      this.Nom + '_conteneur" class="ObjetDiscussion_Mobile">',
    );
    H.push(
      '<div class="navheader',
      this.options.estDiscussionEnFenetre ? " header-titre" : "",
      '" tabindex="-1">',
      this.options.estDiscussionEnFenetre
        ? ""
        : '<ie-btnicon ie-model="btnFermer" class="icon_retour_mobile retour"></ie-btnicon>',
      this.options.estDiscussionEnFenetre
        ? ""
        : '<span class="odm_header_libelle ellipsis-multilignes mdr2">' +
            lLibelle +
            "</span>",
      this.options.callbackNavigation
        ? (0, tag_1.tag)("ie-btnicon", {
            class: "icon_angle_left nav",
            "ie-model": "btnNav(true)",
          }) +
            (0, tag_1.tag)("ie-btnicon", {
              class: "icon_angle_right nav",
              "ie-model": "btnNav(false)",
            })
        : "",
      this.options.callbackBtnCreation
        ? '<div class="flex-contain cols flex-end" style="flex: 1 1 auto"><span class="btn-float messagerieNouveauMessage ie-ripple ie-ripple-claire" ie-node="getNodeBtnCreation"></span></div>'
        : "",
      "</div>",
    );
    if (!this.donnees.tableauDeBord && (lAvecBtnActions || lAvecPublic)) {
      H.push(
        (0, tag_1.tag)(
          "div",
          { class: "messagerie-titre-bandeau-message" },
          this.moteurMessagerie.composeTitreBandeauDeMessageVisu(
            this.donnees.message,
            {
              avecMenuActions: lAvecBtnActions,
              avecMenuPublic: lAvecPublic,
              instance: this,
              callbackMenu: this.execCommandesMenuContextuel.bind(this),
              ieNodeSousTitre: (aNode, aNumeroMessage) => {
                $(aNode).on("click", () => {
                  this._afficherFenetreDestinatairesDemessage(
                    aNumeroMessage,
                    true,
                    false,
                  );
                });
              },
            },
          ),
        ),
      );
    }
    if (this.donnees.tableauDeBord) {
      H.push(this._composeSelectionDiscussion());
    }
    if (this.donnees.listeMessages && this.donnees.listeMessages.count()) {
      H.push(
        (0, tag_1.tag)(
          "div",
          { class: "utilMess_conteneur_visu_messages" },
          (0, tag_1.tag)(
            "div",
            UtilitaireMessagerie_1.UtilitaireMessagerie.getDiscussion({
              listeMessages: this.donnees.listeMessages,
              controleur: this.controleur,
              nbMessagesTotal: this.donnees.nbPossessionsMessageListe,
              callbackAfficherSuivants: (aNbMessagesVus) => {
                this._requeteListeMessages({
                  message: this.donnees.message,
                  marquerCommeLu: false,
                  nbMessagesVus: aNbMessagesVus,
                  MAJNbMessages: true,
                });
              },
              btnModel: "visuMessage.btnDest",
              callbackBtnSignalantPourSupp: async (aCommande) => {
                await this._requeteSaisie(aCommande);
                this.masquer();
              },
              callbackCommandesMessage: !this.options.estChat
                ? this._callbackCommandesMessage.bind(this)
                : null,
            }),
          ),
        ),
      );
    }
    H.push('<div class="odm_contenu">');
    H.push('<div class="odm_messages">');
    if (
      this.donnees.messagePourReponse &&
      this.donnees.messagePourReponse.messageInfo
    ) {
      H.push(
        IE.jsx.str(
          "div",
          { style: "color:red" },
          ObjetChaine_1.GChaine.replaceRCToHTML(
            this.donnees.messagePourReponse.messageInfo,
          ),
        ),
      );
    }
    if (
      this.donnees.messagePourReponse &&
      this.donnees.messagePourReponse.messageDestinataires
    ) {
      H.push(
        IE.jsx.str(
          "div",
          null,
          ObjetChaine_1.GChaine.replaceRCToHTML(
            this.donnees.messagePourReponse.messageDestinataires,
          ),
        ),
      );
    }
    if (
      this.donnees.messagePourReponse &&
      this.donnees.messagePourReponse.estCarnetLiaison &&
      this.etatUtilisateurSco.pourPrimaire()
    ) {
      H.push(
        IE.jsx.str(
          "div",
          { class: "ie-titre-petit avert-carnet" },
          ObjetChaine_1.GChaine.replaceRCToHTML(
            ObjetTraduction_1.GTraductions.getValeur(
              "MessagerieCarnetLiaison.AvertissementMessagesPublics",
            ),
          ),
        ),
      );
    }
    H.push("</div>");
    if (
      this.options.estChat &&
      this.donnees.message &&
      this.donnees.message.estAlerte &&
      this.donnees.message.exercice
    ) {
      H.push(
        '<span class="odm_exercice">',
        ObjetTraduction_1.GTraductions.getValeur(
          "Messagerie.AlerteEstUnExercice",
        ),
        "</span>",
      );
    }
    const lAvecZoneSaisie =
      !this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
      ) &&
      !lMessageNonEditable &&
      !(
        this.options.estChat &&
        this.donnees.message &&
        this.donnees.message.estAlerte &&
        this.donnees.message.cloture
      );
    const lAvecBtnEnvoi =
      this.donnees.listeBoutons && this.donnees.listeBoutons.count() > 0;
    if (lAvecZoneSaisie && lDiscussionDesactiveeSelonHoraire && lAvecBtnEnvoi) {
      const lStr = this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication
          .messageDiscussionDesactiveeSelonHoraire,
      );
      if (lStr) {
        H.push(IE.jsx.str("div", { class: "p-all" }, lStr));
      }
    }
    if (lAvecZoneSaisie && !lDiscussionDesactiveeSelonHoraire) {
      const lEstDestCarnetLiaison =
        this.donnees.tableauDeBord || this.donnees.estPrimParentSurEtiquetteCL;
      const lEstDestProfsPourPrimEleve =
        lEstNouvelleDiscussion &&
        UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDestinatairesProfsStatique();
      const lAvecModifDestinataires =
        !lMessageNonEditable &&
        !lEstDestCarnetLiaison &&
        !lEstDestProfsPourPrimEleve &&
        !lEstMessageCarnetLiaison &&
        (!this.options.estChat || lEstNouvelleDiscussion) &&
        (lEstNouvelleDiscussion ||
          this.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
          )) &&
        !lEstMessageVisuChat;
      if (lAvecModifDestinataires && lEstNouvelleDiscussion) {
        if (lCreationAlertePPMS) {
          H.push(
            IE.jsx.str(
              "div",
              { class: "m-bottom-l", "ie-if": "afficherComboEtab" },
              IE.jsx.str("ie-combo", {
                "ie-model": "comboEtablissement",
                class: "combo-mobile",
              }),
            ),
          );
        }
        H.push(
          `<div class="field-contain Gras">\n        <label>${ObjetTraduction_1.GTraductions.getValeur("Messagerie.DestinatairesMsg")}</label>\n        <ie-btnselecteur ie-model="destList" ie-node="getNodeModifDest(undefined)" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Messagerie.ChoisirDestinataires")}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("Messagerie.ChoisirDestinataires")}"></ie-btnselecteur>\n        </div>`,
        );
      }
      if (lEstDestCarnetLiaison) {
        const lEstNouveauMessageCL =
          lEstNouvelleDiscussion ||
          (this.newMsg && this.newMsg.estCreationCarnetLiaison);
        if (lEstNouveauMessageCL) {
          H.push(
            '<div class="Gras" role="group" aria-label="',
            ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.DestinatairesMsg",
            ).toAttrValue(),
            '">',
            "<label>",
            ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.DestinatairesMsg",
            ),
            "</label>",
            '<div class="flex-contain p-bottom-l m-left-xl m-top-l">',
            this._composeStrListeDestinataires(),
            "</div>",
            "     </div>",
          );
        }
      }
      if (lEstDestProfsPourPrimEleve) {
        H.push(
          (0, tag_1.tag)(
            "div",
            {
              role: "group",
              "aria-label": ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.DestinatairesMsg",
              ).toAttrValue(),
              class: "field-contain Gras",
            },
            (0, tag_1.tag)(
              "label",
              { class: "p-bottom" },
              ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.DestinatairesMsg",
              ),
            ),
            (T1) => {
              const lListeUtil =
                UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestProfsDiscussionPrimEleveFormat();
              if (lListeUtil && lListeUtil.count() > 0) {
                T1.push(
                  (0, tag_1.tag)(
                    "div",
                    { class: "flex-contain cols flex-start m-left-xl" },
                    (T2) => {
                      const lNb = lListeUtil.count();
                      lListeUtil.parcourir((aProf) => {
                        if (lNb === 1 || aProf.estPrincipal) {
                          const lDest = new ObjetElement_1.ObjetElement({
                            Numero: aProf.getNumero(),
                            Genre: aProf.getGenre(),
                          }).setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                          this.newMsg.listeDestinataires.add(lDest);
                        }
                        T2.push(
                          IE.jsx.str(
                            "ie-checkbox",
                            {
                              "ie-model": (0, jsx_1.jsxFuncAttr)(
                                "cbProfsDest",
                                [aProf.getNumero(), aProf.getGenre()],
                              ),
                              disabled: lNb === 1 ? "disabled" : false,
                              class: "p-bottom",
                              "ie-textright": true,
                            },
                            aProf.getLibelle(),
                          ),
                        );
                      });
                    },
                  ),
                );
              } else {
                T1.push(
                  (0, tag_1.tag)("br"),
                  (0, tag_1.tag)(
                    "span",
                    ObjetTraduction_1.GTraductions.getValeur(
                      "Fenetre_SelectionPublic.AucunDestinataire",
                    ),
                  ),
                );
              }
            },
          ),
        );
      }
      if (this._avecCBDirecteur()) {
        const lEstSelected =
          UtilitaireMessagerie_1.UtilitaireMessagerie.unMessageContientLeDirecteur(
            this.donnees.tableauDeBord
              ? this.newMsg.listeMessages
              : this.donnees.listeMessages,
          );
        const lDiscussionEstNonPossedee = this.donnees.tableauDeBord
          ? this.newMsg.estNonPossede === true
          : false;
        H.push('<div class="field-contain Gras">', "<fieldset>");
        H.push(
          "<legend>",
          ObjetTraduction_1.GTraductions.getValeur(
            "fenetreCommunication.mettreEnCopie",
          ),
          "</legend>",
        );
        H.push(
          IE.jsx.str(
            "div",
            { class: "odm_TransmettreDir_TableauDeBord" },
            IE.jsx.str(
              "ie-checkbox",
              {
                id: this.idCheckboxDirecteur,
                checked: lEstSelected ? "checked" : false,
                disabled:
                  lEstSelected || lDiscussionEstNonPossedee
                    ? "disabled"
                    : false,
                class: "m-left-xl m-top-l",
                "ie-textright": true,
              },
              ObjetTraduction_1.GTraductions.getValeur(
                "fenetreCommunication.directionEcole",
              ),
            ),
          ),
        );
        H.push("</fieldset>");
        H.push("</div>");
      }
      if (lCreationAlertePPMS) {
        H.push(this._composeSelectAlerte());
      }
      if (
        !this.donnees.alertePPMS &&
        !this.options.estChat &&
        lEstNouvelleDiscussion
      ) {
        const lObjetEstEditable =
          !this.donnees.tableauDeBord ||
          this.donnees.tableauDeBord.indiceDiscussionSelectionnee === -1;
        H.push(
          IE.jsx.str(
            "div",
            { class: "field-contain" },
            IE.jsx.str(
              "label",
              { class: "full-width" },
              IE.jsx.str(
                "span",
                { class: "ie-titre-petit" },
                ObjetTraduction_1.GTraductions.getValeur("Messagerie.ObjetMsg"),
              ),
              IE.jsx.str("input", {
                "ie-model": "inputObjet",
                type: "text",
                disabled: !lObjetEstEditable,
                maxlength:
                  UtilitaireMessagerie_1.UtilitaireMessagerie
                    .C_TailleObjetMessage,
              }),
            ),
          ),
        );
      }
      let lAvecTiny = false;
      if (
        this.donnees.creationDiscussion ||
        (!lMessageNonEditable && lAvecBtnEnvoi)
      ) {
        const lContenu =
          this.donnees.tableauDeBord ||
          (this.donnees.alertePPMS &&
            this.donnees.alertePPMS.modeleAlerte &&
            this.newMsg.contenu) ||
          (this.newMsg.brouillon && this.newMsg.contenu)
            ? this.newMsg.contenu || ""
            : "";
        this.newMsg.contenu = lContenu;
        if (lContenu) {
          this.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        }
        lAvecTiny = this.options.avecHtml;
        const lPlaceholder =
          this.etatUtilisateurSco.GenreEspace ===
            Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve &&
          !this.donnees.creationDiscussion
            ? ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.PlaceholderMessageReponseEnseignant",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.PlaceholderMessage",
              );
        H.push(
          '<div class="field-contain',
          lEstNouvelleDiscussion ? "" : " no-line odm-contenu-reponse",
          '">',
          (0, tag_1.tag)(
            "label",
            {
              class: "full-width m-all-none p-bottom-l",
              "aria-label": lEstNouvelleDiscussion
                ? false
                : ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.Contenu",
                  ),
            },
            lEstNouvelleDiscussion
              ? (0, tag_1.tag)(
                  "span",
                  { class: "ie-titre-petit" },
                  ObjetTraduction_1.GTraductions.getValeur(
                    "Messagerie.Contenu",
                  ),
                )
              : "",
            this.options.avecHtml
              ? IE.jsx.str("textarea", {
                  id: this.idTiny,
                  class: "round-style",
                  placeholder: lPlaceholder,
                  "ie-node": "nodeTiny",
                  disabled: true,
                })
              : IE.jsx.str("ie-textareamax", {
                  "ie-model": (0, jsx_1.jsxFuncAttr)(
                    "modelSaisieContenu",
                    false,
                  ),
                  class: [
                    "contenteditable_index",
                    this.donnees.creationDiscussion ? "creation" : "",
                  ],
                  placeholder: lPlaceholder,
                }),
          ),
          "</div>",
        );
      }
      if (lCreationAlertePPMS) {
        H.push(
          '<div class="odm_cbExercice">',
          '<ie-switch ie-model="cbExerciceAlerte">',
          ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.IndiquerExercice",
          ),
          "</ie-switch>",
          "</div>",
        );
      }
      const lAvecPJ =
        this.options.avecPJ &&
        !this.donnees.alertePPMS &&
        this.moteurMessagerie.autoriserAjoutPJ() &&
        !this.options.estChat &&
        !lEstMessageVisuChat &&
        !lMessageNonEditable &&
        lAvecBtnEnvoi;
      const lAvecSignature =
        this.etatUtilisateurSco.messagerieSignature &&
        this.etatUtilisateurSco.messagerieSignature.signature &&
        !this.donnees.alertePPMS &&
        !this.options.estChat &&
        !lEstMessageVisuChat &&
        !lMessageNonEditable &&
        lAvecBtnEnvoi;
      const lAvecModifDestinatairesSurRepondre =
        lAvecModifDestinataires && !lEstNouvelleDiscussion;
      let lAvecBtnInclurePE = false;
      let lInclurePEHorsLimite = false;
      if (lAvecBtnEnvoi) {
        this.donnees.listeBoutons.parcourir((aBouton) => {
          if (
            (aBouton.getGenre() ===
              TypeHttpReponseMessage_1.TypeHttpReponseMessage
                .rm_EnvoiATousSaufParentEleve ||
              aBouton.getGenre() ===
                TypeHttpReponseMessage_1.TypeHttpReponseMessage
                  .rm_RelanceATousSaufParentEleve) &&
            !UtilitaireMessagerie_1.UtilitaireMessagerie.interdireReponseParentEleve()
          ) {
            lInclurePEHorsLimite = aBouton.horsLimiteParentsEleves;
            lAvecBtnInclurePE = true;
            return false;
          }
        });
      }
      const lAvecCommandesBrouillon =
        this.options.activerBoutonsBrouillon &&
        !this.options.estChat &&
        !lEstMessageVisuChat &&
        (this.options.discussionAvancee || !lEstNouvelleDiscussion);
      const lAvecCommandes =
        lAvecBtnEnvoi &&
        (lAvecPJ ||
          lAvecModifDestinatairesSurRepondre ||
          lAvecBtnInclurePE ||
          lAvecCommandesBrouillon ||
          lAvecTiny);
      H.push(
        IE.jsx.str(
          "div",
          { class: "odm_pied_saisie" },
          IE.jsx.str("div", { class: "odm_pied_pj", "ie-html": "getHtmlPJ" }),
          lAvecCommandes
            ? IE.jsx.str("ie-btnicon", {
                "ie-model": (0, jsx_1.jsxFuncAttr)("btnIconPiedSaisie", [
                  lAvecPJ,
                  lAvecModifDestinatairesSurRepondre,
                  lAvecBtnInclurePE,
                  lInclurePEHorsLimite,
                  lAvecCommandesBrouillon,
                  lAvecSignature,
                  lAvecTiny,
                ]),
                class: "icon_ellipsis_vertical commandes",
              })
            : "",
          this._getHtmlBtnRepondre(),
        ),
      );
    }
    H.push("</div>");
    if (lCreationAlertePPMS) {
      H.push(
        IE.jsx.str(
          "span",
          { class: "odm_messagefooter" },
          ObjetTraduction_1.GTraductions.getValeur("Messagerie.InfosAlerte"),
        ),
      );
    }
    H.push("</div>");
    return H.join("");
  }
  _estNouvelleDiscussion() {
    return (
      this.donnees.creationDiscussion || this._estBrouillonCreationDiscussion()
    );
  }
  _getTitre(aEstNouvelleDiscussion) {
    if (this.donnees.titre) {
      return this.donnees.titre;
    }
    if (aEstNouvelleDiscussion) {
      return ObjetTraduction_1.GTraductions.getValeur(
        "Messagerie.TitreFenetre",
      );
    }
    if (this.donnees.message) {
      return this.moteurMessagerie.getInfosTitreDroite(this.donnees.message)
        .titre;
    }
    return "";
  }
  _callbackCommandesMessage(aParams) {
    if (aParams.surMenuContextuel) {
      return;
    }
    ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
      pere: this,
      id: aParams.node,
      initCommandes: (aInstance) => {
        this.moteurMessagerie.addCommandesMenuContextuelVisuMessage({
          messageListeSelection: this.donnees.message,
          messageVisu: aParams.messageVisu,
          menuContextuel: aInstance,
          elementCibleCopie: aParams.elementCibleCopie,
          callback: (aParams, aCommande) => {
            this.execCommandesMenuContextuel(aParams);
          },
        });
      },
    });
  }
  _avecCBDirecteur() {
    return (
      this.etatUtilisateurSco.pourPrimaire() &&
      UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
        Enumere_Ressource_1.EGenreRessource.Personnel,
      ) &&
      ((this.donnees.creationDiscussion && !this.options.estChat) ||
        (this.donnees.messagePourReponse &&
          this.donnees.messagePourReponse.estCarnetLiaison &&
          this.applicationSco.droits.get(
            ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
          )))
    );
  }
  _afficherFenetreDestinatairesDemessage(
    aNumeroMessage,
    aEstPublicParticipant,
    aEstDestinatairesReponse,
  ) {
    UtilitaireMessagerie_1.UtilitaireMessagerie.afficherFenetreDestinatairesDeMessage(
      aNumeroMessage,
      aEstPublicParticipant,
      aEstDestinatairesReponse,
    );
  }
  notificationActualisationMessage() {
    if (this.options.estChat || !this.estAffiche()) {
      return;
    }
    if (this._desactiverAbonnementNotifMessage) {
      return;
    }
    if (!this.donnees.message.dernierPossessionMessage) {
      return;
    }
    this.moteurMessagerie
      .requeteListeMessagerie({
        avecMessage: true,
        avecLu: true,
        possessionMessageDiscussionUnique:
          this.donnees.message.dernierPossessionMessage,
      })
      .then((aParams) => {
        if (aParams.listeMessagerie && aParams.listeMessagerie.count() > 0) {
          const lMessageReponse = aParams.listeMessagerie.get(0);
          if (
            UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
              this.donnees.message,
              lMessageReponse,
            )
          ) {
            let lAvecActualisation = true;
            if (
              lMessageReponse.listePossessionsMessages.count() ===
              this.donnees.message.listePossessionsMessages.count()
            ) {
              lAvecActualisation = false;
              lMessageReponse.listePossessionsMessages.parcourir(
                (aMessage, aIndex) => {
                  const lMessageTrouve =
                    this.donnees.message.listePossessionsMessages.get(aIndex);
                  if (lMessageTrouve.getNumero() !== aMessage.getNumero()) {
                    lAvecActualisation = true;
                    return false;
                  }
                },
              );
            }
            if (lAvecActualisation) {
              return this._requeteListeMessages({
                titre: this.donnees.titre,
                message: lMessageReponse,
                marquerCommeLu: false,
                conserverBrouillon: true,
              });
            }
          }
        }
      });
  }
  _setValeurMessage(aHtml, aEstTiny) {
    let lDescriptif = aHtml;
    if (aEstTiny) {
      lDescriptif = TinyInit_1.TinyInit.estContenuVide(lDescriptif)
        ? ""
        : lDescriptif;
    }
    if (this.newMsg.contenu !== lDescriptif) {
      this.newMsg.contenu = lDescriptif;
      this.newMsg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
    }
  }
}
exports.ObjetDiscussion_Mobile = ObjetDiscussion_Mobile;
ObjetDiscussion_Mobile.ids = {};

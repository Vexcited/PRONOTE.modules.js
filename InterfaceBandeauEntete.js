exports.ObjetAffichageBandeauEntete = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const _InterfaceBandeauEntete_1 = require("_InterfaceBandeauEntete");
const ObjetNotification_1 = require("ObjetNotification");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Commande_1 = require("Enumere_Commande");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfaceCommande_1 = require("InterfaceCommande");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const UtilitaireContactVieScolaire_Espace_1 = require("UtilitaireContactVieScolaire_Espace");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ConnexionCloudIndex_1 = require("ObjetFenetre_ConnexionCloudIndex");
const ActionneurCentraleNotificationsSco_1 = require("ActionneurCentraleNotificationsSco");
const ObjetDonneesCentraleNotifications_1 = require("ObjetDonneesCentraleNotifications");
const ObjetMenuOngletPrimaire = require("ObjetMenuOngletPrimaire");
const UtilitaireCarnetLiaison = require("UtilitaireCarnetLiaison");
const TypeStatutConnexion_1 = require("TypeStatutConnexion");
const ObjetFicheEtablissement_1 = require("ObjetFicheEtablissement");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_PlanSite_1 = require("ObjetFenetre_PlanSite");
const ObjetFicheAppliMobile_1 = require("ObjetFicheAppliMobile");
const ObjetWrapperCentraleNotifications_Espace_1 = require("ObjetWrapperCentraleNotifications_Espace");
const ObjetSelecteurMembreEntete_Primaire = require("ObjetSelecteurMembreEntete_Primaire");
const ObjetWrapperAideContextuelle_Espace_1 = require("ObjetWrapperAideContextuelle_Espace");
const UtilitaireHarcelement_1 = require("UtilitaireHarcelement");
const ObjetFenetreHarcelement_1 = require("ObjetFenetreHarcelement");
const ThemesCouleurs_1 = require("ThemesCouleurs");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
CollectionRequetes_1.Requetes.inscrire(
  "GestionCloudIndex",
  ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class ObjetAffichageBandeauEntete extends _InterfaceBandeauEntete_1._ObjetAffichageBandeauEntete {
  constructor(...aParams) {
    super(...aParams);
    this.applicationPN = GApplication;
    this.etatUtilisateur = this.applicationPN.getEtatUtilisateur();
    this.parametresPN = this.applicationPN.getObjetParametres();
    Invocateur_1.Invocateur.abonner(
      ObjetDonneesCentraleNotifications_1.ObjetDonneesCentraleNotifications
        .typeNotif.surModification,
      (aDonnees) => {
        this._actualiserOngletNotification(aDonnees);
      },
      this,
    );
    Invocateur_1.Invocateur.abonner(
      "apresRequeteNavigation",
      () => {
        ObjetHtml_1.GHtml.setHtml(
          this.applicationProduit.idLigneBandeau,
          this.composeBaseLigneBandeau(),
        );
        ObjetHtml_1.GHtml.setDisplay(
          this.applicationProduit.idLigneBandeau,
          !!this.getInstance(this.identMenuOngletsLudique),
        );
        $(`#${this.applicationProduit.idLigneBandeau.escapeJQ()}`).removeClass(
          "sr-only",
        );
      },
      this,
    );
    this.setOptions({
      actionneurCentraleNotif:
        new ActionneurCentraleNotificationsSco_1.ActionneurCentraleNotificationsSco(),
    });
    this._ficheEtablissement = null;
    Invocateur_1.Invocateur.abonner(
      "ouvrir_ficheEtab",
      () => {
        if (this._ficheEtablissement) {
          this._ficheEtablissement.fermer();
        }
        this._ficheEtablissement =
          ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFicheEtablissement_1.ObjetFicheEtablissement,
            { pere: this },
            {
              callbackFermer: () => {
                this._ficheEtablissement = null;
              },
            },
          );
        this._ficheEtablissement.setDonnees({
          listeInformationsEtablissements:
            this.etatUtilisateur.listeInformationsEtablissements,
          estSurMobile: IE.estMobile,
          estEspaceAvecMembre: [
            Enumere_Espace_1.EGenreEspace.Parent,
            Enumere_Espace_1.EGenreEspace.Accompagnant,
            Enumere_Espace_1.EGenreEspace.Entreprise,
            Enumere_Espace_1.EGenreEspace.PrimParent,
            Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
            Enumere_Espace_1.EGenreEspace.Tuteur,
          ].includes(this.etatUtilisateur.GenreEspace),
          avecReglementAAccepter: [
            Enumere_Espace_1.EGenreEspace.Parent,
            Enumere_Espace_1.EGenreEspace.Eleve,
            Enumere_Espace_1.EGenreEspace.Mobile_Parent,
            Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
            Enumere_Espace_1.EGenreEspace.PrimParent,
            Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
            Enumere_Espace_1.EGenreEspace.PrimEleve,
            Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
          ].includes(GEtatUtilisateur.GenreEspace),
          avecReferentsHarcelement: true,
          avecReferentsVieScolaire:
            UtilitaireContactReferents_1.UtilitaireContactReferents.avecAffichageContactReferentsVieScolaire(
              GEtatUtilisateur.GenreEspace,
            ),
        });
      },
      this,
    );
  }
  estConnexionEDT() {
    return false;
  }
  estEspaceInvite() {
    return false;
  }
  avecPageAccueil() {
    return this.etatUtilisateur.avecPageAccueil();
  }
  avecAccesMobile() {
    return this.parametresPN.avecAccesMobile;
  }
  avecMenuRessource() {
    return true;
  }
  niveauMaxMenuOnglet() {
    return 1;
  }
  masquerLibelleMenuOnglet() {
    return false;
  }
  getLibelleMenuAccueil() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str("i", {
        title: ObjetTraduction_1.GTraductions.getValeur(
          "Commande.Accueil.Actif",
        ),
        class: "bt-home icon_home",
        role: "presentation",
      }),
      IE.jsx.str(
        "span",
        { class: "label-home" },
        ObjetTraduction_1.GTraductions.getValeur("Commande.Accueil.Actif"),
      ),
    );
  }
  getObjetCommande() {
    return InterfaceCommande_1.ObjetInterfaceCommande;
  }
  getObjetEtatUtilisateur() {
    return this.etatUtilisateur;
  }
  getGenreOngletAccueil() {
    return Enumere_Onglet_1.EGenreOnglet.Accueil;
  }
  getCommande(aGenreCommande) {
    switch (aGenreCommande) {
      case this.genreCommande.changerOnglet:
        return Enumere_Commande_1.EGenreCommande.ChangerOnglet;
      case this.genreCommande.accueil:
        return Enumere_Commande_1.EGenreCommande.Accueil;
      case this.genreCommande.cloudIndex:
        return Enumere_Commande_1.EGenreCommande.CloudIndex;
      case this.genreCommande.communication:
        return Enumere_Commande_1.EGenreCommande.Communication;
      case this.genreCommande.changerMembre:
        return Enumere_Commande_1.EGenreCommande.changerMembre;
      default:
        return false;
    }
  }
  getLibelleEtablissement() {
    return !!this.etatUtilisateur.getEtablissement()
      ? this.etatUtilisateur.getEtablissement().getLibelle()
      : "";
  }
  getUrlLogoEtablissement() {
    return !!this.etatUtilisateur.getEtablissement()
      ? this.etatUtilisateur.getEtablissement().urlLogo
      : "";
  }
  getLibelleUtilisateur() {
    let lLibelleClasse = "";
    if (
      this.etatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Eleve ||
      this.etatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.PrimEleve
    ) {
      lLibelleClasse = this.etatUtilisateur.Identification.getLibelleClasse();
    }
    return (
      this.etatUtilisateur.getUtilisateur().getLibelle() +
      (lLibelleClasse ? " (" + lLibelleClasse + ")" : "")
    );
  }
  estEspaceInscription() {
    return (
      this.etatUtilisateur.GenreEspace ===
      Enumere_Espace_1.EGenreEspace.Inscription
    );
  }
  getClassNomEspace() {
    return MethodesObjet_1.MethodesObjet.nomProprieteDeValeur(
      Enumere_Espace_1.EGenreEspace,
      this.etatUtilisateur.GenreEspace,
    ).toLowerCase();
  }
  getLibelleOngletPersonnel() {
    return ObjetTraduction_1.GTraductions.getValeur("Onglet.LibelleLong")[
      Enumere_Onglet_1.EGenreOnglet.InfosPerso
    ];
  }
  getUrlPhoto() {
    const lElement = this.etatUtilisateur.getUtilisateur();
    if (lElement && lElement.avecPhoto && lElement.photoBase64) {
      return "data:image/png;base64," + lElement.photoBase64;
    } else {
      return "";
    }
  }
  getUrlPhotoMembre(aMembre) {
    if (aMembre && GEtatUtilisateur.estEspaceAvecMembre()) {
      if (aMembre.avecPhoto && aMembre.photoBase64) {
        return "data:image/png;base64," + aMembre.photoBase64;
      }
      return null;
    }
    return "";
  }
  _getParametresBandeauEspace() {
    var _a, _b, _c, _d, _e;
    let lParametres = { controleur: {} };
    if (
      (!this.applicationPN.getOptionsDebug() ||
        this.applicationPN.getOptionsDebug().ongletsLudique) &&
      [
        Enumere_Espace_1.EGenreEspace.PrimEleve,
        Enumere_Espace_1.EGenreEspace.PrimParent,
        Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
      ].includes(this.etatUtilisateur.GenreEspace)
    ) {
      lParametres.iconesADroite = true;
      if (
        [
          Enumere_Espace_1.EGenreEspace.PrimParent,
          Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
        ].includes(this.etatUtilisateur.GenreEspace)
      ) {
        Object.assign(lParametres, {
          photo: null,
          getObjetSelecteurMembre: {
            class: ObjetSelecteurMembreEntete_Primaire,
            pere: this,
            init: (aInstance) => {
              aInstance.setParametres({
                getListe: () => {
                  return this.listeMembres;
                },
                selecElement: (aElement) => {
                  this.evenementSurMenuMembres(aElement);
                },
              });
            },
          },
        });
      }
      if (
        [Enumere_Espace_1.EGenreEspace.PrimAccompagnant].includes(
          this.etatUtilisateur.GenreEspace,
        )
      ) {
        const lMembre = GEtatUtilisateur.getMembre();
        if (
          lMembre &&
          lMembre.getGenre() === Enumere_Ressource_1.EGenreRessource.Eleve
        ) {
          Object.assign(lParametres, {
            htmlBoutonFicheEleve:
              '<ie-btnicon class="icon_fiche_eleve bt-activable bt-large" title="' +
              ObjetTraduction_1.GTraductions.getValeur(
                "Mobile.Menu.FicheEleve",
              ) +
              '" ie-model="btnFicheEleve"></ie-btnicon>',
          });
          lParametres.controleur.btnFicheEleve = {
            event: function (aEvent) {
              aEvent.stopPropagation();
              ObjetFenetre_FicheEleve.ouvrir({
                instance: this,
                avecRequeteDonnees: true,
                donnees: { eleve: GEtatUtilisateur.getMembre() },
              });
            },
          };
        }
      }
      if (
        [
          Enumere_Espace_1.EGenreEspace.PrimParent,
          Enumere_Espace_1.EGenreEspace.PrimEleve,
          Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
        ].includes(this.etatUtilisateur.GenreEspace)
      ) {
        Object.assign(lParametres, {
          getObjetNotification: {
            pere: this,
            class:
              ObjetWrapperCentraleNotifications_Espace_1.ObjetWrapperCentraleNotifications_Espace,
            init: function (aInstance) {
              aInstance.setOptions({
                modeBtnEntete: true,
                actionneur:
                  new ActionneurCentraleNotificationsSco_1.ActionneurCentraleNotificationsSco(),
              });
            },
          },
        });
      }
      if (
        !!this.parametresPN.aideContextuelle &&
        !!this.parametresPN.aideContextuelle.url_accueil &&
        this.avecClassMenuOngletLudique()
      ) {
        const lThis = this;
        Object.assign(lParametres, {
          getObjetAide: {
            pere: this,
            class:
              ObjetWrapperAideContextuelle_Espace_1.ObjetWrapperAideContextuelle_Espace,
            init: function (aInstance) {
              aInstance.setOptions({
                modeBtnEntete: true,
                listeOnglets: lThis.getObjetEtatUtilisateur().listeOnglets,
              });
            },
          },
        });
      }
      if (
        [Enumere_Espace_1.EGenreEspace.PrimParent].includes(
          this.etatUtilisateur.GenreEspace,
        ) &&
        this.applicationPN.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
        ) &&
        this.etatUtilisateur.Identification.ListeRessources &&
        this.etatUtilisateur.Identification.ListeRessources.count() > 0
      ) {
        Object.assign(lParametres, {
          htmlBoutonsAvantNotif:
            '<button ie-node="btnMessageCarnet.getNode" class="ibe_grosBoutonRond ieBouton themeBoutonPrimaire" ie-title="btnMessageCarnet.getTitle" aria-haspopup="dialog">' +
            '<i class="icon_carnet_liaison"></i></button>',
        });
        lParametres.controleur.btnMessageCarnet = {
          getNode: function () {
            $(this.node).eventValidation(() => {
              UtilitaireCarnetLiaison.creerDiscussionRaccourciParent();
            });
          },
          getTitle: function () {
            return ObjetTraduction_1.GTraductions.getValeur(
              "MessagerieCarnetLiaison.TitreFenetreNouveauPourLEleve",
              [GEtatUtilisateur.getMembre().getLibelle()],
            );
          },
        };
      }
      const lLibelleRacc =
        UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleRaccourciMessPrimEleve();
      if (lLibelleRacc) {
        Object.assign(lParametres, {
          htmlBoutonsAvantNotif: IE.jsx.str(
            "button",
            {
              "ie-node": "btnMessagePrimEleve.getNode",
              class: "ibe_grosBoutonRond ieBouton themeBoutonPrimaire",
              title: lLibelleRacc,
              "aria-haspopup": "dialog",
            },
            IE.jsx.str("i", { class: "icon_discussion_cours" }),
          ),
        });
        lParametres.controleur = {
          btnMessagePrimEleve: {
            getNode: function () {
              $(this.node).eventValidation(() => {
                ObjetFenetre_Message_1.ObjetFenetre_Message.creerDiscussionRaccourciPrimEleve();
              });
            },
          },
        };
      }
      if (
        this.applicationPN.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
        )
      ) {
        Object.assign(lParametres, {
          htmlBoutons: [
            '<div class="ibe_iconebtn ibe_actif" tabindex="0" role="button" ie-node="getNodeCreationAlertePPMS" ie-if="afficherCreationAlertePPMS" title="',
            ObjetChaine_1.GChaine.toTitle(
              ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.AlerteEnseignantsPersonnels",
              ),
            ),
            '">',
            '<i class="icon_alerte_ppms colorFoncee"></i>',
            "</div>",
            '<div class="ibe_iconebtn ibe_actif" tabindex="0" role="button" ie-node="getNodeConversInstant" ie-if="afficherConversInstant" title="',
            ObjetChaine_1.GChaine.toTitle(
              ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.EnvoiMessageInstantane",
              ),
            ),
            '">',
            '<i class="icon_conversation_cours colorFoncee"></i>',
            "</div>",
            '<div class="ibe_iconebtn ibe_actif" tabindex="0" role="button" ie-node="getNodeAlertePPMSEnCours" ie-if="afficherAlertePPMSEnCours" title="',
            ObjetChaine_1.GChaine.toTitle(
              ObjetTraduction_1.GTraductions.getValeur(
                "Messagerie.AlerteEnseignantsPersonnels",
              ),
            ),
            '">',
            '<i class="icon_alert_ppms_notif colorFoncee"></i>',
            "</div>",
          ].join(""),
        });
        lParametres.controleur.getNodeCreationAlertePPMS = function () {
          $(this.node).eventValidation((aEvent) => {
            aEvent.originalEvent.__clickZone__ = true;
            UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.creerAlertePPMS();
          });
        };
        (lParametres.controleur.afficherCreationAlertePPMS = () => {
          return this.applicationPN.droits.get(
            ObjetDroitsPN_1.TypeDroits.communication.lancerAlertesPPMS,
          );
        }),
          (lParametres.controleur.getNodeConversInstant = function () {
            $(this.node).eventValidation((aEvent) => {
              aEvent.originalEvent.__clickZone__ = true;
              UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.demarrerMessageInstantane();
            });
          }),
          (lParametres.controleur.afficherConversInstant = () => {
            return this.applicationPN.droits.get(
              ObjetDroitsPN_1.TypeDroits.communication.avecMessageInstantane,
            );
          }),
          (lParametres.controleur.getNodeAlertePPMSEnCours = function () {
            $(this.node).eventValidation((aEvent) => {
              aEvent.originalEvent.__clickZone__ = true;
              UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.afficherAlertePPMS();
            });
          }),
          (lParametres.controleur.afficherAlertePPMSEnCours = function () {
            return (
              UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.getListeAlertePPMSEnCours() &&
              UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.getListeAlertePPMSEnCours().count() >
                0
            );
          });
      }
    }
    const lEstDarkMode = ThemesCouleurs_1.ThemesCouleurs.getDarkMode();
    if (
      (_c =
        (_b =
          (_a = this.parametresPN) === null || _a === void 0
            ? void 0
            : _a.collectivite) === null || _b === void 0
          ? void 0
          : _b.logo) === null || _c === void 0
        ? void 0
        : _c.siteDesktop
    ) {
      lParametres.logoCollectiviteImage =
        lEstDarkMode && this.parametresPN.collectivite.logo.siteDesktop.sombre
          ? this.parametresPN.collectivite.logo.siteDesktop.sombre
          : this.parametresPN.collectivite.logo.siteDesktop.clair;
    }
    if (
      (_e =
        (_d = this.parametresPN) === null || _d === void 0
          ? void 0
          : _d.collectivite) === null || _e === void 0
        ? void 0
        : _e.urlCollectivite
    ) {
      lParametres.logoCollectiviteLien =
        this.parametresPN.collectivite.urlCollectivite;
    }
    return Object.assign(super._getParametresBandeauEspace(), lParametres);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecBoutonCommunication() {
        return aInstance.etatUtilisateur.avecCommunication();
      },
      afficherAlertePPMS() {
        return (
          UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.getListeAlertePPMSEnCours() &&
          UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.getListeAlertePPMSEnCours().count() >
            0
        );
      },
      btnAlertePPMS: {
        event() {
          UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.afficherAlertePPMS();
        },
        getTitle() {
          return ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.AlerteEnseignantsPersonnels",
          );
        },
      },
      afficherBtnMessageInstant() {
        return aInstance.applicationPN.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.avecMessageInstantane,
        );
      },
      btnMessageInstant: {
        event() {
          UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.demarrerMessageInstantane();
        },
        getTitle() {
          return `${ObjetTraduction_1.GTraductions.getValeur("Messagerie.EnvoiMessageInstantane")} - ${TypeStatutConnexion_1.TypeGenreStatutConnexionUtil.toLibelle(aInstance.applicationPN.donneesCentraleNotifications.statutConnexionCommunication)}`;
        },
      },
      getClassIconeBtnmessageInstant() {
        return (
          "TypeGenreStatutConnexion-double-icone " +
          TypeStatutConnexion_1.TypeGenreStatutConnexionUtil.getClassIcon(
            aInstance.applicationPN.donneesCentraleNotifications
              .statutConnexionCommunication,
          )
        );
      },
      afficherBtnCreerAlertePPMS() {
        return aInstance.applicationPN.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.lancerAlertesPPMS,
        );
      },
      btnCreerAlertePPMS: {
        event() {
          UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.creerAlertePPMS();
        },
        getTitle() {
          return ObjetTraduction_1.GTraductions.getValeur(
            "Messagerie.AlerteEnseignantsPersonnels",
          );
        },
      },
      btnStopHarcelement: {
        event() {
          const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetreHarcelement_1.ObjetFenetreHarcelement,
            { pere: aInstance },
          );
          lFenetre.setDonnees();
        },
      },
    });
  }
  avecCloudIndex() {
    return this.etatUtilisateur.cloudIndexActif;
  }
  evenementSurMenuMembres(aElement) {
    if (this.fenetreIdentiteMembre && this.fenetreIdentiteMembre.EnAffichage) {
      this.getObjetEtatUtilisateur().fenetreIdentiteMembreEnAffichage = true;
    }
    super.evenementSurMenuMembres(aElement);
    this.callbackSurMenuMembres();
    this.apresEvenementSurMenuMembres();
  }
  callbackSurMenuMembres() {
    this.callback.appel({
      genreCmd: this.getCommande(this.genreCommande.changerMembre),
    });
  }
  evenementBouton(aParam, aGenreBouton) {
    if (aParam.genreCmd === this.getCommande(this.genreCommande.twitter)) {
      if (!!this.parametresPN.urlAccesTwitter) {
        window.open(this.parametresPN.urlAccesTwitter);
      }
      return;
    }
    if (
      aParam.genreCmd === this.getCommande(this.genreCommande.cloudIndex) &&
      this.etatUtilisateur.cloudIndexActif
    ) {
      (0, CollectionRequetes_1.Requetes)("GestionCloudIndex", this)
        .lancerRequete()
        .then((aParams) => {
          if (aParams.JSONRapportSaisie.avecCloudIndex !== undefined) {
            this.etatUtilisateur.avecCloudIndex =
              aParams.JSONRapportSaisie.avecCloudIndex;
          }
          if (aParams.JSONRapportSaisie.urlSSO) {
            window.open(aParams.JSONRapportSaisie.urlSSO);
          } else {
            const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_ConnexionCloudIndex_1.ObjetFenetre_ConnexionCloudIndex,
              {
                pere: this,
                initialiser: function (aInstance) {
                  aInstance.setOptionsFenetre({
                    titre: ObjetTraduction_1.GTraductions.getValeur(
                      "cloudIndex.utilisationCloud",
                    ),
                    listeBoutons: [
                      ObjetTraduction_1.GTraductions.getValeur("Fermer"),
                    ],
                  });
                },
              },
            );
            lInstance.afficher();
          }
        });
      return;
    }
    return super.evenementBouton(aParam, aGenreBouton);
  }
  getLibelleSousOnglet(
    aLibelle,
    aAvecNom,
    aAvecClasse,
    aAvecGroupe,
    aSansLibelleOnglet,
  ) {
    if (this.sousOnglet === null || this.sousOnglet === undefined) {
      return "";
    }
    if (
      !(
        this.sousOnglet.getGenre() ===
          Enumere_Onglet_1.EGenreOnglet.Informations ||
        this.sousOnglet.getGenre() ===
          Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps ||
        this.sousOnglet.getGenre() ===
          Enumere_Onglet_1.EGenreOnglet.EquipePedagogique
      )
    ) {
      aAvecGroupe = false;
    }
    const lLibelleParametres = [];
    if (!aSansLibelleOnglet) {
      const lLibelleOnglet = this.sousOnglet.libelleImpression;
      if (lLibelleOnglet) {
        lLibelleParametres.push(lLibelleOnglet);
      }
    }
    if (MethodesObjet_1.MethodesObjet.isString(aAvecNom)) {
      if (lLibelleParametres.length) {
        lLibelleParametres.push(
          " ",
          ObjetTraduction_1.GTraductions.getValeur("De"),
          " ",
        );
      }
      lLibelleParametres.push(aAvecNom);
    } else if (aAvecNom) {
      if (lLibelleParametres.length) {
        lLibelleParametres.push(
          " ",
          ObjetTraduction_1.GTraductions.getValeur("De"),
          " ",
        );
      }
      const lGenreOnglet = this.sousOnglet.getGenre();
      let lNom = "";
      if (
        this.etatUtilisateur.GenreEspace ===
          Enumere_Espace_1.EGenreEspace.Professeur &&
        [
          Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
          Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
          Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationDeFinDeStage,
        ].includes(lGenreOnglet)
      ) {
        lNom = this.etatUtilisateur.Navigation.getLibelleRessource(
          Enumere_Ressource_1.EGenreRessource.Eleve,
        );
      } else {
        lNom = GEtatUtilisateur.getMembre().getLibelle();
      }
      lLibelleParametres.push(lNom);
    }
    let lLibelle = this.etatUtilisateur.Navigation.getLibelleRessource(
      Enumere_Ressource_1.EGenreRessource.Classe,
    );
    if (
      aAvecClasse &&
      this.etatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Professeur &&
      lLibelle
    ) {
      lLibelleParametres.push(
        " &#45; ",
        ObjetTraduction_1.GTraductions.getValeur("Classe"),
        " ",
        ObjetTraduction_1.GTraductions.getValeur("De"),
        " ",
        lLibelle,
      );
    }
    lLibelle = this.etatUtilisateur.Identification.getLibelleClasse();
    if (
      aAvecClasse &&
      (this.etatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Parent ||
        this.etatUtilisateur.GenreEspace ===
          Enumere_Espace_1.EGenreEspace.Eleve) &&
      lLibelle
    ) {
      lLibelleParametres.push(
        " &#45; ",
        ObjetTraduction_1.GTraductions.getValeur("Classe"),
        " ",
        ObjetTraduction_1.GTraductions.getValeur("De"),
        " ",
        lLibelle,
      );
    }
    lLibelle = this.etatUtilisateur.Identification.getLibelleGroupes();
    if (
      aAvecGroupe &&
      (this.etatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Parent ||
        this.etatUtilisateur.GenreEspace ===
          Enumere_Espace_1.EGenreEspace.Eleve) &&
      lLibelle &&
      lLibelle.length < 100
    ) {
      lLibelleParametres.push(
        " &#45; ",
        ObjetTraduction_1.GTraductions.getValeur("Groupe"),
        " ",
        ObjetTraduction_1.GTraductions.getValeur("De"),
        " ",
        lLibelle,
      );
    }
    if (aLibelle) {
      lLibelleParametres.push(" &#45; ", aLibelle);
    }
    lLibelleParametres.push(
      '<span id="' +
        this.Nom +
        '_ComplementBandeau" class="Texte10 Gras"></span>',
    );
    return lLibelleParametres.join("");
  }
  composeAlertePPMS() {
    const lHtml = [];
    if (
      this.applicationPN.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
      )
    ) {
      lHtml.push(
        '<span ie-if="afficherAlertePPMS"><ie-btnimage ie-model="btnAlertePPMS" class="icon_alert_ppms_notif btnImageIcon"></ie-btnimage></span>',
      );
    }
    return lHtml.join("");
  }
  composeBoutonHarcelement() {
    return UtilitaireHarcelement_1.UtilitaireHarcelement.avecBoutonHarcelement()
      ? `<div class="objetBandeauEntete_boutons_ifc"><ie-btnimage class="icon_stop_harcelement btnImageIcon badged-btn icon-title" ie-model="btnStopHarcelement" title="${ObjetTraduction_1.GTraductions.getValeur("Commande.Harcelement")}" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Commande.Harcelement")}" ></ie-btnimage></div>`
      : "";
  }
  composeBtnCommunication(aID) {
    return [
      '<span ie-if="avecBoutonCommunication">',
      '<ie-btnimage id="',
      aID,
      '" class="icon_envoyer btnImageIcon" ie-model="btnDroite(' +
        this.getCommande(this.genreCommande.communication) +
        ')" title="',
      ObjetTraduction_1.GTraductions.getValeur("Commande.Communication.Actif"),
      '"></ie-btnimage>',
      "</span>",
    ].join("");
  }
  composeCreationAlertePPMS() {
    const lHtml = [];
    if (
      this.applicationPN.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
      )
    ) {
      lHtml.push(
        '<span ie-if="afficherBtnCreerAlertePPMS">',
        '<ie-btnimage ie-model="btnCreerAlertePPMS" class="icon_alerte_ppms btnImageIcon"></ie-btnimage>',
        "</span>",
      );
    }
    return lHtml.join("");
  }
  composeConversation() {
    const lHtml = [];
    if (
      this.applicationPN.droits.get(
        ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
      )
    ) {
      lHtml.push(
        IE.jsx.str(
          "span",
          { "ie-if": "afficherBtnMessageInstant", style: "position:relative" },
          IE.jsx.str(
            "ie-btnimage",
            {
              "ie-model": "btnMessageInstant",
              class: "icon_conversation_cours btnImageIcon",
            },
            IE.jsx.str("i", { "ie-class": "getClassIconeBtnmessageInstant" }),
          ),
        ),
      );
    }
    return lHtml.join("");
  }
  addCommandesMenuContextuelBandeau(aMenu) {
    if (
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.InfosPerso,
      ) &&
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.InfosPerso,
      ).Actif
    ) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
          Enumere_Onglet_1.EGenreOnglet.InfosPerso
        ],
        true,
        () => {
          this._evenementBouton({
            genreCommande: this.genreCommandePersonnel.onglet,
            genreOnglet: Enumere_Onglet_1.EGenreOnglet.InfosPerso,
          });
        },
        {
          image: '<i class="icon_uniF2BE icone-large"></i>',
          imageFormate: true,
        },
      );
    }
    if (
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.CompteEleve,
      ) &&
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.CompteEleve,
      ).Actif
    ) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
          Enumere_Onglet_1.EGenreOnglet.CompteEleve
        ],
        true,
        () => {
          this._evenementBouton({
            genreCommande: this.genreCommandePersonnel.onglet,
            genreOnglet: Enumere_Onglet_1.EGenreOnglet.CompteEleve,
          });
        },
        {
          image: '<i class="icon_uniF2BE icone-large"></i>',
          imageFormate: true,
        },
      );
    }
    if (
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.InfosEnfant_Prim,
      ) &&
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.InfosEnfant_Prim,
      ).Actif
    ) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
          Enumere_Onglet_1.EGenreOnglet.InfosEnfant_Prim
        ],
        true,
        () => {
          this._evenementBouton({
            genreCommande: this.genreCommandePersonnel.onglet,
            genreOnglet: Enumere_Onglet_1.EGenreOnglet.InfosEnfant_Prim,
          });
        },
        {
          image: '<i class="icon_uniF2BE icone-large"></i>',
          imageFormate: true,
        },
      );
    }
    if (
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
      ) &&
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
      ).Actif
    ) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
          Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger
        ],
        true,
        () => {
          this._evenementBouton({
            genreCommande: this.genreCommandePersonnel.onglet,
            genreOnglet: Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
          });
        },
        {
          image: '<i class="icon_doc_telech icone-large"></i>',
          imageFormate: true,
        },
      );
    }
    aMenu.addSeparateur();
    if (
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur,
      ) &&
      GEtatUtilisateur.listeOnglets.getElementParGenre(
        Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur,
      ).Actif
    ) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
          Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur
        ],
        true,
        () => {
          this._evenementBouton({
            genreCommande: this.genreCommandePersonnel.onglet,
            genreOnglet: Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur,
          });
        },
        { image: '<i class="icon_cog icone-large"></i>', imageFormate: true },
      );
    }
    if (this.parametresPN.avecAccesMobile) {
      aMenu.add(
        ObjetTraduction_1.GTraductions.getValeur("Commande.QRCode.Actif"),
        true,
        () => {
          this._callbackAccesMobile();
        },
        {
          image: '<i class="icon_qr_code icone-large"></i>',
          imageFormate: true,
        },
      );
    }
    aMenu.add(
      ObjetTraduction_1.GTraductions.getValeur("connexion.SeDeconnecter"),
      true,
      () => {
        this._evenementBouton({
          genreCommande: this.genreCommandePersonnel.deconnexion,
        });
      },
      { image: '<i class="icon_off icone-large"></i>', imageFormate: true },
    );
  }
  getCallbackBandeauAccesMobile() {
    if (this.avecAccesMobile()) {
      return () => {
        this._callbackAccesMobile();
      };
    }
  }
  getCallbackBandeauEtablissement() {
    return function () {
      Invocateur_1.Invocateur.evenement("ouvrir_ficheEtab");
    }.bind(this);
  }
  getObjetsGraphiqueMembre(aMembreOnglet) {
    const lMembre = GEtatUtilisateur.getMembre();
    if (
      aMembreOnglet &&
      [
        Enumere_Espace_1.EGenreEspace.Accompagnant,
        Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
        Enumere_Espace_1.EGenreEspace.Tuteur,
      ].includes(this.etatUtilisateur.GenreEspace) &&
      !!lMembre &&
      lMembre.getGenre() === Enumere_Ressource_1.EGenreRessource.Eleve
    ) {
      if (!aMembreOnglet.controleur) {
        aMembreOnglet.controleur = {};
      }
      if (!aMembreOnglet.controleur.btnFicheMembre) {
        aMembreOnglet.controleur.btnFicheMembre = {
          event: () => {
            this.ouvrirFicheMembre();
          },
          getTitle: function () {
            return "";
          },
        };
      }
      return [
        {
          html: IE.jsx.str("ie-btnicon", {
            "ie-model": "btnFicheMembre",
            class: "icon_fiche_eleve bt-activable bt-large m-left-xl",
            title:
              ObjetTraduction_1.GTraductions.getValeur("FicheRenseignement"),
          }),
        },
      ];
    }
    return null;
  }
  ouvrirFicheMembre() {
    if (
      !this.etatUtilisateur.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Eleve,
      )
    ) {
      this.getObjetEtatUtilisateur().setNumeroEleve(
        GEtatUtilisateur.getMembre().getNumero(),
      );
    }
    this.fenetreIdentiteMembre =
      ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_FicheEleve,
        {
          pere: this,
          evenement: (aNumeroBouton) => {
            if (aNumeroBouton === -1) {
              this.getObjetEtatUtilisateur().fenetreIdentiteMembreEnAffichage = false;
            }
          },
          initialiser: function (aInstance) {
            aInstance.setOptionsFenetre({
              modale: false,
              listeBoutons: [
                ObjetTraduction_1.GTraductions.getValeur("Fermer"),
              ],
              largeur: 850,
              hauteur: 750,
            });
          },
        },
      );
    this.fenetreIdentiteMembre.setDonnees();
  }
  apresEvenementSurMenuMembres() {
    if (this.getObjetEtatUtilisateur().fenetreIdentiteMembreEnAffichage) {
      this.ouvrirFicheMembre();
    }
  }
  avecClassMenuOngletLudique() {
    return (
      !!ObjetMenuOngletPrimaire &&
      (!this.applicationPN.getOptionsDebug() ||
        this.applicationPN.getOptionsDebug().ongletsLudique)
    );
  }
  creerMenuOngletLudique() {
    this.identMenuOngletsLudique = this.add(
      ObjetMenuOngletPrimaire,
      null,
      (aInstance) => {
        aInstance.setOptions();
      },
    );
  }
  actionsSurPlanSite() {
    let lFenetrePlanSite = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_PlanSite_1.ObjetFenetre_PlanSite,
      {
        pere: this,
        initialiser: function (aInstance) {
          aInstance.setOptionsFenetre({
            titre:
              ObjetTraduction_1.GTraductions.getValeur("PiedPage.planSite"),
          });
        },
      },
    );
    lFenetrePlanSite.setDonnees();
  }
  _actualiserOngletNotification(aDonnees) {
    let lCompteurMisAJourSurOngletAffiche = false;
    if (aDonnees.compteurNotifsParOnglet) {
      const lSecondMenu = $(
        "#" + this.idSecondMenu.escapeJQ() + " > div:first",
      );
      for (const x in aDonnees.compteurNotifsParOnglet) {
        const lInfos = aDonnees.compteurNotifsParOnglet[x];
        const lOnglet = this.applicationPN
          .getEtatUtilisateur()
          .listeOngletsOriginal.getElementParNumeroEtGenre(null, lInfos.onglet);
        if (lOnglet) {
          if (
            this.applicationPN.parametresUtilisateur.get(
              "utiliserNotification",
            ) &&
            lInfos.onglet === Enumere_Onglet_1.EGenreOnglet.Messagerie &&
            lOnglet.compteur < lInfos.nb
          ) {
            ObjetNotification_1.Notification.afficher({
              title: lOnglet.getLibelle(),
              msg: lOnglet.getLibelle() + " : " + lInfos.nb,
              onclick: GInterface.changementManuelOnglet.bind(
                GInterface,
                lOnglet.getGenre(),
              ),
              icon: "icon_nouvelle_discussion",
            });
          }
          lOnglet.compteur = lInfos.nb;
          if (!lCompteurMisAJourSurOngletAffiche) {
            lCompteurMisAJourSurOngletAffiche =
              lSecondMenu.find('li[data-genre="' + lInfos.onglet + '"]')
                .length > 0;
          }
        }
      }
    }
    if (this.getInstance(this.identMenuOnglets)) {
      this.getInstance(this.identMenuOnglets).setDonnees(
        GEtatUtilisateur.listeOnglets,
        this.etatUtilisateur.getGenreOngletPere(),
      );
    }
    if (lCompteurMisAJourSurOngletAffiche) {
      this.actualiserLibelleOnglet();
    }
  }
  _callbackAccesMobile() {
    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFicheAppliMobile_1.ObjetFicheAppliMobile,
      { pere: this },
    ).afficher(this.parametresPN.URLMobile);
  }
}
exports.ObjetAffichageBandeauEntete = ObjetAffichageBandeauEntete;

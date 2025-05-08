exports.ObjetInterfaceEspace = void 0;
require("IEHtml.TextareaMax.js");
require("IEHtml.SyntheseVocale.js");
require("IEHtml.SelecFile.js");
require("IEHtml.Scroll.js");
require("DeclarationQRCode.js");
const ObjetRequeteNavigation_1 = require("ObjetRequeteNavigation");
require("UtilitaireQCM.js");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
require("PageNotes.js");
const ObjetStyle_1 = require("ObjetStyle");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetSupport_1 = require("ObjetSupport");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const Enumere_Commande_1 = require("Enumere_Commande");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const UtilitaireContactVieScolaire_Espace_1 = require("UtilitaireContactVieScolaire_Espace");
const ThemesPrimaire_1 = require("ThemesPrimaire");
const InterfaceBandeauEntete_1 = require("InterfaceBandeauEntete");
const InterfaceBandeauPied = require("InterfaceBandeauPied");
const DeclarationOngletsEspace_1 = require("DeclarationOngletsEspace");
const _ObjetInterfaceEspaceCP_1 = require("_ObjetInterfaceEspaceCP");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_Communication = require("ObjetFenetre_Communication");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const UtilTransformationFlux = require("UtilitaireTransformationFlux");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const UtilitaireRequetesCloud_1 = require("UtilitaireRequetesCloud");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const InterfaceVide_1 = require("InterfaceVide");
const ObjetFenetre_GenerationPdfSco_1 = require("ObjetFenetre_GenerationPdfSco");
const ObjetRequeteAccesSecurisePageProfil_1 = require("ObjetRequeteAccesSecurisePageProfil");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const Cache_1 = require("Cache");
class ObjetInterfaceEspace extends _ObjetInterfaceEspaceCP_1._ObjetInterfaceEspaceCP {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    this.parametresSco = GParametres;
    if (ObjetSupport_1.Support.supportEventOnPopState) {
      $(window).on("popstate", { instance: this }, this._surPopState);
    }
    this.temporaireAvecMenuContextuelSurBoutonCommunication = false;
    this._creerTransformateurFlux();
  }
  construireInstances() {
    this.IdentBandeauEntete = this.add(
      InterfaceBandeauEntete_1.ObjetAffichageBandeauEntete,
      this.evenementCommande,
    );
    this.IdentBandeauPied = this.add(
      InterfaceBandeauPied,
      this.evenementCommande,
    );
    this.IdentPage = this.add(InterfaceVide_1.InterfaceVide);
  }
  evenementSurMenuContextCloud() {
    this.construireInstancesPDFEtImpression();
    super.surEvenementSurImpression();
  }
  construireInstancesPDFEtImpression() {
    super.construireInstancesPDFEtImpression();
    this.identFenetreGenerationPdf = this.addFenetre(
      ObjetFenetre_GenerationPdfSco_1.ObjetFenetre_GenerationPdfSco,
    );
  }
  detruireInstances() {
    super.detruireInstances();
    $(window).off("popstate");
  }
  focusAuDebut() {
    this.getInstance(this.IdentBandeauEntete).focusAuDebut();
  }
  setParametresGeneraux() {
    this.AvecCadre = false;
  }
  construireStructureAffichage() {
    const H = [];
    let lHtmlFooter = "";
    let lFooter = "no-footer";
    if (this.IdentBandeauPied > 0) {
      const lInstanceFooter = this.getInstance(this.IdentBandeauPied);
      const lClassEtatFooter = lInstanceFooter.masquerBandeauPied()
        ? "closed"
        : "opened";
      lFooter = lInstanceFooter.masquerBandeauPied()
        ? "no-footer"
        : "with-footer";
      lHtmlFooter =
        '<div class="footer-wrapper ' +
        lClassEtatFooter +
        '" id="' +
        lInstanceFooter.getNom() +
        '" ></div>';
    }
    H.push(
      '<div id="',
      this.Nom,
      '_T"',
      ' style="position:relative;',
      this.etatUtilisateurSco.pourThemePrimaire()
        ? ""
        : ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
      '"',
      ' class="interface_affV',
      " ",
      lFooter,
      this.etatUtilisateurSco.pourThemePrimaire()
        ? " " + ThemesPrimaire_1.GThemesPrimaire.getTheme()
        : "",
      '">',
    );
    if (this.IdentBandeauEntete >= 0) {
      H.push(
        '<div class="AvecMenuContextuel main-header" id="',
        this.getInstance(this.IdentBandeauEntete).getNom(),
        '" ></div>',
      );
    }
    if (this.IdentPage >= 0) {
      H.push(
        "<div ",
        ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Main),
        ' id="',
        this.getInstance(this.IdentPage).getNom(),
        '"',
        ' class="interface_affV_client',
        !GNavigateur.isLayoutTactile ? " no-tactile" : "",
        this.etatUtilisateurSco.pourThemePrimaire() ? " prim-ludique" : "",
        '">',
        "</div>",
      );
    }
    H.push(lHtmlFooter);
    H.push("</div>");
    return H.join("");
  }
  actualiser() {
    this.initialiser(true);
    this.getInstance(this.IdentBandeauEntete).setDonnees(
      this.connexion.libelle,
      this.connexion.listeEleves,
    );
    this.getInstance(this.IdentBandeauPied).setDonnees();
    Invocateur_1.Invocateur.evenement("maj_boutonImpression");
    this.surResizeInterface();
  }
  setDonnees(aLibelle, aListeEleves, aMessageConnexion) {
    this.connexion = {};
    this.connexion.libelle = aLibelle;
    this.connexion.listeEleves = aListeEleves;
    this.connexion.messageConnexion = aMessageConnexion;
    this.actualiser();
    if (
      this.etatUtilisateurSco.getGenreOnglet() &&
      this.getInstance(this.IdentBandeauEntete)
    ) {
      this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
        new ObjetElement_1.ObjetElement(
          "",
          0,
          this.etatUtilisateurSco.getGenreOnglet(),
        ),
      );
    }
    UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.declarer();
    this.applicationSco.donneesCentraleNotifications.initSurInterfaceDisponible();
  }
  evenementCommande(aParam) {
    switch (aParam.genreCmd) {
      case Enumere_Commande_1.EGenreCommande.Accueil: {
        this._evenementSurClickOnglet(Enumere_Onglet_1.EGenreOnglet.Accueil);
        break;
      }
      case Enumere_Commande_1.EGenreCommande.ChangerOnglet: {
        const lOnglet = aParam.onglet;
        this._evenementSurClickOnglet(
          lOnglet.getGenre(),
          aParam.ignorerHistorique,
        );
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Impression: {
        this.surEvenementSurImpression();
        break;
      }
      case Enumere_Commande_1.EGenreCommande.ImpressionHTML: {
        this.surEvenementSurImpression({ impressionHTML: true });
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Validation: {
        this._surValider();
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Communication: {
        this.evenementSurCommunication(false);
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Tutoriel: {
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Aide: {
        this.evenementSurAide();
        break;
      }
      case Enumere_Commande_1.EGenreCommande.Profil: {
        this.evenementSurAccesProfil();
        break;
      }
      case Enumere_Commande_1.EGenreCommande.changerMembre: {
        this.evenementSurChangementMembre();
        break;
      }
      default:
        break;
    }
  }
  surEvenementSurImpression(aParams) {
    let lModeGestion;
    let lEstImpressionHtml = !!aParams && aParams.impressionHTML;
    let lAvecParametresPDF = ![
      Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
    ].includes(this.etatUtilisateurSco.getGenreOnglet());
    switch (this.etatUtilisateurSco.getGenreOnglet()) {
      case Enumere_Onglet_1.EGenreOnglet.Graphique_Profil:
        lModeGestion =
          UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
            .PDF;
        break;
      default:
        lModeGestion =
          UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
            .PDFEtCloud;
    }
    let lParams = {
      avecTitreSelonOnglet: true,
      callbaskEvenement: this.surEvenementFenetre.bind(this),
      callbackParametrage: lAvecParametresPDF
        ? this.evenementSurMenuContextCloud.bind(this)
        : null,
      modeGestion: lModeGestion,
      avecDepot: true,
    };
    if (lEstImpressionHtml) {
      this.evenementSurMenuContextCloud();
    } else {
      UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
        lParams,
      );
    }
  }
  evenementSurChangementMembre() {
    this.actualiser();
    this.changementManuelOnglet(this.etatUtilisateurSco.getGenreOnglet());
    if (Cache_1.GCache && Cache_1.GCache.general) {
      Cache_1.GCache.general._jetonViderCacheListePublics = true;
    }
  }
  surEvenementFenetre(aLigne, aService) {
    const lInstance = this;
    this.construireInstancesPDFEtImpression();
    if (this.etatUtilisateurSco.EtatSaisie) {
      this.applicationSco
        .getMessage()
        .afficher({
          type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
          message:
            this.etatUtilisateurSco.impressionCourante.etat ===
            Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "GenerationPDF.MessageAlerteGenerationPdf",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "fenetreImpression.MessageAlerteImpression",
                ),
          callback: lInstance.evenementApresConfirmation.bind(
            lInstance,
            aService,
          ),
        });
    } else {
      this.evenementApresConfirmation(
        aService,
        Enumere_Action_1.EGenreAction.Valider,
      );
    }
  }
  evenementApresConfirmation(aService, AAccepte) {
    if (AAccepte === Enumere_Action_1.EGenreAction.Valider) {
      this._genererPdf(aService);
    }
  }
  _surPopState(aEvent) {
    const lInstance = aEvent.data.instance;
    if (GNavigateur.getBloquerClavier()) {
      lInstance._surForward = true;
      window.history.forward();
      return;
    }
    const lEtat = aEvent.originalEvent.state;
    if (
      !lEtat ||
      lEtat.onglet === undefined ||
      lEtat.numeroSession !==
        lInstance.applicationSco.getCommunication().NumeroDeSession
    ) {
      UtilitaireDeconnexion_1.UtilitaireDeconnexion.confirmationDeconnexion(
        true,
      ).then((aValider) => {
        if (aValider === false) {
          lInstance._surForward = true;
          window.history.forward();
        }
      });
    } else {
      if (lInstance._surForward) {
        delete lInstance._surForward;
        return;
      }
      (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
        function () {
          this.retourSurNavigation({
            ignorerHistorique: true,
            onglet: lEtat.onglet,
          });
        }.bind(lInstance),
      );
    }
  }
  getPage() {
    return this.getInstance(this.IdentPage);
  }
  setFocusPremierObjet() {
    if (
      this.etatUtilisateurSco.premierChargement &&
      this.etatUtilisateurSco.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.Accueil
    ) {
      this.getInstance(this.IdentBandeauEntete).focusAuDebut();
    } else if (
      $("#" + this.applicationSco.idBreadcrumb.escapeJQ() + ":visible")
        .length === 1
    ) {
      $("#" + this.applicationSco.idBreadcrumb.escapeJQ()).focus();
    } else if (
      $("#" + this.applicationSco.idBreadcrumbPerso.escapeJQ()).length === 1
    ) {
      $("#" + this.applicationSco.idBreadcrumbPerso.escapeJQ()).focus();
    } else if (
      this.getInstance(this.IdentPage) &&
      this.getInstance(this.IdentPage).idPremierObjet &&
      $("#" + this.getInstance(this.IdentPage).idPremierObjet.escapeJQ())
        .length === 1
    ) {
      $(
        "#" + this.getInstance(this.IdentPage).idPremierObjet.escapeJQ(),
      ).focus();
    } else {
    }
  }
  changementManuelOnglet(aGenreOnglet) {
    const lInterfaceBandeau = this.getInstance(this.IdentBandeauEntete);
    if (
      lInterfaceBandeau &&
      lInterfaceBandeau.getInstance(lInterfaceBandeau.identMenuOnglets)
    ) {
      lInterfaceBandeau
        .getInstance(lInterfaceBandeau.identMenuOnglets)
        .selectionnerSousOnglet(aGenreOnglet);
    } else if (lInterfaceBandeau) {
      lInterfaceBandeau.evenementSurMenuOnglets(
        new ObjetElement_1.ObjetElement("", 0, aGenreOnglet),
      );
    } else {
      this._evenementSurClickOnglet(aGenreOnglet);
    }
  }
  changementMembre(aMembre) {
    const lInterfaceBandeau = this.getInstance(this.IdentBandeauEntete);
    if (lInterfaceBandeau) {
      lInterfaceBandeau.changerMembre(aMembre);
    }
  }
  recupererDonnees() {
    this.surResizeInterface();
  }
  initialiserMessageAttente() {}
  initialiserEntete() {
    this.Instances[this.NombreGenreAffichage].setParametres(
      20,
      this.parametresSco.NomEspace,
      true,
      this.parametresSco.NomEtablissement,
      "right",
    );
  }
  getEtatSaisie() {
    return this.etatUtilisateurSco.EtatSaisie;
  }
  evenementSurCommunication(aAffichageDepuisDiscussion) {
    if (ObjetFenetre_Communication) {
      this.AffichageDepuisDiscussion = aAffichageDepuisDiscussion;
      if (this.temporaireAvecMenuContextuelSurBoutonCommunication) {
        this._ouvrirMenuContextuelSurBoutonCommunication();
      } else {
        ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_Communication,
          {
            pere: this,
            initialiser: function (aInstance) {
              const lEstFenetreAllegee =
                this.etatUtilisateurSco.GenreEspace ===
                Enumere_Espace_1.EGenreEspace.Entreprise;
              aInstance.setOptionsFenetre({
                modale: true,
                titre: ObjetTraduction_1.GTraductions.getValeur(
                  "fenetreCommunication.titre",
                ),
                largeur: lEstFenetreAllegee
                  ? 400
                  : aAffichageDepuisDiscussion
                    ? 650
                    : 750,
                hauteur: lEstFenetreAllegee ? 140 : 450,
                listeBoutons: [
                  ObjetTraduction_1.GTraductions.getValeur("Fermer"),
                ],
              });
              aInstance.setModeAffichage(
                aAffichageDepuisDiscussion,
                lEstFenetreAllegee,
              );
            },
          },
        ).afficher();
      }
    }
  }
  _ouvrirMenuContextuelSurBoutonCommunication() {
    const lFncCreationItemMenuContextuel = (aInstanceMenu) => {
      const lAvecDiscussion =
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
        ) &&
        !this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
        ) &&
        [
          Enumere_Espace_1.EGenreEspace.Professeur,
          Enumere_Espace_1.EGenreEspace.PrimProfesseur,
          Enumere_Espace_1.EGenreEspace.Etablissement,
          Enumere_Espace_1.EGenreEspace.Administrateur,
          Enumere_Espace_1.EGenreEspace.Eleve,
          Enumere_Espace_1.EGenreEspace.Parent,
          Enumere_Espace_1.EGenreEspace.PrimParent,
          Enumere_Espace_1.EGenreEspace.Accompagnant,
          Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
          Enumere_Espace_1.EGenreEspace.Tuteur,
          Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
          Enumere_Espace_1.EGenreEspace.PrimDirection,
        ].includes(this.etatUtilisateurSco.GenreEspace);
      const lAvecInformations =
        [
          Enumere_Espace_1.EGenreEspace.Professeur,
          Enumere_Espace_1.EGenreEspace.PrimProfesseur,
          Enumere_Espace_1.EGenreEspace.Etablissement,
          Enumere_Espace_1.EGenreEspace.Administrateur,
          Enumere_Espace_1.EGenreEspace.PrimDirection,
        ].includes(this.etatUtilisateurSco.GenreEspace) &&
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
        );
      const lAvecSondages =
        [
          Enumere_Espace_1.EGenreEspace.Professeur,
          Enumere_Espace_1.EGenreEspace.PrimProfesseur,
          Enumere_Espace_1.EGenreEspace.Etablissement,
          Enumere_Espace_1.EGenreEspace.Administrateur,
          Enumere_Espace_1.EGenreEspace.PrimDirection,
        ].includes(this.etatUtilisateurSco.GenreEspace) &&
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
        );
      if (lAvecDiscussion) {
        aInstanceMenu.add(
          ObjetTraduction_1.GTraductions.getValeur(
            "fenetreCommunication.bouton.demarrerDiscussion",
          ),
          true,
          () => {
            const lDonnees = {
              Onglet: Enumere_Onglet_1.EGenreOnglet.Messagerie,
              avecActionSaisie: true,
            };
            this.etatUtilisateurSco.setPage(lDonnees);
            this.etatUtilisateurSco.Navigation.OptionsOnglet = lDonnees;
            if (this.etatUtilisateurSco.getGenreOnglet()) {
              let lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
              if (
                this.etatUtilisateurSco.listeOngletsInvisibles.indexOf(
                  lGenreOnglet,
                ) === -1
              ) {
                this.changementManuelOnglet(
                  this.etatUtilisateurSco.getGenreOnglet(),
                );
              }
            }
          },
        );
      }
      if (lAvecInformations || lAvecSondages) {
        const lFnSurClicItemInfosSondages = (aEstInformations) => {
          const lDonnees = {
            Onglet: Enumere_Onglet_1.EGenreOnglet.Informations,
            avecActionSaisie: true,
            creerInformation: aEstInformations,
          };
          this.etatUtilisateurSco.setPage(lDonnees);
          this.etatUtilisateurSco.Navigation.OptionsOnglet = lDonnees;
          if (this.etatUtilisateurSco.getGenreOnglet()) {
            let lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
            if (
              this.etatUtilisateurSco.listeOngletsInvisibles.indexOf(
                lGenreOnglet,
              ) === -1
            ) {
              this.changementManuelOnglet(
                this.etatUtilisateurSco.getGenreOnglet(),
              );
            }
          }
        };
        if (lAvecInformations) {
          aInstanceMenu.add(
            ObjetTraduction_1.GTraductions.getValeur(
              "fenetreCommunication.bouton.information",
            ),
            true,
            () => {
              lFnSurClicItemInfosSondages(true);
            },
          );
        }
        if (lAvecSondages) {
          aInstanceMenu.add(
            ObjetTraduction_1.GTraductions.getValeur(
              "fenetreCommunication.bouton.sondage",
            ),
            true,
            () => {
              lFnSurClicItemInfosSondages(false);
            },
          );
        }
      }
      aInstanceMenu.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "fenetreCommunication.bouton.fenetreCommunication",
        ),
        true,
        () => {
          const lFenetreComm = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_Communication,
            {
              pere: this,
              initialiser: function (aInstance) {
                const lEstFenetreAllegee =
                  this.etatUtilisateurSco.GenreEspace ===
                  Enumere_Espace_1.EGenreEspace.Entreprise;
                aInstance.setOptionsFenetre({
                  modale: true,
                  titre: ObjetTraduction_1.GTraductions.getValeur(
                    "fenetreCommunication.titre",
                  ),
                  largeur: lEstFenetreAllegee
                    ? 400
                    : this.AffichageDepuisDiscussion
                      ? 650
                      : 750,
                  hauteur: lEstFenetreAllegee ? 140 : 450,
                  listeBoutons: [
                    ObjetTraduction_1.GTraductions.getValeur("Fermer"),
                  ],
                });
                aInstance.setModeAffichage(
                  this.AffichageDepuisDiscussion,
                  lEstFenetreAllegee,
                );
              },
            },
          );
          lFenetreComm.afficher();
        },
      );
    };
    ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
      pere: this,
      id: this.getInstance(this.IdentBandeauEntete).NomBtnCommunication,
      initCommandes: lFncCreationItemMenuContextuel.bind(this),
    });
  }
  evenementSurAide() {
    if (this.parametresSco.urlAide) {
      window.open(
        ObjetChaine_1.GChaine.format(this.parametresSco.urlAide, [
          this.etatUtilisateurSco.getGenreOnglet(),
          this.etatUtilisateurSco.getLibelleLongOnglet(),
        ]),
      );
    }
  }
  evenementSurAccesProfil() {
    UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
    if (
      ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil
    ) {
      new ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil(
        this,
        this.actionSurRequetePageProfil,
      ).lancerRequete();
    }
  }
  actionSurRequetePageProfil(aTitre, aMessage, aUrl) {
    if (aMessage) {
      UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
      this.applicationSco
        .getMessage()
        .afficher({
          type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
          titre: aTitre,
          message: aMessage,
        });
    } else if (aUrl) {
      UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aUrl);
    } else {
      UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
    }
  }
  raccourcisClavierSurBandeau(aNumeroRaccourci) {
    this.getInstance(this.IdentBandeauEntete).evenementRaccourcisClavier(
      aNumeroRaccourci,
    );
    return true;
  }
  actualisationF5() {
    (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
      this.retourSurNavigation({
        ignorerHistorique: true,
        onglet: this.etatUtilisateurSco.getGenreOnglet(),
      });
    });
  }
  retourSurNavigation(aParametres) {
    if (aParametres && aParametres.ignorerHistorique) {
      this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
        new ObjetElement_1.ObjetElement("", 0, aParametres.onglet),
        true,
      );
    } else if (
      !MethodesObjet_1.MethodesObjet.isUndefined(
        this.etatUtilisateurSco.getGenreOnglet(),
      )
    ) {
      this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
        new ObjetElement_1.ObjetElement(
          "",
          0,
          this.etatUtilisateurSco.getGenreOnglet(),
        ),
      );
    }
  }
  getLibelleSousOnglet(
    aLibelle,
    aAvecNom,
    aAvecClasse,
    aAvecGroupe,
    aSansLibelleOnglet,
  ) {
    return this.getInstance(this.IdentBandeauEntete).getLibelleSousOnglet(
      aLibelle,
      aAvecNom,
      aAvecClasse,
      aAvecGroupe,
      aSansLibelleOnglet,
    );
  }
  surEvenementFenetreImpression() {}
  _creerTransformateurFlux() {
    if (
      !UtilTransformationFlux ||
      !this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.fonctionnalites
          .avecTransformationFluxFichier,
      )
    ) {
      return;
    }
    const lTransformationFlux = new UtilTransformationFlux.TransformationFlux({
      pere: this,
      getActif: () => {
        return this.applicationSco.parametresUtilisateur.get(
          "avecTransformateurFlux",
        );
      },
      setActif: (aActif) => {
        this.applicationSco.parametresUtilisateur.set(
          "avecTransformateurFlux",
          aActif,
        );
      },
      traiterFichiersClouds: async (aListeFichiers, aResultFenetreTransfo) => {
        const lResult = await new Promise((aResolve) => {
          let lElementSelec = null;
          UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
            {
              modeGestion:
                UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF
                  .modeGestion.Cloud,
              callbaskEvenement: (aLigne) => {
                if (aLigne >= 0) {
                  const lService =
                    this.etatUtilisateurSco.listeCloud.get(aLigne);
                  if (lService) {
                    ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
                      ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
                      {
                        pere: this,
                        evenement(aParam) {
                          if (
                            aParam.listeNouveauxDocs &&
                            aParam.listeNouveauxDocs.count() > 0
                          ) {
                            lElementSelec = aParam.listeNouveauxDocs.get(0);
                          }
                        },
                        initialiser(aFenetre) {
                          aFenetre.setOptionsFenetre({
                            modale: true,
                            modeSelectionRepertoirePourUpload: true,
                            estMonoSelection: true,
                            callbackApresFermer() {
                              aResolve({
                                dossierSelec: lElementSelec,
                                service: lService.Genre,
                              });
                            },
                          });
                        },
                      },
                    ).setDonnees({ service: lService.Genre });
                  }
                }
              },
            },
          );
        });
        if (lResult && lResult.dossierSelec) {
          try {
            await UtilitaireRequetesCloud_1.UtilitaireRequetesCloud.requeteUploadVersCloudListFichiers(
              {
                idPartageDossier: lResult.dossierSelec.idPartage,
                service: lResult.service,
                listeFichiersATraiter:
                  aResultFenetreTransfo.listeFichiersUploadCloud,
                listeFichiersResultat: aListeFichiers,
              },
            );
          } catch (e) {}
        }
      },
    });
    this.applicationSco.setObject("transformationFlux", lTransformationFlux);
  }
  _genererPdf(aService) {
    let lRessource = this.etatUtilisateurSco.Identification.ressource;
    let lRessources = new ObjetListeElements_1.ObjetListeElements().addElement(
      lRessource,
    );
    let lService = !!aService ? aService.getGenre() : null;
    lRessources.setSerialisateurJSON({ ignorerEtatsElements: true });
    let lEtat = this.etatUtilisateurSco.impressionCourante.callback();
    this.construireInstancesPDFEtImpression();
    this.getInstance(this.identFenetreGenerationPdf).creerInstanceFenetrePDF(
      lEtat,
      this.getNom() + "_zonepdf",
    );
    let lOptions = !!lEtat
      ? this.etatUtilisateurSco.parametresGenerationPDF[
          lEtat.genreGenerationPDF
        ]
      : OptionsPDFSco_1.OptionsPDFSco.defaut;
    UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
      paramPDF: lEtat,
      optionsPDF: lOptions,
      cloudCible: lService,
    });
  }
  async _evenementSurClickOnglet(aGenreOnglet, aIgnorerHistorique) {
    UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
    if (aGenreOnglet === null || aGenreOnglet === undefined) {
      return;
    }
    const lOngletPrec = this.etatUtilisateurSco.getGenreOnglet();
    this.etatUtilisateurSco.setGenreOnglet(aGenreOnglet);
    Invocateur_1.Invocateur.evenement("surNavigationOnglet", aGenreOnglet);
    const lIFCBandeau = this.getInstance(this.IdentBandeauEntete);
    if (lIFCBandeau) {
      lIFCBandeau.actualiserLibelleOnglet();
      Invocateur_1.Invocateur.evenement("fermerAutresMenuOnglet");
    }
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.fermerFenetres,
    );
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      Enumere_GenreImpression_1.EGenreImpression.Aucune,
    );
    if (
      this.etatUtilisateurSco.pourPrimaire() &&
      ![
        Enumere_Espace_1.EGenreEspace.PrimProfesseur,
        Enumere_Espace_1.EGenreEspace.PrimDirection,
      ].includes(this.etatUtilisateurSco.GenreEspace) &&
      aGenreOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil
    ) {
      $(".interface_affV").addClass(
        ThemesPrimaire_1.GThemesPrimaire.getTheme(),
      );
    } else {
      $(".interface_affV").removeClass(
        ThemesPrimaire_1.GThemesPrimaire.getTheme(),
      );
    }
    if (this.parametresSco.getNomEspace() === "Espace Inscriptions") {
      $(".interface_affV").addClass("e-inscriptions");
    } else {
      $(".interface_affV").removeClass("e-inscriptions");
    }
    if (aGenreOnglet !== Enumere_Onglet_1.EGenreOnglet.Accueil) {
      $(".interface_affV_client, .interface_affV").addClass("over-scroll");
    } else {
      $(".interface_affV_client, .interface_affV").removeClass("over-scroll");
    }
    if (this.Instances[this.IdentPage] && this.Instances[this.IdentPage].free) {
      this.Instances[this.IdentPage].free();
    }
    this.Instances[this.IdentPage] = null;
    if (
      !aIgnorerHistorique &&
      aGenreOnglet !== null &&
      aGenreOnglet !== undefined &&
      ObjetSupport_1.Support.supportEventOnPopState
    ) {
      try {
        window.history.pushState(
          {
            onglet: aGenreOnglet,
            numeroSession:
              this.applicationSco.getCommunication().NumeroDeSession,
          },
          "",
        );
      } catch (e) {}
    }
    this.surResizeInterface();
    await new ObjetRequeteNavigation_1.ObjetRequeteNavigation(
      this,
    ).lancerRequete(aGenreOnglet, lOngletPrec);
    GApplication.parametresUtilisateur.set("onglet", aGenreOnglet, true);
    this._actionSurEvenementSurClickOnglet();
  }
  _actionSurEvenementSurClickOnglet() {
    Invocateur_1.Invocateur.evenement("apresRequeteNavigation");
    const lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
    if (IE.log.getActif()) {
      IE.log.addLog(
        `Interface Construire Onglet n° ${lGenreOnglet} - ${MethodesObjet_1.MethodesObjet.nomProprieteDeValeur(Enumere_Onglet_1.EGenreOnglet, lGenreOnglet)}`,
        "OBJETINTERFACE_LOGNOM",
      );
    }
    try {
      this.Instances[this.IdentPage] =
        DeclarationOngletsEspace_1.DeclarationOngletsEspace.creerOnglet(
          lGenreOnglet,
          { nomComplet: this.getZoneId(this.IdentPage), pere: this },
        );
      if (this.Instances[this.IdentPage]) {
        ObjetHtml_1.GHtml.setHtml(this.Instances[this.IdentPage].getNom(), "");
      } else {
      }
    } catch (e) {}
    this.setEtatSaisie(false);
    this.etatUtilisateurSco.setPageCourante(this.Instances[this.IdentPage]);
    if (this.Instances[this.IdentPage]) {
      Invocateur_1.Invocateur.evenement("maj_boutonImpression");
    }
    const lOnglet =
      this.etatUtilisateurSco.listeOnglets &&
      this.etatUtilisateurSco.genreOnglet
        ? this.etatUtilisateurSco.listeOnglets.getElementParGenre(
            this.etatUtilisateurSco.genreOnglet,
          )
        : null;
    const lLibelleOnglet = lOnglet
      ? ObjetChaine_1.GChaine.toTitle(
          lOnglet.libelleLong || lOnglet.getLibelle(),
        ) + " - "
      : "";
    const lLibelleProduit =
      (this.parametresSco.nomProduit
        ? this.parametresSco.nomProduit
        : this.applicationSco.nomProduit) +
      (this.parametresSco.versionPN ? " " + this.parametresSco.versionPN : "");
    document.title = `${lLibelleOnglet}${this.parametresSco.NomEspace} - ${lLibelleProduit} - ${this.parametresSco.NomEtablissementConnexion}`;
    this.surResizeInterface();
    if (this.Instances[this.IdentPage]) {
      this.Instances[this.IdentPage].initialiser();
    }
    if (this.getInstance(this.IdentBandeauEntete)) {
      this.getInstance(this.IdentBandeauEntete).actualiserBreadcrumb(
        this.etatUtilisateurSco.getGenreOnglet(),
      );
      const lInstanceMenuOnglet = this.getInstance(
        this.IdentBandeauEntete,
      ).getInstanceMenuOnglet();
      if (lInstanceMenuOnglet) {
        lInstanceMenuOnglet.setOngletPN(
          this.etatUtilisateurSco.getGenreOnglet(),
        );
      }
      const lInstanceOngletAccueil = this.getInstance(
        this.IdentBandeauEntete,
      ).getInstanceMenuAccueil();
      if (lInstanceOngletAccueil) {
        lInstanceOngletAccueil.setOngletPN(
          this.etatUtilisateurSco.getGenreOnglet(),
        );
      }
      this.setFocusPremierObjet();
    }
    this.etatUtilisateurSco.resetPage();
  }
  _surValider() {
    const lInstance = this.getInstance(this.IdentPage);
    if (this.applicationSco.getDemo()) {
      alert(ObjetTraduction_1.GTraductions.getValeur("Demo.Message"));
    }
    if (lInstance.valider) {
      lInstance.valider();
    }
  }
}
exports.ObjetInterfaceEspace = ObjetInterfaceEspace;

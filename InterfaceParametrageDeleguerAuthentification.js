exports.InterfaceParametrageDeleguerAuthentification = void 0;
const AppelSOAP_1 = require("AppelSOAP");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetComposeHtml_1 = require("ObjetComposeHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Onglet_Console_NET_1 = require("Enumere_Onglet_Console_NET");
const WSGestionDelegationsAuthentification_1 = require("WSGestionDelegationsAuthentification");
const WSGestionDelegationsAuthentification_2 = require("WSGestionDelegationsAuthentification");
const WSGestionDelegationsAuthentification_3 = require("WSGestionDelegationsAuthentification");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const DonneesListe_ListeDelegationAuthentification_1 = require("DonneesListe_ListeDelegationAuthentification");
const GUID_1 = require("GUID");
class InterfaceParametrageDeleguerAuthentification extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.objetApplicationConsoles = GApplication;
    this.donneesRecues = false;
    this.setOptions({ avecPaddingPage: true });
    this.optionsAuthentification = { estServeurHttp: false };
  }
  getEspacesDeTypeDelegation(aTypeDelegation) {
    if (this.tabEspaces) {
      let lDa_Auth;
      for (const i in this.tabEspaces) {
        lDa_Auth = this.tabEspaces[i];
        if (!!lDa_Auth && lDa_Auth.delegation === aTypeDelegation) {
          return lDa_Auth.espaces || [];
        }
      }
    }
    return [];
  }
  getModesLoginDeTypeDelegation(aTypeDelegation) {
    if (this.tabModesDeLogin) {
      let lDa_Auth;
      for (const i in this.tabModesDeLogin) {
        lDa_Auth = this.tabModesDeLogin[i];
        if (!!lDa_Auth && lDa_Auth.delegation === aTypeDelegation) {
          return lDa_Auth.modesDeLogin || [];
        }
      }
    }
    return [];
  }
  getModeLoginConcerneParIdentifiantEspace(aIdentifiantEspace) {
    for (const lStrModeLogin of MethodesObjet_1.MethodesObjet.enumKeys(
      WSGestionDelegationsAuthentification_1.ETypeModeDeLoginSvcW,
    )) {
      if (lStrModeLogin === aIdentifiantEspace) {
        return WSGestionDelegationsAuthentification_1.ETypeModeDeLoginSvcW[
          lStrModeLogin
        ];
      }
    }
    return null;
  }
  estConnecterAuServeur() {
    return false;
  }
  estServeurActif() {
    return true;
  }
  recupererDonneesPage() {
    this.soapGetModesDeLogin()
      .then(() => {
        return this.soapGetAffectationsEspaces();
      })
      .then(() => {
        return this.soapGetListeParametresDelegation();
      })
      .then(() => {
        this.donneesRecues = true;
        this.donneesPourListe = this.getDonneesPourListe();
        this.initialiser(true);
        this.getInstance(this.identListeChoixDelegation).setDonnees(
          new DonneesListe_ChoixDelegationAuthentification(
            this.donneesPourListe,
            {
              CASactif: this.getActifModeDelegation(
                WSGestionDelegationsAuthentification_1
                  .ETypeDelegationAuthentificationSvcW.DA_Cas,
              ),
              WsFedactif: this.getActifModeDelegation(
                WSGestionDelegationsAuthentification_1
                  .ETypeDelegationAuthentificationSvcW.DA_WsFed,
              ),
              EduConnectactif: this.getActifModeDelegation(
                WSGestionDelegationsAuthentification_1
                  .ETypeDelegationAuthentificationSvcW.DA_EduConnect,
              ),
              Samlactif: this.getActifModeDelegation(
                WSGestionDelegationsAuthentification_1
                  .ETypeDelegationAuthentificationSvcW.DA_Saml,
              ),
              serveurActif: this.estServeurActif.bind(this),
            },
          ),
        );
        this.actualiserListeDelegation();
      });
  }
  getDescriptionDelegations(aMode) {
    for (let i = 0; i < this.listeParametresDelegation.length; i++) {
      const lDelegation = this.listeParametresDelegation[i];
      if (lDelegation.protocole === aMode) {
        return lDelegation;
      }
    }
  }
  getEspacesAutorises(aMode) {
    let lResult = [];
    const lDescriptionDelegation = this.getDescriptionDelegations(aMode);
    if (!!lDescriptionDelegation) {
      lResult = lDescriptionDelegation.espacesAutorises;
    }
    return lResult;
  }
  construireInstances() {
    this.identListeDelegation = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListeDelegation,
      this.initialiserListeDelegation,
    );
    this.identListeChoixDelegation = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListeChoixDelegation,
      this.initialiserListeChoixDelegation,
    );
  }
  construireStructureAffichage() {
    const H = [];
    const llabelExplicatif = this.estServeurActif()
      ? ObjetTraduction_1.GTraductions.getValeur(
          "pageParametrageCAS.labelArreterPublicationPourModifierParametres",
        )
      : "";
    if (this.donneesRecues) {
      H.push(
        '<div style="display: flex; flex-direction:column; height: 100%;" class="BorderBox',
        this.options.avecPaddingPage ? " Espace" : "",
        '">',
        llabelExplicatif
          ? '<div class="Gras EspaceBas AlignementMilieu" style="flex:none;">' +
              llabelExplicatif +
              "</div>"
          : "",
        '<div style="flex:none;">',
        ObjetComposeHtml_1.ObjetComposeHtml.bandeauConsole(
          this.getTitreBandeau(),
        ),
        "</div>",
        '<div style="display: flex; flex-direction:column; flex:1 1 100%; height:0; overflow: auto;">',
        "<div>",
        this.composeGestionDelegations(),
        "</div>",
        "<div>",
        this.composeChoixDelegationEspaces(),
        "</div>",
        "</div>",
        "</div>",
      );
    }
    return H.join("");
  }
  tousEspacesSontDeTypeDA(aTypeDA) {
    for (let i = 0; i < this.donneesPourListe.count(); i++) {
      const lEspace = this.donneesPourListe.get(i);
      if (lEspace.typeDA !== aTypeDA && !lEspace.estEspaceIndependant) {
        return false;
      }
    }
    return true;
  }
  setTypeDATousEspaces(aTypeDA) {
    for (let i = 0; i < this.donneesPourListe.count(); i++) {
      const lEspace = this.donneesPourListe.get(i);
      if (!lEspace.estEspaceIndependant) {
        lEspace.typeDA = aTypeDA;
      }
    }
    if (!this.estServeurActif()) {
      this.getInstance(this.identListeChoixDelegation).actualiser();
      if (this.optionsAuthentification.estServeurHttp) {
        this.sauvegarderDelegationAffectationEspaces();
      } else {
        this.sauvegarderDelegationAffectationModesLogin();
      }
    }
  }
  getTitreBandeau() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "pageConsoleAdministration.onglets",
    )[Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent];
  }
  composeGestionDelegations() {
    const H = [];
    H.push(
      '<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
      GCouleur.intermediaire,
      ';">',
    );
    H.push('<legend class="Gras Espace" style="color:', GCouleur.texte, ';">');
    H.push(
      "<label>",
      ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.gestionDelegation",
      ),
      "</label>",
    );
    H.push("</legend>");
    const lTradExplication = ObjetTraduction_1.GTraductions.getValeur(
      "pageParametresDeleguerLAuthentification.ExplicationsDelegation",
    );
    H.push(
      '<div style="padding: 0 1rem;">',
      lTradExplication ? lTradExplication + "<br>" : "",
      ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.ExplicationActivationDelegation",
      ),
    );
    H.push(
      '<div style="padding: 0.8rem 0;" id="',
      this.getInstance(this.identListeDelegation).getNom(),
      '"></div>',
    );
    H.push("</div>");
    H.push("</fieldset>");
    return H.join("");
  }
  composeChoixDelegationEspaces() {
    const H = [];
    H.push(
      '<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
      GCouleur.intermediaire,
      ';">',
    );
    H.push('<legend class="Gras Espace" style="color:', GCouleur.texte, ';">');
    H.push(
      "<label>",
      ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.choixDelegationEspaces",
      ),
      "</label>",
    );
    H.push("</legend>");
    H.push(
      '<div style="padding: 0.8rem 1rem;">',
      '<div id="' +
        this.getInstance(this.identListeChoixDelegation).getNom() +
        '"></div>',
      "</div>",
    );
    H.push("</fieldset>");
    return H.join("");
  }
  sauvegarderDelegationAffectationEspaces() {
    const lDA_AuthCAS =
      new WSGestionDelegationsAuthentification_2.TAffectationEspace(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Cas,
        [],
      );
    const lDA_AuthWsFed =
      new WSGestionDelegationsAuthentification_2.TAffectationEspace(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_WsFed,
        [],
      );
    const lDA_AuthSaml =
      new WSGestionDelegationsAuthentification_2.TAffectationEspace(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Saml,
        [],
      );
    let lDA_AuthEduConnect;
    if (!!this.objetApplicationConsoles.avecEduConnect) {
      lDA_AuthEduConnect =
        new WSGestionDelegationsAuthentification_2.TAffectationEspace(
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_EduConnect,
          [],
        );
    }
    for (let i = 0; i < this.donneesPourListe.count(); i++) {
      const lEspace = this.donneesPourListe.get(i);
      let lGenreEspaceUntyped = lEspace.getGenre();
      let lGenreEspace;
      if (typeof lGenreEspaceUntyped === "number") {
        lGenreEspace = lGenreEspaceUntyped;
      } else {
        lGenreEspace = parseInt(lGenreEspaceUntyped);
      }
      if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Cas
      ) {
        lDA_AuthCAS.espaces.push(lGenreEspace);
      } else if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_WsFed
      ) {
        lDA_AuthWsFed.espaces.push(lGenreEspace);
      } else if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Saml
      ) {
        lDA_AuthSaml.espaces.push(lGenreEspace);
      } else if (
        lEspace.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_EduConnect &&
        !!lDA_AuthEduConnect
      ) {
        lDA_AuthEduConnect.espaces.push(lGenreEspace);
      }
    }
    const lArrTAffectationEspace = [lDA_AuthCAS, lDA_AuthWsFed, lDA_AuthSaml];
    if (!!lDA_AuthEduConnect) {
      lArrTAffectationEspace.push(lDA_AuthEduConnect);
    }
    AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionDelegationsAuthentification",
      methode: "SetEspaces",
      serialisation: (aTabParametres) => {
        aTabParametres.getElement("AEspaces").setValeur(lArrTAffectationEspace);
      },
    });
  }
  sauvegarderDelegationAffectationModesLogin() {
    const lDA_AuthCAS =
      new WSGestionDelegationsAuthentification_3.TAffectationModeDeLogin(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Cas,
        [],
      );
    const lDA_AuthWsFed =
      new WSGestionDelegationsAuthentification_3.TAffectationModeDeLogin(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_WsFed,
        [],
      );
    const lDA_AuthSaml =
      new WSGestionDelegationsAuthentification_3.TAffectationModeDeLogin(
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Saml,
        [],
      );
    for (let i = 0; i < this.donneesPourListe.count(); i++) {
      const lEspace = this.donneesPourListe.get(i);
      if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Cas
      ) {
        lDA_AuthCAS.modesDeLogin.push(
          this.getModeLoginConcerneParIdentifiantEspace(lEspace.identifiant),
        );
      } else if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_WsFed
      ) {
        lDA_AuthWsFed.modesDeLogin.push(
          this.getModeLoginConcerneParIdentifiantEspace(lEspace.identifiant),
        );
      } else if (
        lEspace.typeDA ===
        WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Saml
      ) {
        lDA_AuthSaml.modesDeLogin.push(
          this.getModeLoginConcerneParIdentifiantEspace(lEspace.identifiant),
        );
      }
    }
    const lArrTAffectation = [lDA_AuthCAS, lDA_AuthWsFed, lDA_AuthSaml];
    AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionDelegationsAuthentification",
      methode: "SetModesDeLogin",
      serialisation: (aTabParametres) => {
        aTabParametres.getElement("AModesDeLogin").setValeur(lArrTAffectation);
      },
    });
  }
  callbackSurSaisie() {
    this.recupererDonneesPage();
  }
  soapGetModesDeLogin() {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionDelegationsAuthentification",
      methode: "GetModesDeLogin",
    }).then((aDonnees) => {
      this.tabModesDeLogin = aDonnees.getElement("return").valeur;
    });
  }
  soapGetAffectationsEspaces() {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionDelegationsAuthentification",
      methode: "GetEspaces",
    }).then((aDonnees) => {
      this.tabEspaces = aDonnees.getElement("return").valeur;
    });
  }
  soapGetParametresCAS(aIdParametres) {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionCAS",
      methode: "GetParametresCAS",
      serialisation: (aTabParametres) => {
        aTabParametres.getElement("AIdParametres").setValeur(aIdParametres);
      },
    }).then((aDonnees) => {
      return aDonnees.getElement("return").valeur;
    });
  }
  soapGetParametresWsFed(aIdParametres) {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionWsFed",
      methode: "GetParametresWsFed",
      serialisation: (aTabParametres) => {
        aTabParametres.getElement("AIdParametres").setValeur(aIdParametres);
      },
    }).then((aDonnees) => {
      return aDonnees.getElement("return").valeur;
    });
  }
  soapGetParametresEduConnect() {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionEduConnect",
      methode: "GetUrlDeServiceDeclaree",
    }).then((aDonnees) => {
      return aDonnees.getElement("return").valeur;
    });
  }
  soapGetParametresSaml(aIdParametres) {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionSaml",
      methode: "GetParametresSaml",
      serialisation: (aTabParametres) => {
        aTabParametres.getElement("AIdParametres").setValeur(aIdParametres);
      },
    }).then((aDonnees) => {
      return aDonnees.getElement("return").valeur;
    });
  }
  soapGetListeParametresDelegation() {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionDelegationsAuthentification",
      methode: "GetInfosListeParametresDelegation",
    }).then((aDonnees) => {
      this.listeParametresDelegation = aDonnees.getElement("return").valeur;
    });
  }
  initialiserListeChoixDelegation(aInstance) {
    const lAvecEduConnect = !!this.objetApplicationConsoles.avecEduConnect;
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ChoixDelegationAuthentification.colonnes.espace,
      taille: 250,
      titre: {
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "pageParametresDeleguerLAuthentification.liste.espaces",
        ),
      },
    });
    lColonnes.push({
      id: DonneesListe_ChoixDelegationAuthentification.colonnes.cas,
      taille: 90,
      titre: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.delegation",
          ),
          avecFusionColonne: true,
        },
        {
          libelleHtml:
            '<ie-checkbox ie-model="setTousEspacesCAS">' +
            ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.liste.CAS",
            ) +
            "</ie-checkbox> ",
          controleur: {
            setTousEspacesCAS: {
              getValue() {
                let lInterface;
                if (
                  this.instance &&
                  "Pere" in this.instance &&
                  this.instance.Pere &&
                  this.instance.Pere instanceof
                    InterfaceParametrageDeleguerAuthentification
                ) {
                  lInterface = this.instance.Pere;
                }
                return lInterface
                  ? lInterface.tousEspacesSontDeTypeDA(
                      WSGestionDelegationsAuthentification_1
                        .ETypeDelegationAuthentificationSvcW.DA_Cas,
                    )
                  : false;
              },
              setValue(aValue) {
                if (aValue) {
                  if (
                    this.instance &&
                    "Pere" in this.instance &&
                    this.instance.Pere
                  ) {
                    let lInterface = this.instance.Pere;
                    lInterface.setTypeDATousEspaces(
                      WSGestionDelegationsAuthentification_1
                        .ETypeDelegationAuthentificationSvcW.DA_Cas,
                    );
                  }
                }
              },
              getDisabled() {
                let lDisabled = false;
                if (this.instance) {
                  let lInterface;
                  if ("Pere" in this.instance && this.instance.Pere) {
                    lInterface = this.instance.Pere;
                  }
                  if (!lInterface || lInterface.estServeurActif()) {
                    lDisabled = true;
                  }
                  if (!lDisabled) {
                    let lDonneesListe;
                    if ("Donnees" in this.instance && this.instance.Donnees) {
                      lDonneesListe = this.instance.Donnees;
                    }
                    lDisabled = !lDonneesListe || !lDonneesListe.estCasActif();
                  }
                  if (!lDisabled) {
                    lDisabled = lInterface.tousEspacesSontDeTypeDA(
                      WSGestionDelegationsAuthentification_1
                        .ETypeDelegationAuthentificationSvcW.DA_Cas,
                    );
                  }
                }
                return lDisabled;
              },
            },
          },
        },
      ],
    });
    lColonnes.push({
      id: DonneesListe_ChoixDelegationAuthentification.colonnes.wsFed,
      taille: 90,
      titre: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.delegation",
          ),
          avecFusionColonne: true,
        },
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.WsFed",
          ),
        },
      ],
    });
    lColonnes.push({
      id: DonneesListe_ChoixDelegationAuthentification.colonnes.saml,
      taille: 90,
      titre: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.delegation",
          ),
          avecFusionColonne: true,
        },
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.SAML",
          ),
        },
      ],
    });
    if (lAvecEduConnect) {
      lColonnes.push({
        id: DonneesListe_ChoixDelegationAuthentification.colonnes.educonnect,
        taille: 90,
        titre: [
          {
            libelle: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.liste.delegation",
            ),
            avecFusionColonne: true,
          },
          {
            libelle: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.liste.EduConnect",
            ),
          },
        ],
      });
    }
    lColonnes.push({
      id: DonneesListe_ChoixDelegationAuthentification.colonnes.aucune,
      taille: 90,
      titre: [
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.delegation",
          ),
          avecFusionColonne: true,
        },
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur(
            "pageParametresDeleguerLAuthentification.liste.Aucune",
          ),
        },
      ],
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      colonnesCachees: [],
      hauteurAdapteContenu: true,
      listeCreations: 0,
      avecLigneCreation: false,
      piedDeListe: null,
    });
  }
  evenementSurListeChoixDelegation(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
        if (!this.estServeurActif()) {
          if (this.optionsAuthentification.estServeurHttp) {
            this.sauvegarderDelegationAffectationEspaces();
          } else {
            this.sauvegarderDelegationAffectationModesLogin();
          }
        }
        break;
    }
  }
  getActifModeDelegation(aMode) {
    const lResult = false;
    const lDescriptionDelegation = this.getDescriptionDelegations(aMode);
    if (!!lDescriptionDelegation) {
      for (let i = 0; i < lDescriptionDelegation.parametres.length; i++) {
        const lParametres = lDescriptionDelegation.parametres[i];
        if (!!lParametres && lParametres.Actif) {
          return true;
        }
      }
    }
    return lResult;
  }
  actualiserListeDelegation() {
    const lDonneesListeDelegationAuth =
      new DonneesListe_ListeDelegationAuthentification_1.DonneesListe_ListeDelegationAuthentification(
        this.listeParametresDelegation,
        {
          avecEduConnect: !!this.objetApplicationConsoles.avecEduConnect,
          estServeurActif: this.estServeurActif(),
          callbackCreation: (aDelegation) => {
            this.creationDelegation(aDelegation);
          },
          callbackModification: (aArticle) => {
            const lCopieInfosDelegation =
              MethodesObjet_1.MethodesObjet.dupliquer(aArticle.val);
            switch (aArticle.protocole) {
              case WSGestionDelegationsAuthentification_1
                .ETypeDelegationAuthentificationSvcW.DA_Cas:
                this.soapGetParametresCAS(
                  lCopieInfosDelegation.idParametres,
                ).then((aParametresCAS) => {
                  this.ouvrirFenetreParametrageCAS(
                    aParametresCAS,
                    lCopieInfosDelegation,
                  );
                });
                break;
              case WSGestionDelegationsAuthentification_1
                .ETypeDelegationAuthentificationSvcW.DA_WsFed:
                this.soapGetParametresWsFed(
                  lCopieInfosDelegation.idParametres,
                ).then((aParametresWsFed) => {
                  this.ouvrirFenetreParametrageWsFed(
                    aParametresWsFed,
                    lCopieInfosDelegation,
                  );
                });
                break;
              case WSGestionDelegationsAuthentification_1
                .ETypeDelegationAuthentificationSvcW.DA_Saml:
                this.soapGetParametresSaml(
                  lCopieInfosDelegation.idParametres,
                ).then((aParametresSaml) => {
                  this.ouvrirFenetreParametrageSaml(
                    aParametresSaml,
                    lCopieInfosDelegation,
                  );
                });
                break;
              case WSGestionDelegationsAuthentification_1
                .ETypeDelegationAuthentificationSvcW.DA_EduConnect:
                this.soapGetParametresEduConnect().then(
                  (aParametresEduConnect) => {
                    this.ouvrirFenetreParametrageEduConnect(
                      aParametresEduConnect,
                      lCopieInfosDelegation,
                    );
                  },
                );
                break;
              default:
            }
          },
        },
      );
    this.getInstance(this.identListeDelegation).setDonnees(
      lDonneesListeDelegationAuth,
    );
  }
  creationDelegation(aDelegation) {
    if (this.estServeurActif()) {
      return GApplication.getMessage().afficher({
        message: ObjetTraduction_1.GTraductions.getValeur(
          "pageParametresDeleguerLAuthentification.OperationImpossibleServeurActif",
        ),
      });
    }
    return Promise.resolve().then(() => {
      const lInfosDelegation = {
        nom: "",
        idParametres: GUID_1.GUID.getGUIDDelphiVide(),
      };
      switch (aDelegation) {
        case WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Cas:
          return AppelSOAP_1.AppelSOAP.lancerAppel({
            instance: this,
            port: "PortGestionCAS",
            methode: "InitialiserParametresCASPourCreation",
          }).then((aDonnees) => {
            const lParametresCAS = aDonnees.getElement("return").valeur;
            return this.ouvrirFenetreParametrageCAS(
              lParametresCAS,
              lInfosDelegation,
              true,
            );
          });
        case WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_WsFed:
          return AppelSOAP_1.AppelSOAP.lancerAppel({
            instance: this,
            port: "PortGestionWsFed",
            methode: "InitialiserParametresWsFedPourCreation",
          }).then((aDonnees) => {
            const lParametresWsFed = aDonnees.getElement("return").valeur;
            return this.ouvrirFenetreParametrageWsFed(
              lParametresWsFed,
              lInfosDelegation,
              true,
            );
          });
        case WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_Saml:
          return AppelSOAP_1.AppelSOAP.lancerAppel({
            instance: this,
            port: "PortGestionSaml",
            methode: "InitialiserParametresSamlPourCreation",
          }).then((aDonnees) => {
            const lParametresSaml = aDonnees.getElement("return").valeur;
            return this.ouvrirFenetreParametrageSaml(
              lParametresSaml,
              lInfosDelegation,
              true,
            );
          });
        case WSGestionDelegationsAuthentification_1
          .ETypeDelegationAuthentificationSvcW.DA_EduConnect:
          this.ouvrirFenetreParametrageEduConnect(
            false,
            lInfosDelegation,
            true,
          );
          break;
        default:
          return Promise.reject();
      }
    });
  }
  initialiserListeDelegation(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ListeDelegationAuthentification_1
        .DonneesListe_ListeDelegationAuthentification.colonnes.actif,
      taille: 40,
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.Actif",
      ),
    });
    lColonnes.push({
      id: DonneesListe_ListeDelegationAuthentification_1
        .DonneesListe_ListeDelegationAuthentification.colonnes.nom,
      taille: 400,
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.NomParametres",
      ),
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer }],
    });
  }
  evenementSurListeDelegation(aParametres) {
    const LInfosDeleg = aParametres.article.val;
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
        if (this.estServeurActif()) {
          return GApplication.getMessage().afficher({
            message: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.OperationImpossibleServeurActif",
            ),
          });
        }
        return AppelSOAP_1.AppelSOAP.lancerAppel({
          instance: this,
          port: "PortGestionDelegationsAuthentification",
          methode: "SupprimerParametres",
          serialisation: (aTabParametres) => {
            aTabParametres
              .getElement("AProtocole")
              .setValeur(aParametres.article.protocole);
            aTabParametres
              .getElement("AIdParametres")
              .setValeur(LInfosDeleg.getIdParametres());
          },
        }).then(() => {
          this.callbackSurSaisie();
        });
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
        switch (aParametres.idColonne) {
          case DonneesListe_ListeDelegationAuthentification_1
            .DonneesListe_ListeDelegationAuthentification.colonnes.actif:
            return AppelSOAP_1.AppelSOAP.lancerAppel({
              instance: this,
              port: "PortGestionDelegationsAuthentification",
              methode: "AffecterActif",
              serialisation: (aTabParametres) => {
                aTabParametres
                  .getElement("AProtocole")
                  .setValeur(aParametres.article.protocole);
                aTabParametres
                  .getElement("AIdParametres")
                  .setValeur(LInfosDeleg.getIdParametres());
                aTabParametres
                  .getElement("AActif")
                  .setValeur(LInfosDeleg.getActif());
              },
            }).then(() => {
              if (
                aParametres.article.protocole ===
                  WSGestionDelegationsAuthentification_1
                    .ETypeDelegationAuthentificationSvcW.DA_Cas &&
                !LInfosDeleg.getActif() &&
                this.tousEspacesSontDeTypeDA(
                  WSGestionDelegationsAuthentification_1
                    .ETypeDelegationAuthentificationSvcW.DA_Aucune,
                )
              ) {
                this.setTypeDATousEspaces(
                  WSGestionDelegationsAuthentification_1
                    .ETypeDelegationAuthentificationSvcW.DA_Cas,
                );
              }
              this.callbackSurSaisie();
            });
        }
        break;
    }
  }
  ouvrirFenetreParametrageCAS(
    aParametresCAS,
    aInfosDelegation,
    aSurCreation = false,
  ) {
    const lInstanceCAS = this.getInstance(this.identZoneCAS);
    if (!lInstanceCAS) {
      return;
    }
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_1.ObjetFenetre,
      {
        pere: this,
        evenement: (aNumeroBouton, aParams) => {
          if (aParams.bouton.valider) {
            AppelSOAP_1.AppelSOAP.lancerAppel({
              instance: this,
              port: "PortGestionCAS",
              methode: aSurCreation ? "CreerParametresCAS" : "SetParametresCAS",
              serialisation: (aTabParametres) => {
                aTabParametres
                  .getElement("ANom")
                  .setValeur(aInfosDelegation.nom);
                aTabParametres
                  .getElement("AParametresCAS")
                  .setValeur(aParametresCAS);
                if (!aSurCreation) {
                  aTabParametres
                    .getElement("AIdParametres")
                    .setValeur(aInfosDelegation.idParametres);
                }
              },
            }).then(() => {
              this.callbackSurSaisie();
            });
          }
        },
        initialiser(aInstanceFenetre) {
          aInstanceFenetre.setOptionsFenetre({
            titre: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.activerCAS",
            ),
            largeur: 1000,
            hauteur: 420,
            listeBoutons: [
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageCAS.annuler",
                ),
              },
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageCAS.valider",
                ),
                valider: true,
              },
            ],
          });
        },
      },
    );
    lFenetre.setBoutonActif(1, !this.estServeurActif());
    lFenetre.afficher(
      '<div style="width:100%; height: 100%" id="' +
        lInstanceCAS.getNom() +
        '"></div>',
    );
    lInstanceCAS.init(aParametresCAS, aInfosDelegation);
  }
  ouvrirFenetreParametrageEduConnect(
    aParametresEduConnect,
    aInfosDelegation,
    aSurCreation = false,
  ) {
    const lInstanceEduConnect = this.getInstance(this.identZoneEduConnect);
    if (!lInstanceEduConnect) {
      return;
    }
    lInstanceEduConnect.init(aParametresEduConnect, aInfosDelegation);
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_1.ObjetFenetre,
      {
        pere: this,
        evenement: (aNumeroBouton, aParams) => {
          if (aParams.bouton.valider && aSurCreation) {
            if (
              lInstanceEduConnect &&
              !lInstanceEduConnect.aUneDemandeEnCours()
            ) {
              AppelSOAP_1.AppelSOAP.lancerAppel({
                instance: this,
                port: "PortGestionEduConnect",
                methode: "CreerParametresEduConnect",
              }).then(() => {
                this.callbackSurSaisie();
              });
            } else {
              this.callbackSurSaisie();
            }
          }
        },
        initialiser(aInstanceFenetre) {
          aInstanceFenetre.setOptionsFenetre({
            titre: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.activerDelegation",
              [
                ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametresDeleguerLAuthentification.liste.EduConnect",
                ),
              ],
            ),
            largeur: 630,
            hauteur: 275,
            listeBoutons: [
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageCAS.valider",
                ),
                valider: true,
              },
            ],
          });
        },
      },
    );
    lInstanceEduConnect.setFenetre(lFenetre);
    lFenetre.setBoutonActif(0, !this.estServeurActif());
    lFenetre.afficher(
      '<div style="width:100%; height: 100%" id="' +
        lInstanceEduConnect.getNom() +
        '"></div>',
    );
    lInstanceEduConnect.initialiser();
  }
  ouvrirFenetreParametrageWsFed(
    aParametresWsFed,
    aInfosDelegation,
    aSurCreation = false,
  ) {
    const lInstanceWsFed = this.getInstance(this.identZoneWsFed);
    if (!lInstanceWsFed) {
      return;
    }
    lInstanceWsFed.init(aParametresWsFed, aInfosDelegation);
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_1.ObjetFenetre,
      {
        pere: this,
        evenement: (aNumeroBouton, aParams) => {
          if (aParams.bouton.valider) {
            AppelSOAP_1.AppelSOAP.lancerAppel({
              instance: this,
              port: "PortGestionWsFed",
              methode: aSurCreation
                ? "CreerParametresWsFed"
                : "SetParametresWsFed",
              serialisation: (aTabParametres) => {
                aTabParametres
                  .getElement("ANom")
                  .setValeur(aInfosDelegation.nom);
                aTabParametres
                  .getElement("AParametres")
                  .setValeur(aParametresWsFed);
                if (!aSurCreation) {
                  aTabParametres
                    .getElement("AIdParametres")
                    .setValeur(aInfosDelegation.idParametres);
                }
              },
            }).then(() => {
              this.callbackSurSaisie();
            });
          }
        },
        initialiser(aInstanceFenetre) {
          aInstanceFenetre.setOptionsFenetre({
            titre: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametresDeleguerLAuthentification.activerWsFed",
            ),
            largeur: 1000,
            hauteur: 420,
            listeBoutons: [
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageCAS.annuler",
                ),
              },
              {
                libelle: ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageCAS.valider",
                ),
                valider: true,
              },
            ],
          });
        },
      },
    );
    lInstanceWsFed.setFenetre(lFenetre);
    lFenetre.setBoutonActif(
      1,
      !this.estServeurActif() && aParametresWsFed.urlMetadataServeur !== "",
    );
    lFenetre.afficher(
      '<div style="width:100%; height: 100%" id="' +
        lInstanceWsFed.getNom() +
        '"></div>',
    );
    lInstanceWsFed.initialiser();
  }
  ouvrirFenetreParametrageSaml(
    aParametresSaml,
    aInfosDelegation,
    aSurCreation = false,
  ) {
    const lInstanceSaml = this.getInstance(this.identZoneSaml);
    if (!lInstanceSaml) {
      return;
    }
    lInstanceSaml.init(aParametresSaml, aInfosDelegation);
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_1.ObjetFenetre,
      {
        pere: this,
        evenement: (aNumeroBouton, aParams) => {
          if (aParams.bouton.valider) {
            AppelSOAP_1.AppelSOAP.lancerAppel({
              instance: this,
              port: "PortGestionSaml",
              methode: aSurCreation
                ? "CreerParametresSaml"
                : "SetParametresSaml",
              serialisation: function (aTabParametres) {
                aTabParametres
                  .getElement("ANom")
                  .setValeur(aInfosDelegation.nom);
                aTabParametres
                  .getElement("AParametres")
                  .setValeur(aParametresSaml);
                if (!aSurCreation) {
                  aTabParametres
                    .getElement("AIdParametres")
                    .setValeur(aInfosDelegation.idParametres);
                }
              },
            }).then(() => {
              this.callbackSurSaisie();
            });
          }
        },
      },
      {
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "pageParametresDeleguerLAuthentification.activerSaml",
        ),
        largeur: 1000,
        hauteur: 420,
        listeBoutons: [
          {
            libelle: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametrageCAS.annuler",
            ),
          },
          {
            libelle: ObjetTraduction_1.GTraductions.getValeur(
              "pageParametrageCAS.valider",
            ),
            valider: true,
          },
        ],
      },
    );
    lInstanceSaml.setFenetre(lFenetre);
    lFenetre.setBoutonActif(
      1,
      !this.estServeurActif() && aParametresSaml.urlMetadataServeur !== "",
    );
    lFenetre.afficher(
      '<div style="width:100%; height: 100%" id="' +
        lInstanceSaml.getNom() +
        '"></div>',
    );
    lInstanceSaml.initialiser();
  }
}
exports.InterfaceParametrageDeleguerAuthentification =
  InterfaceParametrageDeleguerAuthentification;
class DonneesListe_ChoixDelegationAuthentification extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.params = aParams;
    this.setOptions({ avecSuppression: false });
  }
  estCasActif() {
    return this.params.CASactif;
  }
  getCouleurCellule(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_ChoixDelegationAuthentification.colonnes.espace
    ) {
      return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
    }
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ChoixDelegationAuthentification.colonnes.espace:
        return aParams.article.Libelle;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.cas:
        return (
          aParams.article.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_Cas
        );
      case DonneesListe_ChoixDelegationAuthentification.colonnes.wsFed:
        return (
          aParams.article.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_WsFed
        );
      case DonneesListe_ChoixDelegationAuthentification.colonnes.educonnect:
        return (
          aParams.article.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_EduConnect
        );
      case DonneesListe_ChoixDelegationAuthentification.colonnes.saml:
        return (
          aParams.article.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_Saml
        );
      case DonneesListe_ChoixDelegationAuthentification.colonnes.aucune:
        return (
          aParams.article.typeDA ===
          WSGestionDelegationsAuthentification_1
            .ETypeDelegationAuthentificationSvcW.DA_Aucune
        );
      default:
        return "";
    }
  }
  getTypeValeur(aParams) {
    if (aParams.article) {
      switch (aParams.idColonne) {
        case DonneesListe_ChoixDelegationAuthentification.colonnes.espace:
          return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
        default:
          return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
      }
    }
  }
  avecEdition(aParams) {
    const lAvecEdition =
      this.options.avecEdition && !this.params.serveurActif();
    let lResult;
    switch (aParams.idColonne) {
      case DonneesListe_ChoixDelegationAuthentification.colonnes.aucune:
        return lAvecEdition;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.cas:
        lResult = lAvecEdition && this.params.CASactif;
        if (lResult && aParams.article && aParams.article.estPageCommune) {
          lResult = this.verifierConformitePourPageCommune(
            WSGestionDelegationsAuthentification_1
              .ETypeDelegationAuthentificationSvcW.DA_Cas,
          );
        }
        return lResult;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.wsFed:
        lResult = lAvecEdition && this.params.WsFedactif;
        if (lResult && aParams.article && aParams.article.estPageCommune) {
          lResult = this.verifierConformitePourPageCommune(
            WSGestionDelegationsAuthentification_1
              .ETypeDelegationAuthentificationSvcW.DA_WsFed,
          );
        }
        return lResult;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.saml:
        lResult = lAvecEdition && this.params.Samlactif;
        if (lResult && aParams.article && aParams.article.estPageCommune) {
          lResult = this.verifierConformitePourPageCommune(
            WSGestionDelegationsAuthentification_1
              .ETypeDelegationAuthentificationSvcW.DA_Saml,
          );
        }
        return lResult;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.educonnect:
        lResult =
          lAvecEdition &&
          this.params.EduConnectactif &&
          aParams.article.estEspaceConformeEduConnect;
        if (lResult && aParams.article && aParams.article.estPageCommune) {
          lResult = this.verifierConformitePourPageCommune(
            WSGestionDelegationsAuthentification_1
              .ETypeDelegationAuthentificationSvcW.DA_EduConnect,
          );
        }
        return lResult;
      default:
        return false;
    }
  }
  verifierConformitePourPageCommune(aTypeDelegationAuthentification) {
    let lResult = true;
    for (let i = 0; i < this.Donnees.count() && lResult; i++) {
      const element = this.Donnees.get(i);
      if (!element.estPageCommune && !element.estEspaceIndependant) {
        lResult = element.typeDA === aTypeDelegationAuthentification;
      }
    }
    return lResult;
  }
  avecEvenementApresEdition(aParams) {
    return this.avecEdition(aParams);
  }
  surEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ChoixDelegationAuthentification.colonnes.cas:
        aParams.article.typeDA =
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Cas;
        break;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.wsFed:
        aParams.article.typeDA =
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_WsFed;
        break;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.saml:
        aParams.article.typeDA =
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Saml;
        break;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.educonnect:
        aParams.article.typeDA =
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_EduConnect;
        break;
      case DonneesListe_ChoixDelegationAuthentification.colonnes.aucune:
        aParams.article.typeDA =
          WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Aucune;
        break;
    }
    if (!aParams.article.estEspaceIndependant) {
      this.verifierEdition(aParams.article.typeDA);
    }
  }
  verifierEdition(aTypeDelegationAuthentification) {
    let lResult = true;
    let lCommune;
    for (let i = 0; i < this.Donnees.count(); i++) {
      const element = this.Donnees.get(i);
      if (element.estPageCommune) {
        lCommune = element;
      }
      if (lResult && !element.estEspaceIndependant) {
        lResult = element.typeDA === aTypeDelegationAuthentification;
      }
    }
    if (!lResult && !!lCommune) {
      lCommune.typeDA =
        WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Aucune;
    }
  }
  avecMenuContextuel() {
    return false;
  }
  avecEvenementSelection() {
    return false;
  }
}
DonneesListe_ChoixDelegationAuthentification.colonnes = {
  espace: "c_DA_espace",
  cas: "c_DA_cas",
  wsFed: "c_DA_ws_Fed",
  saml: "c_DA_saml",
  educonnect: "c_DA_eduConnect",
  aucune: "c_DA_aucune",
};

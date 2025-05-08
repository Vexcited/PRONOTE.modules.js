exports.InterfaceParametrageSaml = void 0;
require("IEHtml.MrFiche.js");
const AppelSOAP_1 = require("AppelSOAP");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionSaml_1 = require("WSGestionSaml");
const ObjetFenetre_ParametrageSaml_1 = require("ObjetFenetre_ParametrageSaml");
class InterfaceParametrageSaml extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.objetApplicationConsoles = GApplication;
    this.messagesEvenements =
      this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
        "InterfaceParametrageSaml.js",
      );
    this.optionsSaml = {
      avecEspaceInterface: true,
      avecAccesDirectEspaces: true,
      avecAccesInvite: true,
      avecURLPointNet: true,
      avecUrlPubliqueServeur: false,
      avecAuthentificationServeur: false,
      avecMrFicheURLServeur: true,
      avecDownloadConfig: false,
      bloquerSaisieUrl: false,
      largeurLibelleFenetre: 120,
    };
    this.donneesRecues = false;
  }
  init(aParametresSaml, aInfosDelegation) {
    this.parametresSaml = aParametresSaml;
    this.infosDelegation = aInfosDelegation;
    this.recupererParametres();
  }
  estConnecterAuServeur() {
    return false;
  }
  setFenetre(aInstanceFenetre) {
    this.fenetre = aInstanceFenetre;
  }
  estEnService() {
    return false;
  }
  free() {
    super.free();
    clearTimeout(this.timeoutEtatEnCours);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      inputNomDelegation: {
        getValue() {
          return aInstance.infosDelegation.nom;
        },
        setValue(aValue) {
          aInstance.infosDelegation.nom = aValue;
        },
        getDisabled() {
          return aInstance.avecParametresInactifs();
        },
      },
      btnParametres: {
        event() {
          const lFenetreParametrageSaml =
            ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_ParametrageSaml_1.ObjetFenetre_ParametrageSaml,
              {
                pere: aInstance,
                evenement: aInstance.evenementSurFenetreParametrage,
                initialiser(aInstanceFenetre) {
                  aInstanceFenetre.setOptionsFenetresParametragSaml({
                    largeurLibelle: aInstance.optionsSaml.largeurLibelleFenetre,
                  });
                },
              },
            );
          lFenetreParametrageSaml.setDonnees(aInstance.parametresSaml);
        },
        getDisabled() {
          return (
            aInstance.estEnService() ||
            !aInstance.parametresSaml.urlMetadataServeur ||
            aInstance.statutContactServeurSvcW !==
              WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte
          );
        },
      },
      getStyleTexte() {
        return {
          color: aInstance.avecParametresInactifs()
            ? GCouleur.nonEditable.texte
            : "black",
        };
      },
      inputURL: {
        getValue() {
          return aInstance.parametresSaml.urlMetadataServeur;
        },
        setValue(aValue) {
          aInstance.parametresSaml.urlMetadataServeur = aValue;
        },
        exitChange(aValue) {
          aInstance.parametresSaml.urlMetadataServeur = aValue;
          if (aInstance.parametresSaml.urlMetadataServeur !== "") {
            aInstance.fenetre.setBoutonActif(1, false);
            return aInstance.soapVerifierAdresseMetadata(0);
          }
        },
        getDisabled: function () {
          return (
            aInstance.avecParametresInactifs() ||
            aInstance.optionsSaml.bloquerSaisieUrl
          );
        },
      },
      getEtatLogin() {
        return aInstance.getEtatLogin();
      },
      getUrlPubliqueMetaData() {
        return aInstance.urlFederationMetataClient || "";
      },
      cbAcces: {
        getValue(aNomProp) {
          return aInstance.parametresSaml[aNomProp];
        },
        setValue(aNomProp, aNomMethode, aValue) {
          aInstance.parametresSaml[aNomProp] = aValue;
        },
        getDisabled() {
          return aInstance.avecParametresInactifs();
        },
      },
      lienAcces(aNomPropUrl, aNomPropCB) {
        if (!aInstance.parametresSaml[aNomPropUrl]) {
          return "";
        }
        const lAvecClic =
          aInstance.parametresSaml[aNomPropCB] &&
          aInstance.avecParametresInactifs() &&
          aInstance.estEnService();
        return !lAvecClic
          ? '<span class="EspaceGauche Texte10 AvecSelectionTexte Gras">' +
              aInstance.parametresSaml[aNomPropUrl] +
              "</span>"
          : '<a href="' +
              aInstance.parametresSaml[aNomPropUrl] +
              '" class="EspaceGauche Texte10 AvecSelectionTexte LienConsole" target="_blank">' +
              aInstance.parametresSaml[aNomPropUrl] +
              "</a>";
      },
      getHtmlURLPublique() {
        return aInstance.parametresSaml.urlPublique;
      },
      getDownloadConfig() {
        if (!aInstance.avecParametresInactifs()) {
          return ObjetTraduction_1.GTraductions.getValeur(
            "saml.TelechargerMetadata",
          );
        }
        return (
          '<a href="download/configurationSaml.xml" target="_blank">' +
          ObjetTraduction_1.GTraductions.getValeur("saml.TelechargerMetadata") +
          "</a>"
        );
      },
      cbAuthControleur: {
        getValue() {
          return aInstance.parametresSaml.accesDirectAuxEspaces;
        },
        setValue(aValue) {
          aInstance.parametresSaml.accesDirectAuxEspaces = aValue;
        },
        getDisabled() {
          return aInstance.avecParametresInactifs();
        },
      },
      rbAuthControleur: {
        getValue(aEstToutLeTemp) {
          return (
            aInstance.parametresSaml.accesDirectToutLeTemps === aEstToutLeTemp
          );
        },
        setValue(aValue) {
          aInstance.parametresSaml.accesDirectToutLeTemps = aValue;
          aInstance.parametresSaml.accesDirectPasDeReponse = !aValue;
        },
        getDisabled() {
          return (
            !aInstance.parametresSaml.accesDirectAuxEspaces ||
            aInstance.avecParametresInactifs()
          );
        },
      },
    });
  }
  construireStructureAffichage() {
    const H = [];
    if (this.estConnecterAuServeur()) {
      H.push(
        '<div class="full-width ',
        (this.optionsSaml.avecEspaceInterface ? "Espace " : "") + 'BorderBox">',
      );
      const llabelExplicatif = this.estEnService()
        ? ObjetTraduction_1.GTraductions.getValeur(
            "pageParametrageCAS.labelArreterPublicationPourModifierParametres",
          )
        : "";
      H.push(
        '<div class="Texte10 full-width">',
        llabelExplicatif
          ? '<div class="Gras EspaceBas AlignementMilieu">' +
              llabelExplicatif +
              "</div>"
          : "",
        "<div>",
        this.composePage(),
        "</div>",
      );
      H.push("</div>");
    } else {
      H.push(
        '<div class="Texte10 Espace GrandEspaceHaut Gras">' +
          ObjetTraduction_1.GTraductions.getValeur(
            "pageConsoleAdministration.msgPasDeModifSiAucuneBase",
          ) +
          "</div>",
      );
    }
    return H.join("");
  }
  recupererParametres() {
    if (this.estConnecterAuServeur()) {
      return this.soapGetUrlFederationMetataClient();
    }
  }
  avecParametresInactifs() {
    return this.estEnService();
  }
  evenementSurFenetreParametrage(aParametres) {
    if (aParametres) {
      this.parametresSaml.identifiantUnique = aParametres.identifiantUnique;
    }
  }
  getEtatLogin() {
    const H = [];
    if (!this.donneesRecues || this.parametresSaml.urlMetadataServeur === "") {
      return "";
    }
    switch (this.statutContactServeurSvcW) {
      case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte:
        break;
      case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_EnCours:
        H.push(
          '<div class="Gras" style="',
          ObjetStyle_1.GStyle.composeCouleurTexte("red"),
          '">',
          ObjetTraduction_1.GTraductions.getValeur(
            "saml.ContactServeurEnCours",
          ),
          "</div>",
        );
        break;
      case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Inconnu:
      case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Erreur:
        H.push(
          '<div class="Gras" style="',
          ObjetStyle_1.GStyle.composeCouleurTexte("red"),
          '">',
          ObjetTraduction_1.GTraductions.getValeur("saml.ErreurContactServeur"),
          "</div>",
        );
        break;
      default:
    }
    return H.join("");
  }
  composePage() {
    const H = [];
    H.push(
      '<div class="flex-contain flex-center">',
      '<div class="fluid-bloc">',
      '<span class="p-left">',
      ObjetTraduction_1.GTraductions.getValeur(
        "pageParametresDeleguerLAuthentification.NomDeLaDelegation",
      ) + " :",
      "</span>",
      '<input ie-model="inputNomDelegation" style="width:450px;" />',
      "</div>",
      '<ie-bouton ie-model="btnParametres" style="min-width:300px;" class="small-bt">',
      ObjetTraduction_1.GTraductions.getValeur("saml.Parametres"),
      "</ie-bouton>",
      "</div>",
    );
    H.push('<div class="Espace">');
    H.push('<div ie-style="getStyleTexte" class="AvecSelectionTexte">');
    H.push(
      '<div style="display:flex; align-items:center;">',
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur("saml.UrlServeurSaml"),
      "</div>",
      this.optionsSaml.avecMrFicheURLServeur
        ? '<div ie-mrfiche="saml.MFicheUrlServeurSaml" class="PetitEspaceGauche"></div>'
        : "",
      "</div>",
    );
    H.push(
      '<div style="padding-top:5px; padding-left:10px;">',
      '<input type="text" ie-model="inputURL" ie-selecttextfocus ie-trim class="Gras" style="width:100%; height:20px;',
      ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.noir),
      '" />',
      "</div>",
    );
    H.push('<div class="PetitEspaceHaut" ie-html="getEtatLogin"></div>');
    if (this.optionsSaml.avecURLPointNet) {
      H.push('<div style="padding-top:10px;">');
      H.push(
        "<div>",
        ObjetTraduction_1.GTraductions.getValeur("saml.UrlPublique"),
        "</div>",
      );
      H.push(
        '<div class="EspaceGauche PetitEspaceHaut Gras AvecSelectionTexte" ie-html="getUrlPubliqueMetaData"></div>',
      );
      H.push("</div>");
    }
    if (this.optionsSaml.avecAccesDirectEspaces) {
      H.push('<div style="padding-top:10px;">');
      H.push(
        "<div>",
        "<ie-checkbox ",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAcces", [
          "accesDirectAuxEspaces",
          "SetAccesDirectAuxEspacesSaml",
        ]),
        ">",
        ObjetTraduction_1.GTraductions.getValeur("saml.LoginDirect"),
        "</ie-checkbox>",
        "</div>",
      );
      H.push(
        "<div ",
        ObjetHtml_1.GHtml.composeAttr("ie-html", "lienAcces", [
          "urlAccesDirect",
          "accesDirectAuxEspaces",
        ]),
        '"></div>',
      );
      H.push("</div>");
    }
    if (this.optionsSaml.avecAccesInvite) {
      H.push('<div style="padding-top:10px;">');
      H.push(
        "<div>",
        "<ie-checkbox ",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAcces", [
          "accesInviteSansCAS",
          "SetAccesInviteSansSaml",
        ]),
        ">",
        ObjetTraduction_1.GTraductions.getValeur("saml.EspaceInvite"),
        "</ie-checkbox>",
        "</div>",
      );
      H.push(
        "<div ",
        ObjetHtml_1.GHtml.composeAttr("ie-html", "lienAcces", [
          "urlAccesInviteSansCAS",
          "accesInviteSansCAS",
        ]),
        '"></div>',
      );
      H.push("</div>");
    }
    if (this.optionsSaml.avecUrlPubliqueServeur) {
      H.push(
        '<div style="padding-top:10px; display:flex; align-items:center;">',
        "<div>",
        ObjetTraduction_1.GTraductions.getValeur("saml.UrlPublique"),
        "</div>",
        "</div>",
      );
      H.push(
        '<div style="padding-top:5px; padding-left:10px;" class="Gras AvecSelectionTexte" ie-html="getHtmlURLPublique">',
        "</div>",
      );
    }
    if (this.optionsSaml.avecDownloadConfig) {
      H.push(
        '<div style="padding-top:10px; display:flex; align-items:center;">',
        '<div ie-html="getDownloadConfig"></div>',
        '<div ie-mrfiche="saml.MFicheTelechargerMetadataSaml" class="PetitEspaceGauche"></div>',
        "</div>",
      );
    }
    if (this.optionsSaml.avecAuthentificationServeur) {
      H.push('<div style="padding-top:10px;">');
      H.push(
        '<div style="display:flex; align-items:center;">',
        "<ie-checkbox ",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAuthControleur"),
        ">",
        ObjetTraduction_1.GTraductions.getValeur("saml.LoginDirect"),
        "</ie-checkbox>",
        '<div ie-mrfiche="saml.MFicheLoginDirect" class="PetitEspaceGauche"></div>',
        "</div>",
      );
      H.push("</div>");
      H.push('<div style="padding-top:5px; padding-left:15px;">');
      H.push(
        "<div>",
        "<ie-radio ",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "rbAuthControleur", [true]),
        ">",
        ObjetTraduction_1.GTraductions.getValeur("saml.DirectToutLeTemps"),
        "</ie-radio>",
        "</div>",
      );
      H.push(
        "<div>",
        "<ie-radio ",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "rbAuthControleur", [false]),
        ">",
        ObjetTraduction_1.GTraductions.getValeur("saml.DirectPasDeReponse"),
        "</ie-radio>",
        "</div>",
      );
      H.push("</div>");
    }
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  soapVerifierAdresseMetadata(aCompteur) {
    const lCompteur = aCompteur || 1;
    clearTimeout(this.timeoutEtatEnCours);
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionSaml",
      methode: "VerifierAdresseMetadataSaml",
      serialisation: (aTabParametres) => {
        aTabParametres
          .getElement("AAdresseMetadata")
          .setValeur(this.parametresSaml.urlMetadataServeur);
        aTabParametres
          .getElement("AIdParametres")
          .setValeur(this.infosDelegation.idParametres);
      },
    })
      .then((aDonnees) => {
        const lResultatInterrogationMetadata =
          aDonnees.getElement("return").valeur;
        this.statutContactServeurSvcW =
          lResultatInterrogationMetadata.statutContactServeur;
        const lParametresSamlVerifie =
          lResultatInterrogationMetadata.parametres;
        this.parametresSaml.revendicationsDisponibles =
          lParametresSamlVerifie.revendicationsDisponibles;
        this.fenetre.setBoutonActif(
          1,
          this.statutContactServeurSvcW ===
            WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte,
        );
      })
      .then(() => {
        if (
          this.statutContactServeurSvcW ===
            WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_EnCours &&
          lCompteur < 60
        ) {
          return new Promise((aResolve) => {
            this.timeoutEtatEnCours = setTimeout(aResolve, 1000);
          }).then(() => {
            return this.soapVerifierAdresseMetadata(lCompteur + 1);
          });
        }
      });
  }
  soapGetUrlFederationMetataClient() {
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionSaml",
      methode: "GetUrlFederationMetataClientSaml",
      serialisation: (aTabParametres) => {
        aTabParametres
          .getElement("AIdParametres")
          .setValeur(this.infosDelegation.idParametres);
      },
    }).then((aDonnees) => {
      this.urlFederationMetataClient = aDonnees.getElement("return").valeur;
      this.donneesRecues = true;
      this.statutContactServeurSvcW =
        this.parametresSaml.urlMetadataServeur !== ""
          ? WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte
          : WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Inconnu;
      this.$refreshSelf();
      this.fenetre.setBoutonActif(
        1,
        this.statutContactServeurSvcW ===
          WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte,
      );
    });
  }
}
exports.InterfaceParametrageSaml = InterfaceParametrageSaml;

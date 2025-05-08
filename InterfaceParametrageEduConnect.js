exports.InterfaceParametrageEduConnect = void 0;
const AppelSOAP_1 = require("AppelSOAP");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionEduConnect_1 = require("WSGestionEduConnect");
class InterfaceParametrageEduConnect extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.objetApplicationConsoles = GApplication;
    this.donneesRecues = false;
    this.urlDeclare = false;
    this.demandeEnCours = false;
    this.status = WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Inconnu;
  }
  init(aURLDeclaree, aInfosDelegation) {
    this.urlDeclare = !!aURLDeclaree;
    if (this.urlDeclare) {
      this.status = WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Declaree;
    }
    this.infosDelegation = aInfosDelegation;
    this.recupererDonneesPage();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnDeclarer: {
        event() {
          aInstance.soapDeclarerUrlDeService(0);
        },
        getDisabled() {
          return aInstance.avecParametresInactifs();
        },
      },
      infoStatus() {
        if (aInstance && !!aInstance.donneesRecues) {
          switch (aInstance.status) {
            case WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Inconnu:
              return ObjetTraduction_1.GTraductions.getValeur(
                "pageParametrageEduConnect.message.inconnu",
              );
            case WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Declaree:
              return (
                '<span style="color:' +
                GCouleur.vert +
                ';">' +
                ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageEduConnect.message.ok",
                ) +
                "</span>"
              );
            case WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_NonPilote:
              return (
                '<span style="color:' +
                GCouleur.rouge +
                ';">' +
                ObjetTraduction_1.GTraductions.getValeur(
                  "pageParametrageEduConnect.message.nonPilote",
                ).replaceRCToHTML() +
                "</span>"
              );
            default:
              return "";
          }
        }
        return "";
      },
    });
  }
  estServeurActif() {
    return (
      this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
    );
  }
  aUneDemandeEnCours() {
    return this.demandeEnCours;
  }
  setFenetre(aInstanceFenetre) {
    this.fenetre = aInstanceFenetre;
  }
  avecParametresInactifs() {
    if (this.estServeurActif()) {
      return true;
    } else {
      return this.urlDeclare;
    }
  }
  recupererDonneesPage() {
    this.donneesRecues = true;
    this.initialiser(true);
  }
  construireStructureAffichage() {
    const H = [];
    const llabelExplicatif =
      this.estServeurActif() && !this.urlDeclare
        ? ObjetTraduction_1.GTraductions.getValeur(
            "pageParametrageCAS.labelArreterPublicationPourModifierParametres",
          )
        : "";
    if (this.donneesRecues) {
      H.push(
        '<table class="Texte10 full-width">',
        llabelExplicatif
          ? '<tr><td class="Gras EspaceBas AlignementMilieu">' +
              llabelExplicatif +
              "</td></tr>"
          : "",
        "<tr><td>",
        '<div class="Texte10" style="line-height: 1.5rem;margin-bottom: 1rem;">',
        ObjetTraduction_1.GTraductions.getValeur(
          "pageParametrageEduConnect.description",
        ).replaceRCToHTML(),
        "</div>",
        '<fieldset class="AlignementGauche Texte10" style="padding: 3px; margin: 0px; border:1px solid ',
        GCouleur.intermediaire,
        ';">',
        '<legend class="Espace Gras" style="color:',
        GCouleur.texte,
        ';">',
        ObjetTraduction_1.GTraductions.getValeur(
          "pageParametrageEduConnect.titreDeclaration",
        ),
        "</legend>",
        '<div style="display:flex; align-items: center;">',
        '<ie-bouton ie-model="btnDeclarer" style="min-width:150px;" class="small-bt">',
        ObjetTraduction_1.GTraductions.getValeur(
          "pageParametrageEduConnect.declarer",
        ),
        "</ie-bouton>",
        '<div class="EspaceGauche Gras" ie-html="infoStatus"></div>',
        "</div>",
        "</fieldset>",
        "</td></tr>",
        "</table>",
      );
    }
    return H.join("");
  }
  callbackSurSaisie() {
    this.recupererDonneesPage();
  }
  soapDeclarerUrlDeService(aCompteur) {
    const lCompteur = aCompteur || 1;
    this.demandeEnCours = true;
    clearTimeout(this.timeoutEtatEnCours);
    return AppelSOAP_1.AppelSOAP.lancerAppel({
      instance: this,
      port: "PortGestionEduConnect",
      methode: "DeclarerUrlDeService",
    })
      .then((aDonnees) => {
        this.status = aDonnees.getElement("return").valeur;
        this.fenetre.setBoutonActif(
          0,
          this.status !==
            WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Inconnu,
        );
      })
      .then(() => {
        if (
          this.status ===
            WSGestionEduConnect_1.ETypeStatutDeclaration.Sd_Inconnu &&
          lCompteur < 60
        ) {
          return new Promise((aResolve) => {
            this.timeoutEtatEnCours = setTimeout(aResolve, 1000);
          }).then(() => {
            return this.soapDeclarerUrlDeService(lCompteur + 1);
          });
        }
      });
  }
}
exports.InterfaceParametrageEduConnect = InterfaceParametrageEduConnect;

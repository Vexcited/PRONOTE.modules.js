exports.InterfaceZoneInfosPrincipales = void 0;
const ObjetInfoBase_1 = require("ObjetInfoBase");
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
require("IEHtml.BoutonHebergement.js");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
var EEvenementBoutonPublication;
(function (EEvenementBoutonPublication) {
  EEvenementBoutonPublication[
    (EEvenementBoutonPublication["ArretPublication"] = 1)
  ] = "ArretPublication";
  EEvenementBoutonPublication[
    (EEvenementBoutonPublication["Publication"] = 2)
  ] = "Publication";
})(EEvenementBoutonPublication || (EEvenementBoutonPublication = {}));
class InterfaceZoneInfosPrincipales extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.objetApplicationConsoles = GApplication;
    this.objetCouleurConsoles = GCouleur;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getStyleEntete() {
        const lActif =
          aInstance.objetApplicationConsoles.etatServeurHttp.getEtatActif();
        return {
          "background-color": lActif
            ? aInstance.objetCouleurConsoles.enService.fond
            : GCouleur.fond,
          color: lActif
            ? aInstance.objetCouleurConsoles.enService.texte
            : GCouleur.texte,
        };
      },
      btnPublication: {
        event() {
          aInstance.evenementBoutonPublication(
            aInstance.objetApplicationConsoles.etatServeurHttp.getEtatActif()
              ? EEvenementBoutonPublication.ArretPublication
              : EEvenementBoutonPublication.Publication,
          );
        },
        getDisabled() {
          return !aInstance.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur();
        },
        getCssImage() {
          return aInstance.objetApplicationConsoles.etatServeurHttp.getEtatActif()
            ? "Image_Commande_ArreterServeur"
            : aInstance.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur()
              ? "Image_Commande_DemarrerServeur"
              : "Image_Commande_DemarrerServeur_Inactif";
        },
        getHtml() {
          return aInstance._getLibelleBtnPublication();
        },
      },
      getTitleBtnPublication() {
        return aInstance._getLibelleBtnPublication();
      },
    });
  }
  construireInstances() {
    this.identZoneInfoBase = this.add(ObjetInfoBase_1.ObjetInfoBase);
  }
  construireStructureAffichage() {
    const H = [];
    H.push(
      '<table class="Table p-all" ie-style="getStyleEntete">',
      "<tr>",
      '<td class="EspaceDroit">',
      '<ie-boutonhebergement ie-model="btnPublication" ie-title="getTitleBtnPublication" style="width:185px;"></ie-boutonhebergement>',
      "</td>",
      this.identZoneInfoBase >= 0
        ? '<td class="Table" id="' +
            this.getInstance(this.identZoneInfoBase).getNom() +
            '"></td>'
        : "",
      "</tr>",
      "</table>",
    );
    return H.join("");
  }
  recupererDonnees() {
    this.getInstance(this.identZoneInfoBase).setParametres(
      this.objetApplicationConsoles.etatServeurHttp.getNomBaseChargee(),
    );
    this.getInstance(this.identZoneInfoBase).afficher();
    this.$refreshSelf();
  }
  evenementBoutonPublication(aGenreEvenement) {
    const lNomService =
      aGenreEvenement === EEvenementBoutonPublication.Publication
        ? "Publier"
        : "Arreter";
    const lParam = {
      webService: this.objetApplicationConsoles.WS_adminServeur,
      port: "PortPublicationServeurHttp",
      methode: lNomService,
    };
    const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
    const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
      lCommunication.webServices,
      lParam,
    );
    lCommunication.appelSOAP(
      lAppelDistant,
      this.objetApplicationConsoles.creerCallbackSOAP(
        this,
        this.callbackSurBouton,
      ),
    );
  }
  callbackSurBouton() {
    this.callback.appel();
  }
  _getLibelleBtnPublication() {
    return this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
      ? ObjetTraduction_1.GTraductions.getValeur(
          "principal.btnArreterPublication",
        )
      : this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur()
        ? ObjetTraduction_1.GTraductions.getValeur("principal.btnPublier")
        : ObjetTraduction_1.GTraductions.getValeur(
            "principal.btnPublierInactif",
          );
  }
}
exports.InterfaceZoneInfosPrincipales = InterfaceZoneInfosPrincipales;

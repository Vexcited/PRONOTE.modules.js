const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
const { TypeClientRest } = require("TypeClientRest.js");
Requetes.inscrire("GestionCloudIndex", ObjetRequeteSaisie);
Requetes.inscrire("GestionCloudIndexAsync", ObjetRequeteSaisie);
class ObjetFenetre_ConnexionCloudIndex extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnCreation: {
        event: function () {
          Requetes("GestionCloudIndexAsync", aInstance)
            .lancerRequete()
            .then((aParams) => {
              if (aParams.JSONRapportSaisie.url) {
                window.open(aParams.JSONRapportSaisie.url);
              }
            });
        },
        getOptions: function () {
          return { widthBoutonImage: 225 };
        },
      },
      btnAssociation: {
        event: function () {
          aInstance
            .getInstance(aInstance.identFenetreFichiersCloud)
            .setDonnees({
              service: TypeClientRest.crCloudIndex,
              inscriptionSeule: true,
              callbackInscriptionSeule: function () {
                this.fermer();
              }.bind(aInstance),
            });
        },
        getOptions: function () {
          return { widthBoutonImage: 225 };
        },
      },
    });
  }
  construireInstances() {
    this.identFenetreFichiersCloud = this.addFenetre(
      ObjetFenetre_FichiersCloud,
    );
  }
  composeContenu() {
    const T = [];
    T.push('<div style="min-width: 500px;">');
    T.push("<p>" + GTraductions.getValeur("cloudIndex.explication") + "</p>");
    T.push("<p>");
    T.push(
      '<span class="InlineBlock" style="width:235px;margin-right:1rem;">' +
        GTraductions.getValeur("cloudIndex.pasEncoreCompte") +
        "</span>",
    );
    T.push(
      '<ie-bouton ie-image="Image_CreationCompteCloudIndex" ie-model="btnCreation" title="' +
        GTraductions.getValeur("cloudIndex.creationCompte") +
        '" class="AlignementMilieuVertical themeBoutonNeutre">' +
        GTraductions.getValeur("cloudIndex.creationCompte") +
        "</ie-bouton>",
    );
    T.push("<br /><br />");
    T.push(
      '<span class="InlineBlock" style="width:235px;margin-right:1rem;">' +
        GTraductions.getValeur("cloudIndex.dejaCompte") +
        "</span>",
    );
    T.push(
      '<ie-bouton ie-image="Image_AssociationCompteCloudIndex" ie-model="btnAssociation" title="' +
        GTraductions.getValeur("cloudIndex.associationCompte") +
        '" class="AlignementMilieuVertical themeBoutonNeutre">' +
        GTraductions.getValeur("cloudIndex.associationCompte") +
        "</ie-bouton>",
    );
    T.push("</p>");
    T.push("</div>");
    return T.join("");
  }
}
module.exports = { ObjetFenetre_ConnexionCloudIndex };

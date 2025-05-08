exports.WS_EtatServeurHttp =
  exports.ParametreTInfosEtatServeurHttp =
  exports.TInfosEtatServeurHttp =
    void 0;
const WSParametreAppel = require("WS_ParametreAppel");
class TInfosEtatServeurHttp {
  constructor(aConnecteAuServeur, aActif, aNomBaseChargee, aModeExclusif) {
    this.connecteAuServeur = aConnecteAuServeur;
    this.actif = aActif;
    this.nomBaseChargee = aNomBaseChargee;
    this.modeExclusif = aModeExclusif;
  }
  getConnecteAuServeur() {
    return this.connecteAuServeur;
  }
  setConnecteAuServeur(aConnecteAuServeur) {
    this.connecteAuServeur = aConnecteAuServeur;
  }
  getActif() {
    return this.actif;
  }
  setActif(aActif) {
    this.actif = aActif;
  }
  getNomBaseChargee() {
    return this.nomBaseChargee;
  }
  setNomBaseChargee(aNomBaseChargee) {
    this.nomBaseChargee = aNomBaseChargee;
  }
  getModeExclusif() {
    return this.modeExclusif;
  }
  setModeExclusif(aModeExclusif) {
    this.modeExclusif = aModeExclusif;
  }
  toString() {
    return (
      "[connecteAuServeur]" +
      this.connecteAuServeur.toString() +
      "\n" +
      "[actif]" +
      this.actif.toString() +
      "\n" +
      "[nomBaseChargee]" +
      this.nomBaseChargee.toString() +
      "\n" +
      "[modeExclusif]" +
      this.modeExclusif.toString() +
      "\n"
    );
  }
}
exports.TInfosEtatServeurHttp = TInfosEtatServeurHttp;
class ParametreTInfosEtatServeurHttp {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreBoolean(
        "ConnecteAuServeur",
        "connecteAuServeur",
      ),
      new WSParametreAppel.ParametreBoolean("Actif", "actif"),
      new WSParametreAppel.ParametreString("NomBaseChargee", "nomBaseChargee"),
      new WSParametreAppel.ParametreBoolean("ModeExclusif", "modeExclusif"),
    ]);
  }
  getNom() {
    return this.nom;
  }
  getNomJs() {
    return this.nomJs;
  }
  getParametreObject() {
    return this.parametreObject;
  }
  serialiser(aDocumentXml, aNoeudXml, aValeur, aEspaceNommage) {
    this.parametreObject.serialiser(
      aDocumentXml,
      aNoeudXml,
      aValeur,
      aEspaceNommage,
    );
  }
  deserialiser(aDocumentXml, aNoeudXml) {
    const lValeur = new TInfosEtatServeurHttp();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTInfosEtatServeurHttp = ParametreTInfosEtatServeurHttp;
class WS_EtatServeurHttp {
  getDescription() {
    return {
      nom: "PortEtatServeurHttp",
      url: "EtatServeurHttp",
      operations: [
        {
          nom: "GetInfosEtatServeurHttp",
          tabParamIN: [],
          tabParamOUT: [new ParametreTInfosEtatServeurHttp("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetNbrSaisiesEnAttente",
          tabParamIN: [],
          tabParamOUT: [new WSParametreAppel.ParametreNumber("return")],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_EtatServeurHttp = WS_EtatServeurHttp;

exports.WS_GestionSaml =
  exports.ParametreTResultatInterrogationMetadataSaml =
  exports.ParametreTParametresSaml =
  exports.ParametreTClaimSaml =
  exports.TResultatInterrogationMetadataSaml =
  exports.TParametresSaml =
  exports.TClaimSaml =
  exports.ETypeStatutContactServeurSamlSvcW =
    void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeStatutContactServeurSamlSvcW;
(function (ETypeStatutContactServeurSamlSvcW) {
  ETypeStatutContactServeurSamlSvcW["Scs_Inconnu"] = "Scs_Inconnu";
  ETypeStatutContactServeurSamlSvcW["Scs_Contacte"] = "Scs_Contacte";
  ETypeStatutContactServeurSamlSvcW["Scs_EnCours"] = "Scs_EnCours";
  ETypeStatutContactServeurSamlSvcW["Scs_Erreur"] = "Scs_Erreur";
})(
  ETypeStatutContactServeurSamlSvcW ||
    (exports.ETypeStatutContactServeurSamlSvcW =
      ETypeStatutContactServeurSamlSvcW =
        {}),
);
class TClaimSaml {
  constructor(aUri, aDescription) {
    this.uri = aUri;
    this.description = aDescription;
  }
  getUri() {
    return this.uri;
  }
  setUri(aUri) {
    this.uri = aUri;
  }
  getDescription() {
    return this.description;
  }
  setDescription(aDescription) {
    this.description = aDescription;
  }
  toString() {
    return (
      "[uri]" +
      this.uri.toString() +
      "\n" +
      "[description]" +
      this.description.toString() +
      "\n"
    );
  }
}
exports.TClaimSaml = TClaimSaml;
class TParametresSaml {
  constructor(
    aUrlMetadataServeur,
    aRevendicationsDisponibles,
    aIdentifiantUnique,
    aAccesDirectAuxEspaces,
    aAccesDirectToutLeTemps,
    aAccesDirectPasDeReponse,
    aURLAccesDirect,
    aAccesInviteSansSaml,
    aURLAccesInviteSansSaml,
    aUrlPublique,
    aUrlLogin,
  ) {
    this.urlMetadataServeur = aUrlMetadataServeur;
    this.revendicationsDisponibles = aRevendicationsDisponibles;
    this.identifiantUnique = aIdentifiantUnique;
    this.accesDirectAuxEspaces = aAccesDirectAuxEspaces;
    this.accesDirectToutLeTemps = aAccesDirectToutLeTemps;
    this.accesDirectPasDeReponse = aAccesDirectPasDeReponse;
    this.urlAccesDirect = aURLAccesDirect;
    this.accesInviteSansSaml = aAccesInviteSansSaml;
    this.urlAccesInviteSansSaml = aURLAccesInviteSansSaml;
    this.urlPublique = aUrlPublique;
    this.urlLogin = aUrlLogin;
  }
  getUrlMetadataServeur() {
    return this.urlMetadataServeur;
  }
  setUrlMetadataServeur(aUrlMetadataServeur) {
    this.urlMetadataServeur = aUrlMetadataServeur;
  }
  getRevendicationsDisponibles() {
    return this.revendicationsDisponibles;
  }
  setRevendicationsDisponibles(aRevendicationsDisponibles) {
    this.revendicationsDisponibles = aRevendicationsDisponibles;
  }
  getIdentifiantUnique() {
    return this.identifiantUnique;
  }
  setIdentifiantUnique(aIdentifiantUnique) {
    this.identifiantUnique = aIdentifiantUnique;
  }
  getAccesDirectAuxEspaces() {
    return this.accesDirectAuxEspaces;
  }
  setAccesDirectAuxEspaces(aAccesDirectAuxEspaces) {
    this.accesDirectAuxEspaces = aAccesDirectAuxEspaces;
  }
  getAccesDirectToutLeTemps() {
    return this.accesDirectToutLeTemps;
  }
  setAccesDirectToutLeTemps(aAccesDirectToutLeTemps) {
    this.accesDirectToutLeTemps = aAccesDirectToutLeTemps;
  }
  getAccesDirectPasDeReponse() {
    return this.accesDirectPasDeReponse;
  }
  setAccesDirectPasDeReponse(aAccesDirectPasDeReponse) {
    this.accesDirectPasDeReponse = aAccesDirectPasDeReponse;
  }
  getUrlAccesDirect() {
    return this.urlAccesDirect;
  }
  setUrlAccesDirect(aUrlAccesDirect) {
    this.urlAccesDirect = aUrlAccesDirect;
  }
  getAccesInviteSansSaml() {
    return this.accesInviteSansSaml;
  }
  setAccesInviteSansSaml(aAccesInviteSansSaml) {
    this.accesInviteSansSaml = aAccesInviteSansSaml;
  }
  getUrlAccesInviteSansSaml() {
    return this.urlAccesInviteSansSaml;
  }
  setUrlAccesInviteSansSaml(aUrlAccesInviteSansSaml) {
    this.urlAccesInviteSansSaml = aUrlAccesInviteSansSaml;
  }
  getUrlPublique() {
    return this.urlPublique;
  }
  setUrlPublique(aUrlPublique) {
    this.urlPublique = aUrlPublique;
  }
  getUrlLogin() {
    return this.urlLogin;
  }
  setUrlLogin(aUrlLogin) {
    this.urlLogin = aUrlLogin;
  }
  toString() {
    return (
      "[urlMetadataServeur]" +
      this.urlMetadataServeur.toString() +
      "\n" +
      "[revendicationsDisponibles]" +
      this.revendicationsDisponibles.toString() +
      "\n" +
      "[identifiantUnique]" +
      this.identifiantUnique.toString() +
      "\n" +
      "[accesDirectAuxEspaces]" +
      this.accesDirectAuxEspaces.toString() +
      "\n" +
      "[accesDirectToutLeTemps]" +
      this.accesDirectToutLeTemps.toString() +
      "\n" +
      "[accesDirectPasDeReponse]" +
      this.accesDirectPasDeReponse.toString() +
      "\n" +
      "[urlAccesDirect]" +
      this.urlAccesDirect.toString() +
      "\n" +
      "[accesInviteSansSaml]" +
      this.accesInviteSansSaml.toString() +
      "\n" +
      "[urlAccesInviteSansSaml]" +
      this.urlAccesInviteSansSaml.toString() +
      "\n" +
      "[urlPublique]" +
      this.urlPublique.toString() +
      "\n" +
      "[urlLogin]" +
      this.urlLogin.toString() +
      "\n"
    );
  }
}
exports.TParametresSaml = TParametresSaml;
class TResultatInterrogationMetadataSaml {
  constructor(aStatutContactServeur, aParametres) {
    this.statutContactServeur = aStatutContactServeur;
    this.parametres = aParametres;
  }
  getStatutContactServeur() {
    return this.statutContactServeur;
  }
  setStatutContactServeur(aStatutContactServeur) {
    this.statutContactServeur = aStatutContactServeur;
  }
  getParametres() {
    return this.parametres;
  }
  setParametres(aParametres) {
    this.parametres = aParametres;
  }
  toString() {
    return (
      "[statutContactServeur]" +
      this.statutContactServeur.toString() +
      "\n" +
      "[parametres]" +
      this.parametres.toString() +
      "\n"
    );
  }
}
exports.TResultatInterrogationMetadataSaml = TResultatInterrogationMetadataSaml;
class ParametreTClaimSaml {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString("Uri", "uri"),
      new WSParametreAppel.ParametreString("Description", "description"),
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
    const lValeur = new TClaimSaml();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTClaimSaml = ParametreTClaimSaml;
class ParametreTParametresSaml {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString(
        "UrlMetadataServeur",
        "urlMetadataServeur",
      ),
      new WSParametreAppel.ParametreArray(
        "RevendicationsDisponibles",
        new ParametreTClaimSaml("item"),
        "revendicationsDisponibles",
      ),
      new WSParametreAppel.ParametreString(
        "IdentifiantUnique",
        "identifiantUnique",
      ),
      new WSParametreAppel.ParametreBoolean(
        "AccesDirectAuxEspaces",
        "accesDirectAuxEspaces",
      ),
      new WSParametreAppel.ParametreBoolean(
        "AccesDirectToutLeTemps",
        "accesDirectToutLeTemps",
      ),
      new WSParametreAppel.ParametreBoolean(
        "AccesDirectPasDeReponse",
        "accesDirectPasDeReponse",
      ),
      new WSParametreAppel.ParametreString("URLAccesDirect", "urlAccesDirect"),
      new WSParametreAppel.ParametreBoolean(
        "AccesInviteSansSaml",
        "accesInviteSansSaml",
      ),
      new WSParametreAppel.ParametreString(
        "URLAccesInviteSansSaml",
        "urlAccesInviteSansSaml",
      ),
      new WSParametreAppel.ParametreString("UrlPublique", "urlPublique"),
      new WSParametreAppel.ParametreString("UrlLogin", "urlLogin"),
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
    const lValeur = new TParametresSaml();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTParametresSaml = ParametreTParametresSaml;
class ParametreTResultatInterrogationMetadataSaml {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString(
        "StatutContactServeur",
        "statutContactServeur",
      ),
      new ParametreTParametresSaml("Parametres", "parametres"),
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
    const lValeur = new TResultatInterrogationMetadataSaml();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTResultatInterrogationMetadataSaml =
  ParametreTResultatInterrogationMetadataSaml;
class WS_GestionSaml {
  getDescription() {
    return {
      nom: "PortGestionSaml",
      url: "GestionSaml",
      operations: [
        {
          nom: "GetParametresSaml",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new ParametreTParametresSaml("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "InitialiserParametresSamlPourCreation",
          tabParamIN: [],
          tabParamOUT: [new ParametreTParametresSaml("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "CreerParametresSaml",
          tabParamIN: [
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresSaml("AParametres"),
          ],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetParametresSaml",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresSaml("AParametres"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetUrlFederationMetataClientSaml",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetServeurSamlContacte",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "VerifierAdresseMetadataSaml",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("AAdresseMetadata"),
          ],
          tabParamOUT: [
            new ParametreTResultatInterrogationMetadataSaml("return"),
          ],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetFederationMetadataSaml",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_GestionSaml = WS_GestionSaml;

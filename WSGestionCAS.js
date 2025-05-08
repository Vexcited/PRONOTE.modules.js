exports.WS_GestionCAS =
  exports.ParametreTModeleConfigENT =
  exports.ParametreTParametresCAS =
  exports.ParametreTAttributCAS =
  exports.ParametreTCorrespEspaceCategories =
  exports.TModeleConfigENT =
  exports.TParametresCAS =
  exports.TAttributCAS =
  exports.TCorrespEspaceCategories =
  exports.ETypeDestExportCasIdProduitSvcW =
  exports.ETypeModePremiereConnexionCasSvcW =
  exports.ETypeAttributUtilisateurCASSvcW =
    void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeAttributUtilisateurCASSvcW;
(function (ETypeAttributUtilisateurCASSvcW) {
  ETypeAttributUtilisateurCASSvcW["AUC_Login"] = "AUC_Login";
  ETypeAttributUtilisateurCASSvcW["AUC_Categories"] = "AUC_Categories";
  ETypeAttributUtilisateurCASSvcW["AUC_Nom"] = "AUC_Nom";
  ETypeAttributUtilisateurCASSvcW["AUC_Prenom"] = "AUC_Prenom";
  ETypeAttributUtilisateurCASSvcW["AUC_DateNaissance"] = "AUC_DateNaissance";
  ETypeAttributUtilisateurCASSvcW["AUC_CodePostal"] = "AUC_CodePostal";
  ETypeAttributUtilisateurCASSvcW["AUC_IdProduit"] = "AUC_IdProduit";
})(
  ETypeAttributUtilisateurCASSvcW ||
    (exports.ETypeAttributUtilisateurCASSvcW = ETypeAttributUtilisateurCASSvcW =
      {}),
);
var ETypeModePremiereConnexionCasSvcW;
(function (ETypeModePremiereConnexionCasSvcW) {
  ETypeModePremiereConnexionCasSvcW["MPC_ChercherParIdentite"] =
    "MPC_ChercherParIdentite";
  ETypeModePremiereConnexionCasSvcW["MPC_ChercherParIdProduit"] =
    "MPC_ChercherParIdProduit";
  ETypeModePremiereConnexionCasSvcW["MPC_DoubleAuth"] = "MPC_DoubleAuth";
  ETypeModePremiereConnexionCasSvcW["MPC_RefuserAcces"] = "MPC_RefuserAcces";
})(
  ETypeModePremiereConnexionCasSvcW ||
    (exports.ETypeModePremiereConnexionCasSvcW =
      ETypeModePremiereConnexionCasSvcW =
        {}),
);
var ETypeDestExportCasIdProduitSvcW;
(function (ETypeDestExportCasIdProduitSvcW) {
  ETypeDestExportCasIdProduitSvcW["DEC_Aucun"] = "DEC_Aucun";
  ETypeDestExportCasIdProduitSvcW["DEC_Kosmos"] = "DEC_Kosmos";
})(
  ETypeDestExportCasIdProduitSvcW ||
    (exports.ETypeDestExportCasIdProduitSvcW = ETypeDestExportCasIdProduitSvcW =
      {}),
);
class TCorrespEspaceCategories {
  constructor(aEspace, aCategories) {
    this.espace = aEspace;
    this.categories = aCategories;
  }
  getEspace() {
    return this.espace;
  }
  setEspace(aEspace) {
    this.espace = aEspace;
  }
  getCategories() {
    return this.categories;
  }
  setCategories(aCategories) {
    this.categories = aCategories;
  }
  toString() {
    return (
      "[espace]" +
      this.espace.toString() +
      "\n" +
      "[categories]" +
      this.categories.toString() +
      "\n"
    );
  }
}
exports.TCorrespEspaceCategories = TCorrespEspaceCategories;
class TAttributCAS {
  constructor(aGenre, aNom) {
    this.genre = aGenre;
    this.nom = aNom;
  }
  getGenre() {
    return this.genre;
  }
  setGenre(aGenre) {
    this.genre = aGenre;
  }
  getNom() {
    return this.nom;
  }
  setNom(aNom) {
    this.nom = aNom;
  }
  toString() {
    return (
      "[genre]" +
      this.genre.toString() +
      "\n" +
      "[nom]" +
      this.nom.toString() +
      "\n"
    );
  }
}
exports.TAttributCAS = TAttributCAS;
class TParametresCAS {
  constructor(
    aConfigStandard,
    aURLServeurCAS,
    aURLAuthentificationCAS,
    aURLValidationCAS,
    aPerso_URLLoginCas,
    aPerso_URLValidationCas,
    aURLClientCAS,
    aAccesDirectAuxEspaces,
    aAccesDirectToutLeTemps,
    aAccesDirectPasDeReponse,
    aURLAccesDirect,
    aAccesInviteSansCAS,
    aURLAccesInviteSansCAS,
    aActivationLogs,
    aCorrespondancesEspacesCategories,
    aAttributsCAS,
    aUtiliserAttributLogin,
    aModePremiereConnexion,
    aModelePersonnalise,
    aIDModeleConfig,
    aActiverEmail,
    aAdresseEmail,
  ) {
    this.configStandard = aConfigStandard;
    this.urlServeurCAS = aURLServeurCAS;
    this.urlAuthentificationCAS = aURLAuthentificationCAS;
    this.urlValidationCAS = aURLValidationCAS;
    this.urlLoginPerso = aPerso_URLLoginCas;
    this.urlValidPerso = aPerso_URLValidationCas;
    this.urlClientCAS = aURLClientCAS;
    this.accesDirectAuxEspaces = aAccesDirectAuxEspaces;
    this.accesDirectToutLeTemps = aAccesDirectToutLeTemps;
    this.accesDirectPasDeReponse = aAccesDirectPasDeReponse;
    this.urlAccesDirect = aURLAccesDirect;
    this.accesInviteSansCAS = aAccesInviteSansCAS;
    this.urlAccesInviteSansCAS = aURLAccesInviteSansCAS;
    this.activationLogs = aActivationLogs;
    this.correspondancesEspacesCategories = aCorrespondancesEspacesCategories;
    this.attributsCAS = aAttributsCAS;
    this.utiliserAttributLogin = aUtiliserAttributLogin;
    this.modePremiereConnexion = aModePremiereConnexion;
    this.modelePersonnalise = aModelePersonnalise;
    this.idModeleConfig = aIDModeleConfig;
    this.activerEmail = aActiverEmail;
    this.adresseEmail = aAdresseEmail;
  }
  getConfigStandard() {
    return this.configStandard;
  }
  setConfigStandard(aConfigStandard) {
    this.configStandard = aConfigStandard;
  }
  getUrlServeurCAS() {
    return this.urlServeurCAS;
  }
  setUrlServeurCAS(aUrlServeurCAS) {
    this.urlServeurCAS = aUrlServeurCAS;
  }
  getUrlAuthentificationCAS() {
    return this.urlAuthentificationCAS;
  }
  setUrlAuthentificationCAS(aUrlAuthentificationCAS) {
    this.urlAuthentificationCAS = aUrlAuthentificationCAS;
  }
  getUrlValidationCAS() {
    return this.urlValidationCAS;
  }
  setUrlValidationCAS(aUrlValidationCAS) {
    this.urlValidationCAS = aUrlValidationCAS;
  }
  getUrlLoginPerso() {
    return this.urlLoginPerso;
  }
  setUrlLoginPerso(aUrlLoginPerso) {
    this.urlLoginPerso = aUrlLoginPerso;
  }
  getUrlValidPerso() {
    return this.urlValidPerso;
  }
  setUrlValidPerso(aUrlValidPerso) {
    this.urlValidPerso = aUrlValidPerso;
  }
  getUrlClientCAS() {
    return this.urlClientCAS;
  }
  setUrlClientCAS(aUrlClientCAS) {
    this.urlClientCAS = aUrlClientCAS;
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
  getAccesInviteSansCAS() {
    return this.accesInviteSansCAS;
  }
  setAccesInviteSansCAS(aAccesInviteSansCAS) {
    this.accesInviteSansCAS = aAccesInviteSansCAS;
  }
  getUrlAccesInviteSansCAS() {
    return this.urlAccesInviteSansCAS;
  }
  setUrlAccesInviteSansCAS(aUrlAccesInviteSansCAS) {
    this.urlAccesInviteSansCAS = aUrlAccesInviteSansCAS;
  }
  getActivationLogs() {
    return this.activationLogs;
  }
  setActivationLogs(aActivationLogs) {
    this.activationLogs = aActivationLogs;
  }
  getCorrespondancesEspacesCategories() {
    return this.correspondancesEspacesCategories;
  }
  setCorrespondancesEspacesCategories(aCorrespondancesEspacesCategories) {
    this.correspondancesEspacesCategories = aCorrespondancesEspacesCategories;
  }
  getAttributsCAS() {
    return this.attributsCAS;
  }
  setAttributsCAS(aAttributsCAS) {
    this.attributsCAS = aAttributsCAS;
  }
  getUtiliserAttributLogin() {
    return this.utiliserAttributLogin;
  }
  setUtiliserAttributLogin(aUtiliserAttributLogin) {
    this.utiliserAttributLogin = aUtiliserAttributLogin;
  }
  getModePremiereConnexion() {
    return this.modePremiereConnexion;
  }
  setModePremiereConnexion(aModePremiereConnexion) {
    this.modePremiereConnexion = aModePremiereConnexion;
  }
  getModelePersonnalise() {
    return this.modelePersonnalise;
  }
  setModelePersonnalise(aModelePersonnalise) {
    this.modelePersonnalise = aModelePersonnalise;
  }
  getIdModeleConfig() {
    return this.idModeleConfig;
  }
  setIdModeleConfig(aIdModeleConfig) {
    this.idModeleConfig = aIdModeleConfig;
  }
  getActiverEmail() {
    return this.activerEmail;
  }
  setActiverEmail(aActiverEmail) {
    this.activerEmail = aActiverEmail;
  }
  getAdresseEmail() {
    return this.adresseEmail;
  }
  setAdresseEmail(aAdresseEmail) {
    this.adresseEmail = aAdresseEmail;
  }
  toString() {
    return (
      "[configStandard]" +
      this.configStandard.toString() +
      "\n" +
      "[urlServeurCAS]" +
      this.urlServeurCAS.toString() +
      "\n" +
      "[urlAuthentificationCAS]" +
      this.urlAuthentificationCAS.toString() +
      "\n" +
      "[urlValidationCAS]" +
      this.urlValidationCAS.toString() +
      "\n" +
      "[urlLoginPerso]" +
      this.urlLoginPerso.toString() +
      "\n" +
      "[urlValidPerso]" +
      this.urlValidPerso.toString() +
      "\n" +
      "[urlClientCAS]" +
      this.urlClientCAS.toString() +
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
      "[accesInviteSansCAS]" +
      this.accesInviteSansCAS.toString() +
      "\n" +
      "[urlAccesInviteSansCAS]" +
      this.urlAccesInviteSansCAS.toString() +
      "\n" +
      "[activationLogs]" +
      this.activationLogs.toString() +
      "\n" +
      "[correspondancesEspacesCategories]" +
      this.correspondancesEspacesCategories.toString() +
      "\n" +
      "[attributsCAS]" +
      this.attributsCAS.toString() +
      "\n" +
      "[utiliserAttributLogin]" +
      this.utiliserAttributLogin.toString() +
      "\n" +
      "[modePremiereConnexion]" +
      this.modePremiereConnexion.toString() +
      "\n" +
      "[modelePersonnalise]" +
      this.modelePersonnalise.toString() +
      "\n" +
      "[idModeleConfig]" +
      this.idModeleConfig.toString() +
      "\n" +
      "[activerEmail]" +
      this.activerEmail.toString() +
      "\n" +
      "[adresseEmail]" +
      this.adresseEmail.toString() +
      "\n"
    );
  }
}
exports.TParametresCAS = TParametresCAS;
class TModeleConfigENT {
  constructor(aIDModeleConfig, aLibelle, aDescription, aURLDocumentation) {
    this.idModeleConfig = aIDModeleConfig;
    this.libelle = aLibelle;
    this.description = aDescription;
    this.urlDocumentation = aURLDocumentation;
  }
  getIdModeleConfig() {
    return this.idModeleConfig;
  }
  setIdModeleConfig(aIdModeleConfig) {
    this.idModeleConfig = aIdModeleConfig;
  }
  getLibelle() {
    return this.libelle;
  }
  setLibelle(aLibelle) {
    this.libelle = aLibelle;
  }
  getDescription() {
    return this.description;
  }
  setDescription(aDescription) {
    this.description = aDescription;
  }
  getUrlDocumentation() {
    return this.urlDocumentation;
  }
  setUrlDocumentation(aUrlDocumentation) {
    this.urlDocumentation = aUrlDocumentation;
  }
  toString() {
    return (
      "[idModeleConfig]" +
      this.idModeleConfig.toString() +
      "\n" +
      "[libelle]" +
      this.libelle.toString() +
      "\n" +
      "[description]" +
      this.description.toString() +
      "\n" +
      "[urlDocumentation]" +
      this.urlDocumentation.toString() +
      "\n"
    );
  }
}
exports.TModeleConfigENT = TModeleConfigENT;
class ParametreTCorrespEspaceCategories {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreNumber("Espace", "espace"),
      new WSParametreAppel.ParametreString("Categories", "categories"),
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
    const lValeur = new TCorrespEspaceCategories();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTCorrespEspaceCategories = ParametreTCorrespEspaceCategories;
class ParametreTAttributCAS {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString("Genre", "genre"),
      new WSParametreAppel.ParametreString("Nom", "nom"),
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
    const lValeur = new TAttributCAS();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTAttributCAS = ParametreTAttributCAS;
class ParametreTParametresCAS {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreBoolean("ConfigStandard", "configStandard"),
      new WSParametreAppel.ParametreString("URLServeurCAS", "urlServeurCAS"),
      new WSParametreAppel.ParametreString(
        "URLAuthentificationCAS",
        "urlAuthentificationCAS",
      ),
      new WSParametreAppel.ParametreString(
        "URLValidationCAS",
        "urlValidationCAS",
      ),
      new WSParametreAppel.ParametreString(
        "Perso_URLLoginCas",
        "urlLoginPerso",
      ),
      new WSParametreAppel.ParametreString(
        "Perso_URLValidationCas",
        "urlValidPerso",
      ),
      new WSParametreAppel.ParametreString("URLClientCAS", "urlClientCAS"),
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
        "AccesInviteSansCAS",
        "accesInviteSansCAS",
      ),
      new WSParametreAppel.ParametreString(
        "URLAccesInviteSansCAS",
        "urlAccesInviteSansCAS",
      ),
      new WSParametreAppel.ParametreBoolean("ActivationLogs", "activationLogs"),
      new WSParametreAppel.ParametreArray(
        "CorrespondancesEspacesCategories",
        new ParametreTCorrespEspaceCategories("item"),
        "correspondancesEspacesCategories",
      ),
      new WSParametreAppel.ParametreArray(
        "AttributsCAS",
        new ParametreTAttributCAS("item"),
        "attributsCAS",
      ),
      new WSParametreAppel.ParametreBoolean(
        "UtiliserAttributLogin",
        "utiliserAttributLogin",
      ),
      new WSParametreAppel.ParametreString(
        "ModePremiereConnexion",
        "modePremiereConnexion",
      ),
      new WSParametreAppel.ParametreBoolean(
        "ModelePersonnalise",
        "modelePersonnalise",
      ),
      new WSParametreAppel.ParametreNumber("IDModeleConfig", "idModeleConfig"),
      new WSParametreAppel.ParametreBoolean("ActiverEmail", "activerEmail"),
      new WSParametreAppel.ParametreString("AdresseEmail", "adresseEmail"),
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
    const lValeur = new TParametresCAS();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTParametresCAS = ParametreTParametresCAS;
class ParametreTModeleConfigENT {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreNumber("IDModeleConfig", "idModeleConfig"),
      new WSParametreAppel.ParametreString("Libelle", "libelle"),
      new WSParametreAppel.ParametreString("Description", "description"),
      new WSParametreAppel.ParametreString(
        "URLDocumentation",
        "urlDocumentation",
      ),
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
    const lValeur = new TModeleConfigENT();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTModeleConfigENT = ParametreTModeleConfigENT;
class WS_GestionCAS {
  getDescription() {
    return {
      nom: "PortGestionCAS",
      url: "GestionCAS",
      operations: [
        {
          nom: "GetParametresCAS",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new ParametreTParametresCAS("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "InitialiserParametresCASPourCreation",
          tabParamIN: [],
          tabParamOUT: [new ParametreTParametresCAS("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "CreerParametresCAS",
          tabParamIN: [
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresCAS("AParametresCAS"),
          ],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetParametresCAS",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresCAS("AParametresCAS"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetModelesConfigENT",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [
            new WSParametreAppel.ParametreArray(
              "return",
              new ParametreTModeleConfigENT("item"),
            ),
          ],
          tabParamEXCEPT: [],
        },
        {
          nom: "AppliquerModeleConfigENT",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreNumber("AIdModele"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetModeleConfigCAS",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreNumber("AIdModele"),
          ],
          tabParamOUT: [new ParametreTParametresCAS("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "MAJModelesConfigENT",
          tabParamIN: [],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetURLServeurCAS",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("AURLServeurCAS"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_GestionCAS = WS_GestionCAS;

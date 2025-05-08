exports.WS_PublicationServeurHttp =
  exports.ParametreTInfosPublicationHttp =
  exports.ParametreTEspaceSvcW =
  exports.TInfosPublicationHttp =
  exports.TEspaceSvcW =
  exports.ETypeGenreTerminal =
    void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeGenreTerminal;
(function (ETypeGenreTerminal) {
  ETypeGenreTerminal["GT_StationTravail"] = "GT_StationTravail";
  ETypeGenreTerminal["GT_Mobile"] = "GT_Mobile";
})(
  ETypeGenreTerminal || (exports.ETypeGenreTerminal = ETypeGenreTerminal = {}),
);
class TEspaceSvcW {
  constructor(
    aIdentifiant,
    aTypeEspace,
    aGenreTerminal,
    aUrl,
    aPublie,
    aNbUtilisateursConnectes,
    aUrlPersonnalise,
    aOrdinal,
    aEstExcluDeLaDelegation,
  ) {
    this.identifiant = aIdentifiant;
    this.typeEspace = aTypeEspace;
    this.genreTerminal = aGenreTerminal;
    this.url = aUrl;
    this.publie = aPublie;
    this.nbUtilisateursConnectes = aNbUtilisateursConnectes;
    this.urlPersonnalise = aUrlPersonnalise;
    this.ordinal = aOrdinal;
    this.estExcluDeLaDelegation = aEstExcluDeLaDelegation;
  }
  getIdentifiant() {
    return this.identifiant;
  }
  setIdentifiant(aIdentifiant) {
    this.identifiant = aIdentifiant;
  }
  getTypeEspace() {
    return this.typeEspace;
  }
  setTypeEspace(aTypeEspace) {
    this.typeEspace = aTypeEspace;
  }
  getGenreTerminal() {
    return this.genreTerminal;
  }
  setGenreTerminal(aGenreTerminal) {
    this.genreTerminal = aGenreTerminal;
  }
  getUrl() {
    return this.url;
  }
  setUrl(aUrl) {
    this.url = aUrl;
  }
  getPublie() {
    return this.publie;
  }
  setPublie(aPublie) {
    this.publie = aPublie;
  }
  getNbUtilisateursConnectes() {
    return this.nbUtilisateursConnectes;
  }
  setNbUtilisateursConnectes(aNbUtilisateursConnectes) {
    this.nbUtilisateursConnectes = aNbUtilisateursConnectes;
  }
  getUrlPersonnalise() {
    return this.urlPersonnalise;
  }
  setUrlPersonnalise(aUrlPersonnalise) {
    this.urlPersonnalise = aUrlPersonnalise;
  }
  getOrdinal() {
    return this.ordinal;
  }
  setOrdinal(aOrdinal) {
    this.ordinal = aOrdinal;
  }
  getEstExcluDeLaDelegation() {
    return this.estExcluDeLaDelegation;
  }
  setEstExcluDeLaDelegation(aEstExcluDeLaDelegation) {
    this.estExcluDeLaDelegation = aEstExcluDeLaDelegation;
  }
  toString() {
    return (
      "[identifiant]" +
      this.identifiant.toString() +
      "\n" +
      "[typeEspace]" +
      this.typeEspace.toString() +
      "\n" +
      "[genreTerminal]" +
      this.genreTerminal.toString() +
      "\n" +
      "[url]" +
      this.url.toString() +
      "\n" +
      "[publie]" +
      this.publie.toString() +
      "\n" +
      "[nbUtilisateursConnectes]" +
      this.nbUtilisateursConnectes.toString() +
      "\n" +
      "[urlPersonnalise]" +
      this.urlPersonnalise.toString() +
      "\n" +
      "[ordinal]" +
      this.ordinal.toString() +
      "\n" +
      "[estExcluDeLaDelegation]" +
      this.estExcluDeLaDelegation.toString() +
      "\n"
    );
  }
}
exports.TEspaceSvcW = TEspaceSvcW;
class TInfosPublicationHttp {
  constructor(
    aAdressePublique,
    aAutoPublication,
    aHistoriqueAccessible,
    aEspaces,
    aAvecGestionENT,
    aAvecGestionDelegationParEspace,
  ) {
    this.adressePublique = aAdressePublique;
    this.autoPublication = aAutoPublication;
    this.historiqueAccessible = aHistoriqueAccessible;
    this.espaces = aEspaces;
    this.avecGestionENT = aAvecGestionENT;
    this.avecGestionDelegationParEspace = aAvecGestionDelegationParEspace;
  }
  getAdressePublique() {
    return this.adressePublique;
  }
  setAdressePublique(aAdressePublique) {
    this.adressePublique = aAdressePublique;
  }
  getAutoPublication() {
    return this.autoPublication;
  }
  setAutoPublication(aAutoPublication) {
    this.autoPublication = aAutoPublication;
  }
  getHistoriqueAccessible() {
    return this.historiqueAccessible;
  }
  setHistoriqueAccessible(aHistoriqueAccessible) {
    this.historiqueAccessible = aHistoriqueAccessible;
  }
  getEspaces() {
    return this.espaces;
  }
  setEspaces(aEspaces) {
    this.espaces = aEspaces;
  }
  getAvecGestionENT() {
    return this.avecGestionENT;
  }
  setAvecGestionENT(aAvecGestionENT) {
    this.avecGestionENT = aAvecGestionENT;
  }
  getAvecGestionDelegationParEspace() {
    return this.avecGestionDelegationParEspace;
  }
  setAvecGestionDelegationParEspace(aAvecGestionDelegationParEspace) {
    this.avecGestionDelegationParEspace = aAvecGestionDelegationParEspace;
  }
  toString() {
    return (
      "[adressePublique]" +
      this.adressePublique.toString() +
      "\n" +
      "[autoPublication]" +
      this.autoPublication.toString() +
      "\n" +
      "[historiqueAccessible]" +
      this.historiqueAccessible.toString() +
      "\n" +
      "[espaces]" +
      this.espaces.toString() +
      "\n" +
      "[avecGestionENT]" +
      this.avecGestionENT.toString() +
      "\n" +
      "[avecGestionDelegationParEspace]" +
      this.avecGestionDelegationParEspace.toString() +
      "\n"
    );
  }
}
exports.TInfosPublicationHttp = TInfosPublicationHttp;
class ParametreTEspaceSvcW {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString("Identifiant", "identifiant"),
      new WSParametreAppel.ParametreString("TypeEspace", "typeEspace"),
      new WSParametreAppel.ParametreString("GenreTerminal", "genreTerminal"),
      new WSParametreAppel.ParametreString("Url", "url"),
      new WSParametreAppel.ParametreBoolean("Publie", "publie"),
      new WSParametreAppel.ParametreNumber(
        "NbUtilisateursConnectes",
        "nbUtilisateursConnectes",
      ),
      new WSParametreAppel.ParametreBoolean(
        "UrlPersonnalise",
        "urlPersonnalise",
      ),
      new WSParametreAppel.ParametreNumber("Ordinal", "ordinal"),
      new WSParametreAppel.ParametreBoolean(
        "EstExcluDeLaDelegation",
        "estExcluDeLaDelegation",
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
    const lValeur = new TEspaceSvcW();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTEspaceSvcW = ParametreTEspaceSvcW;
class ParametreTInfosPublicationHttp {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString(
        "AdressePublique",
        "adressePublique",
      ),
      new WSParametreAppel.ParametreBoolean(
        "AutoPublication",
        "autoPublication",
      ),
      new WSParametreAppel.ParametreBoolean(
        "HistoriqueAccessible",
        "historiqueAccessible",
      ),
      new WSParametreAppel.ParametreArray(
        "Espaces",
        new ParametreTEspaceSvcW("item"),
        "espaces",
      ),
      new WSParametreAppel.ParametreBoolean("AvecGestionENT", "avecGestionENT"),
      new WSParametreAppel.ParametreBoolean(
        "AvecGestionDelegationParEspace",
        "avecGestionDelegationParEspace",
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
    const lValeur = new TInfosPublicationHttp();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTInfosPublicationHttp = ParametreTInfosPublicationHttp;
class WS_PublicationServeurHttp {
  getDescription() {
    return {
      nom: "PortPublicationServeurHttp",
      url: "PublicationServeurHttp",
      operations: [
        { nom: "Arreter", tabParamIN: [], tabParamOUT: [], tabParamEXCEPT: [] },
        { nom: "Publier", tabParamIN: [], tabParamOUT: [], tabParamEXCEPT: [] },
        {
          nom: "GetInfosPublication",
          tabParamIN: [],
          tabParamOUT: [new ParametreTInfosPublicationHttp("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetURLPublique",
          tabParamIN: [new WSParametreAppel.ParametreString("AAdresse")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetPortPrive",
          tabParamIN: [new WSParametreAppel.ParametreNumber("APort")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetRacinePrive",
          tabParamIN: [new WSParametreAppel.ParametreString("APrefixe")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetProtocoleSecurise",
          tabParamIN: [new WSParametreAppel.ParametreBoolean("ASecurise")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetAutoPublication",
          tabParamIN: [
            new WSParametreAppel.ParametreBoolean("AAutoPublication"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetHistoriqueAccessible",
          tabParamIN: [
            new WSParametreAppel.ParametreBoolean("AHistoriqueAccessible"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetPublicationEspace",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdentifiantEspace"),
            new WSParametreAppel.ParametreBoolean("APublication"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetActiverUrlPersonnalise",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdentifiantEspace"),
            new WSParametreAppel.ParametreBoolean("AActiver"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetUrlPersonnalise",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdentifiantEspace"),
            new WSParametreAppel.ParametreString("AUrl"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetActivationCookies",
          tabParamIN: [new WSParametreAppel.ParametreBoolean("AActif")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetUrlLogoDepartement",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AUrlImage"),
            new WSParametreAppel.ParametreString("AUrlLien"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetEspacesAExclureDeLaDelegation",
          tabParamIN: [],
          tabParamOUT: [
            new WSParametreAppel.ParametreArray(
              "return",
              new WSParametreAppel.ParametreNumber("item"),
            ),
          ],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetEspacesAExclureDeLaDelegation",
          tabParamIN: [
            new WSParametreAppel.ParametreArray(
              "AEspaces",
              new WSParametreAppel.ParametreNumber("item"),
            ),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_PublicationServeurHttp = WS_PublicationServeurHttp;

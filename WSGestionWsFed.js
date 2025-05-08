exports.WS_GestionWsFed =
  exports.ParametreTResultatInterrogationMetadata =
  exports.ParametreTParametresWsFed =
  exports.ParametreTCorrespProfilsUtilisateurGroupes =
  exports.ParametreTClaim =
  exports.ParametreTCorrespondanceAttributNamespce =
  exports.TResultatInterrogationMetadata =
  exports.TParametresWsFed =
  exports.TCorrespProfilsUtilisateurGroupes =
  exports.TClaim =
  exports.TCorrespondanceAttributNamespce =
  exports.ETypeProfilUtilisateurSvcW =
  exports.ETypeStatutContactServeurSvcW =
  exports.ETypeAttributUtilisateurWsFedSvcW =
    void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeAttributUtilisateurWsFedSvcW;
(function (ETypeAttributUtilisateurWsFedSvcW) {
  ETypeAttributUtilisateurWsFedSvcW["Auwf_IdentifiantUnique"] =
    "Auwf_IdentifiantUnique";
  ETypeAttributUtilisateurWsFedSvcW["Auwf_Nom"] = "Auwf_Nom";
  ETypeAttributUtilisateurWsFedSvcW["Auwf_Prenom"] = "Auwf_Prenom";
  ETypeAttributUtilisateurWsFedSvcW["Auwf_DateNaissance"] =
    "Auwf_DateNaissance";
  ETypeAttributUtilisateurWsFedSvcW["Auwf_CodePostal"] = "Auwf_CodePostal";
  ETypeAttributUtilisateurWsFedSvcW["Auwf_Groupe"] = "Auwf_Groupe";
})(
  ETypeAttributUtilisateurWsFedSvcW ||
    (exports.ETypeAttributUtilisateurWsFedSvcW =
      ETypeAttributUtilisateurWsFedSvcW =
        {}),
);
var ETypeStatutContactServeurSvcW;
(function (ETypeStatutContactServeurSvcW) {
  ETypeStatutContactServeurSvcW["Scs_Inconnu"] = "Scs_Inconnu";
  ETypeStatutContactServeurSvcW["Scs_Contacte"] = "Scs_Contacte";
  ETypeStatutContactServeurSvcW["Scs_EnCours"] = "Scs_EnCours";
  ETypeStatutContactServeurSvcW["Scs_Erreur"] = "Scs_Erreur";
})(
  ETypeStatutContactServeurSvcW ||
    (exports.ETypeStatutContactServeurSvcW = ETypeStatutContactServeurSvcW =
      {}),
);
var ETypeProfilUtilisateurSvcW;
(function (ETypeProfilUtilisateurSvcW) {
  ETypeProfilUtilisateurSvcW["Pu_Inconnu"] = "Pu_Inconnu";
  ETypeProfilUtilisateurSvcW["Pu_Professeurs"] = "Pu_Professeurs";
  ETypeProfilUtilisateurSvcW["Pu_Eleves"] = "Pu_Eleves";
  ETypeProfilUtilisateurSvcW["Pu_Parents"] = "Pu_Parents";
  ETypeProfilUtilisateurSvcW["Pu_MaitresDeStage"] = "Pu_MaitresDeStage";
  ETypeProfilUtilisateurSvcW["Pu_Inspecteurs"] = "Pu_Inspecteurs";
  ETypeProfilUtilisateurSvcW["Pu_PersonnelsAdministratifs"] =
    "Pu_PersonnelsAdministratifs";
  ETypeProfilUtilisateurSvcW["Pu_PersonnelsTechniques"] =
    "Pu_PersonnelsTechniques";
})(
  ETypeProfilUtilisateurSvcW ||
    (exports.ETypeProfilUtilisateurSvcW = ETypeProfilUtilisateurSvcW = {}),
);
class TCorrespondanceAttributNamespce {
  constructor(aAttribut, aNamespace) {
    this.attribut = aAttribut;
    this.namespace = aNamespace;
  }
  getAttribut() {
    return this.attribut;
  }
  setAttribut(aAttribut) {
    this.attribut = aAttribut;
  }
  getNamespace() {
    return this.namespace;
  }
  setNamespace(aNamespace) {
    this.namespace = aNamespace;
  }
  toString() {
    return (
      "[attribut]" +
      this.attribut.toString() +
      "\n" +
      "[namespace]" +
      this.namespace.toString() +
      "\n"
    );
  }
}
exports.TCorrespondanceAttributNamespce = TCorrespondanceAttributNamespce;
class TClaim {
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
exports.TClaim = TClaim;
class TCorrespProfilsUtilisateurGroupes {
  constructor(aProfilUtilisateur, aGroupes) {
    this.profilUtilisateur = aProfilUtilisateur;
    this.groupes = aGroupes;
  }
  getProfilUtilisateur() {
    return this.profilUtilisateur;
  }
  setProfilUtilisateur(aProfilUtilisateur) {
    this.profilUtilisateur = aProfilUtilisateur;
  }
  getGroupes() {
    return this.groupes;
  }
  setGroupes(aGroupes) {
    this.groupes = aGroupes;
  }
  toString() {
    return (
      "[profilUtilisateur]" +
      this.profilUtilisateur.toString() +
      "\n" +
      "[groupes]" +
      this.groupes.toString() +
      "\n"
    );
  }
}
exports.TCorrespProfilsUtilisateurGroupes = TCorrespProfilsUtilisateurGroupes;
class TParametresWsFed {
  constructor(
    aUrlMetadataServeur,
    aRevendicationsDisponibles,
    aCorrespondancesRevendications,
    aRechercheParIdentite,
    aCorrespondancesProfilsUtilisateurGroupes,
    aAccesDirectAuxEspaces,
    aAccesDirectToutLeTemps,
    aAccesDirectPasDeReponse,
    aURLAccesDirect,
    aAccesInviteSansWsFed,
    aURLAccesInviteSansWsFed,
    aUrlPublique,
    aUseEntityIdForce,
    aUrlLogin,
  ) {
    this.urlMetadataServeur = aUrlMetadataServeur;
    this.revendicationsDisponibles = aRevendicationsDisponibles;
    this.correspondancesRevendications = aCorrespondancesRevendications;
    this.rechercheParIdentite = aRechercheParIdentite;
    this.correspondancesProfilsUtilisateurGroupes =
      aCorrespondancesProfilsUtilisateurGroupes;
    this.accesDirectAuxEspaces = aAccesDirectAuxEspaces;
    this.accesDirectToutLeTemps = aAccesDirectToutLeTemps;
    this.accesDirectPasDeReponse = aAccesDirectPasDeReponse;
    this.urlAccesDirect = aURLAccesDirect;
    this.accesInviteSansWsFed = aAccesInviteSansWsFed;
    this.urlAccesInviteSansWsFed = aURLAccesInviteSansWsFed;
    this.urlPublique = aUrlPublique;
    this.useEntityIdForce = aUseEntityIdForce;
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
  getCorrespondancesRevendications() {
    return this.correspondancesRevendications;
  }
  setCorrespondancesRevendications(aCorrespondancesRevendications) {
    this.correspondancesRevendications = aCorrespondancesRevendications;
  }
  getRechercheParIdentite() {
    return this.rechercheParIdentite;
  }
  setRechercheParIdentite(aRechercheParIdentite) {
    this.rechercheParIdentite = aRechercheParIdentite;
  }
  getCorrespondancesProfilsUtilisateurGroupes() {
    return this.correspondancesProfilsUtilisateurGroupes;
  }
  setCorrespondancesProfilsUtilisateurGroupes(
    aCorrespondancesProfilsUtilisateurGroupes,
  ) {
    this.correspondancesProfilsUtilisateurGroupes =
      aCorrespondancesProfilsUtilisateurGroupes;
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
  getAccesInviteSansWsFed() {
    return this.accesInviteSansWsFed;
  }
  setAccesInviteSansWsFed(aAccesInviteSansWsFed) {
    this.accesInviteSansWsFed = aAccesInviteSansWsFed;
  }
  getUrlAccesInviteSansWsFed() {
    return this.urlAccesInviteSansWsFed;
  }
  setUrlAccesInviteSansWsFed(aUrlAccesInviteSansWsFed) {
    this.urlAccesInviteSansWsFed = aUrlAccesInviteSansWsFed;
  }
  getUrlPublique() {
    return this.urlPublique;
  }
  setUrlPublique(aUrlPublique) {
    this.urlPublique = aUrlPublique;
  }
  getUseEntityIdForce() {
    return this.useEntityIdForce;
  }
  setUseEntityIdForce(aUseEntityIdForce) {
    this.useEntityIdForce = aUseEntityIdForce;
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
      "[correspondancesRevendications]" +
      this.correspondancesRevendications.toString() +
      "\n" +
      "[rechercheParIdentite]" +
      this.rechercheParIdentite.toString() +
      "\n" +
      "[correspondancesProfilsUtilisateurGroupes]" +
      this.correspondancesProfilsUtilisateurGroupes.toString() +
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
      "[accesInviteSansWsFed]" +
      this.accesInviteSansWsFed.toString() +
      "\n" +
      "[urlAccesInviteSansWsFed]" +
      this.urlAccesInviteSansWsFed.toString() +
      "\n" +
      "[urlPublique]" +
      this.urlPublique.toString() +
      "\n" +
      "[useEntityIdForce]" +
      this.useEntityIdForce.toString() +
      "\n" +
      "[urlLogin]" +
      this.urlLogin.toString() +
      "\n"
    );
  }
}
exports.TParametresWsFed = TParametresWsFed;
class TResultatInterrogationMetadata {
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
exports.TResultatInterrogationMetadata = TResultatInterrogationMetadata;
class ParametreTCorrespondanceAttributNamespce {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString("Attribut", "attribut"),
      new WSParametreAppel.ParametreString("Namespace", "namespace"),
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
    const lValeur = new TCorrespondanceAttributNamespce();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTCorrespondanceAttributNamespce =
  ParametreTCorrespondanceAttributNamespce;
class ParametreTClaim {
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
    const lValeur = new TClaim();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTClaim = ParametreTClaim;
class ParametreTCorrespProfilsUtilisateurGroupes {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString(
        "ProfilUtilisateur",
        "profilUtilisateur",
      ),
      new WSParametreAppel.ParametreString("Groupes", "groupes"),
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
    const lValeur = new TCorrespProfilsUtilisateurGroupes();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTCorrespProfilsUtilisateurGroupes =
  ParametreTCorrespProfilsUtilisateurGroupes;
class ParametreTParametresWsFed {
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
        new ParametreTClaim("item"),
        "revendicationsDisponibles",
      ),
      new WSParametreAppel.ParametreArray(
        "CorrespondancesRevendications",
        new ParametreTCorrespondanceAttributNamespce("item"),
        "correspondancesRevendications",
      ),
      new WSParametreAppel.ParametreBoolean(
        "RechercheParIdentite",
        "rechercheParIdentite",
      ),
      new WSParametreAppel.ParametreArray(
        "CorrespondancesProfilsUtilisateurGroupes",
        new ParametreTCorrespProfilsUtilisateurGroupes("item"),
        "correspondancesProfilsUtilisateurGroupes",
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
        "AccesInviteSansWsFed",
        "accesInviteSansWsFed",
      ),
      new WSParametreAppel.ParametreString(
        "URLAccesInviteSansWsFed",
        "urlAccesInviteSansWsFed",
      ),
      new WSParametreAppel.ParametreString("UrlPublique", "urlPublique"),
      new WSParametreAppel.ParametreBoolean(
        "UseEntityIdForce",
        "useEntityIdForce",
      ),
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
    const lValeur = new TParametresWsFed();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTParametresWsFed = ParametreTParametresWsFed;
class ParametreTResultatInterrogationMetadata {
  constructor(aNom, aNomJs) {
    this.nom = aNom;
    this.nomJs = aNomJs || aNom;
    this.parametreObject = new WSParametreAppel.ParametreObject([
      new WSParametreAppel.ParametreString(
        "StatutContactServeur",
        "statutContactServeur",
      ),
      new ParametreTParametresWsFed("Parametres", "parametres"),
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
    const lValeur = new TResultatInterrogationMetadata();
    this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
    return lValeur;
  }
}
exports.ParametreTResultatInterrogationMetadata =
  ParametreTResultatInterrogationMetadata;
class WS_GestionWsFed {
  getDescription() {
    return {
      nom: "PortGestionWsFed",
      url: "GestionWsFed",
      operations: [
        {
          nom: "GetParametresWsFed",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new ParametreTParametresWsFed("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "InitialiserParametresWsFedPourCreation",
          tabParamIN: [],
          tabParamOUT: [new ParametreTParametresWsFed("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "CreerParametresWsFed",
          tabParamIN: [
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresWsFed("AParametres"),
          ],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetParametresWsFed",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("ANom"),
            new ParametreTParametresWsFed("AParametres"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetUrlFederationMetataClient",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetServeurWsFedContacte",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "VerifierAdresseMetadata",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("AAdresseMetadata"),
          ],
          tabParamOUT: [new ParametreTResultatInterrogationMetadata("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetFederationMetadata",
          tabParamIN: [new WSParametreAppel.ParametreString("AIdParametres")],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetEntityIdForce",
          tabParamIN: [
            new WSParametreAppel.ParametreString("AIdParametres"),
            new WSParametreAppel.ParametreString("AEntityIdForce"),
          ],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_GestionWsFed = WS_GestionWsFed;

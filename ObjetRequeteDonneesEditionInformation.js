const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
const { GCache } = require("Cache.js");
class ObjetRequeteDonneesEditionInformation extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {};
    this.init = aParam.init || false;
    this.JSON.init = this.init;
    if (this.init) {
      this.JSON.avecCategories =
        !GCache || !GCache.general.existeDonnee("listeCategories");
      this.JSON.avecListeIndividusPossiblesPartage =
        !GCache ||
        !GCache.general.existeDonnee("listeIndividusPossiblesPartage");
      this.JSON.tailleMaxTitre =
        !GCache || !GCache.general.existeDonnee("tailleMaxTitre");
    }
    this.avecPublic = aParam.avecPublic || false;
    this.JSON.avecPublic = this.avecPublic;
    if (aParam.avecPublic) {
      aParam.listePublic.setSerialisateurJSON({
        methodeSerialisation: _serialiser_Public.bind(this),
        ignorerEtatsElements: true,
      });
      this.JSON.listePublic = aParam.listePublic;
    }
    this.avecCours = aParam.avecCours || false;
    if (aParam.avecCours) {
      this.JSON.date = aParam.date;
      this.JSON.cours = aParam.cours;
    }
    this.JSON.avecCours = this.avecCours;
    if (aParam.eleve && aParam.punition) {
      this.pourPunition = true;
      this.JSON.eleve = aParam.eleve.toJSON();
      this.JSON.punition = aParam.punition.toJSON();
    }
    if (aParam.incident) {
      this.pourPunition = true;
      this.JSON.incident = aParam.incident.toJSON();
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lResult = {};
    if (this.init) {
      _actionInitApresRequete.bind(this)(lResult);
    }
    if (this.avecPublic || this.avecCours) {
      _actionPublicApresRequete.bind(this)(lResult);
    }
    if (this.pourPunition) {
      _actionPunitionApresRequete.call(this, lResult);
    }
    this.callbackReussite.appel(lResult);
  }
}
Requetes.inscrire(
  "DonneesEditionInformation",
  ObjetRequeteDonneesEditionInformation,
);
function _serialiser_Public(aIndividu, aJSON) {
  aJSON.N = aIndividu.getNumero();
  aJSON.G = aIndividu.getGenre();
  aJSON.E = undefined;
  aJSON.L = undefined;
}
function _actionInitApresRequete(aResult) {
  let lListeCategories;
  if (GCache && GCache.general.existeDonnee("listeCategories")) {
    lListeCategories = GCache.general.getDonnee("listeCategories");
  } else {
    lListeCategories = this.JSONReponse.listeCategories;
    lListeCategories.setTri([ObjetTri.init("Genre"), ObjetTri.init("Libelle")]);
    lListeCategories.trier();
    if (GCache) {
      GCache.general.setDonnee("listeCategories", lListeCategories);
    }
  }
  aResult.listeCategories = lListeCategories;
  let lListeIndividusPossibles;
  if (GCache && GCache.general.existeDonnee("listeIndividusPossiblesPartage")) {
    lListeIndividusPossibles = GCache.general.getDonnee(
      "listeIndividusPossiblesPartage",
    );
  } else {
    lListeIndividusPossibles = this.JSONReponse.listeIndividusPossiblesPartage;
    if (GCache) {
      GCache.general.setDonnee(
        "listeIndividusPossiblesPartage",
        lListeIndividusPossibles,
      );
    }
  }
  aResult.listeIndividusPossiblesPartage = lListeIndividusPossibles;
  let lTailleMaxTitre;
  if (GCache && GCache.general.existeDonnee("tailleMaxTitre")) {
    lTailleMaxTitre = GCache.general.getDonnee("tailleMaxTitre");
  } else {
    lTailleMaxTitre = this.JSONReponse.tailleMaxTitre;
    if (GCache) {
      GCache.general.setDonnee("tailleMaxTitre", lTailleMaxTitre);
    }
  }
  aResult.tailleMaxTitre = lTailleMaxTitre;
}
function _actionPublicApresRequete(aResult) {
  aResult.nombreResponsablesPreferentiel =
    this.JSONReponse.nombreResponsablesPreferentiel;
  aResult.nombreResponsablesSecondaires =
    this.JSONReponse.nombreResponsablesSecondaires;
  aResult.nombreProfsPrincipaux = this.JSONReponse.nombreProfsPrincipaux;
  aResult.nombreTuteurs = this.JSONReponse.nombreTuteurs;
  if (this.avecCours) {
    aResult.listeEleves = this.JSONReponse.listeEleves;
    aResult.equipe = this.JSONReponse.equipe;
  }
}
function _actionPunitionApresRequete(aResult) {
  aResult.titre = this.JSONReponse.titre;
  aResult.texte = this.JSONReponse.texte;
  aResult.categorie = this.JSONReponse.categorie;
  aResult.listePublic = this.JSONReponse.equipe;
}
module.exports = { ObjetRequeteDonneesEditionInformation };

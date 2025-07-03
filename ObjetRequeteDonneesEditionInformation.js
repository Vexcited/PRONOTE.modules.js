exports.ObjetRequeteDonneesEditionInformation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
const Cache_1 = require("Cache");
class ObjetRequeteDonneesEditionInformation extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = {};
		this.init = aParam.init || false;
		this.JSON.init = this.init;
		if (this.init) {
			this.JSON.avecCategories =
				!Cache_1.GCache ||
				!Cache_1.GCache.general.existeDonnee("listeCategories");
			this.JSON.avecListeIndividusPossiblesPartage =
				!Cache_1.GCache ||
				!Cache_1.GCache.general.existeDonnee("listeIndividusPossiblesPartage");
			this.JSON.tailleMaxTitre =
				!Cache_1.GCache ||
				!Cache_1.GCache.general.existeDonnee("tailleMaxTitre");
		}
		this.avecPublic = aParam.avecPublic || false;
		this.JSON.avecPublic = this.avecPublic;
		if (aParam.avecPublic) {
			aParam.listePublic.setSerialisateurJSON({
				methodeSerialisation: this._serialiserPublic.bind(this),
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
			this._actionInitApresRequete(lResult);
		}
		if (this.avecPublic || this.avecCours) {
			this._actionPublicApresRequete(lResult);
		}
		if (this.pourPunition) {
			this._actionPunitionApresRequete(lResult);
		}
		this.callbackReussite.appel(lResult);
	}
	_serialiserPublic(aIndividu, aJSON) {
		aJSON.N = aIndividu.getNumero();
		aJSON.G = aIndividu.getGenre();
		aJSON.E = undefined;
		aJSON.L = undefined;
	}
	_actionInitApresRequete(aResult) {
		let lListeCategories;
		if (
			Cache_1.GCache &&
			Cache_1.GCache.general.existeDonnee("listeCategories")
		) {
			lListeCategories = Cache_1.GCache.general.getDonnee("listeCategories");
		} else {
			lListeCategories = this.JSONReponse.listeCategories;
			lListeCategories.setTri([
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeCategories.trier();
			if (Cache_1.GCache) {
				Cache_1.GCache.general.setDonnee("listeCategories", lListeCategories);
			}
		}
		aResult.listeCategories = lListeCategories;
		let lListeIndividusPossibles;
		if (
			Cache_1.GCache &&
			Cache_1.GCache.general.existeDonnee("listeIndividusPossiblesPartage")
		) {
			lListeIndividusPossibles = Cache_1.GCache.general.getDonnee(
				"listeIndividusPossiblesPartage",
			);
		} else {
			lListeIndividusPossibles =
				this.JSONReponse.listeIndividusPossiblesPartage;
			if (Cache_1.GCache) {
				Cache_1.GCache.general.setDonnee(
					"listeIndividusPossiblesPartage",
					lListeIndividusPossibles,
				);
			}
		}
		aResult.listeIndividusPossiblesPartage = lListeIndividusPossibles;
		let lTailleMaxTitre;
		if (
			Cache_1.GCache &&
			Cache_1.GCache.general.existeDonnee("tailleMaxTitre")
		) {
			lTailleMaxTitre = Cache_1.GCache.general.getDonnee("tailleMaxTitre");
		} else {
			lTailleMaxTitre = this.JSONReponse.tailleMaxTitre;
			if (Cache_1.GCache) {
				Cache_1.GCache.general.setDonnee("tailleMaxTitre", lTailleMaxTitre);
			}
		}
		aResult.tailleMaxTitre = lTailleMaxTitre;
	}
	_actionPublicApresRequete(aResult) {
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
	_actionPunitionApresRequete(aResult) {
		aResult.titre = this.JSONReponse.titre;
		aResult.texte = this.JSONReponse.texte;
		aResult.categorie = this.JSONReponse.categorie;
		aResult.listePublic = this.JSONReponse.equipe;
	}
}
exports.ObjetRequeteDonneesEditionInformation =
	ObjetRequeteDonneesEditionInformation;
CollectionRequetes_1.Requetes.inscrire(
	"DonneesEditionInformation",
	ObjetRequeteDonneesEditionInformation,
);

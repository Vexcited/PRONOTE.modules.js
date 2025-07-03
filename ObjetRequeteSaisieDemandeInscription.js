exports.ObjetRequeteSaisieDemandeInscription = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieDemandeInscription extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		if (aParam.identite && aParam.identite.adresse) {
			this.JSON.identite.adresse1 = aParam.identite.adresse[1];
			this.JSON.identite.adresse2 = aParam.identite.adresse[2];
			this.JSON.identite.adresse3 = aParam.identite.adresse[3];
			this.JSON.identite.adresse4 = aParam.identite.adresse[4];
		}
		if (aParam.scolariteActuelle) {
			if (aParam.scolariteActuelle.optionsChoisies) {
				if (aParam.scolariteActuelle.optionsChoisies.obligatoires) {
					aParam.scolariteActuelle.optionsChoisies.obligatoires.setSerialisateurJSON(
						{
							ignorerEtatsElements: true,
							methodeSerialisation: _serialiseOptions,
						},
					);
				}
				if (aParam.scolariteActuelle.optionsChoisies.facultatives) {
					aParam.scolariteActuelle.optionsChoisies.facultatives.setSerialisateurJSON(
						{
							ignorerEtatsElements: true,
							methodeSerialisation: _serialiseOptions,
						},
					);
				}
				if (aParam.scolariteActuelle.optionsChoisies.lv1) {
					aParam.scolariteActuelle.optionsChoisies.lv1.setSerialisateurJSON({
						ignorerEtatsElements: true,
						methodeSerialisation: _serialiseOptions,
					});
				}
				if (aParam.scolariteActuelle.optionsChoisies.lv2) {
					aParam.scolariteActuelle.optionsChoisies.lv2.setSerialisateurJSON({
						ignorerEtatsElements: true,
						methodeSerialisation: _serialiseOptions,
					});
				}
			}
		}
		if (aParam.documentsFournis) {
			aParam.documentsFournis.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiserDocuments,
			});
			this.JSON.documentsFournis = aParam.documentsFournis;
		}
		if (aParam.responsables) {
			aParam.responsables.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiserResponsable,
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
exports.ObjetRequeteSaisieDemandeInscription =
	ObjetRequeteSaisieDemandeInscription;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieDemandeInscription",
	ObjetRequeteSaisieDemandeInscription,
);
function _serialiserResponsable(aResponsable, aJSON) {
	if (aResponsable && aResponsable.nom) {
		$.extend(aJSON, aResponsable.toJSONAll());
		if (aResponsable.adresse) {
			aJSON.adresse1 = aResponsable.adresse[1];
			aJSON.adresse2 = aResponsable.adresse[2];
			aJSON.adresse3 = aResponsable.adresse[3];
			aJSON.adresse4 = aResponsable.adresse[4];
		}
	}
}
function _serialiseOptions(aOptions, aJSON) {
	aJSON.rangOption = aOptions.Position;
	aJSON.enSuppression = aOptions.enSuppression;
	aJSON.typeModalite = aOptions.typeModalite;
}
function _serialiserDocuments(aDocument, aJSON) {
	aJSON.idFichier = aDocument.idFichier;
	aJSON.nomFichier = aDocument.nomFichier;
	aJSON.nature = aDocument.natureDocument;
}

exports.ObjetRequeteSaisieNotesUnitaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetRequeteSaisieNotesUnitaire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(aPere, aEvenementSurReussite) {
		super(aPere, aEvenementSurReussite);
		this.setOptions({ sansBlocageInterface: true });
	}
	lancerRequete(aParam) {
		if (aParam.note) {
			const lDevoir = MethodesObjet_1.MethodesObjet.dupliquer(aParam.devoir);
			const lEleveDeDevoir = MethodesObjet_1.MethodesObjet.dupliquer(
				aParam.eleve,
			);
			lEleveDeDevoir.note = aParam.note;
			lDevoir.listeEleves =
				new ObjetListeElements_1.ObjetListeElements().addElement(
					lEleveDeDevoir,
				);
			this.JSON.listeDevoirs =
				new ObjetListeElements_1.ObjetListeElements().addElement(lDevoir);
			this.JSON.listeDevoirs.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiseDevoir.bind(this),
			});
		}
		if (aParam.bonusMalus) {
			const lEleve = MethodesObjet_1.MethodesObjet.dupliquer(aParam.eleve);
			lEleve.bonusMalus = aParam.bonusMalus;
			this.JSON.periode = aParam.periode;
			this.JSON.service = aParam.service;
			this.JSON.listeEleves =
				new ObjetListeElements_1.ObjetListeElements().addElement(lEleve);
			this.JSON.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiseEleve.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieNotesUnitaire = ObjetRequeteSaisieNotesUnitaire;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieNotesUnitaire",
	ObjetRequeteSaisieNotesUnitaire,
);
function _serialiseDevoir(aElement, aJSON) {
	aElement.listeEleves.setSerialisateurJSON({
		ignorerEtatsElements: true,
		methodeSerialisation: _serialiseEleveDeDevoir,
	});
	aJSON.listeEleves = aElement.listeEleves;
}
function _serialiseEleveDeDevoir(aElement, AJSON) {
	if (!!aElement.note) {
		AJSON.note = aElement.note;
	}
	if ("commentaire" in aElement) {
		AJSON.commentaire = aElement.commentaire;
	}
}
function _serialiseEleve(aElement, AJSON) {
	if (!!aElement.bonusMalus) {
		AJSON.bonusMalus = aElement.bonusMalus;
	}
}

exports.ObjetRequeteSaisieBlogMediatheque = exports.TypeSaisieMediatheque =
	void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetChaine_1 = require("ObjetChaine");
var TypeSaisieMediatheque;
(function (TypeSaisieMediatheque) {
	TypeSaisieMediatheque["AjouterDocuments"] = "AjouterDocuments";
	TypeSaisieMediatheque["SupprimerDocuments"] = "SupprimerDocuments";
	TypeSaisieMediatheque["SaisieDossier"] = "SaisieDossier";
	TypeSaisieMediatheque["DeplacerDocuments"] = "DeplacerDocuments";
})(
	TypeSaisieMediatheque ||
		(exports.TypeSaisieMediatheque = TypeSaisieMediatheque = {}),
);
class ObjetRequeteSaisieBlogMediatheque extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aTypeSaisie, aParams) {
		this.JSON.typeSaisie = aTypeSaisie;
		if (this.JSON.typeSaisie === TypeSaisieMediatheque.AjouterDocuments) {
			if (aParams.mediatheque) {
				this.JSON.mediatheque = aParams.mediatheque.toJSON();
				this.serialiserMediatheque(aParams.mediatheque, this.JSON.mediatheque);
			}
		} else if (
			this.JSON.typeSaisie === TypeSaisieMediatheque.SupprimerDocuments
		) {
			this.JSON.listeDocuments = aParams.listeDocuments;
			if (this.JSON.listeDocuments) {
				this.JSON.listeDocuments.setSerialisateurJSON({
					methodeSerialisation: this._serialiserDocumentMediatheque.bind(this),
				});
			}
		} else if (this.JSON.typeSaisie === TypeSaisieMediatheque.SaisieDossier) {
			if (aParams.dossierMediatheque) {
				this.JSON.dossierMediatheque = aParams.dossierMediatheque.toJSON();
			}
			if (aParams.dossierMediatheque.mediatheque) {
				this.JSON.mediatheque = aParams.dossierMediatheque.mediatheque.toJSON();
			}
		} else if (
			this.JSON.typeSaisie === TypeSaisieMediatheque.DeplacerDocuments
		) {
			this.JSON.listeDocuments = aParams.listeDocuments;
			if (this.JSON.listeDocuments) {
				this.JSON.listeDocuments.setSerialisateurJSON({
					methodeSerialisation: this._serialiserDocumentMediatheque.bind(this),
					ignorerEtatsElements: true,
				});
			}
			if (aParams.mediatheque) {
				this.JSON.mediatheque = aParams.mediatheque.toJSON();
			}
			if (aParams.dossierMediatheque) {
				this.JSON.dossierMediatheque = aParams.dossierMediatheque.toJSON();
			}
		}
		return this.appelAsynchrone();
	}
	serialiserMediatheque(aMediatheque, aJSON) {
		aJSON.listeDocuments = aMediatheque.listeDocuments;
		if (aJSON.listeDocuments) {
			aJSON.listeDocuments.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDocumentMediatheque.bind(this),
			});
		}
	}
	_serialiserDocumentMediatheque(aDocumentMediatheque, aJSON) {
		if (aDocumentMediatheque.documentCasier) {
			if (aDocumentMediatheque.dossierMediatheque) {
				aJSON.dossierMediatheque =
					aDocumentMediatheque.dossierMediatheque.toJSON();
			}
			aJSON.documentCasier = aDocumentMediatheque.documentCasier.toJSON();
			this._serialiserDocumentCasierMediatheque(
				aDocumentMediatheque.documentCasier,
				aJSON.documentCasier,
			);
		}
	}
	_serialiserDocumentCasierMediatheque(aDocumentCasier, aJSON) {
		const lIdFichier =
			aDocumentCasier.idFichier !== undefined
				? aDocumentCasier.idFichier
				: aDocumentCasier.fichier !== undefined
					? aDocumentCasier.fichier.idFichier
					: null;
		if (lIdFichier !== null) {
			aJSON.idFichier = ObjetChaine_1.GChaine.cardinalToStr(lIdFichier);
		}
		if (aDocumentCasier.url !== null && aDocumentCasier.url !== undefined) {
			aJSON.url = aDocumentCasier.url;
		}
	}
}
exports.ObjetRequeteSaisieBlogMediatheque = ObjetRequeteSaisieBlogMediatheque;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieBlogMediatheque",
	ObjetRequeteSaisieBlogMediatheque,
);

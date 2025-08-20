exports.ObjetRequeteDocumentsATelecharger = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_DocTelechargement_1 = require("Enumere_DocTelechargement");
const MethodesObjet_1 = require("MethodesObjet");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
class ObjetRequeteDocumentsATelecharger extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = Object.assign(
			{ avecNotes: false, avecCompetences: false, listeElevesBIA: undefined },
			aParam,
		);
		if (
			this.JSON.listeElevesBIA &&
			this.JSON.listeElevesBIA.setSerialisateurJSON
		) {
			this.JSON.listeElevesBIA.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lListeCategorie = new ObjetListeElements_1.ObjetListeElements();
		const llistebulletin = new ObjetListeElements_1.ObjetListeElements();
		const lListeDocument = new ObjetListeElements_1.ObjetListeElements();
		const lListeDocumentsSignatureElecASigner =
			new ObjetListeElements_1.ObjetListeElements();
		const lListeDocumentAFournir =
			new ObjetListeElements_1.ObjetListeElements();
		let lDiplome;
		if (
			this.JSONReponse.listeDocuments &&
			this.JSONReponse.listeDocuments.count() > 0
		) {
			this.JSONReponse.listeDocuments.parcourir((aDocument) => {
				const lElement = Object.assign(aDocument, {
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.documents,
					document: aDocument,
					estNonLu: true,
					Genre: 0,
				});
				lListeDocument.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeDocumentsMembre &&
			this.JSONReponse.listeDocumentsMembre.count() > 0
		) {
			this.JSONReponse.listeDocumentsMembre.parcourir((aDocument) => {
				const lElement = Object.assign(aDocument, {
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.documentMembre,
					document: aDocument,
					estNonLu: true,
					Genre: 0,
				});
				lListeDocument.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeProjetsAcc &&
			this.JSONReponse.listeProjetsAcc.count() > 0
		) {
			this.JSONReponse.listeProjetsAcc.parcourir((aDocument) => {
				const lElement = Object.assign(aDocument, {
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.projetAcc,
					projet: aDocument,
					estNonLu: true,
					Genre: 0,
				});
				lListeDocument.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeBulletinsBIA &&
			this.JSONReponse.listeBulletinsBIA.count() > 0
		) {
			this.JSONReponse.listeBulletinsBIA.parcourir((aBulletin) => {
				const lElement = ObjetElement_1.ObjetElement.create({
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletinBIA,
					bulletin: aBulletin,
					annee: aBulletin.annee,
					Genre: 0,
					nomFichier: undefined,
					ident: undefined,
					debutPeriodeNotation: undefined,
					libelle: undefined,
					libelleAnnee: undefined,
					libelleClasse: undefined,
					libellePeriodeNotation: undefined,
				});
				lListe.addElement(lElement);
				llistebulletin.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeBulletins &&
			this.JSONReponse.listeBulletins.count() > 0
		) {
			this.JSONReponse.listeBulletins.parcourir((aBulletin) => {
				const lElement = Object.assign(aBulletin, {
					Genre: 0,
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletin,
				});
				llistebulletin.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeCategories &&
			this.JSONReponse.listeCategories.count() > 0
		) {
			this.JSONReponse.listeCategories.parcourir((aCategorie) => {
				lListeCategorie.add(aCategorie);
			});
		}
		if (
			this.JSONReponse.listeDocumentsCasier &&
			this.JSONReponse.listeDocumentsCasier.count() > 0
		) {
			this.JSONReponse.listeDocumentsCasier.parcourir((aDocument) => {
				const lTypeDoc =
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aDocument,
					)
						? Enumere_DocTelechargement_1.EGenreDocTelechargement
								.documentSigneFinalise
						: Enumere_DocTelechargement_1.EGenreDocTelechargement
								.documentCasier;
				let lElement;
				if (
					lTypeDoc ===
						Enumere_DocTelechargement_1.EGenreDocTelechargement
							.documentSigneFinalise &&
					!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estSignataireDuDocument(
						aDocument,
					)
				) {
					lElement = Object.assign(aDocument, {
						annee: GParametres.PremiereDate.getFullYear(),
						typeDocument: lTypeDoc,
						estNonLu: true,
					});
				} else {
					lElement = Object.assign(aDocument, {
						annee: GParametres.PremiereDate.getFullYear(),
						typeDocument: lTypeDoc,
					});
				}
				lListeDocument.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeDocumentsSignatureElecASigner &&
			this.JSONReponse.listeDocumentsSignatureElecASigner.count() > 0
		) {
			this.JSONReponse.listeDocumentsSignatureElecASigner.parcourir(
				(aDocument) => {
					const lElement = Object.assign(aDocument, {
						annee: GParametres.PremiereDate.getFullYear(),
						typeDocument:
							Enumere_DocTelechargement_1.EGenreDocTelechargement
								.documentsASigner,
					});
					lListeDocumentsSignatureElecASigner.addElement(lElement);
				},
			);
		}
		if (
			this.JSONReponse.listeNaturesDocumentsAFournir &&
			this.JSONReponse.listeNaturesDocumentsAFournir.count() > 0
		) {
			this.JSONReponse.listeNaturesDocumentsAFournir.parcourir((aDocument) => {
				const lElement = Object.assign(aDocument, {
					Genre: 0,
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement
							.documentAFournir,
				});
				lListeDocumentAFournir.addElement(lElement);
			});
		}
		if (
			this.JSONReponse.listeBilansPeriodiques &&
			this.JSONReponse.listeBilansPeriodiques.count() > 0
		) {
			this.JSONReponse.listeBilansPeriodiques.parcourir((aDocument) => {
				const lElement = Object.assign(aDocument, {
					Genre: 0,
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement
							.bulletinDeCompetences,
				});
				llistebulletin.addElement(lElement);
			});
		}
		if (this.JSONReponse.diplome) {
			lDiplome = Object.assign(
				MethodesObjet_1.MethodesObjet.dupliquer(this.JSONReponse.diplome),
				{
					Genre: 0,
					annee: GParametres.PremiereDate.getFullYear(),
					typeDocument:
						Enumere_DocTelechargement_1.EGenreDocTelechargement.diplome,
				},
			);
		}
		const lTri = [
			ObjetTri_1.ObjetTri.init(
				"annee",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("debutPeriodeNotation"),
			ObjetTri_1.ObjetTri.init("libelleClasse"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
		lListe.setTri(lTri).trier();
		lListeCategorie.setTri(lTri).trier();
		lListeDocument.setTri(lTri).trier();
		lListeDocumentAFournir.setTri(lTri).trier();
		llistebulletin.setTri(lTri).trier();
		const lOptions = {
			liste: lListe,
			listeCategories: lListeCategorie,
			listeDocuments: lListeDocument,
			listeDocumentsSignatureElecASigner: lListeDocumentsSignatureElecASigner,
			listeDocumentsAFournir: lListeDocumentAFournir,
			listebulletins: llistebulletin,
		};
		if (lDiplome) {
			lOptions.diplome = lDiplome;
		}
		this.callbackReussite.appel(lOptions);
	}
}
exports.ObjetRequeteDocumentsATelecharger = ObjetRequeteDocumentsATelecharger;
CollectionRequetes_1.Requetes.inscrire(
	"DocumentsATelecharger",
	ObjetRequeteDocumentsATelecharger,
);

exports.InterfaceDocumentsATelecharger = void 0;
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetDocumentsATelecharger_1 = require("ObjetDocumentsATelecharger");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteDocumentsATelecharger_1 = require("ObjetRequeteDocumentsATelecharger");
const UtilitaireDocumentATelecharger_1 = require("UtilitaireDocumentATelecharger");
const _InterfaceDocuments_1 = require("_InterfaceDocuments");
const ObjetRequeteSaisieDocumentsATelecharger_1 = require("ObjetRequeteSaisieDocumentsATelecharger");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetListe_1 = require("ObjetListe");
const ObjetRequeteSaisieCasier_1 = require("ObjetRequeteSaisieCasier");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const TypeCasier_1 = require("TypeCasier");
const Enumere_DocTelechargement_1 = require("Enumere_DocTelechargement");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetTri_1 = require("ObjetTri");
const MethodesObjet_1 = require("MethodesObjet");
const DocumentsATelecharger_1 = require("DocumentsATelecharger");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
class InterfaceDocumentsATelecharger extends _InterfaceDocuments_1._InterfaceDocuments {
	constructor(...aParams) {
		super(...aParams);
		this.documentAffecteParAction = null;
		const lEcrans = [
			_InterfaceDocuments_1.EGenreEcran.ecranGauche,
			_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
		];
		this.setOptionsEcrans({
			nbNiveaux: lEcrans.length,
			avecBascule: !!IE.estMobile,
		});
		this.contexte = Object.assign(this.contexte, { ecran: lEcrans });
	}
	construireInstances() {
		this.identDocuments = this.add(
			ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger,
			this.eventDocuments,
			this.initDocuments,
		);
		super.construireInstances();
	}
	getIconeRubrique() {
		return this.rubriqueSelectionne
			? UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getIconListeRubrique(
					{ categorie: this.rubriqueSelectionne },
				)
			: "";
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
	}
	requeteConsultation() {
		new ObjetRequeteDocumentsATelecharger_1.ObjetRequeteDocumentsATelecharger(
			this,
		)
			.lancerRequete({
				avecNotes: [
					Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note,
					Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
				].includes(this.etatUtilisateurSco.getGenreOnglet()),
				avecCompetences: [
					Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Competence,
					Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
				].includes(this.etatUtilisateurSco.getGenreOnglet()),
			})
			.then((aJSON) => {
				this.listeCategories = aJSON.listeCategories;
				this.listeDocuments = aJSON.listeDocuments;
				this.listeDocumentsSignatureElecASigner =
					aJSON.listeDocumentsSignatureElecASigner;
				this.listeDocumentsAFournir = aJSON.listeDocumentsAFournir;
				this.listebulletins = aJSON.listebulletins;
				this.diplome = aJSON.diplome;
				this.listeRubrique = this.getlisteRubrique();
				this.initAff();
			})
			.catch((e) => {});
	}
	initGenreRubriquePardefaut() {
		var _a, _b;
		if (
			MethodesObjet_1.MethodesObjet.isNumber(this.genreRubriqueSelectionne) ||
			this.optionsEcrans.avecBascule
		) {
			return;
		}
		let lGenreRubrique =
			DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT.documents;
		let lAvecDocumentsASigner = false;
		if (this.avecAccesSignatureNumerique()) {
			const lListeDocumentsASigner =
				(_a = this.listeDocumentsSignatureElecASigner) === null || _a === void 0
					? void 0
					: _a.getListeElements((aDocumentSignature) => {
							return (
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									aDocumentSignature,
								) ||
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aDocumentSignature,
								)
							);
						});
			lAvecDocumentsASigner =
				(lListeDocumentsASigner === null || lListeDocumentsASigner === void 0
					? void 0
					: lListeDocumentsASigner.count()) > 0;
		}
		const lAvecCollecteDocument =
			((_b = this.listeDocumentsAFournir) === null || _b === void 0
				? void 0
				: _b.count()) > 0;
		if (lAvecDocumentsASigner) {
			lGenreRubrique =
				DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
					.documentsASigner;
		} else if (lAvecCollecteDocument) {
			lGenreRubrique =
				DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
					.documentsAFournir;
		}
		const lRubrique = this.getRubriqueParGenre(lGenreRubrique);
		this.setRubriqueSelectionne(lRubrique);
	}
	afficherEcranCentrale(aParams) {
		var _a;
		let lListe, lOptions, lOptionsListe;
		switch (this.genreRubriqueSelectionne) {
			case DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
				.bulletins: {
				const lListeBulletinPlusDiplome =
					MethodesObjet_1.MethodesObjet.dupliquer(this.listebulletins);
				if (this.diplome) {
					lListeBulletinPlusDiplome.add(this.diplome);
				}
				lListeBulletinPlusDiplome
					.setTri([ObjetTri_1.ObjetTri.init("Libelle")])
					.trier();
				lListe = lListeBulletinPlusDiplome;
				lOptions = {
					avecIntertitreAnnee: true,
					avecIconeDocument: true,
					avecLigneOff: true,
				};
				lOptionsListe = {
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
					messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
						"DocumentsATelecharger.Aucun",
					),
				};
				break;
			}
			case DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
				.documents:
				lListe = this.construireListeCumulParCategorie(this.listeDocuments);
				lOptions = {
					avecCouleurCategorie: true,
					avecIconeDocument: true,
					avecBtnEllipsis: true,
					avecFiltreCategorie: true,
					avecFiltreNonLus: true,
					avecCompteurSurDeploiement: true,
					avecLigneOff: true,
				};
				lOptionsListe = {
					boutons: [
						{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
						{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
					],
					messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
						"DocumentsATelecharger.Aucun",
					),
				};
				break;
			case DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
				.documentsAFournir:
				lListe = this.listeDocumentsAFournir;
				lOptionsListe = {
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
					messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.aucunDocumentAdeposer",
					),
				};
				break;
			case DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
				.documentsASigner:
				lOptions = {
					avecCouleurCategorie: true,
					avecIconeDocument: true,
					avecCompteurSurDeploiement: true,
					avecFiltreNonSignes: true,
					callbackSetMesDocuments: () => {
						const lGenreRubrique =
							DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
								.documents;
						const lRubrique = this.getRubriqueParGenre(lGenreRubrique);
						this.surSelectionListeRubrique(lRubrique);
					},
				};
				lListe = this.construireListeCumulParCategorie(
					this.listeDocumentsSignatureElecASigner,
				);
				lOptionsListe = {
					boutons: [
						{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
						{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
					],
					messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
						"Casier.aucunDocumentASigner",
					),
				};
				break;
		}
		const lInstanceDoc = this.getInstance(this.identDocuments);
		this.initDocuments(lInstanceDoc);
		if (lOptionsListe) {
			lInstanceDoc.setOptionsListe(
				Object.assign(lOptionsListe, { avecFiltresVisibles: false }),
			);
		}
		if (lOptions) {
			lInstanceDoc.setOptions(lOptions);
		}
		lInstanceDoc.setDonnees({
			listeDocs: lListe
				? lListe
				: new ObjetListeElements_1.ObjetListeElements(),
			listeCategories:
				this.listeCategories || new ObjetListeElements_1.ObjetListeElements(),
			ariaLabelListe: `${this.etatUtilisateurSco.getLibelleLongOnglet()} - ${((_a = this.rubriqueSelectionne) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`,
		});
	}
	construireListeCumulParCategorie(aListe) {
		const lListeParent = new ObjetListeElements_1.ObjetListeElements();
		aListe.parcourir((aElem) => {
			if (aElem.categorie) {
				const lLaCategorieEstPasDansLaListeParent =
					!lListeParent.getElementParNumero(aElem.categorie.getNumero());
				if (lLaCategorieEstPasDansLaListeParent) {
					const lNombreFils = aListe
						.getListeElements(
							(aElement) =>
								aElement.categorie &&
								aElem.categorie &&
								aElement.categorie.getNumero() === aElem.categorie.getNumero(),
						)
						.count();
					lListeParent.add(
						Object.assign(aElem.categorie, {
							estUnDeploiement: true,
							estDeploye: true,
							nbFils: lNombreFils || 0,
							categorie: aElem.categorie,
						}),
					);
				}
				aElem.pere = lListeParent.getElementParNumero(
					aElem.categorie.getNumero(),
				);
			}
		});
		lListeParent.add(aListe);
		lListeParent
			.setTri([
				ObjetTri_1.ObjetTri.initRecursif("pere", [
					ObjetTri_1.ObjetTri.init((D) => D.categorie.getLibelle()),
				]),
				ObjetTri_1.ObjetTri.init((D) => {
					if (D.estUnDeploiement) {
						return;
					}
					const lArticle = D;
					if (
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.isObjetElementDestinataireResponsable(
							lArticle,
						)
					) {
						return lArticle.date;
					}
					if (
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.isMDOC(
							lArticle,
						) &&
						lArticle.dateDebutPublication
					) {
						return lArticle.dateDebutPublication;
					}
					if (
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.isProjetAcc(
							lArticle,
						)
					) {
						return lArticle.dateDebut;
					}
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
							lArticle,
						)
					) {
						return lArticle.dateEnvoi;
					}
				}),
			])
			.trier();
		return lListeParent;
	}
	eventDocuments(aParams) {
		switch (aParams.genreEvenement) {
			case ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger
				.EGenreEventDocumentATelecharger.evenementListe: {
				switch (aParams.genreEvenementListe) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
						this.surSelectionDocument(aParams.article);
						break;
					}
				}
				break;
			}
			case ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger
				.EGenreEventDocumentATelecharger.evenementMenuCtx: {
				this.documentAffecteParAction = aParams.article;
				this.eventMenuCtx(aParams);
				break;
			}
			case ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger
				.EGenreEventDocumentATelecharger.SuppressionPJ: {
				this.saisieFichier({ document: aParams.article });
				break;
			}
			default:
				break;
		}
	}
	eventMenuCtx(aParam) {
		switch (aParam.genreEvenementMenuCtx) {
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.deposerLeFichier:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT.deposerLeFichier,
					aParam.article,
					this.surDepotFichier.bind(this),
				).event.call(this);
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.supprimerFichierDepose:
				this.saisieFichier({ document: aParam.article });
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.telecharger:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT.telecharger,
					aParam.article,
				).event();
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.genererLePdf:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT.genererLePdf,
					aParam.article,
				).event();
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.archiverSurMonCloud:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT.archiverSurMonCloud,
					aParam.article,
				).event();
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.ouvrirfenetrePdfEtCloud:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT.ouvrirPDFEtCloud,
					aParam.article,
				).event();
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.ouvrirfenetreTelechargerEtClourd:
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
					UtilitaireDocumentATelecharger_1.EGenreActionDAT
						.ouvrirTelechargerEtCloud,
					aParam.article,
					this.surFermetureFenetreTelechargerEtClourd.bind(this),
				).event();
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.marquerLu:
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParam.article,
					)
				) {
					this.surMarquerLuDocSignature(aParam.article);
				} else {
					this.surMarquerLu(aParam.article);
				}
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.marquerNonLu:
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParam.article,
					)
				) {
					this.surMarquerNonLuDocSignature(aParam.article);
				} else {
					this.surMarquerNonLu(aParam.article);
				}
				break;
			case UtilitaireDocumentATelecharger_1.EGenreEventDocumentMenuCtxDAT
				.supprimer:
				this.suppressionDocument(aParam.article);
				break;
		}
	}
	surFermetureFenetreTelechargerEtClourd(aMarquerLuLeDocument, aDocument) {
		if (aMarquerLuLeDocument && aDocument.estNonLu) {
			this.surMarquerLu(aDocument);
		}
	}
	surFermetureFenetreTelechargerEtClourdDocSignature(
		aMarquerLuLeDocument,
		aDocument,
	) {
		if (aMarquerLuLeDocument && aDocument.estNonLu) {
			this.surMarquerLuDocSignature(aDocument);
		}
	}
	surDepotFichier(aParams) {
		const lDocSelectionne = this.documentAffecteParAction
			? this.documentAffecteParAction
			: this.getCtxSelection({
					niveauEcran: this.getNiveauEcran(
						_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
					),
				});
		if (lDocSelectionne) {
			if (lDocSelectionne.listePJ && lDocSelectionne.listePJ.count() === 1) {
				const lPJ = lDocSelectionne.listePJ.get(0);
				if (lPJ) {
					lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				}
			}
			lDocSelectionne.listePJ.add(aParams.listeFichiers);
			lDocSelectionne.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			const lListeFichier = aParams.listeFichiers;
			const lListeDocument = new ObjetListeElements_1.ObjetListeElements().add(
				lDocSelectionne,
			);
			this.saisieFichier({
				listeDocument: lListeDocument,
				listePieceJointe: lListeFichier,
			});
		}
	}
	surSelectionDocument(aDocument) {
		if ("estUnDeploiement" in aDocument && aDocument.estUnDeploiement) {
			return;
		}
		const lDocument = aDocument;
		this.setCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
			),
			dataEcran: aDocument,
		});
		let lCallback = () => {};
		const lOuvrirPDFEtCloud =
			UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
				UtilitaireDocumentATelecharger_1.EGenreActionDAT.ouvrirPDFEtCloud,
				lDocument,
			);
		switch (lDocument.typeDocument) {
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.documents:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.documentMembre:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.projetAcc:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletinBIA:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletin:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.diplome:
			case Enumere_DocTelechargement_1.EGenreDocTelechargement
				.bulletinDeCompetences:
				lCallback = lOuvrirPDFEtCloud.event;
				break;
			case Enumere_DocTelechargement_1.EGenreDocTelechargement
				.documentAFournir: {
				if ("docEditable" in lDocument && lDocument.docEditable) {
					const lCallbackDepotFichier =
						this && this.surDepotFichier
							? this.surDepotFichier.bind(this)
							: () => {};
					const lDeposerLeFichier =
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
							UtilitaireDocumentATelecharger_1.EGenreActionDAT.deposerLeFichier,
							lDocument,
							lCallbackDepotFichier,
							{ id: this.getNomInstance(this.identDocuments) },
						);
					lCallback = lDeposerLeFichier.event.bind(this);
				} else {
					const lOuvrirFenetreInfo =
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
							UtilitaireDocumentATelecharger_1.EGenreActionDAT
								.ouvrirFenetreInfo,
							lDocument,
						);
					lCallback = lOuvrirFenetreInfo.event;
				}
				break;
			}
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.documentCasier: {
				const lOuvrirTelechargerEtCloud =
					UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
						UtilitaireDocumentATelecharger_1.EGenreActionDAT
							.ouvrirTelechargerEtCloud,
						lDocument,
						this.surFermetureFenetreTelechargerEtClourd.bind(this),
					);
				const lTelecharger =
					UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
						UtilitaireDocumentATelecharger_1.EGenreActionDAT.telecharger,
						lDocument,
					);
				const lEstDocCloud =
					lDocument.getGenre() ===
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud;
				if (lEstDocCloud) {
					lCallback = lTelecharger.event;
				} else {
					lCallback = lOuvrirTelechargerEtCloud.event;
				}
				break;
			}
			case Enumere_DocTelechargement_1.EGenreDocTelechargement
				.documentSigneFinalise: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						lDocument,
					)
				) {
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
							lDocument,
						) &&
						lDocument.archive
					) {
						const lOuvrirTelechargerEtCloud =
							UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
								UtilitaireDocumentATelecharger_1.EGenreActionDAT
									.ouvrirTelechargerEtCloud,
								lDocument,
								this.surFermetureFenetreTelechargerEtClourdDocSignature.bind(
									this,
								),
							);
						lCallback = lOuvrirTelechargerEtCloud.event;
					} else {
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirDocument(
							this,
							lDocument,
						);
					}
				}
				break;
			}
			case Enumere_DocTelechargement_1.EGenreDocTelechargement
				.documentsASigner: {
				if (
					lDocument &&
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						lDocument,
					)
				) {
					if (
						(UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
							lDocument,
						) ||
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
								lDocument,
							)) &&
						lDocument.signataire
					) {
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirFenetreInfoSignature(
							this,
							lDocument,
							this.recupererDonnees.bind(this),
						);
					} else {
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirDocument(
							this,
							lDocument,
						);
					}
				}
				break;
			}
			default:
				break;
		}
		lCallback();
	}
	saisieFichier(aParams) {
		let lListeFichier, lListeDocument;
		if ("listeDocument" in aParams && aParams.listeDocument) {
			lListeDocument = aParams.listeDocument;
		} else if ("document" in aParams && aParams.document) {
			lListeDocument = new ObjetListeElements_1.ObjetListeElements().add(
				aParams.document,
			);
		}
		if (aParams.listePieceJointe) {
			lListeFichier = aParams.listePieceJointe;
		} else if (aParams.pieceJointe) {
			lListeFichier = new ObjetListeElements_1.ObjetListeElements().add(
				aParams.pieceJointe,
			);
		}
		if (lListeDocument) {
			const lRequete =
				new ObjetRequeteSaisieDocumentsATelecharger_1.ObjetRequeteSaisieDocumentsATelecharger(
					this,
					this.recupererDonnees,
				);
			if (lListeFichier) {
				lRequete.addUpload({ listeFichiers: lListeFichier });
			}
			lRequete.lancerRequete({ listeNaturesDocumentsAFournir: lListeDocument });
		}
	}
	surMarquerLu(aDocument) {
		this.saisieMarquerLectureDocument(aDocument, true);
	}
	surMarquerNonLu(aDocument) {
		this.saisieMarquerLectureDocument(aDocument, false);
	}
	saisieMarquerLectureDocument(aDocument, aMarquerLu) {
		if (
			aDocument.typeDocument ===
			Enumere_DocTelechargement_1.EGenreDocTelechargement.documentCasier
		) {
			this.requeteSaisieCasier({
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie[
						aMarquerLu ? "marquerLus" : "marquerNonLus"
					],
				documents: new ObjetListeElements_1.ObjetListeElements().add(aDocument),
			});
		}
	}
	surMarquerLuDocSignature(aDocument) {
		this.saisieMarquerLectureDocumentSignature(aDocument, true);
	}
	surMarquerNonLuDocSignature(aDocument) {
		this.saisieMarquerLectureDocumentSignature(aDocument, false);
	}
	saisieMarquerLectureDocumentSignature(aDocument, aMarquerLu) {
		if (
			aDocument.typeDocument ===
			Enumere_DocTelechargement_1.EGenreDocTelechargement.documentSigneFinalise
		) {
			this.requeteSaisieCasier({
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie[
						aMarquerLu ? "marquerLus" : "marquerNonLus"
					],
				document: aDocument,
			});
		}
	}
	suppressionDocument(aDocument) {
		GApplication.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.ConfirmSupprDocCasier",
					[aDocument.getLibelle()],
				),
			})
			.then((aAccepte) => {
				if (aAccepte !== Enumere_Action_1.EGenreAction.Valider) {
					return;
				}
				aDocument.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				this.requeteSaisieCasier({
					genreSaisie:
						ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
							.saisieCasier,
					listeLignes: new ObjetListeElements_1.ObjetListeElements().add(
						aDocument,
					),
				});
			});
	}
	requeteSaisieCasier(aParam) {
		new ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier(
			this,
			this.recupererDonnees,
		).lancerRequete(
			Object.assign(
				{
					typeConsultation:
						TypeCasier_1.TypeConsultationDocumentCasier.CoDC_Destinataire,
				},
				aParam,
			),
		);
	}
	initDocuments(aInstance) {
		aInstance.setOptions({
			avecFiltreCategorie: false,
			avecFiltreNonLus: false,
			avecFiltreNonSignes: false,
			avecEvent: true,
			avecIntertitreAnnee: false,
			avecCouleurCategorie: false,
			avecIconeDocument: false,
			avecBtnEllipsis: false,
			avecLigneOff: false,
			avecCompteurSurDeploiement: false,
		});
	}
	getlisteRubrique() {
		const getCompteur = (aListe, aProp) =>
			aListe
				? aListe
						.getListeElements((aElem) => (aProp ? !!aElem[aProp] : true))
						.count()
				: 0;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lCompteurDocuments = getCompteur(this.listeDocuments, "estNonLu");
		lListe.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.mesDocuments",
				),
				icon: "icon_download_alt",
				Genre:
					DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.documents,
				compteur: lCompteurDocuments,
				titleCompteur:
					lCompteurDocuments > 1
						? ObjetTraduction_1.GTraductions.getValeur(
								"documentsATelecharger.hintDocsNonLu",
								lCompteurDocuments,
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"documentsATelecharger.hintDocNonLu",
								lCompteurDocuments,
							),
			}),
		);
		lListe.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.bulletins",
				),
				icon: "icon_bulletin_officiel",
				Genre:
					DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.bulletins,
			}),
		);
		if (this.avecAccesSignatureNumerique()) {
			const lCompteurDocumentsASigner = this.listeDocumentsSignatureElecASigner
				? this.listeDocumentsSignatureElecASigner
						.getListeElements((aDocument) => {
							return (
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									aDocument,
								) ||
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aDocument,
								)
							);
						})
						.count()
				: 0;
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Casier.DocumentsASigner",
					),
					icon: "icon_signature",
					Genre:
						DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
							.documentsASigner,
					compteur: lCompteurDocumentsASigner,
					titleCompteur:
						lCompteurDocumentsASigner > 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.hintDocsASigner",
									lCompteurDocumentsASigner,
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.hintDocASigner",
									lCompteurDocumentsASigner,
								),
				}),
			);
		}
		if (
			this.etatUtilisateurSco.estEspaceEleve() ||
			this.etatUtilisateurSco.estEspaceParent()
		) {
			const lCompteurDocumentsAFournir = getCompteur(
				this.listeDocumentsAFournir,
				"estDocADeposer",
			);
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.docAFournir",
					),
					icon: "icon_upload_alt",
					Genre:
						DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
							.documentsAFournir,
					compteur: lCompteurDocumentsAFournir,
					titleCompteur:
						lCompteurDocumentsAFournir > 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.hintDocsADeposer",
									lCompteurDocumentsAFournir,
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.hintDocADeposer",
									lCompteurDocumentsAFournir,
								),
				}),
			);
		}
		return lListe;
	}
}
exports.InterfaceDocumentsATelecharger = InterfaceDocumentsATelecharger;

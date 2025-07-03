exports.InterfaceCasier = void 0;
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDocument_1 = require("UtilitaireDocument");
const ObjetRequeteCasier_1 = require("ObjetRequeteCasier");
const ObjetRequeteCasier_2 = require("ObjetRequeteCasier");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetRequeteSaisieCasier_1 = require("ObjetRequeteSaisieCasier");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_Casier_1 = require("DonneesListe_Casier");
const _InterfaceDocuments_1 = require("_InterfaceDocuments");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DepotDocument_1 = require("ObjetFenetre_DepotDocument");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const TypeCasier_1 = require("TypeCasier");
const TypeCasier_2 = require("TypeCasier");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const Toast_1 = require("Toast");
const GUID_1 = require("GUID");
const DonneesListe_CasierListeEleves_1 = require("DonneesListe_CasierListeEleves");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireDocumentATelecharger_1 = require("UtilitaireDocumentATelecharger");
const ObjetTri_1 = require("ObjetTri");
const ObjetFenetre_SaisieCollecte_1 = require("ObjetFenetre_SaisieCollecte");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
const UtilitaireCasier_1 = require("UtilitaireCasier");
class InterfaceCasier extends _InterfaceDocuments_1._InterfaceDocuments {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.titreFenetreRubrique =
			ObjetTraduction_1.GTraductions.getValeur("Casier.natures");
		this.classCssPrincipale = "InterfaceCasier";
		this.id = { ctnEcranDroite: GUID_1.GUID.getId() };
		this.filtres = this.composeFiltre();
		this.indiceComboClasseCollecteParEleve = -1;
		this.avecEcranDroiteVisible = false;
	}
	construireInstances() {
		this.identDocuments = this.add(
			ObjetListe_1.ObjetListe,
			this.eventDocuments,
			this.initDocuments,
		);
		if (
			this.avecDroitDocumentEleve() ||
			this.avecDroitGererLaCollecteDeDocuments()
		) {
			this.identListeEleves = this.add(
				ObjetListe_1.ObjetListe,
				null,
				this.initListeEleves,
			);
		}
		super.construireInstances();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnRetour: {
				event() {
					aInstance.changerEcran({
						src: _InterfaceDocuments_1.EGenreEcran.ecranDroite,
						dest: _InterfaceDocuments_1.EGenreEcran.ecranCentrale,
					});
				},
			},
			comboClasses: {
				init: (aCombo) => {
					aCombo.setOptionsObjetSaisie({
						longueur: 200,
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.selectionnezUneClasse",
						),
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.selectionnezUneClasse",
						),
					});
					aCombo.setDonneesObjetSaisie({
						liste: aInstance.listeClasses,
						selection: aInstance.indiceComboClasseCollecteParEleve,
					});
				},
				event: (aParam) => {
					if (aParam.element && aParam.estSelectionManuelle) {
						aInstance.surSelectionComboClasse(aParam.element);
					}
				},
			},
		});
	}
	surSelectionComboClasse(aClasse) {
		this.classeSelectionne = aClasse;
		this.indiceComboClasseCollecteParEleve =
			this.listeClasses.getIndiceElementParFiltre(
				(aClasse) => aClasse === aClasse,
			);
		this.requeteConsultation({
			requete: {
				classe: aClasse,
				genreRequeteCasier:
					ObjetRequeteCasier_1.TypeGenreRequeteCasier
						.GRC_ListeElevesCollecteParEleves,
			},
			callback: this.reponseRequeteCollecteEleves.bind(this),
		});
	}
	getRubriqueParTypeConsultation(aType) {
		let lRubrique;
		if (aType >= 0) {
			lRubrique = this.getDonneesDelaListeRubrique()
				.getListeElements((aI) => aI.typeConsultation === aType)
				.get(0);
		}
		return lRubrique;
	}
	getIconeRubrique() {
		return this.rubriqueSelectionne
			? UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getIconListeRubrique(
					{ categorie: this.rubriqueSelectionne },
				)
			: "";
	}
	reponseRequeteCollecteDocument(aParam) {
		const lArticle = aParam.requete && aParam.requete.document;
		lArticle.listeEleves =
			aParam.json.listeIndividus ||
			new ObjetListeElements_1.ObjetListeElements();
		this.changerEcran({
			src: _InterfaceDocuments_1.EGenreEcran.ecranCentrale,
			dest: _InterfaceDocuments_1.EGenreEcran.ecranDroite,
			data: lArticle,
		});
	}
	eventListeRubrique(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surSelectionListeRubrique(
					aParams.article,
					aParams.surInteractionUtilisateur,
				);
				break;
			default:
				break;
		}
	}
	reponseRequeteCollecteEleves(aParam) {
		this.listeCollecteParEleves = null;
		const lDonnees = aParam.json;
		this.effacerEcranDroite();
		this.listeCollecteParEleves =
			(lDonnees && lDonnees.listeCollecteParEleves) ||
			new ObjetListeElements_1.ObjetListeElements();
		this.changerEcran({
			src: null,
			dest: _InterfaceDocuments_1.EGenreEcran.ecranCentrale,
		});
	}
	reponseRequeteCasier({ json: aJSON }) {
		this.listeDocumentsMonCasier = aJSON.listeDocumentsMonCasier;
		this.listeCategories = aJSON.categories;
		this.listeDocumentsSignatureElecASigner =
			aJSON.listeDocumentsSignatureElecASigner;
		this.listeDocumentsDepositaire = aJSON.listeDocumentsDepositaire;
		this.listeDocumentsResponsable = aJSON.listeDocumentsResponsable;
		if (aJSON.listeCollecteParDocuments) {
			this.listeCollecteParDocuments = this.formatCollecteParDocuments(
				aJSON.listeCollecteParDocuments,
			);
		}
		this.criteres = UtilitaireCasier_1.UtilitaireCasier.formatCriteres(
			aJSON.criteres,
		);
		this.listeClasses = this.getListeClasses(aJSON.listeClasses);
		this.listeFichiers = new ObjetListeElements_1.ObjetListeElements();
		this.listeFichiersCloud = new ObjetListeElements_1.ObjetListeElements();
		this.avecDocumentsDejaDeposes = aJSON.avecDocumentsDejaDeposes;
		this.listeRubrique = this.getlisteRubrique();
		this.initAff();
	}
	initGenreRubriquePardefaut() {
		var _a;
		if (
			MethodesObjet_1.MethodesObjet.isNumber(this.genreRubriqueSelectionne) ||
			this.optionsEcrans.avecBascule
		) {
			return;
		}
		let lGenreRubrique =
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier;
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
		if (lAvecDocumentsASigner) {
			lGenreRubrique =
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.documentsASigner;
		}
		const lRubrique = this.getRubriqueParGenre(lGenreRubrique);
		this.setRubriqueSelectionne(lRubrique);
	}
	getOrdreTriCumulCollecte(aType) {
		switch (aType) {
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
				return 3;
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
				return 2;
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
				return 1;
			default:
				return 0;
		}
	}
	formatCollecteParDocuments(aListe) {
		const lListeFormat = new ObjetListeElements_1.ObjetListeElements();
		const lListeCumul = new ObjetListeElements_1.ObjetListeElements();
		for (const lCumul of this.getListeCumulsCollecteParDocuments(aListe)) {
			if (this.isCumulCollecteParDocuments(lCumul)) {
				const lCollecteFormat = ObjetElement_1.ObjetElement.create(
					Object.assign(Object.assign({}, lCumul), {
						estDeploye: true,
						ordreTri: this.getOrdreTriCumulCollecte(lCumul.getGenre()),
					}),
				);
				const lAvecFilsDansListe = !!aListe.getElementParFiltre(
					(aElement) =>
						aElement.getGenre() === lCumul.getGenre() &&
						!this.isCumulCollecteParDocuments(aElement),
				);
				const lAvecDroitLieAuCumul =
					this.avecDroitCollecterDocsEnFonctionDuGenre(lCumul.getGenre());
				if (lAvecFilsDansListe || lAvecDroitLieAuCumul) {
					lListeCumul.add(lCollecteFormat);
				}
			}
		}
		for (const lCollecte of aListe) {
			if (!this.isCumulCollecteParDocuments(lCollecte)) {
				const lPere = lListeCumul
					.getListeElements(
						(aElem) =>
							this.isCumulCollecteParDocuments(aElem) &&
							aElem.getGenre() === lCollecte.getGenre(),
					)
					.get(0);
				const lCollecteFormat = ObjetElement_1.ObjetElement.create(
					Object.assign(Object.assign({}, lCollecte), {
						estUnDeploiement: false,
						estDeploye: true,
					}),
				);
				if (lPere && this.isCumulCollecteParDocuments(lPere)) {
					lCollecteFormat.pere = lPere;
				}
				lListeFormat.add(lCollecteFormat);
			}
		}
		lListeFormat.add(lListeCumul);
		lListeFormat.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("ordreTri"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		]);
		lListeFormat.trier();
		return lListeFormat;
	}
	getListeCumulsCollecteParDocuments(aListe) {
		return aListe.getListeElements((aElement) =>
			this.isCumulCollecteParDocuments(aElement),
		);
	}
	isCumulCollecteParDocuments(aElem) {
		return "estUnDeploiement" in aElem && !!aElem.estUnDeploiement;
	}
	requeteSaisie(aParams = {}) {
		const lParams = Object.assign(
			{
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
						.saisieCasier,
			},
			aParams,
		);
		if (
			lParams &&
			MethodesObjet_1.MethodesObjet.isNumeric(lParams.genreSaisie)
		) {
			new ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier(
				this,
				aParams.callback ? aParams.callback : this.recupererDonnees,
			)
				.addUpload({
					listeFichiers: this.listeFichiers,
					listeDJCloud: this.listeFichiersCloud,
				})
				.lancerRequete(
					Object.assign(Object.assign({}, lParams), {
						typeConsultation:
							aParams.typeConsultation >= 0
								? aParams.typeConsultation
								: this.getTypeConsultation(),
					}),
				);
		} else {
		}
	}
	recupererDonnees() {
		this.requeteConsultation();
	}
	async requeteConsultation(aParam = {}) {
		if (!aParam.requete) {
			aParam.requete = {};
		}
		if (
			!MethodesObjet_1.MethodesObjet.isNumber(aParam.requete.genreRequeteCasier)
		) {
			aParam.requete.genreRequeteCasier =
				ObjetRequeteCasier_1.TypeGenreRequeteCasier.GRC_Affichage;
		}
		const lJson = await new ObjetRequeteCasier_2.ObjetRequeteCasier(
			this,
		).lancerRequete(aParam.requete);
		const lCallback = aParam.callback
			? aParam.callback
			: this.reponseRequeteCasier;
		lCallback.call(this, { json: lJson, requete: aParam.requete });
	}
	initDocuments(aInstance) {
		const lListeBoutons = [];
		const lOptions = {
			nonEditableSurModeExclusif: true,
			avecOmbreDroite: true,
			avecLigneCreation: !!this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.creationDoc,
			),
			titreCreation: this.getTitreCreationListeDocuments(),
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: lListeBoutons,
			messageContenuVide: this.getMessageContenuVide(),
			ariaLabel: () => {
				var _a;
				return `${this.etatUtilisateurSco.getLibelleLongOnglet()} - ${((_a = this.rubriqueSelectionne) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
			},
		};
		lListeBoutons.push({
			genre: ObjetListe_1.ObjetListe.typeBouton.rechercher,
		});
		if (
			[
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParEleve,
			].includes(this.genreRubriqueSelectionne)
		) {
			lListeBoutons.push({
				getHtml: () =>
					IE.jsx.str("ie-combo", {
						"ie-model": "comboClasses",
						class: "combo-sans-fleche",
					}),
				controleur: this.controleur,
			});
		}
		if (
			![
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParEleve,
			].includes(this.genreRubriqueSelectionne)
		) {
			lListeBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer });
		}
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				lOptions.avecLigneCreation =
					lOptions.avecLigneCreation && this.avecDroitSaisieResponsable();
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
				lOptions.avecLigneCreation =
					lOptions.avecLigneCreation && this.avecDroitSaisieIntervenant();
				break;
		}
		aInstance.setOptionsListe(lOptions);
		this.etatUtilisateurSco.setTriListe({ liste: aInstance });
	}
	getTitreCreationListeDocuments() {
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument:
				return ObjetTraduction_1.GTraductions.getValeur("Casier.creeUnDoc");
			default:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.diffuserDocument",
				);
		}
	}
	eventDocuments(aParams) {
		const lArticle = aParams.article || new ObjetElement_1.ObjetElement();
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.surCreationListe(aParams.nodeBouton);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				switch (this.genreRubriqueSelectionne) {
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.documentsASigner: {
						if (
							lArticle &&
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
								lArticle,
							)
						) {
							if (
								(UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									lArticle,
								) ||
									UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
										lArticle,
									)) &&
								lArticle.signataire
							) {
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirFenetreInfoSignature(
									this,
									lArticle,
									this.recupererDonnees.bind(this),
								);
							} else {
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirDocument(
									this,
									lArticle,
								);
							}
						}
						break;
					}
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.monCasier: {
						if (
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
								lArticle,
							)
						) {
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.ouvrirDocument(
								this,
								lArticle,
							);
							if (
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
									lArticle,
								) &&
								this.avecFonctionnalite(
									UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
										.marquerLectureDocument,
								)
							) {
								this.surMarquerLuDocSignature(lArticle);
							}
						} else {
							const lArticleDestinataire = lArticle;
							this.telechargerDoc(lArticleDestinataire);
							if (
								this.avecFonctionnalite(
									UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
										.marquerLectureDocument,
								)
							) {
								this.surMarquerLu(lArticleDestinataire);
							}
						}
						break;
					}
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.depositaire:
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.responsable: {
						const lArticleDepot = aParams.article;
						if (
							this.avecFonctionnalite(
								UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
									.miseAJourDoc,
							)
						) {
							this.ouvrirFenetreSaisieDocumentCasier({
								genreSaisie: Enumere_Etat_1.EGenreEtat.Modification,
								document: lArticleDepot,
							});
						}
						break;
					}
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.collecteParDocument: {
						if (
							UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
								aParams.article,
							)
						) {
							this.surSelectionCollecteParDocument(aParams.article);
						}
						break;
					}
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.collecteParEleve:
						this.changerEcran({
							src: _InterfaceDocuments_1.EGenreEcran.ecranCentrale,
							dest: _InterfaceDocuments_1.EGenreEcran.ecranDroite,
							data: aParams.article,
						});
						break;
					default:
						break;
				}
				break;
			default:
				break;
		}
	}
	surSelectionCollecteParDocument(aArticle) {
		const lParams = {
			requete: {
				document: aArticle,
				genreRequeteCasier:
					ObjetRequeteCasier_1.TypeGenreRequeteCasier
						.GRC_ListeElevesCollecteParDocuments,
			},
			callback: this.reponseRequeteCollecteDocument.bind(this),
		};
		this.requeteConsultation(lParams);
	}
	initListeEleves(aInstance, aListeBoutons) {
		const lListeBoutons = [];
		lListeBoutons.push(
			{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
			{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
		);
		if (aListeBoutons) {
			lListeBoutons.push(...aListeBoutons);
		}
		aInstance.setOptionsListe({
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"Casier.sansCollecte",
			),
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecFiltresVisibles: false,
			boutons: lListeBoutons,
		});
	}
	surSelectionListeRubrique(aArticle, aSurInteractionUtilisateur) {
		let lRubrique = this.getRubriqueParDefaut();
		if (aSurInteractionUtilisateur) {
			this.resetFiltre();
		}
		if (aArticle) {
			const lEstRubriqueAffichee = !!this.getlisteRubrique().getElementParGenre(
				aArticle.getGenre(),
			);
			if (lEstRubriqueAffichee) {
				lRubrique = aArticle;
			}
		}
		this.effacerEcranDroite();
		this.setRubriqueSelectionne(lRubrique);
		this.marquerSelectionListeRubrique();
		this.changerEcran({
			src: null,
			dest: _InterfaceDocuments_1.EGenreEcran.ecranCentrale,
		});
	}
	setRubriqueSelectionne(aRubrique) {
		super.setRubriqueSelectionne(aRubrique);
		this.modeAff = this.getModeAffichage();
	}
	async eventSurMenuContextListeEleves(aParams) {
		switch (aParams.commande) {
			case DonneesListe_CasierListeEleves_1.DonneesListe_CasierListeEleves
				.EGenreCommande.AjouterUnDocument: {
				UtilitaireDocument_1.UtilitaireDocument.ouvrirFenetreChoixTypeDeFichierADeposer.call(
					this,
					(aParamAddFile) => {
						const lFichier = aParamAddFile.listeFichiers.get(0);
						if (lFichier) {
							const lDocumentEleve = ObjetElement_1.ObjetElement.create(
								Object.assign(
									{
										collecte: new ObjetElement_1.ObjetElement(
											aParams.collecte.getLibelle(),
											aParams.collecte.getNumero(),
											aParams.collecte.getGenre(),
										),
										cible: new ObjetElement_1.ObjetElement(
											aParams.article.getLibelle(),
											aParams.article.getNumero(),
											aParams.article.getGenre(),
										),
									},
									lFichier,
								),
							);
							this.listeFichiers.add(lFichier);
							this.setCtxSelection({
								niveauEcran: this.getNiveauEcran(
									_InterfaceDocuments_1.EGenreEcran.ecranDroite,
								),
								dataEcran: aParams.article,
							});
							this.requeteSaisie({
								genreSaisie:
									ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier
										.EGenreSaisie.saisieDocumentEleve,
								documentsEleve:
									new ObjetListeElements_1.ObjetListeElements().add(
										lDocumentEleve,
									),
								callback: this.callbackSaisieListeEleve,
							});
						}
					},
					{ idCtn: this.Nom },
				);
				break;
			}
			case DonneesListe_CasierListeEleves_1.DonneesListe_CasierListeEleves
				.EGenreCommande.SupprimerUnDocument: {
				const lDocumentEleve =
					DonneesListe_CasierListeEleves_1.DonneesListe_CasierListeEleves.getPJ(
						aParams.article,
					);
				if (lDocumentEleve) {
					lDocumentEleve.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					this.setCtxSelection({
						niveauEcran: this.getNiveauEcran(
							_InterfaceDocuments_1.EGenreEcran.ecranDroite,
						),
						dataEcran: aParams.article,
					});
					this.requeteSaisie({
						genreSaisie:
							ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
								.saisieDocumentEleve,
						documentsEleve: new ObjetListeElements_1.ObjetListeElements().add(
							lDocumentEleve,
						),
						callback: this.callbackSaisieListeEleve,
					});
				}
				break;
			}
			default:
				break;
		}
	}
	callbackSaisieListeEleve() {
		const lArticle = this.getCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
			),
		});
		this.setCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
			),
			dataEcran: null,
		});
		if (
			lArticle instanceof ObjetElement_1.ObjetElement &&
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
				lArticle,
			)
		) {
			this.surSelectionCollecteParDocument(lArticle);
		}
	}
	scrollToDocumentEleve() {
		const lDocumentEleve = this.getCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranDroite,
			),
		});
		this.setCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranDroite,
			),
			dataEcran: null,
		});
		if (
			lDocumentEleve instanceof ObjetElement_1.ObjetElement &&
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementDocumentEleveCollecteParDocument(
				lDocumentEleve,
			)
		) {
			const lInstanceListe = this.getInstance(this.identListeEleves);
			const lIndice = lInstanceListe
				.getListeArticles()
				.getIndiceExisteParElement(lDocumentEleve);
			if (MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
				lInstanceListe.scrollTo({ ligne: lIndice });
			}
		}
	}
	async eventSurMenuContext(aParams) {
		switch (aParams.numeroMenu) {
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande.telecharger:
				this.telechargerDoc(aParams.article);
				break;
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande
				.marquerLus: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					)
				) {
					this.surMarquerLuDocSignature(aParams.article);
				} else {
					this.surMarquerLu(aParams.article);
				}
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande
				.marquerNonLus: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					)
				) {
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
							aParams.article,
						) &&
						aParams.article.estNonLu === false
					) {
						this.requeteSaisie({
							genreSaisie:
								ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
									.marquerNonLus,
							document: aParams.article,
						});
					}
				} else {
					const lArticle = aParams.article;
					if (lArticle && !lArticle.estNonLu) {
						this.requeteSaisie({
							genreSaisie:
								ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
									.marquerNonLus,
							documents: new ObjetListeElements_1.ObjetListeElements().add(
								lArticle,
							),
						});
					}
				}
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande
				.suppression: {
				this.surSuppression(aParams.article);
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande.renommer: {
				const lArticleDepot = aParams.article;
				const lLibelle = await this.ouvrirFenetreRename(lArticleDepot);
				if (lLibelle) {
					aParams.article.setLibelle(lLibelle);
					aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.requeteSaisie();
				}
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande.remplacer:
				this.remplacerFichier(aParams.article, aParams.eltFichier);
				break;
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande
				.remplacerDocumentCloud:
				this.remplacerFichierCloud(aParams.article);
				break;
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande.modifier: {
				switch (this.genreRubriqueSelectionne) {
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.collecteParDocument: {
						const lArticleCollecte = aParams.article;
						this.ouvrirFenetreSaisieCollecte({
							genreSaisie: Enumere_Etat_1.EGenreEtat.Modification,
							document: lArticleCollecte,
						});
						break;
					}
					default: {
						const lArticleDepot = aParams.article;
						this.ouvrirFenetreSaisieDocumentCasier({
							genreSaisie: Enumere_Etat_1.EGenreEtat.Modification,
							document: lArticleDepot,
						});
						break;
					}
				}
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande.cloturer: {
				const lArticleCollecte = aParams.article;
				lArticleCollecte.sansDepotEspace = true;
				lArticleCollecte.sansDateLimite = false;
				lArticleCollecte.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.requeteSaisie({
					genreSaisie:
						ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
							.saisieCollecte,
					collectes: new ObjetListeElements_1.ObjetListeElements().add(
						lArticleCollecte,
					),
				});
				break;
			}
			case DonneesListe_Casier_1.DonneesListe_Casier.EGenreCommande
				.consulterLeMemo: {
				if ("memo" in aParams.article && aParams.article.memo) {
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_1.ObjetFenetre,
						{
							pere: this,
							initialiser(aFenetre) {
								aFenetre.setOptionsFenetre({
									largeurMin: 300,
									avecTailleSelonContenu: true,
									listeBoutons: [
										ObjetTraduction_1.GTraductions.getValeur("Fermer"),
									],
									titre: aParams.article.getLibelle(),
								});
							},
						},
					);
					lFenetre.afficher(`<p>${aParams.article.memo}</p>`);
				}
				break;
			}
		}
	}
	async ouvrirFenetreRename(aArticle) {
		return ObjetFenetre_DepotDocument_1.ObjetFenetreRename.ouvrir(
			aArticle.getLibelle(),
			this,
		);
	}
	telechargerDoc(aArticle) {
		if (aArticle.documentCasier) {
			UtilitaireDocument_1.UtilitaireDocument.ouvrirUrl(
				aArticle.documentCasier,
			);
		}
	}
	ouvrirFenetreSaisieDocumentCasier(aParams) {
		const lTypeConsultation =
			aParams.typeConsultation >= 0
				? aParams.typeConsultation
				: this.getTypeConsultation();
		ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.ouvrir({
			genreSaisie: aParams.genreSaisie || Enumere_Etat_1.EGenreEtat.Creation,
			callbackApresEdition: this.callbackApresEditionCasier.bind(this),
			categories:
				this.getListeCategories() ||
				new ObjetListeElements_1.ObjetListeElements(),
			document: aParams.document
				? aParams.document
				: this.getDocumentCasierParDefaut(),
			documentjoint: aParams.documentJoint,
			typeConsultation: lTypeConsultation,
			avecSuppresionDoc: this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.suppressionDoc,
			),
			avecChipsApresCreation: false,
			criteres: this.criteres,
		});
	}
	callbackApresEditionCasier(aTypeConsultation) {
		const lRubrique = this.getRubriqueParTypeConsultation(aTypeConsultation);
		this.setRubriqueSelectionne(lRubrique);
		this.recupererDonnees();
	}
	remplacerFichier(aArticle, aEltFichier) {
		if (aArticle && aEltFichier) {
			aArticle.setLibelle(aEltFichier.getLibelle());
			aArticle.documentCasier = aEltFichier;
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			const lEstDocumentCloud =
				aEltFichier.Genre === Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud;
			this[lEstDocumentCloud ? "listeFichiersCloud" : "listeFichiers"].add(
				aEltFichier,
			);
			this.requeteSaisie({
				typeConsultation:
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_Destinataire,
				listeLignes: new ObjetListeElements_1.ObjetListeElements().add(
					aArticle,
				),
				callback: () => {
					Toast_1.Toast.afficher({
						msg: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.documentBienRemplace",
						),
						type: Toast_1.ETypeToast.succes,
						dureeAffichage: 4500,
					});
					this.recupererDonnees();
				},
			});
		}
	}
	remplacerFichierCloud(aArticle) {
		if (aArticle) {
			UtilitaireDocument_1.UtilitaireDocument.ouvrirFenetreChoixFichierCloud(
				(aParams) => this.remplacerFichier(aArticle, aParams.eltFichier),
				{ avecMonoSelection: true },
			);
		}
	}
	getListeDocuments(aGenreRubrique) {
		let lListeDocuments = new ObjetListeElements_1.ObjetListeElements();
		const lGenre = aGenreRubrique
			? aGenreRubrique
			: this.genreRubriqueSelectionne;
		switch (lGenre) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner:
				lListeDocuments = this.construireListeCumulParCategorie(
					this.listeDocumentsSignatureElecASigner,
				);
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier:
				lListeDocuments = this.construireListeCumulParCategorie(
					this.listeDocumentsMonCasier,
				);
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
				lListeDocuments = this.construireListeCumulParCategorie(
					this.listeDocumentsDepositaire,
				);
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				lListeDocuments = this.construireListeCumulParCategorie(
					this.listeDocumentsResponsable,
				);
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument:
				lListeDocuments = this.listeCollecteParDocuments;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
				if (this.listeCollecteParEleves) {
					lListeDocuments = this.listeCollecteParEleves;
				}
				break;
		}
		return lListeDocuments;
	}
	getListeCategories() {
		return this.listeCategories;
	}
	construireListeCumulParCategorie(aListe) {
		const lListeParent = new ObjetListeElements_1.ObjetListeElements();
		aListe.parcourir((aElem) => {
			if ("categorie" in aElem && aElem.categorie) {
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
			.setTri([ObjetTri_1.ObjetTri.init("categorie.Libelle")])
			.trier();
		return lListeParent;
	}
	getClasseSelectionne() {
		let lClasse;
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
				lClasse = this.classeSelectionne;
				break;
		}
		return lClasse;
	}
	getListeClassesAvecDecalagePourCombo(aListe) {
		if (this.etatUtilisateurSco.pourPrimaire()) {
			aListe.parcourir((aClasse) => {
				if (aClasse.listeComposantes && aClasse.listeComposantes.count() > 0) {
					aClasse.listeComposantes.parcourir((aNiveau) => {
						const lClasseComposantes = aListe.getElementParNumero(
							aNiveau.getNumero(),
						);
						if (lClasseComposantes) {
							lClasseComposantes.ClassAffichage = "p-left-l";
							lClasseComposantes.pere = aClasse;
						}
					});
				}
			});
		}
		return aListe;
	}
	afficherEcranCentrale(aParams) {
		var _a;
		this.initDocuments(this.getInstance(this.identDocuments));
		const lListe = this.getListeDocuments();
		const lParamsDonneesListe = {
			evenement: this.eventSurMenuContext.bind(this),
			avecFonctionnaliteArticle: this.avecFonctionnaliteArticle.bind(this),
			listeClasses: this.listeClasses,
			listeCategories: this.getListeCategories(),
			classeSelectionne: this.getClasseSelectionne(),
			avecToutesLesClasses: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParDocument,
			].includes(this.genreRubriqueSelectionne),
			getFiltreParDefaut: this.getFiltreParDefaut.bind(this),
			setFiltre: this.setFiltreParGenre.bind(this),
			getfiltre: this.getFiltreParGenre.bind(this),
			setIndiceCategorie: this.setFiltreIndiceCategorie.bind(this),
			setCbNonLu: this.setFiltreCbNonLu.bind(this),
			setCbNonSigne: this.setFiltreCbNonSigne.bind(this),
			setFiltreCbNonPublie: this.setFiltreCbNonPublie.bind(this),
			setFiltreCbPublie: this.setFiltreCbPublie.bind(this),
			rubriqueCasier: this.rubriqueSelectionne,
			callbackSetMesDocuments: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.documentsASigner,
			].includes(this.genreRubriqueSelectionne)
				? () => {
						const lGenreRubrique =
							UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
								.monCasier;
						const lRubrique = this.getRubriqueParGenre(lGenreRubrique);
						this.surSelectionListeRubrique(lRubrique);
					}
				: undefined,
		};
		const lDonneesListeCasier = new DonneesListe_Casier_1.DonneesListe_Casier(
			lListe,
			lParamsDonneesListe,
		);
		if (
			[
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParDocument,
			].includes(this.genreRubriqueSelectionne)
		) {
			lDonneesListeCasier.setOptions({ avecEllipsis: false });
		}
		lDonneesListeCasier.setOptionsCasier({
			avectri: ![
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParEleve,
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParDocument,
			].includes(this.genreRubriqueSelectionne),
			avecFiltreNonLus: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
			].includes(this.genreRubriqueSelectionne),
			avecFiltreNonSignes: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.documentsASigner,
			].includes(this.genreRubriqueSelectionne),
			avecFiltrePublication: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParDocument,
			].includes(this.genreRubriqueSelectionne),
			avecFiltreCategorie: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire,
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable,
			].includes(this.genreRubriqueSelectionne),
			avecFiltreElevesAvecDocADeposer: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParEleve,
			].includes(this.genreRubriqueSelectionne),
			estDestinataire: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
			].includes(this.genreRubriqueSelectionne),
			avecCouleurNature: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable,
			].includes(this.genreRubriqueSelectionne),
			avecIconeFormatFoc: [
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire,
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable,
			].includes(this.genreRubriqueSelectionne),
		});
		this.getInstance(this.identDocuments).setDonnees(lDonneesListeCasier);
		if (
			this.genreRubriqueSelectionne ===
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParEleve &&
			!this.classeSelectionne &&
			((_a = this.listeClasses) === null || _a === void 0
				? void 0
				: _a.count()) === 1
		) {
			this.surSelectionComboClasse(this.listeClasses.get(0));
		}
	}
	construireAffichageEcranDroite() {
		const H = [];
		H.push(`<div id="${this.id.ctnEcranDroite}" style="height: 100%;">`);
		H.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListeEleves),
				style: "height: 100%;",
			}),
		);
		H.push(`</div>`);
		return H.join("");
	}
	effacerEcranDroite() {
		const lId = this.getNomInstance(this.identListeEleves);
		if (lId) {
			ObjetHtml_1.GHtml.setHtml(this.getNomInstance(this.identListeEleves), "");
			this.avecEcranDroiteVisible = false;
		}
	}
	afficherEcranDroite(aParams) {
		let lLibelleTitre,
			lListe,
			lParams,
			lOptions = {};
		const lInstanceListeEleves = this.getInstance(this.identListeEleves);
		const lListeBoutons = [];
		let lArticle = this.getCtxSelection({
			niveauEcran: this.getNiveauEcran(
				_InterfaceDocuments_1.EGenreEcran.ecranCentrale,
			),
		});
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				const lArticleCollecteDoc = lArticle;
				lParams = this.getParametreDonneesListeCasierlisteEleves({
					article: lArticleCollecteDoc,
				});
				lListeBoutons.push({
					getHtml: () =>
						IE.jsx.str("ie-btnicon", {
							class: "icon_ellipsis_vertical",
							"ie-model": this.jsxModeleBoutonMenuCtxListeEleves.bind(this),
							title:
								ObjetTraduction_1.GTraductions.getValeur("liste.BtnAction"),
						}),
				});
				if (this.optionsEcrans.avecBascule) {
					lLibelleTitre = lArticleCollecteDoc.getLibelle();
				}
				if (lArticleCollecteDoc.listeEleves) {
					lListe = lArticleCollecteDoc.listeEleves;
					lOptions = { avecSelection: false };
				}
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve: {
				const lArticleCollecteEleve = lArticle;
				if (this.optionsEcrans.avecBascule) {
					lLibelleTitre = lArticleCollecteEleve.getLibelle();
				}
				if (lArticleCollecteEleve.listeDocuments) {
					lListe = lArticleCollecteEleve.listeDocuments;
					lParams = this.getParametreDonneesListeCasierlisteEleves({
						listeResponsables: lArticleCollecteEleve.listeResponsables,
					});
					lOptions = { avecSelection: false };
					if (lArticleCollecteEleve.listeDocuments.count() === 0) {
						lInstanceListeEleves.setOptionsListe({ boutons: [] });
					}
				}
				break;
			}
			default:
				break;
		}
		this.initListeEleves(lInstanceListeEleves, lListeBoutons);
		if (lLibelleTitre) {
			this.updateBandeauEcran(aParams.niveauEcran, lLibelleTitre);
		}
		if (lInstanceListeEleves && lListe) {
			const lDonneesListe =
				new DonneesListe_CasierListeEleves_1.DonneesListe_CasierListeEleves(
					lListe,
					lParams,
				);
			lDonneesListe.setOptions(lOptions);
			lInstanceListeEleves.setDonnees(lDonneesListe);
			this.avecEcranDroiteVisible = true;
			this.scrollToDocumentEleve();
		}
	}
	jsxModeleBoutonMenuCtxListeEleves() {
		return {
			event: (aEvent, aNode) => {
				const lInstanceListeEleves = this.getInstance(this.identListeEleves);
				lInstanceListeEleves.getDonneesListe().surMenuCtxListe(aNode);
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	getParametreDonneesListeCasierlisteEleves(aParam) {
		const lParamsCommun = {
			estDepotParDocument:
				this.genreRubriqueSelectionne ===
				UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
					.collecteParDocument,
			avecDroitSaisieInfoSondages: this.avecDroitSaisieInfoSondages(),
			avecDroitDiscution: this.avecDroitDiscution(),
			eventMenuCtx: this.eventSurMenuContextListeEleves.bind(this),
		};
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				if (!("article" in aParam)) {
					return null;
				}
				return Object.assign(Object.assign({}, lParamsCommun), {
					avecFonctionnaliteArticle: (aGenreFonc) =>
						this.avecFonctionnaliteArticle(aGenreFonc, aParam.article),
					collecte: aParam.article,
				});
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve: {
				if (!("listeResponsables" in aParam)) {
					return null;
				}
				return Object.assign(Object.assign({}, lParamsCommun), {
					listeResponsables:
						aParam.listeResponsables ||
						new ObjetListeElements_1.ObjetListeElements(),
					optionsCasier: { afficherClasse: true },
					avecFonctionnaliteArticle: this.avecFonctionnaliteArticle.bind(this),
				});
			}
		}
		return null;
	}
	surMarquerLu(aArticle) {
		if (aArticle && aArticle.estNonLu) {
			this.requeteSaisie({
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
						.marquerLus,
				documents: new ObjetListeElements_1.ObjetListeElements().add(aArticle),
			});
		}
	}
	surMarquerLuDocSignature(aArticle) {
		if (aArticle && aArticle.estNonLu) {
			this.requeteSaisie({
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
						.marquerLus,
				document: aArticle,
			});
		}
	}
	surCreationListe(aNodeBouton) {
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.responsable: {
				this.ouvrirFenetreSaisieDocumentCasier({
					genreSaisie: Enumere_Etat_1.EGenreEtat.Creation,
				});
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				this.surCreationMultiCommande(aNodeBouton, [
					InterfaceCasier.GenreCommandeCreation.CollecteEleve,
					InterfaceCasier.GenreCommandeCreation.CollecteEleveParResp,
					InterfaceCasier.GenreCommandeCreation.CollecteResp,
				]);
				break;
			}
			default:
				break;
		}
	}
	async ouvrirFenetreSaisieCollecte(aParams) {
		const lGenreRessourceSelection = (0,
		TypeCasier_1.typeGenreCumulDocEleveToGenreRessource)(
			aParams.document.getGenre(),
			false,
		);
		const lGenreRessourceFinal = (0,
		TypeCasier_1.typeGenreCumulDocEleveToGenreRessource)(
			aParams.document.getGenre(),
			true,
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieCollecte_1.ObjetFenetre_SaisieCollecte,
			{
				pere: this,
				initialiser: (aInstance) => {
					aInstance.setOptionsFenetre({
						titre:
							ObjetFenetre_SaisieCollecte_1.ObjetFenetre_SaisieCollecte.getTitreFenetre(
								aParams.document.getGenre(),
								aParams.genreSaisie === Enumere_Etat_1.EGenreEtat.Creation,
							),
					});
				},
			},
		);
		const lRes = await (lFenetre === null || lFenetre === void 0
			? void 0
			: lFenetre.setDonnees({
					genreRessourceSelection: lGenreRessourceSelection,
					genreRessourceFinal: lGenreRessourceFinal,
					donnees: aParams.document,
					criteres: this.criteres,
				}));
		if (lRes.numeroBouton === 1 && lRes.collecte) {
			lRes.collecte.setEtat(aParams.genreSaisie);
			this.requeteSaisie({
				collectes: new ObjetListeElements_1.ObjetListeElements().add(
					lRes.collecte,
				),
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
						.saisieCollecte,
			});
		}
	}
	getLibelleCommandeCreation(aGenre) {
		switch (aGenre) {
			case InterfaceCasier.GenreCommandeCreation.CasierIntervenant:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.IntervenantDiffusion",
				);
			case InterfaceCasier.GenreCommandeCreation.CasierResponsable:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.responsablesDiffusion",
				);
			case InterfaceCasier.GenreCommandeCreation.CollecteEleve:
				return ObjetTraduction_1.GTraductions.getValeur("Casier.CollecteEleve");
			case InterfaceCasier.GenreCommandeCreation.CollecteEleveParResp:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.CollecteEleveParResp",
				);
			case InterfaceCasier.GenreCommandeCreation.CollecteResp:
				return ObjetTraduction_1.GTraductions.getValeur("Casier.CollecteResp");
			case InterfaceCasier.GenreCommandeCreation.TitreCollecte:
				return ObjetTraduction_1.GTraductions.getValeur("Casier.TitreCollecte");
			default:
				break;
		}
	}
	getListeCommandeCreation(aListe) {
		if (aListe.length === 0) {
			return [];
		}
		const lListeCommande = aListe
			.map((aGenre) => this.getCommandeCreation(aGenre))
			.filter(({ value }) => value);
		const lAvecUnSeulElement = lListeCommande.length === 1;
		const lAvecTitreCollecte =
			!lAvecUnSeulElement &&
			!!lListeCommande.find((aCommande) =>
				[
					InterfaceCasier.GenreCommandeCreation.CollecteEleve,
					InterfaceCasier.GenreCommandeCreation.CollecteEleveParResp,
					InterfaceCasier.GenreCommandeCreation.CollecteResp,
				].includes(aCommande.genre),
			);
		if (lAvecTitreCollecte) {
			lListeCommande.push(
				this.getCommandeCreation(
					InterfaceCasier.GenreCommandeCreation.TitreCollecte,
				),
			);
		}
		lListeCommande.sort((a, b) => a.position - b.position);
		return lListeCommande;
	}
	getCommandeCreation(aGenre) {
		const lOuvrirFenetreCreationResponsable = () =>
			this.ouvrirFenetreSaisieDocumentCasier({
				genreSaisie: Enumere_Etat_1.EGenreEtat.Creation,
				typeConsultation:
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_DepResponsable,
				document: this.getDocumentCasierPourResponsable(),
			});
		const lOuvrirFenetreCreationIntervenant = () =>
			this.ouvrirFenetreSaisieDocumentCasier({
				genreSaisie: Enumere_Etat_1.EGenreEtat.Creation,
				typeConsultation:
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_Depositaire,
				document: this.getDocumentCasierPourIntervenant(),
			});
		const lOuvrirFenetreCreationCollecte = (aGenre) => {
			this.ouvrirFenetreSaisieCollecte({
				document: this.getCollecteParDocument(aGenre),
				genreSaisie: Enumere_Etat_1.EGenreEtat.Creation,
			});
		};
		const lPositionTitreCollecte = 4;
		switch (aGenre) {
			case InterfaceCasier.GenreCommandeCreation.CasierIntervenant:
				return {
					position: 2,
					callback: lOuvrirFenetreCreationIntervenant,
					genre: InterfaceCasier.GenreCommandeCreation.CasierIntervenant,
					value: this.avecDroitSaisieIntervenant(),
				};
			case InterfaceCasier.GenreCommandeCreation.CasierResponsable:
				return {
					position: 3,
					callback: lOuvrirFenetreCreationResponsable,
					genre: InterfaceCasier.GenreCommandeCreation.CasierResponsable,
					value: this.avecDroitSaisieResponsable(),
				};
			case InterfaceCasier.GenreCommandeCreation.TitreCollecte:
				return {
					position: lPositionTitreCollecte,
					estTitre: true,
					genre: InterfaceCasier.GenreCommandeCreation.TitreCollecte,
					value: this.avecDroitGererLaCollecteDeDocuments(),
				};
			case InterfaceCasier.GenreCommandeCreation.CollecteResp:
				return {
					position:
						lPositionTitreCollecte +
						this.getOrdreTriCumulCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp,
						),
					callback: () =>
						lOuvrirFenetreCreationCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp,
						),
					genre: InterfaceCasier.GenreCommandeCreation.CollecteResp,
					value: this.avecDroitCollecterDocsAupresDesResponsables(),
				};
			case InterfaceCasier.GenreCommandeCreation.CollecteEleveParResp:
				return {
					position:
						lPositionTitreCollecte +
						this.getOrdreTriCumulCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve,
						),
					callback: () =>
						lOuvrirFenetreCreationCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve,
						),
					genre: InterfaceCasier.GenreCommandeCreation.CollecteEleveParResp,
					value: this.avecDroitCollecterDocsAupresDesResponsables(),
				};
			case InterfaceCasier.GenreCommandeCreation.CollecteEleve:
				return {
					position:
						lPositionTitreCollecte +
						this.getOrdreTriCumulCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve,
						),
					callback: () =>
						lOuvrirFenetreCreationCollecte(
							TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve,
						),
					genre: InterfaceCasier.GenreCommandeCreation.CollecteEleve,
					value: this.avecDroitCollecterDocsAupresDesEleves(),
				};
			default:
				break;
		}
	}
	surCreationMultiCommande(aNodeBouton, aListeGenreCommande = []) {
		if (!aNodeBouton) {
			return;
		}
		const lCommandes = this.getListeCommandeCreation(aListeGenreCommande);
		if (lCommandes.length === 0) {
		}
		if (lCommandes.length === 1) {
			const lCommande = lCommandes[0];
			if ("callback" in lCommande) {
				lCommande.callback();
			}
			return;
		}
		lCommandes.sort((a, b) => a.position - b.position);
		const lPosBtn = ObjetPosition_1.GPosition.getClientRect(aNodeBouton);
		const lIdMenuCtx = IE.estMobile
			? aNodeBouton
			: { x: lPosBtn.left, y: lPosBtn.bottom + 10 };
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			id: lIdMenuCtx,
			initCommandes: (aMenu) => {
				lCommandes.forEach((aCommande) => {
					if ("estTitre" in aCommande) {
						aMenu.addTitre(this.getLibelleCommandeCreation(aCommande.genre));
					} else {
						aMenu.add(
							this.getLibelleCommandeCreation(aCommande.genre),
							true,
							() => aCommande.callback(),
							{ image: "", imageFormate: true },
						);
					}
				});
			},
		});
	}
	async surSuppression(aArticle) {
		const lResult = await GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: this.getMessageSuppressionConfirmation(aArticle.getLibelle()),
		});
		if (lResult !== Enumere_Action_1.EGenreAction.Valider) {
			return;
		}
		aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		let lParams;
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.responsable: {
				const lArticle = aArticle;
				lParams = {
					listeLignes: new ObjetListeElements_1.ObjetListeElements().add(
						lArticle,
					),
					genreSaisie:
						ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
							.saisieCasier,
				};
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				const lArticle = aArticle;
				lParams = {
					collectes: new ObjetListeElements_1.ObjetListeElements().add(
						lArticle,
					),
					genreSaisie:
						ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
							.saisieCollecte,
				};
				break;
			}
		}
		if (lParams) {
			this.requeteSaisie(lParams);
		}
	}
	composeFiltre() {
		const lFiltres = new ObjetListeElements_1.ObjetListeElements();
		for (const lProp of MethodesObjet_1.MethodesObjet.enumKeys(
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier,
		)) {
			lFiltres.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: lProp,
					Genre:
						UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier[lProp],
					filtre: this.getFiltreParDefaut(
						UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier[lProp],
					),
				}),
			);
		}
		return lFiltres;
	}
	setFiltreParGenre(aValeurFiltre, aGenreRubriqueCasier) {
		if (!this.filtres) {
			this.filtres = this.composeFiltre();
		}
		const lFiltre = this.filtres.getElementParGenre(
			aGenreRubriqueCasier >= 0
				? aGenreRubriqueCasier
				: this.genreRubriqueSelectionne,
		);
		if (lFiltre) {
			lFiltre.filtre = aValeurFiltre;
		}
	}
	resetFiltre() {
		this.filtres = this.composeFiltre();
		this.classeSelectionne = undefined;
	}
	getFiltreParGenre(aGenreRubriqueCasier) {
		if (!this.filtres) {
			this.filtres = this.composeFiltre();
		}
		const lFiltre = this.filtres.getElementParGenre(
			aGenreRubriqueCasier >= 0
				? aGenreRubriqueCasier
				: this.genreRubriqueSelectionne,
		);
		return (lFiltre && lFiltre.filtre) || null;
	}
	getFiltreParDefaut(aGenreRubriqueCasier) {
		const lFiltre = {};
		switch (
			aGenreRubriqueCasier >= 0
				? aGenreRubriqueCasier
				: this.genreRubriqueSelectionne
		) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier:
				lFiltre.cbNonLu = false;
				lFiltre.indiceCategorie = 0;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner:
				lFiltre.cbNonSigne = false;
				lFiltre.indiceCategorie = 0;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
				lFiltre.indiceCategorie = 0;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				lFiltre.indiceCategorie = 0;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument:
				lFiltre.cbNonPublie = true;
				lFiltre.cbPublie = true;
				break;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
				lFiltre.indiceClasse = -1;
				break;
		}
		return lFiltre;
	}
	setFiltreIndiceCategorie(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.indiceCategorie = aValeur;
	}
	setFiltreIndiceClasse(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.indiceClasse = aValeur;
	}
	setFiltreCbNonLu(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.cbNonLu = aValeur;
	}
	setFiltreCbNonSigne(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.cbNonSigne = aValeur;
	}
	setFiltreCbNonPublie(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.cbNonPublie = aValeur;
	}
	setFiltreCbPublie(aValeur, aGenreRubriqueCasier) {
		const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
		lFiltre.cbPublie = aValeur;
	}
	avecDroitSaisieIntervenant() {
		return ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.avecDroitSaisieIntervenant();
	}
	avecDroitSaisieResponsable() {
		return ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.avecDroitSaisieResponsable();
	}
	avecDroitDocumentEleve() {
		return !!this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.casierNumerique
				.avecAccesALaListeDesDocumentEleve,
		);
	}
	avecDroitGererLaCollecteDeDocuments() {
		return !!this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.casierNumerique.gererLaCollecteDeDocuments,
		);
	}
	avecDroitCollecterDocsAupresDesEleves() {
		return !!this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.casierNumerique.collecterDocsAupresDesEleves,
		);
	}
	avecDroitCollecterDocsAupresDesResponsables() {
		return !!this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.casierNumerique
				.collecterDocsAupresDesResponsables,
		);
	}
	avecDroitCollecterDocsEnFonctionDuGenre(aGenre) {
		switch (aGenre) {
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
				return this.avecDroitCollecterDocsAupresDesEleves();
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
				return this.avecDroitCollecterDocsAupresDesResponsables();
			default:
				return false;
		}
	}
	avecDroitSaisieInfoSondages() {
		return !!this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
		);
	}
	avecDroitDiscution() {
		return (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			)
		);
	}
	avecFonctionnaliteArticle(aFonctionnalite, aArticle) {
		const lParams = {};
		if (
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
				aArticle,
			)
		) {
			lParams.genreCollecte = aArticle.getGenre();
		}
		if (
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				aArticle,
			) &&
			aFonctionnalite !==
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.marquerLectureDocument
		) {
			return false;
		}
		return this.avecFonctionnalite(aFonctionnalite, lParams);
	}
	avecFonctionnalite(aFonctionnalite, aParam = {}) {
		switch (this.modeAff) {
			case InterfaceCasier.modeAffichage.destinataire.consultation:
			case InterfaceCasier.modeAffichage.depositaire.consultation:
			case InterfaceCasier.modeAffichage.responsable.consultation:
			case InterfaceCasier.modeAffichage.collecteParDocument.consultation:
			case InterfaceCasier.modeAffichage.collecteParEleve.consultation:
				return false;
			case InterfaceCasier.modeAffichage.depositaire.saisie:
			case InterfaceCasier.modeAffichage.responsable.saisie:
				return ![
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.notificationOuvertureDoc,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.consulterLeMemo,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.remplacerFichier,
				].includes(aFonctionnalite);
			case InterfaceCasier.modeAffichage.destinataire.saisie:
				return [
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.notificationOuvertureDoc,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.consulterLeMemo,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.marquerLectureDocument,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.suppressionDoc,
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.remplacerFichier,
				].includes(aFonctionnalite);
			case InterfaceCasier.modeAffichage.depositaire.saisieRestreinte:
			case InterfaceCasier.modeAffichage.responsable.saisieRestreinte:
				return (
					aFonctionnalite ===
					UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.suppressionDoc
				);
			case InterfaceCasier.modeAffichage.collecteParDocument.saisie: {
				switch (aFonctionnalite) {
					case UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.creationDoc: {
						return this.avecDroitGererLaCollecteDeDocuments();
					}
					case UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.modifier:
					case UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.suppressionDoc:
					case UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
						.cloturer: {
						if (!MethodesObjet_1.MethodesObjet.isNumber(aParam.genreCollecte)) {
							return false;
						}
						switch (aParam.genreCollecte) {
							case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
								return this.avecDroitCollecterDocsAupresDesEleves();
							case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
							case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
								return this.avecDroitCollecterDocsAupresDesResponsables();
							default:
								return false;
						}
					}
					default:
						return false;
				}
			}
		}
	}
	getModeAffichage() {
		const lEstEnConsultation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.estEnConsultation,
		);
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner:
				return InterfaceCasier.modeAffichage.destinataire.consultation;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier:
				if (lEstEnConsultation) {
					return InterfaceCasier.modeAffichage.destinataire.consultation;
				} else {
					return InterfaceCasier.modeAffichage.destinataire.saisie;
				}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
				if (lEstEnConsultation) {
					return InterfaceCasier.modeAffichage.depositaire.consultation;
				}
				if (this.avecDroitSaisieIntervenant()) {
					return InterfaceCasier.modeAffichage.depositaire.saisie;
				} else {
					return InterfaceCasier.modeAffichage.depositaire.saisieRestreinte;
				}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				if (lEstEnConsultation) {
					return InterfaceCasier.modeAffichage.responsable.consultation;
				}
				if (this.avecDroitSaisieResponsable()) {
					return InterfaceCasier.modeAffichage.responsable.saisie;
				} else {
					return InterfaceCasier.modeAffichage.responsable.saisieRestreinte;
				}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument:
				if (lEstEnConsultation || !this.avecDroitGererLaCollecteDeDocuments()) {
					return InterfaceCasier.modeAffichage.collecteParDocument.consultation;
				}
				return InterfaceCasier.modeAffichage.collecteParDocument.saisie;
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
				return InterfaceCasier.modeAffichage.collecteParEleve.consultation;
			default:
				break;
		}
	}
	getDocumentCasierParDefaut() {
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
				return this.getDocumentCasierPourIntervenant();
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				return this.getDocumentCasierPourResponsable();
			default:
				break;
		}
	}
	getDocumentCasierPourIntervenant() {
		return ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getDocumentCasierPourIntervenant();
	}
	getDocumentCasierPourResponsable() {
		return ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getDocumentCasierPourResponsable();
	}
	getCollecteParDocument(aGenre, aAvecAccesAutorise = true) {
		const lGenreDestinataireCollecte = (0,
		TypeCasier_1.typeGenreCumulDocEleveToTypeGenreDestinataireCollecte)(aGenre);
		const lGenreDestinataire = (0,
		TypeCasier_1.typeGenreDestinataireCollecteToTypeGenreDestinataire)(
			lGenreDestinataireCollecte,
		);
		const lCollecte = ObjetElement_1.ObjetElement.create({
			Libelle: "",
			Genre: aGenre,
			sansDepotEspace: false,
			sansDateLimite: true,
			dateEcheance: new Date(),
			genreDestinataireCollecte: lGenreDestinataireCollecte,
			listeChampsEditables: [],
			notification: {
				avecNotif: false,
				avecRelance: false,
				dateNotif: new Date(),
				nbrJourRelance: 1,
			},
			listeIndividuAccesAutorise: new ObjetListeElements_1.ObjetListeElements(),
			destinataires:
				UtilitaireCasier_1.UtilitaireCasier.getDestinataireParDefaut([
					lGenreDestinataire,
				]),
		});
		lCollecte.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		if (aAvecAccesAutorise) {
			const lUtilisateur = this.etatUtilisateurSco.getUtilisateur();
			if (
				[
					Enumere_Ressource_1.EGenreRessource.Personnel,
					Enumere_Ressource_1.EGenreRessource.Enseignant,
				].includes(lUtilisateur.getGenre())
			) {
				lCollecte.listeIndividuAccesAutorise.add(
					ObjetElement_1.ObjetElement.create({
						Libelle: lUtilisateur.getLibelle(),
						Numero: lUtilisateur.getNumero(),
						Genre: lUtilisateur.getGenre(),
						isDisabled: true,
					}),
				);
			}
		}
		return lCollecte;
	}
	getlisteRubrique() {
		var _a, _b;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lCompteurMonCasier = this.listeDocumentsMonCasier
			.getListeElements((aI) => "estNonLu" in aI && aI.estNonLu)
			.count();
		lListe.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.mesDocuments",
				),
				icon: "icon_inbox",
				Genre:
					UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
				typeConsultation:
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_Destinataire,
				compteur: lCompteurMonCasier,
				titleCompteur:
					lCompteurMonCasier > 1
						? ObjetTraduction_1.GTraductions.getValeur(
								"Casier.hintDocsNonLu",
								lCompteurMonCasier,
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Casier.hintDocNonLu",
								lCompteurMonCasier,
							),
			}),
		);
		if (this.avecAccesSignatureNumerique()) {
			const lCompteurDocumentsASigner = this.listeDocumentsSignatureElecASigner
				? this.listeDocumentsSignatureElecASigner
						.getListeElements((aElement) => {
							return (
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									aElement,
								) ||
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aElement,
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
						UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
							.documentsASigner,
					compteur: lCompteurDocumentsASigner,
					titleCompteur:
						lCompteurDocumentsASigner > 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"Casier.hintDocsASigner",
									lCompteurDocumentsASigner,
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Casier.hintDocASigner",
									lCompteurDocumentsASigner,
								),
				}),
			);
		}
		const lAvecDocumentDejaDeposesDestinataire =
			this.avecDocumentsDejaDeposes &&
			this.listeDocumentsDepositaire &&
			this.listeDocumentsDepositaire.count() > 0;
		const lAvecDocumentDejaDeposesResponsable =
			this.avecDocumentsDejaDeposes &&
			this.listeDocumentsResponsable &&
			this.listeDocumentsResponsable.count() > 0;
		if (
			lAvecDocumentDejaDeposesDestinataire ||
			lAvecDocumentDejaDeposesResponsable ||
			this.avecDroitSaisieIntervenant() ||
			this.avecDroitSaisieResponsable()
		) {
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur("Casier.diffusion"),
					estLigneOff: true,
					estInterTitre:
						ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
							.typeInterTitre.h5,
				}),
			);
			if (
				this.avecDroitSaisieIntervenant() ||
				lAvecDocumentDejaDeposesDestinataire
			) {
				const lTypeConsult =
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_Depositaire;
				const lInfosRubrique =
					ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getRubriqueDepot(
						lTypeConsult,
					);
				lListe.add(
					ObjetElement_1.ObjetElement.create({
						Libelle: lInfosRubrique.libelle,
						icon: lInfosRubrique.icon,
						Genre:
							UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
								.depositaire,
						typeConsultation: lTypeConsult,
					}),
				);
			}
			if (
				this.avecDroitSaisieResponsable() ||
				lAvecDocumentDejaDeposesResponsable
			) {
				const lTypeConsult =
					TypeCasier_2.TypeConsultationDocumentCasier.CoDC_DepResponsable;
				const lInfosRubrique =
					ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getRubriqueDepot(
						lTypeConsult,
					);
				lListe.add(
					ObjetElement_1.ObjetElement.create({
						Libelle: lInfosRubrique.libelle,
						icon: lInfosRubrique.icon,
						Genre:
							UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
								.responsable,
						typeConsultation: lTypeConsult,
					}),
				);
			}
		}
		const lAvecCollecteDejaDeposes =
			((_a = this.listeCollecteParDocuments) === null || _a === void 0
				? void 0
				: _a.count()) > 0;
		if (
			this.avecDroitDocumentEleve() ||
			this.avecDroitGererLaCollecteDeDocuments() ||
			lAvecCollecteDejaDeposes
		) {
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Casier.collecteDeDocs",
					),
					Genre: null,
					estLigneOff: true,
					estInterTitre:
						ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
							.typeInterTitre.h5,
				}),
			);
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Casier.collecterResponsablesEleves",
					),
					icon: "icon_download_alt",
					Genre:
						UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
							.collecteParDocument,
				}),
			);
			if (
				this.avecDroitDocumentEleve() &&
				((_b = this.listeClasses) === null || _b === void 0
					? void 0
					: _b.count()) > 0
			) {
				lListe.add(
					ObjetElement_1.ObjetElement.create({
						Libelle: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.recapitulatifParEleve",
						),
						icon: "icon_liste_etudiant",
						Genre:
							UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
								.collecteParEleve,
					}),
				);
			}
		}
		return lListe;
	}
	getRubriqueParDefaut() {
		return this.getlisteRubrique().get(0);
	}
	getMessageSuppressionConfirmation(aLibelle) {
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.msgConfirmSupprDest",
					[aLibelle],
				);
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.msgConfirmSupprDepositaire",
					[aLibelle],
				);
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.msgConfirmSupprCollecte",
					[aLibelle],
				);
			default: {
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.msgConfirmSupprDest",
					[aLibelle],
				);
			}
		}
	}
	getTypeConsultation() {
		const lRubrique = this.listeRubrique.getElementParGenre(
			this.genreRubriqueSelectionne,
		);
		if (MethodesObjet_1.MethodesObjet.isNumeric(lRubrique.typeConsultation)) {
			return lRubrique.typeConsultation;
		}
		return null;
	}
	getListeClasses(aListeClasse) {
		let lListeClasse =
			aListeClasse !== null && aListeClasse !== void 0
				? aListeClasse
				: new ObjetListeElements_1.ObjetListeElements();
		lListeClasse = this.getListeClassesAvecDecalagePourCombo(lListeClasse);
		lListeClasse.setTri([
			ObjetTri_1.ObjetTri.init((D) =>
				!!D.pere ? D.pere.getLibelle() : D.getLibelle(),
			),
			ObjetTri_1.ObjetTri.init((D) => !!D.pere),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListeClasse.trier();
		return lListeClasse;
	}
	getMessageContenuVide() {
		switch (this.genreRubriqueSelectionne) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
				return this.classeSelectionne
					? ObjetTraduction_1.GTraductions.getValeur(
							"Casier.aucunDocumentACellecter",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.selectionnezUneClasse",
						);
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Casier.aucunDocumentASigner",
				);
			default:
				return ObjetTraduction_1.GTraductions.getValeur("Casier.msgCasierVide");
		}
	}
}
exports.InterfaceCasier = InterfaceCasier;
InterfaceCasier.modeAffichage = {
	depositaire: { saisie: 1, saisieRestreinte: 2, consultation: 3 },
	destinataire: { saisie: 4, consultation: 5 },
	responsable: { saisie: 6, saisieRestreinte: 7, consultation: 8 },
	collecteParDocument: { saisie: 9, consultation: 10 },
	collecteParEleve: { consultation: 12 },
};
(function (InterfaceCasier) {
	let GenreCommandeCreation;
	(function (GenreCommandeCreation) {
		GenreCommandeCreation[(GenreCommandeCreation["CasierIntervenant"] = 0)] =
			"CasierIntervenant";
		GenreCommandeCreation[(GenreCommandeCreation["CasierResponsable"] = 1)] =
			"CasierResponsable";
		GenreCommandeCreation[(GenreCommandeCreation["TitreCollecte"] = 2)] =
			"TitreCollecte";
		GenreCommandeCreation[(GenreCommandeCreation["CollecteEleve"] = 3)] =
			"CollecteEleve";
		GenreCommandeCreation[(GenreCommandeCreation["CollecteEleveParResp"] = 4)] =
			"CollecteEleveParResp";
		GenreCommandeCreation[(GenreCommandeCreation["CollecteResp"] = 5)] =
			"CollecteResp";
	})(
		(GenreCommandeCreation =
			InterfaceCasier.GenreCommandeCreation ||
			(InterfaceCasier.GenreCommandeCreation = {})),
	);
})(InterfaceCasier || (exports.InterfaceCasier = InterfaceCasier = {}));

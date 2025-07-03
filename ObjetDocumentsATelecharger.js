exports.DonneesListe_DocumentATelecharger = exports.ObjetDocumentsATelecharger =
	void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteDocumentsATelecharger_1 = require("ObjetRequeteDocumentsATelecharger");
const ObjetElement_1 = require("ObjetElement");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetInterface_1 = require("ObjetInterface");
const UtilitaireDocument_1 = require("UtilitaireDocument");
const UtilitaireDocumentATelecharger_1 = require("UtilitaireDocumentATelecharger");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_DocTelechargement_1 = require("Enumere_DocTelechargement");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
const AccessApp_1 = require("AccessApp");
const GUID_1 = require("GUID");
class ObjetDocumentsATelecharger extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecScroll: true,
			avecEvent: false,
			avecCouleurCategorie: false,
			avecIconeDocument: false,
			avecBtnEllipsis: false,
			avecFiltreCategorie: false,
			avecFiltreNonLus: false,
			avecFiltreNonSignes: false,
			avecIntertitreAnnee: true,
			avecLigneOff: false,
			avecCompteurSurDeploiement: false,
		};
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._eventListe.bind(this),
			this._intiListe.bind(this),
		);
	}
	construireAffichage() {
		if (this.listeDocs) {
			const H = [];
			H.push(
				`<div class="ObjetDocumentsATelecharger" id="${this.getNomInstance(this.identListe)}" style="height:100%; width:100%" ></div>`,
			);
			return H.join("");
		}
		return "";
	}
	callbackChipsSuppresion(aArticle) {
		this.callback.appel({
			genreEvenement:
				ObjetDocumentsATelecharger.EGenreEventDocumentATelecharger
					.SuppressionPJ,
			article: aArticle,
		});
	}
	setOptions(aOptions) {
		Object.assign(this.options, aOptions);
		if (!aOptions.callbackSetMesDocuments) {
			this.options.callbackSetMesDocuments = undefined;
		}
		return this;
	}
	async setDonnees(aParams) {
		this.listeDocs = null;
		if ("listeCategories" in aParams && aParams.listeCategories) {
			this.listeCategories = aParams.listeCategories;
		}
		if ("ariaLabelListe" in aParams && aParams.ariaLabelListe) {
			this.setOptionsListe({ ariaLabel: aParams.ariaLabelListe });
		}
		this.afficher();
		return Promise.resolve()
			.then(() => {
				if (aParams && "listeDocs" in aParams && aParams.listeDocs) {
					this.listeDocs = aParams.listeDocs;
					return;
				}
				return new ObjetRequeteDocumentsATelecharger_1.ObjetRequeteDocumentsATelecharger(
					this,
				)
					.lancerRequete(aParams)
					.then((aJSON) => {
						this.listeDocs = aJSON.liste;
					})
					.catch((e) => {});
			})
			.then(() => {
				this.afficher();
				this._afficherListeDocs();
				if (
					this.listeDocs &&
					this.Pere &&
					"surResizeInterface" in this.Pere &&
					MethodesObjet_1.MethodesObjet.isFunction(this.Pere.surResizeInterface)
				) {
					this.Pere.surResizeInterface();
				}
				return { listeDocs: this.listeDocs };
			});
	}
	setOptionsListe(aOptions) {
		const lListe = this.getInstance(this.identListe);
		if (lListe && aOptions) {
			lListe.setOptionsListe(aOptions);
		}
	}
	callbackMenuCtxListe(aParams) {
		if (this.options.avecEvent) {
			if (
				aParams &&
				aParams.data &&
				MethodesObjet_1.MethodesObjet.isNumeric(aParams.data.genreEvenement) &&
				aParams.data.article
			) {
				this.callback.appel({
					genreEvenement:
						ObjetDocumentsATelecharger.EGenreEventDocumentATelecharger
							.evenementMenuCtx,
					genreEvenementMenuCtx: aParams.data.genreEvenement,
					article: aParams.data.article,
				});
			}
		}
	}
	_intiListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"DocumentsATelecharger.Aucun",
			),
			avecOmbreDroite: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
			ariaLabel: (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.getLibelleLongOnglet(),
		});
	}
	_eventListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (this.options.avecEvent) {
					this.callback.appel({
						genreEvenement:
							ObjetDocumentsATelecharger.EGenreEventDocumentATelecharger
								.evenementListe,
						genreEvenementListe:
							Enumere_EvenementListe_1.EGenreEvenementListe.Selection,
						article: aParams.article,
					});
				} else if (
					aParams &&
					aParams.article &&
					aParams.article.typeDocument ===
						Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletinBIA
				) {
					const lOuvrirPDFEtCloud =
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
							UtilitaireDocumentATelecharger_1.EGenreActionDAT.ouvrirPDFEtCloud,
							aParams.article,
						);
					if (lOuvrirPDFEtCloud.event) {
						lOuvrirPDFEtCloud.event();
					}
				}
				break;
			default:
				break;
		}
	}
	_formatDonnees(aListe) {
		if (!this.options.avecIntertitreAnnee) {
			return aListe;
		}
		const lCountListe = aListe.count();
		if (aListe && lCountListe > 0) {
			const lListeResult = new ObjetListeElements_1.ObjetListeElements();
			let lAnneePrecedente = 0;
			let lIndex = 0;
			const lListeBulletinDiplome = aListe;
			lListeBulletinDiplome.parcourir((aElem) => {
				if (
					MethodesObjet_1.MethodesObjet.isNumeric(aElem.annee) &&
					aElem.annee !== lAnneePrecedente
				) {
					lAnneePrecedente = aElem.annee;
					const lNombreFils = lListeBulletinDiplome
						.getListeElements((aElement) => aElement.annee === lAnneePrecedente)
						.count();
					const lElementInterTitre = ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur(
								"DocumentsATelecharger.Annee",
							) +
							" " +
							lAnneePrecedente +
							"/" +
							(lAnneePrecedente + 1),
						nbFils: lNombreFils,
						estUnDeploiement: true,
						estDeploye: true,
						annee: lAnneePrecedente,
					});
					lListeResult.addElement(lElementInterTitre, lIndex);
					lIndex++;
				}
				const lPere = lListeResult.getListeElements(
					(aElement) =>
						aElement.annee === lAnneePrecedente && aElement.estUnDeploiement,
				);
				const lParam = {};
				if (lPere.count() === 1) {
					lParam.pere = lPere.get(0);
				}
				lListeResult.addElement(Object.assign(aElem, lParam), lIndex);
				lIndex++;
			});
			return lListeResult;
		}
	}
	_afficherListeDocs() {
		const lInstanceliste = this.getInstance(this.identListe);
		lInstanceliste.setDonnees(
			new DonneesListe_DocumentATelecharger(
				this._formatDonnees(this.listeDocs),
				{
					listeCategories:
						this.listeCategories ||
						new ObjetListeElements_1.ObjetListeElements(),
					callbackMenuCtx: this.callbackMenuCtxListe.bind(this),
					callbackChipsSuppresion: this.callbackChipsSuppresion.bind(this),
					avecCouleurCategorie: this.options.avecCouleurCategorie,
					avecIconeDocument: this.options.avecIconeDocument,
					avecBtnEllipsis: this.options.avecBtnEllipsis,
					avecFiltreCategorie: this.options.avecFiltreCategorie,
					avecFiltreNonLus: this.options.avecFiltreNonLus,
					avecFiltreNonSignes: this.options.avecFiltreNonSignes,
					avecLigneOff: this.options.avecLigneOff,
					avecCompteurSurDeploiement: this.options.avecCompteurSurDeploiement,
					avecMessagePourPrevenirEvent: !this.options.avecEvent,
					callbackSetMesDocuments:
						this.options.callbackSetMesDocuments || undefined,
				},
			).setOptions({ avecTri: false }),
		);
	}
}
exports.ObjetDocumentsATelecharger = ObjetDocumentsATelecharger;
(function (ObjetDocumentsATelecharger) {
	let EGenreEventDocumentATelecharger;
	(function (EGenreEventDocumentATelecharger) {
		EGenreEventDocumentATelecharger[
			(EGenreEventDocumentATelecharger["evenementListe"] = 1)
		] = "evenementListe";
		EGenreEventDocumentATelecharger[
			(EGenreEventDocumentATelecharger["evenementMenuCtx"] = 2)
		] = "evenementMenuCtx";
		EGenreEventDocumentATelecharger[
			(EGenreEventDocumentATelecharger["SuppressionPJ"] = 3)
		] = "SuppressionPJ";
	})(
		(EGenreEventDocumentATelecharger =
			ObjetDocumentsATelecharger.EGenreEventDocumentATelecharger ||
			(ObjetDocumentsATelecharger.EGenreEventDocumentATelecharger = {})),
	);
})(
	ObjetDocumentsATelecharger ||
		(exports.ObjetDocumentsATelecharger = ObjetDocumentsATelecharger = {}),
);
class DonneesListe_DocumentATelecharger extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.idlabelNatures = GUID_1.GUID.getId();
		this.filtre = { cbNonLu: false, cbNonSigne: false, indiceCategorie: 0 };
		this.callbackMenuCtx = aParams.callbackMenuCtx;
		this.avecMessagePourPrevenirEvent = aParams.avecMessagePourPrevenirEvent;
		this.avecCouleurCategorie = aParams.avecCouleurCategorie;
		this.callbackChipsSuppresion = aParams.callbackChipsSuppresion;
		this.listeCategories = MethodesObjet_1.MethodesObjet.dupliquer(
			aParams.listeCategories,
		);
		this.avecIconeDocument = aParams.avecIconeDocument;
		this.avecFiltreCategorie = aParams.avecFiltreCategorie;
		this.avecFiltreNonLus = aParams.avecFiltreNonLus;
		this.avecFiltreNonSignes = aParams.avecFiltreNonSignes;
		this.avecBtnEllipsis = aParams.avecBtnEllipsis;
		this.avecLigneOff = aParams.avecLigneOff;
		this.avecCompteurSurDeploiement = aParams.avecCompteurSurDeploiement;
		if (aParams.callbackSetMesDocuments) {
			this.callbackSetMesDocuments = aParams.callbackSetMesDocuments;
		}
		if (this.listeCategories.count() > 0) {
			this.listeCategories.insererElement(
				ObjetElement_1.ObjetElement.create({
					estTotal: true,
					Libelle: ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.toutesLesNatures",
					),
					couleur: undefined,
				}),
				0,
			);
		}
		this.setOptions({
			avecIndentationSousInterTitre: true,
			avecSelection: true,
			avecEvnt_Selection: true,
		});
	}
	getControleur(aInstance, aListe) {
		return $.extend(true, super.getControleur(aInstance, aListe), {
			chipsPieceJointe: {
				eventBtn(aIndice, aNumero) {
					const lElement = aInstance.Donnees.getElementParNumero(aNumero);
					if (lElement) {
						const lPJ = lElement.listePJ.get(aIndice);
						if (lPJ) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.messageSuppression",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
										lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
										aInstance.callbackChipsSuppresion(lElement);
									}
								},
							});
						}
					}
				},
			},
		});
	}
	estDeploiement(aArticle) {
		return "estUnDeploiement" in aArticle && aArticle.estUnDeploiement;
	}
	getTitreZonePrincipale(aParams) {
		let lParam = {};
		if (
			"estUnDeploiement" in aParams.article &&
			aParams.article.estUnDeploiement &&
			this.avecCompteurSurDeploiement
		) {
			const lListeEnfantsAvecLaMemeCategorie = this.Donnees.getListeElements(
				(aI) => {
					let lValue = false;
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
							aI,
						)
					) {
						if (
							"categorie" in aI &&
							aI.categorie &&
							"categorie" in aParams.article &&
							aParams.article.categorie &&
							aI.categorie.getNumero() ===
								aParams.article.categorie.getNumero() &&
							!this.estDeploiement(aI)
						) {
							lValue = true;
							if (
								this.avecFiltreNonSignes &&
								this.filtre.cbNonSigne &&
								!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									aI,
								) &&
								!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aI,
								)
							) {
								lValue = false;
							}
						}
					} else {
						if (
							"categorie" in aI &&
							aI.categorie &&
							"categorie" in aParams.article &&
							aParams.article.categorie &&
							aI.categorie.getNumero() ===
								aParams.article.categorie.getNumero() &&
							!this.estDeploiement(aI)
						) {
							lValue = true;
							if (
								this.avecFiltreNonLus &&
								this.filtre.cbNonLu &&
								(!("estNonLu" in aI) || !aI.estNonLu)
							) {
								lValue = false;
							}
						}
					}
					return lValue;
				},
			);
			lParam = { compteur: lListeEnfantsAvecLaMemeCategorie.count() };
		}
		return this.getInfoDoc(aParams.article, lParam).html;
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.titre
		) {
			return this.getInfoDoc(aParams.article, {
				avecMessagePourPrevenirEvent: this.avecMessagePourPrevenirEvent,
			}).wai;
		} else if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.message
		) {
			return this._avecMessageAdeposer(aParams.article)
				? ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.documentADeposer",
					)
				: "";
		}
	}
	getInfoDoc(aArticle, aParams = {}) {
		const lInfo = { wai: "", html: "", titre: "", message: "" };
		const lArticle = aArticle;
		if ("estUnDeploiement" in lArticle && lArticle.estUnDeploiement) {
			lInfo.wai = `${lArticle.Libelle} ${MethodesObjet_1.MethodesObjet.isNumeric(aParams.compteur) ? `(${aParams.compteur})` : ""}`;
			lInfo.html = lInfo.wai;
			lInfo.titre = lInfo.html;
		} else if ("typeDocument" in lArticle) {
			switch (lArticle.typeDocument) {
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentAFournir: {
					lInfo.wai = lArticle.Libelle;
					lInfo.html = lInfo.wai;
					lInfo.titre = lInfo.html;
					const lEstJourDeposable =
						"dateLimiteDepot" in lArticle &&
						(ObjetDate_1.GDate.estDateJourAvant(
							ObjetDate_1.GDate.aujourdhui,
							lArticle.dateLimiteDepot,
						) ||
							ObjetDate_1.GDate.estJourEgal(
								ObjetDate_1.GDate.aujourdhui,
								lArticle.dateLimiteDepot,
							));
					if ("avecDepotAutorise" in lArticle && lEstJourDeposable) {
						const lDateFormat = ObjetDate_1.GDate.formatDate(
							lArticle.dateLimiteDepot,
							"%J %MMM",
						);
						lInfo.message = ObjetTraduction_1.GTraductions.getValeur(
							"documentsATelecharger.aJoindreJusquau",
							[lDateFormat],
						).ucfirst();
					}
					if (
						(!("avecDepotAutorise" in lArticle) ||
							!lArticle.avecDepotAutorise) &&
						!lEstJourDeposable
					) {
						lInfo.message = ObjetTraduction_1.GTraductions.getValeur(
							"documentsATelecharger.dateLimiteDepassee",
						);
					}
					break;
				}
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.documents:
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.documentCasier:
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.documentMembre:
					lInfo.wai = lArticle.Libelle;
					lInfo.html = lInfo.wai;
					lInfo.titre = lInfo.html;
					break;
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentsASigner:
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentSigneFinalise: {
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
							lArticle,
						)
					) {
						lInfo.wai = lArticle.getLibelle();
						lInfo.html =
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.composeTitreSelonEtat(
								lArticle,
							);
						lInfo.titre = lArticle.getLibelle();
					}
					break;
				}
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletinBIA:
					{
						const lBulletinBIA = lArticle;
						lInfo.wai = aParams.avecMessagePourPrevenirEvent
							? ObjetTraduction_1.GTraductions.getValeur(
									"documentsATelecharger.genererLePdf",
								)
							: "" +
								`${lBulletinBIA.bulletin.libelle} - ${lBulletinBIA.bulletin.libellePeriodeNotation} - ${lBulletinBIA.bulletin.libelleClasse}`;
						lInfo.html = lInfo.wai;
						lInfo.titre = lInfo.html;
					}
					break;
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.bulletin:
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.bulletinDeCompetences:
					{
						const lBulletin = lArticle;
						lInfo.wai = `${lBulletin.getLibelle()} - ${lBulletin.periode.getLibelle()} - ${lBulletin.classe.getLibelle()}`;
						lInfo.html = lInfo.wai;
						lInfo.titre = lInfo.html;
					}
					break;
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.projetAcc:
					lInfo.wai = `${lArticle.getLibelle()} - ${ObjetTraduction_1.GTraductions.getValeur("PageCompte.AmenagementsProjet")}`;
					lInfo.html = lInfo.wai;
					lInfo.titre = lArticle.getLibelle();
					break;
				case Enumere_DocTelechargement_1.EGenreDocTelechargement.diplome:
					lInfo.wai = lArticle.getLibelle();
					lInfo.html = lInfo.wai;
					lInfo.titre = lInfo.wai;
					break;
				default:
					break;
			}
		} else {
		}
		return lInfo;
	}
	avecEvenementSelection(aParams) {
		return !this.estDeploiement(aParams.article);
	}
	avecEvenementSelectionClick(aParams) {
		return !this.estDeploiement(aParams.article);
	}
	getClass(aParams) {
		if ("estInterTitre" in aParams.article && aParams.article.estInterTitre) {
			return "theme_color_moyen1";
		}
		return "";
	}
	getStrPublication(aArticle) {
		if (!("typeDocument" in aArticle)) {
			return "";
		}
		const cFormatDate = "%J %MMM";
		switch (aArticle.typeDocument) {
			case Enumere_DocTelechargement_1.EGenreDocTelechargement
				.documentSigneFinalise:
				if ("dateSignature" in aArticle) {
					return `${ObjetTraduction_1.GTraductions.getValeur("Casier.signeLe", [ObjetDate_1.GDate.formatDate(aArticle.dateSignature, cFormatDate)])}`;
				}
				break;
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.documentsASigner:
				if ("dateEnvoi" in aArticle) {
					return `${ObjetTraduction_1.GTraductions.getValeur("Casier.diffuseLe", [ObjetDate_1.GDate.formatDate(aArticle.dateEnvoi, cFormatDate)])}`;
				}
				break;
			case Enumere_DocTelechargement_1.EGenreDocTelechargement.projetAcc:
				if ("dateDebut" in aArticle && aArticle.dateDebut && aArticle.dateFin) {
					return `${ObjetTraduction_1.GTraductions.getValeur("Du").ucfirst()} ${ObjetDate_1.GDate.formatDate(aArticle.dateDebut, cFormatDate)} ${ObjetTraduction_1.GTraductions.getValeur("Au").toLowerCase()} ${ObjetDate_1.GDate.formatDate(aArticle.dateFin, cFormatDate)}`;
				}
				break;
			default:
				if (
					"dateDebutPublication" in aArticle &&
					aArticle.dateDebutPublication &&
					aArticle.dateFinPublication
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.publieDuAu",
						[
							ObjetDate_1.GDate.formatDate(
								aArticle.dateDebutPublication,
								cFormatDate,
							),
							ObjetDate_1.GDate.formatDate(
								aArticle.dateFinPublication,
								cFormatDate,
							),
						],
					);
				} else if (
					"date" in aArticle &&
					aArticle.date &&
					!aArticle.LibelleDepositaire
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.publieLe",
						[ObjetDate_1.GDate.formatDate(aArticle.date, cFormatDate)],
					);
				} else if ("dateLimiteDepot" in aArticle && aArticle.dateLimiteDepot) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.jusquAu",
						[
							ObjetDate_1.GDate.formatDate(
								aArticle.dateLimiteDepot,
								cFormatDate,
							),
						],
					);
				}
				break;
		}
		return "";
	}
	getZoneMessage(aParams) {
		const H = [];
		if (!this.estDeploiement(aParams.article)) {
			if (
				UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
					aParams.article,
				)
			) {
				H.push(
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.composeHtmlMessagePourListe(
						aParams.article,
					),
				);
			} else {
				const strPublication = this.getStrPublication(aParams.article);
				H.push(`<div>`);
				if (strPublication.length > 0) {
					H.push(`<div>${strPublication}</div>`);
				}
				if (
					"LibelleDepositaire" in aParams.article &&
					aParams.article.LibelleDepositaire
				) {
					if (
						"dateDebutPublication" in aParams.article &&
						aParams.article.dateDebutPublication &&
						"dateFinPublication" in aParams.article &&
						aParams.article.dateFinPublication
					) {
						H.push(
							`<div>${ObjetTraduction_1.GTraductions.getValeur("documentsATelecharger.diffusePar", [aParams.article.LibelleDepositaire])}</div>`,
						);
					} else {
						H.push(
							`<div>${ObjetTraduction_1.GTraductions.getValeur("documentsATelecharger.diffuseParLe", [aParams.article.LibelleDepositaire, ObjetDate_1.GDate.formatDate(aParams.article.date, "%J %MMM")])}</div>`,
						);
					}
				}
				if (
					"listePJ" in aParams.article &&
					aParams.article.listePJ &&
					aParams.article.listePJ.count() === 1
				) {
					H.push(this._composeListeChips(aParams.article));
				}
				H.push(`</div>`);
			}
		}
		if (this._avecMessageAdeposer(aParams.article)) {
			H.push('<span class="like-link alert-color">');
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"DocumentsATelecharger.ADeposer",
				),
			);
			H.push('<i role="presentation" class="icon_justifier"></i>');
			H.push("</span>");
		}
		const lAvecMessageDepot =
			"listePJ" in aParams.article &&
			aParams.article.listePJ &&
			aParams.article.listePJ.count() === 1;
		if (lAvecMessageDepot) {
			let lCleTrad;
			if (
				"estDeposeParEtablissement" in aParams.article &&
				aParams.article.estDeposeParEtablissement
			) {
				lCleTrad = ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.deposeparEtablissement",
					[
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateDepotDoc,
							"%J %MMM",
						),
					],
				);
			} else if (
				"estLeProprietaire" in aParams.article &&
				aParams.article.estLeProprietaire
			) {
				lCleTrad = ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.deposeParMoi",
					[
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateDepotDoc,
							"%J %MMM",
						),
					],
				);
			} else if (
				"estDeposeParUnAutreResponsable" in aParams.article &&
				aParams.article.estDeposeParUnAutreResponsable
			) {
				lCleTrad = ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.deposeParUnResponsable",
					[
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateDepotDoc,
							"%J %MMM",
						),
					],
				);
			}
			H.push(
				'<div class="flex-contain justify-end flex-center p-right m-top">',
			);
			H.push(lCleTrad);
			H.push("</div>");
		}
		return H.join("");
	}
	initialisationObjetContextuel(aParams) {
		const lActions = new ObjetListeElements_1.ObjetListeElements();
		if ("typeDocument" in aParams.article) {
			switch (aParams.article.typeDocument) {
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentCasier: {
					const lSupprimer =
						UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
							UtilitaireDocumentATelecharger_1.EGenreActionDAT.supprimer,
							aParams.article,
						);
					if ("estNonLu" in aParams.article && aParams.article.estNonLu) {
						const lMarquerLu =
							UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
								UtilitaireDocumentATelecharger_1.EGenreActionDAT.marquerLu,
								aParams.article,
							);
						lActions.add(lMarquerLu.actionMenuCtx);
					} else if (
						"estNonLu" in aParams.article &&
						aParams.article.estNonLu === false
					) {
						const lMarquerNonLu =
							UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
								UtilitaireDocumentATelecharger_1.EGenreActionDAT.marquerNonLu,
								aParams.article,
							);
						lActions.add(lMarquerNonLu.actionMenuCtx);
					}
					lActions.add(lSupprimer.actionMenuCtx);
					break;
				}
				case Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentSigneFinalise: {
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
							aParams.article,
						) &&
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
							aParams.article,
						)
					) {
						if (aParams.article.estNonLu) {
							const lMarquerLu =
								UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
									UtilitaireDocumentATelecharger_1.EGenreActionDAT.marquerLu,
									aParams.article,
								);
							lActions.add(lMarquerLu.actionMenuCtx);
						} else if (aParams.article.estNonLu === false) {
							const lMarquerNonLu =
								UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getAction(
									UtilitaireDocumentATelecharger_1.EGenreActionDAT.marquerNonLu,
									aParams.article,
								);
							lActions.add(lMarquerNonLu.actionMenuCtx);
						}
					}
					break;
				}
				default:
					break;
			}
		}
		if (lActions && lActions.count() > 0) {
			lActions.parcourir((aAction) => {
				const lExtend = {};
				if (aAction.icon) {
					lExtend.icon = aAction.icon;
				}
				if (aAction.genreEvenement) {
					lExtend.data = {
						genreEvenement: aAction.genreEvenement
							? aAction.genreEvenement
							: undefined,
						article: aParams.article,
					};
				}
				aParams.menuContextuel.add(
					aAction.getLibelle(),
					aAction.actif,
					this.callbackMenuCtx,
					lExtend,
				);
			});
		}
		aParams.menuContextuel.setDonnees();
	}
	getZoneGauche(aParams) {
		let lIcone = "";
		if (this.avecIconeDocument && !this.estDeploiement(aParams.article)) {
			let lClass =
				Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
					Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf,
				);
			let lLabel = UtilitaireDocument_1.UtilitaireDocument.getTitleFromGenre(
				Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf,
			);
			if ("typeDocument" in aParams.article) {
				switch (aParams.article.typeDocument) {
					case Enumere_DocTelechargement_1.EGenreDocTelechargement
						.documentCasier:
						lClass =
							UtilitaireDocument_1.UtilitaireDocument.getIconFromFileName(
								aParams.article.getLibelle(),
							);
						lLabel =
							UtilitaireDocument_1.UtilitaireDocument.getTitleFromFileName(
								aParams.article.getLibelle(),
							);
						break;
					case Enumere_DocTelechargement_1.EGenreDocTelechargement
						.documentsASigner:
						lClass = "";
						break;
					case Enumere_DocTelechargement_1.EGenreDocTelechargement
						.documentSigneFinalise:
						if ("etatDocument" in aParams.article) {
							if (
								!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentVisualisable(
									aParams.article,
								)
							) {
								lClass = "icon_signature";
							} else {
								lClass =
									UtilitaireDocument_1.UtilitaireDocument.getIconFromFileName(
										aParams.article.getLibelle(),
									);
								lLabel =
									UtilitaireDocument_1.UtilitaireDocument.getTitleFromFileName(
										aParams.article.getLibelle(),
									);
							}
						}
						break;
					default:
						break;
				}
			}
			lIcone = IE.jsx.str("i", {
				"ie-tooltiplabel": lLabel,
				role: "img",
				class: [lClass, "i-medium"],
			});
		}
		if (this.avecCouleurCategorie && this.estDeploiement(aParams.article)) {
			lIcone =
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getIconListeRubrique(
					aParams.article,
					{ height: "2.5rem" },
				);
		}
		return lIcone;
	}
	getZoneComplementaire(aParams) {
		if (
			"memo" in aParams.article &&
			aParams.article.memo &&
			aParams.article.memo.length > 0
		) {
			return IE.jsx.str("i", {
				class: "icon_post_it_rempli theme_color_moyen1 i-medium",
				role: "img",
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"documentsATelecharger.hintMemo",
				),
			});
		}
		return "";
	}
	estLigneOff(aParams) {
		if (
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				aParams.article,
			) &&
			!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
				aParams.article,
			)
		) {
			return (
				!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
					aParams.article,
				) &&
				!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
					aParams.article,
				)
			);
		}
		if (this.avecLigneOff) {
			return (
				(!("estNonLu" in aParams.article) || !aParams.article.estNonLu) &&
				!this.estDeploiement(aParams.article)
			);
		}
		return super.estLigneOff(aParams);
	}
	construireFiltres() {
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "cols"] },
			this.avecFiltreNonSignes &&
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxDocumentsNonSignes.bind(this) },
					ObjetTraduction_1.GTraductions.getValeur("Casier.FiltreNonSignes"),
				),
			this.avecFiltreNonLus &&
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxDocumentsNonLus.bind(this) },
					ObjetTraduction_1.GTraductions.getValeur(
						"documentsATelecharger.nonLus",
					),
				),
			this.avecFiltreNonLus &&
				this.avecFiltreCategorie &&
				IE.jsx.str("div", { class: ["DAT_separateur", "m-y-l"] }),
			this.avecFiltreCategorie &&
				IE.jsx.str(
					"label",
					{ class: ["m-bottom-l"], id: this.idlabelNatures },
					ObjetTraduction_1.GTraductions.getValeur("Casier.natures"),
				),
			this.avecFiltreCategorie &&
				IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelFiltreCategories.bind(this),
					class: "combo-sans-fleche",
				}),
		);
	}
	reinitFiltres() {
		(this.filtre.cbNonLu = false),
			(this.filtre.cbNonSigne = false),
			(this.filtre.indiceCategorie = 0);
		this.paramsListe.actualiserListe();
	}
	estFiltresParDefaut() {
		return (
			!this.filtre.cbNonSigne &&
			!this.filtre.cbNonLu &&
			this.filtre.indiceCategorie === 0
		);
	}
	jsxModeleCheckboxDocumentsNonLus() {
		return {
			getValue: () => {
				return this.filtre.cbNonLu;
			},
			setValue: (aValue) => {
				this.filtre.cbNonLu = !!aValue;
				this.paramsListe.actualiserListe();
			},
		};
	}
	jsxModeleCheckboxDocumentsNonSignes() {
		return {
			getValue: () => {
				return this.filtre.cbNonSigne;
			},
			setValue: (aValue) => {
				this.filtre.cbNonSigne = !!aValue;
				this.paramsListe.actualiserListe();
			},
		};
	}
	jsxComboModelFiltreCategories() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					ariaLabelledBy: this.idlabelNatures,
					estLargeurAuto: true,
				});
			},
			getDonnees: () => {
				if (this.listeCategories) {
					return this.listeCategories;
				}
			},
			getIndiceSelection: () => {
				return MethodesObjet_1.MethodesObjet.isNumeric(
					this.filtre.indiceCategorie,
				)
					? this.filtre.indiceCategorie
					: -1;
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.element
				) {
					this.filtre.indiceCategorie =
						this.listeCategories.getIndiceElementParFiltre(
							(aCat) => aCat === aParams.element,
						);
					this.paramsListe.actualiserListe();
				}
			},
		};
	}
	getVisible(aArticle) {
		let lVisible = true;
		if (this.avecFiltreCategorie) {
			const lFiltre = this.listeCategories.get(this.filtre.indiceCategorie);
			if (lFiltre && !lFiltre.estTotal) {
				lVisible =
					"categorie" in aArticle &&
					aArticle.categorie &&
					aArticle.categorie.getNumero() === lFiltre.getNumero();
			}
		}
		if (lVisible && this.avecFiltreNonLus && this.filtre.cbNonLu) {
			if (aArticle.estUnDeploiement) {
				let lAvecEnfantNonLu =
					this.Donnees.getListeElements((aElement) => {
						return (
							!this.estDeploiement(aElement) &&
							"pere" in aElement &&
							"categorie" in aElement.pere &&
							aElement.pere.categorie &&
							"categorie" in aArticle &&
							aArticle.categorie &&
							aElement.pere.categorie.getNumero() ===
								aArticle.categorie.getNumero() &&
							"estNonLu" in aElement &&
							aElement.estNonLu
						);
					}).count() > 0;
				lVisible = lAvecEnfantNonLu;
			} else {
				lVisible = "estNonLu" in aArticle && aArticle.estNonLu;
			}
		}
		if (lVisible && this.avecFiltreNonSignes && this.filtre.cbNonSigne) {
			if (aArticle.estUnDeploiement) {
				let lAvecEnfantNonSigne =
					this.Donnees.getListeElements((aElement) => {
						return (
							!this.estDeploiement(aElement) &&
							UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
								aElement,
							) &&
							"pere" in aElement &&
							"categorie" in aElement.pere &&
							aElement.pere.categorie &&
							"categorie" in aArticle &&
							aArticle.categorie &&
							aElement.pere.categorie.getNumero() ===
								aArticle.categorie.getNumero() &&
							(UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
								aElement,
							) ||
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aElement,
								))
						);
					}).count() > 0;
				lVisible = lAvecEnfantNonSigne;
			} else {
				lVisible =
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aArticle,
					) &&
					(UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
						aArticle,
					) ||
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
							aArticle,
						));
			}
		}
		return !!lVisible;
	}
	avecBoutonActionLigne(aParams) {
		const avecBtnEllipsis =
			"typeDocument" in aParams.article &&
			[
				Enumere_DocTelechargement_1.EGenreDocTelechargement.documentCasier,
			].includes(aParams.article.typeDocument);
		const avecBtnEllipsisDocSigner =
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				aParams.article,
			) &&
			aParams.article.typeDocument ===
				Enumere_DocTelechargement_1.EGenreDocTelechargement
					.documentSigneFinalise &&
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
				aParams.article,
			);
		return (
			super.avecBoutonActionLigne(aParams) &&
			!aParams.article.estUnDeploiement &&
			this.avecBtnEllipsis &&
			(avecBtnEllipsis || avecBtnEllipsisDocSigner)
		);
	}
	_composeListeChips(aArticle) {
		const H = [];
		const lArticle = aArticle;
		if (
			lArticle &&
			"listePJ" in lArticle &&
			lArticle.listePJ &&
			lArticle.listePJ.count() > 0 &&
			lArticle.docConsultable
		) {
			let lClass =
				Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
					Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf,
				);
			if (
				"typeDocument" in aArticle &&
				Enumere_DocTelechargement_1.EGenreDocTelechargement.documentCasier ===
					aArticle.typeDocument
			) {
				lClass = UtilitaireDocument_1.UtilitaireDocument.getIconFromFileName(
					aArticle.getLibelle(),
				);
			}
			H.push(
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(lArticle.listePJ, {
					genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
					IEModelChips:
						!!lArticle.docEditable && !!lArticle.docDeposableALaDate
							? "chipsPieceJointe"
							: "",
					argsIEModelChips: [lArticle.getNumero()],
					class: lClass,
				}),
			);
		}
		return H.join("");
	}
	_avecMessageAdeposer(aArticle) {
		return (
			aArticle &&
			"docEditable" in aArticle &&
			aArticle.docEditable &&
			"docConsultable" in aArticle &&
			aArticle.docConsultable &&
			"listePJ" in aArticle &&
			aArticle.listePJ &&
			aArticle.listePJ.count() === 0
		);
	}
}
exports.DonneesListe_DocumentATelecharger = DonneesListe_DocumentATelecharger;

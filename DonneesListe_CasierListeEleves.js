exports.DonneesListe_CasierListeEleves = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const UtilitaireDocument_1 = require("UtilitaireDocument");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const DonneesListe_SelectionDiffusion_1 = require("DonneesListe_SelectionDiffusion");
const ObjetFenetre_SelectionListeDiffusion_1 = require("ObjetFenetre_SelectionListeDiffusion");
const Cache_1 = require("Cache");
const ObjetRequeteSaisieActualites_1 = require("ObjetRequeteSaisieActualites");
const ObjetRequeteListeDiffusion_1 = require("ObjetRequeteListeDiffusion");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MoteurGestionPJPN_1 = require("MoteurGestionPJPN");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_3 = require("GestionnaireBlocPN");
const FicheEditionInfoSond_Mobile_1 = require("FicheEditionInfoSond_Mobile");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const ObjetRequeteSaisieExportFichierProf_js_1 = require("ObjetRequeteSaisieExportFichierProf.js");
const AccessApp_1 = require("AccessApp");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireCasier_1 = require("UtilitaireCasier");
const TypeCasier_1 = require("TypeCasier");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const Enumere_Etat_1 = require("Enumere_Etat");
var indiceRadioBtn;
(function (indiceRadioBtn) {
	indiceRadioBtn[(indiceRadioBtn["tous"] = 0)] = "tous";
	indiceRadioBtn[(indiceRadioBtn["avecDepot"] = 1)] = "avecDepot";
	indiceRadioBtn[(indiceRadioBtn["sansDepot"] = 2)] = "sansDepot";
})(indiceRadioBtn || (indiceRadioBtn = {}));
class DonneesListe_CasierListeEleves extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		var _a;
		super(aDonnees);
		this.isObjetElementDocumentEleveCollecteParDocument = (aElement) => {
			return "strIndividu" in aElement && this.estDepotParDocument;
		};
		this.estDeposerParLeResponsable = (aElement) => {
			return (
				aElement.genreDestinataire ===
				Enumere_Ressource_1.EGenreRessource.Responsable
			);
		};
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.listeResponsables = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listeResponsables,
		);
		this.avecDroitSaisieInfoSondages = aParam.avecDroitSaisieInfoSondages;
		this.avecDroitDiscution = aParam.avecDroitDiscution;
		this.collecte = aParam.collecte;
		this.avecFonctionnalite = aParam.avecFonctionnaliteArticle;
		this.eventMenuCtx = aParam.eventMenuCtx;
		this.estDepotParDocument = aParam.estDepotParDocument;
		this.optionsCasier = Object.assign(
			{ avecFiltreClasse: false, afficherClasse: false },
			(_a = aParam.optionsCasier) !== null && _a !== void 0 ? _a : {},
		);
		this.listeRadioBtn = [
			{
				libelle: this.estDepotParDocument
					? ObjetTraduction_1.GTraductions.getValeur(
							"Casier.tousLesIndivdusConcernes",
						)
					: ObjetTraduction_1.GTraductions.getValeur("Casier.tousLesDocuments"),
				indice: indiceRadioBtn.tous,
			},
			{
				libelle: this.estDepotParDocument
					? ObjetTraduction_1.GTraductions.getValeur("Casier.uniqAvecDepot")
					: ObjetTraduction_1.GTraductions.getValeur("Casier.uniqCeuxDeposes"),
				indice: indiceRadioBtn.avecDepot,
			},
			{
				libelle: this.estDepotParDocument
					? ObjetTraduction_1.GTraductions.getValeur("Casier.uniqSansDepot")
					: ObjetTraduction_1.GTraductions.getValeur(
							"Casier.uniqCeuxNonDeposes",
						),
				indice: indiceRadioBtn.sansDepot,
			},
		];
		this.filtre = this.getFiltreDefaut();
	}
	setOptionsCasier(aParam) {
		Object.assign(this.optionsCasier, aParam);
	}
	getTitreZonePrincipale(aParams) {
		if (this.isObjetElementDocumentEleveCollecteParDocument(aParams.article)) {
			const lEstDeposerParResponsable = this.estDeposerParLeResponsable(
				aParams.article,
			);
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"p",
					null,
					aParams.article.strIndividu,
					" ",
					!lEstDeposerParResponsable &&
						aParams.article.classe &&
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							"(",
							aParams.article.classe.getLibelle(),
							")",
						),
				),
				lEstDeposerParResponsable &&
					aParams.article.strComplement &&
					IE.jsx.str("p", null, "(", aParams.article.strComplement, ")"),
			);
		}
		return aParams.article.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		const lDoc = DonneesListe_CasierListeEleves.getPJ(aParams.article);
		if (this.isObjetElementDocumentEleveCollecteParDocument(aParams.article)) {
			return lDoc
				? IE.jsx.str(
						"p",
						null,
						IE.jsx.str("span", { "ie-ellipsis-fixe": true }, lDoc.getLibelle()),
						" - ",
						ObjetTraduction_1.GTraductions.getValeur("Casier.DeposeLe", [
							ObjetDate_1.GDate.formatDate(lDoc.dateDepot, "%J %MMM"),
						]),
					)
				: "";
		}
		return (lDoc === null || lDoc === void 0 ? void 0 : lDoc.depositaire)
			? IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur("Casier.deposePar"),
					" : ",
					lDoc.depositaire,
				)
			: "";
	}
	static getPJ(aArticle) {
		var _a;
		return ((_a = aArticle.documentsEleve) === null || _a === void 0
			? void 0
			: _a.count()) > 0
			? aArticle.documentsEleve.get(0)
			: null;
	}
	getZoneMessage(aParams) {
		const lDoc = DonneesListe_CasierListeEleves.getPJ(aParams.article);
		if (lDoc) {
			return ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDoc,
				class: "m-top",
			});
		}
		return "";
	}
	getZoneGauche(aParams) {
		const lDoc = DonneesListe_CasierListeEleves.getPJ(aParams.article);
		if (
			!this.isObjetElementDocumentEleveCollecteParDocument(aParams.article) &&
			(lDoc === null || lDoc === void 0 ? void 0 : lDoc.dateDepot)
		) {
			const lDate = ObjetDate_1.GDate.formatDate(lDoc.dateDepot, "%J %MMM");
			return IE.jsx.str(
				"time",
				{
					class: "date-contain",
					datetime: ObjetDate_1.GDate.formatDate(lDoc.dateDepot, "%MM-%JJ"),
				},
				lDate,
			);
		}
		return "";
	}
	getZoneComplementaire(aParams) {
		if (!this.isObjetElementDocumentEleveCollecteParDocument(aParams.article)) {
			return "";
		}
		const lAvecDoc = !!DonneesListe_CasierListeEleves.getPJ(aParams.article);
		const lClass = ["i-medium"];
		lAvecDoc
			? lClass.push("color-green-moyen", "icon_check_fin")
			: lClass.push("color-red-moyen", "icon_fermeture_widget");
		return IE.jsx.str("i", {
			"aria-label": lAvecDoc
				? ObjetTraduction_1.GTraductions.getValeur("Casier.documentDepose")
				: ObjetTraduction_1.GTraductions.getValeur("Casier.aucunDepose"),
			class: lClass,
			role: "img",
		});
	}
	getVisible(aArticle) {
		let lVisible = true;
		const lAvecDepot = !!DonneesListe_CasierListeEleves.getPJ(aArticle);
		if (this.filtre.indiceRadio === indiceRadioBtn.avecDepot) {
			lVisible = lAvecDepot;
		}
		if (this.filtre.indiceRadio === indiceRadioBtn.sansDepot) {
			lVisible = !lAvecDepot;
		}
		return lVisible;
	}
	reinitFiltres() {
		this.filtre = this.getFiltreDefaut();
		this.paramsListe.actualiserListe();
	}
	construireFiltres() {
		const H = [];
		const lRadios = [];
		this.listeRadioBtn.map(({ libelle: aLibelle, indice: aIndice }) =>
			lRadios.push(
				IE.jsx.str(
					"ie-radio",
					{ "ie-model": this.jsxModeleRadioFiltreRadio.bind(this, aIndice) },
					aLibelle,
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: ["flex-contain", "cols", "flex-gap"] },
				lRadios.join(""),
			),
		);
		return H.join("");
	}
	estFiltresParDefaut() {
		return this.filtre.indiceRadio === this.getFiltreDefaut().indiceRadio;
	}
	jsxModeleRadioFiltreRadio(aIndice) {
		return {
			getValue: () => {
				return this.filtre.indiceRadio === aIndice;
			},
			setValue: (aValue) => {
				this.filtre.indiceRadio = aIndice;
				this.paramsListe.actualiserListe();
			},
			getName: () => {
				var _a, _b;
				return `${((_b = (_a = this.paramsListe.liste) === null || _a === void 0 ? void 0 : _a.getNom) === null || _b === void 0 ? void 0 : _b.call(_a)) || ""}_FiltreRadio`;
			},
		};
	}
	getFiltreDefaut() {
		const lParam = { indiceRadio: indiceRadioBtn.tous };
		return lParam;
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (this.estDepotParDocument) {
			return [ObjetTri_1.ObjetTri.init((D) => D.strIndividu)];
		}
		return super.getTri(aColonneDeTri, aGenreTri);
	}
	avecBoutonActionLigne(aParams) {
		if (this.isObjetElementDocumentEleveCollecteParDocument(aParams.article)) {
			return true;
		}
		const lAvecResponsableAccesible =
			this.listeResponsables &&
			this.listeResponsables.count() > 0 &&
			this.avecDroitSaisieInfoSondages;
		return (
			super.avecBoutonActionLigne(aParams) &&
			(!!DonneesListe_CasierListeEleves.getPJ(aParams.article) ||
				lAvecResponsableAccesible)
		);
	}
	callbackMenuCtx(aParams) {
		this.eventMenuCtx(Object.assign({ collecte: this.collecte }, aParams));
	}
	getAvecDroitDiscutionArticle(aArticle) {
		const lGenreRessource = this.isObjetElementDocumentEleveCollecteParDocument(
			aArticle,
		)
			? (0, TypeCasier_1.typeGenreCumulDocEleveToGenreRessource)(
					this.collecte.getGenre(),
				)
			: Enumere_Ressource_1.EGenreRessource.Eleve;
		return (
			this.avecDroitDiscution &&
			UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
				lGenreRessource,
			)
		);
	}
	getAvecDroitInfosSondArticle(aArticle) {
		const lGenreRessource = this.isObjetElementDocumentEleveCollecteParDocument(
			aArticle,
		)
			? (0, TypeCasier_1.typeGenreCumulDocEleveToGenreRessource)(
					this.collecte.getGenre(),
				)
			: Enumere_Ressource_1.EGenreRessource.Eleve;
		if (
			this.applicationSco.estPrimaire &&
			lGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve
		) {
			return false;
		}
		return this.avecDroitSaisieInfoSondages;
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		const lDoc = DonneesListe_CasierListeEleves.getPJ(aParams.article);
		if (this.isObjetElementDocumentEleveCollecteParDocument(aParams.article)) {
			const lArticle = aParams.article;
			if (lDoc) {
				aParams.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.telechargerLeDocument",
					),
					true,
					() => UtilitaireDocument_1.UtilitaireDocument.ouvrirUrl(lDoc),
				);
				if (
					this.avecFonctionnalite(
						UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
							.suppressionDoc,
						aParams.article,
					)
				) {
					aParams.menuContextuel.add(
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						true,
						() => {
							this.callbackMenuCtx({
								commande:
									DonneesListe_CasierListeEleves.EGenreCommande
										.SupprimerUnDocument,
								article: lArticle,
							});
						},
					);
				}
			} else {
				if (
					this.avecFonctionnalite(
						UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.modifier,
						aParams.article,
					)
				) {
					aParams.menuContextuel.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"Casier.AjouterUnDocument",
						),
						true,
						() => {
							this.callbackMenuCtx({
								commande:
									DonneesListe_CasierListeEleves.EGenreCommande
										.AjouterUnDocument,
								article: lArticle,
							});
						},
					);
				}
			}
			if (this.getAvecDroitDiscutionArticle(aParams.article)) {
				const lPublic = this.getPublics(aParams.article, false);
				aParams.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.demarerUneDiscution",
					),
					true,
					() => {
						this.ouvrirFenetreDiscution(lPublic);
					},
				);
			}
			if (this.getAvecDroitInfosSondArticle(aParams.article)) {
				const lPublic = this.getPublics(aParams.article, true);
				aParams.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur("Casier.diffuserUneInfo"),
					true,
					() => {
						this._ouvrirFenetreInfo(lPublic);
					},
				);
			}
		} else {
			if (lDoc) {
				aParams.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.telechargerLeDocument",
					),
					true,
					() => UtilitaireDocument_1.UtilitaireDocument.ouvrirUrl(lDoc),
					{ icon: "icon_download_alt" },
				);
			} else if (this.getAvecDroitInfosSondArticle(aParams.article)) {
				const lPublic = this.getPublics(aParams.article, true);
				if (lPublic.liste.count() > 0) {
					aParams.menuContextuel.add(
						ObjetTraduction_1.GTraductions.getValeur("Casier.diffuserUneInfo"),
						true,
						() => {
							this._ouvrirFenetreInfo(lPublic);
						},
						{ icon: "icon_diffuser_information" },
					);
				}
			}
		}
		aParams.menuContextuel.setDonnees();
	}
	getListeArticleVisible() {
		return this.Donnees.getListeElements((aArticle) =>
			this.getVisible(aArticle),
		);
	}
	async ouvrirFenetreDiscution(aPublic) {
		if (IE.estMobile) {
			this.ouvrirFenetreDiscutionMobile(aPublic);
			return;
		}
		const lGenresRessources = [];
		aPublic.genres.forEach((aGenre) => {
			lGenresRessources.push({
				genre: aGenre,
				getDisabled() {
					return !UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
						aGenre,
					);
				},
				listeDestinataires: aPublic.liste.getListeElements(
					(aElement) => aElement.getGenre() === aGenre,
				),
			});
		});
		ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
			this,
			{ genresRessources: lGenresRessources },
			{ avecChoixDestinataires: true },
		);
	}
	async ouvrirFenetreDiscutionMobile(aPublic) {
		const lMoteurMessagerie =
			new MoteurMessagerie_1.MoteurMessagerie().setOptions({
				instance: this,
				estChat: true,
			});
		aPublic.liste.parcourir((aElement) => {
			aElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		});
		const lFenetre = new ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile({
			pere: this,
			moteurMessagerie: lMoteurMessagerie,
		});
		const lGenres = aPublic.genres.filter((aGenre) =>
			UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
				aGenre,
			),
		);
		lFenetre
			.setOptions({
				estDiscussionEnFenetre: true,
				genreDiscussion:
					TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Discussion,
				genresDestinatairesAutorises: lGenres,
				avecDestinatairesListeDiffusion: false,
				callbackEnvoyer: function () {
					lFenetre.masquer();
				}.bind(this),
				callbackFermeture: function () {
					lFenetre.free();
				},
			})
			.setDonnees({
				creationDiscussion: true,
				destinataires: { listeDestinataires: aPublic.liste },
			});
	}
	getPublicsListeArticles(
		aPourInfoSond,
		aParams = { pourArticleVisible: true },
	) {
		const lMapPublics = new Map();
		const lMapPublicTotal = new Map();
		const lMapPublicExclu = new Map();
		const lSetGenres = new Set();
		for (const lArticle of aParams.pourArticleVisible
			? this.getListeArticleVisible()
			: this.Donnees) {
			const lPublics = this.getPublics(lArticle, aPourInfoSond);
			lPublics.genres.forEach((aGenre) => {
				lSetGenres.add(aGenre);
			});
			lPublics.liste.parcourir((aElement) => {
				lMapPublics.set(aElement.getNumero(), aElement);
			});
			lPublics.listeTotal.parcourir((aElement) => {
				lMapPublicTotal.set(aElement.getNumero(), aElement);
			});
			lPublics.listeExclu.parcourir((aElement) => {
				lMapPublicExclu.set(aElement.getNumero(), aElement);
			});
		}
		const lListePublics = new ObjetListeElements_1.ObjetListeElements();
		const lListePublicsTotal = new ObjetListeElements_1.ObjetListeElements();
		const lListePublicsExclu = new ObjetListeElements_1.ObjetListeElements();
		lMapPublics.forEach((aElement) => {
			lListePublics.add(aElement);
		});
		lMapPublicTotal.forEach((aElement) => {
			lListePublicsTotal.add(aElement);
		});
		lMapPublicExclu.forEach((aElement) => {
			lListePublicsExclu.add(aElement);
		});
		return {
			liste: lListePublics,
			genres: [...lSetGenres],
			listeTotal: lListePublicsTotal,
			listeExclu: lListePublicsExclu,
		};
	}
	filtrePublicSelonDroit(aArticle, aPourInfoSond, aGenre) {
		const lAvecListeResponsable =
			MethodesObjet_1.MethodesObjet.isUndefined(aGenre) ||
			aGenre === TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve;
		if (lAvecListeResponsable) {
			const lListeResponsale =
				this.isObjetElementDocumentEleveCollecteParDocument(aArticle)
					? aArticle.listeResponsables
					: this.listeResponsables;
			if (!lListeResponsale) {
				return false;
			}
			for (const lResponsable of lListeResponsale) {
				if (aPourInfoSond && lResponsable.avecInfoSond) {
					return true;
				} else if (lResponsable.avecDiscution) {
					return true;
				}
			}
			return false;
		}
		if (this.isObjetElementDocumentEleveCollecteParDocument(aArticle)) {
			if (aPourInfoSond && aArticle.avecInfoSond) {
				return true;
			} else if (aArticle.avecDiscution) {
				return true;
			}
		}
		return false;
	}
	getPublics(aArticle, aPourInfoSond) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lListeTotal = new ObjetListeElements_1.ObjetListeElements();
		const lListeExclu = new ObjetListeElements_1.ObjetListeElements();
		const lGenre = [];
		if (this.isObjetElementDocumentEleveCollecteParDocument(aArticle)) {
			const lGenreCollecte = this.collecte.getGenre();
			switch (lGenreCollecte) {
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
					if (
						aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.Eleve
					) {
						const lEleve = new ObjetElement_1.ObjetElement(
							aArticle.getLibelle(),
							aArticle.getNumero(),
							aArticle.getGenre(),
						);
						if (
							this.filtrePublicSelonDroit(
								aArticle,
								aPourInfoSond,
								lGenreCollecte,
							)
						) {
							lListe.add(lEleve);
						} else {
							lListeExclu.add(lEleve);
						}
						lGenre.push(Enumere_Ressource_1.EGenreRessource.Eleve);
						lListeTotal.add(lEleve);
					}
					break;
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
					if (aArticle && "listeResponsables") {
						if (
							this.filtrePublicSelonDroit(
								aArticle,
								aPourInfoSond,
								lGenreCollecte,
							)
						) {
							lListe.add(aArticle.listeResponsables);
						} else {
							lListeExclu.add(aArticle.listeResponsables);
						}
						lGenre.push(Enumere_Ressource_1.EGenreRessource.Responsable);
						lListeTotal.add(aArticle.listeResponsables);
					}
					break;
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
					if (
						aArticle.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Responsable
					) {
						const lResp = new ObjetElement_1.ObjetElement(
							aArticle.getLibelle(),
							aArticle.getNumero(),
							aArticle.getGenre(),
						);
						if (
							this.filtrePublicSelonDroit(
								aArticle,
								aPourInfoSond,
								lGenreCollecte,
							)
						) {
							lListe.add(lResp);
						} else {
							lListeExclu.add(lResp);
						}
						lGenre.push(Enumere_Ressource_1.EGenreRessource.Responsable);
						lListeTotal.add(lResp);
					}
					break;
				default:
					break;
			}
		} else if (this.filtrePublicSelonDroit(aArticle, aPourInfoSond)) {
			lListe.add(this.listeResponsables);
			lGenre.push(Enumere_Ressource_1.EGenreRessource.Responsable);
			lListeTotal.add(this.listeResponsables);
		}
		return {
			liste: lListe,
			genres: lGenre,
			listeTotal: lListeTotal,
			listeExclu: lListeExclu,
		};
	}
	async _ouvrirFenetreInfo(aPublic) {
		let lFenetreInfoSond;
		if (IE.estMobile) {
			lFenetreInfoSond =
				FicheEditionInfoSond_Mobile_1.FicheEditionInfoSond_Mobile;
		} else {
			lFenetreInfoSond =
				ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			lFenetreInfoSond,
			{
				pere: this,
				initialiser: (aInstance) => {
					if (IE.estMobile) {
						this._initFicheEditionInfoSond(aInstance);
					} else {
						aInstance.avecEtatSaisie = false;
						aInstance.avecPublicationPageEtablissement = false;
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.creerInfo",
							),
							largeur: 750,
							hauteur: 700,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
					}
				},
			},
		);
		lFenetre.setDonnees({
			donnee: null,
			creation: true,
			estInfo: true,
			genresPublic: aPublic.genres,
			listePublic: aPublic.liste,
			maxSizePJ: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		});
	}
	_initFicheEditionInfoSond(aInstance) {
		const utilitaires = {
			genreRessource: new GestionnaireBlocPN_1.UtilitaireGenreRessource(),
			genreEspace: new GestionnaireBlocPN_2.UtilitaireGenreEspace(),
			genreReponse: new GestionnaireBlocPN_3.UtilitaireGenreReponse(),
			moteurDestinataires: new MoteurDestinatairesPN_1.MoteurDestinatairesPN(),
			moteurGestionPJ: new MoteurGestionPJPN_1.MoteurGestionPJPN(),
		};
		aInstance.setUtilitaires(utilitaires);
		const moteurCP = new MoteurInfoSondage_1.MoteurInfoSondage(utilitaires);
		aInstance.setOptions({
			avecCBElevesRattaches:
				this.applicationSco.getObjetParametres().avecElevesRattaches,
			avecGestionEleves: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			),
			avecGestionPersonnels: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			),
			avecGestionStages: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			),
			avecGestionIPR: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionIPR,
			),
			avecPublicationPageEtablissement: false,
		});
		aInstance.setOptionsFenetre({ avecFooterFlottant: false });
		aInstance.envoyerRequete = async (aParam) => {
			moteurCP.formatterDonneesAvantSaisie({
				listeInfoSond: aParam.paramRequete.listeActualite,
			});
			return new ObjetRequeteSaisieActualites_1.ObjetRequeteSaisieActualites(
				this,
			)
				.addUpload({
					listeFichiers: aParam.listePJCree,
					listeDJCloud: aParam.listePJ,
				})
				.lancerRequete(aParam.paramRequete)
				.then(() => {
					aParam.clbckSurReussite.call(aInstance, 1);
				});
		};
		aInstance.avecListeDiffusion = true;
		aInstance.surBtnListeDiffusion = async () => {
			let lListeDiffusions = null;
			if (
				Cache_1.GCache &&
				Cache_1.GCache.general.existeDonnee("listeDiffusion")
			) {
				lListeDiffusions = Cache_1.GCache.general.getDonnee("listeDiffusion");
			}
			return Promise.resolve()
				.then(() => {
					if (!lListeDiffusions) {
						return new ObjetRequeteListeDiffusion_1.ObjetRequeteListeDiffusion(
							this,
						)
							.lancerRequete()
							.then((aJSON) => {
								if (aJSON && aJSON.liste) {
									lListeDiffusions = aJSON.liste;
									if (Cache_1.GCache) {
										Cache_1.GCache.general.setDonnee(
											"listeDiffusion",
											lListeDiffusions,
										);
									}
								}
							});
					}
				})
				.then(() => {
					return new Promise((aResolve) => {
						if (!lListeDiffusions) {
							return null;
						}
						lListeDiffusions.parcourir((aElement) => {
							aElement.cmsActif = false;
						});
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionListeDiffusion_1.ObjetFenetre_SelectionListeDiffusion,
							{
								pere: this,
								evenement: (aGenreBouton) => {
									let lListeDiffusionsSelection =
										new ObjetListeElements_1.ObjetListeElements();
									if (aGenreBouton === 1) {
										lListeDiffusionsSelection =
											lListeDiffusions.getListeElements(
												(aElement) => !!aElement.cmsActif,
											);
									}
									aResolve(lListeDiffusionsSelection);
								},
							},
						).setDonnees(
							new DonneesListe_SelectionDiffusion_1.DonneesListe_SelectionDiffusion(
								lListeDiffusions,
							),
							false,
						);
					});
				});
		};
		aInstance.setOptionsFenetre({
			modale: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	surMenuCtxListe(aNode) {
		const lPosBtn = ObjetPosition_1.GPosition.getClientRect(aNode);
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			id: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
			initCommandes: (aMenu) => {
				this.getCommandeMenuCtx().forEach((aCommande) => {
					aMenu.add(aCommande.libelle, aCommande.actif, () =>
						aCommande.callback(),
					);
				});
			},
		});
	}
	getCommandeMenuCtx() {
		const lCommandes = [];
		let lAvecPjDansListe = false;
		let lAvecInformation = false;
		let lAvecDiscution = false;
		let lAvecVerifInfo = this.avecDroitSaisieInfoSondages;
		let lAvecVerifDiscution = this.avecDroitDiscution;
		for (const lElement of this.getListeArticleVisible()) {
			if (DonneesListe_CasierListeEleves.getPJ(lElement)) {
				lAvecPjDansListe = true;
			}
			switch (this.collecte.getGenre()) {
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
					if (
						lElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Eleve
					) {
						if (!lAvecInformation) {
							lAvecInformation = this.getAvecDroitInfosSondArticle(lElement);
						}
						if (!lAvecDiscution) {
							lAvecDiscution = this.getAvecDroitDiscutionArticle(lElement);
						}
					}
					break;
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
					if (lElement && "listeResponsables") {
						if (!lAvecInformation) {
							lAvecInformation = this.getAvecDroitInfosSondArticle(lElement);
						}
						if (!lAvecDiscution) {
							lAvecDiscution = this.getAvecDroitDiscutionArticle(lElement);
						}
					}
					break;
				case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
					if (
						lElement.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Responsable
					) {
						if (!lAvecInformation) {
							lAvecInformation = this.getAvecDroitInfosSondArticle(lElement);
						}
						if (!lAvecDiscution) {
							lAvecDiscution = this.getAvecDroitDiscutionArticle(lElement);
						}
					}
					break;
				default:
					break;
			}
			let lAvecBreak = false;
			if (lAvecVerifInfo && lAvecVerifDiscution) {
				if (lAvecInformation && lAvecDiscution) {
					lAvecBreak = true;
				}
			} else if (lAvecVerifInfo) {
				if (lAvecInformation) {
					lAvecBreak = true;
				}
			} else if (lAvecVerifDiscution) {
				if (lAvecDiscution) {
					lAvecBreak = true;
				}
			}
			if (lAvecBreak && lAvecPjDansListe) {
				break;
			}
		}
		lCommandes.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"Casier.btnToutElechargerDocEleve",
			),
			callback: this.telechargerTout.bind(this),
			actif: lAvecPjDansListe,
		});
		if (lAvecVerifInfo && lAvecInformation) {
			const lPublicsInfoSond = this.getPublicsListeArticles(true);
			lCommandes.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.diffuserUneInfo",
				),
				callback: () => this._ouvrirFenetreInfo(lPublicsInfoSond),
				actif: lPublicsInfoSond.liste.count() > 0,
			});
		}
		if (lAvecVerifDiscution && lAvecDiscution) {
			const lPublicsDiscution = this.getPublicsListeArticles(false);
			lCommandes.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.demarerUneDiscution",
				),
				callback: () => this.ouvrirFenetreDiscution(lPublicsDiscution),
				actif: lPublicsDiscution.liste.count() > 0,
			});
		}
		return lCommandes;
	}
	telechargerTout() {
		new ObjetRequeteSaisieExportFichierProf_js_1.ObjetRequeteSaisieExportFichierProf(
			{},
		)
			.lancerRequete({
				genreFichier:
					TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees
						.GED_CollecteDocuments,
				collecte: this.collecte,
			})
			.then((aReponse) => {
				var _a;
				if (
					(_a = aReponse.JSONReponse) === null || _a === void 0
						? void 0
						: _a.url
				) {
					window.open(
						ObjetChaine_1.GChaine.getURLComplete(
							aReponse.JSONReponse.url,
							true,
						),
					);
				}
			});
	}
}
exports.DonneesListe_CasierListeEleves = DonneesListe_CasierListeEleves;
(function (DonneesListe_CasierListeEleves) {
	let EGenreCommande;
	(function (EGenreCommande) {
		EGenreCommande[(EGenreCommande["AjouterUnDocument"] = 0)] =
			"AjouterUnDocument";
		EGenreCommande[(EGenreCommande["SupprimerUnDocument"] = 1)] =
			"SupprimerUnDocument";
	})(
		(EGenreCommande =
			DonneesListe_CasierListeEleves.EGenreCommande ||
			(DonneesListe_CasierListeEleves.EGenreCommande = {})),
	);
})(
	DonneesListe_CasierListeEleves ||
		(exports.DonneesListe_CasierListeEleves = DonneesListe_CasierListeEleves =
			{}),
);

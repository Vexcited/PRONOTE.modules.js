exports.ObjetFenetre_ListeTAFFaits = exports.TypeBoutonFenetreTAFFaits = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetListe_1 = require("ObjetListe");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetRequeteListeTravauxRendus_1 = require("ObjetRequeteListeTravauxRendus");
const ObjetRequeteTelechargerCopiesEleves_1 = require("ObjetRequeteTelechargerCopiesEleves");
const ObjetRequeteSaisieTAFARendre_1 = require("ObjetRequeteSaisieTAFARendre");
const ObjetRequeteSaisieTAFARendre_2 = require("ObjetRequeteSaisieTAFARendre");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetFenetre_UploadFichiers_1 = require("ObjetFenetre_UploadFichiers");
const ObjetFenetre_EnregistrementAudioPN_1 = require("ObjetFenetre_EnregistrementAudioPN");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const GestionnaireModale_1 = require("GestionnaireModale");
const ObjetRequeteSaisieDeposerCorrigesEleves_1 = require("ObjetRequeteSaisieDeposerCorrigesEleves");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const MultipleObjetFenetreVisuEleveQCM = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetreVisuEleveQCM = MultipleObjetFenetreVisuEleveQCM
	? MultipleObjetFenetreVisuEleveQCM.ObjetFenetreVisuEleveQCM
	: null;
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const MethodesObjet_1 = require("MethodesObjet");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
var TypeBoutonFenetreTAFFaits;
(function (TypeBoutonFenetreTAFFaits) {
	TypeBoutonFenetreTAFFaits[(TypeBoutonFenetreTAFFaits["Fermer"] = 0)] =
		"Fermer";
})(
	TypeBoutonFenetreTAFFaits ||
		(exports.TypeBoutonFenetreTAFFaits = TypeBoutonFenetreTAFFaits = {}),
);
class ObjetFenetre_ListeTAFFaits extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.options = {
			avecPhotosEleves: true,
			avecVerrouillageSurAccesDocuments: true,
		};
		this.donnees = {
			TAF: null,
			executionQCM: null,
			listeEleves: null,
			eleveSelectionne: null,
		};
		this.setOptionsFenetre({
			modale: true,
			hauteur: 600,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.Titre",
			),
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					typeBouton: TypeBoutonFenetreTAFFaits.Fermer,
				},
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeElevesTAF.bind(this),
			this._initialiserListeElevesTAF,
		);
		if (!IE.estMobile) {
			this.identFenetreVisuQCM = this.addFenetre(ObjetFenetreVisuEleveQCM);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getStrDetailTAF: function () {
				return aInstance.donnees.strDetailTAF;
			},
			prolongerDateDepot: {
				event() {
					aInstance.prolongerDepotRenduEleve();
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					return (
						aInstance.avecProlongationPossible &&
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
							lGenreRenduTaf,
							false,
						)
					);
				},
			},
			telecharger: {
				copiesEleve: {
					event: function () {
						new ObjetRequeteTelechargerCopiesEleves_1.ObjetRequeteTelechargerCopiesEleves(
							aInstance,
							aInstance._surReponseRequeteGenerationTAFARendre,
						).lancerRequete({ taf: aInstance.donnees.TAF });
					},
					getLibelle: function () {
						const lGenreRenduTaf = aInstance.getGenreRenduTAF();
						const lTafEstMedia =
							TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
								lGenreRenduTaf,
							);
						return lTafEstMedia
							? ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.TelechargerVocaux",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.TelechargerTout",
								);
					},
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					const lTafEstUnRenduNumerique =
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
							lGenreRenduTaf,
							false,
						);
					return (
						lTafEstUnRenduNumerique &&
						!!aInstance.donnees.avecAccesDocuments &&
						aInstance._existeAuMoinsUnDevoirRendu(aInstance.donnees.listeEleves)
					);
				},
			},
			deposer: {
				corrigesMultiples: {
					getOptionsSelecFile: function () {
						const lOptionsSelecFile = {
							maxSize: aInstance.appSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
							),
							multiple: true,
							avecResizeImage: false,
						};
						return lOptionsSelecFile;
					},
					addFiles: function (aParams) {
						const lListeFichiers = aParams.listeFichiers;
						if (!!lListeFichiers && lListeFichiers.count() > 0) {
							aInstance.deposerCopiesCorrigeesMultiples({
								taf: aInstance.donnees.TAF,
								listeFichiers: lListeFichiers,
							});
						}
					},
					getLibelle: function () {
						return ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.DeposerPlusieursCorriges",
						);
					},
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					const lTafEstUnRenduNumerique =
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
							lGenreRenduTaf,
							false,
						);
					const lTafEstMedia =
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
							lGenreRenduTaf,
						);
					return (
						lTafEstUnRenduNumerique &&
						!lTafEstMedia &&
						!!aInstance.donnees.avecAccesDocuments &&
						aInstance._existeAuMoinsUnDevoirRendu(aInstance.donnees.listeEleves)
					);
				},
			},
		});
	}
	getGenreRenduTAF() {
		return !!this.donnees.TAF
			? this.donnees.TAF.genreRendu
			: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu;
	}
	composeContenu() {
		const H = [];
		H.push('<div class="ObjetFenetre_ListeTAFFaits">');
		H.push('<div class="flex-contain justify-between flex-center">');
		H.push('<div ie-html="getStrDetailTAF" class="LabelDetailTaf"></div>');
		H.push(
			`<ie-bouton class="m-bottom" ie-if="prolongerDateDepot.visible" ie-model="prolongerDateDepot">${ObjetTraduction_1.GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.bouton")}</ie-bouton>`,
		);
		H.push("</div>");
		H.push(
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="Liste"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			'<ie-bouton ie-model="telecharger.copiesEleve" ie-display="telecharger.visible"></ie-bouton>',
			'<ie-bouton ie-model="deposer.corrigesMultiples" ie-selecfile ie-display="deposer.visible"></ie-bouton>',
		);
		return lHTML.join("");
	}
	setDonnees(aTAF, aExecutionQCM) {
		this.donnees.TAF = aTAF;
		this.donnees.executionQCM = aExecutionQCM;
		const lGenreRenduTaf = this.getGenreRenduTAF();
		const lTafEstUnRenduNumerique =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lGenreRenduTaf,
				false,
			);
		this.setOptionsFenetre({ largeur: lTafEstUnRenduNumerique ? 760 : 400 });
		this.initialiser();
		this.lancerRecuperationListeTravauxRendus(aTAF, aExecutionQCM);
	}
	_reponseRequeteTAFARendre(aParam) {
		this.donnees.strDetailTAF = aParam.strDetailTAF || "";
		this.donnees.listeEleves = aParam.listeEleves;
		this.donnees.avecAccesDocuments = aParam.avecAccesDocuments;
		this.avecProlongationPossible = false;
		if (this.donnees && this.donnees.listeEleves) {
			this.donnees.listeEleves.parcourir((aElement) => {
				if (aElement.estProlongationRenduPossible) {
					this.avecProlongationPossible = true;
					return false;
				}
			});
		}
		this.afficher();
		const lGenreRenduTaf = this.getGenreRenduTAF();
		const lTafEstUnRenduNumerique =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lGenreRenduTaf,
				false,
			);
		const lTafEstUnRenduNumeriquePlusKiosque =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lGenreRenduTaf,
				true,
			);
		const lInstanceListe = this.getInstance(this.identListe);
		const lColonnesCachees = [];
		if (lTafEstUnRenduNumerique) {
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.fait);
			if (
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
					lGenreRenduTaf,
				)
			) {
				lColonnesCachees.push(
					DonneesListe_ListeTAFFaits.colonnes.copieCorrigee,
				);
			}
			if (!this.donnees.avecAccesDocuments) {
				lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.commentaire);
			}
		} else if (lTafEstUnRenduNumeriquePlusKiosque) {
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.fait);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.pourLe);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.verrou);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.copieCorrigee);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.commentaire);
		} else {
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.copieEleve);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.pourLe);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.verrou);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.copieCorrigee);
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.commentaire);
		}
		lInstanceListe.setOptionsListe({
			colonnes: this._getColonnes(
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
					lGenreRenduTaf,
				),
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
					lGenreRenduTaf,
				),
			),
			colonnesCachees: lColonnesCachees,
		});
		const lThis = this;
		lInstanceListe.setDonnees(
			new DonneesListe_ListeTAFFaits(
				this.donnees.listeEleves,
				{
					estUnTAFQCM: aParam.estTAFQCM,
					genreRendu: lGenreRenduTaf,
					multiSelection: this.avecProlongationPossible,
				},
				{
					avecAccesDocuments: !!this.donnees.avecAccesDocuments,
					avecPhotosEleves: this.options.avecPhotosEleves,
				},
				{
					surVoirCorrige: function (aEleve) {
						lThis.voirCorrigeQCMEleve(aEleve);
					},
					surRecupererCopieEleve: function (aArticle) {
						lThis.ouvrirCopieEleve(aArticle);
					},
					surAjouterCopieEleve: function (aArticle) {
						lThis.deposerCopieEleve(aArticle);
					},
					surSupprimerCopieEleve: function (aArticle) {
						const lMsgConfirmation = ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.ConfirmationSuppressionCopieEleve",
						);
						lThis.supprimerDocument(
							aArticle,
							aArticle.copieEleve,
							lMsgConfirmation,
							ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.CopieEleve,
						);
					},
					surProlongerDepotRenduEleve: function (aArticle) {
						lThis.prolongerDepotRenduEleve(aArticle);
					},
					surAnnulerProlongationRenduEleve: function (aArticle) {
						lThis.annulerProlongationRenduEleve(aArticle);
					},
					surVerrouillerCopieEleve: function (aArticle) {
						lThis.verrouillerCopieEleve(aArticle);
					},
					surDeverrouillerCopieEleve: function (aArticle) {
						lThis.deverrouillerCopieEleve(aArticle);
					},
					surRecupererCopieCorrigee: function (aArticle) {
						lThis.ouvrirCopieCorrigee(aArticle);
					},
					surAjouterCopieCorrigee: function (aArticle) {
						lThis.deposerCopieCorrigee(aArticle);
					},
					surSupprimerCopieCorrigee: function (aArticle) {
						const lMsgConfirmation = ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.ConfirmationSuppressionCopieCorrigee",
						);
						lThis.supprimerDocument(
							aArticle,
							aArticle.copieCorrigee,
							lMsgConfirmation,
							ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.CopieCorrigee,
						);
					},
				},
			),
		);
		if (!!this.donnees.eleveSelectionne) {
			lInstanceListe.setListeElementsSelection(
				new ObjetListeElements_1.ObjetListeElements().add(
					this.donnees.eleveSelectionne,
				),
				{ avecScroll: true },
			);
		}
	}
	surValidation(aNumeroBouton) {
		const lBouton = this.getBoutonNumero(aNumeroBouton);
		const lGenreBouton = !!lBouton
			? lBouton.typeBouton
			: TypeBoutonFenetreTAFFaits.Fermer;
		this.fermer();
		this.callback.appel(lGenreBouton);
	}
	static ouvrir(aParams, aDonnees, aExecutionQCM) {
		const lFenetreListeTAFFaits =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ListeTAFFaits,
				$.extend(aParams, { initialiser: false }),
			);
		lFenetreListeTAFFaits.setDonnees(aDonnees, aExecutionQCM);
	}
	_getColonnes(aEstVocal, aPourKiosque) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.eleve,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.colonnes.Eleve",
			),
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.fait,
			taille: 40,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.colonnes.Fait",
			),
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.copieEleve,
			taille: 45,
			titre: aPourKiosque
				? {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.colonnes.CopieEleve",
						),
						title: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.hintColonnes.CopieEleve",
						),
					}
				: [
						{
							libelle: aEstVocal
								? ObjetTraduction_1.GTraductions.getValeur(
										"FenetreListeTAFFaits.surColonnes.vocalEleve",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"FenetreListeTAFFaits.surColonnes.CopieEleve",
									),
						},
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.colonnes.CopieEleve",
							),
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.hintColonnes.CopieEleve",
							),
						},
					],
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.pourLe,
			taille: 55,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.colonnes.PourLe",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.hintColonnes.PourLe",
					),
				},
			],
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.verrou,
			taille: 45,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelleHtml:
						'<span class="InlineBlock Image_Verrou"  title="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.CopieVerrouillee",
						) +
						'"></span>',
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.hintColonnes.Verrou",
					),
				},
			],
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.copieCorrigee,
			taille: 45,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.surColonnes.CopieCorrigee",
					),
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.colonnes.CopieCorrigee",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.hintColonnes.CopieCorrigee",
					),
				},
			],
		});
		const lObTitres = [];
		if (!aEstVocal) {
			lObTitres.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.surColonnes.CopieCorrigee",
				),
				avecFusionColonne: true,
			});
		}
		lObTitres.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.colonnes.Commentaire",
			),
			title: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.hintColonnes.Commentaire",
			),
		});
		lColonnes.push({
			id: DonneesListe_ListeTAFFaits.colonnes.commentaire,
			taille: 200,
			titre: lObTitres,
		});
		return lColonnes;
	}
	_initialiserListeElevesTAF(aInstance) {
		aInstance.setOptionsListe({
			colonnes: this._getColonnes(false, false),
			nonEditable: false,
			avecCelluleEditableTriangle: false,
		});
	}
	_evenementListeElevesTAF(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.donnees.eleveSelectionne = aParametres.article;
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne === DonneesListe_ListeTAFFaits.colonnes.fait
				) {
					this.voirCorrigeQCMEleve(aParametres.article);
				} else if (
					aParametres.idColonne ===
					DonneesListe_ListeTAFFaits.colonnes.copieEleve
				) {
					const lGenreRenduTaf = this.getGenreRenduTAF();
					if (
						!TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
							lGenreRenduTaf,
						)
					) {
						this.ouvrirCopieEleve(aParametres.article);
					}
				} else if (
					aParametres.idColonne ===
					DonneesListe_ListeTAFFaits.colonnes.copieCorrigee
				) {
					this.ouvrirCopieCorrigee(aParametres.article);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_ListeTAFFaits.colonnes.fait: {
						aParametres.article.estRendu = !aParametres.article.estRendu;
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						let lDateRendu = null;
						if (aParametres.article.estRendu) {
							lDateRendu = new Date();
						}
						aParametres.article.dateRealisation = lDateRendu;
						this._lancerRequeteSaisieTAFARendre(
							ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.Rendu,
							true,
						);
						break;
					}
					case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
						if (!aParametres.article.copieEleve) {
							this.deposerCopieEleve(aParametres.article);
						}
						break;
					case DonneesListe_ListeTAFFaits.colonnes.pourLe:
						if (!!aParametres.article.estProlongationRenduPossible) {
							this.prolongerDepotRenduEleve(aParametres.article);
						}
						break;
					case DonneesListe_ListeTAFFaits.colonnes.verrou:
						if (aParametres.article.estVerrouille) {
							this.deverrouillerCopieEleve(aParametres.article);
						} else {
							this.verrouillerCopieEleve(aParametres.article);
						}
						break;
					case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
						if (!aParametres.article.copieCorrigee) {
							this.deposerCopieCorrigee(aParametres.article);
						}
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParametres.idColonne) {
					case DonneesListe_ListeTAFFaits.colonnes.commentaire:
						this._lancerRequeteSaisieTAFARendre(
							ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre
								.CommentaireCorrige,
						);
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ModificationSelection:
				this.donnees.selection = this.getInstance(
					this.identListe,
				).getListeElementsSelection();
				break;
		}
	}
	voirCorrigeQCMEleve(aEleve) {
		if (!!aEleve && !!aEleve.execution) {
			const lExecutionQCM = aEleve.execution;
			if (!aEleve.enCours && !!aEleve.estRendu) {
				lExecutionQCM.publierCorrige = true;
				const lInstanceVisuQCM = this.getInstance(this.identFenetreVisuQCM);
				if (!!lInstanceVisuQCM) {
					lInstanceVisuQCM.setEtatFicheVisu({
						numExecQCM: lExecutionQCM.getNumero(),
						modeProf: true,
						eleve: aEleve,
						donnees: lExecutionQCM,
						afficherCopieCachee: false,
					});
				}
			}
		}
	}
	ouvrirCopieEleve(aArticle) {
		this.ouvrirDocument(
			aArticle.copieEleve,
			TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.TAFRenduEleve,
		);
		if (
			this.options.avecVerrouillageSurAccesDocuments &&
			!aArticle.estVerrouille
		) {
			this.verrouillerCopieEleve(aArticle);
		}
	}
	ouvrirCopieCorrigee(aArticle) {
		this.ouvrirDocument(
			aArticle.copieCorrigee,
			TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
				.TAFCorrigeRenduEleve,
		);
	}
	ouvrirDocument(aDocument, aGenreRessource) {
		const lLienDocument = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
			aDocument,
			{ genreRessource: aGenreRessource },
		);
		window.open(lLienDocument);
	}
	_afficherMessageConfirmation(aMsgConfirmation, aCallbackSuppression) {
		this.appSco.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: aMsgConfirmation,
			callback: function (aGenreBouton) {
				if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
					aCallbackSuppression();
				}
			},
		});
	}
	supprimerDocument(aArticle, aDocument, aMsgConfirmation, aTypeSaisie) {
		this._afficherMessageConfirmation(aMsgConfirmation, () => {
			aDocument.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._lancerRequeteSaisieTAFARendre(aTypeSaisie, false, true);
		});
	}
	deposerCopieEleve(aArticle) {
		if (!aArticle.copieEleve || !aArticle.copieEleve.existe()) {
			this._afficherMessageConfirmation(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.ConfirmationDepotCopieEleve",
				),
				() => {
					this.afficherFenetreAjoutFichier(
						aArticle,
						this.ajouterFichiersCopieEleve,
					);
				},
			);
		} else {
			this.afficherFenetreAjoutFichier(
				aArticle,
				this.ajouterFichiersCopieEleve,
			);
		}
	}
	deposerCopieCorrigee(aArticle) {
		this.afficherFenetreAjoutFichier(
			aArticle,
			this.ajouterFichiersCopieCorrigee,
		);
	}
	afficherFenetreAjoutFichier(aArticle, aCallbackValidation) {
		const lGenreRenduTaf = this.getGenreRenduTAF();
		if (
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf)
		) {
			this.ouvrirFenetreCreation(aArticle, aCallbackValidation);
		} else {
			this.afficherFenetreFichier(aArticle, aCallbackValidation);
		}
	}
	ouvrirFenetreCreation(aTaf, aCallbackValidation) {
		const lThis = this;
		const lTabActions = [];
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EnregistrementAudio.record",
			),
			icon: "icon_microphone",
			event() {
				lThis.afficherFenetreAudio(aTaf, aCallbackValidation);
			},
			class: "bg-orange-claire",
		});
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EnregistrementAudio.deposerExistant",
			),
			icon: "icon_folder_open",
			selecFile: true,
			optionsSelecFile: this._getOptionsSelecFile(),
			event(aParamsInput) {
				if (!!aParamsInput && !!aParamsInput.eltFichier) {
					UtilitaireAudio_1.UtilitaireAudio.estFichierAudioValide(
						aParamsInput.eltFichier,
					).then((aResult) => {
						if (aResult) {
							lThis._evenementInputFile(
								aParamsInput,
								aTaf,
								aCallbackValidation,
							);
						} else {
							UtilitaireAudio_1.UtilitaireAudio.messageErreurFormat(
								aParamsInput.eltFichier,
							);
						}
					});
				}
			},
			class: "bg-orange-claire",
		});
		ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
			lTabActions,
			{ pere: this },
		);
	}
	_getOptionsSelecFile() {
		return {
			maxSize: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
			),
			accept: UtilitaireAudio_1.UtilitaireAudio.getTypeMimeAudio(),
			avecTransformationFlux: false,
		};
	}
	_evenementInputFile(aParamUpload, aArticle, aCallbackValidation) {
		if (
			aParamUpload.eltFichier.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			const lListeFichier = new ObjetListeElements_1.ObjetListeElements();
			lListeFichier.addElement(aParamUpload.eltFichier);
			aParamUpload.eltFichier.TAF = new ObjetElement_1.ObjetElement(
				"",
				aArticle.getNumero(),
			);
			aCallbackValidation.call(this, aArticle, lListeFichier);
		}
	}
	afficherFenetreAudio(aArticle, aCallbackValidation) {
		let lContexte = "";
		const lThis = this;
		const lFenetreAudio = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EnregistrementAudioPN_1.ObjetFenetre_EnregistrementAudioPN,
			{
				pere: this,
				evenement: function (aGenreBouton, aParametres) {
					if (
						!!aParametres &&
						!!aParametres.bouton &&
						aParametres.bouton.valider
					) {
						if (
							!!aParametres.listeFichiers &&
							aParametres.listeFichiers.count() > 0
						) {
							aCallbackValidation.call(
								lThis,
								aArticle,
								aParametres.listeFichiers,
							);
						}
					}
				},
			},
		);
		lFenetreAudio.setOptions({
			contexte: lContexte,
			maxLengthAudio:
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getDureeMaxEnregistrementAudio(),
		});
		lFenetreAudio.setDonnees(Enumere_Ressource_1.EGenreRessource.DocumentJoint);
		lFenetreAudio.afficher();
	}
	afficherFenetreFichier(aArticle, aCallbackValidation) {
		const lThis = this;
		const lObjetFenetreAjoutMultiple =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_UploadFichiers_1.ObjetFenetre_UploadFichiers,
				{
					pere: lThis,
					evenement: function (aGenreBouton, aListeFichiers) {
						if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
							aCallbackValidation.call(lThis, aArticle, aListeFichiers);
						}
						lObjetFenetreAjoutMultiple.fermer();
					},
				},
			);
		lObjetFenetreAjoutMultiple.setDonnees(
			Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			{
				tailleMaxUploadFichier: this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
				),
				functionGetNomPdfGenere: function () {
					return (
						aArticle.getLibelle() +
						"_" +
						ObjetDate_1.GDate.formatDate(
							ObjetDate_1.GDate.getDateHeureCourante(),
							"%JJ%MM%AAAA_%hh%mm%ss",
						) +
						".pdf"
					);
				},
			},
		);
		lObjetFenetreAjoutMultiple.afficher();
	}
	ajouterFichiersCopieEleve(aArticle, aListeFichiers) {
		if (
			!!aArticle &&
			!!aListeFichiers &&
			aListeFichiers.getNbrElementsExistes() > 0
		) {
			aArticle.copieEleve = aListeFichiers.getPremierElement();
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._lancerRequeteSaisieTAFARendre(
				ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.CopieEleve,
				false,
				true,
			);
		}
	}
	ajouterFichiersCopieCorrigee(aArticle, aListeFichiers) {
		if (
			!!aArticle &&
			!!aListeFichiers &&
			aListeFichiers.getNbrElementsExistes() > 0
		) {
			aArticle.copieCorrigee = aListeFichiers.getPremierElement();
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._lancerRequeteSaisieTAFARendre(
				ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.CopieCorrigee,
				false,
				true,
			);
		}
	}
	_afficherChoixDateDepotRenduEleve(aEleve, aCallback) {
		const lThis = this;
		let lDateProlongation =
			(aEleve && aEleve.dateReportRendu) || ObjetDate_1.GDate.getDateCourante();
		let lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		if (lThis.donnees.selection) {
			lThis.donnees.selection.parcourir((aElement) => {
				if (aElement.estProlongationRenduPossible) {
					lListeEleves.add(aElement);
				}
			});
		} else if (aEleve) {
			lListeEleves.add(aEleve);
		}
		let lChoixElevesNonRendus = lListeEleves.count() === 0;
		const lListePossiblePourProlongation =
			lThis.donnees.listeEleves.getListeElements(function (aElement, aIndice) {
				return aElement.existe() && aElement.estProlongationRenduPossible;
			});
		const lListeCompletEleves = MethodesObjet_1.MethodesObjet.dupliquer(
			lListePossiblePourProlongation,
		);
		const lMessage = [];
		const lIDLabel = GUID_1.GUID.getId();
		const lidentiteSelecteurDate = () => {
			return {
				class: ObjetCelluleDate_1.ObjetCelluleDate,
				pere: lThis,
				start: function (aInstance) {
					const lPremiereDateSaisissable = ObjetDate_1.GDate.getDateCourante();
					aInstance.setParametresFenetre(
						GParametres.PremierLundi,
						lPremiereDateSaisissable,
						GParametres.DerniereDate,
					);
					aInstance.setOptionsFenetre({
						prioriteBlocageAbonnement:
							GestionnaireModale_1.GestionnaireModale
								.TypePrioriteBlocageInterface.message,
					});
					aInstance.setPremiereDateSaisissable(lPremiereDateSaisissable, true);
					aInstance.setDonnees(lDateProlongation);
				},
				evenement: function (aDate) {
					lDateProlongation = aDate;
				},
				init: function (aInstanceCelluleDate) {
					aInstanceCelluleDate.setOptionsObjetCelluleDate({
						ariaLabelledBy: lIDLabel,
					});
				},
			};
		};
		const lradioChoixElevesNonRendus = (aEstChoixElevesNonRendus) => {
			return {
				getValue: function () {
					return aEstChoixElevesNonRendus === true
						? lChoixElevesNonRendus
						: !lChoixElevesNonRendus;
				},
				setValue: function () {
					lChoixElevesNonRendus = aEstChoixElevesNonRendus;
				},
				getName: () => {
					return `${this.Nom}_ChoixElevesNonRendu`;
				},
			};
		};
		const lselecteurEleves = () => {
			return {
				getLibelle() {
					let lStrLibelle = "";
					if (!lChoixElevesNonRendus && lListeEleves) {
						lStrLibelle = lListeEleves.getTableauLibelles().join(", ");
					}
					return lStrLibelle;
				},
				event() {
					if (!lChoixElevesNonRendus && lListeEleves) {
						const lDonnees = {
							genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
							titre: ObjetTraduction_1.GTraductions.getValeur("Eleves"),
							estGenreRessourceDUtilisateurConnecte: false,
							listeRessources: lListeCompletEleves,
							listeRessourcesSelectionnees: lListeEleves,
						};
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
							{
								pere: lThis,
								evenement: function (
									aGenreRessource,
									aListeSelectionnee,
									aNumeroBouton,
								) {
									if (aNumeroBouton !== 0) {
										return;
									}
									lListeEleves = aListeSelectionnee;
								},
								initialiser: function (aInstanceFenetre) {
									aInstanceFenetre.setOptionsFenetre({
										titre: ObjetTraduction_1.GTraductions.getValeur("Eleves"),
										hauteurMin: 450,
										prioriteBlocageAbonnement:
											GestionnaireModale_1.GestionnaireModale
												.TypePrioriteBlocageInterface.message,
									});
									aInstanceFenetre.setOptionsFenetreSelectionRessource({
										autoriseEltAucun: true,
										listeFlatDesign: true,
									});
								},
							},
						);
						lFenetre.setDonnees(lDonnees);
					}
				},
				getDisabled() {
					return lChoixElevesNonRendus;
				},
			};
		};
		lMessage.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center justify-center" },
					IE.jsx.str(
						"div",
						{ class: "fix-bloc", id: lIDLabel },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.FenetreProlongationRendu.Message",
						),
					),
					IE.jsx.str("div", {
						class: "MargeGauche InlineBlock AlignementMilieuVertical",
						"ie-identite": lidentiteSelecteurDate,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "m-all-xl flex-contain flex-center justify-center" },
					IE.jsx.str(
						"div",
						{
							class: "fix-bloc flex-contain cols",
							role: "group",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.FenetreProlongationRendu.ChoixEleves",
							),
						},
						IE.jsx.str(
							"ie-radio",
							{
								class: "m-bottom-l",
								"ie-model": lradioChoixElevesNonRendus.bind(this, true),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.FenetreProlongationRendu.SansRendus",
							),
						),
						IE.jsx.str(
							"div",
							{ class: "flex-contain" },
							IE.jsx.str(
								"ie-radio",
								{
									class: "fix-bloc",
									"ie-model": lradioChoixElevesNonRendus.bind(this, false),
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"FenetreListeTAFFaits.FenetreProlongationRendu.PourLesElevesInfo",
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.FenetreProlongationRendu.PourLesEleves",
								),
							),
							IE.jsx.str("ie-btnselecteur", {
								class: "m-left",
								"ie-model": lselecteurEleves,
								style: "width:22rem;",
								role: "combobox",
								placeholder: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.FenetreProlongationRendu.AucunEleveSelectionne",
								),
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.FenetreProlongationRendu.selectionnerEleves",
								),
							}),
						),
					),
				),
			),
		);
		this.appSco.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.FenetreProlongationRendu.Titre",
			),
			message: lMessage.join(""),
			width: 420,
			getDisabledBouton: (aBouton) => {
				if (aBouton.genreAction === Enumere_Action_1.EGenreAction.Valider) {
					return !lChoixElevesNonRendus && lListeEleves.count() === 0;
				}
			},
			callback: function (aGenreBouton) {
				if (aGenreBouton === 0) {
					aCallback(lDateProlongation, lChoixElevesNonRendus, lListeEleves);
				}
			},
		});
	}
	prolongerDepotRenduEleve(aArticle) {
		this._afficherChoixDateDepotRenduEleve(
			aArticle,
			(aDateSelectionnee, aChoixElevesNonRendus, aListeEleves) => {
				this.donnees.listeEleves.parcourir((aEleve) => {
					if (aChoixElevesNonRendus) {
						if (aEleve.estProlongationRenduPossible && !aEleve.copieEleve) {
							aEleve.dateReportRendu = aDateSelectionnee;
							aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					} else {
						if (
							aListeEleves.getTableauNumeros().includes(aEleve.getNumero()) &&
							aEleve.estProlongationRenduPossible
						) {
							aEleve.dateReportRendu = aDateSelectionnee;
							aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				});
				this._lancerRequeteSaisieTAFARendre(
					ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.DateReportRendu,
					false,
					true,
				);
			},
		);
	}
	annulerProlongationRenduEleve(aArticle) {
		const lThis = this;
		const lListeEleves =
			lThis.donnees.selection ||
			new ObjetListeElements_1.ObjetListeElements().add(aArticle);
		let lAvecSaisie = false;
		this.donnees.listeEleves.parcourir((aEleve) => {
			if (
				lListeEleves.getTableauNumeros().includes(aEleve.getNumero()) &&
				aEleve.annulerProlongation
			) {
				aEleve.dateReportRendu = undefined;
				aEleve.annulationProlongation = true;
				aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecSaisie = true;
			}
		});
		if (lAvecSaisie) {
			this._lancerRequeteSaisieTAFARendre(
				ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.annulerProlongation,
				false,
				true,
			);
		}
	}
	verrouillerCopieEleve(aArticle) {
		this._verrouillerDeverouillerCopieEleve(aArticle, true);
	}
	deverrouillerCopieEleve(aArticle) {
		const lArrayMessage = [];
		lArrayMessage.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.EditionVerrou.ExplicationDeverrouillage",
			),
		);
		if (!!aArticle.commentaireCorrige) {
			lArrayMessage.push(
				"<br>",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.EditionVerrou.SuppressionCommentaireCorrige",
				),
			);
		}
		lArrayMessage.push(
			"<br>",
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreListeTAFFaits.EditionVerrou.ConfirmationDeverrouillage",
			),
		);
		const lThis = this;
		this.appSco.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: lArrayMessage.join(""),
			callback: function (aGenreBouton) {
				if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
					lThis._verrouillerDeverouillerCopieEleve(aArticle, false);
				}
			},
		});
	}
	_verrouillerDeverouillerCopieEleve(aArticle, aVerrou) {
		aArticle.estVerrouille = aVerrou;
		aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this._lancerRequeteSaisieTAFARendre(
			ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.Verrou,
			false,
			true,
		);
	}
	lancerRecuperationListeTravauxRendus(aTAF, aExecutionQCM) {
		new ObjetRequeteListeTravauxRendus_1.ObjetRequeteListeTravauxRendus(
			this,
			this._reponseRequeteTAFARendre,
		).lancerRequete({ taf: aTAF, executionQCM: aExecutionQCM });
	}
	_existeAuMoinsUnDevoirRendu(aListeEleves) {
		let lExisteAuMoinsUnDocument = false;
		if (!!aListeEleves) {
			aListeEleves.parcourir((D) => {
				if (!!D && !!D.copieEleve && D.copieEleve.existe()) {
					lExisteAuMoinsUnDocument = true;
					return false;
				}
			});
		}
		return lExisteAuMoinsUnDocument;
	}
	_lancerRequeteSaisieTAFARendre(
		aTypeSaisie,
		aAvecActualisationListeSeule,
		aAvecRecuperationDonnees,
	) {
		const lListeCopiesEleveEtCorrigee =
			new ObjetListeElements_1.ObjetListeElements();
		this.donnees.listeEleves.parcourir((aEleve) => {
			if (!!aEleve && aEleve.pourValidation()) {
				if (!!aEleve.copieEleve) {
					lListeCopiesEleveEtCorrigee.addElement(aEleve.copieEleve);
				}
				if (!!aEleve.copieCorrigee) {
					lListeCopiesEleveEtCorrigee.addElement(aEleve.copieCorrigee);
				}
			}
		});
		let lParamsActualisation = null;
		if (!!aAvecActualisationListeSeule || !!aAvecRecuperationDonnees) {
			lParamsActualisation = {
				avecActualisationListe: !!aAvecActualisationListeSeule,
				avecRecuperationDonnees: !!aAvecRecuperationDonnees,
			};
		}
		new ObjetRequeteSaisieTAFARendre_1.ObjetRequeteSaisieTAFARendre(
			this,
			this._surReponseRequeteSaisieTAFARendre.bind(this, lParamsActualisation),
		)
			.addUpload({ listeFichiers: lListeCopiesEleveEtCorrigee })
			.lancerRequete(aTypeSaisie, {
				listeEleves: this.donnees.listeEleves,
				TAF: this.donnees.TAF,
			});
	}
	_surReponseRequeteSaisieTAFARendre(aParametresActualisation) {
		if (
			!!aParametresActualisation &&
			aParametresActualisation.avecRecuperationDonnees
		) {
			this.lancerRecuperationListeTravauxRendus(
				this.donnees.TAF,
				this.donnees.executionQCM,
			);
		} else {
			if (!!this.donnees.listeEleves) {
				this.donnees.listeEleves.parcourir((aEleve) => {
					aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				});
			}
			if (
				!!aParametresActualisation &&
				aParametresActualisation.avecActualisationListe
			) {
				this.getInstance(this.identListe).actualiser(true, false);
			}
		}
	}
	_surReponseRequeteGenerationTAFARendre(aParam) {
		if (!!aParam.url) {
			window.open(aParam.url);
			if (this.options.avecVerrouillageSurAccesDocuments) {
				if (this.donnees.listeEleves) {
					let lAvecChangements = false;
					this.donnees.listeEleves.parcourir((aEleve) => {
						if (
							!!aEleve &&
							!!aEleve.copieEleve &&
							aEleve.copieEleve.existe() &&
							!aEleve.estVerrouille
						) {
							aEleve.estVerrouille = true;
							aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lAvecChangements = true;
						}
					});
					if (lAvecChangements) {
						this._lancerRequeteSaisieTAFARendre(
							ObjetRequeteSaisieTAFARendre_2.TypeSaisieTAFARendre.Verrou,
							true,
						);
					}
				}
			}
		}
	}
	async deposerCopiesCorrigeesMultiples(aParametresRequetesDepot) {
		const lRepoonse =
			await new ObjetRequeteSaisieDeposerCorrigesEleves_1.ObjetRequeteSaisieDeposerCorrigesEleves(
				this,
			)
				.addUpload({ listeFichiers: aParametresRequetesDepot.listeFichiers })
				.lancerRequete(aParametresRequetesDepot);
		const lThis = this;
		if (!!lRepoonse.JSONReponse && !!lRepoonse.JSONReponse.messageInformation) {
			this.appSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.AucunCorrigeImporte",
					),
					message: lRepoonse.JSONReponse.messageInformation,
				});
		} else if (
			!!lRepoonse.JSONReponse &&
			!!lRepoonse.JSONReponse.messageConfirmation
		) {
			this.appSco.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: lRepoonse.JSONReponse.messageConfirmation,
				callback: function (aGenreAction) {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						aParametresRequetesDepot.confirmation = true;
						aParametresRequetesDepot.listeFichiers =
							lRepoonse.JSONReponse.listeFichiersCompletee;
						lThis.deposerCopiesCorrigeesMultiples(aParametresRequetesDepot);
					}
				},
			});
		} else {
			if (
				lRepoonse.JSONRapportSaisie &&
				!!lRepoonse.JSONRapportSaisie.messageRapport
			) {
				await this.appSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: lRepoonse.JSONRapportSaisie.messageRapport,
					});
			}
			this.lancerRecuperationListeTravauxRendus(
				lThis.donnees.TAF,
				lThis.donnees.executionQCM,
			);
		}
	}
}
exports.ObjetFenetre_ListeTAFFaits = ObjetFenetre_ListeTAFFaits;
class DonneesListe_ListeTAFFaits extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aDonneesTAF, aOptionsUtilisateur, aCallbacks) {
		super(aDonnees);
		this.estUnTAFQCM = aDonneesTAF.estUnTAFQCM;
		this.genreRenduTAF = aDonneesTAF.genreRendu;
		this.optionsUtilisateur = aOptionsUtilisateur;
		this.callbacks = aCallbacks;
		this.setOptions({
			avecSelection: true,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecEtatSaisie: false,
			hauteurMinContenuCellule: 40,
			editionApresSelection: false,
			avecMultiSelection: aDonneesTAF.multiSelection,
			avecEvnt_ModificationSelection: true,
		});
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
			case DonneesListe_ListeTAFFaits.colonnes.fait:
			case DonneesListe_ListeTAFFaits.colonnes.pourLe:
			case DonneesListe_ListeTAFFaits.colonnes.verrou:
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
				lClasses.push("AlignementMilieu");
				break;
		}
		if (
			aParams.idColonne === DonneesListe_ListeTAFFaits.colonnes.fait &&
			this.estUnTAFQCM &&
			!IE.estMobile &&
			!!aParams.article.estRendu &&
			!aParams.article.enCours
		) {
			lClasses.push("AvecMain");
		}
		if (!!this.optionsUtilisateur.avecAccesDocuments) {
			switch (aParams.idColonne) {
				case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
					if (existeUneCopieEleve(aParams.article)) {
						lClasses.push("AvecMain");
					}
					break;
				case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
					if (existeUneCopieCorrigee(aParams.article)) {
						lClasses.push("AvecMain");
					}
					break;
			}
		}
		return lClasses.join(" ");
	}
	getTypeValeur(aParams) {
		if (aParams.idColonne === DonneesListe_ListeTAFFaits.colonnes.commentaire) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		} else {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
	}
	getTailleTexteMax() {
		return 300;
	}
	_composeCelluleEleve(aEleve) {
		const H = [];
		if (!!aEleve) {
			let lLargeurPhoto = 0;
			let lStrPhotoEleve = "";
			if (this.optionsUtilisateur.avecPhotosEleves) {
				lLargeurPhoto = 28;
				lStrPhotoEleve = _composePhoto.call(this, aEleve, lLargeurPhoto);
			}
			let lTraductionDateFaitOuDepose;
			if (!!aEleve.dateRealisation) {
				const lStrDateRealisation = !!aEleve.dateRealisation
					? ObjetDate_1.GDate.formatDate(
							aEleve.dateRealisation,
							"%JJ/%MM/%AAAA",
						)
					: "";
				if (this.estUnTAFQCM) {
					lTraductionDateFaitOuDepose =
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.ReponduLe",
							[lStrDateRealisation],
						);
				} else {
					if (
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estSansRendu(
							this.genreRenduTAF,
						)
					) {
						lTraductionDateFaitOuDepose =
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.FaitLe",
								[lStrDateRealisation],
							);
					} else if (
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduPapier(
							this.genreRenduTAF,
						)
					) {
						lTraductionDateFaitOuDepose =
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.RenduLe",
								[lStrDateRealisation],
							);
					} else {
						lTraductionDateFaitOuDepose =
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.DeposeLe",
								[lStrDateRealisation],
							);
					}
				}
			}
			const lStrDateDepotDocument = [];
			if (!!lTraductionDateFaitOuDepose) {
				const lArrStylesInfosDatees = ["font-style: italic;", "color: #666;"];
				lStrDateDepotDocument.push(
					'<div style="float: right; ',
					lArrStylesInfosDatees.join(""),
					'">',
					lTraductionDateFaitOuDepose,
					"</div>",
				);
			}
			H.push(
				"<div>",
				lStrPhotoEleve,
				'<div class="InlineBlock AlignementHaut EspaceGauche" style="width: calc(100% - ',
				lLargeurPhoto,
				'px - 5px);">',
				lStrDateDepotDocument.join(""),
				"<div>",
				aEleve.getLibelle(),
				"</div>",
				"</div>",
				"</div>",
			);
		}
		return H.join("");
	}
	jsxModelChipsAudio() {
		return {
			event: (aEvent, aNode) => {
				$(aNode)
					.toggleClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
					.toggleClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
				const lElemAudio = $(aNode).find("audio")[0];
				if (UtilitaireAudio_1.UtilitaireAudio.estEnCoursDeLecture(lElemAudio)) {
					UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudio);
					this.audioEnLecture = null;
				} else {
					try {
						if (!!this.audioEnLecture) {
							if (
								UtilitaireAudio_1.UtilitaireAudio.estEnCoursDeLecture(
									this.audioEnLecture,
								)
							) {
								UtilitaireAudio_1.UtilitaireAudio.stopAudio(
									this.audioEnLecture,
								);
							}
							this.audioEnLecture = null;
						}
						UtilitaireAudio_1.UtilitaireAudio.jouerAudio(lElemAudio);
						this.audioEnLecture = lElemAudio;
					} catch (error) {
						this.audioEnLecture = null;
						if (
							error ===
							UtilitaireAudio_1.UtilitaireAudio.ExceptionFichierNonValide
						) {
							$(aNode)
								.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
								.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
						}
					}
				}
			},
			node: (aNode) => {
				const $chips = $(aNode);
				const $audio = $chips.find("audio");
				$audio.on("play", () => {
					$chips
						.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
						.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
				});
				$audio.on("pause", () => {
					$chips
						.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
						.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
				});
			},
		};
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.eleve:
				return this._composeCelluleEleve(aParams.article);
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				if (!!aParams.article.estRendu) {
					return (
						'<i class="taf as-icon icon_check_fin" role="img" aria-label="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.colonnes.Fait",
						) +
						'"></i>'
					);
				} else if (!!aParams.article.enCours) {
					return (
						'<i class="taf as-icon icon_edt_permanence" role="img" aria-label="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.hintColonnes.enCours",
						) +
						'"></i>'
					);
				} else {
					return "";
				}
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve: {
				const lStrCopieEleve = [];
				if (existeUneCopieEleve(aParams.article)) {
					if (
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
							this.genreRenduTAF,
						)
					) {
						const lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
							aParams.article.copieEleve,
						);
						lStrCopieEleve.push(
							UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
								url: lUrl,
								ieModel: this.jsxModelChipsAudio.bind(this),
								argsIEModel: [aParams.article.getNumero()],
								idAudio: aParams.article.getNumero(),
								classes: ["no-underline"],
							}),
						);
					} else {
						lStrCopieEleve.push(
							IE.jsx.str("i", {
								class: "taf as-icon icon_piece_jointe",
								"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.DocsJoints",
								),
								role: "img",
							}),
						);
					}
				}
				return lStrCopieEleve.join("");
			}
			case DonneesListe_ListeTAFFaits.colonnes.pourLe: {
				return (
					aParams.article.strPourLe ||
					ObjetDate_1.GDate.formatDate(aParams.article.datePourLe, "%JJ/%MM")
				);
			}
			case DonneesListe_ListeTAFFaits.colonnes.verrou: {
				const lStrVerrou = [];
				if (!!aParams.article.dateReportRendu) {
					const lStrDateReport = ObjetDate_1.GDate.formatDate(
						aParams.article.dateReportRendu,
						"%JJ/%MM",
					);
					lStrVerrou.push("<span>", lStrDateReport, "</span>");
				} else if (!!aParams.article.estVerrouille) {
					lStrVerrou.push(
						'<span class="InlineBlock Image_Verrou" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.CopieVerrouillee",
						),
						'"></span>',
					);
				}
				return lStrVerrou.join("");
			}
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee: {
				const lStrCopieCorrigee = [];
				if (existeUneCopieCorrigee(aParams.article)) {
					lStrCopieCorrigee.push(
						'<span class="InlineBlock Image_Casier_Corrige"></span>',
					);
				}
				return lStrCopieCorrigee.join("");
			}
			case DonneesListe_ListeTAFFaits.colonnes.commentaire:
				return aParams.article.commentaireCorrige || "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				if (!!aParams.article.enCours) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.hintColonnes.enCours",
					);
				}
				break;
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
				if (existeUneCopieEleve(aParams.article)) {
					return aParams.article.copieEleve.hint || "";
				}
				break;
			case DonneesListe_ListeTAFFaits.colonnes.verrou:
				return aParams.article.hintVerrou || "";
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
				if (existeUneCopieCorrigee(aParams.article)) {
					return aParams.article.copieCorrigee.hint || "";
				}
				break;
		}
		return "";
	}
	avecEvenementSelectionClick(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				return (
					this.estUnTAFQCM &&
					!IE.estMobile &&
					!!aParams.article.estRendu &&
					!aParams.article.enCours
				);
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
				return (
					!!this.optionsUtilisateur.avecAccesDocuments &&
					existeUneCopieEleve(aParams.article) &&
					!TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
						this.genreRenduTAF,
					)
				);
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
				return (
					!!this.optionsUtilisateur.avecAccesDocuments &&
					existeUneCopieCorrigee(aParams.article)
				);
		}
		return false;
	}
	autoriserChaineVideSurEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.commentaire:
				return true;
		}
		return false;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				return !!aParams.article.estRenduEditable;
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
				return !!aParams.article.estCopieEleveEditable;
			case DonneesListe_ListeTAFFaits.colonnes.pourLe:
				return (
					!!aParams.article.estProlongationRenduPossible ||
					!!aParams.article.annulerProlongation
				);
			case DonneesListe_ListeTAFFaits.colonnes.verrou:
				return !!aParams.article.estVerrouilleEditable;
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
				return !!aParams.article.estCopieCorrigeeEditable;
			case DonneesListe_ListeTAFFaits.colonnes.commentaire:
				return !!aParams.article.estCommentaireCorrigeEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.fait:
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
			case DonneesListe_ListeTAFFaits.colonnes.pourLe:
			case DonneesListe_ListeTAFFaits.colonnes.verrou:
			case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
				return this.avecEdition(aParams);
		}
		return false;
	}
	avecEvenementApresEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.commentaire:
				return this.avecEdition(aParams);
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.commentaire:
				aParams.article.commentaireCorrige = V;
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
		}
	}
	avecMenuContextuel() {
		return (
			!(
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estSansRendu(
					this.genreRenduTAF,
				) ||
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduPapier(
					this.genreRenduTAF,
				)
			) || this.estUnTAFQCM
		);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		const lEstMultiSelection =
			aParametres.listeSelection && aParametres.listeSelection.count() > 1;
		const lCallbacks = this.callbacks;
		if (this.estUnTAFQCM) {
			if (!IE.estMobile) {
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.VoirCorrige"),
					!!aParametres.article.estRendu && !aParametres.article.enCours,
					() => {
						lCallbacks.surVoirCorrige(aParametres.article);
					},
				);
			}
		} else {
			const lExisteUneCopieEleve = existeUneCopieEleve(aParametres.article);
			const lCopieEleveEstEditable =
				!!aParametres.article.estCopieEleveEditable;
			const lExisteUneCopieCorrigee = existeUneCopieCorrigee(
				aParametres.article,
			);
			const lCopieCorrigeeEstEditable =
				!!aParametres.article.estCopieCorrigeeEditable;
			const lEstRenduEnligne =
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					this.genreRenduTAF,
					false,
				);
			aParametres.menuContextuel.addTitre(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.menuContextuel.CopieEleve.Titre",
				),
			);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.menuContextuel.CopieEleve.Recuperer",
				),
				!!this.optionsUtilisateur.avecAccesDocuments &&
					lExisteUneCopieEleve &&
					!lEstMultiSelection,
				() => {
					lCallbacks.surRecupererCopieEleve(aParametres.article);
				},
			);
			if (lEstRenduEnligne) {
				const lStrDeposerRemplacerCE = lExisteUneCopieEleve
					? ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.Remplacer",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.Deposer",
						);
				aParametres.menuContextuel.add(
					lStrDeposerRemplacerCE,
					lCopieEleveEstEditable && !lEstMultiSelection,
					() => {
						lCallbacks.surAjouterCopieEleve(aParametres.article);
					},
				);
			}
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreListeTAFFaits.menuContextuel.CopieEleve.Supprimer",
				),
				lCopieEleveEstEditable && lExisteUneCopieEleve && !lEstMultiSelection,
				() => {
					lCallbacks.surSupprimerCopieEleve(aParametres.article);
				},
			);
			if (!lExisteUneCopieCorrigee) {
				const lVerrouEditable = !!aParametres.article.estVerrouilleEditable;
				if (lVerrouEditable) {
					if (!aParametres.article.estVerrouille) {
						const lStrVerrouiller = ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.Verrouiller",
						);
						aParametres.menuContextuel.add(
							lStrVerrouiller,
							!lEstMultiSelection,
							() => {
								lCallbacks.surVerrouillerCopieEleve(aParametres.article);
							},
						);
					} else {
						const lEstDeverrouillable =
							!!aParametres.article.estDeverrouillable;
						if (!!lEstDeverrouillable) {
							const lStrDeverrouiller =
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreListeTAFFaits.menuContextuel.CopieEleve.Deverrouiller",
								);
							aParametres.menuContextuel.add(
								lStrDeverrouiller,
								!lEstMultiSelection,
								() => {
									lCallbacks.surDeverrouillerCopieEleve(aParametres.article);
								},
							);
						}
					}
				}
				let lEstProlongationRenduPossible =
					aParametres.article.estProlongationRenduPossible;
				if (
					!lEstProlongationRenduPossible &&
					aParametres.listeSelection &&
					aParametres.listeSelection.count() > 0
				) {
					aParametres.listeSelection.parcourir((aElement) => {
						if (aElement.estProlongationRenduPossible) {
							lEstProlongationRenduPossible = true;
							return false;
						}
					});
				}
				if (!!lEstProlongationRenduPossible) {
					aParametres.menuContextuel.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.ProlongerRenduEleve",
						),
						true,
						() => {
							lCallbacks.surProlongerDepotRenduEleve(aParametres.article);
						},
					);
				}
				let lAvecAnnulerProlongation = aParametres.article.annulerProlongation;
				if (
					!lAvecAnnulerProlongation &&
					aParametres.listeSelection &&
					aParametres.listeSelection.count() > 0
				) {
					aParametres.listeSelection.parcourir((aElement) => {
						if (aElement.annulerProlongation) {
							lAvecAnnulerProlongation = true;
							return false;
						}
					});
				}
				if (!!lAvecAnnulerProlongation) {
					aParametres.menuContextuel.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.annulerProlongation",
						),
						true,
						() => {
							lCallbacks.surAnnulerProlongationRenduEleve(aParametres.article);
						},
					);
				}
			}
			if (lEstRenduEnligne) {
				aParametres.menuContextuel.addSeparateur();
				aParametres.menuContextuel.addTitre(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Titre",
					),
				);
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Recuperer",
					),
					!!this.optionsUtilisateur.avecAccesDocuments &&
						lExisteUneCopieCorrigee &&
						!lEstMultiSelection,
					() => {
						lCallbacks.surRecupererCopieCorrigee(aParametres.article);
					},
				);
				const lStrDeposerRemplacerCC = lExisteUneCopieCorrigee
					? ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Remplacer",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Deposer",
						);
				aParametres.menuContextuel.add(
					lStrDeposerRemplacerCC,
					lCopieCorrigeeEstEditable && !lEstMultiSelection,
					() => {
						lCallbacks.surAjouterCopieCorrigee(aParametres.article);
					},
				);
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Supprimer",
					),
					lCopieCorrigeeEstEditable &&
						lExisteUneCopieCorrigee &&
						!lEstMultiSelection,
					() => {
						lCallbacks.surSupprimerCopieCorrigee(aParametres.article);
					},
				);
			}
		}
	}
}
(function (DonneesListe_ListeTAFFaits) {
	let colonnes;
	(function (colonnes) {
		colonnes["eleve"] = "DLTAFFAITS_eleve";
		colonnes["fait"] = "DLTAFFAITS_fait";
		colonnes["copieEleve"] = "DLTAFFAITS_copieEleve";
		colonnes["pourLe"] = "DLTAFFAITS_pourLe";
		colonnes["verrou"] = "DLTAFFAITS_verrou";
		colonnes["copieCorrigee"] = "DLTAFFAITS_copieCorrigee";
		colonnes["commentaire"] = "DLTAFFAITS_commentaire";
	})(
		(colonnes =
			DonneesListe_ListeTAFFaits.colonnes ||
			(DonneesListe_ListeTAFFaits.colonnes = {})),
	);
})(DonneesListe_ListeTAFFaits || (DonneesListe_ListeTAFFaits = {}));
function existeUneCopieEleve(aArticle) {
	return !!aArticle.copieEleve && aArticle.copieEleve.existe();
}
function existeUneCopieCorrigee(aArticle) {
	return !!aArticle.copieCorrigee && aArticle.copieCorrigee.existe();
}
function _composePhoto(aEleve, aLargeurDiv) {
	const H = [];
	if (aEleve) {
		H.push(
			'<div class="InlineBlock AlignementHaut" style="height: 37px; width: ',
			aLargeurDiv,
			'px; ">',
			'<img ie-load-src="',
			ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aEleve, {
				libelle: "photo.jpg",
			}),
			'" class="img-portrait" alt="',
			aEleve.getLibelle(),
			'" data-libelle="',
			aEleve.getLibelle(),
			'" ie-imgviewer style="height: auto; width: auto; max-height: 100%; max-width: 100%;"/>',
			"</div>",
		);
	}
	return H.join("");
}

const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GHtml } = require("ObjetHtml.js");
const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const ObjetRequeteListeTravauxRendus = require("ObjetRequeteListeTravauxRendus.js");
const ObjetRequeteTelechargerCopiesEleves = require("ObjetRequeteTelechargerCopiesEleves.js");
const {
	ObjetRequeteSaisieTAFARendre,
} = require("ObjetRequeteSaisieTAFARendre.js");
const { TypeSaisieTAFARendre } = require("ObjetRequeteSaisieTAFARendre.js");
const {
	TypeGenreRenduTAF,
	TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
	ObjetFenetre_UploadFichiers,
} = require("ObjetFenetre_UploadFichiers.js");
const {
	ObjetFenetre_EnregistrementAudio,
} = require("ObjetFenetre_EnregistrementAudio.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GestionnaireModale } = require("GestionnaireModale.js");
const ObjetRequeteSaisieDeposerCorrigesEleves = require("ObjetRequeteSaisieDeposerCorrigesEleves.js");
const { UtilitaireAudio } = require("UtilitaireAudio.js");
const {
	ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
const MultipleObjetFenetreVisuEleveQCM = require("ObjetFenetreVisuEleveQCM.js");
const ObjetFenetreVisuEleveQCM = MultipleObjetFenetreVisuEleveQCM
	? MultipleObjetFenetreVisuEleveQCM.ObjetFenetreVisuEleveQCM
	: null;
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GUID } = require("GUID.js");
const TypeBoutonFenetreTAFFaits = { Fermer: 0 };
class ObjetFenetre_ListeTAFFaits extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			TAF: null,
			executionQCM: null,
			listeEleves: null,
			eleveSelectionne: null,
		};
		this.options = {
			avecPhotosEleves: true,
			avecVerrouillageSurAccesDocuments: true,
		};
		this.setOptionsFenetre({
			modale: true,
			hauteur: 600,
			titre: GTraductions.getValeur("FenetreListeTAFFaits.Titre"),
			listeBoutons: [
				{
					libelle: GTraductions.getValeur("Fermer"),
					theme: TypeThemeBouton.secondaire,
					typeBouton: TypeBoutonFenetreTAFFaits.Fermer,
				},
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementListeElevesTAF.bind(this),
			_initialiserListeElevesTAF,
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
					prolongerDepotRenduEleve.call(aInstance);
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					return (
						aInstance.avecProlongationPossible &&
						TypeGenreRenduTAFUtil.estUnRenduEnligne(lGenreRenduTaf, false)
					);
				},
			},
			telecharger: {
				copiesEleve: {
					event: function () {
						new ObjetRequeteTelechargerCopiesEleves(
							aInstance,
							_surReponseRequeteGenerationTAFARendre,
						).lancerRequete({ taf: aInstance.donnees.TAF });
					},
					getLibelle: function () {
						const lGenreRenduTaf = aInstance.getGenreRenduTAF();
						const lTafEstMedia =
							TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf);
						return lTafEstMedia
							? GTraductions.getValeur("FenetreListeTAFFaits.TelechargerVocaux")
							: GTraductions.getValeur("FenetreListeTAFFaits.TelechargerTout");
					},
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					const lTafEstUnRenduNumerique =
						TypeGenreRenduTAFUtil.estUnRenduEnligne(lGenreRenduTaf, false);
					return (
						lTafEstUnRenduNumerique &&
						!!aInstance.donnees.avecAccesDocuments &&
						_existeAuMoinsUnDevoirRendu(aInstance.donnees.listeEleves)
					);
				},
			},
			deposer: {
				corrigesMultiples: {
					getOptionsSelecFile: function () {
						const lOptionsSelecFile = {
							maxSize: GApplication.droits.get(
								TypeDroits.tailleMaxRenduTafEleve,
							),
							multiple: true,
							avecResizeImage: false,
						};
						return lOptionsSelecFile;
					},
					addFiles: function (aParams) {
						const lListeFichiers = aParams.listeFichiers;
						if (!!lListeFichiers && lListeFichiers.count() > 0) {
							deposerCopiesCorrigeesMultiples.call(aInstance, {
								taf: aInstance.donnees.TAF,
								listeFichiers: lListeFichiers,
							});
						}
					},
					getLibelle: function () {
						return GTraductions.getValeur(
							"FenetreListeTAFFaits.DeposerPlusieursCorriges",
						);
					},
				},
				visible: function () {
					const lGenreRenduTaf = aInstance.getGenreRenduTAF();
					const lTafEstUnRenduNumerique =
						TypeGenreRenduTAFUtil.estUnRenduEnligne(lGenreRenduTaf, false);
					const lTafEstMedia =
						TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf);
					return (
						lTafEstUnRenduNumerique &&
						!lTafEstMedia &&
						!!aInstance.donnees.avecAccesDocuments &&
						_existeAuMoinsUnDevoirRendu(aInstance.donnees.listeEleves)
					);
				},
			},
		});
	}
	getGenreRenduTAF() {
		return !!this.donnees.TAF
			? this.donnees.TAF.genreRendu
			: TypeGenreRenduTAF.GRTAF_AucunRendu;
	}
	composeContenu() {
		const H = [];
		H.push('<div class="ObjetFenetre_ListeTAFFaits">');
		H.push('<div class="flex-contain justify-between flex-center">');
		H.push('<div ie-html="getStrDetailTAF" class="LabelDetailTaf"></div>');
		H.push(
			`<ie-bouton class="m-bottom" ie-if="prolongerDateDepot.visible" ie-model="prolongerDateDepot">${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.bouton")}</ie-bouton>`,
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
		const lTafEstUnRenduNumerique = TypeGenreRenduTAFUtil.estUnRenduEnligne(
			lGenreRenduTaf,
			false,
		);
		this.setOptionsFenetre({ largeur: lTafEstUnRenduNumerique ? 760 : 400 });
		this.initialiser();
		lancerRecuperationListeTravauxRendus.call(this, aTAF, aExecutionQCM);
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
		const lTafEstUnRenduNumerique = TypeGenreRenduTAFUtil.estUnRenduEnligne(
			lGenreRenduTaf,
			false,
		);
		const lTafEstUnRenduNumeriquePlusKiosque =
			TypeGenreRenduTAFUtil.estUnRenduEnligne(lGenreRenduTaf, true);
		const lInstanceListe = this.getInstance(this.identListe);
		const lColonnesCachees = [];
		if (lTafEstUnRenduNumerique) {
			lColonnesCachees.push(DonneesListe_ListeTAFFaits.colonnes.fait);
			if (TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf)) {
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
			colonnes: _getColonnes(
				TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf),
				TypeGenreRenduTAFUtil.estUnRenduKiosque(lGenreRenduTaf),
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
						voirCorrigeQCMEleve.call(lThis, aEleve);
					},
					surRecupererCopieEleve: function (aArticle) {
						ouvrirCopieEleve.call(lThis, aArticle);
					},
					surAjouterCopieEleve: function (aArticle) {
						deposerCopieEleve.call(lThis, aArticle);
					},
					surSupprimerCopieEleve: function (aArticle) {
						const lMsgConfirmation = GTraductions.getValeur(
							"FenetreListeTAFFaits.ConfirmationSuppressionCopieEleve",
						);
						supprimerDocument.call(
							lThis,
							aArticle,
							aArticle.copieEleve,
							lMsgConfirmation,
							TypeSaisieTAFARendre.CopieEleve,
						);
					},
					surProlongerDepotRenduEleve: function (aArticle) {
						prolongerDepotRenduEleve.call(lThis, aArticle);
					},
					surAnnulerProlongationRenduEleve: function (aArticle) {
						annulerProlongationRenduEleve.call(lThis, aArticle);
					},
					surVerrouillerCopieEleve: function (aArticle) {
						verrouillerCopieEleve.call(lThis, aArticle);
					},
					surDeverrouillerCopieEleve: function (aArticle) {
						deverrouillerCopieEleve.call(lThis, aArticle);
					},
					surRecupererCopieCorrigee: function (aArticle) {
						ouvrirCopieCorrigee(aArticle);
					},
					surAjouterCopieCorrigee: function (aArticle) {
						deposerCopieCorrigee.call(lThis, aArticle);
					},
					surSupprimerCopieCorrigee: function (aArticle) {
						const lMsgConfirmation = GTraductions.getValeur(
							"FenetreListeTAFFaits.ConfirmationSuppressionCopieCorrigee",
						);
						supprimerDocument.call(
							lThis,
							aArticle,
							aArticle.copieCorrigee,
							lMsgConfirmation,
							TypeSaisieTAFARendre.CopieCorrigee,
						);
					},
				},
			),
		);
		if (!!this.donnees.eleveSelectionne) {
			lInstanceListe.setListeElementsSelection(
				new ObjetListeElements().add(this.donnees.eleveSelectionne),
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
		const lFenetreListeTAFFaits = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ListeTAFFaits,
			$.extend(aParams, { initialiser: false }),
		);
		lFenetreListeTAFFaits.setDonnees(aDonnees, aExecutionQCM);
	}
}
function _getColonnes(aEstVocal, aPourKiosque) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ListeTAFFaits.colonnes.eleve,
		taille: "100%",
		titre: GTraductions.getValeur("FenetreListeTAFFaits.colonnes.Eleve"),
	});
	lColonnes.push({
		id: DonneesListe_ListeTAFFaits.colonnes.fait,
		taille: 40,
		titre: GTraductions.getValeur("FenetreListeTAFFaits.colonnes.Fait"),
	});
	lColonnes.push({
		id: DonneesListe_ListeTAFFaits.colonnes.copieEleve,
		taille: 45,
		titre: aPourKiosque
			? {
					libelle: GTraductions.getValeur(
						"FenetreListeTAFFaits.colonnes.CopieEleve",
					),
					title: GTraductions.getValeur(
						"FenetreListeTAFFaits.hintColonnes.CopieEleve",
					),
				}
			: [
					{
						libelle: aEstVocal
							? GTraductions.getValeur(
									"FenetreListeTAFFaits.surColonnes.vocalEleve",
								)
							: GTraductions.getValeur(
									"FenetreListeTAFFaits.surColonnes.CopieEleve",
								),
					},
					{
						libelle: GTraductions.getValeur(
							"FenetreListeTAFFaits.colonnes.CopieEleve",
						),
						title: GTraductions.getValeur(
							"FenetreListeTAFFaits.hintColonnes.CopieEleve",
						),
					},
				],
	});
	lColonnes.push({
		id: DonneesListe_ListeTAFFaits.colonnes.pourLe,
		taille: 55,
		titre: [
			{ libelle: TypeFusionTitreListe.FusionGauche },
			{
				libelle: GTraductions.getValeur("FenetreListeTAFFaits.colonnes.PourLe"),
				title: GTraductions.getValeur(
					"FenetreListeTAFFaits.hintColonnes.PourLe",
				),
			},
		],
	});
	lColonnes.push({
		id: DonneesListe_ListeTAFFaits.colonnes.verrou,
		taille: 45,
		titre: [
			{ libelle: TypeFusionTitreListe.FusionGauche },
			{
				libelleHtml: '<span class="InlineBlock Image_Verrou"></span>',
				title: GTraductions.getValeur(
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
				libelle: GTraductions.getValeur(
					"FenetreListeTAFFaits.surColonnes.CopieCorrigee",
				),
			},
			{
				libelle: GTraductions.getValeur(
					"FenetreListeTAFFaits.colonnes.CopieCorrigee",
				),
				title: GTraductions.getValeur(
					"FenetreListeTAFFaits.hintColonnes.CopieCorrigee",
				),
			},
		],
	});
	const lObTitres = [];
	if (!aEstVocal) {
		lObTitres.push({
			libelle: GTraductions.getValeur(
				"FenetreListeTAFFaits.surColonnes.CopieCorrigee",
			),
			avecFusionColonne: true,
		});
	}
	lObTitres.push({
		libelle: GTraductions.getValeur(
			"FenetreListeTAFFaits.colonnes.Commentaire",
		),
		title: GTraductions.getValeur(
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
function _initialiserListeElevesTAF(aInstance) {
	aInstance.setOptionsListe({
		colonnes: _getColonnes(false, false),
		nonEditable: false,
		avecCelluleEditableTriangle: false,
	});
}
function _evenementListeElevesTAF(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			this.donnees.eleveSelectionne = aParametres.article;
			break;
		case EGenreEvenementListe.SelectionClick:
			if (aParametres.idColonne === DonneesListe_ListeTAFFaits.colonnes.fait) {
				voirCorrigeQCMEleve.call(this, aParametres.article);
			} else if (
				aParametres.idColonne === DonneesListe_ListeTAFFaits.colonnes.copieEleve
			) {
				const lGenreRenduTaf = this.getGenreRenduTAF();
				if (!TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf)) {
					ouvrirCopieEleve.call(this, aParametres.article);
				}
			} else if (
				aParametres.idColonne ===
				DonneesListe_ListeTAFFaits.colonnes.copieCorrigee
			) {
				ouvrirCopieCorrigee(aParametres.article);
			}
			break;
		case EGenreEvenementListe.Edition:
			switch (aParametres.idColonne) {
				case DonneesListe_ListeTAFFaits.colonnes.fait: {
					aParametres.article.estRendu = !aParametres.article.estRendu;
					aParametres.article.setEtat(EGenreEtat.Modification);
					let lDateRendu = null;
					if (aParametres.article.estRendu) {
						lDateRendu = new Date();
					}
					aParametres.article.dateRealisation = lDateRendu;
					_lancerRequeteSaisieTAFARendre.call(
						this,
						TypeSaisieTAFARendre.Rendu,
						true,
					);
					break;
				}
				case DonneesListe_ListeTAFFaits.colonnes.copieEleve:
					if (!aParametres.article.copieEleve) {
						deposerCopieEleve.call(this, aParametres.article);
					}
					break;
				case DonneesListe_ListeTAFFaits.colonnes.pourLe:
					if (!!aParametres.article.estProlongationRenduPossible) {
						prolongerDepotRenduEleve.call(this, aParametres.article);
					}
					break;
				case DonneesListe_ListeTAFFaits.colonnes.verrou:
					if (aParametres.article.estVerrouille) {
						deverrouillerCopieEleve.call(this, aParametres.article);
					} else {
						verrouillerCopieEleve.call(this, aParametres.article);
					}
					break;
				case DonneesListe_ListeTAFFaits.colonnes.copieCorrigee:
					if (!aParametres.article.copieCorrigee) {
						deposerCopieCorrigee.call(this, aParametres.article);
					}
					break;
			}
			break;
		case EGenreEvenementListe.ApresEdition:
			switch (aParametres.idColonne) {
				case DonneesListe_ListeTAFFaits.colonnes.commentaire:
					_lancerRequeteSaisieTAFARendre.call(
						this,
						TypeSaisieTAFARendre.CommentaireCorrige,
					);
					break;
			}
			break;
		case EGenreEvenementListe.ModificationSelection:
			this.donnees.selection = this.getInstance(
				this.identListe,
			).getListeElementsSelection();
			break;
	}
}
function voirCorrigeQCMEleve(aEleve) {
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
function ouvrirCopieEleve(aArticle) {
	ouvrirDocument(aArticle.copieEleve, TypeFichierExterneHttpSco.TAFRenduEleve);
	if (
		this.options.avecVerrouillageSurAccesDocuments &&
		!aArticle.estVerrouille
	) {
		verrouillerCopieEleve.call(this, aArticle);
	}
}
function ouvrirCopieCorrigee(aArticle) {
	ouvrirDocument(
		aArticle.copieCorrigee,
		TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
	);
}
function ouvrirDocument(aDocument, aGenreRessource) {
	const lLienDocument = GChaine.creerUrlBruteLienExterne(aDocument, {
		genreRessource: aGenreRessource,
	});
	window.open(lLienDocument);
}
function _afficherMessageConfirmation(aMsgConfirmation, aCallbackSuppression) {
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: aMsgConfirmation,
		callback: function (aGenreBouton) {
			if (aGenreBouton === EGenreAction.Valider) {
				aCallbackSuppression();
			}
		},
	});
}
function supprimerDocument(aArticle, aDocument, aMsgConfirmation, aTypeSaisie) {
	const lThis = this;
	_afficherMessageConfirmation(aMsgConfirmation, () => {
		aDocument.setEtat(EGenreEtat.Suppression);
		aArticle.setEtat(EGenreEtat.Modification);
		_lancerRequeteSaisieTAFARendre.call(lThis, aTypeSaisie, false, true);
	});
}
function deposerCopieEleve(aArticle) {
	const lThis = this;
	if (!aArticle.copieEleve || !aArticle.copieEleve.existe()) {
		_afficherMessageConfirmation(
			GTraductions.getValeur(
				"FenetreListeTAFFaits.ConfirmationDepotCopieEleve",
			),
			() => {
				afficherFenetreAjoutFichier.call(
					lThis,
					aArticle,
					ajouterFichiersCopieEleve,
				);
			},
		);
	} else {
		afficherFenetreAjoutFichier.call(
			lThis,
			aArticle,
			ajouterFichiersCopieEleve,
		);
	}
}
function deposerCopieCorrigee(aArticle) {
	afficherFenetreAjoutFichier.call(
		this,
		aArticle,
		ajouterFichiersCopieCorrigee,
	);
}
function afficherFenetreAjoutFichier(aArticle, aCallbackValidation) {
	const lGenreRenduTaf = this.getGenreRenduTAF();
	if (TypeGenreRenduTAFUtil.estUnRenduMedia(lGenreRenduTaf)) {
		ouvrirFenetreCreation.call(this, aArticle, aCallbackValidation);
	} else {
		afficherFenetreFichier.call(this, aArticle, aCallbackValidation);
	}
}
function ouvrirFenetreCreation(aTaf, aCallbackValidation) {
	const lThis = this;
	const lTabActions = [];
	lTabActions.push({
		libelle: GTraductions.getValeur("EnregistrementAudio.record"),
		icon: "icon_microphone",
		event() {
			afficherFenetreAudio.call(lThis, aTaf, aCallbackValidation);
		},
		class: "bg-util-marron-claire",
	});
	lTabActions.push({
		libelle: GTraductions.getValeur("EnregistrementAudio.deposerExistant"),
		icon: "icon_folder_open",
		selecFile: true,
		optionsSelecFile: _getOptionsSelecFile(false),
		event(aParamsInput) {
			if (!!aParamsInput && !!aParamsInput.eltFichier) {
				UtilitaireAudio.estFichierAudioValide(aParamsInput.eltFichier).then(
					(aResult) => {
						if (aResult) {
							_evenementInputFile.call(
								lThis,
								aParamsInput,
								aTaf,
								aCallbackValidation,
							);
						} else {
							UtilitaireAudio.messageErreurFormat(aParamsInput.eltFichier);
						}
					},
				);
			}
		},
		class: "bg-util-marron-claire",
	});
	ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, { pere: this });
}
function _getOptionsSelecFile() {
	return {
		maxSize: GApplication.droits.get(TypeDroits.tailleMaxRenduTafEleve),
		accept: UtilitaireAudio.getTypeMimeAudio(),
		avecTransformationFlux: false,
	};
}
function _evenementInputFile(aParamUpload, aArticle, aCallbackValidation) {
	if (aParamUpload.eltFichier.getEtat() === EGenreEtat.Creation) {
		const lListeFichier = new ObjetListeElements();
		lListeFichier.addElement(aParamUpload.eltFichier);
		aParamUpload.eltFichier.TAF = new ObjetElement("", aArticle.getNumero());
		aCallbackValidation.call(this, aArticle, lListeFichier);
	}
}
function afficherFenetreAudio(aArticle, aCallbackValidation) {
	let lContexte = "";
	const lThis = this;
	const lFenetreAudio = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EnregistrementAudio,
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
		maxLengthAudio: TypeGenreRenduTAFUtil.getDureeMaxEnregistrementAudio(),
	});
	lFenetreAudio.setDonnees(EGenreRessource.DocumentJoint);
	lFenetreAudio.afficher();
}
function afficherFenetreFichier(aArticle, aCallbackValidation) {
	const lThis = this;
	const lObjetFenetreAjoutMultiple = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_UploadFichiers,
		{
			pere: lThis,
			evenement: function (aGenreBouton, aListeFichiers) {
				if (aGenreBouton === EGenreAction.Valider) {
					aCallbackValidation.call(lThis, aArticle, aListeFichiers);
				}
				lObjetFenetreAjoutMultiple.fermer();
			},
		},
	);
	lObjetFenetreAjoutMultiple.setDonnees(EGenreRessource.DocumentJoint, {
		tailleMaxUploadFichier: GApplication.droits.get(
			TypeDroits.tailleMaxRenduTafEleve,
		),
		functionGetNomPdfGenere: function () {
			return (
				aArticle.getLibelle() +
				"_" +
				GDate.formatDate(
					GDate.getDateHeureCourante(),
					"%JJ%MM%AAAA_%hh%mm%ss",
				) +
				".pdf"
			);
		},
	});
	lObjetFenetreAjoutMultiple.afficher();
}
function ajouterFichiersCopieEleve(aArticle, aListeFichiers) {
	if (
		!!aArticle &&
		!!aListeFichiers &&
		aListeFichiers.getNbrElementsExistes() > 0
	) {
		aArticle.copieEleve = aListeFichiers.getPremierElement();
		aArticle.setEtat(EGenreEtat.Modification);
		_lancerRequeteSaisieTAFARendre.call(
			this,
			TypeSaisieTAFARendre.CopieEleve,
			false,
			true,
		);
	}
}
function ajouterFichiersCopieCorrigee(aArticle, aListeFichiers) {
	if (
		!!aArticle &&
		!!aListeFichiers &&
		aListeFichiers.getNbrElementsExistes() > 0
	) {
		aArticle.copieCorrigee = aListeFichiers.getPremierElement();
		aArticle.setEtat(EGenreEtat.Modification);
		_lancerRequeteSaisieTAFARendre.call(
			this,
			TypeSaisieTAFARendre.CopieCorrigee,
			false,
			true,
		);
	}
}
function _afficherChoixDateDepotRenduEleve(aEleve, aCallback) {
	const lThis = this;
	let lDateProlongation =
		(aEleve && aEleve.dateReportRendu) || GDate.getDateCourante();
	let lListeEleves = new ObjetListeElements();
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
	const lListeCompletEleves = MethodesObjet.dupliquer(
		lListePossiblePourProlongation,
	);
	const lMessage = [];
	const lIDLabel = GUID.getId();
	lMessage.push(`<div class="flex-contain flex-center justify-center">`);
	lMessage.push(
		`<div class="fix-bloc" id="${lIDLabel}">${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.Message")}</div>`,
	);
	lMessage.push(
		'<div class="MargeGauche InlineBlock AlignementMilieuVertical" ie-identite="identiteSelecteurDate"></div>',
	);
	lMessage.push(`</div>`);
	lMessage.push(
		`<div class="m-all-xl flex-contain flex-center justify-center">`,
	);
	lMessage.push(
		`<div class="fix-bloc flex-contain cols" role="group" aria-label="${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.ChoixEleves")}">`,
		`<ie-radio class="m-bottom-l" ie-model="radioChoixElevesNonRendus(true)">${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.SansRendus")}</ie-radio>`,
		`<div class="flex-contain"><ie-radio class="fix-bloc" ie-model="radioChoixElevesNonRendus(false)" aria-label="${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.PourLesElevesInfo")}">${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.PourLesEleves")}</ie-radio><ie-btnselecteur class="m-left" ie-model="selecteurEleves" style="width:22rem;" role="combobox" placeHolder="${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.AucunEleveSelectionne")}" aria-label="${GTraductions.getValeur("FenetreListeTAFFaits.FenetreProlongationRendu.selectionnerEleves")}"></ie-btnselecteur></div>`,
		`</div>`,
	);
	lMessage.push(`</div>`);
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		titre: GTraductions.getValeur(
			"FenetreListeTAFFaits.FenetreProlongationRendu.Titre",
		),
		message: lMessage.join(""),
		width: 420,
		getDisabledBouton: (aBouton) => {
			if (aBouton.genreAction === EGenreAction.Valider) {
				return !lChoixElevesNonRendus && lListeEleves.count() === 0;
			}
		},
		callback: function (aGenreBouton) {
			if (aGenreBouton === 0) {
				aCallback(lDateProlongation, lChoixElevesNonRendus, lListeEleves);
			}
		},
		controleur: {
			identiteSelecteurDate: function () {
				return {
					class: ObjetCelluleDate,
					pere: lThis,
					start: function (aInstance) {
						const lPremiereDateSaisissable = GDate.getDateCourante();
						aInstance.setParametresFenetre(
							GParametres.PremierLundi,
							lPremiereDateSaisissable,
							GParametres.DerniereDate,
						);
						aInstance.setOptionsFenetre({
							prioriteBlocageAbonnement:
								GestionnaireModale.TypePrioriteBlocageInterface.message,
						});
						aInstance.setPremiereDateSaisissable(
							lPremiereDateSaisissable,
							true,
						);
						aInstance.setDonnees(lDateProlongation);
					},
					evenement: function (aDate) {
						lDateProlongation = aDate;
					},
					init: function (aInstanceCelluleDate) {
						aInstanceCelluleDate.setOptionsObjetCelluleDate({
							labelledById: lIDLabel,
						});
					},
				};
			},
			radioChoixElevesNonRendus: {
				getValue: function (aEstChoixElevesNonRendus) {
					return aEstChoixElevesNonRendus === true
						? lChoixElevesNonRendus
						: !lChoixElevesNonRendus;
				},
				setValue: function (aEstChoixElevesNonRendus) {
					lChoixElevesNonRendus = aEstChoixElevesNonRendus;
				},
			},
			selecteurEleves: {
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
							genreRessource: EGenreRessource.Eleve,
							titre: GTraductions.getValeur("Eleves"),
							estGenreRessourceDUtilisateurConnecte: false,
							listeRessources: lListeCompletEleves,
							listeRessourcesSelectionnees: lListeEleves,
						};
						const lFenetre = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionRessource,
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
										titre: GTraductions.getValeur("Eleves"),
										hauteurMin: 450,
										prioriteBlocageAbonnement:
											GestionnaireModale.TypePrioriteBlocageInterface.message,
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
			},
		},
	});
}
function prolongerDepotRenduEleve(aArticle) {
	const lThis = this;
	_afficherChoixDateDepotRenduEleve.call(
		this,
		aArticle,
		(aDateSelectionnee, aChoixElevesNonRendus, aListeEleves) => {
			this.donnees.listeEleves.parcourir((aEleve) => {
				if (aChoixElevesNonRendus) {
					if (aEleve.estProlongationRenduPossible && !aEleve.copieEleve) {
						aEleve.dateReportRendu = aDateSelectionnee;
						aEleve.setEtat(EGenreEtat.Modification);
					}
				} else {
					if (
						aListeEleves.getTableauNumeros().includes(aEleve.getNumero()) &&
						aEleve.estProlongationRenduPossible
					) {
						aEleve.dateReportRendu = aDateSelectionnee;
						aEleve.setEtat(EGenreEtat.Modification);
					}
				}
			});
			_lancerRequeteSaisieTAFARendre.call(
				lThis,
				TypeSaisieTAFARendre.DateReportRendu,
				false,
				true,
			);
		},
	);
}
function annulerProlongationRenduEleve(aArticle) {
	const lThis = this;
	const lListeEleves =
		lThis.donnees.selection || new ObjetListeElements().add(aArticle);
	let lAvecSaisie = false;
	this.donnees.listeEleves.parcourir((aEleve) => {
		if (
			lListeEleves.getTableauNumeros().includes(aEleve.getNumero()) &&
			aEleve.annulerProlongation
		) {
			aEleve.dateReportRendu = undefined;
			aEleve.annulationProlongation = true;
			aEleve.setEtat(EGenreEtat.Modification);
			lAvecSaisie = true;
		}
	});
	if (lAvecSaisie) {
		_lancerRequeteSaisieTAFARendre.call(
			lThis,
			TypeSaisieTAFARendre.annulerProlongation,
			false,
			true,
		);
	}
}
function verrouillerCopieEleve(aArticle) {
	_verrouillerDeverouillerCopieEleve.call(this, aArticle, true);
}
function deverrouillerCopieEleve(aArticle) {
	const lArrayMessage = [];
	lArrayMessage.push(
		GTraductions.getValeur(
			"FenetreListeTAFFaits.EditionVerrou.ExplicationDeverrouillage",
		),
	);
	if (!!aArticle.commentaireCorrige) {
		lArrayMessage.push(
			"<br>",
			GTraductions.getValeur(
				"FenetreListeTAFFaits.EditionVerrou.SuppressionCommentaireCorrige",
			),
		);
	}
	lArrayMessage.push(
		"<br>",
		GTraductions.getValeur(
			"FenetreListeTAFFaits.EditionVerrou.ConfirmationDeverrouillage",
		),
	);
	const lThis = this;
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: lArrayMessage.join(""),
		callback: function (aGenreBouton) {
			if (aGenreBouton === EGenreAction.Valider) {
				_verrouillerDeverouillerCopieEleve.call(lThis, aArticle, false);
			}
		},
	});
}
function _verrouillerDeverouillerCopieEleve(aArticle, aVerrou) {
	aArticle.estVerrouille = aVerrou;
	aArticle.setEtat(EGenreEtat.Modification);
	_lancerRequeteSaisieTAFARendre.call(
		this,
		TypeSaisieTAFARendre.Verrou,
		false,
		true,
	);
}
function lancerRecuperationListeTravauxRendus(aTAF, aExecutionQCM) {
	new ObjetRequeteListeTravauxRendus(
		this,
		this._reponseRequeteTAFARendre,
	).lancerRequete({ taf: aTAF, executionQCM: aExecutionQCM });
}
function _existeAuMoinsUnDevoirRendu(aListeEleves) {
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
function _lancerRequeteSaisieTAFARendre(
	aTypeSaisie,
	aAvecActualisationListeSeule,
	aAvecRecuperationDonnees,
) {
	const lListeCopiesEleveEtCorrigee = new ObjetListeElements();
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
	new ObjetRequeteSaisieTAFARendre(
		this,
		_surReponseRequeteSaisieTAFARendre.bind(this, lParamsActualisation),
	)
		.addUpload({ listeFichiers: lListeCopiesEleveEtCorrigee })
		.lancerRequete(aTypeSaisie, {
			listeEleves: this.donnees.listeEleves,
			TAF: this.donnees.TAF,
		});
}
function _surReponseRequeteSaisieTAFARendre(aParametresActualisation) {
	if (
		!!aParametresActualisation &&
		aParametresActualisation.avecRecuperationDonnees
	) {
		lancerRecuperationListeTravauxRendus.call(
			this,
			this.donnees.TAF,
			this.donnees.executionQCM,
		);
	} else {
		if (!!this.donnees.listeEleves) {
			this.donnees.listeEleves.parcourir((aEleve) => {
				aEleve.setEtat(EGenreEtat.Aucun);
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
function _surReponseRequeteGenerationTAFARendre(aParam) {
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
						aEleve.setEtat(EGenreEtat.Modification);
						lAvecChangements = true;
					}
				});
				if (lAvecChangements) {
					_lancerRequeteSaisieTAFARendre.call(
						this,
						TypeSaisieTAFARendre.Verrou,
						true,
					);
				}
			}
		}
	}
}
function deposerCopiesCorrigeesMultiples(aParametresRequetesDepot) {
	new ObjetRequeteSaisieDeposerCorrigesEleves(
		this,
		surDepotCorrigesMultiple.bind(this, aParametresRequetesDepot),
	)
		.addUpload({ listeFichiers: aParametresRequetesDepot.listeFichiers })
		.lancerRequete(aParametresRequetesDepot);
}
function surDepotCorrigesMultiple(
	aParametresRequetesDepot,
	aJSONRapportNet,
	aJSONRapportServeur,
) {
	const lThis = this;
	if (!!aJSONRapportNet && !!aJSONRapportNet.messageInformation) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			titre: GTraductions.getValeur("FenetreListeTAFFaits.AucunCorrigeImporte"),
			message: aJSONRapportNet.messageInformation,
		});
	} else if (!!aJSONRapportNet && !!aJSONRapportNet.messageConfirmation) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: aJSONRapportNet.messageConfirmation,
			callback: function (aGenreAction) {
				if (aGenreAction === EGenreAction.Valider) {
					aParametresRequetesDepot.confirmation = true;
					aParametresRequetesDepot.listeFichiers =
						aJSONRapportNet.listeFichiersCompletee;
					deposerCopiesCorrigeesMultiples.call(lThis, aParametresRequetesDepot);
				}
			},
		});
	} else {
		(!!aJSONRapportServeur && !!aJSONRapportServeur.messageRapport
			? GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: aJSONRapportServeur.messageRapport,
				})
			: Promise.resolve()
		).then(() => {
			lancerRecuperationListeTravauxRendus.call(
				lThis,
				lThis.donnees.TAF,
				lThis.donnees.executionQCM,
			);
		});
	}
}
class DonneesListe_ListeTAFFaits extends ObjetDonneesListe {
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
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			nodePhoto: function (aNoArticle) {
				$(this.node).on("error", () => {
					const lElement =
						aDonneesListe.Donnees.getElementParNumero(aNoArticle);
					lElement.avecPhoto = false;
				});
			},
			chipsAudio: {
				event: function () {
					$(this.node)
						.toggleClass(UtilitaireAudio.IconeLecture)
						.toggleClass(UtilitaireAudio.IconeStop);
					const lElemAudio = $(this.node).find("audio")[0];
					if (UtilitaireAudio.estEnCoursDeLecture(lElemAudio)) {
						UtilitaireAudio.stopAudio(lElemAudio);
						aDonneesListe.audioEnLecture = null;
					} else {
						try {
							if (!!aDonneesListe.audioEnLecture) {
								if (
									UtilitaireAudio.estEnCoursDeLecture(
										aDonneesListe.audioEnLecture,
									)
								) {
									UtilitaireAudio.stopAudio(aDonneesListe.audioEnLecture);
								}
								aDonneesListe.audioEnLecture = null;
							}
							UtilitaireAudio.jouerAudio(lElemAudio);
							aDonneesListe.audioEnLecture = lElemAudio;
						} catch (error) {
							aDonneesListe.audioEnLecture = null;
							if (error === UtilitaireAudio.ExceptionFichierNonValide) {
								$(this.node)
									.addClass(UtilitaireAudio.IconeLecture)
									.removeClass(UtilitaireAudio.IconeStop);
							}
						}
					}
				},
				node: function () {
					const $chips = $(this.node);
					const $audio = $chips.find("audio");
					$audio.on("play", () => {
						$chips
							.removeClass(UtilitaireAudio.IconeLecture)
							.addClass(UtilitaireAudio.IconeStop);
					});
					$audio.on("pause", () => {
						$chips
							.removeClass(UtilitaireAudio.IconeStop)
							.addClass(UtilitaireAudio.IconeLecture);
					});
				},
			},
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
			return ObjetDonneesListe.ETypeCellule.ZoneTexte;
		} else {
			return ObjetDonneesListe.ETypeCellule.Html;
		}
	}
	getTailleTexteMax() {
		return 300;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.eleve:
				return _composeCelluleEleve.call(this, aParams.article);
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				if (!!aParams.article.estRendu) {
					return '<i class="taf as-icon icon_check_fin"></i>';
				} else if (!!aParams.article.enCours) {
					return '<i class="taf as-icon icon_edt_permanence"></i>';
				} else {
					return "";
				}
			case DonneesListe_ListeTAFFaits.colonnes.copieEleve: {
				const lStrCopieEleve = [];
				if (existeUneCopieEleve(aParams.article)) {
					if (TypeGenreRenduTAFUtil.estUnRenduMedia(this.genreRenduTAF)) {
						const lUrl = GChaine.creerUrlBruteLienExterne(
							aParams.article.copieEleve,
						);
						lStrCopieEleve.push(
							UtilitaireAudio.construitChipsAudio({
								url: lUrl,
								ieModel: "chipsAudio",
								argsIEModel: [aParams.article.getNumero()],
								idAudio: aParams.article.getNumero(),
								classes: ["no-underline"],
							}),
						);
					} else {
						lStrCopieEleve.push(
							'<i class="taf as-icon icon_piece_jointe"></i>',
						);
					}
				}
				return lStrCopieEleve.join("");
			}
			case DonneesListe_ListeTAFFaits.colonnes.pourLe: {
				return (
					aParams.article.strPourLe ||
					GDate.formatDate(aParams.article.datePourLe, "%JJ/%MM")
				);
			}
			case DonneesListe_ListeTAFFaits.colonnes.verrou: {
				const lStrVerrou = [];
				if (!!aParams.article.dateReportRendu) {
					const lStrDateReport = GDate.formatDate(
						aParams.article.dateReportRendu,
						"%JJ/%MM",
					);
					lStrVerrou.push("<span>", lStrDateReport, "</span>");
				} else if (!!aParams.article.estVerrouille) {
					lStrVerrou.push('<span class="InlineBlock Image_Verrou"></span>');
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
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeTAFFaits.colonnes.fait:
				if (!!aParams.article.enCours) {
					return GTraductions.getValeur(
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
					!TypeGenreRenduTAFUtil.estUnRenduMedia(this.genreRenduTAF)
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
				aParams.article.setEtat(EGenreEtat.Modification);
				break;
		}
	}
	avecMenuContextuel() {
		return (
			!(
				TypeGenreRenduTAFUtil.estSansRendu(this.genreRenduTAF) ||
				TypeGenreRenduTAFUtil.estUnRenduPapier(this.genreRenduTAF)
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
					GTraductions.getValeur("SaisieQCM.VoirCorrige"),
					!!aParametres.article.estRendu && !aParametres.article.enCours,
					((aEleve) => {
						lCallbacks.surVoirCorrige(aEleve);
					}).bind(this.instance, aParametres.article),
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
			const lEstRenduEnligne = TypeGenreRenduTAFUtil.estUnRenduEnligne(
				this.genreRenduTAF,
				false,
			);
			aParametres.menuContextuel.addTitre(
				GTraductions.getValeur(
					"FenetreListeTAFFaits.menuContextuel.CopieEleve.Titre",
				),
			);
			aParametres.menuContextuel.add(
				GTraductions.getValeur(
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
					? GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CopieEleve.Remplacer",
						)
					: GTraductions.getValeur(
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
				GTraductions.getValeur(
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
						const lStrVerrouiller = GTraductions.getValeur(
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
							const lStrDeverrouiller = GTraductions.getValeur(
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
						GTraductions.getValeur(
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
						GTraductions.getValeur(
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
					GTraductions.getValeur(
						"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Titre",
					),
				);
				aParametres.menuContextuel.add(
					GTraductions.getValeur(
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
					? GTraductions.getValeur(
							"FenetreListeTAFFaits.menuContextuel.CorrigeEleve.Remplacer",
						)
					: GTraductions.getValeur(
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
					GTraductions.getValeur(
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
DonneesListe_ListeTAFFaits.colonnes = {
	eleve: "DLTAFFAITS_eleve",
	fait: "DLTAFFAITS_fait",
	copieEleve: "DLTAFFAITS_copieEleve",
	pourLe: "DLTAFFAITS_pourLe",
	verrou: "DLTAFFAITS_verrou",
	copieCorrigee: "DLTAFFAITS_copieCorrigee",
	commentaire: "DLTAFFAITS_commentaire",
};
function existeUneCopieEleve(aArticle) {
	return !!aArticle.copieEleve && aArticle.copieEleve.existe();
}
function existeUneCopieCorrigee(aArticle) {
	return !!aArticle.copieCorrigee && aArticle.copieCorrigee.existe();
}
function _composePhoto(aEleve, aLargeurDiv) {
	const H = [];
	if (aEleve) {
		let lSrcPhoto;
		if (aEleve.avecPhoto !== false) {
			lSrcPhoto = GChaine.creerUrlBruteLienExterne(aEleve, {
				libelle: "photo.jpg",
			});
		}
		H.push(
			'<div class="InlineBlock AlignementHaut" style="height: 37px; width: ',
			aLargeurDiv,
			'px; ">',
			"<img ",
			lSrcPhoto ? `ie-load-src="${lSrcPhoto}"` : "",
			GHtml.composeAttr("ie-node", "nodePhoto", aEleve.getNumero()),
			' class="img-portrait" alt="',
			aEleve.getLibelle(),
			'" ie-imgviewer style="height: auto; width: auto; max-height: 100%; max-width: 100%;" aria-hidden="true" />',
			"</div>",
		);
	}
	return H.join("");
}
function _composeCelluleEleve(aEleve) {
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
				? GDate.formatDate(aEleve.dateRealisation, "%JJ/%MM/%AAAA")
				: "";
			if (this.estUnTAFQCM) {
				lTraductionDateFaitOuDepose = GTraductions.getValeur(
					"FenetreListeTAFFaits.ReponduLe",
					[lStrDateRealisation],
				);
			} else {
				if (TypeGenreRenduTAFUtil.estSansRendu(this.genreRenduTAF)) {
					lTraductionDateFaitOuDepose = GTraductions.getValeur(
						"FenetreListeTAFFaits.FaitLe",
						[lStrDateRealisation],
					);
				} else if (TypeGenreRenduTAFUtil.estUnRenduPapier(this.genreRenduTAF)) {
					lTraductionDateFaitOuDepose = GTraductions.getValeur(
						"FenetreListeTAFFaits.RenduLe",
						[lStrDateRealisation],
					);
				} else {
					lTraductionDateFaitOuDepose = GTraductions.getValeur(
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
module.exports = { ObjetFenetre_ListeTAFFaits, TypeBoutonFenetreTAFFaits };

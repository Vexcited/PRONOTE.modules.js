const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const {
	ObjetMoteurFormSaisieMobile,
} = require("ObjetMoteurFormSaisieMobile.js");
const { EGenreEvntForm } = require("ObjetMoteurFormSaisieMobile.js");
const { TypeGenreRenduTAFUtil } = require("TypeGenreRenduTAF.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GUID } = require("GUID.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { GDate } = require("ObjetDate.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreFenetreDocumentJoint } = require("EGenreFenetreDocumentJoint.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { tag } = require("tag.js");
class ObjetPanelEditionTAF extends ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.moteurCDT = new ObjetMoteurCDT();
		this.moteurFormSaisie = new ObjetMoteurFormSaisieMobile();
		this.ids = {
			panel: GUID.getId(),
			description: GUID.getId(),
			sitesWeb: GUID.getId(),
			pj: GUID.getId(),
			kiosque: GUID.getId(),
			listeSitesWeb: GUID.getId(),
			listePJ: GUID.getId(),
			listeKiosque: GUID.getId(),
		};
		this.dimensions = {
			hauteurDate: 60,
			hauteurDescription: 60,
			hauteurModeRendu: 60,
			hauteurDifficulte: 60,
			hauteurDuree: 60,
			hauteurTheme: 60,
		};
		_instancierSelectDatePourLe.call(this);
		_instancierSelectModeRendu.call(this);
		_instancierSelectDifficulte.call(this);
		_instancierMultiSelectTheme.call(this);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getStyleLabel: function () {
				return { color: GCouleur.themeNeutre.foncee };
			},
			description: {
				getValue: function () {
					return aInstance.data.descriptif;
				},
				setValue: function (aValue) {
					aInstance.data.descriptif = aValue;
					aInstance.data.setEtat(EGenreEtat.Modification);
				},
				getClasseLabel: function () {
					const lTaf = aInstance.data;
					return !!lTaf && !!lTaf.descriptif && lTaf.descriptif.length > 0
						? "active"
						: "";
				},
				node: function () {
					$(this.node).on("focus", function () {
						$(this).select();
						return false;
					});
				},
				getDisabled: function () {
					return false;
				},
				getStyleValeur: function () {
					return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
				},
				getStyleLabel: function () {
					const lTaf = aInstance.data;
					const lStyle = {
						fontWeight: 400,
						color: GCouleur.themeNeutre.foncee,
					};
					const lSurcharge =
						!!lTaf && !!lTaf.descriptif && lTaf.descriptif.length > 0
							? {}
							: { fontSize: 14 };
					return $.extend({}, lStyle, lSurcharge);
				},
			},
			inputTime: {
				getValue() {
					const lDataDuree = _getDureeTAF.call(aInstance);
					const lDuree = lDataDuree * 60 * 1000;
					const lHMS = GDate.dureeEnMillisecondesToHMS(lDuree);
					let lNbHeures = lHMS.heures;
					let lNbMin = lHMS.minutes;
					if (lNbHeures > 23) {
						lNbHeures = 23;
						lNbMin = 59;
					}
					const lDateDuree = new Date(0);
					lDateDuree.setHours(lNbHeures, lNbMin, 0, 0);
					return GDate.formatDate(lDateDuree, "%hh:%mm");
				},
				setValue(aValue, aParamsSetter) {
					const lDureeEnMs = GDate.hmsToDureeEnMillisecondes({
						heures: aParamsSetter.time.heure,
						minutes: aParamsSetter.time.minute,
						secondes: 0,
					});
					let lDureeEnMin = 0;
					if (lDureeEnMs > 0) {
						const lDureeEnSec = parseInt(lDureeEnMs / 1000, 10);
						if (lDureeEnSec > 0) {
							lDureeEnMin = parseInt(lDureeEnSec / 60, 10);
						}
					}
					if (lDureeEnMin !== aInstance.data.duree) {
						aInstance.data.duree = lDureeEnMin;
						aInstance.data.setEtat(EGenreEtat.Modification);
					}
				},
			},
			date: {
				getClasseLabel: function () {
					return "active";
				},
			},
			nodePoubelle: {
				event: function () {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: GTraductions.getValeur(
							"CahierDeTexte.msgConfirmationSupprimerTAF",
						),
						callback: function (aGenreBouton) {
							if (aGenreBouton === EGenreAction.Valider) {
								this.data.setEtat(EGenreEtat.Suppression);
								this.callback.appel({
									commande: EGenreEvntForm.supprimer,
									data: this.data,
								});
							}
						}.bind(this),
					});
				}.bind(aInstance),
				getDisabled: function () {
					return false;
				},
			},
			btnSelectPublic: {
				event: _evntSurEditPublic.bind(aInstance),
				getLibelle: function () {
					const H = [];
					const lListeTousEleves = this.moteurCDT.getListeTousEleves({
						listeClassesEleves: this.listeClassesEleves,
					});
					let lStrChips = this.moteurCDT.strPublicTAF(this.data, {
						listeTousEleves: lListeTousEleves,
						avecLibellesCourt: true,
					});
					H.push(
						tag(
							"ie-chips",
							{ class: ["avec-event", "m-right"], title: "" },
							lStrChips,
						),
					);
					return H.join("");
				}.bind(aInstance),
			},
			getNodeGestionPJ: function () {
				$(this.node).on("click", () => {
					_evntSurEditPJ.call(aInstance);
				});
			},
			getNodeGestionSiteWeb: function () {
				$(this.node).on("click", () => {
					_evntSurEditSiteWeb.call(aInstance);
				});
			},
			getNodeGestionKiosque: function () {},
			btnSupprChips: {
				eventBtn: function (aGenreRessource, aNumeroRessource) {
					_evntSurRemoveRessource.call(
						aInstance,
						aGenreRessource,
						aNumeroRessource,
					);
				},
			},
		});
	}
	setOptions(aParam) {
		this._options = {
			avecSaisiePJ: false,
			avecSaisieSitesWeb: false,
			avecCloud: false,
			avecKiosque: false,
		};
		$.extend(this._options, aParam);
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.donneeOriginale = this.donnees.taf;
		this.donneeOriginale.matiere = this.donnees.matiere;
		this.data = MethodesObjet.dupliquer(this.donneeOriginale);
		this.data.descriptif = GChaine.supprimerBalisesHtml(this.data.descriptif);
		this.listeClassesEleves = this.donnees.listeClassesEleves;
		this.listePeriodes = this.donnees.listePeriodes;
		this.listeDocumentsJoints = this.donnees.listeDocumentsJoints;
		this.dateCoursDeb = this.donnees.dateCoursDeb;
		this.CDTPublie = this.donnees.CDTPublie;
	}
	getHtmlPanel() {
		const lHtml = [];
		lHtml.push(
			'<div class="FormSaisie ofm-design" id="',
			this.ids.panel,
			'">',
			_composeHtmlEdition.call(this),
			"</div>",
		);
		return lHtml.join("");
	}
	updateContent() {
		_updateDatePourLe.call(this);
		_updateSelectModeRendu.call(this);
		_updateSelectDifficulte.call(this);
		_updateMultiSelectTheme.call(this);
	}
	getOptionsFenetre() {
		const lTitre = `<span class="iconic icon_taf">${this.donnees.estCreation ? GTraductions.getValeur("CahierDeTexte.CreerTAF") : GTraductions.getValeur("CahierDeTexte.ModifierTAF")}</span>`;
		const lHtmlFooter = !this.donnees.estCreation
			? `<ie-btnicon class="icon_trash avecFond i-medium" ie-model="nodePoubelle" aria-label=${GTraductions.getValeur("Supprimer")}></ie-btnicon>`
			: "";
		return {
			titre: lTitre,
			htmlFooter: lHtmlFooter,
			avecComposeBasInFooter: true,
			callback: (aNumeroBouton, aParams) => {
				if (aParams.bouton && aParams.bouton.valider) {
					this.data.descriptif = this.moteurCDT.textAreaToDescription(
						this.data.descriptif.trim(),
					);
					if (this.moteurCDT.estTAFVide(this.data)) {
						this.callback.appel({
							commande: EGenreEvntForm.annuler,
							data: this.donneeOriginale,
							estCreation: this.donnees.estCreation,
						});
					} else {
						this.data.estVide = false;
					}
					this.data.setEtat(
						this.donnees.estCreation
							? EGenreEtat.Creation
							: EGenreEtat.Modification,
					);
					this.callback.appel({
						commande: EGenreEvntForm.valider,
						data: this.data,
						estCreation: this.donnees.estCreation,
					});
				} else {
					_annulerEdition.call(this);
				}
			},
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				{
					valider: true,
					libelle: GTraductions.getValeur("Valider"),
					getDisabled: () => {
						return this.data.descriptif.trim() === "";
					},
				},
			],
		};
	}
}
function _composeHtmlEdition() {
	const H = [];
	const lModeCreation = this.donnees.estCreation;
	H.push(
		_composeCorps.call(this, {
			modeCreation: lModeCreation,
			devoir: this.devoir,
		}),
	);
	return H.join("");
}
function _composeCorps(aParam) {
	const H = [];
	const lParam = { estCtxEdition: aParam.modeCreation === false };
	H.push(`<div class="Fenetre_Contenu">`);
	H.push(_composeDescription.call(this, lParam));
	H.push(_composePourLe.call(this, lParam));
	H.push(_composePiecesJointes.call(this, lParam));
	H.push(_composeSitesWeb.call(this, lParam));
	H.push(_composeRessKiosque.call(this, lParam));
	H.push(_composeModeRendu.call(this, lParam));
	if (GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
		H.push(_composeTheme.call(this, lParam));
	}
	H.push(_composeDifficulte.call(this, lParam));
	H.push(_composeDuree.call(this, lParam));
	H.push(_composePublic.call(this, lParam));
	H.push(`</div>`);
	return H.join("");
}
function _composeDescription() {
	if (this.data.executionQCM) {
		return this.moteurFormSaisie.composeFormTexteSimple({
			id: "",
			label: GTraductions.getValeur("CahierDeTexte.DescriptionTAF"),
			styleLabel: "description.getStyleLabel",
			hauteur: this.dimensions.hauteurDescription,
			texteSimple: this.moteurCDT.composeHtmlLigneQCM({
				libelle: this.moteurCDT.getHtmlTAFExecutionQCM({
					execQCM: this.data.executionQCM,
					descriptif: this.data.descriptif,
					CDTPublie: this.CDTPublie,
				}),
			}),
		});
	} else {
		return this.moteurFormSaisie.composeFormTextArea({
			id: this.ids.description,
			model: "description",
			styleArea: "description.getStyleValeur",
			label: GTraductions.getValeur("CahierDeTexte.DescriptionTAF"),
			classLabel: "description.getClasseLabel",
			styleLabel: "description.getStyleLabel",
			hauteur: this.dimensions.hauteurDescription,
			estObligatoire: true,
		});
	}
}
function _composePourLe() {
	return this.moteurFormSaisie.composeDate({
		id: this.instanceSelectDatePourLe.getNom(),
		label: GTraductions.getValeur("CahierDeTexte.PourLe"),
		classLabel: "date.getClasseLabel",
		styleLabel: "getStyleLabel",
		icon: this.moteurCDT.iconPourLeDonneLeTAF(this.data),
		hauteur: this.dimensions.hauteurDate,
	});
}
function _instancierSelectDatePourLe() {
	this.instanceSelectDatePourLe = this.moteurFormSaisie.instancierCalendrier(
		_evntSelectDatePourLe.bind(this),
		this,
		{
			avecBoutonsPrecedentSuivant: false,
			joursSemaineValide: GParametres.JoursOuvres,
			joursFeries: GParametres.JoursFeries,
		},
	);
}
function _evntSelectDatePourLe(aDate) {
	this.data.PourLe = aDate;
	this.data.setEtat(EGenreEtat.Modification);
}
function _updateDatePourLe() {
	this.instanceSelectDatePourLe.setOptionsObjetCelluleDate({
		premiereDate: this.dateCoursDeb,
	});
	this.instanceSelectDatePourLe.initialiser();
	this.instanceSelectDatePourLe.setDonnees(this.data.PourLe, true);
}
function _composePublic() {
	return this.moteurFormSaisie.composeBtnSelect({
		label: GTraductions.getValeur("CahierDeTexte.TAF.Eleves"),
		strControle: "btnSelectPublic",
	});
}
function _evntSurEditPublic() {
	const lListeTousEleves = this.moteurCDT.getListeTousEleves({
		listeClassesEleves: this.listeClassesEleves,
	});
	this.moteurFormSaisie.openModaleSelectPublic({
		instance: this,
		listeRessources: lListeTousEleves,
		listeRessourcesSelectionnees: this.moteurCDT.getListeSelectionEleves({
			listeEleves: this.data.listeEleves,
			listeTousEleves: lListeTousEleves,
		}),
		genreRessource: EGenreRessource.Eleve,
		titre: EGenreRessourceUtil.getTitreFenetreSelectionRessource(
			EGenreRessource.Eleve,
		),
		evntClbck: function (aParam) {
			if (aParam.validerSelection) {
				this.moteurCDT.majDataTAFSurModifPublic({
					data: this.data,
					listeTousEleves: lListeTousEleves,
					listeRessourcesSelectionnees: aParam.listeRessourcesSelectionnees,
				});
			}
		}.bind(this),
	});
}
function _composeTheme() {
	return this.moteurFormSaisie.composeMultiSelecteurTheme({
		id: this.instanceMultiSelectTheme.getNom(),
		label: GTraductions.getValeur("Themes"),
		styleLabel: "getStyleLabel",
		hauteur: this.dimensions.hauteurTheme,
	});
}
function _instancierMultiSelectTheme() {
	this.instanceMultiSelectTheme =
		this.moteurFormSaisie.instancierMultiSelecteurTheme(
			_evtCellMultiSelectionTheme.bind(this),
			this,
		);
}
function _evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
	if (aGenreBouton === 1) {
		this.data.ListeThemes = aListeSelections;
		this.data.setEtat(EGenreEtat.Modification);
	}
}
function _updateMultiSelectTheme() {
	this.instanceMultiSelectTheme.initialiser();
	this.moteurFormSaisie.updateMultiSelectTheme({
		instanceSelect: this.instanceMultiSelectTheme,
		liste: this.data.ListeThemes || new ObjetListeElements(),
		matiere: this.data.matiere,
		libelleCB: this.data.libelleCBTheme,
	});
}
function _composeModeRendu() {
	if (this.data.executionQCM) {
		return this.moteurFormSaisie.composeFormTexteSimple({
			id: "",
			label: GTraductions.getValeur("CahierDeTexte.ModeRendu"),
			styleLabel: "getStyleLabel",
			hauteur: this.dimensions.hauteurModeRendu,
			texteSimple: GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.ACompleterEditeur",
			),
		});
	} else {
		return this.moteurFormSaisie.composeSelecteur({
			id: this.instanceSelectModeRendu.getNom(),
			label: GTraductions.getValeur("CahierDeTexte.ModeRendu"),
			icon: this.moteurCDT.iconModeRenduTAF(this.data),
			styleLabel: "getStyleLabel",
			hauteur: this.dimensions.hauteurModeRendu,
		});
	}
}
function _instancierSelectModeRendu() {
	this.instanceSelectModeRendu = this.moteurFormSaisie.instancierSelecteur(
		_evntSelectModeRendu.bind(this),
		this,
		{
			avecBoutonsPrecedentSuivant: false,
			icone: "icon_reorder",
			labelWAICellule: GTraductions.getValeur("CahierDeTexte.ModeRendu"),
			optionsCombo: {
				getContenuElement(aParams) {
					return aParams.element.getLibelle();
				},
			},
		},
	);
}
function _evntSelectModeRendu(aParam) {
	this.data.genreRendu = TypeGenreRenduTAFUtil.fromElement(aParam.element);
	this.data.setEtat(EGenreEtat.Modification);
}
function _updateSelectModeRendu() {
	this.moteurFormSaisie.updateSelecteur({
		liste: this.moteurCDT.getListeModeRendu(),
		donnee:
			this.data.genreRendu !== null && this.data.genreRendu !== undefined
				? TypeGenreRenduTAFUtil.toElement(this.data.genreRendu)
				: null,
		instanceSelect: this.instanceSelectModeRendu,
		comparerGenre: true,
	});
}
function _getDureeTAF() {
	return this.data.executionQCM
		? TUtilitaireDuree.dureeEnMin(this.data.executionQCM.dureeMaxQCM)
		: this.data.duree;
}
function _avecSelecteurDuree() {
	return !this.data.executionQCM || _getDureeTAF.call(this) > 0;
}
function _composeDuree() {
	if (_avecSelecteurDuree.call(this)) {
		const lId = GUID.getId();
		return `<div class="field-contain duree-conteneur">\n              <label for="${lId}" class="active ie-titre-petit">${GTraductions.getValeur("CahierDeTexte.DureeEstimee")}</label>\n              <input id="${lId}" type="time" class="round-style input-time" ie-model="inputTime" />\n            </div>`;
	}
}
function _composeDifficulte() {
	return this.moteurFormSaisie.composeSelecteur({
		id: this.instanceSelectDifficulte.getNom(),
		label: GTraductions.getValeur("CahierDeTexte.NiveauDifficulte"),
		hauteur: this.dimensions.hauteurDifficulte,
	});
}
function _instancierSelectDifficulte() {
	this.instanceSelectDifficulte = this.moteurFormSaisie.instancierSelecteur(
		_evntSelectDifficulte.bind(this),
		this,
		{
			avecBoutonsPrecedentSuivant: false,
			icone: "icon_reorder",
			labelWAICellule: GTraductions.getValeur("CahierDeTexte.NiveauDifficulte"),
		},
	);
}
function _evntSelectDifficulte(aParam) {
	this.data.niveauDifficulte = TypeNiveauDifficulteUtil.fromElement(
		aParam.element,
	);
	this.data.setEtat(EGenreEtat.Modification);
}
function _updateSelectDifficulte() {
	this.moteurFormSaisie.updateSelecteur({
		liste: this.moteurCDT.getListeDifficulte(),
		donnee: this.moteurCDT.estTAFAvecDifficulte(this.data)
			? TypeNiveauDifficulteUtil.toElement(this.data.niveauDifficulte, true)
			: null,
		instanceSelect: this.instanceSelectDifficulte,
		comparerGenre: true,
	});
}
function _getListeRessourcesPJ() {
	const lListeRessFichier = this.moteurCDT.getListeRessourcesDeGenre({
		data: this.data,
		genreRessource: EGenreDocumentJoint.Fichier,
		avecSaisie: this._options.avecSaisiePJ,
	});
	const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
		data: this.data,
		genreRessource: EGenreDocumentJoint.Cloud,
		avecSaisie: false,
	});
	return lListeRessFichier.add(lListeRessCloud);
}
function _composePiecesJointes() {
	if (this.data.executionQCM) {
		return "";
	} else {
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: GTraductions.getValeur("CahierDeTexte.DocsJoints"),
			icon: "icon_paper_clip",
			listeRessources: _getListeRessourcesPJ.call(this),
			id: this.ids.pj,
			nodeGestion: "getNodeGestionPJ",
			idListeRessources: this.ids.listePJ,
			avecSaisie: this._options.avecSaisiePJ,
		});
	}
}
function _evntSurEditPJ() {
	if (this._options.avecSaisiePJ) {
		const lAvecCloud = GEtatUtilisateur.avecCloudDisponibles();
		UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes({
			instance: this,
			callbackChoixParmiFichiersExistants: () => {
				surEvenementChoixFichierParmiDocDejaInseres.call(this);
			},
			maxSizeNouvellePJ: GApplication.droits.get(
				TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
			),
			avecUploadMultiple: true,
			callbackUploadNouvellePJ: (aParametresInput) => {
				if (
					aParametresInput &&
					aParametresInput.listeFichiers &&
					aParametresInput.listeFichiers.count() > 0
				) {
					const lListePJContexte = this.data.ListePieceJointe;
					aParametresInput.listeFichiers.parcourir((aFichier) => {
						const lDocumentJoint = new ObjetElement(
							aFichier.getLibelle(),
							aFichier.getNumero(),
							aFichier.getGenre(),
						);
						lDocumentJoint.url = aFichier.url;
						lDocumentJoint.Fichier = aFichier;
						lDocumentJoint.idFichier = aFichier.idFichier;
						lDocumentJoint.nomOriginal = aFichier.nomOriginal;
						lDocumentJoint.file = aFichier.file;
						lDocumentJoint.setEtat(EGenreEtat.Creation);
						lListePJContexte.addElement(lDocumentJoint);
						this.listeDocumentsJoints.addElement(lDocumentJoint);
					});
					this.data.setEtat(EGenreEtat.Modification);
					this.data.listeFichiersFenetrePJ = lListePJContexte;
					_updateHtmlListeRessources.call(this, EGenreDocumentJoint.Fichier);
				}
			},
			callbackChoixDepuisCloud: lAvecCloud
				? () => {
						UtilitaireGestionCloudEtPDF.ouvrirFenetreCloud().then(
							(aListeNouveauxDocs) => {
								this.data.ListePieceJointe.add(aListeNouveauxDocs);
								this.listeDocumentsJoints.add(aListeNouveauxDocs);
								this.data.setEtat(EGenreEtat.Modification);
								this.data.listeFichiersFenetrePJ = aListeNouveauxDocs;
								_updateHtmlListeRessources.call(
									this,
									EGenreDocumentJoint.Fichier,
								);
							},
						);
					}
				: null,
		});
	}
}
function surEvenementChoixFichierParmiDocDejaInseres() {
	this.moteurFormSaisie.openModaleSelectRessource({
		instance: this,
		titre: GTraductions.getValeur("selecteurPJ.nomDocument"),
		element: this.data,
		genre: EGenreDocumentJoint.Fichier,
		genreRessourceDocJoint: EGenreRessource.DocumentJoint,
		listePiecesJointes: this.listeDocumentsJoints,
		listePJContexte: this.data.ListePieceJointe,
		genreFenetrePJ: EGenreFenetreDocumentJoint.TravailAFaire,
		listePeriodes: this.listePeriodes,
		dateCoursDeb: this.dateCoursDeb,
		validation: function (aParamsFenetre, aListeFichiers, aAvecSaisie) {
			if (aAvecSaisie) {
				this.data.listeFichiersFenetrePJ = aListeFichiers;
				_updateHtmlListeRessources.call(this, EGenreDocumentJoint.Fichier);
			}
		}.bind(this),
	});
}
function _composeRessKiosque() {
	const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
		data: this.data,
		genreRessource: EGenreDocumentJoint.LienKiosque,
		avecSaisie: false,
	});
	if (lListeRessCloud.count() > 0) {
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: GTraductions.getValeur("CahierDeTexte.Kiosques"),
			icon: "icon_external_link",
			listeRessources: lListeRessCloud,
			styleLabel: "getStyleLabel",
			id: this.ids.kiosque,
			iconGestion: "icon_upload_alt",
			nodeGestion: "getNodeGestionKiosque",
			libelleGestion: GTraductions.getValeur("Ajouter"),
			strAucun: "",
			idListeRessources: this.ids.listeKiosque,
			avecSaisie: false,
		});
	}
}
function _composeSitesWeb() {
	if (this.data.executionQCM) {
		return "";
	} else {
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: GTraductions.getValeur("CahierDeTexte.SitesWeb"),
			icon: "icon_link",
			listeRessources: this.moteurCDT.getListeRessourcesDeGenre({
				data: this.data,
				genreRessource: EGenreDocumentJoint.Url,
				avecSaisie: this._options.avecSaisieSitesWeb,
			}),
			id: this.ids.sitesWeb,
			nodeGestion: "getNodeGestionSiteWeb",
			idListeRessources: this.ids.listeSitesWeb,
			avecSaisie: this._options.avecSaisieSitesWeb,
		});
	}
}
function _evntSurEditSiteWeb() {
	if (this._options.avecSaisieSitesWeb) {
		this.moteurFormSaisie.openModaleSelectRessource({
			instance: this,
			titre: GTraductions.getValeur("selecteurPJ.siteInternet"),
			element: this.data,
			genre: EGenreDocumentJoint.Url,
			genreRessourceDocJoint: EGenreRessource.DocumentJoint,
			listePiecesJointes: this.listeDocumentsJoints,
			listePJContexte: this.data.ListePieceJointe,
			genreFenetrePJ: EGenreFenetreDocumentJoint.TravailAFaire,
			listePeriodes: this.listePeriodes,
			dateCoursDeb: this.dateCoursDeb,
			validation: function (aParamsFenetre, aListeFichiers, aAvecSaisie) {
				if (aAvecSaisie) {
					_updateHtmlListeRessources.call(this, EGenreDocumentJoint.Url);
				}
			}.bind(this),
		});
	}
}
function _evntSurRemoveRessource(aGenreRessource, aNumeroRessource) {
	if (
		(aGenreRessource !== EGenreDocumentJoint.Fichier ||
			this._options.avecSaisiePJ) &&
		(aGenreRessource !== EGenreDocumentJoint.Cloud ||
			this._options.avecCloud) &&
		(aGenreRessource !== EGenreDocumentJoint.Url ||
			this._options.avecSaisieSitesWeb)
	) {
		this.moteurCDT.majDataSurRemoveRessource({
			data: this.data,
			numeroRessource: aNumeroRessource,
			genreRessource: aGenreRessource,
		});
		_updateHtmlListeRessources.call(this, aGenreRessource);
	}
}
function _updateHtmlListeRessources(aGenreRessource) {
	let lId, lListe, lAvecSaisie, lStrAucun;
	if (
		aGenreRessource === EGenreDocumentJoint.Fichier ||
		aGenreRessource === EGenreDocumentJoint.Cloud
	) {
		lId = this.ids.listePJ;
		lListe = _getListeRessourcesPJ.call(this);
		lAvecSaisie = this._options.avecSaisiePJ;
		lStrAucun = GTraductions.getValeur("CahierDeTexte.AucunePJ");
	} else {
		lId = this.ids.listeSitesWeb;
		lListe = this.moteurCDT.getListeRessourcesDeGenre({
			data: this.data,
			genreRessource: aGenreRessource,
			avecSaisie: this._options.avecSaisieSitesWeb,
		});
		lAvecSaisie = this._options.avecSaisieSitesWeb;
		lStrAucun = GTraductions.getValeur("CahierDeTexte.AucunSite");
	}
	this.moteurFormSaisie.updateHtmlListeRessources({
		id: lId,
		listeRessources: lListe,
		controleur: this.controleur,
		avecSaisie: lAvecSaisie,
		strAucun: lStrAucun,
	});
}
function _annulerEdition() {
	this.callback.appel({
		commande: EGenreEvntForm.annuler,
		data: this.donneeOriginale,
		estCreation: this.donnees.estCreation,
	});
}
module.exports = ObjetPanelEditionTAF;

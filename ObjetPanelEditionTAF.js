exports.ObjetPanelEditionTAF = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetMoteurCahierDeTextes_1 = require("ObjetMoteurCahierDeTextes");
const ObjetMoteurFormSaisieMobile_1 = require("ObjetMoteurFormSaisieMobile");
const ObjetMoteurFormSaisieMobile_2 = require("ObjetMoteurFormSaisieMobile");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const GUID_1 = require("GUID");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDate_1 = require("ObjetDate");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const EGenreFenetreDocumentJoint_1 = require("EGenreFenetreDocumentJoint");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const AccessApp_1 = require("AccessApp");
class ObjetPanelEditionTAF extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.moteurCDT = new ObjetMoteurCahierDeTextes_1.ObjetMoteurCDT();
		this.moteurFormSaisie =
			new ObjetMoteurFormSaisieMobile_1.ObjetMoteurFormSaisieMobile();
		this.ids = {
			panel: GUID_1.GUID.getId(),
			description: GUID_1.GUID.getId(),
			sitesWeb: GUID_1.GUID.getId(),
			pj: GUID_1.GUID.getId(),
			kiosque: GUID_1.GUID.getId(),
			listeSitesWeb: GUID_1.GUID.getId(),
			listePJ: GUID_1.GUID.getId(),
			listeKiosque: GUID_1.GUID.getId(),
		};
		this._instancierSelectDatePourLe();
		this._instancierSelectModeRendu();
		this._instancierSelectDifficulte();
		this._instancierMultiSelectTheme();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			description: {
				getValue: function () {
					return aInstance.data.descriptif;
				},
				setValue: function (aValue) {
					aInstance.data.descriptif = aValue;
					aInstance.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
			},
			inputTime: {
				getValue() {
					const lDataDuree = aInstance._getDureeTAF();
					const lDuree = lDataDuree * 60 * 1000;
					const lHMS = ObjetDate_1.GDate.dureeEnMillisecondesToHMS(lDuree);
					let lNbHeures = lHMS.heures;
					let lNbMin = lHMS.minutes;
					if (lNbHeures > 23) {
						lNbHeures = 23;
						lNbMin = 59;
					}
					const lDateDuree = new Date(0);
					lDateDuree.setHours(lNbHeures, lNbMin, 0, 0);
					return ObjetDate_1.GDate.formatDate(lDateDuree, "%hh:%mm");
				},
				setValue(aValue, aParamsSetter) {
					const lDureeEnMs = ObjetDate_1.GDate.hmsToDureeEnMillisecondes({
						heures: aParamsSetter.time.heure,
						minutes: aParamsSetter.time.minute,
						secondes: 0,
					});
					let lDureeEnMin = 0;
					if (lDureeEnMs > 0) {
						const lDureeEnSec = Math.round(lDureeEnMs / 1000);
						if (lDureeEnSec > 0) {
							lDureeEnMin = Math.round(lDureeEnSec / 60);
						}
					}
					if (lDureeEnMin !== aInstance.data.duree) {
						aInstance.data.duree = lDureeEnMin;
						aInstance.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.msgConfirmationSupprimerTAF",
						),
						callback: function (aGenreBouton) {
							if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
								aInstance.data.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								aInstance.callback.appel({
									commande:
										ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.supprimer,
									data: aInstance.data,
								});
							}
						},
					});
				},
				getDisabled: function () {
					return false;
				},
			},
			btnSelectPublic: {
				event: aInstance._evntSurEditPublic.bind(aInstance),
				getLibelle: function () {
					const H = [];
					const lListeTousEleves = aInstance.moteurCDT.getListeTousEleves({
						listeClassesEleves: aInstance.listeClassesEleves,
					});
					let lStrChips = aInstance.moteurCDT.strPublicTAF(aInstance.data, {
						listeTousEleves: lListeTousEleves,
						avecLibellesCourt: true,
					});
					H.push(
						IE.jsx.str(
							"ie-chips",
							{ class: "avec-event m-right", title: "" },
							lStrChips,
						),
					);
					return H.join("");
				},
			},
			btnSupprChips: {
				eventBtn: function (aGenreRessource, aNumeroRessource) {
					aInstance._evntSurRemoveRessource(aGenreRessource, aNumeroRessource);
				},
			},
		});
	}
	setOptionsPanelEditionTAF(aOptions) {
		this._options = {
			avecSaisiePJ: false,
			avecSaisieSitesWeb: false,
			avecCloud: false,
			avecKiosque: false,
		};
		$.extend(this._options, aOptions);
	}
	setDonnees(aDonnees) {
		this.donneeOriginale = aDonnees.taf;
		this.donneeOriginale.matiere = aDonnees.matiere;
		this.data = MethodesObjet_1.MethodesObjet.dupliquer(this.donneeOriginale);
		this.data.descriptif = ObjetChaine_1.GChaine.supprimerBalisesHtml(
			this.data.descriptif,
		);
		this.estEnCreation = aDonnees.estCreation;
		this.listeClassesEleves = aDonnees.listeClassesEleves;
		this.listePeriodes = aDonnees.listePeriodes;
		this.listeDocumentsJoints = aDonnees.listeDocumentsJoints;
		this.dateCoursDeb = aDonnees.dateCoursDeb;
		this.CDTPublie = aDonnees.CDTPublie;
	}
	getHtmlPanel() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: "FormSaisie ofm-design", id: this.ids.panel },
				this._composeHtmlEdition(),
			),
		);
		return lHtml.join("");
	}
	updateContent() {
		this._updateDatePourLe();
		this._updateSelectModeRendu();
		this._updateSelectDifficulte();
		this._updateMultiSelectTheme();
	}
	getOptionsFenetre() {
		const lTitre = `<span class="iconic icon_taf">${this.estEnCreation ? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CreerTAF") : ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ModifierTAF")}</span>`;
		const lHtmlFooter = !this.estEnCreation
			? `<ie-btnicon class="icon_trash avecFond i-medium" ie-model="nodePoubelle" aria-label=${ObjetTraduction_1.GTraductions.getValeur("Supprimer")}></ie-btnicon>`
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
							commande: ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.annuler,
							data: this.donneeOriginale,
							estCreation: this.estEnCreation,
						});
					} else {
						this.data.estVide = false;
					}
					this.data.setEtat(
						this.estEnCreation
							? Enumere_Etat_1.EGenreEtat.Creation
							: Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.callback.appel({
						commande: ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.valider,
						data: this.data,
						estCreation: this.estEnCreation,
					});
				} else {
					this._annulerEdition();
				}
			},
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					valider: true,
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					getDisabled: () => {
						return this.data.descriptif.trim() === "";
					},
				},
			],
		};
	}
	_composeHtmlEdition() {
		const H = [];
		H.push(this._composeCorps());
		return H.join("");
	}
	_composeCorps() {
		const H = [];
		H.push(`<div class="Fenetre_Contenu">`);
		H.push(this._composeDescription());
		H.push(this._composePourLe());
		H.push(this._composePiecesJointes());
		H.push(this._composeSitesWeb());
		H.push(this._composeRessKiosque());
		H.push(this._composeModeRendu());
		if (this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")) {
			H.push(this._composeTheme());
		}
		H.push(this._composeDifficulte());
		H.push(this._composeDuree());
		H.push(this._composePublic());
		H.push(`</div>`);
		return H.join("");
	}
	_composeDescription() {
		if (this.data.executionQCM) {
			return this.moteurFormSaisie.composeFormTexteSimple({
				id: "",
				label: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.DescriptionTAF",
				),
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
				label: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.DescriptionTAF",
				),
				classLabel: "description.getClasseLabel",
				estObligatoire: true,
			});
		}
	}
	_composePourLe() {
		return this.moteurFormSaisie.composeDate({
			id: this.instanceSelectDatePourLe.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.PourLe"),
			classLabel: "date.getClasseLabel",
		});
	}
	_instancierSelectDatePourLe() {
		this.instanceSelectDatePourLe = this.moteurFormSaisie.instancierCalendrier(
			this._evntSelectDatePourLe.bind(this),
			this,
			{
				avecBoutonsPrecedentSuivant: false,
				joursSemaineValide: GParametres.JoursOuvres,
				joursFeries: GParametres.JoursFeries,
			},
		);
	}
	_evntSelectDatePourLe(aDate) {
		this.data.PourLe = aDate;
		this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_updateDatePourLe() {
		this.instanceSelectDatePourLe.setOptionsObjetCelluleDate({
			premiereDate: this.dateCoursDeb,
		});
		this.instanceSelectDatePourLe.initialiser();
		this.instanceSelectDatePourLe.setDonnees(this.data.PourLe, true);
	}
	_composePublic() {
		return this.moteurFormSaisie.composeBtnSelect({
			label: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAF.Eleves",
			),
			strControle: "btnSelectPublic",
		});
	}
	_evntSurEditPublic() {
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
			genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
			titre:
				Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
			evntClbck: (aParam) => {
				if (aParam.validerSelection) {
					this.moteurCDT.majDataTAFSurModifPublic({
						data: this.data,
						listeTousEleves: lListeTousEleves,
						listeRessourcesSelectionnees: aParam.listeRessourcesSelectionnees,
					});
				}
			},
		});
	}
	_composeTheme() {
		return this.moteurFormSaisie.composeMultiSelecteurTheme({
			id: this.instanceMultiSelectTheme.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur("Themes"),
		});
	}
	_instancierMultiSelectTheme() {
		this.instanceMultiSelectTheme =
			this.moteurFormSaisie.instancierMultiSelecteurTheme(
				this._evtCellMultiSelectionTheme.bind(this),
				this,
			);
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.data.ListeThemes = aListeSelections;
			this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_updateMultiSelectTheme() {
		this.instanceMultiSelectTheme.initialiser();
		this.moteurFormSaisie.updateMultiSelectTheme({
			instanceSelect: this.instanceMultiSelectTheme,
			liste:
				this.data.ListeThemes || new ObjetListeElements_1.ObjetListeElements(),
			matiere: this.data.matiere,
			libelleCB: this.data.libelleCBTheme,
		});
	}
	_composeModeRendu() {
		if (this.data.executionQCM) {
			return this.moteurFormSaisie.composeFormTexteSimple({
				id: "",
				label: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ModeRendu",
				),
				texteSimple: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.ACompleterEditeur",
				),
			});
		} else {
			return this.moteurFormSaisie.composeSelecteur({
				id: this.instanceSelectModeRendu.getNom(),
				label: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ModeRendu",
				),
			});
		}
	}
	_instancierSelectModeRendu() {
		this.instanceSelectModeRendu = this.moteurFormSaisie.instancierSelecteur(
			this._evntSelectModeRendu.bind(this),
			this,
			{
				avecBoutonsPrecedentSuivant: false,
				icone: "icon_reorder",
				labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ModeRendu",
				),
				optionsCombo: {
					getContenuElement(aParams) {
						return aParams.element.getLibelle();
					},
				},
			},
		);
	}
	_evntSelectModeRendu(aParam) {
		this.data.genreRendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.fromElement(aParam.element);
		this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_updateSelectModeRendu() {
		this.moteurFormSaisie.updateSelecteur({
			liste: this.moteurCDT.getListeModeRendu(),
			donnee:
				this.data.genreRendu !== null && this.data.genreRendu !== undefined
					? TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.toElement(
							this.data.genreRendu,
						)
					: null,
			instanceSelect: this.instanceSelectModeRendu,
			comparerGenre: true,
		});
	}
	_getDureeTAF() {
		return this.data.executionQCM
			? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
					this.data.executionQCM.dureeMaxQCM,
				)
			: this.data.duree;
	}
	_avecSelecteurDuree() {
		return !this.data.executionQCM || this._getDureeTAF() > 0;
	}
	_composeDuree() {
		if (this._avecSelecteurDuree()) {
			const lId = GUID_1.GUID.getId();
			return `<div class="field-contain duree-conteneur">\n              <label for="${lId}" class="active ie-titre-petit">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.DureeEstimee")}</label>\n              <input id="${lId}" type="time" class="input-time" ie-model="inputTime" />\n            </div>`;
		}
	}
	_composeDifficulte() {
		return this.moteurFormSaisie.composeSelecteur({
			id: this.instanceSelectDifficulte.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.NiveauDifficulte",
			),
		});
	}
	_instancierSelectDifficulte() {
		this.instanceSelectDifficulte = this.moteurFormSaisie.instancierSelecteur(
			this._evntSelectDifficulte.bind(this),
			this,
			{
				avecBoutonsPrecedentSuivant: false,
				icone: "icon_reorder",
				labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.NiveauDifficulte",
				),
			},
		);
	}
	_evntSelectDifficulte(aParam) {
		this.data.niveauDifficulte =
			TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.fromElement(
				aParam.element,
			);
		this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_updateSelectDifficulte() {
		this.moteurFormSaisie.updateSelecteur({
			liste: this.moteurCDT.getListeDifficulte(),
			donnee: this.moteurCDT.estTAFAvecDifficulte(this.data)
				? TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.toElement(
						this.data.niveauDifficulte,
						true,
					)
				: null,
			instanceSelect: this.instanceSelectDifficulte,
			comparerGenre: true,
		});
	}
	_getListeRessourcesPJ() {
		const lListeRessFichier = this.moteurCDT.getListeRessourcesDeGenre({
			data: this.data,
			genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			avecSaisie: this._options.avecSaisiePJ,
		});
		const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
			data: this.data,
			genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
			avecSaisie: false,
		});
		return lListeRessFichier.add(lListeRessCloud);
	}
	_composePiecesJointes() {
		if (this.data.executionQCM) {
			return "";
		}
		const lAvecSaisiePJ = this._options.avecSaisiePJ;
		let lJsxNodeGestionPJ = false;
		if (lAvecSaisiePJ) {
			lJsxNodeGestionPJ = (aNode) => {
				$(aNode).eventValidation(() => {
					this._evntSurEditPJ();
				});
			};
		}
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.DocsJoints",
			),
			icon: "icon_paper_clip",
			listeRessources: this._getListeRessourcesPJ(),
			id: this.ids.pj,
			nodeGestion: lJsxNodeGestionPJ,
			idListeRessources: this.ids.listePJ,
			avecSaisie: lAvecSaisiePJ,
		});
	}
	_evntSurEditPJ() {
		if (this._options.avecSaisiePJ) {
			const lAvecCloud = GEtatUtilisateur.avecCloudDisponibles();
			UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes(
				{
					instance: this,
					callbackChoixParmiFichiersExistants: () => {
						this.surEvenementChoixFichierParmiDocDejaInseres();
					},
					maxSizeNouvellePJ: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
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
								const lDocumentJoint = new ObjetElement_1.ObjetElement(
									aFichier.getLibelle(),
									aFichier.getNumero(),
									aFichier.getGenre(),
								);
								lDocumentJoint.url = aFichier.url;
								lDocumentJoint.Fichier = aFichier;
								lDocumentJoint.idFichier = aFichier.idFichier;
								lDocumentJoint.nomOriginal = aFichier.nomOriginal;
								lDocumentJoint.file = aFichier.file;
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								lListePJContexte.addElement(lDocumentJoint);
								this.listeDocumentsJoints.addElement(lDocumentJoint);
							});
							this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							this.data.listeFichiersFenetrePJ = lListePJContexte;
							this._updateHtmlListeRessources(
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
							);
						}
					},
					callbackChoixDepuisCloud: lAvecCloud
						? () => {
								UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.ouvrirFenetreCloud().then(
									this.callbackChoixDepuisCloud.bind(this),
								);
							}
						: null,
					callbackChoixDepuisCloudENEJ:
						GEtatUtilisateur.avecCloudENEJDisponible()
							? () => {
									UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.ouvrirFenetreChoixFichierCloud(
										{
											service: GEtatUtilisateur.getCloudENEJ(),
											instance: this,
										},
									).then(this.callbackChoixDepuisCloud.bind(this));
								}
							: null,
				},
			);
		}
	}
	callbackChoixDepuisCloud(aListeNouveauxDocs) {
		this.data.ListePieceJointe.add(aListeNouveauxDocs);
		this.listeDocumentsJoints.add(aListeNouveauxDocs);
		this.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.data.listeFichiersFenetrePJ = aListeNouveauxDocs;
		this._updateHtmlListeRessources(
			Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
		);
	}
	surEvenementChoixFichierParmiDocDejaInseres() {
		this.moteurFormSaisie.openModaleSelectRessource({
			instance: this,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"selecteurPJ.nomDocument",
			),
			element: this.data,
			genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourceDocJoint: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			listePiecesJointes: this.listeDocumentsJoints,
			listePJContexte: this.data.ListePieceJointe,
			genreFenetrePJ:
				EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.TravailAFaire,
			listePeriodes: this.listePeriodes,
			dateCoursDeb: this.dateCoursDeb,
			validation: (aParamsFenetre, aListeFichiers, aAvecSaisie) => {
				if (aAvecSaisie) {
					this.data.listeFichiersFenetrePJ = aListeFichiers;
					this._updateHtmlListeRessources(
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					);
				}
			},
		});
	}
	_composeRessKiosque() {
		const lListeRessCloud = this.moteurCDT.getListeRessourcesDeGenre({
			data: this.data,
			genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque,
			avecSaisie: false,
		});
		if (lListeRessCloud.count() > 0) {
			return this.moteurFormSaisie.composeFormGestionRessources({
				label: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.Kiosques",
				),
				icon: "icon_external_link",
				listeRessources: lListeRessCloud,
				id: this.ids.kiosque,
				nodeGestion: false,
				idListeRessources: this.ids.listeKiosque,
				avecSaisie: false,
			});
		}
	}
	_composeSitesWeb() {
		if (this.data.executionQCM) {
			return "";
		}
		const lAvecSaisieSiteWeb = this._options.avecSaisieSitesWeb;
		let lJsxNodeGestionSiteWeb = false;
		if (lAvecSaisieSiteWeb) {
			lJsxNodeGestionSiteWeb = (aNode) => {
				$(aNode).eventValidation(() => {
					this._evntSurEditSiteWeb();
				});
			};
		}
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.SitesWeb"),
			icon: "icon_link",
			listeRessources: this.moteurCDT.getListeRessourcesDeGenre({
				data: this.data,
				genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
				avecSaisie: this._options.avecSaisieSitesWeb,
			}),
			id: this.ids.sitesWeb,
			nodeGestion: lJsxNodeGestionSiteWeb,
			idListeRessources: this.ids.listeSitesWeb,
			avecSaisie: lAvecSaisieSiteWeb,
		});
	}
	_evntSurEditSiteWeb() {
		if (this._options.avecSaisieSitesWeb) {
			this.moteurFormSaisie.openModaleSelectRessource({
				instance: this,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"selecteurPJ.siteInternet",
				),
				element: this.data,
				genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
				genreRessourceDocJoint:
					Enumere_Ressource_1.EGenreRessource.DocumentJoint,
				listePiecesJointes: this.listeDocumentsJoints,
				listePJContexte: this.data.ListePieceJointe,
				genreFenetrePJ:
					EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.TravailAFaire,
				listePeriodes: this.listePeriodes,
				dateCoursDeb: this.dateCoursDeb,
				validation: (aParamsFenetre, aListeFichiers, aAvecSaisie) => {
					if (aAvecSaisie) {
						this._updateHtmlListeRessources(
							Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
						);
					}
				},
			});
		}
	}
	_evntSurRemoveRessource(aGenreRessource, aNumeroRessource) {
		if (
			(aGenreRessource !==
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier ||
				this._options.avecSaisiePJ) &&
			(aGenreRessource !== Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud ||
				this._options.avecCloud) &&
			(aGenreRessource !== Enumere_DocumentJoint_1.EGenreDocumentJoint.Url ||
				this._options.avecSaisieSitesWeb)
		) {
			this.moteurCDT.majDataSurRemoveRessource({
				data: this.data,
				numeroRessource: aNumeroRessource,
				genreRessource: aGenreRessource,
			});
			this._updateHtmlListeRessources(aGenreRessource);
		}
	}
	_updateHtmlListeRessources(aGenreRessource) {
		let lId, lListe, lAvecSaisie;
		if (
			aGenreRessource === Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier ||
			aGenreRessource === Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
		) {
			lId = this.ids.listePJ;
			lListe = this._getListeRessourcesPJ();
			lAvecSaisie = this._options.avecSaisiePJ;
		} else {
			lId = this.ids.listeSitesWeb;
			lListe = this.moteurCDT.getListeRessourcesDeGenre({
				data: this.data,
				genreRessource: aGenreRessource,
				avecSaisie: this._options.avecSaisieSitesWeb,
			});
			lAvecSaisie = this._options.avecSaisieSitesWeb;
		}
		this.moteurFormSaisie.updateHtmlListeRessources({
			id: lId,
			listeRessources: lListe,
			controleur: this.controleur,
			avecSaisie: lAvecSaisie,
		});
	}
	_annulerEdition() {
		this.callback.appel({
			commande: ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.annuler,
			data: this.donneeOriginale,
			estCreation: this.estEnCreation,
		});
	}
}
exports.ObjetPanelEditionTAF = ObjetPanelEditionTAF;

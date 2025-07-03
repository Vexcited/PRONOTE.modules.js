exports.ObjetPanelEditionContenu = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetMoteurCahierDeTextes_1 = require("ObjetMoteurCahierDeTextes");
const ObjetMoteurFormSaisieMobile_1 = require("ObjetMoteurFormSaisieMobile");
const ObjetMoteurFormSaisieMobile_2 = require("ObjetMoteurFormSaisieMobile");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const EGenreFenetreDocumentJoint_1 = require("EGenreFenetreDocumentJoint");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const AccessApp_1 = require("AccessApp");
class ObjetPanelEditionContenu extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.moteurCDT = new ObjetMoteurCahierDeTextes_1.ObjetMoteurCDT();
		this.moteurFormSaisie =
			new ObjetMoteurFormSaisieMobile_1.ObjetMoteurFormSaisieMobile();
		this.ids = {
			panel: GUID_1.GUID.getId(),
			description: GUID_1.GUID.getId(),
			titre: GUID_1.GUID.getId(),
			sitesWeb: GUID_1.GUID.getId(),
			pj: GUID_1.GUID.getId(),
			kiosque: GUID_1.GUID.getId(),
			listeSitesWeb: GUID_1.GUID.getId(),
			listePJ: GUID_1.GUID.getId(),
			listeKiosque: GUID_1.GUID.getId(),
		};
		this._instancierSelectCategorie();
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
				fromDisplay(aValue) {
					let lValue = aValue;
					const lJNode = $(IE.jsx.str("div", null, aValue));
					const lAvec = ObjetHtml_1.GHtml.nettoyerEditeurRiche(lJNode);
					if (lAvec) {
						lValue = lJNode.get(0).innerHTML;
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.MessageSuppressionImage",
							),
						});
					}
					return ObjetChaine_1.GChaine.htmlDOMPurify(lValue);
				},
				getClasseLabel: function () {
					const lData = aInstance.data;
					return !!lData && !!lData.descriptif && lData.descriptif.length > 0
						? "active"
						: "";
				},
				node: function () {
					$(this.node).on({
						focus: function () {
							$(this).siblings("label").addClass("active");
							return false;
						},
						blur: function () {
							if (!this.innerHTML) {
								$(this).siblings("label").removeClass("active");
							}
						},
					});
				},
				getDisabled: function () {
					return false;
				},
			},
			titre: {
				getValue: function () {
					return aInstance.data.getLibelle();
				},
				setValue: function (aValue) {
					aInstance.data.setLibelle(aValue);
					aInstance.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
				getClasseLabel: function () {
					const lData = aInstance.data;
					return !!lData &&
						lData.getLibelle() !== null &&
						lData.getLibelle() !== undefined &&
						lData.getLibelle() !== ""
						? "active"
						: "";
				},
			},
			nodePoubelle: {
				event: function () {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.msgConfirmationSupprimerContenu",
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
			btnSupprChips: {
				eventBtn: function (aGenreRessource, aNumeroRessource) {
					aInstance._evntSurRemoveRessource(aGenreRessource, aNumeroRessource);
				},
			},
		});
	}
	setOptionsPanelEditionContenu(aParams) {
		this._options = aParams;
	}
	setDonnees(aDonnees) {
		this.donneeOriginale = aDonnees.contenu;
		this.donneeOriginale.matiere = aDonnees.matiere;
		this.data = MethodesObjet_1.MethodesObjet.dupliquer(this.donneeOriginale);
		this.estEnCreation = aDonnees.estCreation;
		this.listeCategories = aDonnees.listeCategories;
		this.listePeriodes = aDonnees.listePeriodes;
		this.listeDocumentsJoints = aDonnees.listeDocumentsJoints;
		this.dateCoursDeb = aDonnees.dateCoursDeb;
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
		this._updateSelectCategorie();
		this._updateMultiSelectTheme();
	}
	getOptionsFenetre() {
		const lTitre = `<span class="iconic icon_contenu_cours">${this.estEnCreation ? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CreerContenu") : ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ModifierContenu")}</span>`;
		const lHtmlFooter = !this.estEnCreation
			? `<ie-btnicon class="icon_trash avecFond i-medium" ie-model="nodePoubelle" aria-label=${ObjetTraduction_1.GTraductions.getValeur("Supprimer")}></ie-btnicon>`
			: "";
		return {
			titre: lTitre,
			htmlFooter: lHtmlFooter,
			avecComposeBasInFooter: true,
			callback: (aNumeroBouton, aParams) => {
				if (aParams.bouton && aParams.bouton.valider) {
					if (this.data.descriptif.replace(/&nbsp;/gi, "").trim() === "") {
						this.data.descriptif = "";
					}
					this.data.setLibelle(this.data.getLibelle().trim());
					if (this.moteurCDT.estContenuVide(this.data)) {
						if (this.estEnCreation) {
							this.callback.appel({
								commande: ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.annuler,
								data: this.donneeOriginale,
								estCreation: this.estEnCreation,
							});
						} else {
							this.data.estVide = true;
						}
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
		H.push(this._composeTitre());
		H.push(this._composeCategorie());
		if (this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")) {
			H.push(this._composeTheme());
		}
		H.push(this._composeDescription());
		H.push(this._composePiecesJointes());
		H.push(this._composeSitesWeb());
		H.push(this._composeRessKiosque());
		H.push(`</div>`);
		return H.join("");
	}
	_composeTitre() {
		return this.moteurFormSaisie.composeFormText({
			id: this.ids.titre,
			model: "titre",
			label: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.titre"),
		});
	}
	_composeDescription() {
		return this.moteurFormSaisie.composeFormContenuEditable({
			id: this.ids.description,
			model: "description",
			label: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.DescriptionTAF",
			),
		});
	}
	_composeCategorie() {
		return this.moteurFormSaisie.composeSelecteur({
			id: this.instanceSelectCategorie.getNom(),
			label: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.categorie",
			),
		});
	}
	_instancierSelectCategorie() {
		this.instanceSelectCategorie = this.moteurFormSaisie.instancierSelecteur(
			this._evntSelectCategorie.bind(this),
			this,
			{
				avecBoutonsPrecedentSuivant: false,
				labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.categorie",
				),
			},
		);
	}
	_evntSelectCategorie(aParam) {
		this.data.categorie = aParam.element;
	}
	_updateSelectCategorie() {
		this.moteurFormSaisie.updateSelecteur({
			liste: this.listeCategories,
			donnee: this.moteurCDT.estContenuAvecCategorie(this.data)
				? this.moteurCDT.getCategorieDeContenu(this.data)
				: null,
			instanceSelect: this.instanceSelectCategorie,
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
				"AjouterDesPiecesJointes",
			),
			listeRessources: this._getListeRessourcesPJ(),
			id: this.ids.pj,
			icon: "icon_piece_jointe",
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
					callbackChoixParmiLiensExistants: null,
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
									this.callbackChoixDepuisCloud,
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
									).then(this.callbackChoixDepuisCloud);
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
			element: this.data,
			genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourceDocJoint: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			listePiecesJointes: this.listeDocumentsJoints,
			listePJContexte: this.data.ListePieceJointe,
			genreFenetrePJ:
				EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.CahierDeTextes,
			listePeriodes: this.listePeriodes,
			dateCoursDeb: this.dateCoursDeb,
			validation: (aParamsFenetre, aListeFichiers, aAvecSaisie) => {
				if (aAvecSaisie) {
					this.data.listeFichiersFenetrePJ = aListeFichiers;
				}
				this._updateHtmlListeRessources(
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
				);
			},
		});
	}
	_composeSitesWeb() {
		const lAvecSaisie = this._options.avecSaisieSitesWeb;
		let lJsxNodeGestionSiteWeb = false;
		if (lAvecSaisie) {
			lJsxNodeGestionSiteWeb = (aNode) => {
				$(aNode).eventValidation(() => {
					this.surEvenementChoixSiteParmiSitesDejaInseres();
				});
			};
		}
		return this.moteurFormSaisie.composeFormGestionRessources({
			label: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.SitesWeb"),
			listeRessources: this.moteurCDT.getListeRessourcesDeGenre({
				data: this.data,
				genreRessource: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
				avecSaisie: this._options.avecSaisieSitesWeb,
			}),
			id: this.ids.sitesWeb,
			icon: "icon_link",
			nodeGestion: lJsxNodeGestionSiteWeb,
			idListeRessources: this.ids.listeSitesWeb,
			avecSaisie: this._options.avecSaisieSitesWeb,
		});
	}
	surEvenementChoixSiteParmiSitesDejaInseres() {
		this.moteurFormSaisie.openModaleSelectRessource({
			instance: this,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"selecteurPJ.siteInternet",
			),
			element: this.data,
			genre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
			genreRessourceDocJoint: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			listePiecesJointes: this.listeDocumentsJoints,
			listePJContexte: this.data.ListePieceJointe,
			genreFenetrePJ:
				EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.CahierDeTextes,
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
				listeRessources: lListeRessCloud,
				id: this.ids.kiosque,
				icon: "icon_external_link",
				nodeGestion: false,
				idListeRessources: this.ids.listeKiosque,
				avecSaisie: false,
			});
		}
	}
	_annulerEdition() {
		this.callback.appel({
			commande: ObjetMoteurFormSaisieMobile_2.EGenreEvntForm.annuler,
			data: this.donneeOriginale,
			estCreation: this.estEnCreation,
		});
	}
}
exports.ObjetPanelEditionContenu = ObjetPanelEditionContenu;

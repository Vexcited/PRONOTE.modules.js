exports._InterfaceContenuEtTAFCahierDeTextes = void 0;
const TinyInit_1 = require("TinyInit");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const InterfacePage_1 = require("InterfacePage");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const GestionnaireModale_1 = require("GestionnaireModale");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeGenreParcoursEducatif_1 = require("TypeGenreParcoursEducatif");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class _InterfaceContenuEtTAFCahierDeTextes extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.pleinEcran = false;
		this.idDescriptif = this.Nom + "_Descriptif";
		this.idDocsJoints = this.Nom + "_DocumentsJoints";
		this.idBtnPJ = this.Nom + "_btnPJ";
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
		this.IdPremierElement = this.Nom + "_Titre";
		this.idPremierObjet = this.IdPremierElement;
		this.avecParcoursEducatifs = this.applicationSco.parametresUtilisateur.get(
			"CDT.ParcoursEducatifs.ActiverSaisie",
		);
		this.listeParcoursEducatifs = new ObjetListeElements_1.ObjetListeElements();
		if (this.avecParcoursEducatifs) {
			this.listeParcoursEducatifs =
				TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatifUtil.toListe();
			this.listeParcoursEducatifs.insererElement(
				new ObjetElement_1.ObjetElement("", 0, -1),
				0,
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMiseEnFormeTexte: {
				event() {
					aInstance.evenementSurBoutonHTML();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.miseEnForme",
					);
				},
			},
			btnAfficherPiecesJointes: {
				event() {
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes(
						{
							instance: aInstance,
							id: aInstance.idBtnPJ,
							callbackChoixParmiFichiersExistants: () => {
								aInstance._evenementSurBoutonPieceJoint(
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
								);
							},
							callbackChoixParmiLiensExistants: () => {
								aInstance._evenementSurBoutonPieceJoint(
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
								);
							},
							maxSizeNouvellePJ: aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
							),
							avecUploadMultiple: true,
							callbackUploadNouvellePJ: (aParametresInput) => {
								aInstance.callback.appel(
									EGenreEvenementContenuCahierDeTextes_1
										.EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint,
									aInstance.getTAFContenu(),
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
									aParametresInput,
								);
							},
							callbackChoixDepuisCloud:
								aInstance.etatUtilisateur.avecCloudDisponibles()
									? () => {
											aInstance.evenementSurBoutonCloud();
										}
									: null,
							callbackChoixDepuisCloudENEJ:
								aInstance.etatUtilisateur.avecCloudENEJDisponible()
									? () => {
											aInstance.ouvrirFenetreCloudENEJ();
										}
									: null,
							callbackNouvelleURL: (aNouvelleURL) => {
								aInstance.callback.appel(
									EGenreEvenementContenuCahierDeTextes_1
										.EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint,
									aInstance.getTAFContenu(),
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
									aNouvelleURL,
								);
							},
							callbackAjoutQCM: aInstance.avecBoutonQCM()
								? aInstance.evntSurBtnQCM.bind(aInstance)
								: null,
							callbackAjoutLienKiosque: aInstance.avecBoutonKiosque()
								? () => {
										aInstance.callback.appel(
											EGenreEvenementContenuCahierDeTextes_1
												.EGenreEvenementContenuCahierDeTextes
												.ajouterLienKiosque,
											aInstance.getTAFContenu(),
										);
									}
								: null,
						},
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.docJointsFenetre",
					);
				},
				getDisabled() {
					let lAuMoinsUnTypeDocJointAutorise = false;
					if (!!aInstance.avecDocumentJoint) {
						lAuMoinsUnTypeDocJointAutorise =
							aInstance.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
							];
						lAuMoinsUnTypeDocJointAutorise =
							lAuMoinsUnTypeDocJointAutorise ||
							aInstance.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
							];
						lAuMoinsUnTypeDocJointAutorise =
							lAuMoinsUnTypeDocJointAutorise ||
							aInstance.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
							];
						lAuMoinsUnTypeDocJointAutorise =
							lAuMoinsUnTypeDocJointAutorise ||
							aInstance.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque
							];
					}
					return (
						!!aInstance.cahierDeTexteVerrouille ||
						!lAuMoinsUnTypeDocJointAutorise
					);
				},
			},
			chipsPieceJointeTafContenu: {
				eventBtn: function (aIndice) {
					const lTAFContenu = aInstance.getTAFContenu();
					if (!lTAFContenu) {
						return;
					}
					const lPJ = lTAFContenu.ListePieceJointe.get(aIndice);
					if (lPJ) {
						lTAFContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						aInstance._actualiserDocumentsJoints();
						aInstance.callback.appel(
							EGenreEvenementContenuCahierDeTextes_1
								.EGenreEvenementContenuCahierDeTextes.suppressionDocument,
							lTAFContenu,
						);
					}
				},
			},
		});
	}
	avecBoutonKiosque() {
		return (
			!this.paramsAffichage.pourProgression &&
			this.etatUtilisateur.avecRessourcesGranulaire
		);
	}
	_actualiserDocumentsJoints() {
		const lTAFContenu = this.getTAFContenu();
		if (lTAFContenu && lTAFContenu.ListePieceJointe) {
			const lIEModelChips = this.cahierDeTexteVerrouille
				? null
				: "chipsPieceJointeTafContenu";
			const lSeparateur = this.cahierDeTexteVerrouille ? ", " : " ";
			let lListeFiltree = lTAFContenu.ListePieceJointe.getListeElements(
				(aElt) => {
					return aElt.estUnLienInterne !== true;
				},
			);
			ObjetHtml_1.GHtml.setHtml(
				this.idDocsJoints,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(lListeFiltree, {
					separateur: lSeparateur,
					IEModelChips: lIEModelChips,
					maxWidth: 300,
				}),
				{ controleur: this.controleur },
			);
		}
	}
	construireInstances() {}
	construireEditeur() {
		const H = [];
		if (ObjetNavigateur_1.Navigateur.withContentEditable) {
			H.push(
				'<div id="',
				this.idDescriptif,
				'" ',
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Textbox),
				" ",
				ObjetWAI_1.GObjetWAI.composeAttribut({
					genre: ObjetWAI_1.EGenreAttribut.multiline,
					valeur: "true",
				}),
				' class="full-width is-tiny" style="width:100%;height:75px;"  tabindex="0">',
				"</div>",
			);
		} else {
			H.push(
				'<textarea id="',
				this.idDescriptif,
				'" maxlength="0"  style="width:100%;height:75px;" onkeyup="',
				this.Nom,
				'.mettreAJourDescriptif ()" oncontextmenu="Navigateur.stopperEvenement (event); return false;">',
				"</textarea>",
			);
		}
		return H.join("");
	}
	avecBoutonEditeurHTML() {
		return false;
	}
	evenementSurBoutonHTML() {}
	avecBoutonQCM() {
		return false;
	}
	evntSurBtnQCM() {}
	construireBoutonsLiens() {
		const H = [];
		if (this.avecBoutonEditeurHTML()) {
			H.push(
				UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMiseEnFormeTexte(
					"btnMiseEnFormeTexte",
				),
			);
		}
		H.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnPiecesJointes(
				"btnAfficherPiecesJointes",
				this.idBtnPJ,
			),
		);
		return H.join("");
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	setParametresAffichage(aParametresAffichage) {
		Object.assign(this.paramsAffichage, aParametresAffichage);
		this.paramsAffichage.avecExosQCM =
			aParametresAffichage.pourProgression !== null &&
			aParametresAffichage.pourProgression !== undefined
				? !this.paramsAffichage.pourProgression
				: true;
	}
	_affecterContenuTiny(aInstanceTiny, aContenu) {
		TinyInit_1.TinyInit.onLoadEnd(aInstanceTiny).then((aParams) => {
			if (aParams.tiny) {
				aParams.tiny.focus();
				aParams.tiny.setContent(aContenu);
			}
		});
	}
	free() {
		super.free();
		this._debloquerTiny();
	}
	recupererDonnees() {
		const lId = this.idDescriptif;
		const lThis = this;
		if (!ObjetHtml_1.GHtml.elementExiste(lId)) {
			return;
		}
		if (ObjetNavigateur_1.Navigateur.withContentEditable) {
			this._debloquerTiny();
			this._guidBlocageTiny =
				GestionnaireModale_1.GestionnaireModale.bloquerInterface({
					bloquer: true,
					avecVoile: false,
				});
			TinyInit_1.TinyInit.init({
				id: lId,
				ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.labelWAISaisieContenu",
				),
				height: this.paramsAffichage.height[Number(this.pleinEcran)],
				plugins: TinyInit_1.TinyInit.getPlugins(
					this.paramsAffichage.autoresize,
				),
				editeurEquation: true,
				editeurEquationMaxFileSize: 4096,
				toolbar: this.paramsAffichage.position[Number(this.pleinEcran)],
				min_height: this.paramsAffichage.min_height[Number(this.pleinEcran)],
				max_height: this.paramsAffichage.max_height[Number(this.pleinEcran)],
				autoresize_bottom_margin: 20,
				autoresize_on_init: true,
				setup: function (editor) {
					editor.on("KeyUp", () => {
						lThis._setDescriptif(editor.getContent());
					});
					editor.on("Change", () => {
						if (!editor._enCoursDestruction) {
							lThis._setDescriptif(editor.getContent());
						}
					});
				},
			}).finally(() => {
				this._debloquerTiny();
			});
		} else {
			ObjetPosition_1.GPosition.setHeight(
				lId,
				this.paramsAffichage.height[Number(this.pleinEcran)],
			);
		}
	}
	evenementOuvrirMenuContextuel() {}
	mettreAJourDescriptif() {
		this._setDescriptif(ObjetHtml_1.GHtml.getValue(this.idDescriptif), false);
	}
	editorResize(aHeight) {
		this.paramsAffichage.height = [aHeight.toString(), aHeight.toString()];
		if (aHeight > 100) {
			if (ObjetNavigateur_1.Navigateur.withContentEditable) {
				TinyInit_1.TinyInit.setHeight(this.idDescriptif, aHeight, 2);
			}
		}
	}
	_evenementSurBoutonPieceJoint(aGenre, aLigneContextMenu) {
		this.callback.appel(
			EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDocumentJoint,
			this.getTAFContenu(),
			aGenre,
			aLigneContextMenu,
		);
	}
	_debloquerTiny() {
		if (this._guidBlocageTiny) {
			GestionnaireModale_1.GestionnaireModale.bloquerInterface({
				bloquer: false,
				guidBlocage: this._guidBlocageTiny,
			});
			delete this._guidBlocageTiny;
		}
	}
	evenementSurBoutonCloud() {
		let lParams = {
			callbaskEvenement: this.evenementFenetreChoixCloud.bind(this),
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.Cloud,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	ouvrirFenetreCloudENEJ() {
		this._evenementSurBoutonPieceJoint(
			Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
			this.etatUtilisateur.getCloudENEJ(),
		);
	}
	evenementFenetreChoixCloud(aLigne) {
		if (aLigne >= 0) {
			const lService = this.etatUtilisateur.listeCloud.get(aLigne);
			this._evenementSurBoutonPieceJoint(
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
				lService,
			);
		}
	}
}
exports._InterfaceContenuEtTAFCahierDeTextes =
	_InterfaceContenuEtTAFCahierDeTextes;

exports.UtilitaireDocument = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_AjoutImagesMultiple_1 = require("ObjetFenetre_AjoutImagesMultiple");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const UtilitaireDocumentCP_1 = require("UtilitaireDocumentCP");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
class UtilitaireDocument extends UtilitaireDocumentCP_1.UtilitaireDocumentCP {
	static getOptionsSelecFile() {
		return {
			maxSize: UtilitaireDocument.GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
			multiple: false,
		};
	}
	static ouvrirFenetreChoixTypeDeFichierADeposer(
		aCallbackDepotFichier,
		aParams = {},
	) {
		aParams = Object.assign(
			{
				avecFichierDepuisDocument: true,
				avecFichierDepuisCloud: false,
				avecPrendrePhoto: false,
				avecPrendrePlusieursImages: false,
				optionsSelecFile: {},
			},
			aParams,
		);
		const lAvecGestionAppareilPhoto =
			GEtatUtilisateur.avecGestionAppareilPhoto();
		const lThis = this;
		const lTabActions = [];
		let lOptionsSelecFileParDefault;
		if (!!aParams.avecFichierDepuisDocument) {
			lOptionsSelecFileParDefault = Object.assign(
				UtilitaireDocument.getOptionsSelecFile(),
				{},
			);
			lTabActions.push({
				libelle: IE.estMobile
					? ObjetTraduction_1.GTraductions.getValeur(
							"fenetre_ActionContextuelle.depuisMesDocuments",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"fenetre_ActionContextuelle.depuisMonPoste",
						),
				icon: "icon_folder_open",
				selecFile: true,
				optionsSelecFile: aParams.optionsSelecFile.fichierDepuisDocument
					? aParams.optionsSelecFile.fichierDepuisDocument
					: lOptionsSelecFileParDefault,
				event(aParamsInput) {
					if (aParamsInput) {
						if (aParams.callbackFichierDepuisDocument) {
							return aParams.callbackFichierDepuisDocument(aParamsInput);
						}
						if (aCallbackDepotFichier) {
							aCallbackDepotFichier(aParamsInput);
						}
					}
				},
				class: "bg-orange-claire",
			});
		}
		if (!!aParams.avecPrendrePhoto && lAvecGestionAppareilPhoto) {
			lOptionsSelecFileParDefault = Object.assign(
				UtilitaireDocument.getOptionsSelecFile(),
				{
					title: "",
					maxFiles: 0,
					genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					acceptDragDrop: false,
					capture: "environment",
					accept: "image/*",
				},
			);
			lTabActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"fenetre_ActionContextuelle.prendrePhoto",
				),
				icon: "icon_camera",
				event(aParamsInput) {
					if (aParamsInput) {
						if (aParams.callbackPrendrePhoto) {
							return aParams.callbackPrendrePhoto(aParamsInput);
						}
						if (aCallbackDepotFichier) {
							aCallbackDepotFichier(aParamsInput);
						}
					}
				},
				optionsSelecFile: aParams.optionsSelecFile.prendrePhoto
					? aParams.optionsSelecFile.prendrePhoto
					: lOptionsSelecFileParDefault,
				selecFile: true,
				class: "bg-orange-claire",
			});
		}
		if (
			aParams.avecFichierDepuisCloud &&
			GEtatUtilisateur.avecCloudDisponibles()
		) {
			const lCallback = aParams.callbackFichierDepuisDocument
				? aParams.callbackFichierDepuisDocument
				: aCallbackDepotFichier;
			lTabActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"fenetre_ActionContextuelle.depuisMonCloud",
				),
				icon: "icon_cloud",
				event() {
					UtilitaireDocument.ouvrirFenetreChoixFichierCloud.call(
						lThis,
						lCallback,
						aParams.fenetreFichierCloud,
					);
				},
				class: "bg-orange-claire",
			});
			if (GEtatUtilisateur.avecCloudENEJDisponible()) {
				const lActionENEJ =
					ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
						() => {
							var _a;
							UtilitaireDocument.ouvrirFenetreFichiersCloud.call(lThis, {
								service: GEtatUtilisateur.getCloudENEJ(),
								callback: lCallback,
								avecMonoSelection:
									(_a = aParams.fenetreFichierCloud) === null || _a === void 0
										? void 0
										: _a.avecMonoSelection,
							});
						},
					);
				if (lActionENEJ) {
					lTabActions.push(lActionENEJ);
				}
			}
		}
		if (aParams.avecPrendrePlusieursImages && lAvecGestionAppareilPhoto) {
			lOptionsSelecFileParDefault = Object.assign(
				UtilitaireDocument.getOptionsSelecFile(),
				{
					avecResizeImage: true,
					multiple: false,
					avecTransformationFlux: false,
					accept:
						UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().join(
							", ",
						),
					tailleMaxUploadFichier: UtilitaireDocument.GApplication.droits.get(
						ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
					),
				},
			);
			lTabActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"fenetre_ActionContextuelle.prendrePlusieursImages",
				).ucfirst(),
				icon: "icon_camera",
				event(aParamsInput) {
					if (aParamsInput) {
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_AjoutImagesMultiple_1.ObjetFenetre_AjoutImagesMultiple,
							{
								pere: this,
								evenement(aNumeroBouton, aListe) {
									if (aNumeroBouton === 0) {
										aParams.callbackPrendrePlusieursImages({
											listeFichiers: aListe,
										});
									}
								},
							},
						);
						const lDonnees = {
							liste:
								aParamsInput.listeFichiers ||
								new ObjetListeElements_1.ObjetListeElements(),
						};
						const lEstPasFichierValidePourPDF =
							aParamsInput.listeFichiers &&
							aParamsInput.listeFichiers.count() > 0 &&
							!UtilitaireDocumentCP_1.UtilitaireDocumentCP.estFichierValidePourPDF(
								aParamsInput.listeFichiers.get(0),
							);
						if (lEstPasFichierValidePourPDF) {
							GApplication.getMessage()
								.afficher({
									message: ObjetChaine_1.GChaine.format(
										ObjetTraduction_1.GTraductions.getValeur(
											"inputFile.echecImagePDF_S",
										),
										[aParamsInput.listeFichiers.get(0).getLibelle() || ""],
									),
								})
								.then(() =>
									lFenetre.setDonnees(
										Object.assign(lDonnees, {
											liste: new ObjetListeElements_1.ObjetListeElements(),
										}),
									),
								);
						} else {
							lFenetre.setDonnees(lDonnees);
						}
					}
				},
				optionsSelecFile: aParams.optionsSelecFile.prendrePlusieursImages
					? aParams.optionsSelecFile.prendrePlusieursImages
					: lOptionsSelecFileParDefault,
				selecFile: true,
				class: "bg-orange-claire",
			});
		}
		if (lTabActions.length === 1 && !aParams.idCtn) {
		}
		const lParams = {};
		if (lTabActions.length > 1) {
			lParams.optionsFenetre = { positionSurSouris: true };
			lParams.pere = this;
		}
		ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
			lTabActions,
			lParams,
		);
	}
	static ouvrirFenetreChoixFichierCloud(aCallbackDepotFichier, aParams = {}) {
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			{
				callbaskEvenement: (aLigne) => {
					if (aLigne >= 0) {
						const lService = GEtatUtilisateur.listeCloud.get(aLigne);
						UtilitaireDocument.ouvrirFenetreFichiersCloud({
							service: lService,
							callback: aCallbackDepotFichier,
							avecMonoSelection: aParams.avecMonoSelection,
						});
					}
				},
				modeGestion:
					UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
						.Cloud,
			},
		);
	}
	static ouvrirFenetreFichiersCloud(aParams) {
		const lFenetreChoixFichierDepuisCloud =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				{
					pere: this,
					evenement(aParam) {
						const lParams = { params: aParam };
						if (
							aParam &&
							aParam.listeNouveauxDocs &&
							aParam.listeNouveauxDocs.count() > 0
						) {
							return aParams.callback(
								Object.assign(lParams, {
									eltFichier: aParam.listeNouveauxDocs.get(0),
									listeFichiers: aParam.listeNouveauxDocs,
								}),
							);
						}
						aParams.callback(lParams);
					},
					initialiser(aFenetre) {
						aFenetre.setOptionsFenetre({
							estMonoSelection: !!aParams.avecMonoSelection,
						});
					},
				},
			);
		lFenetreChoixFichierDepuisCloud.setDonnees({
			service: aParams.service.getGenre(),
		});
	}
	static getTitleFromGenre(aGenre) {
		switch (aGenre) {
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Texte:
				return ObjetTraduction_1.GTraductions.getValeur("FichierTexte");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf:
				return ObjetTraduction_1.GTraductions.getValeur("FichierPDF");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Excel:
				return ObjetTraduction_1.GTraductions.getValeur("FichierExcel");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Archive:
				return ObjetTraduction_1.GTraductions.getValeur("FichierArchive");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Image:
				return ObjetTraduction_1.GTraductions.getValeur("FichierImage");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Son:
				return ObjetTraduction_1.GTraductions.getValeur("FichierSon");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Video:
				return ObjetTraduction_1.GTraductions.getValeur("FichierVideo");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Diapo:
				return ObjetTraduction_1.GTraductions.getValeur("FichierDiaporama");
			case Enumere_FormatDocJoint_1.EFormatDocJoint.Geogebra:
				return ObjetTraduction_1.GTraductions.getValeur("Fichier");
			default:
				return ObjetTraduction_1.GTraductions.getValeur("Fichier");
		}
	}
	static getTitleFromFileName(aNomFichier) {
		if (!aNomFichier) {
			return "";
		}
		const lSuffixe =
			ObjetChaine_1.GChaine.extraireExtensionFichier(aNomFichier);
		const lGenre =
			Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(lSuffixe);
		return UtilitaireDocument.getTitleFromGenre(lGenre);
	}
}
exports.UtilitaireDocument = UtilitaireDocument;
UtilitaireDocument.GApplication = GApplication;

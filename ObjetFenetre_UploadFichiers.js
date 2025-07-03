exports.ObjetFenetre_UploadFichiers = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Action_1 = require("Enumere_Action");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_UploadFichiers extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.optionsFenetreUpload = {
			libelleContexteFenetre: null,
			tailleMaxUploadFichier: 0,
			avecRetaillageImage: true,
			avecGenerationPDFImages: true,
			functionGetNomPdfGenere: null,
			avecAudioUniquement: false,
			avecUploadPlusieursImages: true,
			maxLengthAudio: 30,
		};
		this.donnees = {
			genreRessourcePJ: null,
			listeFichiersEnAttente: new ObjetListeElements_1.ObjetListeElements(),
		};
		this.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreUploadFichiers.Titre",
			),
			largeur: 400,
			hauteur: 320,
			listeBoutons: [],
		});
	}
	setOptions(aOptions) {
		$.extend(this.optionsFenetreUpload, aOptions);
		return this;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			BoutonUnSeulFichier: {
				getLibelle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreUploadFichiers.BoutonUnSeulFichier",
					);
				},
				getOptionsSelecFile: function () {
					const lObjet = {
						maxSize: aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
					};
					return lObjet;
				},
				addFiles: function (aParams) {
					aInstance.callback.appel(
						Enumere_Action_1.EGenreAction.Valider,
						new ObjetListeElements_1.ObjetListeElements().addElement(
							aParams.eltFichier,
						),
					);
				},
			},
			BoutonPlusieursImages: {
				getOptionsSelecFile: function () {
					const lOptionsSelecFile = {
						maxSize: aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
						multiple: true,
						maxFiles: 20,
						avecResizeImage: aInstance.optionsFenetreUpload.avecRetaillageImage,
					};
					if (!aInstance.optionsFenetreUpload.avecGenerationPDFImages) {
						lOptionsSelecFile.accept = "image/*";
					}
					if (aInstance.optionsFenetreUpload.avecGenerationPDFImages) {
						lOptionsSelecFile.genererPDFImages = true;
						lOptionsSelecFile.nomPDFaGenerer = aInstance._getNomPdfGenere();
						lOptionsSelecFile.avecTransformationFlux = false;
					}
					return lOptionsSelecFile;
				},
				addFiles: function (aParams) {
					aInstance.callback.appel(
						Enumere_Action_1.EGenreAction.Valider,
						aParams.listeFichiers,
					);
				},
			},
			BoutonAjoutImageUnique: {
				getOptionsSelecFile: function () {
					const lOptionsSelectFile = {
						avecResizeImage: aInstance.optionsFenetreUpload.avecRetaillageImage,
						maxSize: aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
						multiple: false,
						avecTransformationFlux: false,
					};
					if (aInstance.optionsFenetreUpload.avecGenerationPDFImages) {
						lOptionsSelectFile.accept =
							UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().join(
								", ",
							);
					}
					return lOptionsSelectFile;
				},
				addFiles: function (aParams) {
					const lFichier = aParams.eltFichier;
					aInstance.donnees.listeFichiersEnAttente.addElement(lFichier);
				},
			},
			getHtmlFichiersEnAttente: function () {
				return UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					aInstance.donnees.listeFichiersEnAttente,
					{
						genreRessource: aInstance.donnees.genreRessourcePJ,
						separateur: '<div class="InlineBlock" style="width:1rem;"> </div>',
						IEModelChips: "ChipsFichierEnAttente",
					},
				);
			},
			ChipsFichierEnAttente: {
				eventBtn: function (aIndice) {
					const lFichierASupp =
						aInstance.donnees.listeFichiersEnAttente.get(aIndice);
					if (!!lFichierASupp) {
						lFichierASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				},
			},
			BoutonEnvoiFichiersEnAttente: {
				event: function () {
					if (!!aInstance.donnees.listeFichiersEnAttente) {
						let lListeFichiersAEnvoyer =
							new ObjetListeElements_1.ObjetListeElements();
						lListeFichiersAEnvoyer =
							aInstance.donnees.listeFichiersEnAttente.getListeElements(
								(aElement) => {
									return aElement.existe();
								},
							);
						if (lListeFichiersAEnvoyer.count() > 0) {
							if (aInstance.optionsFenetreUpload.avecGenerationPDFImages) {
								const lNomPDF = aInstance._getNomPdfGenere();
								const lMessagesErreur = [];
								UtilitaireSelecFile_1.UtilitaireSelecFile.genererPdfAsync(
									lListeFichiersAEnvoyer,
									lMessagesErreur,
									lNomPDF,
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
								).then(() => {
									lListeFichiersAEnvoyer =
										UtilitaireSelecFile_1.UtilitaireSelecFile.controleTailleFichiers(
											lListeFichiersAEnvoyer,
											lMessagesErreur,
											aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
										);
									if (lMessagesErreur.length > 0) {
										return (0, AccessApp_1.getApp)()
											.getMessage()
											.afficher({ message: lMessagesErreur.join("<br>") });
									} else {
										const lFichierPdfGenere = lListeFichiersAEnvoyer.get(0);
										aInstance.callback.appel(
											Enumere_Action_1.EGenreAction.Valider,
											new ObjetListeElements_1.ObjetListeElements().addElement(
												lFichierPdfGenere,
											),
										);
									}
								});
							} else {
								aInstance.callback.appel(
									Enumere_Action_1.EGenreAction.Valider,
									lListeFichiersAEnvoyer,
								);
							}
						}
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees.listeFichiersEnAttente ||
						aInstance.donnees.listeFichiersEnAttente.getNbrElementsExistes() ===
							0
					);
				},
			},
		});
	}
	setDonnees(aGenreRessourcePieceJointe, aOptionsFenetre) {
		this.donnees.genreRessourcePJ = aGenreRessourcePieceJointe;
		if (!!aOptionsFenetre) {
			Object.assign(this.optionsFenetreUpload, aOptionsFenetre);
		}
	}
	afficher() {
		const lContenuFenetre = this.composeContenuFenetre();
		return super.afficher(lContenuFenetre);
	}
	_getNomPdfGenere() {
		let lNomPDF;
		if (!!this.optionsFenetreUpload.functionGetNomPdfGenere) {
			lNomPDF = this.optionsFenetreUpload.functionGetNomPdfGenere();
			if (!!lNomPDF) {
				lNomPDF = lNomPDF.replace(/ /g, "");
			}
		}
		if (!lNomPDF) {
			lNomPDF =
				ObjetDate_1.GDate.formatDate(
					ObjetDate_1.GDate.getDateHeureCourante(),
					"%JJ%MM%AAAA_%hh%mm%ss",
				) + ".pdf";
		}
		return lNomPDF;
	}
	_composeZoneAjoutImageUnique() {
		const H = [];
		H.push(
			'<div id="libelleExplicationSelectionUnique">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreUploadFichiers.SelectionUneParUne",
			),
			"</div>",
		);
		H.push(
			"<div>",
			'<ie-bouton ie-model="BoutonAjoutImageUnique" ie-selecfile class="BoutonSelecteurFichier ',
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreUploadFichiers.BoutonUneImage",
			),
			"</ie-bouton>",
			"</div>",
		);
		H.push(
			'<div id="listeFichiersEnAttente" ie-html="getHtmlFichiersEnAttente"></div>',
		);
		H.push(
			'<div id="wrapperBoutonEnvoiFichiersEnAttente">',
			'<ie-bouton ie-model="BoutonEnvoiFichiersEnAttente" class="',
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreUploadFichiers.EnvoyerImages",
			),
			"</ie-bouton>",
			"</div>",
		);
		return H.join("");
	}
	composeContenuFenetre() {
		const H = [];
		H.push('<div class="FenetreUploadFichiers">');
		if (!!this.optionsFenetreUpload.libelleContexteFenetre) {
			H.push(
				'<div id="libelleContexte">',
				this.optionsFenetreUpload.libelleContexteFenetre,
				"</div>",
			);
		}
		H.push('<div id="ChoixTypeUpload">');
		if (this.optionsFenetreUpload.avecUploadPlusieursImages) {
			H.push(
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreUploadFichiers.ChoisissezNatureFichier",
				),
				"</div>",
			);
		}
		H.push(
			"<div>",
			'<ie-bouton ie-model="BoutonUnSeulFichier" ie-selecfile class="BoutonSelecteurFichier ',
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			'">',
			"</ie-bouton>",
			"</div>",
		);
		if (this.optionsFenetreUpload.avecUploadPlusieursImages) {
			H.push(
				'<div id="libelleOu">',
				ObjetTraduction_1.GTraductions.getValeur("FenetreUploadFichiers.ou"),
				"</div>",
			);
			H.push(
				"<div>",
				'<ie-bouton ie-model="BoutonPlusieursImages" ie-selecfile class="BoutonSelecteurFichier ',
				Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				'">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreUploadFichiers.BoutonPlusieursImages",
				),
				"</ie-bouton>",
				"</div>",
			);
			H.push("</div>");
			H.push(
				'<div id="SelectionUnitaire">',
				this._composeZoneAjoutImageUnique(),
				"</div>",
			);
		}
		H.push("</div>");
		return H.join("");
	}
}
exports.ObjetFenetre_UploadFichiers = ObjetFenetre_UploadFichiers;

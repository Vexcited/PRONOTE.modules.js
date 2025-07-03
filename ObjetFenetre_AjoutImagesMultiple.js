exports.ObjetFenetre_AjoutImagesMultiple = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetChaine_1 = require("ObjetChaine");
const AccessApp_1 = require("AccessApp");
const UtilitaireDocumentCP_1 = require("UtilitaireDocumentCP");
class ObjetFenetre_AjoutImagesMultiple extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.id = {
			ctnChips: GUID_1.GUID.getId(),
			ctnImagesPreview: GUID_1.GUID.getId(),
		};
		this.optionsImagesMultiple = { avecChipsPJ: false, avecPreview: true };
		this.maxSize = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
		);
		this.setOptionsFenetre({
			hauteurMaxContenu: 600,
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreAjoutImagesMultiple.titre",
			),
			largeur: 380,
			hauteur: 200,
			fermerFenetreSurClicHorsFenetre: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAdd: {
				getOptionsSelecFile: function () {
					return {
						avecResizeImage: true,
						maxSize: aInstance.maxSize,
						multiple: false,
						avecTransformationFlux: false,
						accept:
							UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().join(
								", ",
							),
					};
				},
				addFiles: function (aParams) {
					if (aParams.listeFichiers && aParams.listeFichiers.count() > 0) {
						if (
							!UtilitaireDocumentCP_1.UtilitaireDocumentCP.estFichierValidePourPDF(
								aParams.listeFichiers.get(0),
							)
						) {
							GApplication.getMessage().afficher({
								message: ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"inputFile.echecImagePDF_S",
									),
									[aParams.listeFichiers.get(0).getLibelle() || ""],
								),
							});
						} else {
							aInstance._addFile(aParams);
						}
					}
				},
			},
			chips: {
				eventBtn: (aIndice) => {
					if (aInstance.optionsImagesMultiple.avecChipsPJ) {
						aInstance.liste.remove(aIndice);
						aInstance._updateAffichage();
					}
				},
			},
			avecPreview() {
				return (
					aInstance &&
					aInstance.optionsImagesMultiple &&
					aInstance.optionsImagesMultiple.avecPreview
				);
			},
			avecChipsPJ() {
				return (
					aInstance &&
					aInstance.optionsImagesMultiple &&
					aInstance.optionsImagesMultiple.avecChipsPJ
				);
			},
		});
	}
	setDonnees(aParam) {
		this.liste = aParam.liste || new ObjetListeElements_1.ObjetListeElements();
		this.afficher(this.composeContenu());
		this._updateAffichage();
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "ObjetFenetre_AjoutImagesMultiple", style: "height : 100%" },
			IE.jsx.str(
				"ie-bouton",
				{
					class: [
						Type_ThemeBouton_1.TypeThemeBouton.primaire,
						"btn-width",
						"m-top-l",
					],
					"ie-model": "btnAdd",
					"ie-selecFile": true,
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreAjoutImagesMultiple.deposerUneImage",
				),
			),
			IE.jsx.str("div", {
				class: "ctnChips",
				id: this.id.ctnChips,
				"ie-if": "avecChipsPJ",
			}),
			IE.jsx.str("div", {
				class: [
					"flex-contain cols",
					"m-top-l",
					"flex-gap-l",
					"ctnImagesPreview",
				],
				id: this.id.ctnImagesPreview,
				"ie-if": "avecPreview",
			}),
		);
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeRetour = this.liste.getListeElements((aElement) =>
				aElement.existe(),
			);
			if (lListeRetour.count() > 0) {
				const lNomPDF =
					UtilitaireDocumentCP_1.UtilitaireDocumentCP.getNomPdfGenere();
				const lMessagesErreur = [];
				UtilitaireSelecFile_1.UtilitaireSelecFile.genererPdfAsync(
					lListeRetour,
					lMessagesErreur,
					lNomPDF,
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
				).then(() => {
					const lListeFichiersAEnvoyer =
						UtilitaireSelecFile_1.UtilitaireSelecFile.controleTailleFichiers(
							lListeRetour,
							lMessagesErreur,
							this.maxSize,
						);
					if (lMessagesErreur.length > 0) {
						return GApplication.getMessage().afficher({
							message: lMessagesErreur.join("<br>"),
						});
					} else {
						const lFichierPdfGenere = lListeFichiersAEnvoyer.get(0);
						this.callback.appel(
							Enumere_Action_1.EGenreAction.Valider,
							new ObjetListeElements_1.ObjetListeElements().add(
								lFichierPdfGenere,
							),
						);
					}
				});
			}
		}
		this.fermer();
	}
	_updateAffichage() {
		if (this.optionsImagesMultiple.avecChipsPJ) {
			ObjetHtml_1.GHtml.setHtml(
				this.id.ctnChips,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(this.liste, {
					genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					genreRessource: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
					IEModelChips: "chips",
					class: "icon_fichier_image",
				}),
				{ controleur: this.controleur },
			);
		}
		if (this.optionsImagesMultiple.avecPreview) {
			this._construireListeImage();
		}
	}
	_construireListeImage() {
		ObjetHtml_1.GHtml.setHtml(this.id.ctnImagesPreview, "");
		this.liste.parcourir((aImage, aIndex) => {
			if (URL && URL.createObjectURL) {
				const lURL = URL.createObjectURL(aImage.file);
				if (lURL && aImage.file) {
					const lId = `${this.Nom}_image_${aIndex}`;
					ObjetHtml_1.GHtml.addHtml(
						this.id.ctnImagesPreview,
						IE.jsx.str("img", { id: lId }),
					);
					const lImg = $("#" + lId.escapeJQ());
					lImg.attr("src", lURL);
					lImg.on("destroyed", () => URL.revokeObjectURL(lURL));
				}
			}
		});
	}
	_addFile(aParams) {
		this.liste.add(aParams.listeFichiers);
		this._updateAffichage();
	}
}
exports.ObjetFenetre_AjoutImagesMultiple = ObjetFenetre_AjoutImagesMultiple;

const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireTraitementImage } = require("UtilitaireTraitementImage.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { UtilitaireSelecFile } = require("UtilitaireSelecFile.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreAction } = require("Enumere_Action.js");
const { UtilitaireAudio } = require("UtilitaireAudio.js");
require("IEHtml.VideoJS.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_UploadFichiers extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			modale: true,
			titre: GTraductions.getValeur("FenetreUploadFichiers.Titre"),
			largeur: 400,
			hauteur: 320,
			listeBoutons: [],
		});
		this.optionsFenetreUpload = {
			libelleContexteFenetre: null,
			tailleMaxUploadFichier: 0,
			avecRetaillageImage: true,
			avecGenerationPDFImages: true,
			functionGetNomPdfGenere: null,
			avecEnregistrement: false,
			avecAudioUniquement: false,
			avecUploadPlusieursImages: true,
			maxLengthAudio: 30,
		};
		this.idvideo = GUID.getId();
		this.donnees = {
			genreRessourcePJ: null,
			listeFichiersEnAttente: new ObjetListeElements(),
		};
	}
	setOptions(aOptions) {
		$.extend(this.optionsFenetreUpload, aOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			BoutonFichierAudio: {
				getDisabled: function () {
					return (
						!aInstance.api_videoJS ||
						!!aInstance.api_videoJS.getDuration() === false
					);
				},
				event: function () {
					const lListeFichier = new ObjetListeElements();
					UtilitaireSelecFile.addFileDansListe(
						aInstance.api_videoJS.getRecordedData(),
						lListeFichier,
						aInstance.donnees.genreRessourcePJ,
					);
					aInstance.callback.appel(EGenreAction.Valider, lListeFichier);
				},
			},
			BoutonUnSeulFichier: {
				getLibelle: function () {
					if (
						aInstance.optionsFenetreUpload.avecAudioUniquement &&
						!aInstance.optionsFenetreUpload.avecUploadPlusieursImages
					) {
						return GTraductions.getValeur(
							"FenetreUploadFichiers.BoutonFichierAudio",
						);
					} else {
						return GTraductions.getValeur(
							"FenetreUploadFichiers.BoutonUnSeulFichier",
						);
					}
				},
				getOptionsSelecFile: function () {
					const lObjet = {
						maxSize: aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
					};
					if (
						aInstance.optionsFenetreUpload.avecAudioUniquement &&
						!aInstance.optionsFenetreUpload.avecUploadPlusieursImages
					) {
						lObjet.accept = UtilitaireAudio.getTypeMimeAudio();
						lObjet.avecTransformationFlux = false;
					}
					return lObjet;
				},
				addFiles: function (aParams) {
					aInstance.callback.appel(
						EGenreAction.Valider,
						new ObjetListeElements().addElement(aParams.eltFichier),
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
						lOptionsSelecFile.nomPDFaGenerer = _getNomPdfGenere.call(aInstance);
						lOptionsSelecFile.avecTransformationFlux = false;
					}
					return lOptionsSelecFile;
				},
				addFiles: function (aParams) {
					aInstance.callback.appel(EGenreAction.Valider, aParams.listeFichiers);
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
							UtilitaireTraitementImage.getTabMimePDFImage().join(", ");
					}
					return lOptionsSelectFile;
				},
				addFiles: function (aParams) {
					const lFichier = aParams.eltFichier;
					aInstance.donnees.listeFichiersEnAttente.addElement(lFichier);
				},
			},
			getHtmlFichiersEnAttente: function () {
				return UtilitaireUrl.construireListeUrls(
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
						lFichierASupp.setEtat(EGenreEtat.Suppression);
					}
				},
			},
			BoutonEnvoiFichiersEnAttente: {
				event: function () {
					if (!!aInstance.donnees.listeFichiersEnAttente) {
						let lListeFichiersAEnvoyer = new ObjetListeElements();
						lListeFichiersAEnvoyer =
							aInstance.donnees.listeFichiersEnAttente.getListeElements(
								(aElement) => {
									return aElement.existe();
								},
							);
						if (lListeFichiersAEnvoyer.count() > 0) {
							if (aInstance.optionsFenetreUpload.avecGenerationPDFImages) {
								const lNomPDF = _getNomPdfGenere.call(aInstance);
								const lMessagesErreur = [];
								UtilitaireSelecFile.genererPdfAsync(
									lListeFichiersAEnvoyer,
									lMessagesErreur,
									lNomPDF,
									EGenreDocumentJoint.Fichier,
								).then(() => {
									lListeFichiersAEnvoyer =
										UtilitaireSelecFile.controleTailleFichiers(
											lListeFichiersAEnvoyer,
											lMessagesErreur,
											aInstance.optionsFenetreUpload.tailleMaxUploadFichier,
										);
									if (lMessagesErreur.length > 0) {
										return GApplication.getMessage().afficher({
											message: lMessagesErreur.join("<br>"),
										});
									} else {
										const lFichierPdfGenere = lListeFichiersAEnvoyer.get(0);
										aInstance.callback.appel(
											EGenreAction.Valider,
											new ObjetListeElements().addElement(lFichierPdfGenere),
										);
									}
								});
							} else {
								aInstance.callback.appel(
									EGenreAction.Valider,
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
			GetVideo: {
				api: function (aApi) {
					aInstance.api_videoJS = aApi;
				},
				getOptions: function () {
					return {
						plugins: {
							record: {
								image: false,
								audio: true,
								video: false,
								maxLength: aInstance.optionsFenetreUpload.maxLengthAudio,
							},
						},
					};
				},
			},
		});
	}
	fermer() {
		super.fermer();
		if (this.optionsFenetreUpload.avecEnregistrement && this.idvideo) {
			const lPlayer = videojs(this.idvideo);
			const lPlayerRecord = !!lPlayer && lPlayer.record();
			if (!!lPlayerRecord && !!lPlayerRecord.stopDevice) {
				lPlayerRecord.stopDevice();
			}
		}
	}
	setDonnees(aGenreRessourcePieceJointe, aOptionsFenetre) {
		this.donnees.genreRessourcePJ = aGenreRessourcePieceJointe;
		if (!!aOptionsFenetre) {
			Object.assign(this.optionsFenetreUpload, aOptionsFenetre);
		}
	}
	afficher() {
		const lContenuFenetre = composeContenuFenetre.call(this);
		super.afficher(lContenuFenetre);
	}
}
function _getNomPdfGenere() {
	let lNomPDF;
	if (!!this.optionsFenetreUpload.functionGetNomPdfGenere) {
		lNomPDF = this.optionsFenetreUpload.functionGetNomPdfGenere();
		if (!!lNomPDF) {
			lNomPDF = lNomPDF.replace(/ /g, "");
		}
	}
	if (!lNomPDF) {
		lNomPDF =
			GDate.formatDate(GDate.getDateHeureCourante(), "%JJ%MM%AAAA_%hh%mm%ss") +
			".pdf";
	}
	return lNomPDF;
}
function _composeZoneAjoutImageUnique() {
	const H = [];
	H.push(
		'<div id="libelleExplicationSelectionUnique">',
		GTraductions.getValeur("FenetreUploadFichiers.SelectionUneParUne"),
		"</div>",
	);
	H.push(
		"<div>",
		'<ie-bouton ie-model="BoutonAjoutImageUnique" ie-selecfile class="BoutonSelecteurFichier ',
		TypeThemeBouton.secondaire,
		'">',
		GTraductions.getValeur("FenetreUploadFichiers.BoutonUneImage"),
		"</ie-bouton>",
		"</div>",
	);
	H.push(
		'<div id="listeFichiersEnAttente" ie-html="getHtmlFichiersEnAttente"></div>',
	);
	H.push(
		'<div id="wrapperBoutonEnvoiFichiersEnAttente">',
		'<ie-bouton ie-model="BoutonEnvoiFichiersEnAttente" class="',
		TypeThemeBouton.secondaire,
		'">',
		GTraductions.getValeur("FenetreUploadFichiers.EnvoyerImages"),
		"</ie-bouton>",
		"</div>",
	);
	return H.join("");
}
function composeContenuFenetre() {
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
	if (
		this.optionsFenetreUpload.avecEnregistrement ||
		this.optionsFenetreUpload.avecUploadPlusieursImages
	) {
		H.push(
			"<div>",
			GTraductions.getValeur("FenetreUploadFichiers.ChoisissezNatureFichier"),
			"</div>",
		);
	}
	if (this.optionsFenetreUpload.avecEnregistrement) {
		H.push(
			'<div style="display: flex; flex-direction: column; align-items: center;">',
			'<ie-videojs id="',
			this.idvideo,
			'" ie-model="GetVideo"></ie-videojs>',
			'<ie-bouton ie-model="BoutonFichierAudio" class="BoutonSelecteurFichier ',
			TypeThemeBouton.secondaire,
			'">',
			GTraductions.getValeur("FenetreUploadFichiers.deposerAudio"),
			"</ie-bouton>",
			"</div>",
		);
		H.push(
			'<div id="libelleOu">',
			GTraductions.getValeur("FenetreUploadFichiers.ou"),
			"</div>",
		);
	}
	H.push(
		"<div>",
		'<ie-bouton ie-model="BoutonUnSeulFichier" ie-selecfile class="BoutonSelecteurFichier ',
		TypeThemeBouton.secondaire,
		'">',
		"</ie-bouton>",
		"</div>",
	);
	if (this.optionsFenetreUpload.avecUploadPlusieursImages) {
		H.push(
			'<div id="libelleOu">',
			GTraductions.getValeur("FenetreUploadFichiers.ou"),
			"</div>",
		);
		H.push(
			"<div>",
			'<ie-bouton ie-model="BoutonPlusieursImages" ie-selecfile class="BoutonSelecteurFichier ',
			TypeThemeBouton.secondaire,
			'">',
			GTraductions.getValeur("FenetreUploadFichiers.BoutonPlusieursImages"),
			"</ie-bouton>",
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<div id="SelectionUnitaire">',
			_composeZoneAjoutImageUnique.call(this),
			"</div>",
		);
	}
	H.push("</div>");
	return H.join("");
}
module.exports = { ObjetFenetre_UploadFichiers };

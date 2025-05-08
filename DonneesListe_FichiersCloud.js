exports.DonneesListe_FichiersCloud = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
const TTypeElementCloud_1 = require("TTypeElementCloud");
const TTypeElementCloud_2 = require("TTypeElementCloud");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const ObjetChaine_1 = require("ObjetChaine");
const tag_1 = require("tag");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListeElements_1 = require("ObjetListeElements");
class DonneesListe_FichiersCloud extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		const lListe = new ObjetListeElements_1.ObjetListeElements().add(
			aDonnees || new ObjetListeElements_1.ObjetListeElements(),
		);
		super(lListe);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_Selection: true,
			repertoirePere: null,
			estMonoSelection: false,
			uniquementRepertoireVisible: false,
			avecSelectionRepertoire: true,
			avecFormat: false,
		});
	}
	getIconeGaucheContenuFormate(aParams) {
		if (
			aParams.article.getGenre() ===
			TTypeElementCloud_1.TTypeElementCloud.tec_Fichier
		) {
			return Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
				Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
					ObjetChaine_1.GChaine.extraireExtensionFichier(
						aParams.article.getLibelle(),
					),
				),
			);
		}
		return "icon_folder_close";
	}
	getHintIconeGaucheContenuFormate(aParams) {
		if (
			aParams.article.getGenre() ===
			TTypeElementCloud_1.TTypeElementCloud.tec_Dossier
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"FenetreCloud.Hint_Repertoire",
			);
		}
		return "";
	}
	getZoneComplementaire(aParams) {
		if (
			aParams.article.getGenre() ===
			TTypeElementCloud_1.TTypeElementCloud.tec_Fichier
		) {
			return ObjetChaine_1.GChaine.tailleOctetsToStr(aParams.article.taille);
		}
		return "";
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.zoneComplementaire
		) {
			const lStr = this.getZoneComplementaire(aParams);
			if (lStr) {
				return `${ObjetTraduction_1.GTraductions.getValeur("FenetreCloud.TailleFichierCloud")} : ${lStr}`;
			}
		}
		return ``;
	}
	getZoneMessage(aParams) {
		if (
			this.options.avecFormat &&
			aParams.article.getGenre() ===
				TTypeElementCloud_1.TTypeElementCloud.tec_Fichier
		) {
			const lVal =
				aParams.article.formatPub ===
				TTypeElementCloud_2.TypeFormatPublication.FP_Natif
					? ObjetTraduction_1.GTraductions.getValeur(
							"FenetreCloud.FormatOrigine",
						)
					: aParams.article.formatPub ===
							TTypeElementCloud_2.TypeFormatPublication.FP_Pdf
						? ObjetTraduction_1.GTraductions.getValeur("FenetreCloud.FormatPdf")
						: "-";
			return (0, tag_1.tag)(
				"p",
				{ class: "color-theme-foncee" },
				`${ObjetTraduction_1.GTraductions.getValeur("FenetreCloud.FormatPublication")} : ${lVal}`,
			);
		}
		return "";
	}
	avecSelection(aParams) {
		return (
			aParams.article.getGenre() ===
			TTypeElementCloud_1.TTypeElementCloud.tec_Dossier
		);
	}
	avecCB(aParams) {
		if (
			aParams.article.getGenre() ===
			TTypeElementCloud_1.TTypeElementCloud.tec_Dossier
		) {
			return !!this.options.avecSelectionRepertoire;
		}
		return true;
	}
	setValueCB(aParams, aValue) {
		if (aValue && this.options.estMonoSelection) {
			this.Donnees.parcourir((aArticle) => {
				if (aArticle.estCoche) {
					aArticle.estCoche = false;
				}
			});
		}
		aParams.article.estCoche = aValue;
	}
	getVisible(aArticle) {
		return this.options.uniquementRepertoireVisible
			? aArticle.getGenre() ===
					TTypeElementCloud_1.TTypeElementCloud.tec_Dossier
			: true;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init(
				"Genre",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
}
exports.DonneesListe_FichiersCloud = DonneesListe_FichiersCloud;

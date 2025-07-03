exports.UtilitaireDocumentCP = void 0;
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
class UtilitaireDocumentCP {
	static getIconFromFileName(aNomFichier) {
		let lClass = "";
		if (aNomFichier) {
			const lSuffixe =
				ObjetChaine_1.GChaine.extraireExtensionFichier(aNomFichier);
			lClass = Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
				Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
					lSuffixe,
				),
			);
		}
		return lClass;
	}
	static ouvrirUrl(aDocument, aParams = {}) {
		const lParams = Object.assign({ forcerURLComplete: true }, aParams);
		const lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
			aDocument,
			lParams,
		);
		window.open(lUrl);
	}
	static getIconPDF() {
		return Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
			Enumere_FormatDocJoint_1.EFormatDocJoint.Pdf,
		);
	}
	static getNomPdfGenere() {
		let lNomPDF;
		lNomPDF =
			GEtatUtilisateur.getMembre().getLibelle() +
			"_" +
			ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.getDateHeureCourante(),
				"%JJ%MM%AAAA_%hh%mm%ss",
			) +
			".pdf";
		if (!!lNomPDF) {
			lNomPDF = lNomPDF.replace(/ /g, "");
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
	static estFichierValidePourPDF(aFichier) {
		return (
			aFichier &&
			aFichier.file &&
			aFichier.file.type &&
			UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().includes(
				aFichier.file.type,
			)
		);
	}
}
exports.UtilitaireDocumentCP = UtilitaireDocumentCP;

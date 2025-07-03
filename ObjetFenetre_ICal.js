exports.ObjetFenetre_ICal = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const _ObjetFenetre_ICal_1 = require("_ObjetFenetre_ICal");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireQRCode_1 = require("UtilitaireQRCode");
require("DeclarationQRCode.js");
const TypeGenreICal_1 = require("TypeGenreICal");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class ObjetFenetre_ICal extends _ObjetFenetre_ICal_1._ObjetFenetre_ICal {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
	}
	setLien(aSansRessource) {
		const lSansRessource = !!aSansRessource ? aSansRessource : false;
		let lParams = "fh=" + this.fuseauHoraire;
		if (!this.semainesPubliees) {
			lParams +=
				"&d=" +
				ObjetChaine_1.GChaine.domaineToStr(
					GEtatUtilisateur.getDomaineSelectionne(),
				);
		}
		if (this.genreICal) {
			lParams += "&o=" + this.genreICal;
		}
		let lHref;
		let lInformationMasquee;
		if (!lSansRessource) {
			lHref =
				"ical/" +
				TypeGenreICal_1.TypeGenreICalUtil.getPrefixICal(this.genreICal) +
				".ics";
			lInformationMasquee =
				"icalsecurise=" +
				this.ParametreExportICal +
				"&version=" +
				GParametres.versionPN;
		} else {
			lHref = "ical/exportSalles.ics";
			lInformationMasquee =
				"icalSansRessource=Salles&version=" + GParametres.versionPN;
		}
		lHref =
			lHref +
			"?" +
			lInformationMasquee +
			"&param=" +
			new forge.util.ByteBuffer(lParams).toHex();
		ObjetHtml_1.GHtml.setLien(this.idHrefICal, lHref);
		const lLienNavigateur = ObjetNavigateur_1.Navigateur.getHost() + lHref;
		ObjetHtml_1.GHtml.setValue(
			this.idLienPermanent,
			ObjetChaine_1.GChaine.encoderUrl(lLienNavigateur),
		);
		$("#" + this.idQRCode.escapeJQ()).html(
			UtilitaireQRCode_1.UtilitaireQRCode.genererImage(lLienNavigateur, {
				alt: ObjetTraduction_1.GTraductions.getValeur(
					"iCal.modes.synchro.qrCodeAlt",
				),
			}),
		);
	}
	getTraductionsSousTitre2() {
		return ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.sousTitre2")[
			this.genreICal
		];
	}
	getTraductionsRecupererFichier() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"iCal.fenetre.recupererFichier",
		)[this.genreICal];
	}
	getTraductionsRecupererSousTitreFichier() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"iCal.fenetre.recupererSousTitreFichier",
		)[this.genreICal];
	}
	getTraductionsSynchroniser() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"iCal.fenetre.synchroniser",
		)[this.genreICal];
	}
	getTraductionsSynchroniserSousTitre() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"iCal.fenetre.synchroniserSousTitre",
		)[this.genreICal];
	}
	getTraductionsICalExporter() {
		return ObjetTraduction_1.GTraductions.getValeur("iCal.hint")[
			this.genreICal
		];
	}
}
exports.ObjetFenetre_ICal = ObjetFenetre_ICal;

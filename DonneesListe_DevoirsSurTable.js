const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreLienDS } = require("Enumere_LienDS.js");
const {
	TypeOrigineCreationCategorieCahierDeTexte,
	TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
class DonneesListe_DevoirsSurTable extends ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.params = aParams;
		this.setOptions({
			avecEdition: false,
			avecEtatSaisie: false,
			avecEvnt_Suppression: true,
		});
	}
	avecSuppression(aParams) {
		return !!aParams.article.editable;
	}
	getMessageSuppressionConfirmation() {
		return GTraductions.getValeur(
			"ListeDevoirSurTable.ConfirmerSuppressionContenu",
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DevoirsSurTable.colonnes.info:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DevoirsSurTable.colonnes.date:
				return !!aParams.article.date
					? GDate.formatDate(
							aParams.article.date,
							GTraductions.getValeur("Le") +
								" %JJ %MMMM %AAAA " +
								GTraductions.getValeur("A") +
								" %xh%sh%mm",
						)
					: "";
			case DonneesListe_DevoirsSurTable.colonnes.prof:
				return aParams.article.strProfesseurs;
			case DonneesListe_DevoirsSurTable.colonnes.public:
				return aParams.article.strPublic;
			case DonneesListe_DevoirsSurTable.colonnes.matiere:
				return aParams.article.strMatiere;
			case DonneesListe_DevoirsSurTable.colonnes.salle:
				return aParams.article.strSalle;
			case DonneesListe_DevoirsSurTable.colonnes.info: {
				const lTypeOrigineCDT =
					aParams.article.getGenre() === EGenreLienDS.tGL_Devoir
						? TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
						: TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation;
				const lImage =
					TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
						lTypeOrigineCDT,
					);
				return (
					'<div style="position:relative">' +
					'<div class="' +
					lImage +
					'" style="position:absolute;top:-2px;"></div>' +
					(aParams.article.strInfosLien
						? '<div class="GrandEspaceGauche">' +
							aParams.article.strInfosLien +
							"</div>"
						: "&nbsp;") +
					"</div>"
				);
			}
		}
		return "";
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			1,
			GTraductions.getValeur("liste.modifier"),
			!!aParametres.article.editable && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addCommande(
			EGenreCommandeMenu.Suppression,
			GTraductions.getValeur("liste.supprimer"),
			this.avecSuppression(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		if (
			aParametres.numeroMenu === 1 &&
			this.params &&
			this.params.callbackModifier
		) {
			aParametres.avecActualisation = false;
			this.params.callbackModifier(aParametres.article);
		}
	}
	getTri(aColonne, aGenreTri) {
		const lTris = [];
		lTris.push(ObjetTri.init("date", aGenreTri));
		return lTris;
	}
}
DonneesListe_DevoirsSurTable.colonnes = {
	date: "DL_DevoirsSurT_date",
	prof: "DL_DevoirsSurT_prof",
	public: "DL_DevoirsSurT_public",
	matiere: "DL_DevoirsSurT_matiere",
	salle: "DL_DevoirsSurT_salle",
	info: "DL_DevoirsSurT_info",
};
module.exports = { DonneesListe_DevoirsSurTable };

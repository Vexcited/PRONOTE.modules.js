exports.DonneesListe_DevoirsSurTable = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
class DonneesListe_DevoirsSurTable extends ObjetDonneesListe_1.ObjetDonneesListe {
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
		return ObjetTraduction_1.GTraductions.getValeur(
			"ListeDevoirSurTable.ConfirmerSuppressionContenu",
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DevoirsSurTable.colonnes.info:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DevoirsSurTable.colonnes.date:
				return !!aParams.article.date
					? ObjetDate_1.GDate.formatDate(
							aParams.article.date,
							ObjetTraduction_1.GTraductions.getValeur("Le") +
								" %JJ %MMMM %AAAA " +
								ObjetTraduction_1.GTraductions.getValeur("A") +
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
					aParams.article.getGenre() ===
					Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
						? TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
						: TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte
								.OCCCDT_Pre_Evaluation;
				const lLibelleIcone = ObjetTraduction_1.GTraductions.getValeur(
					aParams.article.getGenre() ===
						Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
						? "CahierDeTexte.iconeDS"
						: "CahierDeTexte.iconeEval",
				);
				const lImage =
					TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
						lTypeOrigineCDT,
					);
				return aParams.article.strInfosLien
					? `<div><i class="${lImage}" role="presentation">${lLibelleIcone}</i>${aParams.article.strInfosLien}</div>`
					: "&nbsp;";
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
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
			!!aParametres.article.editable && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
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
		lTris.push(ObjetTri_1.ObjetTri.init("date", aGenreTri));
		return lTris;
	}
}
exports.DonneesListe_DevoirsSurTable = DonneesListe_DevoirsSurTable;
(function (DonneesListe_DevoirsSurTable) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "DL_DevoirsSurT_date";
		colonnes["prof"] = "DL_DevoirsSurT_prof";
		colonnes["public"] = "DL_DevoirsSurT_public";
		colonnes["matiere"] = "DL_DevoirsSurT_matiere";
		colonnes["salle"] = "DL_DevoirsSurT_salle";
		colonnes["info"] = "DL_DevoirsSurT_info";
	})(
		(colonnes =
			DonneesListe_DevoirsSurTable.colonnes ||
			(DonneesListe_DevoirsSurTable.colonnes = {})),
	);
})(
	DonneesListe_DevoirsSurTable ||
		(exports.DonneesListe_DevoirsSurTable = DonneesListe_DevoirsSurTable = {}),
);

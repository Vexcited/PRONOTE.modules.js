exports.DonneesListe_SuiviStage = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_SuiviStage extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.parametres = aParametres;
		this.setOptions({
			avecSelection: true,
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	getClassCelluleConteneur() {
		return "AvecMain";
	}
	getZoneGauche(aParams) {
		const H = [];
		const lSuivi = aParams.article;
		H.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"time",
					{
						class: [
							"date-contain",
							lSuivi.evenement.couleur ? "ie-line-color bottom" : "",
						],
						style: { "--color-line": lSuivi.evenement.couleur },
						datetime: ObjetDate_1.GDate.formatDate(lSuivi.date, "%MM-%JJ"),
					},
					ObjetDate_1.GDate.formatDate(lSuivi.date, "%JJ %MMM"),
				),
			),
		);
		return H.join("");
	}
	getTitreZonePrincipale(aParams) {
		const lSuivi = aParams.article;
		return IE.jsx.str(
			"div",
			{ class: "ie-titre Gras" },
			lSuivi.evenement.getLibelle(),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		const lSuivi = aParams.article;
		return IE.jsx.str(
			"div",
			{ class: "ie-titre-petit" },
			(!!lSuivi.strResponsable ? lSuivi.strResponsable : "") +
				(!!lSuivi.responsable ? lSuivi.responsable.getLibelle() : "") +
				_getStringStatut(lSuivi),
		);
	}
	getZoneMessage(aParams) {
		const lSuivi = aParams.article;
		return IE.jsx.str(
			"div",
			{ class: "conteneur-commentaire-court" },
			lSuivi.commentaire,
		);
	}
	getZoneComplementaire(aParams) {
		const H = [];
		const lSuivi = aParams.article;
		H.push(
			lSuivi.avecHeure
				? IE.jsx.str(
						"div",
						{ class: "conteneur-heure" },
						ObjetDate_1.GDate.formatDate(lSuivi.date, "%hh%sh%mm"),
					)
				: "",
			IE.jsx.str(
				"div",
				{ class: "flex-contain" },
				!!lSuivi.listePJ && lSuivi.listePJ.count()
					? IE.jsx.str("i", { class: "icon_piece_jointe" })
					: "",
				this.parametres.avecEditionSuivisDeStage && !!lSuivi.editable
					? IE.jsx.str("i", {
							class: lSuivi.publier
								? "icon_info_sondage_publier"
								: "icon_info_sondage_non_publier",
						})
					: "",
			),
		);
		return H.join("");
	}
}
exports.DonneesListe_SuiviStage = DonneesListe_SuiviStage;
function _getStringStatut(aSuivi) {
	if (!aSuivi) {
		return "";
	}
	if (aSuivi.estMaitreDeStage) {
		return (
			" (" +
			ObjetTraduction_1.GTraductions.getValeur("FicheStage.maitreDeStage") +
			")"
		);
	} else if (aSuivi.estMaitreOuTuteur) {
		return (
			" (" +
			ObjetTraduction_1.GTraductions.getValeur("FicheStage.maitreOuTuteur") +
			")"
		);
	} else if (aSuivi.estTuteur) {
		return (
			" (" +
			ObjetTraduction_1.GTraductions.getValeur("FicheStage.enseignTuteur") +
			")"
		);
	} else if (aSuivi.estResponsable) {
		return (
			" (" +
			ObjetTraduction_1.GTraductions.getValeur("FicheStage.enseignResp") +
			")"
		);
	} else {
		return "";
	}
}

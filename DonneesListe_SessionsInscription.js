exports.DonneesListe_SessionsInscription = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const TypeOrigineCreationEtatDemandeInscription_1 = require("TypeOrigineCreationEtatDemandeInscription");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
class DonneesListe_SessionsInscription extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeSessions) {
		super(aListeSessions);
		this.setOptions({
			avecTri: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: false,
			avecIndentationSousInterTitre: true,
			avecEvnt_Selection: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.estUneDemande
			? aParams.article.libelleSession
			: aParams.article.getLibelle();
	}
	getZoneMessage(aParams) {
		const lStr = [];
		lStr.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.ouvertJusquau",
				[
					ObjetDate_1.GDate.formatDate(
						aParams.article.dateFin,
						"%JJ/%MM/%AAAA",
					),
				],
			),
		);
		if (aParams.article.estUneDemande) {
			lStr.push(aParams.article.nomElevePostulant);
		}
		return lStr.join("<br>");
	}
	getZoneGauche(aParams) {
		if (aParams.article.estInterTitre) {
			return "";
		}
		let lIcon = "";
		let lLibelle = "";
		if (aParams.article.estUneDemande) {
			lIcon =
				TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
					aParams.article.etatDemande,
				);
			lLibelle =
				TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
					aParams.article.etatDemande,
				);
		} else {
			lIcon = "icon_th_list";
			if (aParams.article.limiteAtteinte) {
				lLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.limiteAtteinte",
				);
				lIcon += " mix-icon_remove";
			}
		}
		return IE.jsx.str("i", {
			class: lIcon,
			"ie-tooltiplabel": lLibelle,
			role: "presentation",
		});
	}
}
exports.DonneesListe_SessionsInscription = DonneesListe_SessionsInscription;

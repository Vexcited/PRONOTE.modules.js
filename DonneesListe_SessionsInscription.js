const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const {
	TypeOrigineCreationEtatDemandeInscriptionUtil,
} = require("TypeOrigineCreationEtatDemandeInscription.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { tag } = require("tag.js");
class DonneesListe_SessionsInscription extends ObjetDonneesListeFlatDesign {
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
			GTraductions.getValeur("inscriptionsEtablissement.ouvertJusquau", [
				GDate.formatDate(aParams.article.dateFin, "%JJ/%MM/%AAAA"),
			]),
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
			lIcon = TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
				aParams.article.etatDemande,
			);
			lLibelle = TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
				aParams.article.etatDemande,
			);
		} else {
			lIcon = "icon_th_list";
			if (aParams.article.limiteAtteinte) {
				lLibelle = GTraductions.getValeur(
					"inscriptionsEtablissement.limiteAtteinte",
				);
				lIcon += " mix-icon_remove";
			}
		}
		return tag("i", { class: [lIcon], title: lLibelle });
	}
}
DonneesListe_SessionsInscription.colonnes = {
	libelle: "sessionInscription_libelle",
};
module.exports = { DonneesListe_SessionsInscription };

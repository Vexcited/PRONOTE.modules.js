exports.ObjetPageCompte_Parent = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetPageCompte_1 = require("ObjetPageCompte");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetPageCompte_Parent extends ObjetPageCompte_1.ObjetPageCompte {
	constructor(...aParams) {
		super(...aParams);
		this.listeEleves = null;
		$.extend(this.parametres, {
			largeurEleve: 150,
			largeurColonneGauche: 130,
			hauteurTitre: 40,
			hauteurEleve: 60,
		});
		this.construireAutorisationsSupp = () => {
			const lHtml = [];
			if (this.donnees.Autorisations.listeEleves.count() > 0) {
				lHtml.push(
					'<div class="Gras EspaceHaut" style="clear:both;">',
					ObjetTraduction_1.GTraductions.getValeur("infosperso.titreRecevoir"),
					"</div>",
				);
			}
			return lHtml.join("");
		};
	}
	getStructurePourValidation(aStructure) {
		const lResult = super.getStructurePourValidation(aStructure);
		if (!lResult) {
			return lResult;
		}
		if (
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoAutorisations,
			)
		) {
			if (this.donnees.Autorisations.estDestinataireInfosGenerales !== null) {
				aStructure.autorisations.estDestinataireInfosGenerales =
					this.donnees.Autorisations.estDestinataireInfosGenerales;
			}
			aStructure.autorisations.listeEleves = [];
			for (let i = 0; i < this.donnees.Autorisations.listeEleves.count(); i++) {
				let lEleve = this.donnees.Autorisations.listeEleves.get(i);
				let lJSONEleve = lEleve.toJSON();
				aStructure.autorisations.listeEleves.push(lJSONEleve);
				lJSONEleve.estDestinataireBulletin = lEleve.estDestinataireBulletin;
				lJSONEleve.estDestinataireInfosEleve = lEleve.estDestinataireInfosEleve;
				lJSONEleve.estDestinataireInfosProfesseur =
					lEleve.estDestinataireInfosProfesseur;
			}
		}
		return true;
	}
}
exports.ObjetPageCompte_Parent = ObjetPageCompte_Parent;

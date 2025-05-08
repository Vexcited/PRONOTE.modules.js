const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GCache } = require("Cache.js");
class ObjetRequetePageResultatsClasses extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.cache = GCache.resultatsClasses;
	}
	lancerRequete(
		aClasse,
		aPeriode,
		aAbsences,
		aCompetences,
		aAvecSousServices,
		aUniquementSousServices,
		aMatiereEquivalence,
		aParamBulletin,
		aMasquerSansNotes,
		aAvecCouleurMoyenne,
		aTypeMoyenne,
	) {
		this.classeCourant = aClasse;
		this.periodeCourant = aPeriode;
		const lJSON = {
			classe: aClasse,
			periode: aPeriode,
			absences: aAbsences,
			competences: aCompetences,
			afficherSousServices: aAvecSousServices,
			afficherSeulementSousServices: aUniquementSousServices,
			matiereEquivalence: aMatiereEquivalence,
			paramBulletin: aParamBulletin,
			masquerSansNotes: aMasquerSansNotes,
			typeCalculMoyenne: aTypeMoyenne,
			avecCouleurMoyenne: aAvecCouleurMoyenne,
		};
		$.extend(this.JSON, lJSON);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lDonnees = this.JSONReponse;
		this.callbackReussite.appel(lDonnees);
	}
}
Requetes.inscrire("ResultatsClasses", ObjetRequetePageResultatsClasses);
module.exports = { ObjetRequetePageResultatsClasses };

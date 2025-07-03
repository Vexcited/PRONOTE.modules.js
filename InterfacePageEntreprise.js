exports.InterfacePageEntreprise = void 0;
const PageEntreprise_1 = require("PageEntreprise");
const ObjetRequetePageEntreprise_1 = require("ObjetRequetePageEntreprise");
const ObjetRequeteSaisieEntreprise_1 = require("ObjetRequeteSaisieEntreprise");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
var EGenreActionInfoEntreprise;
(function (EGenreActionInfoEntreprise) {
	EGenreActionInfoEntreprise[(EGenreActionInfoEntreprise["Valider"] = 0)] =
		"Valider";
	EGenreActionInfoEntreprise[(EGenreActionInfoEntreprise["Edition"] = 1)] =
		"Edition";
})(EGenreActionInfoEntreprise || (EGenreActionInfoEntreprise = {}));
class InterfacePageEntreprise extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor() {
		super(...arguments);
		this.indexContactCourant = 0;
	}
	construireInstances() {
		this.identPage = this.add(
			PageEntreprise_1.PageEntreprise,
			this.evenementEntreprise,
			this.initialiserEntreprise,
		);
	}
	initialiserEntreprise() {
		this.requeteEntreprise();
	}
	recupererDonnees() {}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
	}
	async requeteEntreprise() {
		const lReponse =
			await new ObjetRequetePageEntreprise_1.ObjetRequetePageEntreprise(
				this,
			).lancerRequete();
		this.getInstance(this.identPage).setDonnees(
			lReponse.entreprise,
			lReponse.autorisations,
			this.indexContactCourant,
		);
	}
	evenementEntreprise(aGenreAction, aEntreprise) {
		switch (aGenreAction) {
			case EGenreActionInfoEntreprise.Valider:
				this.evenementSaisieEntreprise(aEntreprise);
				break;
			case EGenreActionInfoEntreprise.Edition:
				break;
		}
	}
	async evenementSaisieEntreprise(aEntreprise) {
		await new ObjetRequeteSaisieEntreprise_1.ObjetRequeteSaisieEntreprise(
			this,
		).lancerRequete(aEntreprise);
		await this.requeteEntreprise();
	}
	valider() {
		this.indexContactCourant = this.getInstance(
			this.identPage,
		).indexContactCourant;
		this.getInstance(this.identPage).surValidation();
	}
	surResizeInterface() {
		super.surResizeInterface();
		this.getInstance(this.identPage).actualiserAffichage(true);
	}
}
exports.InterfacePageEntreprise = InterfacePageEntreprise;

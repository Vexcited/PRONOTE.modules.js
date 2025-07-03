exports.InterfacePageParametresEnfantsMobile = void 0;
const PageParametresEnfants_1 = require("PageParametresEnfants");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const PageInformationsMedicales_1 = require("PageInformationsMedicales");
const ObjetRequeteSaisieCompteEnfant_1 = require("ObjetRequeteSaisieCompteEnfant");
const InterfaceAutorisationSortie_1 = require("InterfaceAutorisationSortie");
class InterfacePageParametresEnfantsMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identPage = this.add(PageParametresEnfants_1.PageParametresEnfants);
		this.identInformationsMedicales = this.add(
			PageInformationsMedicales_1.PageInformationsMedicales,
			this._evenementInformationsMedicales,
		);
		this.identAutorisationSortie = this.add(
			InterfaceAutorisationSortie_1.InterfaceAutorisationSortie,
			this._evenementAutorisationSortie,
		);
	}
	getInstancePageInformationsMedicales() {
		return this.getInstance(this.identInformationsMedicales);
	}
	getInstancePageAutorisationsSortie() {
		return this.getInstance(this.identAutorisationSortie);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "ObjetCompte" },
				IE.jsx.str("div", {
					class: "compte-contain",
					id: this.getNomInstance(this.identPage),
				}),
			),
		);
		return H.join("");
	}
	_evenementInformationsMedicales() {
		this.valider();
	}
	_evenementAutorisationSortie() {
		this.valider();
	}
	actionSurValidation() {
		super.actionSurValidation();
		this.getInstance(this.identPage).recupererDonnees();
	}
	valider() {
		const lStructure = {};
		if (
			this.getInstance(this.identPage).getStructurePourValidation(lStructure)
		) {
			this.setEtatSaisie(false);
			new ObjetRequeteSaisieCompteEnfant_1.ObjetRequeteSaisieCompteEnfant(
				this,
				this.actionSurValidation,
			).lancerRequete(lStructure);
		}
	}
}
exports.InterfacePageParametresEnfantsMobile =
	InterfacePageParametresEnfantsMobile;

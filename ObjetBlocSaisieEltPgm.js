const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const { BlocCard } = require("BlocCard.js");
class ObjetBlocSaisieEltPgm extends BlocCard {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.moteurCDT = new ObjetMoteurCDT();
	}
	construireAffichage() {
		return this.afficher();
	}
	setParametres(aElement, aOptions) {
		this._options = $.extend(this._options, aOptions);
		this.setParam({ avecEtendre: false });
		this.setDonnees(
			$.extend(
				{ data: aElement },
				this.composeDataCard({
					elt: aElement,
					editable: this._options.editable,
				}),
			),
		);
	}
	composeDataCard(aParam) {
		const lContenuPrincipal = this.composeHtmlPrincipal(aParam);
		const lContenuSecondaire = this.composeHtmlSecondaire(aParam);
		return {
			editable: aParam.editable,
			htmlInfoPrincipale: lContenuPrincipal,
			htmlInfoSecondaire: lContenuSecondaire,
		};
	}
	composeHtmlPrincipal(aParam) {
		const lElt = aParam.elt;
		const H = [];
		if (lElt !== null && lElt !== undefined) {
			H.push(this.composeHtmlInfoPrincipale({ html: lElt.getLibelle() }));
		}
		return H.join("");
	}
	composeHtmlSecondaire() {
		const H = [];
		return H.join("");
	}
}
module.exports = { ObjetBlocSaisieEltPgm };

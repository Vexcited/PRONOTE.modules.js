exports.ObjetBlocSaisieEltPgm = void 0;
const ObjetMoteurCahierDeTextes_1 = require("ObjetMoteurCahierDeTextes");
const BlocCard_1 = require("BlocCard");
class ObjetBlocSaisieEltPgm extends BlocCard_1.BlocCard {
	constructor(...aParams) {
		super(...aParams);
		this.moteurCDT = new ObjetMoteurCahierDeTextes_1.ObjetMoteurCDT();
		this.donneesRecues = false;
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
		const lContenuSecondaire = this.composeHtmlSecondaire();
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
exports.ObjetBlocSaisieEltPgm = ObjetBlocSaisieEltPgm;

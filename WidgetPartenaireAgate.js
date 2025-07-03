exports.WidgetPartenaireAgate = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreInfoAgate_1 = require("TypeGenreInfoAgate");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetListeElements_1 = require("ObjetListeElements");
class WidgetPartenaireAgate extends ObjetWidget_1.Widget.ObjetWidget {
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeTitreWidgetAgate() {
				$(this.node).eventValidation((e) => {
					aInstance.surPartenaireAgate();
				});
			},
		});
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetPartenaireAgate.bind(this),
			nbrElements: null,
			afficherMessage:
				!this.donnees.listePrix || this.donnees.listePrix.count() === 0,
			titre: ObjetTraduction_1.GTraductions.getValeur("accueil.agate.titre"),
			avecActualisation: !!this.donnees.avecActualisation,
			infosURLExterne: this.infosURLExterne.bind(this),
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	surLienExterne() {
		this.surPartenaireAgate();
	}
	infosURLExterne() {
		if (this.donnees.SSO) {
			return {
				callbackLien: this.surLienExterne.bind(this),
				titre: this.donnees.SSO && this.donnees.SSO.intituleLien,
			};
		}
	}
	composeWidgetPartenaireAgate() {
		const H = [];
		H.push("<table>");
		H.push("<tbody>");
		const lElmEcheange = this.donnees.listePrix
			? this.donnees.listePrix.getElementParGenre(
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Echeance,
				)
			: null;
		const lElmSolde = this.donnees.listePrix
			? this.donnees.listePrix.getElementParGenre(
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_SoldeTotal,
				)
			: null;
		if (lElmEcheange) {
			H.push(this.composeLigne(lElmEcheange));
		}
		const lListeAutres = this.donnees.listePrix
			? this.donnees.listePrix.getListeElements(
					(aElement) =>
						![
							TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_SoldeTotal,
							TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Echeance,
						].includes(aElement.getGenre()),
				)
			: new ObjetListeElements_1.ObjetListeElements();
		if (lListeAutres.count() > 0) {
			H.push(
				this.composeInterLigne(
					ObjetTraduction_1.GTraductions.getValeur("accueil.agate.carte"),
				),
			);
		}
		for (let i = 0; i < lListeAutres.count(); i++) {
			const lPrix = lListeAutres.get(i);
			if (
				lPrix.getGenre() !==
				TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_SoldeTotal
			) {
				H.push(this.composeLigne(lPrix, true));
			}
		}
		H.push("</tbody>");
		if (lElmSolde) {
			H.push(
				this.composeCumul(
					ObjetTraduction_1.GTraductions.getValeur("accueil.agate.forfait"),
					lElmSolde.prix,
				),
			);
		}
		H.push("</table>");
		return H.join("");
	}
	composeLigne(aElement, aAsLabel) {
		return IE.jsx.str(
			"tr",
			null,
			IE.jsx.str(
				"td",
				{ class: aAsLabel && "as-label" },
				aElement.getLibelle(),
			),
			IE.jsx.str(
				"td",
				null,
				aElement.message &&
					IE.jsx.str("span", {
						"ie-tooltiplabel": aElement.message,
						class: "date-alert",
					}),
			),
			IE.jsx.str("td", { class: "info-montant Insecable" }, aElement.prix),
		);
	}
	composeInterLigne(aLibelle) {
		return IE.jsx.str(
			"tr",
			null,
			IE.jsx.str("td", { class: "semi-bold", colspan: "3" }, aLibelle),
		);
	}
	composeCumul(aLibelle, aPrix) {
		const lPrix = aPrix || "&nbsp;";
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"tfoot",
					null,
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str("td", null, aLibelle),
						IE.jsx.str("td", null, "\u00A0"),
						IE.jsx.str("td", { class: "info-montant Insecable" }, lPrix),
					),
				),
			),
		);
		return H.join("");
	}
	surPartenaireAgate() {
		UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaire(
			this.donnees,
		);
	}
}
exports.WidgetPartenaireAgate = WidgetPartenaireAgate;

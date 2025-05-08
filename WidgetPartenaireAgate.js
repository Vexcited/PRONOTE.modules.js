exports.WidgetPartenaireAgate = void 0;
const ObjetImage_1 = require("ObjetImage");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreInfoAgate_1 = require("TypeGenreInfoAgate");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetWidget_1 = require("ObjetWidget");
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
			html: this.composeWidgetPartenaireAgate(),
			nbrElements: null,
			afficherMessage:
				!this.donnees.listePrix || this.donnees.listePrix.count() === 0,
			titre: IE.jsx.str(
				"span",
				{
					class: "AvecMain",
					"ie-node": "nodeTitreWidgetAgate",
					"ie-hint": this.donnees.SSO && this.donnees.SSO.intituleLien,
				},
				ObjetTraduction_1.GTraductions.getValeur("accueil.agate.titre"),
			),
			avecActualisation: !!this.donnees.avecActualisation,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetPartenaireAgate() {
		var _a;
		let lCumulForfait = false;
		let lCumulCarte = false;
		const H = [];
		H.push("<table>");
		for (
			let i = 0;
			i <
			((_a = this.donnees.listePrix) === null || _a === void 0
				? void 0
				: _a.count());
			i++
		) {
			const lPrix = this.donnees.listePrix.get(i);
			if (
				!lCumulForfait &&
				[
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_SoldeTotal,
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Echeance,
				].includes(lPrix.getGenre())
			) {
				lCumulForfait = true;
				H.push(
					this.composeCumul(
						ObjetTraduction_1.GTraductions.getValeur("accueil.agate.forfait"),
						lPrix.prix,
					),
				);
			}
			if (
				!lCumulCarte &&
				[
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Self,
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Cafeteria,
					TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_Etude,
				].includes(lPrix.getGenre())
			) {
				lCumulCarte = true;
				H.push(
					this.composeCumul(
						ObjetTraduction_1.GTraductions.getValeur("accueil.agate.carte"),
					),
				);
			}
			if (
				lPrix.getGenre() !==
				TypeGenreInfoAgate_1.TypeGenreInfoAgate.GIA_SoldeTotal
			) {
				H.push(
					"<tr>",
					'<td class="as-label">',
					lPrix.getLibelle(),
					"</td>",
					"<td>",
					lPrix.message
						? '<span ie-hint="' +
								lPrix.message +
								'">' +
								ObjetImage_1.GImage.composeImage("Image_Attention") +
								"</span>"
						: "&nbsp;",
					"</td>",
					'<td class="info-montant Insecable">',
					lPrix.prix,
					"</td>",
					"</tr>",
				);
			}
		}
		H.push("</table>");
		return H.join("");
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
						IE.jsx.str("td", { class: "as-label" }, aLibelle),
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

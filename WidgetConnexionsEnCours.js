exports.WidgetConnexionsEnCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
CollectionRequetes_1.Requetes.inscrire(
	"ListeConnexions",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class WidgetConnexionsEnCours extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lParams = aParams;
		(0, CollectionRequetes_1.Requetes)("ListeConnexions", this)
			.setOptions({ avecControleModeExclusif: false })
			.lancerRequete()
			.then((aParams) => {
				$.extend(
					true,
					this.donnees,
					aParams.JSONRapportSaisie.connexionsEnCours,
				);
				const lWidget = {
					getHtml: this.composeWidgetConnexionsEnCours.bind(this),
					nbrElements: 0,
					afficherMessage: this.donnees.listeConnexions.count() === 0,
				};
				$.extend(true, this.donnees, lWidget);
				lParams.construireWidget(this.donnees);
				$(window).trigger("resize");
			});
	}
	composeWidgetConnexionsEnCours() {
		const H = [];
		const lNbr = this.donnees.listeConnexions
			? this.donnees.listeConnexions.count()
			: 0;
		if (lNbr > 0) {
			H.push('<table class="widget-table half-squared-line">');
			const lEnteteColonneEDT = this.donnees.avecEDT
				? IE.jsx.str(
						"th",
						{ scope: "col" },
						IE.jsx.str("i", {
							class: "icon_connexion_edt",
							role: "img",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"accueil.connexionsEnCours.hintConnexionsEDT",
							),
						}),
					)
				: "";
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str("td", null),
						IE.jsx.str(
							"th",
							{ scope: "col" },
							IE.jsx.str("i", {
								class: "icon_connexion_http",
								role: "img",
								"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
									"accueil.connexionsEnCours.hintConnexionsEspaces",
								),
							}),
						),
						IE.jsx.str(
							"th",
							{ scope: "col" },
							IE.jsx.str("i", {
								class: "icon_connexion_pronote",
								role: "img",
								"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
									"accueil.connexionsEnCours.hintConnexionsPronote",
								),
							}),
						),
						lEnteteColonneEDT,
					),
				),
			);
			for (const lLigne of this.donnees.listeConnexions) {
				const lLigneEDT = this.donnees.avecEDT
					? IE.jsx.str("td", null, IE.jsx.str("span", null, lLigne.nbEDT))
					: "";
				H.push(
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"th",
							{ scope: "row" },
							IE.jsx.str("span", null, lLigne.getLibelle()),
							IE.jsx.str(
								"div",
								{ class: "nbr-licence" },
								lLigne.nbLicenceDispo,
							),
						),
						IE.jsx.str("td", null, IE.jsx.str("span", null, lLigne.nbLeger)),
						IE.jsx.str("td", null, IE.jsx.str("span", null, lLigne.nbLourdPN)),
						lLigneEDT,
					),
				);
			}
			H.push("</table>");
		}
		return H.join("");
	}
}
exports.WidgetConnexionsEnCours = WidgetConnexionsEnCours;

exports.WidgetCDTNonSaisi = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
class WidgetCDTNonSaisi extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		if (this.donnees.listeCours) {
			this.donnees.listeCours.setTri([ObjetTri_1.ObjetTri.init("dateDebut")]);
			this.donnees.listeCours.trier(
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			);
		}
		const lWidget = {
			getHtml: this._composeWidgetCDTNonSaisi.bind(this),
			nbrElements: this.donnees.listeCours
				? this.donnees.listeCours.count()
				: 0,
			afficherMessage: this.donnees.listeCours
				? this.donnees.listeCours.count() === 0
				: true,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	jsxNodeCDTNonSaisi(aCours, aNode) {
		$(aNode).eventValidation(() => {
			if (aCours) {
				this.etatUtilisateurSco.setNavigationCours(aCours);
				this.etatUtilisateurSco.setNavigationDate(aCours.dateDebut);
				let lPageDestination;
				if (this.etatUtilisateurSco.estEspaceMobile()) {
					lPageDestination = { genreOngletDest: this.donnees.page.Onglet };
				} else {
					this.etatUtilisateurSco.setSemaineSelectionnee(aCours.cycle);
					lPageDestination = this.donnees.page;
				}
				this.callback.appel(
					this.donnees.genre,
					Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
					lPageDestination,
				);
			}
		});
	}
	_composeWidgetCDTNonSaisi() {
		const H = [];
		H.push('<ul class="liste-clickable">');
		if (this.donnees.listeCours) {
			for (let i = 0; i < this.donnees.listeCours.count(); i++) {
				const lCours = this.donnees.listeCours.get(i);
				H.push(
					IE.jsx.str(
						"li",
						null,
						IE.jsx.str(
							"a",
							{
								tabindex: "0",
								class: "wrapper-link",
								"ie-node": this.jsxNodeCDTNonSaisi.bind(this, lCours),
							},
							IE.jsx.str(
								"div",
								{ class: "wrap" },
								IE.jsx.str(
									"h3",
									{
										title: ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDTNonSaisi.hintLien",
										),
									},
									ObjetDate_1.GDate.formatDate(lCours.dateDebut, "[%JJJ %JJ]"),
									" - ",
									lCours.strHeure,
								),
								IE.jsx.str("span", { class: "info" }, lCours.strMatiere),
							),
							lCours.strClasse || lCours.strClasse !== ""
								? '<div class="as-info fixed">' + lCours.strClasse + "</div>"
								: "",
						),
					),
				);
			}
		}
		H.push("</ul>");
		return H.join("");
	}
}
exports.WidgetCDTNonSaisi = WidgetCDTNonSaisi;

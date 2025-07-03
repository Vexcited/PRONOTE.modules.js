exports.WidgetAppelNonFait = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
class WidgetAppelNonFait extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.donnees.listeAppelNonFait.setTri([
			ObjetTri_1.ObjetTri.init("dateDebut"),
		]);
		this.donnees.listeAppelNonFait.trier(
			Enumere_TriElement_1.EGenreTriElement.Decroissant,
		);
		const lNbrElements = this.donnees.listeAppelNonFait
			? this.donnees.listeAppelNonFait.count()
			: 0;
		const lWidget = {
			getHtml: this.composeWidgetAppelNonFait.bind(this),
			nbrElements: lNbrElements,
			afficherMessage: lNbrElements === 0,
		};
		$.extend(true, this.donnees, lWidget);
		UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
		aParams.construireWidget(aParams.donnees);
	}
	jsxNodeAppelNonFait(aAppelNonFait) {
		return (aNode) => {
			$(aNode).eventValidation(() => {
				this._surAppelNonFait(aAppelNonFait);
			});
		};
	}
	composeWidgetAppelNonFait() {
		const H = [];
		H.push('<ul class="liste-clickable">');
		if (this.donnees.listeAppelNonFait) {
			for (const lAppelNonFait of this.donnees.listeAppelNonFait) {
				H.push(
					IE.jsx.str(
						"li",
						null,
						IE.jsx.str(
							"a",
							{
								class: "wrapper-link",
								tabindex: "0",
								"ie-node": this.jsxNodeAppelNonFait(lAppelNonFait),
							},
							IE.jsx.str(
								"div",
								{ class: "wrap" },
								!lAppelNonFait.estVerrouille
									? IE.jsx.str(
											"h3",
											null,
											ObjetDate_1.GDate.formatDate(
												lAppelNonFait.dateDebut,
												"[%JJJ %JJ]",
											) +
												" - " +
												lAppelNonFait.strHeure,
										)
									: "",
								IE.jsx.str(
									"div",
									{ class: "infos-conteneur" },
									lAppelNonFait.estSortiePeda
										? IE.jsx.str(
												"span",
												{
													class: "icon-sortie-peda",
													title: ObjetTraduction_1.GTraductions.getValeur(
														"accueil.appelNonFait.HintAcc",
													),
												},
												ObjetTraduction_1.GTraductions.getValeur(
													"accueil.appelNonFait.InitialeAbsAccompagnement",
												),
											)
										: "",
									IE.jsx.str("span", null, lAppelNonFait.strMatiere),
								),
							),
							lAppelNonFait.strClasse || lAppelNonFait.strClasse !== ""
								? IE.jsx.str(
										"div",
										{ class: "as-info fixed" },
										lAppelNonFait.strClasse,
									)
								: "",
						),
					),
				);
			}
		}
		H.push("</ul>");
		return H.join("");
	}
	_surAppelNonFait(aAppelNonFait) {
		if (aAppelNonFait) {
			this.etatUtilisateurSco.setNavigationCours(aAppelNonFait);
			this.etatUtilisateurSco.setNavigationDate(aAppelNonFait.dateDebut);
			let lPageDestination;
			if (this.etatUtilisateurSco.estEspaceMobile()) {
				lPageDestination = { genreOngletDest: this.donnees.page.Onglet };
			} else {
				lPageDestination = this.donnees.page;
			}
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
				lPageDestination,
			);
		}
	}
}
exports.WidgetAppelNonFait = WidgetAppelNonFait;

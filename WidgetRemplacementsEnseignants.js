exports.WidgetRemplacementsEnseignants = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const MoteurRemplacementsEnseignants_1 = require("MoteurRemplacementsEnseignants");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const Type3Etats_1 = require("Type3Etats");
const Toast_1 = require("Toast");
const ObjetTraduction_1 = require("ObjetTraduction");
class WidgetRemplacementsEnseignants extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		var _a;
		this.donnees = aParams.donnees;
		this.moteur =
			new MoteurRemplacementsEnseignants_1.MoteurRemplacementsEnseignants(
				TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarPropositions,
			);
		const lWidget = {
			getHtml: this.composeWidgetRemplacementsEnseignants.bind(this),
			nbrElements:
				(_a = this.donnees.listeRemplacements) === null || _a === void 0
					? void 0
					: _a.count(),
			afficherMessage:
				!this.donnees.listeRemplacements ||
				this.donnees.listeRemplacements.count() === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	jsxModeleCheckboxProposition(aRemplacement, aAccept) {
		return {
			getValue: () => {
				if (aRemplacement) {
					if (aAccept) {
						return (
							aRemplacement.genreReponse === Type3Etats_1.Type3Etats.TE_Oui
						);
					} else {
						return (
							aRemplacement.genreReponse === Type3Etats_1.Type3Etats.TE_Non
						);
					}
				}
				return false;
			},
			setValue: (aValue) => {
				if (aRemplacement) {
					if (aValue) {
						aRemplacement.genreReponse = aAccept
							? Type3Etats_1.Type3Etats.TE_Oui
							: Type3Etats_1.Type3Etats.TE_Non;
					} else {
						aRemplacement.genreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					this.moteur
						.requeteSaisieRemplacements({
							genreLigne: aRemplacement.getGenre(),
							cours: aRemplacement.cours,
							annulation: aRemplacement.annulation,
							cycle: aRemplacement.cycle,
							genreReponse: aRemplacement.genreReponse,
						})
						.then((aJSON) => {
							if (
								aJSON.JSONRapportSaisie &&
								!aJSON.JSONRapportSaisie._erreurSaisie_
							) {
								Toast_1.Toast.afficher({
									msg: ObjetTraduction_1.GTraductions.getValeur(
										"RemplacementsEnseignants.choixEnregistre",
									),
									type: Toast_1.ETypeToast.succes,
									dureeAffichage: 3000,
								});
							}
						});
				}
			},
		};
	}
	jsxFuncAttrAriaLabel(aRemplacement) {
		let lLabel = "";
		if (aRemplacement) {
			switch (aRemplacement.genreReponse) {
				case Type3Etats_1.Type3Etats.TE_Oui:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintoui",
					);
					break;
				case Type3Etats_1.Type3Etats.TE_Non:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintnon",
					);
					break;
				case Type3Etats_1.Type3Etats.TE_Inconnu:
					lLabel = ObjetTraduction_1.GTraductions.getValeur(
						"RemplacementsEnseignants.proposition.hintinconnu",
					);
					break;
				default:
					break;
			}
		}
		return { "aria-label": lLabel };
	}
	composeWidgetRemplacementsEnseignants() {
		const H = [];
		if (
			this.donnees.listeRemplacements &&
			this.donnees.listeRemplacements.count()
		) {
			H.push('<ul class="liste-unclickable">');
			for (const lRemplacement of this.donnees.listeRemplacements) {
				H.push(
					IE.jsx.str(
						"li",
						{ tabindex: "0" },
						this.composeRemplacement(lRemplacement),
					),
				);
			}
			H.push("</ul>");
		}
		return H.join("");
	}
	composeRemplacement(aArticle) {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain zone-remplacement" },
			IE.jsx.str(
				"div",
				{ class: "fix-bloc zone-gauche p-right" },
				this.moteur.construireDate(aArticle),
			),
			IE.jsx.str(
				"div",
				{ class: "fluid-bloc zone-centrale" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain zone-contenu" },
					IE.jsx.str(
						"div",
						{ class: "fluid-bloc zone-principal" },
						IE.jsx.str(
							"div",
							{ class: "zone-titre semi-bold p-bottom-s" },
							this.moteur.construireTitre(aArticle),
						),
						IE.jsx.str(
							"div",
							{ class: "zone-soustitre p-bottom-s" },
							this.moteur.construireSousTitre(aArticle),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "fix-bloc zone-complementaire" },
						this.moteur.getZoneReponse(aArticle, {
							cbProposition: this.jsxModeleCheckboxProposition.bind(this),
							getAriaLabelProposition: this.jsxFuncAttrAriaLabel.bind(this),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "zone-message" },
					this.moteur.construireMessage(aArticle),
				),
			),
		);
	}
}
exports.WidgetRemplacementsEnseignants = WidgetRemplacementsEnseignants;

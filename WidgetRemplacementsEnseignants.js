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
			html: this.composeWidgetRemplacementsEnseignants(),
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			CheckProposition: {
				getValue: function (aLigne, aAccept) {
					const lElement = aInstance.donnees.listeRemplacements.get(aLigne);
					if (!!lElement) {
						if (aAccept) {
							return lElement.genreReponse === Type3Etats_1.Type3Etats.TE_Oui;
						} else {
							return lElement.genreReponse === Type3Etats_1.Type3Etats.TE_Non;
						}
					}
					return false;
				},
				setValue: function (aLigne, aAccept, aValue) {
					const lElement = aInstance.donnees.listeRemplacements.get(aLigne);
					if (aValue) {
						lElement.genreReponse = aAccept
							? Type3Etats_1.Type3Etats.TE_Oui
							: Type3Etats_1.Type3Etats.TE_Non;
					} else {
						lElement.genreReponse = Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					aInstance.moteur
						.requeteSaisieRemplacements({
							genreLigne: lElement.getGenre(),
							cours: lElement.cours,
							annulation: lElement.annulation,
							cycle: lElement.cycle,
							genreReponse: lElement.genreReponse,
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
				},
			},
			getAriaLabel: function (aLigne) {
				const lElement = aInstance.donnees.listeRemplacements.get(aLigne);
				let lLabel;
				switch (lElement.genreReponse) {
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
						return;
				}
				return { "aria-label": lLabel };
			},
		});
	}
	composeWidgetRemplacementsEnseignants() {
		const lHtml = [];
		if (
			this.donnees.listeRemplacements &&
			this.donnees.listeRemplacements.count()
		) {
			lHtml.push('<ul role="list" class="liste-unclickable">');
			for (let i = 0; i < this.donnees.listeRemplacements.count(); i++) {
				const lRemplacement = this.donnees.listeRemplacements.get(i);
				lHtml.push(
					IE.jsx.str(
						"li",
						{ tabindex: "0" },
						this.composeRemplacement(lRemplacement, i),
					),
				);
			}
			lHtml.push("</ul>");
		}
		return lHtml.join("");
	}
	composeRemplacement(aArticle, aLigne) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
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
							this.moteur.getZoneReponse(aArticle, aLigne),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "zone-message" },
						this.moteur.construireMessage(aArticle),
					),
				),
			),
		);
	}
}
exports.WidgetRemplacementsEnseignants = WidgetRemplacementsEnseignants;

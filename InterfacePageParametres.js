exports.ObjetAffichagePageParametres_Mobile = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireChangementLangue_1 = require("UtilitaireChangementLangue");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetPreferenceMessagerie_1 = require("ObjetPreferenceMessagerie");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetPreferenceAccessibilite_1 = require("ObjetPreferenceAccessibilite");
class ObjetAffichagePageParametres_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteMessagerie: function () {
				return {
					class: ObjetPreferenceMessagerie_1.ObjetPreferenceMessagerie,
					pere: aInstance,
				};
			},
			getIdentiteAccessibilite: function () {
				return {
					class: ObjetPreferenceAccessibilite_1.ObjetPreferenceAccessibilite,
					pere: aInstance,
				};
			},
		});
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		if (
			UtilitaireChangementLangue_1.UtilitaireChangementLangue.avecChoixLangues()
		) {
			lHtml.push(
				'<div class="parametres conteneur-langues">',
				'<div class="label">',
				ObjetTraduction_1.GTraductions.getValeur("mobile.langue"),
				" : ",
				"</div>",
				'<div class="flags-conteneur">',
				UtilitaireChangementLangue_1.UtilitaireChangementLangue.construire(
					this.controleur,
				),
				"</div>",
				"</div>",
			);
		}
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: "parametres" },
				IE.jsx.str(
					"div",
					{ class: "label" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ParametresUtilisateur.Accessibilite",
					),
				),
				IE.jsx.str("div", { "ie-identite": "getIdentiteAccessibilite" }),
			),
		);
		if (
			GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.avecDroitDeconnexionMessagerie,
			)
		) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "parametres conteneur-droits" },
					IE.jsx.str(
						"div",
						{ class: "label" },
						ObjetTraduction_1.GTraductions.getValeur(
							"PrefMess.DroitDeconnexion",
						),
					),
					IE.jsx.str("div", { "ie-identite": "getIdentiteMessagerie" }),
				),
			);
		}
		return lHtml.join("");
	}
}
exports.ObjetAffichagePageParametres_Mobile =
	ObjetAffichagePageParametres_Mobile;

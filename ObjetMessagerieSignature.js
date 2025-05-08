exports.ObjetMessagerieSignature = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ModuleEditeurHtml_1 = require("ModuleEditeurHtml");
const TinyInit_1 = require("TinyInit");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetMessagerieSignature extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.etatUtilisateurSco = GApplication.getEtatUtilisateur();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentite() {
				return {
					class: ModuleEditeurHtml_1.ModuleEditeurHtml,
					pere: aInstance,
					init(aInstanceEditeur) {
						aInstanceEditeur.setParametres({
							labelWAI: ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.labelWAIMessagerieSignature",
							),
							gererModeExclusif: true,
							sideBySide: true,
							surChange(aValue) {
								aInstance._modifierContenu(aValue);
							},
							optionsTiny: IE.estMobile
								? {
										autoresize_bottom_margin: 0,
										autoresize_on_init: true,
										min_height: 30,
										max_height: 0,
										height: "",
										plugins: ["autoresize"],
									}
								: null,
						});
						aInstanceEditeur.setDonnees(
							aInstance.etatUtilisateurSco.messagerieSignature.signature,
						);
					},
				};
			},
		});
	}
	construireAffichage() {
		if (this.etatUtilisateurSco.messagerieSignature) {
			return IE.jsx.str("div", { "ie-identite": "getIdentite" });
		}
		return "";
	}
	_modifierContenu(aValue) {
		const lVal =
			aValue && TinyInit_1.TinyInit.estContenuVide(aValue) ? "" : aValue;
		if (lVal !== this.etatUtilisateurSco.messagerieSignature.signature) {
			this.etatUtilisateurSco.messagerieSignature.signature = lVal;
			this.etatUtilisateurSco.messagerieSignature._signatureModifiee = true;
			this.setEtatSaisie(true);
		}
	}
}
exports.ObjetMessagerieSignature = ObjetMessagerieSignature;

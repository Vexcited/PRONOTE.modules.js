exports.WidgetPenseBete = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePenseBete",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class WidgetPenseBete extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			penseBete: {
				getValue() {
					return aInstance.donnees.libelle;
				},
				setValue(aValue) {
					aInstance.donnees.libelle = aValue;
				},
				getReadOnly() {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
				exitChange() {
					(0, CollectionRequetes_1.Requetes)(
						"SaisiePenseBete",
						aInstance,
						aInstance._surRequeteSaisiePenseBete,
					).lancerRequete({ penseBete: aInstance.donnees.libelle });
				},
			},
		});
	}
	_surRequeteSaisiePenseBete() {
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetPenseBete.bind(this),
			nbrElements: null,
			afficherMessage: false,
		};
		Object.assign(this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetPenseBete() {
		return IE.jsx.str("textarea", {
			"aria-label": ObjetTraduction_1.GTraductions.getValeur(
				"accueil.penseBete.InscrivezNotes",
			),
			"ie-model": "penseBete",
		});
	}
}
exports.WidgetPenseBete = WidgetPenseBete;

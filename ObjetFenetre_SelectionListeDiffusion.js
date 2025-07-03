exports.ObjetFenetre_SelectionListeDiffusion = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SelectionListeDiffusion extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.uniquementMesListes =
			this.appSco.parametresUtilisateur.get(
				"listeDiffusion.uniquementMesListes",
			) || false;
		this.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.titre"),
			largeur: 300,
			hauteur: 470,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			ariaLabel: this.optionsFenetre.titre,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
	composeContenu() {
		const lcbLesMiens = () => {
			return {
				getValue: () => {
					return this.appSco.parametresUtilisateur.get(
						"listeDiffusion.uniquementMesListes",
					);
				},
				setValue: (aValue) => {
					this.evenementSurCB(aValue);
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "flex-contain cols full-size" },
			IE.jsx.str(
				"div",
				{ class: "fix-bloc p-all-l" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lcbLesMiens },
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.lesMiens"),
					),
				),
			),
			IE.jsx.str("div", {
				class: "fluid-bloc",
				id: this.getNomInstance(this.identListe),
			}),
		);
	}
	evenementSurCB(aValue) {
		this.uniquementMesListes = !!aValue;
		this.appSco.parametresUtilisateur.set(
			"listeDiffusion.uniquementMesListes",
			this.uniquementMesListes,
		);
		if (
			this.getInstance(this.identListe) &&
			this.getInstance(this.identListe).getDonneesListe()
		) {
			this.getInstance(this.identListe)
				.getDonneesListe()
				.setUniquementMesListes(this.uniquementMesListes);
			this.getInstance(this.identListe).actualiser(true, false);
		}
	}
}
exports.ObjetFenetre_SelectionListeDiffusion =
	ObjetFenetre_SelectionListeDiffusion;

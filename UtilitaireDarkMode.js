exports.UtilitaireDarkMode = void 0;
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
const AccessApp_1 = require("AccessApp");
class UtilitaireDarkMode {
	static getControleurCombo() {
		const lApplication = (0, AccessApp_1.getApp)();
		return {
			init(aCombo) {
				const lListe = new ObjetListeElements_1.ObjetListeElements();
				lListe.add([
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.claire"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.clair,
					}),
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.sombre"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.sombre,
					}),
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.systeme"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.systeme,
					}),
				]);
				const lChoixDarkMode = lApplication
					.getOptionsEspaceLocal()
					.getChoixDarkMode();
				let lIndice = 0;
				lListe.parcourir((aElement, aIndice) => {
					if (aElement.getGenre() === lChoixDarkMode) {
						lIndice = aIndice;
						return false;
					}
				});
				aCombo.setDonneesObjetSaisie({
					liste: lListe,
					selection: lIndice,
					options: {
						labelWAICellule:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.theme"),
						getContenuElement: (aParamsLigne) => {
							let lIcon = "";
							switch (aParamsLigne.element.getGenre()) {
								case TypeThemeCouleur_1.ChoixDarkMode.clair: {
									lIcon = "icon_sun";
									break;
								}
								case TypeThemeCouleur_1.ChoixDarkMode.sombre: {
									lIcon = "icon_lune";
									break;
								}
								case TypeThemeCouleur_1.ChoixDarkMode.systeme: {
									lIcon = "icon_mobile_phone";
									break;
								}
								default:
							}
							return IE.jsx.str(
								"span",
								{ class: ["iconic", lIcon] },
								aParamsLigne.element.getLibelle(),
							);
						},
					},
				});
			},
			event(aParams) {
				if (aParams.estSelectionManuelle && aParams.element) {
					const lChoix = aParams.element.getGenre();
					lApplication.getOptionsEspaceLocal().setChoixDarkMode(lChoix);
					if ((0, AccessApp_1.getApp)().estAppliMobile) {
						window.messageData.push({ action: "darkMode", data: lChoix });
					}
				}
			},
		};
	}
}
exports.UtilitaireDarkMode = UtilitaireDarkMode;

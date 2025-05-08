const {
	_InterfacePageCahierDeTexte,
} = require("_InterfacePageCahierDeTexte.js");
const {
	EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { ObjetTimeline } = require("ObjetTimeline.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeEtatExecutionQCMPourRepondant,
} = require("TypeEtatExecutionQCMPourRepondant.js");
const {
	ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const { EEvent } = require("Enumere_Event.js");
const { GUID } = require("GUID.js");
class ObjetAffichagePageCahierDeTexte extends _InterfacePageCahierDeTexte {
	constructor(...aParams) {
		super(...aParams);
		this.idComboFiltre = GUID.getId();
		this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
	}
	surPostResize() {
		this.actualiser();
	}
	construireInstances() {
		super.construireInstances();
		this.IdPremierElement = this.idZoneChxModeAff;
	}
	setParametresGeneraux() {
		this.AddSurZone = [];
		this.AddSurZone.push({
			html: ObjetTimeline.composeChoix(
				this.idZoneChxModeAff,
				this.modeTimeLine,
			),
		});
		this.AddSurZone.push(this.identCelluleSemaine);
		this.AddSurZone.push({
			html:
				'<div class="EspaceGauche ' +
				this.classLabelDepuis +
				'">' +
				GTraductions.getValeur("Depuis") +
				"</div>",
		});
		this.AddSurZone.push(this.identCelluleDate);
		this.AddSurZone.push({
			html: `<ie-combo data-id="${this.idComboFiltre}" ie-model="comboFiltreTheme"></ie-combo>`,
		});
		if (
			this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire &&
			!GEtatUtilisateur.pourPrimaire()
		) {
			this.AddSurZone.push({ html: _composeFiltresTAF() });
		}
	}
	setVisibilite() {
		super.setVisibilite();
		if (this.estHebdomadaire()) {
			$("[data-id=" + this.idComboFiltre.escapeJQ() + "]").hide();
			this.filtreThemes = null;
		} else {
			$("[data-id=" + this.idComboFiltre.escapeJQ() + "]").show();
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFiltreTAF: {
				getValue: function (aTAFFait) {
					if (aTAFFait) {
						return aInstance.inclureTAFFait;
					} else {
						return aInstance.inclureTAFAFaire;
					}
				},
				setValue: function (aTAFFait, aValue) {
					aInstance.modifierInclureTAF(aTAFFait, aValue);
				},
			},
			cbxTAFFait: {
				getValue: function (aNumero) {
					const lTAF =
						aInstance.ListeTravailAFaire.getElementParNumero(aNumero);
					return lTAF.TAFFait;
				},
				getHint: function (aNumero) {
					const lTAF =
						aInstance.ListeTravailAFaire.getElementParNumero(aNumero);
					return lTAF.TAFFait
						? GTraductions.getValeur("accueil.hintTravailFait")
						: GTraductions.getValeur("accueil.hintTravailAFaire");
				},
				setValue: function (aNumero, aValue) {
					const lTAF =
						aInstance.ListeTravailAFaire.getElementParNumero(aNumero);
					lTAF.TAFFait = aValue;
					lTAF.setEtat(EGenreEtat.Modification);
					new ObjetRequeteSaisieTAFFaitEleve(
						aInstance,
						aInstance._actionSurRequeteSaisieTAFFaitEleve.bind(aInstance),
					).lancerRequete({ listeTAF: aInstance.ListeTravailAFaire });
				},
				getDisabled: function () {
					return !aInstance.peuFaireTAF;
				},
				node: function () {
					$(this.node).on({
						click: function (event) {
							event.stopPropagation();
						},
					});
				},
			},
			labelTAFFait: function (aNumero) {
				const lTAF = aInstance.ListeTravailAFaire.getElementParNumero(aNumero);
				let lFait = false;
				if (lTAF.executionQCM && lTAF.executionQCM.etatCloture) {
					lFait =
						lTAF.executionQCM.etatCloture ===
						TypeEtatExecutionQCMPourRepondant.EQR_Termine;
				} else {
					lFait = lTAF.TAFFait;
				}
				const H = [];
				if (lFait) {
					H.push(
						'<div style="',
						GStyle.composeCouleur(GCouleur.themeCouleur.foncee, GCouleur.blanc),
						'padding-left: 10px; padding-right: 10px; float: right;">',
						GTraductions.getValeur("accueil.hintTravailFait"),
						"</div>",
						"<br/>",
					);
				}
				return H.join("");
			},
			comboFiltreTheme: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 170,
						hauteur: 16,
						hauteurLigneDefault: 16,
						labelWAICellule: GTraductions.getValeur(
							"CahierDeTexte.filtrerParThemes",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						if (aInstance.listeThemes) {
							aInstance.listeThemes.parcourir((aTheme) => {
								if (aTheme.Matiere) {
									aTheme.setLibelle(
										'<div class="Gras">' +
											aTheme.getLibelle() +
											"</div><div>" +
											aTheme.Matiere.getLibelle() +
											"</div>",
									);
								}
							});
							return aInstance.listeThemes;
						}
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (
						!!aInstance.filtreThemes &&
						!!aInstance.listeThemes &&
						aInstance.listeThemes.count() > 0
					) {
						for (; lIndice < aInstance.listeThemes.count(); lIndice++) {
							if (
								aInstance.listeThemes.get(lIndice).getNumero() ===
								aInstance.filtreThemes.getNumero()
							) {
								break;
							}
						}
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (!!aParametres.element && aParametres.estSelectionManuelle) {
						aInstance.filtreThemes =
							aParametres.element.getNumero() !== null
								? aParametres.element
								: null;
						aInstance.actualiser();
					}
				},
			},
		});
	}
	_actionSurRequeteSaisieTAFFaitEleve() {}
}
function _composeFiltresTAF() {
	const H = [];
	H.push(
		'<ie-checkbox style="margin-right:1rem;" class="as-chips" ie-icon="icon_time" ie-model="cbFiltreTAF(false)">',
		GTraductions.getValeur("TAFEtContenu.AFaire"),
		"</ie-checkbox>",
		'<ie-checkbox style="margin-right:1rem;" class="as-chips" ie-icon="icon_check_fin" ie-model="cbFiltreTAF(true)">',
		GTraductions.getValeur("TAFEtContenu.Fait"),
		"</ie-checkbox>",
	);
	return H.join("");
}
module.exports = ObjetAffichagePageCahierDeTexte;

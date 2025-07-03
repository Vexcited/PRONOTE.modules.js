exports.ObjetAffichagePageCahierDeTexte = void 0;
const _InterfacePageCahierDeTexte_1 = require("_InterfacePageCahierDeTexte");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const ObjetTimeline_1 = require("ObjetTimeline");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const Enumere_Event_1 = require("Enumere_Event");
const GUID_1 = require("GUID");
class ObjetAffichagePageCahierDeTexte extends _InterfacePageCahierDeTexte_1._InterfacePageCahierDeTexte {
	constructor(...aParams) {
		super(...aParams);
		this.idComboFiltre = GUID_1.GUID.getId();
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
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
			html: ObjetTimeline_1.ObjetTimeline.composeChoix(
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
				ObjetTraduction_1.GTraductions.getValeur("Depuis") +
				"</div>",
		});
		this.AddSurZone.push(this.identCelluleDate);
		this.AddSurZone.push({
			html: `<ie-combo data-id="${this.idComboFiltre}" ie-model="comboFiltreTheme"></ie-combo>`,
		});
		if (
			this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire &&
			!this.etatUtilSco.pourPrimaire()
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
						? ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailFait",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailAFaire",
							);
				},
				setValue: function (aNumero, aValue) {
					const lTAF =
						aInstance.ListeTravailAFaire.getElementParNumero(aNumero);
					lTAF.TAFFait = aValue;
					lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
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
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_Termine;
				} else {
					lFait = lTAF.TAFFait;
				}
				const H = [];
				if (lFait) {
					H.push(
						'<div style="',
						ObjetStyle_1.GStyle.composeCouleur(
							GCouleur.themeCouleur.foncee,
							GCouleur.blanc,
						),
						'padding-left: 10px; padding-right: 10px; float: right;">',
						ObjetTraduction_1.GTraductions.getValeur("accueil.hintTravailFait"),
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
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
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
exports.ObjetAffichagePageCahierDeTexte = ObjetAffichagePageCahierDeTexte;
function _composeFiltresTAF() {
	const H = [];
	H.push(
		'<ie-checkbox style="margin-right:1rem;" class="as-chips" ie-icon="icon_time" ie-model="cbFiltreTAF(false)">',
		ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.AFaire"),
		"</ie-checkbox>",
		'<ie-checkbox style="margin-right:1rem;" class="as-chips" ie-icon="icon_check_fin" ie-model="cbFiltreTAF(true)">',
		ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.Fait"),
		"</ie-checkbox>",
	);
	return H.join("");
}

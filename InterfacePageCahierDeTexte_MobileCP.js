exports.ObjetCahierDeTexte_MobileCP = exports.GenreModeAffichageTAFMobile =
	void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetListeElements_1 = require("ObjetListeElements");
const tag_1 = require("tag");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
var GenreModeAffichageTAFMobile;
(function (GenreModeAffichageTAFMobile) {
	GenreModeAffichageTAFMobile[(GenreModeAffichageTAFMobile["AVenir"] = 0)] =
		"AVenir";
	GenreModeAffichageTAFMobile[
		(GenreModeAffichageTAFMobile["hebdomadaire"] = 1)
	] = "hebdomadaire";
})(
	GenreModeAffichageTAFMobile ||
		(exports.GenreModeAffichageTAFMobile = GenreModeAffichageTAFMobile = {}),
);
class ObjetCahierDeTexte_MobileCP extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
		this.inclureTAFFait = true;
		this.inclureTAFAFaire = true;
		this.filtreMatiere = null;
		this.apresModificationTAF = false;
	}
	construireInstances() {
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this.eventModeAffTAF,
			(aInstance) => {
				aInstance.setOptions({ avecSwipe: false });
			},
		);
		this.identCalendrier = this.creerInstanceCalendrier();
		this.identPage = this.creerInstancePage();
		const lElementTAFAVenir = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.aVenir"),
			null,
			GenreModeAffichageTAFMobile.AVenir,
			null,
			true,
		);
		this.listeTabs.addElement(lElementTAFAVenir);
		const lElementTAFHebdomadaire = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.hebdomadaire"),
			null,
			GenreModeAffichageTAFMobile.hebdomadaire,
			null,
			true,
		);
		this.listeTabs.addElement(lElementTAFHebdomadaire);
		this.instanceFiltreMatieres = ObjetIdentite_1.Identite.creerInstance(
			ObjetSelection_1.ObjetSelection,
			{ pere: this, evenement: this._evntFiltreMatieres.bind(this) },
		);
		this._initSelecteurFiltreMatieres(this.instanceFiltreMatieres);
		this.AddSurZone = [this.identTabs];
		this.AddSurZone.push({
			html: (0, tag_1.tag)(
				"div",
				{ class: "conteneur-entete" },
				(0, tag_1.tag)("div", {
					class: "conteneur-calendrier",
					id: this.getNomInstance(this.identCalendrier),
				}),
				this.instanceFiltreMatieres
					? (0, tag_1.tag)("div", {
							class: "conteneur-matiere",
							id: this.instanceFiltreMatieres.getNom(),
						})
					: "",
				this.instanceFiltreTheme
					? (0, tag_1.tag)("div", {
							class: "conteneur-matiere",
							id: this.instanceFiltreTheme.getNom(),
						})
					: "",
				(0, tag_1.tag)(
					"div",
					{ class: "conteneur-filtre" },
					(0, tag_1.tag)(
						"ie-checkbox",
						{
							class: "as-chips EspaceGauche AlignementMilieuVertical",
							"ie-icon": "icon_time",
							"ie-model": "cbFiltreTAF(false)",
						},
						ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.AFaire"),
					),
					(0, tag_1.tag)(
						"ie-checkbox",
						{
							class: "as-chips EspaceGauche10 AlignementMilieuVertical",
							"ie-icon": "icon_check_fin",
							"ie-model": "cbFiltreTAF(true)",
						},
						ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.Fait"),
					),
					this.getFiltrePrimaire(),
				),
			),
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str("div", { id: this.getNomInstance(this.identPage) });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFiltreTAF: {
				getValue(aTAFFait) {
					if (aTAFFait) {
						return aInstance.inclureTAFFait;
					} else {
						return aInstance.inclureTAFAFaire;
					}
				},
				setValue(aTAFFait, aValue) {
					aInstance.modifierInclureTAF(aTAFFait, aValue);
				},
			},
		});
	}
	modifierInclureTAF(aTAFFait, aValue) {
		if (aTAFFait) {
			this.inclureTAFFait = aValue;
			if (!aValue && !this.inclureTAFAFaire) {
				this.inclureTAFAFaire = true;
			}
		} else {
			this.inclureTAFAFaire = aValue;
			if (!aValue && !this.inclureTAFFait) {
				this.inclureTAFFait = true;
			}
		}
		this.actualiser();
	}
	eventModeAffTAF(aObjOnglet) {}
	recupererDonnees() {}
	actualiser() {}
	formatDonnees() {}
	getFiltrePrimaire() {
		return "";
	}
	actualiserFiltreTheme(aListeThemes) {}
	_initSelecteurFiltreMatieres(aInstance) {
		aInstance.setParametres({
			avecBoutonsPrecedentSuivant: false,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionMatiere",
			),
		});
	}
	_evntFiltreMatieres(aParam) {
		this.filtreMatiere =
			aParam.element && aParam.element.getNumero() !== null
				? aParam.element
				: null;
		if (this.instanceFiltreTheme) {
			this.actualiserFiltreTheme(this.listeThemes);
		} else {
			this.actualiser();
		}
	}
}
exports.ObjetCahierDeTexte_MobileCP = ObjetCahierDeTexte_MobileCP;

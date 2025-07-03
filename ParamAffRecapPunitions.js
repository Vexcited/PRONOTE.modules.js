exports.ParamAffRecapPunitions = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetSelecteurMotifPunition_1 = require("ObjetSelecteurMotifPunition");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetClass_1 = require("ObjetClass");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
var GenreParametreRecapPunition;
(function (GenreParametreRecapPunition) {
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["cbUniquInfAge"] = 2)
	] = "cbUniquInfAge";
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["editBorneAge"] = 3)
	] = "editBorneAge";
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["cbGpePunitions"] = 4)
	] = "cbGpePunitions";
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["cbGpeSanctions"] = 5)
	] = "cbGpeSanctions";
	GenreParametreRecapPunition[(GenreParametreRecapPunition["cbFilles"] = 6)] =
		"cbFilles";
	GenreParametreRecapPunition[(GenreParametreRecapPunition["cbGarcons"] = 7)] =
		"cbGarcons";
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["cbMesureConservatoire"] = 8)
	] = "cbMesureConservatoire";
	GenreParametreRecapPunition[
		(GenreParametreRecapPunition["cbCommission"] = 9)
	] = "cbCommission";
})(GenreParametreRecapPunition || (GenreParametreRecapPunition = {}));
class ParamAffRecapPunitions extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.initDroits();
	}
	initDroits() {
		this.droits = {
			avecPunitions: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPunitions,
			),
			avecChoixRepas: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesDemiPension,
			),
			avecChoixInternat: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionAbsencesInternat,
			),
			avecCommissions: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.avecCommissions,
			),
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbParametreAff: {
				getValue(aGenre) {
					const lSelection = aInstance.selection;
					if (lSelection) {
						switch (aGenre) {
							case GenreParametreRecapPunition.cbUniquInfAge:
								return lSelection.uniquementPlusJeunesQue;
							case GenreParametreRecapPunition.cbGpePunitions:
								return lSelection.avecGpePunitions;
							case GenreParametreRecapPunition.cbGpeSanctions:
								return lSelection.avecGpeSanctions;
							case GenreParametreRecapPunition.cbFilles:
								return lSelection.uniquementFilles;
							case GenreParametreRecapPunition.cbGarcons:
								return lSelection.uniquementGarcons;
							case GenreParametreRecapPunition.cbMesureConservatoire:
								return lSelection.avecMesuresConservatoires;
							case GenreParametreRecapPunition.cbCommission:
								return lSelection.avecCommissions;
							default:
						}
					}
					return false;
				},
				setValue(aGenre, aValue) {
					const lSelection = aInstance.selection;
					if (lSelection) {
						switch (aGenre) {
							case GenreParametreRecapPunition.cbUniquInfAge:
								lSelection.uniquementPlusJeunesQue = aValue;
								break;
							case GenreParametreRecapPunition.cbGpePunitions:
								lSelection.avecGpePunitions = aValue;
								break;
							case GenreParametreRecapPunition.cbGpeSanctions:
								lSelection.avecGpeSanctions = aValue;
								break;
							case GenreParametreRecapPunition.cbFilles:
								lSelection.uniquementFilles = aValue;
								break;
							case GenreParametreRecapPunition.cbGarcons:
								lSelection.uniquementGarcons = aValue;
								break;
							case GenreParametreRecapPunition.cbMesureConservatoire:
								lSelection.avecMesuresConservatoires = aValue;
								break;
							case GenreParametreRecapPunition.cbCommission:
								lSelection.avecCommissions = aValue;
								break;
							default:
						}
						switch (aGenre) {
							case GenreParametreRecapPunition.cbUniquInfAge:
							case GenreParametreRecapPunition.cbFilles:
							case GenreParametreRecapPunition.cbGarcons:
								aInstance.actualiserDonnees({});
								break;
							case GenreParametreRecapPunition.cbGpePunitions:
							case GenreParametreRecapPunition.cbGpeSanctions:
							case GenreParametreRecapPunition.cbCommission:
							case GenreParametreRecapPunition.cbMesureConservatoire:
								aInstance.actualiserDonnees({ avecModifCBGpe: true });
								break;
						}
					}
				},
				getDisabled(aGenre) {
					return false;
				},
			},
			inputModelTexte: {
				getValue(aGenre) {
					const lSelection = aInstance.selection;
					if (lSelection) {
						switch (aGenre) {
							case GenreParametreRecapPunition.editBorneAge:
								return lSelection.borneAge || "";
						}
					}
					return "";
				},
				setValue(aGenre, aValue) {
					const lSelection = aInstance.selection;
					if (lSelection) {
						switch (aGenre) {
							case GenreParametreRecapPunition.editBorneAge:
								lSelection.borneAge = ObjetChaine_1.GChaine.strToInteger(
									aValue || "0",
								);
								break;
						}
					}
				},
				getDisabled(aGenre) {
					const lSelection = aInstance.selection;
					if (lSelection) {
						switch (aGenre) {
							case GenreParametreRecapPunition.editBorneAge:
								return !lSelection.uniquementPlusJeunesQue;
						}
					}
					return false;
				},
				exitChange(aGenre) {
					switch (aGenre) {
						case GenreParametreRecapPunition.editBorneAge:
							aInstance.actualiserDonnees({});
							break;
					}
				},
			},
		});
	}
	_evntSelecteurMotif(aParam) {
		this.selection.motifsPunitions = aParam.listeSelection;
		this.actualiserDonnees({});
	}
	construireInstances() {
		this.identSelecteurMotifsPunitions = this.add(
			ObjetSelecteurMotifPunition_1.ObjetSelecteurMotifPunition,
			this._evntSelecteurMotif,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<fieldset class="Bordure" style="margin:0px 0px 10px 0px; padding:10px;">',
		);
		H.push(
			'<legend class="',
			ObjetClass_1.GClass.getLegende(),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("RecapAbs.criteres"),
			"</legend>",
		);
		const lIdAge = GUID_1.GUID.getId();
		H.push(
			'<div class="EspaceBas EspaceGauche"><ie-checkbox ie-model="cbParametreAff(',
			GenreParametreRecapPunition.cbUniquInfAge,
			')" class="Espace NoWrap"><span id="',
			lIdAge,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("RecapAbs.uniquJeunes"),
			"</span>",
		);
		H.push(
			'<input type="text" ie-model="inputModelTexte(',
			GenreParametreRecapPunition.editBorneAge,
			')" ie-mask="/[^0-9]/i" class="MargeGauche" maxLength="3" aria-labelledby="',
			lIdAge,
			'" style="',
			ObjetStyle_1.GStyle.composeWidth(30),
			'"/>',
		);
		H.push("</ie-checkbox></div>");
		H.push('<div class="NoWrap Espace">');
		H.push(
			'<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="cbParametreAff(',
			GenreParametreRecapPunition.cbFilles,
			')" class="Espace NoWrap">',
			ObjetTraduction_1.GTraductions.getValeur("RecapPunition.filles"),
			"</ie-checkbox></div>",
		);
		H.push(
			'<div class="EspaceBas InlineBlock"><ie-checkbox ie-model="cbParametreAff(',
			GenreParametreRecapPunition.cbGarcons,
			')" class="Espace NoWrap">',
			ObjetTraduction_1.GTraductions.getValeur("RecapPunition.garcons"),
			"</ie-checkbox></div>",
		);
		H.push("</div>");
		H.push(
			'<div class="Espace" id="',
			this.getNomInstance(this.identSelecteurMotifsPunitions),
			'"></div>',
		);
		if (
			this.droits.avecPunitions &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.avecRecapPunitions,
			)
		) {
			H.push(
				'<div class="Espace"><ie-checkbox ie-model="cbParametreAff(',
				GenreParametreRecapPunition.cbGpePunitions,
				')" class="Espace NoWrap">',
				ObjetTraduction_1.GTraductions.getValeur("RecapPunition.colPunition"),
				"</ie-checkbox></div>",
			);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.avecRecapSanctions,
			)
		) {
			H.push(
				'<div class="Espace"><ie-checkbox ie-model="cbParametreAff(',
				GenreParametreRecapPunition.cbGpeSanctions,
				')" class="Espace NoWrap">',
				ObjetTraduction_1.GTraductions.getValeur("RecapPunition.colSanction"),
				"</ie-checkbox></div>",
			);
		}
		H.push(
			'<div class="Espace"><ie-checkbox ie-model="cbParametreAff(',
			GenreParametreRecapPunition.cbMesureConservatoire,
			')" class="Espace NoWrap">',
			ObjetTraduction_1.GTraductions.getValeur(
				"RecapPunition.mesuresConservatoires",
			),
			"</ie-checkbox></div>",
		);
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.avecCommissions,
			)
		) {
			H.push(
				'<div class="Espace"><ie-checkbox ie-model="cbParametreAff(',
				GenreParametreRecapPunition.cbCommission,
				')" class="Espace NoWrap">',
				ObjetTraduction_1.GTraductions.getValeur("RecapPunition.commissions"),
				"</ie-checkbox></div>",
			);
		}
		H.push("</fieldset>");
		return H.join("");
	}
	recupererDonnees() {}
	setDonnees(aParam) {
		this.selection = aParam.selection;
		this.getInstance(this.identSelecteurMotifsPunitions).setDonnees({
			listeSelection: aParam.motifsPunitions,
			listeTotale: aParam.motifsPunitions,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Punition,
			titreLibelle:
				this.droits.avecPunitions &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecRecapPunitions,
				) &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecRecapSanctions,
				)
					? ObjetTraduction_1.GTraductions.getValeur(
							"RecapPunition.motifsPunitionSanction",
						)
					: this.droits.avecPunitions &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.punition.avecRecapPunitions,
							)
						? ObjetTraduction_1.GTraductions.getValeur(
								"RecapPunition.motifsPunition",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RecapPunition.motifsSanction",
							),
		});
	}
	actualiserDonnees(aParam) {
		this.callback.appel({
			evnt: ParamAffRecapPunitions.GenreCallback.actualiserDonnees,
			avecModifCBGpe: aParam.avecModifCBGpe,
		});
	}
}
exports.ParamAffRecapPunitions = ParamAffRecapPunitions;
(function (ParamAffRecapPunitions) {
	let GenreCallback;
	(function (GenreCallback) {
		GenreCallback[(GenreCallback["actualiserDonnees"] = 1)] =
			"actualiserDonnees";
	})(
		(GenreCallback =
			ParamAffRecapPunitions.GenreCallback ||
			(ParamAffRecapPunitions.GenreCallback = {})),
	);
})(
	ParamAffRecapPunitions ||
		(exports.ParamAffRecapPunitions = ParamAffRecapPunitions = {}),
);

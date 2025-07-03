exports.ObjetDisponibilite = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
class ObjetDisponibilite extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identDateDebDispoQCM = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evntSurDateDeb,
		);
		this.identDateFinDispoQCM = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evntSurDateFin,
		);
	}
	setOptionsAffichage(aObj) {
		this.optionsDisponibilite = aObj;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			heure: {
				getValueInit: function (aHeureDebut) {
					const lHeure = aInstance.donnees
						? aHeureDebut
							? aInstance.donnees.dateDebutPublication
							: aInstance.donnees.dateFinPublication
						: null;
					return lHeure ? ObjetDate_1.GDate.formatDate(lHeure, "%hh:%mm") : "";
				},
				exitChange: function (aHeureDebut, aValue, aParamsSetter) {
					const lHeure = aInstance.donnees
						? aHeureDebut
							? aInstance.donnees.dateDebutPublication
							: aInstance.donnees.dateFinPublication
						: null;
					if (!lHeure) {
						return;
					}
					lHeure.setHours(aParamsSetter.time.heure);
					lHeure.setMinutes(aParamsSetter.time.minute);
					aInstance.controlerModificationDate({
						idModifie: aHeureDebut ? "heureDebut" : "heureFin",
						dateModif: lHeure,
					});
				},
				getDisabled: function () {
					return !aInstance.donnees || !aInstance.donnees.actif;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const T = [];
		if (this.options) {
			let lParamDateDeb = {
				strLabelDate: this.optionsDisponibilite.afficherEnModeForm
					? ObjetTraduction_1.GTraductions.getValeur("Du")
					: this.optionsDisponibilite.chaines[0],
				idSelectDate: this.getInstance(this.identDateDebDispoQCM).getNom(),
				avecHeure: this.optionsDisponibilite.avecHeureDebut,
				modelHeure: "heure(true)",
			};
			let lParamDateFin = {
				strLabelDate: this.optionsDisponibilite.chaines[1],
				idSelectDate: this.getInstance(this.identDateFinDispoQCM).getNom(),
				avecHeure: this.optionsDisponibilite.avecHeureFin,
				modelHeure: "heure(false)",
			};
			if (this.optionsDisponibilite.afficherEnModeForm) {
				let lStyleDate = "width:15rem;";
				let lStyleHeure = "width:8rem;";
				const lHtmlDateDeb = this.composeHtmlDateHeure(
					$.extend(lParamDateDeb, {
						classLabelDate: [],
						styleLabelDate: "",
						styleHeure: lStyleHeure,
						styleDate: lStyleDate,
					}),
				);
				const lHtmlDateFin = this.composeHtmlDateHeure(
					$.extend(lParamDateFin, {
						classLabelDate: [],
						styleLabelDate: "",
						styleHeure: lStyleHeure,
						styleDate: lStyleDate,
					}),
				);
				T.push(
					IE.jsx.str(
						"div",
						{ class: "field-contain" },
						IE.jsx.str(
							"label",
							{ class: ["active", "ie-titre-petit"] },
							ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.Disponibilite",
							),
						),
						IE.jsx.str(
							"div",
							{ class: ["flex-contain", "flex-center", "justify-between"] },
							lHtmlDateDeb,
						),
						IE.jsx.str(
							"div",
							{
								class: [
									"flex-contain",
									"flex-center",
									"justify-between",
									"m-top-l",
								],
							},
							lHtmlDateFin,
						),
					),
				);
			} else {
				const lSur1Ligne = this.optionsDisponibilite.afficherSurUneSeuleLigne;
				const lLargeurPremiereZone = lSur1Ligne
					? 0
					: Math.max(
							ObjetChaine_1.GChaine.getLongueurChaine(
								this.optionsDisponibilite.chaines[0],
								10,
								true,
							),
							ObjetChaine_1.GChaine.getLongueurChaine(
								this.optionsDisponibilite.chaines[1],
								10,
								true,
							),
						);
				const lHtmlDateDeb = this.composeHtmlDateHeure(
					$.extend(lParamDateDeb, {
						classLabelDate: lSur1Ligne ? ["NoWrap"] : ["AlignementDroit"],
						styleLabelDate: lSur1Ligne
							? ""
							: "width: " + lLargeurPremiereZone + "px",
					}),
				);
				const lHtmlDateFin = this.composeHtmlDateHeure(
					$.extend(lParamDateFin, {
						classLabelDate: lSur1Ligne ? ["NoWrap"] : ["AlignementDroit"],
						styleLabelDate: lSur1Ligne
							? ""
							: "width: " + lLargeurPremiereZone + "px",
					}),
				);
				if (lSur1Ligne) {
					T.push(
						IE.jsx.str(
							"div",
							{ class: ["flex-contain", "flex-center", "flex-gap"] },
							lHtmlDateDeb,
							lHtmlDateFin,
						),
					);
				} else {
					T.push(
						IE.jsx.str(
							"div",
							{ class: ["flex-contain", "flex-center", "flex-gap"] },
							lHtmlDateDeb,
						),
					);
					T.push(
						IE.jsx.str(
							"div",
							{
								class: ["flex-contain", "flex-center", "m-top-l"],
								style: "gap: 0.5rem;",
							},
							lHtmlDateFin,
						),
					);
				}
			}
		}
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.initialiser();
		this.setDonneesDate({
			identDate: this.identDateDebDispoQCM,
			date: aDonnees.dateDebutPublication,
		});
		this.setDonneesDate({
			identDate: this.identDateFinDispoQCM,
			date: aDonnees.dateFinPublication,
		});
		if (this.donnees.premiereDateSaisie) {
			this.getInstance(this.identDateDebDispoQCM).setPremiereDateSaisissable(
				this.donnees.premiereDateSaisie,
				true,
			);
			this.getInstance(this.identDateFinDispoQCM).setPremiereDateSaisissable(
				this.donnees.premiereDateSaisie,
				true,
			);
		}
		if (aDonnees.actifFin === false) {
			this.getInstance(this.identDateDebDispoQCM).setOptionsObjetCelluleDate({
				derniereDate: aDonnees.dateFinPublication,
			});
		}
		this.getInstance(this.identDateDebDispoQCM).setActif(aDonnees.actif);
		this.getInstance(this.identDateFinDispoQCM).setActif(
			aDonnees.actif && aDonnees.actifFin !== false,
		);
		this.$refreshSelf();
	}
	evntSurDate(aParam) {
		const lDateData = aParam.dateData;
		let lDateSelect = aParam.dateSelect;
		lDateSelect.setHours(lDateData.getHours());
		lDateSelect.setMinutes(lDateData.getMinutes());
		this.controlerModificationDate({
			idModifie: aParam.idModifie,
			dateModif: lDateSelect,
		});
	}
	evntSurDateDeb(aDate) {
		this.evntSurDate({
			dateData: this.donnees.dateDebutPublication,
			dateSelect: aDate,
			idModifie: this.identDateDebDispoQCM,
		});
	}
	evntSurDateFin(aDate) {
		this.evntSurDate({
			dateData: this.donnees.dateFinPublication,
			dateSelect: aDate,
			idModifie: this.identDateFinDispoQCM,
		});
	}
	controlerModificationDate(aObj) {
		let lSansMaj = false;
		switch (aObj.idModifie) {
			case this.identDateDebDispoQCM:
			case "heureDebut":
				if (aObj.idModifie === this.identDateDebDispoQCM) {
					this.donnees.dateDebutPublication = aObj.dateModif;
				}
				if (aObj.dateModif < this.donnees.dateFinPublication) {
					lSansMaj = aObj.idModifie === "heureDebut";
					this.callback.appel(
						{ dateDebutPublication: aObj.dateModif },
						lSansMaj,
					);
				} else {
					let lDate = new Date(
						aObj.dateModif.getFullYear(),
						aObj.dateModif.getMonth(),
						aObj.dateModif.getDate(),
						this.donnees.dateFinPublication.getHours(),
						this.donnees.dateFinPublication.getMinutes(),
					);
					if (lDate <= aObj.dateModif) {
						lDate = new Date(aObj.dateModif.getTime() + 3600 * 1000);
					}
					this.donnees.dateFinPublication = lDate;
					this.setDonneesDate({
						identDate: this.identDateFinDispoQCM,
						date: this.donnees.dateFinPublication,
					});
					this.callback.appel({
						dateDebutPublication: aObj.dateModif,
						dateFinPublication: this.donnees.dateFinPublication,
					});
				}
				break;
			case this.identDateFinDispoQCM:
			case "heureFin":
				if (aObj.idModifie === this.identDateFinDispoQCM) {
					this.donnees.dateFinPublication = aObj.dateModif;
				}
				if (aObj.dateModif > this.donnees.dateDebutPublication) {
					lSansMaj = aObj.idModifie === "heureFin";
					this.callback.appel({ dateFinPublication: aObj.dateModif }, lSansMaj);
				} else {
					let lDate = new Date(
						aObj.dateModif.getFullYear(),
						aObj.dateModif.getMonth(),
						aObj.dateModif.getDate(),
						this.donnees.dateDebutPublication.getHours(),
						this.donnees.dateDebutPublication.getMinutes(),
					);
					if (lDate >= aObj.dateModif) {
						lDate = new Date(aObj.dateModif.getTime() - 3600 * 1000);
					}
					this.donnees.dateDebutPublication = lDate;
					this.setDonneesDate({
						identDate: this.identDateDebDispoQCM,
						date: this.donnees.dateDebutPublication,
					});
					this.callback.appel({
						dateDebutPublication: this.donnees.dateDebutPublication,
						dateFinPublication: aObj.dateModif,
					});
				}
				break;
		}
		this.$refreshSelf();
	}
	setDonneesDate(aObj) {
		if (aObj && aObj.date) {
			this.getInstance(aObj.identDate).setDonnees(aObj.date);
		}
	}
	composeHtmlDateHeure(aParam) {
		const T = [];
		const lClass = ["m-all-none"];
		T.push(
			IE.jsx.str(
				"label",
				{
					class: lClass.concat(aParam.classLabelDate),
					style: aParam.styleLabelDate,
				},
				aParam.strLabelDate,
			),
		);
		T.push(
			IE.jsx.str("div", {
				id: aParam.idSelectDate,
				style: aParam.styleDate || "",
			}),
		);
		if (aParam.avecHeure) {
			const lIdLabelInput = GUID_1.GUID.getId();
			T.push(
				IE.jsx.str(
					"label",
					{ for: lIdLabelInput, class: "m-all-none" },
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.A"),
				),
			);
			T.push(
				IE.jsx.str("input", {
					id: lIdLabelInput,
					type: "time",
					"ie-model": aParam.modelHeure,
					style: aParam.styleHeure || "width:auto;",
				}),
			);
		}
		return T.join("");
	}
}
exports.ObjetDisponibilite = ObjetDisponibilite;

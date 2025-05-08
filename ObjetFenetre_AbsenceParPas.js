exports.ObjetFenetre_AbsenceParPas = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetScroll_1 = require("ObjetScroll");
const ObjetScroll_2 = require("ObjetScroll");
const ObjetScroll_3 = require("ObjetScroll");
const TypeRaisonInterdictionModifAbsence_1 = require("TypeRaisonInterdictionModifAbsence");
const ObjetTraduction_1 = require("ObjetTraduction");
const jsx_1 = require("jsx");
class ObjetFenetre_AbsenceParPas extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idLibelleHeureDebut = this.Nom + "_idheuredeb";
		this.idLibelleHeureFin = this.Nom + "_idheurefin";
		this.largeurCellule = 40;
		this.hauteurCellule = 17;
		this.ScrollH = new ObjetScroll_1.ObjetScroll(
			this.Nom + ".ScrollH",
			null,
			this,
			this.getScrollLeft,
			ObjetScroll_2.EGenreScroll.Horizontal,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			clickCellule(i) {
				$(this.node).eventValidation(() => {
					aInstance.clickCellule(i);
				});
			},
		});
	}
	setDonnees(aParam) {
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(this.param.placeFin) ||
			!MethodesObjet_1.MethodesObjet.isNumeric(this.param.placeDebut)
		) {
			return;
		}
		this.afficher(this.composeContenu());
	}
	surAfficher() {
		this.ScrollH.setDonnees(0);
		this.majLibelleHeure();
	}
	majLibelleHeure() {
		const lPositionScroll = Math.floor(this.ScrollH.getPosition());
		const lLargeurScroll = Math.floor(
			this.ScrollH.getTaille(this.ScrollH.getIdZone(0)),
		);
		const lNbCaseScroll = Math.floor(lPositionScroll / this.largeurCellule);
		const lNbCaseVisible = Math.floor(lLargeurScroll / this.largeurCellule);
		const lPlaceAffichageDeb = this.param.placeDebut + lNbCaseScroll;
		const lPlaceAffichageFin = lPlaceAffichageDeb + lNbCaseVisible - 1;
		$("#" + this.idLibelleHeureDebut.escapeJQ()).text(
			ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.placeAnnuelleEnDate(lPlaceAffichageDeb),
				"%hh%sh%mm",
			),
		);
		$("#" + this.idLibelleHeureFin.escapeJQ()).text(
			ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.placeAnnuelleEnDate(lPlaceAffichageFin, true),
				"%hh%sh%mm",
			),
		);
	}
	clickCellule(aNumCel) {
		if (
			this.param.absence.tabAbs[aNumCel] &&
			this.param.absence.tabAbs[aNumCel].raison ===
				TypeRaisonInterdictionModifAbsence_1.TypeRaisonInterdictionModifAbsence
					.tRIMA_Aucune
		) {
			this.param.absence.tabAbs[aNumCel].N =
				this.param.absence.tabAbs[aNumCel].N === "0" ? "1" : "0";
			const lCellule = $(
				"#" +
					this.ScrollH.getIdZone(0).escapeJQ() +
					" table td:eq(" +
					aNumCel +
					")",
			);
			lCellule.attr(
				"aria-checked",
				this.param.absence.tabAbs[aNumCel].N !== "0" ? "true" : "false",
			);
			lCellule.html(this.composeContenuCellule(aNumCel));
		}
	}
	surValidation(ANumeroBouton) {
		if (ANumeroBouton === 1) {
			this.callback.appel(ANumeroBouton, this.param);
		}
		this.fermer();
	}
	composeContenuCellule(aIndice) {
		return (
			'<div style="width:' +
			(this.largeurCellule - 1) +
			"px;height:" +
			(this.hauteurCellule - 1) +
			'px;">' +
			(this.param.absence.tabAbs[aIndice].N !== "0"
				? '<i class="icon_check_fin theme-color"></i>'
				: "") +
			"</div>"
		);
	}
	composeContenu() {
		const lTr1 = [];
		for (
			let i = 0;
			this.param &&
			this.param.absence.tabAbs &&
			i < this.param.absence.tabAbs.length;
			i++
		) {
			lTr1.push(
				IE.jsx.str(
					"td",
					{
						class: "AlignementMilieu AvecMain",
						tabindex: "0",
						style: "border:#000 1px solid;background-color:#fff;",
						"aria-label": this.composeAriaLabel(i),
						"ie-node": (0, jsx_1.jsxFuncAttr)("clickCellule", i),
						role: "checkbox",
						"aria-checked":
							this.param.absence.tabAbs[i].N !== "0" ? "true" : "false",
					},
					this.composeContenuCellule(i),
				),
			);
		}
		return IE.jsx.str(
			"div",
			{ class: "Texte10", style: "text-align:center;" },
			IE.jsx.str(
				"div",
				{ class: "InlineBlock" },
				IE.jsx.str(
					"div",
					{ style: "width:100%;", "aria-hidden": "true" },
					IE.jsx.str("div", {
						id: this.idLibelleHeureDebut,
						style: "float:left;",
					}),
					IE.jsx.str("div", {
						id: this.idLibelleHeureFin,
						style: "float:right;",
					}),
					IE.jsx.str("div", { style: "clear:both;" }),
				),
				IE.jsx.str(
					"div",
					{
						id: this.ScrollH.getIdZone(0),
						style: "overflow:hidden;width:338px;margin:0 15px",
						onscroll: this.Nom + ".majLibelleHeure();",
					},
					IE.jsx.str(
						"table",
						{ style: "border:#000 1px solid;" },
						IE.jsx.str("tr", null, lTr1.join("")),
					),
				),
				IE.jsx.str("div", {
					id: this.ScrollH.getIdScroll(),
					style: "margin:0 15px;",
				}),
			),
		);
	}
	composeAriaLabel(aIndice) {
		const lPlace = this.param.absence.tabAbs[aIndice].place;
		return ObjetTraduction_1.GTraductions.getValeur("dea", [
			ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.placeAnnuelleEnDate(lPlace),
				"%hh%sh%mm",
			),
			ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.placeAnnuelleEnDate(lPlace, true),
				"%hh%sh%mm",
			),
		]);
	}
	getScrollLeft(AGenre, AScrollLeft) {
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleContenu) {
			return (
				(this.param.absence.tabAbs ? this.param.absence.tabAbs.length : 0) *
					this.largeurCellule +
				1
			);
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleZone) {
			const lTailleZoneMax = $("#" + this.Nom.escapeJQ()).width() - 12 - 30;
			const lNbCaseVisibles = this.param.absence.tabAbs
				? this.param.absence.tabAbs.length
				: 0;
			if (lTailleZoneMax < lNbCaseVisibles * this.largeurCellule) {
				return (
					Math.floor(lTailleZoneMax / this.largeurCellule) *
						this.largeurCellule +
					1
				);
			} else {
				return lNbCaseVisibles * this.largeurCellule + 1;
			}
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.Deplacement) {
			return AScrollLeft - (AScrollLeft % this.largeurCellule);
		}
	}
}
exports.ObjetFenetre_AbsenceParPas = ObjetFenetre_AbsenceParPas;

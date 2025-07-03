exports.ObjetOnglet = void 0;
const ParametresAffichageOnglet_1 = require("ParametresAffichageOnglet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Divers_1 = require("Enumere_Divers");
const ObjetIdentite_1 = require("ObjetIdentite");
class ObjetOnglet extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.NomTable = this.Nom + "_idTable";
		this.NomCellule = this.Nom + "_idTd";
		this.visible = true;
		this.actif = true;
		this.selectionne = false;
		this.survol = false;
	}
	setParametres(aParametres) {
		this.libelle = aParametres.libelle;
		this.hint = aParametres.hint;
		this.icone = aParametres.icone;
		this.genre = aParametres.genre;
		this.position = aParametres.position;
	}
	setParametresAffichage(aPAActif, aPAInactif) {
		this.parametresAffichageActif =
			aPAActif !== null && aPAActif !== undefined
				? aPAActif
				: new ParametresAffichageOnglet_1.ParametresAffichageOnglet();
		this.parametresAffichageInactif =
			aPAInactif !== null && aPAInactif !== undefined
				? aPAInactif
				: new ParametresAffichageOnglet_1.ParametresAffichageOnglet();
	}
	setVisible(aVisible) {
		this.visible = aVisible;
	}
	estVisible() {
		return this.visible;
	}
	setSelection(aSelectionne) {
		this.selectionne = aSelectionne;
		this.afficher();
	}
	afficher() {
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage());
	}
	construireAffichage() {
		const H = [];
		if (!this.visible) {
		} else {
			H.push(this.afficherOnglet(this.getParametresAffichageCourant()));
		}
		return H.join("");
	}
	afficherOnglet(aParametresAffichage) {
		const lClasses = [
			"AvecMain EspaceGauche",
			this.getClassTexteDepuisTaillePolice(
				aParametresAffichage.getTailleTexte(this.selectionne, this.survol),
			),
			aParametresAffichage.getTexteGras(this.selectionne, this.survol)
				? "Gras"
				: "",
			aParametresAffichage.getTexteSouligne(this.selectionne, this.survol)
				? "Souligne"
				: "",
		];
		switch (
			aParametresAffichage.getTexteAlignement(this.selectionne, this.survol)
		) {
			case Enumere_Divers_1.EAlignementHorizontal.gauche:
				lClasses.push("AlignementGauche");
				break;
			case Enumere_Divers_1.EAlignementHorizontal.droit:
				lClasses.push("AlignementDroit");
				break;
			case Enumere_Divers_1.EAlignementHorizontal.centre:
				lClasses.push("AlignementMilieu");
				break;
		}
		const lJSXNode = (aNode) => {
			$(aNode)
				.eventValidation(() => {
					this.surOnclick(aNode.id);
				})
				.on({
					mouseover: () => {
						this.surMouseOver();
					},
					mouseout: () => {
						this.surMouseOut();
					},
				});
		};
		return IE.jsx.str(
			"table",
			{
				id: this.NomTable,
				role: "presentation",
				style: {
					height: "100%",
					"background-color": aParametresAffichage.getCouleur(
						this.selectionne,
						this.survol && !this.selectionne,
					),
					"border-top":
						aParametresAffichage.getEpaisseurBordureCoinSuperieurGauche(
							this.selectionne,
							this.survol,
						) +
						"px solid " +
						(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
							? aParametresAffichage.getCouleurBordureCoinSuperieurGauche(
									this.selectionne,
									this.survol,
								)
							: aParametresAffichage.getCouleur(this.selectionne, this.survol)),
					"border-left":
						aParametresAffichage.getEpaisseurBordureCoinSuperieurGauche(
							this.selectionne,
							this.survol,
						) +
						"px solid " +
						(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
							? aParametresAffichage.getCouleurBordureCoinSuperieurGauche(
									this.selectionne,
									this.survol,
								)
							: aParametresAffichage.getCouleur(this.selectionne, this.survol)),
					"border-right":
						aParametresAffichage.getEpaisseurBordureCoinInferieurDroit(
							this.selectionne,
							this.survol,
						) +
						"px solid " +
						(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
							? aParametresAffichage.getCouleurBordureCoinInferieurDroit(
									this.selectionne,
									this.survol,
								)
							: aParametresAffichage.getCouleur(this.selectionne, this.survol)),
				},
			},
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{
						id: this.NomCellule,
						tabindex: "0",
						role: "button",
						style: {
							color: aParametresAffichage.getCouleurTexte(
								this.selectionne,
								this.survol,
							),
						},
						class: lClasses,
						title: this.hint,
						"ie-node": lJSXNode,
					},
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center" },
						this.icone
							? IE.jsx.str(
									IE.jsx.fragment,
									null,
									IE.jsx.str(
										"div",
										{
											id: `${this.Nom}_icone_0`,
											style: this.selectionne ? "" : "display: none;",
										},
										IE.jsx.str("i", {
											class: this.icone,
											role: "presentation",
										}),
									),
									IE.jsx.str(
										"div",
										{
											id: `${this.Nom}_icone_1`,
											class: "Inactif",
											style: this.selectionne ? "display: none;" : "",
										},
										IE.jsx.str("i", {
											class: this.icone,
											role: "presentation",
										}),
									),
								)
							: "",
						IE.jsx.str(
							"div",
							{ style: "position:relative;" },
							IE.jsx.str(
								"div",
								{
									style: "position:relative; visibility:hidden;",
									class: "Insecable p-right-l Gras",
								},
								this.libelle,
							),
							IE.jsx.str(
								"div",
								{
									style: "position:absolute;top:0;left:0;",
									id: `${this.Nom}_libelle`,
								},
								" ",
								this.libelle,
							),
						),
					),
				),
			),
		);
	}
	surOnclick(aId) {
		this.callback.appel({ genre: this.genre, position: this.position });
		ObjetHtml_1.GHtml.setFocus(aId, true);
	}
	surMouseOver() {
		this.surEvenementSurvol(true);
	}
	surMouseOut() {
		this.surEvenementSurvol(false);
	}
	surEvenementSurvol(aSurvol) {
		const lParametresAffichage = this.getParametresAffichageCourant();
		ObjetHtml_1.GHtml.delClass(
			this.NomCellule,
			this.getClassTexteDepuisTaillePolice(
				lParametresAffichage.getTailleTexte(this.selectionne, !aSurvol),
			),
		);
		ObjetHtml_1.GHtml.addClass(
			this.NomCellule,
			this.getClassTexteDepuisTaillePolice(
				lParametresAffichage.getTailleTexte(this.selectionne, aSurvol),
			),
		);
		ObjetStyle_1.GStyle.setCouleurFond(
			this.NomCellule,
			lParametresAffichage.getCouleur(
				this.selectionne,
				aSurvol && !this.selectionne,
			),
		);
		ObjetStyle_1.GStyle.setGras(
			this.Nom + "_libelle",
			lParametresAffichage.getTexteGras(this.selectionne, aSurvol),
		);
		ObjetStyle_1.GStyle.setDisplay(
			this.Nom + "_icone_0",
			aSurvol || this.selectionne,
		);
		ObjetStyle_1.GStyle.setDisplay(
			this.Nom + "_icone_1",
			!(aSurvol || this.selectionne),
		);
	}
	getParametresAffichageCourant() {
		if (this.actif) {
			return this.parametresAffichageActif;
		} else {
			return this.parametresAffichageInactif;
		}
	}
	getClassTexteDepuisTaillePolice(aTaillePolice) {
		return "Texte" + aTaillePolice;
	}
}
exports.ObjetOnglet = ObjetOnglet;

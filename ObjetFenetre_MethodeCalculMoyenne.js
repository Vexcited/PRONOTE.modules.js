exports.ObjetFenetre_MethodeCalculMoyenne = void 0;
const ObjetRequeteMethodeCalculMoyenne_1 = require("ObjetRequeteMethodeCalculMoyenne");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_MethodeCalculMoyenne extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
	}
	getParametresCalcul() {
		return this.parametresCalcul;
	}
	composeTitreFormule() {
		if (this.titreFenetre) {
			this.setOptionsFenetre({ titre: this.titreFenetre + "&nbsp;" });
		}
		if (this.titreFormule) {
			return this.titreFormule;
		}
		const lLibelleMatiere = this.parametresCalcul.module
			? this.parametresCalcul.module.getLibelle()
			: this.parametresCalcul.service
				? this.parametresCalcul.service.matiere
					? this.parametresCalcul.service.matiere.getLibelle()
					: this.parametresCalcul.service.getLibelle()
				: "";
		let lTitre;
		if (lLibelleMatiere.length > 0) {
			lTitre = this.parametresCalcul.pourMoyenneNette
				? ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.FenetreCalculMoyenneNetteAvecMatiere",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.FenetreCalculMoyenneBruteAvecMatiere",
					);
		} else {
			lTitre = this.parametresCalcul.pourMoyenneNette
				? ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.FenetreCalculMoyenneNette",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.FenetreCalculMoyenneBrute",
					);
		}
		return ObjetChaine_1.GChaine.format(lTitre, [
			this.parametresCalcul.libelleEleve,
			lLibelleMatiere,
		]);
	}
	composeContenu() {
		var _a, _b;
		const T = [];
		if (this.donneesRecues) {
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"h2",
						{ class: "Texte10 Espace Gras", style: "margin-bottom: 5px;" },
						this.composeTitreFormule(),
					),
					IE.jsx.str(
						"div",
						{
							class: "Texte10 Espace FondBlanc MethodeCalculMoyenne",
							"aria-hidden": (
								(_a = this.formuleWAI) === null || _a === void 0
									? void 0
									: _a.length
							)
								? "true"
								: false,
						},
						this.formuleHTML,
					),
					((_b = this.formuleWAI) === null || _b === void 0
						? void 0
						: _b.length) &&
						IE.jsx.str("div", { class: "sr-only" }, this.formuleWAI),
					IE.jsx.str(
						"div",
						{ class: "Texte10 Espace FondBlanc MethodeCalculMoyenne" },
						this.formuleLegende,
					),
				),
			);
		}
		return T.join("");
	}
	async setDonnees(aParametresCalcul) {
		this.parametresCalcul = aParametresCalcul;
		const lJSONReponse =
			await new ObjetRequeteMethodeCalculMoyenne_1.ObjetRequeteMethodeCalculMoyenne(
				this,
			).lancerRequete(aParametresCalcul);
		this.formuleHTML = lJSONReponse.FormuleHTML;
		this.formuleLegende = lJSONReponse.FormuleLegende;
		this.formuleWAI = lJSONReponse.FormuleWAI;
		this.donneesRecues = true;
		if (IE.estMobile) {
			this.afficher(this.composeContenu());
		} else {
			this.titreFormule = lJSONReponse.titreFormule;
			this.titreFenetre = lJSONReponse.titreFenetre;
			this.actualiser();
			this.afficher();
		}
	}
}
exports.ObjetFenetre_MethodeCalculMoyenne = ObjetFenetre_MethodeCalculMoyenne;

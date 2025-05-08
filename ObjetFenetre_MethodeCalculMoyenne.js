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
		const T = [];
		if (this.donneesRecues) {
			T.push(
				'<div class="Texte10 Espace Gras" style="margin-bottom: 5px;">',
				this.composeTitreFormule(),
				"</div>",
			);
			T.push(
				'<div class="Texte10 Espace FondBlanc MethodeCalculMoyenne">' +
					this.formuleHTML +
					"</div>",
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

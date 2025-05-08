exports.WidgetIntendanceExecute = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetIntendanceExecute extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			html: this.composeWidgetIntendanceExecute(),
			nbrElements: this.donnees.listeLignes
				? this.donnees.listeLignes.count()
				: 0,
			afficherMessage: this.donnees.listeLignes
				? this.donnees.listeLignes.count() === 0
				: true,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetIntendanceExecute() {
		const H = [];
		H.push("<ul>");
		if (this.donnees.listeLignes) {
			for (let i = 0, lNbr = this.donnees.listeLignes.count(); i < lNbr; i++) {
				const lDonnee = this.donnees.listeLignes.get(i);
				H.push(
					"<li>",
					'<div class="wrap">',
					"<h3",
					lDonnee.commentaire ? ' ie-hint="' + lDonnee.commentaire + ' "' : "",
					"><span>",
					lDonnee.detail,
					"</span>",
					lDonnee.nature && lDonnee.nature.existeNumero()
						? " - <span>" + lDonnee.nature.getLibelle() + "</span>"
						: "",
					"</h3>",
				);
				if (
					this.donnees.page &&
					this.donnees.page.Onglet !==
						Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieSecretariat &&
					this.donnees.page.Onglet !==
						Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieCommandes
				) {
					const lListeLieux = lDonnee.listeLieux.getListeElements(
						(aElement) => {
							return aElement.existe();
						},
					);
					lListeLieux.trier();
					H.push(
						lListeLieux && lListeLieux.getNbrElementsExistes() > 0
							? "<span>" +
									lListeLieux.getTableauLibelles(null, null, true).join(", ") +
									" </span>"
							: "",
					);
				}
				H.push(
					"<span>",
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Widget.DemandeParLe",
						[
							lDonnee.demandeur ? lDonnee.demandeur.getLibelle() : "",
							ObjetDate_1.GDate.formatDate(
								lDonnee.dateCreation,
								"%JJJJ %JJ %MMM",
							),
						],
					),
					"</span>",
				);
				H.push("</div>");
				H.push("</li>");
			}
		}
		H.push("</ul>");
		return H.join("");
	}
}
exports.WidgetIntendanceExecute = WidgetIntendanceExecute;

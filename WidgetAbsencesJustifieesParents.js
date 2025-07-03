exports.WidgetAbsencesJustifieesParents = void 0;
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetAbsencesJustifieesParents extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lListeJustifsARegler = this.donnees.listeJustificationsARegler;
		const lWidget = {
			getHtml: this._composeWidgetAbsRetardsJustifies.bind(
				this,
				lListeJustifsARegler,
			),
			afficherMessage:
				!lListeJustifsARegler || lListeJustifsARegler.count() === 0,
		};
		$.extend(true, aParams.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	_composeWidgetAbsRetardsJustifies(aListeJustifsARegler) {
		const H = [];
		if (!!aListeJustifsARegler) {
			H.push("<ul>");
			aListeJustifsARegler.parcourir((aJustification) => {
				H.push(this._composeAbsRetardJustifie(aJustification));
			});
			H.push("</ul>");
		}
		return H.join("");
	}
	_composeAbsRetardJustifie(aJustification) {
		const H = [];
		if (!!aJustification) {
			const lClassIcone =
				Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
					aJustification.getGenre(),
					{ estLue: true },
				);
			const lEleve = aJustification.eleve;
			const lClasse = aJustification.classe;
			const lStrEleve = [];
			if (!!lEleve) {
				lStrEleve.push("<h3>", lEleve.getLibelle());
				if (!!lClasse) {
					lStrEleve.push(" (", lClasse.getLibelle(), ")");
				}
				lStrEleve.push("</h3>");
			}
			const lStrDate = [];
			if (!!aJustification.strDate) {
				lStrDate.push('<span class="date">', aJustification.strDate, "</span>");
			}
			const lStrMotifPJ = [];
			if (!!aJustification.strMotif) {
				lStrMotifPJ.push('<div class="justif-pj">', aJustification.strMotif);
				if (
					!!aJustification.listeDocJointsParent &&
					aJustification.listeDocJointsParent.count() > 0
				) {
					const lPremierDocJoint = aJustification.listeDocJointsParent.get(0);
					const lLienDocument = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
						lPremierDocJoint,
						{
							genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						},
					);
					lStrMotifPJ.push(
						IE.jsx.str("a", {
							href: lLienDocument,
							class: "icon_piece_jointe",
							"ie-tooltiplabel": lPremierDocJoint.getLibelle(),
						}),
					);
				}
				lStrMotifPJ.push("</div>");
			}
			H.push(
				'<li class="icon ',
				lClassIcone,
				'">',
				'<div class="wrap">',
				lStrEleve.join(""),
				lStrDate.join(""),
				lStrMotifPJ.join(""),
				"</div>",
				"</li>",
			);
		}
		return H.join("");
	}
}
exports.WidgetAbsencesJustifieesParents = WidgetAbsencesJustifieesParents;

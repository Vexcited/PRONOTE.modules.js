exports.WidgetAppelNonFait = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const tag_1 = require("tag");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetAppelNonFait extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.donnees.listeAppelNonFait.setTri([
			ObjetTri_1.ObjetTri.init("dateDebut"),
		]);
		this.donnees.listeAppelNonFait.trier(
			Enumere_TriElement_1.EGenreTriElement.Decroissant,
		);
		const lNbrElements = this.donnees.listeAppelNonFait
			? this.donnees.listeAppelNonFait.count()
			: 0;
		const lWidget = {
			html: this.composeWidgetAppelNonFait(),
			nbrElements: lNbrElements,
			afficherMessage: lNbrElements === 0,
		};
		$.extend(true, this.donnees, lWidget);
		UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
		aParams.construireWidget(aParams.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeAppelNonFait(aNumeroAppelNonFait, aDateDebutInMillis) {
				$(this.node).eventValidation(() => {
					aInstance._surAppelNonFait(aNumeroAppelNonFait, aDateDebutInMillis);
				});
			},
		});
	}
	composeWidgetAppelNonFait() {
		const H = [];
		H.push('<ul class="liste-clickable">');
		for (let i = 0; i < this.donnees.listeAppelNonFait.count(); i++) {
			const lAppelNonFait = this.donnees.listeAppelNonFait.get(i);
			H.push("<li>");
			H.push(
				'<a class="wrapper-link" tabindex="0" ie-node="nodeAppelNonFait(\'',
				lAppelNonFait.getNumero(),
				"', ",
				lAppelNonFait.dateDebut ? lAppelNonFait.dateDebut.getTime() : 0,
				')">',
				'<div class="wrap">',
				!lAppelNonFait.estVerrouille
					? "<h3>" +
							ObjetDate_1.GDate.formatDate(
								lAppelNonFait.dateDebut,
								"[%JJJ %JJ]",
							) +
							" - " +
							lAppelNonFait.strHeure +
							" </h3>"
					: "",
				'<div class="infos-conteneur">',
			);
			if (lAppelNonFait.estSortiePeda) {
				H.push(
					(0, tag_1.tag)(
						"span",
						{
							class: "icon-sortie-peda",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.appelNonFait.HintAcc",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.appelNonFait.InitialeAbsAccompagnement",
						),
					),
				);
			}
			H.push("<span>", lAppelNonFait.strMatiere, "</span>");
			H.push("</div>", "</div>");
			H.push(
				lAppelNonFait.strClasse || lAppelNonFait.strClasse !== ""
					? '<div class="as-info fixed">' + lAppelNonFait.strClasse + "</div>"
					: "",
			);
			H.push("</a>");
			H.push("</li>");
		}
		H.push("</ul>");
		return H.join("");
	}
	_surAppelNonFait(aNumeroAppelNonFait, aDateDebutInMillis) {
		let lAppelNonFaitConcerne = null;
		if (this.donnees.listeAppelNonFait) {
			for (const lAppelNonFait of this.donnees.listeAppelNonFait) {
				if (lAppelNonFait.getNumero() === aNumeroAppelNonFait) {
					if (
						(!lAppelNonFait.dateDebut && !aDateDebutInMillis) ||
						lAppelNonFait.dateDebut.getTime() === aDateDebutInMillis
					) {
						lAppelNonFaitConcerne = lAppelNonFait;
						break;
					}
				}
			}
		}
		if (lAppelNonFaitConcerne) {
			this.etatUtilisateurSco.setNavigationCours(lAppelNonFaitConcerne);
			this.etatUtilisateurSco.setNavigationDate(
				lAppelNonFaitConcerne.dateDebut,
			);
			let lPageDestination;
			if (this.etatUtilisateurSco.estEspaceMobile()) {
				lPageDestination = { genreOngletDest: this.donnees.page.Onglet };
			} else {
				lPageDestination = this.donnees.page;
			}
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
				lPageDestination,
			);
		}
	}
}
exports.WidgetAppelNonFait = WidgetAppelNonFait;

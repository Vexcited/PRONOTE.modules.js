exports.WidgetCoursNonAssures = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTri_1 = require("ObjetTri");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
class WidgetCoursNonAssures extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.idContenu = this.Nom + "_Contenu";
		this.creerObjetsCoursNonAssures();
		this.ProfCoursNonAssures.Selection = 0;
		const lWidget = {
			html: this.composeWidgetCoursNonAssures(),
			afficherMessage: this.donnees.listeCoursNonAssures
				? this.donnees.listeCoursNonAssures.count() === 0
				: true,
			listeElementsGraphiques: [{ id: this.ProfCoursNonAssures.getNom() }],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		if (
			!!this.donnees.listeCoursNonAssures &&
			this.donnees.listeCoursNonAssures.count() !== 0
		) {
			this.initialiserObjetsCoursNonAssures();
		}
	}
	creerObjetsCoursNonAssures() {
		this.ProfCoursNonAssures = ObjetIdentite_1.Identite.creerInstance(
			ObjetSaisie_1.ObjetSaisie,
			{ pere: this, evenement: this._evenementProfCoursNonAssures },
		);
		if (
			!!this.donnees.listeCoursNonAssures &&
			this.donnees.listeCoursNonAssures.count() !== 0
		) {
			this._initialiserProfCoursNonAssures(this.ProfCoursNonAssures);
		}
	}
	initialiserObjetsCoursNonAssures() {
		this.ProfCoursNonAssures.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.SelectionProfesseur",
			),
		});
		this.ProfCoursNonAssures.initialiser();
		this.ProfCoursNonAssures.setDonnees(
			this.donnees.listeProfCoursNonAssures,
			0,
		);
	}
	composeWidgetCoursNonAssures() {
		if (this.donnees.listeCoursNonAssures) {
			this.donnees.listeCoursNonAssures.setTri([
				ObjetTri_1.ObjetTri.init("strProf"),
				ObjetTri_1.ObjetTri.init("dateDuCours"),
				ObjetTri_1.ObjetTri.init("placeDebut"),
			]);
			this.donnees.listeCoursNonAssures.trier();
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ id: this.idContenu },
					this._composeCoursNonAssures(),
				),
			),
		);
		return H.join("");
	}
	_initialiserProfCoursNonAssures(aObjet) {
		aObjet.setOptionsObjetSaisie({
			longueur: 100,
			avecBoutonsPrecSuiv: true,
			avecBoutonsPrecSuivVisiblesInactifs: false,
		});
	}
	_evenementProfCoursNonAssures(aParams) {
		if (
			aParams.element &&
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.ProfCoursNonAssures.InteractionUtilisateur
		) {
			ObjetHtml_1.GHtml.setHtml(this.idContenu, this._composeCoursNonAssures());
		}
	}
	_composeCoursNonAssures() {
		const H = [];
		H.push("<ul>");
		if (this.donnees.listeCoursNonAssures) {
			for (let i = 0; i < this.donnees.listeCoursNonAssures.count(); i++) {
				const lCoursNonAssure = this.donnees.listeCoursNonAssures.get(i);
				if (
					this.donnees.listeProfCoursNonAssures
						.get(this.ProfCoursNonAssures.Selection)
						.getNumero() === lCoursNonAssure.professeur.getNumero()
				) {
					H.push('<li tabindex="0">');
					H.push(
						'<div class="wrap">',
						'<div class="bloc-date-conteneur">',
						ObjetDate_1.GDate.formatDate(
							lCoursNonAssure.dateDuCours,
							"<div>%JJ</div><div>%MMM</div>",
						),
						"</div>",
						'<div class="bloc-infos-conteneur">',
						'<div class="Gras">',
						lCoursNonAssure.strDebut,
						"</div>",
						"<span>" + lCoursNonAssure.strClasse + "</span>",
						lCoursNonAssure.strSalle
							? "<span> - " + lCoursNonAssure.strSalle + "</span>"
							: "",
						lCoursNonAssure.strRemplacement
							? "<span> - " + lCoursNonAssure.strRemplacement + "</span>"
							: "",
						"</div>",
						"</div>",
					);
					H.push("</li>");
				}
			}
		}
		H.push("</ul>");
		return H.join("");
	}
}
exports.WidgetCoursNonAssures = WidgetCoursNonAssures;

exports.WidgetExclusions = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
class WidgetExclusions extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.creerObjetsExclusions();
		const lWidget = {
			getHtml: this.composeWidgetExclusion.bind(this),
			nbrElements: this.donnees.listeExclusions.count(),
			afficherMessage: this.donnees.listeExclusions.count() === 0,
			message: this.donnees.messageAucuneDonnee,
			listeElementsGraphiques: [{ id: this.saisieSemaine.getNom() }],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		this.initialiserObjetsExclusions();
	}
	creerObjetsExclusions() {
		this.saisieSemaine = ObjetIdentite_1.Identite.creerInstance(
			ObjetSaisie_1.ObjetSaisie,
			{ pere: this, evenement: this._evenementSemaineExclusion },
		);
		this._initialiserSaisieSemaine(this.saisieSemaine);
	}
	initialiserObjetsExclusions() {
		this.saisieSemaine.initialiser();
		const lDomaineConsultation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
		);
		const lListeSemaines = ObjetDate_1.GDate.getListeSemaines(
			this.numeroSemaineParDefaut,
			lDomaineConsultation.getValeur(this.numeroSemaineParDefaut + 1)
				? this.numeroSemaineParDefaut + 1
				: this.numeroSemaineParDefaut,
			Enumere_TriElement_1.EGenreTriElement.Croissant,
		);
		this.saisieSemaine.setDonnees(
			lListeSemaines,
			lListeSemaines.getIndiceParNumeroEtGenre(
				null,
				this.donneesRequete.exclusions.numeroSemaine,
			),
		);
	}
	composeWidgetExclusion() {
		const H = [];
		H.push("<ul>");
		for (
			let i = 0, lNbr = this.donnees.listeExclusions.count();
			i < lNbr;
			i++
		) {
			const lElt = this.donnees.listeExclusions.get(i);
			H.push("<li>", '<div class="wrap">');
			H.push("<h3>", lElt.individu + " - " + lElt.classe, "</h3>");
			H.push("<span>" + lElt.sanction, "</span>");
			H.push("</div>", "</li>");
		}
		H.push("</ul>");
		return H.join("");
	}
	_initialiserSaisieSemaine(aObjet) {
		aObjet.setOptionsObjetSaisie({
			longueur: 100,
			avecBoutonsPrecSuiv: true,
			avecBoutonsPrecSuivVisiblesInactifs: false,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionSemaine",
			),
		});
	}
	_evenementSemaineExclusion(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.saisieSemaine.InteractionUtilisateur
		) {
			this.donneesRequete.exclusions.numeroSemaine = aParams.element.getGenre();
			this.donnees.semaineSelectionnee =
				this.donneesRequete.exclusions.numeroSemaine;
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
			);
		}
	}
}
exports.WidgetExclusions = WidgetExclusions;

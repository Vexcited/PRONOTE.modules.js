exports.WidgetIncidents = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFicheIncident_1 = require("ObjetFicheIncident");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
class WidgetIncidents extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
	}
	construire(aParams) {
		var _a;
		this.donnees = aParams.donnees;
		this.creerObjetsIncidents();
		const lWidget = {
			html: this.composeWidgetIncident(),
			nbrElements:
				(_a = this.donnees.listeIncidents) === null || _a === void 0
					? void 0
					: _a.count(),
			afficherMessage:
				!this.donnees.listeIncidents ||
				this.donnees.listeIncidents.count() === 0,
			message: this.donnees.messageAucuneDonnee,
			fermerFiches: () => {
				this.ficheIncident.fermer();
			},
			listeElementsGraphiques: [{ id: this.saisieSemaine.getNom() }],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		this.initialiserObjetsIncidents();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			surEvenementIncident(aIndice) {
				$(this.node).eventValidation(() => {
					aInstance._surEvenementIncident(aIndice);
				});
			},
		});
	}
	creerObjetsIncidents() {
		this.ficheIncident = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFicheIncident_1.ObjetFicheIncident,
			{ pere: this, evenement: this._evenementSurFicheIncident },
		);
		this.ficheIncident.destructionSurFermeture = false;
		this.ficheIncident.initialiser();
		this.saisieSemaine = ObjetIdentite_1.Identite.creerInstance(
			ObjetSaisie_1.ObjetSaisie,
			{ pere: this, evenement: this._evenementSemaineIncident },
		);
		this._initialiserSaisieSemaine(this.saisieSemaine);
	}
	initialiserObjetsIncidents() {
		this.saisieSemaine.initialiser();
		const lDomaineConsultation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
		);
		const lListeSemaines = ObjetDate_1.GDate.getListeSemaines(
			lDomaineConsultation.getValeur(this.numeroSemaineParDefaut - 1)
				? this.numeroSemaineParDefaut - 1
				: this.numeroSemaineParDefaut,
			this.numeroSemaineParDefaut,
			Enumere_TriElement_1.EGenreTriElement.Croissant,
		);
		this.saisieSemaine.setDonnees(
			lListeSemaines,
			lListeSemaines.getIndiceParNumeroEtGenre(
				null,
				this.donneesRequete.incidents.numeroSemaine,
			),
		);
	}
	composeWidgetIncident() {
		var _a;
		const H = [];
		H.push('<ul class="liste-clickable">');
		for (
			let i = 0,
				lNbr =
					(_a = this.donnees.listeIncidents) === null || _a === void 0
						? void 0
						: _a.count();
			i < lNbr;
			i++
		) {
			const lElt = this.donnees.listeIncidents.get(i);
			const lNodeLigneEvenement = "surEvenementIncident(" + i + ")";
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"li",
						null,
						IE.jsx.str(
							"a",
							{
								tabindex: "0",
								class: "wrapper-link",
								"ie-node": lNodeLigneEvenement,
							},
							IE.jsx.str(
								"div",
								{ class: "wrap" },
								IE.jsx.str("h3", null, lElt.strDate),
								IE.jsx.str("span", null, lElt.strSignale),
							),
						),
					),
				),
			);
		}
		H.push("</ul>");
		return H.join("");
	}
	_surEvenementIncident(i) {
		this.ficheIncident.setDonnees(this.donnees.listeIncidents.get(i));
	}
	_evenementSurFicheIncident() {
		const lIncidentFiche = this.ficheIncident.getIncident();
		if (
			lIncidentFiche &&
			lIncidentFiche.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
		) {
			const lObjSaisie = {
				incidents: {
					listeIncidents: new ObjetListeElements_1.ObjetListeElements(),
				},
			};
			lObjSaisie.incidents.listeIncidents.add(lIncidentFiche);
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.SaisieWidget,
				lObjSaisie,
			);
		}
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
	_evenementSemaineIncident(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.saisieSemaine.InteractionUtilisateur
		) {
			this.donneesRequete.incidents.numeroSemaine = aParams.element.getGenre();
			this.donnees.semaineSelectionnee =
				this.donneesRequete.incidents.numeroSemaine;
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
			);
		}
	}
}
exports.WidgetIncidents = WidgetIncidents;

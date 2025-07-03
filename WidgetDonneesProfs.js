exports.WidgetDonneesProfs = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
class WidgetDonneesProfs extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.creerObjetsDonneesProfs();
		const lWidget = {
			getHtml: this.composeWidgetDonneesProfs.bind(this),
			nbrElements: 0,
			afficherMessage: this.donnees.listeDonneesProfs
				? this.donnees.listeDonneesProfs.count() === 0
				: true,
			listeElementsGraphiques: [
				{ id: this.saisieSemaineDonneesProfs.getNom() },
			],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		if (!this.etatUtilisateurSco.estEspaceMobile()) {
			this.initialiserObjetsDonneesProfs();
		}
	}
	composeWidgetDonneesProfs() {
		const H = [];
		const lListe = this.donnees.listeDonneesProfs;
		if (lListe) {
			const lNbrLignes = this.donnees.strTypeDonnee.length;
			if (lNbrLignes > 0) {
				H.push('<table class="widget-table half-squared-line">');
				H.push("<tr>");
				H.push('<th scope="cols"></th>');
				for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
					H.push(
						'<th scope="col">',
						this.etatUtilisateurSco.estEspaceMobile() &&
							ObjetDate_1.GDate.estJourEgal(
								lListe.get(i).date,
								ObjetDate_1.GDate.aujourdhui,
							)
							? ObjetTraduction_1.GTraductions.getValeur("Aujourdhui")
							: lListe.get(i).strDate,
						"</th>",
					);
				}
				H.push("</tr>");
				for (let i = 0; i < lNbrLignes; i++) {
					H.push("<tr>");
					H.push(
						'<th scope="row" tabindex="0"><span title="',
						this.donnees.strTypeDonnee[i],
						'">',
						this.donnees.strTypeDonnee[i],
						"</span></th>",
					);
					for (let j = 0, lNbr = lListe.count(); j < lNbr; j++) {
						H.push(
							'<td tabindex="0"><span>',
							lListe.get(j).listeDonnees[i].strValeur,
							"</span></td>",
						);
					}
					H.push("</tr>");
				}
				H.push("</table>");
			}
		}
		return H.join("");
	}
	creerObjetsDonneesProfs() {
		this.saisieSemaineDonneesProfs = ObjetIdentite_1.Identite.creerInstance(
			ObjetSaisie_1.ObjetSaisie,
			{ pere: this, evenement: this._evenementSemaineDonneesProfs },
		);
		if (!this.etatUtilisateurSco.estEspaceMobile()) {
			this._initialiserSaisieSemaine(this.saisieSemaineDonneesProfs);
		}
	}
	initialiserObjetsDonneesProfs() {
		this.saisieSemaineDonneesProfs.initialiser();
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
		this.saisieSemaineDonneesProfs.setDonnees(
			lListeSemaines,
			lListeSemaines.getIndiceParNumeroEtGenre(
				null,
				this.donneesRequete.donneesProfs.numeroSemaine,
			),
		);
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
	_evenementSemaineDonneesProfs(aParams) {
		if (
			aParams.element &&
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.saisieSemaineDonneesProfs.InteractionUtilisateur
		) {
			this.donneesRequete.donneesProfs.numeroSemaine =
				aParams.element.getGenre();
			this.donnees.semaineSelectionnee =
				this.donneesRequete.donneesProfs.numeroSemaine;
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
			);
		}
	}
}
exports.WidgetDonneesProfs = WidgetDonneesProfs;

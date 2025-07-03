exports.WidgetEDTJournalier = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
const UtilitaireEDTJournalier_1 = require("UtilitaireEDTJournalier");
class WidgetEDTJournalier extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.optionsFenetre = {};
		this.parametres = {
			avecCoursAnnule: true,
			avecCoursAnnulesSuperposes: !GEtatUtilisateur.estEspacePourEleve(),
			avecNomProfesseur: GEtatUtilisateur.estEspacePourEleve(),
		};
		this.afficherProchainJour = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeCours: function (aIndex) {
				$(this.node).on("click", () => {
					if (aInstance.listeCoursFormate) {
						const lCours = aInstance.listeCoursFormate.get(aIndex);
						if ("listeCours" in lCours && lCours.listeCours) {
							UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.popupCoursMultiple(
								aInstance,
								lCours,
								{ indexCours: aIndex, forcerClickCours: false },
							);
						}
					}
				});
			},
			getNodeVisioCours: function (aNumeroCours, aIndexCours) {
				$(this.node).on("click", () => {
					const lCours = aInstance.listeCoursFormate.get(aIndexCours);
					if (lCours && "coursOriginal" in lCours && lCours.coursOriginal) {
						let lCopieCours = lCours.coursOriginal;
						if (lCours.coursOriginal.coursMultiple) {
							lCopieCours =
								lCours.coursOriginal.listeCours.getElementParNumero(
									aNumeroCours,
								);
						}
						UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.surClicVisioCours(
							lCopieCours,
						);
					}
				});
			},
		});
	}
	formatListeCours(aListeCours, aDate) {
		let lListeCours = new ObjetListeElements_1.ObjetListeElements();
		lListeCours = aListeCours.getListeElements((aElement) => {
			return ObjetDate_1.GDate.estJourEgal(aDate, aElement.DateDuCours);
		});
		return lListeCours;
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		this.donneesRequete =
			aParams.instance.donneesRequete && aParams.instance.donneesRequete.EDT;
		this.donnees.jourSelectionne =
			this.donneesRequete.date || this.donnees.dateSelection;
		this.listeCours = this.formatListeCours(
			aParams.donnees.listeCours,
			this.donnees.jourSelectionne,
		);
		this._creerObjetsEDT();
		const lWidget = {
			getHtml: this._composeWidgetEDTJournalier.bind(this),
			titre: [
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			].includes(GEtatUtilisateur.GenreEspace)
				? ObjetTraduction_1.GTraductions.getValeur("accueil.monEmploiDuTemps")
				: "",
			hint: ObjetTraduction_1.GTraductions.getValeur("accueil.emploiDuTemps"),
			nbrElements: null,
			afficherMessage: false,
			listeElementsGraphiques: [
				{ id: this.dateEDT ? this.dateEDT.getNom() : null },
			],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		this._initialiserObjetsEDT();
	}
	_initialiserDateEDT(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			formatDate: "[%JJJ %JJ %MMM]",
			avecBoutonsPrecedentSuivant: true,
			classeCSSTexte: "Maigre",
			largeurComposant: 100,
		});
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
	}
	_evenementDateEDT(aDate) {
		const lNumeroSemaine = IE.Cycles.cycleDeLaDate(aDate);
		this.donneesRequete.date = aDate;
		this.donneesRequete.numeroSemaine = lNumeroSemaine;
		this.donnees.jourSelectionne = aDate;
		this.donnees.numeroSemaine = lNumeroSemaine;
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	evenementProchaineDate() {
		if (this.donnees && this.donnees && this.donnees.prochaineDate) {
			this.donnees.jourSelectionne = this.donnees.prochaineDate;
			this.donneesRequete.date = this.donnees.prochaineDate;
			this.donneesRequete.numeroSemaine = IE.Cycles.cycleDeLaDate(
				this.donnees.prochaineDate,
			);
			this.listeCours = this.formatListeCours(
				this.donnees.listeCours,
				this.donnees.prochaineDate,
			);
			this.donnees.prochaineDate = null;
			this.afficherProchainJour = true;
			this.donnees.debutDemiPensionHebdo =
				GParametres.PlacesParJour + this.donnees.debutDemiPensionHebdo;
			this.donnees.finDemiPensionHebdo =
				GParametres.PlacesParJour + this.donnees.finDemiPensionHebdo;
			return {
				listeCours: this.listeCours,
				date: this.donneesRequete.date,
				debutDemiPensionHebdo: this.donnees.debutDemiPensionHebdo,
				finDemiPensionHebdo: this.donnees.finDemiPensionHebdo,
			};
		}
	}
	_composeWidgetEDTJournalier() {
		let lParams = {
			listeCours: this.listeCours,
			date: this.donneesRequete.date || this.donnees.dateSelection,
			exclusions: this.donnees.absences && this.donnees.absences.joursCycle,
			joursStage: this.donnees.joursStage,
			disponibilites: this.donnees.disponibilites,
			avecTrouEDT: true,
			avecIconeAppel: true,
			debutDemiPensionHebdo: this.donnees.debutDemiPensionHebdo,
			finDemiPensionHebdo: this.donnees.finDemiPensionHebdo,
			premierePlaceHebdoDuJour: this.donnees.premierePlaceHebdoDuJour,
			jourCycleSelectionne: 0,
		};
		if (this.donnees.prochaineDate) {
			const lEstJourCourant = ObjetDate_1.GDate.estJourCourant(lParams.date);
			const lPlaceCourante = ObjetDate_1.GDate.dateEnPlaceHebdomadaire(
				new Date(),
			);
			if (this.listeCours.count() === 0) {
				lParams = Object.assign(
					Object.assign({}, lParams),
					this.evenementProchaineDate(),
				);
			} else {
				const lDernierCours = this.listeCours.get(this.listeCours.count() - 1);
				if (lDernierCours) {
					const lEstEnCours =
						lEstJourCourant &&
						lPlaceCourante >= lDernierCours.Debut &&
						lPlaceCourante <= lDernierCours.Fin;
					if (
						lEstJourCourant &&
						lDernierCours.numeroSemaine &&
						lPlaceCourante > lDernierCours.place &&
						!lEstEnCours
					) {
						lParams = Object.assign(
							Object.assign({}, lParams),
							this.evenementProchaineDate(),
						);
					}
				}
			}
		}
		lParams.jourCycleSelectionne = this.afficherProchainJour
			? this.donnees.prochainJourCycle
			: this.donnees.jourCycleSelectionne;
		const lDonnees =
			UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.formaterDonnees(
				lParams,
			);
		this.listeCoursFormate = lDonnees.listeDonnees;
		const lNumeroSemaine =
			this.donneesRequete && this.donneesRequete.numeroSemaine
				? this.donneesRequete.numeroSemaine
				: this.numeroSemaineParDefaut;
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "text-center ie-titre-couleur-lowercase m-top m-bottom",
					role: "heading",
					"aria-level": "3",
				},
				UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.getTitreSemaine(
					lNumeroSemaine,
				),
			),
		);
		if (this.listeCoursFormate && this.listeCoursFormate.count() > 0) {
			H.push(
				lDonnees.soustitre
					? IE.jsx.str(
							"h4",
							{ class: ["text-center", lDonnees.soustitre.type] },
							lDonnees.soustitre.libelle,
						)
					: "",
			);
			H.push('<ul class="liste-cours m-top-l">');
			this.listeCoursFormate.parcourir((aCours, aIndex) => {
				H.push(
					UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.composeCours(
						aCours,
						{ indexCours: aIndex },
					),
				);
			});
			H.push("</ul>");
		} else {
		}
		return H.join("");
	}
	_creerObjetsEDT() {
		this.dateEDT = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{ pere: this, evenement: this._evenementDateEDT },
		);
		this._initialiserDateEDT(this.dateEDT);
	}
	_initialiserObjetsEDT() {
		if (this.dateEDT) {
			const lDate = this.donneesRequete.date || this.donnees.dateSelection;
			this.dateEDT.initialiser();
			this.dateEDT.setDonnees(lDate);
			this.donnees.numeroSemaine = IE.Cycles.cycleDeLaDate(lDate);
		}
	}
}
exports.WidgetEDTJournalier = WidgetEDTJournalier;

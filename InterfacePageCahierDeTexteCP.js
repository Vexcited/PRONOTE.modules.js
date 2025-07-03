exports.ObjetInterfacePageCahierDeTexteCP = void 0;
const GUID_1 = require("GUID");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const _InterfacePage_1 = require("_InterfacePage");
const ObjetTimeline_1 = require("ObjetTimeline");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const DonneesListe_RessourceMatiere_1 = require("DonneesListe_RessourceMatiere");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class ObjetInterfacePageCahierDeTexteCP extends _InterfacePage_1._InterfacePage {
	constructor() {
		super(...arguments);
		this.idZoneChxModeAff = GUID_1.GUID.getId();
		this.classLabelDepuis = GUID_1.GUID.getClassCss();
		this.filtreMatiere = null;
		this.apresModificationTAF = false;
	}
	construireInstances() {
		this.IdentTimeLine = this.add(ObjetTimeline_1.ObjetTimeline);
		this.identListeMatieres = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeMatieres,
			this._initialiserListeMatieres,
		);
		this.identCelluleDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._eventCelluleDate,
			this._initCelluleDate,
		);
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	_initCelluleSemaine(aInstance) {
		aInstance.setParametresObjetCelluleSemaine(1);
		aInstance.setVisible(false);
	}
	_evenementChxModeAff(aObjet) {
		this.setModeTimeline(parseInt($(aObjet.target).val()));
		this.setVisibilite();
		if (this.estHebdomadaire()) {
			this._evntCelluleSemaine(this.domaine);
		} else {
			this._eventCelluleDate(this.dateDepuis);
		}
		this.actualiser();
	}
	setVisibilite() {
		this.getInstance(this.identCelluleSemaine).setVisible(
			this.estHebdomadaire(),
		);
		this.getInstance(this.identCelluleDate).setVisible(this.estChronologique());
		if (this.estChronologique()) {
			$("." + this.classLabelDepuis.escapeJQ()).show();
		} else {
			$("." + this.classLabelDepuis.escapeJQ()).hide();
		}
	}
	setModeTimeline(aModeTimeline) {}
	_evntCelluleSemaine(aDomaine) {}
	_eventCelluleDate(aDate) {}
	gestionMatiere() {
		this.listeMatieres = this.getListeMatieres();
		if (
			this.getInstance(this.identListeMatieres) &&
			this.estChronologique() &&
			this.listeMatieres &&
			this.listeMatieres.count() > 0
		) {
			const lDonneesListeMatiere =
				new DonneesListe_RessourceMatiere_1.DonneesListe_RessourceMatiere(
					this.listeMatieres,
				);
			$("#" + this.getNomInstance(this.identListeMatieres).escapeJQ()).show();
			let lIndice = 0;
			if (this.filtreMatiere) {
				for (let i = 0; i < this.listeMatieres.count() && lIndice === 0; i++) {
					const lElement = this.listeMatieres.get(i);
					if (lElement.getNumero() === this.filtreMatiere.getNumero()) {
						lIndice = i;
					}
				}
				if (lIndice === 0) {
					this.filtreMatiere = null;
				}
				if (
					this.modeTimeLine ===
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique ||
					this.modeTimeLine ===
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
				) {
					this.modeTimeLine = !!this.filtreMatiere
						? Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
						: Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique;
				}
			}
			this.getInstance(this.identListeMatieres).setDonnees(
				lDonneesListeMatiere,
			);
			this.getInstance(this.identListeMatieres).selectionnerLigne({
				ligne: lIndice,
				avecScroll: true,
				avecEvenement: false,
			});
		} else {
			$("#" + this.getNomInstance(this.identListeMatieres).escapeJQ()).hide();
			$("#" + this.getNomInstance(this.IdentCahierDeTexte).escapeJQ()).get(
				0,
			).style.maxWidth = "100%";
		}
	}
	getListeMatieres() {
		return;
	}
	actualiser() {}
	estChronologique() {
		return (
			this.modeTimeLine ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique ||
			this.modeTimeLine ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
		);
	}
	estHebdomadaire() {
		return (
			this.modeTimeLine ===
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille
		);
	}
	formatDonnees(aParametres) {
		return;
	}
	recupererDonnees() {}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="conteneur-CDT full-size">');
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeMatieres),
			'" class="fix-bloc conteneur-liste-filtre"></div>',
		);
		H.push(
			'<div class="fluid-bloc conteneur-droite p-left conteneur-liste-CDT">',
			'<div class="fluid-bloc" id="',
			this.getNomInstance(this.IdentCahierDeTexte),
			'" style="max-width: 80rem;"></div>',
			'<div id="',
			this.getNomInstance(this.IdentTimeLine),
			'" style="flex-basis: 100%;"></div>',
			this.construireStructureListeADroite(),
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	construireStructureListeADroite() {
		return "";
	}
	mettreFocusSurProchainTAF(aListe) {
		if (!this.apresModificationTAF) {
			let lIndiceTAF = -1;
			if (!!aListe && aListe.count() > 0) {
				let min = 365;
				for (let j = 0, lNbr = aListe.count(); j < lNbr; j++) {
					const lNombreJoursEntreDates = Math.abs(
						ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
							!!aListe.get(j).datePour
								? aListe.get(j).datePour
								: aListe.get(j).PourLe,
							this.date,
						),
					);
					if (
						!ObjetDate_1.GDate.estAvantJourCourant(
							!!aListe.get(j).datePour
								? aListe.get(j).datePour
								: aListe.get(j).PourLe,
						) &&
						lNombreJoursEntreDates <= min
					) {
						min = lNombreJoursEntreDates;
						lIndiceTAF = j;
						if (min === 0) {
							break;
						}
					}
				}
			}
			const lDateLaPlusProche =
				lIndiceTAF >= 0
					? !!aListe.get(lIndiceTAF).datePour
						? aListe.get(lIndiceTAF).datePour
						: aListe.get(lIndiceTAF).PourLe
					: null;
			if (lDateLaPlusProche) {
				const lElementJQ = $(
					"#" + this.getNomInstance(this.IdentCahierDeTexte).escapeJQ(),
				).find(
					'div[data-idDate="' +
						ObjetDate_1.GDate.formatDate(
							lDateLaPlusProche,
							"%JJ%MM%AAAA",
						).toString() +
						'"]',
				);
				if (lElementJQ) {
					if (!!lElementJQ.get(0) && lElementJQ.get(0).scrollIntoView) {
						lElementJQ.get(0).scrollIntoView();
					} else {
						lElementJQ.trigger("focus");
					}
				}
			}
		} else {
			this.apresModificationTAF = false;
		}
	}
	_initCelluleDate(aInstance) {
		aInstance.setControleNavigation(true);
		aInstance.setVisible(false);
	}
	_initialiserListeMatieres(aInstance) {
		const lColonnes = [
			{ id: "ObjetInterfacePageCahierDeTexteCP_ListeMatiere", taille: "100%" },
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurZoneContenuListeMin: 100,
			avecOmbreDroite: true,
			ariaLabel: (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.getLibelleLongOnglet(),
		});
	}
	_evenementListeMatieres(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				if (aParametres.article.getGenre() === -1) {
					this.filtreMatiere = null;
					this.modeTimeLine =
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique;
				} else {
					this.filtreMatiere = aParametres.article;
					this.modeTimeLine =
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact;
				}
				const lListe = this.getInstance(this.identListeMatieres);
				lListe.actualiser(true);
				this.actualiser();
				break;
			}
		}
	}
}
exports.ObjetInterfacePageCahierDeTexteCP = ObjetInterfacePageCahierDeTexteCP;

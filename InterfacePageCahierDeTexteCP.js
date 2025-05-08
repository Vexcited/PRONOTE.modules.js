const { GUID } = require("GUID.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { _InterfacePage } = require("_InterfacePage.js");
const { ObjetTimeline } = require("ObjetTimeline.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const {
	DonneesListe_RessourceMatiere,
} = require("DonneesListe_RessourceMatiere.js");
const { GDate } = require("ObjetDate.js");
class ObjetInterfacePageCahierDeTexteCP extends _InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idZoneChxModeAff = GUID.getId();
		this.classLabelDepuis = GUID.getClassCss();
		this.filtreMatiere = null;
		this.apresModificationTAF = false;
	}
	construireInstances() {
		this.IdentTimeLine = this.add(ObjetTimeline);
		this.identListeMatieres = this.add(
			ObjetListe,
			_evenementListeMatieres,
			_initialiserListeMatieres,
		);
		this.identCelluleDate = this.add(
			ObjetCelluleDate,
			this._eventCelluleDate,
			_initCelluleDate,
		);
		this.GenreStructure = EStructureAffichage.Autre;
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
	setModeTimeline() {}
	_evntCelluleSemaine() {}
	_eventCelluleDate() {}
	gestionMatiere() {
		this.listeMatieres = this.getListeMatieres();
		if (
			this.getInstance(this.identListeMatieres) &&
			this.estChronologique() &&
			this.listeMatieres &&
			this.listeMatieres.count() > 0
		) {
			const lDonneesListeMatiere = new DonneesListe_RessourceMatiere(
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
					this.modeTimeLine === EModeAffichageTimeline.classique ||
					this.modeTimeLine === EModeAffichageTimeline.compact
				) {
					this.modeTimeLine = !!this.filtreMatiere
						? EModeAffichageTimeline.compact
						: EModeAffichageTimeline.classique;
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
			$(
				"#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
			).get(0).style.maxWidth = "100%";
		}
	}
	getListeMatieres() {}
	actualiser() {}
	estChronologique() {
		return (
			this.modeTimeLine === EModeAffichageTimeline.classique ||
			this.modeTimeLine === EModeAffichageTimeline.compact
		);
	}
	estHebdomadaire() {
		return this.modeTimeLine === EModeAffichageTimeline.grille;
	}
	formatDonnees() {}
	recupererDonnees() {}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="conteneur-CDT full-size">');
		H.push(
			'<div id="',
			this.getInstance(this.identListeMatieres).getNom(),
			'" class="fix-bloc conteneur-liste-filtre"></div>',
		);
		H.push(
			'<div class="fluid-bloc conteneur-droite p-left conteneur-liste-CDT">',
			'<div class="fluid-bloc" id="',
			this.getInstance(this.IdentCahierDeTexte).getNom(),
			'" style="max-width: 80rem;"></div>',
			'<div id="',
			this.getInstance(this.IdentTimeLine).getNom(),
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
						GDate.getNbrJoursEntreDeuxDates(
							!!aListe.get(j).datePour
								? aListe.get(j).datePour
								: aListe.get(j).PourLe,
							this.date,
						),
					);
					if (
						!GDate.estAvantJourCourant(
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
					"#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
				).find(
					'div[data-idDate="' +
						GDate.formatDate(lDateLaPlusProche, "%JJ%MM%AAAA").toString() +
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
}
function _initCelluleDate(aInstance) {
	aInstance.setControleNavigation(true);
	aInstance.setVisible(false);
}
function _initialiserListeMatieres(aInstance) {
	const lColonnes = [
		{ id: "ObjetInterfacePageCahierDeTexteCP_ListeMatiere", taille: "100%" },
	];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		skin: ObjetListe.skin.flatDesign,
		hauteurZoneContenuListeMin: 100,
		avecOmbreDroite: true,
	});
}
function _evenementListeMatieres(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection: {
			if (aParametres.article.getGenre() === -1) {
				this.filtreMatiere = null;
				this.modeTimeLine = EModeAffichageTimeline.classique;
			} else {
				this.filtreMatiere = aParametres.article;
				this.modeTimeLine = EModeAffichageTimeline.compact;
			}
			const lListe = this.getInstance(this.identListeMatieres);
			lListe.actualiser(true);
			this.actualiser();
			break;
		}
	}
}
module.exports = { ObjetInterfacePageCahierDeTexteCP };

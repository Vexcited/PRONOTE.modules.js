exports.ObjetFenetre_DestDiscussion_Mobile = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
class ObjetFenetre_DestDiscussion_Mobile extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Messagerie.ListeDestinataires",
			),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			fermerFenetreSurClicHorsFenetre: true,
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementListe_1.EGenreEvenementListe.Selection
				) {
					this.fermer();
					this.optionsFenetre.selection(aParametres.article);
					return;
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				});
			},
		);
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str(
				"div",
				{ class: "m-all-l", "ie-if": "avecBtnListeDiffusion" },
				IE.jsx.str(
					"ie-bouton",
					{
						class: "small-bt themeBoutonNeutre",
						"ie-model": "btnListeDiffusion",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"listeDiffusion.btnListeDiffusion",
					),
				),
			),
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				class: "full-height",
			}),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnListeDiffusion() {
				return aInstance.optionsFenetre.avecListesDiffusion;
			},
			btnListeDiffusion: {
				event() {
					aInstance.fermer();
					aInstance.optionsFenetre.selection({ estListeDiff: true });
				},
			},
		});
	}
	async afficher() {
		super.afficher();
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		this.optionsFenetre.genresDest.parcourir((aElement) => {
			if (aElement.Actif) {
				lListe.add(aElement);
			}
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ChoixRess_Mobile(lListe),
		);
		return null;
	}
}
exports.ObjetFenetre_DestDiscussion_Mobile = ObjetFenetre_DestDiscussion_Mobile;
class DonneesListe_ChoixRess_Mobile extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_Selection: true,
			avecTri: false,
		});
	}
}

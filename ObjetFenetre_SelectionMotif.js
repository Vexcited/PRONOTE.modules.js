exports.ObjetFenetre_SelectionMotif = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SelectionMotif extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.aJustifier = false;
		this.avecCoche = false;
		this.droitFonctionnel = this.appSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites
				.saisieEtendueAbsenceDepuisAppel,
		);
		this.boutons = { annuler: 0, valider: 1 };
		this.setOptionsFenetre({
			largeur: 450,
			hauteur: 600,
			listeBoutons: this.droitFonctionnel
				? [
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
					]
				: [ObjetTraduction_1.GTraductions.getValeur("Annuler")],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	setDonnees(aListe, aAvecCB, aSelection) {
		this.avecCoche = !!aAvecCB;
		this.afficher();
		this.surFixerTaille();
		this.selection = null;
		const lDonneesListe = new DonneesListe_SelectionMotif(
			aListe || new ObjetListeElements_1.ObjetListeElements(),
		);
		this.getInstance(this.identListe).setDonnees(
			lDonneesListe,
			MethodesObjet_1.MethodesObjet.isNumeric(aSelection) ? aSelection : null,
		);
	}
	composeContenu() {
		const lgetDisplayCbJustifier = () => {
			return (
				this.avecCoche &&
				this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites
						.saisieEtendueAbsenceDepuisAppel,
				)
			);
		};
		const lcbJustifierMotifDAbsence = () => {
			return {
				getValue: () => {
					return !!this.aJustifier;
				},
				setValue: (aValeur) => {
					this.aJustifier = aValeur;
				},
				getDisabled: () => {
					return !this.selection || !!this.selection.recevable;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "full-height flex-contain cols" },
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				class: "fluid-bloc",
			}),
			IE.jsx.str(
				"div",
				{
					class: "PetitEspaceGauche GrandEspaceHaut fix-bloc",
					"ie-if": lgetDisplayCbJustifier,
				},
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lcbJustifierMotifDAbsence },
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.SelectionnerEtJustifierMotifAbsence",
					),
				),
			),
		);
	}
	surValidation(aNumeroBouton) {
		const lChecked = this.aJustifier;
		this.fermer();
		if (aNumeroBouton !== this.boutons.annuler) {
			if (this.optionsFenetre.callback) {
				this.optionsFenetre.callback(aNumeroBouton, this.selection, lChecked);
			}
			this.callback.appel(aNumeroBouton, this.selection, lChecked);
		}
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecListeNeutre: true,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			forcerOmbreScrollBottom: true,
			ariaLabel: () =>
				MethodesObjet_1.MethodesObjet.isFunction(this.optionsFenetre.titre)
					? this.optionsFenetre.titre()
					: this.optionsFenetre.titre || "",
		});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.selection = aParametres.article;
				this.aJustifier = !!aParametres.article.recevable;
				this.$refreshSelf();
				if (aParametres.surInteractionUtilisateur) {
					if (!this.droitFonctionnel) {
						this.surValidation(this.boutons.valider);
					}
				}
				break;
		}
	}
}
exports.ObjetFenetre_SelectionMotif = ObjetFenetre_SelectionMotif;
class DonneesListe_SelectionMotif extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
	getZoneGauche(aParams) {
		return aParams.article.couleur
			? '<div class="couleur ie-line-color static only-color" style="--color-line:' +
					aParams.article.couleur +
					'"></div>'
			: '<div class="m-right"></div>';
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getClassCelluleConteneur() {
		return "AvecMain";
	}
	getZoneMessage() {
		return "";
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.nonConnu;
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
}

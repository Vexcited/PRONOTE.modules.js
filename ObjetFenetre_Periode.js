exports.ObjetFenetre_Periode = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const GlossaireWAI_1 = require("GlossaireWAI");
class ObjetFenetre_Periode extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.avecMultiSelection = false;
		this.avecTri = true;
		this.listePeriodesSelectionnees =
			new ObjetListeElements_1.ObjetListeElements();
	}
	construireInstances() {
		this.identListePeriodes = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
	}
	setDonnees(aListePeriodes, aAvesSansPeriode, aAvecMultiSelection, aSansTri) {
		this.listePeriodes = aListePeriodes;
		this.avecMultiSelection = !!aAvecMultiSelection;
		this.avecTri = !aSansTri;
		this.afficher();
		this.setBoutonActif(1, false);
		this.getInstance(this.identListePeriodes).setDonnees(
			new DonneesListe_ListePeriodes(
				aListePeriodes,
				aAvesSansPeriode,
				this.avecMultiSelection,
				this.avecTri,
			),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", {
					id: this.getInstance(this.identListePeriodes).getNom(),
					style: "height:100%;width:100%;",
				}),
			),
		);
		return T.join("");
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
	evenementSurListe(aParametres) {
		this.listePeriodesSelectionnees.vider();
		if (this.avecMultiSelection) {
			this.listePeriodesSelectionnees.add(
				this.listePeriodes.getListeElements((aPeriode) => {
					return !!aPeriode.enSelection;
				}),
			);
			this.setBoutonActif(1, this.listePeriodesSelectionnees.count() > 0);
		} else {
			const lPeriodeSelectionnee = this.listePeriodes.get(
				this.getInstance(this.identListePeriodes).getSelection(),
			);
			this.listePeriodesSelectionnees.add(lPeriodeSelectionnee);
			this.setBoutonActif(
				1,
				!lPeriodeSelectionnee.existeNumero() || lPeriodeSelectionnee.getActif(),
			);
		}
		if (
			!this.avecMultiSelection &&
			aParametres.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.Edition
		) {
			this.surValidation(1);
		}
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		let lObjetPeriodeCallback;
		if (this.listePeriodesSelectionnees.count() === 1) {
			lObjetPeriodeCallback = this.listePeriodesSelectionnees.get(0);
		} else {
			lObjetPeriodeCallback = this.listePeriodesSelectionnees;
		}
		this.callback.appel(aNumeroBouton, lObjetPeriodeCallback);
	}
}
exports.ObjetFenetre_Periode = ObjetFenetre_Periode;
class DonneesListe_ListePeriodes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecSansPeriode, aAvecMultiSelection, aAvecTri) {
		super(aDonnees);
		this.avecSansPeriode = aAvecSansPeriode;
		this.setOptions({
			avecCB: aAvecMultiSelection,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
			avecEvnt_Selection: !aAvecMultiSelection,
			avecTri: aAvecTri,
		});
	}
	getValueCB(aParams) {
		return aParams.article ? !!aParams.article.enSelection : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.enSelection = aValue;
	}
	getDisabledCB(aParams) {
		return !!aParams.article.estCloture || !aParams.article.estActif;
	}
	getZoneComplementaire(aParams) {
		const lZoneCompl = [];
		if (aParams.article) {
			let lPeriodeActive = true;
			if (this.options.avecCB) {
				lPeriodeActive =
					(aParams.article.estCloture === undefined ||
						aParams.article.estCloture === false) &&
					(aParams.article.estActif === undefined ||
						aParams.article.estActif === true);
			} else {
				lPeriodeActive =
					!aParams.article.existeNumero() || aParams.article.getActif();
			}
			if (!lPeriodeActive) {
				lZoneCompl.push(
					IE.jsx.str("i", {
						class: "icon_lock",
						style: "font-size:1.4rem;",
						"aria-label": GlossaireWAI_1.TradGlossaireWAI.PeriodeCloturee,
						title: GlossaireWAI_1.TradGlossaireWAI.PeriodeCloturee,
					}),
				);
			}
		}
		return lZoneCompl.join("");
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init("Genre"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		);
		return lTris;
	}
	getVisible(D) {
		return this.avecSansPeriode || D.existeNumero();
	}
}

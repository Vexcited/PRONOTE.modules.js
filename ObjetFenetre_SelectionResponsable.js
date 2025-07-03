exports.ObjetFenetre_SelectionResponsable = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_SelectionResponsable extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		(this.filtreCBProfEquipePeda = false), (this.filtreCBPersConcernes = false);
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 700,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Annuler")],
		});
		this.donnees = { listeResponsables: null };
	}
	construireInstances() {
		this.identListeResponsables = this.add(
			ObjetListe_1.ObjetListe,
			this._surEvenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFiltreProfEquipePeda: {
				getValue() {
					return aInstance.filtreCBProfEquipePeda;
				},
				setValue(aData) {
					aInstance.filtreCBProfEquipePeda = aData;
					aInstance._actualiserListe();
				},
			},
			cbFiltrePersConcernes: {
				getValue() {
					return aInstance.filtreCBPersConcernes;
				},
				setValue(aData) {
					aInstance.filtreCBPersConcernes = aData;
					aInstance._actualiserListe();
				},
			},
		});
	}
	setDonnees(aListeResponsables) {
		this.afficher();
		this.donnees.listeResponsables = aListeResponsables;
		this._actualiserListe();
	}
	getNumeroResponsable() {
		let lNumero = null;
		if (this.donnees.listeResponsables) {
			lNumero = this.donnees.listeResponsables.getNumero(
				this.getInstance(this.identListeResponsables).getSelection(),
			);
		}
		return lNumero;
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push('<div class="flex-contain cols" style="height:100%">');
		if (this.respAdminCBFiltrage) {
			lHtml.push(
				'<ie-checkbox class="Espace" ie-model="cbFiltreProfEquipePeda">',
				this.respAdminCBFiltrage.cbProfEquipePeda,
				"</ie-checkbox>",
			);
			lHtml.push(
				'<ie-checkbox class="Espace" ie-model="cbFiltrePersConcernes">',
				this.respAdminCBFiltrage.cbPersConcernes,
				"</ie-checkbox>",
			);
		}
		lHtml.push(
			'<div class="fluid-bloc" id="',
			this.getNomInstance(this.identListeResponsables),
			'"></div>',
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
			ariaLabel: this.optionsFenetre.titre,
		});
	}
	_surEvenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (!aParametres.article.estUnDeploiement) {
					this.callback.appel({ responsableSelection: aParametres.article });
					this.fermer();
				}
				break;
		}
	}
	_actualiserListe() {
		if (this.donnees && this.donnees.listeResponsables) {
			this.getInstance(this.identListeResponsables).setDonnees(
				new DonneesListe_ResponsableListe(this.donnees.listeResponsables, {
					filtreCBProfEquipePeda: this.filtreCBProfEquipePeda,
					filtreCBPersConcernes: this.filtreCBPersConcernes,
				}),
			);
		}
	}
}
exports.ObjetFenetre_SelectionResponsable = ObjetFenetre_SelectionResponsable;
class DonneesListe_ResponsableListe extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.filtreCBProfEquipePeda = aParams.filtreCBProfEquipePeda;
		this.filtreCBPersConcernes = aParams.filtreCBPersConcernes;
		this.setOptions({
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
		});
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	getVisible(aArticle) {
		const lEstFixeVisible = aArticle.getGenre() === -1;
		const lEstProfVisible =
			(this.filtreCBProfEquipePeda && aArticle.estProfFiltrable) ||
			(!this.filtreCBProfEquipePeda && aArticle.estProf);
		const lEstPersVisible =
			(this.filtreCBPersConcernes && aArticle.estPersonnelFiltrable) ||
			(!this.filtreCBPersConcernes && aArticle.estPersonnel);
		return lEstFixeVisible || lEstProfVisible || lEstPersVisible;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
}

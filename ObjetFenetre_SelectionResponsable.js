const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_SelectionResponsable extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.respAdminCBFiltrage = aParams.respAdminCBFiltrage;
		(this.filtreCBProfEquipePeda = false), (this.filtreCBPersConcernes = false);
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 700,
			heightMax_mobile: true,
			listeBoutons: [GTraductions.getValeur("Annuler")],
		});
		this.donnees = { listeResponsables: null };
	}
	construireInstances() {
		this.identListeResponsables = this.add(
			ObjetListe,
			_surEvenementSurListe.bind(this),
			_initialiserListe,
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
					_actualiserListe.call(aInstance);
				},
			},
			cbFiltrePersConcernes: {
				getValue() {
					return aInstance.filtreCBPersConcernes;
				},
				setValue(aData) {
					aInstance.filtreCBPersConcernes = aData;
					_actualiserListe.call(aInstance);
				},
			},
		});
	}
	setDonnees(aListeResponsables) {
		this.afficher();
		this.donnees.listeResponsables = aListeResponsables;
		_actualiserListe.call(this);
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
				'<ie-checkbox class="Espace" ie-model="cbFiltreProfEquipePeda" >',
				this.respAdminCBFiltrage.cbProfEquipePeda,
				"</ie-checkbox>",
			);
			lHtml.push(
				'<ie-checkbox class="Espace" ie-model="cbFiltrePersConcernes" >',
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
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
	});
}
function _surEvenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.SelectionClick:
		case EGenreEvenementListe.Selection:
			if (!aParametres.article.estUnDeploiement) {
				this.callback.appel({ responsableSelection: aParametres.article });
				this.fermer();
			}
			break;
	}
}
function _actualiserListe() {
	if (this.donnees && this.donnees.listeResponsables) {
		this.getInstance(this.identListeResponsables).setDonnees(
			new DonneesListe_ResponsableListe(this.donnees.listeResponsables, {
				filtreCBProfEquipePeda: this.filtreCBProfEquipePeda,
				filtreCBPersConcernes: this.filtreCBPersConcernes,
			}),
		);
	}
}
class DonneesListe_ResponsableListe extends ObjetDonneesListeFlatDesign {
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
module.exports = { ObjetFenetre_SelectionResponsable };

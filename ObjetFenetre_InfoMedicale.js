const { DonneesListe_InfoMedicale } = require("DonneesListe_InfoMedicale.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_InfoMedicale extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.listeInfoMedicale = new ObjetListeElements();
		this.titreListe = GTraductions.getValeur("fenetreInfosMedicales.titre");
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe,
			_evenementListe.bind(this),
			_initialiserListe.bind(this),
		);
	}
	setParametresInfoMedicale(aTitreListe) {
		this.titreListe = aTitreListe;
	}
	_formaterDonneesListeAllergies(aListeAllergies) {
		if (aListeAllergies) {
			const lTitreAlimentaire = GTraductions.getValeur(
				"InfosMedicales.TitreAllergiesAlimentaires",
			);
			const lTitreAutres = GTraductions.getValeur(
				"InfosMedicales.TitreAllergiesAutres",
			);
			let lListeAvecCumul = new ObjetListeElements();
			let lElementTitre = new ObjetElement(lTitreAlimentaire);
			lElementTitre.estUnDeploiement = true;
			lElementTitre.estDeploye = true;
			lElementTitre.estAlimentaire = true;
			lListeAvecCumul.addElement(lElementTitre);
			aListeAllergies.parcourir((aAllergie) => {
				if (aAllergie.estAlimentaire) {
					aAllergie.pere = lElementTitre;
					aAllergie.estUnDeploiement = false;
					aAllergie.estDeploye = true;
					lListeAvecCumul.addElement(aAllergie);
				}
			});
			lElementTitre = new ObjetElement(lTitreAutres);
			lElementTitre.estUnDeploiement = true;
			lElementTitre.estDeploye = true;
			lElementTitre.estAlimentaire = false;
			lListeAvecCumul.addElement(lElementTitre);
			aListeAllergies.parcourir((aAllergie) => {
				if (!aAllergie.estAlimentaire) {
					aAllergie.pere = lElementTitre;
					aAllergie.estDeploye = true;
					aAllergie.estUnDeploiement = false;
					lListeAvecCumul.addElement(aAllergie);
				}
			});
			lListeAvecCumul.setTri(
				ObjetTri.init("estAlimentaire", EGenreTriElement.Decroissant),
			);
			lListeAvecCumul.trier();
			return lListeAvecCumul;
		}
	}
	setDonnees(aListeInfoMedicale, aEstListeAllergies) {
		this.afficher();
		const lListeAAfficher =
			aEstListeAllergies === true
				? this._formaterDonneesListeAllergies(aListeInfoMedicale)
				: aListeInfoMedicale;
		this.listeInfoMedicale = lListeAAfficher;
		this.getInstance(this.IdentListe).setDonnees(
			new DonneesListe_InfoMedicale(this.listeInfoMedicale),
		);
	}
	reset() {
		this.listeInfoMedicale = new ObjetListeElements();
	}
	composeContenu() {
		const lHTML = [];
		lHTML.push(
			'<div id="' +
				this.getNomInstance(this.IdentListe) +
				'" class="full-size"></div>',
		);
		return lHTML.join("");
	}
}
function _evenementListe(aParametres) {
	aParametres.article.setEtat(EGenreEtat.Modification);
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		nonEditable: false,
	});
}
module.exports = { ObjetFenetre_InfoMedicale };

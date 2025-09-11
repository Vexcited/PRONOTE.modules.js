exports.PageTrombi = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_Trombi_1 = require("DonneesListe_Trombi");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListe_1 = require("ObjetListe");
const ObjetFenetre_FicheEleve_1 = require("ObjetFenetre_FicheEleve");
class PageTrombi extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.instanceListe = ObjetIdentite_1.Identite.creerInstance(
			ObjetListe_1.ObjetListe,
			{ pere: this, evenement: this._evntSurListe.bind(this) },
		);
		this.initOptions(this.instanceListe);
		this.donnees = {};
	}
	setDonnees(aListeRessourcesPourPhotos, aAvecTotal) {
		this.donnees.listeEleves = aListeRessourcesPourPhotos;
		this.avecTotal =
			aAvecTotal !== null && aAvecTotal !== undefined ? aAvecTotal : false;
		this.actualiserListe();
	}
	construireAffichage() {
		const H = [];
		H.push(
			'<div class="PetitEspace full-height" id="',
			this.instanceListe.getNom(),
			'"></div>',
		);
		return H.join("");
	}
	actualiserListe() {
		this.instanceListe.setDonnees(
			new DonneesListe_Trombi_1.DonneesListe_Trombi(this.donnees.listeEleves),
		);
	}
	initOptions(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			nonEditable: true,
			scrollHorizontal: false,
		});
	}
	_evntSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this._afficherFicheEleve(aParametres.article.getNumero());
				break;
		}
	}
	_afficherFicheEleve(aNumeroEleve) {
		let lEleve;
		if (!!this.donnees.listeEleves) {
			lEleve = this.donnees.listeEleves.getElementParNumero(aNumeroEleve);
		}
		if (!!lEleve) {
			ObjetFenetre_FicheEleve_1.ObjetFenetre_FicheEleve.ouvrir({
				instance: this,
				avecRequeteDonnees: true,
				donnees: { eleve: lEleve, listeEleves: this.donnees.listeEleves },
			});
		}
	}
}
exports.PageTrombi = PageTrombi;

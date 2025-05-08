const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_ModeleTravailAFaire extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("CahierDeTexte.TitreFenetreModele"),
			largeur: 300,
			hauteur: 450,
			listeBoutons: [GTraductions.getValeur("principal.fermer")],
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, null, _initialiserListe);
	}
	setDonnees(AListeModeles) {
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ModeleTravailAFaire(AListeModeles),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="table-contain full-size"></div>',
		);
		return T.join("");
	}
}
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ModeleTravailAFaire.colonnes.libelle,
		titre: GTraductions.getValeur("Libelle"),
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		listeCreations: 0,
		avecLigneCreation: true,
	});
}
class DonneesListe_ModeleTravailAFaire extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.creerIndexUnique("Libelle");
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ModeleTravailAFaire.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTri() {
		return [ObjetTri.init("Libelle")];
	}
	surCreation(D, V) {
		D.Libelle = V[0];
		D.Actif = true;
		D.Editable = true;
	}
	surEdition(aParams, V) {
		aParams.article.Libelle = V;
	}
	avecEdition(aParams) {
		return aParams.article.Editable;
	}
	avecSuppression(aParams) {
		return aParams.article.Editable;
	}
}
DonneesListe_ModeleTravailAFaire.colonnes = { libelle: "DLModeleTAF_libelle" };
module.exports = ObjetFenetre_ModeleTravailAFaire;

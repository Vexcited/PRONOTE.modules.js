const {
	ObjetResultatsActualite,
	TypeEvenementCallback,
} = require("ObjetResultatsActualite.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const TypeBoutonFenetreResultatActualite = { DiffuserResultats: 0, Fermer: 1 };
class ObjetFenetre_ResultatsActualite extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ heightMax_mobile: true });
	}
	construireInstances() {
		this.identResultats = this.add(
			ObjetResultatsActualite,
			this.evenementResultats,
			this.initResultats,
		);
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div style="height:100%;" id="',
			this.getInstance(this.identResultats).getNom(),
			'"></div>',
		);
		return H.join("");
	}
	evenementResultats(aTypeCommande, aDonnees) {
		if (aTypeCommande === TypeEvenementCallback.ChangerCumulClasse) {
			this.setActualite(aDonnees.actualite);
		}
	}
	initResultats(aInstance) {
		aInstance.setUtilitaires(this.utilitaires);
		aInstance.setOptions({ avecBarreTitre: !IE.estMobile });
	}
	lancerRequeteRecupererResultatsActualite() {}
	setActualite(aActualite) {
		const lDonneesRequete = {
			actualite: aActualite,
			avecCumulClasses: this.getInstance(
				this.identResultats,
			).estAvecCumulParClasse(),
		};
		this.lancerRequeteRecupererResultatsActualite(
			lDonneesRequete,
			(aActualiteAvecResultats) => {
				this.afficher();
				this.getInstance(this.identResultats).setDonnees(
					aActualiteAvecResultats,
				);
			},
		);
	}
}
module.exports = {
	ObjetFenetre_ResultatsActualite,
	TypeBoutonFenetreResultatActualite,
};

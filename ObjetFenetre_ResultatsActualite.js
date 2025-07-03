exports.ObjetFenetre_ResultatsActualite =
	exports.TypeBoutonFenetreResultatActualite = void 0;
const ObjetResultatsActualite_1 = require("ObjetResultatsActualite");
const ObjetFenetre_1 = require("ObjetFenetre");
var TypeBoutonFenetreResultatActualite;
(function (TypeBoutonFenetreResultatActualite) {
	TypeBoutonFenetreResultatActualite[
		(TypeBoutonFenetreResultatActualite["DiffuserResultats"] = 0)
	] = "DiffuserResultats";
	TypeBoutonFenetreResultatActualite[
		(TypeBoutonFenetreResultatActualite["Fermer"] = 1)
	] = "Fermer";
})(
	TypeBoutonFenetreResultatActualite ||
		(exports.TypeBoutonFenetreResultatActualite =
			TypeBoutonFenetreResultatActualite =
				{}),
);
class ObjetFenetre_ResultatsActualite extends ObjetFenetre_1.ObjetFenetre {
	construireInstances() {
		this.identResultats = this.add(
			ObjetResultatsActualite_1.ObjetResultatsActualite,
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
			this.getNomInstance(this.identResultats),
			'"></div>',
		);
		return H.join("");
	}
	evenementResultats(aTypeCommande, aDonnees) {
		if (
			aTypeCommande ===
			ObjetResultatsActualite_1.TypeEvenementCallback.ChangerCumulClasse
		) {
			this.setActualite(aDonnees.actualite);
		}
	}
	initResultats(aInstance) {
		aInstance.setUtilitaires(this.utilitaires);
		aInstance.setOptions({ avecBarreTitre: !IE.estMobile });
	}
	lancerRequeteRecupererResultatsActualite(aDonneesRequete, aCallback) {}
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
exports.ObjetFenetre_ResultatsActualite = ObjetFenetre_ResultatsActualite;

exports.ObjetSelecteurCreneauxAppel = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_SelectionCreneauxAppel_1 = require("ObjetFenetre_SelectionCreneauxAppel");
class ObjetSelecteurCreneauxAppel extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.creneauxAppel",
			),
			tooltip: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.selectionnerCreneauxAppel",
			),
		});
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_SelectionCreneauxAppel_1.ObjetFenetre_SelectionCreneauxAppel,
			this.evntFenetreSelection,
		);
	}
	evntBtnSelection() {
		this.getInstance(this.identFenetreSelection).setDonnees({
			listeRessources: this.listeTotale,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				this.listeSelection,
			),
		});
	}
	evntFenetreSelection(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			const lListeRessourcesSelectionnees =
				aListeRessourcesSelectionnees.getListeElements((aElement) => {
					return aElement.selectionne;
				});
			this.listeSelection = lListeRessourcesSelectionnees;
			this.callback.appel({ listeSelection: lListeRessourcesSelectionnees });
			this.actualiserLibelle();
		}
	}
}
exports.ObjetSelecteurCreneauxAppel = ObjetSelecteurCreneauxAppel;

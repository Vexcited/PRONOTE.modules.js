exports.ObjetFenetre_Mention = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Mention_1 = require("DonneesListe_Mention");
class ObjetFenetre_Mention extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.listeMention = new ObjetListeElements_1.ObjetListeElements();
		this.titreListe = ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.Mentions",
		);
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
	}
	initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Mention_1.DonneesListe_Mention.colonnes.libelle,
			titre: this.titreListe,
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_Mention_1.DonneesListe_Mention.colonnes.imprimee,
			titre: { classeCssImage: "Image_Publie" },
			taille: 20,
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	setParametresMention(aTitreListe) {
		this.titreListe = aTitreListe;
	}
	setDonnees(aListeMention) {
		this.afficher(null);
		this.listeMention = aListeMention;
		this.setBoutonActif(1, false);
		this.initialiserListe(this.getInstance(this.IdentListe));
		this.getInstance(this.IdentListe).setDonnees(
			new DonneesListe_Mention_1.DonneesListe_Mention(this.listeMention),
		);
	}
	reset() {
		this.listeMention = new ObjetListeElements_1.ObjetListeElements();
	}
	composeContenu() {
		const lHTML = [];
		lHTML.push(
			'<div class="table-contain full-size" id="' +
				this.getNomInstance(this.IdentListe) +
				'"></div>',
		);
		return lHTML.join("");
	}
	getMentionSelectionnee() {
		if (!!this.listeMention) {
			return this.listeMention.get(this.posMention);
		}
		return null;
	}
	evenementSurListe(aParametres) {
		this.setBoutonActif(
			1,
			aParametres.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.Selection,
		);
		this.posMention = aParametres.ligne;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surValidation(1);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				this.surValidation(1);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.surValidation(1);
				break;
		}
	}
}
exports.ObjetFenetre_Mention = ObjetFenetre_Mention;

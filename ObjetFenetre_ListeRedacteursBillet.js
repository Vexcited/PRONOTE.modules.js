exports.ObjetFenetre_ListeRedacteursBillet = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
class ObjetFenetre_ListeRedacteursBillet extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListe,
		);
	}
	setDonnees(aBillet) {
		const lListeRedacteurs = new ObjetListeElements_1.ObjetListeElements();
		lListeRedacteurs.add(aBillet.auteur);
		lListeRedacteurs.add(aBillet.listeCoRedacteurs);
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_RedacteursBillet(lListeRedacteurs),
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			id: this.getNomInstance(this.identListe),
			class: "full-height",
		});
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
}
exports.ObjetFenetre_ListeRedacteursBillet = ObjetFenetre_ListeRedacteursBillet;
class DonneesListe_RedacteursBillet extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecSelection: false,
		});
	}
	getZoneGauche(aParams) {
		const H = [];
		const lSrcPhoto = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
			aParams.article,
			{ libelle: "photo.jpg" },
		);
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "vignette vignetteBlog" },
					IE.jsx.str("img", {
						"ie-load-src": lSrcPhoto,
						class: "img-portrait",
						"ie-imgviewer": true,
						alt: aParams.article.getLibelle(),
						"data-libelle": aParams.article.getLibelle(),
					}),
				),
			),
		);
		return H.join("");
	}
}

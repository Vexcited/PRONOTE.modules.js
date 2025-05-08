const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetForumVisuPosts } = require("ObjetForumVisuPosts.js");
const { MoteurForumPedagogique } = require("MoteurForumPedagogique.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class ObjetFenetre_ForumVisuPosts extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre:
				GTraductions.getValeur("Onglet.Libelle")[EGenreOnglet.ForumPedagogique],
			modale: false,
			largeur: 600,
			hauteur: Math.max(400, Math.round((GNavigateur.ecranH * 80) / 100)),
			heightMax_mobile: true,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
		this.sujetCourant = null;
		this.moteurForum = new MoteurForumPedagogique({
			pere: this,
			callbackActualisationSujets: () => {
				return _actualiser.call(this);
			},
			ouvrirEditionSujetPromise: null,
		});
	}
	construireInstances() {
		this.identAff = this.add(ObjetForumVisuPosts, null, (aVisuPost) => {
			aVisuPost.setOptions({ visuModerateurPossible: false });
			aVisuPost.init(this.moteurForum);
		});
	}
	setDonnees(aNumeroSujet) {
		super.afficher();
		this.sujetCourant = new ObjetElement({ Numero: aNumeroSujet });
		_actualiser.call(this);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div style="height: 100%;" id="' +
				this.getNomInstance(this.identAff) +
				'"></div>',
		);
		return T.join("");
	}
	static afficher(aPere, aNumeroSujet) {
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ForumVisuPosts, {
			pere: aPere,
		}).setDonnees(aNumeroSujet);
	}
}
function _actualiser() {
	return this.getInstance(this.identAff).setSujet(
		new ObjetElement(this.sujetCourant),
	);
}
module.exports = { ObjetFenetre_ForumVisuPosts };

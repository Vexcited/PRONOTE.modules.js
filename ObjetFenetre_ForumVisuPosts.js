exports.ObjetFenetre_ForumVisuPosts = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetForumVisuPosts_1 = require("ObjetForumVisuPosts");
const MoteurForumPedagogique_1 = require("MoteurForumPedagogique");
const Enumere_Onglet_1 = require("Enumere_Onglet");
class ObjetFenetre_ForumVisuPosts extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.sujetCourant = null;
		this.moteurForum = new MoteurForumPedagogique_1.MoteurForumPedagogique({
			pere: this,
			callbackActualisationSujets: () => {
				return this._actualiser();
			},
			ouvrirEditionSujetPromise: null,
		});
		this.setOptionsFenetre({
			titre:
				ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
					Enumere_Onglet_1.EGenreOnglet.ForumPedagogique
				],
			modale: false,
			largeur: 600,
			hauteur: Math.max(400, Math.round((GNavigateur.ecranH * 80) / 100)),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identAff = this.add(
			ObjetForumVisuPosts_1.ObjetForumVisuPosts,
			null,
			(aVisuPost) => {
				aVisuPost.setOptions({ visuModerateurPossible: false });
				aVisuPost.init(this.moteurForum);
			},
		);
	}
	setDonnees(aNumeroSujet) {
		super.afficher();
		this.sujetCourant = new ObjetElement_1.ObjetElement({
			Numero: aNumeroSujet,
		});
		this._actualiser();
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
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ForumVisuPosts,
			{ pere: aPere },
		).setDonnees(aNumeroSujet);
	}
	_actualiser() {
		return this.getInstance(this.identAff).setSujet(
			new ObjetElement_1.ObjetElement(this.sujetCourant),
		);
	}
}
exports.ObjetFenetre_ForumVisuPosts = ObjetFenetre_ForumVisuPosts;

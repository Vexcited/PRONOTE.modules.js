exports.ObjetFenetre_DetailsNote = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_MethodeCalculMoyenne_1 = require("ObjetFenetre_MethodeCalculMoyenne");
const MoteurDernieresNotes_1 = require("MoteurDernieresNotes");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetFenetre_DetailsNote extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new MoteurDernieresNotes_1.MoteurDernieresNotes();
	}
	isObjetDonneesDernieresNotes(object) {
		return (
			MethodesObjet_1.MethodesObjet.isObject(object) &&
			("avecDetailService" in object || "avecDetailDevoir" in object)
		);
	}
	construireInstances() {
		this.identFenetreMethodeCalculMoyenne =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_MethodeCalculMoyenne_1.ObjetFenetre_MethodeCalculMoyenne,
				{ pere: this, initialiser: this._initialiserMethodeCalculMoyenne },
			);
		this.identFenetreMethodeCalculMoyenne.destructionSurFermeture = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCalculMoyenne: {
				event: function () {
					aInstance._surClicMethodeCalculMoyenne();
				},
				getDisabled: function () {
					return (
						(!aInstance.element.matiere ||
							!aInstance.element.matiere.moyenneEtudiant ||
							!aInstance.element.matiere.moyenneEtudiant.estUneValeur()) &&
						(!aInstance.element.moyEleve ||
							!aInstance.element.moyEleve.estUneValeur())
					);
				},
			},
			afficherCorrigerQCM: {
				event: function () {
					aInstance.callback.appel(-1, {
						executionQCM: aInstance.element.executionQCM,
					});
				},
			},
			surClicPrecSuiv: {
				event: function (aNumeroElement, aGenreElement, aRechercheSuivant) {
					const lProchainElement = aInstance.callBackSurClicPrecedentSuivant(
						aNumeroElement,
						aGenreElement,
						aRechercheSuivant,
					);
					if (!!lProchainElement) {
						aInstance.element = lProchainElement;
						aInstance.actualiser();
					}
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		if (!!this.element) {
			T.push('<section tabindex="0" class="Zone-DetailsNotes">');
			if (
				!this.estUnService &&
				!!this.donnees &&
				this.isObjetDonneesDernieresNotes(this.donnees) &&
				this.donnees.avecDetailDevoir
			) {
				T.push(
					this.moteur.composeDetailsDevoir(this.element, {
						commentaireEnTitre: this.commentaireEnTitre,
						libelleSessionRattrapage: this.libelleSessionRattrapage,
						libelleInfoSessionRattrapage: this.libelleInfoSessionRattrapage,
						libelleMoyenneDuPublicDevoir: this.libelleMoyenneDuPublicDevoir,
						piecesJointes: this.getPiecesJointes(this.element),
					}),
				);
			} else if (this.estUnService) {
				if (
					(!!this.donnees &&
						this.isObjetDonneesDernieresNotes(this.donnees) &&
						this.donnees.avecDetailService) ||
					this.element.avecDetailDevoirsNonPublie
				) {
					T.push(
						this.moteur.composeDetailsService(this.element, {
							avecAffichageComplet:
								this.donnees &&
								this.isObjetDonneesDernieresNotes(this.donnees) &&
								this.donnees.avecDetailService,
							libelleMoyenneDuPublicService: this.libelleMoyenneDuPublicService,
						}),
					);
				}
			} else if (this.estUneEvaluation) {
				T.push(
					this.moteur.composeDetailsEvaluation(this.element, {
						piecesJointes: this.getPiecesJointes(this.element, true),
					}),
				);
			}
			T.push("</section>");
		}
		return T.join("");
	}
	setDonnees(aElement, aDonnees, aParams) {
		this.element = aElement;
		this.donnees = aDonnees;
		this.estUnService = aParams.estUnService;
		this.estUneEvaluation = aParams.estUneEvaluation;
		this.libelleMoyenneDuPublicService =
			aParams.libelleMoyenneDuPublicService || "";
		this.libelleMoyenneDuPublicDevoir =
			aParams.libelleMoyenneDuPublicDevoir || "";
		this.commentaireEnTitre = aParams.commentaireEnTitre || false;
		this.libelleSessionRattrapage = aParams.libelleSessionRattrapage || "";
		this.libelleInfoSessionRattrapage =
			aParams.libelleInfoSessionRattrapage || "";
		this.getPiecesJointes = aParams.getPiecesJointes;
		this.callBackSurClicMethodeCalculMoyenne =
			aParams.callBackSurClicMethodeCalculMoyenne;
		this.callBackSurClicPrecedentSuivant =
			aParams.callBackSurClicPrecedentSuivant;
		this.afficher(this.composeContenu());
	}
	_initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"DernieresNotes.Detail.DetailsMethodeCalcMoy",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			modale: false,
			avecRetaillage: false,
			avecScroll: false,
			largeurMin: 600,
			hauteurMin: 150,
		});
	}
	_surClicMethodeCalculMoyenne() {
		if (this.identFenetreMethodeCalculMoyenne) {
			const lService = this.element;
			if (lService) {
				this.callBackSurClicMethodeCalculMoyenne(
					this.identFenetreMethodeCalculMoyenne,
					lService,
					this.donnees,
				);
			}
		}
	}
}
exports.ObjetFenetre_DetailsNote = ObjetFenetre_DetailsNote;

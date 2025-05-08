exports.InterfaceForumPedagogique_Desktop = void 0;
const InterfaceForumPedagogique_1 = require("InterfaceForumPedagogique");
const ObjetFenetre_SaisieSujetForumPedagogique_1 = require("ObjetFenetre_SaisieSujetForumPedagogique");
const ObjetFenetre_1 = require("ObjetFenetre");
const ModuleEditeurHtml_1 = require("ModuleEditeurHtml");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TinyInit_1 = require("TinyInit");
class InterfaceForumPedagogique_Desktop extends InterfaceForumPedagogique_1.InterfaceForumPedagogique {
	constructor(...aParams) {
		super(...aParams);
		this.avecBandeau = true;
		this.setOptions({
			avecListeMatieres: ![
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			].includes(this.etatUtilisateurSco.getUtilisateur().getGenre()),
		});
		this.moteurForum.setOptions({
			ouvrirEditionSujetPromise: (aSujet, aSurCreation) => {
				return ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SaisieSujetForumPedagogique_1.ObjetFenetre_SaisieSujetForumPedagogique,
					{
						pere: this,
						initialiser(aFenetre) {
							aFenetre
								.setOptionsFenetre({
									moteurForum: this.moteurForum,
									getIdentiteEditeurHtml: this._getIdentiteEditeurHtml,
									eventSaisieCloudCallbackParFichier:
										this._eventSaisieCloudCallbackParFichier,
									eventSaisieCloudCallbackFinal:
										this._eventSaisieCloudCallbackFinal,
									estContenuSujetVide(aSujet) {
										return TinyInit_1.TinyInit.estContenuVide(aSujet.htmlPost);
									},
								})
								.setSujet(aSujet, aSurCreation);
						},
					},
				).afficher();
			},
		});
	}
	_getIdentiteEditeurHtml(aInstance) {
		return {
			class: ModuleEditeurHtml_1.ModuleEditeurHtml,
			pere: aInstance,
			init(aInstanceHtml) {
				aInstanceHtml.setParametres({
					optionsTiny: {
						toolbar: undefined,
						height: 250,
						min_height: 250,
						max_height: 250,
						modeMail: false,
					},
					heightEdition: 250,
					minHeightEdition: 250,
					avecTinyEnFenetre: false,
					surChange(aValeur) {
						aInstance.getSujet().htmlPost = aValeur;
						aInstance.$refreshSelf();
					},
				});
				aInstanceHtml.setDonnees(aInstance.getSujet().htmlPost);
			},
		};
	}
	_eventSaisieCloudCallbackParFichier(aNouvelElement) {
		this.addPJSujet(aNouvelElement);
	}
	_eventSaisieCloudCallbackFinal() {
		this.$refreshSelf();
	}
}
exports.InterfaceForumPedagogique_Desktop = InterfaceForumPedagogique_Desktop;

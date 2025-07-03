var _a;
exports.ObjetFenetre_Discussion = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const GestionnaireModale_1 = require("GestionnaireModale");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const InterfaceListeMessagerie_1 = require("InterfaceListeMessagerie");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
class ObjetFenetre_Discussion extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lNom = this.Nom;
		this.setOptionsFenetre({
			largeur: 600,
			hauteur: null,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this._options = {
			avecListeDiscussions: true,
			avecBoutonCreation: false,
			enFenetre: true,
			estDiscussionCommune: false,
			discussionSelectionneeUniquementVisible: false,
			callbackActualisation: (aParam) => {
				if (aParam && aParam.apresListeMessages) {
					this.positionnerFenetre();
					return;
				}
				if (aParam && aParam.messageErreurActualisation) {
					this.fermer();
					return "interrupt";
				}
				setTimeout(() => {
					GestionnaireModale_1.GestionnaireModale.enPremierPlan(lNom);
				}, 100);
			},
		};
		Invocateur_1.Invocateur.abonner(
			"requeteSaisieMessage",
			(aEstReponseRequete, aInstanceEmetteur, aJSONRapportSaisie) => {
				if (
					aEstReponseRequete &&
					aJSONRapportSaisie &&
					aJSONRapportSaisie.messageErreurActualisation
				) {
					GApplication.getMessage()
						.afficher({
							message: aJSONRapportSaisie.messageErreurActualisation,
						})
						.then(() => {
							this.fermer();
						});
				}
			},
			this,
		);
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		return this;
	}
	construireInstances() {
		this.identMessagerie = this.add(
			InterfaceListeMessagerie_1.InterfaceListeMessagerie,
			null,
			this._initMessagerie,
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.actualisationAffichage,
			this._surActualisationAffichage,
		);
	}
	setDonnees(aParam) {
		this.paramOriginel = aParam;
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		this.param.messagesCommunsEntreLesRessources = true;
		if (!!aParam && aParam.messagesCommunsEntreLesRessources === false) {
			this.param.messagesCommunsEntreLesRessources = false;
		}
		let lTitreFenetre;
		if (this.param && this.param.titreFenetre) {
			lTitreFenetre = this.param.titreFenetre;
		} else if (this._options.estChat) {
			lTitreFenetre = this.param.objet;
		} else if (this.param && this.param.discussion) {
			lTitreFenetre =
				UtilitaireMessagerie_1.UtilitaireMessagerie.getTitreFenetreDeMessage(
					this.param.discussion,
				);
		} else if (this.param && this.param.listeRessources) {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"Messagerie.DiscussionAvec",
				[this._getLibelleRessources(this.param.listeRessources)],
			);
		}
		if (!!lTitreFenetre) {
			this.setOptionsFenetre({ titre: lTitreFenetre });
		}
		const lMessagerie = this.getInstance(this.identMessagerie);
		lMessagerie.setOptions({
			possessionMessageDiscussionUnique:
				this.param.possessionMessageDiscussionUnique || null,
		});
		if (this._options.estChat && !this.param.discussion) {
			if (
				!UtilitaireMessagerie_1.UtilitaireMessagerie.controleMessagerieDesactivee()
			) {
				this.fermer();
				return;
			}
			this.afficher();
			lMessagerie.setDonnees(this.param);
			return;
		}
		const lDonnees = {
			contenuInitial:
				aParam && aParam.contenuInitial ? aParam.contenuInitial : "",
		};
		if (this._options.avecListeDiscussions && !this.param.discussion) {
			lDonnees.listeRessources = this.param.listeRessources;
			lDonnees.avecSelectionPremiereDiscussion =
				this.param.avecSelectionPremiereDiscussion;
			lDonnees.callBackApresDonneesMessagerie =
				aParam.callBackApresDonneesMessagerie;
			lDonnees.messagesCommunsEntreLesRessources =
				this.param.messagesCommunsEntreLesRessources;
			lDonnees.etiquetteSelectionnee = this.param.etiquetteSelectionnee;
			lDonnees.eleveCarnetLiaison = this.param.eleveCarnetLiaison;
		} else {
			lDonnees.message = this.param.discussion;
			lDonnees.listeMessagerie = this.param.listeMessagerie;
		}
		this.afficher();
		lMessagerie.setDonnees(lDonnees);
	}
	fermer(aParam) {
		const lInstance = this.getInstance(this.identMessagerie);
		if (lInstance) {
			Invocateur_1.Invocateur.desabonner(lInstance);
		}
		return super.fermer(aParam);
	}
	surValidation(aGenreBouton) {
		const lParam = aGenreBouton === 0 ? this.paramOriginel : this.param;
		this.fermer();
		this.callback.appel(aGenreBouton, lParam);
	}
	composeContenu() {
		const T = [];
		if (this.getInstance(this.identMessagerie)) {
			T.push(
				'<div id="',
				this.getNomInstance(this.identMessagerie),
				'" style="',
				this.optionsFenetre.avecTailleSelonContenu
					? ""
					: ObjetStyle_1.GStyle.composeHeight(this.optionsFenetre.hauteur - 56),
				'"></div>',
			);
		}
		return T.join("");
	}
	surFixerTaille() {
		super.surFixerTaille();
		this.getInstance(this.identMessagerie).surResizeInterface();
	}
	_surActualisationAffichage(aParametres) {
		if (this.EnAffichage && !this._options.estChat) {
			aParametres.interruptionActualisation = true;
			this.setDonnees(this.paramOriginel);
		}
	}
	_initMessagerie(aInstance) {
		aInstance.setOptions(this._options);
		aInstance.avecRecupereDonnees = false;
	}
	_getLibelleRessources(aListeRessources) {
		let result = "";
		if (!!aListeRessources && aListeRessources.count() > 0) {
			result = aListeRessources.getTableauLibelles().join(" / ");
		}
		return result;
	}
}
exports.ObjetFenetre_Discussion = ObjetFenetre_Discussion;
_a = ObjetFenetre_Discussion;
ObjetFenetre_Discussion.afficherDiscussionsCommunes = (aListeRessources) => {
	const lFenetreDiscussionCommune =
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(_a, {
			pere: _a,
			initialiser: function (aInstance) {
				aInstance.setOptions({
					avecListeDiscussions: true,
					estDiscussionCommune: true,
				});
				aInstance.setOptionsFenetre({
					modale: true,
					largeur: 550 + 400,
					hauteur: 600,
				});
			},
		});
	lFenetreDiscussionCommune.setDonnees({
		listeRessources: aListeRessources,
		callBackApresDonneesMessagerie: function (aSansDiscussion) {
			if (aSansDiscussion) {
				lFenetreDiscussionCommune.fermer();
				let lLibelleRessources = "";
				if (!!aListeRessources && aListeRessources.count() > 0) {
					lLibelleRessources = aListeRessources
						.getTableauLibelles()
						.join(" / ");
				}
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.AucuneDiscussionAvec",
						[lLibelleRessources],
					),
				});
			}
		},
		avecSelectionPremiereDiscussion: true,
	});
};

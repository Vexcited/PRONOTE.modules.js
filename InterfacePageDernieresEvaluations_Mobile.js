const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	ObjetRequeteDernieresEvaluations,
} = require("ObjetRequeteDernieresEvaluations.js");
const UtilitaireCompetences_Mobile = require("UtilitaireCompetences_Mobile.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { MoteurDernieresNotes } = require("MoteurDernieresNotes.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_DetailsNote } = require("ObjetFenetre_DetailsNote.js");
const {
	DonneesListe_DernieresEvaluations,
} = require("DonneesListe_DernieresEvaluations.js");
const { MethodesObjet } = require("MethodesObjet.js");
const TypeOngletDernieresEvaluations = { ParDate: 0, ParMatiere: 1 };
class InterfacePageDernieresEvaluations_Mobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		if (!GEtatUtilisateur.infosSupp) {
			GEtatUtilisateur.infosSupp = {};
		}
		if (!GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile) {
			GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile = {};
		}
		if (
			!MethodesObjet.isNumeric(
				GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile
					.genreOngletSelectionne,
			)
		) {
			GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile.genreOngletSelectionne =
				TypeOngletDernieresEvaluations.ParDate;
		}
		this.listePeriodes = new ObjetListeElements();
		this.periodeCourant = new ObjetElement();
		this.indiceParDefaut = 0;
		this.listeTabs = new ObjetListeElements();
		this.idWrapper = this.Nom + "_wrapper";
		this.ongletAffiche = this.getGenreOngletSelectionne();
		this.moteur = new MoteurDernieresNotes();
		this.moteurBulletin = new ObjetMoteurReleveBulletin();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.btnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_legende",
									callback: aInstance.surClicLegende.bind(this, false),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
			nodePdf: function () {
				$(this.node).on("click", () => {});
			},
		});
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireInstances() {
		this.idListeEval = this.add(
			ObjetListe,
			_evenementListeEval.bind(this),
			_initialiserListeEval.bind(this),
		);
		this.identSelection = this.add(
			ObjetSelection,
			this.surSelectionPeriode,
			_initSelecteur.bind(this),
		);
		this.identTabs = this.add(ObjetTabOnglets, _eventSurTabs.bind(this));
		const lElementParDate = new ObjetElement(
			GTraductions.getValeur("Date"),
			null,
			TypeOngletDernieresEvaluations.ParDate,
			null,
			false,
		);
		this.listeTabs.addElement(lElementParDate);
		const lElementParMatiere = new ObjetElement(
			GTraductions.getValeur("Matiere"),
			null,
			TypeOngletDernieresEvaluations.ParMatiere,
			null,
			false,
		);
		this.listeTabs.addElement(lElementParMatiere);
		this.AddSurZone = [this.identSelection, this.identTabs];
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		lHtml.push(
			`<section class="ListeDernieresNotes" id="${this.getInstance(this.idListeEval).getNom()}"></section>`,
		);
		if (!this.btnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		return lHtml.join("");
	}
	getGenreOngletSelectionne() {
		return GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile
			.genreOngletSelectionne;
	}
	sauverGenreOngletSelectionne(aGenreOnglet) {
		GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile.genreOngletSelectionne =
			aGenreOnglet;
	}
	getEvaluationWidgetSelectionne() {
		return GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile
			.evaluationWidgetSelectionne;
	}
	surClicLegende(avecNiveauxPositionnements) {
		UtilitaireCompetences_Mobile.openPopupDetailLegende(
			avecNiveauxPositionnements,
		);
	}
	recupererDonnees() {
		const lOngletInfosPeriodes = GEtatUtilisateur.getOngletInfosPeriodes();
		this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
		if (this.listePeriodes && this.listePeriodes.count()) {
			const lNrPeriodeParDefaut =
				GEtatUtilisateur.getPage() && GEtatUtilisateur.getPage().periode
					? GEtatUtilisateur.getPage().periode.getNumero()
					: lOngletInfosPeriodes.periodeParDefaut.getNumero();
			this.indiceParDefaut =
				this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
			if (!this.indiceParDefaut) {
				this.indiceParDefaut = 0;
			}
			this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
			this.getInstance(this.identSelection).setDonnees(
				this.listePeriodes,
				this.indiceParDefaut,
			);
		}
	}
	actionSurRecuperer(aListeEvaluations) {
		this.donnees = aListeEvaluations;
		this.listeTabs.getElementParGenre(
			TypeOngletDernieresEvaluations.ParDate,
		).Actif = true;
		this.listeTabs.getElementParGenre(
			TypeOngletDernieresEvaluations.ParMatiere,
		).Actif = true;
		if (!!aListeEvaluations && !!aListeEvaluations.count()) {
			this.listeEvaluations = new ObjetListeElements();
			aListeEvaluations.parcourir((aEval) => {
				const aNumeroServiceRecherche =
					aEval.matiere.serviceConcerne.getNumero();
				const lMatieresDeLaListeDEvals = this.listeEvaluations.getListeElements(
					(D) => {
						return (
							!!D.serviceConcerne &&
							D.serviceConcerne.getNumero() === aNumeroServiceRecherche
						);
					},
				);
				let lMatiereDeLaListeDEvals;
				if (lMatieresDeLaListeDEvals.count() > 0) {
					lMatiereDeLaListeDEvals =
						lMatieresDeLaListeDEvals.getPremierElement();
				}
				if (!lMatiereDeLaListeDEvals) {
					this.listeEvaluations.addElement(aEval.matiere);
					lMatiereDeLaListeDEvals = aEval.matiere;
				}
				this.listeEvaluations.addElement(aEval);
				aEval.matiere = lMatiereDeLaListeDEvals;
				aEval.pere = lMatiereDeLaListeDEvals;
			});
			let lIndiceOngletASelectionner = -1;
			for (let i = 0; i < this.listeTabs.count(); i++) {
				if (this.listeTabs.get(i).getGenre() === this.ongletAffiche) {
					lIndiceOngletASelectionner = i;
					break;
				}
			}
			if (lIndiceOngletASelectionner === -1) {
				lIndiceOngletASelectionner = TypeOngletDernieresEvaluations.ParDate;
			}
			this.getInstance(this.identTabs).setDonnees(
				this.listeTabs,
				lIndiceOngletASelectionner,
				true,
			);
			this.getInstance(this.identTabs).setVisible(true);
		} else {
			_afficherMessage.call(
				this,
				GTraductions.getValeur("evaluations.AucuneEvaluationSurPeriode"),
			);
			this.getInstance(this.identTabs).setDonnees(new ObjetListeElements());
			this.getInstance(this.identTabs).setVisible(false);
		}
		const $wrapper = $("#" + this.idWrapper.escapeJQ());
		let $tailleLegende = 0;
		const $legende = $wrapper.siblings("footer");
		if ($legende.is(":visible")) {
			$tailleLegende = $legende.height();
		}
		$wrapper.css("margin-bottom", $tailleLegende + "px");
	}
	recupererDernieresEvaluations() {
		new ObjetRequeteDernieresEvaluations(
			this,
			this.actionSurRecuperer,
		).lancerRequete({ periode: this.periodeCourant });
	}
	evntCorrigeQCM(aExecutionQCM) {
		if (aExecutionQCM) {
			this.callback.appel({
				genreOnglet: GEtatUtilisateur.genreOnglet,
				executionQCM: aExecutionQCM,
			});
		}
	}
	surSelectionPeriode(aParam) {
		this.periodeCourant = aParam.element;
		this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
			this.periodeCourant,
		);
		this.recupererDernieresEvaluations();
	}
	free(...aParams) {
		super.free(...aParams);
		if (this.btnFlottant) {
			$("#" + this.btnFlottant.getNom().escapeJQ()).remove();
		}
	}
}
function _afficherMessage(aMessage) {
	GHtml.setHtml(
		this.getInstance(this.idListeEval).getNom(),
		this.composeAucuneDonnee(aMessage),
	);
}
function _initSelecteur(aInstance) {
	aInstance.setParametres({
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
	});
}
function _initialiserListeEval(aInstance) {
	const lOptionsListe = { skin: ObjetListe.skin.flatDesign };
	aInstance.setOptionsListe(lOptionsListe);
}
function _evenementListeEval(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.SelectionClick: {
			_surClickListe.call(this, aParametres);
			break;
		}
		case EGenreEvenementListe.Selection: {
			if (!aParametres.surInteractionUtilisateur) {
				_surClickListe.call(this, aParametres);
			}
			break;
		}
	}
}
function _surClickListe(aParametres) {
	const lSelection = aParametres.article;
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsNote, {
		pere: this,
		evenement: (aNumerobouton, aParams) => {
			if (aParams && aParams.executionQCM) {
				this.evntCorrigeQCM(aParams.executionQCM);
			}
		},
		initialiser: function (aInstance) {
			aInstance.setOptionsFenetre({
				titre: GTraductions.getValeur("evaluations.DetailsEvaluation"),
				largeur: 600,
				hauteur: 300,
				heightMax_mobile: true,
				listeBoutons: [GTraductions.getValeur("principal.fermer")],
				modale: false,
			});
		},
	}).setDonnees(lSelection, this.donnees, {
		estUneEvaluation: true,
		getPiecesJointes: this.moteurBulletin.composePieceJointeDevoir.bind(this),
		callBackSurClicPrecedentSuivant: _surClickProchainElement.bind(this),
	});
}
function _eventSurTabs(aParams) {
	if (!!aParams) {
		this.ongletAffiche = aParams.getGenre();
		this.sauverGenreOngletSelectionne(this.ongletAffiche);
		const lListeEvaluations = this.getInstance(this.idListeEval);
		const lDonneesListe = new DonneesListe_DernieresEvaluations(
			this.listeEvaluations,
			{
				avecCumulMatiere:
					this.ongletAffiche === TypeOngletDernieresEvaluations.ParMatiere,
				callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
			},
		);
		lListeEvaluations.setDonnees(lDonneesListe);
		const lEvaluationWidgetSelectionne = this.getEvaluationWidgetSelectionne();
		if (
			!!lEvaluationWidgetSelectionne &&
			lEvaluationWidgetSelectionne.existeNumero()
		) {
			const lIndice = this.listeEvaluations.getIndiceElementParFiltre(
				(aEval) =>
					aEval.getNumero() === lEvaluationWidgetSelectionne.getNumero(),
			);
			if (lIndice !== -1) {
				lListeEvaluations.selectionnerLigne({
					ligne: lIndice,
					avecScroll: true,
					avecEvenement: true,
				});
			}
			GEtatUtilisateur.infosSupp.DernieresEvaluationsMobile.evaluationWidgetSelectionne =
				null;
		}
	}
}
function _surClickProchainElement(
	aNumeroElement,
	aGenreElement,
	aRechercheSuivant,
) {
	let lIndiceElementActuel, lIndiceProchainElement;
	lIndiceElementActuel = this.donnees.getIndiceParNumeroEtGenre(aNumeroElement);
	if (!!aRechercheSuivant) {
		lIndiceProchainElement =
			lIndiceElementActuel + 1 < this.donnees.count()
				? lIndiceElementActuel + 1
				: 0;
	} else {
		lIndiceProchainElement =
			lIndiceElementActuel === 0
				? this.donnees.count() - 1
				: lIndiceElementActuel - 1;
	}
	return this.donnees.get(lIndiceProchainElement);
}
module.exports = InterfacePageDernieresEvaluations_Mobile;

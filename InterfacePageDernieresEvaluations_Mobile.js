exports.InterfacePageDernieresEvaluations_Mobile = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteDernieresEvaluations_1 = require("ObjetRequeteDernieresEvaluations");
const UtilitaireCompetences_Mobile_1 = require("UtilitaireCompetences_Mobile");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const MoteurDernieresNotes_1 = require("MoteurDernieresNotes");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetListe_1 = require("ObjetListe");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DetailsNote_1 = require("ObjetFenetre_DetailsNote");
const DonneesListe_DernieresEvaluations_1 = require("DonneesListe_DernieresEvaluations");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
var TypeOngletDernieresEvaluations;
(function (TypeOngletDernieresEvaluations) {
	TypeOngletDernieresEvaluations[
		(TypeOngletDernieresEvaluations["ParDate"] = 0)
	] = "ParDate";
	TypeOngletDernieresEvaluations[
		(TypeOngletDernieresEvaluations["ParMatiere"] = 1)
	] = "ParMatiere";
})(TypeOngletDernieresEvaluations || (TypeOngletDernieresEvaluations = {}));
class InterfacePageDernieresEvaluations_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appScoMobile.getEtatUtilisateur();
		this.idWrapper = this.Nom + "_wrapper";
		this.moteur = new MoteurDernieresNotes_1.MoteurDernieresNotes();
		this.moteurBulletin =
			new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		if (!this.etatUtilSco.infosSupp) {
			this.etatUtilSco.infosSupp = {};
		}
		if (!this.etatUtilSco.infosSupp.DernieresEvaluationsMobile) {
			this.etatUtilSco.infosSupp.DernieresEvaluationsMobile = {};
		}
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(
				this.etatUtilSco.infosSupp.DernieresEvaluationsMobile
					.genreOngletSelectionne,
			)
		) {
			this.etatUtilSco.infosSupp.DernieresEvaluationsMobile.genreOngletSelectionne =
				TypeOngletDernieresEvaluations.ParDate;
		}
		this.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		this.periodeCourant = new ObjetElement_1.ObjetElement();
		this.indiceParDefaut = 0;
		this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
		this.ongletAffiche = this.getGenreOngletSelectionne();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.btnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_legende",
									callback: aInstance.surClicLegende.bind(this, false),
									ariaLabel:
										ObjetTraduction_1.GTraductions.getValeur("Legende"),
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
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireInstances() {
		this.idListeEval = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeEval.bind(this),
			this._initialiserListeEval.bind(this),
		);
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this.surSelectionPeriode,
			this._initSelecteur.bind(this),
		);
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._eventSurTabs.bind(this),
		);
		const lElementParDate = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Date"),
			null,
			TypeOngletDernieresEvaluations.ParDate,
			null,
			false,
		);
		this.listeTabs.addElement(lElementParDate);
		const lElementParMatiere = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Matiere"),
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
			$(
				"#" + this.appScoMobile.getInterfaceMobile().idZonePrincipale,
			).ieHtmlAppend(
				'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		return lHtml.join("");
	}
	getGenreOngletSelectionne() {
		return this.etatUtilSco.infosSupp.DernieresEvaluationsMobile
			.genreOngletSelectionne;
	}
	sauverGenreOngletSelectionne(aGenreOnglet) {
		this.etatUtilSco.infosSupp.DernieresEvaluationsMobile.genreOngletSelectionne =
			aGenreOnglet;
	}
	getEvaluationWidgetSelectionne() {
		return this.etatUtilSco.infosSupp.DernieresEvaluationsMobile
			.evaluationWidgetSelectionne;
	}
	surClicLegende(avecNiveauxPositionnements) {
		UtilitaireCompetences_Mobile_1.UtilitaireCompetences_Mobile.openPopupDetailLegende(
			avecNiveauxPositionnements,
		);
	}
	recupererDonnees() {
		const lOngletInfosPeriodes = this.etatUtilSco.getOngletInfosPeriodes();
		this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
		if (this.listePeriodes && this.listePeriodes.count()) {
			const lNrPeriodeParDefaut =
				this.etatUtilSco.getPage() && this.etatUtilSco.getPage().periode
					? this.etatUtilSco.getPage().periode.getNumero()
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
	actionSurRecuperer(aReponse) {
		var _a;
		this.donnees = aReponse.listeEvaluations;
		this.listeTabs.getElementParGenre(
			TypeOngletDernieresEvaluations.ParDate,
		).Actif = true;
		this.listeTabs.getElementParGenre(
			TypeOngletDernieresEvaluations.ParMatiere,
		).Actif = true;
		if (
			(_a =
				aReponse === null || aReponse === void 0
					? void 0
					: aReponse.listeEvaluations) === null || _a === void 0
				? void 0
				: _a.count()
		) {
			this.listeEvaluations = new ObjetListeElements_1.ObjetListeElements();
			aReponse.listeEvaluations.parcourir((aEval) => {
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
			this._afficherMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.AucuneEvaluationSurPeriode",
				),
			);
			this.getInstance(this.identTabs).setDonnees(
				new ObjetListeElements_1.ObjetListeElements(),
			);
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
		new ObjetRequeteDernieresEvaluations_1.ObjetRequeteDernieresEvaluations(
			this,
			this.actionSurRecuperer,
		).lancerRequete({ periode: this.periodeCourant });
	}
	evntCorrigeQCM(aExecutionQCM) {
		if (aExecutionQCM) {
			this.callback.appel({
				genreOnglet: this.etatUtilSco.genreOnglet,
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
	free() {
		super.free();
		if (this.btnFlottant) {
			$("#" + this.btnFlottant.getNom().escapeJQ()).remove();
		}
	}
	_afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setHtml(
			this.getInstance(this.idListeEval).getNom(),
			this.composeAucuneDonnee(aMessage),
		);
	}
	_initSelecteur(aInstance) {
		aInstance.setParametres({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_initialiserListeEval(aInstance) {
		const lOptionsListe = { skin: ObjetListe_1.ObjetListe.skin.flatDesign };
		aInstance.setOptionsListe(lOptionsListe);
	}
	_evenementListeEval(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				this._surClickListe(aParametres);
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				if (!aParametres.surInteractionUtilisateur) {
					this._surClickListe(aParametres);
				}
				break;
			}
		}
	}
	_surClickListe(aParametres) {
		const lSelection = aParametres.article;
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsNote_1.ObjetFenetre_DetailsNote,
			{
				pere: this,
				evenement: (aNumerobouton, aParams) => {
					if (aParams && aParams.executionQCM) {
						this.evntCorrigeQCM(aParams.executionQCM);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.DetailsEvaluation",
						),
						largeur: 600,
						hauteur: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
						],
						modale: false,
					});
				},
			},
		).setDonnees(lSelection, this.donnees, {
			estUneEvaluation: true,
			getPiecesJointes: this.moteurBulletin.composePieceJointeDevoir.bind(this),
			callBackSurClicPrecedentSuivant: this._surClickProchainElement.bind(this),
		});
	}
	_eventSurTabs(aParams) {
		if (!!aParams) {
			this.ongletAffiche = aParams.getGenre();
			this.sauverGenreOngletSelectionne(this.ongletAffiche);
			const lListeEvaluations = this.getInstance(this.idListeEval);
			const lDonneesListe =
				new DonneesListe_DernieresEvaluations_1.DonneesListe_DernieresEvaluations(
					this.listeEvaluations,
					{
						avecCumulMatiere:
							this.ongletAffiche === TypeOngletDernieresEvaluations.ParMatiere,
						callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
					},
				);
			lListeEvaluations.setDonnees(lDonneesListe);
			const lEvaluationWidgetSelectionne =
				this.getEvaluationWidgetSelectionne();
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
				this.etatUtilSco.infosSupp.DernieresEvaluationsMobile.evaluationWidgetSelectionne =
					null;
			}
		}
	}
	_surClickProchainElement(aNumeroElement, aGenreElement, aRechercheSuivant) {
		let lIndiceElementActuel, lIndiceProchainElement;
		lIndiceElementActuel =
			this.donnees.getIndiceParNumeroEtGenre(aNumeroElement);
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
}
exports.InterfacePageDernieresEvaluations_Mobile =
	InterfacePageDernieresEvaluations_Mobile;

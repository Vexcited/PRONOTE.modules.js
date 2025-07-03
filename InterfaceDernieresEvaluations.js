exports.InterfaceDernieresEvaluations = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_DernieresEvaluations_1 = require("DonneesListe_DernieresEvaluations");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteDernieresEvaluations_1 = require("ObjetRequeteDernieresEvaluations");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const MoteurDernieresNotes_1 = require("MoteurDernieresNotes");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const AccessApp_1 = require("AccessApp");
class InterfaceDernieresEvaluations extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.ids = { detailEvaluation: this.Nom + "_DernieresEval_detail" };
		this.parametres = { triParOrdreChronologique: true };
		this.largeurs = { liste: 625, detail: 600 };
		this.moteur = new MoteurDernieresNotes_1.MoteurDernieresNotes();
		this.moteurReleveBulletin =
			new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._eventSurCombo.bind(this),
			this._initCombo,
		);
		this.identListeEvaluations = this.add(
			ObjetListe_1.ObjetListe,
			this._eventListe.bind(this),
			this._initListe.bind(this),
		);
		this.interfaceFenetreVisu = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListeEvaluations;
		this.avecBandeau = true;
		this.AddSurZone = [this.identCombo];
		this.AddSurZone.push({
			html: IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": this.jsxModeleRadioTriEvaluations.bind(this, 0),
						class: "as-chips",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.tri.Par_ordre_chronologique",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": this.jsxModeleRadioTriEvaluations.bind(this, 1),
						class: "m-left as-chips",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.tri.Par_matiere",
					),
				),
			),
		});
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: IE.jsx.str("ie-btnicon", {
				class: "icon_legende avecFond",
				"ie-model": this.jsxModeleBoutonLegende.bind(this),
				title: ObjetTraduction_1.GTraductions.getValeur("competences.Legende"),
				"aria-haspopup": "dialog",
			}),
		});
	}
	jsxModeleRadioTriEvaluations(aModeTri) {
		return {
			getValue: () => {
				return aModeTri === 0
					? this.parametres.triParOrdreChronologique
					: !this.parametres.triParOrdreChronologique;
			},
			setValue: (aValue) => {
				this.parametres.triParOrdreChronologique = aModeTri === 0;
				const lListeDernieresEvaluations = this.getInstance(
					this.identListeEvaluations,
				);
				if (lListeDernieresEvaluations.getDonneesListe()) {
					lListeDernieresEvaluations
						.getDonneesListe()
						.setParametres({
							avecCumulMatiere: !this.parametres.triParOrdreChronologique,
						});
					lListeDernieresEvaluations.actualiser({
						conserverSelection: true,
						avecScrollSelection: true,
					});
					if (
						!this.getSelectedEvaluation() ||
						!this.getSelectedEvaluation().existeNumero()
					) {
						ObjetHtml_1.GHtml.setHtml(
							this.ids.detailEvaluation,
							this._composeDetailSelectionnezUneEvaluation(),
						);
					}
				}
			},
			getName: () => {
				return `${this.Nom}_TriEvaluations`;
			},
		};
	}
	jsxModeleBoutonLegende() {
		return {
			event: () => {
				const lFenetreLegende =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_1.ObjetFenetre,
						{
							pere: this,
							initialiser: (aInstance) => {
								aInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"competences.Legende",
									),
									largeur: 250,
									hauteur: 125,
								});
							},
						},
					);
				lFenetreLegende.afficher(
					UtilitaireCompetences_1.TUtilitaireCompetences.composeLegende({
						avecTitreLegende: false,
					}),
				);
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			afficherCorrigerQCM: {
				event: function () {
					aInstance.evntCorrigeQCM();
				},
			},
		});
	}
	evntCorrigeQCM(aNumero, aGenre) {
		let lEvaluation;
		if (aNumero === undefined) {
			lEvaluation = this.getSelectedEvaluation();
		} else {
			lEvaluation =
				this.listeEvaluationsAvecCumulMatieres.getElementParNumeroEtGenre(
					aNumero,
					aGenre,
				);
		}
		if (!!lEvaluation && !!lEvaluation.executionQCM) {
			this.afficherExecutionQCM(lEvaluation.executionQCM);
		}
	}
	afficherExecutionQCM(aExecutionQCM) {
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.interfaceFenetreVisu),
			aExecutionQCM,
			true,
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(`<div class="InterfaceDernieresNotes">`);
		H.push(
			`<section id="${this.getInstance(this.identListeEvaluations).getNom()}" class="liste-contain ListeDernieresNotes" style="--liste-width : ${this.largeurs.liste}px;"></section>`,
		);
		H.push(
			`<section tabindex="0" id="${this.ids.detailEvaluation}" class="Zone-DetailsNotes detail-contain" style="--detail-width : ${this.largeurs.detail}px;"></section>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
	recupererDonnees() {
		if (this.getInstance(this.identCombo)) {
			this.IdPremierElement = this.getInstance(
				this.identCombo,
			).getPremierElement();
			this.listePeriodes = this.etatUtilSco.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				this.getInstance(this.identCombo).setVisible(true);
				this.getInstance(this.identCombo).setDonnees(this.listePeriodes);
				this.getInstance(this.identCombo).setSelectionParElement(
					this.etatUtilSco.getPeriode(),
					0,
				);
			} else {
				this.getInstance(this.identCombo).setVisible(false);
			}
		}
	}
	_composeDetailSelectionnezUneEvaluation() {
		return [
			'<div class="Gras AlignementMilieu GrandEspaceHaut">',
			ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.SelectionnezUneEvaluation",
			),
			"</div>",
		].join("");
	}
	_composeDetailEvaluation(aEvaluation) {
		const H = [];
		if (aEvaluation) {
			H.push(
				this.moteur.composeDetailsEvaluation(aEvaluation, {
					piecesJointes: this.moteurReleveBulletin.composePieceJointeDevoir(
						aEvaluation,
						true,
					),
				}),
			);
		}
		return H.join("");
	}
	_initListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			ariaLabel: () => {
				var _a;
				return `${this.etatUtilSco.getLibelleLongOnglet()} ${((_a = this.etatUtilSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${this.parametres.triParOrdreChronologique ? ObjetTraduction_1.GTraductions.getValeur("evaluations.tri.Par_ordre_chronologique") : ObjetTraduction_1.GTraductions.getValeur("evaluations.tri.Par_matiere")}`.trim();
			},
		});
	}
	_eventListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					!!aParametres.article &&
					aParametres.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Evaluation
				) {
					this.setSelectedEvaluation(aParametres.article);
				} else {
					this.setSelectedEvaluation(null);
				}
				ObjetHtml_1.GHtml.setHtml(
					this.ids.detailEvaluation,
					this._composeDetailEvaluation(aParametres.article),
					{ controleur: this.controleur, instance: this },
				);
				ObjetHtml_1.GHtml.setFocus(this.ids.detailEvaluation);
				break;
		}
	}
	_initCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_eventSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
				aParams.element,
			);
			new ObjetRequeteDernieresEvaluations_1.ObjetRequeteDernieresEvaluations(
				this,
				this._surRequeteDernieresEvaluations.bind(this),
			).lancerRequete({ periode: aParams.element });
		}
	}
	_surRequeteDernieresEvaluations(aReponse) {
		if (
			aReponse &&
			aReponse.listeEvaluations &&
			aReponse.listeEvaluations.count() > 0
		) {
			this.afficherBandeau(true);
			this.listeEvaluationsAvecCumulMatieres =
				new ObjetListeElements_1.ObjetListeElements();
			aReponse.listeEvaluations.parcourir((aEval) => {
				const aNumeroServiceRecherche =
					aEval.matiere.serviceConcerne.getNumero();
				const lMatieresDeLaListeDEvals =
					this.listeEvaluationsAvecCumulMatieres.getListeElements((D) => {
						return (
							!!D.serviceConcerne &&
							D.serviceConcerne.getNumero() === aNumeroServiceRecherche
						);
					});
				let lMatiereDeLaListeDEvals;
				if (lMatieresDeLaListeDEvals.count() > 0) {
					lMatiereDeLaListeDEvals =
						lMatieresDeLaListeDEvals.getPremierElement();
				}
				if (!lMatiereDeLaListeDEvals) {
					this.listeEvaluationsAvecCumulMatieres.addElement(aEval.matiere);
					lMatiereDeLaListeDEvals = aEval.matiere;
				}
				this.listeEvaluationsAvecCumulMatieres.addElement(aEval);
				aEval.matiere = lMatiereDeLaListeDEvals;
				aEval.pere = lMatiereDeLaListeDEvals;
			});
			const lListeEvaluations = this.getInstance(this.identListeEvaluations);
			lListeEvaluations.setDonnees(
				new DonneesListe_DernieresEvaluations_1.DonneesListe_DernieresEvaluations(
					this.listeEvaluationsAvecCumulMatieres,
					{
						avecCumulMatiere: !this.parametres.triParOrdreChronologique,
						callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
					},
				),
			);
			let llIndexSelectionEvaluation = -1;
			const lNavigationEvaluation = this.getSelectedEvaluation();
			if (!!lNavigationEvaluation && lNavigationEvaluation.existeNumero()) {
				llIndexSelectionEvaluation =
					this.listeEvaluationsAvecCumulMatieres.getIndiceElementParFiltre(
						(D) => {
							return D.getNumero() === lNavigationEvaluation.getNumero();
						},
					);
			}
			if (llIndexSelectionEvaluation !== -1) {
				lListeEvaluations.selectionnerLigne({
					ligne: llIndexSelectionEvaluation,
					avecScroll: true,
					avecEvenement: true,
				});
			} else {
				ObjetHtml_1.GHtml.setHtml(
					this.ids.detailEvaluation,
					this._composeDetailSelectionnezUneEvaluation(),
				);
			}
		} else {
			ObjetHtml_1.GHtml.setHtml(this.ids.detailEvaluation, "&nbsp;");
			this.evenementAfficherMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.AucuneEvaluationSurPeriode",
				),
			);
			this.setSelectedEvaluation(null);
		}
	}
	getSelectedEvaluation() {
		return this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Evaluation,
		);
	}
	setSelectedEvaluation(aEvaluation) {
		this.etatUtilSco.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Evaluation,
			aEvaluation,
		);
	}
}
exports.InterfaceDernieresEvaluations = InterfaceDernieresEvaluations;

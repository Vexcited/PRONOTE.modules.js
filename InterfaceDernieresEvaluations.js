const { GHtml } = require("ObjetHtml.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_DernieresEvaluations,
} = require("DonneesListe_DernieresEvaluations.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetRequeteDernieresEvaluations,
} = require("ObjetRequeteDernieresEvaluations.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { tag } = require("tag.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { MoteurDernieresNotes } = require("MoteurDernieresNotes.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { UtilitaireQCMPN } = require("UtilitaireQCMPN.js");
class InterfaceDernieresEvaluations extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.ids = { detailEvaluation: this.Nom + "_DernieresEval_detail" };
		this.parametres = { triParOrdreChronologique: true };
		this.largeurs = { liste: 625, detail: 600 };
		this.moteur = new MoteurDernieresNotes();
		this.moteurReleveBulletin = new ObjetMoteurReleveBulletin();
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisiePN,
			_eventSurCombo.bind(this),
			_initCombo,
		);
		this.identListeEvaluations = this.add(
			ObjetListe,
			_eventListe.bind(this),
			_initListe.bind(this),
		);
		this.interfaceFenetreVisu = this.addFenetre(ObjetFenetreVisuEleveQCM);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListeEvaluations;
		this.avecBandeau = true;
		this.AddSurZone = [this.identCombo];
		this.AddSurZone.push({
			html:
				'<ie-radio ie-model="radioTriEvaluations(0)" class="as-chips">' +
				GTraductions.getValeur("evaluations.tri.Par_ordre_chronologique") +
				"</ie-radio>" +
				'<ie-radio ie-model="radioTriEvaluations(1)" class="m-left as-chips">' +
				GTraductions.getValeur("evaluations.tri.Par_matiere") +
				"</ie-radio>",
		});
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: tag("ie-btnicon", {
				class: "icon_legende avecFond",
				"ie-model": "btnLegende",
				title: GTraductions.getValeur("competences.Legende"),
			}),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioTriEvaluations: {
				getValue: function (aMode) {
					return aMode === 0
						? aInstance.parametres.triParOrdreChronologique
						: !aInstance.parametres.triParOrdreChronologique;
				},
				setValue: function (aData) {
					aInstance.parametres.triParOrdreChronologique = aData === 0;
					const lListeDernieresEvaluations = aInstance.getInstance(
						aInstance.identListeEvaluations,
					);
					if (lListeDernieresEvaluations.getDonneesListe()) {
						lListeDernieresEvaluations
							.getDonneesListe()
							.setParametres({
								avecCumulMatiere:
									!aInstance.parametres.triParOrdreChronologique,
							});
						lListeDernieresEvaluations.actualiser({
							conserverSelection: true,
							avecScrollSelection: true,
						});
						if (
							!getSelectedEvaluation() ||
							!getSelectedEvaluation().existeNumero()
						) {
							GHtml.setHtml(
								aInstance.ids.detailEvaluation,
								_composeDetailSelectionnezUneEvaluation(),
							);
						}
					}
				},
			},
			btnLegende: {
				event: function () {
					ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
						pere: this,
						initialiser: (aInstance) => {
							aInstance.setOptionsFenetre({
								titre: GTraductions.getValeur("competences.Legende"),
								largeur: 250,
								hauteur: 125,
							});
						},
					}).afficher(
						TUtilitaireCompetences.composeLegende({ avecTitreLegende: false }),
					);
				},
			},
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
			lEvaluation = getSelectedEvaluation();
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
		UtilitaireQCMPN.executerQCM(
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
			`<section tabindex="0" id="${this.ids.detailEvaluation}" class="Zone-DetailsNotes detail-contain"  style="--detail-width : ${this.largeurs.detail}px;"></section>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
	recupererDonnees() {
		if (this.Instances[this.identCombo]) {
			this.IdPremierElement = this.getInstance(
				this.identCombo,
			).getPremierElement();
			this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				this.Instances[this.identCombo].setVisible(true);
				this.Instances[this.identCombo].setDonnees(this.listePeriodes);
				this.Instances[this.identCombo].setSelectionParElement(
					GEtatUtilisateur.getPeriode(),
					0,
				);
			} else {
				this.Instances[this.identCombo].setVisible(false);
			}
		}
	}
}
function _composeDetailSelectionnezUneEvaluation() {
	return [
		'<div class="Gras AlignementMilieu GrandEspaceHaut">',
		GTraductions.getValeur("evaluations.SelectionnezUneEvaluation"),
		"</div>",
	].join("");
}
function _composeDetailEvaluation(aEvaluation) {
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
function _initListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		avecOmbreDroite: true,
	});
}
function _eventListe(aParametres, aGenreEvenement) {
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Selection:
		case EGenreEvenementListe.SelectionClick:
			if (
				!!aParametres.article &&
				aParametres.article.getGenre() === EGenreRessource.Evaluation
			) {
				setSelectedEvaluation(aParametres.article);
			} else {
				setSelectedEvaluation(null);
			}
			GHtml.setHtml(
				this.ids.detailEvaluation,
				_composeDetailEvaluation.call(this, aParametres.article),
				{ controleur: this.controleur, instance: this },
			);
			GHtml.setFocus(this.ids.detailEvaluation);
			break;
	}
}
function _initCombo(aInstance) {
	aInstance.setOptionsObjetSaisie({
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
	});
}
function _eventSurCombo(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		GEtatUtilisateur.Navigation.setRessource(
			EGenreRessource.Periode,
			aParams.element,
		);
		new ObjetRequeteDernieresEvaluations(
			this,
			_surRequeteDernieresEvaluations.bind(this),
		).lancerRequete({ periode: aParams.element });
	}
}
function _surRequeteDernieresEvaluations(aListeEvaluations) {
	if (aListeEvaluations && aListeEvaluations.count() > 0) {
		this.afficherBandeau(true);
		this.listeEvaluationsAvecCumulMatieres = new ObjetListeElements();
		aListeEvaluations.parcourir((aEval) => {
			const aNumeroServiceRecherche = aEval.matiere.serviceConcerne.getNumero();
			const lMatieresDeLaListeDEvals =
				this.listeEvaluationsAvecCumulMatieres.getListeElements((D) => {
					return (
						!!D.serviceConcerne &&
						D.serviceConcerne.getNumero() === aNumeroServiceRecherche
					);
				});
			let lMatiereDeLaListeDEvals;
			if (lMatieresDeLaListeDEvals.count() > 0) {
				lMatiereDeLaListeDEvals = lMatieresDeLaListeDEvals.getPremierElement();
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
			new DonneesListe_DernieresEvaluations(
				this.listeEvaluationsAvecCumulMatieres,
				{
					avecCumulMatiere: !this.parametres.triParOrdreChronologique,
					callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
				},
			),
		);
		let llIndexSelectionEvaluation = -1;
		const lNavigationEvaluation = getSelectedEvaluation();
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
			GHtml.setHtml(
				this.ids.detailEvaluation,
				_composeDetailSelectionnezUneEvaluation.call(this),
			);
		}
	} else {
		GHtml.setHtml(this.ids.detailEvaluation, "&nbsp;");
		this.evenementAfficherMessage(
			GTraductions.getValeur("evaluations.AucuneEvaluationSurPeriode"),
		);
		setSelectedEvaluation(null);
	}
}
function getSelectedEvaluation() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Evaluation);
}
function setSelectedEvaluation(aEvaluation) {
	GEtatUtilisateur.Navigation.setRessource(
		EGenreRessource.Evaluation,
		aEvaluation,
	);
}
module.exports = InterfaceDernieresEvaluations;

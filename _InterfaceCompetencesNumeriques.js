exports._InterfaceCompetencesNumeriques = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_CompetencesNumeriques_1 = require("DonneesListe_CompetencesNumeriques");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const ObjetRequeteCompetencesNumeriques_1 = require("ObjetRequeteCompetencesNumeriques");
const GlossaireCompetences_1 = require("GlossaireCompetences");
class _InterfaceCompetencesNumeriques extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.filtrerNiveauxSansEvaluation = false;
		this.ids = {
			piedPage: this.Nom + "_pied",
			listeConteneur: this.Nom + "_listeConteneur",
			textareaApprecation: this.Nom + "_appreciation",
		};
		this.parametres = { heightPied: 10, heightLibelleObservation: 2 };
	}
	construireInstances() {
		this.identReleve = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div style="',
			ObjetStyle_1.GStyle.composeHeight(100, "%"),
			'" class="EspaceGauche EspaceDroit">',
		);
		H.push(
			'<div id="',
			this.ids.listeConteneur,
			'" ',
			'style="height:calc(100% - ' + this.parametres.heightPied + 'rem);"',
			">",
			'<div id="',
			this.getNomInstance(this.identReleve),
			'" style="height:100%;"></div>',
			"</div>",
		);
		H.push(
			'<div id="',
			this.ids.piedPage,
			'" style="height:',
			this.parametres.heightPied,
			'rem; display: none;">',
			'<div class="Gras" style="',
			ObjetStyle_1.GStyle.composeHeight(
				this.parametres.heightLibelleObservation,
				"rem",
			),
			" line-height: ",
			this.parametres.heightLibelleObservation,
			'rem;">',
			`<label ie-html="getLibelleAppreciation" for="${this.ids.textareaApprecation}"></label>`,
			"</div>",
			'<ie-textareamax id="',
			this.ids.textareaApprecation,
			'" ie-model="modelAppreciation" maxlength="',
			this.parametresSco.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
			),
			'" style="height: calc(100% - ' +
				this.parametres.heightLibelleObservation +
				'rem - 1rem);width: 100%;margin: 0;"></ie-textareamax>',
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identReleve;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(this.ids.piedPage, false);
		super.evenementAfficherMessage(aGenreMessage);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFiltrerNiveauxEvalues: {
				getValue: function () {
					return aInstance.filtrerNiveauxSansEvaluation;
				},
				setValue: function () {
					aInstance.filtrerNiveauxSansEvaluation =
						!aInstance.filtrerNiveauxSansEvaluation;
					if (aInstance.getEtatSaisie() === true) {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
							aInstance.afficherPage.bind(aInstance),
						);
					} else {
						aInstance.afficherPage();
					}
				},
				getDisabled: function () {
					return aInstance.estAffichageDeLaClasse();
				},
			},
			modelAppreciation: {
				getValue: function () {
					return aInstance.donnees ? aInstance.donnees.appreciation : "";
				},
				setValue: function (aValue) {
					if (aInstance.donnees) {
						aInstance.donnees.appreciation = aValue;
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.donnees || !aInstance.donnees.appreciationEstEditable
					);
				},
			},
			getLibelleAppreciation: function () {
				if (aInstance.estAffichageDeLaClasse()) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"competences.AppreciationDeLaClasse",
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"competences.AppreciationDeLEleve",
					);
				}
			},
		});
	}
	_construitAddSurZoneCommun() {
		return [
			{
				html:
					'<ie-checkbox ie-model="cbFiltrerNiveauxEvalues">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.FiltrerItemsEvalues",
					) +
					"</ie-checkbox>",
			},
		];
	}
	afficherPage() {
		new ObjetRequeteCompetencesNumeriques_1.ObjetRequeteCompetencesNumeriques(
			this,
			this._reponseRequeteCompetences,
		).lancerRequete(this.getParametresRequete());
	}
	_reponseRequeteCompetences(aDonnees) {
		this.setEtatSaisie(false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.listeConteneur, true);
		this.donnees = Object.assign(
			{
				droitSaisie: false,
				palier: null,
				listePiliers: null,
				listeCompetences: null,
				appreciation: "",
				appreciationEstEditable: false,
				appreciationsDifferentes: false,
			},
			aDonnees,
		);
		this._initListeReleve(this.getInstance(this.identReleve));
		ObjetHtml_1.GHtml.setDisplay(this.ids.piedPage, true);
		this._actualiserListe();
		const $textareaAppreciation = $(
			"#" + this.ids.textareaApprecation.escapeJQ(),
		);
		if (
			this.estAffichageDeLaClasse() &&
			this.donnees.appreciationsDifferentes
		) {
			$textareaAppreciation.attr(
				"placeholder",
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.AppreciationsDifferentes",
				),
			);
		} else {
			$textareaAppreciation.removeAttr("placeholder");
		}
		if (this.estAffichageDeLaClasse()) {
			ObjetHtml_1.GHtml.setDisplay(this.ids.listeConteneur, false);
		}
		this._actualiserCommandePDF();
	}
	evenementSurListe(aParametres) {}
	_avecColonneEvaluations() {
		return !this.etatUtilisateurSco.pourPrimaire();
	}
	_initListeReleve(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_CompetencesNumeriques_1
				.DonneesListe_CompetencesNumeriques.colonnes.items,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.competetencesNumeriques",
			),
		});
		if (this._avecColonneEvaluations()) {
			lColonnes.push({
				id: DonneesListe_CompetencesNumeriques_1
					.DonneesListe_CompetencesNumeriques.colonnes.evaluations,
				taille: 200,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competences.evaluations",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_CompetencesNumeriques_1
				.DonneesListe_CompetencesNumeriques.colonnes.niveau,
			taille: 70,
			titre: {
				getLibelleHtml: () => {
					const lColNiveau = [];
					if (this.donnees.droitSaisie) {
						const lJSXBtnValidationAuto = () => {
							return {
								event: () => {
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
										{
											estCompetenceNumerique: true,
											instance: this,
											palier: this.donnees.palier,
											listePiliers: this.donnees.listePiliers,
										},
									);
								},
								getTitle: () => {
									return GlossaireCompetences_1.TradGlossaireCompetences
										.validationAuto.hintBoutonCN;
								},
							};
						};
						lColNiveau.push(
							IE.jsx.str("ie-btnicon", {
								"ie-model": lJSXBtnValidationAuto,
								class: "icon_sigma color-neutre MargeDroit",
							}),
						);
					}
					lColNiveau.push(
						ObjetTraduction_1.GTraductions.getValeur("competences.niveau"),
					);
					return lColNiveau.join("");
				},
			},
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	_actualiserListe() {
		const lDonneesListe =
			new DonneesListe_CompetencesNumeriques_1.DonneesListe_CompetencesNumeriques(
				this.donnees.listeCompetences,
				{
					callbackInitMenuContextuel: this.avecMenuContextuel()
						? this._initMenuContextuelListe.bind(this)
						: null,
				},
			);
		lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
		this.getInstance(this.identReleve).setDonnees(lDonneesListe);
	}
	avecMenuContextuel() {
		return false;
	}
	_initMenuContextuelListe(aParametres) {}
}
exports._InterfaceCompetencesNumeriques = _InterfaceCompetencesNumeriques;

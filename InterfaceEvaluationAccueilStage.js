exports.InterfaceEvaluationAccueilStage = void 0;
const ObjetRequetePageStageGeneral_1 = require("ObjetRequetePageStageGeneral");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_EvaluationAccueilStage_1 = require("DonneesListe_EvaluationAccueilStage");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeEtatSatisfaction_1 = require("TypeEtatSatisfaction");
const ObjetRequeteEvaluationAccueilStage_1 = require("ObjetRequeteEvaluationAccueilStage");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteSaisieEvaluationAccueilStage_1 = require("ObjetRequeteSaisieEvaluationAccueilStage");
class InterfaceEvaluationAccueilStage extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.classMessage = GUID_1.GUID.getClassCss();
		this.classPage = GUID_1.GUID.getClassCss();
		this.idPage = GUID_1.GUID.getId();
		this.donnees = { libelleBandeau: "", hintLibelleBandeau: "" };
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementCombo,
			this.initialiserCombo,
		);
		this.IdPremierElement = this.getInstance(
			this.identCombo,
		).getPremierElement();
		this.identListeEvaluation = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeEvaluation,
			this.initialiserListeEvaluation,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identCombo);
		this.AddSurZone.push({
			html: IE.jsx.str("span", {
				class: "Gras",
				"ie-html": this.jsxGetHtmlLibelleBandeau.bind(this),
				"ie-hint": this.jsxGetHintLibelleBandeau.bind(this),
			}),
		});
	}
	construireStructureAffichageAutre() {
		const lIdObservation = GUID_1.GUID.getId();
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.idPage,
					class: [this.classPage, "p-all-l", "flex-contain", "cols"],
					style: "display: none; max-width:800px;",
				},
				IE.jsx.str(
					"h2",
					{ class: "ie-titre-couleur p-bottom-l border-bottom" },
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.EntrepriseDAccueil",
					),
				),
				IE.jsx.str("div", {
					class: "p-all-l m-top-l",
					"ie-html": this.jsxGetHtmlBlocEntreprise.bind(this),
				}),
				IE.jsx.str(
					"h2",
					{ class: "ie-titre-couleur p-bottom-l border-bottom" },
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.AvisQualiteAccueil",
					),
				),
				IE.jsx.str("div", {
					class: "p-all-l",
					"ie-html": this.jsxGetHtmlMessageRepondreAvant.bind(this),
				}),
				IE.jsx.str("div", {
					class: "p-all-l m-bottom-l",
					id: this.getNomInstance(this.identListeEvaluation),
				}),
				IE.jsx.str(
					"h2",
					{ id: lIdObservation, class: "ie-titre-couleur p-y-l border-bottom" },
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.Observations",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "p-y-l p-left-l" },
					IE.jsx.str("ie-textareamax", {
						"aria-labelledby": lIdObservation,
						"ie-model": this.jsxModeleTextareaObservation.bind(this),
						maxlength: "1000",
						class: "FondBlanc",
						style: ObjetStyle_1.GStyle.composeHeight(120),
					}),
				),
			),
		);
		H.push(
			IE.jsx.str("div", {
				class: [this.classMessage, "semi-bold", "p-top-l", "AlignementMilieu"],
				"ie-html": this.jsxGetHtmlMessage.bind(this),
				style: "height: 100%;",
				tabindex: "0",
			}),
		);
		return H.join("");
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		new ObjetRequetePageStageGeneral_1.ObjetRequetePageStageGeneral(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(
			GEtatUtilisateur.getMembre()
				? GEtatUtilisateur.getMembre().getNumero()
				: 0,
		);
	}
	actionSurRecupererDonnees(aListeStages) {
		let lListeStages;
		if (aListeStages) {
			lListeStages = aListeStages.getListeElements((aElement) => {
				return aElement.questionnaireEstPublie;
			});
		}
		if (lListeStages && lListeStages.count() > 0) {
			this.getInstance(this.identCombo).setDonnees(lListeStages);
			this.getInstance(this.identCombo).setSelectionParNumeroEtGenre(
				this.etatUtilisateurSco.Navigation.getNumeroRessource(
					Enumere_Ressource_1.EGenreRessource.Stage,
				),
				this.etatUtilisateurSco.Navigation.getGenreRessource(
					Enumere_Ressource_1.EGenreRessource.Stage,
				),
				0,
			);
			this.getInstance(this.identCombo).setVisible(true);
			ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		} else {
			this.getInstance(this.identCombo).setVisible(false);
			ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
			this.message = ObjetTraduction_1.GTraductions.getValeur(
				"questionnaireStage.AucunQuestionnairePublie",
			);
		}
	}
	evenementCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.stageCourant = aParams.element;
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Stage,
				aParams.element,
			);
			let lNouveauLibelleBandeau = aParams.element.periode;
			let lInfobulleBandeau = "";
			const lArray = lNouveauLibelleBandeau.split("; ");
			if (lArray.length > 5) {
				lInfobulleBandeau = lNouveauLibelleBandeau;
				lNouveauLibelleBandeau = "&nbsp;";
				for (let i = 0; i < 5; i++) {
					lNouveauLibelleBandeau += lArray[i] + "; ";
				}
				lNouveauLibelleBandeau += "...";
			} else {
				lNouveauLibelleBandeau = "&nbsp;" + lNouveauLibelleBandeau;
			}
			this.donnees.libelleBandeau = lNouveauLibelleBandeau;
			this.donnees.hintLibelleBandeau = "";
			if (!!lInfobulleBandeau) {
				this.donnees.hintLibelleBandeau = lInfobulleBandeau;
			}
			new ObjetRequeteEvaluationAccueilStage_1.ObjetRequeteEvaluationAccueilStage(
				this,
				this._actionApresRequeteEvaluationAccueilStage.bind(this),
			).lancerRequete({ stage: this.stageCourant });
		}
	}
	_actionApresRequeteEvaluationAccueilStage(aJSON) {
		this.message = aJSON && aJSON.message ? aJSON.message : "";
		if (!!this.message) {
			$("." + this.classPage.escapeJQ()).hide();
			$("." + this.classMessage.escapeJQ()).show();
		} else {
			$("." + this.classMessage.escapeJQ()).hide();
			$("." + this.classPage.escapeJQ()).show();
		}
		this.observation = aJSON && aJSON.observation ? aJSON.observation : "";
		this.listeQuestions =
			aJSON && aJSON.listeQuestions
				? aJSON.listeQuestions
				: new ObjetListeElements_1.ObjetListeElements();
		this.entreprise =
			aJSON && aJSON.entreprise
				? aJSON.entreprise
				: new ObjetElement_1.ObjetElement();
		this.editable = aJSON && aJSON.editable ? aJSON.editable : false;
		this.dateFin = aJSON && aJSON.dateFin ? aJSON.dateFin : null;
		this.getInstance(this.identListeEvaluation).setDonnees(
			new DonneesListe_EvaluationAccueilStage_1.DonneesListe_EvaluationAccueilStage(
				this.listeQuestions,
				this.editable,
			),
		);
	}
	evenementListeEvaluation(aParams) {
		let lDonnee;
		if (
			aParams.article &&
			aParams.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.Edition
		) {
			lDonnee = aParams.article;
			switch (aParams.idColonne) {
				case DonneesListe_EvaluationAccueilStage_1
					.DonneesListe_EvaluationAccueilStage.colonnes.tresInsatisfait:
					lDonnee.typeSatisfaction =
						lDonnee.typeSatisfaction !==
						TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_TresInsatisfait
							? TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_TresInsatisfait
							: TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_NonEvalue;
					break;
				case DonneesListe_EvaluationAccueilStage_1
					.DonneesListe_EvaluationAccueilStage.colonnes.insatisfait:
					lDonnee.typeSatisfaction =
						lDonnee.typeSatisfaction !==
						TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_Insatisfait
							? TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_Insatisfait
							: TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_NonEvalue;
					break;
				case DonneesListe_EvaluationAccueilStage_1
					.DonneesListe_EvaluationAccueilStage.colonnes.satisfait:
					lDonnee.typeSatisfaction =
						lDonnee.typeSatisfaction !==
						TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_Satisfait
							? TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_Satisfait
							: TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_NonEvalue;
					break;
				case DonneesListe_EvaluationAccueilStage_1
					.DonneesListe_EvaluationAccueilStage.colonnes.tresSatisfait:
					lDonnee.typeSatisfaction =
						lDonnee.typeSatisfaction !==
						TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_TresSatisfait
							? TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_TresSatisfait
							: TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_NonEvalue;
					break;
			}
			lDonnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListeEvaluation).actualiser(true);
		}
	}
	jsxGetHtmlLibelleBandeau() {
		return this.donnees.libelleBandeau;
	}
	jsxGetHintLibelleBandeau() {
		return this.donnees.hintLibelleBandeau;
	}
	jsxModeleTextareaObservation() {
		return {
			getValue: () => {
				return this.observation ? this.observation : "";
			},
			setValue: (aValue) => {
				if (this.observation !== aValue) {
					this.observation = aValue;
					this.setEtatSaisie(true);
				}
			},
			getDisabled: () => {
				return !this.editable;
			},
		};
	}
	jsxGetHtmlMessageRepondreAvant() {
		if (this && !!this.dateFin) {
			if (this.editable) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"questionnaireStage.RepondreAvant",
					[
						ObjetDate_1.GDate.formatDate(
							this.dateFin,
							'<span class="medium color-red-moyen">%JJ/%MM/%AAAA</span>',
						),
					],
				);
			} else if (
				!this.editable &&
				ObjetDate_1.GDate.estAvantJourCourant(this.dateFin)
			) {
				return (
					'<span class="medium color-red-moyen">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.expire",
					) +
					"</span>"
				);
			}
		}
		return "";
	}
	jsxGetHtmlMessage() {
		return this.message;
	}
	jsxGetHtmlBlocEntreprise() {
		const lHtml = [];
		if (this.entreprise) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center" },
					IE.jsx.str("i", {
						class: `fix-bloc icone-m m-right-l ${this.entreprise.estSiegeSocial ? `icon_building` : `icon_entreprise`} theme_color_moyen1`,
						role: "presentation",
					}),
					IE.jsx.str(
						"span",
						{ class: "ie-titre" },
						this.entreprise.getLibelle(),
					),
					!!this.entreprise.nomCommercial
						? IE.jsx.str("span", null, ` / ${this.entreprise.nomCommercial}`)
						: "",
				),
			);
			lHtml.push(`<div class="m-left-big p-bottom-xl">`);
			if (this.entreprise.adresse1) {
				lHtml.push("<div>", this.entreprise.adresse1, "</div>");
			}
			if (this.entreprise.adresse2) {
				lHtml.push("<div>", this.entreprise.adresse2, "</div>");
			}
			if (this.entreprise.adresse3) {
				lHtml.push("<div>", this.entreprise.adresse3, "</div>");
			}
			if (this.entreprise.adresse4) {
				lHtml.push("<div>", this.entreprise.adresse4, "</div>");
			}
			if (this.entreprise.codePostal || this.entreprise.ville) {
				lHtml.push("<div>");
			}
			if (this.entreprise.codePostal) {
				lHtml.push(this.entreprise.codePostal);
			}
			if (this.entreprise.codePostal && this.entreprise.ville) {
				lHtml.push(" ");
			}
			if (this.entreprise.ville) {
				lHtml.push(this.entreprise.ville);
			}
			if (this.entreprise.codePostal || this.entreprise.ville) {
				lHtml.push("</div>");
			}
			if (this.entreprise.province) {
				lHtml.push("<div>", this.entreprise.province, "</div>");
			}
			if (this.entreprise.responsable) {
				lHtml.push(
					'<div class="m-top">',
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.RepresenteePar",
					),
					' <span class="semi-bold">',
					this.entreprise.responsable.getLibelle(),
					"</span>",
					"</div>",
				);
			}
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	initialiserListeEvaluation(aInstance) {
		DonneesListe_EvaluationAccueilStage_1.DonneesListe_EvaluationAccueilStage.init(
			aInstance,
		);
		aInstance.setOptionsListe({
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"questionnaireStage.AvisQualiteAccueil",
			),
		});
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("stage.comboStage"),
			avecTriListeElements: true,
			longueur: 160,
			initAutoSelectionAvecUnElement: false,
		});
		aInstance.setVisible(true);
	}
	valider() {
		new ObjetRequeteSaisieEvaluationAccueilStage_1.ObjetRequeteSaisieEvaluationAccueilStage(
			this,
			this.actionSurValidation,
		).lancerRequete({
			stage: this.stageCourant,
			observation: this.observation,
			listeQuestions: this.listeQuestions,
		});
	}
	afficherPage() {
		this.recupererDonnees();
	}
}
exports.InterfaceEvaluationAccueilStage = InterfaceEvaluationAccueilStage;

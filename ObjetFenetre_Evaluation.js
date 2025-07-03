exports.ObjetFenetre_Evaluation = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
require("IEHtml.InputNote.js");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const TypeNote_1 = require("TypeNote");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const DonneesListe_RelationEvaluationCompetence_1 = require("DonneesListe_RelationEvaluationCompetence");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_Competences_1 = require("ObjetFenetre_Competences");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const TypeModeAssociationDevoirEvaluation_1 = require("TypeModeAssociationDevoirEvaluation");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteOrdonnerListeCompetences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"OrdonnerListeCompetences",
	ObjetRequeteOrdonnerListeCompetences,
);
class ObjetFenetre_Evaluation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.objetParametresSco = this.appSco.getObjetParametres();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
		this.idIntitule = this.Nom + "_Intitule";
		this.idComboServiceLVE = this.Nom + "_ComboLVE";
		this.idSujet = this.Nom + "_Sujet";
		this.idCorrige = this.Nom + "_Corrige";
		this.idLabelDateValidation = this.Nom + "_DateValidation";
		this.idLabelDatePublication = this.Nom + "_DatePublication";
		this.idInfoPublicationDecaleeParents =
			this.Nom + "_InfoPublicationDecaleeParents";
		this.genreMenuContextSujet = { supprimerSujet: 1 };
		this.genreMenuContextCorrige = { supprimerCorrige: 1 };
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this._initialiserListeCompetences,
		);
		this.identFenetreCompetences = this.addFenetre(
			ObjetFenetre_Competences_1.ObjetFenetre_Competences,
			this.evenementSurFenetreCompetences,
			this.initialiserFenetreCompetences.bind(this),
		);
		this.identDateValidation = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDateValidation,
			this._initialiserDateValidation,
		);
		this.identDatePublication = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDatePublication,
			this._initialiserDatePublication,
		);
		this.identComboServiceLVE = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboServiceLVE,
			this._initialiserComboServiceLVE,
		);
		this.identComboPeriode = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPeriode,
			this._initialiserComboPeriode,
		);
		this.identComboPeriodeSecondaire = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPeriodeSecondaire,
			this._initialiserComboPeriodeSecondaire,
		);
		if (this.appSco.parametresUtilisateur.get("avecGestionDesThemes")) {
			this.identMultiSelectionTheme = this.add(
				ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
				this._evtCellMultiSelectionTheme.bind(this),
			);
		}
		this.identMenuContextSujet = this.add(
			ObjetMenuContextuel_1.ObjetMenuContextuel,
			this.evntMenuContextSujet,
			this.initMenuContextSujet,
		);
		this.identMenuContextCorrige = this.add(
			ObjetMenuContextuel_1.ObjetMenuContextuel,
			this.evntMenuContextCorrige,
			this.initMenuContextCorrige,
		);
	}
	_getIdCocheSujet() {
		return this.idSujet + "_coche";
	}
	_getIdCocheCorrige() {
		return this.idCorrige + "_coche";
	}
	_getIdTromboneSujet() {
		return this.idSujet + "_trombone";
	}
	_getIdTromboneCorrige() {
		return this.idCorrige + "_trombone";
	}
	initMenuContextSujet(aInstance) {
		aInstance.addCommande(
			this.genreMenuContextSujet.supprimerSujet,
			ObjetTraduction_1.GTraductions.getValeur("evaluations.CmdSupprimerSujet"),
		);
	}
	initMenuContextCorrige(aInstance) {
		aInstance.addCommande(
			this.genreMenuContextCorrige.supprimerCorrige,
			ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.CmdSupprimerCorrige",
			),
		);
	}
	evntMenuContextSujet(aLigne) {
		if (aLigne) {
			switch (aLigne.Numero) {
				case this.genreMenuContextSujet.supprimerSujet:
					this._supprimerSujet();
					break;
				default:
					break;
			}
		}
	}
	evntMenuContextCorrige(aLigne) {
		if (aLigne) {
			switch (aLigne.Numero) {
				case this.genreMenuContextCorrige.supprimerCorrige:
					this._supprimerCorrige();
					break;
				default:
					break;
			}
		}
	}
	surMenuContextSujet() {
		if (GNavigateur.isToucheMenuContextuel()) {
			GNavigateur.positionnerMenuContextuelSurId(
				this._getIdTromboneSujet(),
				0,
				0,
			);
		}
		this.getInstance(this.identMenuContextSujet).setDonnees();
	}
	surMenuContextCorrige() {
		if (GNavigateur.isToucheMenuContextuel()) {
			GNavigateur.positionnerMenuContextuelSurId(
				this._getIdTromboneCorrige(),
				0,
				0,
			);
		}
		this.getInstance(this.identMenuContextCorrige).setDonnees();
	}
	surDemandeSuppressionSujet() {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.MsgConfirmSupprSujet",
			),
			callback: this.surConfirmSuppressionSujet.bind(this),
		});
	}
	surConfirmSuppressionSujet(aGenreAction) {
		if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
			this._supprimerSujet();
			ObjetHtml_1.GHtml.setFocus(this._getIdTromboneSujet());
		} else {
			$("#" + this._getIdCocheSujet().escapeJQ()).inputChecked(true);
			ObjetHtml_1.GHtml.setFocus(this._getIdCocheSujet());
		}
	}
	_supprimerSujet() {
		this.evaluation.listeSujets
			.get(0)
			.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.actualiserSujet();
	}
	surDemandeSuppressionCorrige() {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.MsgConfirmSupprCorrige",
			),
			callback: this.surConfirmSuppressionCorrige.bind(this),
		});
	}
	surConfirmSuppressionCorrige(aGenreAction) {
		if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
			this._supprimerCorrige();
			ObjetHtml_1.GHtml.setFocus(this._getIdTromboneCorrige());
		} else {
			$("#" + this._getIdCocheCorrige().escapeJQ()).inputChecked(true);
			ObjetHtml_1.GHtml.setFocus(this._getIdCocheCorrige());
		}
	}
	_supprimerCorrige() {
		this.evaluation.listeCorriges
			.get(0)
			.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.actualiserCorrige();
	}
	actualiserSujet() {
		ObjetHtml_1.GHtml.setHtml(this.idSujet, this._composeSujet(), {
			instance: this,
		});
		if (!this.Actif || this.evaluation.verrouille) {
			$("#" + this._getIdCocheSujet().escapeJQ()).inputDisabled(true);
			$("#" + this._getIdTromboneSujet().escapeJQ()).off();
		} else {
			if (this._avecSujetEvaluation()) {
				$("#" + this._getIdCocheSujet().escapeJQ()).on(
					"click",
					{ aObjet: this },
					(event) => {
						event.data.aObjet.surDemandeSuppressionSujet();
					},
				);
				$("#" + this._getIdTromboneSujet().escapeJQ()).on(
					"contextmenu",
					{ aObjet: this },
					(event) => {
						event.stopImmediatePropagation();
						event.preventDefault();
						event.data.aObjet.surMenuContextSujet();
					},
				);
				$("#" + this._getIdTromboneSujet().escapeJQ()).on(
					"keyup",
					{ aObjet: this },
					(event) => {
						event.stopImmediatePropagation();
						event.preventDefault();
						if (GNavigateur.isToucheMenuContextuel()) {
							event.data.aObjet.surMenuContextSujet();
						}
					},
				);
			}
		}
	}
	actualiserCorrige() {
		ObjetHtml_1.GHtml.setHtml(this.idCorrige, this._composeCorrige(), {
			instance: this,
		});
		if (!this.Actif || this.evaluation.verrouille) {
			$("#" + this._getIdCocheCorrige().escapeJQ()).inputDisabled(true);
			$("#" + this._getIdTromboneCorrige().escapeJQ()).off();
		} else {
			if (this._avecCorrigeEvaluation()) {
				$("#" + this._getIdCocheCorrige().escapeJQ()).on(
					"click",
					{ aObjet: this },
					(event) => {
						event.data.aObjet.surDemandeSuppressionCorrige();
					},
				);
				$("#" + this._getIdTromboneCorrige().escapeJQ()).on(
					"contextmenu",
					{ aObjet: this },
					(event) => {
						event.stopImmediatePropagation();
						event.preventDefault();
						event.data.aObjet.surMenuContextCorrige();
					},
				);
				$("#" + this._getIdTromboneCorrige().escapeJQ()).on(
					"keyup",
					{ aObjet: this },
					(event) => {
						event.stopImmediatePropagation();
						event.preventDefault();
						if (GNavigateur.isToucheMenuContextuel()) {
							event.data.aObjet.surMenuContextCorrige();
						}
					},
				);
			}
		}
	}
	composeContenu() {
		const T = [];
		T.push(`<div class="flex-contain cols">`);
		T.push(this.composeEntete());
		T.push(
			`<div class="field-contain" id="${this.idComboServiceLVE}" style="display:none">\n              <label>${ObjetTraduction_1.GTraductions.getValeur("competences.ServiceLVE")}: </label>\n              <div id="${this.getNomInstance(this.identComboServiceLVE)}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain cols">`);
		T.push(
			`<div ie-display="panelDevoir.estVisible">${this._composePanelDevoir()}</div>`,
		);
		T.push(`</div>`);
		T.push(`</div>`);
		return T.join("");
	}
	composeEntete() {
		const T = [];
		const lWidthLabel = "6.5rem";
		T.push(
			`<div class="field-contain as-grid" style="--width-bloc: 8.5rem;">\n              <label id="${this.idLabelDateValidation}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.EvaluationDu")}</label>\n              <div id="${this.getNomInstance(this.identDateValidation)}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain flex-start">`);
		T.push(
			`<div class="fix-bloc field-contain as-grid" style="--width-bloc: 9rem;">`,
		);
		T.push(
			`<label id="${this.idLabelDatePublication}">${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.publieeLe")}</label>`,
		);
		T.push(
			`<div id="${this.getNomInstance(this.identDatePublication)}"></div>`,
		);
		T.push(`</div>`);
		T.push(`<div class="field-contain fluid-bloc">`);
		T.push(
			`<p class="message" id="${this.idInfoPublicationDecaleeParents}" ie-html="getHtmlInfoPublicationDecaleeParents"></p>`,
		);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(
			`<div class="flex-contain cols" style="max-width:100%;margin-left:9rem;">`,
		);
		T.push(
			`<div id="${this.idSujet}" class="field-contain selecfile evals"></div>`,
		);
		T.push(
			`<div id="${this.idCorrige}" class="field-contain selecfile evals"></div>`,
		);
		T.push(`</div>`);
		T.push(`<div class="field-contain flex-gap-l justify-between">`);
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label style="min-width: ${lWidthLabel};">${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.periode1")} : </label>`,
		);
		T.push(`<div id="${this.getNomInstance(this.identComboPeriode)}"></div>`);
		T.push(`</div>`);
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label>${ObjetTraduction_1.GTraductions.getValeur("evaluations.colonne.periode2")} : </label>`,
		);
		T.push(
			`<div id="${this.getNomInstance(this.identComboPeriodeSecondaire)}"></div>`,
		);
		T.push(`</div>`);
		const lIdCoeff = `${this.Nom}_inputcoefficient`;
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label for="${lIdCoeff}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>`,
		);
		T.push(`<div class="input-iconised flex-contain flex-center ">`);
		T.push(
			`<ie-inputnote ie-model="coefficient" id="${lIdCoeff}" class="m-right-l" style="width:5rem"></ie-inputnote>`,
		);
		T.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"btnMrFicheCoeff",
			),
		);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(`<div class="field-contain">`);
		T.push(
			`<label for="${this.idIntitule}" class="fix-bloc" style="min-width: ${lWidthLabel};">${ObjetTraduction_1.GTraductions.getValeur("competences.intitule")}: </label>`,
		);
		T.push(`<input id="${this.idIntitule}" class="full-width" />`);
		T.push(`</div>`);
		if (!!this.identMultiSelectionTheme) {
			T.push(`<div class="field-contain">`);
			T.push(
				`<label class="fix-bloc" style="min-width: ${lWidthLabel};">${ObjetTraduction_1.GTraductions.getValeur("Themes")}: </label>`,
			);
			T.push(
				`<div class="fluid-bloc constrained-bloc" id="${this.getNomInstance(this.identMultiSelectionTheme)}" ></div>`,
			);
			T.push(`</div>`);
		}
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("ie-textareamax", {
					class: "full-width",
					"ie-model": "descriptif",
					maxlength: "1000",
					style: "height:6rem;",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"competences.descriptif",
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"competences.descriptif",
					),
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.RedigezVotreCommentaire",
					),
				}),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain m-top-l m-bottom-xl" },
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model":
							this.jsxModeleCheckboxPrendreEnCompteEvalDansBilan.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreSaisieEvaluation.PrendreEnCompteEvalDansBilan",
					),
				),
			),
		);
		T.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				style: "min-height: 15rem",
				class: "field-contain  m-top-l",
			}),
		);
		return T.join("");
	}
	_avecSujetEvaluation() {
		return (
			this.evaluation.listeSujets &&
			this.evaluation.listeSujets.getNbrElementsExistes() > 0
		);
	}
	_avecCorrigeEvaluation() {
		return (
			this.evaluation.listeCorriges &&
			this.evaluation.listeCorriges.getNbrElementsExistes() > 0
		);
	}
	_composeSujet() {
		const lAvecSujet = this._avecSujetEvaluation();
		const lChecked = lAvecSujet ? "checked" : "";
		const H = [];
		const lIdCoche = this._getIdCocheSujet(),
			lAvecSelecFile = !this._avecSujetEvaluation();
		if (lAvecSelecFile) {
			const lModel = this.avecDepotCloud()
				? `ie-node="selectDocumentEvaluation('${TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationSujet}')"`
				: 'ie-model="selecFileSujet" ie-selecfile';
			H.push(
				`<div ${lModel} role="presentation" class="flex-contain fix-bloc">`,
			);
		}
		H.push(
			`<div class="label-contain">\n              <ie-checkbox tabindex="-1" ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: ObjetTraduction_1.GTraductions.getValeur("evaluations.avecLeSujet") })} id="${lIdCoche}" ${lChecked} class="AvecMain">${ObjetTraduction_1.GTraductions.getValeur("evaluations.avecLeSujet")}\n              </ie-checkbox>\n            </div>`,
		);
		if (lAvecSelecFile) {
			H.push(`</div>`);
		}
		H.push('<div class="chips-contain">');
		if (lAvecSujet) {
			H.push(
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.evaluation.listeSujets,
					{
						genreRessource:
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
								.EvaluationSujet,
					},
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeCorrige() {
		const lAvecCorrige = this._avecCorrigeEvaluation();
		const lChecked = lAvecCorrige ? "checked" : "";
		const H = [];
		const lIdCoche = this._getIdCocheCorrige(),
			lAvecSelecFile = !this._avecCorrigeEvaluation();
		if (lAvecSelecFile) {
			const lModel = this.avecDepotCloud()
				? `ie-node="selectDocumentEvaluation('${TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationCorrige}')"`
				: 'ie-model="selecFileCorrige" ie-selecfile';
			H.push(
				`<div ${lModel} role="presentation" class="flex-contain fix-bloc">`,
			);
		}
		H.push(
			`<div class="label-contain">`,
			`<ie-checkbox tabindex="-1" ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: ObjetTraduction_1.GTraductions.getValeur("evaluations.avecLeCorrige") })}  id="${lIdCoche}" ${lChecked}>`,
			ObjetTraduction_1.GTraductions.getValeur("evaluations.avecLeCorrige"),
			"</ie-checkbox>",
			"</div>",
		);
		if (lAvecSelecFile) {
			H.push("</div>");
		}
		H.push('<div class="chips-contain">');
		if (lAvecCorrige) {
			H.push(
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.evaluation.listeCorriges,
					{
						genreRessource:
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
								.EvaluationCorrige,
					},
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aEvaluation, aListeServicesLVE, aListePeriodes, aOptionsContexte) {
		this.evaluation = aEvaluation;
		this.avecSelectionPeriodeSecondaire =
			aOptionsContexte.avecSelectionPeriodeSecondaire;
		this.avecCreationNouvelleCompetence =
			aOptionsContexte.avecCreationNouvelleCompetence;
		this.avecDuplicationCompetence = aOptionsContexte.avecDuplicationCompetence;
		this.avecDoublonCompetencesInterdit =
			aOptionsContexte.avecDoublonCompetencesInterdit;
		this.listeReferentielsUniques = aOptionsContexte.listeReferentielsUniques;
		const lEvaluationAUnDevoir =
			!!this.evaluation &&
			!!this.evaluation.devoir &&
			![
				TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Aucun,
				TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Creation,
			].includes(this.evaluation.devoir.modeAssociation);
		const leDevoirEstVerrouille =
			!!this.evaluation &&
			!!this.evaluation.devoir &&
			this.evaluation.devoir.estVerrouille;
		const lEvaluationAUnePeriodeClotureePourLesDevoirs =
			ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
				this.evaluation,
			);
		if (
			lEvaluationAUnDevoir &&
			!leDevoirEstVerrouille &&
			!lEvaluationAUnePeriodeClotureePourLesDevoirs
		) {
			this.listePeriodes = aListePeriodes.getListeElements((D) => {
				return !D.estNotationCloturee;
			});
		} else {
			this.listePeriodes = aListePeriodes;
		}
		if (aListeServicesLVE) {
			this.listeServicesLVE = new ObjetListeElements_1.ObjetListeElements();
			this.listeServicesLVE.addElement(new ObjetElement_1.ObjetElement());
			for (let i = 0; i < aListeServicesLVE.count(); i++) {
				this.listeServicesLVE.addElement(aListeServicesLVE.get(i));
			}
		}
		this.afficher();
		this.actualiser(true);
		const lEnabledDonneesCommunesDevoirEval = !(
			lEvaluationAUnDevoir &&
			(leDevoirEstVerrouille || lEvaluationAUnePeriodeClotureePourLesDevoirs)
		);
		this.getInstance(this.identDateValidation).setActif(
			lEnabledDonneesCommunesDevoirEval,
		);
		this.getInstance(this.identDatePublication).setActif(
			lEnabledDonneesCommunesDevoirEval,
		);
		this.getInstance(this.identComboPeriode).setActif(
			lEnabledDonneesCommunesDevoirEval,
		);
		this.getInstance(this.identComboPeriodeSecondaire).setActif(
			lEnabledDonneesCommunesDevoirEval && this.avecSelectionPeriodeSecondaire,
		);
	}
	surValidation(aGenreBouton) {
		let lMessage;
		if (aGenreBouton === 1) {
			this.evaluation.Libelle = ObjetHtml_1.GHtml.getValue(
				this.idIntitule,
			).trim();
			this.evaluation.dateValidation = this.getInstance(
				this.identDateValidation,
			).getDate();
			this.evaluation.datePublication = this.getInstance(
				this.identDatePublication,
			).getDate();
			if (!this.evaluation.Libelle) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"competences.message.IntituleManquant",
				);
			} else if (
				this.evaluation.listeCompetences.getNbrElementsExistes() === 0
			) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"competences.message.CompetenceManquant",
				);
			} else if (
				this.listeServicesLVE &&
				!this.evaluation.serviceLVE &&
				this._existeCompetenceDePilierLVE()
			) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"competences.message.ServiceLVEManquant",
				);
			}
		}
		if (lMessage) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: lMessage,
			});
		} else {
			this.fermer();
			this.callback.appel(aGenreBouton, this.evaluation);
		}
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (!this.avecCreationNouvelleCompetence) {
					this._ouvrirFenetreChoixCompetenceDansReferentiel();
				}
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation: {
				const lPosition =
					this.evaluation.listeCompetences.getNbrElementsExistes();
				aParametres.article.Position = lPosition;
				aParametres.article.coefficient = 1;
				aParametres.article.relationESI = new ObjetElement_1.ObjetElement("");
				aParametres.article.relationESI.setEtat(
					Enumere_Etat_1.EGenreEtat.Creation,
				);
				this._actualiserListe();
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				this._ouvrirFenetreChoixCompetenceDansReferentiel();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne ===
					DonneesListe_RelationEvaluationCompetence_1
						.DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut
				) {
					const lArticleConcerne = aParametres.article;
					const lThis = this;
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: this,
						initCommandes: function (aInstance) {
							UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
								{
									instance: lThis,
									menuContextuel: aInstance,
									genreChoixValidationCompetence:
										TypeGenreValidationCompetence_1
											.TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
									callbackNiveau: (aNiveau) => {
										lThis._modifierNiveauMaitriseParDefaut(
											new ObjetListeElements_1.ObjetListeElements().addElement(
												lArticleConcerne,
											),
											aNiveau,
											aParametres.instance,
										);
									},
								},
							);
						},
					});
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				if (this.listeServicesLVE) {
					ObjetHtml_1.GHtml.setDisplay(
						this.idComboServiceLVE,
						this._existeCompetenceDePilierLVE(),
					);
				}
				break;
		}
	}
	evenementSurFenetreCompetences(aGenreBouton, aListeCompetencesDEvaluation) {
		if (aGenreBouton === 1) {
			const lListeOrigine = this.evaluation.listeCompetences;
			const lListeCompetences = new ObjetListeElements_1.ObjetListeElements();
			aListeCompetencesDEvaluation.parcourir((aElement) => {
				const lElementTrouve =
					ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
						lListeOrigine,
						aElement,
					);
				if (
					!lElementTrouve &&
					aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
				) {
					lListeCompetences.addElement(aElement);
				}
			});
			(lListeCompetences.count() > 1
				? new ObjetRequeteOrdonnerListeCompetences(this).lancerRequete({
						liste: lListeCompetences,
					})
				: Promise.resolve()
			).then((aJSONReponse) => {
				this.evaluation.listeCompetences = this._calculPositions(
					this.evaluation.listeCompetences,
					aListeCompetencesDEvaluation,
					aJSONReponse ? aJSONReponse.listeOrdonnee : lListeCompetences,
				);
				this.evaluation.listePaliers =
					new ObjetListeElements_1.ObjetListeElements();
				for (let i = 0; i < this.evaluation.listeCompetences.count(); i++) {
					if (this.evaluation.listeCompetences.existe(i)) {
						const lCompetence = this.evaluation.listeCompetences.get(i);
						const lPilier = lCompetence.pilier;
						if (lPilier) {
							const lPalier = lCompetence.pilier.palier;
							if (
								lPalier &&
								!this.evaluation.listePaliers.getElementParElement(lPalier)
							) {
								this.evaluation.listePaliers.addElement(lPalier);
							}
						}
					}
				}
				this.evaluation.listePaliers.trier();
				if (this.listeServicesLVE) {
					const lexisteCompetenceDePilierLVE =
						this._existeCompetenceDePilierLVE();
					ObjetHtml_1.GHtml.setDisplay(
						this.idComboServiceLVE,
						lexisteCompetenceDePilierLVE,
					);
					if (!lexisteCompetenceDePilierLVE) {
						this.evaluation.serviceLVE = null;
						this.getInstance(this.identComboServiceLVE).setSelectionParIndice(
							0,
						);
					}
				}
				this._actualiserListe();
			});
		}
	}
	evenementSurDateValidation(aDateValidation) {
		this.evaluation.dateValidation = aDateValidation;
		if (aDateValidation > this.evaluation.datePublication) {
			this.evaluation.datePublication = new Date(aDateValidation.getTime());
			this.getInstance(this.identDatePublication).setDonnees(
				this.evaluation.datePublication,
			);
		}
		this.getInstance(this.identDatePublication).setPremiereDateSaisissable(
			aDateValidation,
		);
		this.getInstance(this.identDateValidation).setDonnees(
			this.evaluation.dateValidation,
		);
	}
	evenementSurDatePublication(aDatePublication) {
		this.evaluation.datePublication = aDatePublication;
		this.getInstance(this.identDatePublication).setDonnees(
			this.evaluation.datePublication,
		);
	}
	evenementSurComboServiceLVE(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (!aParams.element.getNumero()) {
				delete this.evaluation.serviceLVE;
			} else {
				this.evaluation.serviceLVE = aParams.element;
			}
		}
	}
	evenementSurComboPeriode(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.evaluation.periode = aParams.element;
			if (!!aParams.element && aParams.element.estNotationCloturee) {
				this._controleSurSelectionPeriodeCloturee(
					this.evaluation,
					aParams.element,
				);
			}
			if (this.evaluation.periode && this.evaluation.periodeSecondaire) {
				if (
					this.evaluation.periodeSecondaire.getNumero() ===
					this.evaluation.periode.getNumero()
				) {
					this.evaluation.periodeSecondaire = new ObjetElement_1.ObjetElement(
						"",
					);
				}
			}
			if (!this.avecSelectionPeriodeSecondaire) {
				const lThis = this;
				if (!lThis.evaluation.periode.genresPeriodesOfficielles) {
					lThis.evaluation.periodeSecondaire = new ObjetElement_1.ObjetElement(
						"",
					);
				}
				this.listePeriodes.parcourir((aPeriode) => {
					if (
						lThis.evaluation.periode.genresPeriodesOfficielles &&
						lThis.evaluation.periode.genresPeriodesOfficielles.contains(
							aPeriode.genrePeriodeOfficielle,
						)
					) {
						lThis.evaluation.periodeSecondaire = aPeriode;
					}
				});
			}
			this.actualiserComboPeriodeSecondaire();
		}
	}
	evenementSurComboPeriodeSecondaire(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.evaluation.periodeSecondaire = aParams.element;
			if (!!aParams.element && aParams.element.estNotationCloturee) {
				this._controleSurSelectionPeriodeCloturee(
					this.evaluation,
					aParams.element,
				);
			}
		}
	}
	actualiser(aAvecListe) {
		let lIndiceSelection;
		if (this.evaluation) {
			ObjetHtml_1.GHtml.setValue(this.idIntitule, this.evaluation.getLibelle());
			this.getInstance(this.identDateValidation).setDonnees(
				this.evaluation.dateValidation,
			);
			this.getInstance(this.identDatePublication).setPremiereDateSaisissable(
				this.evaluation.dateValidation,
			);
			this.getInstance(this.identDatePublication).setDonnees(
				this.evaluation.datePublication,
			);
			if (!!this.identMultiSelectionTheme) {
				this.getInstance(this.identMultiSelectionTheme).setDonnees(
					this.evaluation.ListeThemes ||
						new ObjetListeElements_1.ObjetListeElements(),
					this.evaluation.matiere,
					this.evaluation.libelleCBTheme,
				);
			}
			if (this.listePeriodes) {
				lIndiceSelection = this.listePeriodes.getIndiceParNumeroEtGenre(
					this.evaluation.periode.getNumero(),
				);
				this.getInstance(this.identComboPeriode).setDonnees(
					this.listePeriodes,
					lIndiceSelection,
					false,
				);
			}
			this.actualiserSujet();
			this.actualiserCorrige();
			ObjetHtml_1.GHtml.setFocusEdit(this.idIntitule);
			if (aAvecListe) {
				this._actualiserListe();
			}
			if (this.listeServicesLVE) {
				lIndiceSelection = null;
				if (this.evaluation.serviceLVE) {
					lIndiceSelection = this.listeServicesLVE.getIndiceParNumeroEtGenre(
						this.evaluation.serviceLVE.getNumero(),
					);
				}
				ObjetHtml_1.GHtml.setDisplay(
					this.idComboServiceLVE,
					this._existeCompetenceDePilierLVE(),
				);
				this.getInstance(this.identComboServiceLVE).setDonnees(
					this.listeServicesLVE,
					lIndiceSelection,
					false,
				);
			}
		}
	}
	actualiserComboPeriodeSecondaire() {
		const lThis = this,
			lListePeriodesSecondaires = new ObjetListeElements_1.ObjetListeElements();
		lListePeriodesSecondaires.addElement(new ObjetElement_1.ObjetElement(""));
		this.listePeriodes.parcourir((aPeriode) => {
			if (aPeriode.getNumero() !== lThis.evaluation.periode.getNumero()) {
				lListePeriodesSecondaires.addElement(aPeriode);
			}
		});
		const lIndiceSelection =
			lListePeriodesSecondaires.getIndiceParNumeroEtGenre(
				this.evaluation.periodeSecondaire.getNumero(),
			);
		this.getInstance(this.identComboPeriodeSecondaire).setDonnees(
			lListePeriodesSecondaires,
			lIndiceSelection,
			false,
		);
		this.getInstance(this.identComboPeriodeSecondaire).setActif(
			this.avecSelectionPeriodeSecondaire,
		);
	}
	_existeCompetenceDePilierLVE() {
		let lExisteComptenceLVE = false;
		if (!!this.evaluation && !!this.evaluation.listeCompetences) {
			this.evaluation.listeCompetences.parcourir((D) => {
				if (D.existe() && !!D.pilier && !!D.pilier.PilierLVE) {
					lExisteComptenceLVE = true;
					return false;
				}
			});
		}
		return lExisteComptenceLVE;
	}
	avecDepotCloud() {
		return this.etatUtilSco.listeCloud.count() > 0;
	}
	actualiserDocument(aGenre, aDocument) {
		if (
			aGenre ===
			TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationSujet
		) {
			if (!this.evaluation.listeSujets) {
				this.evaluation.listeSujets =
					new ObjetListeElements_1.ObjetListeElements();
			}
			this.evaluation.listeSujets.addElement(aDocument, 0);
			this.evaluation.libelleSujet = aDocument.getLibelle();
			this.actualiserSujet();
		} else if (
			aGenre ===
			TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationCorrige
		) {
			if (!this.evaluation.listeCorriges) {
				this.evaluation.listeCorriges =
					new ObjetListeElements_1.ObjetListeElements();
			}
			this.evaluation.listeCorriges.addElement(aDocument, 0);
			this.evaluation.libelleCorrige = aDocument.getLibelle();
			this.actualiserCorrige();
		}
	}
	selecteurDocumentEvaluationActif(aGenre) {
		let lResult = this.Actif && this.evaluation && !this.evaluation.verrouille;
		if (lResult) {
			if (
				aGenre ===
				TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationSujet
			) {
				lResult = !this._avecSujetEvaluation();
			} else if (
				aGenre ===
				TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationCorrige
			) {
				lResult = !this._avecCorrigeEvaluation();
			}
		}
		return lResult;
	}
	ouvrirPJCloud(aParams) {
		const lThis = this;
		const lParamsDonnees = Object.assign(
			{
				instance: lThis,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				callback: null,
			},
			aParams,
		);
		let lParams = {
			callbaskEvenement: (aLigne) => {
				if (aLigne >= 0) {
					lParamsDonnees.service = this.etatUtilSco.listeCloud.get(aLigne);
					lThis.choisirFichierCloud(lParamsDonnees);
				}
			},
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.Cloud,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	ouvrirPJCloudENEJ(aParams) {
		const lParamsDonnees = Object.assign(
			{
				instance: this,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				callback: null,
				service: this.etatUtilSco.getCloudENEJ(),
			},
			aParams,
		);
		this.choisirFichierCloud(lParamsDonnees);
	}
	choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				callback: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				{
					pere: lParams.instance,
					evenement: function (aParam) {
						if (
							aParam.listeNouveauxDocs &&
							aParam.listeNouveauxDocs.count() === 1
						) {
							const lElement = aParam.listeNouveauxDocs.get(0);
							if (lParams.callback) {
								lParams.callback.call(
									lParams.instance,
									lParams.genre,
									lElement,
								);
							}
							aResolve(true);
						}
					},
					initialiser(aFenetre) {
						aFenetre.setOptionsFenetre({
							callbackApresFermer() {
								aResolve();
							},
						});
					},
				},
			).setDonnees({ service: lParams.service.Genre });
		});
	}
	jsxModeleCheckboxCreerDevoir() {
		return {
			getValue: () => {
				return (
					!!this.evaluation &&
					!!this.evaluation.devoir &&
					this.evaluation.devoir.modeAssociation ===
						TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
							.tMIADE_Creation
				);
			},
			setValue: (aValue) => {
				if (!!this.evaluation) {
					if (aValue) {
						if (!this.evaluation.devoir) {
							this.evaluation.devoir = new ObjetElement_1.ObjetElement();
							this.evaluation.devoir.coefficient = new TypeNote_1.TypeNote(1);
							this.evaluation.devoir.bareme =
								this.evaluation.baremeDevoirParDefaut;
							this.evaluation.devoir.serviceDevoir =
								!!this.evaluation.servicesDevoir &&
								this.evaluation.servicesDevoir.count() > 0
									? this.evaluation.servicesDevoir.getPremierElement()
									: null;
						}
						this.evaluation.devoir.modeAssociation =
							TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Creation;
						this.evaluation.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					} else {
						if (!!this.evaluation.devoir) {
							this.evaluation.devoir.modeAssociation =
								TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Aucun;
							this.evaluation.devoir.setEtat(
								Enumere_Etat_1.EGenreEtat.Suppression,
							);
						}
					}
				}
			},
			getDisabled: () => {
				return (
					!this.evaluation ||
					ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
						this.evaluation,
					) ||
					(!!this.evaluation.saisieDevoirsSurSousServices &&
						(!this.evaluation.servicesDevoir ||
							this.evaluation.servicesDevoir.count() === 0))
				);
			},
		};
	}
	jsxModeleCheckboxDevoirRamenerSurVingt() {
		return {
			getValue: () => {
				return !!this.evaluation && !!this.evaluation.devoir
					? this.evaluation.devoir.ramenerSur20
					: false;
			},
			setValue: (aValue) => {
				if (!!this.evaluation && !!this.evaluation.devoir) {
					this.evaluation.devoir.ramenerSur20 = aValue;
					this.evaluation.devoir.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			},
			getDisabled: () => {
				let lBaremeDevoirEstBaremeParDefaut = true;
				if (
					!!this.evaluation &&
					!!this.evaluation.devoir &&
					!!this.evaluation.devoir.bareme &&
					!!this.evaluation.baremeDevoirDuService
				) {
					lBaremeDevoirEstBaremeParDefaut =
						this.evaluation.devoir.bareme.getValeur() ===
						this.evaluation.baremeDevoirDuService.getValeur();
				}
				return (
					!this.valeursDevoirSontModifiables() ||
					lBaremeDevoirEstBaremeParDefaut
				);
			},
		};
	}
	jsxGetTexteDevoirRamenerSurVingt() {
		let lParams;
		if (!!this.evaluation && !!this.evaluation.baremeDevoirDuService) {
			lParams = [this.evaluation.baremeDevoirDuService.getValeur()];
		}
		return ObjetTraduction_1.GTraductions.getValeur(
			"FenetreDevoir.Ramenersur20",
			lParams,
		);
	}
	jsxModeleCheckboxDevoirFacultatif() {
		return {
			getValue: () => {
				return this.estDevoirFacultatif();
			},
			setValue: (aValue) => {
				if (!!this.evaluation && !!this.evaluation.devoir) {
					this.evaluation.devoir.commeUnBonus = false;
					this.evaluation.devoir.commeUneNote = false;
					if (!!this.evaluation && !!this.evaluation.devoir) {
						this.evaluation.devoir.commeUnBonus = aValue;
					}
					this.evaluation.devoir.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			},
			getDisabled: () => {
				return !this.valeursDevoirSontModifiables();
			},
		};
	}
	jsxModeleCheckboxPrendreEnCompteEvalDansBilan() {
		return {
			getValue: () => {
				return !!this.evaluation
					? this.evaluation.priseEnCompteDansBilan
					: false;
			},
			setValue: (aValue) => {
				if (!!this.evaluation) {
					this.evaluation.priseEnCompteDansBilan = aValue;
				}
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			panelDevoir: {
				estVisible: function () {
					return (
						!!aInstance.evaluation && !!aInstance.evaluation.avecDevoirPossible
					);
				},
				getHintPanelCreationModification: function () {
					if (
						ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
							aInstance.evaluation,
						)
					) {
						let lPeriodeCloturee;
						if (
							!!aInstance.evaluation.periodeSecondaire &&
							aInstance.evaluation.periodeSecondaire.estNotationCloturee
						) {
							lPeriodeCloturee = aInstance.evaluation.periodeSecondaire;
						} else if (
							!!aInstance.evaluation.periode &&
							aInstance.evaluation.periode.estNotationCloturee
						) {
							lPeriodeCloturee = aInstance.evaluation.periode;
						}
						let lHint = ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.ImpossibleDeCreerDevoir",
						);
						if (!!lPeriodeCloturee) {
							lHint +=
								" : " +
								ObjetTraduction_1.GTraductions.getValeur(
									"evaluations.FenetreSaisieEvaluation.PeriodeClotureePourLeDevoir",
									[lPeriodeCloturee.getLibelle()],
								);
						}
						return lHint;
					} else if (
						aInstance.evaluation.saisieDevoirsSurSousServices &&
						(!aInstance.evaluation.servicesDevoir ||
							aInstance.evaluation.servicesDevoir.count() === 0)
					) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.AucunSousServicePourLeDevoir",
						);
					}
					return "";
				},
				panelCreationVisible: function () {
					return aInstance.panelCreationVisible();
				},
				panelModificationVisible: function () {
					return !!aInstance.evaluation && !aInstance.panelCreationVisible();
				},
				avecServiceDevoirVisible: function () {
					return (
						!!aInstance.evaluation &&
						!!aInstance.evaluation.saisieDevoirsSurSousServices
					);
				},
				estDevoirFacultatif: function () {
					return aInstance.estDevoirFacultatif();
				},
				radioModeAssociation: {
					getValue: function (aMode) {
						return !!aInstance.evaluation && !!aInstance.evaluation.devoir
							? aInstance.evaluation.devoir.modeAssociation === aMode
							: false;
					},
					setValue: function (aMode) {
						if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
							aInstance.evaluation.devoir.modeAssociation = aMode;
							aInstance.evaluation.devoir.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					},
					getDisabled: function () {
						return !aInstance.evaluation || !aInstance.leDevoirEstEditable();
					},
				},
				comboService: {
					init: function (aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: 250,
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.SousMatiere",
							),
						});
					},
					getDonnees: function () {
						return !!aInstance.evaluation
							? aInstance.evaluation.servicesDevoir
							: null;
					},
					getIndiceSelection: function () {
						let result = 0;
						if (
							!!aInstance.evaluation &&
							!!aInstance.evaluation.devoir &&
							!!aInstance.evaluation.servicesDevoir &&
							!!aInstance.evaluation.devoir.serviceDevoir
						) {
							result = aInstance.evaluation.servicesDevoir.getIndiceParElement(
								aInstance.evaluation.devoir.serviceDevoir,
							);
						}
						return result;
					},
					getLibelle: function (aInstanceCombo) {
						let result = "";
						if (
							!!aInstance.evaluation &&
							!!aInstance.evaluation.servicesDevoir &&
							aInstance.evaluation.servicesDevoir.count() > 0
						) {
							result = aInstanceCombo.getContenu();
						}
						return result;
					},
					event: function (aParametres, aInstanceCombo) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
								aInstance.evaluation.devoir.serviceDevoir = aParametres.element;
								aInstance.evaluation.devoir.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							}
						}
					},
					getDisabled: function () {
						return (
							!aInstance.leDevoirEstEditable() ||
							aInstance.evaluation.devoir.modeAssociation !==
								TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
									.tMIADE_Creation ||
							!aInstance.evaluation.servicesDevoir ||
							aInstance.evaluation.servicesDevoir.count() <= 1
						);
					},
				},
				inputCoefficient: {
					getNote: function () {
						return !!aInstance.evaluation && !!aInstance.evaluation.devoir
							? aInstance.evaluation.devoir.coefficient
							: null;
					},
					setNote: function (aValue) {
						if (
							!aValue.estUneNoteVide() &&
							!!aInstance.evaluation &&
							!!aInstance.evaluation.devoir
						) {
							aInstance.evaluation.devoir.coefficient = aValue;
							aInstance.evaluation.devoir.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					},
					getOptionsNote: function () {
						return {
							hintSurErreur: true,
							avecAnnotation: false,
							sansNotePossible: false,
							min: 0,
							max: 99,
						};
					},
					getDisabled: function () {
						return !aInstance.valeursDevoirSontModifiables();
					},
				},
				inputBareme: {
					getNote: function () {
						return !!aInstance.evaluation && !!aInstance.evaluation.devoir
							? aInstance.evaluation.devoir.bareme
							: null;
					},
					setNote: function (aValue) {
						if (
							!aValue.estUneNoteVide() &&
							!!aInstance.evaluation &&
							!!aInstance.evaluation.devoir
						) {
							aInstance.evaluation.devoir.bareme = aValue;
							aInstance.evaluation.devoir.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					},
					getOptionsNote: function () {
						return {
							avecVirgule: true,
							afficherAvecVirgule: false,
							hintSurErreur: true,
							avecAnnotation: false,
							sansNotePossible: false,
							min: 1,
							max: aInstance.moteurNotesCP.getBaremeDevoirMaximal(),
						};
					},
					getDisabled: function () {
						return !aInstance.valeursDevoirSontModifiables();
					},
				},
				btnMrFicheBareme: {
					event() {
						GApplication.getMessage().afficher({
							idRessource: "FenetreDevoir.MFicheBaremeDifferentDe20",
						});
					},
					getTitle() {
						return ObjetTraduction_1.GTraductions.getTitreMFiche(
							"FenetreDevoir.MFicheBaremeDifferentDe20",
						);
					},
				},
				comboGenreFacultatif: {
					init: function (aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: 120,
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.Facultatif",
							),
						});
					},
					getDonnees: function (aDonnees) {
						if (aDonnees) {
							return;
						}
						const lListeGenresFacultatif =
							new ObjetListeElements_1.ObjetListeElements();
						lListeGenresFacultatif.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.CommeUnBonus",
								),
								null,
								0,
							),
						);
						lListeGenresFacultatif.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.CommeUneNote",
								),
								null,
								1,
							),
						);
						return lListeGenresFacultatif;
					},
					getIndiceSelection: function () {
						let result = 0;
						if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
							result = aInstance.evaluation.devoir.commeUneNote ? 1 : 0;
						}
						return result;
					},
					event: function (aParametres, aInstanceCombo) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
								const lGenreSelected = aParametres.element.getGenre();
								aInstance.evaluation.devoir.commeUnBonus = lGenreSelected === 0;
								aInstance.evaluation.devoir.commeUneNote = lGenreSelected === 1;
								aInstance.evaluation.devoir.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							}
						}
					},
					getDisabled: function () {
						return (
							!aInstance.valeursDevoirSontModifiables() ||
							!aInstance.estDevoirFacultatif()
						);
					},
				},
				btnMrFicheDevoirFacultatif: {
					event() {
						GApplication.getMessage().afficher({
							idRessource: "FenetreDevoir.MFicheDevoirFacultatif",
						});
					},
					getTitle() {
						return ObjetTraduction_1.GTraductions.getTitreMFiche(
							"FenetreDevoir.MFicheDevoirFacultatif",
						);
					},
				},
			},
			selectDocumentEvaluation: function (aGenre) {
				$(this.node).eventValidation((aEvent) => {
					const lThis = aInstance;
					if (lThis.selecteurDocumentEvaluationActif(aGenre)) {
						const lTabActions = [];
						lTabActions.push({
							libelle: IE.estMobile
								? ObjetTraduction_1.GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMonPoste",
									),
							icon: "icon_folder_open",
							selecFile: true,
							optionsSelecFile: {
								maxSize: aInstance.appSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
								),
							},
							event(aParamsInput) {
								if (aParamsInput) {
									lThis.actualiserDocument(aGenre, aParamsInput.eltFichier);
								}
							},
							class: "bg-orange-claire",
						});
						const lAvecCloud = GEtatUtilisateur.listeCloud.count() > 0;
						if (lAvecCloud) {
							const lParams = {
								genre: aGenre,
								callback: lThis.actualiserDocument,
							};
							lTabActions.push({
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"fenetre_ActionContextuelle.depuisMonCloud",
								),
								icon: "icon_cloud",
								event: function () {
									lThis.ouvrirPJCloud(lParams);
								}.bind(this),
								class: "bg-orange-claire",
							});
							if (aInstance.etatUtilSco.avecCloudENEJDisponible()) {
								const lActionENEJ =
									ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
										() => aInstance.ouvrirPJCloudENEJ(lParams),
									);
								if (lActionENEJ) {
									lTabActions.push(lActionENEJ);
								}
							}
						}
						ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
							lTabActions,
							{ pere: lThis },
						);
						aEvent.stopImmediatePropagation();
						aEvent.preventDefault();
					}
				});
			},
			selecFileSujet: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.appSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					if (!aInstance.evaluation.listeSujets) {
						aInstance.evaluation.listeSujets =
							new ObjetListeElements_1.ObjetListeElements();
					}
					aInstance.evaluation.listeSujets.addElement(aParams.eltFichier, 0);
					aInstance.evaluation.libelleSujet = aParams.eltFichier.getLibelle();
					aInstance.actualiserSujet();
				},
			},
			selecFileCorrige: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.appSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					if (!aInstance.evaluation.listeCorriges) {
						aInstance.evaluation.listeCorriges =
							new ObjetListeElements_1.ObjetListeElements();
					}
					aInstance.evaluation.listeCorriges.addElement(aParams.eltFichier, 0);
					aInstance.evaluation.libelleCorrige = aParams.eltFichier.getLibelle();
					aInstance.actualiserCorrige();
				},
			},
			descriptif: {
				getValue: function () {
					return aInstance.evaluation ? aInstance.evaluation.descriptif : "";
				},
				setValue: function (aValue) {
					aInstance.evaluation.descriptif = aValue;
				},
			},
			coefficient: {
				getNote: function () {
					return aInstance.evaluation
						? new TypeNote_1.TypeNote(aInstance.evaluation.coefficient)
						: null;
				},
				setNote: function (aValue) {
					if (!aValue.estUneNoteVide()) {
						aInstance.evaluation.coefficient = aValue.getValeur();
					}
				},
				getOptionsNote: function () {
					return {
						avecVirgule: false,
						afficherAvecVirgule: false,
						hintSurErreur: true,
						listeAnnotations: [],
						sansNotePossible: false,
						max: function () {
							let lMax = 100;
							if (
								!!aInstance.evaluation &&
								!!aInstance.evaluation.listeCompetences
							) {
								aInstance.evaluation.listeCompetences.parcourir(
									(aCompetence) => {
										if (
											!!aCompetence &&
											aCompetence.coefficient !== undefined &&
												aCompetence.coefficient !== null &&
											aCompetence.coefficient > 1
										) {
											lMax = 1;
											return false;
										}
									},
								);
							}
							return lMax;
						},
					};
				},
			},
			btnMrFicheCoeff: {
				event() {
					GApplication.getMessage().afficher({
						idRessource: "FenetreEvaluation.MFicheCoefficientSurEvaluation",
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(
						"FenetreEvaluation.MFicheCoefficientSurEvaluation",
					);
				},
			},
			getHtmlInfoPublicationDecaleeParents() {
				let lMessageDateDecaleeAuxParents = "";
				if (
					aInstance.evaluation &&
					aInstance.objetParametresSco
						.avecAffichageDecalagePublicationEvalsAuxParents &&
					!!aInstance.objetParametresSco.nbJDecalagePublicationAuxParents
				) {
					let lDatePublicationDecalee = ObjetDate_1.GDate.formatDate(
						ObjetDate_1.GDate.getJourSuivant(
							aInstance.evaluation.datePublication,
							aInstance.objetParametresSco.nbJDecalagePublicationAuxParents,
						),
						" %JJ/%MM",
					);
					if (
						aInstance.objetParametresSco.nbJDecalagePublicationAuxParents === 1
					) {
						lMessageDateDecaleeAuxParents =
							ObjetTraduction_1.GTraductions.getValeur(
								"evaluations.FenetreSaisieEvaluation.DecalageUnJourPublicationParentsSoitLe",
								[lDatePublicationDecalee],
							);
					} else {
						lMessageDateDecaleeAuxParents =
							ObjetTraduction_1.GTraductions.getValeur(
								"evaluations.FenetreSaisieEvaluation.DecalageXJoursPublicationParentsSoitLe",
								[
									aInstance.objetParametresSco.nbJDecalagePublicationAuxParents,
									lDatePublicationDecalee,
								],
							);
					}
				}
				return lMessageDateDecaleeAuxParents;
			},
		});
	}
	panelCreationVisible() {
		return (
			!!this.evaluation &&
			(!this.evaluation.devoir ||
				this.evaluation.devoir.modeAssociation ===
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Aucun ||
				this.evaluation.devoir.modeAssociation ===
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
						.tMIADE_Creation)
		);
	}
	estDevoirFacultatif() {
		return !!this.evaluation && !!this.evaluation.devoir
			? this.evaluation.devoir.commeUnBonus ||
					this.evaluation.devoir.commeUneNote
			: false;
	}
	valeursDevoirSontModifiables() {
		return (
			!!this.evaluation &&
			!!this.evaluation.devoir &&
			(this.evaluation.devoir.modeAssociation ===
				TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
					.tMIADE_Creation ||
				this.evaluation.devoir.modeAssociation ===
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
						.tMIADE_Modification) &&
			this.leDevoirEstEditable()
		);
	}
	leDevoirEstEditable() {
		return (
			!!this.evaluation &&
			!!this.evaluation.devoir &&
			!this.evaluation.devoir.estVerrouille &&
			!this.evaluation.devoir.estCloture
		);
	}
	_getTriListe() {
		return [ObjetTri_1.ObjetTri.init("Position")];
	}
	_getValeurMaxCoefficientCompetence() {
		let lMaxCoefficientCompetence = 100;
		if (
			!!this.evaluation &&
			this.evaluation.coefficient !== undefined &&
				this.evaluation.coefficient !== null &&
			this.evaluation.coefficient > 1
		) {
			lMaxCoefficientCompetence = 1;
		}
		return lMaxCoefficientCompetence;
	}
	_dupliquerCompetence(aCompetence) {
		if (
			!!aCompetence &&
			!!this.evaluation &&
			!!this.evaluation.listeCompetences
		) {
			const lCompetenceDupliquee =
				MethodesObjet_1.MethodesObjet.dupliquer(aCompetence);
			lCompetenceDupliquee.relationESI = new ObjetElement_1.ObjetElement("");
			lCompetenceDupliquee.relationESI.setEtat(
				Enumere_Etat_1.EGenreEtat.Creation,
			);
			lCompetenceDupliquee.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			lCompetenceDupliquee.Position =
				this.evaluation.listeCompetences.getNbrElementsExistes() + 1;
			this.evaluation.listeCompetences.addElement(lCompetenceDupliquee);
		}
	}
	_actualiserListe() {
		this.evaluation.listeCompetences.setTri(this._getTriListe()).trier();
		const lDonneesListe =
			new DonneesListe_RelationEvaluationCompetence_1.DonneesListe_RelationEvaluationCompetence(
				this.evaluation.listeCompetences,
				{
					avecCreationNouvelleCompetence: this.avecCreationNouvelleCompetence,
					callbackAppliquerOrdreGrille: this._appliquerTriParDefaut.bind(this),
					callbackChoixCompetenceDansReferentiel:
						this._ouvrirFenetreChoixCompetenceDansReferentiel.bind(this),
					callbackDupliquerCompetence: this.avecDuplicationCompetence
						? this._dupliquerCompetence.bind(this)
						: null,
					callbackModifierNiveauMaitriseDefaut:
						this._modifierNiveauMaitriseParDefaut,
					funcGetValeurMaxCoefficientCompetence:
						this._getValeurMaxCoefficientCompetence.bind(this),
					listeReferentielsUniques: this.listeReferentielsUniques,
				},
			);
		this.getInstance(this.identListe).setDonnees(lDonneesListe);
	}
	_appliquerTriParDefaut() {
		const lListeCompetences = this.evaluation.listeCompetences
			.getListeElements((aElement) => {
				return aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression;
			})
			.setSerialisateurJSON({ ignorerEtatsElements: true });
		if (lListeCompetences.count() < 2) {
			return;
		}
		new ObjetRequeteOrdonnerListeCompetences(this)
			.lancerRequete({ liste: lListeCompetences })
			.then((aJSONReponse) => {
				let lPosition = 1;
				const lNumeroElementTraites = [];
				aJSONReponse.listeOrdonnee.parcourir((aElementOrdonne) => {
					if (
						lNumeroElementTraites.indexOf(aElementOrdonne.getNumero()) === -1
					) {
						lNumeroElementTraites.push(aElementOrdonne.getNumero());
						this.evaluation.listeCompetences.parcourir(
							(aElementDEvaluation) => {
								if (
									aElementDEvaluation.getNumero() ===
									aElementOrdonne.getNumero()
								) {
									if (aElementDEvaluation.Position !== lPosition) {
										aElementDEvaluation.Position = lPosition;
										aElementDEvaluation.setEtat(
											Enumere_Etat_1.EGenreEtat.Modification,
										);
									}
									lPosition++;
								}
							},
						);
					}
				});
				this._actualiserListe();
			});
	}
	_initialiserListeCompetences(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RelationEvaluationCompetence_1
				.DonneesListe_RelationEvaluationCompetence.colonnes.code,
			taille: 40,
			titre: ObjetTraduction_1.GTraductions.getValeur("Code"),
		});
		lColonnes.push({
			id: DonneesListe_RelationEvaluationCompetence_1
				.DonneesListe_RelationEvaluationCompetence.colonnes.intitule,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.competencesConnaissancesEvaluees",
			),
		});
		lColonnes.push({
			id: DonneesListe_RelationEvaluationCompetence_1
				.DonneesListe_RelationEvaluationCompetence.colonnes.coefficient,
			taille: 40,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.colonne.coef",
			),
		});
		lColonnes.push({
			id: DonneesListe_RelationEvaluationCompetence_1
				.DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut,
			taille: 40,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.niveauParDefautAbr",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"competences.niveauParDefaut",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 150,
			hauteurZoneContenuListeMin: 40,
			listeCreations: 0,
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"competences.ajouterRelationsAEvaluation",
			),
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.monter },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.descendre },
			],
		});
	}
	initialiserFenetreCompetences(aInstance) {
		let lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"competences.choixCompetencesConnaissancesAEvaluer",
		);
		if (
			this.etatUtilSco.pourPrimaire() &&
			this.listeReferentielsUniques &&
			this.listeReferentielsUniques.count() > 0
		) {
			let lPremierReferentielUnique = this.listeReferentielsUniques.get(0);
			if (lPremierReferentielUnique) {
				lTitre = lPremierReferentielUnique.getLibelle() + " - " + lTitre;
			}
		}
		aInstance.setOptionsFenetre({
			modale: true,
			titre: lTitre,
			largeur: 620,
			hauteur: 420,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_initialiserDateValidation(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			ariaLabelledBy: this.idLabelDateValidation,
		});
	}
	_initialiserDatePublication(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			ariaLabelledBy: this.idLabelDatePublication,
			ariaDescribedBy: this.idInfoPublicationDecaleeParents,
		});
	}
	_initialiserComboServiceLVE(aInstance) {
		aInstance.setOptionsObjetSaisie({
			avecTriListeElements: false,
			longueur: 250,
			forcerBoutonDeploiement: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionCategorie",
			),
		});
	}
	_initialiserComboPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({
			avecTriListeElements: false,
			longueur: 100,
			forcerBoutonDeploiement: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionCategorie",
			),
		});
	}
	_initialiserComboPeriodeSecondaire(aInstance) {
		aInstance.setOptionsObjetSaisie({
			avecTriListeElements: false,
			longueur: 100,
			forcerBoutonDeploiement: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionCategorie",
			),
		});
	}
	_composePanelDevoir() {
		const T = [];
		T.push(
			'<div class="flex-contain cols top-line" ie-display="panelDevoir.panelCreationVisible" ie-hint="panelDevoir.getHintPanelCreationModification">',
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"ie-checkbox",
					{
						style: "margin-right:.4rem",
						"ie-model": this.jsxModeleCheckboxCreerDevoir.bind(this),
					},
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADEUtil.getLibelle(
						TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
							.tMIADE_Creation,
					),
				),
			),
		);
		T.push(
			`<div ie-display="panelDevoir.panelModificationVisible" class="flex-contain cols m-left-xxl">`,
		);
		T.push(
			`<label class="m-bottom-l">${ObjetTraduction_1.GTraductions.getValeur("evaluations.FenetreSaisieEvaluation.DevoirDeLEvaluation")}</label>`,
		);
		T.push(`<div class="field-contain">`);
		T.push(
			`<ie-radio ie-model="panelDevoir.radioModeAssociation(${TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_SuppressionD})">${TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADEUtil.getLibelle(TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_SuppressionD)}</ie-radio>`,
		);
		T.push(`</div>`);
		T.push(`<div class="field-contain">`);
		T.push(
			`<ie-radio ie-model="panelDevoir.radioModeAssociation(${TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Modification})">${TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADEUtil.getLibelle(TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Modification)}</ie-radio>`,
		);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(`<div class="flex-contain cols m-left-xxl">`);
		T.push(
			`<div ie-display="panelDevoir.avecServiceDevoirVisible" class="field-contain">`,
		);
		T.push(
			`<label class="ie-titre-petit" style="width:8.2rem;">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.SousMatiere")}</label>`,
		);
		T.push(`<ie-combo ie-model="panelDevoir.comboService"></ie-combo>`);
		T.push(`</div>`);
		T.push(`<div class="field-contain">`);
		const lIdCoeffBareme = `${this.Nom}_devoir_inputBareme`;
		T.push(`<div class="flex-contain flex-center m-right-l">`);
		T.push(
			`<label class="ie-titre-petit" style="width:8.2rem;" for="${lIdCoeffBareme}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Bareme")}</label>`,
		);
		T.push(
			`<ie-inputnote ie-model="panelDevoir.inputBareme" id="${lIdCoeffBareme}" style="width:5rem;" ></ie-inputnote>`,
		);
		T.push(`</div>`);
		const lIdCoeff = `${this.Nom}_devoir_inputCoefficient`;
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label class="ie-titre-petit" for="${lIdCoeff}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>`,
		);
		T.push(
			`<ie-inputnote ie-model="panelDevoir.inputCoefficient" id="${lIdCoeff}" style="width:50px;" class="m-right-l"></ie-inputnote>`,
		);
		T.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"panelDevoir.btnMrFicheBareme",
			),
		);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("ie-checkbox", {
					"ie-model": this.jsxModeleCheckboxDevoirRamenerSurVingt.bind(this),
					"ie-texte": this.jsxGetTexteDevoirRamenerSurVingt.bind(this),
				}),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "m-right-l",
						"ie-model": this.jsxModeleCheckboxDevoirFacultatif.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Facultatif"),
				),
				IE.jsx.str("ie-combo", {
					"ie-model": "panelDevoir.comboGenreFacultatif",
					class: "m-right-l",
				}),
				UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
					"panelDevoir.btnMrFicheDevoirFacultatif",
				),
			),
		);
		T.push(`</div>`);
		T.push(`</div>`);
		return T.join("");
	}
	_modifierNiveauMaitriseParDefaut(aCompetences, aNiveau, aInstanceListe) {
		aCompetences.parcourir((aArticle) => {
			aArticle.niveauAcquiDefaut = aNiveau;
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		});
		aInstanceListe.actualiser({ conserverSelection: true });
	}
	_ouvrirFenetreChoixCompetenceDansReferentiel() {
		const lService = this.evaluation.service
			? this.evaluation.service
			: this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Service,
				);
		const lClasse = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		this.getInstance(this.identFenetreCompetences).setDonnees({
			listeCompetences: MethodesObjet_1.MethodesObjet.dupliquer(
				this.evaluation.listeCompetences,
			),
			service: lService,
			classe: lClasse,
			optionsContexte: {
				listeReferentielsUniques: this.listeReferentielsUniques,
				avecDoublonCompetencesInterdit: this.avecDoublonCompetencesInterdit,
			},
		});
	}
	_calculPositions(aListeOrigine, aListeModifiee, aListeOrdonneeAjout) {
		let lNbAnciens = 0;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		aListeModifiee.setTri(this._getTriListe());
		aListeModifiee
			.parcourir((aElement) => {
				if (aElement.existe() && aElement.relationESI) {
					const lElementTrouve =
						ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
							aListeOrigine,
							aElement,
						);
					if (lElementTrouve) {
						lNbAnciens += 1;
						aElement.Position = lElementTrouve.Position;
						lListe.addElement(aElement);
					}
				}
			})
			.trier();
		lListe.parcourir((aElement, aIndex) => {
			aElement.Position = aElement.existe() ? aIndex + 1 : null;
		});
		aListeModifiee.trier();
		if (aListeOrdonneeAjout) {
			let lNbAjout = 0;
			aListeOrdonneeAjout.parcourir((aElementOrdonne) => {
				aListeModifiee.parcourir((aElementDeListeModifiee) => {
					if (
						aElementDeListeModifiee.existe() &&
						aElementDeListeModifiee.getNumero() ===
							aElementOrdonne.getNumero() &&
						!aElementDeListeModifiee.Position
					) {
						aElementDeListeModifiee.Position = lNbAnciens + lNbAjout + 1;
						lNbAjout += 1;
					}
				});
			});
			aListeModifiee.trier();
		}
		return aListeModifiee;
	}
	_controleSurSelectionPeriodeCloturee(aEvaluation, aPeriodeCloturee) {
		if (!!aEvaluation && !!aPeriodeCloturee) {
			if (
				!!aEvaluation.devoir &&
				aEvaluation.devoir.modeAssociation ===
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Creation
			) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreSaisieEvaluation.ImpossibleDeCreerDevoir",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreSaisieEvaluation.PeriodeClotureePourLeDevoir",
						[aPeriodeCloturee.getLibelle()],
					),
				});
				aEvaluation.devoir.modeAssociation =
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Aucun;
			}
		}
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.evaluation.ListeThemes = aListeSelections;
			this.evaluation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
}
exports.ObjetFenetre_Evaluation = ObjetFenetre_Evaluation;

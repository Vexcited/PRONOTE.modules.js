const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
require("IEHtml.InputNote.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { TypeNote } = require("TypeNote.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const {
	DonneesListe_RelationEvaluationCompetence,
} = require("DonneesListe_RelationEvaluationCompetence.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetFenetre_Competences } = require("ObjetFenetre_Competences.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetUtilitaireEvaluation } = require("ObjetUtilitaireEvaluation.js");
const {
	TypeModeInfosADE,
	TypeModeInfosADEUtil,
} = require("TypeModeAssociationDevoirEvaluation.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const {
	ObjetCelluleMultiSelectionThemes,
} = require("ObjetCelluleMultiSelectionThemes.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
const {
	UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
Requetes.inscrire("OrdonnerListeCompetences", ObjetRequeteConsultation);
class ObjetFenetre_Evaluation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.moteurNotes = new MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
		this.idIntitule = this.Nom + "_Intitule";
		this.idComboServiceLVE = this.Nom + "_ComboLVE";
		this.idSujet = this.Nom + "_Sujet";
		this.idCorrige = this.Nom + "_Corrige";
		this.idLabelDateValidation = this.Nom + "_DateValidation";
		this.idLabelDatePublication = this.Nom + "_DatePublication";
		this.idInfoPublicationDecaleeParents =
			this.Nom + "_InfoPublicationDecaleeParents";
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
		this.genreMenuContextSujet = { supprimerSujet: 1 };
		this.genreMenuContextCorrige = { supprimerCorrige: 1 };
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			this.evenementSurListe,
			_initialiserListeCompetences,
		);
		this.identFenetreCompetences = this.addFenetre(
			ObjetFenetre_Competences,
			this.evenementSurFenetreCompetences,
			initialiserFenetreCompetences.bind(this),
		);
		this.identDateValidation = this.add(
			ObjetCelluleDate,
			this.evenementSurDateValidation,
			_initialiserDateValidation,
		);
		this.identDatePublication = this.add(
			ObjetCelluleDate,
			this.evenementSurDatePublication,
			_initialiserDatePublication,
		);
		this.identComboServiceLVE = this.add(
			ObjetSaisiePN,
			this.evenementSurComboServiceLVE,
			_initialiserComboServiceLVE,
		);
		this.identComboPeriode = this.add(
			ObjetSaisiePN,
			this.evenementSurComboPeriode,
			_initialiserComboPeriode,
		);
		this.identComboPeriodeSecondaire = this.add(
			ObjetSaisiePN,
			this.evenementSurComboPeriodeSecondaire,
			_initialiserComboPeriodeSecondaire,
		);
		if (GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
			this.identMultiSelectionTheme = this.add(
				ObjetCelluleMultiSelectionThemes,
				_evtCellMultiSelectionTheme.bind(this),
			);
		}
		this.identMenuContextSujet = this.add(
			ObjetMenuContextuel,
			this.evntMenuContextSujet,
			this.initMenuContextSujet,
		);
		this.identMenuContextCorrige = this.add(
			ObjetMenuContextuel,
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
			GTraductions.getValeur("evaluations.CmdSupprimerSujet"),
		);
	}
	initMenuContextCorrige(aInstance) {
		aInstance.addCommande(
			this.genreMenuContextCorrige.supprimerCorrige,
			GTraductions.getValeur("evaluations.CmdSupprimerCorrige"),
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
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur("evaluations.MsgConfirmSupprSujet"),
			callback: this.surConfirmSuppressionSujet.bind(this),
		});
	}
	surConfirmSuppressionSujet(aGenreAction) {
		if (aGenreAction === EGenreAction.Valider) {
			this._supprimerSujet();
			GHtml.setFocus(this._getIdTromboneSujet());
		} else {
			$("#" + this._getIdCocheSujet().escapeJQ()).inputChecked(true);
			GHtml.setFocus(this._getIdCocheSujet());
		}
	}
	_supprimerSujet() {
		this.evaluation.listeSujets.get(0).setEtat(EGenreEtat.Suppression);
		this.actualiserSujet();
	}
	surDemandeSuppressionCorrige() {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur("evaluations.MsgConfirmSupprCorrige"),
			callback: this.surConfirmSuppressionCorrige.bind(this),
		});
	}
	surConfirmSuppressionCorrige(aGenreAction) {
		if (aGenreAction === EGenreAction.Valider) {
			this._supprimerCorrige();
			GHtml.setFocus(this._getIdTromboneCorrige());
		} else {
			$("#" + this._getIdCocheCorrige().escapeJQ()).inputChecked(true);
			GHtml.setFocus(this._getIdCocheCorrige());
		}
	}
	_supprimerCorrige() {
		this.evaluation.listeCorriges.get(0).setEtat(EGenreEtat.Suppression);
		this.actualiserCorrige();
	}
	actualiserSujet() {
		GHtml.setHtml(this.idSujet, this._composeSujet(), { instance: this });
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
		GHtml.setHtml(this.idCorrige, this._composeCorrige(), { instance: this });
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
			`<div class="field-contain" id="${this.idComboServiceLVE}" style="display:none">\n              <label>${GTraductions.getValeur("competences.ServiceLVE")}: </label>\n              <div id="${this.getNomInstance(this.identComboServiceLVE)}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain cols">`);
		T.push(
			`<div ie-display="panelDevoir.estVisible">${_composePanelDevoir.call(this)}</div>`,
		);
		T.push(`</div>`);
		T.push(`</div>`);
		return T.join("");
	}
	composeEntete() {
		const T = [];
		const lWidthLabel = "6.5rem";
		T.push(
			`<div class="field-contain as-grid" style="--width-bloc: 8.5rem;">\n              <label id="${this.idLabelDateValidation}">${GTraductions.getValeur("FenetreDevoir.EvaluationDu")}</label>\n              <div id="${this.getNomInstance(this.identDateValidation)}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain flex-start">`);
		T.push(
			`<div class="fix-bloc field-contain as-grid" style="--width-bloc: 9rem;">`,
		);
		T.push(
			`<label id="${this.idLabelDatePublication}">${GTraductions.getValeur("evaluations.colonne.publieeLe")}</label>`,
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
			`<label style="min-width: ${lWidthLabel};">${GTraductions.getValeur("evaluations.colonne.periode1")} : </label>`,
		);
		T.push(`<div id="${this.getNomInstance(this.identComboPeriode)}"></div>`);
		T.push(`</div>`);
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label>${GTraductions.getValeur("evaluations.colonne.periode2")} : </label>`,
		);
		T.push(
			`<div id="${this.getNomInstance(this.identComboPeriodeSecondaire)}"></div>`,
		);
		T.push(`</div>`);
		const lIdCoeff = `${this.Nom}_inputcoefficient`;
		T.push(`<div class="flex-contain flex-center">`);
		T.push(
			`<label for="${lIdCoeff}">${GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>`,
		);
		T.push(`<div class="input-iconised flex-contain flex-center ">`);
		T.push(
			`<ie-inputnote ie-model="coefficient" id="${lIdCoeff}" class="round-style m-right-l" style="width:5rem"></ie-inputnote>`,
		);
		T.push(UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFicheCoeff"));
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(`</div>`);
		T.push(`<div class="field-contain">`);
		T.push(
			`<label for="${this.idIntitule}" class="fix-bloc" style="min-width: ${lWidthLabel};">${GTraductions.getValeur("competences.intitule")}: </label>`,
		);
		T.push(`<input id="${this.idIntitule}" class="round-style full-width" />`);
		T.push(`</div>`);
		if (!!this.identMultiSelectionTheme) {
			T.push(`<div class="field-contain">`);
			T.push(
				`<label class="fix-bloc" style="min-width: ${lWidthLabel};">${GTraductions.getValeur("Themes")}: </label>`,
			);
			T.push(
				`<div class="fluid-bloc constrained-bloc" id="${this.getInstance(this.identMultiSelectionTheme).getNom()}" ></div>`,
			);
			T.push(`</div>`);
		}
		T.push(`<div class="field-contain">`);
		T.push(
			`<ie-textareamax class="full-width" ie-model="descriptif" maxlength="1000" style="height:6rem;" title="${GTraductions.getValeur("competences.descriptif")}" placeholder="${GTraductions.getValeur("FenetreDevoir.RedigezVotreCommentaire")}"></ie-textareamax>`,
		);
		T.push(`</div>`);
		T.push(`<div class="field-contain m-top-l m-bottom-xl">`);
		T.push(
			`<ie-checkbox ie-model="cbPrendreEnCompteEvalDansBilan">${GTraductions.getValeur("evaluations.FenetreSaisieEvaluation.PrendreEnCompteEvalDansBilan")}</ie-checkbox>`,
		);
		T.push(`</div>`);
		T.push(
			`<div id="${this.getNomInstance(this.identListe)}" style="min-height: 15rem" class="field-contain  m-top-l"></div>`,
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
				? `ie-node="selectDocumentEvaluation('${TypeFichierExterneHttpSco.EvaluationSujet}')"`
				: 'ie-model="selecFileSujet" ie-selecfile';
			H.push(
				`<div ${lModel} role="presentation" class="flex-contain fix-bloc">`,
			);
		}
		H.push(
			`<div class="label-contain">\n              <ie-checkbox tabindex="-1" ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("evaluations.avecLeSujet") })} id="${lIdCoche}" ${lChecked} class="AvecMain">${GTraductions.getValeur("evaluations.avecLeSujet")}\n              </ie-checkbox>\n            </div>`,
		);
		if (lAvecSelecFile) {
			H.push(`</div>`);
		}
		H.push('<div class="chips-contain">');
		if (lAvecSujet) {
			H.push(
				UtilitaireUrl.construireListeUrls(this.evaluation.listeSujets, {
					genreRessource: TypeFichierExterneHttpSco.EvaluationSujet,
				}),
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
				? `ie-node="selectDocumentEvaluation('${TypeFichierExterneHttpSco.EvaluationCorrige}')"`
				: 'ie-model="selecFileCorrige" ie-selecfile';
			H.push(
				`<div ${lModel} role="presentation" class="flex-contain fix-bloc">`,
			);
		}
		H.push(
			`<div class="label-contain">`,
			`<ie-checkbox tabindex="-1" ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("evaluations.avecLeCorrige") })}  id="${lIdCoche}" ${lChecked}>`,
			GTraductions.getValeur("evaluations.avecLeCorrige"),
			"</ie-checkbox>",
			"</div>",
		);
		if (lAvecSelecFile) {
			H.push("</div>");
		}
		H.push('<div class="chips-contain">');
		if (lAvecCorrige) {
			H.push(
				UtilitaireUrl.construireListeUrls(this.evaluation.listeCorriges, {
					genreRessource: TypeFichierExterneHttpSco.EvaluationCorrige,
				}),
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
				TypeModeInfosADE.tMIADE_Aucun,
				TypeModeInfosADE.tMIADE_Creation,
			].includes(this.evaluation.devoir.modeAssociation);
		const leDevoirEstVerrouille =
			!!this.evaluation &&
			!!this.evaluation.devoir &&
			this.evaluation.devoir.estVerrouille;
		const lEvaluationAUnePeriodeClotureePourLesDevoirs =
			ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
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
			this.listeServicesLVE = new ObjetListeElements();
			this.listeServicesLVE.addElement(new ObjetElement());
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
			this.evaluation.Libelle = GHtml.getValue(this.idIntitule).trim();
			this.evaluation.dateValidation = this.getInstance(
				this.identDateValidation,
			).getDate();
			this.evaluation.datePublication = this.getInstance(
				this.identDatePublication,
			).getDate();
			if (!this.evaluation.Libelle) {
				lMessage = GTraductions.getValeur(
					"competences.message.IntituleManquant",
				);
			} else if (
				this.evaluation.listeCompetences.getNbrElementsExistes() === 0
			) {
				lMessage = GTraductions.getValeur(
					"competences.message.CompetenceManquant",
				);
			} else if (
				this.listeServicesLVE &&
				!this.evaluation.serviceLVE &&
				this._existeCompetenceDePilierLVE()
			) {
				lMessage = GTraductions.getValeur(
					"competences.message.ServiceLVEManquant",
				);
			}
		}
		if (lMessage) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: lMessage,
			});
		} else {
			this.fermer();
			this.callback.appel(aGenreBouton, this.evaluation);
		}
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Creation:
				if (!this.avecCreationNouvelleCompetence) {
					_ouvrirFenetreChoixCompetenceDansReferentiel.call(this);
				}
				return EGenreEvenementListe.Creation;
			case EGenreEvenementListe.ApresCreation: {
				const lPosition =
					this.evaluation.listeCompetences.getNbrElementsExistes();
				aParametres.article.Position = lPosition;
				aParametres.article.coefficient = 1;
				aParametres.article.relationESI = new ObjetElement("");
				aParametres.article.relationESI.setEtat(EGenreEtat.Creation);
				_actualiserListe.call(this);
				break;
			}
			case EGenreEvenementListe.SelectionDblClick:
				_ouvrirFenetreChoixCompetenceDansReferentiel.call(this);
				break;
			case EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne ===
					DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut
				) {
					const lArticleConcerne = aParametres.article;
					const lThis = this;
					ObjetMenuContextuel.afficher({
						pere: this,
						initCommandes: function (aInstance) {
							TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
								instance: lThis,
								menuContextuel: aInstance,
								genreChoixValidationCompetence:
									TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
								callbackNiveau: function (aNiveau) {
									_modifierNiveauMaitriseParDefaut(
										new ObjetListeElements().addElement(lArticleConcerne),
										aNiveau,
										aParametres.instance,
									);
								},
							});
						},
					});
				}
				break;
			case EGenreEvenementListe.ApresSuppression:
				if (this.listeServicesLVE) {
					GHtml.setDisplay(
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
			const lListeCompetences = new ObjetListeElements();
			aListeCompetencesDEvaluation.parcourir((aElement) => {
				const lElementTrouve =
					ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
						lListeOrigine,
						aElement,
					);
				if (!lElementTrouve && aElement.getEtat() !== EGenreEtat.Suppression) {
					lListeCompetences.addElement(aElement);
				}
			});
			(lListeCompetences.count() > 1
				? Requetes("OrdonnerListeCompetences", this).lancerRequete({
						liste: lListeCompetences,
					})
				: Promise.resolve()
			).then((aJSONReponse) => {
				this.evaluation.listeCompetences = _calculPositions(
					this.evaluation.listeCompetences,
					aListeCompetencesDEvaluation,
					aJSONReponse ? aJSONReponse.listeOrdonnee : lListeCompetences,
				);
				this.evaluation.listePaliers = new ObjetListeElements();
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
					GHtml.setDisplay(
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
				_actualiserListe.call(this);
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
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			if (!aParams.element.getNumero()) {
				delete this.evaluation.serviceLVE;
			} else {
				this.evaluation.serviceLVE = aParams.element;
			}
		}
	}
	evenementSurComboPeriode(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.evaluation.periode = aParams.element;
			if (!!aParams.element && aParams.element.estNotationCloturee) {
				_controleSurSelectionPeriodeCloturee(this.evaluation, aParams.element);
			}
			if (this.evaluation.periode && this.evaluation.periodeSecondaire) {
				if (
					this.evaluation.periodeSecondaire.getNumero() ===
					this.evaluation.periode.getNumero()
				) {
					this.evaluation.periodeSecondaire = new ObjetElement("");
				}
			}
			if (!this.avecSelectionPeriodeSecondaire) {
				const lThis = this;
				if (!lThis.evaluation.periode.genresPeriodesOfficielles) {
					lThis.evaluation.periodeSecondaire = new ObjetElement("");
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
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.evaluation.periodeSecondaire = aParams.element;
			if (!!aParams.element && aParams.element.estNotationCloturee) {
				_controleSurSelectionPeriodeCloturee(this.evaluation, aParams.element);
			}
		}
	}
	actualiser(aAvecListe) {
		let lIndiceSelection;
		if (this.evaluation) {
			GHtml.setValue(this.idIntitule, this.evaluation.getLibelle());
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
					this.evaluation.ListeThemes || new ObjetListeElements(),
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
			GHtml.setFocusEdit(this.idIntitule);
			if (aAvecListe) {
				_actualiserListe.call(this);
			}
			if (this.listeServicesLVE) {
				lIndiceSelection = null;
				if (this.evaluation.serviceLVE) {
					lIndiceSelection = this.listeServicesLVE.getIndiceParNumeroEtGenre(
						this.evaluation.serviceLVE.getNumero(),
					);
				}
				GHtml.setDisplay(
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
			lListePeriodesSecondaires = new ObjetListeElements();
		lListePeriodesSecondaires.addElement(new ObjetElement(""));
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
		return GEtatUtilisateur.listeCloud.count() > 0;
	}
	actualiserDocument(aGenre, aDocument) {
		if (aGenre === TypeFichierExterneHttpSco.EvaluationSujet) {
			if (!this.evaluation.listeSujets) {
				this.evaluation.listeSujets = new ObjetListeElements();
			}
			this.evaluation.listeSujets.addElement(aDocument, 0);
			this.evaluation.libelleSujet = aDocument.getLibelle();
			this.actualiserSujet();
		} else if (aGenre === TypeFichierExterneHttpSco.EvaluationCorrige) {
			if (!this.evaluation.listeCorriges) {
				this.evaluation.listeCorriges = new ObjetListeElements();
			}
			this.evaluation.listeCorriges.addElement(aDocument, 0);
			this.evaluation.libelleCorrige = aDocument.getLibelle();
			this.actualiserCorrige();
		}
	}
	selecteurDocumentEvaluationActif(aGenre) {
		let lResult = this.Actif && this.evaluation && !this.evaluation.verrouille;
		if (lResult) {
			if (aGenre === TypeFichierExterneHttpSco.EvaluationSujet) {
				lResult = !this._avecSujetEvaluation();
			} else if (aGenre === TypeFichierExterneHttpSco.EvaluationCorrige) {
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
				genre: TypeFichierExterneHttpSco.Aucun,
				callback: null,
			},
			aParams,
		);
		let lParams = {
			callbaskEvenement: function (aLigne) {
				if (aLigne >= 0) {
					lParamsDonnees.service = GEtatUtilisateur.listeCloud.get(aLigne);
					lThis.choisirFichierCloud(lParamsDonnees);
				}
			},
			modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
		};
		UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
	}
	choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				genre: TypeFichierExterneHttpSco.Aucun,
				callback: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_FichiersCloud, {
				pere: lParams.instance,
				evenement: function (aParam) {
					if (
						aParam.listeNouveauxDocs &&
						aParam.listeNouveauxDocs.count() === 1
					) {
						const lElement = aParam.listeNouveauxDocs.get(0);
						if (lParams.callback) {
							lParams.callback.call(lParams.instance, lParams.genre, lElement);
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
			}).setDonnees({ service: lParams.service.Genre });
		});
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
						ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
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
						let lHint = GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.ImpossibleDeCreerDevoir",
						);
						if (!!lPeriodeCloturee) {
							lHint +=
								" : " +
								GTraductions.getValeur(
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
						return GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.AucunSousServicePourLeDevoir",
						);
					}
					return "";
				},
				panelCreationVisible: function () {
					return (
						!!aInstance.evaluation &&
						(!aInstance.evaluation.devoir ||
							aInstance.evaluation.devoir.modeAssociation ===
								TypeModeInfosADE.tMIADE_Aucun ||
							aInstance.evaluation.devoir.modeAssociation ===
								TypeModeInfosADE.tMIADE_Creation)
					);
				},
				panelModificationVisible: function () {
					return (
						!!aInstance.evaluation &&
						!aInstance.controleur.panelDevoir.panelCreationVisible()
					);
				},
				avecServiceDevoirVisible: function () {
					return (
						!!aInstance.evaluation &&
						!!aInstance.evaluation.saisieDevoirsSurSousServices
					);
				},
				valeursDevoirSontModifiables: function () {
					return (
						!!aInstance.evaluation &&
						!!aInstance.evaluation.devoir &&
						(aInstance.evaluation.devoir.modeAssociation ===
							TypeModeInfosADE.tMIADE_Creation ||
							aInstance.evaluation.devoir.modeAssociation ===
								TypeModeInfosADE.tMIADE_Modification) &&
						aInstance.controleur.panelDevoir.leDevoirEstEditable()
					);
				},
				leDevoirEstEditable: function () {
					return (
						!!aInstance.evaluation &&
						!!aInstance.evaluation.devoir &&
						!aInstance.evaluation.devoir.estVerrouille &&
						!aInstance.evaluation.devoir.estCloture
					);
				},
				estDevoirFacultatif: function () {
					return !!aInstance.evaluation && !!aInstance.evaluation.devoir
						? aInstance.evaluation.devoir.commeUnBonus ||
								aInstance.evaluation.devoir.commeUneNote
						: false;
				},
				cbCreerDevoir: {
					getValue: function () {
						return (
							!!aInstance.evaluation &&
							!!aInstance.evaluation.devoir &&
							aInstance.evaluation.devoir.modeAssociation ===
								TypeModeInfosADE.tMIADE_Creation
						);
					},
					setValue: function (aChecked) {
						if (!!aInstance.evaluation) {
							if (aChecked) {
								if (!aInstance.evaluation.devoir) {
									aInstance.evaluation.devoir = new ObjetElement();
									aInstance.evaluation.devoir.coefficient = new TypeNote(1);
									aInstance.evaluation.devoir.bareme =
										aInstance.evaluation.baremeDevoirParDefaut;
									aInstance.evaluation.devoir.serviceDevoir =
										!!aInstance.evaluation.servicesDevoir &&
										aInstance.evaluation.servicesDevoir.count() > 0
											? aInstance.evaluation.servicesDevoir.getPremierElement()
											: null;
								}
								aInstance.evaluation.devoir.modeAssociation =
									TypeModeInfosADE.tMIADE_Creation;
								aInstance.evaluation.devoir.setEtat(EGenreEtat.Creation);
							} else {
								if (!!aInstance.evaluation.devoir) {
									aInstance.evaluation.devoir.modeAssociation =
										TypeModeInfosADE.tMIADE_Aucun;
									aInstance.evaluation.devoir.setEtat(EGenreEtat.Suppression);
								}
							}
						}
					},
					getDisabled: function () {
						return (
							!aInstance.evaluation ||
							ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieNotes(
								aInstance.evaluation,
							) ||
							(!!aInstance.evaluation.saisieDevoirsSurSousServices &&
								(!aInstance.evaluation.servicesDevoir ||
									aInstance.evaluation.servicesDevoir.count() === 0))
						);
					},
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
							aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
						}
					},
					getDisabled: function () {
						return (
							!aInstance.evaluation ||
							!aInstance.controleur.panelDevoir.leDevoirEstEditable()
						);
					},
				},
				comboService: {
					init: function (aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: 250,
							labelWAICellule: GTraductions.getValeur(
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
								EGenreEvenementObjetSaisie.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
								aInstance.evaluation.devoir.serviceDevoir = aParametres.element;
								aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
							}
						}
					},
					getDisabled: function () {
						return (
							!aInstance.controleur.panelDevoir.leDevoirEstEditable() ||
							aInstance.evaluation.devoir.modeAssociation !==
								TypeModeInfosADE.tMIADE_Creation ||
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
							aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
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
						return !aInstance.controleur.panelDevoir.valeursDevoirSontModifiables();
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
							aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
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
						return !aInstance.controleur.panelDevoir.valeursDevoirSontModifiables();
					},
				},
				btnMrFicheBareme: {
					event() {
						GApplication.getMessage().afficher({
							idRessource: "FenetreDevoir.MFicheBaremeDifferentDe20",
						});
					},
					getTitle() {
						return GTraductions.getTitreMFiche(
							"FenetreDevoir.MFicheBaremeDifferentDe20",
						);
					},
				},
				cbRamenerSur20: {
					getValue: function () {
						return !!aInstance.evaluation && !!aInstance.evaluation.devoir
							? aInstance.evaluation.devoir.ramenerSur20
							: false;
					},
					setValue: function (aChecked) {
						if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
							aInstance.evaluation.devoir.ramenerSur20 = aChecked;
							aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
						}
					},
					getDisabled: function () {
						let lBaremeDevoirEstBaremeParDefaut = true;
						if (
							!!aInstance.evaluation &&
							!!aInstance.evaluation.devoir &&
							!!aInstance.evaluation.devoir.bareme &&
							!!aInstance.evaluation.baremeDevoirDuService
						) {
							lBaremeDevoirEstBaremeParDefaut =
								aInstance.evaluation.devoir.bareme.getValeur() ===
								aInstance.evaluation.baremeDevoirDuService.getValeur();
						}
						return (
							!aInstance.controleur.panelDevoir.valeursDevoirSontModifiables() ||
							lBaremeDevoirEstBaremeParDefaut
						);
					},
				},
				labelRamenerSur20: function () {
					let lParams;
					if (
						!!aInstance.evaluation &&
						!!aInstance.evaluation.baremeDevoirDuService
					) {
						lParams = [aInstance.evaluation.baremeDevoirDuService.getValeur()];
					}
					return GTraductions.getValeur("FenetreDevoir.Ramenersur20", lParams);
				},
				cbFacultatif: {
					getValue: function () {
						return aInstance.controleur.panelDevoir.estDevoirFacultatif();
					},
					setValue: function (aChecked) {
						if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
							aInstance.evaluation.devoir.commeUnBonus = false;
							aInstance.evaluation.devoir.commeUneNote = false;
							if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
								aInstance.evaluation.devoir.commeUnBonus = aChecked;
							}
							aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
						}
					},
					getDisabled: function () {
						return !this.controleur.panelDevoir.valeursDevoirSontModifiables();
					},
				},
				comboGenreFacultatif: {
					init: function (aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: 120,
							labelWAICellule: GTraductions.getValeur(
								"FenetreDevoir.Facultatif",
							),
						});
					},
					getDonnees: function (aDonnees) {
						if (aDonnees) {
							return;
						}
						const lListeGenresFacultatif = new ObjetListeElements();
						lListeGenresFacultatif.addElement(
							new ObjetElement(
								GTraductions.getValeur("FenetreDevoir.CommeUnBonus"),
								null,
								0,
							),
						);
						lListeGenresFacultatif.addElement(
							new ObjetElement(
								GTraductions.getValeur("FenetreDevoir.CommeUneNote"),
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
								EGenreEvenementObjetSaisie.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							if (!!aInstance.evaluation && !!aInstance.evaluation.devoir) {
								const lGenreSelected = aParametres.element.getGenre();
								aInstance.evaluation.devoir.commeUnBonus = lGenreSelected === 0;
								aInstance.evaluation.devoir.commeUneNote = lGenreSelected === 1;
								aInstance.evaluation.devoir.setEtat(EGenreEtat.Modification);
							}
						}
					},
					getDisabled: function () {
						return (
							!aInstance.controleur.panelDevoir.valeursDevoirSontModifiables() ||
							!aInstance.controleur.panelDevoir.estDevoirFacultatif()
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
						return GTraductions.getTitreMFiche(
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
								? GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMonPoste",
									),
							icon: "icon_folder_open",
							selecFile: true,
							optionsSelecFile: {
								maxSize: GApplication.droits.get(
									TypeDroits.tailleMaxDocJointEtablissement,
								),
							},
							event(aParamsInput) {
								if (aParamsInput) {
									lThis.actualiserDocument(aGenre, aParamsInput.eltFichier);
								}
							},
							class: "bg-util-marron-claire",
						});
						const lParams = {
							genre: aGenre,
							callback: lThis.actualiserDocument,
						};
						lTabActions.push({
							libelle: GTraductions.getValeur(
								"fenetre_ActionContextuelle.depuisMonCloud",
							),
							icon: "icon_cloud",
							event: function () {
								lThis.ouvrirPJCloud(lParams);
							}.bind(this),
							class: "bg-util-marron-claire",
						});
						ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, {
							pere: lThis,
						});
						aEvent.stopImmediatePropagation();
						aEvent.preventDefault();
					}
				});
			},
			selecFileSujet: {
				getOptionsSelecFile: function () {
					return {
						maxSize: GApplication.droits.get(
							TypeDroits.tailleMaxDocJointEtablissement,
						),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					if (!aInstance.evaluation.listeSujets) {
						aInstance.evaluation.listeSujets = new ObjetListeElements();
					}
					aInstance.evaluation.listeSujets.addElement(aParams.eltFichier, 0);
					aInstance.evaluation.libelleSujet = aParams.eltFichier.getLibelle();
					aInstance.actualiserSujet();
				},
			},
			selecFileCorrige: {
				getOptionsSelecFile: function () {
					return {
						maxSize: GApplication.droits.get(
							TypeDroits.tailleMaxDocJointEtablissement,
						),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					if (!aInstance.evaluation.listeCorriges) {
						aInstance.evaluation.listeCorriges = new ObjetListeElements();
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
						? new TypeNote(aInstance.evaluation.coefficient)
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
					return GTraductions.getTitreMFiche(
						"FenetreEvaluation.MFicheCoefficientSurEvaluation",
					);
				},
			},
			cbPrendreEnCompteEvalDansBilan: {
				getValue: function () {
					return !!aInstance.evaluation
						? aInstance.evaluation.priseEnCompteDansBilan
						: false;
				},
				setValue: function (aChecked) {
					if (!!aInstance.evaluation) {
						aInstance.evaluation.priseEnCompteDansBilan = aChecked;
					}
				},
			},
			getHtmlInfoPublicationDecaleeParents() {
				let lMessageDateDecaleeAuxParents = "";
				if (
					aInstance.evaluation &&
					GParametres.avecAffichageDecalagePublicationEvalsAuxParents &&
					!!GParametres.nbJDecalagePublicationAuxParents
				) {
					let lDatePublicationDecalee = GDate.formatDate(
						GDate.getJourSuivant(
							aInstance.evaluation.datePublication,
							GParametres.nbJDecalagePublicationAuxParents,
						),
						" %JJ/%MM",
					);
					if (GParametres.nbJDecalagePublicationAuxParents === 1) {
						lMessageDateDecaleeAuxParents = GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.DecalageUnJourPublicationParentsSoitLe",
							[lDatePublicationDecalee],
						);
					} else {
						lMessageDateDecaleeAuxParents = GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.DecalageXJoursPublicationParentsSoitLe",
							[
								GParametres.nbJDecalagePublicationAuxParents,
								lDatePublicationDecalee,
							],
						);
					}
				}
				return lMessageDateDecaleeAuxParents;
			},
		});
	}
}
function _getTriListe() {
	return [ObjetTri.init("Position")];
}
function _getValeurMaxCoefficientCompetence() {
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
function _dupliquerCompetence(aCompetence) {
	if (
		!!aCompetence &&
		!!this.evaluation &&
		!!this.evaluation.listeCompetences
	) {
		const lCompetenceDupliquee = MethodesObjet.dupliquer(aCompetence);
		lCompetenceDupliquee.relationESI = new ObjetElement("");
		lCompetenceDupliquee.relationESI.setEtat(EGenreEtat.Creation);
		lCompetenceDupliquee.setEtat(EGenreEtat.Creation);
		lCompetenceDupliquee.Position =
			this.evaluation.listeCompetences.getNbrElementsExistes() + 1;
		this.evaluation.listeCompetences.addElement(lCompetenceDupliquee);
	}
}
function _actualiserListe() {
	this.evaluation.listeCompetences.setTri(_getTriListe()).trier();
	const lDonneesListe = new DonneesListe_RelationEvaluationCompetence(
		this.evaluation.listeCompetences,
		{
			avecCreationNouvelleCompetence: this.avecCreationNouvelleCompetence,
			callbackAppliquerOrdreGrille: _appliquerTriParDefaut.bind(this),
			callbackChoixCompetenceDansReferentiel:
				_ouvrirFenetreChoixCompetenceDansReferentiel.bind(this),
			callbackDupliquerCompetence: this.avecDuplicationCompetence
				? _dupliquerCompetence.bind(this)
				: null,
			callbackModifierNiveauMaitriseDefaut: _modifierNiveauMaitriseParDefaut,
			funcGetValeurMaxCoefficientCompetence:
				_getValeurMaxCoefficientCompetence.bind(this),
			listeReferentielsUniques: this.listeReferentielsUniques,
		},
	);
	this.getInstance(this.identListe).setDonnees(lDonneesListe);
}
function _appliquerTriParDefaut() {
	const lListeCompetences = this.evaluation.listeCompetences
		.getListeElements((aElement) => {
			return aElement.getEtat() !== EGenreEtat.Suppression;
		})
		.setSerialisateurJSON({ ignorerEtatsElements: true });
	if (lListeCompetences.count() < 2) {
		return;
	}
	Requetes("OrdonnerListeCompetences", this)
		.lancerRequete({ liste: lListeCompetences })
		.then((aJSONReponse) => {
			let lPosition = 1;
			const lNumeroElementTraites = [];
			aJSONReponse.listeOrdonnee.parcourir((aElementOrdonne) => {
				if (lNumeroElementTraites.indexOf(aElementOrdonne.getNumero()) === -1) {
					lNumeroElementTraites.push(aElementOrdonne.getNumero());
					this.evaluation.listeCompetences.parcourir((aElementDEvaluation) => {
						if (
							aElementDEvaluation.getNumero() === aElementOrdonne.getNumero()
						) {
							if (aElementDEvaluation.Position !== lPosition) {
								aElementDEvaluation.Position = lPosition;
								aElementDEvaluation.setEtat(EGenreEtat.Modification);
							}
							lPosition++;
						}
					});
				}
			});
			_actualiserListe.call(this);
		});
}
function _initialiserListeCompetences(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_RelationEvaluationCompetence.colonnes.code,
		taille: 40,
		titre: GTraductions.getValeur("Code"),
	});
	lColonnes.push({
		id: DonneesListe_RelationEvaluationCompetence.colonnes.intitule,
		taille: "100%",
		titre: GTraductions.getValeur(
			"competences.competencesConnaissancesEvaluees",
		),
	});
	lColonnes.push({
		id: DonneesListe_RelationEvaluationCompetence.colonnes.coefficient,
		taille: 40,
		titre: GTraductions.getValeur("competences.colonne.coef"),
	});
	lColonnes.push({
		id: DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut,
		taille: 40,
		titre: GTraductions.getValeur("competences.niveauParDefautAbr"),
		hint: GTraductions.getValeur("competences.niveauParDefaut"),
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
		hauteurMaxAdapteContenu: 150,
		hauteurZoneContenuListeMin: 40,
		listeCreations: 0,
		avecLigneCreation: true,
		titreCreation: GTraductions.getValeur(
			"competences.ajouterRelationsAEvaluation",
		),
		boutons: [
			{ genre: ObjetListe.typeBouton.exportCSV },
			{ genre: ObjetListe.typeBouton.monter },
			{ genre: ObjetListe.typeBouton.descendre },
		],
	});
}
function initialiserFenetreCompetences(aInstance) {
	let lTitre = GTraductions.getValeur(
		"competences.choixCompetencesConnaissancesAEvaluer",
	);
	if (
		GEtatUtilisateur.pourPrimaire() &&
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
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
function _initialiserDateValidation(aInstance) {
	aInstance.setOptionsObjetCelluleDate({
		labelledById: this.idLabelDateValidation,
	});
}
function _initialiserDatePublication(aInstance) {
	aInstance.setOptionsObjetCelluleDate({
		labelledById: this.idLabelDatePublication,
		describedById: this.idInfoPublicationDecaleeParents,
	});
}
function _initialiserComboServiceLVE(aInstance) {
	aInstance.setOptionsObjetSaisie({
		avecTriListeElements: false,
		longueur: 250,
		forcerBoutonDeploiement: true,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionCategorie"),
	});
}
function _initialiserComboPeriode(aInstance) {
	aInstance.setOptionsObjetSaisie({
		avecTriListeElements: false,
		longueur: 100,
		forcerBoutonDeploiement: true,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionCategorie"),
	});
}
function _initialiserComboPeriodeSecondaire(aInstance) {
	aInstance.setOptionsObjetSaisie({
		avecTriListeElements: false,
		longueur: 100,
		forcerBoutonDeploiement: true,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionCategorie"),
	});
}
function _composePanelDevoir() {
	const T = [];
	T.push(
		'<div class="flex-contain cols top-line" ie-display="panelDevoir.panelCreationVisible" ie-hint="panelDevoir.getHintPanelCreationModification">',
	);
	T.push(
		'<div class="field-contain">',
		`<ie-checkbox style="margin-right:.4rem" ie-model="panelDevoir.cbCreerDevoir">${TypeModeInfosADEUtil.getLibelle(TypeModeInfosADE.tMIADE_Creation)}</ie-checkbox>`,
		"</div>",
	);
	T.push(
		`<div ie-display="panelDevoir.panelModificationVisible" class="flex-contain cols m-left-xxl">`,
	);
	T.push(
		`<label class="m-bottom-l">${GTraductions.getValeur("evaluations.FenetreSaisieEvaluation.DevoirDeLEvaluation")}</label>`,
	);
	T.push(`<div class="field-contain">`);
	T.push(
		`<ie-radio ie-model="panelDevoir.radioModeAssociation(${TypeModeInfosADE.tMIADE_SuppressionD})">${TypeModeInfosADEUtil.getLibelle(TypeModeInfosADE.tMIADE_SuppressionD)}</ie-radio>`,
	);
	T.push(`</div>`);
	T.push(`<div class="field-contain">`);
	T.push(
		`<ie-radio ie-model="panelDevoir.radioModeAssociation(${TypeModeInfosADE.tMIADE_Modification})">${TypeModeInfosADEUtil.getLibelle(TypeModeInfosADE.tMIADE_Modification)}</ie-radio>`,
	);
	T.push(`</div>`);
	T.push(`</div>`);
	T.push(`<div class="flex-contain cols m-left-xxl">`);
	T.push(
		`<div ie-display="panelDevoir.avecServiceDevoirVisible" class="field-contain">`,
	);
	T.push(
		`<label class="ie-titre-petit" style="width:8.2rem;">${GTraductions.getValeur("FenetreDevoir.SousMatiere")}</label>`,
	);
	T.push(`<ie-combo ie-model="panelDevoir.comboService"></ie-combo>`);
	T.push(`</div>`);
	T.push(`<div class="field-contain">`);
	const lIdCoeffBareme = `${this.Nom}_devoir_inputBareme`;
	T.push(`<div class="flex-contain flex-center m-right-l">`);
	T.push(
		`<label class="ie-titre-petit" style="width:8.2rem;" for="${lIdCoeffBareme}">${GTraductions.getValeur("FenetreDevoir.Bareme")}</label>`,
	);
	T.push(
		`<ie-inputnote ie-model="panelDevoir.inputBareme" id="${lIdCoeffBareme}" style="width:5rem;" class="round-style"></ie-inputnote>`,
	);
	T.push(`</div>`);
	const lIdCoeff = `${this.Nom}_devoir_inputCoefficient`;
	T.push(`<div class="flex-contain flex-center">`);
	T.push(
		`<label class="ie-titre-petit" for="${lIdCoeff}">${GTraductions.getValeur("FenetreDevoir.Coefficient")}</label>`,
	);
	T.push(
		`<ie-inputnote ie-model="panelDevoir.inputCoefficient" id="${lIdCoeff}" style="width:50px;" class="round-style m-right-l"></ie-inputnote>`,
	);
	T.push(
		UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
			"panelDevoir.btnMrFicheBareme",
		),
	);
	T.push(`</div>`);
	T.push(`</div>`);
	T.push(`<div class="field-contain">`);
	T.push(
		`<ie-checkbox ie-model="panelDevoir.cbRamenerSur20" ie-texte="panelDevoir.labelRamenerSur20"></ie-checkbox>`,
	);
	T.push(`</div>`);
	T.push(`<div class="field-contain">`);
	T.push(
		`<ie-checkbox class="m-right-l" ie-model="panelDevoir.cbFacultatif">${GTraductions.getValeur("FenetreDevoir.Facultatif")}</ie-checkbox>`,
	);
	T.push(
		`<ie-combo ie-model="panelDevoir.comboGenreFacultatif" class="m-right-l"></ie-combo>`,
	);
	T.push(
		UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
			"panelDevoir.btnMrFicheDevoirFacultatif",
		),
	);
	T.push(`</div>`);
	T.push(`</div>`);
	T.push(`</div>`);
	return T.join("");
}
function _modifierNiveauMaitriseParDefaut(
	aCompetences,
	aNiveau,
	aInstanceListe,
) {
	aCompetences.parcourir((aArticle) => {
		aArticle.niveauAcquiDefaut = aNiveau;
		aArticle.setEtat(EGenreEtat.Modification);
	});
	aInstanceListe.actualiser({ conserverSelection: true });
}
function _ouvrirFenetreChoixCompetenceDansReferentiel() {
	const lService = this.evaluation.service
		? this.evaluation.service
		: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
	const lClasse = GEtatUtilisateur.Navigation.getRessource(
		EGenreRessource.Classe,
	);
	this.getInstance(this.identFenetreCompetences).setDonnees({
		listeCompetences: MethodesObjet.dupliquer(this.evaluation.listeCompetences),
		service: lService,
		classe: lClasse,
		optionsContexte: {
			listeReferentielsUniques: this.listeReferentielsUniques,
			avecDoublonCompetencesInterdit: this.avecDoublonCompetencesInterdit,
		},
	});
}
function _calculPositions(aListeOrigine, aListeModifiee, aListeOrdonneeAjout) {
	let lNbAnciens = 0;
	const lListe = new ObjetListeElements();
	aListeModifiee.setTri(_getTriListe());
	aListeModifiee
		.parcourir((aElement) => {
			if (aElement.existe() && aElement.relationESI) {
				const lElementTrouve =
					ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
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
					aElementDeListeModifiee.getNumero() === aElementOrdonne.getNumero() &&
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
function _controleSurSelectionPeriodeCloturee(aEvaluation, aPeriodeCloturee) {
	if (!!aEvaluation && !!aPeriodeCloturee) {
		if (
			!!aEvaluation.devoir &&
			aEvaluation.devoir.modeAssociation === TypeModeInfosADE.tMIADE_Creation
		) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				titre: GTraductions.getValeur(
					"evaluations.FenetreSaisieEvaluation.ImpossibleDeCreerDevoir",
				),
				message: GTraductions.getValeur(
					"evaluations.FenetreSaisieEvaluation.PeriodeClotureePourLeDevoir",
					[aPeriodeCloturee.getLibelle()],
				),
			});
			aEvaluation.devoir.modeAssociation = TypeModeInfosADE.tMIADE_Aucun;
		}
	}
}
function _evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
	if (aGenreBouton === 1) {
		this.evaluation.ListeThemes = aListeSelections;
		this.evaluation.setEtat(EGenreEtat.Modification);
	}
}
module.exports = { ObjetFenetre_Evaluation };

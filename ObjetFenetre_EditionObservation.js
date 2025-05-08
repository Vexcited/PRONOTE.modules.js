const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	ObjetMoteurEditionObservation,
} = require("ObjetMoteurEditionObservation.js");
const { ObjetMoteurAbsences } = require("ObjetMoteurAbsences.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetFenetre_EditionObservation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.moteurEdition = new ObjetMoteurEditionObservation(this);
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate,
			evenementSelecteurDate.bind(this),
			_initialiserSelecteurDate,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (
						aBoutonRepeat.element.index ===
						aInstance._getMoteurEditionObs().numBoutonValider
					) {
						return !aInstance
							._getMoteurEditionObs()
							.validationActif(
								aInstance._getMoteurEditionObs().observation.commentaire,
							);
					}
					return false;
				},
			},
			avecVisibiliteDate: function () {
				return aInstance._getMoteurEditionObs().avecDate;
			},
			avecVisibilitePublication: function () {
				return aInstance._getMoteurEditionObs().publiable;
			},
			documents: {
				visible: function () {
					return (
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense
					);
				},
				html: function () {
					const lHtml = [];
					if (
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense &&
						aInstance._getMoteurEditionObs().observation.documents
					) {
						aInstance
							._getMoteurEditionObs()
							.observation.documents.parcourir((aDocument) => {
								lHtml.push(
									GChaine.composerUrlLienExterne({
										documentJoint: aDocument,
										genreRessource: EGenreRessource.DocumentJoint,
									}),
								);
							});
					}
					return lHtml.join("");
				},
			},
			dispense: {
				visible: function () {
					return (
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense
					);
				},
			},
			dispenseALaMaison: {
				visible: function () {
					const lEstDispense =
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense;
					const lEstALaMaison =
						lEstDispense &&
						aInstance._getMoteurEditionObs().observation
							.estEnseignementALaMaison;
					const lEstVS =
						lEstDispense &&
						!aInstance._getMoteurEditionObs().observation.estSurCours;
					return lEstALaMaison || lEstVS;
				},
				html: function () {
					const lHtml = [];
					if (
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense &&
						aInstance._getMoteurEditionObs().observation
							.estEnseignementALaMaison
					) {
						lHtml.push(
							ObjetMoteurAbsences.formatTraductionAbs(
								aInstance._getMoteurEditionObs().observation,
								EGenreRessource.Dispense,
							),
						);
					} else if (
						aInstance._getMoteurEditionObs() &&
						aInstance._getMoteurEditionObs().observation &&
						aInstance._getMoteurEditionObs().observation.getGenre() ===
							EGenreRessource.Dispense &&
						!aInstance._getMoteurEditionObs().observation.estSurCours
					) {
						lHtml.push(GTraductions.getValeur("AbsenceVS.DispenseLongue"));
					}
					return lHtml.join("");
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div ie-if="dispenseALaMaison.visible" ie-texte="dispenseALaMaison.html" class="field-contain">',
		);
		T.push("</div>");
		T.push(
			'<div ie-if="avecVisibiliteDate" class="field-contain dates-contain">',
		);
		T.push("<label>", GTraductions.getValeur("AbsenceVS.date"), " :</label>");
		T.push(
			'<div class="date-wrapper" id="',
			this.getInstance(this.identDate).getNom(),
			'"></div>',
		);
		T.push("</div>");
		if (IE.estMobile) {
			T.push(
				'<div class="field-contain">',
				'<ie-textareamax  class="round-style" ie-compteur ie-model="commentaire" placeholder="',
				GTraductions.getValeur("AbsenceVS.saisissezUnCommentaire"),
				'">',
				"</ie-textareamax></div>",
			);
		} else {
			T.push(
				"<div>",
				'<textarea aria-labelledby="',
				this.IdTitre,
				'" class="round-style" ie-model="commentaire" style="width:100%;height:150px;"></textarea>',
				"</div>",
			);
		}
		T.push(
			`<p ie-if="dispense.visible" class="m-top">${GTraductions.getValeur("AbsenceVS.dispense.commentaireDeLaDispense")}</p>`,
		);
		T.push(
			'<div class="feo-documents" ie-display="documents.visible" ie-html="documents.html"></div>',
		);
		T.push('<div ie-if="avecVisibilitePublication" class="public-team">');
		T.push(
			'<span class="icon-contain only-mobile"><i class="icon_info_sondage_publier i-medium i-as-deco" ie-class="iconePublie"></i></span>',
		);
		T.push('<ie-checkbox ie-model="checkPublie"></ie-checkbox>');
		T.push("</div>");
		T.push(
			'<div style="float: right;" class="EspaceHaut TexteRouge Gras" ie-style="visibiliteMessageVisu" ie-html="messageVisu"></div>',
		);
		return T.join("");
	}
	setDonnees(aParam) {
		this.moteurEdition.init(aParam);
		this.setOptionsFenetre({
			titre: this.moteurEdition.getTitre(),
			listeBoutons: this.moteurEdition.listeBoutons,
		});
		if (this.moteurEdition.avecDate) {
			const lDateObs = this.moteurEdition.observation.date;
			this.getInstance(this.identDate).setDonnees(
				lDateObs ? lDateObs : GDate.getDateCourante(),
			);
		}
	}
	_getMoteurEditionObs() {
		return this.moteurEdition;
	}
	surValidation(aNumeroBouton) {
		this.callback.appel(
			this.moteurEdition.surValidation(aNumeroBouton),
			this.moteurEdition.observation.getGenre(),
			this.moteurEdition.numeroObservation,
			aNumeroBouton === this.moteurEdition.numBoutonValider,
		);
		this.fermer();
	}
}
function _initialiserSelecteurDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ largeurComposant: 100 });
}
function evenementSelecteurDate(aDate) {
	if (this.moteurEdition.avecDate) {
		this.moteurEdition.observation.date = aDate;
		this.moteurEdition.observation.date.setHours(0, 0, 0, 0);
	}
}
module.exports = { ObjetFenetre_EditionObservation };

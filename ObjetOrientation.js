const { Identite } = require("ObjetIdentite.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { TypeAvisConseil } = require("TypeAvisConseil.js");
const {
	TUtilitaireOrientation: UtilitaireOrientation,
} = require("UtilitaireOrientation.js");
const { EModeAffichage } = require("UtilitaireOrientation.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
class ObjetOrientation extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idOrientation = GUID.getId();
		this.idSpecialite = GUID.getId();
		this.idOption = GUID.getId();
		this.donnees = new ObjetElement();
		this.initDonneeVierge();
	}
	initDonneeVierge() {
		this.donnees.orientation = new ObjetElement();
		this.donnees.specialites = new ObjetListeElements();
		this.donnees.options = new ObjetListeElements();
		this.donnees.commentaire = "";
	}
	getControleur() {
		return $.extend(
			true,
			super.getControleur(this),
			UtilitaireOrientation.getControleur(this),
		);
	}
	getHtmlVignette(aGenre, aLibelle, aIndex) {
		const H = [];
		if (aLibelle) {
			H.push(
				'<ie-chips ie-model="chipsOrientation(',
				aGenre,
				",",
				aIndex,
				')">',
				aLibelle,
				"</ie-chips>",
			);
		}
		return H.join("");
	}
	estEditable() {
		return this.donnees.orientation && this.donnees.orientation.getLibelle();
	}
	construireAffichage() {
		let lHtml;
		switch (this.modeSaisie) {
			case EModeAffichage.saisie:
				lHtml = this.composeOrientationSaisie();
				break;
			case EModeAffichage.consultation:
				lHtml = this.composeOrientationConsultation();
				break;
			case EModeAffichage.simplifie:
				lHtml = this.composeOrientationSimplifie();
		}
		return lHtml;
	}
	setDonnees(aParam) {
		if (aParam.voeux) {
			this.donnees = aParam.voeux;
			this.donnees.Genre = aParam.genre;
		}
		this.modeSaisie = aParam.modeSaisie;
		this.avecOption = aParam.avecOption;
		this.maquette = aParam.maquette;
		this.rubrique = aParam.rubrique;
		this.editable = aParam.editable;
		this.message = aParam.message;
		this.setGenre(aParam.genre);
	}
	composeOrientationSimplifie() {
		const lHtml = [];
		if (
			(this.donnees.orientation && this.donnees.orientation.existe()) ||
			this.message
		) {
			lHtml.push('<div class="flex-contain IPO_Voeux IPO_Fond IPO_VoeuCC">');
			lHtml.push('<div class="Espace IPO_Bloc50">');
			if (this.message) {
				lHtml.push('<div class="Espace">', this.message, "</div>");
			} else {
				lHtml.push(
					'<div class="Espace Gras">',
					this.donnees.orientation.getLibelle(),
					"</div>",
				);
				if (
					this.donnees.orientation &&
					this.donnees.orientation.avecStageConseil
				) {
					lHtml.push(
						'<div class="Espace GrandEspaceGauche Italique">',
						GTraductions.getValeur(
							"Orientation.Ressources.StagePasserellePropose",
						),
						"</div>",
					);
				} else if (this.donnees.avecStageFamille) {
					lHtml.push(
						'<div class="Espace GrandEspaceGauche Italique">',
						GTraductions.getValeur(
							"Orientation.Ressources.DemandeStagePasserelle",
						),
						"</div>",
					);
				} else {
					if (this.donnees.specialites) {
						lHtml.push(
							'<div class="Espace"><ul class="IPO_Liste GrandEspaceGauche">',
						);
						this.donnees.specialites.parcourir((element) => {
							lHtml.push("<li>", element.getLibelle(), "</li>");
						});
						lHtml.push("</ul></div>");
					}
					lHtml.push("</div>");
					if (this.avecOption) {
						lHtml.push('<div class="IPO_Divider"></div>');
						lHtml.push('<div class="Espace IPO_Bloc65">');
						lHtml.push('<div class="Espace"><ul class="IPO_Liste">');
						if (this.donnees.options) {
							this.donnees.options.parcourir((element) => {
								lHtml.push("<li>", element.getLibelle(), "</li>");
							});
						}
						lHtml.push("</ul></div>");
						if (this.donnees.commentaire) {
							lHtml.push(
								'  <div class="Espace IPO_Bloc100">',
								this.donnees.commentaire,
								"</div>",
							);
						}
						lHtml.push("</div>");
					}
				}
			}
			lHtml.push("</div>");
			return lHtml.join("");
		}
	}
	composeOrientationConsultation() {
		const lHtml = [];
		if (!this.estEditable()) {
			return "";
		}
		const lAvecDeuxBloc =
			this.maquette.nombreOptions > 0 || this.maquette.avecCommentaireFamille;
		lHtml.push(
			'<div class="IPO_Voeux flex-contain  IPO_Fond ',
			lAvecDeuxBloc ? "IPO_Bloc65" : "IPO_Bloc50",
			'">',
		);
		const lClassRang = this.donnees.avis
			? " TypeAvis_" + this.donnees.avis.getGenre()
			: "";
		lHtml.push(
			'<div style="min-width: 20px; max-width: 20px;" class="flex-contain  AvisRang',
			lClassRang,
			'"><div class="IPO_NumeroVoeux" >',
			this.donnees.rang,
			"</div></div>",
		);
		lHtml.push('<div class="Espace IPO_Avis IPO_Bloc50">');
		if (
			this.donnees.avis &&
			this.donnees.avis.getGenre() !== TypeAvisConseil.taco_Aucun
		) {
			lHtml.push(
				"<div>",
				'<span class="Gras Bloc_TypeAvisConseil ',
				lClassRang,
				'">',
				this.donnees.avis.getLibelle(),
				"</span>",
				"</div>",
			);
			lHtml.push(
				'<div class="EspaceHaut">',
				this.donnees.avis.motivation,
				"</div>",
			);
			if (this.donnees.orientation.avecStageConseil) {
				lHtml.push(
					'<div class="Espace GrandEspaceGauche Italique">',
					GTraductions.getValeur(
						"Orientation.Ressources.StagePasserellePropose",
					),
					"</div>",
				);
			}
		}
		lHtml.push("</div>");
		lHtml.push(
			'<div class="Espace ',
			lAvecDeuxBloc ? "IPO_Bloc50" : "IPO_Bloc100",
			'">',
		);
		lHtml.push(
			'<div class="Espace Gras">',
			this.donnees.orientation.getLibelle(),
			"</div>",
		);
		if (this.donnees.orientation.avecStageFamille) {
			lHtml.push(
				'<div class="Espace GrandEspaceGauche Italique">',
				GTraductions.getValeur("Orientation.Ressources.DemandeStagePasserelle"),
				"</div>",
			);
		} else {
			lHtml.push(
				'<div class="Espace Gras"><ul class="IPO_Liste GrandEspaceGauche">',
			);
			if (this.donnees.specialites) {
				this.donnees.specialites.parcourir((element) => {
					lHtml.push("<li>", element.getLibelle(), "</li>");
				});
			}
			lHtml.push("</ul></div>");
		}
		lHtml.push("</div>");
		if (lAvecDeuxBloc) {
			lHtml.push('<div class="IPO_Divider"></div>');
			lHtml.push('<div class="Espace Gras IPO_Bloc50">');
			lHtml.push('  <div class="Espace"><ul class="IPO_Liste">');
			if (this.donnees.options) {
				this.donnees.options.parcourir((element) => {
					lHtml.push("<li>", element.getLibelle(), "</li>");
				});
			}
			lHtml.push("  </ul></div>");
			lHtml.push(
				'  <div class="Espace IPO_Bloc65">',
				this.donnees.commentaire,
				"</div>",
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeOrientationSaisie() {
		const lHtml = [];
		const lAvecDeuxBloc =
			this.maquette.nombreOptions > 0 || this.maquette.avecCommentaireFamille;
		const phOrientation = GTraductions.getValeur(
			"Orientation.ClicChoixOrientation",
		);
		const phOptions = GTraductions.getValeur(
			"Orientation.Options.ClicChoixOption",
		);
		lHtml.push(
			'<div style="overflow:auto" class="IPO_Voeux flex-contain  ',
			lAvecDeuxBloc ? "IPO_Bloc65" : "IPO_Bloc50",
			'">',
		);
		lHtml.push('<div class="flex-contain cols IPO_BordDroit IPO_Fond">');
		lHtml.push('  <div class="IPO_NumeroVoeux Gras" ie-html="getRang"></div>');
		lHtml.push(
			'  <div ie-display="btnSupprimerVoeux.getDisplay">',
			UtilitaireBoutonBandeau.getHtmlBtnSupprimer("btnSupprimerVoeux"),
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push(
			'<div class="Espace ',
			lAvecDeuxBloc ? "IPO_Bloc50" : "IPO_Bloc100",
			'">',
		);
		lHtml.push('  <div class="EspaceGauche EspaceBas flex-contain f-wrap">');
		lHtml.push(
			'    <label class="fix-bloc">',
			GTraductions.getValeur("Orientation.Orientation"),
			"</label>",
		);
		lHtml.push(
			'    <div id="' +
				this.idOrientation +
				'" ie-class="orientation.getClass" ie-node="orientation.node" class="IPO_InputLike WithPlaceHolder fluid-bloc" ie-html="orientation.getVignette" data-placeholder="',
			phOrientation,
			'"></div>',
		);
		lHtml.push("  </div>");
		lHtml.push(this.composeSpecialites());
		lHtml.push(
			"<div>",
			'<ie-checkbox ie-model="stagePasserelle" class="EspaceGauche" ie-display="stagePasserelle.getDisplay">',
			GTraductions.getValeur("Orientation.Ressources.DemandeStagePasserelle"),
			"</ie-checkbox>",
			"</div>",
		);
		lHtml.push("  </div>");
		if (lAvecDeuxBloc) {
			lHtml.push(
				'<div class="IPO_Divider" style="padding-left: 1px; margin-left: 3px;"></div>',
			);
			lHtml.push('<div class="Espace IPO_Bloc50 flex-contain cols">');
			if (this.maquette.nombreOptions > 0) {
				lHtml.push('  <div class="Espace flex-contain f-wrap">');
				lHtml.push(
					'    <label class="fix-bloc">',
					GTraductions.getValeur("Orientation.Option"),
					"</label>",
				);
				lHtml.push(
					'    <div id="',
					this.idOption,
					'" class="flex-contain cols IPO_InputLike WithPlaceHolder fluid-bloc" ie-node="option.node" ie-class="option.getClass" ie-html="option.getVignette" data-placeholder="',
					phOptions,
					'"></div>',
				);
				lHtml.push(
					'    <div class="Espace"><ie-bouton class="small-bt" ie-model="option" ie-display="option.getDisplay">',
					GTraductions.getValeur("Orientation.Options.Ajouter"),
					"</ie-bouton></div>",
				);
				lHtml.push("  </div>");
			}
			if (this.maquette.avecCommentaireFamille) {
				const lIdTextareaCommentaire = GUID.getId();
				lHtml.push('  <div class="Espace flex-contain cols" style="flex:1;">');
				lHtml.push(
					'    <label for="',
					lIdTextareaCommentaire,
					'"> ',
					GTraductions.getValeur("Orientation.Ressources.Commentaire"),
					"</label>",
				);
				lHtml.push(
					'    <ie-textareamax id="',
					lIdTextareaCommentaire,
					'" ie-model="commentaire" class="IPO_TextArea" maxlength="255" ></ie-textareamax>',
				);
				lHtml.push("  </div>");
			}
		}
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeSpecialites() {
		if (this.maquette.nombreSpecialites === 0) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div ie-display="specialite.getDisplay" >');
		lHtml.push(
			'  <div class="Espace">',
			GTraductions.getValeur("Orientation.SpecialitesOrdre"),
			"</div>",
		);
		lHtml.push('  <div class="flex-contain cols IPO_Specialite">');
		for (let I = 0; I < this.maquette.nombreSpecialites; I++) {
			lHtml.push('<div class="flex-contain IPO_RowSpecialite">');
			lHtml.push(
				'<div class="IPO_NumSpecialite"><span>',
				I + 1,
				"</span></div>",
			);
			lHtml.push(
				'<div id="',
				this.idSpecialite,
				"_",
				I,
				'" ie-node="specialite.node(',
				I,
				')" ie-class="specialite.getClass(',
				I,
				')" ie-html="specialite.getVignette(',
				I,
				')" ></div>',
			);
			lHtml.push("</div>");
		}
		lHtml.push("  </div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	surEvent(aEvent, aIndex) {
		const lParam = {
			genreEvent: aEvent,
			orientation: this.donnees.orientation,
			index: aIndex,
		};
		this.callback.appel(this, lParam);
	}
	actualiser(aActualiserInterface) {
		this.$refreshSelf();
		if (aActualiserInterface) {
			this.surEvent(EGenreEvnt.actualiser, this.donnees.rang);
		}
	}
	setEditable(aEditable) {
		this.editable = aEditable;
		this.actualiser(true);
	}
}
module.exports = { ObjetOrientation };

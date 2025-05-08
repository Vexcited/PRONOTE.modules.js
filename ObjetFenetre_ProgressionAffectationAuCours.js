exports.ObjetFenetre_ProgressionAffectationAuCours = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementTreeView_1 = require("Enumere_EvenementTreeView");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTreeView_1 = require("ObjetTreeView");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDonneesTreeViewProgression_1 = require("ObjetDonneesTreeViewProgression");
const ObjetDonneesTreeViewProgression_2 = require("ObjetDonneesTreeViewProgression");
class ObjetFenetre_ProgressionAffectationAuCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idLegende = this.Nom + "_L";
		this.indexBtnValider = 1;
		this.parametres = {
			listeProgressions: null,
			strPublics: "",
			strMatiere: "",
			JoursPresenceCours: null,
			dateTAFMin: null,
			dateTAF: null,
			avecTAFVisible: false,
			avecElementsAssoc: false,
			avecContenu: true,
			avecTAF: true,
		};
	}
	construireInstances() {
		this.identTreeView = this.add(
			ObjetTreeView_1.ObjetTreeView,
			this._evenementSurTreeView,
			this._initialiserTreeView,
		);
		this.identDateTAF = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			(aDate) => {
				this.parametres.dateTAF = aDate;
			},
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioCompositionTitre: {
				getValue: function (aTypeComposition) {
					return (
						ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression ===
						aTypeComposition
					);
				},
				setValue: function (aTypeComposition) {
					ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression =
						aTypeComposition;
				},
			},
			cb: {
				getValue: function (aNomChamp) {
					return aInstance.parametres[aNomChamp];
				},
				setValue: function (aNomChamp, aValue) {
					aInstance.parametres[aNomChamp] = aValue;
					aInstance._evenementSurCheckBox();
				},
			},
			avecTAF: function () {
				return aInstance.parametres.avecTAFVisible;
			},
			getStyleFieldContenu: function () {
				return { width: aInstance.parametres.avecTAFVisible ? 250 : 500 };
			},
		});
	}
	_initialiserTreeView(aInstance) {
		aInstance.setParametres();
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push('<div class="NoWrap">');
		lHtml.push(
			'<div class="InlineBlock AlignementHaut">',
			'<fieldset class="Espace AlignementGauche BorderBox" ie-style="getStyleFieldContenu" style="height:85px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
			'">',
			"<legend>",
			ObjetTraduction_1.GTraductions.getValeur("progression.Contenu") +
				" - " +
				ObjetTraduction_1.GTraductions.getValeur(
					"progression.MsgOptionsTitreElement",
				),
			"</legend>",
			"<div>",
			'<div class="EspaceBas">',
			'<ie-radio ie-model="radioCompositionTitre(',
			ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression
				.genreTitreContenu.Titre,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("progression.OptionTitre"),
			"</ie-radio>",
			"</div>",
			'<div class="EspaceBas">',
			'<ie-radio ie-model="radioCompositionTitre(',
			ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression
				.genreTitreContenu.SsDossierTitre,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.OptionSousDossierTitre",
			),
			"</ie-radio>",
			"</div>",
			"<div>",
			'<ie-radio ie-model="radioCompositionTitre(',
			ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression
				.genreTitreContenu.DossierSsDossierTitre,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.OptionDossierSousDossierTitre",
			),
			"</ie-radio>",
			"</div>",
			"</div>",
			"</fieldset></div>",
		);
		lHtml.push(
			'<div ie-display="avecTAF" class="InlineBlock AlignementHaut">',
			'<fieldset class="Espace AlignementGauche BorderBox NoWrap" style="width:250px; height:85px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
			'">',
			"<legend>",
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.TravailAFaire") +
				" :",
			"</legend>",
			'<div style="padding-top:12px; padding-left:20px;">',
			'<div class="InlineBlock AlignementMilieuVertical EspaceDroit">',
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.PourLe"),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical" id="',
			this.getNomInstance(this.identDateTAF),
			'"></div>',
			"</div>",
			"</fieldset>",
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push(
			'<div class="PetitEspaceHaut">',
			'<div class="PetitEspaceBas"><ie-checkbox',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "cb", ["avecElementsAssoc"]),
			">",
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.ElementsNonAssocies",
			),
			"</ie-checkbox></div>",
			'<div class="PetitEspaceBas" ie-display="avecTAF"><ie-checkbox',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "cb", ["avecContenu"]),
			">",
			ObjetTraduction_1.GTraductions.getValeur("progression.AfficherContenus"),
			"</ie-checkbox></div>",
			'<div class="PetitEspaceBas" ie-display="avecTAF"><ie-checkbox',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "cb", ["avecTAF"]),
			">",
			ObjetTraduction_1.GTraductions.getValeur("progression.AfficherTAFs"),
			"</ie-checkbox></div>",
			"</div>",
		);
		lHtml.push(
			'<div id="',
			this.getNomInstance(this.identTreeView),
			'" style="width:500px; height:300px;"></div>',
		);
		lHtml.push(
			'<div class="PetitEspaceHaut"><span id="',
			this.idLegende,
			'" class="Italique">',
			"</span></div>",
		);
		return lHtml.join("");
	}
	setDonnees(aParams) {
		Object.assign(this.parametres, aParams);
		this.setBoutonActif(this.indexBtnValider, false);
		const lTitre =
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.SelectionnerDonnees",
			) +
			" " +
			(this.parametres.strPublics ? this.parametres.strPublics : "") +
			(this.parametres.strMatiere ? " - " + this.parametres.strMatiere : "");
		this.setOptionsFenetre({ titre: lTitre });
		const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
			"progression.AideDejaAffecteCDTACours",
		);
		ObjetHtml_1.GHtml.setHtml(this.idLegende, lLibelle);
		const lInstanceDate = this.getInstance(this.identDateTAF);
		lInstanceDate.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			false,
			this.parametres.JoursPresenceCours,
		);
		lInstanceDate.setPremiereDateSaisissable(this.parametres.dateTAFMin, true);
		lInstanceDate.setDonnees(this.parametres.dateTAF);
		this.afficher();
		this._actualiserTreeView();
		this.controleur.$refreshSelf(true);
		this.surFixerTaille();
	}
	_actualiserTreeView() {
		this.setBoutonActif(this.indexBtnValider, false);
		const lObjetDonneesTreeView =
			new ObjetDonneesTreeViewProgression_2.ObjetDonneesTreeViewProgressionSelection(
				this.parametres.listeProgressions,
				this.parametres.avecElementsAssoc,
				this.parametres.avecContenu || !this.parametres.avecTAFVisible,
				this.parametres.avecTAF && this.parametres.avecTAFVisible,
			);
		this.getInstance(this.identTreeView).setDonnees(lObjetDonneesTreeView);
	}
	_leContenuEstDejaAffecte(aContenu) {
		if (aContenu && aContenu.listeAffectes) {
			for (let j = 0; j < aContenu.listeAffectes.count(); j++) {
				if (aContenu.listeAffectes.get(j).affecteCours) {
					return true;
				}
			}
		}
		return false;
	}
	_unContenuDeNodeEstDejaAffecte(aNodesContenu) {
		if (aNodesContenu) {
			for (let i = 0; i < aNodesContenu.length; i++) {
				if (
					aNodesContenu[i] &&
					this._leContenuEstDejaAffecte(aNodesContenu[i].contenu)
				) {
					return true;
				}
			}
		}
		return false;
	}
	surValidation(ANumeroBouton) {
		const lNodesSelections = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		if (ANumeroBouton === 1) {
			if (this._unContenuDeNodeEstDejaAffecte(lNodesSelections)) {
				const lThis = this;
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"progression.MsgDejaAffectesCDT",
					),
					callback: function (aGenreAction) {
						lThis._apresConfirmation(ANumeroBouton, true, aGenreAction);
					},
				});
			} else {
				this._apresConfirmation(ANumeroBouton, true);
			}
		} else {
			this._apresConfirmation(ANumeroBouton, true);
		}
	}
	_apresConfirmation(
		aNumeroBouton,
		aDeselectionCoursDejaAffectes,
		aBoutonMessage,
	) {
		const lNodesSelection = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		if (aBoutonMessage !== 1) {
			this._finValidation(aNumeroBouton, lNodesSelection);
		} else {
			if (aDeselectionCoursDejaAffectes) {
				const lNouvelleSelection = [];
				if (lNodesSelection) {
					for (let i = 0; i < lNodesSelection.length; i++) {
						if (lNodesSelection[i] && lNodesSelection[i].contenu) {
							if (!this._leContenuEstDejaAffecte(lNodesSelection[i].contenu)) {
								lNouvelleSelection.push(lNodesSelection[i]);
							}
						}
					}
				}
				if (lNouvelleSelection.length > 0) {
					this._finValidation(aNumeroBouton, lNouvelleSelection);
				} else {
					this.setBoutonActif(
						this.indexBtnValider,
						lNouvelleSelection && lNouvelleSelection.length > 0,
					);
					this.getInstance(this.identTreeView).setSelectionParContenuDeNode(
						lNouvelleSelection,
					);
				}
			}
		}
	}
	_finValidation(aNumeroBouton, aNodesSelection) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this._getSelection(aNodesSelection));
	}
	_evenementSurTreeView(aGenreEvenement, aNode) {
		switch (aGenreEvenement) {
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection: {
				const lSelection = this.getInstance(
					this.identTreeView,
				).getNodeSelection();
				this.setBoutonActif(
					this.indexBtnValider,
					Array.isArray(lSelection) ? lSelection.length > 0 : !!lSelection,
				);
				break;
			}
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView
				.selectionDblClick:
				if (
					aNode &&
					aNode.contenu &&
					(aNode.contenu.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ContenuDeCours ||
						aNode.contenu.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.TravailAFaire)
				) {
					this.surValidation(1);
				}
				break;
		}
	}
	_remplirChampsElement(aNode) {
		switch (aNode.contenu.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
				aNode.contenu.PourLe = this.parametres.dateTAF;
				break;
			case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
				aNode.contenu.Libelle =
					ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
						aNode,
						ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression,
					);
				break;
		}
		return aNode.contenu;
	}
	_getSelection(aNodesSelection) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (aNodesSelection) {
			if (MethodesObjet_1.MethodesObjet.isArray(aNodesSelection)) {
				for (let i = 0; i < aNodesSelection.length; i++) {
					lListe.addElement(this._remplirChampsElement(aNodesSelection[i]));
				}
			} else {
				lListe.addElement(this._remplirChampsElement(aNodesSelection));
			}
		}
		return lListe;
	}
	_evenementSurCheckBox() {
		const lAncienneSelection = this.getInstance(
			this.identTreeView,
		).getNodeSelection();
		this._actualiserTreeView();
		this.getInstance(this.identTreeView).setSelectionParContenuDeNode(
			lAncienneSelection,
		);
	}
}
exports.ObjetFenetre_ProgressionAffectationAuCours =
	ObjetFenetre_ProgressionAffectationAuCours;
ObjetFenetre_ProgressionAffectationAuCours.indiceChoixTitreProgression =
	ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.genreTitreContenu.Titre;

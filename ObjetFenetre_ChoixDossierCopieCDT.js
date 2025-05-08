exports.ObjetFenetre_ChoixDossierCopieCDT = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTreeView_1 = require("ObjetTreeView");
const Enumere_EvenementTreeView_1 = require("Enumere_EvenementTreeView");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDonneesTreeViewProgression_1 = require("ObjetDonneesTreeViewProgression");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequeteSaisieCopieCDTSurDossier_1 = require("ObjetRequeteSaisieCopieCDTSurDossier");
class ObjetFenetre_ChoixDossierCopieCDT extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = this.Nom + "_Msg";
		this.indexBtnAjouter = 1;
		this.setOptionsFenetre({
			avecRetaillage: true,
			largeur: 500,
			hauteur: 500,
			largeurMin: 400,
			hauteurMin: 200,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.Ajouter"),
			],
		});
		this.donnees = {
			cahier: null,
			listeProgressions: null,
			progressionSelectionnee: null,
			dossierProgressionSelection: null,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAvecTAF: {
				getValue() {
					return ObjetFenetre_ChoixDossierCopieCDT.inclureTAF;
				},
				setValue(aValue) {
					ObjetFenetre_ChoixDossierCopieCDT.inclureTAF = aValue;
				},
			},
		});
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementComboProgression.bind(this),
			this._initialiserComboProgression,
		);
		this.identTreeView = this.add(
			ObjetTreeView_1.ObjetTreeView,
			this._evenementSurTreeView.bind(this),
			this._initialiserTreeView,
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push('<div class="full-height flex-contain cols">');
		lHtml.push(
			'<div id="',
			this.idMessage,
			'" class="EspaceBas" style="display:none"></div>',
		);
		lHtml.push(
			'<div class="Texte10 PetitEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ChoixProgression",
			),
			"</div>",
		);
		lHtml.push(
			'<div class="PetitEspaceBas" id="',
			this.getNomInstance(this.identCombo),
			'"></div>',
		);
		lHtml.push(
			'<div class="Texte10 PetitEspaceBas EspaceHaut">',
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ChoixDossier"),
			"</div>",
		);
		lHtml.push(
			'<div id="',
			this.getNomInstance(this.identTreeView),
			'" class="fluid-bloc"></div>',
		);
		lHtml.push(
			'<div class="EspaceHaut">',
			'<ie-checkbox ie-model="cbAvecTAF">',
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.InclureLesTAFs"),
			"</ie-checkbox>",
			"</div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	afficherChoixDossierCopieCDT(aCours, aCahierDeTexte) {
		this.donnees.cahier = aCahierDeTexte;
		this.setBoutonActif(this.indexBtnAjouter, false);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.AjouterElementsCDT",
			),
		});
		this.afficher();
		this._actualiserTreeView();
		new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
			this,
			this._surReponseRequeteListeCDTProgression.bind(this),
		).lancerRequete({
			avecListeProgrammesNiveaux: false,
			Cours: aCours,
			avecProgressionDefautDuCours: true,
			avecListeCategorieEtDocJoints: false,
		});
	}
	async surValidation(ANumeroBouton, aPlus) {
		if (ANumeroBouton === this.indexBtnAjouter && aPlus !== "saisieReussite") {
			await new ObjetRequeteSaisieCopieCDTSurDossier_1.ObjetRequeteSaisieCopieCDTSurDossier(
				this,
			).lancerRequete({
				cahier: this.donnees.cahier,
				dossier: this.donnees.dossierProgressionSelection,
				inclureTAF: ObjetFenetre_ChoixDossierCopieCDT.inclureTAF,
			});
			this.surValidation(this.indexBtnAjouter, "saisieReussite");
		} else {
			super.surValidation(-1);
		}
	}
	debutRetaillage() {
		super.debutRetaillage();
		ObjetStyle_1.GStyle.setVisible(
			this.getInstance(this.identTreeView).getNom(),
			false,
		);
		this.getInstance(this.identTreeView)._surResize(true);
	}
	finRetaillage() {
		super.finRetaillage();
		ObjetStyle_1.GStyle.setVisible(
			this.getInstance(this.identTreeView).getNom(),
			true,
		);
		this.getInstance(this.identTreeView)._surResize(false);
	}
	_initialiserComboProgression(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 200,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ChoixProgression",
			),
		});
	}
	_initialiserTreeView(aInstance) {
		aInstance.setParametres();
	}
	_surReponseRequeteListeCDTProgression(
		aListeProgressions,
		aListeNiveaux,
		aListeCategories,
		aListeDocumentsJoints,
		aListeProgressionsPublicPourCopie,
		aProgressionDefault,
	) {
		this.donnees.listeProgressions = aListeProgressions;
		let lIndice = 0;
		if (aProgressionDefault) {
			if (aProgressionDefault.progression) {
				lIndice = aListeProgressions.getIndiceParElement(
					aProgressionDefault.progression,
				);
			}
			if (aProgressionDefault.message) {
				ObjetHtml_1.GHtml.setHtml(
					this.idMessage,
					'<div class="Image_Dll_Attention InlineBlock AlignementMilieuVertical"></div>' +
						'<div class="Texte10 InlineBlock AlignementMilieuVertical PetitEspaceGauche">' +
						aProgressionDefault.message +
						"</div>",
				);
				ObjetHtml_1.GHtml.setDisplay(this.idMessage, true);
			}
		}
		this.getInstance(this.identCombo).setDonnees(
			this.donnees.listeProgressions,
			lIndice,
		);
	}
	_actualiserTreeView() {
		this.setBoutonActif(this.indexBtnAjouter, false);
		let lListeDossiers = new ObjetListeElements_1.ObjetListeElements();
		if (
			this.donnees.progressionSelectionnee &&
			this.donnees.progressionSelectionnee.listeDossiers
		) {
			lListeDossiers = this.donnees.progressionSelectionnee.listeDossiers;
		}
		this.getInstance(this.identTreeView).setDonnees(
			new ObjetDonneesTreeView_ProgressionSelectionDossier(lListeDossiers),
		);
	}
	_evenementComboProgression(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.donnees.progressionSelectionnee = aParams.element;
			this._actualiserTreeView();
		}
	}
	_evenementSurTreeView(aGenreEvenement, aNode) {
		switch (aGenreEvenement) {
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
				this.donnees.dossierProgressionSelection = null;
				if (
					aNode &&
					aNode.contenu &&
					aNode.contenu.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.DossierProgression
				) {
					this.donnees.dossierProgressionSelection = aNode.contenu;
					this.setBoutonActif(this.indexBtnAjouter, !!aNode);
				}
				break;
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView
				.selectionDblClick:
				this.donnees.dossierProgressionSelection = null;
				if (
					aNode &&
					aNode.contenu &&
					aNode.contenu.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.DossierProgression
				) {
					this.donnees.dossierProgressionSelection = aNode.contenu;
					this.surValidation(this.indexBtnAjouter);
				}
				break;
		}
	}
}
exports.ObjetFenetre_ChoixDossierCopieCDT = ObjetFenetre_ChoixDossierCopieCDT;
ObjetFenetre_ChoixDossierCopieCDT.inclureTAF = true;
class ObjetDonneesTreeView_ProgressionSelectionDossier extends ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression {
	constructor(...aParams) {
		super(...aParams);
		this.avecContenu = true;
		this.avecTAF = true;
	}
	getVisible() {
		return true;
	}
	getSelection(aNode) {
		if (aNode) {
			switch (aNode.contenu.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.DossierProgression:
					return aNode;
				default:
					return aNode.pere;
			}
		}
		return null;
	}
	avecEdition() {
		return false;
	}
	avecEvenementDeGenre(aGenreEvenement) {
		switch (aGenreEvenement) {
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection:
				return true;
			default:
				return false;
		}
	}
}
